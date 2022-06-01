
/**
 * TODO:Complete JS doc
 * @param id
 * @param status
 * @param remark
 * @param imageData
 * @param dealedBy
 */
updateDelivery = (id, status, remark, imageData, dealedBy,itemLine) => {

    Meteor.call('invoice.createOrUpdate', id, status, remark, imageData, dealedBy,itemLine,(err, res) => {
        if (err) {
            $('#deliveryErrorModal').find('.modal-body').text('Something went wrong');
            $('#deliveryErrorModal').modal();
            $(".updateDelivery").attr("disabled", false);
        } else {
            $('#orderDetailPage').modal('hide');
          $(".deliveryUpdate")[0].reset();
            $('#deliverySuccessModal').find('.modal-body').text('Delivery updated Successfully');
            $('#deliverySuccessModal').modal();
            Session.set("itemsDetailsList", '');
            $(".updateDelivery").attr("disabled", false);
        }
    });
}
