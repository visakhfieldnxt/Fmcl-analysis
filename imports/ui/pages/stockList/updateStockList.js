/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.updateStockList.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.productListGet = new ReactiveVar()
  this.modalLoader = new ReactiveVar();
  this.unitList = new ReactiveVar();
  this.productsArray = new ReactiveVar();
  this.verticalList = new ReactiveVar();
});

Template.updateStockList.onRendered(function () {
  $(".loadersSpinsImgIn").attr("style", "display:none");
  $('#bodySpinLoadersVal').css('display', 'inline');
  this.productsArray.set('');
  /**
   * get product list
   */

  /**
   * get vertical List
   */
  if (Meteor.user()) {
    Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
        $('#bodySpinLoadersVal').css('display', 'none');
      }
      else {
        $('#bodySpinLoadersVal').css('display', 'none');
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
  $('.selectVertical').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVertical").parent(),
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
Template.updateStockList.helpers({
  /**
   * get product list
   */
  getProductList: () => {
    return Template.instance().productListGet.get();
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
  amtShowsHelp: (price, qtyCTN) => {
    let resVal = Number(price) * Number(qtyCTN);
    return resVal.toFixed(2);
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
   * 
   * @returns get current date
   */
  dateVal: () => {
    return moment(new Date()).format('DD-MM-YYYY');
  },
  /**
 * get unit list
 */
  getUnitList: () => {
    let unitId = Template.instance().unitList.get();
    if (unitId) {
      let unitVal = unitId.find(x => x.unitName === "CTN");
      if (unitVal) {
        Meteor.setTimeout(function () {
          $('#selectUnit').val(unitVal._id).trigger('change');
        }, 100);
      }
    }
    return Template.instance().unitList.get();
  },
  productArrayList: () => {
    return Template.instance().productsArray.get();
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
   * get vertical list */
  getVertical: () => {
    let verticalId = Template.instance().verticalList.get();
    if (verticalId) {
      Meteor.setTimeout(function () {
        $('#selectVertical').val(verticalId[0]._id).trigger('change');
      }, 100);
    }
    return Template.instance().verticalList.get();
  }
});
let itemCheckValidation = false;
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.updateStockList.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closestockVal': (event, template) => {
    $('#stockAdd').each(function () {
      this.reset();
    });
    $("#selectVertical").val('').trigger('change');
    $("#selectProduct").val('').trigger('change');
    $('#selectUnit').val('').trigger('change');
    $('#stockData').val('');
    FlowRouter.go('stockList');
    template.productListGet.set('');
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockAdd': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let productsArray = Template.instance().productListGet.get();
    if (productsArray.length === 0) {
      toastr['error']('At Least One Product Needed For Adding Stock');
    }
    else {
      if (vertical !== '' && vertical !== undefined) {
        createOrUpdateStock(event.target, productsArray, vertical);
        FlowRouter.go('stockList');
        dataClear();
        function dataClear() {
          $('#stockAdd').each(function () {
            this.reset();
          });
          $("#selectProduct").val('').trigger('change');
          $('#selectUnit').val('').trigger('change');
          $('#stockData').val('');
          template.productListGet.set('');
          $("#selectVertical").val('').trigger('change');
        }
      }
      else {
        toastr['error']('Vertical Not Found !');
      }
    }
  },

  // number validation
  'keypress #stockData': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $("#stockData").val()
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


  'change #selectVertical': (event, template) => {
    event.preventDefault();
    template.modalLoader.set(false);
    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    $(".loadersSpinsImgIn").attr("style", "display:none");
    if (vertical !== '' && vertical !== undefined) {
      $(".loadersSpinsImgIn").attr("style", "display:inline");
      template.productListGet.set('');
      template.modalLoader.set(true);
      Meteor.call('price.sdStockUpdatesList', vertical, Meteor.userId(), (err, res) => {
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
    $("#selectProduct").val('').trigger('change');
    $('#selectUnit').val('').trigger('change');
    $('#stockData').val('');
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   */
  'click .editProductStock': (event, template) => {
    event.preventDefault();
    $('#stockData').val('');
    template.modalLoader.set(false);
    let id = event.currentTarget.id;
    template.unitList.set('');
    let productsArray = Template.instance().productListGet.get();
    let productId = productsArray.find(x => x._id === id);
    $('#userHeader').html(`Update Stock`);
    $('#stockEditModal').modal();
    $('#unitQuantityShows').html('');
    $('#stockData').val('');
    $('#stockDataShows').html(``);
    if (productId) {
      // $('#stockData').val(productId.qtyCTN);
      $('#stockDataShows').html(`Available Stock : ${productId.qtyCTN} (CTN)`);
      template.modalLoader.set(true);
      Meteor.call("unit.unitCodeGet", productId.product, (err, res) => {
        if (!err) {
          template.unitList.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.unitList.set('');
          template.modalLoader.set(false);
        }
      })
      $('#confirmedUuid').val(id);
    }
  },
  'change #selectUnit': (event, template) => {
    event.preventDefault();
    let unit = '';
    $('#unitQuantityShows').html('');
    $('#baseQtyVal').val('');
    $('#selectUnit').find(':selected').each(function () {
      unit = $(this).val();
    });
    if (unit !== undefined && unit !== '') {
      Meteor.call("unit.id", unit, (err, res) => {
        if (!err) {
          $('#unitQuantityShows').html(`Base Quantity : ${res.baseQuantity}`);
          $('#baseQtyVal').val(res.baseQuantity);
        }
        else {
          $('#unitQuantityShows').html('');
          $('#baseQtyVal').val('');
        }
      });
    }
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 * update stock
 */
  'click #updateProductStock': (event, template) => {
    event.preventDefault();
    let stockRes = Template.instance().productListGet.get();
    let id = $('#confirmedUuid').val();
    let stockVal = $("#stockData").val();
    let baseQty = $("#baseQtyVal").val();
    let unit = '';
    $('#selectUnit').find(':selected').each(function () {
      unit = $(this).val();
    });
    if (stockVal !== undefined && stockVal !== '') {
      if (unit !== undefined && unit !== '') {
        let onHandStock = 0;
        let stockCTN = 0;
        let stockCalc = Number(baseQty) * Number(stockVal);
        let productRes = stockRes.find(x => x._id === id);
        if (productRes) {
          onHandStock = Number(productRes.quantity);
          stockCTN = Number(productRes.qtyCTN);
        }
        let newStock = Number(onHandStock) + Number(stockCalc);
        let newStockCTN = Number(stockCTN) + Number(stockVal);
        $('#stockEditModal').modal('hide');
        console.log("newStock", newStock);
        console.log("newStockCTN", newStockCTN);
        if (stockRes.length > 0) {
          for (let i = 0; i < stockRes.length; i++) {
            if (stockRes[i]._id === id) {
              stockRes[i].quantity = newStock.toString();
              stockRes[i].stockUpdated = true;
              stockRes[i].updatedStock = newStock.toString();
              stockRes[i].oldStock = stockCTN.toString();
              stockRes[i].newStock = stockVal.toString();
              stockRes[i].updatedUnit = unit;
              stockRes[i].qtyCTN = newStockCTN.toString();
              toastr['success']('Product Stock Updated !');
              break;
            }
          }
          console.log("stockRes", stockRes);
          template.productListGet.set(stockRes);
        }
      }
      else {
        toastr['error']('Empty Fields - Unit !');
      }
    }
    else {
      toastr['error']('Empty Fields - Quantity !');
    }
  },
});
