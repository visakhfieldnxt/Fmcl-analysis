/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.category_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.brandListGet = new ReactiveVar();
  this.principalListGet = new ReactiveVar();
  this.modalLoader=new ReactiveVar();
});

Template.category_create.onRendered(function () {
  $('#selectbrandS').val('').trigger('change');
  /**
  * TODO: Complete JS doc
  */
  /**
* get brand list 
* */
  Meteor.call('principal.principalActiveList', (err, res) => {
    if (!err) {
      this.principalListGet.set(res);
    }
  });
  $('.selectbrandS').select2({
    placeholder: "Select Brand Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectbrandS").parent(),
  });
  $('.selectPrincipal').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrincipal").parent(),
  });
});
Template.category_create.helpers({
  /**
   * get category list
   */
  getbrandList: () => {
    return Template.instance().brandListGet.get();
  },
  /**
* TODO: Complete JS doc
* @returns {rolelist}
*/
  getPricipalList: function () {
    return Template.instance().principalListGet.get();
  },
   /**
* TODO Complete Js doc
* For Loader Showing
*/
printLoad: () => {
  let loader = Template.instance().modalLoader.get();
  if (loader === true) {
    return true;
  } else {
    return false;

  }
},
});
Template.category_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closecategory': (event, template) => {
    $('#categoryAdd').each(function () {
      this.reset();
    });
    $('#selectbrandS').val('').trigger('change');
    $('#selectPrincipal').val('').trigger('change');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .categoryAdd': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#selectbrandS').find(':selected').each(function () {
      brand = $(this).val();
    });
    let principal = '';
    $('#selectPrincipal').find(':selected').each(function () {
      principal = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    createOrUpdatecategory(event.target, brand, loginUserVerticals,principal);
    $('#ic-create-category').modal('hide');
    dataClear();
    function dataClear() {
      $('#categoryAdd').each(function () {
        this.reset();
      });
      $('#selectbrandS').val('').trigger('change');
      $('#selectPrincipal').val('').trigger('change');
    }
  },
  /**
  * 
  * @param {*} event 
  * @param {*} template 
  */
  'change #selectPrincipal': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#selectPrincipal').find(':selected').each(function () {
      principal = $(this).val();
    });
    template.modalLoader.set(false);
    template.brandListGet.set('');
    if (principal !== undefined && principal !== '') {
      template.modalLoader.set(true);
      Meteor.call("brand.principalWiseList", principal, (err, res) => {
        if (!err) {
          template.brandListGet.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.brandListGet.set('');
          template.modalLoader.set(false);
        }
      });
    }
  },
});
