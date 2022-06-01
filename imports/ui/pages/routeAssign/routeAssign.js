/**
 * @author Nithin
 * 
 */


import { Meteor } from 'meteor/meteor';
import { RouteAssign } from '../../../api/routeAssign/routeAssign';
Template.routeAssign.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.itemsDetailsList = new ReactiveVar();
  this.orderData = new ReactiveVar();
  this.customerArray = new ReactiveVar();
  this.ordId = new ReactiveVar();
  this.totalItem = new ReactiveVar();
  this.thisId = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.customerDataArray = new ReactiveVar();
  this.routeCodeList = new ReactiveVar();
  this.vansaleUsersData = new ReactiveVar();
  this.routeAssignData = new ReactiveVar();
  this.branchEdits = new ReactiveVar();
  this.branchArrayList = new ReactiveVar();
  this.sdList = new ReactiveVar();
  this.assignedHistoryData = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.bodyLoaders = new ReactiveVar();
  this.currentData = new ReactiveVar();
  this.vanUsersFilter = new ReactiveVar();
  this.approvedData = new ReactiveVar();
  this.rejectedData = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");
  let subDistributorValue = Session.get("subDistributorValue");
  if (subDistributorValue === true) {
    this.pagination = new Meteor.Pagination(RouteAssign, {
      filters: {
        active: "Y",
        subDistributor: Meteor.userId()
      },
      sort: {
        createdAt: -1
      },
      fields: {
        routeId: 1,
        routeDate: 1,
        subDistributor: 1,
        assignedTo: 1,
        routeStatus: 1,
        active: 1,
        groupDeactivated: 1,
        _id: 1,
      },
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(RouteAssign, {
      filters: {
        active: "Y",
        // vertical: { $in: loginUserVerticals }
      },
      sort: {
        createdAt: -1
      },
      fields: {
        routeId: 1,
        routeDate: 1,
        subDistributor: 1,
        assignedTo: 1,
        routeStatus: 1,
        active: 1,
        groupDeactivated: 1
      },
      perPage: 20
    });
  }

});

Template.routeAssign.onRendered(function () {
  this.modalLoader.set(false);
  $('#bodySpinVal').css('display', 'block');
  /**
   * active and inactive list based on nav bar
   */
  $('.taskHeaderList').css('display', 'inline');
  var header = document.getElementById("taskHeader");
  if (header) {
    var btns = header.getElementsByClassName("paginationFilterValue");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("activeHeaders");
        current[0].className = current[0].className.replace(" activeHeaders", "");
        this.className += " activeHeaders";
      });
    }
  }

  Meteor.call('routeGroup.masterDataGet', (err, res) => {
    if (!err) {
      // this.vansaleUserFullList.set(res.userRes);
      this.routeCodeList.set(res.groupRes);
      this.vanUsersFilter.set(res.vanUsersFilter);
    }
  });

  /**
* TODO:Complete Js doc
* Getting user branch list
*/
  Meteor.call('branch.branchList', (err, res) => {
    if (!err) {
      this.branchArrayList.set(res);
    }
  });
  let subDistributorValue = Session.get("subDistributorValue");
  if (subDistributorValue === true) {
    if (Meteor.user()) {
      Meteor.call('user.sdUsersingleList', Meteor.userId(), (err, res) => {
        if (!err) {
          this.sdList.set(res);
        }
      });
    }
  }
  else {
    Meteor.call('user.sdUserFullList', (err, res) => {
      if (!err) {
        this.sdList.set(res);
      }
    });
  }

  // Meteor.setInterval(() => {
  //   Meteor.call('routeGroup.masterDataGet', (err, res) => {
  //     if (!err) {
  //       this.vansaleUserFullList.set(res.userRes);
  //       this.routeCodeList.set(res.groupRes);
  //       this.vanUsersFilter.set(res.vanUsersFilter);
  //     }
  //   });
  // }, 600000);
  /**
   * TODO: Complete JS doc
   */
  $('#sdUserVal').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#sdUserVal").parent(),
  });

  $('#selectAssignEmp').select2({
    placeholder: "Select Employee",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#selectAssignEmp").parent(),
  });

  $('#selectVanemp').select2({
    placeholder: "Select Employee",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#selectVanemp").parent(),
  });

  $('.selectBranchEdits').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectBranchEdits").parent(),
  });

  $('.selectPriorityEdit').select2({
    placeholder: "Select Priority",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriorityEdit").parent(),
  });

  $('.selectCustomersEdit').select2({
    placeholder: "Select Customer",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomersEdit").parent(),
  });
});
Template.routeAssign.helpers({
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
    * approved data
    */
  approvedDataGet: () => {
    return Template.instance().approvedData.get();
  },
  /**
   * approved data
   */
  rejectedDataGet: () => {
    let res = Template.instance().rejectedData.get();
    return res;
  },
  /**
   * status check
   */
  activateStatCheck: (status) => {
    if (status === false) {
      return true;
    }
    else {
      return false;
    }
  },
  sdUsersFullList: () => {
    return Template.instance().sdList.get();
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
      $(".assigneVal_" + id).attr("title", `Click to remove assignee (${result})`);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.vanUserName_' + id).html('');
      $(".assigneVal_" + id).attr("title", `Click to remove assignee`);
      $('#bodySpinVal').css('display', 'none');
    }
    );
  },
  vanUsersList: () => {
    return Template.instance().vanUsersFilter.get();
  },
  /**
 * get vansale route code
 */

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
      $(".routeValTitle_" + id).attr("title", `Click To Deactivate ${result}`);
      $(".routeValTitleDe_" + id).attr("title", `Click To Activate ${result}`);
      $('#bodySpinVal').css('display', 'none');
      $('.routeIdVals').val(result);
    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $(".routeValTitle_" + id).attr("title", `Click To Deactivate`);
      $(".routeValTitleDe_" + id).attr("title", `Click To Activate`);
      $('#bodySpinVal').css('display', 'none');
      $('.routeIdVals').val('');
    });
  },

  routeDataList: () => {
    return Template.instance().routeUpdatedData.get();

  },

  routeUpdateCheck: (status) => {
    if (status !== undefined && status === true) {
      return true;
    }
    else {
      return false;
    }

  },
  /**
 * TODO:Complete Js doc
 * For listing the item that been selected.
 * 
 */
  customerArrayList: function () {
    return Template.instance().customerArray.get();
  },
  /**
   * get branch list
   */
  branchListEdits: () => {
    let branchVal = Template.instance().branchEdits.get();
    if (branchVal) {
      Meteor.setTimeout(function () {
        if (branchVal) {
          $('#selectBranchEdits').val(branchVal).trigger('change');
        }
      }, 200);
    }
    return Template.instance().branchArrayList.get();
  },
  /**
   * 
   * display vansale users
   */
  vansaleUserList: () => {
    return Template.instance().vansaleUsersData.get();
  },


  /**
   * 
   *route assign data
   */
  assignData: () => {
    return Template.instance().routeAssignData.get();
  },
  /**
* TODO:Complete Js doc
* For listing  status 
* 
*/
  statCheck: (routeStatus) => {
    if (routeStatus === 'Not Assigned') {
      return '<span class="blueStatus"><span class="blueDot"></span>Not Assigned</span>'
    }
    else if (routeStatus === 'Pending') {
      return '<span class="orangeStatus"><span class="orangeDot"></span>Pending</span>'
    }
    else if (routeStatus === 'Assigned') {
      return '<span class="greenStatus"><span class="greenDot"></span>Assigned</span>'
    }
    else if (routeStatus === 'Completed') {
      return '<span class="redStatus"><span class="redDot"></span>Completed</span>'
    }
    else if (routeStatus === 'Rejected') {
      return '<span class="redStatus"><span class="redDot"></span>Rejected</span>'
    }
    else {
      return '';
    }
  },
  /**
* TODO:Complete Js doc
* add assignee check
* 
*/
  assigneeAddCheck: (status) => {
    if (status === 'Not Assigned') {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * * TODO:Complete Js doc
 * For listing customer filters
 * 
 */
  customerDataList: function () {
    return Template.instance().customerDataArray.get();
  },

  routeAssignLists: function () {
    let result = Template.instance().pagination.getPage(); 
    if (result.length === 0) {
      $('#bodySpinVal').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
  * TODO:Complete Js doc
  * Getting item list
  */
  routeCodeLists: function () {
    return Template.instance().routeCodeList.get();
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
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
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
   * check edit button
   */
  routeEditCheck: (status) => {
    if (status === 'Not Started') {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * check assign remove button
   */
  routeAssigneeRemove: (status) => {
    if (status === 'Assigned') {
      return true;
    }
    else {
      return false;
    }
  },

  /**
 * check activate button
 */
  activeCheck: (active) => {
    if (active === "Y") {
      return true;
    }
    else {
      return false;
    }
  },

  /**
* check deactivate button
*/
  inactiveCheck: (active) => {
    if (active === "N") {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * check route completed or not
   */
  routeCompCheck: (status) => {
    if (status === 'Completed' || status === 'Rejected') {
      return false;
    }
    else {
      return true;
    }
  },
  /**
   * get customer data
   */
  items: () => {
    return Template.instance().itemsDetailsList.get();
  },
  /**
   * get assigned data
   */
  assignedData: () => {
    return Template.instance().assignedHistoryData.get();
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
  /**
 * get vansale user name
 */

  getUserName: (user) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idName", user, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.userIdVal_' + user).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.userIdVal_' + user).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
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
* getting time for printing
*/
  printTime: () => {
    return moment(new Date).format('dddd, DD MMMM, YYYY hh:mm:ss a'); //monday 10 jun 2019 11.46.46 a.m
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
let customerArray = [];
let itemCheck = false;
itemCheckValidation = false;
let routeAssignVal = false;
Template.routeAssign.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .route-filter': (event, template) => {
    event.preventDefault();
    $('#bodySpinVal').css('display', 'block');
    let sdUser = event.target.sdUserVal.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let vanEmp = '';

    if (sdUser && isNaN(toDate) && isNaN(fromDate) && vanEmp === '') {
      Template.instance().pagination.settings.set('filters',
        {
          subDistributor: sdUser,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (sdUser === '' && isNaN(toDate) && isNaN(fromDate) && vanEmp) {
      Template.instance().pagination.settings.set('filters',
        {
          assignedTo: vanEmp,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (sdUser && isNaN(toDate) && isNaN(fromDate) && vanEmp) {
      Template.instance().pagination.settings.set('filters',
        {
          assignedTo: vanEmp,
          subDistributor: sdUser,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (fromDate && isNaN(toDate) && routeCode === '' && vanEmp === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: fromDate
        },
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else if (toDate && isNaN(fromDate) && sdUser === '' && vanEmp === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: toDate
        },
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else if (fromDate && toDate && sdUser === '' && vanEmp === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          }
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
    else if (sdUser && toDate && fromDate && vanEmp === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          subDistributor: sdUser,
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          subDistributor: sdUser,
        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
    else if (sdUser === '' && toDate && fromDate && vanEmp) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: vanEmp,
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: vanEmp,

        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
    else if (sdUser && toDate && fromDate && vanEmp) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: vanEmp,
          subDistributor: sdUser,
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: vanEmp,
          subDistributor: sdUser,
        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
      $('.taskHeaderList').css('display', 'inline');
    }
  },



  'click .viewMap': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.attributes.id.value;
    FlowRouter.go('routeWiseMap', { _id: id });
  },
  /**
   * TODO: Complete JS doc
   * for reset filter
   */
  'click .reset': (event, target) => {
    // $('#bodySpinVal').css('display', 'block');
    let subDistributorValue = Session.get("subDistributorValue");
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (subDistributorValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        subDistributor: Meteor.userId()
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        vertical: { $in: loginUserVerticals }
      });
    }
    $('#sdUserVal').val('').trigger('change');
    $('#selectVanemp').val('').trigger('change');
    $('form :input').val("");
    $('.taskHeaderList').css('display', 'inline');
    var element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    var element = document.getElementById("activeFilter");
    element.classList.add("active");
  },
  /**
   * TODO: Compelete JS doc
   * to view route create modal
   */
  'click #routeAssign-create-button': (event) => {
    $("#routeAssign-create").modal();
  },


  /**
    * TODO:Complete JS doc
    * @param event
    */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set(true);
    template.itemsDetailsList.set('');  
    template.routeUpdatedData.set('');
    template.rejectedData.set('');
    template.approvedData.set('');
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let routeCode = $('#detailrouteCode');
    let routeName = $('#detailrouteName');
    let description = $('#detailDescription');
    let dateVal = $('#detailDate');
    let detailStatus = $('#detailStatus');
    let detailedAssignedBy = $('#detailedAssignedBy');
    let detailedAssignedTo = $('#detailedAssignedTo');
    let detailedAssigneeRemark = $('#detailedAssigneeRemark');
    let detailedAssignedDate = $('#detailedAssignedDate');
    let detailDateEnd = $('#detailDateEnd');
    let detailSubDistributor = $('#detailSubDistributor');
    $('#orderDetailPage').modal();
    $(header).html('Details of Route');
    Meteor.call('routeAssign.id', id, (err, res) => {
      if (!err) {
        template.modalLoader.set(false);
        $(routeCode).html(res.routeGrpRes.routeCode);
        $(routeName).html(res.routeGrpRes.routeName);
        $(description).html(res.routeGrpRes.description);
        $(detailedAssignedBy).html(res.assignedByName);
        $(detailedAssignedTo).html(res.assignedToName);
        if (res.routeAssignRes.routeDateEnd !== undefined) {
          $(detailDateEnd).html(res.routeAssignRes.routeDateEnd);
        }
        else {
          $(detailDateEnd).html('');
        }
        $(detailedAssigneeRemark).html(res.routeAssignRes.remarks);
        if (res.routeAssignRes.assignedAt !== '') {
          $(detailedAssignedDate).html(moment(res.routeAssignRes.assignedAt).format('DD-MM-YYYY hh:mm A'));
        }
        else {
          $(detailedAssignedDate).html('');
        }
        $(dateVal).html(res.routeAssignRes.routeDate);

        $(detailStatus).html(res.routeAssignRes.routeStatus);
        template.itemsDetailsList.set(res.customerDetailsArray);
        template.routeUpdatedData.set(res.routeUpdatesArray);
        $(detailSubDistributor).html(res.subDitributorName);
      }
      else {
        template.modalLoader.set(false);
      }
    });
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
    $('#weightTotalEdit').html('');
    template.itemsDetailsList.set('');
    template.customerArray.set('');
    template.modalLoader.set(false);
    $("#submit").attr("disabled", false);
    $('#itemRemarksEdit').val('');
    $('#unitQuantityShowsEdit').html('');
    itemCheckValidation = false;
    itemCheck = false;
  },
  /**
  * TODO:Complete Js doc
  * for clear data when click close button
  */

  'click .closeEdit': (event, template) => {
    Session.set("routeIds", '');
    $("#selectCustomersEdit").val('').trigger('change');
    $('#selectPriorityEdit').val('').trigger('change');
    $('#selectBranchEdits').val('').trigger('change');
    $('#routeCodevalueEdit').val('');
    $('#routeDescripEdit').val('');
    $('#routeDateEdit').val('');
    $("#submit").attr("disabled", false);
    customerArray = [];
    template.customerArray.set('');
    $('form :input').val("");

  },

  /**
  * TODO: Complete JS doc
  * clear data when click close button
  */
  'click .closen': (event, template) => {
    template.itemsDetailsList.set('');
    template.customerArray.set('');
    template.modalLoader.set(false);
    $("#submit").attr("disabled", false);
    template.thisId.set('');
    template.orderData.set('');
    $('#printBy').html('');
    $('#approvedName').html('');
  },


  /**
  * TODO:Complete Js doc
  *Remove route
  */
  'click .remove': (event) => {
    event.preventDefault();
    let header = $('#userHeader');
    let confirmedUuid = $('#confirmedUuid');
    $('#routeDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let routeCode = $('#routeCode_' + _id).val(); 
    $(header).html(`Confirm Deactivation (${routeCode})`);
    $(confirmedUuid).val(_id);
  },
  'click #deactivateRoute': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      $("#routeDelConfirmation").modal('hide');
      Meteor.call('routeAssign.deactivate', $.trim(_id), (error) => {
        if (error) {
          $('#routeErrorModal').modal();
          $('#routeErrorModal').find('.modal-body').text("Internal error - unable to remove entry. Please try again");
        } else {
          $('#routeSuccessModal').modal();
          $('#routeSuccessModal').find('.modal-body').text('Route Deactivated Successfully');
        }
      });
    }
  },

  /**
* TODO:Complete Js doc
*Remove route
*/
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#routeHeaders');
    let confirmedUuid = $('#confirmedUuids');
    $('#routeActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let routeCode = $('#routeCode_' + _id).val();
    $(header).html(`Confirm Activation (${routeCode})`);
    $(confirmedUuid).val(_id);
  },
  'click #routeActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      $("#routeActiveConfirmation").modal('hide');
      Meteor.call('routeAssign.activate', $.trim(_id), (error) => {
        if (error) {
          $('#routeErrorModal').modal();
          $('#routeErrorModal').find('.modal-body').text("Internal error - unable to remove entry. Please try again");
        } else {
          $('#routeSuccessModal').modal();
          $('#routeSuccessModal').find('.modal-body').text('Route Activated Successfully');
        }
      });
    }
  },

  /**
* TODO: Complete JS doc
* 
*/
  'click .activeFilter': (event, template) => {
    event.preventDefault();
    $('#bodySpinVal').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinVal').css('display', 'none');
    }, 3000);
    let loginUserVerticals = Session.get("loginUserVerticals");
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        subDistributor: Meteor.userId()
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        // vertical: { $in: loginUserVerticals }
      });
    }
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    $('#bodySpinVal').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinVal').css('display', 'none');
    }, 3000);
    let loginUserVerticals = Session.get("loginUserVerticals");
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "N",
        subDistributor: Meteor.userId()
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "N",
        // vertical: { $in: loginUserVerticals }
      });
    }
  },

  /**
  * TODO:Complete JS doc
  * @param {*} event
  */
  'submit .pickUpAdd': (event) => {
    event.preventDefault();
    updatePickUp(event.target);
  },
  /**
 * TODO:Complete JS doc      
 * @param {*} event
 */
  'click .removeAssigneeButton': (event, template) => {
    let header = $('#assignedHeader');
    $('#assignDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let assignedNameDup = $('#assignedNameDup');
    let confirmedUuid = $('#confirmedUuidRemoveAssign');
    template.modalLoader.set(true);
    Meteor.call('routeAssign.assignedIdName', _id, (userError, routeRes) => {
      if (!userError) {
        template.modalLoader.set(false);
        let assignedTo = routeRes;
        $(header).html('Confirm Deletion Of Assigned- ' + assignedTo);
        $(assignedNameDup).html(assignedTo);
        $(confirmedUuid).val(_id);
      }
      else {
        template.modalLoader.set(false);
      }
    });
  },
  /**
  * TODO: Complete JS doc
  * @param event
  */
  'click #assignRemove': (event, template) => {
    event.preventDefault();
    let _id = $('#confirmedUuidRemoveAssign').val();
    if (_id && $.trim(_id)) {
      $("#assignDelConfirmation").modal('hide');
      Meteor.call('routeAssign.removeAssign', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#routeSuccessModal').modal();
          $('#routeSuccessModal').find('.modal-body').text('Assignee removed successfully');
        }
      });
    }
  },
  /**
* TODO: Compelete JS doc
* to view route assign modal
*/
  'click .routeAssignButton': (event, template) => {
    event.preventDefault();
    $("#routeAssignModal").modal();
    $('#assignRemarks').val('');
    let confirmedUuid = $('#confirmedUuidAssign');
    let _id = event.currentTarget.attributes.id.value; 
    let routeCode = $('#routeCodeGet_' + _id).val();
    $('#assignRouteHeader').html(`Assign Route ( ${routeCode} )`);
    $(confirmedUuid).val(_id);
    template.modalLoader.set(true);
    template.vansaleUsersData.set('');
    Meteor.call('routeAssign.assignedEmployeeList', _id, (err, res) => {
      if (!err) {
        template.vansaleUsersData.set(res.userRes);
        template.modalLoader.set(false);
      }
      else {
        template.vansaleUsersData.set('');
        template.modalLoader.set(false);
      }
    })
  },
  /**
* TODO: Compelete JS doc
* submit route assign
*/
  'submit .assignEmployeeDetails': (event, template) => {
    event.preventDefault();
    let _id = $('#confirmedUuidAssign').val();
    let employeename = '';
    $('#selectAssignEmp').find(':selected').each(function () {
      employeename = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    let remarks = $('#assignRemarks').val();
    if (routeAssignVal === true) {
      toastr['error'](`Route already assigned !`);
    }
    else {
      if (_id && $.trim(_id)) {
        $("#routeAssignModal").modal('hide');
        Meteor.call('routeAssign.reAssignEmployee', $.trim(_id), employeename, remarks, loginUserVerticals, (error) => {
          if (error) {
            $('#routeErrorModal').modal();
            $('#routeErrorModal').find('.modal-body').text("Internal error - unable to remove entry. Please try again");
          } else {
            $('#routeSuccessModal').modal();
            $('#routeSuccessModal').find('.modal-body').text('Route Assigned Successfully');
          }
        });
      }
    }
  },
  /**
   * route assign check 
   */

  'change .selectAssignEmp': (event, template) => {
    event.preventDefault();
    let _id = $('#confirmedUuidAssign').val();
    let user = '';
    routeAssignVal = false;
    $('#selectAssignEmp').find(':selected').each(function () {
      user = $(this).val();
    });
    if (user !== '' && user !== 'Select Employee') {
      template.modalLoader.set(true);
      Meteor.call('routeAssign.routeReAssignCheck', _id, user, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          if (res.routeAssign === true) {
            routeAssignVal = true;
            toastr['error'](`Route already assigned to ${res.assignedByName} !`);
          }
          else {
            routeAssignVal = false;
          }
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
  },
});



// function setMapOnAll(map) {
//   for (let i = 0; i < markers.length; i++) {
//     markers[i].setMap(map);
//   }
// }

// async routeCodeHelp(id) {
  // return await Meteor.call("routeGroup.idRouteCode", id, (error, result) => {
  //   if (!error) {
  //     $('.routeCodeVal_' + id).html(result);
  //   }
  //   else {
  //     $('.routeCodeVal_' + id).html('');
  //   }
  // }); 
// },

/**
 *   async vanUserName(id) {
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
    }
    );
    promiseVal.catch((error) => {
      $('.vanUserName_' + id).html('');
    }
    );
  },
 *
 *
 *
 */





