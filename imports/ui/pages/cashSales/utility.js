/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateDirectSale = (target, productsArray, vertical, grandTotal, taxTotal, latitude, longitude) => {
  return Meteor.call('directSale.create', productsArray, vertical, grandTotal, taxTotal, latitude, longitude,
    (error, result) => {
      if (error) {
        toastr['error'](error.reason);
      }
      else {
        toastr['success']('Cash Sale Created successfully');
      }
    });
} 

