/**
 * @author Visakh
 */
/**
 * TODO: Complete JS doc
 * @param target 
 */
updateLoginUser = (target) => {
  let id = Meteor.userId();
   let imageData =  Meteor.user().profile.image;
  let firstName = target.firstName;
  let lastName = target.lastName;
  let gender = Meteor.user().profile.gender;
  let dateOfBirth = target.dateOfBirth;
  if (target.dateOfBirth.value.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)) {
    return  Meteor.call('profile.updateProfile', id ,imageData ,firstName.value, lastName.value, gender, dateOfBirth.value, (error, result) => {
      if (error) {
        toastr["error"]('Error: '+ error.reason);
          }
      else {
        $('.buttonDisabled').prop('disabled', true);
       toastr["success"]("Profile updated successfully");

      }

    });
  }else{
    toastr["error"]("Please Check Date Of Birth format");
  }

},
/**
 * TODO: Complete JS doc
 * @param target 
 */
updateLoginVansaleUser = (target) => {
  let id = Meteor.userId();
  let imageData =  Meteor.user().profile.image;
  let firstName = target.firstName;
  let lastName = target.lastName;
  let gender = Meteor.user().profile.gender;
  let dateOfBirth = target.dateOfBirth;

  let transporterName = target.transporterName;
  let vehicleNumber = target.vehicleNumber;
  let driverName = target.driverName;
  let driverNumber = target.driverNumber;
  let lorryBoy = target.lorryBoy;


  if (target.dateOfBirth.value.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)) {
    return  Meteor.call('profile.updateVansaleProfile', id ,imageData ,firstName.value, lastName.value, gender, dateOfBirth.value,
    transporterName.value,vehicleNumber.value,driverName.value,driverNumber.value,
    lorryBoy.value, (error, result) => {
      if (error) {
        toastr["error"]('Error: '+ error.reason);
          }
      else {
        $('.buttonDisabled').prop('disabled', true);
       toastr["success"]("Profile updated successfully");

      }

    });
  }else{
    toastr["error"]("Please Check Date Of Birth format");
  }

},
/**
 * TODO: Complete JS doc
 * @param target
 */
changePassword = (target) => {
  let newPassword = target.password;
  let oldPassword = target.oldPassword;
return  Accounts.changePassword( oldPassword.value, newPassword.value, (error,result) => {
  if (error) {
    toastr["error"]('Error: '+ error.reason);
      }
  else {
  $('form :input:password').val("");
  $('.buttonDisabled').prop('disabled', true);
  
   toastr["success"]("Password changed successfully");

  }
});
};
