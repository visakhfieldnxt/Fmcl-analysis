/**
 * @author Subrata
 */

import { Meteor } from 'meteor/meteor';

Template.update_profile.onCreated(function () {
  Blaze._allowJavascriptUrls();
  let self = this;
  self.autorun(() => {
  });
  this.rolesList = new ReactiveVar();
});

Template.update_profile.onRendered(function () {

  Meteor.call("roles.rolesListGet", (err, res) => {
    if (!err) {
      this.rolesList.set(res);
    }
  }
  )
});

Template.update_profile.helpers({
  user: function () {
    return Meteor.user();
  },
  // role: function(){
  // return Meteor.roles.find({_id:Meteor.user().roleId}).fetch();

  // },
  date: function () {
    return new Date();
  },
  roleNameGet: (roles) => {
    let roleArray = [];
    let roleDetailsGet = Template.instance().rolesList.get();
    if (roleDetailsGet) {
      for (let i = 0; i < roles.length; i++) {
        let res = roleDetailsGet.find(x => x._id === roles[i]);
        if (res) {
          roleArray.push(res.name);
        }
      }
      return roleArray.toString();
    }
  }, 
});

Template.update_profile.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  "change .file-upload-input": function (event) {

    let ext = $('.file-upload-input').val().split('.').pop().toLowerCase();
    if ($.inArray(ext.toLowerCase(), ['gif', 'png', 'jpg', 'jpeg']) === -1) {
      $("#info_upload").css('display', 'block');
      setTimeout(function () {
        $("#info_upload").css('display', 'none');
      }, 5000);
    } else {
      let file = event.currentTarget.files[0];
      let reader = new FileReader();
      reader.onload = function (fileLoadEvent) {
        $('#profileImage').attr('src', reader.result);
      };
      reader.readAsDataURL(file);

      setTimeout(function () {
        let image = $('#profileImage');
        image.cropper({
          aspectRatio: 1 / 1
        });

        disableButtons(false);
      }, 200);
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'change .input': function (event) {
    event.preventDefault();
    $('.buttonDisabled').prop('disabled', false);
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
  * TODO:Complete JS doc
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
  * TODO:Complete JS doc
  */
  'blur #password': () => {
    $('div.hint').hide()
    let passwordReg = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})?$/;
    let passwordaddress = $("#password").val();
    if (!passwordReg.test(passwordaddress))
      $("#passwordspan").html('<font color="#fc5f5f" size="2">Please enter valid password</font>');

    else
      $("#passwordspan").html('<font color="#fc5f5f"></font>');
  },
  /**
   * TODO:Complete JS doc
   */
  'blur #confirmpassword': () => {
    var pass = $("#password").val();
    var confirmpass = $("#confirmpassword").val();
    if (confirmpass != pass) {
      $("#confirmpasswordspan").html('<font color="#fc5f5f" size="2">Those passwords didn&apos;t match. Try again !</font>');

    } else {
      $("#confirmpasswordspan").html('<font color="#fc5f5f"></font>');

    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #update': function (event) {
    event.preventDefault();
    disableButtons(true);

    let image = $('#profileImage');
    let data = $(image).cropper('getCroppedCanvas').toDataURL();
    Meteor.call('user.profileImage.update', Meteor.user()._id, data, (error) => {
      if (error) {
      } else {
        $(image).cropper('destroy');
      }
    })
  },

  'click .remove_img': function (event) {
    $('#removeImageModal').modal();

  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .remove_image': function (event) {
    event.preventDefault();
    let data = '';
    Meteor.call('user.profileImage.update', Meteor.user()._id, data, (error) => {
      if (error) {
      } else {
        $('#removeImageModal').modal('hide');
      }
    })
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #cancel': function (event) {
    disableButtons(true);
    let image = $('#profileImage');
    $(image).attr('src', getProfileImage());
    $(image).cropper('destroy');
  },

  /**
    * TODO: Complete JS doc
    * @param event
    */
  "submit .update_profile": function (event) {
    event.preventDefault();
    updateLoginUser(event.target);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  "submit .updateVansale_profile": function (event) {
    event.preventDefault();
    updateLoginVansaleUser(event.target);
  },
  /**
  * TODO: Complete JS doc
  * @param event
  */
  "submit .change_password": function (event) {
    event.preventDefault();
    changePassword(event.target);
  },
});
/**
  * TODO: Complete JS doc
  * @returns {*}
  */
Template.registerHelper('profileImage', () => {
  return getProfileImage();
});

/**
 * TODO: Complete JS doc
 * @returns {*}
 */
getProfileImage = function () {
  let image = Meteor.user().profile.image;
  if (!image) image = '/img/user.png';
  return image;
};

/**
 * TODO: Complete JS doc
 * @param decider
 */
function disableButtons(decider) {
  $('#update').prop('disabled', decider);
  $('#cancel').prop('disabled', decider);
};