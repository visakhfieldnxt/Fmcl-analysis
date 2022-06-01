Meteor.startup(function () {
  // <body class="skin-blue fixed" data-spy="scroll" data-target="#scrollspy">
  // $('body').addClass('hold-transition skin-blue-light fixed sidebar-mini');
  $('body').addClass('hold-transition skin-blue-light sidebar-mini sidebar-collapse');
});
$(window).on('popstate', function (event) {
  $(".modal-backdrop").css("display", "none");
});
// <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8"></script> -->

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
      Session.set("connectTest", false);
    }
    else {
      Session.set("connectTest", true);
    } 
    if (!Meteor.userId()) {
      Session.set("userRole", '');
      FlowRouter.redirect('/login');
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