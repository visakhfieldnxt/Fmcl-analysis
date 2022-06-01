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
  this.sdUserEdits = new ReactiveVar();
  this.branchArrayList = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.bodyLoaders = new ReactiveVar();
  this.currentData = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.custAddressGet = new ReactiveVar();
  this.addressmaster = new ReactiveVar();
  this.sdList = new ReactiveVar();
  let subDistributorValue = Session.get("subDistributorValue");
  let loginUserVerticals = Session.get("loginUserVerticals");
  if (subDistributorValue === true) {
    this.pagination = new Meteor.Pagination(RouteGroup, {
      filters: {
        active: "Y",
        subDistributor: Meteor.userId()
      },
      sort: {
        createdAt: -1
      },
      fields: {
        routeName: 1,
        routeCode: 1,
        subDistributor: 1,
        active: 1
      },
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(RouteGroup, {
      filters: {
        active: "Y",
        // vertical: { $in: loginUserVerticals }
      },
      sort: {
        createdAt: -1
      },
      perPage: 20
    });
  }

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
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('user.sdListGet', loginUserVerticals, (err, res) => {
    if (!err) {
      this.sdList.set(res);
    }
  });
  let subDistributorValue = Session.get("subDistributorValue");
  if (subDistributorValue === true) {
    Meteor.call('routeGroup.sdWiselist', Meteor.userId(), (err, res) => {
      if (!err) {
        this.routeCodeList.set(res);
      }
    });
  }
  else {
    Meteor.call('routeGroup.list', (err, res) => {
      if (!err) {
        this.routeCodeList.set(res);
      }
    });
  }

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

  $('.selectSdIdsEdit').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSdIdsEdit").parent(),
  });

  $('.selectPriorityEdit').select2({
    placeholder: "Select Priority",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriorityEdit").parent(),
  });

  $('.selectCustomersEdit').select2({
    placeholder: "Select Outlet",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomersEdit").parent(),
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
  /**
    * get sdList 
    */
  sdUsersGetEdit: () => {
    let sdVal = Template.instance().sdUserEdits.get();
    console.log("sdVal");
    if (sdVal) {
      Meteor.setTimeout(function () {
        if (sdVal) {
          $('#selectSdIdsEdit').val(sdVal).trigger('change');
        }
      }, 100);
    }
    return Template.instance().sdList.get();
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
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.userIdVal_' + user).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },

  /**
* get vansale user name
*/

  getOutletName: (outlet) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("outlet.idName", outlet, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletIdVal_' + outlet).html(result);
      $('.loadersSpinVals').css('display', 'none');
    }
    ).catch((error) => {
      $('.outletIdVal_' + outlet).html('');
      $('.loadersSpinVals').css('display', 'none');
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
    let loginUserVerticals = Session.get("loginUserVerticals");
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      if (routeCode && routeName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            routeCode: routeCode, subDistributor: Meteor.userId()
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (routeName && routeCode === '') {
        Template.instance().pagination.settings.set('filters', {
          routeName: routeName, subDistributor: Meteor.userId()
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else if (routeName && routeCode) {
        Template.instance().pagination.settings.set('filters', {
          routeCode: routeCode,
          routeName: routeName, subDistributor: Meteor.userId()
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        Template.instance().pagination.settings.set('filters', {});
        $('.taskHeaderList').css('display', 'inline');
      }
    }
    else {
      if (routeCode && routeName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            routeCode: routeCode, vertical: { $in: loginUserVerticals }
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (routeName && routeCode === '') {
        Template.instance().pagination.settings.set('filters', {
          routeName: routeName, vertical: { $in: loginUserVerticals }
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else if (routeName && routeCode) {
        Template.instance().pagination.settings.set('filters', {
          routeCode: routeCode,
          routeName: routeName, vertical: { $in: loginUserVerticals }
        });
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        Template.instance().pagination.settings.set('filters', {});
        $('.taskHeaderList').css('display', 'inline');
      }
    }
  },

  /**
   * TODO: Complete JS doc
   * for reset filter
   */
  'click .reset': (event, target) => {
    let subDistributorValue = Session.get("subDistributorValue");
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (subDistributorValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y", subDistributor: Meteor.userId()
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y", vertical: { $in: loginUserVerticals }
      });
    }
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

  'click .viewMap': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.attributes.id.value;
    console.log("id", id);
    FlowRouter.go('routeWiseMap', { _id: id });
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
    customerArray = [];
    let ids = event.currentTarget.id;
    let superAdminValue = Session.get("superAdminValue");
    Session.set("routeIds", ids);
    $("#routeNameEdit").val('');
    $("#routeDescripEdit").val('');
    let routeNameEdit = ("#routeNameEdit");
    let routeDescripEdit = ("#routeDescripEdit");
    template.sdUserEdits.set('');
    template.modalLoader.set(false);
    template.customerDataArray.set('');
    if (ids) {
      $('.loadersSpinVals').css('display', 'block');
      template.modalLoader.set(true);
      $("#routeEditPage").modal();
      let header = $('#orderHsEdit');
      $(header).html('Edit Route');
      Meteor.call('routeGroup.idGetAdmin', ids, superAdminValue, (err, res) => {
        if (!err) {
          $(routeNameEdit).val(res.groupRes.routeName);
          $(routeDescripEdit).val(res.groupRes.description);
          if (res.customerList.length !== undefined && res.customerList.length > 0) {
            for (let n = 0; n < res.customerList.length; n++) {
              customerArray.push(res.customerList[n]);
            }
          }
          else {
            $('.loadersSpinVals').css('display', 'none');
          }
          template.customerArray.set(customerArray);
          template.customerDataArray.set(res.outletFullList);
          template.modalLoader.set(false);
          if (res.groupRes.subDistributor !== undefined) {
            template.sdUserEdits.set(res.groupRes.subDistributor);
          }
        }
        else {
          template.modalLoader.set(false);
          template.customerDataArray.set();
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
    let detailSdUser = $('#detailSdUser');
    $('.loadersSpinVals').css('display', 'block');
    Meteor.call('routeGroup.idGet', id, (err, res) => {
      if (!err) {
        $(header).html('Details of Route');
        $(routeCode).html(res.groupRes.routeCode);
        $(description).html(res.groupRes.description);
        $(routeName).html(res.groupRes.routeName);
        $(detailSdUser).html(res.sdUserName);
        template.modalLoader.set(false);
        if (res.customerList !== undefined && res.customerList.length > 0) {
          template.itemsDetailsList.set(res.customerList);
        }
        else {
          $('.loadersSpinVals').css('display', 'none');
        }
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
    $('#selectCustomersEdit').find(':selected').each(function () {
      customer = $(this).val();
    });
    if (customer === '' || customer === 'Select Outlet') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#customerArrayspanEdit").html('<style>#customerArrayspansEdit{color:#fc5f5f;}</style><span id="customerArrayspansEdit">Please select outlet</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#customerArrayspanEdit').fadeOut('slow');
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
              toastr['error']('Outlet Already exists!');
              break;
            }
            else {
              itemCheckValidation = false;
            }
          }
        }
        let randomId = Random.id();
        let itemObject = {
          randomId: randomId,
          customer: customer,
          priority: priority,
        };
        if (itemCheckValidation === false) {
          customerArray.push(itemObject);
          template.customerArray.set(customerArray);
          itemCheck = true;
          itemDataClear();
        }
        function itemDataClear() {
          $("#selectCustomersEdit").val('').trigger('change');
          $('#selectPriorityEdit').val('').trigger('change');
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
    // if (customerArray.length === 0) {
    //   toastr["error"](customerValidationMessage);
    // }
    // else {
    let routeId = Session.get("routeIds");
    $("#submit").attr("disabled", true);
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (itemCheck === true) {
      // console.log("weight1", weight);
      editOrUpdateRouteGroup(event.target, routeId, customerArray, loginUserVerticals);
      dataClear();
      $('#routeEditPage').modal('hide');
    }
    else {
      Meteor.call('routeGroup.idGet', routeId, (err, res) => {
        editOrUpdateRouteGroup(event.target, routeId, res.customerList, loginUserVerticals);
        dataClear();
        $('#routeEditPage').modal('hide');
      });
      // }
    }
    function dataClear() {
      $("#selectCustomersEdit").val('').trigger('change');
      $('#selectPriorityEdit').val('').trigger('change');
      $('#selectsdUserEdits').val('').trigger('change');
      $('#routeNameEdit').val('');
      $('#descriptionValEdit').val('');
      $("#submit").attr("disabled", false);
      $('#routeDescripEdit').val('');
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
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      Meteor.call('routeGroup.sdWiselist', Meteor.userId(), (err, res) => {
        if (!err) {
          template.routeCodeList.set(res);
        }
      });
    }
    else {
      Meteor.call('routeGroup.list', (err, res) => {
        if (!err) {
          template.routeCodeList.set(res);
        }
      });
    }
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
    $('#selectsdUserEdits').val('').trigger('change');
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
    Meteor.setTimeout(function () {
      $('#bodySpinLoaders').css('display', 'none');
    }, 3000);
    let loginUserVerticals = Session.get("loginUserVerticals");
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y", subDistributor: Meteor.userId()
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
    $('#bodySpinLoaders').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinLoaders').css('display', 'none');
    }, 3000);
    let loginUserVerticals = Session.get("loginUserVerticals");
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "N", subDistributor: Meteor.userId()
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "N",
        // vertical: { $in: loginUserVerticals }
      });
    }
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
  /**
  * 
  * @param {*} event 
  * @param {*} template 
  */
  'change #selectSdIdsEdit': (event, template) => {
    event.preventDefault();
    let sdId = '';
    $('#selectSdIdsEdit').find(':selected').each(function () {
      sdId = ($(this).val());
    });
    $('#verticalSpanEdit').html('');
    $('#branchSpanEdit').html('');
    $('#locationSpanEdit').html('');
    template.modalLoader.set(false);
    if (sdId !== '' && sdId !== undefined) {
      template.modalLoader.set(true);
      Meteor.call('user.sdDataGets', sdId, (err, res) => {
        if (!err) {
          $('#verticalSpanEdit').html(`Verticals : <b> ${res.verticalName}</b>`);
          $('#branchSpanEdit').html(`Branch : <b> ${res.branchName}</b>`);
          $('#locationSpanEdit').html(`Location : <b>${res.locationName}</b>`);
          $('#verticalSpanEdit').css("padding", "4px 14px");
          $('#branchSpanEdit').css("padding", "4px 14px");
          $('#locationSpanEdit').css("padding", "4px 14px");
          template.modalLoader.set(false);
        }
        else {
          $('#verticalSpanEdit').html('');
          $('#branchSpanEdit').html('');
          $('#locationSpanEdit').html('');
          template.modalLoader.set(false);
        }
      });
    }
  },
});
