/**
 * @author Visakh
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createRole = (target, id) => {
  let name = target.name;
  let description = target.description;
  let url = target.homeURL;
  let historyView = target.history_view;
  let reportView = target.report_view;
  let reportOwnView = target.reportOwn_view;
  let userView = target.user_view;
  let userUpdate = target.user_update;
  let userCreate = target.user_create;
  let userDelete = target.user_delete;
  let vanSaleUserView = target.vanSaleUsers_view;
  let vanSaleUserUpdate = target.vanSaleUsers_update;
  let vanSaleUserCreate = target.vanSaleUsers_create;
  let vanSaleUserDelete = target.vanSaleUsers_delete;

  // console.log("vanSaleUserView",vanSaleUserView.value);
  let roleView = target.role_view;
  let roleUpdate = target.role_update;
  let roleCreate = target.role_create;
  let roleDelete = target.role_delete;
  let designationView = target.designation_view;
  let designationUpdate = target.designation_update;
  let designationCreate = target.designation_create;
  let designationDelete = target.designation_delete;

  let branchTransferView = target.branchTransfer_view;
  let branchTransferCreate = target.branchTransfer_create;
  let branchTransferApproveView = target.branchTransferApprove_view;

  let leadView = target.lead_view;
  let leadUpdate = target.lead_update;
  let leadCreate = target.lead_create;
  let leadDelete = target.lead_delete;
  let admindashboard = target.admindashboard_view;
  let salesdashboard = target.salesdashboard_view;
  let salepos = target.posdashboard_view;
  let orderCreate = target.order_create;
  let orderView = target.order_view;
  let orderSeniorCreate = target.orderSenior_create;
  let orderSeniorView = target.orderSenior_view;
  let salesReturnCreate = target.salesReturn_create;
  let salesReturnView = target.salesReturn_view;
  let stockTransferRequestCreate = target.stockTransferRequest_create;
  let stockTransferRequestView = target.stockTransferRequest_view;
  let deliveryView = target.delivery_view;
  let deliveryUpdate = target.delivery_update;
  let dispatchView = target.dispatch_view;
  let dispatchUpdate = target.dispatch_update;
  let dispatchRejectView = target.dispatchReject_view;
  let collectionDueTodayView = target.collectionDueToday_view;
  let collectionDueTodayCreate = target.collectionDueToday_create;
  let creditInvoiceView = target.creditInvoice_view;
  let creditInvoiceCreate = target.creditInvoice_create;
  let creditNoteView = target.creditNote_view;
  let creditNoteCreate = target.creditNote_create;
  let arInvoicePaymentView = target.arInvoicePayment_view;
  let arInvoicePaymentCreate = target.arInvoicePayment_create;
  let arInvoiceSeniorPaymentView = target.arInvoiceSeniorPayment_view;
  let arInvoiceSeniorPaymentCreate = target.arInvoiceSeniorPayment_create;
  let salesQuotationView = target.salesQuotation_view;
  let salesQuotationCreate = target.salesQuotation_create;
  let salesQuotationSeniorView = target.salesQuotationSenior_view;
  let salesQuotationSeniorCreate = target.salesQuotationSenior_create;
  let invoiceView = target.invoice_view;
  let deliveryBoyView = target.deliveryBoy_view;
  let orderApproveView = target.orderApprove_view;
  let quotationApproveView = target.quotationApprove_view;
  let salesReturnApproveView = target.salesReturnApprove_view;
  let stockTransferApproveView = target.stockTransferApprove_view;
  let creditNoteApproveView = target.creditNoteApprove_view;
  let creditInvoiceApproveView = target.creditInvoiceApprove_view;
  let pickListView = target.pickList_view;
  let orderReportView = target.orderReport_view;
  let salesQuotationReportView = target.salesQuotationReport_view;
  let arInvoiceReportView = target.arInvoiceReport_view;
  let creditInvoiceReportView = target.creditInvoiceReport_view;
  let salesReturnReportView = target.salesReturnReport_view;
  let creditNoteReportView = target.creditNoteReport_view;
  let branchTransferReportView = target.branchTransferReport_view;
  let collectionReportView = target.collectionReport_view;
  let stockTransferReportView = target.stockTransferReport_view;
  let invoiceReportView = target.invoiceReport_view;
  let deliveryReportView = target.deliveryReport_view;
  let purchasePrintView = target.purchasePrint_view;
  let activityView = target.activity_view;
  let activityCreate = target.activity_create;
  let activitySeniorView = target.activitySenior_view;
  let accountantView = target.accountant_view;
  let bpAdminView = target.bpAdmin_view;
  let posReportView = target.posReport_view;
  let routeView = target.route_view;
  let routeUpdate = target.route_update;
  let routeCreate = target.route_create;
  let routeDelete = target.route_delete;
  let locationView = target.location_view;
  let pendingArInvoiceView = target.pendingArInvoice_view;
  let pendingPosInvoiceView = target.pendingPosInvoice_view;
  let attendanceView = target.attendance_view;
  let routeApproveView = target.routeApprove_view;
  let salesSummaryReportView = target.salesSummaryReport_view;
  let stockSummaryReportView = target.stockSummaryReport_view;
  let skippedCustomerReportView = target.skippedCustomerReport_view;
  let noSalesReportView = target.noSalesReport_view;
  let superAdmindashboard = target.superAdmindashboard_view;
  let targetOutletReportView = target.targetOutletReport_view;
  let callRateReportView = target.callRateReport_view;
  let strikeRateReportView = target.strikeRateReport_view;
  let priceUpdateView = target.priceUpdate_view;
  let vansaleReportView = target.vansaleReport_view;
  let cxoDashboardView = target.cxoDashboard_view;
  let itemWiseReportView = target.itemWiseReport_view;
  let routeWiseReportView = target.routeWiseReport_view;
  let numericalDistributonReportView = target.numericalDistributonReport_view;
  let whsStockReportView = target.whsStockReport_view;
  let weightageDistributionReportView = target.weightageDistributionReport_view;
  let coverageDistributionReportView = target.coverageDistributionReport_view;
  let priceTypeEditView = target.priceTypeEdit_view;
  let expenseListView = target.expenseList_view;

  let masterDataView = target.masterData_view;
  let masterDataUpdate = target.masterData_update;
  let masterDataCreate = target.masterData_create;
  let masterDataDelete = target.masterData_delete;

  Meteor.call('role.createOrUpdate', id, name.value, description.value, url.value, historyView.checked, reportView.checked, reportOwnView.checked,
    userView.checked, userUpdate.checked, userCreate.checked, userDelete.checked,
    vanSaleUserView.checked, vanSaleUserUpdate.checked, vanSaleUserCreate.checked, vanSaleUserDelete.checked,
    roleView.checked, roleUpdate.checked, roleCreate.checked, roleDelete.checked,
    designationView.checked, designationUpdate.checked, designationCreate.checked, designationDelete.checked,
    branchTransferView.checked, branchTransferCreate.checked, branchTransferApproveView.checked,
    leadView.checked, leadUpdate.checked, leadCreate.checked, leadDelete.checked,
    admindashboard.checked, salesdashboard.checked, orderCreate.checked, orderView.checked,
    orderSeniorCreate.checked, orderSeniorView.checked, salesReturnCreate.checked, salesReturnView.checked,
    stockTransferRequestCreate.checked, stockTransferRequestView.checked, deliveryView.checked, deliveryUpdate.checked, dispatchView.checked,
    dispatchUpdate.checked, dispatchRejectView.checked, collectionDueTodayView.checked, collectionDueTodayCreate.checked,
    creditInvoiceView.checked, creditInvoiceCreate.checked, creditNoteView.checked, creditNoteCreate.checked, arInvoicePaymentView.checked, arInvoicePaymentCreate.checked,
    arInvoiceSeniorPaymentView.checked, arInvoiceSeniorPaymentCreate.checked, salesQuotationView.checked, salesQuotationCreate.checked, salesQuotationSeniorView.checked, salesQuotationSeniorCreate.checked,
    invoiceView.checked, deliveryBoyView.checked,
    orderApproveView.checked, quotationApproveView.checked, salesReturnApproveView.checked, stockTransferApproveView.checked,
    creditNoteApproveView.checked, creditInvoiceApproveView.checked,
    pickListView.checked, orderReportView.checked, salesQuotationReportView.checked, arInvoiceReportView.checked,
    creditInvoiceReportView.checked, salesReturnReportView.checked, creditNoteReportView.checked,
    branchTransferReportView.checked, collectionReportView.checked, stockTransferReportView.checked,
    invoiceReportView.checked, deliveryReportView.checked, purchasePrintView.checked,
    activityView.checked, activityCreate.checked, activitySeniorView.checked, accountantView.checked,
    bpAdminView.checked, salepos.checked, posReportView.checked,
    routeView.checked, routeUpdate.checked, routeCreate.checked,
    routeDelete.checked, locationView.checked, pendingArInvoiceView.checked,
    pendingPosInvoiceView.checked, attendanceView.checked, routeApproveView.checked,
    salesSummaryReportView.checked, stockSummaryReportView.checked,
    skippedCustomerReportView.checked, noSalesReportView.checked, superAdmindashboard.checked,
    targetOutletReportView.checked, callRateReportView.checked, strikeRateReportView.checked,
    priceUpdateView.checked, vansaleReportView.checked,
    cxoDashboardView.checked, itemWiseReportView.checked, routeWiseReportView.checked,
    numericalDistributonReportView.checked, whsStockReportView.checked,
    weightageDistributionReportView.checked, coverageDistributionReportView.checked,
    priceTypeEditView.checked, expenseListView.checked, masterDataView.checked, masterDataUpdate.checked, masterDataCreate.checked,
    masterDataDelete.checked,
    (err) => {
      if (err) {
        $('#roleErrorModal').find('.modal-body').text(err.reason);
        $('#roleErrorModal').modal();
      }
      else {
        $('#ic-create').modal('hide');
        $("#roleAdd").each(function () {
          this.reset();
          $("#roleName").css({ "color": "black", "border": " 1px solid #00c0ef" });
          $("#roleSubmit").prop('disabled', false);
        });
        $('#roleSuccessModal').find('.modal-body').text('Role has been registered successfully');
        $('#roleSuccessModal').modal();
        $("#homeURL").val('').trigger('change');
      }
    });
};
/**
* TODO: Complete JS doc
* @param target
*/
updateRole = (target) => {
  let id = target._idRole;
  let name = target.name;
  let description = target.description;
  let url = target.homeURLUpdate;
  let historyView = target.history_view;
  let reportView = target.report_view;
  let reportOwnView = target.reportOwn_view;
  let userView = target.user_view;
  let userUpdate = target.user_update;
  let userCreate = target.user_create;
  let userDelete = target.user_delete;
  let vanSaleUserView = target.vanSaleUsers_view;
  let vanSaleUserUpdate = target.vanSaleUsers_update;
  let vanSaleUserCreate = target.vanSaleUsers_create;
  let vanSaleUserDelete = target.vanSaleUsers_delete;
  // console.log("vanSaleUserView",vanSaleUserView.value);

  let roleView = target.role_view;
  let roleUpdate = target.role_update;
  let roleCreate = target.role_create;
  let roleDelete = target.role_delete;
  let designationView = target.designation_view;
  let designationUpdate = target.designation_update;
  let designationCreate = target.designation_create;
  let designationDelete = target.designation_delete;

  let branchTransferView = target.branchTransfer_view;
  let branchTransferCreate = target.branchTransfer_create;
  let branchTransferApproveView = target.branchTransferApprove_view;

  let leadView = target.lead_view;
  let leadUpdate = target.lead_update;
  let leadCreate = target.lead_create;
  let leadDelete = target.lead_delete;
  let admindashboard = target.admindashboard_view;
  let salesdashboard = target.salesdashboard_view;
  let salepos = target.pos_view;
  let orderCreate = target.order_create;
  let orderView = target.order_view;
  let orderSeniorCreate = target.orderSenior_create;
  let orderSeniorView = target.orderSenior_view;
  let salesReturnCreate = target.salesReturn_create;
  let salesReturnView = target.salesReturn_view;
  let stockTransferRequestCreate = target.stockTransferRequest_create;
  let stockTransferRequestView = target.stockTransferRequest_view;
  let deliveryView = target.delivery_view;
  let deliveryUpdate = target.delivery_update;
  let dispatchView = target.dispatch_view;
  let dispatchUpdate = target.dispatch_update;
  let dispatchRejectView = target.dispatchReject_view;
  let collectionDueTodayView = target.collectionDueToday_view;
  let collectionDueTodayCreate = target.collectionDueToday_create;
  let creditInvoiceView = target.creditInvoice_view;
  let creditInvoiceCreate = target.creditInvoice_create;
  let creditNoteView = target.creditNote_view;
  let creditNoteCreate = target.creditNote_create;
  let arInvoicePaymentView = target.arInvoicePayment_view;
  let arInvoicePaymentCreate = target.arInvoicePayment_create;
  let arInvoiceSeniorPaymentView = target.arInvoiceSeniorPayment_view;
  let arInvoiceSeniorPaymentCreate = target.arInvoiceSeniorPayment_create;
  let salesQuotationView = target.salesQuotation_view;
  let salesQuotationCreate = target.salesQuotation_create;
  let salesQuotationSeniorView = target.salesQuotationSenior_view;
  let salesQuotationSeniorCreate = target.salesQuotationSenior_create;
  let invoiceView = target.invoice_view;
  let deliveryBoyView = target.deliveryBoy_view;
  let orderApproveView = target.orderApprove_view;
  let quotationApproveView = target.quotationApprove_view;
  let salesReturnApproveView = target.salesReturnApprove_view;
  let stockTransferApproveView = target.stockTransferApprove_view;
  let creditNoteApproveView = target.creditNoteApprove_view;
  let creditInvoiceApproveView = target.creditInvoiceApprove_view;
  let pickListView = target.pickList_view;
  let orderReportView = target.orderReport_view;
  let salesQuotationReportView = target.salesQuotationReport_view;
  let arInvoiceReportView = target.arInvoiceReport_view;
  let creditInvoiceReportView = target.creditInvoiceReport_view;
  let salesReturnReportView = target.salesReturnReport_view;
  let creditNoteReportView = target.creditNoteReport_view;
  let branchTransferReportView = target.branchTransferReport_view;
  let collectionReportView = target.collectionReport_view;
  let stockTransferReportView = target.stockTransferReport_view;
  let invoiceReportView = target.invoiceReport_view;
  let deliveryReportView = target.deliveryReport_view;
  let purchasePrintView = target.purchasePrint_view;
  let activityView = target.activity_view;
  let activityCreate = target.activity_create;
  let activitySeniorView = target.activitySenior_view;
  let accountantView = target.accountant_view;
  let bpAdminView = target.bpAdmin_view;
  let posReportView = target.posReport_view;
  let routeView = target.route_view;
  let routeUpdate = target.route_update;
  let routeCreate = target.route_create;
  let routeDelete = target.route_delete;
  let locationView = target.location_view;
  let pendingArInvoiceView = target.pendingArInvoice_view;
  let pendingPosInvoiceView = target.pendingPosInvoice_view;
  let attendanceView = target.attendance_view;
  let routeApproveView = target.routeApprove_view;
  let salesSummaryReportView = target.salesSummaryReport_view;
  let stockSummaryReportView = target.stockSummaryReport_view;
  let skippedCustomerReportView = target.skippedCustomerReport_view;
  let noSalesReportView = target.noSalesReport_view;
  let superAdmindashboard = target.superAdmindashboard_view;
  let targetOutletReportView = target.targetOutletReport_view;
  let callRateReportView = target.callRateReport_view;
  let strikeRateReportView = target.strikeRateReport_view;
  let priceUpdateView = target.priceUpdate_view;
  let vansaleReportView = target.vansaleReport_view;
  let cxoDashboardView = target.cxoDashboard_view;
  let itemWiseReportView = target.itemWiseReport_view;
  let routeWiseReportView = target.routeWiseReport_view;
  let numericalDistributonReportView = target.numericalDistributonReport_view;
  let whsStockReportView = target.whsStockReport_view;
  let weightageDistributionReportView = target.weightageDistributionReport_view;
  let coverageDistributionReportView = target.coverageDistributionReport_view;
  let priceTypeEditView = target.priceTypeEdit_view;
  let expenseListView = target.expenseList_view;

  let masterDataView = target.masterData_view;
  let masterDataUpdate = target.masterData_update;
  let masterDataCreate = target.masterData_create;
  let masterDataDelete = target.masterData_delete;

  Meteor.call('role.createOrUpdate', id.value, name.value, description.value, url.value, historyView.checked, reportView.checked, reportOwnView.checked,
    userView.checked, userUpdate.checked, userCreate.checked, userDelete.checked,
    vanSaleUserView.checked, vanSaleUserUpdate.checked, vanSaleUserCreate.checked, vanSaleUserDelete.checked,
    roleView.checked, roleUpdate.checked, roleCreate.checked, roleDelete.checked,
    designationView.checked, designationUpdate.checked, designationCreate.checked, designationDelete.checked,
    branchTransferView.checked, branchTransferCreate.checked, branchTransferApproveView.checked,
    leadView.checked, leadUpdate.checked, leadCreate.checked, leadDelete.checked,
    admindashboard.checked, salesdashboard.checked, orderCreate.checked, orderView.checked,
    orderSeniorCreate.checked, orderSeniorView.checked, salesReturnCreate.checked, salesReturnView.checked,
    stockTransferRequestCreate.checked, stockTransferRequestView.checked, deliveryView.checked, deliveryUpdate.checked, dispatchView.checked,
    dispatchUpdate.checked, dispatchRejectView.checked, collectionDueTodayView.checked, collectionDueTodayCreate.checked, creditInvoiceView.checked, creditInvoiceCreate.checked,
    creditNoteView.checked, creditNoteCreate.checked, arInvoicePaymentView.checked, arInvoicePaymentCreate.checked, arInvoiceSeniorPaymentView.checked, arInvoiceSeniorPaymentCreate.checked,
    salesQuotationView.checked, salesQuotationCreate.checked, salesQuotationSeniorView.checked, salesQuotationSeniorCreate.checked,
    invoiceView.checked, deliveryBoyView.checked, orderApproveView.checked, quotationApproveView.checked,
    salesReturnApproveView.checked, stockTransferApproveView.checked,
    creditNoteApproveView.checked, creditInvoiceApproveView.checked,
    pickListView.checked, orderReportView.checked, salesQuotationReportView.checked, arInvoiceReportView.checked,
    creditInvoiceReportView.checked, salesReturnReportView.checked, creditNoteReportView.checked, branchTransferReportView.checked,
    collectionReportView.checked, stockTransferReportView.checked, invoiceReportView.checked, deliveryReportView.checked, purchasePrintView.checked,
    activityView.checked, activityCreate.checked, activitySeniorView.checked, accountantView.checked,
    bpAdminView.checked, salepos.checked, posReportView.checked,
    routeView.checked, routeUpdate.checked, routeCreate.checked,
    routeDelete.checked, locationView.checked, pendingArInvoiceView.checked,
    pendingPosInvoiceView.checked, attendanceView.checked, routeApproveView.checked,
    salesSummaryReportView.checked, stockSummaryReportView.checked,
    skippedCustomerReportView.checked, noSalesReportView.checked, superAdmindashboard.checked,
    targetOutletReportView.checked, callRateReportView.checked, strikeRateReportView.checked,
    priceUpdateView.checked, vansaleReportView.checked,
    cxoDashboardView.checked, itemWiseReportView.checked, routeWiseReportView.checked,
    numericalDistributonReportView.checked, whsStockReportView.checked,
    weightageDistributionReportView.checked, coverageDistributionReportView.checked,
    priceTypeEditView.checked, expenseListView.checked, masterDataView.checked, masterDataUpdate.checked, masterDataCreate.checked,
    masterDataDelete.checked,
    (err) => {
      if (err) {
        $('#roleErrorModal').find('.modal-body').text(err.reason);
        $('#roleErrorModal').modal();
      }
      else {
        $('#ic-edit').modal('hide');
        $('.role-edit').each(function () {
          this.reset();
        });
        $('#roleSuccessModal').find('.modal-body').text('Role has been updated successfully');
        $('#roleSuccessModal').modal();
      }
    });
};