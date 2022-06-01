/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.createStockReturn.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.productListGet = new ReactiveVar()
  this.modalLoader = new ReactiveVar();
  this.unitList = new ReactiveVar();
  this.productsArray = new ReactiveVar();
  this.sdusersList = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.stockGets = new ReactiveVar();
});

Template.createStockReturn.onRendered(function () {
  $('#bodySpinLoaderVal').css('display', 'inline');
  this.productsArray.set('');
  /**
   * get product list
   */

  /**
   * get sd user List
   */
  if (Meteor.user()) {
    Meteor.call('user.sdUserDataList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.sdusersList.set(res);
        $('#bodySpinLoaderVal').css('display', 'none');
      }
      else {
        $('#bodySpinLoaderVal').css('display', 'none');
      }
    });
  }
  /**
   * get user vertical list
   */
  if (Meteor.user()) {
    Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
  }
  /**
  * TODO: Complete JS doc
  */
  $('.selectVertical').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVertical").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('.selectEmpId').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectEmpId").parent(),
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
  $('.selectUnit').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnit").parent(),
  });
});
Template.createStockReturn.helpers({
  /**
   * get product list
   */
  getProductList: () => {
    return Template.instance().productListGet.get();
  },
  /**
 * get vertical list */
  getVertical: () => {
    let verticalId = Template.instance().verticalList.get();
    if (verticalId) {
      Meteor.setTimeout(function () {
        $('#selectVertical').val(verticalId[0]._id).trigger('change');
      }, 100);
    }
    return Template.instance().verticalList.get();
  },
  /**
* get unit name
* @param {} unit 
*/
  getUnitNames: (unit, stock, id) => {
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
      $('.transferStock_' + id).html(`${stock} (${result})`);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.transferStock_' + id).html('0.00');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
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
 * TODO:Complete Js doc
 * Digits seperation with Comma
 */
  digitSeperator: (digit) => {
    let res = Number(digit).toFixed(2);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
 * get unit list
 */
  getUnitList: () => {
    let unitId = Template.instance().unitList.get();
    if (unitId) {
      Meteor.setTimeout(function () {
        $('#selectUnit').val(unitId[0]._id).trigger('change');
      }, 100);
    }
    return Template.instance().unitList.get();
  },
  productArrayList: () => {
    return Template.instance().productsArray.get();
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
    }
    ).catch((error) => {
      $('.verticalIdVal_' + vertical).html('');
    }
    );
  },
  /**
  * get product name
  * @param {} product 
  */
  getProductName: (product) => {
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
      $('.productIdVal_' + product).html(result);
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html('');
    }
    );
  },
  /**
* get unit name
* @param {} unit 
*/
  getUnitName: (unit) => {
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
      $('.unitNameVal_' + unit).html(result);
    }
    ).catch((error) => {
      $('.unitNameVal_' + unit).html('');
    }
    );
  },
  /**
   * get sd users list */
  getsdUsersList: () => {
    return Template.instance().sdusersList.get();
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.createStockReturn.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closestocks': (event, template) => {
    $('#stockReturnAdd').each(function () {
      this.reset();
    });
    $("#selectProduct").val('').trigger('change');
    $('#selectUnit').val('').trigger('change');
    $('#stockData').val('');
    $("#selectVertical").val('').trigger('change');
    $("#selectEmpId").val('').trigger('change');
    FlowRouter.go('stockReturn');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockReturnAdd': (event, template) => {
    event.preventDefault();
    let empId = Meteor.userId();
    // $('#selectEmpId').find(':selected').each(function () {
    //   empId = ($(this).val());
    // });
    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let productsArray = Template.instance().productListGet.get();
    if (productsArray.length === 0) {
      toastr['error']('At Least One Product Needed For Adding Return');
    }
    else {
      createOrUpdateStockReturn(event.target, productsArray, empId, vertical);
      FlowRouter.go('stockReturn');
      dataClear();
      function dataClear() {
        $('#stockReturnAdd').each(function () {
          this.reset();
        });
        $("#selectProduct").val('').trigger('change');
        $('#selectUnit').val('').trigger('change');
        $('#stockData').val('');
        $("#selectVertical").val('').trigger('change');
        $("#selectEmpId").val('').trigger('change');
        template.productListGet.set('');
      }
    }
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   */

  'change #selectVertical': (event, template) => {
    event.preventDefault();
    template.modalLoader.set(false);
    let empId = Meteor.userId();
    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    template.productListGet.set('');
    $(".loadersSpinsImgIn").attr("style", "display:none");
    if (empId !== '' && empId !== undefined && vertical !== '' && vertical !== undefined) {
      $(".loadersSpinsImgIn").attr("style", "display:inline");
      template.modalLoader.set(true);
      Meteor.call('wareHouseStock.userWiseList', empId, vertical, (err, res) => {
        if (!err) {
          template.productListGet.set(res);
          template.modalLoader.set(false);
          $(".loadersSpinsImgIn").attr("style", "display:none");
        }
        else {
          template.productListGet.set('');
          template.modalLoader.set(false);
          $(".loadersSpinsImgIn").attr("style", "display:none");
        }
      })
    }
  },
});
