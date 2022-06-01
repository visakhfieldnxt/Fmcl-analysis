/**
 * @author Nithin
 * 
 */


import { Meteor } from 'meteor/meteor';
import { RouteGroup } from '../../../api/routeGroup/routeGroup';
import XLSX from 'xlsx';
Template.routeGroup.onCreated(function () {
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
  this.branchEdits = new ReactiveVar();
  this.branchArrayList = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.bodyLoaders = new ReactiveVar();
  this.currentData = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.custAddressGet = new ReactiveVar();
  this.addressmaster = new ReactiveVar();
  this.pagination = new Meteor.Pagination(RouteGroup, {
    filters: {
      active: "Y"
    },
    sort: {
      createdAt: -1
    },
    perPage: 20
  });

});

Template.routeGroup.onRendered(function () {
  this.modalLoader.set(false);
  $('#bodySpinLoaders').css('display', 'block');
  // this.bodyLoaders.set(true);
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
  $("#select2-batch").val('').trigger('change');

  /**
* TODO:Complete Js doc
* Getting user branch list
*/
  Meteor.call('branch.branchList', (err, res) => {
    if (!err) {
      this.branchArrayList.set(res);
    }
  });

  Meteor.call('routeGroup.list', (err, res) => {
    if (!err) {
      this.routeCodeList.set(res);
    }
  });

  Meteor.call('customerAddress.list', (err, res) => {
    if (!err) {
      this.addressmaster.set(res);
    }
  });


  /**
* TODO:Complete Js doc
* Getting vansale user list
*/

  /**
   * get routeCode list for filter
   */
  Meteor.setInterval(() => {
    Meteor.call('routeGroup.list', (err, res) => {
      if (!err) {
        this.routeCodeList.set(res);
      }
    });
  }, 600000);

  /**
   * TODO:Complete Js doc
   * Getting customer list
   */
  Meteor.call('customer.customerRouteData', (err, res) => {
    if (!err)
      this.customerNameArray.set(res);
  });
  /**
   * TODO: Complete JS doc
   */
  $('#routeCodeVal').select2({
    placeholder: "Select Route Code",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#routeCodeVal").parent(),
  });

  $('#routeNameVal').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#routeNameVal").parent(),
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
  $('.selectCustomersAddressEdit').select2({
    placeholder: "Select Customer Address",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomersAddressEdit").parent(),
  });
});
Template.routeGroup.helpers({
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
  labelName: function () {
    let name = Template.instance().fileName.get();
    if (name !== undefined) {
      return name;
    }
    else {
      return false;
    }
  },

  routeDataList: () => {
    return Template.instance().routeUpdatedData.get();

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
   * address list
   */
  customerAddressGet: () => {
    return Template.instance().custAddressGet.get();
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
 * get vansale user name
 */

  branchNameHelp: (branch) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("branch.idBranchName", branch, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.branchIdVal_' + branch).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.branchIdVal_' + branch).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },

  /**
   * * TODO:Complete Js doc
 * For listing customer filters
 * 
 */
  customerDataList: function () {
    return Template.instance().customerDataArray.get();
  },

  routeGroupLists: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
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
  // /**
  //  * 
  //  * @param {*} latitude 
  //  * @param {*} longitude 
  //  * location get
  //  */
  //   locationDataGet: (latitude, longitude) => {
  //     let latLongData = "https://us1.locationiq.com/v1/reverse.php?key=e1428615b8b890&lat=" + latitude + "&lon=" + longitude + "&format=json";
  //     HTTP.call('GET', latLongData, {},
  //       function (error, response) {
  //         if (error) {
  //         } else { 
  //           return response.data.display_name;
  //         }
  //       });

  //   },

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
Template.routeGroup.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .route-filter': (event, template) => {
    event.preventDefault();
    let routeCode = event.target.routeCodeVal.value;
    let routeName = event.target.routeNameVal.value;
    if (routeCode && routeName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          routeCode: routeCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (routeName && routeCode === '') {
      Template.instance().pagination.settings.set('filters', {
        routeName: routeName,
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else if (routeName && routeCode) {
      Template.instance().pagination.settings.set('filters', {
        routeCode: routeCode,
        routeName: routeName,
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
      $('.taskHeaderList').css('display', 'inline');
    }
  },

  /**
   * TODO: Complete JS doc
   * for reset filter
   */
  'click .reset': (event, target) => {
    Template.instance().pagination.settings.set('filters', {
      active: "Y"
    });
    $('#routeCodeVal').val('').trigger('change');
    $('#routeNameVal').val('').trigger('change');
    $('form :input').val("");
    $('.taskHeaderList').css('display', 'inline');
    let element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    let elements = document.getElementById("activeFilter");
    elements.classList.add("active");
  },
  /**
   * TODO: Compelete JS doc
   * to view route create modal
   */
  'click #routeGroup-create-button': (event) => {
    $("#routeGroup-create").modal();
  },

  'change .selectBranchEdits': (event, template) => {
    event.preventDefault();
    let branch = '';
    template.modalLoader.set(false);
    $('#selectBranchEdits').find(':selected').each(function () {
      branch = $(this).val();
    });
    if (branch !== '' && branch !== 'Select Branch') {
      template.modalLoader.set(true);
      Meteor.call('customer.branchList', branch, (err, res) => {
        if (!err) {
          template.customerDataArray.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.customerDataArray.set('');
          template.modalLoader.set(false);
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
    console.log("_id", _id)
    let routeCode = $('#routeCodeGet_' + _id).val();
    $('#assignRouteHeader').html(`Assign Rote ( ${routeCode} )`);
    $(confirmedUuid).val(_id);
    template.modalLoader.set(true);
    template.vansaleUsersData.set('');
    Meteor.call('route.assignedEmployeeList', _id, (err, res) => {
      if (!err) {
        template.vansaleUsersData.set(res);
        template.modalLoader.set(false);
      }
      else {
        template.vansaleUsersData.set('');
        template.modalLoader.set(false);
      }
    })
  },


  /**
  * TODO:Complete Js doc
  * for getting item details when click edit button
  */

  'click .routeEdit': (event, template) => {
    itemCheck = false;
    $("#routeEditPage").modal();
    customerArray = [];
    let ids = event.currentTarget.id;
    Session.set("routeIds", ids);
    $("#routeNameEdit").val('');
    $("#routeDescripEdit").val('');
    let routeNameEdit = ("#routeNameEdit");
    let routeDescripEdit = ("#routeDescripEdit");
    template.branchEdits.set('');
    template.modalLoader.set(false);
    if (ids) {
      template.modalLoader.set(true);
      let header = $('#orderHsEdit');
      $(header).html('Edit Route');
      Meteor.call('routeGroup.idGet', ids, (err, res) => {
        if (!err) {
          $(routeNameEdit).val(res.groupRes.routeName);
          $(routeDescripEdit).val(res.groupRes.description);
          for (let n = 0; n < res.customerList.length; n++) {
            customerArray.push(res.customerList[n]);
          }
          template.customerArray.set(customerArray);
          template.modalLoader.set(false);
          if (res.groupRes.branchCode !== undefined) {
            template.branchEdits.set(res.groupRes.branchCode);
          }
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
  },
  /**
   * TODO:Complete Js doc
   * Deleting customer from the array.
   */
  'click .deleteCustumerEdit': (event, template) => {
    itemCheck = true;
    let customerArrays = Template.instance().customerArray.get();
    let itemIndex = event.currentTarget.id;
    let removeIndex = customerArrays.map(function (item) {
      return item.randomId;
    }).indexOf(itemIndex);
    customerArray.splice(removeIndex, 1);
    template.customerArray.set(customerArray);
  },

  /**
    * TODO:Complete JS doc
    * @param event
    */
  'click .view': (event, template) => {
    event.preventDefault();
    $('#orderDetailPage').modal();
    template.modalLoader.set(true);
    template.itemsDetailsList.set('');
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let routeCode = $('#detailrouteCode');
    let description = $('#detailDescription');
    let routeName = $('#detailrouteName');
    let detailBranch = $('#detailBranch');
    Meteor.call('routeGroup.idGet', id, (err, res) => {
      if (!err) {
        $(header).html('Details of Route');
        $(routeCode).html(res.groupRes.routeCode);
        $(description).html(res.groupRes.description);
        $(routeName).html(res.groupRes.routeName);
        $(detailBranch).html(res.branchName);
        template.modalLoader.set(false);
        template.itemsDetailsList.set(res.customerList);
      }
      else {
        template.modalLoader.set(false);
      }
    });
  },
  /**
     * TODO:Complete Js doc
     *for add customer
     */

  'click .addCustomerEdit': (event, template) => {
    event.preventDefault();
    itemCheckValidation = false;
    let customer = '';
    let priority = '';
    let address = '';
    $('#selectCustomersEdit').find(':selected').each(function () {
      customer = $(this).val();
    });
    if (customer === '' || customer === 'Select customer') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#customerArrayspanEdit").html('<style>#customerArrayspansEdit{color:#fc5f5f;}</style><span id="customerArrayspansEdit">Please select customer</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#customerArrayspanEdit').fadeOut('slow');
      }, 3000);
    }
    else {
      $('#selectCustomersAddressEdit').find(':selected').each(function () {
        address = $(this).val();
      });
      if (address === '' || address === 'Select Customer Address') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#customerAddressArrayspanEdit").html('<style>#customerAddressArrayspansEdit{color:#fc5f5f;}</style><span id="customerAddressArrayspansEdit">Please select customer address</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#customerAddressArrayspanEdit').fadeOut('slow');
        }, 3000);
      }
      else {
        $('#selectPriorityEdit').find(':selected').each(function () {
          priority = $(this).val();
        });
        if (priority === '' || priority === 'Select Priority') {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#priorityArrayspanEdit").html('<style>#priorityArrayspansEdit{color:#fc5f5f;}</style><span id="priorityArrayspansEdit">Please select priority</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#priorityArrayspanEdit').fadeOut('slow');
          }, 3000);
        }
        else {

          $(".addCustomerEdit").prop('disabled', true);
          Meteor.setTimeout(function () {
            $(".addCustomerEdit").prop('disabled', false);
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
                address: address,
              };
              if (itemCheckValidation === false) {
                customerArray.push(itemObject);
                template.customerArray.set(customerArray);
                itemCheck = true;
                itemDataClear();
              }
            }
          });
          function itemDataClear() {
            $("#selectCustomersEdit").val('').trigger('change');
            $('#selectPriorityEdit').val('').trigger('change');
            $("#selectCustomersAddressEdit").val('').trigger('change');
          }
        }
      }
    }
  },

  /**
 * TODO:Complete Js doc
 * for final submition
 */
  'submit .routeEditPage': (event, template) => {
    event.preventDefault();
    if (customerArray.length === 0) {
      toastr["error"](customerValidationMessage);
    }
    else {
      let routeId = Session.get("routeIds");
      $("#submit").attr("disabled", true);
      if (itemCheck === true) {
        // console.log("weight1", weight);
        editOrUpdateRouteGroup(event.target, routeId, customerArray);
        dataClear();
        $('#routeEditPage').modal('hide');
      }
      else {
        Meteor.call('routeGroup.idGet', routeId, (err, res) => {
          editOrUpdateRouteGroup(event.target, routeId, res.customerList);
          dataClear();
          $('#routeEditPage').modal('hide');
        });
      }
    }
    function dataClear() {
      $("#selectCustomersEdit").val('').trigger('change');
      $('#selectPriorityEdit').val('').trigger('change');
      $('#selectBranchEdits').val('').trigger('change');
      $('#routeNameEdit').val('');
      $('#descriptionValEdit').val('');
      $("#submit").attr("disabled", false);
      $('#routeDescripEdit').val('');
      $("#selectCustomersAddressEdit").val('').trigger('change');
      customerArray = [];
      template.customerArray.set('');
      $('form :input').val("");
      itemCheck = false;
    }
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
    $("#selectCustomersAddressEdit").val('').trigger('change');
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
    $('#routeNameEdit').val('');
    $('#routeDescripEdit').val('');
    $('#routeDateEdit').val('');
    $("#submit").attr("disabled", false);
    $("#selectCustomersAddressEdit").val('').trigger('change');
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
    $("#selectCustomersAddressEdit").val('').trigger('change');
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
      Meteor.call('routeGroup.deactivate', $.trim(_id), (error) => {
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
      Meteor.call('routeGroup.activate', $.trim(_id), (error) => {
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
    $('#bodySpinLoaders').css('display', 'block');
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
    $('#bodySpinLoaders').css('display', 'block');
    Template.instance().pagination.settings.set('filters', {
      active: "N"
    });
  },
  /**
   * upload customer
   */

  'click .uploadExcel': (event, template) => {
    event.preventDefault();
    $('#customerUploadModal').modal();
    event.preventDefault();
    $("#uploadCustomer").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let _id = event.currentTarget.attributes.id.value;
    $('#routeIdGets').val(_id);
    let routeName = $('#routeName_' + _id).val();
    let header = $('#customerUploadHeader');
    $(header).html(`Confirm Upload (${routeName})`);
  },

  'submit #uploadCustomer': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadCustomerFile");
    let id = $('#routeIdGets').val();
    let customerMasterArray = [];
    let myFile = $('.uploadCustomerFile').prop('files')[0];
    let fileType = myFile["type"];
    let customerAddressMaster = Template.instance().addressmaster.get();
    console.log("fileType", fileType);
    Meteor.call('customer.routeBranchList', id, (err, res) => {
      if (!err && res.length > 0) {
        for (let k = 0; k < res.length; k++) {
          customerMasterArray.push(res[k]);
        }
        customerGet(customerMasterArray);
      }
    });
    function customerGet(customerMasterArray) {
      if (myFile.type === 'application/vnd.ms-excel' || myFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

        //Validate whether File is valid Excel file.
        // let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        // if (regex.test(fileUpload.value.toLowerCase())) {
        if (fileUpload !== null && fileUpload !== '' && fileUpload !== undefined) {
          if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
              reader.onload = function (e) {
                processExcel(e.target.result);
              };
              reader.readAsBinaryString(fileUpload.files[0]);
            } else {
              //For IE Browser.
              reader.onload = function (e) {
                let data = "";
                let bytes = new Uint8Array(e.target.result);
                for (let i = 0; i < bytes.byteLength; i++) {
                  data += String.fromCharCode(bytes[i]);
                }
                processExcel(data);
              };
              reader.readAsArrayBuffer(fileUpload.files[0]);
            }
          }
          else {
            $(window).scrollTop(0);
            setTimeout(function () {
              $("#fileArrayspan").html('<style>#fileArrayspan {color :#fc5f5f }</style><span id="fileArrayspan">This browser does not support HTML5.</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#fileArrayspan').fadeOut('slow');
            }, 3000);
          }
        }
        else {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#fileArrayspan").html('<style>#fileArrayspan {color :#fc5f5f }</style><span id="fileArrayspan">A file needed</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#fileArrayspan').fadeOut('slow');
          }, 3000);
        }
      }
      else {
        $('#routeErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#routeErrorModal').modal();
        $('#customerUploadModal').modal('hide');
        $("#uploadCustomer")[0].reset();
        template.fileName.set('');
        fileName = '';
      }

      function processExcel(data) {
        //Read the Excel File data.
        let customersArrayData = [];
        let workbook = XLSX.read(data, {
          type: 'binary'
        });
        //Fetch the name of First Sheet.
        let firstSheet = workbook.SheetNames[0];
        //Read all rows from First Sheet into an JSON array.
        let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
        if (excelRows !== undefined && excelRows.length > 0) {
          //Add the data rows from Excel file.
          for (let i = 0; i < excelRows.length; i++) {
            let customer = excelRows[i].CustomerName;
            let address = excelRows[i].Address;
            let priority = excelRows[i].Priority;
            if (customer !== undefined && customer !== '' &&
              priority !== undefined && priority !== '' &&
              address !== undefined && address !== '') {
              let customerCodeGet = ''
              let custRes = customerMasterArray.find(x => x.cardName === customer);
              if (custRes) {
                customerCodeGet = custRes.cardCode;
              }
              let addressVal = ''
              let custResAddress = customerAddressMaster.find(x => x.address === address);
              if (custResAddress) {
                addressVal = custResAddress._id;
              }
              if (customerCodeGet !== undefined && customerCodeGet !== '' && addressVal !== undefined && addressVal !== '') {
                customersArrayData.push({
                  customer: customerCodeGet, priority: priority.toString(), address: addressVal,
                });
              }
            }
          }
        }
        else {
          $('#routeErrorModal').find('.modal-body').text('Invalid File Format!');
          $('#routeErrorModal').modal();
          $('#customerUploadModal').modal('hide');
          $("#uploadCustomer")[0].reset();
          template.fileName.set('');
          fileName = '';
        }
        if (customersArrayData.length !== 0 && customersArrayData !== undefined) {
          $('#customerUploadModal').modal('hide');
          return Meteor.call('routeGroup.customerUpload', id, customersArrayData, (error, result) => {
            if (error) {
              $('#routeErrorModal').find('.modal-body').text(error.reason);
              $('#routeErrorModal').modal();
              $('#customerUploadModal').modal('hide');
              $("#uploadCustomer")[0].reset();
              template.fileName.set('');
              fileName = '';
            }
            else {
              $('#customerUploadModal').modal('hide');
              $("#uploadCustomer")[0].reset();
              $('#routeSuccessModal').find('.modal-body').text(` Customer has been updated successfully (${customersArrayData.length} Nos)`);
              $('#routeSuccessModal').modal();
              template.fileName.set('');
              fileName = '';
            }
          });
        }
        else {
          $('#routeErrorModal').find('.modal-body').text('Invalid File Format!');
          $('#routeErrorModal').modal();
          $('#customerUploadModal').modal('hide');
          $("#uploadCustomer")[0].reset();
          template.fileName.set('');
          fileName = '';
        }
      };
    }
  },
  /**
  * TODO: Complete JS doc
  */
  'click #customerFileClose': (event, template) => {
    $("#uploadCustomer").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadbranch': (event, template) => {
    event.preventDefault();
    let data = [{
      cardCode: '', priority: '', address: '',
    }];
    dataCSV = data.map(element => ({
      'CustomerName': '',
      'Address': '',
      'Priority': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "CustomerFormat.xls");
  },
  'change .uploadCustomerFile': function (event, template) {
    let func = this;
    let file = event.currentTarget.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      fileName = file.name,
        fileContent = reader.result,
        template.fileName.set(file.name);
    };
    reader.readAsDataURL(file);
  },
  'change #selectCustomersEdit': (event, templete) => {
    event.preventDefault();
    let customer = '';
    $('#selectCustomersEdit').find(':selected').each(function () {
      customer = $(this).val();
    });
    templete.custAddressGet.set('');
    templete.modalLoader.set(false);
    if (customer !== '') {
      templete.modalLoader.set(true);
      Meteor.call('customerAddress.ShippingFullist', customer, (err, res) => {
        if (!err) {
          templete.custAddressGet.set(res);
          templete.modalLoader.set(false);
        }
        else {
          templete.modalLoader.set(false);
        }
      })
    }
  },

});
