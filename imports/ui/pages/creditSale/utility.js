/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateCreditSale = (target, productsArray, vertical, grandTotal, taxTotal, latitude, longitude, outlet, salesType,walkInCustomer) => {
  return Meteor.call('creditSale.create', productsArray, vertical, grandTotal, taxTotal, latitude, longitude, outlet, salesType,
    walkInCustomer,
    (error, result) => {
      if (error) {
        toastr['error'](error.reason);
      }
      else {
        toastr['success']('Sale Created successfully');
      }
    });
}

