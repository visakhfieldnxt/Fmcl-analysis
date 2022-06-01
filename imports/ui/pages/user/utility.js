/**
 * @author Visakh
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdateUser = (target, roleArray,supervisor,branch,defaultBranch,slpCode) => {
  const firstName = target.firstName;
  const lastName = target.lastName;
  const email = target.email;
  const username = target.username;
  const password = target.password;
  const gender = target.gender;
  const dateOfBirth = target.dateOfBirth;  
  const empCode = target.empCodes;    
  const contactNo = target.contactNo;
  // const designationName = target.designationName;  
  
      return Meteor.call('user.create', firstName.value, lastName.value, email.value,contactNo.value, 
      username.value, password.value, gender.value, dateOfBirth.value, empCode.value, roleArray, 
       supervisor,branch,defaultBranch,slpCode, (error, result) => {
        if (error) {         
        $('#userErrorModal').find('.modal-body').text(error.reason);
          $('#userErrorModal').modal();
          
        }
        else {
          Session.set("userPermission",'');
          $('#ic-create').modal('hide');         
          $("#userAdd")[0].reset();
          $('#roleSelection').val(null).trigger('change');
          $('#designationSelection').prop('selectedIndex',0);
         $('#userSuccessModal').find('.modal-body').text('User has been registered successfully');
          $('#userSuccessModal').modal();
        }

      });
    
  
  },
  /**
 * TODO: Complete JS doc
 * @param target
 */
updateUserlist = (target,roleArray,supervisor,branch,defaultBranch,slpCode) => {
  const firstName = target.firstName;
   const lastName = target.lastName;
  const email = target.email;
  const username = target.username;
  const contactNo = target.contactNo;
  const password = target.password;  
  const dateOfBirth = target.dateOfBirth;  
  const hiddenemail = target.hiddenemail;
  const gender = target.genders;
  const isDeleted = target.isDeleted;
  const id = target.id;  
  const empCode = target.empCode;    
  // const designationId = target.designationNameUpdated;   
  
      return Meteor.call('user.updateUser', id.value, firstName.value, lastName.value, dateOfBirth.value, username.value,contactNo.value, email.value, hiddenemail.value,  password.value, gender.value, empCode.value, roleArray,supervisor,
      branch,defaultBranch ,slpCode,(error, result) => {
        if (error) {
          $('#userErrorModal').find('.modal-body').text(error.reason);
          $('#userErrorModal').modal();
        }
        else {
          $('#userEditPage').modal('hide');       
          $('.updateUser').each(function () {
            this.reset();
          });
          Session.set("userPermission",'');

          $('#roleSelection').val(null).trigger('change');
        $('#userSuccessModal').find('.modal-body').text('User has been updated successfully');
          $('#userSuccessModal').modal();

        }

      
      });
}



