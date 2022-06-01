/**
* @author Nithin
*/

import { Order } from "../../../api/order/order";
import { Meteor } from 'meteor/meteor';

let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);
Template.orderOnHold.onCreated(function () {
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
  this.outletListVar = new ReactiveVar();
  this.userListVar = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Order, {
    filters: {
      status: "On Hold",
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
Template.orderOnHold.onRendered(function () {
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
  $('.outletName').select2({
    placeholder: "Select Outlet",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletName").parent(),
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
  $('.selectSDName').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName").parent(),
  });

});
Template.orderOnHold.helpers({

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
  printLoad: () => {
    return Template.instance().modalLoader.get();
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
  verticalLists: function () {
    return Template.instance().verticalList.get();

  }, items: () => {
    return Template.instance().itemsDetailsList.get();
  },
  outletList: function () {
    return Template.instance().outletListVar.get();

  },
  userList: function () {
    return Template.instance().userListVar.get();
  }
});
Template.orderOnHold.events({
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
    let detailOnHold = $('#detailOnHoldDate');
    let detailRemarks = $('#detailRemarks');
    $('#loadersSpinItems').css('display', 'block');
    $('#orderDetailPage').modal();
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
        console.log(order.itemArray);
        template.orderId.set(id);
        $(header).html('Details of Order');
        $(sdUser).html(res.sdName);
        $(vertical).html(res.verticalName);
        $(detailRemarks).html(order.approvalRemark);
        $(outlet).html(res.outletName);
        $(detailOnHold).html(moment(order.statusUpdatedDate).format('DD-MM-YYYY hh:mm A'));
        $(route).html(res.routeName);
        $(createdAt).html(moment(order.createdAt).format('DD-MM-YYYY hh:mm A'));
        $(taxAmount).html(order.taxAmount);
        $(totalAmt).html(order.docTotal);
        $("#sdUserid").val(order.sdUser);
        $("#outletid").val(order.outlet);
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
          status: "On Hold",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if(vertical==='' && route && outletName==='' && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          status: "On Hold",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else if(vertical==='' && route==='' && outletName && sdUser==='' && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          outlet:outletName,
          status: "On Hold",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(vertical==='' && route==='' && outletName==='' && sdUser && fromDate && toDate){
        Template.instance().pagination.settings.set('filters',
        {
          sdUser:sdUser,
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
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
          status: "On Hold",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else{
        Template.instance().pagination.settings.set('filters',
        {
          status: "On Hold",
          subDistributor: Meteor.userId(),
          createdAt:{ $gte:fromDate, $lt:toDate }
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    // event.preventDefault();
    // let vertical = event.target.selectVertical.value;
    // let route = event.target.routenameSelect.value;

    // if (vertical && route === '') {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       vertical: vertical,
    //       status: "On Hold",
    //       subDistributor: Meteor.userId()
    //     }
    //   );
    //   $('.taskHeaderList').css('display', 'none');
    // }
    // else if (route && vertical === '') {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       routeId: route, status: "On Hold",
    //       subDistributor: Meteor.userId()
    //     }
    //   );
    //   $('.taskHeaderList').css('display', 'none');
    // }
    // else if (vertical && route) {
    //   Template.instance().pagination.settings.set('filters',
    //     {
    //       vertical: vertical,
    //       routeId: route, status: "On Hold",
    //       subDistributor: Meteor.userId()
    //     }
    //   );
    //   $('.taskHeaderList').css('display', 'none');
    // }
    // else {
    //   Template.instance().pagination.settings.set('filters', {
    //   });
    //   $('.taskHeaderList').css('display', 'none');
    // }
  }, 
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      status: "On Hold",
      subDistributor: Meteor.userId()
    });
    $('form :input').val("");
    $('#selectVertical').val('').trigger('change');
    $('#routenameSelect').val('').trigger('change');
    $('#outletName').val('').trigger('change');
    $('#selectSDName').val('').trigger('change');
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
