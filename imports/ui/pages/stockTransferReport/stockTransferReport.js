/**
 * @author Visakh
 */

import { Meteor } from 'meteor/meteor';
import { StockTransfer } from "../../../api/stockTransfer/stockTransfer";

Template.stockTransferReport.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.itemNameArray = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.returnId = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  let managerBranch = Session.get("managerBranch");
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  this.pagination = new Meteor.Pagination(StockTransfer, {
    sort: { createdAt: -1 },
    filters: {
      branch: { $in: managerBranch },
      createdAt: {
        $gte: toDay,
        $lt: nextDay
      }
    },
    perPage: 25
  });

});
Template.stockTransferReport.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  /**
  * TODO:Complete JS doc
  * @param docDate
  */
  timeSeperate: (docDate) => {
    return moment(docDate).format('hh:mm:ss A');
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
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
* TODO:Complete Js doc
* for getting total weight
*/
  weightCal: (quantity, weight, unitQuantity) => {
    let result = (parseInt(quantity) * Number(weight) * parseInt(unitQuantity)).toFixed(2);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  stockTransfer: function () {
    let exportValue = Template.instance().pagination.getPage();
    let uniqueSlNo = 0;
    for (let i = 0; i < exportValue.length; i++) {
      uniqueSlNo = parseInt(uniqueSlNo + 1);
      for (let j = 0; j < exportValue[i].itemLines.length; j++) {
        exportValue[i].itemLines[j].stockId = exportValue[i].stockId,
          exportValue[i].itemLines[j].docDate = exportValue[i].docDate,
          exportValue[i].itemLines[j].createdAt = exportValue[i].createdAt,
          exportValue[i].itemLines[j].branchName = exportValue[i].branchName,
          exportValue[i].itemLines[j].salesmanName = exportValue[i].salesmanName,
          exportValue[i].itemLines[j].wareHouseFromName = exportValue[i].wareHouseFromName,
          exportValue[i].itemLines[j].wareHouseToName = exportValue[i].wareHouseToName,
          exportValue[i].itemLines[j].totalItem = exportValue[i].totalItem,
          exportValue[i].itemLines[j].totalQty = exportValue[i].totalQty,
          exportValue[i].itemLines[j].dueDueDate = exportValue[i].dueDueDate,
          exportValue[i].itemLines[j].stockStatus = exportValue[i].stockStatus,
          exportValue[i].itemLines[j].approvedByName = exportValue[i].approvedByName,
          exportValue[i].itemLines[j].rejectedByName = exportValue[i].rejectedByName,
          exportValue[i].itemLines[j].onHoldByName = exportValue[i].onHoldByName,
          exportValue[i].itemLines[j].rejectedDate = exportValue[i].rejectedDate,
          exportValue[i].itemLines[j].onHoldDate = exportValue[i].onHoldDate,
          exportValue[i].itemLines[j].tempId = exportValue[i].tempId,
          exportValue[i].itemLines[j].uniqueSlNo = uniqueSlNo
      }
    }
    Template.instance().todayExport.set(exportValue);
    return Template.instance().pagination.getPage();
  },
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
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
  printLoad: () => {
    return Template.instance().modalLoader.get();
  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  date: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  dateFormat: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
   * TODO:Complete JS doc
   * for getting item details
   */
  items: () => {
    // let itemsList = Session.get("itemsDetailsList");
    let itemsList = Template.instance().itemsDetailsList.get();
    return itemsList;
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
  status: function (stockStatus) {
    if (stockStatus === 'Cancelled') {
      return true;
    }
    else {
      return false;
    }
  },
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.stockTransferReport.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .salesReturn-filter': (event) => {
    event.preventDefault();
    let managerBranch = Session.get("managerBranch");
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    if (fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: fromDate,
        }, branch: { $in: managerBranch }
      });
    }
    else if (toDate && isNaN(fromDate)) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: toDate
        }, branch: { $in: managerBranch }
      });
    }
    else if (fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          }, branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lte: toDate
          }, branch: { $in: managerBranch }
        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
    }
  },
  /**
   * TODO: Complete JS doc
   * for reset filter
   */
  'click .reset': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    let managerBranch = Session.get("managerBranch");
    Template.instance().pagination.settings.set('filters', {
      branch: { $in: managerBranch },
      createdAt: {
        $gte: toDay,
        $lt: nextDay
      }
    });
    $('form :input').val("");
  },
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

            saveAs(file, "Stock Transfer Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },
  /**
  * TODO:Complete JS doc
  * @param event
  */
  'click .view': (event, template) => {
    event.preventDefault();

    let id = event.currentTarget.id;
    template.modalLoader.set('');
    let header = $('#orderHs');
    let dueDate = $('#detailDocDelivers');
    let docDate = $('#detailDocDates');
    let detailRemark = $('#detailRemark');
    let wareHouseFromName = $('#wareHouseFromName');
    let wareHouseToName = $('#wareHouseToName');
    let stockNoDetail = $('#stockNoDetail');
    let detailBranch = $('#detailBranch');
    let detailApprovedBy = $("#detailApprovedBy");
    let detailApprovedDate = $("#detailApprovedDate");
    let detailApprovedRemark = $("#detailApprovedRemark");
    let detailUniqueId = $('#detailUniqueId');
    let detailSalesperson = $('#detailSalesperson');
    let weights = $('#detailWeight');
    $('#stockRejectedPage').modal();
    Meteor.call('stockTransfer.id', id, (err, res) => {
      let order = res;
      $(header).html('Details of Stock Transfer Request');
      $(stockNoDetail).html(order.stockId);
      $(detailRemark).html(order.remark_stock);
      $(wareHouseFromName).html(order.wareHouseFromName);
      $(wareHouseToName).html(order.wareHouseToName);
      $(detailSalesperson).html(order.salesmanName);
      $(dueDate).html(moment(order.dueDate).format("DD-MM-YYYY"));
      $(docDate).html(moment(order.docDate).format('DD-MM-YYYY hh:mm:ss A'));
      $(detailBranch).html(order.branchName);
      template.itemsDetailsList.set(order.itemLines);
      if (order.weight !== undefined && order.weight !== null) {
        let weightAmt = Number(order.weight).toFixed(2);
        $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      }
      else {
        $(weights).html('');
      }
      if (order.tempId !== undefined && order.tempId !== '') {
        $(detailUniqueId).html(order.tempId);
      }
      else {
        $(detailUniqueId).html('');
      }
      template.modalLoader.set(order.itemLines);
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
    });
  },
  /**
* TODO: Complete JS
* clear data when click close button
*/
  'click .closen': (event, template) => {
    $('form :input').val("");
    //Session.set("itemsDetailsList",'');
    template.itemsDetailsList.set('');
    template.modalLoader.set('');
  },
  /**
* TODO: Complete JS doc
* clear data when click close button
*/
  'click .close': (event, template) => {
    $('form :input').val("");
    // Session.set("itemsDetailsList",'');
    template.itemsDetailsList.set('');
    template.modalLoader.set('');
    $(".save").attr("disabled", false);
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
});
