/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateOrders = (target, productsArray, vertical, grandTotal, taxTotal, latitude, longitude, outlet, discount) => {
  return Meteor.call('order.create', productsArray, vertical, grandTotal, taxTotal, latitude, longitude, outlet, discount,
    (error, result) => {
      if (error) {
        toastr['error'](error.reason);
      }
      else {
        toastr['success']('Order Created successfully');
      }
    });
}
orderUpdate = (target, productsArray, vertical, grandTotal, taxTotal, outlet,discountVal) => {

  return Meteor.call('order.update', productsArray, vertical, grandTotal, 
  taxTotal, outlet, target.orderIdEdit.value,discountVal,
    (error, result) => {
      console.log(error);
      if (error) {
        $('#orderErrorModal').find('.modal-body').text(error.reason);
        $('#orderErrorModal').modal();
      }
      else {
        $('#ic-create-Order').modal('hide');
        $('#orderSuccessModal').find('.modal-body').text('Order has been Updated successfully');
        $('#orderSuccessModal').modal();
      }
    });
}

