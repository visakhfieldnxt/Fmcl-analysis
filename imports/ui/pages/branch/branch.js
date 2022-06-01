/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Branch } from "../../../api/branch/branch";
import XLSX from 'xlsx';

Template.branch.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.branchNameArray = new ReactiveVar();
  this.cardCodeList = new ReactiveVar();
  this.wareHouseList = new ReactiveVar();
  this.supplierList = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.branchDetailCardCode = new ReactiveVar();
  this.branchDetailSupplierCode = new ReactiveVar();
  this.branchDetailWareHouse = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Branch, {
    filters: {
      disabled: "N"
    },
    sort: { createdAt: -1 },
    perPage: 20
  });
  this.cardCodeList.set('');
  this.wareHouseList.set('');
  this.supplierList.set('');
});

Template.branch.onRendered(function () {
  /**
 * active and inactive list based on nav bar
 */
  $('.taskHeaderList').css('display', 'inline');
  var header = document.getElementById("taskHeader");
  if (header) {
    var btns = header.getElementsByClassName("paginationFilterValue");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("activeHeaders");
        current[0].className = current[0].className.replace(" activeHeaders", "");
        this.className += " activeHeaders";
      });
    }
  }
  /**
    * TODO: Complete JS doc
    */
  Meteor.call('branch.branchList', (branchError, branchResult) => {
    if (!branchError) {
      this.branchNameArray.set(branchResult);
    }
  });
  /**
     * TODO:Complete Js doc
     * Getting user branch list
     */
  Meteor.call('customer.cardCodeGet', (err, res) => {
    if (!err) {
      this.cardCodeList.set(res);
    }
  });
  /**
     * TODO:Complete Js doc
     * Getting user branch list
     */
  Meteor.call('wareHouse.nameList', (err, res) => {
    if (!err) {
      this.wareHouseList.set(res);
    }
  });
  /**
   * TODO:Complete Js doc
   * Getting user branch list
   */
  Meteor.call('customer.supplierCodeGet', (err, res) => {
    if (!err) {
      this.supplierList.set(res);
    }
  });


  $('.selectCustomerEditS').select2({
    placeholder: "Select Customer",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomerEditS").parent(),
  });
  $('.selectSupplierEditS').select2({
    placeholder: "Select Vendor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSupplierEditS").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.wareHouseSelectionEdits').select2({
    placeholder: "Select Warehouse",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".wareHouseSelectionEdits").parent(),
  });

  /**
   * TODO: Complete JS doc
   */
  $('.branchNameSelection').select2({
    placeholder: "Select Branch Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchNameSelection").parent(),
  });

  /**
   * TODO: Complete JS doc
   */
  $('.branchCodeSelection').select2({
    placeholder: "Select Branch Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchCodeSelection").parent(),
  });

});

Template.branch.helpers({
  /**
               * TODO: Complete JS doc
               * @returns {any | *}
               */
  labelName: function () {
    let name = Template.instance().fileName.get();
    if (name !== undefined) {
      return name;
    }
    else {
      return false;
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('branchs');
  },
  /**
  * TODO:Complete JS doc
  * 
  */
  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('branchs');
    config.textarea = true;

    return config;
  },

  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  /**
     * TODO: Complete JS doc
     * @returns {Function}
     */
  handlePagination: function () {
    return function (e, templateInstance, clickedPage) {
      e.preventDefault();
      console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
    };
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  branchList: function () {
    return Template.instance().pagination.getPage();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  branchLists: function () {

    return Template.instance().branchNameArray.get();
  },
  /**
     * TODO: Complete JS doc
     * @returns {*}
     */
  activeHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "N") {
      return true;
    }
    else {
      return false
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  inactiveHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "Y") {
      return true;
    }
    else {
      return false
    }
  },
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },
  /**
   * TODO:COmplete Js doc
   * Getting specific customers base on branch
   */
  customersList: function () {
    let branchVal = Template.instance().branchDetailCardCode.get();
    if (branchVal) {
      Meteor.setTimeout(function () {
        if (branchVal) {
          $('#selectCustomerEditS').val(branchVal).trigger('change');
        }
      }, 200);
    }
    return Template.instance().cardCodeList.get();

  },
  /**
  * TODO:COmplete Js doc
  * Getting specific customers base on branch
  */
  suppliersList: function () {
    let branchVal = Template.instance().branchDetailSupplierCode.get();
    if (branchVal) {
      Meteor.setTimeout(function () {
        if (branchVal) {
          $('#selectSupplierEditS').val(branchVal).trigger('change');
        }
      }, 200);
    }
    return Template.instance().supplierList.get();
  },
  /**
  * TODO: Complete JS doc
  * @returns {rolelist}
  */
  wareHouseLists: function () {
    let branchVal = Template.instance().branchDetailWareHouse.get();
    if (branchVal) {
      Meteor.setTimeout(function () {
        if (branchVal) {
          $('#wareHouseSelectionEdits').val(branchVal).trigger('change');
        }
      }, 200);
    }
    return Template.instance().wareHouseList.get();
  },

});

Template.branch.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .branchFilter': (event) => {
    event.preventDefault();
    let branchCode = event.target.branchCodeSelection.value;
    let branchName = event.target.branchNameSelection.value;

    if (branchCode && branchName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          bPLId: branchCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (branchName && branchCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          bPLName: branchName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (branchCode && branchName) {
      Template.instance().pagination.settings.set('filters',
        {
          bPLId: branchCode,
          bPLName: branchName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      disabled: "N"
    });
    $('form :input').val("");
    $("#branchCodeSelection").val('').trigger('change');
    $("#branchNameSelection").val('').trigger('change');
    $('.taskHeaderList').css('display', 'inline');

    let element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    let elements = document.getElementById("activeFilter");
    elements.classList.add("active");
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-branch-button': () => {
    $("#ic-create-branch").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#branchHeader');
    let branchName = $('#confbranchName');
    let branchNameDup = $('#branchNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#branchDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let branchname = $('#bPLName_' + _id).val();
    $(header).html('Confirm Deletion Of ' + $.trim(branchname));
    $(branchName).html(branchname);
    $(branchNameDup).html(branchname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #branchRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('branch.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#branchSuccessModal').modal();
          $('#branchSuccessModal').find('.modal-body').text('Branch inactivated successfully');
        }
        $("#branchDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#branchHeaders');
    let branchName = $('#confbranchNames');
    let branchNameDup = $('#branchNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#branchActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let branchname = $('#bPLName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(branchname));
    $(branchName).html(branchname);
    $(branchNameDup).html(branchname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #branchActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('branch.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#branchSuccessModal').modal();
          $('#branchSuccessModal').find('.modal-body').text('Branch activated successfully');
        }
        $("#branchActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#branchEditPage').modal();
    template.modalLoader.set(true);
    let _id = event.currentTarget.attributes.id.value;
    template.branchDetailCardCode.set('');
    template.branchDetailSupplierCode.set('');
    template.branchDetailWareHouse.set('');
    $('#wareHouseSelectionEdits').val('').trigger('change');
    $('#selectSupplierEditS').val('').trigger('change');
    $('#selectCustomerEditS').val('').trigger('change');
    Meteor.call('branch.branch_id', _id, (err, res) => {
      let branchDetail = res;
      let header = $('#categoryH'); 
      $('div.hint').hide();
      template.modalLoader.set(false);
      let branchDetailId = _id;
      let branchDetailBranchName = branchDetail.bPLName;
      let branchDetailbranchCode = branchDetail.bPLId;
      let branchDetailPaymentClearAct = branchDetail.pmtClrAct;
      let branchDetailAddress = branchDetail.address;
      let branchDetailStreet = branchDetail.streetNo;
      let branchDetailCardCode = branchDetail.dflCust;
      let branchDetailSupplierCode = branchDetail.dflVendor;
      let branchDetailWareHouse = branchDetail.dflWhs;
      template.branchDetailCardCode.set(branchDetailCardCode);
      template.branchDetailSupplierCode.set(branchDetailSupplierCode);
      template.branchDetailWareHouse.set(branchDetailWareHouse);
      $(".id").val(branchDetailId);
      $("#branchNameEdits").val(branchDetailBranchName);
      $("#branchCodeEdits").val(branchDetailbranchCode);
      $("#paymentClearActEdits").val(branchDetailPaymentClearAct);
      $("#addressEdits").val(branchDetailAddress);
      $("#streetEdits").val(branchDetailStreet); 
      $(header).html('Update Branch');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatebranch': (event) => {
    event.preventDefault();

    let customerCode = '';
    let supplierCode = '';
    let wareHouse = '';

    $('#selectCustomerEditS').find(':selected').each(function () {
      customerCode = $(this).val();
    });
    $('#selectSupplierEditS').find(':selected').each(function () {
      supplierCode = $(this).val();
    });
    $('#wareHouseSelectionEdits').find(':selected').each(function () {
      wareHouse = $(this).val();
    });

    updatebranchlist(event.target, customerCode, supplierCode, wareHouse);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatebranch").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#wareHouseSelectionEdits').val('').trigger('change');
    $('#selectSupplierEditS').val('').trigger('change');
    $('#selectCustomerEditS').val('').trigger('change');

  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#branchH');
    let branchName = $('#detailBranchName');
    let branchCode = $('#detailBranchCode');
    let address = $('#detailAddress');
    let street = $('#detailStreet');
    let wareHouse = $('#detailDefaultWarehouse');
    let customerCode = $('#detailDefaultCustomerCode');
    let supplierCode = $('#detailDefaultSupplierCode');
    let paymentClearAct = $('#detailPaymentClearAct');
    let status = $('#detailStatus');
    $('#branchDetailPage').modal();
    Meteor.call('branch.branchDetailsGet', id, (branchError, branchResult) => {
      if (!branchError) {
        template.modalLoader.set(false);
        let branch = branchResult.branchRes;
        $(header).html('Details of ' + $.trim(branch.bPLName));
        if (branch.disabled === "N") {
          $(status).html("Active");
        }
        else if (branch.disabled === "Y") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(branchName).html(branch.bPLName);
        $(branchCode).html(branch.bPLId);
        $(address).html(branch.address);
        $(street).html(branch.streetNo);
        $(wareHouse).html(branchResult.whsName);
        $(customerCode).html(branchResult.dflCustName);
        $(supplierCode).html(branchResult.dflVenderName);
        $(paymentClearAct).html(branch.pmtClrAct);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  /**
           * TODO: Complete JS doc
           * @param event
           */
  'click #fileUploadbranch': (event, template) => {
    event.preventDefault();
    $("#uploadbranch").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#branchUploadHeader');
    $('#branchUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadbranch': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadbranchFile");
    let warehouseArray = Template.instance().wareHouseList.get();
    let customerArray = Template.instance().cardCodeList.get();
    let supplierList = Template.instance().supplierList.get();
    let myFile = $('.uploadbranchFile').prop('files')[0];
    let fileType = myFile["type"];
    console.log("fileType", fileType);
    if (myFile.type === 'application/vnd.ms-excel' || myFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      //Validate whether File is valid Excel file.
      // let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
      // if (regex.test(fileUpload.value.toLowerCase())) {
      if (fileUpload !== null && fileUpload !== '' && fileUpload !== undefined) {
        if (typeof (FileReader) != "undefined") {
          let reader = new FileReader();
          //For Browsers other than IE.
          if (reader.readAsBinaryString) {
            reader.onload = function (e) {
              processExcel(e.target.result);
            };
            reader.readAsBinaryString(fileUpload.files[0]);
          } else {
            //For IE Browser.
            reader.onload = function (e) {
              let data = "";
              let bytes = new Uint8Array(e.target.result);
              for (let i = 0; i < bytes.byteLength; i++) {
                data += String.fromCharCode(bytes[i]);
              }
              processExcel(data);
            };
            reader.readAsArrayBuffer(fileUpload.files[0]);
          }
        }
        else {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#fileArrayspan").html('<style>#fileArrayspan {color :#fc5f5f }</style><span id="fileArrayspan">This browser does not support HTML5.</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#fileArrayspan').fadeOut('slow');
          }, 3000);
        }
      }
      else {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#fileArrayspan").html('<style>#fileArrayspan {color :#fc5f5f }</style><span id="fileArrayspan">A file needed</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#fileArrayspan').fadeOut('slow');
        }, 3000);
      }
    }
    else {
      $('#branchErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#branchErrorModal').modal();
      $('#branchUploadConfirmation').modal('hide');
      $("#uploadbranch")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let branchArray = [];
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      //Fetch the name of First Sheet.
      let firstSheet = workbook.SheetNames[0];
      //Read all rows from First Sheet into an JSON array.
      let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
      if (excelRows !== undefined && excelRows.length > 0) {
        //Add the data rows from Excel file.
        for (let i = 0; i < excelRows.length; i++) { 
          let bPLId = excelRows[i].BranchCode;
          let bPLName = excelRows[i].BranchName;
          let dflWhs = excelRows[i].DefaultWarehouse;
          let address = excelRows[i].Address;
          let pmtClrAct = excelRows[i].PaymentClearAct;
          let dflCust = excelRows[i].Customer;
          let dflVendor = excelRows[i].Supplier;
          let streetNo = excelRows[i].StreetNo;

          if (bPLId !== undefined && bPLId !== '' &&
            bPLName !== undefined && bPLName !== '' &&
            dflWhs !== undefined && dflWhs !== '' &&
            address !== undefined && address !== '' &&
            pmtClrAct !== undefined && pmtClrAct !== '' &&
            dflCust !== undefined && dflCust !== '' &&
            dflVendor !== undefined && dflVendor !== '' &&
            streetNo !== undefined && streetNo !== '') {
            // get warehouse code
            let whsCode = '';
            let wareHouseRes = warehouseArray.find(x => x.whsName === dflWhs)
            if (wareHouseRes) {
              whsCode = wareHouseRes.whsCode;
            }
            // get defult cust code
            let customerCodes = '';
            let custRes = customerArray.find(x => x.cardName === dflCust)
            if (custRes) {
              customerCodes = custRes.cardCode;
            }
            // get defult vendor code
            let supplierCodes = '';
            let supres = supplierList.find(x => x.cardName === dflVendor)
            if (supres) {
              supplierCodes = supres.cardCode;
            }
            if (whsCode !== '' && customerCodes !== '' && supplierCodes !== '') {
              branchArray.push({
                bPLId: bPLId.toString(), bPLName: bPLName, dflWhs: whsCode, address: address,
                pmtClrAct: pmtClrAct.toString(), dflCust: customerCodes, dflVendor: supplierCodes, streetNo: streetNo,
              });
            }
          }
        }
      }
      else {
        $('#branchErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#branchErrorModal').modal();
        $('#branchUploadConfirmation').modal('hide');
        $("#uploadbranch")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (branchArray.length !== 0 && branchArray !== undefined) {
        $('#branchUploadConfirmation').modal('hide');
        return Meteor.call('branch.createUpload', branchArray, (error, result) => {
          if (error) {
            $('#branchErrorModal').find('.modal-body').text(error.reason);
            $('#branchErrorModal').modal();
            $('#branchUploadConfirmation').modal('hide');
            $("#uploadbranch")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#branchUploadConfirmation').modal('hide');
            $("#uploadbranch")[0].reset();
            $('#branchSuccessModal').find('.modal-body').text(` Branch has been registered successfully (${branchArray.length} Nos)`);
            $('#branchSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#branchErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#branchErrorModal').modal();
        $('#branchUploadConfirmation').modal('hide');
        $("#uploadbranch")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #branchFileClose': (event, template) => {
    $("#uploadbranch").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadbranch': (event, template) => {
    event.preventDefault();
    let data = [{
      bPLId: '', bPLName: '', dflWhs: '', address: '',
      pmtClrAct: '', dflCust: '', dflVendor: '', streetNo: '',
    }];
    dataCSV = data.map(element => ({
      'BranchCode': '',
      'BranchName': '',
      'DefaultWarehouse': '',
      'Address': '',
      'PaymentClearAct': '',
      'Customer': '',
      'Supplier': '',
      'StreetNo': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "BranchFormat.xls");
  },
  'change .uploadbranchFile': function (event, template) {
    let func = this;
    let file = event.currentTarget.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      fileName = file.name,
        fileContent = reader.result,
        template.fileName.set(file.name);
    };
    reader.readAsDataURL(file);
  },

  /**
* TODO: Complete JS doc
* 
*/
  'click .activeFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      disabled: "N", 
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      disabled: "Y", 
    });
  },

});