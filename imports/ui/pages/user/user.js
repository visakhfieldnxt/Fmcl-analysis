/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor'
import { allUsers } from "../../../api/user/user";


Template.user.onCreated(function () {
  Blaze._allowJavascriptUrls();
  const self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
  this.roleNameArray = new ReactiveVar();
  this.branchArray = new ReactiveVar();
  this.employeeArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();

  this.pagination = new Meteor.Pagination(allUsers, {
    filters: { 
      'profile.isDeleted': false,
      // _id: { $ne: Meteor.userId() }
      $and: [{ userType: { $ne: 'V' } }, { userType: { $ne: 'C' } },
      { userType: { $ne: 'S' } }]
    },
    sort: { createdAt: -1, 'profile.firstName': 1 },
    perPage: 20
  });
  this.defaultBrnch = new ReactiveVar();

});


Template.user.onRendered(function () {
  /**
   * TODO: Complete JS doc

   */
  Meteor.call('user.userNameGetAdmin', (userError, userResult) => {
    if (!userError) {
      this.userNameArray.set(userResult);
    }
  });
  Meteor.call('role.roleNameGet', (roleError, roleResult) => {
    if (!roleError) {
      this.roleNameArray.set(roleResult);
    }
  });
  Meteor.call('branch.branchList', (branchError, branchResult) => {
    if (!branchError) {
      this.branchArray.set(branchResult);
    }
  });
  Meteor.call('employee.employeeList', (employeeError, employeeResult) => {
    if (!employeeError) {
      this.employeeArray.set(employeeResult);
    }
  });
  $(".userSelect").select2({
    placeholder: "Select Supervisor",
    tokenSeparators: [','],
    noResults: 'No Users found.',
    allowClear: true,
    dropdownParent: $(".userSelect").parent(),
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
  $('.branchSelections').select2({
    // placeholder: "Select Branch",
    // tokenSeparators: [','],
    // noResults: 'No Branch found.',
    // allowClear: true
    multiple: true,
    dropdownParent: $(".branchSelections").parent(),
    // tags: true
  });
  
  /**
    * TODO: Complete JS doc
    */
  $(".selectDefaultBrnchs").select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    // noResults: 'No Branch found.',
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
  /**
  * TODO:Complete JS doc
  * 
  */
  printLoad: () => {
    return Template.instance().modalLoader.get();
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

    return Template.instance().roleNameArray.get();
  },

  /**
  * TODO: Complete JS doc
  * @returns {{Collection:*}}
  */
  branchLists: function () {

    return Template.instance().branchArray.get();

  },
  dbranchLists: function () {
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
          // _id: { $ne: Meteor.userId()},
          'profile.empCode': {
            $regex: new RegExp($.trim(empCode), "i")
          },
          'profile.firstName': {
            $regex: new RegExp($.trim(firstName), "i")
          },
          'emails.0.address': {
            $regex: new RegExp($.trim(emailfilter), "i")
          },
          'profile.isDeleted': false,
        }
      );
    }
    else if (empCode && $.trim(empCode)) {
      Template.instance().pagination.settings.set('filters', {
        // _id: { $ne: Meteor.userId()},
        'profile.empCode': { $regex: new RegExp($.trim(empCode), "i") },
        'profile.isDeleted': false,
      });
    }
    else if (firstName && $.trim(firstName)) {
      Template.instance().pagination.settings.set('filters', {
        // _id: { $ne: Meteor.userId()},
        'profile.firstName': {
          $regex: new RegExp($.trim(firstName), "i")
        },
        'profile.isDeleted': false,
      });
    }
    else if (emailfilter && $.trim(emailfilter)) {
      Template.instance().pagination.settings.set('filters', {
        // _id: { $ne: Meteor.userId()},
        'emails.0.address': { $regex: new RegExp($.trim(emailfilter), "i") },
        'profile.isDeleted': false,
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', { 'profile.isDeleted': false, });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      'profile.isDeleted': false,
      $and: [{ userType: { $ne: 'V' } }, { userType: { $ne: 'C' } },
      { userType: { $ne: 'S' } }]
    });
    $('form :input').val("");
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
  'click #userRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('user.delete', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#userSuccessModal').modal();
          $('#userSuccessModal').find('.modal-body').text('User deleted successfully');
        }
        $("#userDelConfirmation").modal('hide');
      });
    }
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event) => {
    event.preventDefault();
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('user.user_id', _id, (err, res) => {
      let userDetail = res;
      let header = $('#categoryH');
      $('#userEditPage').modal();
      $('div.hint').hide();
      //  const userDetail = Meteor.users.findOne({ _id: _id });
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
      let userDetailroleId = userDetail.roles;
      // const userDetaildesignationId = userDetail.designation;
      let userDetailsupervisor = userDetail.supervisor;
      let userDetailbranch = userDetail.branch;

      Meteor.setTimeout(function () {
        let userDetailDbranch = userDetail.defaultBranch;
        let userDetailSlpCode = userDetail.slpCode;
        $('#defaultBranchs').val(userDetailDbranch).trigger("change");
        $('#sapEmployees').val(userDetailSlpCode).trigger("change");
      }, 2000);

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
      $(header).html('Update User');
      $('#roleIdselect').val(userDetailroleId).trigger("change");
      $('#userSelection').val(userDetailsupervisor).trigger("change");
      $('#usBranchess').val(userDetailbranch).trigger("change");


    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updateUser': (event) => {
    event.preventDefault();
    let supervisor = '';
    $('#userSelection').find(':selected').each(function () {
      supervisor = $(this).val();

    });
    let rolesArray = [];
    $('#roleIdselect').find(':selected').each(function () {
      rolesArray.push($(this).val());
    });
    let branch = '';
    $('#defaultBranchs').find(':selected').each(function () {
      branch = $(this).val();

    });
    let defaultBranch = [];
    $('.branchSelections').find(':selected').each(function () {
      defaultBranch.push($(this).val());

    });
    let sapEmp = [];
    $('.sapEmployees').find(':selected').each(function () {
      sapEmp.push($(this).val());

    });

    updateUserlist(event.target, rolesArray, supervisor, branch, defaultBranch, sapEmp);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateUser").each(function () {
      this.reset();
    });
    template.modalLoader.set('');
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
    template.modalLoader.set('');
    let header = $('#userH');
    let firstName = $('#detailFirstName');
    let lastName = $('#detailLastName');
    let gender = $('#detailGender');
    let email = $('#detailEmailId');
    let roleN = $('#detailRole');
    //const designationN = $('#detailDesignation');
    let empcode = $('#detailEMPCode');
    let username = $('#detailUsername');
    let dateOfBirth = $('#detailDateOfBirth');
    let slp = $('#slp');
    let brnch = $('#brnch');
    let company = $('#company');
    let contactNum = $('#contactNum');
    let sapEmp = $('#detailSapEmp');

    $('#userDetailPage').modal();

    Meteor.call('user.user_id', id, (userError, userResult) => {
      if (!userError) {
        template.modalLoader.set(userResult);
        if (userResult.slpCode !== undefined) {
          salesExceName(userResult.slpCode);
        }
        else {
          $(sapEmp).html('');
        }
        let user = userResult;
        let rolesList = [];
        rolesList = user.roles;
        let roleNames = [];
        let r = [];
        let branchList = [];
        branchList = user.branch;
        let branchNames = [];
        let b = [];
        if (branchList !== undefined) {
          for (let i = 0; i < branchList.length; i++) {
            b = branchList[i];
            Meteor.call('branch.branchUser', b, (branchError, branchResult) => {
              if (!branchError) {
                let branchName = branchResult;
                branchNames.push(branchName);
                if (branchNames) {
                  $(brnch).html(branchNames + "<br>");

                } else {
                  $(brnch).html('');
                }
              }
            });
          }
        }

        if (rolesList !== undefined) {
          for (let i = 0; i < rolesList.length; i++) {
            r = rolesList[i];
            Meteor.call('role.details', r, (roleError, roleResult) => {
              if (!roleError) {

                let roleName = roleResult;
                roleNames.push(roleName[0].name);
                let roleString = JSON.stringify(roleNames);
                let roleArranged = roleString.replace(/["[\]]/g, '');

                $(header).html('Details of ' + $.trim(user.profile.firstName));
                $(firstName).html(user.profile.firstName);
                $(lastName).html(user.profile.lastName);
                $(gender).html(user.profile.gender);
                $(email).html(user.emails[0].address);
                $(roleN).html(roleArranged);

                if (user.contactNo !== undefined) {
                  $(contactNum).html(user.contactNo);
                } else {
                  $(contactNum).html('');
                }
                $(empcode).html(user.profile.empCode);
                $(dateOfBirth).html(user.profile.dateOfBirth);
                $(username).html(user.username);
                $(slp).html(user.slpCode);
                $(company).html(user.u_COMPANY_NAME);
              }
            });
          }
        }
      }
    });
    function salesExceName(slpCode) {
      if (Array.isArray(slpCode) === true) {
        let salesExceArray = [];
        if (slpCode !== undefined && slpCode !== []) {
          for (let i = 0; i < slpCode.length; i++) {
            Meteor.call('employee.employeeNameGet', slpCode[i], (invError, invRes) => {
              if (!invError && invRes !== undefined) {
                salesExceArray.push(invRes);
                if (i + 1 === slpCode.length) {
                  $(sapEmp).html(String(salesExceArray));


                }
                else {
                  $(sapEmp).html('');
                }
              }
            });
          }
        }
        else {
          salesExceArray = [];
        }
      }
      else {
        Meteor.call('employee.employeeNameGet', slpCode, (invError, invRes) => {
          if (!invError && invRes !== undefined) {
            $(sapEmp).html(invRes);
          }
          else {
            $(sapEmp).html('');
          }

        });
      }
    }
  },
  /**
* TODO: Complete JS doc
*/
  'change .branchSelections'(event, template){
    let brnchs = [];
    $('#usBranchess :selected').each(function () {
      brnchs.push($(this).val());
    });

    Meteor.call('branch.branchList', (err, res) => {
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

});
