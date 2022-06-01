/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdatebranch = (target, customerCode, supplierCode, wareHouse) => {

  let branchName = target.branchNames;
  let branchCode = target.branchCodes;
  let address = target.addresses;
  let street = target.streets;
  let paymentClearAct = target.paymentClearActs;

  return Meteor.call('branch.create', branchName.value, branchCode.value,
    customerCode, supplierCode, wareHouse, address.value, street.value, paymentClearAct.value, (error, result) => {
      if (error) {
        $('#branchErrorModal').find('.modal-body').text(error.reason);
        $('#branchErrorModal').modal();
      }
      else {
        $('#ic-create-branch').modal('hide');
        $("#branchAdd")[0].reset();
        $('#selectCustomerS').val(null).trigger('change');
        $('#customerBranches').val(null).trigger('change');
        $('#branchSuccessModal').find('.modal-body').text('Branch has been registered successfully');
        $('#branchSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updatebranchlist = (target, customerCode, supplierCode, wareHouse) => {

    let branchName = target.branchNameEdits;
    let branchCode = target.branchCodeEdits;
    let address = target.addressEdits;
    let street = target.streetEdits;
    let paymentClearAct = target.paymentClearActEdits;
    let id = target.id;

    return Meteor.call('branch.update', id.value, branchName.value, branchCode.value,
      customerCode, supplierCode, wareHouse, address.value, street.value, paymentClearAct.value, (error, result) => {
        if (error) {
          $('#branchErrorModal').find('.modal-body').text(error.reason);
          $('#branchErrorModal').modal();
        }
        else {
          $('.updatebranch').each(function () {
            this.reset();
          });
          $('#branchEditPage').modal('hide');
          $('#branchSelectionEdit').val(null).trigger('change');
          $('#branchSuccessModal').find('.modal-body').text('Branch has been updated successfully');
          $('#branchSuccessModal').modal();
        }
      });
  }

