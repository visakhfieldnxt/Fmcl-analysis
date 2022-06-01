/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Order } from "../../../api/order/order";
import XLSX from 'xlsx';

Template.order.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.stockNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.stockIdList = new ReactiveVar();
  // new 
  this.itemArrayList1 = new ReactiveVar();
  this.itemArrayList = new ReactiveVar();
  this.itemArray = new ReactiveVar();
  this.getOutletArray = new ReactiveVar();
  this.getVerticalArray = new ReactiveVar();
  this.productListSdArray = new ReactiveVar();
  this.unitList = new ReactiveVar();
  this.stockGets = new ReactiveVar();
  this.grandTotalAmt = new ReactiveVar();
  this.taxtTotalAmt = new ReactiveVar();
  this.verticalEdit = new ReactiveVar();
  this.outletEdit = new ReactiveVar();
  this.deliveryDetails = new ReactiveVar();
  this.routeListAp = new ReactiveVar();
  this.outletListsAp1 = new ReactiveVar();
  this.orderIdVar = new ReactiveVar();

  this.pagination = new Meteor.Pagination(Order, {
    filters: {
      createdBy: Meteor.userId()
    },
    sort: { createdAt: -1 },
    fields: {
      outlet: 1,
      docDate: 1,
      createdAt: 1,
      docNum: 1,
      status: 1,
      vertical: 1,
      docTotal: 1
    },
    perPage: 20
  });
});

Template.order.onRendered(function () {
  $('.selectOutlet1').select2({
    placeholder: "Select Outlet",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutlet1").parent(),
  });
  $('.selectProductEdit').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProductEdit").parent(),
  });
  $('.selectUnitss').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnitss").parent(),
  });
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
  $('.selectVertical1').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVertical1").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.stocktransferIdval').select2({
    placeholder: "Select Stock Transfer Id",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".stocktransferIdval").parent(),
  });  

  $('.orderIdClass').select2({
    placeholder: "Select Order Id",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".orderIdClass").parent(),
  });  

  $('.outletClass').select2({
    placeholder: "Select Outlet Id",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletClass").parent(),
  });  

  $('.routeClass').select2({
    placeholder: "Select Route Id",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".routeClass").parent(),
  });
  Meteor.call('outlet.sdUseWiseList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.outletListsAp1.set(res);
      };
    });
  Meteor.call('order.orderIdVarList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.orderIdVar.set(res);
      };
    });

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
  Meteor.call('product.activeList', (err, res) => {
    if (!err) {
      this.productListGet.set(res);
    }
  });
  if (Meteor.user()) {
    Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
    Meteor.call('stockTransfer.idList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.stockIdList.set(res);
      }
    });
  }

  // editOrderOnrendered

  Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.verticalList.set(res);
      $('#bodySpinLoaderVal').css('display', 'none');
    }
    else {
      $('#bodySpinLoaderVal').css('display', 'none');
    }
  });
  /**
   * vertical list of sd user
   */
  Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.getVerticalArray.set(res);
      $('#bodySpinLoaderVal').css('display', 'none');
    }
    else {
      $('#bodySpinLoaderVal').css('display', 'none');
    }
  });
  /**
   * outlet list of sd user
   */
  let channelval = Session.get("sdUserChannel");
  // if (channelval === "VSR") {
  //   Meteor.call('outlet.sdUsersList', Meteor.userId(), (err, res) => {
  //     if (!err) {
  //       this.getOutletArray.set(res);
  //     }
  //   });
  // }
  // else {
  Meteor.call('outlet.fullLists', Meteor.userId(), (err, res) => {
    if (!err) {
      this.getOutletArray.set(res);
    }
  });
  // }

    Meteor.call('routeGroup.assignedList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.routeListAp.set(res);
      };
    });
});

Template.order.helpers({
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
* get vertical list */
  getVertical: () => {
    return Template.instance().verticalList.get();
  },/**
   * 
   * @returns product list
   */
  getProductList: () => {
    return Template.instance().productListGet.get();
  },
  statCheck: (routeStatus) => {
    if (routeStatus === 'Pending') {
      return '<span class="blueStatus"><span class="blueDot"></span>Not Approved</span>'
    }
    else if (routeStatus === 'Approved') {
      return '<span class="greenStatus"><span class="greenDot"></span>Approved</span>'
    }
    else if (routeStatus === 'Rejected') {
      return '<span class="redStatus"><span class="redDot"></span>Rejected</span>'
    }
    else if (routeStatus === 'On Hold') {
      return '<span class="orangeStatus"><span class="orangeDot"></span>On Hold</span>'
    }
    else {
      return '';
    }
  },
  /**
   * 
   * @returns order edit check
   */
  orderEditCheck: (status) => {
    if (status === 'Pending') {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * get stock transfer id
   */
  stocktransferIdList: () => {
    return Template.instance().stockIdList.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('stocks');
  },
  productListGets: () => {
    return Template.instance().itemsDetailsList.get();
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
      $('#loadersSpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVals_' + product).html('');
      $('#loadersSpinVal').css('display', 'none');
    }
    );
  },
  /**
* get product name
* @param {} id 
*/
  getProductCount: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("stockTransferIssued.idCount", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.prouctCounts_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.prouctCounts_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get vansale user name
*/

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
  },
  /**
* get unit name
* @param {} unit 
*/
  getUnitNames: (unit) => {
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
      $('.unitNameVals_' + unit).html(`(${result})`);
      $('#loadersSpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitNameVals_' + unit).html('');
      $('#loadersSpinVal').css('display', 'none');
    }
    );
  },
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
  outletHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("outlet.idName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletVal_' + id).html(result);

    }
    ).catch((error) => {
      $('.outletVal_' + id).html('');

    });
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
  orderLists: function () {
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
  orderListss: function () {
    return Template.instance().stockNameArray.get();
  },
  outletLisAp1: function () {
    return Template.instance().outletListsAp1.get();

  },
  orderIdList: function () {
    return Template.instance().orderIdVar.get();

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
  * TODO:Complete JS doc
  * @param docDate
  */
  dateFormat: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
* get delivery details
*/
  deliveryDetails: () => {
    let res = Template.instance().deliveryDetails.get();
    return res;
  },
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },

  dateFormates: (date) => {
    return moment(date).format('hh:mm A')
  },
  /**
   * 
   * @param {*} arrays 
   * @returns check not found condition
   */
  lenthCheck: (arrays) => {
    if (arrays !== undefined && arrays.length > 0) {
      return true;
    }
    else {
      return false;
    }
  },
  // editOrderHelper
  getOutletorder: () => {
    let outletId = Template.instance().outletEdit.get();
    if (outletId) {
      Meteor.setTimeout(function () {
        $('#selectOutlet1').val(outletId).trigger('change');
      }, 100);
    }
    return Template.instance().getOutletArray.get();
  },
  getVerticalorder: () => {
    let verticalId = Template.instance().verticalEdit.get();
    if (verticalId) {
      Meteor.setTimeout(function () {
        $('#selectVertical1').val(verticalId).trigger('change');
      }, 100);
    }
    return Template.instance().getVerticalArray.get();
  },
  getProductListSd: () => {
    return Template.instance().productListSdArray.get();
  },
  getUnitList: () => {
    let unitId = Template.instance().unitList.get();
    if (unitId) {
      Meteor.setTimeout(function () {
        $('#selectUnitss').val(unitId[0]._id).trigger('change');
      }, 100);
    }
    return Template.instance().unitList.get();
  },
  itemArrayList: function () {
    return Template.instance().itemArray.get();
  }, getProductName: (product) => {
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
      $('#loadersSpinValEdit').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html('');
      $('#loadersSpinValEdit').css('display', 'none');
    }
    );
  }, getUnitName: (unit) => {
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
      $('#loadersSpinValEdit').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitNameVal_' + unit).html('');
      $('#loadersSpinValEdit').css('display', 'none');
    }
    );
  }, digitSeperator: (digit) => {
    let res = Number(digit).toFixed(2);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  routeListsAp: function () {
    return Template.instance().routeListAp.get();

  }
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
let itemArray = [];
Template.order.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockFilter': (event) => {
    event.preventDefault();
    let vertical = '';
    let uniqueId = '';
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let orderIdClass = event.target.orderIdClass.value;
    let outletClass = event.target.outletClass.value;
    let routeClass = event.target.routeClass.value;

    if(first ==='' && second ===''){
      toastr['error']('Please fill Date');
      return;
    }
    toDate.setDate(toDate.getDate() + 1);

    if(orderIdClass && outletClass==='' && routeClass==='' && toDate && fromDate){
      Template.instance().pagination.settings.set('filters', {
          docNum:orderIdClass,
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });
    }else if(orderIdClass==='' && outletClass && routeClass==='' && toDate && fromDate){
      Template.instance().pagination.settings.set('filters', {
          outlet:outletClass,
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });
    }else if(orderIdClass==='' && outletClass==='' && routeClass && toDate && fromDate){
        Template.instance().pagination.settings.set('filters', {
          routeId:routeClass,
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });
    }else if(orderIdClass && outletClass && routeClass==='' && toDate && fromDate){
        Template.instance().pagination.settings.set('filters', {
          docNum:orderIdClass,
          outlet:outletClass,
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });
    }else if(orderIdClass && outletClass==='' && routeClass && toDate && fromDate){
        Template.instance().pagination.settings.set('filters', {
          docNum:orderIdClass,
          routeId:routeClass,
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });
    }else if(orderIdClass==='' && outletClass && routeClass && toDate && fromDate){
        Template.instance().pagination.settings.set('filters', {
          outlet:outletClass,
          routeId:routeClass,
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });
    }else if(orderIdClass==='' && outletClass==='' && routeClass==='' && toDate && fromDate){
      Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });
    }else if(orderIdClass && outletClass && routeClass && toDate && fromDate){
        Template.instance().pagination.settings.set('filters', {
          docNum:orderIdClass,
          outlet:outletClass,
          routeId:routeClass,
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          createdBy: Meteor.userId()
        });

    }else{
      Template.instance().pagination.settings.set('filters', {
          createdBy: Meteor.userId()
        });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      createdBy: Meteor.userId()
    });
    $('form :input').val("");
    $("#selectVerticalId").val('').trigger('change');
    $('.taskHeaderList').css('display', 'inline');
    $("#stocktransferIdval").val('').trigger('change');
    $("#orderIdClass").val('').trigger('change');
    $("#outletClass").val('').trigger('change');
    $("#routeClass").val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-order-button': () => {
    let channelval = Session.get("sdUserChannel");
    if (channelval === "VSR") {
      Meteor.call("routeAssign.checkRoute", Meteor.userId(), (err, res) => {
        if (!err) {
          if (res.length > 0) {
            FlowRouter.go('createOrder');
          }
          else {
            toastr['error']('Route Not Assigned !');
          }
        }
      });
    }
    else {
      FlowRouter.go('createOrder');
    }
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
    updateorderLists(event.target);
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
    let header = $('#orderViewHeader');
    let saleId = $('#saleId');
    let detailvertical = $('#detailvertical');
    let detailRoute = $('#detailRoute');
    let detailOutletName = $('#detailOutletName');
    let detailDate = $('#detailDate');
    let detailEmp = $('#detailEmp');
    let detailGSTs = $('#detailGSTs');
    let detailStatus = $('#detailStatus');
    let detailDocTotals = $('#detailDocTotals');
    let discountAmtData = $('#discountAmtData');
    template.deliveryDetails.set('');
    template.itemsDetailsList.set('');
    $('#directSaleDetails').modal();
    $('#loadersSpinVal').css('display', 'block');
    Meteor.call('order.id', id, (err, res) => {
      if (!err) {
        template.modalLoader.set(false);
        $(header).html('Order Details');
        if (res.orderData.docNum !== undefined && res.orderData.docNum !== '') {
          $(saleId).html(res.orderData.docNum);
        }
        else {
          $(saleId).html('');
        }
        $(detailvertical).html(res.verticalName);
        $(detailDate).html(res.orderData.docDate);
        $(detailRoute).html(res.routeIdName);
        $(detailOutletName).html(res.outletName);
        $(detailEmp).html(res.sdName);
        $(detailStatus).html(res.orderData.status);
        $(detailGSTs).html(res.orderData.taxAmount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(detailDocTotals).html(res.orderData.docTotal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        if (res.orderData.itemArray !== undefined && res.orderData.itemArray.length > 0) {
          template.itemsDetailsList.set(res.orderData.itemArray);
        }
        if (res.orderData.status === 'Delivered') {
          template.deliveryDetails.set(res.orderData);
          console.log("res.orderData", res.orderData);
        }
        $(discountAmtData).html(Number(res.orderData.discountAmt).toFixed(2));
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('stock.orderLists', (stockError, stockResult) => {
      if (!stockError) {
        template.stockNameArray.set(stockResult);
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
  'click #fileUploadstock': (event, template) => {
    event.preventDefault();
    $("#uploadstock").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#stockUploadHeader');
    $('#stockUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadstock': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
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
          let subDistributor = excelRows[i].SubDistributor;
          let vertical = excelRows[i].Vertical;
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
            $("#uploadstock")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#stockUploadConfirmation').modal('hide');
            $("#uploadstock")[0].reset();
            $('#stockSuccessModal').find('.modal-body').text(` Stock has been updated successfully (${stockArray.length} Nos)`);
            $('#stockSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#stockErrorModal').modal();
        $('#stockUploadConfirmation').modal('hide');
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
      SubDistributor: '', Vertical: '', Product: '', Stock: ''
    }];
    dataCSV = data.map(element => ({
      'SubDistributor': '',
      'Vertical': '',
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

  // editOrderEvent starts
  'click .orderEdit': (event, template) => {
    event.preventDefault();
    itemArray = [];
    let id = event.currentTarget.id;
    template.itemArrayList1.set('');
    template.verticalEdit.set('');
    template.outletEdit.set('')
    template.modalLoader.set(true);
    $('#discountAmtEdit').val('0');
    $("#ic-update-Order").modal();
    $('#loadersSpinValEdit').css('display', 'block');
    Meteor.call('order.orderData', id, (error, res) => {
      if (!error) {
        let orderList = res.orderList;
        template.itemArray.set(orderList.itemArray);
        template.verticalEdit.set(orderList.vertical);
        template.outletEdit.set(orderList.outlet);
        template.modalLoader.set(false);
        $('#orderIdEdit').val(orderList._id);
        $('#discountAmtEdit').val(orderList.discountAmt);
        for (let n = 0; n < orderList.itemArray.length; n++) {
          itemArray.push(orderList.itemArray[n]);
        }
        amountShowingFn1(orderList);
      }
      else {
        template.modalLoader.set(false);
      }
    });
    function amountShowingFn1(orderList) {
      itemChecks = false;
      let taxAdd = 0;
      for (let l = 0; l < itemArray.length; l++) {
        taxAdd += Number(itemArray[l].quantity) * Number(itemArray[l].taxRate); //change
      }
      let totalP = 0;
      for (let l = 0; l < itemArray.length; l++) {
        totalP += Number(itemArray[l].salesPrice * itemArray[l].quantity); //change
      }
      let discountedAmt = Number(totalP) - Number(orderList.discountAmt);
      let taxFixed = parseFloat(taxAdd).toFixed(2);
      template.grandTotalAmt.set(discountedAmt.toFixed(2));
      template.taxtTotalAmt.set(taxFixed);
      $('.amtShowDiv').css('display', 'inline');
      $('#taxAdded').html(taxFixed);
      $('#total').html(discountedAmt.toFixed(2));
      $('#discountAmtValEdit').html(Number(orderList.discountAmt).toFixed(2));
    }
  },

  'change #selectVertical1': (event, template) => {
    event.preventDefault();
    // template.modalLoader.set(false);
    // $('#unitQuantityShows').html('');
    // $('#avaliStaockShow').html('');
    let vertical = '';
    $('#selectVertical1').find(':selected').each(function () {
      vertical = $(this).val();
    });
    if (vertical !== '' && vertical !== undefined) {
      // template.modalLoader.set(true);
      Meteor.call('price.cashSales', vertical, Meteor.userId(), (err, res) => {
        if (!err) {
          template.productListGet.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.productListGet.set('');
          template.modalLoader.set(false);
        }
      })
    }
    $("#selectProductEdit").val('').trigger('change');
    $('#selectUnitss').val('').trigger('change');
    $('#stockData1').val('');
  },
  'change #selectProductEdit': (event, template) => {
    event.preventDefault();
    let product = '';
    $('#selectProductEdit').find(':selected').each(function () {
      product = $(this).val();
    });
    template.unitList.set('');
    if (product !== undefined && product !== '') {
      template.modalLoader.set(true);
      Meteor.call('unit.unitCodeGet', product, (err, res) => {
        if (!err) {
          console.log(res[0]._id);
          template.modalLoader.set(false);
          template.unitList.set(res);
          $("#selectUnitss").val(res[0]._id).trigger('change');
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }

    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
  },
  'change #selectUnitss': (event, template) => {
    event.preventDefault();
    let product = '';
    let unit = '';
    let vertical = '';
    let channelval = Session.get("sdUserChannel");
    baseQuantity = '';
    $('#selectVertical1').find(':selected').each(function () {
      vertical = $(this).val();
    });
    $('#selectProductEdit').find(':selected').each(function () {
      product = $(this).val();
    });
    $('#selectUnitss').find(':selected').each(function () {
      unit = $(this).val();
    });
    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
    $('#priceVals1').val('');
    template.stockGets.set('');

    if (unit !== undefined && unit !== '' && vertical !== '' && vertical !== undefined && product !== '' && product !== undefined) {

      template.modalLoader.set(true);
      Meteor.call('unit.priceCal', product, unit, vertical, Meteor.userId(), channelval, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          $('#unitQuantityShows').html(`Base Quantity : ${res.unitRes.baseQuantity}`);
          baseQuantity = res.unitRes.baseQuantity;
          $('#priceVals1').val(Number(res.productPrice).toFixed(2));

          if (res.stockRes !== undefined) {
            if (res.baseUnit !== undefined && res.baseUnit !== '') {
              $('#avaliStaockShow').html(`Stock : ${res.stockRes.stock} (${res.baseUnit})`);
            }
            else {
              $('#avaliStaockShow').html(`Stock : ${res.stockRes.stock}`);
            }
            template.stockGets.set(res.stockRes.stock);
          }
          else {
            $('#avaliStaockShow').html(`Stock : No Stock Available`);
            template.stockGets.set('');
            baseQuantity = '';
          }
        }
        else {
          template.modalLoader.set(false);
          $('#unitQuantityShows').html('');
          $('#avaliStaockShow').html('');
          template.stockGets.set('');
          $('#priceVals1').val('');
          baseQuantity = '';
        }
      });
    }
  },
  'submit .addCashSales1': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#selectVertical1').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let outlet = '';
    $('#selectOutlet1').find(':selected').each(function () {
      outlet = $(this).val();
    });
    let grandTotal = Template.instance().grandTotalAmt.get();
    let taxTotal = Template.instance().taxtTotalAmt.get();
    let productsArray = Template.instance().itemArray.get();
    let discountVal = $('#discountAmtEdit').val();
    if (productsArray.length === 0) {
      toastr['error']('At Least One Product Needed For Adding Order');
    }
    else {
      orderUpdate(event.target, productsArray, vertical, grandTotal,
        taxTotal, outlet, discountVal);
      $('#ic-update-Order').modal('hide');
      dataClear();
      function dataClear() {
        $('#orderUpdate').each(function () {
          this.reset();
        });

        $("#selectProductEdit").val('').trigger('change');
        $('#selectUnitss').val('').trigger('change');
        $("#selectVertical1").val('').trigger('change');
        $("#selectOutlet1").val('').trigger('change');
        $('.amtShowDiv').css('display', 'none');
        $(".selectVertica1l").prop("disabled", false);
      }

    }
  },
  'click .addItem': (event, template) => {
    event.preventDefault();
    let product = '';
    let unit = '';
    let priceVal = '';
    let quantity = '';
    let itemChecks = false;
    baseQuantity;
    $('#selectProductEdit').find(':selected').each(function () {
      product = $(this).val();
    });
    if (product === '' || product === 'Select Product') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#itemArrayspan").html('<style> #itemArrayspan { color:#fc5f5f }</style><span id ="itemArrayspan">Please Select Product</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#itemArrayspan').fadeOut('slow');
      }, 3000);
    } else {
      $('#selectUnitss').find(':selected').each(function () {
        unit = $(this).val();
      });
      if (unit === '' || unit === 'Select Unit') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#unitArrayspan").html('<style> #unitArrayspan { color:#fc5f5f }</style><span id ="unitArrayspan">Please select a Unit</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#unitArrayspan').fadeOut('slow');
        }, 3000);
      } else {
        quantity = $("#quantityVal1").val();

        if (quantity === '' || Number(quantity) <= 0) {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#quantityArrayspan").html('<style> #quantityArrayspan { color:#fc5f5f }</style><span id ="quantityArrayspan">Please enter a valid quantity</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#quantityArrayspan').fadeOut('slow');
          }, 3000);
        } else {
          priceVal = $("#priceVals1").val();
          if (priceVal === '' || Number(priceVal) === 0) {
            $(window).scrollTop(0);
            setTimeout(function () {
              $("#priceArrayspan").html('<style> #priceArrayspans { color:#fc5f5f }</style><span id ="priceArrayspans"> Price Not Found</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#priceArrayspan').fadeOut('slow');
            }, 3000);
          } else {
            $(".addItem").prop('disabled', true);
            Meteor.setTimeout(function () {
              $(".addItem").prop('disabled', false);
            }, 3000);
            if (itemArray.length > 0) {
              for (let i = 0; i < itemArray.length; i++) {
                if (product === itemArray[i].product) {
                  itemChecks = true;
                  toastr['error'](itemAlreadyExistsMessage);
                  break;
                }
                else {
                  itemChecks = false;
                }
              }
            }
            let randomId = Random.id();
            let unitPrices = Number(priceVal);
            let taxRate = Number(unitPrices * 4 / 100);
            let withOutTax = (Number(quantity) * Number(unitPrices)) - taxRate;
            let taxAddAmt = Number(unitPrices) * Number(quantity);
            let salesPrice = Number(unitPrices);
            let taxAmt = taxRate * Number(quantity);
            let transferStockVal = Number(baseQuantity) * Number(quantity);
            let itemObject = {
              randomId: randomId,
              unit: unit,
              unitQuantity: baseQuantity,
              unitPrice: unitPrices.toString(),
              price: unitPrices.toString(),
              salesPrice: salesPrice.toString(),
              withOutTax: withOutTax.toString(),
              grossTotal: taxAddAmt.toString(),
              product: product,
              quantity: quantity,
              taxPerc: '4',
              taxRate: taxRate,
              taxtAmount: taxAmt.toString(),
              transferStockVal: transferStockVal.toString()
            };

            if (itemChecks === false) {
              itemArray.push(itemObject);
              template.itemArray.set(itemArray);
              $(".selectVertical1").prop("disabled", true);
              amountShowingFn();
            }
          }
          // for showing amount
          function amountShowingFn() {
            $("#selectProductEdit").val('').trigger('change');
            $('#selectUnitss').val('').trigger('change');
            $('#quantityVal1').val('').trigger('change');
            $('#discountAmtEdit').val('0');
            $('#discountAmtValEdit').html('0.00');
            itemChecks = false;
            let taxAdd = 0;
            for (let l = 0; l < itemArray.length; l++) {
              taxAdd += Number(itemArray[l].quantity) * Number(itemArray[l].taxRate); //change
            }
            let totalP = 0;
            for (let l = 0; l < itemArray.length; l++) {
              totalP += Number(itemArray[l].salesPrice * itemArray[l].quantity); //change
            }
            let taxFixed = parseFloat(taxAdd).toFixed(2);
            template.grandTotalAmt.set(totalP.toFixed(2));
            template.taxtTotalAmt.set(taxFixed);
            $('.amtShowDiv').css('display', 'inline');
            $('#taxAdded').html(taxFixed);
            $('#total').html(totalP.toFixed(2));
          }
        }
      }
    }
  }, 'click .itemDelete': (event, template) => {
    $('#discountAmtEdit').val('0');
    $('#discountAmtValEdit').html('0.00');
    let itemArrays = Template.instance().itemArray.get();
    let itemIndex = event.currentTarget.id;
    let selected = itemArrays.filter(function (e) {
      return e.randomId === itemIndex;
    });
    let removeIndex = itemArrays.map(function (item) {
      selected = item.randomId;
      return item.randomId;
    }).indexOf(itemIndex);
    itemArray.splice(removeIndex, 1);
    template.itemArray.set(itemArray);
    let productArrays = Template.instance().itemArray.get();
    if (productArrays.length > 0) {
      let taxAdd = 0;
      for (let l = 0; l < productArrays.length; l++) {
        taxAdd += Number(productArrays[l].quantity) * Number(productArrays[l].taxRate); //change
      }
      let totalP = 0;
      for (let l = 0; l < productArrays.length; l++) {
        totalP += Number(productArrays[l].salesPrice * productArrays[l].quantity); //change
      }
      let taxFixed = parseFloat(taxAdd).toFixed(2);
      template.grandTotalAmt.set(totalP.toFixed(2));
      template.taxtTotalAmt.set(taxFixed);
      $('.amtShowDiv').css('display', 'inline');
      $('#taxAdded').html(taxFixed);
      $('#total').html(totalP.toFixed(2));
    }
    else {
      $('.amtShowDiv').css('display', 'none');
      $('#taxAdded').html('');
      $('#total').html('');
      $(".selectVertical").prop("disabled", false);
    }
  },

  // // number validation
  'keypress #discountAmtEdit': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $("#discountAmtEdit").val()
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
  'keyup #discountAmtEdit': (event, template) => {
    let discountAmt = $('#discountAmtEdit').val();
    if (discountAmt !== undefined && discountAmt !== '') {
      let totalP = 0;
      let productArrays = Template.instance().itemArray.get();
      if (productArrays.length > 0) {
        for (let l = 0; l < productArrays.length; l++) {
          totalP += Number(productArrays[l].salesPrice * productArrays[l].quantity); //change
        }
      }
      let discountedAmt = Number(totalP) - Number(discountAmt);
      template.grandTotalAmt.set(discountedAmt.toFixed(2));
      $('#discountAmtValEdit').html(Number(discountAmt).toFixed(2));
      $('#total').html(discountedAmt.toFixed(2));
    }
    else {
      let totalP = 0;
      let productArrays = Template.instance().itemArray.get();
      if (productArrays.length > 0) {
        for (let l = 0; l < productArrays.length; l++) {
          totalP += Number(productArrays[l].salesPrice * productArrays[l].quantity); //change
        }
      }
      let discountedAmt = Number(totalP);
      template.grandTotalAmt.set(discountedAmt.toFixed(2));
      $('#discountAmtValEdit').html('0.00');
      $('#total').html(discountedAmt.toFixed(2));
    }
  }
});