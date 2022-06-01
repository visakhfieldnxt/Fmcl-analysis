/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.unit_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.itemFullList = new ReactiveVar();
});

Template.unit_create.onRendered(function () {
  /**
       * TODO:Complete Js doc
       * Getting user itemGetPrice list
       */
  Meteor.call('item.itemListGet', (err, res) => {
    if (!err) {
      this.itemFullList.set(res);
    }
  });

  /**
* TODO: Complete JS doc
*/
  $('#itemSelections').select2({
    placeholder: "Select Item ",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#itemSelections").parent(),
  });

});
Template.unit_create.helpers({
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },
  /**
* TODO:COmplete Js doc
* Getting specific customers base on itemGetPrice
*/
  itemsList: function () {
    return Template.instance().itemFullList.get();
  },
});
Template.unit_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closeunit': () => {
    $('#unitAdd').each(function () {
      this.reset();
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .unitAdd': (event) => {
    event.preventDefault();
    let ugpCode = '';
    $('.itemSelections').find(':selected').each(function () {
      ugpCode = $(this).val();
    });

    createOrUpdateunit(event.target, ugpCode);
    dataClear();
    $('#ic-create-unit').modal('hide');
    function dataClear() {
      $('#unitAdd').each(function () {
        this.reset();
      });
      $('.itemSelections').val(null).trigger('change');
    }
  }
});
