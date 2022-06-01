/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import { Order } from "../../../api/order/order";


Template.orderReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.customerNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.stockInvoice = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.approvalCheckVal = new ReactiveVar();
  this.approvalValueGet = new ReactiveVar();
  this.accValue = new ReactiveVar();
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  let managerBranch = Session.get("managerBranch");
  this.pagination = new Meteor.Pagination(Order, {
    sort: {
      createdAt: -1
    },
    filters: {
      docDate: {
        $gte: toDay,
        $lt: nextDay
      },
      branch: { $in: managerBranch }
    },
    perPage: 25
  });
});

Template.orderReport.onRendered(function () {
  // for getting all Customer Name & cardcode.
  Meteor.call('customer.customerNameGet', (err, res) => {
    if (!err)
      this.customerNameArray.set(res);
  });

  $('.selectCustomerName').select2({
    placeholder: "Select Dealer Name",
    tokenSeparators: [','],
    allowClear: true
  }); 
});

Template.orderReport.helpers({


  orderStatusValue: function (canceled) {
    if (canceled === 'Y') {
      return true;
    }
    else {
      return false;
    }

  },
  currencyGet: () => {
    let currencyValues = Session.get("currencyValues");
    return currencyValues;
  },
  /**
  * 
  * @param {*} index 
  * @returns get row index
  */
  indexCountGet: (index) => {
    let res = Template.instance().pagination;
    if (res) {
      let pageValue = res.settings.keys.page;
      if (pageValue !== undefined && pageValue > 1) {
        return (25 * (pageValue - 1)) + index + 1;
      }
      else {
        return index + 1;
      }
    }
  },
  /**
 * TODO:Complete JS doc
 * @param vansale
 */
  vansaleAppCheck: (dataVal) => {
    if (dataVal === true) {
      return 'Mobile APP';
    }
    else {
      return 'Web APP';
    }
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
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },

  /**
 * TODO: Complete JS doc
 * first approval details
 */
  firstApproveData: () => {
    return Template.instance().approvalValueGet.get();
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
     * TODO: Complete JS doc
     * first approval check
     */
  firstApproveCheck: () => {
    let res = Template.instance().approvalCheckVal.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  orderes: function () {
    let exportValue = Template.instance().pagination.getPage();
    let uniqueSlNo = 0;
    for (let i = 0; i < exportValue.length; i++) {
      uniqueSlNo = parseInt(uniqueSlNo + 1);
      for (let j = 0; j < exportValue[i].itemLines.length; j++) {
        exportValue[i].itemLines[j].orderId = exportValue[i].orderId,
          exportValue[i].itemLines[j].createdAt = exportValue[i].createdAt,
          exportValue[i].itemLines[j].cardName = exportValue[i].cardName,
          exportValue[i].itemLines[j].street = exportValue[i].street,
          exportValue[i].itemLines[j].block = exportValue[i].block,
          exportValue[i].itemLines[j].city = exportValue[i].city,
          exportValue[i].itemLines[j].custRefNo = exportValue[i].custRefNo,
          exportValue[i].itemLines[j].custRefDate = exportValue[i].custRefDate,
          exportValue[i].itemLines[j].totalItem = exportValue[i].totalItem,
          exportValue[i].itemLines[j].totalQty = exportValue[i].totalQty,
          exportValue[i].itemLines[j].salesmanName = exportValue[i].salesmanName,
          exportValue[i].itemLines[j].sQId = exportValue[i].sQId,
          exportValue[i].itemLines[j].branchName = exportValue[i].branchName,
          exportValue[i].itemLines[j].docTotal = exportValue[i].docTotal,
          exportValue[i].itemLines[j].approvedByName = exportValue[i].approvedByName,
          exportValue[i].itemLines[j].firstAppovalName = exportValue[i].firstAppovalName,
          exportValue[i].itemLines[j].firstAppovalDate = exportValue[i].firstAppovalDate,
          exportValue[i].itemLines[j].rejectedByName = exportValue[i].rejectedByName,
          exportValue[i].itemLines[j].approvedByDate = exportValue[i].approvedByDate,
          exportValue[i].itemLines[j].onHoldByName = exportValue[i].onHoldByName,
          exportValue[i].itemLines[j].rejectedDate = exportValue[i].rejectedDate,
          exportValue[i].itemLines[j].onHoldDate = exportValue[i].onHoldDate,
          exportValue[i].itemLines[j].oRStatus = exportValue[i].oRStatus,
          exportValue[i].itemLines[j].canceled = exportValue[i].canceled,
          exportValue[i].itemLines[j].discPrcnt = exportValue[i].discPrcnt,
          exportValue[i].itemLines[j].beforeDiscount = exportValue[i].beforeDiscount,
          exportValue[i].itemLines[j].afterDiscount = exportValue[i].afterDiscount,
          exportValue[i].itemLines[j].GST = exportValue[i].GST,
          exportValue[i].itemLines[j].discPercnt = exportValue[i].discPercnt,
          exportValue[i].itemLines[j].accountantApproved = exportValue[i].accountantApproved,
          exportValue[i].itemLines[j].accountantRejected = exportValue[i].accountantRejected,
          exportValue[i].itemLines[j].accountantOnHold = exportValue[i].accountantOnHold,
          exportValue[i].itemLines[j].vansaleApp = exportValue[i].vansaleApp,
          exportValue[i].itemLines[j].uniqueSlNo = uniqueSlNo
      }
    }
    Template.instance().todayExport.set(exportValue);

    return Template.instance().pagination.getPage();
  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
  },

  /**
 * TODO:Complete JS doc
 * @param discPrcnt 
 */
  discountFormat: (discPrcnt) => {
    return Number(discPrcnt).toFixed(6);
  },
  /**
 * TODO:Complete JS doc
 * @param discPrcnt 
 */
  diff: (itQuantity, deliveredQuantity) => {
    return Number(itQuantity - deliveredQuantity).toFixed(6);
  },
  /**
 * TODO: Complete Js doc
 * @param deliveredBy
 */
  customer: (cardCode) => {
    let custAr = Template.instance().customerNameArray.get();
    if (custAr) {
      return custAr.find(x => x.cardCode === cardCode).cardName;
    }
  },
  /**
* TODO:Complete JS doc
*/
  customersList: function () {

    return Template.instance().customerNameArray.get();
  },
  /**
  * TODO: Complete JS doc
  * @returns {*}
  */
  orderByDateExport: function () {
    return Template.instance().stockInvoice.get();
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
  */
  items: () => {
    return Template.instance().itemsDetailsList.get();
  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  dateFormat: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  timeSeperate: (docDate) => {
    return moment(docDate).format('hh:mm:ss A');
  },


  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
  },
  statusValCheck: (status) => {
    if (status === 'Pending') {
      return true;
    }
    else {
      return false;
    }
  },
  /**
  * TODO:Complete JS doc
  * 
  * @param docStatus
  */
  status: (docStatus) => {
    if (docStatus === 'approved') {
      return 'Approved';
    }
    else if (docStatus === 'rejected') {
      return 'Rejected';
    }
    else if (docStatus === 'onHold') {
      return 'On Hold';
    }
    else if (docStatus === 'Pending') {
      return 'Pending';
    }
    else {
      return '';
    }
  },
  /**
* TODO:Complete JS doc
* 
* @param docStatus
*/
  statusExcel: (docStatus) => {
    if (docStatus === 'approved') {
      return 'Approved';
    }
    else if (docStatus === 'rejected') {
      return 'Rejected';
    }
    else if (docStatus === 'onHold') {
      return 'On Hold';
    }
    else if (docStatus === 'Pending') {
      return 'Pending (Waiting For Accountant Approval)';
    }
    else {
      return '';
    }
  },
  /**
  * TODO:Complete JS doc
  * @param quantity
  * @param actualQuantity
  */
  deliveredQty: (quantity, actualQuantity) => {
    let diff = Number(actualQuantity) - Number(quantity);
    return Number(diff).toFixed(6);
  },

  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  quantityFormat: (quantity) => {
    let res = Number(quantity).toFixed(3);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  taxFormats: (quantity, taxRate) => {
    let res = (parseInt(quantity) * Number(taxRate)).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
  * TODO:Complete Js doc
  * for getting total weight
  */
  weightCal: (quantity, weight, unitQuantity) => {
    let result = (parseInt(quantity) * Number(weight) * parseInt(unitQuantity)).toFixed(2);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  approveCheckVal: (accountantApproved, accountantRejected, accountantOnHold) => {
    if (accountantApproved === true || accountantRejected === true || accountantOnHold === true) {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * TODO:Complete Js doc
   * for getting total price based on quantity
   */
  totalIn: (price, quantity) => {
    let res = Number(Number(price) * Number(quantity)).toFixed(6);
    let result = Number(res).toFixed(6);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
 * TODO:Complete JS doc
 * @param docTotal
 */
  total: (docTotal) => {
    let total = Number(docTotal).toFixed(2);
    return total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  totalAmt: (docTotal) => {
    let res = Number(docTotal).toFixed(6);
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

Template.orderReport.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event) => {
    event.preventDefault();

    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let managerBranch = Session.get("managerBranch");
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let cardName = event.target.selectCustomerName.value;
    if (cardName && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        cardName: cardName,
        branch: { $in: managerBranch }
      });
    }
    else if (fromDate && isNaN(toDate) && cardName === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        docDate: {
          $lte: fromDate
        },
        branch: { $in: managerBranch }
      });
    }
    else if (toDate && isNaN(fromDate) && cardName === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        docDate: {
          $lte: toDate
        },
        branch: { $in: managerBranch }
      });
    }
    else if (fromDate && toDate && cardName === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lt: toDate
          },
          branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          }, branch: { $in: managerBranch }
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
          branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          },
          cardName: cardName,
          branch: { $in: managerBranch }
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
    let managerBranch = Session.get("managerBranch");
    nextDay.setDate(nextDay.getDate() + 1);
    Template.instance().pagination.settings.set('filters', {
      branch: { $in: managerBranch },
      docDate: {
        $gte: toDay,
        $lt: nextDay
      }
    });
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
    template.approvalValueGet.set('');
    template.approvalCheckVal.set(false);
    template.accValue.set(false);
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let cardName = $('#detailCardNames');
    let cardCode = $('#detailCardCodes');
    let branch = $('#detailBranchs');
    let docTotal = $('#detailDocTotals');
    let beforeDiscount = $('#detailBeforeDiscounts');
    let afterDiscount = $('#detailAfterDiscounts');
    let gst = $('#detailGSTs');
    let docEntry = $('#detailDocEntrys');
    let docDeliver = $('#detailDocDelivers');
    let docDate = $('#detailDocDates');
    let custRef = $('#detailcustRef');
    let custRefDate = $('#detailCustRefDate');
    let orderId = $('#detailOrderIds');
    let detailApprovedBy = $('#detailApprovedBy');
    let detailApprovedDate = $('#detailApprovedDate');
    let detailRemark = $('#detailRemark');
    let weights = $('#detailWeight');
    let ribNumberS = $('#detailribNumber');
    let driverNameS = $('#detaildriverName');
    let address = $('#detailAddress');
    let street = '';
    let city = '';
    let block = '';
    let salesPerson = $('#detailSalesPerson');
    let detailApprovedRemark = $("#detailApprovedRemark");
    let detailcreated = $('#detailcreated');
    $('#orderDetailPage').modal();
    Meteor.call('order.id', id, (orderError, orderResult) => {
      if (!orderError) {
        let order = orderResult;
        $(header).html('Details of Order');
        let totalAmt = Number(order.docTotal).toFixed(6);
        $(docTotal).html(totalAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(beforeDiscount).html(Number(order.beforeDiscount).toFixed(6));
        $(afterDiscount).html(Number(order.afterDiscount).toFixed(6));
        $(cardCode).html(order.cardCode);
        $(custRef).html(order.custRefNo);
        $(custRefDate).html(moment(order.custRefDate).format("DD-MM-YYYY"));
        $(detailRemark).html(order.remark_order);
        $(salesPerson).html(order.salesmanName);
        $(branch).html(order.branchName);
        $(cardName).html(order.cardName);
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
        let weightAmt = Number(order.weight).toFixed(2)
        $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(docDeliver).html(moment(order.docDueDate).format("DD-MM-YYYY"));
        if (order.oRStatus === 'Pending') {
          $(detailApprovedBy).html(order.firstAppovalName);
          $(detailApprovedDate).html(moment(order.firstAppovalDate).format("DD-MM-YYYY"));
          $(detailApprovedRemark).html(order.firstApprovalRemarks);
        }
        else if (order.approvedByName) {
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
        if (order.GST === undefined) {
          $(gst).html('0.00');
        }
        else {
          let gstAmt = Number(order.GST).toFixed(6);
          $(gst).html(gstAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        }
        $(docDate).html(moment(order.createdAt).format('DD-MM-YYYY hh:mm:ss A'));
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
        if (order.oRStatus === 'Pending') {
          template.approvalCheckVal.set(true);
          template.approvalValueGet.set(order);
        }
        if (order.accountantApproved === true || order.accountantRejected === true || order.accountantOnHold === true) {
          template.accValue.set(true);
          template.approvalValueGet.set(order);
        }

        if (order.mobileId !== '' && order.mobileId !== undefined) {
          $(detailcreated).html('Mobile App');
        } else {
          $(detailcreated).html('Web App');
        }
        template.itemsDetailsList.set(order.itemLines);
        template.modalLoader.set(order.itemLines);
      }
    });
  },
  /**
     * TODO: Complete JS doc
     */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  /**
    * TODO:Complete JS doc
    */
  'submit .exportToday': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().todayExport.get();
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

            saveAs(file, "Order Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },
  /**
   * TODO:CompleteJS doc
   */
  'change .startDate': () => {
    $(".endDate").attr("disabled", false);
  },
  /**
   * TODO:CompleteJS doc
   */
  'change .endDate': (event, template) => {
    let startDate = new Date($('.startDate').val());
    let endDate = new Date($('.endDate').val());
    endDate.setDate(endDate.getDate() + 1);
    $('.mainLoader').css('display', 'block');
    if (startDate.toString() !== 'Invalid Date') {
      Meteor.call('order.export', startDate, endDate, (err, res) => {
        if (!err) {
          template.stockInvoice.set(res);
        }
      });
    }
    else {
      $(window).scrollTop(0);
      $("#startDateSpan").html('<font color="#fc5f5f" size="2">Please select a valid date</font>');
      setTimeout(function () {
        $('#startDateSpan').delay(5000).fadeOut('slow');
      }, 5000);
      $('.mainLoader').css('display', 'none');
    }
  },
  /**
   * TODO:Complete JS doc
   */

  'click .exportClose': () => {
    $('form :input').val("");
    $('#startDateSpan').html('');
    Template.instance().stockInvoice.set('');
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');

  },
  /**
    * TODO:Complete JS doc
    */
  'click .export': () => {
    let header = $('#deliveryExportH');
    $('#deliveryReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
  },
  /**
   * TODO:Complete JS doc
   * @param event 
   */
  'submit .exportByDate': (event) => {
    event.preventDefault();

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
    let toExcel = document.getElementById("viewNew").innerHTML;
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

        saveAs(file, "Order Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
      });

    $('#deliveryReportExportPage').modal('hide');
    $('form :input').val("");
    $('#startDateSpan').html('');
    Template.instance().stockInvoice.set('');
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');
  },

  /**
     * TODO: Complete JS doc
     */
  'click .close': (event, template) => {
    $('form :input').val("");

    template.itemsDetailsList.set('');

    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
  /**
     * TODO: Complete JS doc
     */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
});
