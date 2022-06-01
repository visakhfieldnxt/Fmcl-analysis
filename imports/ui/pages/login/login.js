/**
 * @author Visakh
 */


Template.login_view.onCreated(function() {
  Blaze._allowJavascriptUrls();
  });

Template.login_view.events({
/**
 * TODO: Complete JS doc
 * @param event
 */
  'submit .users_login': (event) => {
    event.preventDefault();
    loginUser(event.target);
  },
  /**
   * TODO: Complete JS doc
   */
  'click #ic-create-button': () => {
    $("#ic-create").modal();
  },
/**
 * TODO: Complete JS doc
 */
  'click .reset_modal':function(){
    $('.signup-add')[0].reset();
    $('.signup-add').find('input:text','input:radio','input:password').val('');
    $("#emailspan").html('<font color="#fc5f5f"></font>');
    $("#passwordspan").html('<font color="#fc5f5f"></font>');
    $("#confirmpasswordspan").html('<font color="#fc5f5f"></font>');
  }
});
