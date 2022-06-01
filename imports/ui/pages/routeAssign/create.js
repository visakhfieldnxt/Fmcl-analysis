/**
 * @author Nithin
 */

import { Meteor } from 'meteor/meteor';
let routeCodeCheck = false;
Template.routeAssign_create.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  this.customerArrayList = new ReactiveVar();
  this.wareHouseArray = new ReactiveVar();
  this.customervalueList = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.routeGroupList = new ReactiveVar();
  this.vansaleUsersData = new ReactiveVar();
  this.branchArrayList = new ReactiveVar();
  this.endDateSetUp = new ReactiveVar();
  this.sdList = new ReactiveVar();
  $("#selectItems").val('').trigger('change');
  $("#selectCustomer").val('').trigger('change');
  $("#selectCustomerAddress").val('').trigger('change');
});
Template.routeAssign_create.onRendered(function () {
  routeCodeCheck = false;

  let subDistributorValue = Session.get("subDistributorValue");
  if (subDistributorValue === true) {
    $('.selectSdIds').prop('disabled', true);
  }
  else {
    $('.selectSdIds').prop('disabled', false);
  }

  /**
* TODO:Complete Js doc
* Getting user branch list
*/
  Meteor.call('user.sdUserFullList', (err, res) => {
    if (!err) {
      this.sdList.set(res);
    }
  });


  $('.selectAssignEmpoyee').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectAssignEmpoyee").parent(),
  });

  $('.selectRouteName').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteName").parent(),
  });

  $('.selectCustomers').select2({
    placeholder: "Select Customer",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomers").parent(),
  });

  $('.selectRouteDate').select2({
    placeholder: "Select Date",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteDate").parent(),
  });


  $('.selectSdIds').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSdIds").parent(),
  });

  $('.selectPrevRoute').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrevRoute").parent(),
  });
  this.modalLoader.set(false);

});


Template.routeAssign_create.helpers({


  /**
 * TODO Complete Js doc
 * For Loader Showing
 */
  printLoad: () => {
    let loader = Template.instance().modalLoader.get();
    if (loader === true) {
      return true;
    } else {
      return false;

    }
  },
  //   /**
  // * get vansale user name
  // */

  endDateGet: () => {
    return Template.instance().endDateSetUp.get();
  },

  /**
   * get sdList 
   */
  sdUsersGet: () => {
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      if (Meteor.user()) {
        Meteor.setTimeout(function () {
          $('#selectSdIds').val(Meteor.userId()).trigger('change');
        }, 100);
      }
      else {
        $('#selectSdIds').val('').trigger('change');
      }
    }
    return Template.instance().sdList.get();
  },
  /**
  * 
  * display vansale users
  */
  vansaleUserList: () => {
    return Template.instance().vansaleUsersData.get();
  },
  /**
 * get prev route list
 */
  routeListGet: () => {
    return Template.instance().routeGroupList.get();
  },
  /**
  * TODO:Complete Js doc
  * Showing todays date
  */
  date: function () {
    return new Date();
  },

  /**
   * TODO:Complete Js doc
   * Getting customer list
   */
  customersList: function () {
    return Template.instance().customerArrayList.get();
  },
  /**
 * TODO:Complete Js doc
 * Getting branch list
 */
  customerDataArrayList: () => {
    return Template.instance().customervalueList.get();
  },


});
let customerArray = [];
Template.routeAssign_create.events({


  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * get values based on route group change
   */

  'change #selectRouteName': (event, template) => {
    event.preventDefault();
    let routeCode = '';
    $('#selectRouteName').find(':selected').each(function () {
      routeCode = $(this).val();
    });
  $("#selectRouteDate").val('').trigger('change');

    if (routeCode !== '') {
      template.modalLoader.set(true);
      customerArray = [];
      template.customervalueList.set('');
      Meteor.call('routeGroup.assignedEmployeeList', routeCode, (err, res) => {
        if (!err) {
          customerArray = [];
          template.modalLoader.set(false);
          if (res.routeCustList !== undefined && res.routeCustList.length > 0) {
            for (let x = 0; x < res.routeCustList.length; x++) {
              customerArray.push(res.routeCustList[x]);
            }
            template.customervalueList.set(customerArray);
          }
          else {
          }
        }
        else {
          template.modalLoader.set(false);
          template.customervalueList.set('');
          customerArray = [];
        }
      });
    }

  },
  'change #selectRouteDate': (event, template) => {
    event.preventDefault();
    let date = '';
    let routeCode = '';
    $('#selectRouteName').find(':selected').each(function () {
      routeCode = $(this).val();
    });
    $('#selectRouteDate').find(':selected').each(function () {
      date = $(this).val();
    });
    if (date !== '' && routeCode!=='') {
      Meteor.call('routeAssign.checkDateAssigned', routeCode,date, (err, res) => {
        if (!err) {
         if (res == true) {
           $('.assignBtn').prop('disabled', true);
          toastr['error'](`Route already assigned on this Day .Please select another Day`);
         }else{
          $('.assignBtn').prop('disabled', false);
         }
        }
      });
    }

  },

  /**
    * TODO:Complete Js doc
    * Deleting customer from the array.
    */
  'click .deleteCustumer': (event, template) => {
    let customerArrays = Template.instance().customervalueList.get();
    let itemIndex = event.currentTarget.id;
    let removeIndex = customerArrays.map(function (item) {
      return item.randomId;
    }).indexOf(itemIndex);
    customerArray.splice(removeIndex, 1);
    template.customervalueList.set(customerArray);
  },
  /**
    * TODO:Complete Js doc
    * clear data when click the close button.
    */
  'click .closeRouteAssign': (event, template) => {
    $('#selectRouteName').val('').trigger('change');
    $('#selectAssignEmpoyee').val('').trigger('change');
    $('#selectSdIds').val('').trigger('change');
    $('.routeDate').val('');
    $('.routeDateEnd').val('');
    $('#descriptionVal').val('');
    $("#submit").attr("disabled", false);
    customerArray = [];
    template.customervalueList.set('');
    $('form :input').val("");
    template.endDateSetUp.set('');
    $('.loaderValues').css('display', 'none');
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      if (Meteor.user()) {
        $('#selectSdIds').val(Meteor.userId()).trigger('change');
      }
    }
    else {
      $('#selectSdIds').val('').trigger('change');
    }
    $('#selectRouteDate').val('').trigger('change');
  },


  /**
    * TODO:Complete Js doc
    * Process of submition in route page.
    */
  'submit .assign-routeData': (event, template) => {
    event.preventDefault();
    let routeGroupId = '';
    $('#selectRouteName').find(':selected').each(function () {
      routeGroupId = $(this).val();
    });

    let empId = '';
    $('#selectAssignEmpoyee').find(':selected').each(function () {
      empId = $(this).val();
    });
    let routeDate = '';
    $('#selectRouteDate').find(':selected').each(function () {
      routeDate = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    $("#submit").prop('disabled', true);
    Meteor.setTimeout(function () {
      $("#submit").prop('disabled', false);
    }, 5000);
    Meteor.call("routeAssign.checkData", routeGroupId, empId, routeDate, (err, res) => {
      if (!err) {
        if (res.approvalCheck === true) {
          toastr['error'](`Route already assigned to ${res.assignedByName} !`);
        }
        else {
          assignRouteValues(event.target, routeGroupId, empId, routeDate,loginUserVerticals);
          dataClear();
          $('#routeAssign-create').modal('hide');
        }
      }
    });
    function dataClear() {
      $("#submit").attr("disabled", false);
      $('#selectRouteName').val('').trigger('change');
      $('#selectRouteDate').val('').trigger('change');
      $('#selectAssignEmpoyee').val('').trigger('change');
      $('#selectSdIds').val('').trigger('change');
      $('.routeDate').val('');
      $('.routeDateEnd').val('');
      $('#descriptionVal').val('');
      customerArray = [];
      template.customervalueList.set('');
      template.endDateSetUp.set('');
      $('form :input').val("");
      let subDistributorValue = Session.get("subDistributorValue");
      if (subDistributorValue === true) {
        if (Meteor.user()) {
          $('#selectSdIds').val(Meteor.userId()).trigger('change');
        }
      }
      else {
        $('#selectSdIds').val('').trigger('change');
      }
    }
    // }
  },

  /**
   * TODO:Complete Js doc
   * get data based on assignee change
   */

  'change .selectAssignEmpoyee': (event, template) => {
    event.preventDefault();
    let routeGroupId = '';
    $('#selectRouteName').find(':selected').each(function () {
      routeGroupId = $(this).val();
    });
    let empId = '';
    $('#selectAssignEmpoyee').find(':selected').each(function () {
      empId = $(this).val();
    });
    if (routeGroupId !== '' && empId !== '') {
      template.modalLoader.set(true);
      routeAssignVal = false;
      Meteor.call("routeAssign.routeCheck", routeGroupId, empId, (err, res) => {
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

  'change #selectSdIds': (event, template) => {
    event.preventDefault();
    let branch = '';
    $('#selectSdIds').find(':selected').each(function () {
      branch = $(this).val();
    });
    template.routeGroupList.set('');
    if (branch) {
      template.modalLoader.set(true);
      Meteor.call("routeGroup.branchWise", branch, (err, res) => {
        if (!err) {
          template.routeGroupList.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.routeGroupList.set('');
          template.modalLoader.set(false);
        }
      })
    }
    customerArray = [];
    template.customervalueList.set('');
    $('#selectRouteName').val('').trigger('change');
    $('#selectAssignEmpoyee').val('').trigger('change');
    $('.routeDate').val('');
    $('.routeDateEnd').val('');
    $('#descriptionVal').val('');
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   */
  'change #selectSdIds': (event, template) => {
    event.preventDefault();
    let sdId = '';
    $('#selectSdIds').find(':selected').each(function () {
      sdId = ($(this).val());
    });
    $('#verticalSpan').html('');
    $('#branchSpan').html('');
    $('#locationSpan').html('');
    template.routeGroupList.set('');
    template.vansaleUsersData.set();
    if (sdId !== '' && sdId !== undefined) {
      template.modalLoader.set(true);
      Meteor.call('routeGroup.vsrUserList', sdId, (err, res) => {
        if (!err) {
          $('#verticalSpan').html(`Verticals : <b> ${res.verticalName}</b>`);
          $('#branchSpan').html(`Branch : <b> ${res.branchName}</b>`);
          $('#locationSpan').html(`Location : <b>${res.locationName}</b>`);
          $('#verticalSpan').css("padding", "4px 14px");
          $('#branchSpan').css("padding", "4px 14px");
          $('#locationSpan').css("padding", "4px 14px");
          template.routeGroupList.set(res.routeRes);
          template.vansaleUsersData.set(res.sdUsersList);
          template.modalLoader.set(false);
        }
        else {
          $('#verticalSpan').html('');
          $('#branchSpan').html('');
          $('#locationSpan').html('');
          template.modalLoader.set(false);
          template.vansaleUsersData.set();
        }
      });
    }
    customerArray = [];
    template.customervalueList.set('');
    $('#selectRouteName').val('').trigger('change');
    $('#selectAssignEmpoyee').val('').trigger('change');
    $('.routeDate').val('');
    $('.routeDateEnd').val('');
    $('#descriptionVal').val('');
  },

});