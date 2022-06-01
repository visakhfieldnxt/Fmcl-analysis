/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.product_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.brandListGet = new ReactiveVar();
  this.getCategoryList = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.principalListGet=new ReactiveVar();
});

Template.product_create.onRendered(function () {
 
   /**
  * get brand list 
  * */
    Meteor.call('principal.principalActiveList', (err, res) => {
      if (!err) {
        this.principalListGet.set(res);
      }
    });
  $('.selectbrandS').select2({
    placeholder: "Select Brand",
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
  $('.selectCategory').select2({
    placeholder: "Select Category",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCategory").parent(),
  });
});
Template.product_create.helpers({
  /**
   * get category list
   */
  getbrandList: () => {
    return Template.instance().brandListGet.get();
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
  /**
* TODO: Complete JS doc
* @returns {rolelist}
*/
  getPricipalList: function () {
    return Template.instance().principalListGet.get();
  },
  /**
 * get category list
 */
  getCategoryList: () => {
    return Template.instance().getCategoryList.get();
  },
});
Template.product_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closeproduct': (event, template) => {
    $('#productAdd').each(function () {
      this.reset();
    });
    $('#selectbrandS').val('').trigger('change');
    $('#selectCategory').val('').trigger('change');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .productAdd': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#selectbrandS').find(':selected').each(function () {
      brand = $(this).val();
    });
    let category = '';
    $('#selectCategory').find(':selected').each(function () {
      category = $(this).val();
    });
    let principal = '';
    $('#selectPrincipal').find(':selected').each(function () {
      principal = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    createOrUpdateproduct(event.target, loginUserVerticals, brand, category,principal);
    $('#ic-create-product').modal('hide');
    dataClear();
    function dataClear() {
      $('#productAdd').each(function () {
        this.reset();
      });
      $('#selectbrandS').val('').trigger('change');
      $('#selectCategory').val('').trigger('change');
      $('#selectPrincipal').val('').trigger('change');
    }
  },
  // number validation
  'keypress #baseQty': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $("#baseQty").val()
      if (inputValue.indexOf('.') < 1) {
        return true;
      }
      return false;
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  },
  'change #selectbrandS': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#selectbrandS').find(':selected').each(function () {
      brand = $(this).val();
    });
    template.modalLoader.set(false);
    template.getCategoryList.set('');
    if (brand !== undefined && brand !== '') {
      template.modalLoader.set(true);
      Meteor.call("category.brandWiseList", brand, (err, res) => {
        if (!err) {
          template.getCategoryList.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.getCategoryList.set('');
          template.modalLoader.set(false);
        }
      });
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
