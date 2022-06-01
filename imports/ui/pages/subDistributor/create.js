/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.sd_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.verticalNameList = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.userNameArray = new ReactiveVar();
  this.defaultBrnch = new ReactiveVar();
  this.priceTypeArray = new ReactiveVar();
  this.locationData = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.sdNameGet = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.priceTypeVertical = new ReactiveVar();
  this.fileName = new ReactiveVar();
});

Template.sd_create.onRendered(function () {
  this.verticalArray.set('');
  $("#selectVerticalId").val('').trigger('change');
  $('#selectPriceTypeId').val('').trigger('change');
  $('.distributorDiv').css('display', 'none');
  /**
    * TODO: Complete JS doc
    * 
    */
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    $('.verticalAddDiv').css('display', 'inline');
    $('.priceTypeDiv').css('display', 'none');
    $('#selectPriceType').prop('required', false);
  }
  else {
    $('.verticalAddDiv').css('display', 'none');
    $('.priceTypeDiv').css('display', 'inline');
    $('#selectPriceType').prop('required', true);
  }
  $('.distributorDiv').css('display', 'none');
  $('#usernameValue').prop('disabled', false);
  $('#contactPerson').prop('disabled', false);
  $('#contactNo').prop('disabled', false);
  $('#email').prop('disabled', false);
  $('#addresVal').prop('disabled', false);
  $('#password').prop('disabled', false);
  $('#confirmPassword').prop('disabled', false);
  $('#password').prop('required', true);
  $('#confirmPassword').prop('required', true);
  /**
   * TODO: Complete JS doc
   * 
   */
  Meteor.call('verticals.activeList', (err, res) => {
    if (!err) {
      this.verticalNameList.set(res);
    };
  });
  let loginUserVerticals = Session.get("loginUserVerticals");

  Meteor.call('branch.branchActiveList', (branchErr, branchRes) => {
    if (!branchErr) {
      this.branchNameArray.set(branchRes);
    }
  });
  Meteor.call('user.userNameGetAdmin', (userError, userResult) => {
    if (!userError) {
      this.userNameArray.set(userResult);
    }
  });
  Meteor.call('priceType.verticalList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.priceTypeArray.set(res);
    }
  });
  $('.verticalSelection').select2({
    placeholder: "Select Verticals",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalSelection").parent(),
  });

  $('.selectLocation').select2({
    placeholder: "Select Location",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectLocation").parent(),
  });
  $('.selectPriceType').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriceType").parent(),
  });
  /**
 * TODO: Complete JS doc
 */
  $('.branchSelection').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchSelection").parent(),
  });

  $('.selectVerticalId').select2({
    placeholder: "Select Verticals",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalId").parent(),
  });

  $('.selectPriceTypeId').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriceTypeId").parent(),
  });

  // $('.selectDistributor').select2({
  //   placeholder: "Select Distributor",
  //   tokenSeparators: [','],
  //   allowClear: true,
  //   dropdownParent: $(".selectDistributor").parent(),
  // });

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
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.sd_create.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {verticals}
   */
  verticalList: function () {
    return Template.instance().verticalNameList.get();

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
  priceTypeList: () => {
    return Template.instance().priceTypeArray.get();

  },
  verticalPriceType: () => {
    return Template.instance().priceTypeVertical.get();
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
      $('.verticalIds_' + vertical).html(result);
    }
    ).catch((error) => {
      $('.verticalIds_' + vertical).html('');
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
      $('.priceTypeIds_' + priceType).html(result);
    }
    ).catch((error) => {
      $('.priceTypeIds_' + priceType).html('');
    }
    );
  },
  distributorList: () => {
    return Template.instance().sdNameGet.get();
  },

  addedVerticals: () => {
    return Template.instance().verticalArray.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  branchList: function () {

    return Template.instance().branchNameArray.get();
  },
  locationList: function () {
    return Template.instance().locationData.get();
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
let verticalArray = [];
let itemCheckValidation = false;
Template.sd_create.events({
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
  'click .closeUser': (event, template) => {
    $('#sdAdd').each(function () {
      this.reset();
    });
    $('#password').val('');
    $('#confirmPassword').val('');
    $('#usernameValue').val('');
    $('#email').val('');
    $('#subDistributorName').val('');
    $('#contactPerson').val('');
    $('#contactNo').val('');
    $('#addresVal').val('');
    $('#selectDistributor').val('').trigger('change');
    $('#branchSelection').val('').trigger('change');
    $('#selectLocation').val('').trigger('change');
    $('#verticalSelection').val(null).trigger('change');
    $('#usernameValue').prop('disabled', false);
    $('#contactPerson').prop('disabled', false);
    $('#contactNo').prop('disabled', false);
    $('#email').prop('disabled', false);
    $('#addresVal').prop('disabled', false);
    $('#password').prop('disabled', false);
    $('#confirmPassword').prop('disabled', false);
    template.sdNameGet.set('');
    $('#password').prop('required', true);
    $('#confirmPassword').prop('required', true);
    $('.requiredDiv').css('display', 'inline');
    $('.distributorDiv').css('display', 'none');
    $('#selectPriceType').val('').trigger('change');
    $("#selectVerticalId").val('').trigger('change');
    $('#selectPriceTypeId').val('').trigger('change');
  },

  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * 
   */
  'change .selectLocation': (event, template) => {
    event.preventDefault();
    template.sdNameGet.set('');
    $('#password').val('');
    $('#confirmPassword').val('');
    $('#usernameValue').val('');
    $('#email').val('');
    $('#subDistributorName').val('');
    $('#contactPerson').val('');
    $('#contactNo').val('');
    $('#addresVal').val('');
    $('#selectDistributor').val('').trigger('change');
    $('#verticalSelection').val(null).trigger('change');
    $('#usernameValue').prop('disabled', false);
    $('#contactPerson').prop('disabled', false);
    $('#contactNo').prop('disabled', false);
    $('#email').prop('disabled', false);
    $('#addresVal').prop('disabled', false);
    $('#password').prop('disabled', false);
    $('#confirmPassword').prop('disabled', false);
    $('#password').prop('required', true);
    $('#confirmPassword').prop('required', true);
    $('.requiredDiv').css('display', 'inline');
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .sdAdd': (event, template) => {
    event.preventDefault();
    let veritcals = [];
    let priceType = '';
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      veritcals = verticalArray;
    }
    else {
      $('#selectPriceType').find(':selected').each(function () {
        priceType = ($(this).val());
      });
    }
    if (superAdminValue === true && veritcals.length === 0) {
      toastr['error']('At least one Vertical needed for adding Sub Distributor');
    }
    else {
      let branch = '';
      $('#branchSelection').find(':selected').each(function () {
        branch = ($(this).val());
      });
      let location = '';
      $('#selectLocation').find(':selected').each(function () {
        location = ($(this).val());
      });
      $("#rolesArrayspan").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan"></span>');
      createOrUpdateSD(event.target, veritcals, branch, location, priceType, superAdminValue);
      $('#ic-create').modal('hide');
      dataClear();
      function dataClear() {
        $('#verticalSelection').val(null).trigger('change');
        $('#password').val('');
        $('#confirmPassword').val('');
        $('.username').val('');
        $('.email').val('');
        $('#selectDistributor').val('').trigger('change');
        $('#branchSelection').val('').trigger('change');
        $('#selectPriceType').val('').trigger('change');
        $('#selectLocation').val('').trigger('change');
        template.sdNameGet.set('');
        $('#usernameValue').prop('disabled', false);
        $('#contactPerson').prop('disabled', false);
        $('#contactNo').prop('disabled', false);
        $('#email').prop('disabled', false);
        $('#addresVal').prop('disabled', false);
        $('#password').prop('disabled', false);
        $('#confirmPassword').prop('disabled', false);
        $('#password').prop('required', true);
        $('#confirmPassword').prop('required', true);
        $('.requiredDiv').css('display', 'inline');
        verticalArray = [];
        template.verticalArray.set('');
        $('.distributorDiv').css('display', 'none');
      }
    }
  },

  'change #branchSelection': (event, template) => {
    event.preventDefault();
    let branch = '';
    template.modalLoader.set(false);
    $('#branchSelection').find(':selected').each(function () {
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
    template.sdNameGet.set('');
    $('#password').val('');
    $('#confirmPassword').val('');
    $('#usernameValue').val('');
    $('#email').val('');
    $('#subDistributorName').val('');
    $('#contactPerson').val('');
    $('#contactNo').val('');
    $('#addresVal').val('');
    $('#selectDistributor').val('').trigger('change');
    $('#verticalSelection').val(null).trigger('change');
    $('#usernameValue').prop('disabled', false);
    $('#contactPerson').prop('disabled', false);
    $('#contactNo').prop('disabled', false);
    $('#email').prop('disabled', false);
    $('#addresVal').prop('disabled', false);
    $('#password').prop('disabled', false);
    $('#confirmPassword').prop('disabled', false);
    $('#password').prop('required', true);
    $('#confirmPassword').prop('required', true);
    $('.requiredDiv').css('display', 'inline');
    verticalArray = [];
    template.verticalArray.set('');
  },

  /**
* TODO: Complete JS doc
search sd
*/
  'keyup #subDistributorName': (event, template) => {
    $('#usernameValue').prop('disabled', false);
    $('#contactPerson').prop('disabled', false);
    $('#contactNo').prop('disabled', false);
    $('#email').prop('disabled', false);
    $('#addresVal').prop('disabled', false);
    $('#password').prop('disabled', false);
    $('#confirmPassword').prop('disabled', false);
    $('#password').prop('required', true);
    $('#confirmPassword').prop('required', true);
    $('.requiredDiv').css('display', 'inline');
    let branch = '';
    $('#branchSelection').find(':selected').each(function () {
      branch = ($(this).val());
    });
    let location = '';
    $('#selectLocation').find(':selected').each(function () {
      location = ($(this).val());
    });
    let nameGet = $('#subDistributorName').val();
    template.sdNameGet.set('');
    if (nameGet !== '' && nameGet !== undefined && branch !== '' && branch !== undefined && location !== '' && location !== undefined) {
      Meteor.call('user.idSearch', nameGet, branch, location, (err, res) => {
        if (!err && res !== undefined) {
          template.sdNameGet.set(res);
          if (res.length > 0) {
            $('.distributorDiv').css('display', 'inline');
            // $("#selectDistributor").select("open"); 
            $("#selectDistributor").attr("size", "3");
          }
          else {
            $('.distributorDiv').css('display', 'none');
          }
        }
        else {
          template.sdNameGet.set('');
          // $("#selectDistributor").select("close"); 
          $('.distributorDiv').css('display', 'none');
          $('#usernameValue').prop('disabled', false);
          $('#contactPerson').prop('disabled', false);
          $('#contactNo').prop('disabled', false);
          $('#email').prop('disabled', false);
          $('#addresVal').prop('disabled', false);
          $('#password').prop('disabled', false);
          $('#confirmPassword').prop('disabled', false);
          $('#password').prop('required', true);
          $('#confirmPassword').prop('required', true);
          $('.requiredDiv').css('display', 'inline');
        }
      });
    }
    else {
      template.sdNameGet.set('');
      // $("#selectDistributor").select("close");
      $('.distributorDiv').css('display', 'none');
      $('#usernameValue').prop('disabled', false);
      $('#contactPerson').prop('disabled', false);
      $('#contactNo').prop('disabled', false);
      $('#email').prop('disabled', false);
      $('#addresVal').prop('disabled', false);
      $('#password').prop('disabled', false);
      $('#confirmPassword').prop('disabled', false);
      $('#password').prop('required', true);
      $('#confirmPassword').prop('required', true);
      $('.requiredDiv').css('display', 'inline');
    }
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * search based on user input
   */
  'change #selectDistributor': (event, template) => {
    event.preventDefault();
    template.verticalArray.set('');
    verticalArray = [];
    let sdNameList = Template.instance().sdNameGet.get();
    let sdName = '';
    $('#selectDistributor').find(':selected').each(function () {
      sdName = ($(this).val());
    });
    if (sdName !== '' && sdName !== undefined) {
      let nameVal = sdNameList
        .find(x => x._id === sdName);
      if (nameVal) {
        Meteor.setTimeout(function () {
          $('#subDistributorName').val(nameVal.profile.firstName);
          $('.distributorDiv').css('display', 'none');
          $('#usernameValue').val(nameVal.username);
          $('#email').val(nameVal.emails[0].address);
          $('#contactPerson').val(nameVal.contactPerson);
          $('#contactNo').val(nameVal.contactNo);
          $('#usernameValue').prop('disabled', true);
          $('#contactPerson').prop('disabled', true);
          $('#contactNo').prop('disabled', true);
          $('#email').prop('disabled', true);
          $('#addresVal').prop('disabled', true);
          $('#password').prop('disabled', true);
          $('#confirmPassword').prop('disabled', true);
          $('#password').prop('required', false);
          $('#confirmPassword').prop('required', false);
          $('#addresVal').val(nameVal.address);
          $('#verticalSelection').val(nameVal.vertical).trigger('change');
          $('.requiredDiv').css('display', 'none');
        }, 100);
      }
      let superAdminValue = Session.get("superAdminValue");
      if (superAdminValue === true) {
        Meteor.call('sdPriceType.dataGet', sdName, (err, res) => {
          if (err) {
            template.verticalArray.set(res);
            verticalArray = res;
          }
          else {
            template.verticalArray.set(res);
            verticalArray = res;
          }
        });
      }
    }
  },
  /**
   * data get based on vertical change
   */
  'change #selectVerticalId': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#selectVerticalId').find(':selected').each(function () {
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
   *for add verticals
   */

  'click .addVertical': (event, template) => {
    event.preventDefault();
    itemCheckValidation = false;
    let vertical = '';
    let priceType = '';
    $('#selectVerticalId').find(':selected').each(function () {
      vertical = $(this).val();
    });
    if (vertical === '' || vertical === 'Select Vertical') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#verticalSpan").html('<style>#verticalSpans{color:#fc5f5f;}</style><span id="verticalSpans">Please select vertical</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#verticalSpan').fadeOut('slow');
      }, 3000);
    }
    else {
      $('#selectPriceTypeId').find(':selected').each(function () {
        priceType = $(this).val();
      });
      if (priceType === '' || priceType === 'Select Price Type') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#priceTypeSpan").html('<style>#priceTypeSpans{color:#fc5f5f;}</style><span id="priceTypeSpans">Please select customer price type</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#priceTypeSpan').fadeOut('slow');
        }, 3000);
      }
      else {
        $(".addVertical").prop('disabled', true);
        Meteor.setTimeout(function () {
          $(".addVertical").prop('disabled', false);
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
          $("#selectVerticalId").val('').trigger('change');
          $('#selectPriceTypeId').val('').trigger('change');
        }
      }
    }
  },
  /**
 * TODO:Complete Js doc
 * Deleting verticals from the array.
 */
  'click .deleteVerticals': (event, template) => {
    let verticalArrays = Template.instance().verticalArray.get();
    let itemIndex = event.currentTarget.id;
    let removeIndex = verticalArrays.map(function (item) {
      return item.randomId;
    }).indexOf(itemIndex);
    verticalArrays.splice(removeIndex, 1);
    template.verticalArray.set(verticalArrays);
  },
});

