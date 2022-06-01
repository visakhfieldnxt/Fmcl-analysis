/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdateSD = (target, vertical, branch, location, priceType,superAdminValue) => {
  let firstName = target.subDistributorName;
  let email = target.email;
  let username = target.username;
  let password = target.password;
  let gender = "";
  let dateOfBirth = "";
  let contactNo = target.contactNo;
  let contactPerson = target.contactPerson;
  let address = target.addresVal;
  return Meteor.call('user.sdCreate', firstName.value, email.value, contactNo.value,
    username.value, password.value, gender, dateOfBirth, vertical, branch, location, contactPerson.value, address.value
    , priceType,superAdminValue, (error, result) => {
      if (error) {
        $('#sdErrorModal').find('.modal-body').text(error.reason);
        $('#sdErrorModal').modal();

      }
      else {
        Session.set("userPermission", '');
        $('#ic-create').modal('hide');
        $("#sdAdd")[0].reset();
        $('#designationSelection').prop('selectedIndex', 0);
        $('#sdSuccessModal').find('.modal-body').text('Sub Distributor has been registered successfully');
        $('#sdSuccessModal').modal();
      }

    });


},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateSDlist = (target, verticals,priceType,superAdminValue,productArray) => {
    let email = target.emailEdit;
    let username = target.usernameValueEdit;
    let contactNo = target.contactNoEdit;
    let password = target.passwordEdit;
    let hiddenemail = target.hiddenemail;
    let id = target.idEdit;
    let contactPerson = target.contactPersonEdit;
    let address = target.addresValEdit;

    return Meteor.call('user.updateSD', id.value, username.value, contactNo.value, email.value, hiddenemail.value, password.value,
      contactPerson.value, verticals, address.value,priceType,superAdminValue,productArray, (error, result) => {
        if (error) {
          $('#sdErrorModal').find('.modal-body').text(error.reason);
          $('#sdErrorModal').modal();
        }
        else {
          $('#userEditPage').modal('hide');
          $('.updateSd').each(function () {
            this.reset();
          });
          Session.set("userPermission", '');
          $('#sdSuccessModal').find('.modal-body').text('Sub Distributor has been updated successfully');
          $('#sdSuccessModal').modal();

        }

      });
  }



