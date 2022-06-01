/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdatevertical = (target) => { 
  let verticalName = target.verticalNames;
  let verticalCode = target.verticalCodes; 
  return Meteor.call('verticals.create', verticalName.value, verticalCode.value,
    (error, result) => {
      if (error) {
        $('#verticalErrorModal').find('.modal-body').text(error.reason);
        $('#verticalErrorModal').modal();
      }
      else {
        $('#ic-create-vertical').modal('hide');
        $("#verticalAdd")[0].reset(); 
        $('#verticalSuccessModal').find('.modal-body').text('Vertical has been registered successfully');
        $('#verticalSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateverticallist = (target) => { 
    let verticalName = target.verticalNameEdits;
    let verticalCode = target.verticalCodeEdits; 
    let id = target.id;
    return Meteor.call('vertical.update', id.value, verticalName.value, verticalCode.value,
      (error, result) => {
        if (error) {
          $('#verticalErrorModal').find('.modal-body').text(error.reason);
          $('#verticalErrorModal').modal();
        }
        else {
          $('.updatevertical').each(function () {
            this.reset();
          });
          $('#verticalEditPage').modal('hide');
          $('#verticalSelectionEdit').val(null).trigger('change');
          $('#verticalSuccessModal').find('.modal-body').text('Vertical has been updated successfully');
          $('#verticalSuccessModal').modal();
        }
      });
  }

