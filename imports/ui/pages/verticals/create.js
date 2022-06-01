/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.vertical_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  }); 
});

Template.vertical_create.onRendered(function () {
 
});
Template.vertical_create.helpers({
 
});
Template.vertical_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closevertical': (event, template) => {
    $('#verticalAdd').each(function () {
      this.reset();
    }); 
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .verticalAdd': (event, template) => { 
    event.preventDefault();  
    createOrUpdatevertical(event.target); 
    $('#ic-create-vertical').modal('hide');
    dataClear(); 
    function dataClear() {
      $('#verticalAdd').each(function () {
        this.reset();
      }); 
    }
  }
});
