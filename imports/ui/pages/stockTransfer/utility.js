/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateStockTransfer = (target, productsArray, empId, vertical) => {
  Meteor.call('firebase:pushNotification', empId, 'Stock Transfer Request', 'New Stock Transfer Request', 'stockTransfer');
  return Meteor.call('stockTransfer.create', productsArray, empId, vertical,
    (error, result) => {
      if (error) {
        toastr['error'](err.reason);
      }
      else {
        toastr['success']('Stock has been transferred successfully');
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateStockTransfer = (target) => {
    let stockName = target.stockNameEdits;
    let stockCode = target.stockCodeEdits;
    let id = target.id;
    return Meteor.call('stock.update', id.value, stockName.value, stockCode.value,
      (error, result) => {
        if (error) {
          $('#stockErrorModal').find('.modal-body').text(error.reason);
          $('#stockErrorModal').modal();
        }
        else {
          $('.updatestock').each(function () {
            this.reset();
          });
          $('#stockEditPage').modal('hide');
          $('#stockSelectionEdit').val(null).trigger('change');
          $('#stockSuccessModal').find('.modal-body').text('Stock has been updated successfully');
          $('#stockSuccessModal').modal();
        }
      });
  }

