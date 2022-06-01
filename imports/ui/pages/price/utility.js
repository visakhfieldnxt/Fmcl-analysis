/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateprice = (target, product, priceType, unit,vertical) => {
  let price = target.priceGet;
  let priceOmr = target.priceGetOmr;
  let priceWs = target.priceGetWS;
  return Meteor.call('price.create', price.value, product, priceType, unit, priceOmr.value, priceWs.value,vertical,
    (error, result) => {
      if (error) {
        $('#priceErrorModal').find('.modal-body').text(error.reason);
        $('#priceErrorModal').modal();
      }
      else {
        $('#ic-create-price').modal('hide');
        $("#priceAdd")[0].reset();
        $('#priceSuccessModal').find('.modal-body').text('Price has been registered successfully');
        $('#priceSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatepricelist = (target, product, priceType, unit,vertical) => {
    let price = target.priceGetEdit;
    let priceOmr = target.priceGetOmrEdit;
    let priceWs = target.priceGetWSEdit;
    let id = target.id;
    return Meteor.call('price.update', id.value, product, price.value, priceType, unit, priceOmr.value, priceWs.value,vertical,
      (error, result) => {
        if (error) {
          $('#priceErrorModal').find('.modal-body').text(error.reason);
          $('#priceErrorModal').modal();
        }
        else {
          $('.updateprice').each(function () {
            this.reset();
          });
          $('#priceEditPage').modal('hide');
          $('#priceSelectionEdit').val(null).trigger('change');
          $('#priceSuccessModal').find('.modal-body').text('Price has been updated successfully');
          $('#priceSuccessModal').modal();
        }
      });
  }

