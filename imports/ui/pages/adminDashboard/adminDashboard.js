/**
 * @author Nithin
 * 
 */


Template.admin_dashboard.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
});
Template.admin_dashboard.onRendered(function () {
   
});

Template.admin_dashboard.helpers({

});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.admin_dashboard.events({

});




