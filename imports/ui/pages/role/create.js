/**
 * @author Visakh
 */
import { Meteor } from "meteor/meteor";
import { roles } from "../../../api/role/role";

Template.role_create.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.roleNameArray = new ReactiveVar();

});
Template.role_create.onRendered(function () {

  Meteor.call('role.roleNameGet', (roleError, roleResult) => {
    if (!roleError) {
      this.roleNameArray.set(roleResult);
    }
  });
  $('.homeURL').select2({
    placeholder: "Select Home Page",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".homeURL").parent(),
  });

});


Template.role_create.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  rolesList: function () {

    return Template.instance().roleNameArray.get();

  }
});
Template.role_create.events({
  /**
   * TODO:Complete JS doc
   */
  'blur #roleName': () => {
    let roleName = $("#roleName").val();
    Meteor.call('role.roleCount', roleName, (roleError, roleResult) => {
      if (!roleError) {
        let role = roleResult;
        // console.log("roleResult", roleResult);

        if (role === 1) {
          $("#roleName").css({ "color": "red", "border": "1px solid red" });
          $("#roleNamespans").html('<font color="#fc5f5f" size="2">Name <font weight="bold" size="2">' + roleName + ' </font> already exits</font>');
          $("#roleSubmit").prop('disabled', true);
        } else {
          $("#roleName").css({ "color": "black", "border": " 1px solid #00c0ef" });
          $("#roleNamespans").html('<font color="#fc5f5f"></font>');
          $("#roleSubmit").prop('disabled', false);

        }
      }
    });
  },
  /**
 * TODO:Complete JS doc
 */
  'click #historycheck': () => {
    if ($("#historycheck").prop("checked") === true) {
      $("#historychecking").prop('checked', true);
    } else {
      $("#historychecking").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #reportcheck': () => {
    if ($("#reportcheck").prop("checked") === true) {
      $("#reportchecking").prop('checked', true);
    } else {
      $("#reportchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #bpAdmincheck': () => {
    if ($("#bpAdmincheck").prop("checked") === true) {
      $(".bpAdminSelections").prop('checked', true);
    } else {
      $(".bpAdminSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #reportOwncheck': () => {
    if ($("#reportOwncheck").prop("checked") === true) {
      $("#reportOwnchecking").prop('checked', true);
    } else {
      $("#reportOwnchecking").prop('checked', false);
    }
  },
  /**
 * TODO:Complete JS doc
 */
  'click #userscheck': () => {
    if ($("#userscheck").prop("checked") === true) {
      $("#userschecking").prop('checked', true);
      $("#userscheckin").prop('checked', true);
      $("#userschecki").prop('checked', true);
      $("#userscheckings").prop('checked', true);
    } else {
      $("#userschecking").prop('checked', false);
      $("#userscheckin").prop('checked', false);
      $("#userschecki").prop('checked', false);
      $("#userscheckings").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #vanSaleUserscheck': () => {
    if ($("#vanSaleUserscheck").prop("checked") === true) {
      $("#vanSaleUserschecking").prop('checked', true);
      $("#vanSaleUserscheckin").prop('checked', true);
      $("#vanSaleUserschecki").prop('checked', true);
      $("#vanSaleUserscheckings").prop('checked', true);
    } else {
      $("#vanSaleUserschecking").prop('checked', false);
      $("#vanSaleUserscheckin").prop('checked', false);
      $("#vanSaleUserschecki").prop('checked', false);
      $("#vanSaleUserscheckings").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #routecheck': () => {
    if ($("#routecheck").prop("checked") === true) {
      $("#routechecking").prop('checked', true);
      $("#routecheckin").prop('checked', true);
      $("#routechecki").prop('checked', true);
      $("#routecheckings").prop('checked', true);
    } else {
      $("#routechecking").prop('checked', false);
      $("#routecheckin").prop('checked', false);
      $("#routechecki").prop('checked', false);
      $("#routecheckings").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #masterDatacheck': () => {
    if ($("#masterDatacheck").prop("checked") === true) {
      $("#masterDatachecking").prop('checked', true);
      $("#masterDatacheckin").prop('checked', true);
      $("#masterDatachecki").prop('checked', true);
      $("#masterDatacheckings").prop('checked', true);
    } else {
      $("#masterDatachecking").prop('checked', false);
      $("#masterDatacheckin").prop('checked', false);
      $("#masterDatachecki").prop('checked', false);
      $("#masterDatacheckings").prop('checked', false);
    }
  },

  /**
   * TODO:Complete JS doc
   */
  'click #rolecheck': () => {
    if ($("#rolecheck").prop("checked") === true) {

      $("#rolechecking").prop('checked', true);
      $("#rolecheckin").prop('checked', true);
      $("#rolechecki").prop('checked', true);
      $("#rolecheckings").prop('checked', true);
    } else {
      $("#rolechecking").prop('checked', false);
      $("#rolecheckin").prop('checked', false);
      $("#rolechecki").prop('checked', false);
      $("#rolecheckings").prop('checked', false);
    }
  },

  /**
   * TODO:Complete JS doc
   */
  'click #designationcheck': () => {
    if ($("#designationcheck").prop("checked") === true) {

      $("#designationchecking").prop('checked', true);
      $("#designationcheckin").prop('checked', true);
      $("#designationchecki").prop('checked', true);
      $("#designationcheckings").prop('checked', true);
    } else {
      $("#designationchecking").prop('checked', false);
      $("#designationcheckin").prop('checked', false);
      $("#designationchecki").prop('checked', false);
      $("#designationcheckings").prop('checked', false);
    }
  },


  'click #branchTransfercheck': () => {
    if ($("#branchTransfercheck").prop("checked") === true) {
      $("#branchTransferchecking").prop('checked', true);
      $("#branchTransfercheckin").prop('checked', true);
    } else {
      $("#branchTransferchecking").prop('checked', false);
      $("#branchTransfercheckin").prop('checked', false);
    }
  },
  'click #activitycheck': () => {
    if ($("#activitycheck").prop("checked") === true) {
      $("#activitychecking").prop('checked', true);
      $("#activitycheckin").prop('checked', true);
    } else {
      $("#activitychecking").prop('checked', false);
      $("#activitycheckin").prop('checked', false);
    }
  },

  'click #activitycheck': () => {
    if ($("#activitycheck").prop("checked") === true) {
      $("#activitychecking").prop('checked', true);
      $("#activitycheckin").prop('checked', true);
    } else {
      $("#activitychecking").prop('checked', false);
      $("#activitycheckin").prop('checked', false);
    }
  },

  'click #branchTransferApprovecheck': () => {
    if ($("#branchTransferApprovecheck").prop("checked") === true) {
      $("#branchTransferApprovechecking").prop('checked', true);
    } else {
      $("#branchTransferApprovechecking").prop('checked', false);
    }
  },

  /**
   * TODO:Complete JS doc
   */
  'click #leadcheck': () => {
    if ($("#leadcheck").prop("checked") === true) {

      $("#leadchecking").prop('checked', true);
      $("#leadcheckin").prop('checked', true);
      $("#leadchecki").prop('checked', true);
      $("#leadcheckings").prop('checked', true);
    } else {
      $("#leadchecking").prop('checked', false);
      $("#leadcheckin").prop('checked', false);
      $("#leadchecki").prop('checked', false);
      $("#leadcheckings").prop('checked', false);
    }
  },

  /**
   * TODO:Complete JS doc
   */
  'click #sdashboardcheck': () => {
    if ($("#sdashboardcheck").prop("checked") === true) {
      $("#sdashboardchecking").prop('checked', true);
    } else {
      $("#sdashboardchecking").prop('checked', false);
    }
  },

  /**
 * TODO:Complete JS doc
 */
  'click #poscheck': () => {
    if ($("#poscheck").prop("checked") === true) {
      $("#poschecking").prop('checked', true);
    } else {
      $("#poschecking").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #adashboardcheck': () => {
    if ($("#adashboardcheck").prop("checked") === true) {
      $("#adashboardchecking").prop('checked', true);
    } else {
      $("#adashboardchecking").prop('checked', false);
    }
  },
  /**
 * TODO:Complete JS doc
 */
  'click #superAdmindashboardcheck': () => {
    if ($("#superAdmindashboardcheck").prop("checked") === true) {
      $("#superAdmindashboardchecking").prop('checked', true);
    } else {
      $("#superAdmindashboardchecking").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #ordercheck': () => {
    if ($("#ordercheck").prop("checked") === true) {
      $("#orderchecking").prop('checked', true);
      $("#ordercheckin").prop('checked', true);
    } else {
      $("#orderchecking").prop('checked', false);
      $("#ordercheckin").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #orderSeniorcheck': () => {
    if ($("#orderSeniorcheck").prop("checked") === true) {
      $("#orderSeniorchecking").prop('checked', true);
      $("#orderSeniorcheckin").prop('checked', true);
    } else {
      $("#orderSeniorchecking").prop('checked', false);
      $("#orderSeniorcheckin").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesReturncheck': () => {
    if ($("#salesReturncheck").prop("checked") === true) {
      $("#salesReturnchecking").prop('checked', true);
      $("#salesReturncheckin").prop('checked', true);
    } else {
      $("#salesReturnchecking").prop('checked', false);
      $("#salesReturncheckin").prop('checked', false);
    }
  },

  /**
   * TODO:Complete JS doc
   */
  'click #stockTransferRequestcheck': () => {
    if ($("#stockTransferRequestcheck").prop("checked") === true) {
      $("#stockTransferRequestchecking").prop('checked', true);
      $("#stockTransferRequestcheckin").prop('checked', true);
    } else {
      $("#stockTransferRequestchecking").prop('checked', false);
      $("#stockTransferRequestcheckin").prop('checked', false);
    }
  },

  /**
   * TODO:Complete JS doc
   */
  'click #deliverycheck': () => {
    if ($("#deliverycheck").prop("checked") === true) {
      $(".deliverySelections").prop('checked', true);
    } else {
      $(".deliverySelections").prop('checked', false);
      $(".deliverySelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #dispatchBoycheck': () => {
    if ($("#dispatchBoycheck").prop("checked") === true) {
      $(".dispatchBoySelections").prop('checked', true);
    } else {
      $(".dispatchBoySelections").prop('checked', false);
      $(".dispatchBoySelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #dispatchcheck': () => {
    if ($("#dispatchcheck").prop("checked") === true) {
      $(".dispatchSelections").prop('checked', true);
    } else {
      $(".dispatchSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #dispatchRejectcheck': () => {
    if ($("#dispatchRejectcheck").prop("checked") === true) {
      $(".dispatchRejectSelections").prop('checked', true);
    } else {
      $(".dispatchRejectSelections").prop('checked', false); //change
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #collectionDueTodaycheck': () => {
    if ($("#collectionDueTodaycheck").prop("checked") === true) {
      $(".collectionDueTodaySelections").prop('checked', true);
    } else {
      $(".collectionDueTodaySelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditInvoicecheck': () => {
    if ($("#creditInvoicecheck").prop("checked") === true) {
      $(".creditInvoiceSelections").prop('checked', true);
    } else {
      $(".creditInvoiceSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditNotecheck': () => {
    if ($("#creditNotecheck").prop("checked") === true) {
      $(".creditNoteSelections").prop('checked', true);
    } else {
      $(".creditNoteSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #arInvoicePaymentcheck': () => {
    if ($("#arInvoicePaymentcheck").prop("checked") === true) {
      $(".arInvoicePaymentSelections").prop('checked', true);
    } else {
      $(".arInvoicePaymentSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #arInvoiceSeniorPaymentcheck': () => {
    if ($("#arInvoiceSeniorPaymentcheck").prop("checked") === true) {
      $(".arInvoiceSeniorPaymentSelections").prop('checked', true);
    } else {
      $(".arInvoiceSeniorPaymentSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesQuotationcheck': () => {
    if ($("#salesQuotationcheck").prop("checked") === true) {
      $(".salesQuotationSelections").prop('checked', true);
    } else {
      $(".salesQuotationSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesQuotationSeniorcheck': () => {
    if ($("#salesQuotationSeniorcheck").prop("checked") === true) {
      $(".salesQuotationSeniorSelections").prop('checked', true);
    } else {
      $(".salesQuotationSeniorSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #invoicecheck': () => {
    if ($("#invoicecheck").prop("checked") === true) {
      $(".invoiceSelections").prop('checked', true);
    } else {
      $(".invoiceSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #deliveryBoycheck': () => {
    if ($("#deliveryBoycheck").prop("checked") === true) {
      $(".deliveryBoySelections").prop('checked', true);
    } else {
      $(".deliveryBoySelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #orderApprovecheck': () => {
    if ($("#orderApprovecheck").prop("checked") === true) {
      $(".orderApproveSelections").prop('checked', true);
    } else {
      $(".orderApproveSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #quotationApprovecheck': () => {
    if ($("#quotationApprovecheck").prop("checked") === true) {
      $(".quotationApproveSelections").prop('checked', true);
    } else {
      $(".quotationApproveSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesReturnApprovecheck': () => {
    if ($("#salesReturnApprovecheck").prop("checked") === true) {
      $(".salesReturnApproveSelections").prop('checked', true);
    } else {
      $(".salesReturnApproveSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #stockTransferApprovecheck': () => {
    if ($("#stockTransferApprovecheck").prop("checked") === true) {
      $(".stockTransferApproveSelections").prop('checked', true);
    } else {
      $(".stockTransferApproveSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditNoteApprovecheck': () => {
    if ($("#creditNoteApprovecheck").prop("checked") === true) {
      $(".creditNoteApproveSelections").prop('checked', true);
    } else {
      $(".creditNoteApproveSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditInvoiceApprovecheck': () => {
    if ($("#creditInvoiceApprovecheck").prop("checked") === true) {
      $(".creditInvoiceApproveSelections").prop('checked', true);
    } else {
      $(".creditInvoiceApproveSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #pickListcheck': () => {
    if ($("#pickListcheck").prop("checked") === true) {
      $(".pickListSelections").prop('checked', true);
    } else {
      $(".pickListSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #orderReportcheck': () => {
    if ($("#orderReportcheck").prop("checked") === true) {
      $(".orderReportSelections").prop('checked', true);
    } else {
      $(".orderReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesQuotationReportcheck': () => {
    if ($("#salesQuotationReportcheck").prop("checked") === true) {
      $(".salesQuotationReportSelections").prop('checked', true);
    } else {
      $(".salesQuotationReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #arInvoiceReportcheck': () => {
    if ($("#arInvoiceReportcheck").prop("checked") === true) {
      $(".arInvoiceReportSelections").prop('checked', true);
    } else {
      $(".arInvoiceReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #posReportcheck': () => {
    if ($("#posReportcheck").prop("checked") === true) {
      $(".posReportSelections").prop('checked', true);
    } else {
      $(".posReportSelections").prop('checked', false);
    }
  },

  /**
 * TODO:Complete JS doc
 */
  'click #locationcheck': () => {
    if ($("#locationcheck").prop("checked") === true) {
      $(".locationSelections").prop('checked', true);
    } else {
      $(".locationSelections").prop('checked', false);
    }
  },

  /**
  * TODO:Complete JS doc
  */
  'click #pendingArInvoicecheck': () => {
    if ($("#pendingArInvoicecheck").prop("checked") === true) {
      $(".pendingArInvoiceSelections").prop('checked', true);
    } else {
      $(".pendingArInvoiceSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #pendingPosInvoicecheck': () => {
    if ($("#pendingPosInvoicecheck").prop("checked") === true) {
      $(".pendingPosInvoiceSelections").prop('checked', true);
    } else {
      $(".pendingPosInvoiceSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #attendancecheck': () => {
    if ($("#attendancecheck").prop("checked") === true) {
      $(".attendanceSelections").prop('checked', true);
    } else {
      $(".attendanceSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #routeApprovecheck': () => {
    if ($("#routeApprovecheck").prop("checked") === true) {
      $(".routeApproveSelections").prop('checked', true);
    } else {
      $(".routeApproveSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #salesSummaryReportcheck': () => {
    if ($("#salesSummaryReportcheck").prop("checked") === true) {
      $(".salesSummaryReportSelections").prop('checked', true);
    } else {
      $(".salesSummaryReportSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #stockSummaryReportcheck': () => {
    if ($("#stockSummaryReportcheck").prop("checked") === true) {
      $(".stockSummaryReportSelections").prop('checked', true);
    } else {
      $(".stockSummaryReportSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #noSalesReportcheck': () => {
    if ($("#noSalesReportcheck").prop("checked") === true) {
      $(".noSalesReportSelections").prop('checked', true);
    } else {
      $(".noSalesReportSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #targetOutletReportcheck': () => {
    if ($("#targetOutletReportcheck").prop("checked") === true) {
      $(".targetOutletReportSelections").prop('checked', true);
    } else {
      $(".targetOutletReportSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #callRateReportcheck': () => {
    if ($("#callRateReportcheck").prop("checked") === true) {
      $(".callRateReportSelections").prop('checked', true);
    } else {
      $(".callRateReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #strikeRateReportcheck': () => {
    if ($("#strikeRateReportcheck").prop("checked") === true) {
      $(".strikeRateReportSelections").prop('checked', true);
    } else {
      $(".strikeRateReportSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #priceUpdatecheck': () => {
    if ($("#priceUpdatecheck").prop("checked") === true) {
      $(".priceUpdateSelections").prop('checked', true);
    } else {
      $(".priceUpdateSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #cxoDashboardcheck': () => {
    if ($("#cxoDashboardcheck").prop("checked") === true) {
      $(".cxoDashboardSelections").prop('checked', true);
    } else {
      $(".cxoDashboardSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #itemWiseReportcheck': () => {
    if ($("#itemWiseReportcheck").prop("checked") === true) {
      $(".itemWiseReportSelections").prop('checked', true);
    } else {
      $(".itemWiseReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #routeWiseReportcheck': () => {
    if ($("#routeWiseReportcheck").prop("checked") === true) {
      $(".routeWiseReportSelections").prop('checked', true);
    } else {
      $(".routeWiseReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #numericalDistributonReportcheck': () => {
    if ($("#numericalDistributonReportcheck").prop("checked") === true) {
      $(".numericalDistributonReportSelections").prop('checked', true);
    } else {
      $(".numericalDistributonReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #whsStockReportcheck': () => {
    if ($("#whsStockReportcheck").prop("checked") === true) {
      $(".whsStockReportSelections").prop('checked', true);
    } else {
      $(".whsStockReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #weightageDistributionReportcheck': () => {
    if ($("#weightageDistributionReportcheck").prop("checked") === true) {
      $(".weightageDistributionReportSelections").prop('checked', true);
    } else {
      $(".weightageDistributionReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #coverageDistributionReportcheck': () => {
    if ($("#coverageDistributionReportcheck").prop("checked") === true) {
      $(".coverageDistributionReportSelections").prop('checked', true);
    } else {
      $(".coverageDistributionReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #priceTypeEditcheck': () => {
    if ($("#priceTypeEditcheck").prop("checked") === true) {
      $(".priceTypeEditSelections").prop('checked', true);
    } else {
      $(".priceTypeEditSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #expenseListcheck': () => {
    if ($("#expenseListcheck").prop("checked") === true) {
      $(".expenseListSelections").prop('checked', true);
    } else {
      $(".expenseListSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #vansaleReportcheck': () => {
    if ($("#vansaleReportcheck").prop("checked") === true) {
      $(".vansaleReportSelections").prop('checked', true);
    } else {
      $(".vansaleReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #skippedCustomerReportcheck': () => {
    if ($("#skippedCustomerReportcheck").prop("checked") === true) {
      $(".skippedCustomerReportSelections").prop('checked', true);
    } else {
      $(".skippedCustomerReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditInvoiceReportcheck': () => {
    if ($("#creditInvoiceReportcheck").prop("checked") === true) {
      $(".creditInvoiceReportSelections").prop('checked', true);
    } else {
      $(".creditInvoiceReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesReturnReportcheck': () => {
    if ($("#salesReturnReportcheck").prop("checked") === true) {
      $(".salesReturnReportSelections").prop('checked', true);
    } else {
      $(".salesReturnReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditNoteReportcheck': () => {
    if ($("#creditNoteReportcheck").prop("checked") === true) {
      $(".creditNoteReportSelections").prop('checked', true);
    } else {
      $(".creditNoteReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #branchTransferReportcheck': () => {
    if ($("#branchTransferReportcheck").prop("checked") === true) {
      $(".branchTransferReportSelections").prop('checked', true);
    } else {
      $(".branchTransferReportSelections").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #collectionReportcheck': () => {
    if ($("#collectionReportcheck").prop("checked") === true) {
      $(".collectionReportSelections").prop('checked', true);
    } else {
      $(".collectionReportSelections").prop('checked', false);
    }
  },
  /**
 * TODO:Complete JS doc
 */
  'click #stockTransferReportcheck': () => {
    if ($("#stockTransferReportcheck").prop("checked") === true) {
      $(".stockTransferReportSelections").prop('checked', true);
    } else {
      $(".stockTransferReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #invoiceReportcheck': () => {
    if ($("#invoiceReportcheck").prop("checked") === true) {
      $(".invoiceReportSelections").prop('checked', true);
    } else {
      $(".invoiceReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #deliveryReportcheck': () => {
    if ($("#deliveryReportcheck").prop("checked") === true) {
      $(".deliveryReportSelections").prop('checked', true);
    } else {
      $(".deliveryReportSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #purchasePrintcheck': () => {
    if ($("#purchasePrintcheck").prop("checked") === true) {
      $(".purchasePrintSelections").prop('checked', true);
    } else {
      $(".purchasePrintSelections").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #activitySeniorcheck': () => {
    if ($("#activitySeniorcheck").prop("checked") === true) {
      $(".activitySeniorSelections").prop('checked', true);
    } else {
      $(".activitySeniorSelections").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #accountantcheck': () => {
    if ($("#accountantcheck").prop("checked") === true) {
      $(".accountantSelections").prop('checked', true);
    } else {
      $(".accountantSelections").prop('checked', false);
    }
  },
  /**
    * TODO:Complete JS doc
    */
  'change .orderSelections': () => {
    if ($(".orderSelections").length === $(".orderSelections:checked").length)
      $("#ordercheck").prop('checked', true);
    else
      $("#ordercheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .orderSeniorSelections': () => {
    if ($(".orderSeniorSelections").length === $(".orderSeniorSelections:checked").length)
      $("#orderSeniorcheck").prop('checked', true);
    else
      $("#orderSeniorcheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .salesReturnSelections': () => {
    if ($(".salesReturnSelections").length === $(".salesReturnSelections:checked").length)
      $("#salesReturncheck").prop('checked', true);
    else
      $("#salesReturncheck").prop('checked', false);
  },

  /**
   * TODO:Complete JS doc
   */
  'change .stockTransferRequestSelections': () => {
    if ($(".stockTransferRequestSelections").length === $(".stockTransferRequestSelections:checked").length)
      $("#stockTransferRequestcheck").prop('checked', true);
    else
      $("#stockTransferRequestcheck").prop('checked', false);
  },

  /**
   * TODO:Complete JS doc
   */
  'change .sdashboardSelections': () => {
    if ($(".sdashboardSelections").length === $(".sdashboardSelections:checked").length)
      $("#sdashboardcheck").prop('checked', true);
    else
      $("#sdashboardcheck").prop('checked', false);
  },

  /**
   * TODO:Complete JS doc
   */
  'change .posSelections': () => {
    if ($(".posSelections").length === $(".posSelections:checked").length)
      $("#poscheck").prop('checked', true);
    else
      $("#poscheck").prop('checked', false);
  },

  /**
   * TODO :Complete JS doc
   */
  'change .adashboardSelections': () => {
    if ($(".adashboardSelections").length === $(".adashboardSelections:checked").length)
      $("#adashboardcheck").prop('checked', true);
    else
      $("#adashboardcheck").prop('checked', false);
  },

  /**
  * TODO :Complete JS doc
  */
  'change .superAdmindashboardSelections': () => {
    if ($(".superAdmindashboardSelections").length === $(".superAdmindashboardSelections:checked").length)
      $("#superAdmindashboardcheck").prop('checked', true);
    else
      $("#superAdmindashboardcheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .bpAdminSelections': () => {
    if ($(".bpAdminSelections").length === $(".bpAdminSelections:checked").length)
      $("#bpAdmincheck").prop('checked', true);
    else
      $("#bpAdmincheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .deliverySelections': () => {
    if ($(".deliverySelections").length === $(".deliverySelections:checked").length)
      $("#deliverycheck").prop('checked', true);
    else
      $("#deliverycheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .dispatchBoySelections': () => {
    if ($(".dispatchBoySelections").length === $(".dispatchBoySelections:checked").length)
      $("#dispatchBoycheck").prop('checked', true);
    else
      $("#dispatchBoycheck").prop('checked', false);
  },
  /**
   * TODO: COmplete JS doc
   */
  'change .dispatchSelections': () => {
    if ($(".dispatchSelections").length === $(".dispatchSelections:checked").length)
      $("#dispatchcheck").prop('checked', true);
    else
      $("#dispatchcheck").prop('checked', false);
  },
  /**
   * TODO :Complete JS doc
   */
  'change .activitySelections': () => {
    if ($(".activitySelections").length === $(".activitySelections:checked").length)
      $("#activitycheck").prop('checked', true);
    else
      $("#activitycheck").prop('checked', false);
  },
  /**
 * TODO :Complete JS doc
 */
  'change .branchTransferSelections': () => {
    if ($(".branchTransferSelections").length === $(".branchTransferSelections:checked").length)
      $("#branchTransfercheck").prop('checked', true);
    else
      $("#branchTransfercheck").prop('checked', false);
  },
  /**
   * TODO :Complete JS doc
   */
  'change .branchTransferApproveSelections': () => {
    if ($(".branchTransferApproveSelections").length === $(".branchTransferApproveSelections:checked").length)
      $("#branchTransferApprovecheck").prop('checked', true);
    else
      $("#branchTransferApprovecheck").prop('checked', false);
  },
  /**
   * TODO :Complete JS doc
   */
  'change .dispatchRejectSelections': () => {
    if ($(".dispatchRejectSelections").length === $(".dispatchRejectSelections:checked").length)
      $("#dispatchRejectcheck").prop('checked', true);
    else
      $("#dispatchRejectcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .historySelections': () => {
    if ($(".historySelections").length === $(".historySelections:checked").length)
      $("#historycheck").prop('checked', true);
    else
      $("#historycheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .reportSelections': () => {
    if ($(".reportSelections").length === $(".reportSelections:checked").length)
      $("#reportcheck").prop('checked', true);
    else
      $("#reportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .reportOwnSelections': () => {
    if ($(".reportOwnSelections").length === $(".reportOwnSelections:checked").length)
      $("#reportOwncheck").prop('checked', true);
    else
      $("#reportOwncheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .userSelections': () => {
    if ($(".userSelections").length === $(".userSelections:checked").length)
      $("#userscheck").prop('checked', true);
    else
      $("#userscheck").prop('checked', false);
  },
  /**
     * TODO:Complete JS doc
     */
  'change .vanSaleUsersSelections': () => {
    if ($(".vanSaleUsersSelections").length === $(".vanSaleUsersSelections:checked").length)
      $("#vanSaleUserscheck").prop('checked', true);
    else
      $("#vanSaleUserscheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .routeSelections': () => {
    if ($(".routeSelections").length === $(".routeSelections:checked").length)
      $("#routecheck").prop('checked', true);
    else
      $("#routecheck").prop('checked', false);
  },

  /**
   * TODO:Complete JS doc
   */
  'change .masterDataSelections': () => {
    if ($(".masterDataSelections").length === $(".masterDataSelections:checked").length)
      $("#masterDatacheck").prop('checked', true);
    else
      $("#masterDatacheck").prop('checked', false);
  },

  /**
   * TODO:Comlete JS doc
   */
  'change .roleSelections': () => {
    if ($(".roleSelections").length === $(".roleSelections:checked").length)
      $("#rolecheck").prop('checked', true);
    else
      $("#rolecheck").prop('checked', false);
  },

  /**
 * TODO:Comlete JS doc
 */
  'change .designationSelections': () => {
    if ($(".designationSelections").length === $(".designationSelections:checked").length)
      $("#designationcheck").prop('checked', true);
    else
      $("#designationcheck").prop('checked', false);
  },

  /**
 * TODO:Comlete JS doc
 */
  'change .leadSelections': () => {
    if ($(".leadSelections").length === $(".leadSelections:checked").length)
      $("#leadcheck").prop('checked', true);
    else
      $("#leadcheck").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .collectionDueTodaySelections': () => {
    if ($(".collectionDueTodaySelections").length === $(".collectionDueTodaySelections:checked").length)
      $("#collectionDueTodaycheck").prop('checked', true);
    else
      $("#collectionDueTodaycheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .creditInvoiceSelections': () => {
    if ($(".creditInvoiceSelections").length === $(".creditInvoiceSelections:checked").length)
      $("#creditInvoicecheck").prop('checked', true);
    else
      $("#creditInvoicecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .creditNoteSelections': () => {
    if ($(".creditNoteSelections").length === $(".creditNoteSelections:checked").length)
      $("#creditNotecheck").prop('checked', true);
    else
      $("#creditNotecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .arInvoicePaymentSelections': () => {
    if ($(".arInvoicePaymentSelections").length === $(".arInvoicePaymentSelections:checked").length)
      $("#arInvoicePaymentcheck").prop('checked', true);
    else
      $("#arInvoicePaymentcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .arInvoiceSeniorPaymentSelections': () => {
    if ($(".arInvoiceSeniorPaymentSelections").length === $(".arInvoiceSeniorPaymentSelections:checked").length)
      $("#arInvoiceSeniorPaymentcheck").prop('checked', true);
    else
      $("#arInvoiceSeniorPaymentcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .salesQuotationSelections': () => {
    if ($(".salesQuotationSelections").length === $(".salesQuotationSelections:checked").length)
      $("#salesQuotationcheck").prop('checked', true);
    else
      $("#salesQuotationcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .salesQuotationSeniorSelections': () => {
    if ($(".salesQuotationSeniorSelections").length === $(".salesQuotationSeniorSelections:checked").length)
      $("#salesQuotationSeniorcheck").prop('checked', true);
    else
      $("#salesQuotationSeniorcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .invoiceSelections': () => {
    if ($(".invoiceSelections").length === $(".invoiceSelections:checked").length)
      $("#invoicecheck").prop('checked', true);
    else
      $("#invoicecheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .deliveryBoySelections': () => {
    if ($(".deliveryBoySelections").length === $(".deliveryBoySelections:checked").length)
      $("#deliveryBoycheck").prop('checked', true);
    else
      $("#deliveryBoycheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .orderApproveSelections': () => {
    if ($(".orderApproveSelections").length === $(".orderApproveSelections:checked").length)
      $("#orderApprovecheck").prop('checked', true);
    else
      $("#orderApprovecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .quotationApproveSelections': () => {
    if ($(".quotationApproveSelections").length === $(".quotationApproveSelections:checked").length)
      $("#quotationApprovecheck").prop('checked', true);
    else
      $("#quotationApprovecheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .salesReturnApproveSelections': () => {
    if ($(".salesReturnApproveSelections").length === $(".salesReturnApproveSelections:checked").length)
      $("#salesReturnApprovecheck").prop('checked', true);
    else
      $("#salesReturnApprovecheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .stockTransferApproveSelections': () => {
    if ($(".stockTransferApproveSelections").length === $(".stockTransferApproveSelections:checked").length)
      $("#stockTransferApprovecheck").prop('checked', true);
    else
      $("#stockTransferApprovecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .creditNoteApproveSelections': () => {
    if ($(".creditNoteApproveSelections").length === $(".creditNoteApproveSelections:checked").length)
      $("#creditNoteApprovecheck").prop('checked', true);
    else
      $("#creditNoteApprovecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .creditInvoiceApproveSelections': () => {
    if ($(".creditInvoiceApproveSelections").length === $(".creditInvoiceApproveSelections:checked").length)
      $("#creditInvoiceApprovecheck").prop('checked', true);
    else
      $("#creditInvoiceApprovecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .pickListSelections': () => {
    if ($(".pickListSelections").length === $(".pickListSelections:checked").length)
      $("#pickListcheck").prop('checked', true);
    else
      $("#pickListcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .orderReportSelections': () => {
    if ($(".orderReportSelections").length === $(".orderReportSelections:checked").length)
      $("#orderReportcheck").prop('checked', true);
    else
      $("#orderReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .salesQuotationReportSelections': () => {
    if ($(".salesQuotationReportSelections").length === $(".salesQuotationReportSelections:checked").length)
      $("#salesQuotationReportcheck").prop('checked', true);
    else
      $("#salesQuotationReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .arInvoiceReportSelections': () => {
    if ($(".arInvoiceReportSelections").length === $(".arInvoiceReportSelections:checked").length)
      $("#arInvoiceReportcheck").prop('checked', true);
    else
      $("#arInvoiceReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .posReportSelections': () => {
    if ($(".posReportSelections").length === $(".posReportSelections:checked").length)
      $("#posReportcheck").prop('checked', true);
    else
      $("#posReportcheck").prop('checked', false);
  },

  /**
 * TODO:Complete JS doc
 */
  'change .locationSelections': () => {
    if ($(".locationSelections").length === $(".locationSelections:checked").length)
      $("#locationcheck").prop('checked', true);
    else
      $("#locationcheck").prop('checked', false);
  },

  /**
  * TODO:Complete JS doc
  */
  'change .pendingArInvoiceSelections': () => {
    if ($(".pendingArInvoiceSelections").length === $(".pendingArInvoiceSelections:checked").length)
      $("#pendingArInvoicecheck").prop('checked', true);
    else
      $("#pendingArInvoicecheck").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .pendingPosInvoiceSelections': () => {
    if ($(".pendingPosInvoiceSelections").length === $(".pendingPosInvoiceSelections:checked").length)
      $("#pendingPosInvoicecheck").prop('checked', true);
    else
      $("#pendingPosInvoicecheck").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .attendanceSelections': () => {
    if ($(".attendanceSelections").length === $(".attendanceSelections:checked").length)
      $("#attendancecheck").prop('checked', true);
    else
      $("#attendancecheck").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .routeApproveSelections': () => {
    if ($(".routeApproveSelections").length === $(".routeApproveSelections:checked").length)
      $("#routeApprovecheck").prop('checked', true);
    else
      $("#routeApprovecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .salesSummaryReportSelections': () => {
    if ($(".salesSummaryReportSelections").length === $(".salesSummaryReportSelections:checked").length)
      $("#salesSummaryReportcheck").prop('checked', true);
    else
      $("#salesSummaryReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .stockSummaryReportSelections': () => {
    if ($(".stockSummaryReportSelections").length === $(".stockSummaryReportSelections:checked").length)
      $("#stockSummaryReportcheck").prop('checked', true);
    else
      $("#stockSummaryReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .noSalesReportSelections': () => {
    if ($(".noSalesReportSelections").length === $(".noSalesReportSelections:checked").length)
      $("#noSalesReportcheck").prop('checked', true);
    else
      $("#noSalesReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .targetOutletReportSelections': () => {
    if ($(".targetOutletsReportSelections").length === $(".targetOutletReportSelections:checked").length)
      $("#targetOutletReportcheck").prop('checked', true);
    else
      $("#targetOutletReportcheck").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .callRateReportSelections': () => {
    if ($(".callRateReportSelections").length === $(".callRateReportSelections:checked").length)
      $("#callRateReportcheck").prop('checked', true);
    else
      $("#callRateReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .strikeRateReportSelections': () => {
    if ($(".strikeRateReportSelections").length === $(".strikeRateReportSelections:checked").length)
      $("#strikeRateReportcheck").prop('checked', true);
    else
      $("#strikeRateReportcheck").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .priceUpdateSelections': () => {
    if ($(".priceUpdateSelections").length === $(".priceUpdateSelections:checked").length)
      $("#priceUpdatecheck").prop('checked', true);
    else
      $("#priceUpdatecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .cxoDashboardSelections': () => {
    if ($(".cxoDashboardSelections").length === $(".cxoDashboardSelections:checked").length)
      $("#cxoDashboardcheck").prop('checked', true);
    else
      $("#cxoDashboardcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .itemWiseReportSelections': () => {
    if ($(".itemWiseReportSelections").length === $(".itemWiseReportSelections:checked").length)
      $("#itemWiseReportcheck").prop('checked', true);
    else
      $("#itemWiseReportcheck").prop('checked', false);
  },
  /**
 * TODO:Complete JS doc
 */
  'change .routeWiseReportSelections': () => {
    if ($(".routeWiseReportSelections").length === $(".routeWiseReportSelections:checked").length)
      $("#routeWiseReportcheck").prop('checked', true);
    else
      $("#routeWiseReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .numericalDistributonReportSelections': () => {
    if ($(".numericalDistributonReportSelections").length === $(".numericalDistributonReportSelections:checked").length)
      $("#numericalDistributonReportcheck").prop('checked', true);
    else
      $("#numericalDistributonReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .whsStockReportSelections': () => {
    if ($(".whsStockReportSelections").length === $(".whsStockReportSelections:checked").length)
      $("#whsStockReportcheck").prop('checked', true);
    else
      $("#whsStockReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .weightageDistributionReportSelections': () => {
    if ($(".weightageDistributionReportSelections").length === $(".weightageDistributionReportSelections:checked").length)
      $("#weightageDistributionReportcheck").prop('checked', true);
    else
      $("#weightageDistributionReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .coverageDistributionReportSelections': () => {
    if ($(".coverageDistributionReportSelections").length === $(".coverageDistributionReportSelections:checked").length)
      $("#coverageDistributionReportcheck").prop('checked', true);
    else
      $("#coverageDistributionReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .priceTypeEditSelections': () => {
    if ($(".priceTypeEditSelections").length === $(".priceTypeEditSelections:checked").length)
      $("#priceTypeEditcheck").prop('checked', true);
    else
      $("#priceTypeEditcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .expenseListSelections': () => {
    if ($(".expenseListSelections").length === $(".expenseListSelections:checked").length)
      $("#expenseListcheck").prop('checked', true);
    else
      $("#expenseListcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .vansaleReportSelections': () => {
    if ($(".vansaleReportSelections").length === $(".vansaleReportSelections:checked").length)
      $("#vansaleReportcheck").prop('checked', true);
    else
      $("#vansaleReportcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .skippedCustomerReportSelections': () => {
    if ($(".skippedCustomerReportSelections").length === $(".skippedCustomerReportSelections:checked").length)
      $("#skippedCustomerReportcheck").prop('checked', true);
    else
      $("#skippedCustomerReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .creditInvoiceReportSelections': () => {
    if ($(".creditInvoiceReportSelections").length === $(".creditInvoiceReportSelections:checked").length)
      $("#creditInvoiceReportcheck").prop('checked', true);
    else
      $("#creditInvoiceReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .salesReturnReportSelections': () => {
    if ($(".salesReturnReportSelections").length === $(".salesReturnReportSelections:checked").length)
      $("#salesReturnReportcheck").prop('checked', true);
    else
      $("#salesReturnReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .creditNoteReportSelections': () => {
    if ($(".creditNoteReportSelections").length === $(".creditNoteReportSelections:checked").length)
      $("#creditNoteReportcheck").prop('checked', true);
    else
      $("#creditNoteReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .branchTransferReportSelections': () => {
    if ($(".branchTransferReportSelections").length === $(".branchTransferReportSelections:checked").length)
      $("#branchTransferReportcheck").prop('checked', true);
    else
      $("#branchTransferReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .collectionReportSelections': () => {
    if ($(".collectionReportSelections").length === $(".collectionReportSelections:checked").length)
      $("#collectionReportcheck").prop('checked', true);
    else
      $("#collectionReportcheck").prop('checked', false);
  },
  /**
 * TODO:Complete JS doc
 */
  'change .stockTransferReportSelections': () => {
    if ($(".stockTransferReportSelections").length === $(".stockTransferReportSelections:checked").length)
      $("#stockTransferReportcheck").prop('checked', true);
    else
      $("#stockTransferReportcheck").prop('checked', false);
  },
  /**
 * TODO:Complete JS doc
 */
  'change .invoiceReportSelections': () => {
    if ($(".invoiceReportSelections").length === $(".invoiceReportSelections:checked").length)
      $("#invoiceReportcheck").prop('checked', true);
    else
      $("#invoiceReportcheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .deliveryReportSelections': () => {
    if ($(".deliveryReportSelections").length === $(".deliveryReportSelections:checked").length)
      $("#deliveryReportcheck").prop('checked', true);
    else
      $("#deliveryReportcheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .purchasePrintSelections': () => {
    if ($(".purchasePrintSelections").length === $(".purchasePrintSelections:checked").length)
      $("#purchasePrintcheck").prop('checked', true);
    else
      $("#purchasePrintcheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .activitySeniorSelections': () => {
    if ($(".activitySeniorSelections").length === $(".activitySeniorSelections:checked").length)
      $("#activitySeniorcheck").prop('checked', true);
    else
      $("#activitySeniorcheck").prop('checked', false);
  },
  /**
   * TODO:Complete JS doc
   */
  'change .accountantSelections': () => {
    if ($(".accountantSelections").length === $(".accountantSelections:checked").length)
      $("#accountantcheck").prop('checked', true);
    else
      $("#accountantcheck").prop('checked', false);
  },
  /**
      * TODO: Complete JS doc
      */
  'click .closeRole': () => {
    $("#roleAdd").each(function () {
      this.reset();
      $("#roleName").css({ "color": "black", "border": " 1px solid #00c0ef" });
      $("#roleSubmit").prop('disabled', false);
      $("#homeURL").val('').trigger('change');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .roleAdd': (event) => {

    event.preventDefault();
    createRole(event.target);

  }
});
