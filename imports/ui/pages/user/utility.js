/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdateUser = (target, roleArray, vertical) => {
  let firstName = target.firstName;
  let lastName = target.lastName;
  let email = target.email;
  let username = target.username;
  let password = target.password;
  let gender = target.gender;
  let dateOfBirth = target.dateOfBirth;
  let empCode = target.empCodes;
  let contactNo = target.contactNo;
  let contactPerson = '';

  return Meteor.call('user.create', firstName.value, lastName.value, email.value, contactNo.value,
    username.value, password.value, gender.value, dateOfBirth.value, empCode.value, contactPerson, roleArray,
    vertical, (error, result) => {
      if (error) {
        $('#userErrorModal').find('.modal-body').text(error.reason);
        $('#userErrorModal').modal();
      }
      else {
        Session.set("userPermission", '');
        $('#ic-create').modal('hide');
        $("#userAdd")[0].reset();
        $('#roleSelection').val(null).trigger('change');
        $('#designationSelection').prop('selectedIndex', 0);
        $('#userSuccessModal').find('.modal-body').text('User has been registered successfully');
        $('#userSuccessModal').modal();
      }
    });

},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateUserlist = (target, roleArray, vertical) => {
    let firstName = target.firstName;
    let lastName = target.lastName;
    let email = target.email;
    let username = target.username;
    let contactNo = target.contactNo;
    let password = target.password;
    let dateOfBirth = target.dateOfBirth;
    let hiddenemail = target.hiddenemail;
    let gender = target.genders;
    let id = target.id;
    let empCode = target.empCode;
    let contactPerson = '';
    return Meteor.call('user.updateUser', id.value, firstName.value, lastName.value, dateOfBirth.value, username.value, contactNo.value, email.value, hiddenemail.value, password.value, gender.value, empCode.value,
      contactPerson, roleArray, vertical, (error, result) => {
        if (error) {
          $('#userErrorModal').find('.modal-body').text(error.reason);
          $('#userErrorModal').modal();
        }
        else {
          $('#userEditPage').modal('hide');
          $('.updateUser').each(function () {
            this.reset();
          });
          Session.set("userPermission", '');
          $('#roleSelection').val(null).trigger('change');
          $('#userSuccessModal').find('.modal-body').text('User has been updated successfully');
          $('#userSuccessModal').modal();
          $('#verticalEditSelection').val('').trigger('change');
        }
      });
  }



