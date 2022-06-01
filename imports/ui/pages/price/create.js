/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.price_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.productListGet = new ReactiveVar();
  this.priceTypeList = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.unitList = new ReactiveVar();
});

Template.price_create.onRendered(function () {
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
   * get price type list
   */ 
  Meteor.call('priceType.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.priceTypeList.set(res);
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
  /**
* TODO: Complete JS doc
*/
  $('.selectPriceType').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriceType").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('.selectUnit').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnit").parent(),
  });
});
Template.price_create.helpers({
  /**
   * get price list
   */
  getProductList: () => {
    return Template.instance().productListGet.get();
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
 * get price type
 */
  getPriceType: () => {
    return Template.instance().priceTypeList.get();
  },
  /**
 * get price type
 */
  getUnitList: () => {
    return Template.instance().unitList.get();
  },
});
Template.price_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closeprice': (event, template) => {
    $('#priceAdd').each(function () {
      this.reset();
    });
    $('#selectProduct').val('').trigger('change');
    $('#selectPriceType').val('').trigger('change');
    $('#selectUnit').val('').trigger('change');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .priceAdd': (event, template) => {
    event.preventDefault();
    let product = '';
    $('#selectProduct').find(':selected').each(function () {
      product = $(this).val();
    });
    let priceType = '';
    $('#selectPriceType').find(':selected').each(function () {
      priceType = $(this).val();
    });
    let unit = '';
    $('#selectUnit').find(':selected').each(function () {
      unit = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    createOrUpdateprice(event.target, product, priceType, unit,loginUserVerticals);
    $('#ic-create-price').modal('hide');
    dataClear();
    function dataClear() {
      $('#priceAdd').each(function () {
        this.reset();
      });
      $('#selectProduct').val('').trigger('change');
      $('#selectPriceType').val('').trigger('change');
      $('#selectUnit').val('').trigger('change');
    }
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * get unit based on product
   */
  'change #selectProduct': (event, template) => {
    event.preventDefault();
    let product = '';
    template.unitList.set('');
    template.modalLoader.set(false);
    $('#selectProduct').find(':selected').each(function () {
      product = $(this).val();
    });
    if (product !== undefined && product !== '') {
      template.modalLoader.set(true);
      Meteor.call('unit.unitCodeGet', product, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.unitList.set(res);
        }
        else {
          template.modalLoader.set(false);
        }
      })
    }
  },
  // number validation
  'keypress #priceGet': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $("#priceGet").val()
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
});
