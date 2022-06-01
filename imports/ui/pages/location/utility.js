/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdatelocation = (target, branch,loginUserVerticals) => {
  let locationName = target.locationNames;
  let locationCode = target.locationCodes;
  return Meteor.call('location.create', locationName.value, locationCode.value, branch,loginUserVerticals,
    (error, result) => {
      if (error) {
        $('#locationErrorModal').find('.modal-body').text(error.reason);
        $('#locationErrorModal').modal();
      }
      else {
        $('#ic-create-location').modal('hide');
        $("#locationAdd")[0].reset();
        $('#locationSuccessModal').find('.modal-body').text('Location has been registered successfully');
        $('#locationSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatelocationlist = (target, branch,loginUserVerticals) => {
    let locationName = target.locationNameEdits;
    let locationCode = target.locationCodeEdits;
    let id = target.id;
    return Meteor.call('location.update', id.value, locationName.value, locationCode.value, branch,loginUserVerticals,
      (error, result) => {
        if (error) {
          $('#locationErrorModal').find('.modal-body').text(error.reason);
          $('#locationErrorModal').modal();
        }
        else {
          $('.updatelocation').each(function () {
            this.reset();
          });
          $('#locationEditPage').modal('hide');
          $('#locationSelectionEdit').val(null).trigger('change');
          $('#locationSuccessModal').find('.modal-body').text('Location has been updated successfully');
          $('#locationSuccessModal').modal();
        }
      });
  }

