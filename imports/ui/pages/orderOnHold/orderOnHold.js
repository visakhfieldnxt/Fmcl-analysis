/**
 * @author Visakh
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
  this.itemList = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.orderId = new ReactiveVar();
  this.itemArray = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.orderIds = new ReactiveVar();
  this.modalLoader = new ReactiveVar();

  let managerBranch = Session.get("managerBranch");
  let accountantValue = Session.get("accountantCheckValue");
  if (accountantValue === true) {
    this.pagination = new Meteor.Pagination(Order, {
      filters: {
        accountantOnHold: true,
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'onHold' },
        docStatus: 'onHold',
        orderId: { $eq: '' },
      }, sort: { onHoldDate: -1 },
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(Order, {
      filters: {
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'onHold' },
        docStatus: 'onHold',
        orderId: { $eq: '' },
        accountantOnHold: { $ne: true },
      }, sort: { onHoldDate: -1 },
      perPage: 20
    });
  }
});
Template.orderOnHold.onRendered(function () {
  this.itemList.set([]);
  // for getting all Customer Name & cardcode.
  Meteor.call('customer.customerNameGet', (err, res) => {
    if (!err)
      this.customerNameArray.set(res);
  });
  $('.selectCustomerName').select2({
    placeholder: "Select Dealer Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomerName").parent(),
  });
  $('.select1-dropdown').select2({
    placeholder: "Select Status",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".select1-dropdown").parent(),
  });
});

Template.orderOnHold.helpers({
  /**
 * TODO:Complete JS doc
 */
  customersList: function () {
    return Template.instance().customerNameArray.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper(orderDraftCollectionName);
  },

  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper(orderDraftCollectionName);
    config.textarea = true;

    return config;
  },
  currencyGet: () => {
    let currencyValues = Session.get("currencyValues");
    return currencyValues;
  },
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  /**
   * TODO:Complete Js doc
   * for getting total weight
   */
  weightCal: (quantity, weight, unitQuantity) => {
    let result = (parseInt(quantity) * Number(weight) * parseInt(unitQuantity)).toFixed(2);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },/**
  * TODO:Complete Js doc
  * for getting total tax
  */
  taxFormats: (quantity, taxRate) => {
    let res = (parseInt(quantity) * Number(taxRate)).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
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
    * Getting item details
    */
  items: () => {
    return Template.instance().itemsDetailsList.get();
  },

  /**
    * TODO:Complete JS doc
    * @param docDate
    */
  date: (docDate) => {
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
* TODO:Complete JS doc
* @param price 
*/
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
 * TODO:Complete JS doc
 * @param quantity 
 */
  quantityFormat: (quantity) => {
    let res = Number(quantity).toFixed(3);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
   * TODO:Complete Js doc
   * Getting item list
   */

  itemList: () => {
    return Template.instance().itemList.get();
  },
  /**
   * TODO:Complete Js doc
   * Getting total amount
   */
  total: (quantity, salesPrice) => {
    let product = Number(quantity) * Number(salesPrice);
    let res = Number(product).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
   * TODO:Complete JS doc
   * 
   */
  printLoad: () => {
    return Template.instance().modalLoader.get();
  },
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.orderOnHold.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event) => {
    event.preventDefault();

    let first = $("#fromDate").val();
    let second = $("#toDate").val();

    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');

    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);

    let cardName = event.target.selectCustomerName.value;
    let managerBranch = Session.get("managerBranch");
    let accountantValue = Session.get("accountantCheckValue");
    if (accountantValue === true) {
      if (cardName && isNaN(fromDate) && isNaN(toDate)) {
        Template.instance().pagination.settings.set('filters', {
          cardName: cardName,
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'onHold' },
          docStatus: 'onHold',
          orderId: { $eq: '' },
          accountantOnHold: true,
        });
      }
      else if (fromDate && isNaN(toDate) && cardName === '') {
        fromDate.setDate(fromDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          onHoldDate: {
            $lte: fromDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'onHold' },
          docStatus: 'onHold',
          orderId: { $eq: '' },
          accountantOnHold: true,
        });
      }
      else if (toDate && isNaN(fromDate) && cardName === '') {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          onHoldDate: {
            $lte: toDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'onHold' },
          docStatus: 'onHold',
          orderId: { $eq: '' },
          accountantOnHold: true,
        });
      }
      else if (fromDate && toDate && cardName === '') {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lt: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: true,
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lte: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: true,
          });
        }
      }
      else if (cardName && toDate && fromDate) {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lt: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: true,
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lte: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: true,
          });
        }
      }
      else {
        Template.instance().pagination.settings.set('filters', {});
      }
    }
    else {
      if (cardName && isNaN(fromDate) && isNaN(toDate)) {
        Template.instance().pagination.settings.set('filters', {
          cardName: cardName,
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'onHold' },
          docStatus: 'onHold',
          orderId: { $eq: '' },
          accountantOnHold: { $ne: true },
        });
      }
      else if (fromDate && isNaN(toDate) && cardName === '') {
        fromDate.setDate(fromDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          onHoldDate: {
            $lte: fromDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'onHold' },
          docStatus: 'onHold',
          orderId: { $eq: '' },
          accountantOnHold: { $ne: true },
        });
      }
      else if (toDate && isNaN(fromDate) && cardName === '') {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          onHoldDate: {
            $lte: toDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'onHold' },
          docStatus: 'onHold',
          orderId: { $eq: '' },
          accountantOnHold: { $ne: true },
        });
      }
      else if (fromDate && toDate && cardName === '') {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lt: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: { $ne: true },
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lte: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: { $ne: true },
          });
        }
      }
      else if (cardName && toDate && fromDate) {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lt: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: { $ne: true },
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            onHoldDate: {
              $gte: fromDate, $lte: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'onHold' },
            docStatus: 'onHold',
            orderId: { $eq: '' },
            accountantOnHold: { $ne: true },
          });
        }
      }
      else {
        Template.instance().pagination.settings.set('filters', {});
      }
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    $("#selectCustomerName").val('').trigger('change');
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    let managerBranch = Session.get("managerBranch");
    let accountantValue = Session.get("accountantCheckValue");
    if (accountantValue === true) {
      Template.instance().pagination.settings.set('sort', {
        onHoldDate: -1
      },
        'filters', {
        // onHoldDate: {
        //   $gte: toDay,
        //   $lt: nextDay
        // },
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'onHold' },
        docStatus: 'onHold',
        orderId: { $eq: '' },
        accountantOnHold: true
      });
    }
    else {
      Template.instance().pagination.settings.set('sort', {
        onHoldDate: -1
      },
        'filters', {
        // onHoldDate: {
        //   $gte: toDay,
        //   $lt: nextDay
        // },
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'onHold' },
        docStatus: 'onHold',
        orderId: { $eq: '' },
        accountantOnHold: { $ne: true },
      });
    }
    $('form :input').val("");
  },
  /**
          * TODO:Complete JS doc
          * @param event
          */
  'click .view': (event, template) => {
    event.preventDefault();
    Template.instance().itemsDetailsList.set('');
    Template.instance().modalLoader.set('');
    let id = event.currentTarget.id;
    let header = $('#orderH');
    let cardNames = $('#detailCardName');
    let cardCode = $('#detailCardCode');
    let branchs = $('#detailBranch');
    let docTotal = $('#detailDocTotal');
    let beforeDiscount = $('#detailBeforeDiscount');
    let afterDiscount = $('#detailAfterDiscount');
    let gst = $('#detailGST');
    let detailcreated = $("#detailcreated");
    let docEntry = $('#detailDocEntry');
    let docDeliver = $('#detailDocDeliver');
    let docDate = $('#detailDocDate');
    let orderId = $('#detailOrderId');
    let weights = $('#detailWeight');
    let remarks = $('#detailRemarks');
    let address = $('#detailAddress');
    let custRef = $('#detailcustRef');
    let custRefDate = $('#detailCustRefDate');
    let detailApprovedBy = $('#detailApprovedBy');
    let detailApprovedDate = $("#detailApprovedDate");
    let detailApprovedRemark = $("#detailApprovedRemark");
    let ribNumberS = $('#detailribNumber');
    let driverNameS = $('#detaildriverName');
    let street = '';
    let city = '';
    let block = '';
    let salesPerson = $('#detailSalesPerson');
    $('#orderDetailPage').modal();
    template.orderIds.set(id);
    Meteor.call('order.id', id, (orderError, orderResult) => {
      if (!orderError) {
        let order = orderResult;
        $(header).html('Details of Order');
        let totalAmt = Number(order.docTotal).toFixed(6);
        $(docTotal).html(totalAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(beforeDiscount).html(Number(order.beforeDiscount).toFixed(6));
        $(afterDiscount).html(Number(order.afterDiscount).toFixed(6));
        let gstAmt = Number(order.GST).toFixed(6);
        $(gst).html(gstAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(cardCode).html(order.cardCode);
        $(salesPerson).html(order.salesmanName);
        let weightAmt = Number(order.weight).toFixed(2)
        $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(remarks).html(order.remark_order);
        $(branchs).html(order.branchName);
        $(cardNames).html(order.cardName);
        $(custRefDate).html(moment(order.custRefDate).format("DD-MM-YYYY"));
        $(custRef).html(order.custRefNo);
        $(docDeliver).html(moment(order.docDueDate).format("DD-MM-YYYY"));
        if (order.ribNumber !== undefined && order.ribNumber !== '') {
          $(ribNumberS).html(order.ribNumber);
        }
        else {
          $(ribNumberS).html('');
        }
        if (order.driverName !== undefined && order.driverName !== '') {
          $(driverNameS).html(order.driverName);
        }
        else {
          $(driverNameS).html('');
        }
        $(docDate).html(moment(order.createdAt).format('DD-MM-YYYY'));
        if (order.approvedByName) {
          $(detailApprovedBy).html(order.approvedByName + ' ' + '(Approved)');
          $(detailApprovedDate).html(moment(order.approvedByDate).format("DD-MM-YYYY") + ' ' + '(Approved)');
          $(detailApprovedRemark).html(order.oRRemark + ' ' + '(Approved)');
        }
        else if (order.rejectedByName) {
          $(detailApprovedBy).html(order.rejectedByName + ' ' + '(Rejected)');
          $(detailApprovedDate).html(moment(order.rejectedDate).format("DD-MM-YYYY") + ' ' + '(Rejected)');
          $(detailApprovedRemark).html(order.oRRemark + ' ' + '(Rejected)');
        }
        else if (order.onHoldByName) {
          $(detailApprovedBy).html(order.onHoldByName + ' ' + '(On hold)');
          $(detailApprovedDate).html(moment(order.onHoldDate).format("DD-MM-YYYY") + ' ' + '(On hold)');
          $(detailApprovedRemark).html(order.oRRemark + ' ' + '(On Hold)');
        }
        else {
          $(detailApprovedBy).html('');
          $(detailApprovedDate).html('');
          $(detailApprovedRemark).html('');
        }
        if (order.street === undefined) {
          street = '';
        }
        else {
          street = order.street;
        }
        if (order.block === undefined) {
          block = '';
        }
        else {
          block = order.block;
        }
        if (order.city === undefined) {
          city = '';
        }
        else {
          city = order.city;
        }
        $(address).html(street + "&nbsp;" + block + "&nbsp;" + city);
        if (order.orderId === '' || order.orderId === undefined) {
          $(orderId).html('');
        } else {
          $(orderId).html(order.orderId);
        }
        if (order.docEntry === '' || order.docEntry === undefined) {
          $(docEntry).html('');
        } else {
          $(docEntry).html(order.docEntry);
        }
        if (order.mobileId !=='' && order.mobileId !== undefined) {          
          $(detailcreated).html('Mobile App');
        }else{
          $(detailcreated).html('Web App');
        }
        invoiceDeatilsView(order.orderId);
        customerDetailsGet(order.cardCode);
        template.itemsDetailsList.set(order.itemLines);
        template.modalLoader.set(order.itemLines);
      }
    });
    function customerDetailsGet(cardCode) {
      Meteor.call('customer.customerFindOne', cardCode, (err, res) => {
        if (!err) {
          if (res.balance !== undefined && res.balance !== '') {
            $(outstandingValue).html(((Number(res.balance).toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          }
          else {
            $(outstandingValue).html('');
          }
          if (res.creditLine !== undefined && res.creditLine !== '') {
            $(creditLimitValue).html(((Number(res.creditLine).toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          }
          else {
            $(creditLimitValue).html('');
          }
        }
      });

    }
    //Getting invoice details based on order
    function invoiceDeatilsView(orderId) {
      Meteor.call('invoice.orderId', orderId, (invoiceError, invoiceResult) => {
        if (!invoiceError) {
          let inv = invoiceResult;
          if (inv) {
            template.itemList.set(inv);
          } else {
            template.itemList.set([]);
          }
        }
      });
    }
  },
  /**
* TODO: Complete JS doc
* to show filter display
*/
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
* to hide filter display
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  /**
     * TODO: Complete JS doc
     * clear data when click close button
     */
  'click .close': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.itemArray.set('');
    $("#submit").attr("disabled", false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .orders': (event, template) => {
    event.preventDefault();
    let header = $('#categoryHeader');
    let confirmedUuid = $('#confirmedUuid');
    $('#categoryApproveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    $(header).html('Confirm Of Order Approval');
    $(confirmedUuid).val(_id);
    template.orderId.set(_id);

  },

  /**
   * TODO: Complete JS doc
   * @param event
   * for order status update
   */
  'submit .statusUpdate': (event, template) => {
    event.preventDefault();
    let target = event.target;
    // $("#obutton").attr("disabled", true);
    // $('.orders').bind('click', false);
    // setTimeout(function () {
    //   $("#obutton").removeAttr("disabled");
    //   $('.orders').unbind('click', false);
    // }, 600000);
    $(".orderOnholdBtn").prop('disabled', true);
    Meteor.setTimeout(function () {
      $(".orderOnholdBtn").prop('disabled', false);
    }, 7000);
    $("#orderDetailPage").modal('hide');
    let orderId = Template.instance().orderIds.get();
    let status = target.oRStatus.value;
    let remarks = target.remark.value;
    let accountantValue = Session.get("accountantCheckValue");
    /**
        * Accountant approval starts
        */
    if (accountantValue === true) {
      if (status === 'approved') {
        Meteor.call('order.accountantApproved', orderId, status, remarks, (error) => {
          if (error) {
            $('#message').html("Internal error - unable to approve entry. Please try again");
            template.orderIds.set('');
            // $("#orderDetailPage").modal('hide');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          } else {
            $("." + orderId).hide();
            Meteor.setTimeout(function () {
              $("." + orderId).show();
            }, 60000);
            // $("#orderDetailPage").modal('hide');
            $('#orderSuccessModal').find('.modal-body').text('Order Approved Successfully');
            $('#orderSuccessModal').modal();
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
            $('.loadersSpin').css('display', 'none');
          }
        });
      }
      else if (status === 'rejected') {
        Meteor.call('order.accountantUpdates', orderId, status, remarks, (error) => {
          if (error) {
            $('#message').html("Internal error - unable to approve entry. Please try again");
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          } else {
            $("#orderDetailPage").modal('hide');
            $('#orderSuccessModal').find('.modal-body').text('Order Status Updated Successfully');
            $('#orderSuccessModal').modal();
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
            $('.loadersSpin').css('display', 'none');
          }
        });
      }
    }
    else {
      if (status === 'approved') {
        Meteor.call('order.approved', orderId, status, remarks, (error) => {
          if (error) {
            $('#message').html("Internal error - unable to approve entry. Please try again");
            template.orderIds.set('');
            // $("#orderDetailPage").modal('hide');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          } else {
            $("." + orderId).hide();
            Meteor.setTimeout(function () {
              $("." + orderId).show();
            }, 60000);
            // $("#orderDetailPage").modal('hide');
            $('#orderSuccessModal').find('.modal-body').text('Order Approved Successfully');
            $('#orderSuccessModal').modal();
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
            $('.loadersSpin').css('display', 'none');
          }
        });
      }
      else if (status === 'rejected') {
        Meteor.call('order.updates', orderId, status, remarks, (error) => {
          if (error) {
            $('#message').html("Internal error - unable to approve entry. Please try again");
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          } else {
            $("#orderDetailPage").modal('hide');
            $('#orderSuccessModal').find('.modal-body').text('Order Status Updated Successfully');
            $('#orderSuccessModal').modal();
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
            $('.loadersSpin').css('display', 'none');
          }
        });
      }
    }
  },
  /**
     * TODO: Complete JS doc
     */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.itemArray.set('');
    $('#detailRemarks').html('');
    $('#oRStatus').val('').trigger('change');
    $("#submit").attr("disabled", false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
});
