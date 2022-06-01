/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Product } from "../../../api/products/products";
import XLSX from 'xlsx';

Template.product.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.productNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.unitArrayGet = new ReactiveVar();
  this.basicUnitEdits = new ReactiveVar();
  this.brandListGet = new ReactiveVar();
  this.brandEdits = new ReactiveVar();
  this.categoryEdits = new ReactiveVar();
  this.getCategoryList = new ReactiveVar();
  this.principalEdits = new ReactiveVar();
  this.principalListGet = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    this.pagination = new Meteor.Pagination(Product, {
      filters: {
        active: "Y"
      },
      sort: { createdAt: -1 },
      fields:{productCode:1,
        productName:1,
        principal:1,
        brand:1,
        category:1,
        active:1},
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(Product, {
      filters: {
        active: "Y", vertical: { $in: loginUserVerticals }
      },
      sort: { createdAt: -1 },
      perPage: 20
    });
  }
});

Template.product.onRendered(function () {
  let loginUserVerticals = Session.get("loginUserVerticals");
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
  $('.productNameSelection').select2({
    placeholder: "Select Product Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.productCodeSelection').select2({
    placeholder: "Select Product Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productCodeSelection").parent(),
  });
  $('.basicUnitsEdit').select2({
    placeholder: "Select Basic Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".basicUnitsEdit").parent(),
  });
  $('.selectbrandSEdit').select2({
    placeholder: "Select Brand",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectbrandSEdit").parent(),
  });
  $('.selectCategoryEdit').select2({
    placeholder: "Select Category",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCategoryEdit").parent(),
  });
  $('.selectPrincipalEdit').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrincipalEdit").parent(),
  });
});

Template.product.helpers({
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
 * get brand name
 * @param {} brand 
 */
  getbrandName: (brand) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("brand.idbrandName", brand, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.brandIdVal_' + brand).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.brandIdVal_' + brand).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get category name
* @param {} category 
*/
  getCategoryName: (category) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("category.idcategory", category, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.categoryIdVal_' + category).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.categoryIdVal_' + category).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get category list
*/
  getCategoryListEdit: () => {
    let categoryId = Template.instance().categoryEdits.get();
    if (categoryId) {
      Meteor.setTimeout(function () {
        $('#selectCategoryEdit').val(categoryId).trigger('change');
      }, 100);
    }
    return Template.instance().getCategoryList.get();
  },
  /**
  * get category list
  */
  getbrandListEdit: () => {
    let brandId = Template.instance().brandEdits.get();
    if (brandId) {
      Meteor.setTimeout(function () {
        $('#selectbrandSEdit').val(brandId).trigger('change');
      }, 100);
    }
    return Template.instance().brandListGet.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('products');
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
    let config = globalOptionsHelper('products');
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
  productList: function () {
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
  productLists: function () {
    return Template.instance().productNameArray.get();
  },
  /**
   * 
   * @returns get basic units list
   */
  basicUnitList: () => {
    let unitId = Template.instance().basicUnitEdits.get();
    if (unitId) {
      Meteor.setTimeout(function () {
        $('#basicUnitsEdit').val(unitId).trigger('change');
      }, 100);
    }
    return Template.instance().unitArrayGet.get();
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

Template.product.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .productFilter': (event) => {
    event.preventDefault();
    let productCode = event.target.productCodeSelection.value;
    let productName = event.target.productNameSelection.value;
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      if (productCode && productName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            productCode: productCode,
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (productName && productCode === '') {
        Template.instance().pagination.settings.set('filters',
          {
            productName: productName
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (productCode && productName) {
        Template.instance().pagination.settings.set('filters',
          {
            productCode: productCode,
            productName: productName
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
    {
      if (productCode && productName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            productCode: productCode, vertical: { $in: loginUserVerticals }
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (productName && productCode === '') {
        Template.instance().pagination.settings.set('filters',
          {
            productName: productName, vertical: { $in: loginUserVerticals }
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (productCode && productName) {
        Template.instance().pagination.settings.set('filters',
          {
            productCode: productCode,
            productName: productName, vertical: { $in: loginUserVerticals }
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
    $("#productCodeSelection").val('').trigger('change');
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
  'click #ic-create-product-button': () => {
    $("#ic-create-product").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#productHeader');
    let productName = $('#confproductName');
    let productNameDup = $('#productNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#productDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let productname = $('#productName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(productname));
    $(productName).html(productname);
    $(productNameDup).html(productname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #productRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('product.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#productSuccessModal').modal();
          $('#productSuccessModal').find('.modal-body').text('Product inactivated successfully');
        }
        $("#productDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#productHeaders');
    let productName = $('#confproductNames');
    let productNameDup = $('#productNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#productActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let productname = $('#productName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(productname));
    $(productName).html(productname);
    $(productNameDup).html(productname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #productActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('product.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#productSuccessModal').modal();
          $('#productSuccessModal').find('.modal-body').text('Product activated successfully');
        }
        $("#productActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#productEditPage').modal();
    template.modalLoader.set(true);
    template.unitArrayGet.set('');
    template.basicUnitEdits.set('');
    template.brandEdits.set('');
    template.categoryEdits.set('');
    template.principalEdits.set('');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('product.idEdits', _id, (err, res) => {
      let productDetail = res.productRes;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let productDetailId = _id;
      $(".id").val(productDetailId);
      $("#productNameEdits").val(productDetail.productName);
      $("#productCodeEdits").val(productDetail.productCode);
      template.brandEdits.set(productDetail.brand);
      template.categoryEdits.set(productDetail.category);
      $(header).html('Update Product');
      if (productDetail.basicUnit !== undefined && productDetail.basicUnit !== '') {
        template.basicUnitEdits.set(productDetail.basicUnit);
      }
      template.unitArrayGet.set(res.unitRes);
      template.principalEdits.set(productDetail.principal);
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updateproduct': (event) => {
    event.preventDefault();
    let unit = '';
    $('#basicUnitsEdit').find(':selected').each(function () {
      unit = $(this).val();
    });
    let brand = '';
    $('#selectbrandSEdit').find(':selected').each(function () {
      brand = $(this).val();
    });
    let category = '';
    $('#selectCategoryEdit').find(':selected').each(function () {
      category = $(this).val();
    });
    let principal = '';
    $('#selectPrincipalEdit').find(':selected').each(function () {
      principal = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    updateproductlist(event.target, loginUserVerticals, unit, brand, category, principal);
    $('#basicUnitsEdit').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateproduct").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#basicUnitsEdit').val('').trigger('change');

  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#productH');
    let productName = $('#detailproductName');
    let productCode = $('#detailproductCode');
    let status = $('#detailStatus');
    let detailBasicUnit = $('#detailBasicUnit');
    let detailBrandName = $('#detailBrandName');
    let detailCategoryName = $('#detailCategoryName');
    let detailPricipalName = $('#detailPricipalName');
    $('#productDetailPage').modal();
    Meteor.call('product.idValuesGet', id, (productError, productResult) => {
      if (!productError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(productResult.productRes.productName));
        if (productResult.productRes.active === "Y") {
          $(status).html("Active");
        }
        else if (productResult.productRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(productName).html(productResult.productRes.productName);
        $(productCode).html(productResult.productRes.productCode);
        $(detailBrandName).html(productResult.brandNameGet);
        $(detailCategoryName).html(productResult.categoryNameGet);
        $(detailBasicUnit).html(productResult.unitNameGet);
        $(detailPricipalName).html(productResult.principalName)
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
  'click #fileUploadproduct': (event, template) => {
    event.preventDefault();
    $("#uploadproduct").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#productUploadHeader');
    $('#productUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadproduct': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadproductFile");
    let myFile = $('.uploadproductFile').prop('files')[0];
    let fileType = myFile["type"];
    let loginUserVerticals = Session.get("loginUserVerticals");
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
      $('#productErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#productErrorModal').modal();
      $('#productUploadConfirmation').modal('hide');
      $("#uploadproduct")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let productArray = [];
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
          let productCode = excelRows[i].ProductCode;
          let productName = excelRows[i].ProductName;
          let baseUnit = excelRows[i].BasicUnit;
          let baseQty = excelRows[i].BaseQuantity;
          let brand = excelRows[i].Brand;
          let category = excelRows[i].Category;
          let principal = excelRows[i].Principal;
          if (productCode !== undefined && productCode !== '' &&
            productName !== undefined && productName !== '' &&
            baseQty !== undefined && baseQty !== '' &&
            baseUnit !== undefined && baseUnit !== '' &&
            brand !== undefined && brand !== '' &&
            category !== undefined && category !== '' &&
            principal !== undefined && principal !== '') {
            productArray.push({
              productCode: productCode.toString(), productName: productName,
              baseUnit: baseUnit, baseQty: baseQty.toString(),
              brand: brand, category: category, principal: principal
            });
          }
        }
      }
      else {
        $('#productErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#productErrorModal').modal();
        $('#productUploadConfirmation').modal('hide');
        $("#uploadproduct")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (productArray.length !== 0 && productArray !== undefined) {
        $('#productUploadConfirmation').modal('hide');
        return Meteor.call('product.productscreateUpload', productArray, loginUserVerticals, (error, result) => {
          if (error) {
            $('#productErrorModal').find('.modal-body').text(error.reason);
            $('#productErrorModal').modal();
            $('#productUploadConfirmation').modal('hide');
            $("#uploadproduct")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#productUploadConfirmation').modal('hide');
            $("#uploadproduct")[0].reset();
            $('#productSuccessModal').find('.modal-body').text(` Product has been registered successfully (${productArray.length} Nos)`);
            $('#productSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#productErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#productErrorModal').modal();
        $('#productUploadConfirmation').modal('hide');
        $("#uploadproduct")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #productFileClose': (event, template) => {
    $("#uploadproduct").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadproduct': (event, template) => {
    event.preventDefault();
    let data = [{
      ProductCode: '', ProductName: '', Principal: '', Brand: '', Category: '', BasicUnit: '', BaseQuantity: '',
    }];
    dataCSV = data.map(element => ({
      'ProductCode': '',
      'ProductName': '',
      'Principal': '',
      'Brand': '',
      "Category": "",
      'BasicUnit': '',
      'BaseQuantity': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "productFormat.xls");
  },
  'change .uploadproductFile': function (event, template) {
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
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
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
  'change #selectbrandSEdit': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#selectbrandSEdit').find(':selected').each(function () {
      brand = $(this).val();
    });
    template.modalLoader.set(false);
    template.getCategoryList.set('');
    if (brand !== undefined && brand !== '') {
      template.modalLoader.set(true);
      Meteor.call("category.brandWiseList", brand, (err, res) => {
        if (!err) {
          template.getCategoryList.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.getCategoryList.set('');
          template.modalLoader.set(false);
        }
      });
    }
  },
  /**
* 
* @param {*} event 
* @param {*} template 
*/
  'change #selectPrincipalEdit': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#selectPrincipalEdit').find(':selected').each(function () {
      principal = $(this).val();
    });
    template.modalLoader.set(false);
    template.brandListGet.set('');
    if (principal !== undefined && principal !== '') {
      template.modalLoader.set(true);
      Meteor.call("brand.principalWiseList", principal, (err, res) => {
        if (!err) {
          template.brandListGet.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.brandListGet.set('');
          template.modalLoader.set(false);
        }
      });
    }
  },
});