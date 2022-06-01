/**
 * @author Visakh
 */

 Template.verifyEmail.onCreated  (function() {
 
if (Session.get('verifyEmailToken')) {
  Accounts.verifyEmail(Session.get('verifyEmailToken'), function(err) {
 if (err ) {
    $("#failure").css('display','block');     
 } else {
   FlowRouter.redirect(currentPath);
   toastr["success"](emailVerificationMessage);
 }
 });
}
 });


