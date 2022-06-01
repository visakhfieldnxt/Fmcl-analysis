/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import XLSX from 'xlsx';

Template.stockSummary.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.stockNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.sdUsersList = new ReactiveVar();
  this.stockArrayGet = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.getSdProductVar = new ReactiveVar();
});

Template.stockSummary.onRendered(function () {
  this.modalLoader.set(true);
  /**
   * get vertical List
   */
  if (Meteor.user()) {
    Meteor.call('user.sdUserDataList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.sdUsersList.set(res);
        this.modalLoader.set(false);
      }
      else {
        this.modalLoader.set(false);
      }
    });
    Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
    Meteor.call('sdProducts.list', Meteor.userId(), (err, res) => {
      if (!err) {
        this.getSdProductVar.set(res);
      }
    });
  }
  /**
   * TODO: Complete JS doc
   */
  $('.selectVerticalId').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalId").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.selectSdVal').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSdVal").parent(),
  });

  /**
  * TODO: Complete JS doc
  */
  $('.selectVerticalVal').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalVal").parent(),
  });

  /**
  * TODO: Complete JS doc
  */
  $('.sdProduct').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".sdProduct").parent(),
  });

});

Template.stockSummary.helpers({

  /**
 * 
 * @param {*} arrays 
 * @returns check not found condition
 */
  lenthCheck: (arrays) => {
    if (arrays !== undefined && arrays.length > 0) {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * 
   * @returns 
   */
  getStockDataList: () => {
    return Template.instance().stockArrayGet.get();
  },
  /**
 * 
 * @returns 
 */
  getVerticalList: () => {
    let verticalId = Template.instance().verticalList.get();
    if (verticalId) {
      Meteor.setTimeout(function () {
        $('#selectVerticalVal').val(verticalId[0]._id).trigger('change');
      }, 100);
    }
    return Template.instance().verticalList.get();
  },
  /**
 * get sd list */
  getSubDistributorUser: () => {
    return Template.instance().sdUsersList.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('stocks');
  },
  /**
  * TODO:Complete JS doc
  * 
  */
  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },


  /**
   * get status values
   * @param {*} status 
   */
  getActiveStatus: (status) => {
    if (status === 'Y') {
      return 'Active';
    }
    else {
      return 'Inactive';
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('stocks');
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
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  stockList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },

  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  stockLists: function () {
    return Template.instance().stockNameArray.get();
  },getSdProduct: function () {
    return Template.instance().getSdProductVar.get();
  },
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.stockSummary.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockFilter': (event, template) => {
    event.preventDefault();
    let sdUser = '';
    $('#selectSdVal').find(':selected').each(function () {
      sdUser = $(this).val();
    });
    let vertical = '';
    $('#selectVerticalVal').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let sdProduct = '';
    $('#sdProduct').find(':selected').each(function () {
      sdProduct = $(this).val();
    });
    template.modalLoader.set(false);
    if (sdUser === '') {
      toastr["error"]('Please fill Employee');
    }else{
      template.modalLoader.set(true);
      Meteor.call('wareHouseStock.stockSummary', sdUser, vertical, sdProduct, (err, res) => {
        if (!err) {
          template.stockArrayGet.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.modalLoader.set(false);
          template.stockArrayGet.set('');
        }
      });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (event, template) => {
    event.preventDefault();
    $('#selectSdVal').val('').trigger('change');
    $('#sdProduct').val('').trigger('change');
    template.stockArrayGet.set('');
    let verticalId = Template.instance().verticalList.get();
    if (verticalId) {
      Meteor.setTimeout(function () {
        $('#selectVerticalVal').val(verticalId[0]._id).trigger('change');
      }, 100);
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatestock").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
  },
  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('stock.stockList', (stockError, stockResult) => {
      if (!stockError) {
        template.stockNameArray.set(stockResult);
      }
    });
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

});