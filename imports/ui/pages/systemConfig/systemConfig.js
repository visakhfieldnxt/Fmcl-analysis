import { Meteor } from 'meteor/meteor'
import { Config } from "../../../api/config/config";

Template.systemConfig.onCreated(function () {
  this.pagination = new Meteor.Pagination(Config, {
    filters: {
      $or: [
        { name: { $eq: 'sMTPPort' } },
        { name: { $eq: 'sMTPServer' } },
        { name: { $eq: 'sMTPUsername' } },
        { name: { $eq: 'sMTPPassword' } },
        { name: { $eq: 'from' } },
        { name: { $eq: 'to' } },
        { name: { $eq: 'cc' } },
        { name: { $eq: 'appName' } },
        { name: { $eq: 'headerName' } },
        { name: { $eq: 'base_url' } },
        { name: { $eq: 'absoluteURL' } },
        { name: { $eq: 'subject' } },
        { name: { $eq: 'text' } },
        { name: { $eq: 'emailTime' } },
        { name: { $eq: 'dbId' } },
        { name: { $eq: 'currency' } },
        { name: { $eq: 'boundaryLat' } },
        { name: { $eq: 'boundaryLng' } },
        { view: true },
        // { name: { $ne: 'modalLoader' } },
        // { name: { $ne: 'loader' } },
        // { name: { $ne: 'logo' } },
      ],
    },
    sort: { name: -1 },
    perPage: 10
  });
  let self = this;
  self.autorun(() => {
    self.subscribe("config.list");
  });
  this.userDetails = new ReactiveVar();
});

Template.systemConfig.helpers({

  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper(configCollectionName);
  },

  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper(configCollectionName);
    config.textarea = true;
    return config;
  },

  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },

  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },

  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  systemConfig: function () {
    return Template.instance().pagination.getPage();
  },

  /**
   * TODO: Complete JS doc
   * @returns {Function}
   */
  handlePagination: function () {
    return function (e, templateInstance, clickedPage) {
      e.preventDefault();
      console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
    };
  },
  /**
   * TODO: Complete JS doc
   */
  sortIcon: () => {
    genericSortIcons();
  },
});

Template.systemConfig.events({

  /**
   * TODO: Compelete JS doc
   */
  'click #config-create-button': () => {
    $("#config-create").modal();
  },
  //   /**
  // * TODO:Complete JS doc      
  // * @param {*} event
  // */
  'click #customerSync': (event) => {
    event.preventDefault();
    Meteor.call('customer.dataSync')
  },
  'click .itemSync': () => {
    Meteor.call('item.dataSync')
  },
  'click .branchSync': () => {
    Meteor.call('branch.dataSync')
  },
  'click .countrySync': () => {
    Meteor.call('country.dataSync')
  },
  'click .currencySync': () => {
    Meteor.call('currency.dataSync')
  },
  'click .customerAddressSync': () => {
    Meteor.call('customerAddress.dataSync')
  },
  'click .customerGroupSync': () => {
    Meteor.call('customerGroup.dataSync')
  },
  'click .customerPriceSync': () => {
    Meteor.call('customerPriceList.dataSync')
  },
  'click .defaultWareHouseSync': () => {
    Meteor.call('defaultWareHouse.dataSync')
  },
  'click .employeeSync': () => {
    Meteor.call('employee.dataSync')
  },
  'click .itemGetPriceSync': () => {
    Meteor.call('itemGetPrice.dataSync')
  },
  'click .itemCategorySync': () => {
    Meteor.call('itemCategory.dataSync')
  },
  'click .itemPriceSync': () => {
    Meteor.call('itemPriceList.dataSync')
  },
  'click .itemSpecialPriceSync': () => {
    Meteor.call('itemSpecialPrice.dataSync')
  },
  'click .returnActionSync': () => {
    Meteor.call('returnAction.dataSync')
  },
  'click .returnReasonSync': () => {
    Meteor.call('returnReason.dataSync')
  },
  'click .stateSync': () => {
    Meteor.call('state.dataSync')
  },
  'click .taxSync': () => {
    Meteor.call('tax.dataSync')
  },
  'click .unitSync': () => {
    Meteor.call('unit.dataSync')
  },
  'click .wareHouseSync': () => {
    Meteor.call('wareHouse.dataSync')
  },
  'click .wareHouseStockSync': () => {
    Meteor.call('wareHouseStock.dataSync')
  },
  'click .customerBrancSync': () => {
    Meteor.call('customer.branchSync')
  },
  'click .binQuantitySync': () => {
    Meteor.call('binQuantity.dataSync')
  },
  'click .binSync': () => {
    Meteor.call('bin.dataSync')
  },
  'click .batchSync': () => {
    Meteor.call('batch.dataSync')
  },
  // 'click .warehouseStockDelete': () => {
  //   Meteor.call('wareHouseStock.deleteStock')
  // },
  'submit .warehouseStockDelete': (event) => {
    event.preventDefault();
    let whsDate = $(".whsDate").val();
    let date = new Date(whsDate);
    // console.log("date",date);
    // Meteor.call('wareHouseStock.deleteStock',date);
    // $(".whsDate").val('');
  },

  'submit .warehouseStockDateWise': (event) => {
    event.preventDefault();
    let whsDate = $(".whsStockDate").val();
    // console.log("date",whsDate);
    Meteor.call('wareHouseStock.dateWiseDataSync', whsDate);
    $(".whsStockDate").val('');
  },

  'submit .itemPriceDateWise': (event) => {
    event.preventDefault();
    let itemPriceDate = $(".itemPriceDate").val();
    // console.log("date",itemPriceDate);
    Meteor.call('itemGetPrice.dateWiseSync', itemPriceDate);
    $(".itemPriceDate").val('');
  },
});
