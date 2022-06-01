/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateStock = (target, productsArray, vertical) => {
  let invoiceNo = target.invoiceNos;
  let stockDate = target.stockDate;
  return Meteor.call('stock.create', productsArray, vertical, invoiceNo.value,
    stockDate.value,
    (error, result) => {
      if (error) {
        toastr['error'](err.reason);
      }
      else {
        toastr['success']('Stock list has been updated successfully');
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatestocklist = (target) => {
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

