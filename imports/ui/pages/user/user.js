/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor'
import { allUsers } from "../../../api/user/user";


Template.user.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.roleNameArray = new ReactiveVar();
  this.verticalNameList = new ReactiveVar();
  this.verticalEdits = new ReactiveVar();
  this.rolesEdit = new ReactiveVar();
  this.modalLoader = new ReactiveVar();

  this.pagination = new Meteor.Pagination(allUsers, {
    filters: {
      active: "Y",
      userType: "MainUser"
    },
    sort: { createdAt: -1, 'profile.firstName': 1 },
    fields: { profile: 1, username: 1, emails: 1, active: 1 },
    perPage: 20
  });
  this.defaultBrnch = new ReactiveVar();

});


Template.user.onRendered(function () {
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
  /**
   * TODO: Complete JS doc

   */

  Meteor.call('role.roleNameGet', (roleError, roleResult) => {
    if (!roleError) {
      this.roleNameArray.set(roleResult);
    }
  });
  Meteor.call('verticals.activeList', (err, res) => {
    if (!err) {
      this.verticalNameList.set(res);
    };
  });
  $(".verticalEditSelection").select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    noResults: 'No Users found.',
    allowClear: true,
    dropdownParent: $(".verticalEditSelection").parent(),
  });
  $(".sapEmployees").select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    noResults: 'No Users found.',
    allowClear: true,
    dropdownParent: $(".sapEmployees").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.userSelections').select2({
    // placeholder: "Select User",
    // tokenSeparators: [','],
    // noResults: 'No User found.',
    // allowClear: true
    multiple: true,
    dropdownParent: $(".userSelections").parent(),
    // tags: true
  });
  /**
    * TODO: Complete JS doc
    */
  $(".selectDefaultBrnchs").select2({
    placeholder: "Select User",
    tokenSeparators: [','],
    // noResults: 'No User found.',
    allowClear: true,
    dropdownParent: $(".selectDefaultBrnchs").parent(),
  });

  /**
     * TODO: Complete JS doc
     */
  $('.select2Dropdown').select2({
    placeholder: "Select roles",
    dropdownParent: $(".select2Dropdown").parent(),
  });
});

Template.user.helpers({

  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('users');
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
  verticalListEdit: function () {
    let verticalId = Template.instance().verticalEdits.get();
    if (verticalId) {
      Meteor.setTimeout(function () {
        $('#verticalEditSelection').val(verticalId).trigger('change');
      }, 100);
    }
    return Template.instance().verticalNameList.get();

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
   * TODO:Complete Js doc
   * Get sap employee list.
   */
  employeeList: () => {
    return Template.instance().employeeArray.get();

  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  userList: function () {

    return Template.instance().pagination.getPage();
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
  rolesLists: function () {
    let rolesId = Template.instance().rolesEdit.get();
    if (rolesId) {
      Meteor.setTimeout(function () {
        $('#roleIdselect').val(rolesId).trigger('change');
      }, 100);
    }
    return Template.instance().roleNameArray.get();
  },

  /**
  * TODO: Complete JS doc
  * @returns {{Collection:*}}
  */
  userLists: function () {

    return Template.instance().userArray.get();

  },
  duserLists: function () {
    return Template.instance().defaultBrnch.get();
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
  * TODO: Complete JS doc
  * @returns {{Collection:*}}
  */
  userLists: function () {

    return Template.instance().userNameArray.get();
  }
});

Template.user.events({


  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .userFilter': (event) => {
    event.preventDefault();
    let empCode = event.target.empcode.value;
    let firstName = event.target.firstName.value;
    let emailfilter = event.target.emailfilter.value;
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
          userType: "MainUser"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (empCode && $.trim(empCode)) {
      Template.instance().pagination.settings.set('filters', {
        'profile.empCode': { $regex: new RegExp($.trim(empCode), "i") },
        userType: "MainUser"
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else if (firstName && $.trim(firstName)) {
      Template.instance().pagination.settings.set('filters', {
        'profile.firstName': {
          $regex: new RegExp($.trim(firstName), "i")
        }, userType: "MainUser"
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else if (emailfilter && $.trim(emailfilter)) {
      Template.instance().pagination.settings.set('filters', {
        'emails.0.address': { $regex: new RegExp($.trim(emailfilter), "i"), },
        userType: "MainUser"
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set({ userType: "MainUser" });
      $('.taskHeaderList').css('display', 'none');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
      userType: "MainUser"
    });
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
  'focus #passwords': () => {
    $('div.hint').show();
    $(document).bind('focusin.hint click.hint', function (e) {
      if ($(e.target).closest('.hint, #passwords').length) return;
      $(document).unbind('.hint');
      $('div.hint').fadeOut('medium');
    });
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'blur #passwords': () => {
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
  'blur #passwords': () => {
    let passwordReg = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})?$/;
    let passwordaddress = $("#passwords").val();
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
    let passs = $("#passwords").val();
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
  'click .remove': (event) => {
    event.preventDefault();
    let header = $('#userHeader');
    let userName = $('#confuserName');
    let userNameDup = $('#userNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#userDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let username = $('#name_' + _id).val();
    $(header).html('Confirm Deletion Of ' + $.trim(username));
    $(userName).html(username);
    $(userNameDup).html(username);
    $(confirmedUuid).val(_id);


  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    let _id = event.currentTarget.attributes.id.value;
    let header = $('#categoryH');
    $(header).html('Update User');
    $('#userEditPage').modal();
    $('div.hint').hide();
    template.verticalEdits.set('');
    template.rolesEdit.set('');
    template.modalLoader.set(true);
    Meteor.call('user.user_id', _id, (err, res) => {
      if (!err) {
        let userDetail = res;
        template.modalLoader.set(false);
        let userDetailFirstName = userDetail.profile.firstName;
        let userDetailLastName = userDetail.profile.lastName;
        let userDetailgender = userDetail.profile.gender;
        let userDetailusername = userDetail.username;
        let userDetailContactNo = userDetail.contactNo;
        let userDetailemail = userDetail.emails[0].address;
        let userDetaildateOfBirth = userDetail.profile.dateOfBirth;
        let userDetailisDeleted = userDetail.profile.isDeleted;
        let userDetailId = _id;
        let userDetailempCode = userDetail.profile.empCode;
        $("#userDetailFirstName").val(userDetailFirstName);
        $("#userDetailLastName").val(userDetailLastName);
        $("#userDetailusername").val(userDetailusername);
        $("#userDetailContactNo").val(userDetailContactNo);
        $(".email").val(userDetailemail);
        $(".hiddenemail").val(userDetailemail);
        $(".datevalue").val(userDetaildateOfBirth);
        $(".datevalue").val(userDetaildateOfBirth);
        $(".isDeleted").val(userDetailisDeleted);
        $(".id").val(userDetailId);
        $("#empCodenew").val(userDetailempCode);
        $("#empCode").val(userDetailempCode);
        $("input[name=genders][value=" + userDetailgender + "]").attr('checked', 'checked');
        $('#contactPersonEdit').val(userDetail.contactPerson)
        template.verticalEdits.set(userDetail.vertical[0]);
        template.rolesEdit.set(userDetail.roles[0]);
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
  'submit .updateUser': (event) => {
    event.preventDefault();
    let rolesArray = [];
    $('#roleIdselect').find(':selected').each(function () {
      rolesArray.push($(this).val());
    });
    let vertical = '';
    $('#verticalEditSelection').find(':selected').each(function () {
      vertical = $(this).val();
    });
    updateUserlist(event.target, rolesArray, vertical);
    $('#userEditPage').modal('hide');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateUser").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#roleSelection').prop('selectedIndex', 0);
    $('#designationSelection').prop('selectedIndex', 0);
  },
  /** 
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#userH');
    let firstName = $('#detailFirstName');
    let lastName = $('#detailLastName');
    let gender = $('#detailGender');
    let email = $('#detailEmailId');
    let roleN = $('#detailRole');
    let empcode = $('#detailEMPCode');
    let username = $('#detailUsername');
    let dateOfBirth = $('#detailDateOfBirth');
    let vertical = $('#verticalDetails');
    let contactNum = $('#contactNum');
    let detailContact = $('#detailContact');

    $('#userDetailPage').modal();
    Meteor.call('user.dataGets', id, (userError, userResult) => {
      if (!userError) {
        template.modalLoader.set(false);
        let user = userResult.userRes;
        $(header).html('Details of ' + $.trim(user.profile.firstName));
        $(firstName).html(user.profile.firstName);
        $(lastName).html(user.profile.lastName);
        $(gender).html(user.profile.gender);
        $(email).html(user.emails[0].address);
        $(roleN).html(userResult.roleName);
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
        $(dateOfBirth).html(user.profile.dateOfBirth);
        $(username).html(user.username);
        $(vertical).html(userResult.verticalName);
      }
      else {
        template.modalLoader.set(false);
      }
    });

  },
  /**
* TODO: Complete JS doc
*/
  'change .userSelections': (event, template) => {
    let brnchs = [];
    $('#ususeress :selected').each(function () {
      brnchs.push($(this).val());
    });

    Meteor.call('user.userList', (err, res) => {
      let brnc = res;
      let brnchAry = [];
      for (let x = 0; x < brnc.length; x++) {
        for (let i = 0; i < brnchs.length; i++) {
          if (brnc[x].bPLId === brnchs[i]) {
            brnchAry.push(brnc[x]);
          }
        }

      }
      template.defaultBrnch.set(brnchAry);
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
  /**
* TODO: Complete JS doc
* 
*/
  'click .activeFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
      userType: "MainUser"
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "N",
    });
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
      Meteor.call('user.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#userSuccessModal').modal();
          $('#userSuccessModal').find('.modal-body').text('User inactivated successfully');
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
      Meteor.call('user.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#userSuccessModal').modal();
          $('#userSuccessModal').find('.modal-body').text('User activated successfully');
        }
        $("#userActiveConfirmation").modal('hide');
      });
    }
  },
});
