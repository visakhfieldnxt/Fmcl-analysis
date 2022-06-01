/**
 * @author Visakh
 */
import { HTTP } from 'meteor/http'


/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createStockTransfer = (target, itemArrayL, wareHouseFrom, wareHouseTo, employee, branchs, weight) => {
  const dueDateValue = target.dueDate;
  const remark_stock = target.remark_stock;
  const dueDate = moment(dueDateValue.value, 'DD-MM-YYYY').format('YYYY-MM-DD');

  Meteor.call('stockTransfer.create', dueDate, itemArrayL, wareHouseFrom, wareHouseTo, employee, remark_stock.value, branchs, weight, (err, res) => {
    if (err) {
      $('#stockTransferErrorModal').modal();
      $('#stockTransferErrorModal').find('.modal-body').text(err.reason);
      $("#submit").attr("disabled", false);
      let nxtDay = new Date();
      nxtDay.setDate(nxtDay.getDate());
      $(".dueDate").val(moment(nxtDay).format('DD-MM-YYYY'));
    }
    else {
      target.dueDate.value = '';
      // $('#stockTransfer-create').modal('hide');
      $('#stockTransferSuccessModal').find('.modal-body').text('Stock Transfer Request has been submitted successfully');
      $('#stockTransferSuccessModal').modal();
      $("#submit").attr("disabled", false);
      let nxtDay = new Date();
      nxtDay.setDate(nxtDay.getDate());
      $(".dueDate").val(moment(nxtDay).format('DD-MM-YYYY'));
    }
  });
};
editORUpdateStockTransfer = (orderId, itemArrayL, weight) => {
  Meteor.call('stockTransfer.editORUpdate', orderId, itemArrayL, weight, (err, res) => {
    if (err) {
      $('#stockTransferErrorModal').modal();
      $('#stockTransferErrorModal').find('.modal-body').text(err.reason);
      $("#submit").attr("disabled", false);
    }
    else {
      // $('#stockeEditDetailPage').modal('hide');
      $('#stockTransferSuccessModal').find('.modal-body').text('Stock Transfer Request updated successfully');
      $('#stockTransferSuccessModal').modal();
      $("#submit").attr("disabled", false);
    }
  });
};
