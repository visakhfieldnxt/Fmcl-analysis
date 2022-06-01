/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.principal_create.onCreated(function () {
  const self = this;
  self.autorun(() => { 
  }); 
});

Template.principal_create.onRendered(function () { 
});
Template.principal_create.helpers({ 
});
Template.principal_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closeprincipal': (event, template) => {
    $('#principalAdd').each(function () {
      this.reset();
    }); 
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .principalAdd': (event, template) => { 
    event.preventDefault();  
    let loginUserVerticals = Session.get("loginUserVerticals");
    createOrUpdateprincipal(event.target,loginUserVerticals); 
    $('#ic-create-principal').modal('hide');
    dataClear(); 
    function dataClear() {
      $('#principalAdd').each(function () {
        this.reset();
      }); 
    }
  }
});
