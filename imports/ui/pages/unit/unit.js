/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Unit } from "../../../api/unit/unit";
import XLSX from 'xlsx';

Template.unit.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.unitNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.productEdit = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.productNameArray = new ReactiveVar();
  this.productFullList = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    this.pagination = new Meteor.Pagination(Unit, {
      filters: {
        active: "Y"
      },
      sort: { createdAt: -1 },
      fields:{unitCode:1,unitName:1,product:1,active:1},
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(Unit, {
      filters: {
        active: "Y", vertical: { $in: loginUserVerticals }
      },
      sort: { createdAt: -1 },
      perPage: 20
    });
  }
});

Template.unit.onRendered(function () {
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
  Meteor.call('unit.unitList', (unitError, unitResult) => {
    if (!unitError) {
      this.unitNameArray.set(unitResult);
    }
  });
  /**
   * get branch list for edit
   */
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('product.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.productListGet.set(res);
    }
  });

  Meteor.call('product.productList', (err, res) => {
    if (!err) {
      this.productFullList.set(res);
    }
  });
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    Meteor.call('product.productList', (err, res) => {
      if (!err) {
        this.productNameArray.set(res);
      }
    });
  }
  else {
    Meteor.call('product.filterList', loginUserVerticals, (err, res) => {
      if (!err) {
        this.productNameArray.set(res);
      }
    });
  }

  /**
   * TODO: Complete JS doc
   */
  $('.unitNameSelection').select2({
    placeholder: "Select Unit Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".unitNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.unitCodeSelection').select2({
    placeholder: "Select Unit Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".unitCodeSelection").parent(),
  });

  $('.selectProductEdit').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProductEdit").parent(),
  });
  $('.productNameSelection').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productNameSelection").parent(),
  });
});

Template.unit.helpers({
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
 * get branch list
 */
  getProductListEdit: () => {
    let productId = Template.instance().productEdit.get();
    if (productId) {
      Meteor.setTimeout(function () {
        $('#selectProductEdit').val(productId).trigger('change');
      }, 100);
    }
    return Template.instance().productListGet.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('units');
  },
   /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
    productLists: function () {
      return Template.instance().productNameArray.get();
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
   * get branch name
   * @param {} product 
   */
  getProductName: (product) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.idName", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productIdVal_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('units');
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
  unitList: function () {
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
  unitLists: function () {
    return Template.instance().unitNameArray.get();
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

Template.unit.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .unitFilter': (event) => {
    event.preventDefault();
    let unitCode = ''
    let unitName = ''
    let product = event.target.productNameSelection.value;
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      if (product && unitName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            product: product,
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (unitName && product === '') {
        Template.instance().pagination.settings.set('filters',
          {
            unitName: unitName
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (product && unitName) {
        Template.instance().pagination.settings.set('filters',
          {
            product: product,
            unitName: unitName
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        Template.instance().pagination.settings.set('filters', {
        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
    //else

    else {
      if (product && unitName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            product: product, vertical: { $in: loginUserVerticals }
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (unitName && product === '') {
        Template.instance().pagination.settings.set('filters',
          {
            unitName: unitName, vertical: { $in: loginUserVerticals }
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (product && unitName) {
        Template.instance().pagination.settings.set('filters',
          {
            product: product,
            unitName: unitName, vertical: { $in: loginUserVerticals }
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        Template.instance().pagination.settings.set('filters', {
        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y", vertical: { $in: loginUserVerticals }
      });
    }
    $('form :input').val(""); 
    $("#productNameSelection").val('').trigger('change');
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
  'click #ic-create-unit-button': () => {
    $("#ic-create-unit").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#unitHeader');
    let unitName = $('#confunitName');
    let unitNameDup = $('#unitNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#unitDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let unitname = $('#unitName_' + _id).val();
    $(header).html('Confirm Deletion Of ' + $.trim(unitname));
    $(unitName).html(unitname);
    $(unitNameDup).html(unitname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #unitRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('unit.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#unitSuccessModal').modal();
          $('#unitSuccessModal').find('.modal-body').text('Unit inactivated successfully');
        }
        $("#unitDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#unitHeaders');
    let unitName = $('#confunitNames');
    let unitNameDup = $('#unitNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#unitActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let unitname = $('#unitName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(unitname));
    $(unitName).html(unitname);
    $(unitNameDup).html(unitname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #unitActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('unit.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#unitSuccessModal').modal();
          $('#unitSuccessModal').find('.modal-body').text('Unit activated successfully');
        }
        $("#unitActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#unitEditPage').modal();
    template.modalLoader.set(true);
    template.productEdit.set('');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('unit.id', _id, (err, res) => {
      let unitDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let unitDetailId = _id;
      $(".id").val(unitDetailId);
      $("#unitNameEdits").val(unitDetail.unitName);
      $("#unitCodeEdits").val(unitDetail.unitCode);
      $("#baseQtyEdit").val(unitDetail.baseQuantity);
      template.productEdit.set(unitDetail.product);
      $(header).html('Update Unit');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updateunit': (event) => {
    event.preventDefault();
    let product = '';
    $('#selectProductEdit').find(':selected').each(function () {
      product = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    updateunitlist(event.target, product, loginUserVerticals);
    $('#selectProductEdit').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateunit").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#selectProductEdit').val('').trigger('change');
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#unitH');
    let unitName = $('#detailunitName');
    let unitCode = $('#detailunitCode');
    let baseQty = $('#detailBaseQty');
    let productName = $('#detailProduct');
    let status = $('#detailStatus');
    $('#unitDetailPage').modal();
    Meteor.call('unit.idDataGet', id, (unitError, unitResult) => {
      if (!unitError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(unitResult.unitRes.unitName));
        if (unitResult.unitRes.active === "Y") {
          $(status).html("Active");
        }
        else if (unitResult.unitRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(unitName).html(unitResult.unitRes.unitName);
        $(unitCode).html(unitResult.unitRes.unitCode);
        $(baseQty).html(unitResult.unitRes.baseQuantity);
        $(productName).html(unitResult.productName);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Meteor.call('product.productList', (err, res) => {
        if (!err) {
          template.productNameArray.set(res);
        }
      });
    }
    else {
      Meteor.call('product.filterList', loginUserVerticals, (err, res) => {
        if (!err) {
          template.productNameArray.set(res);
        }
      });
    }
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
  'click #fileUploadunit': (event, template) => {
    event.preventDefault();
    $("#uploadunit").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#unitUploadHeader');
    $('#unitUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadunit': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadunitFile");
    let myFile = $('.uploadunitFile').prop('files')[0];
    let fileType = myFile["type"];
    let loginUserVerticals = Session.get("loginUserVerticals");
    let productArray = Template.instance().productFullList.get();
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
      $('#unitErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#unitErrorModal').modal();
      $('#unitUploadConfirmation').modal('hide');
      $("#uploadunit")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let unitArray = [];
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
          let unitCode = excelRows[i].UnitCode;
          let unitName = excelRows[i].UnitName;
          let product = excelRows[i].Product;
          let baseQuantity = excelRows[i].BaseQuantity;
          let productId = '';
          if (product !== undefined && product !== '') {
            let resVal = productArray.find(x => x.productName === product.trim())
            if (resVal !== undefined) {
              productId = resVal._id;
            }
          }
          if (unitCode !== undefined && unitCode !== '' &&
            unitName !== undefined && unitName !== '' &&
            productId !== undefined && productId !== '' &&
            baseQuantity !== undefined && baseQuantity !== ''
          ) {
            unitArray.push({
              unitCode: unitCode.toString(), unitName: unitName, product: productId, baseQuantity: baseQuantity.toString()
            });
          }
        }
      }
      else {
        $('#unitErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#unitErrorModal').modal();
        $('#unitUploadConfirmation').modal('hide');
        $("#uploadunit")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (unitArray.length !== 0 && unitArray !== undefined) {
        $('#unitUploadConfirmation').modal('hide');
        return Meteor.call('unit.createUpload', unitArray, loginUserVerticals, (error, result) => {
          if (error) {
            $('#unitErrorModal').find('.modal-body').text(error.reason);
            $('#unitErrorModal').modal();
            $('#unitUploadConfirmation').modal('hide');
            $("#uploadunit")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#unitUploadConfirmation').modal('hide');
            $("#uploadunit")[0].reset();
            $('#unitSuccessModal').find('.modal-body').text(` Unit has been registered successfully (${unitArray.length} Nos)`);
            $('#unitSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#unitErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#unitErrorModal').modal();
        $('#unitUploadConfirmation').modal('hide');
        $("#uploadunit")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #unitFileClose': (event, template) => {
    $("#uploadunit").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadunit': (event, template) => {
    event.preventDefault();
    let data = [{
      unitCode: '', unitName: '', Product: '', BaseQuantity: ''
    }];
    dataCSV = data.map(element => ({
      'UnitCode': '',
      'UnitName': '',
      'Product': '',
      'BaseQuantity': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "unitFormat.xls");
  },
  'change .uploadunitFile': function (event, template) {
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
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y", vertical: { $in: loginUserVerticals }
      });
    }
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
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "N"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "N", vertical: { $in: loginUserVerticals }
      });

    }
  },

});