/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Product } from "../../../api/products/products";
import XLSX from 'xlsx';

Template.productsReport.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.productNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.unitArrayGet = new ReactiveVar();
  this.basicUnitEdits = new ReactiveVar();
  this.brandListGetExport = new ReactiveVar();
  this.brandListGet = new ReactiveVar();
  this.brandEdits = new ReactiveVar();
  this.categoryEdits = new ReactiveVar();
  this.getCategoryList = new ReactiveVar();
  this.getCategoryListExport = new ReactiveVar();
  this.principalEdits = new ReactiveVar();
  this.principalListGet = new ReactiveVar();
  this.productExportData = new ReactiveVar();
  this.printLoadExport = new ReactiveVar();
  this.productNameArray = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");
  this.pagination = new Meteor.Pagination(Product, {
    filters: {
      vertical: { $in: loginUserVerticals }
    },
    sort: { createdAt: -1 },
    fields: {
      productCode: 1,
      productName: 1,
      principal: 1,
      brand: 1,
      category: 1,
      createdAt: 1,
      active: 1,
      vertical: 1
    },
    perPage: 20
  });
});

Template.productsReport.onRendered(function () {
  let loginUserVerticals = Session.get("loginUserVerticals");
  $('#bodySpinLoaders').css('display', 'block');
  /**
 * active and inactive list based on nav bar
 */
  /**
* get price type list
*/
  let superAdminValue = Session.get("superAdminValue");
  Meteor.call('product.filterList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.productNameArray.set(res);
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

  /**
 * TODO: Complete JS doc
 */
  $('#selectPrincipal').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectPrincipal").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('#selectbrandS').select2({
    placeholder: "Select Brand",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectbrandS").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('#selectCategory').select2({
    placeholder: "Select Category",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectCategory").parent(),
  });

  $('.selectbrandSExport').select2({
    placeholder: "Select Brand",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectbrandSExport").parent(),
  });
  $('.selectCategoryExport').select2({
    placeholder: "Select Category",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCategoryExport").parent(),
  });
  $('.selectPrincipalExport').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrincipalExport").parent(),
  });
  $('.productNameSelection').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productNameSelection").parent(),
  });
  /**
 * get price type list
 */
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
});

Template.productsReport.helpers({
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
* get brand name
* @param {} brand 
*/
  getUnitNameList: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("unit.productUnitList", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.unitNames_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitNames_' + id).html('');
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
  getCategoryList: () => {
    return Template.instance().getCategoryList.get();
  },
  /**
  * get category list
  */
  getbrandList: () => {
    return Template.instance().brandListGet.get();
  },
  /**
* get category list
*/
  getCategoryListExport: () => {
    return Template.instance().getCategoryListExport.get();
  },
  /**
  * get category list
  */
  getbrandListExport: () => {
    return Template.instance().brandListGetExport.get();
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
  getPricipalList: function () {
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

  exportProductList: () => {
    return Template.instance().productExportData.get();
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
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  productLists: function () {
    return Template.instance().productNameArray.get();
  },

});

Template.productsReport.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .productFilter': (event) => {
    event.preventDefault();
    let principal = event.target.selectPrincipal.value;
    let brand = event.target.selectbrandS.value;
    let category = event.target.selectCategory.value;
    let product = event.target.productNameSelection.value;
    let loginUserVerticals = Session.get("loginUserVerticals");


    if (principal && brand === '' && category === '' && product === '') {
      Template.instance().pagination.settings.set('filters',
        {
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal === '' && brand && category === '' && product === '') {
      Template.instance().pagination.settings.set('filters',
        {
          brand: brand,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal === '' && brand === '' && category && product === '') {
      Template.instance().pagination.settings.set('filters',
        {
          category: category,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal === '' && brand === '' && category === '' && product) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: product,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal && brand && category === '' && product === '') {
      Template.instance().pagination.settings.set('filters',
        {
          brand: brand,
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal && brand === '' && category && product === '') {
      Template.instance().pagination.settings.set('filters',
        {
          category: category,
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal && brand === '' && category === '' && product) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: product,
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal && brand && category && product === '') {
      Template.instance().pagination.settings.set('filters',
        {
          category: category,
          brand: brand,
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal && brand === '' && category && product) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: product,
          category: category,
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal && brand && category === '' && product) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: product,
          brand: brand,
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal === '' && brand && category && product) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: product,
          category: category,
          brand: brand,
          vertical: { $in: loginUserVerticals }
        });
    } else if (principal && brand && category && product) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: product,
          category: category,
          brand: brand,
          principal: principal,
          vertical: { $in: loginUserVerticals }
        });
    } else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }




    // if (principal && brand === '' && category === '') {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       principal: principal, vertical: { $in: loginUserVerticals }
    //     },
    //   );
    // }
    // else if (brand && principal === '' && category === '') {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       brand: brand, vertical: { $in: loginUserVerticals }
    //     },
    //   );
    // }
    // else if (brand === '' && principal === '' && category) {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       category: category, vertical: { $in: loginUserVerticals }
    //     },
    //   );
    // }
    // else if (principal && brand && category === '') {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       principal: principal,
    //       brand: brand, vertical: { $in: loginUserVerticals }
    //     },
    //   );
    // }
    // else if (principal === '' && brand && category) {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       category: category,
    //       brand: brand, vertical: { $in: loginUserVerticals }
    //     },
    //   );
    // }
    // else if (principal && brand === '' && category) {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       category: category,
    //       principal: principal, vertical: { $in: loginUserVerticals }
    //     },
    //   );
    // }
    // else if (principal && brand && category) {
    // Template.instance().pagination.settings.set('filters',
    //   {
    //     category: category,
    //     brand: brand,
    //     principal: principal, vertical: { $in: loginUserVerticals }
    //   },
    // );
    // }
    // else {
    // Template.instance().pagination.settings.set('filters', {
    // });
    // $('.taskHeaderList').css('display', 'none');
    // }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    $('form :input').val("");
    $("#selectbrandS").val('').trigger('change');
    $("#selectCategory").val('').trigger('change');
    $("#selectPrincipal").val('').trigger('change');
    $("#productNameSelection").val('').trigger('change');
    let loginUserVerticals = Session.get("loginUserVerticals");
    Template.instance().pagination.settings.set('filters', {
      vertical: { $in: loginUserVerticals }
    },
    );
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
      */
  'click .export': (event, template) => {
    let header = $('#productExportHeader');
    $('#selectPrincipalExport').val('').trigger('change');
    $('#selectbrandSExport').val('').trigger('change');
    $('#selectCategoryExport').val('').trigger('change');
    $('#productReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.productExportData.set('');
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


  'change #selectbrandS': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#selectbrandS').find(':selected').each(function () {
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
  'change #selectPrincipal': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#selectPrincipal').find(':selected').each(function () {
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

  'change #selectbrandSExport': (event, template) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    let brand = '';
    $('#selectbrandSExport').find(':selected').each(function () {
      brand = $(this).val();
    });
    let principal = '';
    $('#selectPrincipalExport').find(':selected').each(function () {
      principal = $(this).val();
    });
    template.getCategoryListExport.set('');
    template.printLoadExport.set(false);
    template.productExportData.set('');
    if (brand !== undefined && brand !== '') {
      template.printLoadExport.set(true);
      Meteor.call("category.brandWiseListExport", brand, principal, loginUserVerticals, (err, res) => {
        if (!err) {
          template.getCategoryListExport.set(res.categoryRes);
          template.printLoadExport.set(false);
          template.productExportData.set(res.productRes);

        }
        else {
          template.getCategoryListExport.set('');
          template.productExportData.set('');
          template.printLoadExport.set(false);
        }
      });
    }
  },
  /**
* 
* @param {*} event 
* @param {*} template 
*/
  'change #selectPrincipalExport': (event, template) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    let principal = '';
    $('#selectPrincipalExport').find(':selected').each(function () {
      principal = $(this).val();
    });
    template.brandListGetExport.set('');
    template.printLoadExport.set(false);
    template.productExportData.set('');
    if (principal !== undefined && principal !== '') {
      template.printLoadExport.set(true);
      Meteor.call("brand.principalDataExport", principal, loginUserVerticals, (err, res) => {
        if (!err) {
          template.brandListGetExport.set(res.brandRes);
          template.productExportData.set(res.productRes);
          template.printLoadExport.set(false);
          if (res.productRes.length === 0) {
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
          template.brandListGetExport.set('');
          template.printLoadExport.set(false);
          template.productExportData.set('');
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

  /**
* 
* @param {*} event 
* @param {*} template 
*/
  'change #selectCategoryExport': (event, template) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    let principal = '';
    $('#selectPrincipalExport').find(':selected').each(function () {
      principal = $(this).val();
    });
    let brand = '';
    $('#selectbrandSExport').find(':selected').each(function () {
      brand = $(this).val();
    });
    let category = '';
    $('#selectCategoryExport').find(':selected').each(function () {
      category = $(this).val();
    });
    template.printLoadExport.set(false);
    template.productExportData.set('');
    if (principal !== undefined && principal !== '' &&
      brand !== undefined && brand !== '' &&
      category !== undefined && category !== '') {
      template.printLoadExport.set(true);
      Meteor.call("category.fullListExport", principal, brand, category, loginUserVerticals, (err, res) => {
        if (!err) {
          template.productExportData.set(res);
          template.printLoadExport.set(false);
        }
        else {
          template.printLoadExport.set(false);
          template.productExportData.set('');
        }
      });
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'submit .exportByDate': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().productExportData.get();
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

            saveAs(file, "Product Details Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('form :input').val("");
      }, 5000);
    }
  },
});