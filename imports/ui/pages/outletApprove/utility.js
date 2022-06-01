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
  updateOutletlist1 = (target, userId,outletType, outletClass) => {
      let outletName = target.outletName;
      let contactPerson = target.contactPerson;
      let contactNo = target.contactNo;
      let email = target.email;
      let addressval = target.addressval;
      let remarkval = target.remarkval1;
      let outlet_id = target.outlet_id;
       return Meteor.call('outlet.updateData', outletName.value, contactPerson.value, contactNo.value,
          email.value, addressval.value, remarkval.value, userId,
          outletType, outletClass,outlet_id.value,
          (error, result) => {
            if (error) {
              $('#outletErrorModal').find('.modal-body').text(error.reason);
              $('#outletErrorModal').modal();
            }
            else {
              $('#ic-create-Outlet').modal('hide');
              $('#outletSuccessModal').find('.modal-body').text('Outlet has been Updated successfully');
              $('#outletSuccessModal').modal();
            }
          });
  }

