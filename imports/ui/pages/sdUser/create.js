/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.sdUser_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.roleNameArray = new ReactiveVar();
  this.verticalNameList = new ReactiveVar();
  this.userListGet = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
});

Template.sdUser_create.onRendered(function () {
  $('#selectSds').val('').trigger('change');
  /**
   * check sd or not
   */
  let subDistributorValue = Session.get("subDistributorValue");
  /**
   * display sd selection div
   */
  if (subDistributorValue === false) {
    $('.sdUserDIv').css('display', 'inline');
    $('#selectSds').prop('required', true);
  }
  else {
    $('.sdUserDIv').css('display', 'none');
    $('#selectSds').prop('required', false);
  }
  /**
   * TODO: Complete JS doc
   * 
   */
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('user.sdListGet', loginUserVerticals, (roleError, roleResult) => {
    if (!roleError) {
      this.userListGet.set(roleResult);
    };
  });
  Meteor.call('role.channelNameGet', (roleError, roleResult) => {
    if (!roleError) {
      this.roleNameArray.set(roleResult);
    };
  });

  Meteor.call('verticals.activeList', (err, res) => {
    if (!err) {
      this.verticalNameList.set(res);
    };
  });

  $('.selectDropdown').select2({
    placeholder: "Select Channel",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectDropdown").parent(),
  });

  $('.selectSds').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSds").parent(),
  });

  $(".userSelect").val("");

});
Template.sdUser_create.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  rolesList: function () {
    return Template.instance().roleNameArray.get();
  },

  verticalList: function () {
    return Template.instance().verticalNameList.get();

  },
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
  sdUsersList: function () {
    return Template.instance().userListGet.get();

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
  userList: function () {
    return Template.instance().userNameArray.get();
  }
});
Template.sdUser_create.events({
  /**
   * TODO: Complete JS doc
   */
  'click .date': function () {

  },
  /**
   * TODO:Complete JS doc
   */
  'click .toggle-password': () => {
    $('.toggle-password').toggleClass("fa-eye fa-eye-slash");
    let input = $($('.toggle-password').attr("toggle"));
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'focus #password': () => {
    $('div.hint').show();
    $(document).bind('focusin.hint click.hint', function (e) {
      if ($(e.target).closest('.hint, #password').length) return;
      $(document).unbind('.hint');
      $('div.hint').fadeOut('medium');
    });
  },
  /**
   * TODO: Complete JS doc
   */
  'blur #password': () => {
    $('div.hint').hide();
  },
  /**
   * TODO: Complete JS doc
   */
  'blur #email': () => {
    let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let emailaddress = $("#email").val();
    if (!emailReg.test(emailaddress))

      $("#emailspan").html('<style>#emailspan{color:#fc5f5f;}</style><span id="emailspan">Please enter the valid email address</span>');
    else
      $("#emailspan").html('<style>#emailspan{color:#fc5f5f;}</style>')
  },
  /**
   * TODO:Complete JS doc
   */
  'blur #password': () => {
    let passwordReg = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})?$/;
    let passwordaddress = $("#password").val();
    if (!passwordReg.test(passwordaddress))
      $("#passwordspan").html('<style>#passwordspan{color:#fc5f5f;}</style><span id="emailspan">Please enter the valid password</span>');

    else
      $("#passwordspan").html('<style>#passwordspan{color:#fc5f5f;}</style><span id="emailspan"></span>');
  },
  /**
   * TODO:Complete JS doc
   */
  'blur #confirmPassword': () => {
    let pass = $("#password").val();
    let confirmpass = $("#confirmPassword").val();
    if (confirmpass != pass) {
      $("#confirmPasswordspan").html('<style>#confirmPasswordspan{color:#fc5f5f;}</style><span id="confirmPasswordspan">Those passwords didn&apos;t match. Try again !</span>');

    } else {
      $("#confirmPasswordspan").html('<style>#confirmPasswordspan{color:#fc5f5f;}</style><span id="confirmPasswordspan"></span>');

    }
  },
  /**
    * TODO: Complete JS doc
   */
  'click .closeUser': () => {
    $('#sdUserAdd').each(function () {
      this.reset();
    });
    $('#roleSelection').val(null).trigger('change');
    $('#usernameValue').val('');
    $('#empCodes').val('');
    $('#selectSds').val('').trigger('change');

  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .sdUserAdd': (event) => {
    event.preventDefault();
    let employeeId = '';
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      employeeId = Meteor.userId();
    }
    else {
      $('#selectSds').find(':selected').each(function () {
        employeeId = ($(this).val());
      });
    }
    let rolesArray = [];
    $('#roleSelection').find(':selected').each(function () {
      rolesArray.push($(this).val());
    });
    if (rolesArray.length <= 0) {
      $("#rolesArrayspan").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan">Please select a role</span');
    } else {
      $("#rolesArrayspan").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan"></span>');
      createOrUpdateSDUser(event.target, rolesArray, employeeId);
      $('#ic-create').modal('hide');
      dataClear();
    }
    function dataClear() {
      $('#roleSelection').val(null).trigger('change');
      $('#selectSds').val('').trigger('change');
      $('#password').val('');
      $('#confirmPassword').val('');
      $('.username').val('');
      $('.email').val('');
      $('#userSelect').val('').trigger('change');
      $('#empCodes').val('');
    }
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   */
  'change #selectSds': (event, template) => {
    event.preventDefault();
    let sdId = '';
    $('#selectSds').find(':selected').each(function () {
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
