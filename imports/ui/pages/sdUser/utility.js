/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdateSDUser = (target, roleArray,employeeId) => {
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

  return Meteor.call('user.sdUserCreate', firstName.value, lastName.value, email.value, contactNo.value,
    username.value, password.value, gender.value, dateOfBirth.value, empCode.value, contactPerson, roleArray,employeeId,
    (error, result) => {
      if (error) {
        $('#sduserErrorModal').find('.modal-body').text(error.reason);
        $('#sduserErrorModal').modal();
      }
      else {
        Session.set("userPermission", '');
        $('#ic-create').modal('hide');
        $("#sdUserAdd")[0].reset();
        $('#roleSelection').val(null).trigger('change'); 
        $('#sduserSuccessModal').find('.modal-body').text('SD User has been registered successfully');
        $('#sduserSuccessModal').modal();
        $('#selectSds').val('').trigger('change');
      }
    });

},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateSDUserlist = (target, roleArray, vertical) => {
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
    return Meteor.call('user.updateSDUser', id.value, firstName.value, lastName.value, dateOfBirth.value, username.value, contactNo.value, email.value, hiddenemail.value, password.value, gender.value, empCode.value,
      contactPerson, roleArray, (error, result) => {
        if (error) {
          $('#sduserErrorModal').find('.modal-body').text(error.reason);
          $('#sduserErrorModal').modal();
        }
        else {
          $('#userEditPage').modal('hide');
          $('.updateSDUser').each(function () {
            this.reset();
          });
          Session.set("userPermission", '');
          $('#roleSelection').val(null).trigger('change');
          $('#sduserSuccessModal').find('.modal-body').text('SD User has been updated successfully');
          $('#sduserSuccessModal').modal(); 
        }
      });
  }



