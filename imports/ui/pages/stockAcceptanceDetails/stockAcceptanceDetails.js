/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
Template.stockAcceptanceDetails.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  this.stockNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.stockIdList = new ReactiveVar();
});

Template.stockAcceptanceDetails.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  this.productListGet.set('');
  let id = FlowRouter.getParam('_id');
  $('#divValuesGet').html('');
  Meteor.call("stockTransferIssued.dataGet", id, (err, res) => {
    if (!err) {
      if (res.length > 0) {
        $('#divValuesGet').html(res[0].temporaryId);
        this.productListGet.set(res);
      }
      else {
        $('#bodySpinLoaders').css('display', 'none');
        $('#divValuesGet').html('');
        this.productListGet.set('');
      }
    }
    else {
      $('#bodySpinLoaders').css('display', 'none');
      $('#divValuesGet').html('');
      this.productListGet.set('');
    }
  })
});

Template.stockAcceptanceDetails.helpers({
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
      $('.stockVal_' + id).html(`${stock} (${result})`);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.stockVal_' + id).html('');
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
   * 
   * @returns 
   */
  stockList: () => {
    return Template.instance().productListGet.get();
  }
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
let stockEdited = false;
Template.stockAcceptanceDetails.events({
   /**
    * TODO:Complete JS doc
    * @param event
    */
  'click #backHome': (event, template) => {
    event.preventDefault();
    FlowRouter.go('stockAcceptance');
    template.productListGet.set('');
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
    let remarks = $("#remarkStock").val();
    $('#stockEditModal').modal('hide');
    if (stockVal !== undefined && stockVal !== '') {
      if (stockRes.length > 0) {
        for (let i = 0; i < stockRes.length; i++) {
          if (stockRes[i]._id === id) {
            stockRes[i].quantity = stockVal;
            stockRes[i].remarks = remarks;
            toastr['success']('Product Stock Updated Successfully');
            break;
          }
        }
        template.productListGet.set(stockRes);
      }
    }
    else {
      toastr['error']('Empty Fields - Quantity');
    }
  },
  'click .editProductStock': (event, template) => {
    event.preventDefault();
    $('#stockData').val('');
    template.modalLoader.set(false);
    let id = event.currentTarget.id;
    if (id) {
      template.modalLoader.set(true);
      Meteor.call("stockTransferIssued.getDetailss", id, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          $('#stockData').val(res.stockRes.quantity);
          stockEdited =true;
          $('#userHeader').html(`Update Stock`);
        }
        else {
          template.modalLoader.set(false);
        }
      })
      $('#userHeader').html('Update Stock');
      $('#confirmedUuid').val(id);
      $('#stockEditModal').modal();
    }
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * accept stock
   */
  'submit .acceptStockDetails': (event, template) => {
    let id = FlowRouter.getParam('_id');
    let productArray = Template.instance().productListGet.get();
    FlowRouter.go('stockAcceptance');
      Meteor.call("stockTransfer.acceptStock", id, productArray, Meteor.userId(),stockEdited, (err, res) => {
      if (!err) {
        toastr['success']('Stock Accepted Successfully');
        dataClear();
      }
      else {
        FlowRouter.go('stockAcceptance');
        toastr['error'](err.reason);
      }
    });
    dataClear();
    function dataClear() {
      stockEdited =false;
      template.productListGet.set('');
    }
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }
});