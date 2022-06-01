/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdatecategory = (target, brand, loginUserVerticals, principal) => {
  let categoryName = target.categoryNames;
  let categoryCode = target.categoryCodes;
  return Meteor.call('category.create', categoryName.value, categoryCode.value, brand, loginUserVerticals, principal,
    (error, result) => {
      if (error) {
        $('#categoryErrorModal').find('.modal-body').text(error.reason);
        $('#categoryErrorModal').modal();
      }
      else {
        $('#ic-create-category').modal('hide');
        $("#categoryAdd")[0].reset();
        $('#categorySuccessModal').find('.modal-body').text('Category has been registered successfully');
        $('#categorySuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatecategorylist = (target, brand, loginUserVerticals, principal) => {
    let categoryName = target.categoryNameEdits;
    let categoryCode = target.categoryCodeEdits;
    let id = target.id;
    return Meteor.call('category.update', id.value, categoryName.value, categoryCode.value,
      brand, loginUserVerticals, principal,
      (error, result) => {
        if (error) {
          $('#categoryErrorModal').find('.modal-body').text(error.reason);
          $('#categoryErrorModal').modal();
        }
        else {
          $('.updatecategory').each(function () {
            this.reset();
          });
          $('#categoryEditPage').modal('hide');
          $('#categorySelectionEdit').val(null).trigger('change');
          $('#categorySuccessModal').find('.modal-body').text('Category has been updated successfully');
          $('#categorySuccessModal').modal();
        }
      });
  }

