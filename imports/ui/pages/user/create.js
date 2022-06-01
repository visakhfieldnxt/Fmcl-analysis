/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import { Branch } from '../../../api/branch/branch'; 
Template.user_create.onCreated(function () {
  Blaze._allowJavascriptUrls();
  const self = this;
  self.autorun(() => {

  });
  this.roleNameArray = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.userNameArray = new ReactiveVar();
  this.defaultBrnch = new ReactiveVar();
  this.employeeArray = new ReactiveVar();
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
  // Meteor.call('employee.employeeList', (userError, userResult) => {
  //   if (!userError) {
  //     this.sapEmpArray.set(userResult);
  //   }
  // });
  Meteor.call('employee.employeeList', (employeeError, employeeResult) => {
    if (!employeeError) {
      this.employeeArray.set(employeeResult);
    }
  });
  $('.selectDropdown').select2({
    placeholder: "Select roles",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectDropdown").parent(),
  });
//   /**
//  * TODO: Complete JS doc
//  */
  $('.branchSelection').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $(".userSelected").select2({
    placeholder: "Select Supervisor",
    // width:"resolve",
    // dropdownParent: $("#ic-create"),
    tokenSeparators: [','],
    allowClear: true,
    // tags: "true", 
    noResults: 'No Users found.',
    dropdownParent: $(".userSelected").parent(),
  });
  /**
   * TDO:Complete Js doc
   */
  $('.selectDefaultBrnch').select2({
    placeholder: "Select Default Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectDefaultBrnch").parent(),
  });
  $('.sapEmployee').select2({
    placeholder: "Select SAP Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".sapEmployee").parent(),
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
  employeeList: () => {
    return Template.instance().employeeArray.get();

  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  branchList: function () {

    return Template.instance().branchNameArray.get();
  },
  dbranchList: function () {
    return Template.instance().defaultBrnch.get();
  },
  // sapEmp: function () {
  //   return Template.instance().sapEmpArray.get();
  // },

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
    //return Meteor.users.find({ 'profile.isDeleted': false }).fetch();
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
  */
  'change .branchSelection': (event, template) => {
    event.preventDefault(); 
    let brnchs = [];
    $('#userBranches').find(':selected').each(function () {
      brnchs.push($(this).val());
    }); 

    Meteor.call('branch.branchList', (branchError, branchResult) => {
      if (!branchError) {
        let brnc = branchResult;
        console.log("branchResult", branchResult);
        let brnchAry = [];
        for (let x = 0; x < brnc.length; x++) {
          for (let i = 0; i < brnchs.length; i++) {
            if (brnc[x].bPLId === brnchs[i]) {
              brnchAry.push(brnc[x]);
            }
          }

        }
        console.log("brnchAry", brnchAry);
        template.defaultBrnch.set(brnchAry);
      }
    });
  },
 
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .userAdd': (event) => {
    event.preventDefault();
    let supervisor = '';
    let rolesArray = [];
    $('#userSelect').find(':selected').each(function () {
      supervisor = $(this).val();

    });

    $('#roleSelection').find(':selected').each(function () {
      rolesArray.push($(this).val());
    });
    let branch = [];
    $('#userBranches').find(':selected').each(function () {
      branch.push($(this).val());
    });
    let defaultBrnch = '';
    $('#defaultBranch').find(':selected').each(function () {
      defaultBrnch = ($(this).val());
    });
    let sapEmp = [];
    $('.sapEmployee').find(':selected').each(function () {
      sapEmp.push($(this).val());

    });

    if (rolesArray.length <= 0) {
      $("#rolesArrayspan").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan">Please select a role</span');
    } else {
      $("#rolesArrayspan").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan"></span>');
      createOrUpdateUser(event.target, rolesArray, supervisor, branch, defaultBrnch, sapEmp);
      dataClear();
    }
    function dataClear() {
      $('#roleSelection').val(null).trigger('change');
      $('#sapEmployee').val(null).trigger('change');
      $('#userBranches').val(null).trigger('change');
      $('#defaultBranch').val('').trigger('change');
      $('#password').val('');
      $('#confirmPassword').val('');
      $('.username').val('');
      $('.email').val('');
      $('#userSelect').val('').trigger('change');
    }
  },

   
});


// $(document).on('change', '#userBranches', function (e) {
//   console.log("$(this).val()", $(this).val());
// })