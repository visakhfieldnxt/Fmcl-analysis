/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';

Template.tax_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });

});

Template.tax_create.onRendered(function () {
/**
 * TODO: Complete JS doc
 */
$('.categorys').select2({
  placeholder: "Select Category",
  tokenSeparators: [','],
  allowClear: true,
  dropdownParent: $(".categorys").parent(),
});
});
Template.tax_create.helpers({
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },
});
Template.tax_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closetax': () => {
    $('#taxAdd').each(function () {
      this.reset();
    });
    $('#categorys').val(null).trigger('change');
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .taxAdd': (event) => {
    event.preventDefault();
   
    let category = '';

    $('.categorys').find(':selected').each(function () {
      category = $(this).val();
    });

    createOrUpdatetax(event.target,category);
    dataClear();
    function dataClear() {
      $('#taxAdd').each(function () {
        this.reset();
      });
      $('.categorys').val(null).trigger('change');
    }
  }
});
