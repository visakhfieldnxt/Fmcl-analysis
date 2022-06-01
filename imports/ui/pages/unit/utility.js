/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdateunit = (target, ugpCode) => {

  let uomCode = target.uomCodes;
  let baseQty = target.baseQtys;
  let uomEntry = target.uomEntrys;

  return Meteor.call('unit.create', uomCode.value, baseQty.value, uomEntry.value, ugpCode, (error, result) => {
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
  updateunitlist = (target, ugpCode) => {

    let uomCode = target.uomCodeEdits;
    let baseQty = target.baseQtyEdits;
    let uomEntry = target.uomEntryEdits;

    let id = target.id;

    return Meteor.call('unit.update', id.value, uomCode.value, baseQty.value, uomEntry.value, ugpCode, (error, result) => {
      if (error) {
        $('#unitErrorModal').find('.modal-body').text(error.reason);
        $('#unitErrorModal').modal();
      }
      else {
        $('.updateunit').each(function () {
          this.reset();
        });
        $('#unitEditPage').modal('hide');
        $('#unitSuccessModal').find('.modal-body').text('Unit has been updated successfully');
        $('#unitSuccessModal').modal();
      }
    });
  }

