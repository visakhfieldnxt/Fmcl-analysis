/**
 * @author Visakh
 */
import { HTTP } from 'meteor/http'

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
orderEditOrUpdate  = (target, id, customer, branch, totalDiscPercent, address, itemArrayL, beforeDiscountL,
  afterDiscountL, gSTL, grandTotalL, priceType, priceMode, currency, latitude, longitude, mVATArrayList, weight, taxTotal,approvalValue,approvalResonArray) => {

  Meteor.call('order.editOrUpdate', id, itemArrayL,
    beforeDiscountL, afterDiscountL, gSTL, grandTotalL, totalDiscPercent, // remark_QuotationEdit.value, custRefDate.value, custRef.value,
    latitude, longitude, mVATArrayList, weight, taxTotal,approvalValue,approvalResonArray, (err, res) => {
      if (err) {
        $('#orderErrorModal').modal();
        $('#orderErrorModal').find('.modal-body').text(err.reason);
        $("#submit").attr("disabled", false);
        $('#remark_OrderEdit').val('');
        $('#custRefEdit').val('');
        $(".refDateEdit").val('');
        $(".dueDateEdit").val('');
      }
      else {

        $("#selectcustomerEdit").val('').trigger('change');
        $("#selectCustomerAddressEdit").val('').trigger('change');
        // $('#orderEditDetailPage').modal('hide');
        $('#orderSuccessModal').find('.modal-body').text('Order has been updated successfully');
        $('#orderSuccessModal').modal();
        $("#submit").attr("disabled", false);
        $('#remark_OrderEdit').val('');
        $('#custRefEdit').val('');
        $(".refDateEdit").val('');
        $(".dueDateEdit").val('');
      }
    });
};
