/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.priceType_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.veritcalListGet = new ReactiveVar();
});

Template.priceType_create.onRendered(function () {
  $('#selectVertical').val('').trigger('change');
  /**
   * get branch list 
   * */
   let loginUserVerticals = Session.get("loginUserVerticals");
   Meteor.call('verticals.userWiseList', loginUserVerticals, (err, res) => {
     if (!err) {
       this.veritcalListGet.set(res);
     }
   });
  /**
  * TODO: Complete JS doc
  */
  $('.selectVertical').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVertical").parent(),
  });
});
Template.priceType_create.helpers({
  /**
   * get priceType list
   */
  getVerticalList: () => {
    return Template.instance().veritcalListGet.get();
  },

});
Template.priceType_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closepriceType': (event, template) => {
    $('#priceTypeAdd').each(function () {
      this.reset();
    });
    $('#selectVertical').val('').trigger('change');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .priceTypeAdd': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    createOrUpdatePriceType(event.target, vertical);
    $('#ic-create-priceType').modal('hide');
    dataClear();
    function dataClear() {
      $('#priceTypeAdd').each(function () {
        this.reset();
      });
      $('#selectVertical').val('').trigger('change');
    }
  }
});
