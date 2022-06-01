/**
 * @author visakh
 */

/**
 * TODO: Complete JS doc
 * @param target
 */

resetPassword = (target) => {
  const newPassword = target.password;
  return Accounts.resetPassword(Session.get('resetPasswordToken'),  newPassword.value, (error) =>{
    if(error){
      toastr["error"]('Error:'+ error.reason);
    }else{
        FlowRouter.redirect(currentPath);      
    }
  });
};
