/**
 * @author Nithin
 */

import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
let routeCodeCheck = false;
Template.routeGroup_create.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  this.customerArrayList = new ReactiveVar();
  this.wareHouseArray = new ReactiveVar();
  this.customervalueList = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.branchArrayList = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  $("#selectItems").val('').trigger('change');
  $("#selectCustomer").val('').trigger('change');
  $("#selectCustomerAddress").val('').trigger('change');
});
Template.routeGroup_create.onRendered(function () {
  routeCodeCheck = false;
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

  $('.selectPriority').select2({
    placeholder: "Select Priority",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriority").parent(),
  });

  $('.selectBranch').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectBranch").parent(),
  });

  $('.selectCustomers').select2({
    placeholder: "Select Customer",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomers").parent(),
  });

  $('.selectPrevRoute').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrevRoute").parent(),
  });
  this.modalLoader.set(false);

});


Template.routeGroup_create.helpers({


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
   * get branch list
   */
  branchLists: () => {
    return Template.instance().branchArrayList.get();
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
let itemCheckValidation = false;
Template.routeGroup_create.events({
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * add customer array
   */

  'click .addCustomer': (event, template) => {
    event.preventDefault();
    itemCheckValidation = false;
    let customer = '';
    let priority = '';
    $('#selectCustomers').find(':selected').each(function () {
      customer = $(this).val();
    });
    if (customer === '' || customer === 'Select customer') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#customerArrayspan").html('<style>#customerArrayspans{color:#fc5f5f;}</style><span id="customerArrayspans">Please select customer</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#customerArrayspan').fadeOut('slow');
      }, 3000);
    }
    else {
      $('#selectPriority').find(':selected').each(function () {
        priority = $(this).val();
      });
      if (priority === '' || priority === 'Select Priority') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#priorityArrayspan").html('<style>#priorityArrayspans{color:#fc5f5f;}</style><span id="priorityArrayspans">Please select priority</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#priorityArrayspan').fadeOut('slow');
        }, 3000);
      }
      else {

        $(".addCustomer").prop('disabled', true);
        Meteor.setTimeout(function () {
          $(".addCustomer").prop('disabled', false);
        }, 3000);
        if (customerArray.length > 0) {
          for (let i = 0; i < customerArray.length; i++) {
            if (customer === customerArray[i].customer) {
              itemCheckValidation = true;
              toastr['error'](customerAlreadyExist);
              break;
            }
            else {
              itemCheckValidation = false;
            }
          }
        }
        //Meteor call to take particular unit detail 
        Meteor.call('customer.custNameGet', customer, (custErr, custRes) => {
          if (!custErr && custRes !== undefined) {
            let randomId = Random.id();
            let itemObject = {
              randomId: randomId,
              customer: customer,
              priority: priority,
            };
            if (itemCheckValidation === false) {
              customerArray.push(itemObject);
              template.customervalueList.set(customerArray);
              itemDataClear();
            }
          }
        });
        function itemDataClear() {
          $("#selectCustomers").val('').trigger('change');
          $('#selectPriority').val('').trigger('change');

        }
      }
    }
  },

  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * set customers based on branch change
   */
  'change .selectBranch': (event, template) => {
    event.preventDefault();
    let branch = '';
    template.modalLoader.set(false);
    $('#selectBranch').find(':selected').each(function () {
      branch = $(this).val();
    });
    if (branch !== '' && branch !== 'Select Branch') {
      template.modalLoader.set(true);
      Meteor.call('customer.routeDataGet', branch, (err, res) => {
        if (!err) {
          template.customerArrayList.set(res.customerBranch);
          template.modalLoader.set(false);
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
    template.customerArrayList.set('');
    customerArray = [];
    template.customervalueList.set('');
    $("#selectCustomers").val('').trigger('change');
    $('#selectPriority').val('').trigger('change');
    $('#selectPrevRoute').val('').trigger('change');
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
  'click .closeRoute': (event, template) => {
    $("#selectCustomers").val('').trigger('change');
    $('#selectPriority').val('').trigger('change');
    $('#selectBranch').val('').trigger('change');
    $('#routeNameValue').val('');
    $('#descriptionVal').val('');
    $('#routeDate').val('');
    $("#submit").attr("disabled", false);
    customerArray = [];
    template.customervalueList.set('');
    $('form :input').val("");
  },

  'keyup #routeNameValue': (event, template) => {
    event.preventDefault();
    let routeName = $('#routeNameValue').val();
    routeCodeCheck = false;
    if (routeName !== '') {
      Meteor.call('routeGroup.routeCodeCheck', routeName, (err, res) => {
        if (!err) {
          if (res === true) {
            routeCodeCheck = true;
            $("#routeCodeSpan").html('<style>#routeCodeSpans{color:#fc5f5f;}</style><span id="routeCodeSpans"> Route Name already exists</span>');
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
  'submit .route-add': (event, template) => {
    event.preventDefault();
    let branch = '';
    $('#selectBranch').find(':selected').each(function () {
      branch = $(this).val();
    });
    // if (customerArray.length === 0) {
    //   toastr["error"](customerValidationMessage);
    // }
    // else {
    if (routeCodeCheck === true) {
      toastr["error"](routeCodeExistmsg);
    }
    else {
      $("#submit").prop('disabled', true);
      Meteor.setTimeout(function () {
        $("#submit").prop('disabled', false);
      }, 10000);

      createrRouteGroup(event.target, customerArray, branch);
      dataClear();
      $('#routeGroup-create').modal('hide');
    }
    function dataClear() {
      $("#selectCustomers").val('').trigger('change');
      $('#selectPriority').val('').trigger('change');
      $('#routeNameValue').val('');
      $('#descriptionVal').val('');
      $("#submit").attr("disabled", false);
      $('#selectBranch').val('').trigger('change');
      $('#routeDate').val('');
      customerArray = [];
      template.customervalueList.set('');
      $('form :input').val("");
    }
    // }
  },
  /**
   *  
   */
  'change .selectPrevRoute': (event, template) => {
    event.preventDefault();
    let routeCode = '';
    $('#selectPrevRoute').find(':selected').each(function () {
      routeCode = $(this).val();
    });
    if (routeCode !== '' && routeCode !== 'Select Route') {
      customerArray = [];
      template.customervalueList.set('');
      template.modalLoader.set(true);
      Meteor.call('route.customerDataGet', routeCode, (err, res) => {
        if (!err) {
          for (let n = 0; n < res.customerArray.length; n++) {
            customerArray.push(res.customerArray[n]);
          }
          template.customervalueList.set(customerArray);
          template.modalLoader.set(false);
        }
        else {
          customerArray = [];
          template.customervalueList.set('');
          template.modalLoader.set(false);
        }

      }
      )
    }
  },
});
