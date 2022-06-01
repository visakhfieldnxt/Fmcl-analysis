/**
 * @author Visakh
 */
import { Delivery } from "../../../api/delivery/delivery";
import { Meteor } from "meteor/meteor";
import { Config } from "../../../api/config/config";

let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);
Template.delivery.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.batchListNameArray = new ReactiveVar();
  this.ids = new ReactiveVar();
  this.customer = new ReactiveVar();
  this.docDueDate = new ReactiveVar();
  this.branch = new ReactiveVar();
  this.itemArrayS = new ReactiveVar();
  this.employee = new ReactiveVar();
  this.beforeDiscount = new ReactiveVar();
  this.afterDiscount = new ReactiveVar();
  this.gst = new ReactiveVar();
  this.docDueDate = new ReactiveVar();
  this.totalDiscPercent = new ReactiveVar();
  this.remarks = new ReactiveVar();
  this.batches = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.docTotal = new ReactiveVar();
  this.binEntries = new ReactiveVar();
  this.vehicle = new ReactiveVar();
  this.mvats = new ReactiveVar();
  this.transporter = new ReactiveVar();
  this.currency = new ReactiveVar();
  this.priceMode = new ReactiveVar();
  this.orderId = new ReactiveVar();
  this.priceType = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.weightData = new ReactiveVar();
  this.driverNameGet = new ReactiveVar();
  this.docNumber = new ReactiveVar();
  this.orderData = new ReactiveVar();
  this.customerDetail = new ReactiveVar();
  this.deliveryDocNum = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.custAddress = new ReactiveVar();

  let managerBranch = Session.get("managerBranch");
  this.pagination = new Meteor.Pagination(Delivery, {
    sort: {
      createdAt: -1
    },
    filters: {

      // createdAt: {
      //   $gte: toDay,
      //   $lt: nextDay
      // },
      branch: { $in: managerBranch },
      invoiceDeliveryStatus: { $eq: 'Pending' },
      docNum: { $ne: '' },
      docStatus: 'O',
      $or: [{ canceled: undefined }, { canceled: 'N' }],
      accountantApproval: { $ne: true },
    },
    perPage: 20
  });
});
let deliveryDetailss = '';
Template.delivery.onRendered(function () {

  // for getting batch list
  Meteor.call('batch.batchList', (batchError, batchResult) => {
    if (!batchError) {
      this.batchListNameArray.set(batchResult);
    }
  });

  $("#selectBatch").val('').trigger('change');
  /**
   * TODO: Complete JS doc
   */
  $('#selectBatch').select2({
    placeholder: "Select Batch",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#selectBatch").parent(),
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
});

Template.delivery.helpers({
  /**
* TODO:Complete JS doc
*/
  customersList: function () {
    return Template.instance().customerNameArray.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  currencyGet: () => {
    let currencyValues = Session.get("currencyValues");
    return currencyValues;
  },
  /**
    * TODO:Complete JS doc
    * getting street city block
    */
  custAddress: function () {
    return Template.instance().custAddress.get();
  },
  /**
* TODO:Complete Js doc
* for convert upper case
*/
  convertUpperCase: (block) => {
    let res = block.toUpperCase();
    return res;
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
  deliveries: function () {
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
  docStts: (docStatus) => {
    if (docStatus === "C") {
      return "Closed";
    } else if (docStatus === "O") {
      return "Open";
    }
  },
  /**
   * TODO:Complete JS doc
   * getting item details
   */
  items: () => {
    let itemsList = Template.instance().itemsDetailsList.get();
    return itemsList;
  },

  /**
* TODO:Complete JS doc
* @param itemCode
* @param whsCode 
* for getting batch list
*/
  batchList: (itemCode, whsCode) => {
    let batch = [];
    let batList = Template.instance().batchListNameArray.get();
    for (let i = 0; i < batList.length; i++) {
      if (batList[i].itemCode === itemCode && batList[i].whsCode === whsCode) {
        batch.push(batList[i]);
      }
    }
    return batch;
  },
  /**
   * TODO: Complete JS doc
   * @param deliveryDate
   */
  date: (deliveryDate) => {
    return moment(deliveryDate).format("DD-MM-YYYY");
  },
  /**
     * TODO:Complete JS doc
     * @param docTotal 
     * formatting total
     */
  totalFormat: (docTotal) => {
    return Number(docTotal).toFixed(6);
  },
  /**
 * TODO:Complete JS doc
 * @param price 
 * formatting price
 */
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
 * TODO:Complete JS doc
 * @param price 
 * formatting tax
 */
  taxFormats: (quantity, taxRate) => {
    let res = (parseInt(quantity) * Number(taxRate)).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**z
 * TODO:Complete JS doc
 * formatting weight
 */
  weightCal: (quantity, weight, unitQuantity) => {
    let result = (parseInt(quantity) * Number(weight) * parseInt(unitQuantity)).toFixed(2);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
   * TODO: Complete JS doc
   * @param deliveryDate
   */
  orderDates: (orderDate) => {
    let order = [];
    if (orderDate) {
      for (let i = 0; i < orderDate.length; i++) {
        order.push(moment(orderDate[i]).format('DD-MMM-YYYY'));
      }
      return order;
    }
  },
  /**
 * TODO:Complete JS doc
 * @param price 
 * formatting price
 */
  totalIn: (price, quantity) => {
    let res = Number(Number(price) * Number(quantity)).toFixed(6);
    let result = Number(res).toFixed(6);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
 * TODO:Complete JS doc
 * @param quantity 
 * formatting quantity
 */
  quantityFormat: (quantity) => {
    let res = Number(quantity).toFixed(3);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
  * TODO:Complete Js doc
  * getting logo image for printing
  */
  logo: () => {
    let configLogo = Config.findOne({
      name: "logo"
    });
    if (configLogo !== undefined) {
      return configLogo.value;
    }
  },
  /**
  * TODO:Complete Js doc
  * for getting customer details
  */
  cstmrDetail: () => {
    return Template.instance().customerDetail.get();
  },
  /**
   * TODO:Complete Js doc
   * for getting order details
   */
  ordDetail: () => {
    return Template.instance().orderData.get();
  },
  /**
 * TODO:Complete JS doc
 * @param docDate
 */
  dateHelper: (docDate) => {
    return moment(docDate).format('DD-MMM-YYYY');
  },

  /**
* TODO:Complete Js doc
* for calculating item weight
*/
  weightItem: (unitQty, quantity, invWeight) => {
    let res = parseInt(quantity) * parseInt(unitQty) * Number(invWeight);
    return Number(res.toFixed(6));
  },
  /**
     * TODO:Complete Js doc
     * for calculating item tax
     */
  taxItem: (mVATBoolean, quantity, taxRate) => {
    if (mVATBoolean === true) {
      return (parseInt(quantity) * Number(taxRate)).toFixed(6);
    } else {
      return (parseInt(quantity) * Number(taxRate)).toFixed(6);
    }
  },
  /**
 * TODO:Complete JS doc
 * @param docDate
 * getting time for printing
 */
  printTime: () => {
    return moment(new Date).format('dddd, DD MMMM, YYYY hh.mm.ss a'); //monday 10 jun 2019 11.46.46 a.m
  },
  /**
     * TODO:Complete JS doc
     * 
     */
  printLoad: () => {
    return Template.instance().modalLoader.get();
  },
  /**
 * TODO:Complete JS doc
 * @param quantity 
 * formatting quantity
 * 
 */
  noDecimal: (quantity) => {
    let res = Math.round(quantity);
    return res;
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
let branchArrayCheck = [];
let customerArrayCheck = [];
Template.delivery.events({
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
    let cardName = event.target.cardName.value;
    let managerBranch = Session.get("managerBranch");

    if (cardName && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        cardName: cardName,
        branch: { $in: managerBranch },
        invoiceDeliveryStatus: { $eq: 'Pending' },
        docNum: { $ne: '' },
        docStatus: 'O',
        $or: [{ canceled: undefined }, { canceled: 'N' }],
        accountantApproval: { $ne: true },
      });
    }
    else if (fromDate && isNaN(toDate) && cardName === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: fromDate
        },
        branch: { $in: managerBranch },
        invoiceDeliveryStatus: { $eq: 'Pending' },
        docNum: { $ne: '' },
        docStatus: 'O',
        $or: [{ canceled: undefined }, { canceled: 'N' }],
        accountantApproval: { $ne: true },
      });
    }
    else if (toDate && isNaN(fromDate) && cardName === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: toDate
        },
        branch: { $in: managerBranch },
        invoiceDeliveryStatus: { $eq: 'Pending' },
        docNum: { $ne: '' },
        docStatus: 'O',
        $or: [{ canceled: undefined }, { canceled: 'N' }],
        accountantApproval: { $ne: true },
      });
    }

    else if (fromDate && toDate && cardName === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          branch: { $in: managerBranch },
          invoiceDeliveryStatus: { $eq: 'Pending' },
          docNum: { $ne: '' },
          docStatus: 'O', accountantApproval: { $ne: true },
          $or: [{ canceled: undefined }, { canceled: 'N' }]
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          },
          branch: { $in: managerBranch },
          invoiceDeliveryStatus: { $eq: 'Pending' },
          docNum: { $ne: '' },
          docStatus: 'O', accountantApproval: { $ne: true },
          $or: [{ canceled: undefined }, { canceled: 'N' }]
        });
      }
    }
    else if (cardName && toDate && fromDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          cardName: cardName,
          branch: { $in: managerBranch },
          invoiceDeliveryStatus: { $eq: 'Pending' },
          docNum: { $ne: '' }, accountantApproval: { $ne: true },
          docStatus: 'O',
          $or: [{ canceled: undefined }, { canceled: 'N' }]
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          },
          cardName: cardName,
          branch: { $in: managerBranch },
          invoiceDeliveryStatus: { $eq: 'Pending' },
          docNum: { $ne: '' },
          docStatus: 'O', accountantApproval: { $ne: true },
          $or: [{ canceled: undefined }, { canceled: 'N' }]
        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
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
    Template.instance().pagination.settings.set('filters', {
      // createdAt: {
      //   $gte: toDay,
      //   $lt: nextDay
      // },
      branch: { $in: managerBranch },
      invoiceDeliveryStatus: { $eq: 'Pending' },
      docNum: { $ne: '' }, accountantApproval: { $ne: true },
      docStatus: 'O',
      $or: [{ canceled: undefined }, { canceled: 'N' }]
    });
    $('form :input').val("");
  },
  /**
     * TODO: Complete JS doc
     * @param event
     */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set('');
    template.itemsDetailsList.set('');
    this.id = event.currentTarget.attributes.id.value;
    let header = $('#categoryH');
    let detailCardName = $('#detailCardName');
    let detailCardCode = $('#detailCardCode');
    let detailDocDate = $('#detailDocDate');
    let detailDocDeliver = $('#detailDocDeliver');
    let detailOrderId = $('#detailOrderId');
    let detailBranch = $('#detailBranch');
    let docTTTotal = $('#docTTotal');
    let street = '';
    let city = '';
    let block = '';
    let address = $('#detailAddress');
    let weights = $('#detailWeight');
    let gst = $('#detailGst');
    let vehicleNo = $('#detailVehicle');
    let driverName = $('#detailDriver');
    let transporterName = $('#detailTransporter');
    $('#orderDetailPage').modal();
    Meteor.call('delivery.id', id, (deliveryError, deliveryResult) => {
      if (!deliveryError) {
        let deliveryDetail = deliveryResult;
        $(header).html('Details of Delivery');
        $(detailCardCode).html(deliveryDetail.cardCode);
        $(detailOrderId).html(deliveryDetail.docNum);
        $(detailDocDate).html(moment(deliveryDetail.docDate).format("DD-MM-YYYY"));
        $(detailDocDeliver).html(moment(deliveryDetail.docDueDate).format("DD-MM-YYYY"));
        let totalAmt = Number(deliveryDetail.grandTotal).toFixed(6);
        $(docTTTotal).html(totalAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        let gstAmt = Number(deliveryDetail.GST).toFixed(6);
        $(gst).html(gstAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        let weightAmt = Number(deliveryDetail.weight).toFixed(2)
        $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(vehicleNo).html(deliveryDetail.vehicleNumber);
        $(driverName).html(deliveryDetail.driverName);
        $(transporterName).html(deliveryDetail.transporter);
        $("#deliveryId").val(this.id);
        template.itemsDetailsList.set(deliveryDetail.itemLines);
        // template.modalLoader.set(deliveryDetail.itemLines);

        customerDetailsView(deliveryDetail.cardCode);
        branchDetaislView(deliveryDetail.branch);
        shippingAddress(deliveryDetail.cardCode);
      }
    });
    function customerDetailsView(cardCode) {
      Meteor.call('customer.cardCode', cardCode, (customerError, customerResult) => {
        if (!customerError) {
          let customer = customerResult;
          $(detailCardName).html(customer);
        }
      });
    }
    function shippingAddress(cardCode) {
      Meteor.call('customerAddress.custAddress', cardCode, (customerError, customerResult) => {
        if (!customerError) {

          if (customerResult.street === undefined || customerResult.street === '') {
            street = '';
          }
          else {
            street = customerResult.street;
          }
          if (customerResult.block === undefined || customerResult.block === '') {
            block = '';
          }
          else {
            block = customerResult.block;
          }
          if (customerResult.city === undefined || customerResult.city === '') {
            city = '';
          }
          else {
            city = customerResult.city;
          }
          $(address).html(street + "&nbsp;" + block + "&nbsp;" + city);
        }
      });
    }
    function branchDetaislView(branch) {
      Meteor.call('branch.branchBPLId', branch, (branchError, branchResult) => {
        if (!branchError) {
          template.modalLoader.set(branchResult);
          $(detailBranch).html(branchResult);
        }
      });
    }
  },
  /**
       * TODO: Complete JS doc
       * @param event
       * for generate invoice
       */

  'click .genInvoice': (event, template) => {
    event.preventDefault();
    template.itemsDetailsList.set('');
    template.modalLoader.set('');
    this.id = event.currentTarget.attributes.id.value;
    let headers = $('#categoryHss');
    let detailCardNames = $('#detailCardNamess');
    let detailCardCodes = $('#detailCardCodess');
    let detailDocDates = $('#detailDocDatess');
    let detailDocDelivers = $('#detailDocDeliverss');
    let detailOrderIds = $('#detailOrderIdss');
    let docTTTotals = $('#docTTotalssInvoice');
    let detailBranchss = $('#detailBranchss');
    let address = $('#detailAddressInvoice');
    let weights = $('#detailWeightInvoice');
    let gst = $('#detailGstInvoice');
    let vehicleNo = $('#detailVehicles');
    let driverName = $('#detailDrivers');
    let transporterName = $('#detailTransporters');
    let street = '';
    let block = '';
    let city = '';
    $('#invoiceDetailPage').modal();
    Meteor.call('delivery.id', id, (deliveryError, deliveryResult) => {
      if (!deliveryError) {
        let deliveryDetails = deliveryResult;
        $(headers).html('Details of Invoice');
        $(detailCardCodes).html(deliveryDetails.cardCode);
        $(detailOrderIds).html(deliveryDetails.docNum);
        $(detailDocDates).html(moment(deliveryDetails.docDate).format("DD-MM-YYYY"));
        $(detailDocDelivers).html(moment(deliveryDetails.docDueDate).format("DD-MM-YYYY"));
        let totalAmt = Number(deliveryDetails.grandTotal).toFixed(6);
        $(docTTTotals).html(totalAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        let weightAmt = Number(deliveryDetails.weight).toFixed(2)
        $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        let gstAmt = Number(deliveryDetails.GST).toFixed(6);
        $(gst).html(gstAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(vehicleNo).html(deliveryDetails.vehicleNumber);
        $(driverName).html(deliveryDetails.driverName);
        $(transporterName).html(deliveryDetails.transporter);
        $("#deliveryIdss").val(this.id);
        template.ids.set(id);
        template.modalLoader.set(deliveryDetails.itemLines);
        template.itemsDetailsList.set(deliveryDetails.itemLines);
        customerDeliveryView(deliveryDetails.cardCode);
        branchDeliveryView(deliveryDetails.branch);
        shippingAddress(deliveryDetails.cardCode);
      }
    });
    function shippingAddress(cardCode) {
      Meteor.call('customerAddress.custAddress', cardCode, (customerError, customerResult) => {
        if (!customerError) {
          if (customerResult.street === undefined || customerResult.street === '') {
            street = '';
          }
          else {
            street = customerResult.street;
          }
          if (customerResult.block === undefined || customerResult.block === '') {
            block = '';
          }
          else {
            block = customerResult.block;
          }
          if (customerResult.city === undefined || customerResult.city === '') {
            city = '';
          }
          else {
            city = customerResult.city;
          }
          $(address).html(street + "&nbsp;" + block + "&nbsp;" + city);
        }
      });
    }
    // for getting customer name
    function customerDeliveryView(cardCode) {
      Meteor.call('customer.cardCode', cardCode, (customerError, customerResult) => {
        if (!customerError) {
          $(detailCardNames).html(customerResult);
        }
      });
    }
    // for getting branch name
    function branchDeliveryView(branch) {
      Meteor.call('branch.branchBPLId', branch, (branchError, branchResult) => {
        if (!branchError) {
          $(detailBranchss).html(branchResult);
        }
      });
    }
  },
  /**
   * TODO:Complete Js doc
   * for invoice update
   */
  'submit .invoiceUpdates': (event, template) => {
    let approvalValue = false;
    let approvalResonArray = [];
    event.preventDefault();
    let batches = [];
    let beforeDiscount = '';
    let discountPercent = '';
    let afterDiscount = '';
    let salesPrice = '';
    let discountAmount = '';
    let driverName = '';
    let transporter = '';
    let currencyValues = Session.get("currencyValues");
    let vehicle = '';
    let id = Template.instance().ids.get();
    let itemArray = [];
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

    Meteor.call('delivery.id', id, (deiliveryError, deliveryResult) => {
      if (!deiliveryError) {
        deliveryDetailss = deliveryResult;
        transporter = deliveryDetailss.transporter;
        vehicle = deliveryDetailss.vehicleNumber;
        let mvats = deliveryDetailss.mvats;
        let binEntries = deliveryDetailss.binEntries;
        let currency = deliveryDetailss.currency;
        let priceMode = deliveryDetailss.priceMode;
        let orderId = deliveryDetailss.orderId;
        let priceType = deliveryDetailss.priceType;
        let gst = deliveryDetailss.GST;
        let docEntry = deliveryDetailss.docEntry;
        driverName = deliveryDetailss.driverName;
        template.orderId.set(orderId);
        template.priceMode.set(priceMode);
        template.priceType.set(priceType);
        template.currency.set(currency);
        template.vehicle.set(vehicle);
        template.transporter.set(transporter);
        template.mvats.set(mvats);
        template.binEntries.set(binEntries);
        template.driverNameGet.set(driverName);
        template.docNumber.set(deliveryDetailss.docNum);
        Meteor.call('customer.customerFindOneQuotation', deliveryDetailss.cardCode, (customerError, customerResult) => {
          if (!customerError) {
            let cust = customerResult;
            for (let i = 0; i < deliveryDetailss.itemLines.length; i++) {
              Meteor.call('item.itemCode', deliveryDetailss.itemLines[i].itemCode, (itemError, itemResult) => {
                if (!itemError) {
                  let itemDetail = itemResult;
                  let quantity = deliveryDetailss.itemLines[i].quantity;
                  let itemCode = deliveryDetailss.itemLines[i].itemCode;
                  let itemName = deliveryDetailss.itemLines[i].itemNam;
                  let unitPrice = deliveryDetailss.itemLines[i].unitPrice;
                  let salesPrice = deliveryDetailss.itemLines[i].salesPrice;
                  let price = deliveryDetailss.itemLines[i].price;
                  let openQty = deliveryDetailss.itemLines[i].openQty;
                  let whsCode = deliveryDetailss.itemLines[i].whsCode;
                  let grossTotal = deliveryDetailss.itemLines[i].grossTotal;
                  // let uomEntry = deliveryDetailss.itemLines[i].uomEntry;
                  let uoMEntry = deliveryDetailss.itemLines[i].uoMEntry;
                  let incPrices = deliveryDetailss.itemLines[i].incPrice;
                  let excPrices = deliveryDetailss.itemLines[i].excPrice;
                  let vatGroupName = deliveryDetailss.itemLines[i].vatGroup;
                  let discount = deliveryDetailss.itemLines[i].discPrcnt;
                  let discPrcnt = deliveryDetailss.itemLines[i].discPrcnt;
                  let baseDocEntry = deliveryDetailss.baseDocEntry;
                  let binEntries = deliveryDetailss.binEntries;
                  let beforeDiscount = deliveryDetailss.itemLines[i].beforeDiscount;
                  let afterDiscount = deliveryDetailss.itemLines[i].afterDiscount;
                  let taxRate = deliveryDetailss.itemLines[i].taxRate;
                  let itemRemark = deliveryDetailss.itemLines[i].itemRemark;
                  let invWeight = deliveryDetailss.itemLines[i].invWeight;
                  let u_MVATPerStockUnit = deliveryDetailss.itemLines[i].u_MVATPerStockUnit;
                  let unitQuantity = deliveryDetailss.itemLines[i].unitQuantity;
                  let uomCode = deliveryDetailss.itemLines[i].uomCode;
                  let absEntry = deliveryDetailss.itemLines[i].absEntry;
                  itemObject = {
                    itemCode: itemCode,
                    itemNam: itemName,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    price: price,
                    salesPrice: salesPrice,
                    grossTotal: grossTotal,
                    incPrice: incPrices,
                    excPrice: excPrices,
                    vatGroup: vatGroupName,
                    category: itemDetail.itmsGrpCod,
                    openQty: openQty,
                    uoMEntry: uoMEntry,
                    discount: discount,
                    discPrcnt: discPrcnt,
                    whsCode: whsCode,
                    refType: "15",
                    baseLine: i.toString(),
                    baseDocEntry: docEntry,
                    binEntries: binEntries,
                    taxRate: taxRate,
                    beforeDiscount: beforeDiscount,
                    afterDiscount: afterDiscount,
                    itemRemark: itemRemark,
                    invWeight: invWeight,
                    u_MVATPerStockUnit: u_MVATPerStockUnit,
                    unitQuantity: unitQuantity,
                    uomCode: uomCode,
                    absEntry: absEntry,
                    docEntry: docEntry,
                  };
                  itemArray.push(itemObject);
                  // console.log("log1.", itemArray);
                  template.itemArrayS.set(itemArray);
                  let batchName = $(".selectBatchS" + (i + 1)).val();
                  let batchDetail = {}
                  if (batchName) {
                    batchDetail = {
                      batchId: batchName,
                      batchQuantity: quantity,
                      batchBaseLine: i.toString()
                    }
                  }
                  batches.push(batchDetail);
                  let totalDiscPercent = '';
                  let employee = Meteor.userId();
                  if (deliveryDetailss.discPrcnt) {
                    totalDiscPercent = deliveryDetailss.discPrcnt;
                  }
                  else {
                    totalDiscPercent = 0;
                  }
                  let currentDate = moment(new Date()).format('YYYY-MM-DD');
                  let totalAmount = 0;
                  approvalCal(deliveryDetailss.cardCode, deliveryDetailss.branch);
                  function approvalCal(cardCode, branch) {
                    Meteor.call('invoice.invoiceorderLIst', cardCode, currentDate, (err, res) => {
                      if (!err && res !== undefined) {
                        // console.log("res", res);
                        if (res.length > 0 && $.inArray(branch, branchArrayCheck) === -1 && $.inArray(cardCode, customerArrayCheck) === -1) {
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
                            totalAmount: Number(totalAmount).toFixed(2),
                            reasonValue: `Total Bills Pending ${res.length}. Total Bills Amount Pending ${amtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (${currencyValues}) `
                          }
                          approvalResonArray.push(reasonObject);
                          approvalValue = true;
                          // console.log("approvalResonArray", approvalResonArray);
                        }
                        else {
                          approvalValue = false;
                        }
                        // console.log("approvalResonArray", approvalResonArray)
                        invoiceCreation();
                      }
                      else {
                        invoiceCreation();
                      }
                    });
                  }

                  $("#deliveryIdss").prop('disabled', true);
                  Meteor.setTimeout(function () {
                    $("#deliveryIdss").prop('disabled', false);
                  }, 9000);
                  $('#invoiceDetailPage').modal('hide');
                  function invoiceCreation() {
                    let extraAmt = 0;
                    if ((i + 1) === deliveryDetailss.itemLines.length) {
                      let TotalValue = Number(cust.ordersBal) + Number(cust.balance) + Number(deliveryDetailss.grandTotal);
                      // console.log("$.inArray(deliveryDetailss.branch, branchArrayCheck)",$.inArray(deliveryDetailss.branch, branchArrayCheck));
                      // console.log("$.inArray(deliveryDetailss.cardCode, customerArrayCheck)",$.inArray(deliveryDetailss.cardCode, customerArrayCheck))
                      if (cust.creditLine < TotalValue && $.inArray(deliveryDetailss.branch, branchArrayCheck) === -1 && $.inArray(deliveryDetailss.cardCode, customerArrayCheck) === -1) {
                        // console.log("creditLine,", cust.creditLine)
                        // console.log("TotalValue,", TotalValue)
                        extraAmt = Number(TotalValue).toFixed(6) - Number(cust.creditLine).toFixed(6);
                        let extAmtVal = Number(extraAmt).toFixed(2);
                        let reasonObject1 = {
                          reason: "Customer Credit Limit Exceeded.",
                          reasonValue: `Exceeded Amount ${extAmtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (${currencyValues}).`

                        }
                        approvalResonArray.push(reasonObject1);
                        approvalValue = true;
                      }
                      if (approvalValue === false) {
                        // console.log("deliveryDetailss", deliveryDetailss);
                        Meteor.call('creditInvoice.deliveryToInvoice', deliveryDetailss.docNum, deliveryDetailss.cardCode, deliveryDetailss.docDueDate, itemArray, deliveryDetailss.branch,
                          employee, beforeDiscount, afterDiscount, gst, deliveryDetailss.grandTotal, totalDiscPercent, deliveryDetailss.remark_order,
                          batches, transporter, vehicle, mvats, id, deliveryDetailss.currency, priceType, deliveryDetailss.priceMode, orderId, binEntries, deliveryDetailss.weight, deliveryDetailss.driverName, (creditinvoiceerr, creditinvoiceres) => {
                            if (creditinvoiceerr) {
                              $('#deliveryErrorModal').modal();
                              $('#deliveryErrorModal').find('.modal-body').text(creditinvoiceerr.reason);
                            }
                            else {
                              $('#invoiceDetailPage').modal('hide');
                              $('#deliverySuccessModal').find('.modal-body').text('Invoice has been done successfully');
                              $('#deliverySuccessModal').modal();
                            }
                          });
                      }
                      // invoice should go for approval
                      else {
                        Meteor.call('invoice.invoiceApproval', deliveryDetailss.docNum, deliveryDetailss.cardCode, deliveryDetailss.docDueDate, itemArray, deliveryDetailss.branch,
                          employee, beforeDiscount, afterDiscount, gst, deliveryDetailss.grandTotal, totalDiscPercent, deliveryDetailss.remark_order,
                          batches, transporter, vehicle, mvats, id, deliveryDetailss.currency, priceType, deliveryDetailss.priceMode, orderId, binEntries, deliveryDetailss.weight, deliveryDetailss.driverName, approvalResonArray, approvalValue, (creditinvoiceerr, creditinvoiceres) => {
                            if (creditinvoiceerr) {
                              $('#deliveryErrorModal').modal();
                              $('#deliveryErrorModal').find('.modal-body').text(creditinvoiceerr.reason);
                            }
                            else {
                              $('#invoiceDetailPage').modal('hide');
                              $('#deliverySuccessModal').find('.modal-body').text('Invoice should go for approval');
                              $('#deliverySuccessModal').modal();
                            }
                          });
                      }
                    }
                  }
                }
              });
            }
          }
        });
      }
    });
  },
  /**
* TODO: Complete JS doc
* @param event
*/
  'click #categoryOrders': (event) => {
    event.preventDefault();
    let customer = Template.instance().customer.get();
    let docDueDate = Template.instance().docDueDate.get();
    let branch = Template.instance().branch.get();
    let itemArray = Template.instance().itemArrayS.get();
    // console.log("log2...", itemArray);
    let id = Template.instance().ids.get();
    let employee = Template.instance().employee.get();
    let beforeDiscount = Template.instance().beforeDiscount.get();
    let afterDiscount = Template.instance().afterDiscount.get();
    let gst = Template.instance().gst.get();
    let docTotal = Template.instance().docTotal.get();
    let totalDiscPercent = Template.instance().totalDiscPercent.get();
    let remarks = Template.instance().remarks.get();
    let vehicle = Template.instance().vehicle.get();
    let transporter = Template.instance().transporter.get();
    let mvats = Template.instance().mvats.get();
    let binEntries = Template.instance().binEntries.get();
    let currency = Template.instance().currency.get();
    let batches = Template.instance().batches.get();
    let priceMode = Template.instance().priceMode.get();
    let priceType = Template.instance().priceType.get();
    let orderId = Template.instance().orderId.get();
    let weight = Template.instance().weightData.get();
    let driverName = Template.instance().driverNameGet.get();
    let docNumber = Template.instance().docNumber.get();
    $("#categoryOrders").prop('disabled', true);
    Meteor.setTimeout(function () {
      $("#categoryOrders").prop('disabled', false);
    }, 5000);
    Meteor.call('creditInvoice.deliveryToInvoice', docNumber, customer, docDueDate, itemArray, branch,
      employee, beforeDiscount, afterDiscount, gst, docTotal, totalDiscPercent, remarks,
      batches, transporter, vehicle, mvats, id, currency, priceType, priceMode, orderId, binEntries, weight, driverName,
      (creditInvoiceError, creditInvoiceResult) => {
        if (creditInvoiceError) {
          $('#deliveryErrorModal').modal();
          $('#deliveryErrorModal').find('.modal-body').text(err.reason);
          $('#creditApproveConfirmations').modal('hide');
        } else {
          $('#deliveryDetailPage').modal('hide');
          $('#deliverySuccessModal').find('.modal-body').text('Delivery has been added successfully');
          $('#deliverySuccessModal').modal();
          $('#creditApproveConfirmations').modal('hide');
        }
      });
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
  'click .gInvoice': (event, template) => {
    event.preventDefault();
    let header = $('#categoryHeader');
    let confirmedUuid = $('#confirmedUuid');

    $('#invoiceGenerate').modal();
    let _id = event.currentTarget.attributes.id.value;

    $(header).html('Confirm Of Invoice Generate');
    $(confirmedUuid).val(_id);
    template.deliveryId.set(_id);
  },
  /**
* TODO: Complete JS doc
* @param event
* for generating invoice
*/
  'click #categoryInvoice': (event, template) => {
    event.preventDefault();

    let deliveryId = Template.instance().deliveryId.get();
    // Meteor.subscribe("deliverySpecific.list", deliveryId);
    let batches = [];
    Meteor.call('delivery.id', deliveryId, (deliveryError, deliveryResult) => {
      if (!deliveryError) {
        let deliveryDetails = deliveryResult;
        let itemList = deliveryDetails.itemLines
        for (let i = 0; i < itemList.length; i++) {
          itemList[i].baseLine = i.toString();
          itemList[i].baseDocEntry = deliveryDetails.docEntry;
          itemList[i].refType = "15";
          itemList[i].whsCode = itemList[i].whsCode;
          itemList[i].unitPrice = itemList[i].price;
          itemList[i].discount = itemList[i].discPrcnt;
          Meteor.call('batch.itemCodeQuantity', itemList[i].itemCode, (err, res) => {
            let batchNo = res;
            let batchDetail = {}
            if (batchNo) {
              batchDetail = {
                batchId: batchNo.batchNumber,
                batchQuantity: batchNo.quantity,
                batchBaseLine: i.toString()
              }
            }
            batches.push(batchDetail);
            deliveryDetails.batches = batches;
            deliveryDetails.discountPercentage = '';
            Meteor.call('delivery.createInvoice', deliveryId, deliveryDetails, (error) => {
              if (error) {
                $('#message').html("Internal error - unable to generate invoice. Please try again");
                template.deliveryId.set('');
              } else {
                $('#deliverySuccessModal').find('.modal-body').text('Invoice generated successfully');
                $('#deliverySuccessModal').modal();

                template.deliveryId.set('');
              }
              $("#invoiceGenerate").modal('hide');
            });
          });
        }
      }
    });
  },
  /**
   * TODO:Complete Js doc
   * for printing order details
   */
  'click .print': (event, template) => {
    event.preventDefault();
    $('#printDetailPage').modal();
    let id = event.currentTarget.id;
    template.modalLoader.set('');
    template.custAddress.set('');
    let printCardName = $('#printCardName');
    let printAddress = $('#printAddresss');
    let printStreet = $('#printStreet');
    let printBlock = $('#printBlock');
    let printCity = $('#printCity');
    let printLocation = $('#printLocation');
    let printPloteNo = ('#branchPloteNoPrint');
    let custRefs = $('#custRefs');
    let printOrdId = $('#printOrdId');
    let weightTotal = $('#weightTotal');
    let branchNamePrint = $('#branchNamePrint');
    Meteor.call('delivery.id', id, (orderError, orderResult) => {
      if (!orderError) {
        template.orderData.set(orderResult);
        customerForPrint(orderResult.cardCode);
        branchForPrint(orderResult.branch);
        customerAddress(orderResult.cardCode);
        $(printLocation).html(orderResult.address);
        $(custRefs).html(orderResult.custRefNo);
        $(printOrdId).html(orderResult.docNum);
        $(weightTotal).html(orderResult.weight);
        template.deliveryDocNum.set(id);
      }
    });
    //getting customer details for printing
    function customerForPrint(cardCode) {
      Meteor.call('customer.customerFindOneQuotation', cardCode, (customerError, customerResult) => {
        if (!customerError) {
          template.customerDetail.set(customerResult);
          template.modalLoader.set(customerResult);
          $(printCardName).html(customerResult.cardName);
          $(printAddress).html(customerResult.address);
        }
      });
    }
    // getting branch details
    function branchForPrint(branch) {
      Meteor.call('branch.branchDetail', branch, (branchError, branchResult) => {
        if (!branchError) {
          $(branchNamePrint).html(branchResult.bPLName);
          $(branchAddressPrint).html(branchResult.address);
          $(printPloteNo).html(branchResult.streetNo);
        }
      });
    }
    function customerAddress(cardCode) {
      Meteor.call('customerAddress.custAddress', cardCode, (customerError, customerResult) => {
        if (!customerError) {
          $(printStreet).html(customerResult.street);
          $(printBlock).html(customerResult.block);
          $(printCity).html(customerResult.city);
          template.custAddress.set(customerResult);
        }
      });
    }
    Template.delivery.__helpers.get('ordDetail').call();
    Template.delivery.__helpers.get('cstmrDetail').call();
  },
  /**
* TODO: Complete JS doc
* for print data
*/
  'click .printThis': () => {
    $("#printSection").printThis({
    });
    let docNum = Template.instance().deliveryDocNum.get();
    Meteor.call('delivery.printCheck', docNum, (err, res) => {
      if (!err) {
      }
    });
  },
  /**
      * TODO: Complete JS doc
      * clear data when click close button
      */
  'click .close': (event, template) => {
    $('form :input').val("");
    $('.statusUpdate').each(function () {
      this.reset();
    });
    $('form :input').val("");
    $("#submit").attr("disabled", false);
    template.itemsDetailsList.set('');
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
  /**
   * TODO: Complete JS doc
   * clear data when click close button
   */
  'click .closen': (event, template) => {
    $('form :input').val("");
    $('.statusUpdate').each(function () {
      this.reset();
    });
    $('form :input').val("");
    $("#submit").attr("disabled", false);
    template.itemsDetailsList.set('');
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
});