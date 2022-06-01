/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { StockInvoices } from "../../../api/stockInvoices/stockInvoices";
import XLSX from 'xlsx';

Template.stockUpdateReportBDM.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.stockNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.stockExportData = new ReactiveVar();
  this.subDistributorLists = new ReactiveVar();
  let date = new Date();
  let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  toiDate.setDate(toiDate.getDate() + 1);
  let vertical = Session.get("loginUserVerticals");
  this.pagination = new Meteor.Pagination(StockInvoices, {
    filters: {
      vertical: { $in: vertical },
      createdAt: { $gte: fromiDate, $lt: toiDate }
    },
    sort: { createdAt: -1 },
    fields: {
      vertical: 1,
      product: 1,
      invoiceNo: 1,
      stockDate: 1,
      unit: 1,
      stock: 1,
      oldStock: 1,
      newStock: 1,
      qtyCTN: 1,
      subDistributor: 1,
      createdAt: 1,
    },
    perPage: 20
  });
});

Template.stockUpdateReportBDM.onRendered(function () {
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
  /**
   * get product list
   */

  /**
   * get vertical List
   */
  if (Meteor.user()) {
    /**
  * get product list
  */
    Meteor.call('product.productActiveList', (err, res) => {
      if (!err) {
        this.productListGet.set(res);
      }
    });
    Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
    let vertical = Session.get('loginUserVerticals');
    Meteor.call('user.sdListGet', vertical, (err, res) => {
      if (!err) {
        this.subDistributorLists.set(res);
      };
    });
  }
  /**
   * TODO: Complete JS doc
   */
  $('.selectVerticalId').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalId").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('.selectProductId').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProductId").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.selectVerticalIdExport').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalIdExport").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('.selectProductIdExport').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProductIdExport").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.stockCodeSelection').select2({
    placeholder: "Select Stock Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".stockCodeSelection").parent(),
  });

  $('.selectSubDId').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSubDId").parent(),
  });


  $('.selectSubDIdExport').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSubDIdExport").parent(),
  });

  /**
  * TODO: Complete JS doc
  */
  $('.selectVerticalVal').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalVal").parent(),
  });

});

Template.stockUpdateReportBDM.helpers({
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
  getProductList: () => {
    return Template.instance().productListGet.get();
  },
  subDListGet: () => {
    return Template.instance().subDistributorLists.get();
  },
  /**
 * get vertical list */
  getVertical: () => {
    return Template.instance().verticalList.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('stocks');
  },

  stockDataExport: () => {
    return Template.instance().stockExportData.get();
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
* get product name
* @param {} product 
*/
  getProductNames: (product) => {
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
      $('.productIdVals_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVals_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get unit name
* @param {} unit 
*/
  getUnitNames: (unit, stock, id) => {
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
      $('.stockVal_' + id).html(`${stock} (${result})`);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.stockVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  getUserName: (user) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idName", user, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.userIdVal_' + user).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.userIdVal_' + user).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },/**
  /**
  * get branch name
  * @param {} vertical 
  */
  getVerticalName: (vertical) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.idName", vertical, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalIdVal_' + vertical).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalIdVal_' + vertical).html('');
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
    let config = globalOptionsHelper('stocks');
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
  stockList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return result;
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  stockLists: function () {
    return Template.instance().stockNameArray.get();
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
 * get product name
 * @param {} product 
 */
  getStocksUnit: (product, stock, _id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.idBasicUnit", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.stockVal_' + _id).html(`${stock} (${result})`);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.stockVal_' + _id).html(stock);
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
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
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.stockUpdateReportBDM.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockFilter': (event, template) => {
    event.preventDefault();
    let vertical = event.target.selectVerticalId.value;
    let product = event.target.selectProductId.value;
    let subDistributor = event.target.selectSubDId.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let loginVertical = Session.get("loginUserVerticals");
    if (vertical && product === '' && isNaN(fromDate) && isNaN(toDate) && subDistributor === '') {
      Template.instance().pagination.settings.set('filters', {
        vertical: vertical,
      });
    }
    else if (vertical === '' && product && isNaN(fromDate) && isNaN(toDate) && subDistributor === '') {
      Template.instance().pagination.settings.set('filters', {
        product: product,
        vertical: { $in: loginVertical },
      });
    }
    else if (vertical === '' && product === '' && isNaN(fromDate) && isNaN(toDate) && subDistributor) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: subDistributor,
        vertical: { $in: loginVertical },
      });
    }
    else if (vertical && product && isNaN(fromDate) && isNaN(toDate) && subDistributor === '') {
      Template.instance().pagination.settings.set('filters', {
        product: product, vertical: vertical,
      });
    }
    else if (vertical === '' && product && isNaN(fromDate) && isNaN(toDate) && subDistributor) {
      Template.instance().pagination.settings.set('filters', {
        product: product, subDistributor: subDistributor,
        vertical: { $in: loginVertical },
      });
    }
    else if (vertical && product === '' && isNaN(fromDate) && isNaN(toDate) && subDistributor) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: subDistributor,
        vertical: vertical,
      });
    }
    else if (fromDate && isNaN(toDate) && vertical === '' && product === '' && subDistributor === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: fromDate
        }, vertical: { $in: loginVertical },
      });
    }
    else if (toDate && isNaN(fromDate) && vertical === '' && product === '' && subDistributor === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: toDate
        }, vertical: { $in: loginVertical },
      });
    }

    else if (fromDate && toDate && vertical === '' && product === '' && subDistributor === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          }, vertical: { $in: loginVertical },
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          }, vertical: { $in: loginVertical },

        });
      }
    }
    else if (fromDate && toDate && vertical && product === '' && subDistributor === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          vertical: vertical,

        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          },
          vertical: vertical,
        });
      }
    }
    else if (fromDate && toDate && vertical === '' && product && subDistributor === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          product: product,
          vertical: { $in: loginVertical },
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          }, vertical: { $in: loginVertical },
          product: product,
        });
      }
    }
    else if (fromDate && toDate && vertical === '' && product === '' && subDistributor) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          subDistributor: subDistributor,
          vertical: { $in: loginVertical },
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          }, vertical: { $in: loginVertical },
          subDistributor: subDistributor,
        });
      }
    }
    else if (vertical && toDate && fromDate && product && subDistributor === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          vertical: vertical, product: product,
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          },
          vertical: vertical, product: product,
        });
      }
    }
    else if (vertical === '' && toDate && fromDate && product && subDistributor) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          subDistributor: subDistributor, product: product, vertical: { $in: loginVertical },
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          },
          subDistributor: subDistributor, product: product, vertical: { $in: loginVertical },
        });
      }
    }
    else if (vertical && toDate && fromDate && product === '' && subDistributor) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          subDistributor: subDistributor, vertical: vertical,
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          },
          subDistributor: subDistributor, vertical: vertical,
        });
      }
    }
    else if (vertical && toDate && fromDate && product && subDistributor) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          }, product: product,
          subDistributor: subDistributor, vertical: vertical,
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          }, product: product,
          subDistributor: subDistributor, vertical: vertical,
        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
    }
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click #backHome': (event, template) => {
    event.preventDefault();
    FlowRouter.go('stockList');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let date = new Date();
    let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
    let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
    toiDate.setDate(toiDate.getDate() + 1);
    let vertical = Session.get("loginUserVerticals");
    Template.instance().pagination.settings.set('filters', {
      vertical: { $in: vertical },
      createdAt: { $gte: fromiDate, $lt: toiDate }
    });
    $('form :input').val("");
    $("#selectVerticalId").val('').trigger('change');
    $("#selectProductId").val('').trigger('change');
    $("#selectSubDId").val('').trigger('change');
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
  'click #ic-create-stock-button': () => {
    FlowRouter.go('updateStockList');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#stockHeader');
    let stockName = $('#confstockName');
    let stockNameDup = $('#stockNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#stockDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let stockname = $('#stockName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(stockname));
    $(stockName).html(stockname);
    $(stockNameDup).html(stockname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #stockRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('stock.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#stockSuccessModal').modal();
          $('#stockSuccessModal').find('.modal-body').text('Stock inactivated successfully');
        }
        $("#stockDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#stockHeaders');
    let stockName = $('#confstockNames');
    let stockNameDup = $('#stockNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#stockActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let stockname = $('#stockName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(stockname));
    $(stockName).html(stockname);
    $(stockNameDup).html(stockname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #stockActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('stock.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#stockSuccessModal').modal();
          $('#stockSuccessModal').find('.modal-body').text('Stock activated successfully');
        }
        $("#stockActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#stockEditPage').modal();
    template.modalLoader.set(true);
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('stock.id', _id, (err, res) => {
      let stockDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let stockDetailId = _id;
      $(".id").val(stockDetailId);
      $("#stockNameEdits").val(stockDetail.stockName);
      $("#stockCodeEdits").val(stockDetail.stockCode);
      $(header).html('Update Stock');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatestock': (event) => {
    event.preventDefault();
    updatestocklist(event.target);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatestock").each(function () {
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
    let header = $('#stockH');
    let stockName = $('#detailstockName');
    let stockCode = $('#detailstockCode');
    let status = $('#detailStatus');
    $('#stockDetailPage').modal();
    Meteor.call('stock.id', id, (stockError, stockResult) => {
      if (!stockError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(stockResult.stockName));
        if (stockResult.active === "Y") {
          $(status).html("Active");
        }
        else if (stockResult.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(stockName).html(stockResult.stockName);
        $(stockCode).html(stockResult.stockCode);
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
  'click #fileUploadstock': (event, template) => {
    event.preventDefault();
    $("#uploadstock").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#stockUploadHeader');
    $('#selectVerticalVal').val('').trigger('change');
    $('#stockUploadConfirmation').modal();
    $(header).html(' Upload Stock');
  },
  'submit #uploadstock': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let verticalVal = '';
    $('#selectVerticalVal').find(':selected').each(function () {
      verticalVal = ($(this).val());
    });
    let subDistributorVal = Meteor.userId();
    let fileUpload = document.getElementById("uploadstockFile");
    let myFile = $('.uploadstockFile').prop('files')[0];
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
      $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#stockErrorModal').modal();
      $('#stockUploadConfirmation').modal('hide');
      $('#selectVerticalVal').val('').trigger('change');
      $("#uploadstock")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let stockArray = [];
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
          let subDistributor = subDistributorVal;
          let vertical = verticalVal;
          let product = excelRows[i].Product;
          let stock = excelRows[i].Stock;
          if (subDistributor !== undefined && subDistributor !== '' &&
            product !== undefined && product !== '' &&
            stock !== undefined && stock !== '' &&
            vertical !== undefined && vertical !== '') {
            stockArray.push({
              subDistributor: subDistributor, vertical: vertical, product: product, stock: stock.toString()
            });
          }
        }
      }
      else {
        $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#stockErrorModal').modal();
        $('#stockUploadConfirmation').modal('hide');
        $('#selectVerticalVal').val('').trigger('change');
        $("#uploadstock")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (stockArray.length !== 0 && stockArray !== undefined) {
        $('#stockUploadConfirmation').modal('hide');
        return Meteor.call('stock.createUpload', stockArray, (error, result) => {
          if (error) {
            $('#stockErrorModal').find('.modal-body').text(error.reason);
            $('#stockErrorModal').modal();
            $('#stockUploadConfirmation').modal('hide');
            $('#selectVerticalVal').val('').trigger('change');
            $("#uploadstock")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#stockUploadConfirmation').modal('hide');
            $("#uploadstock")[0].reset();
            $('#stockSuccessModal').find('.modal-body').text(` Stock has been updated successfully (${stockArray.length} Nos)`);
            $('#stockSuccessModal').modal();
            $('#selectVerticalVal').val('').trigger('change');
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#stockErrorModal').modal();
        $('#stockUploadConfirmation').modal('hide');
        $('#selectVerticalVal').val('').trigger('change');
        $("#uploadstock")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #stockFileClose': (event, template) => {
    $("#uploadstock").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadstock': (event, template) => {
    event.preventDefault();
    let data = [{
      Product: '', Stock: ''
    }];
    dataCSV = data.map(element => ({
      'Product': '',
      'Stock': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "stockFormat.xls");
  },
  'change .uploadstockFile': function (event, template) {
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
      active: "Y"
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "N"
    });
  },
  /**
    * 
    * @param {*} event 
    * @param {*} template 
    */
  'click .export': (event, template) => {
    event.preventDefault();
    $('#deliveryExportH').html('Export Data');
    $('.startDate1').val('');
    $('.endDate1').val('');
    $('#stockExport').modal();
    $('#selectVerticalIdExport').val('').trigger('change');
    $('#selectProductIdExport').val('').trigger('change');
    $('#selectSubDIdExport').val('').trigger('change');
    template.stockExportData.set('');
  },
  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let vertical = '';
    let product = '';
    let subDistributor = '';
    $('#selectVerticalIdExport').find(':selected').each(function () {
      vertical = $(this).val();
    });
    $('#selectProductIdExport').find(':selected').each(function () {
      product = $(this).val();
    });
    $('#selectSubDIdExport').find(':selected').each(function () {
      subDistributor = $(this).val();
    });
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD"));
    let loginVertical = Session.get("loginUserVerticals");
    toDates.setDate(toDates.getDate() + 1);
    template.stockExportData.set('');
    template.modalLoader.set(true);
    Meteor.call('stockInvoices.exportDataBDM', vertical, product, subDistributor, loginVertical, fromDate, toDates, (err, res) => {
      if (!err) {
        template.modalLoader.set(false);
        if (res.length === 0) {
          setTimeout(function () {
            $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');
          }, 3000);
        } else {
          template.stockExportData.set(res);
        }
      }
      else {
        template.modalLoader.set(false);
      }
    });
  },
  /**
 * TODO:Complete JS doc
 */
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#stockExport').modal('hide');
    let exportData = Template.instance().stockExportData.get();
    if (exportData.length === 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#exportButtons").prop('disabled', true);
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

            saveAs(file, "Stock Updates Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('#selectVerticalIdExport').val('').trigger('change');
        $('#selectProductIdExport').val('').trigger('change');
        $('.startDate1').val('');
        $('.endDate1').val('');
      }, 5000);
    }
  },

  'change #selectVerticalIdExport': (event, template) => {
    event.preventDefault();
    $('#selectProductIdExport').val('').trigger('change');
    $('#selectSubDIdExport').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
    template.stockExportData.set('');
  },
  'change #selectProductIdExport': (event, template) => {
    event.preventDefault();
    $('.startDate1').val('');
    $('.endDate1').val('');
    template.stockExportData.set('');
  },
  'change #selectSubDIdExport': (event, template) => {
    event.preventDefault();
    $('#selectProductIdExport').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
    template.stockExportData.set('');
  },
});