/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor'
import { allUsers } from "../../../api/user/user";


Template.loginUsers.onCreated(function () {

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
      userType: "SDUser",
      loggedIn: true,
    },
    fields: { profile: 1, username: 1, emails: 1, active: 1 },
    perPage: 20
  });
  this.defaultBrnch = new ReactiveVar();

});


Template.loginUsers.onRendered(function () {

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
    allowClear: true,
    dropdownParent: $(".selectDefaultBrnchs").parent(),
  });


});

Template.loginUsers.helpers({

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
  userLists: function () {
    return Template.instance().userArray.get();
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

Template.loginUsers.events({


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
          userType: "SDUser",
          loggedIn: true,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (empCode && $.trim(empCode)) {
      Template.instance().pagination.settings.set('filters', {
        'profile.empCode': { $regex: new RegExp($.trim(empCode), "i") },
        userType: "SDUser",
        loggedIn: true,
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else if (firstName && $.trim(firstName)) {
      Template.instance().pagination.settings.set('filters', {
        'profile.firstName': {
          $regex: new RegExp($.trim(firstName), "i")
        }, userType: "SDUser",
        loggedIn: true,
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else if (emailfilter && $.trim(emailfilter)) {
      Template.instance().pagination.settings.set('filters', {
        'emails.0.address': { $regex: new RegExp($.trim(emailfilter), "i"), },
        userType: "SDUser",
        loggedIn: true,
      });
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set({
        userType: "SDUser",
        loggedIn: true,
      });
      $('.taskHeaderList').css('display', 'none');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
      userType: "SDUser",
      loggedIn: true,
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
  'click .logoutUser': (event, template) => {
    event.preventDefault();
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('user.clearToken', _id, (err, res) => {
      if (!err) {
        toastr['success']('Forcefully logout successfully');
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
