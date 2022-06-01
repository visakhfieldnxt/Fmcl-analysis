/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateStockReturn = (target, productsArray, empId, vertical) => {
  return Meteor.call('stockReturn.create', productsArray, empId, vertical,
    (error, result) => {
      if (error) {
        toastr['error'](err.reason);
      }
      else {
        toastr['success']('Stock return has been created successfully');
      }
    });
}

