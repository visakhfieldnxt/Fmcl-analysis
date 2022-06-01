/**
 * @author Visakh
 */

import { Order } from "../../../api/order/order";
import { Meteor } from 'meteor/meteor';
let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);

Template.orderRejected.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.itemArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.itemList = new ReactiveVar();
  this.orderId = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.accValue = new ReactiveVar();
  this.approvalValueGet = new ReactiveVar();
  let managerBranch = Session.get("managerBranch");
  let accountantValue = Session.get("accountantCheckValue");
  if (accountantValue === true) {
    this.pagination = new Meteor.Pagination(Order, {
      filters: {
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'rejected' },
        docStatus: 'R',
        accountantApproval: true,
      }, sort: { rejectedDate: -1 },
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(Order, {
      filters: {
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'rejected' },
        docStatus: 'R',
      }, sort: { rejectedDate: -1 },
      perPage: 20
    });
  }
});
Template.orderRejected.onRendered(function () {
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
});

Template.orderRejected.helpers({
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
    return globalOptionsHelper(orderCollectionName);
  },
  currencyGet: () => {
    let currencyValues = Session.get("currencyValues");
    return currencyValues;
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper(orderCollectionName);
    config.textarea = true;

    return config;
  },
  /**
 * TODO: Complete JS doc
 * first approval details
 */
  firstApproveData: () => {
    return Template.instance().approvalValueGet.get();
  },

  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  datesVal: (dateVal) => {
    let date = moment(dateVal).format('DD-MM-YYYY hh:mm:ss A');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },
  /**
   * TODO:Complete Js doc
   * for calculating item tax
   */
  taxFormats: (quantity, taxRate) => {
    let res = (parseInt(quantity) * Number(taxRate)).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  accCheck: () => {
    let res = Template.instance().accValue.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
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
   * TODO:Complete Js doc
   * for getting total weight
   */
  weightCal: (quantity, weight, unitQuantity) => {
    let result = (parseInt(quantity) * Number(weight) * parseInt(unitQuantity)).toFixed(2);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  /**
   * TODO: Complete JS doc
   */
  sortIcon: () => {
    genericSortIcons();
  },
  /**
    * TODO:Complete JS doc
    * Getting items Details
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

Template.orderRejected.events({
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
          oRStatus: { $eq: 'rejected' },
          docStatus: 'R',
          accountantApproval: true,
        });
      }
      else if (fromDate && isNaN(toDate) && cardName === '') {
        fromDate.setDate(fromDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          rejectedDate: {
            $lte: fromDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'rejected' },
          docStatus: 'R',
          accountantApproval: true,
        });
      }
      else if (toDate && isNaN(fromDate) && cardName === '') {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          rejectedDate: {
            $lte: toDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'rejected' },
          docStatus: 'R',
          accountantApproval: true,
        });
      }
      else if (fromDate && toDate && cardName === '') {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lt: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
            accountantApproval: true,
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lte: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
            accountantApproval: true,
          });
        }
      }
      else if (cardName && toDate && fromDate) {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lt: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
            accountantApproval: true,
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lte: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
            accountantApproval: true,
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
          oRStatus: { $eq: 'rejected' },
          docStatus: 'R',
        });
      }
      else if (fromDate && isNaN(toDate) && cardName === '') {
        fromDate.setDate(fromDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          rejectedDate: {
            $lte: fromDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'rejected' },
          docStatus: 'R',
        });
      }
      else if (toDate && isNaN(fromDate) && cardName === '') {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          rejectedDate: {
            $lte: toDate
          },
          branch: { $in: managerBranch },
          oRStatus: { $eq: 'rejected' },
          docStatus: 'R',
        });
      }
      else if (fromDate && toDate && cardName === '') {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lt: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lte: toDate
            },
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
          });
        }
      }
      else if (cardName && toDate && fromDate) {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lt: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            rejectedDate: {
              $gte: fromDate, $lte: toDate
            },
            cardName: cardName,
            branch: { $in: managerBranch },
            oRStatus: { $eq: 'rejected' },
            docStatus: 'R',
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
      Template.instance().pagination.settings.set('filters', {
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'rejected' },
        docStatus: 'R',
        accountantApproval: true,
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'rejected' },
        docStatus: 'R',
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
    template.accValue.set(false);
    template.approvalValueGet.set('');
    let id = event.currentTarget.id;
    let header = $('#orderH');
    let cardName = $('#detailCardName');
    let cardCode = $('#detailCardCode');
    let branchs = $('#detailBranch');
    let docTotal = $('#detailDocTotal');
    let beforeDiscount = $('#detailBeforeDiscount');
    let afterDiscount = $('#detailAfterDiscount');
    let gst = $('#detailGST');
    let docEntry = $('#detailDocEntry');
    let docDeliver = $('#detailDocDeliver');
    let docDate = $('#detailDocDate');
    let orderId = $('#detailOrderId');
    let weights = $('#detailWeight');
    let address = $('#detailAddress');
    let custRef = $('#detailcustRef');
    let detailApprovedBy = $('#detailApprovedBy');
    let detailApprovedDate = $("#detailApprovedDate");
    let detailApprovedRemark = $("#detailApprovedRemark");
    let detailcreated = $("#detailcreated");
    let custRefDate = $('#detailCustRefDate');
    let ribNumberS = $('#detailribNumber');
    let driverNameS = $('#detaildriverName');
    let street = '';
    let city = '';
    let block = '';
    let remark = $('#detailRemark');
    let salesPerson = $('#detailSalesPerson');
    $('#orderDetailPage').modal();
    Meteor.call('order.id', id, (orderError, orderResult) => {
      if (!orderError) {
        let order = orderResult;
        $(header).html('Details of Order');
        let totalAmt = Number(order.docTotal).toFixed(6);
        $(docTotal).html(totalAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(beforeDiscount).html(Number(order.beforeDiscount).toFixed(2));
        $(afterDiscount).html(Number(order.afterDiscount).toFixed(2));
        $(branchs).html(order.branchName);
        $(cardName).html(order.cardName);
        let gstAmt = Number(order.GST).toFixed(6);
        $(salesPerson).html(order.salesmanName);
        $(custRefDate).html(moment(order.custRefDate).format("DD-MM-YYYY"));
        $(custRef).html(order.custRefNo);
        $(gst).html(gstAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(cardCode).html(order.cardCode);
        let weightAmt = Number(order.weight).toFixed(2)
        $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
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
        $(remark).html(order.remark_order);
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
        if (order.accountantApproved === true || order.accountantRejected === true || order.accountantOnHold === true) {
          template.accValue.set(true);
          template.approvalValueGet.set(order);
        }
        if (order.mobileId !=='' && order.mobileId !== undefined) {          
          $(detailcreated).html('Mobile App');
        }else{
          $(detailcreated).html('Web App');
        }
        template.itemsDetailsList.set(order.itemLines);
        template.modalLoader.set(order.itemLines);
        invoiceDetailsView(order.orderId);
      }
    });
    function invoiceDetailsView(orderId) {
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
     * Clear values when click close button 
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
   *  Clear values when click closen button 
   */
  'click .closen': (event, template) => {
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
  }
});
