/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Price } from "../../../api/price/price";
import XLSX from 'xlsx';

Template.priceReport.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.priceNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.productEdit = new ReactiveVar();
  this.unitList = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.unitEdits = new ReactiveVar();
  this.priceTypeEdits = new ReactiveVar();
  this.priceTypeList = new ReactiveVar();
  this.priceTypeFullListExcel = new ReactiveVar();
  this.productFullListGet = new ReactiveVar();
  this.productFullListExcel = new ReactiveVar();
  this.priceExportData = new ReactiveVar();
  this.printLoadExport = new ReactiveVar();
  this.productNameArray = new ReactiveVar();
  this.principalListGet = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");
  this.pagination = new Meteor.Pagination(Price, {
    filters: {
      vertical: { $in: loginUserVerticals },
    },
    sort: { createdAt: -1 },
    fields: {
      product: 1,
      priceType: 1,
      unit: 1,
      priceVsr: 1,
      priceOmr: 1,
      priceWs: 1,
      priceName: 1,
      vertical: 1,
      active: 1
    },
    perPage: 20
  });
});

Template.priceReport.onRendered(function () {
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
   * get price type list
   */
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('priceType.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.priceTypeList.set(res);
    }
  });
  /**
   * get branch list for edit
   */
  Meteor.call('product.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.productListGet.set(res);
    }
  });
  Meteor.call('principal.principalActiveList', (err, res) => {
    if (!err) {
      this.principalListGet.set(res);
    }
  });
  /**
   * get branch list for edit
   */

  /**
   * TODO: Complete JS doc
   */
  $('.productSelection').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productSelection").parent(),
  });
  $('.selectPrincipal').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrincipal").parent(),
  });
  $('.productNameSelection').select2({
    placeholder: "Select Product Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productNameSelection").parent(),
  });

  /**
  * TODO: Complete JS doc
  */
  $('.productSelectionExport').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productSelectionExport").parent(),
  });

  /**
 * TODO: Complete JS doc
 */
  $('.selectProductEdit').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProductEdit").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.priceTypeSelection').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".priceTypeSelection").parent(),
  });

  /**
 * TODO: Complete JS doc
 */
  $('.priceTypeSelectionExport').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".priceTypeSelectionExport").parent(),
  });

  $('.selectPriceTypeEdit').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriceTypeEdit").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('.selectUnitEdit').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnitEdit").parent(),
  });

  let superAdminValue = Session.get("superAdminValue");
  Meteor.call('product.filterList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.productNameArray.set(res);
    }
  });
});

Template.priceReport.helpers({
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
* TODO:Complete Js doc
* Formating the price 
*/
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(2);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
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
 * TODO:Complete JS doc
 * 
 */
  printLoaderExp: () => {
    let res = Template.instance().printLoadExport.get();
    if (res === true) {
      return true;
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
    return globalOptionsHelper('prices');
  },
  getPricipalList: function () {
    return Template.instance().principalListGet.get();
  },
  /**
* get price type
*/
  getUnitListEdit: () => {
    let unitId = Template.instance().unitEdits.get();
    if (unitId) {
      Meteor.setTimeout(function () {
        $('#selectUnitEdit').val(unitId).trigger('change');
      }, 100);
    }
    return Template.instance().unitList.get();
  },
  /**
* get price type
*/
  getPriceTypeEdit: () => {
    let priceId = Template.instance().priceTypeEdits.get();
    if (priceId) {
      Meteor.setTimeout(function () {
        $('#selectPriceTypeEdit').val(priceId).trigger('change');
      }, 100);
    }
    return Template.instance().priceTypeList.get();
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
   * get product name
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
   * get product name
   * @param {} product 
   */
  getPrincipalName: (product) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.pricipalNameGet", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.principalVal_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.principalVal_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
  * get product name
  * @param {} product 
  */
  getProductCode: (product) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.idCode", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productCodeVal_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productCodeVal_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  activeCheckss: (status) => {
    if (status === 'Y') {
      return 'Active';
    }
    else {
      return 'Inactive';
    }
  },
  getVerticalNam: (id, vertical) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("vertical.nameArrayList", vertical, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.getVerticalNames_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.getVerticalNames_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
 * get pricetype name
 * @param {} priceType 
 */
  getPriceTypeName: (priceType) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("priceType.idName", priceType, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.priceTypeVal_' + priceType).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.priceTypeVal_' + priceType).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },

  /**
 * get branch name
 * @param {} product 
 */
  getUnitName: (unit) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("unit.idName", unit, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.unitNameVal_' + unit).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitNameVal_' + unit).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('prices');
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
  productLists: function () {
    return Template.instance().productNameArray.get();
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
  priceList: function () {
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
  priceLists: function () {
    return Template.instance().priceNameArray.get();
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

  exportProductList: () => {
    return Template.instance().priceExportData.get();
  },

});

Template.priceReport.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .priceFilter': (event) => {
    event.preventDefault();
    let product = event.target.productSelection.value;
    let priceType = event.target.priceTypeSelection.value;
    let code = event.target.productNameSelection.value;
    let loginUserVerticals = Session.get("loginUserVerticals");

    if (product && priceType === '' && code === '') {
      Template.instance().pagination.settings.set('filters',
        {
          product: product,
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if (product === '' && priceType && code === '') {
      Template.instance().pagination.settings.set('filters',
        {
          priceType: priceType,
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if (product === '' && priceType === '' && code) {
      Template.instance().pagination.settings.set('filters',
        {
          product: code,
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if (product && priceType && code === '') {
      Template.instance().pagination.settings.set('filters',
        {
          product: product,
          priceType: priceType,
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if (product && priceType === '' && code) {
      Template.instance().pagination.settings.set('filters',
        {
          product: code,
          product: product,
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if (product === '' && priceType && code) {
      Template.instance().pagination.settings.set('filters',
        {
          product: code,
          priceType: priceType,
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if (product && priceType && code) {
      Template.instance().pagination.settings.set('filters',
        {
          product: code,
          product: product,
          priceType: priceType,
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else {
      Template.instance().pagination.settings.set('filters',
        {
          vertical: { $in: loginUserVerticals },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }

  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    Template.instance().pagination.settings.set('filters', {
      vertical: { $in: loginUserVerticals },
    });
    $('form :input').val("");
    $("#productSelection").val('').trigger('change');
    $("#priceTypeSelection").val('').trigger('change');
    $("#productNameSelection").val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-price-button': () => {
    $("#ic-create-price").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#priceHeader');
    let priceName = $('#confpriceName');
    let priceNameDup = $('#priceNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#priceDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let pricename = $('#priceName_' + _id).val();
    $(header).html('Confirm Deactivation');
    $(priceName).html(pricename);
    $(priceNameDup).html(pricename);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #priceRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('price.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#priceSuccessModal').modal();
          $('#priceSuccessModal').find('.modal-body').text('Price inactivated successfully');
        }
        $("#priceDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#priceHeaders');
    let priceName = $('#confpriceNames');
    let priceNameDup = $('#priceNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#priceActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let pricename = $('#priceName_' + _id).val();
    $(header).html('Confirm Activation ');
    $(priceName).html(pricename);
    $(priceNameDup).html(pricename);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #priceActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('price.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#priceSuccessModal').modal();
          $('#priceSuccessModal').find('.modal-body').text('Price activated successfully');
        }
        $("#priceActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#priceEditPage').modal();
    template.modalLoader.set(true);
    template.productEdit.set('');
    let header = $('#categoryH');
    $(header).html('Update Price');
    template.unitEdits.set('');
    template.priceTypeEdits.set('');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('price.id', _id, (err, res) => {
      let priceDetail = res;
      $('div.hint').hide();
      template.modalLoader.set(false);
      let priceDetailId = _id;
      $(".id").val(priceDetailId);
      $("#priceGetEdit").val(priceDetail.priceVsr);
      $("#priceGetOmrEdit").val(priceDetail.priceOmr);
      $("#priceGetWSEdit").val(priceDetail.priceWs);
      template.productEdit.set(priceDetail.product);
      template.unitEdits.set(priceDetail.unit);
      template.priceTypeEdits.set(priceDetail.priceType);
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updateprice': (event) => {
    event.preventDefault();
    let product = '';
    $('#selectProductEdit').find(':selected').each(function () {
      product = $(this).val();
    });
    let priceType = '';
    $('#selectPriceTypeEdit').find(':selected').each(function () {
      priceType = $(this).val();
    });
    let unit = '';
    $('#selectUnitEdit').find(':selected').each(function () {
      unit = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    updatepricelist(event.target, product, priceType, unit, loginUserVerticals);
    $('#selectProductEdit').val('').trigger('change');
    $('#selectUnitEdit').val('').trigger('change');
    $('#selectPriceTypeEdit').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateprice").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#selectProductEdit').val('').trigger('change');
    $('#selectUnitEdit').val('').trigger('change');
    $('#selectPriceTypeEdit').val('').trigger('change');
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#priceH');
    let priceTypeName = $('#detailpriceTypeName');
    let unitName = $('#detailUnit');
    let price = $('#detailPrice');
    let priceOmr = $('#detailPriceOmr');
    let pricews = $('#detailPriceWs');
    let productName = $('#detailProduct');
    let status = $('#detailStatus');
    $('#priceDetailPage').modal();
    Meteor.call('price.idDataGet', id, (priceError, priceResult) => {
      if (!priceError) {
        template.modalLoader.set(false);
        $(header).html('Details of price');
        if (priceResult.priceRes.active === "Y") {
          $(status).html("Active");
        }
        else if (priceResult.priceRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(priceTypeName).html(priceResult.priceTypeName);
        $(unitName).html(priceResult.unitName);
        $(price).html(Number(priceResult.priceRes.priceVsr).toFixed(2));
        $(priceOmr).html(Number(priceResult.priceRes.priceOmr).toFixed(2));
        $(pricews).html(Number(priceResult.priceRes.priceWs).toFixed(2));
        $(productName).html(priceResult.productName);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
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
  'click #fileUploadprice': (event, template) => {
    event.preventDefault();
    $("#uploadprice").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#priceUploadHeader');
    $('#priceUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadprice': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadpriceFile");
    let myFile = $('.uploadpriceFile').prop('files')[0];
    let fileType = myFile["type"];
    let loginUserVerticals = Session.get("loginUserVerticals");
    let productArray = Template.instance().productFullListExcel.get();
    let priceTypeArray = Template.instance().priceTypeList.get();
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
      $('#priceErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#priceErrorModal').modal();
      $('#priceUploadConfirmation').modal('hide');
      $("#uploadprice")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let priceArray = [];
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
          let product = excelRows[i].Product;
          let priceType = excelRows[i].PriceType;
          let unit = excelRows[i].Unit;
          let price = excelRows[i].VSRPrice;
          let priceOmr = excelRows[i].OMRPrice;
          let priceWs = excelRows[i].WSExePrice;
          let productId = '';
          let priceTypeId = '';
          console.log("hhh");
          console.log("unit,priceTypeId,productId,price", unit, priceType, product, price, priceOmr, priceWs);
          if (product !== undefined && product !== '') {
            let resVal = productArray.find(x => x.productName === product.trim())
            if (resVal !== undefined) {
              productId = resVal._id;
            }
          }
          if (priceType !== undefined && priceType !== '') {
            let resVal = priceTypeArray.find(x => x.priceTypeName === priceType.trim())
            if (resVal !== undefined) {
              priceTypeId = resVal._id;
            }
          }
          console.log("priceType", priceTypeId);
          console.log("unit", unit);
          console.log("productId", productId);
          console.log("price", price);
          if (unit !== undefined && unit !== '' &&
            priceTypeId !== undefined && priceTypeId !== '' &&
            productId !== undefined && productId !== '' &&
            price !== undefined && price !== '' &&
            priceOmr !== undefined && priceOmr !== '' &&
            priceWs !== undefined && priceWs !== ''
          ) {
            priceArray.push({
              product: productId, priceType: priceTypeId, unit: unit.trim(), price: price.toString(),
              priceOmr: priceOmr.toString(), priceWs: priceWs.toString(),
            });
          }
        }
      }
      else {
        $('#priceErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#priceErrorModal').modal();
        $('#priceUploadConfirmation').modal('hide');
        $("#uploadprice")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (priceArray.length !== 0 && priceArray !== undefined) {
        $('#priceUploadConfirmation').modal('hide');
        return Meteor.call('price.createUpload', priceArray, loginUserVerticals, (error, result) => {
          if (error) {
            $('#priceErrorModal').find('.modal-body').text(error.reason);
            $('#priceErrorModal').modal();
            $('#priceUploadConfirmation').modal('hide');
            $("#uploadprice")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#priceUploadConfirmation').modal('hide');
            $("#uploadprice")[0].reset();
            $('#priceSuccessModal').find('.modal-body').text(` Price has been registered successfully (${priceArray.length} Nos)`);
            $('#priceSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#priceErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#priceErrorModal').modal();
        $('#priceUploadConfirmation').modal('hide');
        $("#uploadprice")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #priceFileClose': (event, template) => {
    $("#uploadprice").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadprice': (event, template) => {
    event.preventDefault();
    let data = [{
      Product: '', PriceType: '', Unit: '', VSRPrice: '', OMRPrice: '', WSExePrice: ''
    }];
    dataCSV = data.map(element => ({
      'Product': '',
      'PriceType': '',
      'Unit': '',
      'VSRPrice': '',
      'OMRPrice': '',
      'WSExePrice': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "priceFormat.xls");
  },
  'change .uploadpriceFile': function (event, template) {
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
    * 
    * @param {*} event 
    * @param {*} template 
    * get unit based on product
    */
  'change #selectProductEdit': (event, template) => {
    event.preventDefault();
    let product = '';
    template.unitList.set('');
    template.modalLoader.set(false);
    $('#selectProductEdit').find(':selected').each(function () {
      product = $(this).val();
    });
    if (product !== undefined && product !== '') {
      template.modalLoader.set(true);
      Meteor.call('unit.unitCodeGet', product, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.unitList.set(res);
        }
        else {
          template.modalLoader.set(false);
        }
      })
    }
  },
  // number validation
  'keypress #priceGet': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $("#priceGet").val()
      if (inputValue.indexOf('.') < 1) {
        return true;
      }
      return false;
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
        active: "Y", vertical: { $in: loginUserVerticals },
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
        active: "N", vertical: { $in: loginUserVerticals },
      });
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'submit .exportByDate': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().priceExportData.get();
    if (exportData.length === 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#exportButtons").prop('disabled', true);
      $("#productReportExportPage").modal('hide');
      Meteor.setTimeout(() => {
        let uri = 'data:application/vnd.ms-excel;base64,',
          template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
          base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
          },
          format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
              return c[p];
            });
          }
        let toExcel = document.getElementById("exportTodayOrder").innerHTML;
        let ctx = {
          worksheet: name || 'Excel',
          table: toExcel
        };
        //return a promise that resolves with a File instance
        function urltoFile(url, filename, mimeType) {
          return (fetch(url)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
          );
        };

        //Usage example:
        urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
          .then(function (file) {

            saveAs(file, "Price Details Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('form :input').val("");
      }, 5000);
    }
  },
  /**
     * TODO:Complete JS doc
     */
  'click .export': (event, template) => {
    let header = $('#productExportHeader');
    $('#productSelectionExport').val('').trigger('change');
    $('#priceTypeSelectionExport').val('').trigger('change');
    $('#productReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.priceExportData.set('');
  },


  /**
* 
* @param {*} event 
* @param {*} template 
*/
  'change #productSelectionExport': (event, template) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    let product = '';
    $('#productSelectionExport').find(':selected').each(function () {
      product = $(this).val();
    });
    let priceType = '';
    $('#priceTypeSelectionExport').find(':selected').each(function () {
      priceType = $(this).val();
    });
    template.printLoadExport.set(false);
    template.priceExportData.set('');
    if (product !== undefined && product !== '') {
      template.printLoadExport.set(true);
      Meteor.call("price.productWiseExp", product, priceType, loginUserVerticals, (err, res) => {
        if (!err) {
          template.priceExportData.set(res);
          template.printLoadExport.set(false);
        }
        else {
          template.printLoadExport.set(false);
          template.priceExportData.set('');
        }
      });
    }
  },

  /**
* 
* @param {*} event 
* @param {*} template 
*/
  'change #priceTypeSelectionExport': (event, template) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    let product = '';
    // $('#productSelectionExport').find(':selected').each(function () {
    //   product = $(this).val();
    // });
    let priceType = '';
    $('#priceTypeSelectionExport').find(':selected').each(function () {
      priceType = $(this).val();
    });
    template.printLoadExport.set(false);
    template.priceExportData.set('');
    if (priceType !== undefined && priceType !== '') {
      template.printLoadExport.set(true);
      Meteor.call("price.priceTypeWiseExp", product, priceType, loginUserVerticals, (err, res) => {
        if (!err) {
          template.priceExportData.set(res);
          template.printLoadExport.set(false);
          if (res.length === 0) {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
          }
          else {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style> #emptyDataSpans { color:#2ECC71 }</style><span id ="emptyDataSpans">Records are ready for export.</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
          }
        }
        else {
          template.printLoadExport.set(false);
          template.priceExportData.set('');
          setTimeout(function () {
            $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');
          }, 3000);
        }
      });
    }
  },
});