/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.location_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.branchListGet = new ReactiveVar();
});

Template.location_create.onRendered(function () {
  $('#selectbranchS').val('').trigger('change');
  /**
   * get branch list 
   * */
   Meteor.call('branch.branchActiveList', (branchErr, branchRes) => {
    if (!branchErr) {
      this.branchListGet.set(branchRes);
    }
  });
  /**
  * TODO: Complete JS doc
  */
  $('.selectbranchS').select2({
    placeholder: "Select Branch Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectbranchS").parent(),
  });
});
Template.location_create.helpers({
  /**
   * get location list
   */
  getbranchList: () => {
    return Template.instance().branchListGet.get();
  },
 
});
Template.location_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closelocation': (event, template) => {
    $('#locationAdd').each(function () {
      this.reset();
    });
    $('#selectbranchS').val('').trigger('change');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .locationAdd': (event, template) => {
    event.preventDefault();
    let branch = '';
    $('#selectbranchS').find(':selected').each(function () {
      branch = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    createOrUpdatelocation(event.target,branch,loginUserVerticals);
    $('#ic-create-location').modal('hide');
    dataClear();
    function dataClear() {
      $('#locationAdd').each(function () {
        this.reset();
      });
      $('#selectbranchS').val('').trigger('change');
    }
  }
});
