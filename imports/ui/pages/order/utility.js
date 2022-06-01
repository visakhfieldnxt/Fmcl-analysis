/**
 * @author Visakh
 */
import { HTTP } from 'meteor/http'


/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdateOrder = (target, customer, branch, totalDiscPercent, address, itemArrayL, beforeDiscountL,
  afterDiscountL, gSTL, grandTotalL, priceType, priceMode, currency, latitude, longitude, mVATArrayList, weight, taxTotal, street, block, city,ribNumber,driverName,approvalValue,approvalResonArray) => {

  const employee = Meteor.userId();
  const dueDateValue = target.dueDate;
  const remark_order = target.remark_order;
  const custRefDateValue = target.custRefDate;
  const dueDate = moment(dueDateValue.value, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const custRefDate = moment(custRefDateValue.value, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const custRef = target.custRef;
  Meteor.call('order.createOrUpdate', customer, dueDate, itemArrayL, branch, employee,
    beforeDiscountL, afterDiscountL, gSTL, grandTotalL, totalDiscPercent, remark_order.value,
    custRefDate, custRef.value, address, priceType, priceMode, currency, latitude, longitude, mVATArrayList, weight, taxTotal, street, block, city,ribNumber,driverName,approvalValue,approvalResonArray, (err, res) => {
      if (err) {
        $('#orderErrorModal').modal();
        $('#orderErrorModal').find('.modal-body').text(err.reason);
        $("#submit").attr("disabled", false);
        let nxtDay = new Date();
        nxtDay.setDate(nxtDay.getDate() + 1);
        $(".dueDate").val(moment(nxtDay).format('DD-MM-YYYY'));
      }
      else {
        target.dueDate.value = '';
        $("#selectCustomer").val('').trigger('change');
        $("#selectCustomerAddress").val('').trigger('change');
        // $('#orderCreate').modal('hide');
        $('#orderSuccessModal').find('.modal-body').text('Order has been registered successfully');
        $('#orderSuccessModal').modal();
        $("#submit").attr("disabled", false);
        let nxtDay = new Date();
        nxtDay.setDate(nxtDay.getDate() + 1);
        $(".dueDate").val(moment(nxtDay).format('DD-MM-YYYY'));
      }

    });
};

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
editOrUpdateOrder = (target, id, customer, branch, totalDiscPercent, address, itemArrayL, beforeDiscountL,
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
