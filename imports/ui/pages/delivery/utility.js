createOrUpdateDelivery = (target,tid) => {
  let code = target.deliveryCode;
  let name = target.deliveryName;
  let percentage = target.deliveryPrec;
  // let active = target.deliverystatus;
  let deliveryname = target.deliverynameid;

  return Meteor.call('delivery.create', code.value,name.value,percentage.value,deliveryname.value, (error, result) => {
      if (error) {
        $('#deliveryErrorModal').find('.modal-body').text(error.reason);
        $('#deliveryErrorModal').modal();
       
      }
      else {
        $('#deliveryCode').val('');
        $('#deliveryName').val('');
        $('#deliveryPrec').val('');
        $('#delivery-create').modal('hide');
        $('#deliverySuccessModal').find('.modal-body').text('delivery has been created successfully');
        $('#deliverySuccessModal').modal();
        
      }
    });
},
updateDelivery = (target) => {
  let code = target.deliveryCode1;
  let name = target.deliveryName1;
  let percentage = target.deliveryPrec1;
  let deliveryname = target.deliverynameid1;

  return Meteor.call('delivery.update', code.value,name.value,percentage.value,deliveryname.value, (error, result) => {
      if (error) {
        $('#deliveryErrorModal').find('.modal-body').text(error.reason);
        $('#deliveryErrorModal').modal();
       
      }
      else {
        $('#deliveryCode1').val('');
        $('#deliveryName1').val('');
        $('#deliveryPrec1').val('');
        $('#delivery-create').modal('hide');
        $('#deliverySuccessModal').find('.modal-body').text('delivery has been updated successfully');
        $('#deliverySuccessModal').modal();
        
      }
    });
}