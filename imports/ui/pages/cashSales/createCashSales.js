/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
let latitude = '';
let longitude = '';
Template.createCashSales.onCreated(function () {

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
  this.itemArray = new ReactiveVar();
  this.grandTotalAmt = new ReactiveVar();;
  this.taxtTotalAmt = new ReactiveVar();
});

Template.createCashSales.onRendered(function () {
  $('#bodySpinLoaderVal').css('display', 'inline');
  $('.amtShowDiv').css('display', 'none');
  this.productsArray.set('');
  this.itemArray.set('');
  /**
   * get product list
   */
  // get locations
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  function success(pos) {
    var crd = pos.coords;
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    latitude = crd.latitude;
    longitude = crd.longitude;
  }
  function error(err) {
    // console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);

  /**
   * get user vertical list
   */
  if (Meteor.user()) {
    Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
        $('#bodySpinLoaderVal').css('display', 'none');
      }
      else {
        $('#bodySpinLoaderVal').css('display', 'none');
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
    width: 'element',
    dropdownParent: $(".selectProduct").parent(),
  });

  /**
* TODO: Complete JS doc
*/
  $('.selectUnits').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnits").parent(),
  });
});
Template.createCashSales.helpers({
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
        $('#selectUnits').val(unitId[0]._id).trigger('change');
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
   * TODO:Complete Js doc
   * For listing the item that been selected.
   */
  itemArrayList: function () {
    return Template.instance().itemArray.get();
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
let itemArray = [];
let baseQuantity = '';
Template.createCashSales.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closestocks': (event, template) => {
    $('#stockTransferAdd').each(function () {
      this.reset();
    });
    $("#selectProduct").val('').trigger('change');
    $('#selectUnits').val('').trigger('change');
    $("#selectVertical").val('').trigger('change');
    FlowRouter.go('cashSales');
    template.itemArray.set('');
    itemArray = [];
    $('.amtShowDiv').css('display', 'none');
    $(".selectVertical").prop("disabled", false);
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .addCashSales': (event, template) => {
    event.preventDefault();

    let vertical = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let grandTotal = Template.instance().grandTotalAmt.get();
    let taxTotal = Template.instance().taxtTotalAmt.get();
    let productsArray = Template.instance().itemArray.get();
    if (productsArray.length === 0) {
      toastr['error']('At Least One Product Needed For Adding Order');
    }
    else {
      createOrUpdateDirectSale(event.target, productsArray, vertical, grandTotal,
        taxTotal, latitude, longitude);
      FlowRouter.go('cashSales');
      dataClear();
      function dataClear() {
        $('#addCashSales').each(function () {
          this.reset();
        });
        $("#selectProduct").val('').trigger('change');
        $('#selectUnits').val('').trigger('change');
        $("#selectVertical").val('').trigger('change');
        $('.amtShowDiv').css('display', 'none');
        $(".selectVertical").prop("disabled", false);
        template.itemArray.set('');
        itemArray = [];
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
    if (vertical !== '' && vertical !== undefined) {
      template.modalLoader.set(true);
      console.log("hii");
      Meteor.call('wareHouseStock.cashSales', vertical, Meteor.userId(), (err, res) => {
        if (!err) {
          template.productListGet.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.productListGet.set('');
          template.modalLoader.set(false);
        }
      })
    }
    $("#selectProduct").val('').trigger('change');
    $('#selectUnits').val('').trigger('change');
    $('#stockData').val('');
  },



  /**
* 
* @param {*} event 
* @param {*} template 
* get unit based on product
*/
  'change #selectUnits': (event, template) => {
    event.preventDefault();
    let product = '';
    let unit = '';
    let vertical = '';
    let channelval = Session.get("sdUserChannel");
    baseQuantity = '';
    $('#selectVertical').find(':selected').each(function () {
      vertical = $(this).val();
    });
    $('#selectProduct').find(':selected').each(function () {
      product = $(this).val();
    });
    $('#selectUnits').find(':selected').each(function () {
      unit = $(this).val();
    });
    $('#unitQuantityShows').html('');
    $('#avaliStaockShow').html('');
    $('#priceVals').val('');
    template.stockGets.set('');
    if (unit !== undefined && unit !== '' && vertical !== '' && vertical !== undefined && product !== '' && product !== undefined) {
      template.modalLoader.set(true);
      Meteor.call('unit.priceCal', product, unit, vertical, Meteor.userId(), channelval, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          $('#unitQuantityShows').html(`Base Quantity : ${res.unitRes.baseQuantity}`);
          baseQuantity = res.unitRes.baseQuantity;
          $('#priceVals').val(Number(res.productPrice).toFixed(2));
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
          template.stockGets.set('');
          $('#priceVals').val('');
          baseQuantity = '';
        }
      });
    }
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * add items into array
   */
  'click .addItem': (event, template) => {
    // console.log("itemccccc", itemChecks); 
    event.preventDefault();
    let product = '';
    let unit = '';
    let priceVal = '';
    let quantity = '';
    let itemChecks = false;
    let stockHandVal = Template.instance().stockGets.get();
    // baseQuantity;
    $('#selectProduct').find(':selected').each(function () {
      product = $(this).val();
    });
    if (product === '' || product === 'Select Product') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#itemArrayspan").html('<style> #itemArrayspan { color:#fc5f5f }</style><span id ="itemArrayspan">Please Select Product</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#itemArrayspan').fadeOut('slow');
      }, 3000);
    } else {
      $('#selectUnits').find(':selected').each(function () {
        unit = $(this).val();
      });
      if (unit === '' || unit === 'Select Unit') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#unitArrayspan").html('<style> #unitArrayspan { color:#fc5f5f }</style><span id ="unitArrayspan">Please select a Unit</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#unitArrayspan').fadeOut('slow');
        }, 3000);
      } else {
        quantity = $("#quantityVal").val();

        if (quantity === '' || Number(quantity) <= 0) {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#quantityArrayspan").html('<style> #quantityArrayspan { color:#fc5f5f }</style><span id ="quantityArrayspan">Please enter a valid quantity</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#quantityArrayspan').fadeOut('slow');
          }, 3000);
        } else {
          priceVal = $("#priceVals").val();
          if (priceVal === '' || Number(priceVal) === 0) {
            $(window).scrollTop(0);
            setTimeout(function () {
              $("#priceArrayspan").html('<style> #priceArrayspans { color:#fc5f5f }</style><span id ="priceArrayspans"> Price Not Found</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#priceArrayspan').fadeOut('slow');
            }, 3000);
          } else {
            $(".addItem").prop('disabled', true);
            Meteor.setTimeout(function () {
              $(".addItem").prop('disabled', false);
            }, 3000);
            if (itemArray.length > 0) {
              for (let i = 0; i < itemArray.length; i++) {
                if (product === itemArray[i].product) {
                  itemChecks = true;
                  toastr['error'](itemAlreadyExistsMessage);
                  break;
                }
                else {
                  itemChecks = false;
                }
              }
            }
            let randomId = Random.id();
            let unitPrices = Number(priceVal);
            let taxRate = Number(unitPrices * 4 / 100);
            let withOutTax = (Number(quantity) * Number(unitPrices)) - taxRate;
            let taxAddAmt = Number(unitPrices) * Number(quantity);
            let salesPrice = Number(unitPrices);
            let taxAmt = taxRate * Number(quantity);
            let transferStockVal = Number(baseQuantity) * Number(quantity);
            let itemObject = {
              randomId: randomId,
              unit: unit,
              unitQuantity: baseQuantity,
              unitPrice: unitPrices.toString(),
              price: unitPrices.toString(),
              salesPrice: salesPrice.toString(),
              withOutTax: withOutTax.toString(),
              grossTotal: taxAddAmt.toString(),
              product: product,
              quantity: quantity,
              taxPerc: '4',
              taxRate: taxRate.toString(),
              taxtAmount: taxAmt.toString(),
              transferStockVal: transferStockVal.toString()
            };
            if (itemChecks === false) {
              let stockCalc = Number(baseQuantity) * Number(quantity);
              let onHandStock = Number(stockHandVal);
              if (Number(stockCalc) <= Number(onHandStock)) {
                itemArray.push(itemObject);
                template.itemArray.set(itemArray);
                $(".selectVertical").prop("disabled", true);
                amountShowingFn();
              }
              else {
                toastr['error'](stockValidationMessage);
              }
            }
          }
          // for showing amount
          function amountShowingFn() {
            $("#selectProduct").val('').trigger('change');
            $('#selectUnits').val('').trigger('change');
            $('#quantityVal').val('').trigger('change');
            itemChecks = false;
            let taxAdd = 0;
            for (let l = 0; l < itemArray.length; l++) {
              taxAdd += Number(itemArray[l].quantity) * Number(itemArray[l].taxRate); //change
            }
            let totalP = 0;
            for (let l = 0; l < itemArray.length; l++) {
              totalP += Number(itemArray[l].salesPrice * itemArray[l].quantity); //change
            }
            let taxFixed = parseFloat(taxAdd).toFixed(2);
            template.grandTotalAmt.set(totalP.toFixed(2));
            template.taxtTotalAmt.set(taxFixed);
            $('.amtShowDiv').css('display', 'inline');
            $('#taxAdded').html(taxFixed);
            $('#total').html(totalP.toFixed(2));
          }
        }
      }
    }
  },

  /**
  * TODO:Complete Js doc
  * Deleting item from the array.
  */
  'click .itemDelete': (event, template) => {
    let itemArrays = Template.instance().itemArray.get();
    let itemIndex = event.currentTarget.id;
    let selected = itemArrays.filter(function (e) {
      return e.randomId === itemIndex;
    });
    let removeIndex = itemArrays.map(function (item) {
      selected = item.randomId;
      return item.randomId;
    }).indexOf(itemIndex);
    itemArray.splice(removeIndex, 1);
    template.itemArray.set(itemArray);
    let productArrays = Template.instance().itemArray.get();
    if (productArrays.length > 0) {
      let taxAdd = 0;
      for (let l = 0; l < productArrays.length; l++) {
        taxAdd += Number(productArrays[l].quantity) * Number(productArrays[l].taxRate); //change
      }
      let totalP = 0;
      for (let l = 0; l < productArrays.length; l++) {
        totalP += Number(productArrays[l].salesPrice * productArrays[l].quantity); //change
      }
      let taxFixed = parseFloat(taxAdd).toFixed(2);
      template.grandTotalAmt.set(totalP.toFixed(2));
      template.taxtTotalAmt.set(taxFixed);
      $('.amtShowDiv').css('display', 'inline');
      $('#taxAdded').html(taxFixed);
      $('#total').html(totalP.toFixed(2));
    }
    else {
      $('.amtShowDiv').css('display', 'none');
      $('#taxAdded').html('');
      $('#total').html('');
      $(".selectVertical").prop("disabled", false);
    }
  },
});
