/**
 * @author Greeshma
 */

import { Order } from "../../../api/order/order";
import { Meteor } from 'meteor/meteor';

let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);
Template.orderApprove.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.modalLoader = new ReactiveVar();

  //new 
  this.orderId = new ReactiveVar();
  this.orderLists = new ReactiveVar();
  this.routeList = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.itemArrayList1 = new ReactiveVar();
  //--------------
  this.modalLoader = new ReactiveVar();
  this.getOutletArray = new ReactiveVar();
  this.getVerticalArray = new ReactiveVar();
  this.productListArray = new ReactiveVar();
  this.unitList = new ReactiveVar();
  this.stockGets = new ReactiveVar();
  this.itemArray = new ReactiveVar();
  this.productListGet = new ReactiveVar()
  this.productsArray = new ReactiveVar();
  this.sdusersList = new ReactiveVar();
  this.grandTotalAmt = new ReactiveVar();;
  this.taxtTotalAmt = new ReactiveVar();
  this.outletListGet = new ReactiveVar();
  this.verticalEdit = new ReactiveVar();
  this.outletEdit = new ReactiveVar();
  this.sdUserEdit = new ReactiveVar();
  this.outletListVar = new ReactiveVar();
    this.userListVar = new ReactiveVar();
  //--------------

  this.pagination = new Meteor.Pagination(Order, {
    filters: {
      status: "Pending",
      subDistributor: Meteor.userId()
    },
    sort: { createdAt: -1 },
    fields: {
      sdUser: 1,
      vertical: 1,
      outlet: 1,
      createdAt: 1,
      docTotal: 1
    },
    perPage: 20
  });
});
Template.orderApprove.onRendered(function () {
  // this.itemArray.set('');
  $('#loadersSpinVals').css('display', 'block');
  if (Meteor.user()) {
    Meteor.call('order.list', Meteor.userId(), (err, res) => {
      if (!err) {
        this.orderLists.set(res);
      };
    });
  }
  $('.routenameSelect').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".routenameSelect").parent(),
  });

  $('.selectVertical').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVertical").parent(),
  });

  $('.orderUpStatus').select2({
    placeholder: "Select Status",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".orderUpStatus").parent(),
  });
  $('.outletName').select2({
    placeholder: "Select Outlet",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletName").parent(),
  });
  if (Meteor.userId()) {
    Meteor.call('routeGroup.sdWiselist', Meteor.userId(), (err, res) => {
      if (!err) {
        this.routeList.set(res);
      };
    });
    Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
  }
  Meteor.call('outlet.lis', (err, res) => {
    if (!err) {
      this.getOutletArray.set(res);
    }
  });
  Meteor.call('verticals.list', (err, res) => {
    if (!err) {
      this.getVerticalArray.set(res);
    }
  });
  Meteor.call('outlet.sdBase',Meteor.userId(), (err, res) => {
    if (!err) {
      this.outletListVar.set(res);
    }
  });
  Meteor.call('user.sdUserDataList', Meteor.userId(), (err, res) => {
    if (!err) {
    this.userListVar.set(res);
    }
  });
  $('.selectVertical1').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVertical1").parent(),
  });
  $('.selectOutlet1').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutlet1").parent(),
  });
  $('.selectProduct1').select2({
    placeholder: "Select Product Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProduct1").parent(),
  });
  $('.selectUnits1').select2({
    placeholder: "Select Units Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnits1").parent(),
  });

  $('.selectSDName').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName").parent(),
  });
});
Template.orderApprove.helpers({

  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
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
  orders: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#loadersSpinVals').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
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
   */
  sortIcon: () => {
    genericSortIcons();
  },
  /**
    * TODO:Complete JS doc
    * @param docDate
    */
  date: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },/**
     * TODO:Complete JS doc
     * @param docDate
     */
  date1: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
     * TODO:Complete JS doc
     * @param docDueDate
     */
  dates: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YYYY');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },
  datesVal: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YYYY hh:mm:ss A');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },

  /**
    * TODO:Complete JS doc
    * @param docStatus
    */
  status: (docStatus) => {
    if (docStatus === 'C') {
      return 'Closed';
    }
    else if (docStatus === 'O') {
      return 'Open';
    }
    else if (docStatus === 'R') {
      return 'Rejected';
    }
    else {
      return '';
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
  sdUserHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("order.idSdName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.sdUserVal_' + id).html(result);
      $('#loadersSpinVals').css('display', 'none');

    }
    ).catch((error) => {
      $('.sdUserVal_' + id).html('');
      $('#loadersSpinVals').css('display', 'none');

    });
  },
  verticalHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.id", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let verticalname = result.verticalName;
      $('.verticalVal_' + id).html(verticalname);
      $('#loadersSpinVals').css('display', 'none');

    }
    ).catch((error) => {
      $('.verticalVal_' + id).html('');
      $('#loadersSpinVals').css('display', 'none');

    });
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
      $('#loadersSpinVals').css('display', 'none');

    }
    ).catch((error) => {
      $('.outletVal_' + id).html('');
      $('#loadersSpinVals').css('display', 'none');

    });
  },
  getproductHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('product.idName', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productVal_' + id).html(result);
      $('#loadersSpinItems').css('display', 'none');
    }
    ).catch((error) => {
      $('.productVal_' + id).html('');
      $('#loadersSpinItems').css('display', 'none');
    });
  },
  getunitHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('unit.id', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.unitVal_' + id).html(result.unitName);
      $('#loadersSpinItems').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitVal_' + id).html('');
      $('#loadersSpinItems').css('display', 'none');
    });
  },

  orderLis: function () {
    return Template.instance().orderLists.get();

  },
  routeLists: function () {
    return Template.instance().routeList.get();

  },
  outletList: function () {
    return Template.instance().outletListVar.get();

  },
  userList: function () {
    return Template.instance().userListVar.get();
  },
  verticalLists: function () {
    return Template.instance().verticalList.get();

  }, items: () => {
    return Template.instance().itemsDetailsList.get();
  },
  itemArrayList2: function () {
    let val = Template.instance().itemArrayList1.get();
    return val;
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
  getProductList: () => {
    return Template.instance().productListArray.get();
  }, getUnitList: () => {
    let unitId = Template.instance().unitList.get();
    if (unitId) {
      Meteor.setTimeout(function () {
        $('#selectUnits1').val(unitId[0]._id).trigger('change');
      }, 100);
    }
    return Template.instance().unitList.get();
  }, itemArrayList: function () {
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
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html('');
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

    }
    ).catch((error) => {
      $('.unitNameVal_' + unit).html('');
    }
    );
  }, digitSeperator: (digit) => {
    let res = Number(digit).toFixed(2);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
});
let itemArray = [];
Template.orderApprove.events({
  /** 
 * TODO:Complete JS doc
 * @param event
 */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.itemsDetailsList.set('');
    template.orderId.set(id);
    let header = $('#orderH');
    let sdUser = $('#sdUser');
    let vertical = $('#vertical');
    let outlet = $('#outlet');
    let createdAt = $('#createdAt');
    let taxAmount = $('#taxAmount');
    let totalAmt = $('#totalAmt');
    let discountAmtData = $('#discountAmtData');
    $('#orderDetailPage').modal();
    $('#loadersSpinItems').css('display', 'block');
    template.modalLoader.set(true);
    Meteor.call('order.orderData', id, (error, res) => {
      if (!error) {
        template.modalLoader.set(false);
        let order = res.orderList;
        if (res.orderList.itemArray !== undefined && res.orderList.itemArray.length > 0) {
          template.itemsDetailsList.set(order.itemArray);
        }
        else {
          $('#loadersSpinItems').css('display', 'none');
        }
        template.orderId.set(id);
        $(header).html('Details of Order');
        $(sdUser).html(res.sdName);
        $(vertical).html(res.verticalName);
        $(outlet).html(res.outletName);
        $(route).html(res.routeName);
        $(createdAt).html(moment(order.createdAt).format('DD-MM-YYYY hh:mm A'));
        $(taxAmount).html(order.taxAmount);
        $(totalAmt).html(order.docTotal);
        $("#sdUserid").val(order.sdUser);
        $("#outletid").val(order.outlet);
        $(discountAmtData).html(Number(order.discountAmt).toFixed(2));
      }
    });
  },/**
* TODO: Complete JS doc
* @param event
* for updating quotation status
*/
  'submit .statusUpdate': (event, template) => {
    event.preventDefault();
    let target = event.target;
    $("#orderDetailPage").modal('hide');
    let orderId = Template.instance().orderId.get();
    let status = target.orderUpStatus.value;
    let remarks = target.orderUpRemark.value;
    let outlet = target.outletid.value;
    let assigned_to = target.sdUserid.value;
    if (status === 'Approved') {
      Meteor.call('firebase:pushNotification', orderId, 'Order Approved', 'New Order Approved', 'orderApproval');
      Meteor.call('order.approve', orderId, remarks, outlet, assigned_to, (error) => {
        if (error) {
          $('#message').html("Internal error - unable to approve entry. Please try again");
          template.orderId.set('');
          $('#orderUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        } else {
          $('#orderSuccessModal').find('.modal-body').text('Order Approved Successfully');
          $('#orderSuccessModal').modal();
          template.orderId.set('');
          $('#orderUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        }

      });
    }
    else {
      Meteor.call('firebase:pushNotification', orderId, `Order ${status}`, `New Order ${status}`, 'orderApproval');
      Meteor.call('order.statusUpdate', orderId, remarks, status, (error) => {
        if (error) {
          $('#message').html("Internal error - unable to approve entry. Please try again");
          template.orderId.set('');
          $('#orderUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        } else {
          $('#orderSuccessModal').find('.modal-body').text('Order Status Updated Successfully');
          $('#orderSuccessModal').modal();
          template.orderId.set('');
          $('#orderUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        }

      });
    }
  },
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .order-filter': (event) => {
    event.preventDefault();
    let vertical = event.target.selectVertical.value;
    let route = event.target.routenameSelect.value;
    let outletName = event.target.outletName.value;
    let sdUser = event.target.selectSDName.value;
    let fromDate =$("#fromDate").val();
    let toDate = $("#toDate").val();
    
    if (fromDate === '' && toDate === '' ) {
        toastr['error']("Please fill up Dates");
        return;
    }
    fromDate = new Date(moment(fromDate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    toDate = new Date(moment(toDate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    toDate.setDate(toDate.getDate()+1);
    if(vertical && route==='' && outletName==='' && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if(vertical==='' && route && outletName==='' && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if(vertical==='' && route==='' && outletName && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          outlet:outletName,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical==='' && route==='' && outletName==='' && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical && route && outletName==='' && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          routeId: route, 
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical && route==='' && outletName && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          outlet:outletName,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical && route==='' && outletName==='' && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical==='' && route && outletName && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          outlet:outletName,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical==='' && route && outletName==='' && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical==='' && route==='' && outletName && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          outlet:outletName,
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical && route && outletName && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          routeId: route, 
          outlet:outletName,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical && route==='' && outletName && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          outlet:outletName,
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical && route && outletName==='' && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          routeId: route, 
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical==='' && route && outletName && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          outlet:outletName,
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical && route && outletName && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          routeId: route, 
          outlet:outletName,
          sdUser:sdUser,
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else{
        Template.instance().pagination.settings.set('filters',
        {
          status: "Pending",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
  },
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      status: "Pending",
      subDistributor: Meteor.userId()
    });
    $('form :input').val("");
    $('#selectVertical').val('').trigger('change');
    $('#routenameSelect').val('').trigger('change');
    $('#selectSDName').val('').trigger('change');
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  'click .orderEdit': (event, template) => {
    event.preventDefault();
    itemArray = [];
    let id = event.currentTarget.id;
    template.itemArrayList1.set('');
    template.verticalEdit.set('');
    template.outletEdit.set('')
    template.sdUserEdit.set('');
    $('#discountAmtEdit').val('0');
    $("#ic-update-Order").modal();
    template.modalLoader.set(true);
    Meteor.call('order.orderData', id, (error, res) => {
      if (!error) {
        let orderList = res.orderList;
        template.modalLoader.set(false);
        template.itemArray.set(orderList.itemArray);
        // $('#selectVertical1').val(orderList.vertical).trigger('change');
        // $('#selectOutlet1').val(orderList.outlet).trigger('change');
        template.verticalEdit.set(orderList.vertical);
        template.outletEdit.set(orderList.outlet);
        template.sdUserEdit.set(orderList.sdUser);
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
    template.modalLoader.set(false);
    // $('#unitQuantityShows').html('');
    // $('#avaliStaockShow').html('');
    let vertical = '';
    $('#selectVertical1').find(':selected').each(function () {
      vertical = $(this).val();
    });
    if (vertical !== '' && vertical !== undefined) {
      // template.modalLoader.set(true);
      Meteor.call('price.cashSalesSd', vertical, Meteor.userId(), (err, res) => {

        if (!err) {
          template.productListArray.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.productListArray.set('');
          template.modalLoader.set(false);
        }
      })
    }
    $("#selectProduct1").val('').trigger('change');
    $('#selectUnits1').val('').trigger('change');
    $('#stockData').val('');
  },
  'change #selectProduct1': (event, template) => {
    event.preventDefault();
    let product = '';
    $('#selectProduct1').find(':selected').each(function () {
      product = $(this).val();
    });
    template.unitList.set('');
    if (product !== undefined && product !== '') {
      template.modalLoader.set(true);
      Meteor.call('unit.unitCodeGet', product, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.unitList.set(res);
          $("#selectUnits1").val(res[0]._id).trigger('change');
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }

    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
  },
  'change #selectUnits1': (event, template) => {
    event.preventDefault();
    let product = '';
    let unit = '';
    let vertical = '';
    let sdUser = Template.instance().sdUserEdit.get();
    let channelval = Session.get("sdUserChannel");
    baseQuantity = '';
    $('#selectVertical1').find(':selected').each(function () {
      vertical = $(this).val();
    });
    $('#selectProduct1').find(':selected').each(function () {
      product = $(this).val();
    });
    $('#selectUnits1').find(':selected').each(function () {
      unit = $(this).val();
    });
    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
    $('#priceVals1').val('');
    template.stockGets.set('');
    if (unit !== undefined && unit !== '' && vertical !== '' && vertical !== undefined && product !== '' && product !== undefined) {
      template.modalLoader.set(true);
      Meteor.call('unit.priceCalEdit', product, unit, vertical, Meteor.userId(), sdUser, (err, res) => {
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
  'click .addItem': (event, template) => {
    event.preventDefault();
    let product = '';
    let unit = '';
    let priceVal = '';
    let quantity = '';
    let itemChecks = false;
    baseQuantity;
    $('#selectProduct1').find(':selected').each(function () {
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
      $('#selectUnits1').find(':selected').each(function () {
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
              $(".selectVertical").prop("disabled", true);
              amountShowingFn();
            }
          }
          // for showing amount
          function amountShowingFn() {
            $("#selectProduct1").val('').trigger('change');
            $('#selectUnits1').val('').trigger('change');
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
  'submit .addCashSales': (event, template) => {
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
      createOrUpdateOrders1(event.target, productsArray, vertical, grandTotal,
        taxTotal, outlet, discountVal);
      $('#ic-update-Order').modal('hide');
      dataClear();
      function dataClear() {
        $('#orderUpdate').each(function () {
          this.reset();
        });

        $("#selectProduct1").val('').trigger('change');
        $('#selectUnits1').val('').trigger('change');
        $("#selectVertical1").val('').trigger('change');
        $("#selectOutlet1").val('').trigger('change');
        $('.amtShowDiv').css('display', 'none');
        $(".selectVertica1l").prop("disabled", false);
      }

    }
  },
  'click .itemDelete1': (event, template) => {
    let itemArrays1 = Template.instance().itemArrayList2.get();
    let itemIndex = event.currentTarget.id;
    let selected = itemArrays1.filter(function (e) {
      return e.randomId === itemIndex;
    });
    let removeIndex = itemArrays1.map(function (item) {
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

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
