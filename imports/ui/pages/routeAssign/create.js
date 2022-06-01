/**
 * @author Nithin
 */

import { Random } from 'meteor/random';
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
  $("#selectItems").val('').trigger('change');
  $("#selectCustomer").val('').trigger('change');
  $("#selectCustomerAddress").val('').trigger('change');
});
Template.routeAssign_create.onRendered(function () {
  routeCodeCheck = false;
  $('.loaderValues').css('display', 'none');
  /**
 * TODO:Complete Js doc
 * Getting user branch list
 */
  // Meteor.call('routeGroup.activelist', (err, res) => {
  //   if (!err) {
  //     this.routeGroupList.set(res);
  //   }
  // });
  /**
* TODO:Complete Js doc
* Getting user branch list
*/
  Meteor.call('branch.branchList', (err, res) => {
    if (!err) {
      this.branchArrayList.set(res);
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

  $('.selectBranch').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectBranch").parent(),
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

  //   custNameHelp: (cardCode) => {
  //     let custData = Template.instance().customerNameArray.get();
  //     if (custData) {
  //       let res = custData.find(x => x.cardCode === cardCode);
  //       if (res) {
  //         return res.cardName;
  //       }
  //     }
  //   },
  async custNameHelp(cardCode) {
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
      $('.customersVal_' + cardCode).html(result);
      $('.loaderValues').css('display', 'none');
    }
    );
    promiseVal.catch((error) => {
      $('.customersVal_' + cardCode).html('');
      $('.loaderValues').css('display', 'none');
    }
    );
  },
  endDateGet: () => {
    return Template.instance().endDateSetUp.get();
  },


  /**
   * get branch list
   */
  branchLists: () => {
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
let routeAssignVal = false;
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
    if (routeCode !== '') {
       $('.loaderValues').css('display', 'block');
      template.modalLoader.set(true);
      template.vansaleUsersData.set('');
      customerArray = [];
      template.customervalueList.set('');
      let vansaleRoles = Session.get("vansaleRoles");
      Meteor.call('routeGroup.assignedEmployeeList', routeCode,vansaleRoles, (err, res) => {
        if (!err) {
          customerArray = [];
          template.vansaleUsersData.set(res.userRes);
          template.modalLoader.set(false);
          if (res.routeCustList !== undefined && res.routeCustList.length > 0) {
            for (let x = 0; x < res.routeCustList.length; x++) {
              customerArray.push(res.routeCustList[x]);
            }
            template.customervalueList.set(customerArray);
          }
          else {
            $('.loaderValues').css('display', 'none');
          }
        }
        else {
          template.vansaleUsersData.set('');
          template.modalLoader.set(false);
          template.customervalueList.set('');
          customerArray = [];
          $('.loaderValues').css('display', 'none');
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
    $('#selectBranch').val('').trigger('change');
    $('.routeDate').val('');
    $('.routeDateEnd').val('');
    $('#descriptionVal').val('');
    $("#submit").attr("disabled", false);
    customerArray = [];
    template.customervalueList.set('');
    $('form :input').val("");
    template.endDateSetUp.set('');
    $('.loaderValues').css('display', 'none');
  },

  'keyup #routeCodevalue': (event, template) => {
    event.preventDefault();
    let routeCode = $('#routeCodevalue').val();
    routeCodeCheck = false;
    if (routeCode !== '') {
      Meteor.call('route.routeCodeCheck', routeCode, (err, res) => {
        if (!err) {
          if (res === true) {
            routeCodeCheck = true;
            $("#routeCodeSpan").html('<style>#routeCodeSpans{color:#fc5f5f;}</style><span id="routeCodeSpans"> Route Code already exists</span>');
          }
          else {
            routeCodeCheck = false;
            $("#routeCodeSpan").html('<style>#routeCodeSpans{color:#fc5f5f;}</style><span id="routeCodeSpans"></span>');
          }
        }
      });
    }
    else {
      routeCodeCheck = false;
    }
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
    let fromDate = $('.routeDate').val();
    let endDate = $('.routeDateEnd').val();
    let fromDateIso = new Date(moment(fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
    let endDateIso = new Date(moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
    if (endDateIso < fromDateIso) {
      toastr['error'](`End Date Must Be Greater Than Start Date !`);
    }
    else {
      if (customerArray.length === 0) {
        toastr["error"](customerValidationAssignMessage);
      }
      else {
        if (routeAssignVal === true) {
          toastr['error'](`Route already assigned !`);
        }
        else {
          $("#submit").prop('disabled', true);
          Meteor.setTimeout(function () {
            $("#submit").prop('disabled', false);
          }, 5000);
          Meteor.call("routeAssign.checkData", routeGroupId, empId, fromDate, (err, res) => {
            if (!err) {
              if (res.approvalCheck === true) {
                toastr['error'](`Route already assigned to ${res.assignedByName} !`);
              }
              else {
                assignRouteValues(event.target, routeGroupId, empId);
                dataClear();
                $('#routeAssign-create').modal('hide');
              }
            }
          });
          function dataClear() {
            $("#submit").attr("disabled", false);
            $('#selectRouteName').val('').trigger('change');
            $('#selectAssignEmpoyee').val('').trigger('change');
            $('#selectBranch').val('').trigger('change');
            $('.routeDate').val('');
            $('.routeDateEnd').val('');
            $('#descriptionVal').val('');
            customerArray = [];
            template.customervalueList.set('');
            template.endDateSetUp.set('');
            $('form :input').val("");
          }
        }
      }
    }
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

  'change #selectBranch': (event, template) => {
    event.preventDefault();
    let branch = '';
    $('#selectBranch').find(':selected').each(function () {
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


});