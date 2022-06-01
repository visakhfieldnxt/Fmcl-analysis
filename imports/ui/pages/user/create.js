/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';

Template.user_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.roleNameArray = new ReactiveVar();
  this.verticalNameList = new ReactiveVar();
});

Template.user_create.onRendered(function () {
  /**
   * TODO: Complete JS doc
   * 
   */
  Meteor.call('role.roleNameGet', (roleError, roleResult) => {
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
    placeholder: "Select roles",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectDropdown").parent(),
  });
  /**
 * TODO: Complete JS doc
 */
  $('.verticalSelection').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalSelection").parent(),
  });


  $(".userSelect").val("");

});
Template.user_create.helpers({
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
Template.user_create.events({
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
    $('#userAdd').each(function () {
      this.reset();
    });
    $('#designationSelection').prop('selectedIndex', 0);
    $('#roleSelection').val(null).trigger('change');
    $('#sapEmployee').val(null).trigger('change');
    $('#userBranches').val(null).trigger('change');
    $('#defaultBranch').val('').trigger('change');
    $('#usernameValue').val('');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .userAdd': (event) => {
    event.preventDefault();
    let rolesArray = [];
    $('#roleSelection').find(':selected').each(function () {
      rolesArray.push($(this).val());
    });
    let vertical = '';
    $('#verticalSelection').find(':selected').each(function () {
      vertical = ($(this).val());
    });
    if (rolesArray.length <= 0) {
      $("#rolesArrayspan").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan">Please select a role</span');
    } else {
      $("#rolesArrayspan").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan"></span>');
      createOrUpdateUser(event.target, rolesArray, vertical);
      $('#ic-create').modal('hide');
      dataClear();
    }
    function dataClear() {
      $('#roleSelection').val(null).trigger('change');
      $('#verticalSelection').val('').trigger('change');
      $('#password').val('');
      $('#confirmPassword').val('');
      $('.username').val('');
      $('.email').val('');
      $('#userSelect').val('').trigger('change');
    }
  },
  
});
