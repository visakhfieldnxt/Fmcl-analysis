/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Brand } from "../../../api/brand/brand";
import XLSX from 'xlsx';

Template.brand.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.brandNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.principalListGet = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.principalEdits = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Brand, {
    filters: {
      active: "Y",
    },
    sort: { createdAt: -1 },
    fields: {
      brandCode: 1,
      brandName: 1,
      principal: 1,
      active: 1
    },
    perPage: 20
  });
});

Template.brand.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
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
    * for filter
    */
  Meteor.call('brand.brandList', (brandError, brandResult) => {
    if (!brandError) {
      this.brandNameArray.set(brandResult);
    }
  });
  /**
* get brand list 
* */
  Meteor.call('principal.principalActiveList', (err, res) => {
    if (!err) {
      this.principalListGet.set(res);
    }
  });
  /**
   * TODO: Complete JS doc
   */
  $('.brandNameSelection').select2({
    placeholder: "Select Brand Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".brandNameSelection").parent(),
  });
  /**
 * TODO: Complete JS doc
 */
  $('.selectPrincipalEdit').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrincipalEdit").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.brandCodeSelection').select2({
    placeholder: "Select Brand Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".brandCodeSelection").parent(),
  });

});

Template.brand.helpers({
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
    return globalOptionsHelper('brands');
  },
  /**
* TODO: Complete JS doc
* @returns {rolelist}
*/
  getPricipalListEdit: function () {
    let principalId = Template.instance().principalEdits.get();
    if (principalId) {
      Meteor.setTimeout(function () {
        $('#selectPrincipalEdit').val(principalId).trigger('change');
      }, 100);
    }
    return Template.instance().principalListGet.get();
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
  * get brand name
  * @param {} brand 
  */
  getPrincipalName: (principal) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("principal.idprincipalName", principal, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.principalVal_' + principal).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.principalVal_' + principal).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
   * get status values
   * @param {*} status 
   */
  getActiveStatus: (status) => {
    if (status === 'Y') {
      return 'Active';
    }
    else {
      return 'Inactive';
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('brands');
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
  brandList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  brandLists: function () {
    return Template.instance().brandNameArray.get();
  },
  /**
     * TODO: Complete JS doc
     * @returns {*}
     */
  activeHelper: function (active) {
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
   * @returns {*}
   */
  inactiveHelper: function (active) {
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
   */
  date: function () {
    return new Date();
  },
});

Template.brand.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .brandFilter': (event) => {
    event.preventDefault();
    let brandCode = event.target.brandCodeSelection.value;
    let brandName = event.target.brandNameSelection.value;
    if (brandCode && brandName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          brandCode: brandCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (brandName && brandCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          brandName: brandName,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (brandCode && brandName) {
      Template.instance().pagination.settings.set('filters',
        {
          brandCode: brandCode,
          brandName: brandName,
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
      active: "Y",
    });
    $('form :input').val("");
    $("#brandCodeSelection").val('').trigger('change');
    $("#brandNameSelection").val('').trigger('change');
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
  'click #ic-create-brand-button': () => {
    $("#ic-create-brand").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#brandHeader');
    let brandName = $('#confbrandName');
    let brandNameDup = $('#brandNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#brandDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let brandname = $('#brandName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(brandname));
    $(brandName).html(brandname);
    $(brandNameDup).html(brandname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #brandRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('brand.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#brandSuccessModal').modal();
          $('#brandSuccessModal').find('.modal-body').text('Brand inactivated successfully');
        }
        $("#brandDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#brandHeaders');
    let brandName = $('#confbrandNames');
    let brandNameDup = $('#brandNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#brandActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let brandname = $('#brandName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(brandname));
    $(brandName).html(brandname);
    $(brandNameDup).html(brandname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #brandActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('brand.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#brandSuccessModal').modal();
          $('#brandSuccessModal').find('.modal-body').text('Brand activated successfully');
        }
        $("#brandActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#brandEditPage').modal();
    template.modalLoader.set(true);
    let _id = event.currentTarget.attributes.id.value;
    template.principalEdits.set('');
    Meteor.call('brand.id', _id, (err, res) => {
      let brandDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let brandDetailId = _id;
      $(".id").val(brandDetailId);
      $("#brandNameEdits").val(brandDetail.brandName);
      $("#brandCodeEdits").val(brandDetail.brandCode);
      template.principalEdits.set(brandDetail.principal);
      $(header).html('Update Brand');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatebrand': (event) => {
    event.preventDefault();
    let principal = '';
    $('#selectPrincipalEdit').find(':selected').each(function () {
      principal = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    updatebrandlist(event.target, loginUserVerticals, principal);
    $('#selectPrincipalEdit').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatebrand").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);

  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#brandH');
    let brandName = $('#detailbrandName');
    let brandCode = $('#detailbrandCode');
    let status = $('#detailStatus');
    let detailPricipalName = $('#detailPricipalName');
    $('#brandDetailPage').modal();
    Meteor.call('brand.idDataGet', id, (brandError, brandResult) => {
      if (!brandError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(brandResult.brandRes.brandName));
        if (brandResult.brandRes.active === "Y") {
          $(status).html("Active");
        }
        else if (brandResult.brandRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(brandName).html(brandResult.brandRes.brandName);
        $(brandCode).html(brandResult.brandRes.brandCode);
        $(detailPricipalName).html(brandResult.principalName);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('brand.brandList', (brandError, brandResult) => {
      if (!brandError) {
        template.brandNameArray.set(brandResult);
      }
    });
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
  'click #fileUploadBrand': (event, template) => {
    event.preventDefault();
    $("#uploadbrand").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#brandUploadHeader');
    $('#brandUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadbrand': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadbrandFile");
    let myFile = $('.uploadbrandFile').prop('files')[0];
    let fileType = myFile["type"];
    console.log("fileType", fileType);
    if (myFile.type === 'application/vnd.ms-excel' || myFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

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
      $('#brandErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#brandErrorModal').modal();
      $('#brandUploadConfirmation').modal('hide');
      $("#uploadbrand")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let brandArray = [];
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      //Fetch the name of First Sheet.
      let firstSheet = workbook.SheetNames[0];
      //Read all rows from First Sheet into an JSON array.
      let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
      if (excelRows !== undefined && excelRows.length > 0) {
        //Add the data rows from Excel file.
        console.log("excelRows", excelRows);
        for (let i = 0; i < excelRows.length; i++) {
          let brandName = excelRows[i].BrandName;
          let principal = excelRows[i].Principal;
          let randNumber = Math.floor((Math.random() * 1000) + 1);
          console.log("principal", principal);
          if (
            brandName !== undefined && brandName !== '' && principal !== undefined && principal !== '') {
            let brandCode = brandName + " - " + randNumber.toString();
            brandArray.push({
              brandCode: brandCode.toString(), brandName: brandName, principal: principal
            });
          }
        }
      }
      else {
        $('#brandErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#brandErrorModal').modal();
        $('#brandUploadConfirmation').modal('hide');
        $("#uploadbrand")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (brandArray.length !== 0 && brandArray !== undefined) {
        $('#brandUploadConfirmation').modal('hide');
        return Meteor.call('brand.createUpload', brandArray, (error, result) => {
          if (error) {
            $('#brandErrorModal').find('.modal-body').text(error.reason);
            $('#brandErrorModal').modal();
            $('#brandUploadConfirmation').modal('hide');
            $("#uploadbrand")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#brandUploadConfirmation').modal('hide');
            $("#uploadbrand")[0].reset();
            $('#brandSuccessModal').find('.modal-body').text(` Brand has been registered successfully (${brandArray.length} Nos)`);
            $('#brandSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#brandErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#brandErrorModal').modal();
        $('#brandUploadConfirmation').modal('hide');
        $("#uploadbrand")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #brandFileClose': (event, template) => {
    $("#uploadbrand").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadbrand': (event, template) => {
    event.preventDefault();
    let data = [{
      Principal: '', BrandName: '',
    }];
    dataCSV = data.map(element => ({
      'Principal': '', 'BrandName': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "brandFormat.xls");
  },
  'change .uploadbrandFile': function (event, template) {
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
    $('#bodySpinLoaders').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinLoaders').css('display', 'none');
    }, 3000);
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    $('#bodySpinLoaders').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinLoaders').css('display', 'none');
    }, 3000);
    Template.instance().pagination.settings.set('filters', {
      active: "N",
    });
  },

});