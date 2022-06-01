
Meteor.startup(function () { 
});
$(window).on('popstate', function (event) {
  $(".modal-backdrop").css("display", "none");
}); 

Template.main.onCreated(function () { 
}); 

Template.main.onRendered(function () {

    
 /** 
  * TODO: Complete JS doc
  * Connectivity test
  */
  Meteor.setInterval(networkCheck, 2000);
  function networkCheck() {
    let connection = Meteor.status();
    if (connection.connected === false) {
      Session.set("connectTest",false);
    }
    else {
      Session.set("connectTest",true);
    }
  }

});

Template.main.helpers({

  /**
  * TODO: Complete JS doc
  * @returns Connectivity status
  */
  connTest: function () {
    let test = Session.get("connectTest");
    return test;
  },
});