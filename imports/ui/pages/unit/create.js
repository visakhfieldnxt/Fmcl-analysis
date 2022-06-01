/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.unit_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.productListGet = new ReactiveVar();
});

Template.unit_create.onRendered(function () {
  $('#selectProduct').val('').trigger('change');
  /**
   * get branch list 
   * */
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('product.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.productListGet.set(res);
    }
  });
  /**
  * TODO: Complete JS doc
  */
  $('.selectProduct').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProduct").parent(),
  });
});
Template.unit_create.helpers({
  /**
   * get unit list
   */
  getProductList: () => {
    return Template.instance().productListGet.get();
  },

});
Template.unit_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closeunit': (event, template) => {
    $('#unitAdd').each(function () {
      this.reset();
    });
    $('#selectProduct').val('').trigger('change');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .unitAdd': (event, template) => {
    event.preventDefault();
    let product = '';
    $('#selectProduct').find(':selected').each(function () {
      product = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    createOrUpdateunit(event.target, product, loginUserVerticals);
    $('#ic-create-unit').modal('hide');
    dataClear();
    function dataClear() {
      $('#unitAdd').each(function () {
        this.reset();
      });
      $('#selectProduct').val('').trigger('change');
    }
  }
});
