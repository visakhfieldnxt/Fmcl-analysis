/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateproduct = (target, loginUserVerticals, brand, category, principal) => {
  let productName = target.productNames;
  let productCode = target.productCodes;
  let baseUnit = target.baseUnit;
  let baseQty = target.baseQty;

  return Meteor.call('product.create', productName.value, productCode.value, loginUserVerticals,
    baseUnit.value, baseQty.value,
    brand, category, principal,
    (error, result) => {
      if (error) {
        $('#productErrorModal').find('.modal-body').text(error.reason);
        $('#productErrorModal').modal();
      }
      else {
        $('#ic-create-product').modal('hide');
        $("#productAdd")[0].reset();
        $('#productSuccessModal').find('.modal-body').text('Product has been registered successfully');
        $('#productSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateproductlist = (target, loginUserVerticals, unit, brand, category, principal) => {
    let productName = target.productNameEdits;
    let productCode = target.productCodeEdits;
    let id = target.id;
    return Meteor.call('product.update', id.value, productName.value, productCode.value,
      loginUserVerticals, unit, brand, category, principal,
      (error, result) => {
        if (error) {
          $('#productErrorModal').find('.modal-body').text(error.reason);
          $('#productErrorModal').modal();
        }
        else {
          $('.updateproduct').each(function () {
            this.reset();
          });
          $('#productEditPage').modal('hide');
          $('#productSuccessModal').find('.modal-body').text('Product has been updated successfully');
          $('#productSuccessModal').modal();
        }
      });
  }

