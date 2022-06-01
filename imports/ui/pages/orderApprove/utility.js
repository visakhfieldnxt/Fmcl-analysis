createOrUpdateOrders1 = (target, productsArray, vertical, grandTotal, taxTotal, outlet, discountVal) => {
  return Meteor.call('order.update', productsArray, vertical, grandTotal, taxTotal,
    outlet, target.orderIdEdit.value, discountVal,
    (error, result) => {
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