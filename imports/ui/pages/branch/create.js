/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.branch_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.cardCodeList = new ReactiveVar();
  this.wareHouseList = new ReactiveVar();
  this.supplierList = new ReactiveVar();
});

Template.branch_create.onRendered(function () {
  /**
     * TODO:Complete Js doc
     * Getting user branch list
     */
  Meteor.call('customer.cardCodeGet', (err, res) => {
    if (!err) {
      this.cardCodeList.set(res);
    }
  });
  /**
     * TODO:Complete Js doc
     * Getting user branch list
     */
  Meteor.call('wareHouse.nameList', (err, res) => {
    if (!err) {
      this.wareHouseList.set(res);
    }
  });
  /**
   * TODO:Complete Js doc
   * Getting user branch list
   */
  Meteor.call('customer.supplierCodeGet', (err, res) => {
    if (!err) {
      this.supplierList.set(res);
    }
  });
  $('.selectCustomerS').select2({
    placeholder: "Select Customer",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomerS").parent(),
  });
  $('.selectSupplierS').select2({
    placeholder: "Select Vendor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSupplierS").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.wareHouseSelection').select2({
    placeholder: "Select Warehouse",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".wareHouseSelection").parent(),
  });
});
Template.branch_create.helpers({
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },
  /**
  * TODO:COmplete Js doc
  * Getting specific customers base on branch
  */
  customersList: function () {
    return Template.instance().cardCodeList.get();
  },
  /**
  * TODO:COmplete Js doc
  * Getting specific customers base on branch
  */
  suppliersList: function () {
    return Template.instance().supplierList.get();
  },
  /**
  * TODO: Complete JS doc
  * @returns {rolelist}
  */
  wareHousesList: function () {
    return Template.instance().wareHouseList.get();
  },
});
Template.branch_create.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closebranch': (event, template) => {
    $('#branchAdd').each(function () {
      this.reset();
    });
    $('#selectCustomerS').val('').trigger('change');
    $('#selectSupplierS').val('').trigger('change');
    $('#wareHouseSelection').val('').trigger('change');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .branchAdd': (event, template) => {

    event.preventDefault();
    let customerCode = '';
    let supplierCode = '';
    let wareHouse = '';

    $('#selectCustomerS').find(':selected').each(function () {
      customerCode = $(this).val();
    });
    $('#selectSupplierS').find(':selected').each(function () {
      supplierCode = $(this).val();
    });
    $('#wareHouseSelection').find(':selected').each(function () {
      wareHouse = $(this).val();
    });
    createOrUpdatebranch(event.target, customerCode, supplierCode, wareHouse);

    dataClear();

    function dataClear() {
      $('#branchAdd').each(function () {
        this.reset();
      });
      $('#selectCustomerS').val('').trigger('change');
      $('#selectSupplierS').val('').trigger('change');
      $('#wareHouseSelection').val('').trigger('change');
    }
  }
});
