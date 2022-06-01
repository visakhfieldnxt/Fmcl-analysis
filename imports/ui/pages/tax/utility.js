createOrUpdateTax = (target,tid) => {
  let code = target.taxCode;
  let name = target.taxName;
  let percentage = target.taxPrec;
  // let active = target.taxstatus;
  let taxname = target.taxnameid;

  return Meteor.call('tax.create', code.value,name.value,percentage.value,taxname.value, (error, result) => {
      if (error) {
        $('#taxErrorModal').find('.modal-body').text(error.reason);
        $('#taxErrorModal').modal();
       
      }
      else {
        $('#taxCode').val('');
        $('#taxName').val('');
        $('#taxPrec').val('');
        $('#tax-create').modal('hide');
        $('#taxSuccessModal').find('.modal-body').text('Tax has been created successfully');
        $('#taxSuccessModal').modal();
        
      }
    });
},
updateTax = (target) => {
  let code = target.taxCode1;
  let name = target.taxName1;
  let percentage = target.taxPrec1;
  let taxname = target.taxnameid1;

  return Meteor.call('tax.update', code.value,name.value,percentage.value,taxname.value, (error, result) => {
      if (error) {
        $('#taxErrorModal').find('.modal-body').text(error.reason);
        $('#taxErrorModal').modal();
       
      }
      else {
        $('#taxCode1').val('');
        $('#taxName1').val('');
        $('#taxPrec1').val('');
        $('#tax-create').modal('hide');
        $('#taxSuccessModal').find('.modal-body').text('Tax has been updated successfully');
        $('#taxSuccessModal').modal();
        
      }
    });
}