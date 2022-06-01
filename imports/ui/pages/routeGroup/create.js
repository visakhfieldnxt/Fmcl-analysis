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
  this.sdList = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  $("#selectItems").val('').trigger('change');
  $("#selectCustomer").val('').trigger('change');
  $("#selectCustomerAddress").val('').trigger('change');
});
Template.routeGroup_create.onRendered(function () {
  routeCodeCheck = false;
  /**
 * TODO:Complete Js doc
 * Getting sd user list
 */
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
    let loginUserVerticals = Session.get("loginUserVerticals");
    Meteor.call('user.sdListGet', loginUserVerticals, (err, res) => {
      if (!err) {
        this.sdList.set(res);
      }
    });
  }

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

  $('.selectSdIds').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSdIds").parent(),
  });

  $('.selectCustomers').select2({
    placeholder: "Select Outlet",
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
   * get sdList 
   */
  sdUsersGet: () => {
    return Template.instance().sdList.get();
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
    $('#selectSdIds').val('').trigger('change');
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
    let subDistributor = '';
    $('#selectSdIds').find(':selected').each(function () {
      subDistributor = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (routeCodeCheck === true) {
      toastr["error"](routeCodeExistmsg);
    }
    else {
      $("#submit").prop('disabled', true);
      Meteor.setTimeout(function () {
        $("#submit").prop('disabled', false);
      }, 10000);

      createrRouteGroup(event.target, subDistributor,loginUserVerticals);
      dataClear();
      $('#routeGroup-create').modal('hide');
    }
    function dataClear() {
      $("#selectCustomers").val('').trigger('change');
      $('#selectPriority').val('').trigger('change');
      $('#routeNameValue').val('');
      $('#descriptionVal').val('');
      $("#submit").attr("disabled", false);
      $('#selectSdIds').val('').trigger('change');
      $('#routeDate').val('');
      customerArray = [];
      template.customervalueList.set('');
      $('form :input').val("");
    }
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
    template.modalLoader.set(false);
    if (sdId !== '' && sdId !== undefined) {
      template.modalLoader.set(true);
      Meteor.call('user.sdDataGets', sdId, (err, res) => {
        if (!err) {
          $('#verticalSpan').html(`Verticals : <b> ${res.verticalName}</b>`);
          $('#branchSpan').html(`Branch : <b> ${res.branchName}</b>`);
          $('#locationSpan').html(`Location : <b>${res.locationName}</b>`);
          $('#verticalSpan').css("padding", "4px 14px");
          $('#branchSpan').css("padding", "4px 14px");
          $('#locationSpan').css("padding", "4px 14px");
          template.modalLoader.set(false);
        }
        else {
          $('#verticalSpan').html('');
          $('#branchSpan').html('');
          $('#locationSpan').html('');
          template.modalLoader.set(false);
        }
      });
    }
  },
});
