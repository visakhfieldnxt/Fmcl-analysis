/**
 * @author Visakh
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
  this.itemList = new ReactiveVar();
  this.editIt = new ReactiveVar();
  this.orderIds = new ReactiveVar();
  this.itemNameArray = new ReactiveVar();
  this.unitNameArray = new ReactiveVar();
  this.userNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.orderData = new ReactiveVar();
  this.customerDetail = new ReactiveVar();
  this.itemArray = new ReactiveVar();
  this.ordId = new ReactiveVar();
  this.totalItem = new ReactiveVar();
  this.customerCodeEdit = new ReactiveVar();
  this.customerPriceType = new ReactiveVar();
  this.customerAddress = new ReactiveVar();
  this.branchArrayOrder = new ReactiveVar();
  this.itemNameOrder = new ReactiveVar();
  this.customerAddressOrder = new ReactiveVar();
  this.selectedItem = new ReactiveVar();
  this.unitSelected = new ReactiveVar();
  this.unitNameOrder = new ReactiveVar();
  this.itemUnitPrice = new ReactiveVar();
  this.beforeDiscount = new ReactiveVar();
  this.afterDiscount = new ReactiveVar();
  this.gST = new ReactiveVar();
  this.grandTotal = new ReactiveVar();
  this.itemPriceDetail = new ReactiveVar();
  this.unitPricItem = new ReactiveVar();
  this.whsCodeSelected = new ReactiveVar();
  this.selecteItemDetil = new ReactiveVar();
  this.branchCode = new ReactiveVar();
  this.userNameOrder = new ReactiveVar();
  this.wareHouseSelect = new ReactiveVar();
  this.customerBranch = new ReactiveVar();
  this.unitDetail = new ReactiveVar();
  this.itemDetail = new ReactiveVar();
  this.wareHouseData = new ReactiveVar();
  this.priceTypeArray = new ReactiveVar();
  this.currencyArrayOrder = new ReactiveVar();
  this.taxArrayOrder = new ReactiveVar();
  this.vatGroupSelected = new ReactiveVar();
  this.wareHouseArray = new ReactiveVar();
  this.mVATArrayItem = new ReactiveVar();
  this.itemtaxPrice = new ReactiveVar();
  this.priceTypeOfCustomer = new ReactiveVar();
  this.paymentDays = new ReactiveVar();
  this.orderIdEdit = new ReactiveVar();
  this.priceModes = new ReactiveVar();
  this.getBranch = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.itemEditCheck = new ReactiveVar();
  this.editUnitList = new ReactiveVar();
  this.customerDetailsValue = new ReactiveVar();
  this.approvalDetailsList = new ReactiveVar();
  this.approvalDetailsValue = new ReactiveVar();

  let managerBranch = Session.get("managerBranch");
  let accountantValue = Session.get("accountantCheckValue");
  if (accountantValue === true) {
    this.pagination = new Meteor.Pagination(Order, {
      filters: {
        approvalValue: true,
        accountantApproval: true,
        branch: { $in: managerBranch },
        oRStatus: { $eq: 'Pending' },
        orderId: { $eq: '' },
        docStatus: 'O',
      }, sort: { createdAt: -1 },
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(Order, {
      filters: {
        branch: { $in: managerBranch },
        oRStatus: { $eq: '' },
        orderId: { $eq: '' },
        docStatus: 'O',
        accountantApproval: { $ne: true },
      }, sort: { createdAt: -1 },
      perPage: 20
    });
  }
});
Template.orderApprove.onRendered(function () {
  this.itemList.set([]);
  this.editIt.set(false);

  // enable or disable price edit based on permission
  let priceUpdatecheck = Session.get("priceUpdateValue");
  if (priceUpdatecheck === true) {
    $("#exPriceEdit").attr("disabled", false);
    $("#inPriceEdit").attr("disabled", false);
  }
  else {
    $("#exPriceEdit").attr("disabled", true);
    $("#inPriceEdit").attr("disabled", true);
  }

  /**
  * TODO: Complete JS doc
  * for getting user name
  * 
  */
  Meteor.call('user.userNameGet', (userError, userResult) => {
    if (!userError) {
      this.userNameArray.set(userResult);
    }
  });

  /**
   * TODO:Complete Js doc
   * Getting user branch list
   */
  Meteor.call('branch.branchUserList', (err, res) => {
    if (!err) {
      this.branchArrayOrder.set(res);
    }
  });
  /**
   * TODO:Complete Js doc
   * Getting taxList List
   */
  Meteor.call('tax.taxList', (err, res) => {
    if (!err) {
      this.taxArrayOrder.set(res);
    }
  });
  /**
   * TODO:Complete Js doc
   * Getting customerByBranch List
   */
  if (Meteor.user() !== undefined && Meteor.user() !== null) {
    Meteor.call('customer.customerByBranch', Meteor.user().defaultBranch, Meteor.user().slpCode, (err, res) => {
      if (!err) {
        this.customerBranch.set(res);
      }
    });
  }
  /**
   * TODO:Complete Js doc
   * Getting customerPriceList List
   * 
   */
  Meteor.call('customerPriceList.priceList', (err, res) => {
    if (!err) {
      this.priceTypeArray.set(res);
    }
  });
  /**
   * TODO:Complete Js doc
   * Getting userList List
   * 
   */
  Meteor.call('user.userList', (err, res) => {
    if (!err) {
      this.userNameOrder.set(res);
    }
  });
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

  $('.selectItemsEdit').select2({
    placeholder: "Select Item",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectItemsEdit").parent(),
  });



  $('.selectUnitEdit').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnitEdit").parent(),
  });



  $('.selectItemTaxEdit').select2({
    placeholder: "Select Tax",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectItemTaxEdit").parent(),
  });

  $('.selectWareHouseEdit').select2({
    placeholder: "Select Ware House",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectWareHouseEdit").parent(),
  });

  this.itemArray.set('');
  this.mVATArrayItem.set([]);
  if (Meteor.user() !== undefined && Meteor.user() !== null) {
    $('#selectBranchEdit').val(Meteor.user().defaultBranch).trigger('change');
  }
  /**
      * TODO:Complete Js doc
      * for getting all Customer Name & cardcode.
      */
  Meteor.call('item.itemNameGet', (err, res) => {
    if (!err)
      this.itemNameArray.set(res);
  });
  /**
     * TODO:Complete Js doc
     * for getting unit
     */
  Meteor.call('unit.unitList', (err, res) => {
    if (!err)
      this.unitNameArray.set(res);
  });
  $('.selectUnit').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnit").parent(),
  });

  $('.select1-dropdown').select2({
    placeholder: "Select Status",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".select1-dropdown").parent(),
  });
});
Template.orderApprove.helpers({
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
  digitSeperator: (digit) => {
    return digit.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
* check mobile app or not for edit 
*/
  vansaleCheck(status) {
    if (status === true) {
      return false;
    }
    else {
      return true;
    }
  },

  approvalDetailsList: () => {
    let res = Template.instance().approvalDetailsList.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },

  accountantEditCheck: () => {
    let accountantValue = Session.get("accountantCheckValue");
    if (accountantValue === true) {
      return false;
    }
    else {
      return true;
    }
  },

  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
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
  approvalData: () => {
    return Template.instance().approvalDetailsValue.get();
  },
  /**
   * TODO: Complete JS doc
   */
  sortIcon: () => {
    genericSortIcons();
  },
  /**
   * TODO:Complete JS doc
   * for getting item details
   */
  items: () => {
    return Template.instance().itemsDetailsList.get();
  },
  sapApproval: (approvalValue) => {
    if (approvalValue !== undefined && approvalValue === true) {
      return 'Waiting';
    }
    else {
      return '-';
    }

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
    * TODO:Complete JS doc
    * @param draftStatus
    */
  draft: (draftStatus) => {
    if (draftStatus === 'W') {
      return 'Waiting';
    }
    else if (draftStatus === 'Y') {
      return 'Approved';
    }
    else if (draftStatus === 'N') {
      return 'Rejected';
    }
    else if (draftStatus === 'P') {
      return 'Pending';
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
  * @param docDate
  */
  dateHelp: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
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
   * for getting item list
   */
  itemList: () => {
    return Template.instance().itemList.get();
  },
  /**
   * TODO:Complete Js doc
   * for getting total
   */
  total: (quantity, salesPrice) => {
    let product = Number(quantity) * Number(salesPrice);
    let res = Number(product).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
  * TODO:Complete Js doc
  * for editing item details
  */
  edit: () => {
    return Template.instance().editIt.get();
  },
  /**
* TODO:Complete JS doc
*/
  customersList: function () {

    return Template.instance().customerNameArray.get();
  },

  /**
   * TODO:COmplete Js doc
   * Listing Employee branches and selecting default branch of employee
   */
  branchList: function () {
    if (Meteor.user() !== undefined && Meteor.user() !== null) {
      let branch = Template.instance().branchArrayOrder.get();
      Meteor.setTimeout(function () {
        $('#selectBranchEdit').val(Meteor.user().defaultBranch).trigger('change');
      }, 100);

      return branch;
    }
  },
  /**
   * TODO:COmplete Js doc
   * Listing Employee branches and selecting default branch of employee
   */
  taxList: function () {
    let tax = Template.instance().taxArrayOrder.get();
    return tax;
  },
  /**
   * TODO:COmplete Js doc
   * Item List based in the branch
   */
  itemsList: function () {
    return Template.instance().itemNameOrder.get();

  },
  /**
    * TODO:Complete Js doc
    * for getting item total
    */
  itemTotal: () => {
    let total = 0;
    let orderItem = Template.instance().orderData.get();
    for (let i = 0; i < orderItem.itemLines.length; i++) {
      total = total + orderItem.itemLines[i].quantity;
    }
    return total;
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
   * TODO:Complete Js doc
   * for getting total tax
   */
  taxCal: (quantity, taxRate) => {
    let result = (parseInt(quantity) * Number(taxRate)).toFixed(6);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
   * TODO:Complete Js doc
   * Based on the item unit Listing.
   */
  unitList: function () {
    let unit = Template.instance().unitNameOrder.get();
    let priceDetails = Template.instance().unitSelected.get();
    let itemEditValue = Template.instance().itemEditCheck.get();
    let unitEditValue = Template.instance().editUnitList.get();
    if (itemEditValue === true) {
      if (unitEditValue) {
        Meteor.setTimeout(function () {
          $('#selectUnitEdit').val(unitEditValue).trigger('change');
        }, 100)
      }
    }
    else {
      if (priceDetails) {
        Meteor.setTimeout(function () {
          $('#selectUnitEdit').val(priceDetails.uomCode).trigger('change');
        }, 100);
      }
      else {
        $('#unitQuantityShowsEdit').html('');
      }
    }
    // else {
    //   Meteor.setTimeout(function () {
    //     if (unit !== '' && unit !== undefined) {
    //       if (unit[0].uomCode) {
    //         $('#selectUnitEdit').val(unit[0].uomCode).trigger('change');
    //       }
    //     }
    //   }, 100)
    // }
    return unit;
  },
  /**
   * TODO:Complete Js doc
   * Listing employees for employee selection
   */
  userList: function () {
    if (Meteor.user() !== undefined && Meteor.user() !== null) {
      let user = Template.instance().userNameOrder.get();
      // Only after value setting this works
      Meteor.setTimeout(function () {
        if (user) {
          $('#selectEmployeeEdit').val(Meteor.user().profile.firstName).trigger('change');
        }
      }, 100);
      $('#selectBranchEdit').val(Meteor.user().defaultBranch).trigger('change');
      return user;
    }
  },
  /**
   * TODO:Complete Js doc
   * For listing the item that been selected.
   */
  itemArrayList: function () {
    return Template.instance().itemArray.get();
  },
  /**
   * TODO:Complete Js doc
   * Showing todays date
   */
  date: function () {
    return new Date();
  },
  /**
   * TODO:Complete Js doc
   * Showing next date
   */
  nxtDate: function () {
    let nxtDay = new Date();
    let pdays = Template.instance().paymentDays.get();
    if (pdays) {
      nxtDay.setDate(nxtDay.getDate() + pdays);
      return moment(nxtDay).format('YYYY-MM-DD');
    } else {
      nxtDay.setDate(nxtDay.getDate() + 1);
      return moment(nxtDay).format('YYYY-MM-DD');
    }
  },
  /**
   * TODO:Complete Js doc
   * Formating the price 
   */
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  /**
 * TODO:Complete Js doc
 * Digits seperation with Comma
 */
  digitSeperator: (digit) => {
    let res = Number(digit).toFixed(3);
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
let itemArray = [];
let mVATArray = [];
let unitPrice = 0;
let exPrice = 0;
let itemVatGroup = '';
let itemTaxRate = '';
let txAmt = 0;
let taxVat = 0;
let taxForItem = 0;
let mVATBoolean = false;
let priceItem = 0;
let taxTotal = 0;
let initialQuantity = '';
let itemCheck = false;
let itemCheckValidation = false;
let unitBaseQty = 0; //change1
let approvalResonArray = [];
let approvalValue = false;
let branchArrayCheck = [];
let customerArrayCheck = [];
Template.orderApprove.events({
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
    let accountantValue = Session.get("accountantCheckValue");
    let cardName = event.target.selectCustomerName.value;
    let managerBranch = Session.get("managerBranch");
    if (accountantValue === true) {
      if (cardName && isNaN(fromDate) && isNaN(toDate)) {
        Template.instance().pagination.settings.set('filters', {
          cardName: cardName,
          orderId: { $eq: '' },
          oRStatus: { $eq: 'Pending' },
          branch: { $in: managerBranch },
          docStatus: 'O',
          approvalValue: true,
          accountantApproval: true,
        });
      }
      else if (fromDate && isNaN(toDate) && cardName === '') {
        fromDate.setDate(fromDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $lte: fromDate
          },
          docStatus: 'O',
          orderId: { $eq: '' },
          oRStatus: { $eq: 'Pending' },
          branch: { $in: managerBranch },
          approvalValue: true,
          accountantApproval: true,
        });
      }
      else if (toDate && isNaN(fromDate) && cardName === '') {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $lte: toDate
          },
          docStatus: 'O',
          orderId: { $eq: '' },
          oRStatus: { $eq: 'Pending' },
          branch: { $in: managerBranch },
          approvalValue: true,
          accountantApproval: true,
        });
      }

      else if (fromDate && toDate && cardName === '') {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lt: toDate
            },
            orderId: { $eq: '' },
            oRStatus: { $eq: 'Pending' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            approvalValue: true,
            accountantApproval: true,
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lte: toDate
            },
            orderId: { $eq: '' },
            oRStatus: { $eq: 'Pending' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            approvalValue: true,
            accountantApproval: true,
          });
        }
      }
      else if (cardName && toDate && fromDate) {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lt: toDate
            },
            cardName: cardName,
            orderId: { $eq: '' },
            oRStatus: { $eq: 'Pending' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            approvalValue: true,
            accountantApproval: true,
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lte: toDate
            },
            cardName: cardName,
            orderId: { $eq: '' },
            oRStatus: { $eq: 'Pending' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            approvalValue: true,
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
          orderId: { $eq: '' },
          oRStatus: { $eq: '' },
          branch: { $in: managerBranch },
          docStatus: 'O',
          accountantApproval: { $ne: true },
        });
      }
      else if (fromDate && isNaN(toDate) && cardName === '') {
        fromDate.setDate(fromDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $lte: fromDate
          },
          docStatus: 'O',
          orderId: { $eq: '' },
          oRStatus: { $eq: '' },
          branch: { $in: managerBranch },
          accountantApproval: { $ne: true },
        });
      }
      else if (toDate && isNaN(fromDate) && cardName === '') {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $lte: toDate
          },
          docStatus: 'O',
          orderId: { $eq: '' },
          oRStatus: { $eq: '' },
          branch: { $in: managerBranch },
          accountantApproval: { $ne: true },
        });
      }

      else if (fromDate && toDate && cardName === '') {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lt: toDate
            },
            orderId: { $eq: '' },
            oRStatus: { $eq: '' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            accountantApproval: { $ne: true },
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lte: toDate
            },
            orderId: { $eq: '' },
            oRStatus: { $eq: '' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            accountantApproval: { $ne: true },
          });
        }
      }
      else if (cardName && toDate && fromDate) {
        if (fromDate.toString() === toDate.toString()) {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lt: toDate
            },
            cardName: cardName,
            orderId: { $eq: '' },
            oRStatus: { $eq: '' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            accountantApproval: { $ne: true },
          });
        }
        else {
          toDate.setDate(toDate.getDate() + 1);
          Template.instance().pagination.settings.set('filters', {
            docDate: {
              $gte: fromDate, $lte: toDate
            },
            cardName: cardName,
            orderId: { $eq: '' },
            oRStatus: { $eq: '' },
            branch: { $in: managerBranch },
            docStatus: 'O',
            accountantApproval: { $ne: true },
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
        orderId: { $eq: '' },
        oRStatus: { $eq: 'Pending' },
        branch: { $in: managerBranch },
        docStatus: 'O',
        approvalValue: true,
        accountantApproval: true,
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        orderId: { $eq: '' },
        oRStatus: { $eq: '' },
        branch: { $in: managerBranch },
        docStatus: 'O',
        accountantApproval: { $ne: true },
      });
    }
    $('form :input').val("");
  },
  /**
  * TODO: Complete JS doc
  * for edit item details
  */
  'click .editItem': (event, template) => {
    template.editIt.set(true);
    Template.orderApprove.__helpers.get('edit').call();
  },
  // for editing item
  'click .itemEdit': (event, template) => {
    let ids = event.currentTarget.id;
    template.editUnitList.set('');
    let itemLists = itemArray;
    let itemCode = '';
    let itemQuantity = '';
    let inPrice = '';
    let exPrice = '';
    let itemRemark = '';
    let uomCode = '';
    template.itemEditCheck.set(true);
    let vatGroup = '';
    for (let i = 0; i < itemLists.length; i++) {
      if (itemLists[i].randomId === ids) {
        itemCode = itemLists[i].itemCode;
        itemQuantity = itemLists[i].quantity;
        inPrice = itemLists[i].incPrice;
        exPrice = itemLists[i].excPrice;
        itemRemark = itemLists[i].itemRemark;
        uomCode = itemLists[i].uomCode;
        vatGroup = itemLists[i].vatGroup;
      }
    }
    template.editUnitList.set(uomCode);
    $('#selectItemsEdit').val(itemCode).trigger('change');
    Meteor.setTimeout(function () {
      $('#selectItemTaxEdit').val(vatGroup).trigger('change');
    }, 200);
    Meteor.setTimeout(function () {
      $('#exPriceEdit').val(Number(exPrice).toFixed(6));
    }, 700);
    Meteor.setTimeout(function () {
      $('#inPriceEdit').val(Number(inPrice).toFixed(6));
    }, 800);
    $('#quantityEdit').val(itemQuantity);
    $('#itemRemarkEdit').val(itemRemark);
    let itemObject = itemLists.find(e => e.randomId === ids);
    let mvatItem = Template.instance().mVATArrayItem.get();
    for (let i = 0; i < mvatItem.length; i++) {
      if (mvatItem[i].itemCode === itemObject.itemCode) {
        mvatItem.splice(i, 1);
      }
    }
    template.mVATArrayItem.set(mvatItem);

    let selected = itemLists.filter(function (e) {
      return e.randomId === ids;
    });
    let removeIndex = itemLists.map(function (item) {
      return item.randomId;
    }).indexOf(ids);
    // remove object
    itemArray.splice(removeIndex, 1);
    template.itemArray.set(itemArray);

    let itemDelete = Template.instance().itemArray.get();
    let taxAdded = $('#taxAddedEdit');
    let beforeDiscount = Template.instance().beforeDiscount.get();
    let afterDiscount = Template.instance().afterDiscount.get();
    let total = $('#totalEdit');

    if (itemDelete !== '' && itemDelete.length > 0) {

      this.bDis = 0;
      this.aDis = 0;
      for (let i = 0; i < itemDelete.length; i++) {
        this.bDis += Number(itemDelete[i].beforeDiscount);
        let bFixed = parseFloat(this.bDis).toFixed(6);
        template.beforeDiscount.set(bFixed);
        // $(beforeDiscount).html(bFixed);
      }

      for (let i = 0; i < itemDelete.length; i++) {
        this.aDis += Number(itemDelete[i].afterDiscount);
        let aFixed = parseFloat(this.aDis).toFixed(6);
        template.afterDiscount.set(aFixed);

        // $(afterDiscount).html(aFixed);

      }

      let totalWeightCal = 0;
      for (let s = 0; s < itemArray.length; s++) {
        let multiplication = Number(itemArray[s].quantity * itemArray[s].unitQuantity * itemArray[s].invWeight);
        totalWeightCal += Number(multiplication);
      }

      let totalWeightC = $('#weightTotalEdit');//changed
      $(totalWeightC).html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));//changed
      let taxAdd = 0
      for (let l = 0; l < itemArray.length; l++) {
        taxAdd += Number(itemArray[l].quantity) * Number(itemArray[l].taxRate); //change
      }
      let totalP = 0;
      template.gST.set(taxAdd);
      $(taxAdded).html(((taxAdd.toFixed(6)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      for (let l = 0; l < itemArray.length; l++) {
        totalP += Number(itemArray[l].incPrice * itemArray[l].quantity); //change
      }
      let tot = parseFloat(totalP)
      let totFixed = parseFloat(tot).toFixed(6);
      template.grandTotal.set(totFixed);
      $(total).html((totFixed.toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    }
    else {
      $("#taxAddedEdit").html('');
      $("#totalEdit").html('');
      $('#weightTotalEdit').html('');
      $('#quantityEdit').html('');
    }
  },
  /**
  * TODO: Complete JS doc
  * for save edited item
  */
  'click .saveItem': (event, template) => {
    let itemLArray = Template.instance().itemsDetailsList.get();
    let selectedUnit = '';
    for (let i = 0; i < itemLArray.length; i++) {
      let values = $("#editPrice_" + itemLArray[i].itemCode).val();
      let quanityChange = $("#editQuantity_" + itemLArray[i].itemCode).val();
      $('#selectUnit_' + itemLArray[i].itemCode).find(':selected').each(function () {
        selectedUnit = $(this).val();
      });
      itemLArray[i].salesPrice = values;
      itemLArray[i].price = values;
      itemLArray[i].unitPrice = values;
      itemLArray[i].quantity = quanityChange;
      itemLArray[i].uomCode = selectedUnit;
    }
    let id = Template.instance().orderIds.get();
    Meteor.call('order.itemArrayUpdate', id, itemLArray, (err, res) => {
      if (err) {
        toastr['error'](err);
      } else {
        toastr['success'](priceUpdateMessage);
        template.itemsDetailsList.set(itemLArray);
      }
    });
    template.editIt.set(false);
    Template.orderApprove.__helpers.get('edit').call();
  },
  /**
   * TODO:Complete Js doc
   * for cancel item editing
   */
  'click .cancelItem': (event, template) => {
    template.editIt.set(false);
    Template.orderApprove.__helpers.get('edit').call();
  },
  /**
     * TODO:Complete JS doc
     * @param event
     */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set('');
    template.approvalDetailsList.set(false);
    template.editIt.set(false);
    template.itemsDetailsList.set('');
    template.approvalDetailsValue.set('');
    let id = event.currentTarget.id;
    let detailcreated = $("#detailcreated");
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
    let custRefDate = $('#detailCustRefDate');
    let detailApprovedBy = $('#detailApprovedBy');
    let detailApprovedDate = $("#detailApprovedDate");
    let detailApprovedRemark = $("#detailApprovedRemark");
    let ribNumberS = $('#detailribNumber');
    let driverNameS = $('#detaildriverName');
    let street = '';
    let city = '';
    let block = '';
    let remark = $('#detailRemark');
    let salesPerson = $('#detailSalesPerson');
    let outstandingValue = $('#outstandingValue');
    let creditLimitValue = $('#creditLimitValue');
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
        let weightAmt = Number(order.weight).toFixed(2)
        $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(docDeliver).html(moment(order.docDueDate).format("DD-MM-YYYY"));
        $(remark).html(order.remark_order);
        $(salesPerson).html(order.salesmanName);
        $(custRefDate).html(moment(order.custRefDate).format("DD-MM-YYYY"));
        $(custRef).html(order.custRefNo);
        $(cardName).html(order.cardName);
        $(branchs).html(order.branchName);
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
        if (order.firstAppovalDate) {
          $(detailApprovedBy).html(order.firstAppovalName);
          $(detailApprovedDate).html(moment(order.firstAppovalDate).format("DD-MM-YYYY"));
          $(detailApprovedRemark).html(order.firstApprovalRemarks);
        }

        if (order.accountantApproval !== undefined && order.accountantApproval === true) {
          template.approvalDetailsList.set(true);
          template.approvalDetailsValue.set(order);
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
        if (order.mobileId !== '' && order.mobileId !== undefined) {
          $(detailcreated).html('Mobile App');
        } else {
          $(detailcreated).html('Web App');
        }
        invoiceDetialsView(order.orderId);
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
    // for getting invoice details based on order
    function invoiceDetialsView(orderId) {
      Meteor.call('invoice.orderId', orderId, (invoiceError, invoiceResult) => {
        if (!invoiceError) {
          if (orderId !== undefined) {
            let inv = invoiceResult;
            if (inv) {
              template.itemList.set(inv);
            } else {
              template.itemList.set([]);
            }
          }
        }
      });
    }

  },
  /**
* TODO: Complete JS doc
* for show filter display
*/
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
* for hide filter display
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
    $('#oRStatus').val('').trigger('change');
    $("#submit").attr("disabled", false);
    template.editIt.set(false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
    template.itemEditCheck.set(false);
    template.editUnitList.set('');
    itemCheckValidation = false;
    approvalResonArray = [];
    approvalValue = false;

  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.itemArray.set('');
    $('#oRStatus').val('').trigger('change');
    $("#submit").attr("disabled", false);
    template.editIt.set(false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
    template.itemEditCheck.set(false);
    template.editUnitList.set('');
    approvalResonArray = [];
    approvalValue = false;


  },

  /**
  * TODO: Complete JS doc
  * @param event
  * for order status update
  */
  'submit .statusUpdate': (event, template) => {
    event.preventDefault();
    let target = event.target;
    $(".orderApprovalBtn").prop('disabled', true);
    Meteor.setTimeout(function () {
      $(".orderApprovalBtn").prop('disabled', false);
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
          }
        });
      }
      else if (status === 'onHold' || status === 'rejected') {
        Meteor.call('order.accountantUpdates', orderId, status, remarks, (error) => {
          if (error) {
            $('#message').html("Internal error - unable to approve entry. Please try again");
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          } else {

            // $("#orderDetailPage").modal('hide');
            $('#orderSuccessModal').find('.modal-body').text('Order Status Updated Successfully');
            $('#orderSuccessModal').modal();
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          }
        });
      }
    }
    /**
   * Accountant approval ends
   */
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
          }
        });
      }
      else if (status === 'onHold' || status === 'rejected') {
        Meteor.call('order.updates', orderId, status, remarks, (error) => {
          if (error) {
            $('#message').html("Internal error - unable to approve entry. Please try again");
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          } else {

            // $("#orderDetailPage").modal('hide');
            $('#orderSuccessModal').find('.modal-body').text('Order Status Updated Successfully');
            $('#orderSuccessModal').modal();
            template.orderIds.set('');
            $('#oRStatus').val('').trigger('change');
            $('.statusUpdate').each(function () {
              this.reset();
            });
          }
        });
      }
    }
  },

  /**
  * TODO: Compelete JS doc
  * for view sales quotation edit modal
  * 
  */
  'click .orderEditButton': (event, template) => {
    itemCheck = false;
    itemArray = [];
    approvalResonArray = [];
    approvalValue = false;
    template.itemArray.set([]);
    let ids = event.currentTarget.id;
    // Meteor.setTimeout(function () {
    // template.itemNameOrder.set('');
    // },100);
    template.modalLoader.set('');
    template.orderIdEdit.set(ids);
    Session.set("ordIds", ids);
    branchArrayCheck = [];
    customerArrayCheck = [];
    branchArrayCheck.push('4');
    branchArrayCheck.push('1');
    branchArrayCheck.push('3');
    branchArrayCheck.push('6');
    branchArrayCheck.push('7');
    customerArrayCheck.push('CGZL00000988');
    customerArrayCheck.push('CGZL00000938');
    customerArrayCheck.push('CGZL00000032');
    customerArrayCheck.push('CGZL00000056');
    customerArrayCheck.push('CGZL00000937');
    customerArrayCheck.push('CGZL00000993');
    customerArrayCheck.push('CGZL00000535');
    customerArrayCheck.push('CGZL00000970');
    customerArrayCheck.push('CGZL00000003');
    customerArrayCheck.push('CGZL00000009');
    customerArrayCheck.push('CGZL00000935');
    customerArrayCheck.push('CGZL00000041');
    customerArrayCheck.push('CGZL00000963');
    customerArrayCheck.push('CGZL00000934');
    customerArrayCheck.push('CGZL00000987');
    customerArrayCheck.push('CGZL00000018');
    customerArrayCheck.push('CGZL00001076');
    customerArrayCheck.push('CGZL00000015');
    customerArrayCheck.push('CGZL00000011');
    customerArrayCheck.push('CGZL00000002');
    customerArrayCheck.push('CGZL00000365');
    customerArrayCheck.push('CGZL00001130');
    customerArrayCheck.push('CGZL00000338');
    customerArrayCheck.push('CGZL00000372');
    customerArrayCheck.push('CGZL00000017');
    customerArrayCheck.push('CGZL00000007');
    customerArrayCheck.push('CGZL00000014');
    let customerCard = ("#editCustomerName");
    let customerShipping = ('#customerShipping');
    let CustomerPType = ("#editPriceType");
    let docDeliver = ("#deliveryDateEdit");
    let custrefNo = ("#custRefNoEdit");
    let custRefDate = ("#custRefdateEdit");
    let custRemark = ("#custRemarkEdit");
    let ribNumber = $('#ribNumberEdit');
    let driverName = $('#driverNameEdit');
    let detailBranchEdit = $('#detailBranchEdit');

    $("#selectItemsEdit").val('').trigger('change');
    $("#selectItemTaxEdit").val('').trigger('change');
    $("#selectUnitEdit").val('').trigger('change');
    $('#exPriceEdit').val('');
    $('#inPriceEdit').val('');
    $('#itemRemarkEdit').val('');
    $("#quantityEdit").val('');
    $("#itemCategoryEdit").html('');
    $('#brandEdit').html('');
    $('#manufacturerEdit').html('');
    $("#unitQuantityShowsEdit").html('');

    let street = '';
    let city = '';
    let block = '';
    let pVar = '';
    let currencyValues = Session.get("currencyValues");
    if (ids) {
      $("#orderEditDetailPage").modal();
      let header = $('#orderHs');
      $(header).html('Details of Order');
      Meteor.setTimeout(function () {
        template.itemNameOrder.set('');
      }, 750);
      Meteor.call('order.id', ids, (err, res) => {
        if (!err) {
          // template.quotationIds.set(res);
          template.itemArray.set(res.itemLines);
          template.priceModes.set(res.priceMode);
          template.getBranch.set(res.branch);
          template.customerCodeEdit.set(res.cardCode);
          template.customerPriceType.set(res.priceType);
          template.customerAddress.set(res.address);
          custData(res.cardCode, res.branch);
          approvalCal(res.cardCode, res.branch);
          customerDetails(res.cardCode);
          priceTypename(res.priceType);
          $(customerCard).html(res.cardName);
          $(custrefNo).html(res.custRefNo);
          $(custRefDate).html(moment(res.custRefDate).format("DD-MM-YYYY"));
          $(custRemark).html(res.remark_order);
          $(detailBranchEdit).html(res.branchName);
          $(docDeliver).html(moment(res.docDueDate).format("DD-MM-YYYY"));
          if (res.ribNumber !== undefined && res.ribNumber !== '') {
            $(ribNumber).html(res.ribNumber);
          }
          else {
            $(ribNumber).html('');
          }
          if (res.driverName !== undefined && res.driverName !== '') {
            $(driverName).html(res.driverName);
          }
          else {
            $(driverName).html('');
          }
          if (res.street === undefined) {
            street = '';
          }
          else {
            street = res.street;
          }
          if (res.block === undefined) {
            block = '';
          }
          else {
            block = res.block;
          }
          if (res.city === undefined) {
            city = '';
          }
          else {
            city = res.city;
          }
          $(customerShipping).html(street + "&nbsp;" + block + "&nbsp;" + city);
          // $('#remark_OrderEdit').val(res.remark_order);
          $('#custRefEdit').val(res.custRefNo);
          $(".refDateEdit").val(res.custRefDate);
          $(".dueDateEdit").val(moment(res.docDate).format('YYYY-MM-DD'));
          // $("#taxAddedEdit").html(res.GST);
          let gstAmt = Number(res.GST).toFixed(6);
          $("#taxAddedEdit").html(((gstAmt).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          let totalAmt = Number(res.docTotal).toFixed(6);
          $("#totalEdit").html(((totalAmt).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          let totalWeightCal = res.weight;
          $("#weightTotalEdit").html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          for (let n = 0; n < res.itemLines.length; n++) {
            itemArray.push(res.itemLines[n]);
          }
          // template.modalLoader.set(res);

        }
      });


    }
    function customerDetails(customer) {
      Meteor.call('customer.customerFindOne', customer, (err, res) => {
        if (!err) {
          template.customerDetailsValue.set(res);

        }
      });

    }
    function custData(cardCode, branch) {
      Meteor.call('customerPriceList.cardCodeBranch', cardCode, branch, (err, res) => {
        if (!err) {
          Meteor.setTimeout(function () {
            if (res) {
              pVar = res;
              // $('#selectPriceTypeEdit').val(res).trigger('change');
              itemListTake(pVar);
            }
          }, 100);
        }
      });
    }
    function itemListTake(pVar) {
      Meteor.call('itemGetPrice.customerItemList', pVar, (customerItemListErr, customerItemListRes) => {
        if (!customerItemListErr) {
          if (customerItemListRes !== undefined) {
            template.itemNameOrder.set(customerItemListRes);
            template.modalLoader.set(customerItemListRes);
          }
        }
      });
    }
    function priceTypename(priceType) {
      Meteor.call('customerPriceList.priceListNameGet', priceType, (err, res) => {
        if (!err) {
          $(CustomerPType).html(res.pLName);
        }
      });
    }
    function approvalCal(customer, branch) {
      let totalAmount = 0;
      let currentDate = moment(new Date()).format('YYYY-MM-DD');
      Meteor.call('invoice.invoiceorderLIst', customer, currentDate, (err, res) => {
        if (!err && res !== undefined) {
          // console.log("resss", res);
          if (res.length > 0 && $.inArray(branch, branchArrayCheck) === -1 && $.inArray(customer, customerArrayCheck) === -1) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].grandTotal === undefined) {
                totalAmount += Number(res[i].docTotal);
              }
              else {
                totalAmount += Number(res[i].grandTotal);
              }
            }
            let amtVal = Number(totalAmount).toFixed(2)
            let reasonObject = {
              reason: "Customer Payment Is Pending.",
              totalBills: res.length,
              totalAmount: Number(totalAmount).toFixed(6),
              reasonValue: `Total Bills Pending ${res.length}. Total Bills Amount Pending ${amtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (${currencyValues}) `
            }
            approvalResonArray.push(reasonObject);
            approvalValue = true;
            // console.log("approvalResonArray", approvalResonArray);
          }
        }
      });
    }
  },
  /**
* TODO: Compelete JS doc
* for change the value of unit
*/
  'click #selectItemsEditDiv': (event, template) => {
    template.itemEditCheck.set(false);
  },
  /**
       * TODO:Complete Js doc
       * On Branch change Listing Customer, items.
       */

  'change #selectBranchEdit ': (event, template) => {
    let brnch = '';
    branchChange = false;

    $('#selectBranchEdit').find(':selected').each(function () {
      brnch = $(this).val();
    });
    if (brnch !== '' && brnch !== "Select Branch") {
      template.branchCode.set(brnch);
      // Getting customer by branch
      Meteor.call('customer.customerByBranch', brnch, (err, res) => {
        if (!err) {
          template.customerBranch.set(res);
        }
      });
    }
  },

  /**
   * TODO:Complete Js doc
   * Adding item to the list and showing the amounts.
   */
  'click .addItemEdit': (event, template) => {
    event.preventDefault();
    let supervisor = '';
    let itemObject = '';
    let customerCode = '';
    let category = '';
    let branchCode = Template.instance().getBranch.get();
    let wareHouse = '';
    let itmRemark = $('#itemRemarkEdit').val();
    customerCode = Template.instance().customerCodeEdit.get();
    $('#selectItemsEdit').find(':selected').each(function () {
      supervisor = $(this).val();
    });

    if (supervisor === '' || supervisor === 'Select Item') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#itemArrayspanEdit").html('<style> #itemArrayspanEdit { color:#fc5f5f }</style><span id ="itemArrayspanEdit">Please select a Item</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#itemArrayspanEdit').fadeOut('slow');
      }, 3000);
    } else {
      let unitK = '';
      $('#selectUnitEdit').find(':selected').each(function () {
        unitK = $(this).val();
      });
      if (unitK === '' || unitK === 'Select Unit') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#unitArrayspanEdit").html('<style> #unitArrayspanEdit { color:#fc5f5f }</style><span id ="unitArrayspanEdit">Please select a Unit</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#unitArrayspanEdit').fadeOut('slow');
        }, 3000);
      } else {
        let quantity = $("#quantityEdit").val();

        if (quantity === '' || Number(quantity) === 0) {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#quantityArrayspanEdit").html('<style> #quantityArrayspanEdit { color:#fc5f5f }</style><span id ="quantityArrayspanEdit">Please enter Quantity</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#quantityArrayspanEdit').fadeOut('slow');
          }, 3000);
        } else {
          let inPrice = $("#inPriceEdit").val();

          if (inPrice === '' || Number(inPrice) === 0) {
            $(window).scrollTop(0);
            setTimeout(function () {
              $("#inPriceArrayspanEdit").html('<style> #inPriceArrayspanEdit { color:#fc5f5f }</style><span id ="inPriceArrayspanEdit">Inclusive price cannot be zero or empty</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#inPriceArrayspanEdit').fadeOut('slow');
            }, 3000);
          } else {
            let exPrice = $("#exPriceEdit").val();

            if (exPrice === '' || Number(exPrice) === 0) {
              $(window).scrollTop(0);
              setTimeout(function () {
                $("#exPriceArrayspanEdit").html('<style> #exPriceArrayspanEdit { color:#fc5f5f }</style><span id ="exPriceArrayspanEdit">Exclusive price cannot be zero or empty</span>').fadeIn('fast');
              }, 0);
              setTimeout(function () {
                $('#exPriceArrayspanEdit').fadeOut('slow');
              }, 3000);
            } else {
              $(".addItemEdit").prop('disabled', true);
              Meteor.setTimeout(function () {
                $(".addItemEdit").prop('disabled', false);
              }, 5000);
              if (itemArray.length > 0) {
                for (let i = 0; i < itemArray.length; i++) {
                  if (supervisor === itemArray[i].itemCode) {
                    itemCheckValidation = true;
                    toastr['error'](itemAlreadyExistsMessage);
                    break;
                  }
                  else {
                    itemCheckValidation = false;
                  }
                }
              }
              let itemCode = supervisor;
              let itemDetail = '';
              let unitDetail = '';

              let salesPrice = exPrice;
              let taxPrice = inPrice;
              let vatGroupName = Template.instance().vatGroupSelected.get();
              let ugGet = Template.instance().selecteItemDetil.get();

              itemWithItemCode(supervisor);
              uomDetail(unitK, supervisor);
              itemPriceByItem(supervisor, customerCode);

              // Getting item details
              function itemWithItemCode(supervisor) {
                Meteor.call('item.itemCode', supervisor, (error, response) => {
                  if (!error) {
                    template.itemDetail.set(response);
                    itemDetail = response;
                  }
                });
              }
              // Getting unit data
              function uomDetail(unitK, supervisor) {
                Meteor.call('unit.uomCodeUgpCode', unitK, supervisor, (unitErr, unitData) => {
                  if (!unitErr) {
                    template.unitDetail.set(unitData);
                    unitDetail = unitData;

                  }
                });
              }
              // Getting item price
              function itemPriceByItem(supervisor, customerCode) {
                Meteor.call('itemSpecialPrice.itemCodeCardCode', supervisor, customerCode, (er, result) => {
                  if (!er && result !== undefined) {
                    discountAmount = itemSpecial.discount;
                    itemArrayFunction(discountAmount);
                  } else {
                    discountAmount = '0';
                    itemArrayFunction(discountAmount);
                  }

                });
              }
              wareHouse = Template.instance().wareHouseData.get();
              unitDetail = Template.instance().unitDetail.get();
              let tarArrayListName = Template.instance().taxArrayOrder.get()
              let taxNameVat = tarArrayListName.find(x => x.taxCode === vatGroupName).name;
              function itemArrayFunction(discountAmount) {
                let randomId = Random.id();
                let afterDiscount = '';
                let beforeDiscount = Number(quantity * Number(taxPrice)).toFixed(6);
                let discountPercent = Number(discountAmount) * discountPercentAmount / (beforeDiscount);
                // if (mVATBoolean === true) {
                //   afterDiscount = Number(taxPrice * Number(quantity)).toFixed(6);
                // } else {
                afterDiscount = Number(beforeDiscount - Number(discountAmount)).toFixed(6);
                // }

                if (isNaN(discountPercent)) {
                  discountPercent = "0";
                }
                if (mVATBoolean === true) {
                  grossTotalPrice = Number(Number(quantity) * Number(salesPrice));
                } else {
                  grossTotalPrice = Number(Number(quantity) * Number(taxPrice));
                }
                let unitPrices = Number(salesPrice).toFixed(6);
                let taxPrices = Number(taxPrice).toFixed(6);
                let taxRates = Number(taxForItem).toFixed(6);
                itemObject = {
                  randomId: randomId,
                  uoMEntry: unitDetail.uomEntry,
                  unitQuantity: unitDetail.baseQty,
                  uomCode: unitDetail.uomCode,
                  unitPrice: unitPrices.toString(),
                  price: unitPrices.toString(),
                  salesPrice: unitPrices.toString(),
                  grossTotal: grossTotalPrice.toString(),
                  incPrice: taxPrices.toString(),
                  excPrice: unitPrices.toString(),
                  itemCategory: category,
                  itemCode: itemCode,
                  mVATBoolean: mVATBoolean,
                  u_MVATPerStockUnit: ugGet.u_MVATPerStockUnit,
                  invWeight: ugGet.invWeight,
                  itemNam: itemDetail.itemNam,
                  quantity: quantity,
                  taxRate: taxRates.toString(),
                  vatGroup: vatGroupName,
                  vatGroupName: taxNameVat,
                  discount: discountPercent.toString(),
                  discountAmount: discountAmount,
                  whsCode: wareHouse,
                  beforeDiscount: beforeDiscount.toString(),
                  afterDiscount: afterDiscount.toString(),
                  itemRemark: itmRemark,
                  updatedAt: new Date(),
                };

                if (itemCheckValidation === false) {
                  itemArray.push(itemObject);
                  template.itemArray.set(itemArray);
                  itemCheck = true;
                  amountShowing();

                }
              }
              // for showing amount
              function amountShowing() {
                this.bDis = 0;
                for (let i = 0; i < itemArray.length; i++) {
                  this.bDis += Number(itemArray[i].beforeDiscount);
                  let bFixed = parseFloat(this.bDis).toFixed(6);
                  template.beforeDiscount.set(bFixed);
                  let beforeDiscount = $('#beforeDiscount');
                  $(beforeDiscount).html(bFixed);
                }
                this.aDis = 0;
                for (let i = 0; i < itemArray.length; i++) {
                  this.aDis += Number(itemArray[i].afterDiscount);
                  let aFixed = parseFloat(this.aDis).toFixed(6);
                  template.afterDiscount.set(aFixed);
                  let afterDiscount = $('#afterDiscount');
                  $(afterDiscount).html(aFixed);
                }
                let taxAdd = 0;
                for (let l = 0; l < itemArray.length; l++) {
                  taxAdd += Number(itemArray[l].taxRate) * Number(itemArray[l].quantity) //change
                }
                let totalP = 0;
                for (let l = 0; l < itemArray.length; l++) {
                  totalP += Number(itemArray[l].incPrice * itemArray[l].quantity); //change
                }
                let totalWeightCal = 0;
                for (let s = 0; s < itemArray.length; s++) {
                  let multiplication = Number(itemArray[s].quantity * itemArray[s].unitQuantity * itemArray[s].invWeight);
                  totalWeightCal += Number(multiplication);
                }

                let taxFixed = parseFloat(taxAdd).toFixed(6);
                template.gST.set(taxFixed);
                let tot = parseFloat(totalP);

                let totFixed = parseFloat(tot).toFixed(6);
                template.grandTotal.set(totFixed);
                $("#selectItemsEdit").val('').trigger('change');
                $("#selectItemTaxEdit").val('').trigger('change');
                $("#selectUnitEdit").val('').trigger('change');
                $("#selectItemTaxEdit").val('').trigger('change');
                clearFields('quantity', 'price', 'discount', 'discountAmount')
                $("#discountAmount:input").prop('disabled', false);
                $("#discount:input").prop('disabled', false);
                let brand = $('#brandEdit');
                let manufacturer = $('#manufacturerEdit');
                let itemPriceL = $('#itemPriceEdit');
                let itemCategory = $('#itemCategoryEdit');
                let total = $('#totalEdit');
                let taxAdded = $('#taxAddedEdit');
                $(taxAdded).html((taxFixed.toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                let totalWeightC = $('#weightTotalEdit');
                $(totalWeightC).html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                $(total).html((totFixed.toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                $(brand).html('');
                unitPrice = 0;
                txAmt = 0;
                taxVat = 0;
                taxForItem = 0;
                exPrice = 0;
                inPrice = 0;
                unitPriceChanged = 0;
                $(manufacturer).html('');
                $(itemPriceL).html('');
                $(itemCategory).html('');
                $('#itemRemarkEdit').val('');
                $("#inPriceEdit").val('');
                $("#exPriceEdit").val('');
                $('#unitQuantityShowsEdit').html('');
                $("#quantityEdit").val('');
                template.wareHouseData.set('');
                wareHouse = '';
                itemCheckValidation = false;
                template.itemEditCheck.set(false);
                template.editUnitList.set('');
              }
            }
          }
        }
      }
    }

  },
  /**
   * TODO:Complete Js doc
   *Item change getting the price of items and showing categories.
   */
  'change #selectItemsEdit': (event, template) => {
    let itemPriceDetail = '';

    itemCheckValidation = false;
    let selecteditem = '';
    let itemDetailresponses = '';
    let branchCode = Template.instance().getBranch.get();
    unitPrice = 0;
    txAmt = 0;
    taxVat = 0;
    taxForItem = 0;
    exPrice = 0;
    inPrice = 0;
    unitPriceChanged = 0;
    template.unitPricItem.set(0);
    template.itemPriceDetail.set('');
    template.selecteItemDetil.set('');
    template.unitNameOrder.set('');
    template.unitSelected.set('');
    let priceMode = Template.instance().priceModes.get();

    $('#selectItemsEdit').find(':selected').each(function () {
      selecteditem = $(this).val();
    });
    branchWithId(branchCode, selecteditem);
    function branchWithId(branchCode, selecteditem) {
      Meteor.call('defaultWareHouse.branchWareHouse', branchCode, selecteditem, (err, res) => {
        if (!err && res !== undefined) {
          // console.log("res", res);
          wareHouse = res.whsCode;
          // console.log("wareHouse.", wareHouse);
          template.wareHouseData.set(res.whsCode);
        }
        else {
          branchWareHouse(branchCode);
        }
      });
    }
    function branchWareHouse(branchCode) {
      Meteor.call('branch.findOne', branchCode, (branchError, branchResult) => {
        if (!branchError && branchResult !== undefined) {
          // console.log("branchCode", branchCode);
          // console.log("res..", branchResult);
          wareHouse = branchResult.dflWhs;
          // console.log("wareHouse..", wareHouse);
          template.wareHouseData.set(branchResult.dflWhs);
        }
      });
    }


    let customerDetails = Template.instance().customerDetail.get();

    template.selectedItem.set(selecteditem);

    if (selecteditem !== '' && selecteditem !== 'Select Item') {
      unitItemCodeCheck(selecteditem);
      itemCategoryDetail(selecteditem);
      manufactureBrandGet(selecteditem);
      priceListFindItem(selecteditem);
      template.selectedItem.set(selecteditem);
    }

    function unitItemCodeCheck(selecteditem) {
      Meteor.call('unit.itemCode', selecteditem, (err, res) => {
        if (!err) {
          template.unitNameOrder.set(res);
        }
      });
      // Template.arInvoicePayment_create.__helpers.get("unitList").call();
    };
    //Meteor call to take particular item details
    function manufactureBrandGet(selecteditem) {
      Meteor.call('item.itemCode', selecteditem, (err, result) => {
        if (!err && result !== undefined) {
          $('#selectItemTaxEdit').val(result.vatGourp).trigger('change');
          itemVatGroup = result.vatGourp;
          taxGetting(itemVatGroup);
          let item = result;
          let brand = $('#brandEdit');
          let manufacturer = $('#manufacturerEdit');
          $(brand).html('Brand: ' + item.brand);
          $(manufacturer).html('Manufacturer: ' + item.manufacturer);
        } else {
          let brand = $('#brandEdit');
          let manufacturer = $('#manufacturerEdit');
          $(brand).html('');
          $(manufacturer).html('');
        }
      });
    };

    // new implementation for TAx Cal
    function taxGetting(itemTaxGroup) {
      Meteor.call('tax.findOne', itemTaxGroup, (taxErr, taxRes) => {
        if (!taxErr) {
          itemTaxRate = taxRes.rate;
        }
      });
    }
    // Ends

    function priceListFindItem(selecteditem) {
      let priceList = Template.instance().customerPriceType.get();
      // $('#selectPriceTypeEdit').find(':selected').each(function () {
      //   priceList = $(this).val();
      // });
      //Meteor call to take particular Customer Item Price detail
      let defBrnch = Template.instance().getBranch.get();
      Meteor.call('itemGetPrice.itemCodePriceList', selecteditem, priceList, defBrnch, (itemErr, itemRes) => {
        if (!itemErr && itemRes !== undefined) {
          itemPriceDetail = itemRes;
          template.itemPriceDetail.set(itemRes);
          // if (priceMode === "G") {
          itemUnitPriceFun();
          // } else {
          //   $("#itemPriceEdit").html('Price: ' + itemRes.u_NetPrc);
          //   itemUnitPriceFun(itemRes.u_NetPrc);
          // }
        } else {
          template.unitPricItem.set(Number(itemUnitPriceConstant));
          $("#itemPriceEdit").html('Price:' + itemUnitPriceConstant);
          $("#inPriceEdit").html(itemUnitPriceConstant);
          // toastr['error'](itemPriceIsNotThereMessage);
        }
      });
    };
    // Getting itemCategory form item
    function itemCategoryDetail(selectedItem) {
      Meteor.call('item.itemCode', selectedItem, (error, response) => {
        if (!error) {
          itemDetailresponses = response;
          itemUnitPriceFun();
          template.selecteItemDetil.set(response);
          Meteor.call('itemCategory.itemGrpCode', response.itmsGrpCod, (err, res) => {
            if (!err) {
              let itemS = res;
              let itemCategory = $('#itemCategoryEdit');
              $(itemCategory).html('Item Category: ' + itemS.itmsGrpNam);
            } else {
              let itemCategory = $('#itemCategoryEdit');
              $(itemCategory).html('Item Category: ');
            }
          });
        }
      });
    };
    // getting unitprice of item
    function itemUnitPriceFun(priceUnit) {
      if (itemPriceDetail !== undefined && itemPriceDetail !== '' && itemDetailresponses !== undefined && itemDetailresponses !== '') {

        if (priceMode === "G") {
          let priceP = itemPriceDetail.u_GrossPrc;
          let uomEntyP = itemPriceDetail.u_UOM;
          let ugpCodeP = itemDetailresponses.ugpCode;
          Meteor.call('unit.uomEntry', uomEntyP, ugpCodeP, (err, res) => {
            if (!err && res !== undefined) {
              initialQuantity = res.baseQty;
              template.unitSelected.set(res);
              let unitPricItem = Number(priceP) / Number(res.baseQty);
              template.unitPricItem.set(Number(unitPricItem));
            }
          });
        } else {
          let priceP = itemPriceDetail.u_NetPrc;
          let uomEntyP = itemPriceDetail.u_UOM;
          let ugpCodeP = itemDetailresponses.ugpCode;
          Meteor.call('unit.uomEntry', uomEntyP, ugpCodeP, (err, res) => {
            if (!err && res !== undefined) {
              initialQuantity = res.baseQty;
              template.unitSelected.set(res);
              let unitPricItem = Number(priceP) / Number(res.baseQty);
              template.unitPricItem.set(Number(unitPricItem));
            }
          });
        }
      };
    }
  },
  /**
   * TODO:Complete Js doc
   * As per unit change getting the price calculated.
   * 
   */
  'change #selectUnitEdit ': (event, template) => {
    let unit = '';
    let unitPricChanged = '';
    itemCheckValidation = false;
    priceItem = 0;
    txAmt = 0;
    taxVat = '';
    let priceMode = Template.instance().priceModes.get();
    $('#selectUnitEdit').find(':selected').each(function () {
      unit = $(this).val();
    });

    if (unit !== '' && unit !== "Select Unit") {
      unitArray = Template.instance().unitNameOrder.get();
      ugGet = Template.instance().selecteItemDetil.get();
      priceDetal = Template.instance().itemPriceDetail.get();
      unitPrice = Template.instance().unitPricItem.get();

      let cust = Template.instance().customerDetail.get();
      // if (priceDetal !== undefined && priceDetal.u_TaxAmt !== '') {
      //   txAmt = Number(priceDetal.u_TaxAmt);
      // } else {
      //   txAmt = 0;
      // }
      let mVat = ugGet.u_MVATPerStockUnit;
      taxVat = itemVatGroup;

      if (priceMode === "G") {
        if (itemVatGroup === "OTVAT005") {
          // MVAT Tax CAl Starts
          txAmt = (Number(mVat) * Number(initialQuantity)).toFixed(6);
          // MVAT Tax Cal End
          // console.log("txAmtMVAT", txAmt);
          let untPrc = Number(unitPrice) - Number(mVat);
          unitPricChanged = untPrc;
        } else {
          // console.log("itemTaxRate", itemTaxRate);
          // Tax Cal Not MVAT  Starts
          txAmt = (((Number(unitPrice) * Number(initialQuantity)) * Number(itemTaxRate)) / (vatCalculationAmount + Number(itemTaxRate))).toFixed(6)
          // console.log("txAmtNotMVAT", txAmt);
          // Tax Cal Not MVAT  Ends
          unitPricChanged = unitPrice;
        }
      } else {
        if (itemVatGroup === "OTVAT005") {
          // MVAT Tax CAl Starts
          txAmt = (Number(mVat) * Number(initialQuantity)).toFixed(6);
          // MVAT Tax Cal End
          // console.log("txAmtMVAT", txAmt);
          unitPricChanged = Number(unitPrice);

        } else {
          // console.log("itemTaxRate", itemTaxRate);
          // Tax Cal Not MVAT  Starts
          txAmt = (((Number(unitPrice) * Number(initialQuantity)) * Number(itemTaxRate)) / (vatCalculationAmount)).toFixed(6);
          // console.log("txAmtNotMVAT", txAmt);
          // Tax Cal Not MVAT  Ends
          unitPricChanged = unitPrice;
        }
      }
      if (unitArray) {
        let uniEnty = unitArray.find(x => x.uomCode === unit);
        Meteor.call('unit.ugpCodeuomEntry', uniEnty.uomEntry, ugGet.ugpCode, (error, response) => {
          if (!error && response !== undefined) {
            let baseQty = response.baseQty;
            unitBaseQty = response.baseQty; //change1
            if (priceDetal.u_UOM === unit) {
              txAmt = txAmt
            } else if (txAmt > 0) {
              txAmt = (Number(txAmt) / Number(initialQuantity)) * Number(baseQty);
            }
            priceItem = Number(baseQty) * Number(unitPricChanged);
            let quantity = $('#unitQuantityShowsEdit');
            $(quantity).html('Base Quantity: ' + Number(baseQty).toFixed(6));

            if (priceMode === "G" && itemVatGroup !== "OTVAT005") {
              // unitPrice = Number(priceItem).toFixed(6);
              taxForItem = txAmt;
              if (Number(priceItem) < 0) {
                $("#inPriceEdit").val(0.000000);
              }
              else {
                $("#inPriceEdit").val(Number(priceItem).toFixed(6));
              }
              let exclusivePrice = (Number(priceItem - txAmt));
              if (Number(exclusivePrice) < 0) {
                $("#exPriceEdit").val(0.000000);
              }
              else {
                $("#exPriceEdit").val(exclusivePrice.toFixed(6));
              }
              exPrice = priceItem;
              // template.unitPricItem.set((Number(exclusivePrice).toFixed(6)).toString());
              $("#itemPriceEdit").html('Price: ' + Number(exclusivePrice).toFixed(6));

            }
            else if (priceMode === "G" && itemVatGroup === "OTVAT005") {
              // unitPrice = Number(priceItem).toFixed(6);
              taxForItem = txAmt;

              if ((Number(priceItem) + Number(txAmt)) < 0) {
                $("#inPriceEdit").val(0.000000);
              }
              else {
                $("#inPriceEdit").val((Number(priceItem) + Number(txAmt)).toFixed(6));
              }
              if (Number(priceItem) < 0) {
                $("#exPriceEdit").val(0.000000);
              }
              else {
                $("#exPriceEdit").val(Number(priceItem).toFixed(6));
              }
              exPrice = Number(priceItem) + Number(txAmt);
              // template.unitPricItem.set((Number(priceItem).toFixed(6)).toString());
              $("#itemPriceEdit").html('Price: ' + Number(priceItem).toFixed(6));

            } else if (priceMode === "N" && itemVatGroup === "OTVAT005") {
              // unitPrice = Number(priceItem).toFixed(6);
              taxForItem = txAmt;
              if ((Number(priceItem) + Number(txAmt)) < 0) {
                $("#inPriceEdit").val(0.000000);
              }
              else {
                $("#inPriceEdit").val((Number(priceItem) + Number(txAmt)).toFixed(6));
              }
              if (Number(priceItem) < 0) {
                $("#exPriceEdit").val(0.000000);
              }
              else {
                $("#exPriceEdit").val(Number(priceItem).toFixed(6));
              }
              exPrice = Number(priceItem) + Number(txAmt);
              // template.unitPricItem.set((Number(priceItem).toFixed(6)).toString());
              $("#itemPriceEdit").html('Price: ' + Number(priceItem).toFixed(6));

            } else if (priceMode === "N" && itemVatGroup !== "OTVAT005") {
              // unitPrice = Number(priceItem).toFixed(6);
              if (Number(priceItem) < 0) {
                $("#exPriceEdit").val(0.000000);
              }
              else {
                $("#exPriceEdit").val(Number(priceItem).toFixed(6));
              }
              let inclusivePrice = Number(priceItem) + Number(txAmt);
              if (Number(inclusivePrice) < 0) {
                $("#inPriceEdit").val(0.000000);
              }
              else {
                $("#inPriceEdit").val(inclusivePrice.toFixed(6));
              }
              exPrice = priceItem;
              // template.unitPricItem.set((Number(priceItem).toFixed(6)).toString());
              $("#itemPriceEdit").html('Price: ' + Number(priceItem).toFixed(6));

            }
          }
        });
      }
    }
  },
  /**
   * TODO:Complete Js doc
   * As per tax change getting the price calculated.
   * 
   */
  'change #selectItemTaxEdit': (event, template) => {
    mVATBoolean = false;
    let itemTaxGroup = '';
    let priceMode = Template.instance().priceModes.get();
    let custmrDtl = Template.instance().customerDetail.get();
    let ugGet = Template.instance().selecteItemDetil.get();
    let unitValues = '';
    $('#selectUnitEdit').find(':selected').each(function () {
      unitValues = $(this).val();
    });
    $('#selectItemTaxEdit').find(':selected').each(function () {
      itemTaxGroup = $(this).val();
    });
    if (itemTaxGroup !== '' && itemTaxGroup !== "Select Tax") {
      template.vatGroupSelected.set(itemTaxGroup);
      // let priceMode = custmrDtl.priceMode;
      if (priceMode === "G" && itemTaxGroup !== "OTVAT005") {
        if (itemTaxGroup === taxVat) {
          let untPrc = Number(exPrice - txAmt);
          taxForItem = txAmt;
          if (Number(untPrc) < 0) {
            $("#exPriceEdit").val(0.000000);
          }
          else {
            $("#exPriceEdit").val(Number(untPrc).toFixed(6));
          }
          if (Number(priceItem) < 0) {
            $("#inPriceEdit").val(0.000000);
          }
          else {
            $("#inPriceEdit").val(Number(priceItem).toFixed(6));
          }

        } else {
          Meteor.call('tax.findOne', itemTaxGroup, (taxErr, taxRes) => {
            if (!taxErr) {
              let taxFromItem = (Number(exPrice) * Number(taxRes.rate)) / (vatCalculationAmount + Number(taxRes.rate));
              taxForItem = taxFromItem;
              let untPrc = Number(exPrice) - Number(taxFromItem);
              if (Number(untPrc) < 0) {
                $("#exPriceEdit").val(0.000000);
              }
              else {
                $("#exPriceEdit").val(untPrc.toFixed(6));
              }
              if (Number(exPrice) < 0) {
                $("#inPriceEdit").val(0.000000);
              }
              else {
                $("#inPriceEdit").val(exPrice.toFixed(6));
              }
            }
          });
        }
      } else if (priceMode === "G" && itemTaxGroup === "OTVAT005") {
        mVATBoolean = true;
        taxForItem = ugGet.u_MVATPerStockUnit;

        if (Number(priceItem) < 0) {
          $("#exPriceEdit").val(0.000000);
        }
        else {
          $("#exPriceEdit").val(Number(priceItem).toFixed(6));
        }
        if ((Number(priceItem) + Number(ugGet.u_MVATPerStockUnit)) < 0) {
          $("#inPriceEdit").val(0.000000);
        }
        else {
          if (unitValues !== '' && unitValues !== "Select Unit") {
            $("#inPriceEdit").val((Number(priceItem) + Number(ugGet.u_MVATPerStockUnit)).toFixed(6));
          }
          else {
            $("#inPriceEdit").val(0.000000);
          }
        }
        // let itemMVAT = {
        //   expenseCode: "3",
        //   mvatTotal: ugGet.u_MVATPerStockUnit,
        //   itemCode: ugGet.itemCode
        // };
        // mVATArray.push(itemMVAT);
        // template.mVATArrayItem.set(mVATArray);

      } else if (priceMode === "N" && itemTaxGroup === "OTVAT005") {
        mVATBoolean = true;
        taxForItem = ugGet.u_MVATPerStockUnit;
        if (Number(priceItem) < 0) {
          $("#exPriceEdit").val(0.000000);
        }
        else {
          $("#exPriceEdit").val(Number(priceItem).toFixed(6));
        }
        if ((Number(priceItem) + Number(ugGet.u_MVATPerStockUnit)) < 0) {
          $("#inPriceEdit").val(0.000000);
        }
        else {
          if (unitValues !== '' && unitValues !== "Select Unit") {
            $("#inPriceEdit").val((Number(priceItem) + Number(ugGet.u_MVATPerStockUnit)).toFixed(6));
          }
          else {
            $("#inPriceEdit").val(0.000000);
          }
        }
        // let itemMVAT = {
        //   expenseCode: "3",
        //   mvatTotal: ugGet.u_MVATPerStockUnit,
        //   itemCode: ugGet.itemCode
        // };
        // mVATArray.push(itemMVAT);
        // template.mVATArrayItem.set(mVATArray);

      } else if (priceMode === "N" && itemTaxGroup !== "OTVAT005") {
        if (itemTaxGroup === taxVat) {
          let untPrc = Number(exPrice) + Number(txAmt);
          taxForItem = txAmt;
          if (Number(priceItem) < 0) {
            $("#exPriceEdit").val(0.000000);
          }
          else {
            $("#exPriceEdit").val(priceItem);
          }
          if (Number(untPrc) < 0) {
            $("#inPriceEdit").val(0.000000);
          }
          else {
            $("#inPriceEdit").val(untPrc.toFixed(6));
          }

        } else {
          Meteor.call('tax.findOne', itemTaxGroup, (taxErr, taxRes) => {
            if (!taxErr) {
              let taxFromItem = (Number(exPrice) * Number(taxRes.rate)) / vatCalculationAmount;
              let untPrc = Number(exPrice) + Number(taxFromItem);
              if (Number(exPrice) < 0) {
                $("#exPriceEdit").val(0.000000);
              }
              else {
                $("#exPriceEdit").val(exPrice.toFixed(6));
              }
              if (Number(untPrc) < 0) {
                $("#inPriceEdit").val(0.000000);
              }
              else {
                $("#inPriceEdit").val(untPrc.toFixed(6));
              }
            }
          });
        }
      }
      else {
        $("#exPriceEdit").val(0.000000);
        $("#inPriceEdit").val(0.000000);


      }
    }
  },
  /**
   * TODO:Complete Js doc
   * Blur the exclusive price
   * 
   */
  'blur #exPriceEdit': () => {
    let exPrice = $("#exPriceEdit").val();
    let itemTaxGroup = '';
    let ugGet = Template.instance().selecteItemDetil.get();
    $('#selectItemTaxEdit').find(':selected').each(function () {
      itemTaxGroup = $(this).val();
    });
    if (itemTaxGroup !== '' && itemTaxGroup !== "Select Tax") {
      if (itemTaxGroup === "OTVAT005") {
        taxForItem = Number(ugGet.u_MVATPerStockUnit * unitBaseQty); //change1
        let untPrc = Number(exPrice) + Number(ugGet.u_MVATPerStockUnit * unitBaseQty); //change1
        if (Number(untPrc) < 0) {
          $("#inPriceEdit").val(0.000000);
        }
        else {
          $("#inPriceEdit").val(untPrc.toFixed(6));
        }
      } else {
        Meteor.call('tax.findOne', itemTaxGroup, (taxErr, taxRes) => {
          if (!taxErr) {
            let taxFromItem = (Number(exPrice) * Number(taxRes.rate)) / discountPercentAmount;
            taxForItem = taxFromItem;
            let untPrc = Number(exPrice) + Number(taxFromItem);
            if (Number(untPrc) < 0) {
              $("#inPriceEdit").val(0.000000);
            }
            else {
              $("#inPriceEdit").val(untPrc.toFixed(6));
            }
          }
        });
      }
    }
  },
  /**
   * TODO:Complete Js doc
   * Blur the inclusive price
   * 
   */
  'blur #inPriceEdit': () => {
    let inPrice = $("#inPriceEdit").val();
    let itemTaxGroup = '';
    let ugGet = Template.instance().selecteItemDetil.get();
    $('#selectItemTaxEdit').find(':selected').each(function () {
      itemTaxGroup = $(this).val();
    });
    if (itemTaxGroup !== '' && itemTaxGroup !== "Select Tax") {
      // console.log("ugGet.u_MVATPerStockUnit", ugGet.u_MVATPerStockUnit);
      if (itemTaxGroup === "OTVAT005") {
        taxForItem = Number(ugGet.u_MVATPerStockUnit * unitBaseQty);        //change1
        let untPrc = Number(inPrice) - Number(ugGet.u_MVATPerStockUnit * unitBaseQty); //change1

        if (Number(untPrc) < 0) {
          $("#exPriceEdit").val(0.000000);
        }
        else {
          $("#exPriceEdit").val(untPrc.toFixed(6));
        }

      } else {
        Meteor.call('tax.findOne', itemTaxGroup, (taxErr, taxRes) => {
          if (!taxErr) {
            let taxFromItem = (Number(inPrice) * Number(taxRes.rate)) / (vatCalculationAmount + Number(taxRes.rate));
            taxForItem = taxFromItem;
            let untPrc = Number(inPrice) - Number(taxFromItem);
            if (Number(untPrc) < 0) {
              $("#exPriceEdit").val(0.000000);
            }
            else {
              $("#exPriceEdit").val(untPrc.toFixed(6));
            }
          }
        });
      }
    }
  },
  /**
 * TODO:Complete Js doc
 *Remove sales order
 */
  'click .salesOrderRemove': (event) => {
    event.preventDefault();
    let header = $('#userHeader');
    let confirmedUuid = $('#confirmedUuid');
    $('#orderDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    $(header).html('Confirm Deletion');
    $(confirmedUuid).val(_id);
  },
  'click #orderRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('order.delete', $.trim(_id), (error) => {
        if (error) {
          $('#orderErrorModal').modal();
          $('#orderErrorModal').find('.modal-body').text("Internal error - unable to remove entry. Please try again");
        } else {
          $('#orderSuccessModal').modal();
          $('#orderSuccessModal').find('.modal-body').text('Sales Order deleted successfully');
        }
        $("#orderDelConfirmation").modal('hide');
      });
    }
  },


  /**
      * TODO:Complete Js doc
      * Deleting item from the array.
      */
  'click .itemDelete': (event, template) => {
    itemCheck = true;
    let itemArrays = Template.instance().itemArray.get();
    let itemIndex = event.currentTarget.id;
    let itemObject = itemArrays.find(e => e.randomId === itemIndex);
    let mvatItem = Template.instance().mVATArrayItem.get();
    for (let i = 0; i < mvatItem.length; i++) {
      if (mvatItem[i].itemCode === itemObject.itemCode) {
        mvatItem.splice(i, 1);
      }
    }
    template.mVATArrayItem.set(mvatItem);

    let selected = itemArrays.filter(function (e) {
      return e.randomId === itemIndex;
    });
    let removeIndex = itemArrays.map(function (item) {
      return item.randomId;
    }).indexOf(itemIndex);
    // remove object
    itemArray.splice(removeIndex, 1);
    template.itemArray.set(itemArray);

    let itemDelete = Template.instance().itemArray.get();
    let taxAdded = $('#taxAddedEdit');
    let beforeDiscount = Template.instance().beforeDiscount.get();
    let afterDiscount = Template.instance().afterDiscount.get();
    let total = $('#totalEdit');

    if (itemDelete !== '' && itemDelete.length > 0) {

      this.bDis = 0;
      this.aDis = 0;
      for (let i = 0; i < itemDelete.length; i++) {
        this.bDis += Number(itemDelete[i].beforeDiscount);
        let bFixed = parseFloat(this.bDis).toFixed(6);
        template.beforeDiscount.set(bFixed);
        // $(beforeDiscount).html(bFixed);
      }

      for (let i = 0; i < itemDelete.length; i++) {
        this.aDis += Number(itemDelete[i].afterDiscount);
        let aFixed = parseFloat(this.aDis).toFixed(6);
        template.afterDiscount.set(aFixed);

        // $(afterDiscount).html(aFixed);

      }

      let totalWeightCal = 0;
      for (let s = 0; s < itemArray.length; s++) {
        let multiplication = Number(itemArray[s].quantity * itemArray[s].unitQuantity * itemArray[s].invWeight);
        totalWeightCal += Number(multiplication);
      }
      let totalWeightC = $('#weightTotalEdit');//changed
      $(totalWeightC).html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));//changed
      let taxAdd = 0
      for (let l = 0; l < itemArray.length; l++) {
        taxAdd += Number(itemArray[l].quantity) * Number(itemArray[l].taxRate); //change
      }
      let totalP = 0;
      template.gST.set(taxAdd);
      $(taxAdded).html(((taxAdd.toFixed(6)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      for (let l = 0; l < itemArray.length; l++) {
        totalP += Number(itemArray[l].incPrice * itemArray[l].quantity); //change
      }
      let tot = parseFloat(totalP)
      let totFixed = parseFloat(tot).toFixed(6);
      template.grandTotal.set(totFixed);
      $(total).html((totFixed.toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    }
    else {
      $("#taxAddedEdit").html('');
      $("#totalEdit").html('');
      $('#weightTotalEdit').html('');
      $('#quantityEdit').html('');

    }
  },
  /**
   * TODO:Complete Js doc
   * On closing the order page clearing all datas.
   */
  'click .closeOrderEdit': (event, template) => {
    Session.set("ordIds", '');
    $(".deliveryDateEdit").val('');
    $(".dueDateEdit").val(''); 
    itemCheckValidation = false;
    itemArray = [];
    template.itemArray.set([]);
    template.itemEditCheck.set(false);
    template.editUnitList.set('');
    $("#selectItemsEdit").val('').trigger('change');
    $("#selectItemTaxEdit").val('').trigger('change');
    $("#selectUnitEdit").val('').trigger('change');
    // $("#rolesArrayspanEdit").html('');
    let brand = $('#brandEdit');
    let manufacturer = $('#manufacturerEdit');
    let itemPriceL = $('#itemPriceEdit');
    let beforeDiscount = $('#beforeDiscount');
    let afterDiscount = $('#afterDiscount');
    let total = $('#totalEdit');
    let taxAdded = $('#taxAddedEdit');
    let itemCategory = $('#itemCategoryEdit');
    $(brand).html('');
    $(manufacturer).html('');
    $(itemPriceL).html('');
    $(beforeDiscount).html('');
    $(afterDiscount).html('');
    $(taxAdded).html('');
    $(total).html('');
    $(itemCategory).html('');
    $('#ordersBalEdit').html('');
    $('#pTypeEdit').html('');
    $('#addressEdit').html('');
    $('#streetSEdit').html('');
    $('#cityCEdit').html('');
    $('#unitQuantityShowsEdit').html('');
    template.selectedItem.set('');
    template.beforeDiscount.set('');
    template.afterDiscount.set('');
    template.gST.set('');
    template.grandTotal.set('');
    branchChange = true;
    $('form :input').val("");
    $("#submit").attr("disabled", false);
    $("#weightTotalEdit").html('');
    $("#blockCEdit").html('');
    template.wareHouseData.set('');
    itemCheck = false;
    Template.instance().modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
    approvalResonArray = [];
    approvalValue = false;
    branchArrayCheck = [];
    customerArrayCheck = [];
  },
  /**
   * TODO:Complete Js doc
   * Process of submition in order page.
   */
  'submit .salesOrderEdit': (event, template) => {
    event.preventDefault();
    let customer = '';
    let address = '';
    let branch = Template.instance().getBranch.get();
    let currencyValues = Session.get("currencyValues");
    let priceMode = '';
    let priceType = '';
    let currency = '';
    customer = Template.instance().customerCodeEdit.get();
    address = Template.instance().customerAddress.get();
    priceType = Template.instance().customerPriceType.get();
    $('#selectCustomerEdit').find(':selected').each(function () {
      customer = $(this).val();
      Meteor.call('customer.customerFindOne', customer, (err, res) => {
        if (!err) {
          let customerDetail = res;
          priceMode = customerDetail.priceMode;
          currency = customerDetail.currency;
        }
      });
    });
    if (itemArray.length === 0) {
      toastr["error"](itemValidation);
    } else {
      $("#submit").prop('disabled', true);
      Meteor.setTimeout(function () {
        $("#submit").prop('disabled', false);
      }, 10000);
      //function for getting geo location
      showPosition();
      customerData(customer);

      let tDisAmount = Template.instance().grandTotal.get();
      let itemArList = Template.instance().itemArray.get();
      let itemArrayL = Template.instance().itemArray.get();
      let beforeDiscountL = Template.instance().beforeDiscount.get();
      let afterDiscountL = Template.instance().afterDiscount.get();
      let gST = Template.instance().gST.get();
      let grandTotalL = Template.instance().grandTotal.get();
      let mVATArrayList = [];
      let customerdatas = Template.instance().customerDetailsValue.get();
      let orderBalance = customerdatas.ordersBal;
      let balanceValue = customerdatas.balance;
      let creditLimit = customerdatas.creditLine;
      // console.log(customerdatas.ordersBal, customerdatas.balance, customerdatas.creditLine);
      let TotalValue = Number(orderBalance) + Number(balanceValue) + Number(grandTotalL);
      // console.log("TotalValue", TotalValue);
      // console.log("creditLimit", creditLimit);
      let extraAmt = 0;
      if (TotalValue > creditLimit && $.inArray(branch, branchArrayCheck) === -1 && $.inArray(customer, customerArrayCheck) === -1) {
        extraAmt = Number(TotalValue).toFixed(6) - Number(creditLimit).toFixed(6);
        let extAmtVal = Number(extraAmt).toFixed(2);
        let reasonObject1 = {
          reason: "Customer Credit Limit Exceeded.",
          reasonValue: `Exceeded Amount ${extAmtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (${currencyValues}).`

        }
        approvalResonArray.push(reasonObject1);
        approvalValue = true;
      }
      //function for set mvat array 
      let weight = 0;
      mVATArraySetUp();

      function mVATArraySetUp() {
        for (let x = 0; x < itemArList.length; x++) {
          if (itemArList[x].mVATBoolean === true) {
            let itemMVAT = {
              expenseCode: "3",
              mvatTotal: (Number(itemArList[x].taxRate * itemArList[x].quantity)).toString(),
              itemCode: itemArList[x].itemCode,
              lineNum: x.toString()
            };
            mVATArrayList.push(itemMVAT);
            if (x === itemArList.length - 1) { }
          }
        }
      }
      // function weightCalculaiton(weight) {
      for (let i = 0; i < itemArList.length; i++) {
        let multiplication = Number(itemArList[i].quantity * itemArList[i].unitQuantity * itemArList[i].invWeight);

        weight += Number(multiplication);
      }
      for (let j = 0; j < itemArray.length; j++) {
        if (itemArray[j].mVATBoolean === false) {
          taxTotal += Number(itemArray[j].taxRate * itemArray[j].quantity);
        }

      }
      for (let h = 0; h < itemArray.length; h++) {
        if (itemArray[h].mVATBoolean === true) {
          taxTotal += Number(itemArray[h].taxRate);

        }
      }
      function customerData(customer) {
        Meteor.call('customer.customerFindOne', customer, (err, res) => {
          if (!err) {
            let branchAr = res.bPLId;
            let bCheck = branchAr.includes(Meteor.user().defaultBranch);
            submitProcess();
          }
        });
      }
      //final submition based on customer branch
      function submitProcess() {
        // if (bCheck === true) {
        let discountTotal = $("#discountTotalEdit");
        let disCount = $(discountTotal).val();
        let totalDiscPercent = Number(disCount) * discountPercentAmount / Number(tDisAmount);
        if (isNaN(totalDiscPercent)) {
          totalDiscPercent = "0";
        }
        for (let x = 0; x < itemArList.length; x++) {
          itemArList[x].baseLine = x.toString();
        }
        template.itemArray.set(itemArList);
        // $("#submit").attr("disabled", true);
        let orderId = Session.get("ordIds");
        if (itemCheck === true) {
          orderEditOrUpdate(event.target, orderId, customer, Meteor.user().defaultBranch, totalDiscPercent, address, itemArrayL, beforeDiscountL,
            afterDiscountL, gST, grandTotalL, priceType, priceMode, currency, latitude, longitude, mVATArrayList, weight, taxTotal, approvalValue, approvalResonArray);
          dataClear();
          $('#orderEditDetailPage').modal('hide');
        }
        else {
          Meteor.call('order.id', orderId, (err, res) => {
            if (!err) {
              orderEditOrUpdate(event.target, res.orderId, res.cardCode, res.branch, res.discPrcnt, res.address, res.itemLines, res.beforeDiscount,
                res.afterDiscount, res.GST, res.docTotal, res.priceType, res.priceMode, res.currency, res.latitude, res.longitude, res.mvats, res.weight, res.taxTotal, res.approvalValue, res.approvalResonArray);
              dataClear();
              $('#orderEditDetailPage').modal('hide');
            }
          });

        }
      }

      //   else {
      //     toastr["error"](branchCustomerAssign);
      //   }
      // }
      //function for clearing data after submition
      function dataClear() {
        Session.set("ordIds", '');
        $(".dueDateEdit").val('');
        // $('form :input').val("");
        let taxAdded = $('#taxAddedEdit');
        $(taxAdded).html('');
        let total = $('#totalEdit');
        template.itemEditCheck.set(false);
        template.editUnitList.set('');
        $(total).html('');
        itemArray = [];
        template.itemArray.set([]);
        $(".custEnableEdit").css("display", "none");
        $("#discountAmount:input").prop('disabled', false);
        $("#discount:input").prop('disabled', false);
        $('.loadersSpin').css('display', 'none');
        template.selectedItem.set('');
        template.beforeDiscount.set('');
        template.afterDiscount.set('');
        let ordersBal = $('#ordersBalEdit');
        let address = $('#addressEdit');
        let pType = $('#pTypeEdit');
        let streetS = $('#streetSEdit');
        let cityC = $('#cityCEdit');
        let brand = $('#brandEdit');
        let manufacturer = $('#manufacturerEdit');
        let itemPriceL = $('#itemPriceEdit');
        $(ordersBal).html('');
        $(address).html('');
        $(pType).html('');
        $(streetS).html('');
        $(cityC).html('');
        $(brand).html('');
        $(manufacturer).html('');
        $(itemPriceL).html('');
        branchChange = true;
        itemCheck = false;
        $('#selectBranchEdit').val(Meteor.user().defaultBranch).trigger('change');
        template.gST.set('');
        template.grandTotal.set('');
        $("#selectPriceTypeEdit").val('').trigger('change');
        $("#my-datepickers").val('');
        $('#inPriceEdit').val('');
        $('#exPriceEdit').val('');
        $("#itemPriceEdit").val('');
        mVATArray = [];
        taxTotal = 0;
        template.mVATArrayItem.set('');
        mVATBoolean = false;
        $('#custRefEdit').val('');
        $('#my-datepickersCustRefEdit').val('');
        // $('#remark_orderEdit').val('');
        $("#blockCEdit").html('');
        itemCheckValidation = false;
        approvalResonArray = [];
        approvalValue = false;
        branchArrayCheck = [];
        customerArrayCheck = [];
      }
    }
  }
});

/**
 * TODO:Complete Js doc
 * For clearing the input fields.
 */
function clearFields(elements) {
  if (typeof elements === "string") {
    $("#" + elements).val('');
  } else {
    elements.forEach((elem) => {
      $("#" + elem).val('')
    })
  }
}
let latitude = '';
let longitude = '';

function showPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      // let positionInfo = "Your current position is (" + "Latitude: " + position.coords.latitude + ", " + "Longitude: " + position.coords.longitude + ")";
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      // document.getElementById("locationArea").innerHTML = positionInfo;
    });
  } else {
    console.log("Sorry, your browser does not support HTML5 geolocation.");
  }
}

