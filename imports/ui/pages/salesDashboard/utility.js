/**
 * @author Visakh
 */
import { HTTP } from 'meteor/http'


/**
 * TODO: Complete JS doc
 * @param target
 * @param customer
 * @param branch
 * @param totalDiscPercent
 */
createOrUpdatePOScreditInvoice = (target, customer, branch, totalDiscPercent, address, itemArrayL, beforeDiscountL,
  afterDiscountL, gST, grandTotalL, transporterName, vehicleNumber, lorryBoy, driverName, delivery,
  priceType, priceMode, currency, latitude, longitude, bin, mVATArrayList, weight, taxTotal, street, block, city,approvalResonArray,approvalValue) => {
  const employee = Meteor.userId();
  const CreditInvoiceDateValue = target.arDate;
  const secondaryCustomer = target.secondaryCustomer;
  const dueDateValue = target.dueDate;
  const contactPerson = target.contactPerson;
  const contactNumber = target.contactNumber;
  const deliveryDateValue = target.deliveryDate;
  const custRefDateValue = target.custRefDate;
  const custRef = target.custRef;
  const creditInvoiceRemarks = target.remarkArinvoice;
  const driverContactNumber = target.cnumber;
  const CreditInvoiceDate = moment(CreditInvoiceDateValue.value, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const custRefDate = moment(custRefDateValue.value, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const dueDate = moment(dueDateValue.value, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const deliveryDate = moment(deliveryDateValue.value, 'DD-MM-YYYY').format('YYYY-MM-DD');

  Meteor.call('creditInvoice.createOrUpdatePOS', customer, branch, totalDiscPercent, address, itemArrayL, beforeDiscountL,
    afterDiscountL, gST, grandTotalL, employee, transporterName, vehicleNumber, lorryBoy, driverName, delivery, CreditInvoiceDate,
     dueDate, contactPerson.value, contactNumber.value, deliveryDate, custRefDate,
    custRef.value, creditInvoiceRemarks.value, driverContactNumber.value, priceType, priceMode,
    currency, latitude, longitude, bin, mVATArrayList, weight, taxTotal, street, block, city,secondaryCustomer.value,approvalResonArray,approvalValue, (err, res) => {
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
        // $('#order-create').modal('hide');
        $('#orderSuccessModal').find('.modal-body').text('POS Invoice has been registered successfully');
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
editOrUpdatePOSInvoice = (target, id, customer, branch, totalDiscPercent, address, itemArrayL, beforeDiscountL,
  afterDiscountL, gSTL, grandTotalL, latitude, longitude, mVATArrayList, weight, taxTotal,bin, approvalValue, approvalResonArray) => {
  Meteor.call('creditInvoice.editOrUpdatePOS', id, itemArrayL,
    beforeDiscountL, afterDiscountL, gSTL, grandTotalL, totalDiscPercent, // remark_QuotationEdit.value, custRefDate.value, custRef.value,
    latitude, longitude, mVATArrayList, weight, taxTotal,bin, approvalValue, approvalResonArray, (err, res) => {
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
        $('#orderSuccessModal').find('.modal-body').text('POS Invoice has been updated successfully');
        $('#orderSuccessModal').modal();
        $("#submit").attr("disabled", false);
        $('#remark_OrderEdit').val('');
        $('#custRefEdit').val('');
        $(".refDateEdit").val('');
        $(".dueDateEdit").val('');
      }
    });
};
