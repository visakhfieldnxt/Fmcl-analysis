/**
 * @author Visakh
 */


Template .forgetPassword.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .forget_email': (event) =>{
  event.preventDefault();
  forgetEmail(event.target);
}
});
