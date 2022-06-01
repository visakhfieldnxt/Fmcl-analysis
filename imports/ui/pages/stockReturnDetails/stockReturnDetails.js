/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { StockReturnItems } from "../../../api/stockReturnItems/stockReturnItems";

Template.stockReturnDetails.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  this.stockNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.stockIdList = new ReactiveVar();
  let id = FlowRouter.getParam('_id');
  console.log("id",id);
  this.pagination = new Meteor.Pagination(StockReturnItems, {
    filters: {
      returnId: id,
    },
    sort: { transferDateIso: -1 },
    fields:{temporaryId:1,
      vertical:1,
      product:1,
      unit:1,
      quantity:1},
    perPage: 20
  });
});

Template.stockReturnDetails.onRendered(function () { 
  $('#bodySpinLoaders').css('display', 'block');
  if (Meteor.user()) {
    Meteor.call('product.sdUserList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.productListGet.set(res);
      }
    }
    );
    Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
  }

  /**
   * TODO: Complete JS doc
   */
  $('.selectProductVal').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProductVal").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.selectVerticalId').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalId").parent(),
  });

});

Template.stockReturnDetails.helpers({

  /**
* get vertical list */
  getVertical: () => {
    return Template.instance().verticalList.get();
  },/**
   * 
   * @returns product list
   */
  getProductList: () => {
    return Template.instance().productListGet.get();
  },
  /**
   * get stock transfer id
   */
  stocktransferIdList: () => {
    return Template.instance().stockIdList.get();
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
* get product name
* @param {} product 
*/
  getProductNames: (product) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.idName", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productIdVals_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVals_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get vansale user name
*/

  getUserName: (user) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idName", user, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.userIdVal_' + user).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.userIdVal_' + user).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get unit name
* @param {} unit 
*/
  getUnitNames: (unit) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("unit.idName", unit, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.unitNameVals_' + unit).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitNameVals_' + unit).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
  * get branch name
  * @param {} vertical 
  */
  getVerticalName: (vertical) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.idName", vertical, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalIdVal_' + vertical).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalIdVal_' + vertical).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
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
  },
  /**
     * TODO: Complete JS doc
     * @returns {*}
     */
  activeHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "Y") {
      return true;
    }
    else {
      return false
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  inactiveHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "N") {
      return true;
    }
    else {
      return false
    }
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
Template.stockReturnDetails.events({
  /**
    * TODO:Complete JS doc
    * @param event
    */
  'click #backHome': (event, template) => {
    event.preventDefault();
    FlowRouter.go('stockReturn');
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockFilter': (event) => {
    event.preventDefault();
    let vertical = event.target.selectVerticalId.value;
    let product = event.target.selectProductVal.value;
    let id = FlowRouter.getParam('_id');
    if (vertical && product === '') {
      Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical,
          returnId: id,

        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (vertical === '' && product) {
      Template.instance().pagination.settings.set('filters',
        {
          product: product,
          returnId: id,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (vertical && product) {
      Template.instance().pagination.settings.set('filters',
        {
          product: product,
          vertical: vertical,
          returnId: id,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let id = FlowRouter.getParam('_id');
    Template.instance().pagination.settings.set('filters', {
      returnId: id,
    });
    $('form :input').val("");
    $("#selectVerticalId").val('').trigger('change');
    $('.taskHeaderList').css('display', 'inline');
    $("#selectProductVal").val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-stock-button': () => {
    $("#ic-create-stock").modal();
    $('div.hint').hide();
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