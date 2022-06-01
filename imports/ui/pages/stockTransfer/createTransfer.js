/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
let productTransfer = false;
Template.createSTransfer.onCreated(function () {

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

Template.createSTransfer.onRendered(function () {
  productTransfer = false;
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
    Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
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

Template.createSTransfer.helpers({
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
Template.createSTransfer.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closestocks': (event, template) => {
    $('#stockTransferAdd').each(function () {
      this.reset();
    });
    $("#selectProduct").val('').trigger('change');
    $('#selectUnit').val('').trigger('change');
    $('#stockData').val('');
    $("#selectVertical").val('').trigger('change');
    $("#selectEmpId").val('').trigger('change');
    productTransfer = false;
    FlowRouter.go('stockTransfer');

  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockTransferAdd': (event, template) => {
    event.preventDefault();
    let empId = '';
    $('#selectEmpId').find(':selected').each(function () {
      empId = ($(this).val());
    });
    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let productsArray = Template.instance().productListGet.get();
    if (productsArray.length === 0) {
      toastr['error']('At Least One Product Needed For Adding Stock');
    }
    else {
      if (productTransfer === true) {
        createOrUpdateStockTransfer(event.target, productsArray, empId, vertical);
        FlowRouter.go('stockTransfer');
        dataClear();
        function dataClear() {
          $('#stockTransferAdd').each(function () {
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
      else {
        toastr['error']('Stock Empty !');
      }
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
    $('#selectProduct').find(':selected').each(function () {
      product = $(this).val();
    });
    template.unitList.set('');
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
      });
    }
    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
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
    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    $(".loadersSpinsImgIn").attr("style", "display:none");
    if (vertical !== '' && vertical !== undefined) {
      $(".loadersSpinsImgIn").attr("style", "display:inline");
      template.modalLoader.set(true);
      console.log("hii");
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


  'click .editProductStock': (event, template) => {
    event.preventDefault();
    $('#stockData').val('');
    template.modalLoader.set(false);
    let id = event.currentTarget.id;
    template.unitList.set('');
    let productsArray = Template.instance().productListGet.get();
    let productId = productsArray.find(x => x._id === id);
    $('#userHeader').html(`Add Transfer Stock`);
    $('#stockEditModal').modal();
    $('#unitQuantityShows').html('');
    if (productId) {
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
  /**
* 
* @param {*} event 
* @param {*} template 
* get unit based on product
*/
  'change #selectUnit': (event, template) => {
    event.preventDefault();
    let product = '';
    let unit = '';
    let vertical = '';
    baseQuantity = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let id = $('#confirmedUuid').val();
    $('#baseQtyVal').val('');
    let productsArray = Template.instance().productListGet.get();

    $('#selectUnit').find(':selected').each(function () {
      unit = $(this).val();
    });
    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
    template.stockGets.set('');
    if (unit !== undefined && unit !== '' && vertical !== '' && vertical !== undefined) {
      let productId = productsArray.find(x => x._id === id);
      if (productId) {
        product = productId.product;
      }
      if (product !== undefined && product !== '') {
        template.modalLoader.set(true);
        Meteor.call('unit.baseQtyGet', product, unit, vertical, Meteor.userId(), (err, res) => {
          if (!err) {
            template.modalLoader.set(false);
            $('#unitQuantityShows').html(`Base Quantity : ${res.unitRes.baseQuantity}`);
            $('#baseQtyVal').val(res.unitRes.baseQuantity);

            if (res.stockRes !== undefined) {
              if (res.baseUnit !== undefined && res.baseUnit !== '') {
                $('#avaliStaockShow').html(`Stock : ${res.stockRes.stock} (${res.baseUnit})`);
              }
              else {
                $('#avaliStaockShow').html(`Stock : ${res.stockRes.stock}`);
              }
              template.stockGets.set(res.stockRes.stock);
            }
            else {
              $('#avaliStaockShow').html(`Stock : No Stock Available`);
              template.stockGets.set('');
              baseQuantity = '';
            }
          }
          else {
            template.modalLoader.set(false);
            $('#unitQuantityShows').html('');
            $('#avaliStaockShow').html('');
            $('#baseQtyVal').val('');
            template.stockGets.set('');
            baseQuantity = '';
          }
        });
      }
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
    if (stockVal !== undefined && stockVal !== '' && Number(stockVal) > 0) {
      if (unit !== undefined && unit !== '') {
        let onHandStock = 0;
        let stockCalc = Number(baseQty) * Number(stockVal);
        let productRes = stockRes.find(x => x._id === id);
        if (productRes) {
          onHandStock = Number(productRes.quantity);
        }
        console.log("onHandStock", onHandStock);
        console.log("stockCalc", stockCalc);
        console.log("stockRes", stockRes);
        if (Number(stockCalc) <= Number(onHandStock)) {
          $('#stockEditModal').modal('hide');
          if (stockRes.length > 0) {
            for (let i = 0; i < stockRes.length; i++) {
              if (stockRes[i]._id === id) {
                stockRes[i].transferStock = stockVal.toString();
                stockRes[i].transferUnit = unit;
                stockRes[i].stockUpdated = true;
                stockRes[i].transferStockVal = stockCalc.toString();
                toastr['success']('Product Stock Updated !');
                productTransfer = true;
                break;
              }
            }
            template.productListGet.set(stockRes);
          }
        }
        else {
          toastr['error'](stockValidationMessage);
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
