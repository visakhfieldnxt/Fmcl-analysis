/**
 * @author Visakh
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdatetax = (target, category) => {

  let taxName = target.taxNames;
  let taxCode = target.taxCodes;
  let taxRate = target.taxRates;

  return Meteor.call('tax.create', taxName.value, taxCode.value, taxRate.value, category, (error, result) => {
    if (error) {
      $('#taxErrorModal').find('.modal-body').text(error.reason);
      $('#taxErrorModal').modal();
    }
    else {
      $('#ic-create-tax').modal('hide');
      $("#taxAdd")[0].reset();
      $('#taxSuccessModal').find('.modal-body').text('Tax has been registered successfully');
      $('#taxSuccessModal').modal();
    }
  });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatetaxlist = (target, category) => {

    let taxName = target.taxNameEdits;
    let taxCode = target.taxCodeEdits;
    let taxRate = target.taxRateEdits;

    let id = target.id;

    return Meteor.call('tax.update', id.value, taxName.value, taxCode.value, taxRate.value, category, (error, result) => {
      if (error) {
        $('#taxErrorModal').find('.modal-body').text(error.reason);
        $('#taxErrorModal').modal();
      }
      else {
        $('.updatetax').each(function () {
          this.reset();
        });
        $('#taxEditPage').modal('hide');
        $('#taxSuccessModal').find('.modal-body').text('Tax has been updated successfully');
        $('#taxSuccessModal').modal();
      }
    });
  }

