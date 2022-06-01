/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor'
import { Outlets } from "../../../api/outlets/outlets";
Template.outletMaster.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  this.pagination = new Meteor.Pagination(Outlets, {
    filters: {
      active: "Y",
      subDistributor: Meteor.userId()
    },
    sort: { createdAt: -1 },
    fields: {
      name: 1, address: 1, contactPerson: 1, outletType: 1,
      outletClass: 1, routeId: 1, username: 1,
       approvalStatus: 1, active: 1, createdAt: 1
    },
    perPage: 20
  });
  this.outletId = new ReactiveVar();
  this.outletListsAp1 = new ReactiveVar();
  this.routeListAp = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.routeIdEdit = new ReactiveVar();
  this.approvalData = new ReactiveVar();
});
Template.outletMaster.onRendered(function () {
  this.routeIdEdit.set('');
  /**
   * active and inactive list based on nav bar
   */
  $('.taskHeaderList').css('display', 'inline');
  $('#bodySpinVal').css('display', 'block');
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
  Meteor.call('outlet.outletFullList1', (err, res) => {
    if (!err) {
      this.outletListsAp1.set(res);
    };
  });
  Meteor.call('routeGroup.subDList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.routeListAp.set(res);
    };
  });

  $('.selectOutletSe1').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutletSe1").parent(),
  });

  $('.selectRouteUpdate').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteUpdate").parent(),
  });

  $('.selectRouteSe1').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteSe1").parent(),
  });

});
Template.outletMaster.helpers({
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
      $('#bodySpinVal').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
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
    let routeIds = Template.instance().routeIdEdit.get();
    if (routeIds) {
      Meteor.setTimeout(function () {
        $('#selectRouteUpdate').val(routeIds).trigger('change');
      }, 100);
    }
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

Template.outletMaster.events({
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
    let outletName = $('#outletName');
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
        $(outletremark).html(outlet.remark);
        $(outletrouteId).html(res.routeName);
        $(outletTypes).html(outlet.outletType);
        $(outletClass).html(outlet.outletClass);
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
    if (outlet && route === '') {
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet, subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (route && outlet === '') {
      Template.instance().pagination.settings.set('filters',
        {
          routeId: route, subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (outlet && route) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          routeId: route, subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
  },
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
      subDistributor: Meteor.userId()
    });
    $('form :input').val("");
    $('#selectOutletSe1').val('').trigger('change');
    $('#selectRouteSe1').val('').trigger('change');
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
      active: "Y", subDistributor: Meteor.userId()
    },
      { fields: { name: 1, address: 1, contactPerson: 1,
         outletType: 1, outletClass: 1, routeId: 1, username: 1, approvalStatus: 1 } },

    );
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "N", subDistributor: Meteor.userId()
    }, { fields: { name: 1, address: 1, contactPerson: 1, outletType: 1, outletClass: 1, routeId: 1, username: 1, approvalStatus: 1 } },
    );
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
  'click #ic-create-Outlet-button': () => {
    $("#ic-create-Outlet").modal();
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
  },

  'click .routeAssignButton': (event, template) => {
    event.preventDefault();
    let header = $('#routeHeader');
    let confirmedUuid = $('#confirmedUuidsRoute');
    template.routeIdEdit.set('');
    $('#routeUpdateModal').modal();
    let _id = event.currentTarget.attributes.id.value;
    if (_id) {
      template.modalLoader.set(true);
      Meteor.call('outlets.idDataVal', _id, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.routeIdEdit.set(res.routeId);
        }
        else {
          template.modalLoader.set(false);
        }
      })
    }
    $(header).html('Change Route');
    $(confirmedUuid).val(_id);
  },

  'submit .changeRouteForm': (event, template) => {
    event.preventDefault();
    let route = '';
    $('#selectRouteUpdate').find(':selected').each(function () {
      route = $(this).val();
    });
    let id = $('#confirmedUuidsRoute').val();
    if (route) {
      $("#routeUpdateModal").modal('hide');
      Meteor.call('outlet.updateRoute', id, route, (error) => {
        if (error) {
          $('#message').html("Internal error - unable to update route. Please try again");
        } else {
          $('#outletSuccessModal').modal();
          $('#outletSuccessModal').find('.modal-body').text('Route Update Successfully');
        }
        $("#routeUpdateModal").modal('hide');
      });
    }
  },
});