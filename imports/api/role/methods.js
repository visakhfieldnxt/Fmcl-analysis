/**
 * @author Visakh
 */
import { Meteor } from "meteor/meteor";

Meteor.methods({

  /**
   * TODO: Complete JS doc
   * @param id
   * @param name
   * @param description
   * @param historyView
   * @param reportView
   * @param reportOwnView
   * @param userView
   * @param userUpdate
   * @param userCreate
   * @param userDelete
   * @param vanSaleUserView
   * @param vanSaleUserUpdate
   * @param vanSaleUserCreate
   * @param vanSaleUserDelete
   * @param roleView
   * @param roleUpdate
   * @param roleCreate
   * @param roleDelete
   * @param designationView
   * @param designationUpdate
   * @param designationCreate
   * @param designationDelete
   * @param leadView
   * @param leadUpdate
   * @param leadCreate
   * @param leadDelete
   * @param adminDashboard
   * @param salesDashboard
   * @param orderCreate
   * @param orderView
   * @param orderSeniorCreate
   * @param orderSeniorView
   * @param salesReturnCreate
   * @param salesReturnView
   * @param stockTransferRequestCreate
   * @param stockTransferRequestView
   * @param deliveryView
   * @param deliveryUpdate
   * @param dispatchView
   * @param dispatchUpdate
   * @param dispatchReportView
   * @param dispatchRejectView
   * @param collectionDueTomorrowReportView
   * @param creditInvoiceView
   * @param creditInvoiceCreate
   * @param creditNoteView
   * @param creditNoteCreate
   * @param arInvoicePaymentView
   * @param arInvoicePaymentCreate
   * @param arInvoiceSeniorPaymentView
   * @param arInvoiceSeniorPaymentCreate
   * @param salesQuotationView
   * @param salesQuotationCreate
   * @param salesQuotationSeniorView
   * @param salesQuotationSeniorCreate
   * @param pickListView
   * @param orderReportView
   * @param salesQuotationReportView
   * @param arInvoiceReportView
   * @param creditInvoiceReportView
   * @param salesReturnReportView
   * @param creditNoteReportView
   * @param branchTransferReportView
   * @param collectionReportView
   * @param stockTransferReportView
   * @param invoiceReportView
   * @param purchasePrintView
   * @param activityView
   * @param activityCreate
   * @param activitySeniorView
   * @param accountantView
   * @param bpAdminView
   * @param posReportView
   * @param routeView 
   * @param targetOutletReportView
   * @param callRateReportView
   * @param strikeRateReportView
   * @param priceUpdateView
   * @param vansaleReportView
   * @param cxoDashboardView
   * @param itemWiseReportView
   * @param routeWiseReportView
   * @param numericalDistributonReportView
   * @param whsStockReportView
   * @param weightageDistributionReportView
   * @param coverageDistributionReportView
   * @param priceTypeEditView
   */
  'role.createOrUpdate': (id, name, description, url, historyView, reportView, reportOwnView,
    userView, userUpdate, userCreate, userDelete, vanSaleUserView, vanSaleUserUpdate, vanSaleUserCreate, vanSaleUserDelete,
    roleView, roleUpdate, roleCreate, roleDelete,
    designationView, designationUpdate, designationCreate, designationDelete,
    branchTransferView, branchTransferCreate, branchTransferApproveView,
    leadView, leadUpdate, leadCreate, leadDelete,
    adminDashboard, salesDashboard,
    orderCreate, orderView, orderSeniorCreate, orderSeniorView, salesReturnCreate, salesReturnView, stockTransferRequestCreate, stockTransferRequestView, deliveryView,
    deliveryUpdate, dispatchView, dispatchUpdate, dispatchRejectView, collectionDueTodayView, collectionDueTodayCreate,
    creditInvoiceView, creditInvoiceCreate, creditNoteView, creditNoteCreate, arInvoicePaymentView, arInvoicePaymentCreate,
    arInvoiceSeniorPaymentView, arInvoiceSeniorPaymentCreate, salesQuotationView, salesQuotationCreate,
    salesQuotationSeniorView, salesQuotationSeniorCreate, invoiceView, deliveryBoyView, orderApproveView, quotationApproveView, salesReturnApproveView, stockTransferApproveView, creditNoteApproveView, creditInvoiceApproveView, pickListView,
    orderReportView, salesQuotationReportView, arInvoiceReportView, creditInvoiceReportView,
    salesReturnReportView, creditNoteReportView, branchTransferReportView, collectionReportView,
    stockTransferReportView, invoiceReportView, deliveryReportView, purchasePrintView,
    activityView, activityCreate, activitySeniorView, accountantView, bpAdminView, posPrint,
    posReportView, routeView, routeUpdate, routeCreate, routeDelete, locationView, pendingArInvoiceView,
    pendingPosInvoiceView, attendanceView, routeApproveView, salesSummaryReportView,
    stockSummaryReportView, skippedCustomerReportView, noSalesReportView, superAdminDashboard,
    targetOutletReportView, callRateReportView, strikeRateReportView,
    priceUpdateView, vansaleReportView, cxoDashboardView, itemWiseReportView, routeWiseReportView,
    numericalDistributonReportView, whsStockReportView, weightageDistributionReportView,
    coverageDistributionReportView, priceTypeEditView, expenseListView,
    masterDataView, masterDataUpdate, masterDataCreate, masterDataDelete
  ) => {

    let permission = [];
    if (historyView === true) {
      permission.push('historyView');
    };
    if (reportView === true) {
      permission.push('reportView');
    };
    if (reportOwnView === true) {
      permission.push('reportOwnView');
    };
    if (userView === true) {
      permission.push('userView');
    };
    if (userUpdate === true) {
      permission.push('userUpdate');
    };
    if (userCreate === true) {
      permission.push('userCreate');
    };
    if (userDelete === true) {
      permission.push('userDelete');
    };

    if (vanSaleUserView === true) {
      permission.push('vanSaleUserView');
    };
    if (vanSaleUserUpdate === true) {
      permission.push('vanSaleUserUpdate');
    };
    if (vanSaleUserCreate === true) {
      permission.push('vanSaleUserCreate');
    };
    if (vanSaleUserDelete === true) {
      permission.push('vanSaleUserDelete');
    };

    if (roleCreate === true) {
      permission.push('roleCreate');
    };
    if (roleUpdate === true) {
      permission.push('roleUpdate');
    };
    if (roleView === true) {
      permission.push('roleView');
    };
    if (roleDelete === true) {
      permission.push('roleDelete');
    };
    if (designationView === true) {
      permission.push('designationView');
    };
    if (designationUpdate === true) {
      permission.push('designationUpdate');
    };
    if (designationCreate === true) {
      permission.push('designationCreate');
    };
    if (designationDelete === true) {
      permission.push('designationDelete');
    };
    if (branchTransferView === true) {
      permission.push('branchTransferView');
    };
    if (branchTransferCreate === true) {
      permission.push('branchTransferCreate');
    };
    if (branchTransferApproveView === true) {
      permission.push('branchTransferApproveView');
    };


    if (leadView === true) {
      permission.push('leadView');
    };
    if (leadUpdate === true) {
      permission.push('leadUpdate');
    };
    if (leadCreate === true) {
      permission.push('leadCreate');
    };
    if (leadDelete === true) {
      permission.push('leadDelete');
    };
    if (orderCreate === true) {
      permission.push('orderCreate');
    };
    if (orderView === true) {
      permission.push('orderView');
    };
    if (orderSeniorCreate === true) {
      permission.push('orderSeniorCreate');
    };
    if (orderSeniorView === true) {
      permission.push('orderSeniorView');
    };
    if (salesReturnCreate === true) {
      permission.push('salesReturnCreate');
    };
    if (salesReturnView === true) {
      permission.push('salesReturnView');
    };
    if (stockTransferRequestCreate === true) {
      permission.push('stockTransferRequestCreate');
    };
    if (stockTransferRequestView === true) {
      permission.push('stockTransferRequestView');
    };
    if (adminDashboard === true) {
      permission.push('adminDashboard');
    };
    if (salesDashboard === true) {
      permission.push('salesDashboard');
    };
    if (deliveryView === true) {
      permission.push('deliveryView');
    };
    if (deliveryUpdate === true) {
      permission.push('deliveryUpdate');
    };
    if (dispatchView === true) {
      permission.push('dispatchView');
    };
    if (dispatchUpdate === true) {
      permission.push('dispatchUpdate');
    };
    if (dispatchRejectView === true) {
      permission.push('dispatchRejectView');
    };
    if (collectionDueTodayView === true) {
      permission.push('collectionDueToday');
    };
    if (collectionDueTodayCreate === true) {
      permission.push('createCollectionDueToday');
    };
    if (collectionDueTodayView === true) {
      permission.push('collectionDueToday');
    };
    if (creditInvoiceView === true) {
      permission.push('creditInvoiceView');
    };
    if (creditInvoiceCreate === true) {
      permission.push('creditInvoiceCreate');
    };
    if (creditNoteView === true) {
      permission.push('creditNoteView');
    };
    if (creditNoteCreate === true) {
      permission.push('creditNoteCreate');
    };
    if (arInvoicePaymentView === true) {
      permission.push('arInvoicePaymentView');
    };
    if (arInvoicePaymentCreate === true) {
      permission.push('arInvoicePaymentCreate');
    };
    if (arInvoiceSeniorPaymentView === true) {
      permission.push('arInvoiceSeniorPaymentView');
    };
    if (arInvoiceSeniorPaymentCreate === true) {
      permission.push('arInvoiceSeniorPaymentCreate');
    };
    if (salesQuotationView === true) {
      permission.push('salesQuotationView');
    };
    if (salesQuotationCreate === true) {
      permission.push('salesQuotationCreate');
    };
    if (salesQuotationSeniorView === true) {
      permission.push('salesQuotationSeniorView');
    };
    if (salesQuotationSeniorCreate === true) {
      permission.push('salesQuotationSeniorCreate');
    };
    if (invoiceView === true) {
      permission.push('invoiceView');
    };
    if (deliveryBoyView === true) {
      permission.push('deliveryBoyView');
    };
    if (orderApproveView === true) {
      permission.push('orderApproveView');
    };
    if (quotationApproveView === true) {
      permission.push('quotationApproveView');
    };
    if (salesReturnApproveView === true) {
      permission.push('salesReturnApproveView');
    };
    if (stockTransferApproveView === true) {
      permission.push('stockTransferApproveView');
    };
    if (creditNoteApproveView === true) {
      permission.push('creditNoteApproveView');
    };
    if (creditInvoiceApproveView === true) {
      permission.push('creditInvoiceApproveView');
    };
    if (pickListView === true) {
      permission.push('pickListView');
    };
    if (orderReportView === true) {
      permission.push('orderReportView');
    };
    if (salesQuotationReportView === true) {
      permission.push('salesQuotationReportView');
    };
    if (arInvoiceReportView === true) {
      permission.push('arInvoiceReportView');
    };
    if (creditInvoiceReportView === true) {
      permission.push('creditInvoiceReportView');
    };
    if (salesReturnReportView === true) {
      permission.push('salesReturnReportView');
    };
    if (creditNoteReportView === true) {
      permission.push('creditNoteReportView');
    };
    if (branchTransferReportView === true) {
      permission.push('branchTransferReportView');
    };
    if (collectionReportView === true) {
      permission.push('collectionReportView');
    };
    if (stockTransferReportView === true) {
      permission.push('stockTransferReportView');
    };
    if (invoiceReportView === true) {
      permission.push('invoiceReportView');
    };
    if (deliveryReportView === true) {
      permission.push('deliveryReportView');
    };
    if (purchasePrintView === true) {
      permission.push('purchasePrintView');
    };
    if (activityView === true) {
      permission.push('activityView');
    };
    if (activityCreate === true) {
      permission.push('activityCreate');
    };
    if (activitySeniorView === true) {
      permission.push('activitySeniorView');
    };
    if (accountantView === true) {
      permission.push('accountantView');
    };
    if (bpAdminView === true) {
      permission.push('bpAdminView');
    };
    if (posPrint === true) {
      permission.push('salepos');
    };
    if (posReportView === true) {
      permission.push('posReportView');
    };

    if (routeView === true) {
      permission.push('routeView');
    };
    if (routeUpdate === true) {
      permission.push('routeUpdate');
    };
    if (routeCreate === true) {
      permission.push('routeCreate');
    };
    if (routeDelete === true) {
      permission.push('routeDelete');
    };
    if (locationView === true) {
      permission.push('locationView');
    };
    if (pendingArInvoiceView === true) {
      permission.push('pendingArInvoiceView');
    };

    if (pendingPosInvoiceView === true) {
      permission.push('pendingPosInvoiceView');
    };
    if (attendanceView === true) {
      permission.push('attendanceView');
    };
    if (routeApproveView === true) {
      permission.push('routeApproveView');
    };
    if (salesSummaryReportView === true) {
      permission.push('salesSummaryReportView');
    };
    if (stockSummaryReportView === true) {
      permission.push('stockSummaryReportView');
    };
    if (skippedCustomerReportView === true) {
      permission.push('skippedCustomerReportView');
    };
    if (noSalesReportView === true) {
      permission.push('noSalesReportView');
    };
    if (superAdminDashboard === true) {
      permission.push('superAdminDashboard');
    };
    if (targetOutletReportView === true) {
      permission.push('targetOutletReportView');
    };
    if (callRateReportView === true) {
      permission.push('callRateReportView');
    };
    if (strikeRateReportView === true) {
      permission.push('strikeRateReportView');
    };
    if (priceUpdateView === true) {
      permission.push('priceUpdateView');
    };
    if (vansaleReportView === true) {
      permission.push('vansaleReportView');
    };
    if (cxoDashboardView === true) {
      permission.push('cxoDashboardView');
    };
    if (itemWiseReportView === true) {
      permission.push('itemWiseReportView');
    };
    if (routeWiseReportView === true) {
      permission.push('routeWiseReportView');
    };
    if (numericalDistributonReportView === true) {
      permission.push('numericalDistributonReportView');
    };
    if (whsStockReportView === true) {
      permission.push('whsStockReportView');
    };
    if (weightageDistributionReportView === true) {
      permission.push('weightageDistributionReportView');
    };
    if (coverageDistributionReportView === true) {
      permission.push('coverageDistributionReportView');
    };
    if (priceTypeEditView === true) {
      permission.push('priceTypeEditView');
    };
    if (expenseListView === true) {
      permission.push('expenseListView');
    };

    if (masterDataView === true) {
      permission.push('masterDataView');
    };
    if (masterDataUpdate === true) {
      permission.push('masterDataUpdate');
    };
    if (masterDataCreate === true) {
      permission.push('masterDataCreate');
    };
    if (masterDataDelete === true) {
      permission.push('masterDataDelete');
    };
    if (id) {
      return Meteor.roles.update({ _id: id }, {
        $set: {
          name: name.trim(),
          description: description,
          homePage: url,
          permissions: permission,
          updatedAt: new Date(),
          updatedBy: Meteor.user().username
        }
      });
    }
    else {
      return Meteor.roles.insert({
        name: name.trim(),
        description: description,
        homePage: url,
        permissions: permission,
        createdAt: new Date(),
        isDeleted: false,
        createdBy: Meteor.user().username,
        uuid: Random.id()
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param uuid
   */
  'role.delete': (id) => {
    const roles = Meteor.roles.findOne({
      _id: id.trim()
    });
    if (roles) {
      roles.isDeleted = true;
      return Meteor.roles.update({
        _id: roles._id
      }, roles);
    }
  },

  /**
   * TODO: Complete JS doc
   * @param uuid
   */
  'role.duplicate': (roleName, description, homePage, itemLines) => {

    return Meteor.roles.insert({
      name: roleName,
      description: description,
      homePage: homePage,
      permissions: itemLines,
      isDeleted: false,
      createdBy: Meteor.user().username,
      createdAt: new Date(),
      uuid: Random.id(),
      updatedBy: Meteor.user().username,
      updatedAt: new Date()
    });
  },
  'role.roleNameGet': () => {
    return Meteor.roles.find({ 'isDeleted': false }, { sort: { name: 1 } }).fetch();
  },
  'role.details': (r) => {
    return Meteor.roles.find({ _id: r }, { isDeleted: false }).fetch();
  },
  'role.roleName': (id) => {
    return Meteor.roles.findOne({ _id: id });
  },
  'role.roleCount': (roleName) => {
    return Meteor.roles.find({
      name: { $regex: new RegExp(roleName.trim(), "i") }
    }).count();
  },
  /**
   * 
   * @param {*} roleArray get roles name array
   */
  'role.idNameArray': (roleArray) => {
    let roleNames = [];
    if (roleArray !== undefined && roleArray.length > 0) {
      for (let i = 0; i < roleArray.length; i++) {
        let roleRes = Meteor.roles.findOne({ _id: roleArray[i] });
        if (roleRes) {
          roleNames.push(roleRes.name);
        }
      }
    }
    return roleNames.toString();
  },

  'roles.vansaleRoleGet': () => {
    let rolesArray = [];
    let roleRes = Meteor.roles.find({
      name: { $ne: "Merchandiser" }
    }, { fields: { _id: 1 } }).fetch();
    if (roleRes.length > 0) {
      for (let i = 0; i < roleRes.length; i++) {
        rolesArray.push(roleRes[i]._id);
      }
    }
    return rolesArray;
  }
});