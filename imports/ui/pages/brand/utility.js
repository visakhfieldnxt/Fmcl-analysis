/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdatebrand = (target,loginUserVerticals,principal) => { 
  let brandName = target.brandNames;
  let brandCode = target.brandCodes; 
  return Meteor.call('brand.create', brandName.value, brandCode.value,loginUserVerticals,principal,
    (error, result) => {
      if (error) {
        $('#brandErrorModal').find('.modal-body').text(error.reason);
        $('#brandErrorModal').modal();
      }
      else {
        $('#ic-create-brand').modal('hide');
        $("#brandAdd")[0].reset();
        $('#selectCustomerS').val(null).trigger('change');
        $('#customerbrandes').val(null).trigger('change');
        $('#brandSuccessModal').find('.modal-body').text('Brand has been registered successfully');
        $('#brandSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatebrandlist = (target,loginUserVerticals,principal) => { 
    let brandName = target.brandNameEdits;
    let brandCode = target.brandCodeEdits; 
    let id = target.id;
    return Meteor.call('brand.update', id.value, brandName.value, brandCode.value,loginUserVerticals,principal,
      (error, result) => {
        if (error) {
          $('#brandErrorModal').find('.modal-body').text(error.reason);
          $('#brandErrorModal').modal();
        }
        else {
          $('.updatebrand').each(function () {
            this.reset();
          });
          $('#brandEditPage').modal('hide');
          $('#brandSelectionEdit').val(null).trigger('change');
          $('#brandSuccessModal').find('.modal-body').text('Brand has been updated successfully');
          $('#brandSuccessModal').modal();
        }
      });
  }

