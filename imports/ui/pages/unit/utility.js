/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateunit = (target, product,vertical) => {
  let unitName = target.unitNames;
  let unitCode = target.unitCodes;
  let baseQty = target.baseQty;
  return Meteor.call('unit.create', unitName.value, unitCode.value, product,baseQty.value,vertical,
    (error, result) => {
      if (error) {
        $('#unitErrorModal').find('.modal-body').text(error.reason);
        $('#unitErrorModal').modal();
      }
      else {
        $('#ic-create-unit').modal('hide');
        $("#unitAdd")[0].reset();
        $('#unitSuccessModal').find('.modal-body').text('Unit has been registered successfully');
        $('#unitSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateunitlist = (target, product,vertical) => {
    let unitName = target.unitNameEdits;
    let unitCode = target.unitCodeEdits;
    let baseQty = target.baseQtyEdit;
    let id = target.id;
    return Meteor.call('unit.update', id.value, unitName.value, unitCode.value, product,baseQty.value,vertical,
      (error, result) => {
        if (error) {
          $('#unitErrorModal').find('.modal-body').text(error.reason);
          $('#unitErrorModal').modal();
        }
        else {
          $('.updateunit').each(function () {
            this.reset();
          });
          $('#unitEditPage').modal('hide');
          $('#unitSelectionEdit').val(null).trigger('change');
          $('#unitSuccessModal').find('.modal-body').text('Unit has been updated successfully');
          $('#unitSuccessModal').modal();
        }
      });
  }

