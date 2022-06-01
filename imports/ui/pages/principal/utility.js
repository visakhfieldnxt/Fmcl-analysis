/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateprincipal = (target,loginUserVerticals) => { 
  let principalName = target.principalNames;
  let principalCode = target.principalCodes; 
  return Meteor.call('principal.create', principalName.value, principalCode.value,loginUserVerticals,
    (error, result) => {
      if (error) {
        $('#principalErrorModal').find('.modal-body').text(error.reason);
        $('#principalErrorModal').modal();
      }
      else {
        $('#ic-create-principal').modal('hide');
        $("#principalAdd")[0].reset();
        $('#selectCustomerS').val(null).trigger('change');
        $('#customerprincipales').val(null).trigger('change');
        $('#principalSuccessModal').find('.modal-body').text('Principal has been registered successfully');
        $('#principalSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateprincipallist = (target,loginUserVerticals) => { 
    let principalName = target.principalNameEdits;
    let principalCode = target.principalCodeEdits; 
    let id = target.id;
    return Meteor.call('principal.update', id.value, principalName.value, principalCode.value,loginUserVerticals,
      (error, result) => {
        if (error) {
          $('#principalErrorModal').find('.modal-body').text(error.reason);
          $('#principalErrorModal').modal();
        }
        else {
          $('.updateprincipal').each(function () {
            this.reset();
          });
          $('#principalEditPage').modal('hide');
          $('#principalSelectionEdit').val(null).trigger('change');
          $('#principalSuccessModal').find('.modal-body').text('Principal has been updated successfully');
          $('#principalSuccessModal').modal();
        }
      });
  }

