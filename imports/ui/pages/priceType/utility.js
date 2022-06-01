/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdatePriceType = (target, vertical) => {
  let priceTypeName = target.priceTypeNames;
  let priceTypeCode = target.priceTypeCodes;
  return Meteor.call('priceType.create', priceTypeName.value, priceTypeCode.value, vertical,
    (error, result) => {
      if (error) {
        $('#priceTypeErrorModal').find('.modal-body').text(error.reason);
        $('#priceTypeErrorModal').modal();
      }
      else {
        $('#ic-create-priceType').modal('hide');
        $("#priceTypeAdd")[0].reset();
        $('#priceTypeSuccessModal').find('.modal-body').text('PriceType has been registered successfully');
        $('#priceTypeSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatePriceTypelist = (target, vertical) => {
    let priceTypeName = target.priceTypeNameEdits;
    let priceTypeCode = target.priceTypeCodeEdits;
    let id = target.id;
    return Meteor.call('priceType.update', id.value, priceTypeName.value, priceTypeCode.value, vertical,
      (error, result) => {
        if (error) {
          $('#priceTypeErrorModal').find('.modal-body').text(error.reason);
          $('#priceTypeErrorModal').modal();
        }
        else {
          $('.updatepriceType').each(function () {
            this.reset();
          });
          $('#priceTypeEditPage').modal('hide');
          $('#priceTypeSelectionEdit').val(null).trigger('change');
          $('#priceTypeSuccessModal').find('.modal-body').text('PriceType has been updated successfully');
          $('#priceTypeSuccessModal').modal();
        }
      });
  }

