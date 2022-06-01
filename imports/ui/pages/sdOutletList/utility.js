/**
 * @author Nithin
 */

/**
 * TODO: Complete JS doc
 * @param target 
 */
createOrUpdateOutlet = (target, insideImage, outsideImage, userId, latitude, longitude,outletType, outletClass) => {
  let outletName = target.outletName;
  let contactPerson = target.contactPerson;
  let contactNo = target.contactNo;
  let email = target.email;
  let addressval = target.addressval;
  let remarkval = target.remarkval;
  return Meteor.call('outlet.createData', outletName.value, contactPerson.value, contactNo.value,
    email.value, addressval.value, remarkval.value, insideImage, outsideImage, userId, latitude, longitude,
    outletType, outletClass,
    (error, result) => {
      if (error) {
        $('#outletErrorModal').find('.modal-body').text(error.reason);
        $('#outletErrorModal').modal();
      }
      else {
        $('#ic-create-Outlet').modal('hide');
        $("#outletAdds")[0].reset();
        $('#outletSuccessModal').find('.modal-body').text('Outlet has been created successfully');
        $('#outletSuccessModal').modal();
      }
    });
},
  /**
 * TODO: Complete JS doc
 * @param target
 */
  updateOutletlist = (target, loginUserVerticals) => {
    let branchName = target.branchNameEdits;
    let branchCode = target.branchCodeEdits;
    let id = target.id;
    return Meteor.call('branch.update', id.value, branchName.value, branchCode.value, loginUserVerticals,
      (error, result) => {
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

