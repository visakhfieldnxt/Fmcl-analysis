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
  this.routeUpdatesArry = new ReactiveVar();
  this.custAddressArray = new ReactiveVar();
  let managerBranch = Session.get("managerBranch");
  this.pagination = new Meteor.Pagination(RouteAssign, {
    sort: {
      noTransactionUpdated: -1
    },
    filters: {
      transactionDone: false,
      branch: { $in: managerBranch }
    },
    perPage: 25
  });
});
Template.noTransactionReport.onRendered(function () {
  $('#bodySpinVal').css('display', 'block');
  /**
* TODO:Complete Js doc
* Getting vansale user list
*/
let vansaleRoles = Session.get("vansaleRoles");
  Meteor.call('routeGroup.masterDataForReportsNew',vansaleRoles, (err, res) => {
    if (!err) {
      this.routeCodeList.set(res.groupRes);
      this.vansaleUserFullList.set(res.vanUsersFilter);
    }
  });
  Meteor.call('branch.branchList', (err, res) => {
    if (!err) {
      this.branchNameArray.set(res);
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
  $('#selectBranchNameExport').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectBranchNameExport").parent(),
  });
  $('#selectVanempExport').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectVanempExport").parent(),
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

  branchList: () => {
    return Template.instance().branchNameArray.get();
  },
  routeCodeHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.idRouteCode", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.routeCodeVal_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.routeCodeVal_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
  },

  /**
  * get outlet count
  */

  totalCust: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.noTransactionCounts", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletCount_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.outletCount_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
  },
  /**
  * get vansale route name
  */

  routeNameHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.idRouteName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.routeVal_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    });
  },
  /**
  * get vansale route branch name
  */

  routeBranchHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.idBranchDetails", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.branchVal_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.branchVal_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    });
  },


  /**
  * get vansale user name
  */

  vanUserName: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.vanUserName_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.vanUserName_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
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
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinVal').css('display', 'none');
    }
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
     * get customer address
     */
  addressNameGetHelp: (customer, route, id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.custAddress", customer, route, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.custAdd_' + id).html(result);
      $('#loadersSpinPromise').css('display', 'none');
    }
    ).catch((error) => {
      $('.custAdd_' + id).html('');
      $('#loadersSpinPromise').css('display', 'none');
    }
    );
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
        transactionDone: false,
        branch: { $in: managerBranch }
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
        transactionDone: false, branch: { $in: managerBranch }
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
        transactionDone: false, branch: { $in: managerBranch }
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
        }, transactionDone: false, branch: { $in: managerBranch }
      });
    }
    else if (toDate && isNaN(fromDate) && routeCode === '' && branch === '' && salesPerson === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: toDate
        }, transactionDone: false, branch: { $in: managerBranch }
      });
    }

    else if (fromDate && toDate && routeCode === '' && branch === '' && salesPerson === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          }, transactionDone: false, branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          }, transactionDone: false, branch: { $in: managerBranch }
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
          transactionDone: false, branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          routeId: routeCode,
          transactionDone: false, branch: { $in: managerBranch }
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
          assignedTo: salesPerson, branch: { $in: managerBranch },
          transactionDone: false
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: salesPerson, branch: { $in: managerBranch },
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
          transactionDone: false, branch: { $in: managerBranch }
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
          transactionDone: false, branch: { $in: managerBranch }
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
    let managerBranch = Session.get("managerBranch");
    Template.instance().pagination.settings.set('filters', {
      transactionDone: false,
      branch: { $in: managerBranch }
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
    $('.loadersSpinPromise').css('display', 'block');
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
        if (res.customerDetailsArray.length === 0) {
          $('.loadersSpinPromise').css('display', 'none');
        }
        template.routeUpdatedData.set(res.routeUpdatesArray);
        if (res.routeUpdatesArray.length === 0) {
          $('.loadersSpinPromise').css('display', 'none');
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
  'change .startDate': (event, template) => {
    $(".endDate").attr("disabled", false);
    $('.endDate').val('');
    template.routeExportData.set('');
  },
  'change #selectBranchNameExport': (event, template) => {
    $('#selectVanempExport').val('').trigger('change');
    $('.startDate').val('');
    $('.endDate').val('');
    template.routeExportData.set('');
  },

  'change #selectVanempExport': (event, template) => {
    $('.startDate').val('');
    $('.endDate').val('');
    template.routeExportData.set('');
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
    let salesman = '';
    $('#selectVanempExport').find(':selected').each(function () {
      salesman = $(this).val();
    });
    let branch = '';
    $('#selectBranchNameExport').find(':selected').each(function () {
      branch = $(this).val();
    });
    template.routeExportData.set('');
    let managerBranch = Session.get("managerBranch");
    if (endDate !== '') {
      if (startDate.toString() !== 'Invalid Date') {
        template.modalLoader.set(true);
        console.log("fromDate", fromDate);
        console.log("toDate", toDate);
        Meteor.call('routeAssign.exportNoSales', fromDate, toDate,managerBranch,salesman,branch, (err, res) => {
          if (!err) {
            template.routeExportData.set(res);
            template.modalLoader.set(false);
            console.log("ress", res);
            if (res.length === 0) {
              setTimeout(function () {
                $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
              }, 0);
              setTimeout(function () {
                $('#emptyDataSpan').fadeOut('slow');
              }, 3000);
            }
            else {
              setTimeout(function () {
                $("#emptyDataSpan").html('<style> #emptyDataSpans { color:#2ECC71 }</style><span id ="emptyDataSpans">Records are ready for export.</span>').fadeIn('fast');
              }, 0);
              setTimeout(function () {
                $('#emptyDataSpan').fadeOut('slow'); 
              }, 3000);
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
        $('#selectVanempExport').val('').trigger('change');
        $('#selectBranchNameExport').val('').trigger('change');
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
    $('#selectVanempExport').val('').trigger('change');
    $('#selectBranchNameExport').val('').trigger('change');
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
    $('#selectVanempExport').val('').trigger('change');
    $('#selectBranchNameExport').val('').trigger('change');
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
