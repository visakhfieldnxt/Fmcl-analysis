/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { RouteAssign } from '../../../api/routeAssign/routeAssign';
Template.noTransactionReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.routeExportData = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.assignedHistoryData = new ReactiveVar();
  this.userListGets = new ReactiveVar();
  this.customerUserDetail = new ReactiveVar();
  this.modalLoaderBody = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.routeCodeList = new ReactiveVar();
  this.routeCustData = new ReactiveVar();
  this.vansaleUserFullList = new ReactiveVar();
  this.routeUpdatesArry=new ReactiveVar();
  this.custAddressArray = new ReactiveVar();

  this.pagination = new Meteor.Pagination(RouteAssign, {
    sort: {
      noTransactionUpdated: -1
    },
    filters: {
      transactionDone: false
    },
    perPage: 25
  });
});
Template.noTransactionReport.onRendered(function () {
  this.modalLoaderBody.set(true);
  /**
* TODO:Complete Js doc
* Getting vansale user list
*/

  Meteor.call('routeGroup.noTransActionReport', (err, res) => {
    if (!err) {
      this.userListGets.set(res.userRes);
      this.routeCodeList.set(res.groupRes);
      this.vansaleUserFullList.set(res.vanUsersFilter);
      this.branchNameArray.set(res.branchRes);
      this.routeUpdatesArry.set(res.routeUpdateRes);
      this.routeCustData.set(res.routeCustomers);
      this.modalLoaderBody.set(false);
    }
    else {
      this.modalLoaderBody.set(false);
    }
  });

  /**
   * TODO:Complete Js doc
   * Getting customer list
   */
  Meteor.call('customer.customerRouteData', (err, res) => {
    if (!err)
      this.customerNameArray.set(res);
  });
  // for getting allUser Name 
  Meteor.call('user.userNameGet', (err, res) => {
    if (!err)
      // Session.set("userNameArray",res);
      this.userNameArray.set(res)
  });
  Meteor.call('customerAddress.list', (err, res) => {
    if (!err)
      // Session.set("userNameArray",res);
      this.custAddressArray.set(res)
  });
  /**
* TODO: Complete JS doc
*/
  Meteor.setInterval(() => {
    Meteor.call('routeGroup.noTransActionReport', (err, res) => {
      if (!err) {
        this.userListGets.set(res.userRes);
        this.vansaleUserFullList.set(res.vanUsersFilter);
        this.branchNameArray.set(res.branchRes);
        this.routeCodeList.set(res.groupRes);
        this.routeUpdatesArry.set(res.routeUpdateRes);
        this.routeCustData.set(res.routeCustomers);
      }
    });
  }, 600000);

  /**
   * TODO:Complete Js doc
   * Getting customer list
   */
  Meteor.call('customer.customerRouteData', (err, res) => {
    if (!err)
      this.customerUserDetail.set(res);
  });



  $('.selectRouteName').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteName").parent(),
  });

  $('.selectBranchFilter').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectBranchFilter").parent(),
  });

  $('.selectSalesPerson').select2({
    placeholder: "Select Sales Person",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSalesPerson").parent(),
  });

});
Template.noTransactionReport.helpers({
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
  routeDataList: () => {
    return Template.instance().routeUpdatedData.get();

  },
  /**
   * 
   * @param {*} id 
   * @returns 
   * get customer count
   */
  customerCount: (id) => {
    let custArray = Template.instance().routeUpdatesArry.get();
    if (custArray) {
      let custVal = custArray.filter(function (e) {
        return e.routeAssignId === id;
      });
      if (custVal) {
        return custVal.length;
      }
    }
  },
  /**
   * get customer address
   */
  addressNameGetHelp: (customer, route) => {
    let addressArry = Template.instance().custAddressArray.get();
    let custData = Template.instance().routeCustData.get();
    if (custData) {
      let custVal = custData.filter(function (e) {
        return e.routeId === route;
      });
      if (custVal) {
        console.log()
        let res = custVal.find(x => x.customer === customer);
        if (res) {
          if (res.address !== undefined) {
            let addressRes = addressArry.find(x => x._id === res.address);
            {
              if (addressRes) {
                return addressRes.address
              }
            }
          }
        }
      }
    }
  },
  /**
* get vansale user name
*/

  routeCodeHelp: (id) => {
    let routeData = Template.instance().routeCodeList.get();
    if (routeData) {
      let res = routeData.find(x => x._id === id);
      if (res) {
        return res.routeCode;
      }
    }
  },
  /**
  * get vansale user name
  */

  routeNameHelp: (id) => {
    let routeData = Template.instance().routeCodeList.get();
    if (routeData) {
      let res = routeData.find(x => x._id === id);
      if (res) {
        return res.routeName;
      }
    }
  },
  /**
  * get vansale user name
  */

  routeBranchHelp: (id) => {
    let routeData = Template.instance().routeCodeList.get();
    let branchNameArrayData = Template.instance().branchNameArray.get();
    if (routeData) {
      let res = routeData.find(x => x._id === id);
      if (res) {
        let branchRes = branchNameArrayData.find(x => x.bPLId === res.branchCode);
        if (branchRes) {
          return branchRes.bPLName;
        }
      }
    }
  },
  branchList: () => {
    return Template.instance().branchNameArray.get();
  },
  /**
  * get vansale user name
  */

  vanUserName: (id) => {
    let userData = Template.instance().userListGets.get();
    if (userData) {
      let res = userData.find(x => x._id === id);
      if (res) {
        return `${res.profile.firstName} ${res.profile.lastName}`;
      }
    }
  },
  vanUserList: () => {
    return Template.instance().vansaleUserFullList.get();
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
    return Template.instance().pagination.getPage();
  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
  },

  printLoadBody: () => {
    let res = Template.instance().modalLoaderBody.get();
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
 * TODO: Complete Js doc
 * @param deliveredBy
 */
  customerNameHelp: (cardCode) => {
    let custAr = Template.instance().customerUserDetail.get();
    if (custAr) {
      return custAr.find(x => x.cardCode === cardCode).cardName;
    }
  },
  /**
* TODO:Complete JS doc
*/
  routeList: function () {
    return Template.instance().routeCodeList.get();
  },
  /**
 * get vansale user name
 */

  custNameHelp: (cardCode) => {
    let custData = Template.instance().customerNameArray.get();
    if (custData) {
      let res = custData.find(x => x.cardCode === cardCode);
      if (res) {
        return res.cardName;
      }
    }
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
    return Template.instance().routeExportData.get();
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
    let res = moment(docDate).format('DD-MM-YYYY hh:mm A');
    return res.toString();
  },
  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
  },


  /**
  * get assigned data
  */
  assignedData: () => {
    return Template.instance().assignedHistoryData.get();
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
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.noTransactionReport.events({
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
    let managerBranch = Session.get("managerBranch");
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let routeCode = event.target.selectRouteName.value;
    let branch = event.target.selectBranchFilter.value;
    let salesPerson = event.target.selectSalesPerson.value;
    if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch === '' && salesPerson === '') {
      Template.instance().pagination.settings.set('filters', {
        routeId: routeCode,
        transactionDone: false
      });
    }
    else if (routeCode === '' && isNaN(fromDate) && isNaN(toDate) && branch && salesPerson === '') {
      Template.instance().pagination.settings.set('filters', {
        branch: branch,
        transactionDone: false
      });
    }
    else if (routeCode === '' && isNaN(fromDate) && isNaN(toDate) && branch === '' && salesPerson) {
      Template.instance().pagination.settings.set('filters', {
        assignedTo: salesPerson,
        transactionDone: false
      });
    }
    else if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch && salesPerson === '') {
      Template.instance().pagination.settings.set('filters', {
        routeId: routeCode,
        branch: branch,
        transactionDone: false
      });
    }
    else if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch === '' && salesPerson) {
      Template.instance().pagination.settings.set('filters', {
        routeId: routeCode,
        assignedTo: salesPerson,
        transactionDone: false
      });
    }
    else if (routeCode === '' && isNaN(fromDate) && isNaN(toDate) && branch && salesPerson) {
      Template.instance().pagination.settings.set('filters', {
        branch: branch,
        assignedTo: salesPerson,
        transactionDone: false
      });
    }
    else if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch && salesPerson) {
      Template.instance().pagination.settings.set('filters', {
        branch: branch,
        assignedTo: salesPerson,
        routeId: routeCode,
        transactionDone: false
      });
    }
    else if (fromDate && isNaN(toDate) && routeCode === '' && branch === '' && salesPerson === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: fromDate
        }, transactionDone: false
      });
    }
    else if (toDate && isNaN(fromDate) && routeCode === '' && branch === '' && salesPerson === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: toDate
        }, transactionDone: false
      });
    }

    else if (fromDate && toDate && routeCode === '' && branch === '' && salesPerson === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          }, transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          }, transactionDone: false
        });
      }
    }
    else if (routeCode && toDate && fromDate && branch === '' && salesPerson === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          routeId: routeCode,
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          routeId: routeCode,
          transactionDone: false
        });
      }
    }
    else if (routeCode === '' && toDate && fromDate && branch && salesPerson === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          branch: branch,
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          branch: branch,
          transactionDone: false
        });
      }
    }
    else if (routeCode === '' && toDate && fromDate && branch === '' && salesPerson) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: salesPerson,
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: salesPerson,
          transactionDone: false
        });
      }
    }
    else if (routeCode && toDate && fromDate && branch && salesPerson === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          routeId: routeCode,
          branch: branch,
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          routeId: routeCode,
          branch: branch,
          transactionDone: false
        });
      }
    }
    else if (routeCode && toDate && fromDate && branch === '' && salesPerson) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          routeId: routeCode,
          assignedTo: salesPerson,
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          routeId: routeCode,
          assignedTo: salesPerson,
          transactionDone: false
        });
      }
    }
    else if (routeCode === '' && toDate && fromDate && branch && salesPerson) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          branch: branch,
          assignedTo: salesPerson,
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          branch: branch,
          assignedTo: salesPerson,
          transactionDone: false
        });
      }
    }
    else if (routeCode && toDate && fromDate && branch && salesPerson) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          branch: branch,
          routeId: routeCode,
          assignedTo: salesPerson,
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          branch: branch,
          routeId: routeCode,
          assignedTo: salesPerson,
          transactionDone: false
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
    $("#selectRouteName").val('').trigger('change');
    $("#selectSalesPerson").val('').trigger('change');
    $("#selectBranchFilter").val('').trigger('change');
    Template.instance().pagination.settings.set('filters', {
      transactionDone: false
    });
    $('form :input').val("");
  },
  /**
      * TODO:Complete JS doc
      * @param event
      */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set(true);
    template.itemsDetailsList.set('');
    template.assignedHistoryData.set('');
    template.routeUpdatedData.set('');
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let routeCode = $('#detailrouteCode');
    let routeName = $('#detailrouteName');
    let description = $('#detailDescription');
    let dateVal = $('#detailDate');
    let detailStatus = $('#detailStatus');
    let detailBranch = $('#detailBranch');
    let detailedAssignedBy = $('#detailedAssignedBy');
    let detailedAssignedTo = $('#detailedAssignedTo');
    let detailedAssigneeRemark = $('#detailedAssigneeRemark');
    let detailedAssignedDate = $('#detailedAssignedDate');
    let detailDateEnd = $('#detailDateEnd');
    $('#orderDetailPage').modal();
    Meteor.call('routeAssign.noSalesReport', id, (err, res) => {
      if (!err) {
        $(header).html('Details of Customer With No Sales');
        $(routeCode).html(res.routeGrpRes.routeCode);
        $(routeName).html(res.routeGrpRes.routeName);
        $(description).html(res.routeGrpRes.description);
        $(detailedAssignedBy).html(res.assignedByName);
        $(detailedAssignedTo).html(res.assignedToName);
        $(detailedAssigneeRemark).html(res.routeAssignRes.remarks);
        if (res.routeAssignRes.assignedAt !== '') {
          $(detailedAssignedDate).html(moment(res.routeAssignRes.assignedAt).format('DD-MM-YYYY hh:mm A'));
        }
        else {
          $(detailedAssignedDate).html('');
        }
        $(dateVal).html(res.routeAssignRes.routeDate);
        $(detailDateEnd).html(res.routeAssignRes.routeDateEnd);
        if (res.branchName !== undefined) {
          $(detailBranch).html(res.branchName);
        }
        else {
          $(detailBranch).html('');
        }
        $(detailStatus).html(res.routeAssignRes.routeStatus);
        template.modalLoader.set(false);
        template.itemsDetailsList.set(res.customerDetailsArray);
        template.routeUpdatedData.set(res.routeUpdatesArray);
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
  'submit .exportByDate': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().routeExportData.get();
    if (exportData.length === 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#exportButtons").prop('disabled', true);
      $("#routeReportExportPage").modal('hide');
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

            saveAs(file, "Customer With No Sales Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('form :input').val("");
      }, 5000);
    }
  },

  /**
   * TODO:CompleteJS doc
   */
  'change .startDate': () => {
    $(".endDate").val('');
    $(".endDate").attr("disabled", false);
  },
  /**
   * TODO:CompleteJS doc
   */
  'change .endDate': (event, template) => {
    let startDate = $('.startDate').val();
    let endDate = $('.endDate').val();
    $('.mainLoader').css('display', 'block');
    let dateOne = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    toDate.setDate(toDate.getDate() + 1);
    template.modalLoader.set(false);
    if(endDate !=='')
    {
    if (startDate.toString() !== 'Invalid Date') {
      template.modalLoader.set(true);
      console.log("fromDate", fromDate);
      console.log("toDate", toDate);
      Meteor.call('routeAssign.exportNoSales', fromDate, toDate, (err, res) => {
        if (!err) {
          template.routeExportData.set(res);
          template.modalLoader.set(false);
          console.log("ress", res);
          if (res.length === 0) {
            toastr["error"]('No Records Found');
          }
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
    else {
      template.modalLoader.set(false);
      $(window).scrollTop(0);
      $("#startDateSpan").html('<font color="#fc5f5f" size="2">Please select a valid date</font>');
      setTimeout(function () {
        $('#startDateSpan').delay(5000).fadeOut('slow');
      }, 5000);
      $('.mainLoader').css('display', 'none');
    }
  }
  },
  /**
   * TODO:Complete JS doc
   */

  'click .exportClose': (event, template) => {
    $('form :input').val("");
    $('#startDateSpan').html('');
    template.routeExportData.set('');
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');

  },
  /**
    * TODO:Complete JS doc
    */
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.routeExportData.set('');
  },
  // /**
  //  * TODO:Complete JS doc
  //  * @param event 
  //  */
  // 'submit .exportByDate': (event) => {
  //   event.preventDefault();

  //   let uri = 'data:application/vnd.ms-excel;base64,',
  //     template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
  //     base64 = function (s) {
  //       return window.btoa(unescape(encodeURIComponent(s)))
  //     },
  //     format = function (s, c) {
  //       return s.replace(/{(\w+)}/g, function (m, p) {
  //         return c[p];
  //       });
  //     }
  //   let toExcel = document.getElementById("exportTodayOrder").innerHTML;
  //   let ctx = {
  //     worksheet: name || 'Excel',
  //     table: toExcel
  //   };
  //   //return a promise that resolves with a File instance
  //   function urltoFile(url, filename, mimeType) {
  //     return (fetch(url)
  //       .then(function (res) { return res.arrayBuffer(); })
  //       .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
  //     );
  //   };

  //   //Usage example:
  //   urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
  //     .then(function (file) {

  //       saveAs(file, "Order Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
  //     });

  //   $('#routeReportExportPage').modal('hide');
  //   $('form :input').val("");
  //   $('#startDateSpan').html('');
  //   Template.instance().routeExportData.set('');
  //   $(".endDate").attr("disabled", true);
  //   $('.mainLoader').css('display', 'none');
  // },

  /**
     * TODO: Complete JS doc
     */
  'click .close': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set(false);
    $('.loadersSpin').css('display', 'none');
  },
  /**
     * TODO: Complete JS doc
     */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set(false);
    $('.loadersSpin').css('display', 'none');
  },
});