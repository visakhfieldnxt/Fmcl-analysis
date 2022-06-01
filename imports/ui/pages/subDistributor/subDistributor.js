/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor'
import { allUsers } from "../../../api/user/user";
import XLSX from 'xlsx';

Template.subDistributor.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
  this.roleNameArray = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.employeeArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.locationData = new ReactiveVar();
  this.locationEdits = new ReactiveVar();
  this.branchEdits = new ReactiveVar();
  this.verticalEdits = new ReactiveVar();
  this.priceTypeArray = new ReactiveVar();
  this.verticalNameList = new ReactiveVar();
  this.priceTypeEdits = new ReactiveVar();
  this.priceTypeData = new ReactiveVar();
  this.productListData = new ReactiveVar();
  this.priceTypeVertical = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.productDataEdit = new ReactiveVar();
  let superAdminValue = Session.get("superAdminValue");
  let loginUserVerticals = Session.get("loginUserVerticals");
  if (superAdminValue === true) {
    this.pagination = new Meteor.Pagination(allUsers, {
      filters: {
        active: "Y",
        userType: "SD"
      },
      sort: { createdAt: -1, 'profile.firstName': 1 },
      fields: {
        profile: 1,
        branch: 1,
        location: 1,
        vertical: 1,
        active: 1,
      },
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(allUsers, {
      filters: {
        active: "Y",
        userType: "SD",
        vertical: { $in: loginUserVerticals }
      },
      sort: { createdAt: -1, 'profile.firstName': 1 },
      perPage: 20
    });
  }
  this.defaultBrnch = new ReactiveVar();

});


Template.subDistributor.onRendered(function () {
  this.verticalArray.set('')
  $('#bodySpinLoaders').css('display', 'block');
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

  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    $('.priceTypeDivEdit').css('display', 'none');
    $('#selectPriceTypeEdit').prop('required', false);
    $('.verticalAddDiv').css('display', 'inline');
  }
  else {
    $('.priceTypeDivEdit').css('display', 'inline');
    $('#selectPriceTypeEdit').prop('required', true);
    $('.verticalAddDiv').css('display', 'none');
  }
  /**
   * TODO: Complete JS doc

   */
  Meteor.call('verticals.activeList', (err, res) => {
    if (!err) {
      this.verticalNameList.set(res);
    };
  });
  Meteor.call('branch.branchList', (branchError, branchResult) => {
    if (!branchError) {
      this.branchNameArray.set(branchResult);
    }
  });
  Meteor.call('user.userNameGetAdmin', (userError, userResult) => {
    if (!userError) {
      this.userNameArray.set(userResult);
    }
  });
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('priceType.verticalList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.priceTypeArray.set(res);
    }
  });
  $('.verticalSelectionEdit').select2({
    placeholder: "Select Verticals",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalSelectionEdit").parent(),
  });

  $('.selectLocationEdit').select2({
    placeholder: "Select Location",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectLocationEdit").parent(),
  });
  /**
 * TODO: Complete JS doc
 */
  $('.branchSelectionEdit').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchSelectionEdit").parent(),
  });

  $('.selectPriceTypeEdit').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriceTypeEdit").parent(),
  });
  $('.selectPriceTypeIdEdit').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriceTypeIdEdit").parent(),
  });
  $('.selectVerticalIdEdit').select2({
    placeholder: "Select Verticals",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalIdEdit").parent(),
  });

});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.subDistributor.helpers({

  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('users');
  },

  productListData: () => {
    return Template.instance().productListData.get();
  },
  priceTypeData: () => {
    return Template.instance().priceTypeData.get();
  },
  addedVerticals: () => {
    return Template.instance().verticalArray.get();
  },
  /**
 * get branch name
 * @param {} branch 
 */
  getBranchName: (branch) => {
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
  verticalPriceType: () => {
    return Template.instance().priceTypeVertical.get();
  },
  /**
* get location name
* @param {} location 
*/
  getLocationName: (location) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("location.idlocation", location, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.locationIdVal_' + location).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.locationIdVal_' + location).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get users count 
* @param {} _id 
*/
  getUsersCount: (_id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("users.sdCount", _id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.usersCount_' + _id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.usersCount_' + _id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get verticals name
* @param {} verticals 
*/
  getVerticalsName: (vertical, _id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.idValues", vertical, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.getVerticalsName_' + _id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.getVerticalsName_' + _id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },

  locationList: function () {
    let locationEdits = Template.instance().locationEdits.get();
    if (locationEdits) {
      Meteor.setTimeout(function () {
        $('#selectLocationEdit').val(locationEdits).trigger('change');
      }, 100);
    }
    return Template.instance().locationData.get();
  },
  priceTypeList: () => {
    let priceType = Template.instance().priceTypeEdits.get();
    if (priceType) {
      Meteor.setTimeout(function () {
        $('#selectPriceTypeEdit').val(priceType).trigger('change');
      }, 100);
    }
    return Template.instance().priceTypeArray.get();

  },
  /**
   * 
   * @param {*} vertical 
   * @param {*} _id 
   * get single vertical name
   */
  getSingleVerticalName: (vertical) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.idName", vertical, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalId_' + vertical).html(result);
      $('.loadersSpinPromise').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalId_' + vertical).html('');
      $('.loadersSpinPromise').css('display', 'none');
    }
    );
  },

  /**
  * 
  * @param {*} priceType 
  * @param {*} _id 
  * get single priceType name
  */
  getPriceTypeName: (priceType) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("priceType.idName", priceType, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.priceTypeId_' + priceType).html(result);
      $('.loadersSpinPromise').css('display', 'none');
    }
    ).catch((error) => {
      $('.priceTypeId_' + priceType).html('');
      $('.loadersSpinPromise').css('display', 'none');
    }
    );
  },
  /**
 * TODO:Complete JS doc
 * 
 */
  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
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
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('users');
    config.textarea = true;

    return config;
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
   * TODO: Complete JS doc
   * @returns {*}
   */
  userList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  productEditGet: () => {
    return Template.instance().productDataEdit.get();
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
  * @returns {{Collection:*}}
  */
  branchLists: function () {
    let branch = Template.instance().branchEdits.get();
    if (branch) {
      Meteor.setTimeout(function () {
        $('#branchSelectionEdit').val(branch).trigger('change');
      }, 100);
    }
    return Template.instance().branchNameArray.get();

  },
  /**
   * TODO: Complete JS doc
   * @returns {verticals}
   */
  verticalList: function () {
    let vertical = Template.instance().verticalEdits.get();
    if (vertical) {
      Meteor.setTimeout(function () {
        $('#verticalSelectionEdit').val(vertical).trigger('change');
      }, 100);
    }
    return Template.instance().verticalNameList.get();
  },
  /**
   * TODO: Complete JS doc
   */
  sortIcon: () => {
    genericSortIcons();
  },
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },
  /**
* get product name
* @param {} product 
*/
  getProductNames: (product) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.idName", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productIdVals_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVals_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
  * TODO: Complete JS doc
  * @returns {{Collection:*}}
  */
  userLists: function () {

    return Template.instance().userNameArray.get();
  }
});
let verticalArray = [];
let itemCheckValidation = false;
Template.subDistributor.events({


  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .userFilter': (event) => {
    event.preventDefault();
    let empCode = event.target.empcode.value;
    let firstName = event.target.firstName.value;
    let emailfilter = event.target.emailfilter.value;
    let superAdminValue = Session.get("superAdminValue");
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (superAdminValue === true) {
      if (empCode && $.trim(empCode) && firstName && $.trim(firstName) && emailfilter && $.trim(emailfilter)) {
        Template.instance().pagination.settings.set('filters',
          {
            'profile.empCode': {
              $regex: new RegExp($.trim(empCode), "i")
            },
            'profile.firstName': {
              $regex: new RegExp($.trim(firstName), "i")
            },
            'emails.0.address': {
              $regex: new RegExp($.trim(emailfilter), "i")
            },
            active: "Y",
            userType: "SD"
          }
        );
      }
      else if (empCode && $.trim(empCode)) {
        Template.instance().pagination.settings.set('filters', {
          'profile.empCode': { $regex: new RegExp($.trim(empCode), "i") },
          active: "Y",
          userType: "SD"
        });
      }
      else if (firstName && $.trim(firstName)) {
        Template.instance().pagination.settings.set('filters', {
          'profile.firstName': {
            $regex: new RegExp($.trim(firstName), "i")
          },
          active: "Y",
          userType: "SD"
        });
      }
      else if (emailfilter && $.trim(emailfilter)) {
        Template.instance().pagination.settings.set('filters', {
          'emails.0.address': { $regex: new RegExp($.trim(emailfilter), "i") },
          active: "Y",
          userType: "SD"
        });
      }
      else {
        Template.instance().pagination.settings.set('filters', {});
      }
    }
    else {
      if (empCode && $.trim(empCode) && firstName && $.trim(firstName) && emailfilter && $.trim(emailfilter)) {
        Template.instance().pagination.settings.set('filters',
          {
            'profile.empCode': {
              $regex: new RegExp($.trim(empCode), "i")
            },
            'profile.firstName': {
              $regex: new RegExp($.trim(firstName), "i")
            },
            'emails.0.address': {
              $regex: new RegExp($.trim(emailfilter), "i")
            },
            active: "Y",
            userType: "SD",
            vertical: { $in: loginUserVerticals }
          }
        );
      }
      else if (empCode && $.trim(empCode)) {
        Template.instance().pagination.settings.set('filters', {
          'profile.empCode': { $regex: new RegExp($.trim(empCode), "i") },
          active: "Y",
          userType: "SD",
          vertical: { $in: loginUserVerticals }
        });
      }
      else if (firstName && $.trim(firstName)) {
        Template.instance().pagination.settings.set('filters', {
          'profile.firstName': {
            $regex: new RegExp($.trim(firstName), "i")
          },
          active: "Y",
          userType: "SD",
          vertical: { $in: loginUserVerticals }
        });
      }
      else if (emailfilter && $.trim(emailfilter)) {
        Template.instance().pagination.settings.set('filters', {
          'emails.0.address': { $regex: new RegExp($.trim(emailfilter), "i") },
          active: "Y",
          userType: "SD",
          vertical: { $in: loginUserVerticals }
        });
      }
      else {
        Template.instance().pagination.settings.set('filters', {});
      }
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let superAdminValue = Session.get("superAdminValue");
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        userType: "SD"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        userType: "SD",
        vertical: { $in: loginUserVerticals }
      });
    }
    $('form :input').val("");
    $('.taskHeaderList').css('display', 'inline');
    let element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    let elements = document.getElementById("activeFilter");
    elements.classList.add("active");
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click .toggle-passwords': () => {
    $(".toggle-passwords").toggleClass("fa-eye fa-eye-slash");
    var input = $($(".toggle-passwords").attr("toggle"));
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'focus #passwordsEdit': () => {
    $('div.hint').show();
    $(document).bind('focusin.hint click.hint', function (e) {
      if ($(e.target).closest('.hint, #passwordsEdit').length) return;
      $(document).unbind('.hint');
      $('div.hint').fadeOut('medium');
    });
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'blur #passwordsEdit': () => {
    $('div.hint').hide();
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'blur #emails': () => {
    let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let emailaddress = $("#emails").val();
    if (!emailReg.test(emailaddress))
      $("#emailspans").html('<font color="#fc5f5f" size="2">Please enter valid email address</font>');
    else
      $("#emailspans").html('<font color="#fc5f5f"></font>');
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'blur #passwordsEdit': () => {
    let passwordReg = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})?$/;
    let passwordaddress = $("#passwordsEdit").val();
    if (!passwordReg.test(passwordaddress))
      $("#passwordspans").html('<font color="#fc5f5f" size="2">Please enter valid password</font>');
    else
      $("#passwordspans").html('<font color="#fc5f5f"></font>');
  },
  /**
* TODO: Complete JS doc
* 
*/
  'blur #confirmPasswords': () => {
    let passs = $("#passwordsEdit").val();
    let confirmpasss = $("#confirmPasswords").val();
    if (confirmpasss != passs) {
      $("#confirmPasswordspans").html('<font color="#fc5f5f" size="2">Those passwords didn&apos;t match. Try again !</font>');

    } else {
      $("#confirmPasswordspans").html('<font color="#fc5f5f"></font>');

    }
  },

  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-button': () => {
    $("#ic-create").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    let _id = event.currentTarget.attributes.id.value;
    let header = $('#categoryH');
    $(header).html('Update Sub Distributor');
    $('#userEditPage').modal();
    template.verticalArray.set('');
    verticalArray = [];
    $('div.hint').hide();
    $(".idEdit").val(_id);
    template.branchEdits.set('');
    template.locationEdits.set('');
    template.verticalEdits.set('');
    template.priceTypeEdits.set('');
    template.productDataEdit.set('');
    template.modalLoader.set(true);
    Meteor.call('user.sdEdit', _id, (err, res) => {
      if (!err) {
        template.verticalArray.set('');
        verticalArray = [];
        template.modalLoader.set(false);
        template.branchEdits.set(res.userRes.branch);
        template.locationEdits.set(res.userRes.location);
        template.verticalEdits.set(res.userRes.vertical);
        $('#subDistributorNameEdit').val(res.userRes.profile.firstName);
        $('#contactPersonEdit').val(res.userRes.contactPerson);
        $('#contactNoEdit').val(res.userRes.contactNo);
        $('#emailEdit').val(res.userRes.emails[0].address);
        $(".hiddenemail").val(res.userRes.emails[0].address);
        $('#addresValEdit').val(res.userRes.address);
        $('#usernameValueEdit').val(res.userRes.username);
        template.productDataEdit.set(res.productData);
        console.log("ress", res);
        template.priceTypeEdits.set(res.priceType);
        let superAdminValue = Session.get("superAdminValue");
        if (superAdminValue === true) {
          template.verticalArray.set(res.priceResultArray);
          verticalArray = res.priceResultArray;
        }
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
  'submit .updateSd': (event, template) => {
    event.preventDefault();
    let verticals = [];
    let superAdminValue = Session.get("superAdminValue");
    let productArray = Template.instance().productDataEdit.get();
    let priceType = '';
    if (superAdminValue === true) {
      verticals = verticalArray;
    }
    else {
      $('#selectPriceTypeEdit').find(':selected').each(function () {
        priceType = ($(this).val());
      });
    }
    if (superAdminValue === true && verticals.length === 0) {
      toastr['error']('At least one Vertical needed for adding Sub Distributor');
    }
    else {
      updateSDlist(event.target, verticals, priceType, superAdminValue, productArray);
      $('#userEditPage').modal('hide');
      $('#selectPriceTypeEdit').val('').trigger('change');
      verticalArray = [];
      template.verticalArray.set('');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateSd").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#roleSelection').prop('selectedIndex', 0);
    $('#designationSelection').prop('selectedIndex', 0);
    $('#selectPriceTypeEdit').val('').trigger('change');
  },
  /** 
  * TODO:Complete JS doc
  * @param event
  */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    template.priceTypeData.set('');
    template.productListData.set('');
    $('.loadersSpinPromise').css('display', 'block');
    let header = $('#userH');
    let firstName = $('#detailFirstName');
    let email = $('#detailEmailId');
    let empcode = $('#detailEMPCode');
    let username = $('#detailUsername');
    let vertical = $('#verticalDetails');
    let contactNum = $('#contactNum');
    let detailBranch = $('#detailBranch');
    let detailContact = $('#detailContact');
    let detailLocation = $('#detailLocation');
    let detailAddress = $('#detailAddress');
    $('#userDetailPage').modal();
    Meteor.call('user.sdUserList', id, (userError, userResult) => {
      if (!userError) {
        template.modalLoader.set(false);
        let user = userResult.userRes;
        $(header).html('Details of ' + $.trim(user.profile.firstName));
        $(firstName).html(user.profile.firstName);
        $(email).html(user.emails[0].address);
        if (user.contactNo !== undefined && user.contactNo !== '') {
          $(contactNum).html(user.contactNo);
        } else {
          $(contactNum).html('');
        }
        $(empcode).html(user.profile.empCode);
        if (user.contactPerson !== undefined && user.contactPerson !== '') {
          $(detailContact).html(user.contactPerson);
        } else {
          $(detailContact).html('');
        }
        $(username).html(user.username);
        $(vertical).html(userResult.verticalName);
        $(detailBranch).html(userResult.branchName);
        $(detailLocation).html(userResult.locationName);
        $(detailAddress).html(user.address);
        template.priceTypeData.set(userResult.priceTypeData);
        if (userResult.priceTypeData === undefined || userResult.priceTypeData.length === 0) {
          $('.loadersSpinPromise').css('display', 'none');
        }
        template.productListData.set(userResult.productData);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },


  'change #branchSelectionEdit': (event, template) => {
    event.preventDefault();
    let branch = '';
    template.modalLoader.set(false);
    $('#branchSelectionEdit').find(':selected').each(function () {
      branch = ($(this).val());
    });
    template.locationData.set('');
    if (branch !== '' && branch !== undefined) {
      template.modalLoader.set(true);
      Meteor.call('location.branchData', branch, (err, res) => {
        if (!err) {
          console.log("resss", res);
          template.modalLoader.set(false);
          template.locationData.set(res);
        }
        else {
          template.modalLoader.set(false);
        }
      })
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
    let superAdminValue = Session.get("superAdminValue");
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        userType: "SD"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y",
        userType: "SD",
        vertical: { $in: loginUserVerticals }
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
    let superAdminValue = Session.get("superAdminValue");
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "N",
        userType: "SD"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "N",
        userType: "SD", vertical: { $in: loginUserVerticals }
      });
    }
  },
  /**
 * TODO: Complete JS doc
 * @param event
 */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#userHeader');
    let userName = $('#confuserName');
    let userNameDup = $('#userNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#userDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let username = $('#userName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(username));
    $(userName).html(username);
    $(userNameDup).html(username);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #userRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('user.sdInactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#sdSuccessModal').modal();
          $('#sdSuccessModal').find('.modal-body').text('Sub Distributor successfully');
        }
        $("#userDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#userHeaders');
    let userName = $('#confuserNames');
    let userNameDup = $('#userNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#userActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let username = $('#userName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(username));
    $(userName).html(username);
    $(userNameDup).html(username);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #userActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('user.sdActivate', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#sdSuccessModal').modal();
          $('#sdSuccessModal').find('.modal-body').text('Sub Distributor activated successfully');
        }
        $("#userActiveConfirmation").modal('hide');
      });
    }
  },
  /**
  * data get based on vertical change
  */
  'change #selectVerticalIdEdit': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#selectVerticalIdEdit').find(':selected').each(function () {
      vertical = ($(this).val());
    });
    template.priceTypeVertical.set('');
    template.modalLoader.set(false);
    if (vertical !== '' && vertical !== undefined) {
      template.modalLoader.set(true);
      Meteor.call('priceType.verticalDataList', vertical, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.priceTypeVertical.set(res);
        }
        else {
          template.modalLoader.set(false);
          template.priceTypeVertical.set('');
        }
      })
    }

  },
  /**
* TODO:Complete Js doc
* Deleting verticals from the array.
*/
  'click .deleteVerticalsEdit': (event, template) => {
    let verticalArrays = Template.instance().verticalArray.get();
    let itemIndex = event.currentTarget.id;
    let removeIndex = verticalArrays.map(function (item) {
      return item.randomId;
    }).indexOf(itemIndex);
    verticalArrays.splice(removeIndex, 1);
    template.verticalArray.set(verticalArrays);
  },

  /**
* TODO:Complete Js doc
* Deleting verticals from the array.
*/
  'click .deleteProductEdit': (event, template) => {
    let productArray = Template.instance().productDataEdit.get();
    let itemIndex = event.currentTarget.id;
    let removeIndex = productArray.map(function (item) {
      return item._id;
    }).indexOf(itemIndex);
    productArray.splice(removeIndex, 1);
    template.productDataEdit.set(productArray);
  },
  /**
* TODO:Complete Js doc
*for add verticals
*/

  'click .addVerticalEdit': (event, template) => {
    event.preventDefault();
    itemCheckValidation = false;
    let vertical = '';
    let priceType = '';
    $('#selectVerticalIdEdit').find(':selected').each(function () {
      vertical = $(this).val();
    });
    if (vertical === '' || vertical === 'Select Vertical') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#verticalSpanEdit").html('<style>#verticalSpans{color:#fc5f5f;}</style><span id="verticalSpans">Please select vertical</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#verticalSpanEdit').fadeOut('slow');
      }, 3000);
    }
    else {
      $('#selectPriceTypeIdEdit').find(':selected').each(function () {
        priceType = $(this).val();
      });
      if (priceType === '' || priceType === 'Select Price Type') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#priceTypeSpanEdit").html('<style>#priceTypeSpans{color:#fc5f5f;}</style><span id="priceTypeSpans">Please select customer price type</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#priceTypeSpanEdit').fadeOut('slow');
        }, 3000);
      }
      else {
        $(".addVerticalEdit").prop('disabled', true);
        Meteor.setTimeout(function () {
          $(".addVerticalEdit").prop('disabled', false);
        }, 3000);
        if (verticalArray.length > 0) {
          for (let i = 0; i < verticalArray.length; i++) {
            if (vertical === verticalArray[i].vertical) {
              itemCheckValidation = true;
              toastr['error']('Vertical Already Exist !');
              break;
            }
            else {
              itemCheckValidation = false;
            }
          }
        }
        //Meteor call to take particular unit detail   
        let randomId = Random.id();
        let itemObject = {
          randomId: randomId,
          vertical: vertical,
          priceType: priceType,
        };
        if (itemCheckValidation === false) {
          verticalArray.push(itemObject);
          template.verticalArray.set(verticalArray);
          itemDataClear();
        }
        function itemDataClear() {
          $("#selectVerticalIdEdit").val('').trigger('change');
          $('#selectPriceTypeIdEdit').val('').trigger('change');
        }
      }
    }
  },
  'click .fileuploadProducts': (event, template) => {
    event.preventDefault();
    $("#uploadProducts").each(function () {
      this.reset();
    });
    let id = event.currentTarget.id;
    $('#uploadUUids').val(id);
    template.fileName.set('');
    fileName = '';
    let header = $('#branchUploadHeader');
    $('#productUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadProducts': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadProductsFile");
    let myFile = $('.uploadProductsFile').prop('files')[0];
    let fileType = myFile["type"];
    console.log("fileType", fileType);
    let id = $('#uploadUUids').val();
    if (myFile.type === 'application/vnd.ms-excel' || myFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

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
      $('#sdErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#sdErrorModal').modal();
      $('#productUploadConfirmation').modal('hide');
      $("#uploadProducts")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let productArray = [];
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
          let productName = excelRows[i].ProductName;
          let minQty = excelRows[i].MinimumQuantity;
          if (productName !== undefined && productName !== '' &&
            minQty !== undefined && minQty !== '') {
            productArray.push({
              productName: productName.trim(), minQty: minQty.toString(),
            });
          }
        }
      }
      else {
        $('#sdErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#sdErrorModal').modal();
        $('#productUploadConfirmation').modal('hide');
        $("#uploadProducts")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (productArray.length !== 0 && productArray !== undefined) {
        $('#productUploadConfirmation').modal('hide');
        return Meteor.call('sdProducts.createUpload', id, productArray, (error, result) => {
          if (error) {
            $('#sdErrorModal').find('.modal-body').text(error.reason);
            $('#sdErrorModal').modal();
            $('#productUploadConfirmation').modal('hide');
            $("#uploadProducts")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#productUploadConfirmation').modal('hide');
            $("#uploadProducts")[0].reset();
            $('#sdSuccessModal').find('.modal-body').text(`Products Has Been Uploaded Successfully (${productArray.length} Nos)`);
            $('#sdSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#sdErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#sdErrorModal').modal();
        $('#productUploadConfirmation').modal('hide');
        $("#uploadProducts")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #productFileClose': (event, template) => {
    $("#uploadProducts").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadProduct': (event, template) => {
    event.preventDefault();
    let data = [{
      ProductName: '', MinimumQuantity: '',
    }];
    dataCSV = data.map(element => ({
      'ProductName': '',
      'MinimumQuantity': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "SdProductsFormat.xls");
  },
  'change .uploadProductsFile': function (event, template) {
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

});
