/**
 * @author Visakh
 */


Template.signup_create.events({
  /**
   * TODO: Complete JS doc
   */
  
 'click .toggle-password':()=>{
  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
 },
 /**
 * TODO:Complete JS doc
 */
'focus #password':()=>{
  $('div.hint').show();
  $(document).bind('focusin.hint click.hint',function(e) {
    if ($(e.target).closest('.hint, #password').length) return;
     $(document).unbind('.hint');
      $('div.hint').fadeOut('medium');
    });
},
/**
 * TODO:Complete JS doc
 */
'blur #password':()=>{
  $('div.hint').hide();
},
/**
 * TODO:Complete JS doc
 */
'blur #email':()=>{
  let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  let emailaddress = $("#email").val();
  if(!emailReg.test(emailaddress))
     $("#emailspan").html('<font color="#fc5f5f" size="2">Please enter valid email address</font>');
  else
     $("#emailspan").html('<font color="#fc5f5f"></font>');
},
/**
 * TODO:Complete JS doc
 */
'blur #password':()=>{
  let passwordReg = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})?$/;
  let passwordaddress = $("#password").val();
  if(!passwordReg.test(passwordaddress)){
     $("#passwordspan").html('<font color="#fc5f5f" size="2">Please enter valid password</font>');
}
  else{
     $("#passwordspan").html('<font color="#fc5f5f"></font>');}
},
/**
 * TODO:Complete JS doc
 */
'blur #confirmpassword':()=>{
  let pass = $("#password").val();
  let confirmpass =$("#confirmpassword").val();
  if(confirmpass != pass){
    $("#confirmpasswordspan").html('<font color="#fc5f5f" size="2">Those passwords didn&apos;t match. Try again !</font>');

  }else{
    $("#confirmpasswordspan").html('<font color="#fc5f5f"></font>');

  }
},
 
 

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .signup-add': (event) => {
    event.preventDefault();
    createOrUpdateSignup(event.target);
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
