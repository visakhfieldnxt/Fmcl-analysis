/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import { RouteGroup } from '../../../api/routeGroup/routeGroup';
Template.routeReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.stockInvoice = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.assignedHistoryData = new ReactiveVar();
  this.routeCodeList = new ReactiveVar();
  this.bodyLoaders = new ReactiveVar();
  this.branchArrayList = new ReactiveVar();
  this.routeCustomerList = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  let managerBranch = Session.get("managerBranch");
  this.pagination = new Meteor.Pagination(RouteGroup, {
    sort: {
      createdAt: -1
    },
    filters: {
      branchCode: { $in: managerBranch }
    },
    perPage: 25
  });
});
Template.routeReport.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  /**
* TODO:Complete Js doc
* Getting vansale user list
*/

  Meteor.call('routeGroup.list', (err, res) => {
    if (!err) {
      this.routeCodeList.set(res);
    }
  });
  Meteor.call('routeCustomer.list', (err, res) => {
    if (!err) {
      this.routeCustomerList.set(res);
    }
  });

  let managerBranch = Session.get("managerBranch");
  Meteor.call('branch.managerBranchGet', managerBranch, (err, res) => {
    if (!err)
      this.branchNameArray.set(res);
  });

  // for getting allUser Name 
  Meteor.call('user.userNameGet', (err, res) => {
    if (!err)
      // Session.set("userNameArray",res);
      this.userNameArray.set(res)
  });
  /**
* TODO: Complete JS doc
*/


  $('#routeCodeVal').select2({
    placeholder: "Select Route Code",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#routeCodeVal").parent(),
  });

  $('#routeNameVal').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#routeNameVal").parent(),
  });

  $('#selectBranchName').select2({
    placeholder: "Select Branch",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#selectBranchName").parent(),
  });

});
Template.routeReport.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  /**
 * get vansale user name
 */
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
  branchNameHelp: (branch) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("branch.idBranchName", branch, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.branchIdVal_' + branch).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.branchIdVal_' + branch).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },

  /**
* TODO:Complete JS doc
*/
  branchList: function () {
    return Template.instance().branchNameArray.get();
  },
  /**
* get vansale user name
*/
  /**
 * get customer name
 */

  custNameHelp: (cardCode) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("customer.idCardName", cardCode, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.customerVal_' + cardCode).html(result);
      $('.loadersSpinPromise').css('display', 'none');
    }
    ).catch((error) => {
      $('.customerVal_' + cardCode).html('');
      $('.loadersSpinPromise').css('display', 'none');
    }
    );
  },
  /**
   * find no.of customers
   */
  arrayLength: (customers) => {
    if (customers) {
      return customers.length;
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
   * 
   * @param {*} dates 
   * formatting date time
   */

  dateFormats: (dates) => {
    if (dates) {
      return moment(dates).format('DD-MM-YYYY hh:mm A');
    }
    else {
      return '';
    }
  },
  activeCheckss: (status) => {
    if (status === 'Y') {
      return 'Active';
    }
    else {
      return 'Inactive';
    }
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
   * @returns {*}
   */
  orderes: function () {
    let exportValue = Template.instance().pagination.getPage();
    Template.instance().todayExport.set(exportValue);
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    let custRes = Template.instance().routeCustomerList.get();
    let exportRes = Template.instance().todayExport.get();
    if (exportRes !== undefined && exportRes.length > 0 && custRes !== undefined && custRes !== '') {
      for (let i = 0; i < exportRes.length; i++) {
        let resultArray = [];
        resultArray = custRes.filter(function (e) {
          return e.routeId === exportRes[i]._id;
        });
        if (resultArray !== undefined && resultArray.length > 0) {
          exportRes[i].customerArray = resultArray;
        }
      }
    }
    return exportRes;
  },

  printLoadBody: () => {
    let res = Template.instance().bodyLoaders.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
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
  * @param assignedBy
  */
  username: (assignedTo) => {
    let userAr = Template.instance().userNameArray.get();
    if (assignedTo) {
      if (userAr) {
        return userAr.find(x => x._id === assignedTo).profile.firstName;
      }
    }
  },

  /**
* TODO:Complete JS doc
*/
  routeList: function () {

    return Template.instance().customerNameArray.get();
  },

  /**
     * TODO: Complete JS doc
     * @returns {*}
     */
  delivery: function () {
    let deliveryList = Session.get("deliveryss");
    return deliveryList;
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
  routeDataDetails: () => {
    return Template.instance().routeUpdatedData.get();

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
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
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
    else {
      return 'Not Approved';
    }
  },

  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  totalAmt: (docTotal) => {
    let res = Number(docTotal).toFixed(6);
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
  * get assigned data
  */
  assignedData: () => {
    return Template.instance().assignedHistoryData.get();
  },
  /**
* TODO:Complete Js doc
* Getting item list
*/
  routeCodeLists: function () {
    return Template.instance().routeCodeList.get();
  },

  /**
 * TODO:Complete JS doc
 * @param docTotal
 */
  total: (docTotal) => {
    let total = Number(docTotal).toFixed(2);
    return total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
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

Template.routeReport.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .route-filter': (event, template) => {
    event.preventDefault();
    let managerBranch = Session.get("managerBranch");
    let routeCode = event.target.routeCodeVal.value;
    let routeName = event.target.routeNameVal.value;
    let branch = event.target.selectBranchName.value;
    if (routeCode && branch === '' && routeName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          routeCode: routeCode,
          branchCode: { $in: managerBranch }
        }
      );
    }
    else if (routeName && routeCode === '' && branch === '') {
      Template.instance().pagination.settings.set('filters', {
        routeName: routeName,
        branchCode: { $in: managerBranch }
      });
    }
    else if (routeName === '' && routeCode === '' && branch) {
      Template.instance().pagination.settings.set('filters', {
        branchCode: branch,
      });
    }
    else if (routeName && routeCode && branch === '') {
      Template.instance().pagination.settings.set('filters', {
        routeCode: routeCode,
        routeName: routeName,
        branchCode: { $in: managerBranch }
      });
    }
    else if (routeName && routeCode === '' && branch) {
      Template.instance().pagination.settings.set('filters', {
        branchCode: branch,
        routeName: routeName,
      });
    }
    else if (routeName === '' && routeCode && branch) {
      Template.instance().pagination.settings.set('filters', {
        branchCode: branch,
        routeCode: routeCode,
      });
    }
    else if (routeName && routeCode && branch) {
      Template.instance().pagination.settings.set('filters', {
        branchCode: branch,
        routeCode: routeCode,
        routeName: routeName
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
    }
  },
  /**
  * TODO: Complete JS doc
  * for reset filter
  */
  'click .reset': (event, target) => {
    let managerBranch = Session.get("managerBranch");
    Template.instance().pagination.settings.set('filters', {
      branchCode: { $in: managerBranch }
    });
    $('#routeCodeVal').val('').trigger('change');
    $('#routeNameVal').val('').trigger('change');
    $('#selectBranchName').val('').trigger('change');
    $('form :input').val("");
  },
  /**
 * TODO:Complete JS doc
 * @param event
 */
  /**
     * TODO:Complete JS doc
     * @param event
     */
  'click .view': (event, template) => {
    event.preventDefault();
    $('#orderDetailPage').modal();
    template.modalLoader.set(true);
    $('.loadersSpinPromise').css('display', 'block');
    template.itemsDetailsList.set('');
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let routeCode = $('#detailrouteCode');
    let description = $('#detailDescription');
    let routeName = $('#detailrouteName');
    let detailBranch = $('#detailBranch');
    let detailStatus = $('#detailStatus');
    Meteor.call('routeGroup.idGet', id, (err, res) => {
      if (!err) {
        $(header).html('Details of Route');
        $(routeCode).html(res.groupRes.routeCode);
        $(description).html(res.groupRes.description);
        $(routeName).html(res.groupRes.routeName);
        $(detailBranch).html(res.branchName);
        template.modalLoader.set(false);
        if (res.customerList.length === 0) {
          $('.loadersSpinPromise').css('display', 'none');
        }
        template.itemsDetailsList.set(res.customerList);
        if (res.groupRes.active === "Y") {
          $(detailStatus).html("Active");
        }
        else {
          $(detailStatus).html("Inactive");
        }
      }
      else {
        template.modalLoader.set(false);
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

            saveAs(file, "Route Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
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
