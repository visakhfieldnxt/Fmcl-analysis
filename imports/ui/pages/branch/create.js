/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.branch_create.onCreated(function () {
  const self = this;
  self.autorun(() => { 
  }); 
});

Template.branch_create.onRendered(function () { 
});
Template.branch_create.helpers({ 
});
Template.branch_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closebranch': (event, template) => {
    $('#branchAdd').each(function () {
      this.reset();
    }); 
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .branchAdd': (event, template) => { 
    event.preventDefault();  
    let loginUserVerticals = Session.get("loginUserVerticals");
    createOrUpdatebranch(event.target,loginUserVerticals); 
    $('#ic-create-branch').modal('hide');
    dataClear(); 
    function dataClear() {
      $('#branchAdd').each(function () {
        this.reset();
      }); 
    }
  }
});
