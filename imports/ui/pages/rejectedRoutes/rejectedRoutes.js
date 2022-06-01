/**
 * @author Nithin
 * 
 */


import { Meteor } from 'meteor/meteor';
import { RouteAssign } from '../../../api/routeAssign/routeAssign';
let dateValueCheck = new Date();
Template.rejectedRoutes.onCreated(function () {
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
  this.vansaleUserFullList = new ReactiveVar();
  this.assignedHistoryData = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.bodyLoaders = new ReactiveVar();
  this.currentData = new ReactiveVar();
  this.vanUsersFilter = new ReactiveVar();
  this.routeIdGet = new ReactiveVar();
  this.pagination = new Meteor.Pagination(RouteAssign, {
    filters: {
      active: "Y",
      approvalCheck: true,
      routeStatus: 'Rejected'
    },
    sort: {
      createdAt: -1
    },
    fields:{routeId:1,
      routeDate:1,
      routeDateEnd:1,
      assignedTo:1,
      routeStatus:1},
    perPage: 20
  });

});

Template.rejectedRoutes.onRendered(function () {
  this.modalLoader.set(false);
  this.bodyLoaders.set(true);

  Meteor.call('routeGroup.masterDataGet', (err, res) => {
    if (!err) {
      this.vansaleUserFullList.set(res.userRes);
      this.routeCodeList.set(res.groupRes);
      this.vanUsersFilter.set(res.vanUsersFilter);
      this.bodyLoaders.set(false);
    }
    else {
      this.bodyLoaders.set(false);
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
  /**
   * TODO:Complete Js doc
   * Getting customer list
   */
  Meteor.call('customer.customerRouteData', (err, res) => {
    if (!err)
      this.customerNameArray.set(res);
  });

  Meteor.setInterval(() => {
    Meteor.call('routeGroup.masterDataGet', (err, res) => {
      if (!err) {
        this.vansaleUserFullList.set(res.userRes);
        this.routeCodeList.set(res.groupRes);
        this.vanUsersFilter.set(res.vanUsersFilter);
      }
    });
  }, 600000);
  /**
   * TODO: Complete JS doc
   */
  $('#routeCodeVal').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#routeCodeVal").parent(),
  });

  $('#routeStatus').select2({
    placeholder: "Select Status",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#routeStatus").parent(),
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
Template.rejectedRoutes.helpers({
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
  /**
   * get vansale user name
   */

  vanUserName: (id) => {
    let userData = Template.instance().vansaleUserFullList.get();
    if (userData) {
      let res = userData.find(x => x._id === id);
      if (res) {
        return `${res.profile.firstName} ${res.profile.lastName}`;
      }
    }
  },
  vanUsersList: () => {
    return Template.instance().vanUsersFilter.get();
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

  orders: function () {
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
    if (status === 'Completed') {
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
Template.rejectedRoutes.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .route-filter': (event, template) => {
    event.preventDefault();
    let routeCode = event.target.routeCodeVal.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let vanEmp = event.target.selectVanemp.value;
    if (routeCode && isNaN(toDate) && isNaN(fromDate) && vanEmp === '') {
      Template.instance().pagination.settings.set('filters',
        {
          routeId: routeCode,
          approvalCheck: true,
          routeStatus: 'Rejected'
        }
      );
    }
    else if (routeCode === '' && isNaN(toDate) && isNaN(fromDate) && vanEmp) {
      Template.instance().pagination.settings.set('filters',
        {
          assignedTo: vanEmp,
          approvalCheck: true,
          routeStatus: 'Rejected'
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (routeCode && isNaN(toDate) && isNaN(fromDate) && vanEmp) {
      Template.instance().pagination.settings.set('filters',
        {
          assignedTo: vanEmp,
          routeId: routeCode,
          approvalCheck: true,
          routeStatus: 'Rejected'
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
        approvalCheck: true,
        routeStatus: 'Rejected'
      });
    }
    else if (toDate && isNaN(fromDate) && routeCode === '' && vanEmp === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: toDate
        },
        approvalCheck: true,
        routeStatus: 'Rejected'
      });
    }
    else if (fromDate && toDate && routeCode === '' && vanEmp === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
    }
    else if (routeCode && toDate && fromDate && vanEmp === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          routeId: routeCode,
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          routeId: routeCode,
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
    }
    else if (routeCode === '' && toDate && fromDate && vanEmp) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: vanEmp,
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: vanEmp,
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
    }
    else if (routeCode && toDate && fromDate && vanEmp) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: vanEmp,
          routeId: routeCode,
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: vanEmp,
          routeId: routeCode,
          approvalCheck: true,
          routeStatus: 'Rejected'
        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
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
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
      approvalCheck: true,
      routeStatus: 'Rejected'
    });
    $('#routeCodeVal').val('').trigger('change');
    $('#selectVanemp').val('').trigger('change');
    $('form :input').val("");
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
    template.routeAssignData.set('');
    template.assignedHistoryData.set('');
    template.routeUpdatedData.set('');
    template.routeIdGet.set('');
    let id = event.currentTarget.id;
    template.routeIdGet.set(id);
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
    let detailApprovedName = $('#detailApprovedName');
    let detailApprovedDate = $('#detailApprovedDate');
    let detailApprovedRemark = $('#detailApprovedRemark');
    $('#orderDetailPage').modal();
    Meteor.call('routeAssign.id', id, (err, res) => {
      if (!err) {
        $(header).html('Details of Route');
        $(routeCode).html(res.routeGrpRes.routeCode);
        $(routeName).html(res.routeGrpRes.routeName);
        $(description).html(res.routeGrpRes.description);
        $(detailedAssignedBy).html(res.assignedByName);
        $(detailedAssignedTo).html(res.assignedToName);
        $(detailApprovedName).html(res.rejectedName);
        $(detailApprovedDate).html(moment(res.routeAssignRes.rejectedDate).format('DD-MM-YYYY hh:mm A'));
        $(detailApprovedRemark).html(res.routeAssignRes.statusRemarks);
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
          $('#routeStatusSuccessModal').modal();
          $('#routeStatusSuccessModal').find('.modal-body').text('Route Deactivated Successfully');
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
          $('#routeStatusSuccessModal').modal();
          $('#routeStatusSuccessModal').find('.modal-body').text('Route Activated Successfully');
        }
      });
    }
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
    Meteor.call('routeAssign.id', _id, (userError, routeRes) => {
      if (!userError) {
        template.modalLoader.set(false);
        let assignedTo = routeRes.assignedToName;
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
          $('#routeStatusSuccessModal').modal();
          $('#routeStatusSuccessModal').find('.modal-body').text('Assignee removed successfully');
        }
      });
    }
  },



  /**
* TODO: Complete JS doc
* @param event
* for updating quotation status
*/
  'submit .statusUpdate': (event, template) => {
    event.preventDefault();
    let target = event.target;
    $("#orderDetailPage").modal('hide');
    let routeIdGet = Template.instance().routeIdGet.get();
    let status = target.routeStatus.value;
    let remarks = target.remark.value;
    if (status === 'approved') {
      Meteor.call('routeAssign.approved', routeIdGet, remarks, (error) => {
        if (error) {
          $('#message').html("Internal error - unable to approve entry. Please try again");
          template.routeIdGet.set('');
          // $("#orderDetailPage").modal('hide');
          $('#routeStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
          $('.loadersSpin').css('display', 'none');
        } else {
          // $("#orderDetailPage").modal('hide');
          $('#routeStatusSuccessModal').find('.modal-body').text('Route Status Updated Successfully');
          $('#routeStatusSuccessModal').modal();
          template.routeIdGet.set('');
          $('#routeStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
          $('.loadersSpin').css('display', 'none');
        }

      });
    }
    else if (status === 'rejected') {
      Meteor.call('routeAssign.Statusupdates', routeIdGet, remarks, (error) => {
        if (error) {
          $('#message').html("Internal error - unable to approve entry. Please try again");
          template.routeIdGet.set('');
          $('#routeStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
          $('.loadersSpin').css('display', 'none');
        } else {

          $("#orderDetailPage").modal('hide');
          $('#routeStatusSuccessModal').find('.modal-body').text('Route Status Updated Successfully');
          $('#routeStatusSuccessModal').modal();
          template.routeIdGet.set('');
          $('#routeStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
          $('.loadersSpin').css('display', 'none');
        }
      });
    }
  },

});




