/**
 * @author Nithin
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
  let superAdminView = target.superAdmin_view;
  let historyView = target.history_view;
  let reportView = target.report_view;
  let userView = target.user_view;
  let userUpdate = target.user_update;
  let userCreate = target.user_create;
  let userDelete = target.user_delete;
  let vanSaleUserView = target.vanSaleUsers_view;
  let vanSaleUserUpdate = target.vanSaleUsers_update;
  let vanSaleUserCreate = target.vanSaleUsers_create;
  let vanSaleUserDelete = target.vanSaleUsers_delete;
  let roleView = target.role_view;
  let roleUpdate = target.role_update;
  let roleCreate = target.role_create;
  let roleDelete = target.role_delete;
  let admindashboard = target.admindashboard_view;
  let salesdashboard = target.salesdashboard_view;
  let orderCreate = target.order_create;
  let orderView = target.order_view;
  let superAdminDashboard = target.superAdmindashboard_view;
  let rolesUnder = target.rolesUnder;
  let businessHeadView = target.businessHead_view;
  let bdmView = target.bdm_view;
  let coordinatorView = target.coordinator_view;
  let sdView = target.sd_view;
  let vsrView = target.vsr_view;
  let sdUserApproveView = target.sdUserApprove_view;
  let stockTransferView = target.stockTransfer_view;
  let masterDataView = target.masterData_view;
  let masterDataUpdate = target.masterData_update;
  let masterDataCreate = target.masterData_create;
  let masterDataDelete = target.masterData_delete;
  let outletsApproveView = target.outletsApprove_view;
  let routeView = target.route_view;
  let routeUpdate = target.route_update;
  let routeCreate = target.route_create;
  let routeDelete = target.route_delete;
  let routeAssignView = target.routeAssign_view;
  let omrView = target.omr_view;
  let wseView = target.wse_view;
  let attendanceView = target.attendance_view;
  let stockListView = target.stockList_view;
  let verticalsView = target.verticals_view;
  let verticalsUpdate = target.verticals_update;
  let verticalsCreate = target.verticals_create;
  let verticalsDelete = target.verticals_delete;
  let outletsView = target.outlets_view;
  let outletsUpdate = target.outlets_update;
  let outletsCreate = target.outlets_create;
  let outletsDelete = target.outlets_delete;
  let sdMasterView = target.sdMaster_view;
  let sdMasterUpdate = target.sdMaster_update;
  let sdMasterCreate = target.sdMaster_create;
  let sdMasterDelete = target.sdMaster_delete;
  let branchView = target.branch_view; //22062021
  let branchCreate = target.branch_create;
  let branchUpdate = target.branch_update;
  let branchDelete = target.branch_delete;
  let locationView = target.location_view;
  let locationCreate = target.location_create;
  let locationUpdate = target.location_update;
  let locationDelete = target.location_delete;
  let priceTypeView = target.priceType_view;
  let priceTypeCreate = target.priceType_create;
  let priceTypeUpdate = target.priceType_update;
  let priceTypeDelete = target.priceType_delete;
  let productView = target.product_view;
  let productCreate = target.product_create;
  let productUpdate = target.product_update;
  let productDelete = target.product_delete;
  let unitView = target.unit_view;
  let unitCreate = target.unit_create;
  let unitUpdate = target.unit_update;
  let unitDelete = target.unit_delete;
  let priceView = target.price_view;
  let priceCreate = target.price_create;
  let priceUpdate = target.price_update;
  let priceDelete = target.price_delete;
  let taxView = target.tax_view;
  let taxCreate = target.tax_create;
  let taxUpdate = target.tax_update;
  let taxDelete = target.tax_delete;
  let administrationView = target.administration_view;
  let sdPriceListView = target.SdPriceList_view;
  let deliveryListView = target.deliveryList_view;
  let deliveryUpdate = target.deliveryList_update;
  let collectionListView = target.deliveryList_view;
  let collectionUpdate = target.deliveryList_update;
  let orderApprove = target.orderApList_view;
  let stockAcceptView = target.stockAccept_view;
  let sdOutletsView = target.sdOutlets_view;
  let sdOutletsUpdate = target.sdOutlets_update;
  let sdOutletsCreate = target.sdOutlets_create;
  let sdOutletsDelete = target.sdOutlets_delete;

  let cashSalesView = target.cashSales_view;
  let cashSalesUpdate = target.cashSales_update;
  let cashSalesCreate = target.cashSales_create;
  let cashSalesDelete = target.cashSales_delete;

  let brandView = target.brand_view;
  let brandUpdate = target.brand_update;
  let brandCreate = target.brand_create;
  let brandDelete = target.brand_delete;

  let categoryView = target.category_view;
  let categoryUpdate = target.category_update;
  let categoryCreate = target.category_create;
  let categoryDelete = target.category_delete;

  let stockReportView = target.stockReport_view;
  let cashSalesReportView = target.cashSalesReport_view;
  let stockReturnView = target.stockReturn_view;
  let creditSaleView = target.creditSale_view;
  let creditSaleUpdate = target.creditSale_update;
  let creditSaleCreate = target.creditSale_create;
  let creditSaleDelete = target.creditSale_delete;
  let orderReport = target.orderReport_view;
  let creditSaleReport = target.creditSaleReport_view;
  let stockSummaryView = target.stockSummary_view;
  let sdUserStockHistoryView = target.sdUserStockHistory_view;
  let sdUserStockSummaryView = target.sdUserStockSummary_view;
  let verticalSaleReportView = target.verticalSaleReport_view;

  let sdReportsView = target.sdReports_view;
  let bdmReportsView = target.bdmReports_view;
  let bhReportsView = target.bhReports_view;

  let outletTrackerView = target.outletTracker_view;

  Meteor.call('role.createOrUpdate', id, name.value, description.value, url.value, historyView.checked, reportView.checked,
    userView.checked, userUpdate.checked, userCreate.checked, userDelete.checked,
    vanSaleUserView.checked, vanSaleUserUpdate.checked, vanSaleUserCreate.checked, vanSaleUserDelete.checked,
    roleView.checked, roleUpdate.checked, roleCreate.checked, roleDelete.checked,
    admindashboard.checked, salesdashboard.checked, orderCreate.checked, orderView.checked, superAdminDashboard.checked,
    rolesUnder.value, superAdminView.checked, businessHeadView.checked, bdmView.checked,
    coordinatorView.checked, sdView.checked, sdUserApproveView.checked, stockTransferView.checked,
    masterDataView.checked, masterDataUpdate.checked, masterDataCreate.checked, masterDataDelete.checked,
    outletsApproveView.checked,
    routeView.checked, routeUpdate.checked, routeCreate.checked, routeDelete.checked,
    routeAssignView.checked, vsrView.checked, omrView.checked, wseView.checked, attendanceView.checked,
    stockListView.checked, verticalsView.checked, verticalsUpdate.checked, verticalsCreate.checked,
    verticalsDelete.checked, outletsView.checked, outletsUpdate.checked, outletsCreate.checked, outletsDelete.checked,
    sdMasterView.checked, sdMasterUpdate.checked, sdMasterCreate.checked,
    sdMasterDelete.checked, branchView.checked, branchCreate.checked,
    branchUpdate.checked, branchDelete.checked, locationView.checked, locationCreate.checked,
    locationUpdate.checked, locationDelete.checked, priceTypeView.checked, priceTypeCreate.checked,
    priceTypeUpdate.checked, priceTypeDelete.checked, productView.checked, productCreate.checked,
    productUpdate.checked, productDelete.checked, unitView.checked, unitCreate.checked, unitUpdate.checked,
    unitDelete.checked, priceView.checked, priceCreate.checked, priceUpdate.checked, priceDelete.checked,
    taxView.checked, taxCreate.checked, taxUpdate.checked, taxDelete.checked, administrationView.checked,
    sdPriceListView.checked, deliveryListView.checked, collectionListView.checked, deliveryUpdate.checked,
    collectionUpdate.checked, orderApprove.checked, stockAcceptView.checked,
    sdOutletsView.checked, sdOutletsUpdate.checked, sdOutletsCreate.checked, sdOutletsDelete.checked,
    cashSalesView.checked, cashSalesUpdate.checked, cashSalesCreate.checked,
    cashSalesDelete.checked, cashSalesReportView.checked, stockReportView.checked,
    creditSaleView.checked, creditSaleUpdate.checked, creditSaleCreate.checked,
    creditSaleDelete.checked, stockReturnView.checked, orderReport.checked,
    stockSummaryView.checked, creditSaleReport.checked,
    brandView.checked, brandUpdate.checked, brandCreate.checked, brandDelete.checked,
    categoryView.checked, categoryUpdate.checked, categoryCreate.checked,
    categoryDelete.checked, sdUserStockHistoryView.checked, sdUserStockSummaryView.checked,
    verticalSaleReportView.checked, sdReportsView.checked, bdmReportsView.checked, bhReportsView.checked,
    outletTrackerView.checked,
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
  let superAdminView = target.superAdmin_view;
  let historyView = target.history_view;
  let reportView = target.report_view;
  let userView = target.user_view;
  let userUpdate = target.user_update;
  let userCreate = target.user_create;
  let userDelete = target.user_delete;
  let vanSaleUserView = target.vanSaleUsers_view;
  let vanSaleUserUpdate = target.vanSaleUsers_update;
  let vanSaleUserCreate = target.vanSaleUsers_create;
  let vanSaleUserDelete = target.vanSaleUsers_delete;
  let roleView = target.role_view;
  let roleUpdate = target.role_update;
  let roleCreate = target.role_create;
  let roleDelete = target.role_delete;
  let admindashboard = target.admindashboard_view;
  let salesdashboard = target.salesdashboard_view;
  let orderCreate = target.order_create;
  let orderView = target.order_view;
  let superAdminDashboard = target.superAdmindashboard_view;
  let rolesUnder = target.rolesUnderEdit;
  let businessHeadView = target.businessHead_view;
  let bdmView = target.bdm_view;
  let coordinatorView = target.coordinator_view;
  let sdView = target.sd_view;
  let sdUserApproveView = target.sdUserApprove_view;
  let stockTransferView = target.stockTransfer_view;
  let masterDataView = target.masterData_view;
  let masterDataUpdate = target.masterData_update;
  let masterDataCreate = target.masterData_create;
  let masterDataDelete = target.masterData_delete;
  let outletsApproveView = target.outletsApprove_view;
  let routeView = target.route_view;
  let routeUpdate = target.route_update;
  let routeCreate = target.route_create;
  let routeDelete = target.route_delete;
  let routeAssignView = target.routeAssign_view;
  let vsrView = target.vsr_view;
  let omrView = target.omr_view;
  let wseView = target.wse_view;
  let attendanceView = target.attendance_view;
  let stockListView = target.stockList_view;
  let verticalsView = target.verticals_view;
  let verticalsUpdate = target.verticals_update;
  let verticalsCreate = target.verticals_create;
  let verticalsDelete = target.verticals_delete;

  let outletsView = target.outlets_view;
  let outletsUpdate = target.outlets_update;
  let outletsCreate = target.outlets_create;
  let outletsDelete = target.outlets_delete;

  let sdOutletsView = target.sdOutlets_view;
  let sdOutletsUpdate = target.sdOutlets_update;
  let sdOutletsCreate = target.sdOutlets_create;
  let sdOutletsDelete = target.sdOutlets_delete;

  let cashSalesView = target.cashSales_view;
  let cashSalesUpdate = target.cashSales_update;
  let cashSalesCreate = target.cashSales_create;
  let cashSalesDelete = target.cashSales_delete;

  let sdMasterView = target.sdMaster_view;
  let sdMasterUpdate = target.sdMaster_update;
  let sdMasterCreate = target.sdMaster_create;
  let sdMasterDelete = target.sdMaster_delete;

  let brandView = target.brand_view;
  let brandUpdate = target.brand_update;
  let brandCreate = target.brand_create;
  let brandDelete = target.brand_delete;

  let categoryView = target.category_view;
  let categoryUpdate = target.category_update;
  let categoryCreate = target.category_create;
  let categoryDelete = target.category_delete;

  let branchView = target.branch_view; //22062021
  let branchCreate = target.branch_create;
  let branchUpdate = target.branch_update;
  let branchDelete = target.branch_delete;
  let locationView = target.location_view;
  let locationCreate = target.location_create;
  let locationUpdate = target.location_update;
  let locationDelete = target.location_delete;
  let priceTypeView = target.priceType_view;
  let priceTypeCreate = target.priceType_create;
  let priceTypeUpdate = target.priceType_update;
  let priceTypeDelete = target.priceType_delete;
  let productView = target.product_view;
  let productCreate = target.product_create;
  let productUpdate = target.product_update;
  let productDelete = target.product_delete;
  let unitView = target.unit_view;
  let unitCreate = target.unit_create;
  let unitUpdate = target.unit_update;
  let unitDelete = target.unit_delete;
  let priceView = target.price_view;
  let priceCreate = target.price_create;
  let priceUpdate = target.price_update;
  let priceDelete = target.price_delete;
  let taxView = target.tax_view;
  let taxCreate = target.tax_create;
  let taxUpdate = target.tax_update;
  let taxDelete = target.tax_delete;
  let administrationView = target.administration_view;
  let sdPriceListView = target.SdPriceList_view;
  let deliveryListView = target.deliveryListcheckView;
  let deliveryUpdate = target.deliveryList_update;
  let collectionListView = target.collectionListcheckView;
  let collectionUpdate = target.deliveryList_update;
  let orderApprove = target.orderApList_view;
  let stockAcceptView = target.stockAccept_view;
  let cashSalesReportView = target.cashSalesReport_view;
  let orderReport = target.orderReport_view;
  let stockReportView = target.stockReport_view;
  let stockReturnView = target.stockReturn_view;
  let creditSaleView = target.creditSale_view;
  let creditSaleUpdate = target.creditSale_update;
  let creditSaleCreate = target.creditSale_create;
  let creditSaleDelete = target.creditSale_delete;
  let creditSaleReport = target.creditSaleReport_view;
  let stockSummaryView = target.stockSummary_view;
  let sdUserStockHistoryView = target.sdUserStockHistory_view;
  let sdUserStockSummaryView = target.sdUserStockSummary_view;
  let verticalSaleReportView = target.verticalSaleReport_view;
  let sdReportsView = target.sdReports_view;
  let bdmReportsView = target.bdmReports_view;
  let bhReportsView = target.bhReports_view;

  let outletTrackerView = target.outletTracker_view;

  Meteor.call('role.createOrUpdate', id.value, name.value, description.value, url.value, historyView.checked, reportView.checked,
    userView.checked, userUpdate.checked, userCreate.checked, userDelete.checked,
    vanSaleUserView.checked, vanSaleUserUpdate.checked, vanSaleUserCreate.checked, vanSaleUserDelete.checked,
    roleView.checked, roleUpdate.checked, roleCreate.checked, roleDelete.checked,
    admindashboard.checked, salesdashboard.checked, orderCreate.checked, orderView.checked,
    superAdminDashboard.checked, rolesUnder.value, superAdminView.checked, businessHeadView.checked,
    bdmView.checked, coordinatorView.checked, sdView.checked, sdUserApproveView.checked, stockTransferView.checked,
    masterDataView.checked, masterDataUpdate.checked, masterDataCreate.checked, masterDataDelete.checked,
    outletsApproveView.checked,
    routeView.checked, routeUpdate.checked, routeCreate.checked, routeDelete.checked,
    routeAssignView.checked, vsrView.checked, omrView.checked, wseView.checked, attendanceView.checked,
    stockListView.checked,
    verticalsView.checked, verticalsUpdate.checked, verticalsCreate.checked, verticalsDelete.checked,
    outletsView.checked, outletsUpdate.checked, outletsCreate.checked, outletsDelete.checked,
    sdMasterView.checked, sdMasterUpdate.checked, sdMasterCreate.checked, sdMasterDelete.checked,
    branchView.checked, branchCreate.checked, branchUpdate.checked, branchDelete.checked,
    locationView.checked, locationCreate.checked, locationUpdate.checked, locationDelete.checked,
    priceTypeView.checked, priceTypeCreate.checked, priceTypeUpdate.checked, priceTypeDelete.checked,
    productView.checked, productCreate.checked, productUpdate.checked, productDelete.checked,
    unitView.checked, unitCreate.checked, unitUpdate.checked, unitDelete.checked, priceView.checked,
    priceCreate.checked, priceUpdate.checked, priceDelete.checked, taxView.checked, taxCreate.checked,
    taxUpdate.checked, taxDelete.checked, administrationView.checked, sdPriceListView.checked,
    deliveryListView.checked, collectionListView.checked, deliveryUpdate.checked,
    collectionUpdate.checked, orderApprove.checked, stockAcceptView.checked,
    sdOutletsView.checked, sdOutletsUpdate.checked, sdOutletsCreate.checked, sdOutletsDelete.checked,
    cashSalesView.checked, cashSalesUpdate.checked, cashSalesCreate.checked,
    cashSalesDelete.checked, cashSalesReportView.checked, stockReportView.checked,
    creditSaleView.checked, creditSaleUpdate.checked, creditSaleCreate.checked,
    creditSaleDelete.checked, stockReturnView.checked, orderReport.checked,
    stockSummaryView.checked, creditSaleReport.checked,
    brandView.checked, brandUpdate.checked, brandCreate.checked, brandDelete.checked,
    categoryView.checked, categoryUpdate.checked, categoryCreate.checked,
    categoryDelete.checked, sdUserStockHistoryView.checked, sdUserStockSummaryView.checked,
    verticalSaleReportView.checked, sdReportsView.checked, bdmReportsView.checked, bhReportsView.checked,
    outletTrackerView.checked,
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