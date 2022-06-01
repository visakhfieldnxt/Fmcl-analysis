/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.brand_create.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.principalListGet = new ReactiveVar();
});

Template.brand_create.onRendered(function () {
  /**
  * get brand list 
  * */
  Meteor.call('principal.principalActiveList', (err, res) => {
    if (!err) {
      this.principalListGet.set(res);
    }
  });
  /**
  * TODO: Complete JS doc
  */
  $('.selectPrincipal').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrincipal").parent(),
  });
});
Template.brand_create.helpers({
  /**
 * TODO: Complete JS doc
 * @returns {rolelist}
 */
  getPricipalList: function () {
    return Template.instance().principalListGet.get();
  },
});
Template.brand_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closebrand': (event, template) => {
    $('#brandAdd').each(function () {
      this.reset();
    });
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .brandAdd': (event, template) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    let principal = '';
    $('#selectPrincipal').find(':selected').each(function () {
      principal = $(this).val();
    });
    createOrUpdatebrand(event.target, loginUserVerticals,principal);
    $('#ic-create-brand').modal('hide');
    dataClear();
    function dataClear() {
      $('#brandAdd').each(function () {
        this.reset();
      });
      $('#selectPrincipal').val('').trigger('change');
    }
  }
});
