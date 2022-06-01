/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor'
import { allUsers } from "../../../api/user/user";

Template.rejectedSdUsers.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });   
  this.modalLoader = new ReactiveVar(); 
  this.userListGet = new ReactiveVar(); 
  this.pagination = new Meteor.Pagination(allUsers, {
    filters: {
      active: "Y",
      userType: "SDUser",
      approvalStatus: "Rejected"
    },
    sort: { createdAt: -1, 'profile.firstName': 1 },
    fields:{profile:1,
      subDistributor:1,
      approvedDate:1,
      username:1},
    perPage: 20
  });
  this.defaultBrnch = new ReactiveVar();

});


Template.rejectedSdUsers.onRendered(function () {
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

  let subDistributorValue = Session.get("subDistributorValue");
  /**
   * display sd selection div
   */
  if (subDistributorValue === false) {
    $('.sdUserDIvEdit').css('display', 'inline');
  }
  else {
    $('.sdUserDIvEdit').css('display', 'none');
  }
  /**
   * TODO: Complete JS doc

   */

 
  Meteor.call('user.sdUserFullList', (err, res) => {
    if (!err) {
      this.userListGet.set(res);
    };
  });
  $("#userStatus").select2({
    placeholder: "Select Status",
    tokenSeparators: [','],
    noResults: 'No Users found.',
    allowClear: true,
    dropdownParent: $("#userStatus").parent(),
  });
  $('.selectSdsEdit').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSdsEdit").parent(),
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

Template.rejectedSdUsers.helpers({

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
 
  sdUsersList: function () {
    return Template.instance().userListGet.get();

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
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
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
* get user name
* @param {} user 
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
* get user name
* @param {} user 
*/
  getVerticalName: (user) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idVerticalName", user, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalVal_' + user).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalVal_' + user).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
   * 
   * @param {*} value 
   * @returns 
   * check if admin deactivate sub distributor or not
   */
  adminDeactivateCheck: (value) => {
    if (value === false) {
      return true;
    }
    else {
      return false;
    }
  },
  /**
* TODO:Complete JS doc
* @param docDate
*/
  dateHelp: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY hh:mm A');
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

Template.rejectedSdUsers.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .userFilter': (event) => {
    event.preventDefault();
    let empCode = event.target.selectSdsEdit.value;
    if (empCode) {
      Template.instance().pagination.settings.set('filters',
        {
          subDistributor: empCode,
          userType: "SDUser",
          active: "Y", approvalStatus: "Rejected"
        }
      );
    }
    else {
      Template.instance().pagination.settings.set({ userType: "SDUser", });
    }
  },
  /**
   * TODO: Complete JS doc
   * reset filter search
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
      userType: "SDUser", approvalStatus: "Rejected"
    });
    $('form :input').val("");
    $('#selectSdsEdit').val('').trigger('change');
  },

  'click .closen': (event, template) => {
    $(".updateUser").each(function () {
      this.reset();
    });
    template.modalLoader.set('');
    $('#roleSelection').prop('selectedIndex', 0);
    $('#selectSdsEdit').val('').trigger('change');
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
    let empcode = $('#detailEMPCode');
    let username = $('#detailUsername');
    let dateOfBirth = $('#detailDateOfBirth');
    let vertical = $('#verticalDetails');
    let contactNum = $('#contactNum');
    let detailContact = $('#detailContact');
    let detailBranch = $('#detailBranch');
    let detailLocation = $('#detailLocation');
    let detailSdName = $('#detailSdName');
    let detailRejectedBy = $('#detailRejectedBy');
    let detailRejectedDate = $('#detailRejectedDate');
    let detailRejectedRemarks = $('#detailRejectedRemarks');

    $('#userDetailPage').modal();
    Meteor.call('user.sdUserData', id, (userError, userResult) => {
      if (!userError) {
        template.modalLoader.set(userResult);
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
        $(detailBranch).html(userResult.branchName);
        $(detailLocation).html(userResult.locationName);
        $(detailSdName).html(userResult.sdName);
        $(detailRejectedBy).html(userResult.rejectedByName);
        $(detailRejectedDate).html(moment(user.rejectedDate).format('DD-MM-YYYY hh:mm A'));
        $(detailRejectedRemarks).html(user.approvalRemark);
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

});
