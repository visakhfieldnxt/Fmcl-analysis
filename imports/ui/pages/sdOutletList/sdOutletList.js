/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor'
import { Outlets } from "../../../api/outlets/outlets";
Template.sdOutletList.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  this.pagination = new Meteor.Pagination(Outlets, {
    filters: {
      createdBy: Meteor.userId()
    },
    sort: { createdAt: -1 },
    fields: {
      name: 1, address: 1, contactPerson: 1, outletType: 1, outletClass: 1,
      routeId: 1, username: 1, approvalStatus: 1, createdAt: 1
    },
    perPage: 20
  });
  this.outletId = new ReactiveVar();
  this.outletListsAp1 = new ReactiveVar();
  this.routeListAp = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.approvalData = new ReactiveVar();
});
Template.sdOutletList.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  /**
   * active and inactive list based on nav bar
   */
  if (Meteor.user()) {
    Meteor.call('outlet.sdUseWiseList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.outletListsAp1.set(res);
      };
    });
    Meteor.call('routeGroup.assignedList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.routeListAp.set(res);
      };
    });
  }

  $('.selectOutletSe1').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutletSe1").parent(),
  });

  $('.selectRouteSe1').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteSe1").parent(),
  });
  $('.typeVal').select2({
    placeholder: "Select Outlet Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".typeVal").parent(),
  });
  $('.classVal').select2({
    placeholder: "Select Outlet Class",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".classVal").parent(),
  });

});
Template.sdOutletList.helpers({
  //   printLoad: () => {
  //   return Template.instance().modalLoader.get();
  // },
  /**
* TODO: Complete JS doc
* @returns {any | *}
*/
  isReady: function () {
    return Template.instance().pagination.ready();
  },
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
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },/**
  * TODO: Complete JS doc
  * @returns {*}
  */
  outletList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
     * 
     * @param {*} arrays 
     * @returns check not found condition
     */
  lenthCheck: (arrays) => {
    if (arrays !== undefined && arrays.length > 0) {
      return true;
    }
    else {
      return false;
    }
  },
  statCheck: (routeStatus) => {
    if (routeStatus === 'Pending') {
      return '<span class="blueStatus"><span class="blueDot"></span>Pending</span>'
    }
    else if (routeStatus === 'Approved') {
      return '<span class="greenStatus"><span class="greenDot"></span>Approved</span>'
    }
    else if (routeStatus === 'Rejected') {
      return '<span class="redStatus"><span class="redDot"></span>Rejected</span>'
    }
    else if (routeStatus === 'On Hold') {
      return '<span class="orangeStatus"><span class="orangeDot"></span>On Hold</span>'
    }
    else {
      return '';
    }
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
  outletLisAp1: function () {
    return Template.instance().outletListsAp1.get();

  },
  routeListsAp: function () {
    return Template.instance().routeListAp.get();

  },
  /**
   * 
   * @returns get approval data
   */
  getApprovalDetails: () => {
    return Template.instance().approvalData.get();
  },
  getActiveStatus: (status) => {
    if (status === "Y") {
      return 'Active';
    }
    else {
      return 'Inactive';
    }
  },
  /**
 * TODO: Complete JS doc
 * @returns {*}
 */
  activeHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "Y") {
      return true;
    }
    else {
      return false
    }
  },
  /**
* TODO:Complete JS doc
* @param docDate
*/
  dateHelp: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY hh:mm A');
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  inactiveHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "N") {
      return true;
    }
    else {
      return false
    }
  },
  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  }
});

Template.sdOutletList.events({
  /** 
 * TODO:Complete JS doc
 * @param event
 */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    // template.modalLoader.set('');
    template.outletId.set(id);
    template.approvalData.set('');
    let header = $('#outletH');
    let outletName = $('#outletNames');
    let outletAddress = $('#outletAddress');
    let outletContactno = $('#outletContactno');
    let outletCperson = $('#outletCperson');
    let outletemailId = $('#outletemailId');
    let outletremark = $('#outletremark');
    let outletrouteId = $('#outletrouteId');
    let outletapprovalstatus = $('#outletapprovalstatus');
    let outletapDate = $('#outletapDate');
    let outletapBy = $('#outletapBy');
    let outletapRemark = $('#outletapRemark');
    let outletTypes = $('#outletTypes');
    let outletClass = $('#outletClass');
    $('#outletDetailPage').modal();
    template.modalLoader.set(true);
    Meteor.call('outlet.outletData', id, (error, res) => {
      if (!error) {
        template.modalLoader.set(false);
        let outlet = res.outletsLi;
        template.outletId.set(id);
        $(header).html('Details of ' + outlet.name);
        $(outletName).html(outlet.name);
        $(outletAddress).html(outlet.address);
        $(outletemailId).html(outlet.emailId);
        $(outletTypes).html(outlet.outletType);
        $(outletClass).html(outlet.outletClass);
        $(outletremark).html(outlet.remark);
        $(outletrouteId).html(res.routeName);
        $(outletapprovalstatus).html(outlet.approvalStatus);
        if (outlet.approvedDate) {
          $(outletapDate).html(moment(outlet.approvedDate).format('DD-MM-YYYY hh:mm A'));
        }
        else {
          $(outletapDate).html('');
        }
        $(outletapBy).html(res.userName);
        if (outlet.approvalRemark !== undefined && outlet.approvalRemark !== '') {
          $(outletapRemark).html(outlet.approvalRemark);
        } else {
          $(outletapRemark).html('');
        }
        if (outlet.contactNo !== undefined && outlet.contactNo !== '') {
          $(outletContactno).html(outlet.contactNo);
        } else {
          $(outletContactno).html('');
        }
        if (outlet.contactPerson !== undefined && outlet.contactPerson !== '') {
          $(outletCperson).html(outlet.contactPerson);
        } else {
          $(outletCperson).html('');
        }
        if (outlet.approvalStatus === 'Approved') {
          template.approvalData.set(res);
        }
        else {
          template.approvalData.set('');
        }

        if (outlet.insideImage) {
          $("#attachment1").attr('style', 'display:block');
          $("#attachment1").attr('src', outlet.insideImage);
        }
        else {
          $("#attachment1").attr('src', '');
          $("#insideImgDiv").val('');
        }

        if (outlet.outsideImage) {
          $("#attachment2").attr('style', 'display:block');
          $("#attachment2").attr('src', outlet.outsideImage);
        }
        else {
          $("#attachment2").attr('src', '');
          $("#ousideImgDiv").val('');
        }


        $(document).ready(function () {
          $('.attachment').click(function () {
            let src = $(this).attr('src');
            $('#fullScreen').css({
              background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
              backgroundSize: 'contain',
              width: '100%', height: '100%',
              position: 'fixed',
              zIndex: '10000',
              top: '0', left: '0',
              cursor: 'zoom-out'
            });
            $('#fullScreen').fadeIn();
          });
          $('#fullScreen').click(function () {
            $(this).fadeOut();
          });
        });
      }
    });

  },
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .outletFilterap': (event) => {
    event.preventDefault();
    let outlet = event.target.selectOutletSe1.value;
    let route = event.target.selectRouteSe1.value;
    let typeVal = event.target.typeVal.value;
    let classVal = event.target.classVal.value;

    if(outlet && route==='' && typeVal==='' && classVal===''){
       Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          createdBy: Meteor.userId()
        });
    }else if(outlet==='' && route && typeVal==='' && classVal===''){
      Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          createdBy: Meteor.userId()
        });
    }else if(outlet==='' && route==='' && typeVal && classVal===''){
      Template.instance().pagination.settings.set('filters',
        {
          outletType:typeVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet==='' && route==='' && typeVal==='' && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet && route && typeVal==='' && classVal===''){
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          routeId: route, 
          createdBy: Meteor.userId()
        });
    }else if(outlet && route==='' && typeVal && classVal===''){
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet, 
          outletType:typeVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet && route==='' && typeVal==='' && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet==='' && route && typeVal && classVal===''){
      Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          outletType:typeVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet==='' && route && typeVal==='' && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet==='' && route==='' && typeVal && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          outletType:typeVal,
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet && route && typeVal && classVal===''){
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          routeId: route, 
          outletType:typeVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet && route && typeVal==='' && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          routeId: route, 
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet==='' && route && typeVal && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          routeId: route, 
          outletType:typeVal,
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet && route==='' && typeVal && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          outletType:typeVal,
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else if(outlet && route && typeVal && classVal){
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          routeId: route, 
          outletType:typeVal,
          outletClass:classVal,
          createdBy: Meteor.userId()
        });
    }else{
      Template.instance().pagination.settings.set('filters',
        {
          createdBy: Meteor.userId()
        });
    }
    
  },
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      createdBy: Meteor.userId()
    });
    $('form :input').val("");
    $('#selectOutletSe1').val('').trigger('change');
    $('#selectRouteSe1').val('').trigger('change');
    $('#typeVal').val('').trigger('change');
    $('#classVal').val('').trigger('change');
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

  /**
* TODO: Complete JS doc
* 
*/
  'click .activeFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "Y"
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "N"
    });
  },
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#outletHeader');
    let outletName = $('#confoutletName');
    let outletNameDup = $('#outletNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#outletDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let outletname = $('#outletName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(outletname));
    $(outletName).html(outletname);
    $(outletNameDup).html(outletname);
    $(confirmedUuid).val(_id);
  },  /**
  * TODO: Complete JS doc
  * @param event
  */
  'click #outletRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('outlet.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#outletSuccessModal').modal();
          $('#outletSuccessModal').find('.modal-body').text('outlet inactivated successfully');
        }
        $("#outletDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#outletHeaders');
    let outletName = $('#confoutletNames');
    let outletNameDup = $('#outletNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#outletActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let outletname = $('#outletName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(outletname));
    $(outletName).html(outletname);
    $(outletNameDup).html(outletname);
    $(confirmedUuid).val(_id);
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click #ic-create-Outlet-button': (event, template) => {
    let channelval = Session.get("sdUserChannel");
    if (channelval === "VSR") {
      Meteor.call("routeAssign.checkRoute", Meteor.userId(), (err, res) => {
        if (!err) {
          if (res.length > 0) {
            $("#ic-create-Outlet").modal();
          }
          else {
            toastr['error']('Route Not Assigned !');
          }
        }
      });
    }
    else {
      $("#ic-create-Outlet").modal();
    }
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #outletActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('outlet.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#outletSuccessModal').modal();
          $('#outletSuccessModal').find('.modal-body').text('outlet activated successfully');
        }
        $("#outletActiveConfirmation").modal('hide');
      });
    }
  }
});