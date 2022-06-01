/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor'
import { roles } from "../../../api/role/role";

Template.role_list.onCreated(function () {

  const self = this;
  self.autorun(() => {


  });
  this.userDetails = new ReactiveVar()

  this.pagination = new Meteor.Pagination(roles, {
    filters: { 'isDeleted': false },
    sort: { 'name': 1 },
    perPage: 20
  });

});
Template.role_list.onRendered(function () {
  Meteor.call('user.userList', (roleError, roleResult) => {
    if (!roleError) {
      this.userDetails.set(roleResult);
    }
  });
  $('.homeURLUpdate').select2({
    placeholder: "Select Home Page",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".homeURLUpdate").parent(),

  });
  $(".defultRole").select2({
    placeholder: "Select Default Role",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".defultRole").parent(),
    noResults: 'No Role found.',
  });
})

Template.role_list.helpers({

  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('jalik-roles');
  },

  /**
   * TODO: Complete JS doc
    @returns {{collection: , acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('jalik-roles');
    config.textarea = true;

    return config;
  },

  /**
   * TODO: Complete JS doc
    @returns {any | }
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },

  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },

  /**
   * TODO: Complete JS doc
    @returns {}
   */
  roles: function () {

    return Template.instance().pagination.getPage();
  },

  /**
   * TODO: Complete JS doc
   * @returns {Function}
   */
  handlePagination: function () {
    return function (e, templateInstance, clickedPage) {
      e.preventDefault();
      console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
    };
  },

  /**
   * TODO: Complete JS doc
   */
  sortIcon: () => {
    genericSortIcons();
  },
  /**
 * TODO: Complete JS doc
 * @param role_id
 */
  totalUsers: function (role_id) {
    let count = 0;
    let userDetails = Template.instance().userDetails.get();
    if (userDetails) {

      for (var i = 0; i < userDetails.length; i++) {

        if ($.inArray(role_id, userDetails[i].roles) !== -1) {

          count = count + 1;
        }
      }
      return count;
    }
  }
});

Template.role_list.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .roleFilter': (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    let description = event.target.description.value;

    if (name && $.trim(name) && description && $.trim(description)) {
      Template.instance().pagination.settings.set('filters',
        {
          name: {
            $regex: new RegExp($.trim(name), "i")
          },
          description: {
            $regex: new RegExp($.trim(description), "i")
          },

          'isDeleted': false
        }
      );
    }
    else if (name && $.trim(name)) {
      Template.instance().pagination.settings.set('filters', {
        name: {
          $regex: new RegExp($.trim(name), "i")
        },
        'isDeleted': false
      });
    }
    else if (description && $.trim(description)) {
      Template.instance().pagination.settings.set('filters', {
        description: { $regex: new RegExp($.trim(description), "i") },
        'isDeleted': false
      });
    }
    else {
      Template.instance().pagination.settings.set('filters',
        {
          'isDeleted': false

        });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click #ic-create-button': () => {
    $("#ic-create").modal();
  },
  /**
  * TODO: Complete JS doc
  */
  'click #historychecks': () => {
    if ($("#historychecks").prop("checked") === true) {
      $("#historycheckView").prop('checked', true);
    } else {
      $("#historycheckView").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #bpAdminchecks': () => {
    if ($("#bpAdminchecks").prop("checked") === true) {
      $(".bpAdminSelect").prop('checked', true);
    } else {
      $(".bpAdminSelect").prop('checked', false);
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click #reportchecks': () => {
    if ($("#reportchecks").prop("checked") === true) {
      $("#reportcheckView").prop('checked', true);
    } else {
      $("#reportcheckView").prop('checked', false);
    }
  },
  /**
     * TODO: Complete JS doc
     */
  'click #reportOwnchecks': () => {
    if ($("#reportOwnchecks").prop("checked") === true) {
      $("#reportOwncheckView").prop('checked', true);
    } else {
      $("#reportOwncheckView").prop('checked', false);
    }
  },
  /**
   * TODO: Complete JS doc
   */

  'click #userschecks': () => {
    if ($("#userschecks").prop("checked") === true) {
      $("#userscheckView").prop('checked', true);
      $("#userscheckCreate").prop('checked', true);
      $("#userscheckUpdate").prop('checked', true);
      $("#userscheckDelete").prop('checked', true);
    } else {
      $("#userscheckView").prop('checked', false);
      $("#userscheckCreate").prop('checked', false);
      $("#userscheckUpdate").prop('checked', false);
      $("#userscheckDelete").prop('checked', false);
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click #vanSaleUserschecks': () => {
    if ($("#vanSaleUserschecks").prop("checked") === true) {
      $("#vanSaleUserscheckView").prop('checked', true);
      $("#vanSaleUserscheckCreate").prop('checked', true);
      $("#vanSaleUserscheckUpdate").prop('checked', true);
      $("#vanSaleUserscheckDelete").prop('checked', true);
    } else {
      $("#vanSaleUserscheckView").prop('checked', false);
      $("#vanSaleUserscheckCreate").prop('checked', false);
      $("#vanSaleUserscheckUpdate").prop('checked', false);
      $("#vanSaleUserscheckDelete").prop('checked', false);
    }
  },
  /**
 * TODO: Complete JS doc
 */
  'click #routechecks': () => {
    if ($("#routechecks").prop("checked") === true) {
      $("#routecheckView").prop('checked', true);
      $("#routecheckCreate").prop('checked', true);
      $("#routecheckUpdate").prop('checked', true);
      $("#routecheckDelete").prop('checked', true);
    } else {
      $("#routecheckView").prop('checked', false);
      $("#routecheckCreate").prop('checked', false);
      $("#routecheckUpdate").prop('checked', false);
      $("#routecheckDelete").prop('checked', false);
    }
  },

  /**
* TODO: Complete JS doc
*/
  'click #masterDatachecks': () => {
    if ($("#masterDatachecks").prop("checked") === true) {
      $("#masterDatacheckView").prop('checked', true);
      $("#masterDatacheckCreate").prop('checked', true);
      $("#masterDatacheckUpdate").prop('checked', true);
      $("#masterDatacheckDelete").prop('checked', true);
    } else {
      $("#masterDatacheckView").prop('checked', false);
      $("#masterDatacheckCreate").prop('checked', false);
      $("#masterDatacheckUpdate").prop('checked', false);
      $("#masterDatacheckDelete").prop('checked', false);
    }
  },

  /**
    * TODO: Complete JS doc
    */
  'click #rolechecks': () => {
    if ($("#rolechecks").prop("checked") === true) {
      $("#rolecheckView").prop('checked', true);
      $("#rolecheckUpdate").prop('checked', true);
      $("#rolecheckCreate").prop('checked', true);
      $("#rolecheckDelete").prop('checked', true);
    } else {
      $("#rolecheckView").prop('checked', false);
      $("#rolecheckUpdate").prop('checked', false);
      $("#rolecheckCreate").prop('checked', false);
      $("#rolecheckDelete").prop('checked', false);
    }
  },
  /**
    * TODO: Complete JS doc
    */
  'click #designationchecks': () => {
    if ($("#designationchecks").prop("checked") === true) {
      $("#designationcheckView").prop('checked', true);
      $("#designationcheckUpdate").prop('checked', true);
      $("#designationcheckCreate").prop('checked', true);
      $("#designationcheckDelete").prop('checked', true);
    } else {
      $("#designationcheckView").prop('checked', false);
      $("#designationcheckUpdate").prop('checked', false);
      $("#designationcheckCreate").prop('checked', false);
      $("#designationcheckDelete").prop('checked', false);
    }
  },
  'click #branchTransferchecks': () => {
    if ($("#branchTransferchecks").prop("checked") === true) {
      $("#branchTransfercheckView").prop('checked', true);
      $("#branchTransfercheckCreate").prop('checked', true);
    } else {
      $("#branchTransfercheckView").prop('checked', false);
      $("#branchTransfercheckCreate").prop('checked', false);
    }
  },
  'click #activitychecks': () => {
    if ($("#activitychecks").prop("checked") === true) {
      $("#activitycheckView").prop('checked', true);
      $("#activitycheckCreate").prop('checked', true);
    } else {
      $("#activitycheckView").prop('checked', false);
      $("#activitycheckCreate").prop('checked', false);
    }
  },
  'click #branchTransferApprovechecks': () => {
    if ($("#branchTransferApprovechecks").prop("checked") === true) {
      $("#branchTransfercheckApproveView").prop('checked', true);
    } else {
      $("#branchTransfercheckApproveView").prop('checked', false);
    }
  },
  /**
  * TODO: Complete JS doc
  */
  'click #leadchecks': () => {
    if ($("#leadchecks").prop("checked") === true) {
      $("#leadcheckView").prop('checked', true);
      $("#leadcheckUpdate").prop('checked', true);
      $("#leadcheckCreate").prop('checked', true);
      $("#leadcheckDelete").prop('checked', true);
    } else {
      $("#leadcheckView").prop('checked', false);
      $("#leadcheckUpdate").prop('checked', false);
      $("#leadcheckCreate").prop('checked', false);
      $("#leadcheckDelete").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #sdashboardchecks': () => {
    if ($("#sdashboardchecks").prop("checked") === true) {
      $("#sdashboardView").prop('checked', true);
    } else {
      $("#sdashboardView").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #poschecks': () => {
    if ($("#poschecks").prop("checked") === true) {
      $("#posView").prop('checked', true);
    } else {
      $("#posView").prop('checked', false);
    }
  },

  /**
   * TODO: Complete JS doc
   */
  'click #adashboardchecks': () => {
    if ($("#adashboardchecks").prop("checked") === true) {
      $("#adashboardView").prop('checked', true);
    } else {
      $("#adashboardView").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #superAdmindashboardchecks': () => {
    if ($("#superAdmindashboardchecks").prop("checked") === true) {
      $("#superAdmindashboardView").prop('checked', true);
    } else {
      $("#superAdmindashboardView").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #orderchecks': () => {
    if ($("#orderchecks").prop("checked") === true) {
      $("#ordercheckCreate").prop('checked', true);
      $("#ordercheckView").prop('checked', true);
    } else {
      $("#ordercheckCreate").prop('checked', false);
      $("#ordercheckView").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #orderSeniorchecks': () => {
    if ($("#orderSeniorchecks").prop("checked") === true) {
      $("#orderSeniorcheckCreate").prop('checked', true);
      $("#orderSeniorcheckView").prop('checked', true);
    } else {
      $("#orderSeniorcheckCreate").prop('checked', false);
      $("#orderSeniorcheckView").prop('checked', false);
    }
  },
  /**
 * TODO:Complete JS doc
 */
  'click #salesReturnchecks': () => {
    if ($("#salesReturnchecks").prop("checked") === true) {
      $("#salesReturncheckCreate").prop('checked', true);
      $("#salesReturncheckView").prop('checked', true);
    } else {
      $("#salesReturncheckCreate").prop('checked', false);
      $("#salesReturncheckView").prop('checked', false);
    }
  },

  /**
  * TODO:Complete JS doc
  */
  'click #stockTransferRequestchecks': () => {
    if ($("#stockTransferRequestchecks").prop("checked") === true) {
      $("#stockTransferRequestcheckCreate").prop('checked', true);
      $("#stockTransferRequestcheckView").prop('checked', true);
    } else {
      $("#stockTransferRequestcheckCreate").prop('checked', false);
      $("#stockTransferRequestcheckView").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #deliverycheck1': () => {
    if ($("#deliverycheck1").prop("checked") === true) {
      $(".deliverySelections1").prop('checked', true);
      $("#deliverycheckUpdate").prop('checked', true);
    } else {
      $(".deliverySelections1").prop('checked', false);
      $("#deliverycheckUpdate").prop('checked', false);
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click #dispatchcheck1': () => {
    if ($("#dispatchcheck1").prop("checked") === true) {
      $(".dispatchSelections1").prop('checked', true);
      $("#dispatchcheckUpdate").prop('checked', true);
    } else {
      $(".dispatchSelections1").prop('checked', false);
      $("#dispatchcheckUpdate").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #dispatchRejectchecks': () => {
    if ($("#dispatchRejectchecks").prop("checked") === true) {
      $("#dispatchRejectView").prop('checked', true);
    } else {
      $("#dispatchRejectView").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #collectionDueTodaychecks': () => {
    if ($("#collectionDueTodaychecks").prop("checked") === true) {
      $(".collectionDueTodaySelect").prop('checked', true);
    } else {
      $(".collectionDueTodaySelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditInvoicechecks': () => {
    if ($("#creditInvoicechecks").prop("checked") === true) {
      $(".creditInvoiceSelect").prop('checked', true);
    } else {
      $(".creditInvoiceSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditNotechecks': () => {
    if ($("#creditNotechecks").prop("checked") === true) {
      $(".creditNoteSelect").prop('checked', true);
    } else {
      $(".creditNoteSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #arInvoicePaymentchecks': () => {
    if ($("#arInvoicePaymentchecks").prop("checked") === true) {
      $(".arInvoicePaymentSelect").prop('checked', true);
    } else {
      $(".arInvoicePaymentSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #arInvoiceSeniorPaymentchecks': () => {
    if ($("#arInvoiceSeniorPaymentchecks").prop("checked") === true) {
      $(".arInvoiceSeniorPaymentSelect").prop('checked', true);
    } else {
      $(".arInvoiceSeniorPaymentSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesQuotationchecks': () => {
    if ($("#salesQuotationchecks").prop("checked") === true) {
      $(".salesQuotationSelect").prop('checked', true);
    } else {
      $(".salesQuotationSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesQuotationSeniorchecks': () => {
    if ($("#salesQuotationSeniorchecks").prop("checked") === true) {
      $(".salesQuotationSeniorSelect").prop('checked', true);
    } else {
      $(".salesQuotationSeniorSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #invoicechecks': () => {
    if ($("#invoicechecks").prop("checked") === true) {
      $(".invoiceSelect").prop('checked', true);
    } else {
      $(".invoiceSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #deliveryBoychecks': () => {
    if ($("#deliveryBoychecks").prop("checked") === true) {
      $(".deliveryBoySelect").prop('checked', true);
    } else {
      $(".deliveryBoySelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #orderApprovechecks': () => {
    if ($("#orderApprovechecks").prop("checked") === true) {
      $(".orderApproveSelect").prop('checked', true);
    } else {
      $(".orderApproveSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #quotationApprovechecks': () => {
    if ($("#quotationApprovechecks").prop("checked") === true) {
      $(".quotationApproveSelect").prop('checked', true);
    } else {
      $(".quotationApproveSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #salesReturnApprovechecks': () => {
    if ($("#salesReturnApprovechecks").prop("checked") === true) {
      $(".salesReturnApproveSelect").prop('checked', true);
    } else {
      $(".salesReturnApproveSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #stockTransferApprovechecks': () => {
    if ($("#stockTransferApprovechecks").prop("checked") === true) {
      $(".stockTransferApproveSelect").prop('checked', true);
    } else {
      $(".stockTransferApproveSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditNoteApprovechecks': () => {
    if ($("#creditNoteApprovechecks").prop("checked") === true) {
      $(".creditNoteApproveSelect").prop('checked', true);
    } else {
      $(".creditNoteApproveSelect").prop('checked', false);
    }
  },
  /**
   * TODO:Complete JS doc
   */
  'click #creditInvoiceApprovechecks': () => {
    if ($("#creditInvoiceApprovechecks").prop("checked") === true) {
      $(".creditInvoiceApproveSelect").prop('checked', true);
    } else {
      $(".creditInvoiceApproveSelect").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #pickListchecks': () => {
    if ($("#pickListchecks").prop("checked") === true) {
      $(".pickListSelect").prop('checked', true);
    } else {
      $(".pickListSelect").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #orderReportchecks': () => {
    if ($("#orderReportchecks").prop("checked") === true) {
      $(".orderReportSelect").prop('checked', true);
    } else {
      $(".orderReportSelect").prop('checked', false);
    }
  },
  /**
    * TODO:Complete JS doc
    */
  'click #salesQuotationReportchecks': () => {
    if ($("#salesQuotationReportchecks").prop("checked") === true) {
      $(".salesQuotationReportSelect").prop('checked', true);
    } else {
      $(".salesQuotationReportSelect").prop('checked', false);
    }
  },
  /**
    * TODO:Complete JS doc
    */
  'click #arInvoiceReportchecks': () => {
    if ($("#arInvoiceReportchecks").prop("checked") === true) {
      $(".arInvoiceReportSelect").prop('checked', true);
    } else {
      $(".arInvoiceReportSelect").prop('checked', false);
    }
  },
  /**
    * TODO:Complete JS doc
    */
  'click #posReportchecks': () => {
    if ($("#posReportchecks").prop("checked") === true) {
      $(".posReportSelect").prop('checked', true);
    } else {
      $(".posReportSelect").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #locationchecks': () => {
    if ($("#locationchecks").prop("checked") === true) {
      $(".locationSelect").prop('checked', true);
    } else {
      $(".locationSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #pendingArInvoicechecks': () => {
    if ($("#pendingArInvoicechecks").prop("checked") === true) {
      $(".pendingArInvoiceSelect").prop('checked', true);
    } else {
      $(".pendingArInvoiceSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #pendingPosInvoicechecks': () => {
    if ($("#pendingPosInvoicechecks").prop("checked") === true) {
      $(".pendingPosInvoiceSelect").prop('checked', true);
    } else {
      $(".pendingPosInvoiceSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #attendancechecks': () => {
    if ($("#attendancechecks").prop("checked") === true) {
      $(".attendanceSelect").prop('checked', true);
    } else {
      $(".attendanceSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #routeApprovechecks': () => {
    if ($("#routeApprovechecks").prop("checked") === true) {
      $(".routeApproveSelect").prop('checked', true);
    } else {
      $(".routeApproveSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #salesSummaryReports': () => {
    if ($("#salesSummaryReports").prop("checked") === true) {
      $(".salesSummaryReportSelect").prop('checked', true);
    } else {
      $(".salesSummaryReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #salesSummaryReportchecks': () => {
    if ($("#salesSummaryReportchecks").prop("checked") === true) {
      $(".salesSummaryReportSelect").prop('checked', true);
    } else {
      $(".salesSummaryReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #stockSummaryReportchecks': () => {
    if ($("#stockSummaryReportchecks").prop("checked") === true) {
      $(".stockSummaryReportSelect").prop('checked', true);
    } else {
      $(".stockSummaryReportSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #noSalesReportchecks': () => {
    if ($("#noSalesReportchecks").prop("checked") === true) {
      $(".noSalesReportSelect").prop('checked', true);
    } else {
      $(".noSalesReportSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #targetOutletReportchecks': () => {
    if ($("#targetOutletReportchecks").prop("checked") === true) {
      $(".targetOutletReportSelect").prop('checked', true);
    } else {
      $(".targetOutletReportSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #callRateReportchecks': () => {
    if ($("#callRateReportchecks").prop("checked") === true) {
      $(".callRateReportSelect").prop('checked', true);
    } else {
      $(".callRateReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #strikeRateReportchecks': () => {
    if ($("#strikeRateReportchecks").prop("checked") === true) {
      $(".strikeRateReportSelect").prop('checked', true);
    } else {
      $(".strikeRateReportSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #priceUpdatechecks': () => {
    if ($("#priceUpdatechecks").prop("checked") === true) {
      $(".priceUpdateSelect").prop('checked', true);
    } else {
      $(".priceUpdateSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #cxoDashboardchecks': () => {
    if ($("#cxoDashboardchecks").prop("checked") === true) {
      $(".cxoDashboardSelect").prop('checked', true);
    } else {
      $(".cxoDashboardSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #itemWiseReportchecks': () => {
    if ($("#itemWiseReportchecks").prop("checked") === true) {
      $(".itemWiseReportSelect").prop('checked', true);
    } else {
      $(".itemWiseReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #routeWiseReportchecks': () => {
    if ($("#routeWiseReportchecks").prop("checked") === true) {
      $(".routeWiseReportSelect").prop('checked', true);
    } else {
      $(".routeWiseReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #numericalDistributonReportchecks': () => {
    if ($("#numericalDistributonReportchecks").prop("checked") === true) {
      $(".numericalDistributonReportSelect").prop('checked', true);
    } else {
      $(".numericalDistributonReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #whsStockReportchecks': () => {
    if ($("#whsStockReportchecks").prop("checked") === true) {
      $(".whsStockReportSelect").prop('checked', true);
    } else {
      $(".whsStockReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #weightageDistributionReportchecks': () => {
    if ($("#weightageDistributionReportchecks").prop("checked") === true) {
      $(".weightageDistributionReportSelect").prop('checked', true);
    } else {
      $(".weightageDistributionReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #coverageDistributionReportchecks': () => {
    if ($("#coverageDistributionReportchecks").prop("checked") === true) {
      $(".coverageDistributionReportSelect").prop('checked', true);
    } else {
      $(".coverageDistributionReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #priceTypeEditchecks': () => {
    if ($("#priceTypeEditchecks").prop("checked") === true) {
      $(".priceTypeEditSelect").prop('checked', true);
    } else {
      $(".priceTypeEditSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #expenseListchecks': () => {
    if ($("#expenseListchecks").prop("checked") === true) {
      $(".expenseListSelect").prop('checked', true);
    } else {
      $(".expenseListSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #vansaleReportchecks': () => {
    if ($("#vansaleReportchecks").prop("checked") === true) {
      $(".vansaleReportSelect").prop('checked', true);
    } else {
      $(".vansaleReportSelect").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #skippedCustomerReportchecks': () => {
    if ($("#skippedCustomerReportchecks").prop("checked") === true) {
      $(".skippedCustomerReportSelect").prop('checked', true);
    } else {
      $(".skippedCustomerReportSelect").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #routechecks': () => {
    if ($("#routechecks").prop("checked") === true) {
      $(".routeSelect").prop('checked', true);
    } else {
      $(".routeSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #masterDatachecks': () => {
    if ($("#masterDatachecks").prop("checked") === true) {
      $(".masterDataSelect").prop('checked', true);
    } else {
      $(".masterDataSelect").prop('checked', false);
    }
  },


  /**
    * TODO:Complete JS doc
    */
  'click #creditInvoiceReportchecks': () => {
    if ($("#creditInvoiceReportchecks").prop("checked") === true) {
      $(".creditInvoiceReportSelect").prop('checked', true);
    } else {
      $(".creditInvoiceReportSelect").prop('checked', false);
    }
  },
  /**
    * TODO:Complete JS doc
    */
  'click #salesReturnReportchecks': () => {
    if ($("#salesReturnReportchecks").prop("checked") === true) {
      $(".salesReturnReportSelect").prop('checked', true);
    } else {
      $(".salesReturnReportSelect").prop('checked', false);
    }
  },
  /**
    * TODO:Complete JS doc
    */
  'click #creditNoteReportchecks': () => {
    if ($("#creditNoteReportchecks").prop("checked") === true) {
      $(".creditNoteReportSelect").prop('checked', true);
    } else {
      $(".creditNoteReportSelect").prop('checked', false);
    }
  },
  /**
    * TODO:Complete JS doc
    */
  'click #branchTransferReportchecks': () => {
    if ($("#branchTransferReportchecks").prop("checked") === true) {
      $(".branchTransferReportSelect").prop('checked', true);
    } else {
      $(".branchTransferReportSelect").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #collectionReportchecks': () => {
    if ($("#collectionReportchecks").prop("checked") === true) {
      $(".collectionReportSelect").prop('checked', true);
    } else {
      $(".collectionReportSelect").prop('checked', false);
    }
  },
  /**
  * TODO:Complete JS doc
  */
  'click #stockTransferReportchecks': () => {
    if ($("#stockTransferReportchecks").prop("checked") === true) {
      $(".stockTransferReportSelect").prop('checked', true);
    } else {
      $(".stockTransferReportSelect").prop('checked', false);
    }
  },
  /**
 * TODO:Complete JS doc
 */
  'click #invoiceReportchecks': () => {
    if ($("#invoiceReportchecks").prop("checked") === true) {
      $(".invoiceReportSelect").prop('checked', true);
    } else {
      $(".invoiceReportSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #deliveryReportchecks': () => {
    if ($("#deliveryReportchecks").prop("checked") === true) {
      $(".deliveryReportSelect").prop('checked', true);
    } else {
      $(".deliveryReportSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #purchasePrintchecks': () => {
    if ($("#purchasePrintchecks").prop("checked") === true) {
      $(".purchasePrintSelect").prop('checked', true);
    } else {
      $(".purchasePrintSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #activitySeniorchecks': () => {
    if ($("#activitySeniorchecks").prop("checked") === true) {
      $(".activitySeniorSelect").prop('checked', true);
    } else {
      $(".activitySeniorSelect").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #accountantchecks': () => {
    if ($("#accountantchecks").prop("checked") === true) {
      $(".accountantSelect").prop('checked', true);
    } else {
      $(".accountantSelect").prop('checked', false);
    }
  },


  /**
   * TODO: Complete JS doc
   */
  'change .historySelect': () => {
    if ($(".historySelect").length === $(".historySelect:checked").length)
      $("#historychecks").prop('checked', true);
    else
      $("#historychecks").prop('checked', false);
  },
  /**
   * TODO: Complete JS doc
   */
  'change .reportSelect': () => {
    if ($(".reportSelect").length === $(".reportSelect:checked").length)
      $("#reportchecks").prop('checked', true);
    else
      $("#reportchecks").prop('checked', false);
  },
  /**
   * TODO: Complete JS doc
   */
  'change .reportOwnSelect': () => {
    if ($(".reportOwnSelect").length === $(".reportOwnSelect:checked").length)
      $("#reportOwnchecks").prop('checked', true);
    else
      $("#reportOwnchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .sdashboardSelect': () => {
    if ($(".sdashboardSelect").length === $(".sdashboardSelect:checked").length)
      $("#sdashboardchecks").prop('checked', true);
    else
      $("#sdashboardchecks").prop('checked', false);
  },

  /**
  * TODO:Comlete JS doc
  */
  'change .posSelect': () => {
    if ($(".posSelect").length === $(".posSelect:checked").length)
      $("#poschecks").prop('checked', true);
    else
      $("#poschecks").prop('checked', false);
  },

  /**
   * TODO: Complete JS doc
   */
  'change .adashboardSelect': () => {
    if ($(".adashboardSelect").length === $(".adashboardSelect:checked").length)
      $("#adashboardchecks").prop('checked', true);
    else
      $("#adashboardchecks").prop('checked', false);
  },

  /**
 * TODO: Complete JS doc
 */
  'change .superAdmindashboardSelect': () => {
    if ($(".superAdmindashboardSelect").length === $(".superAdmindashboardSelect:checked").length)
      $("#superAdmindashboardchecks").prop('checked', true);
    else
      $("#superAdmindashboardchecks").prop('checked', false);
  },

  /**
  * TODO:Comlete JS doc
  */
  'change .orderSelect': () => {
    if ($(".orderSelect").length === $(".orderSelect:checked").length)
      $("#orderchecks").prop('checked', true);
    else
      $("#orderchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .orderSeniorSelect': () => {
    if ($(".orderSeniorSelect").length === $(".orderSeniorSelect:checked").length)
      $("#orderSeniorchecks").prop('checked', true);
    else
      $("#orderSeniorchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .salesReturnSelect': () => {
    if ($(".salesReturnSelect").length === $(".salesReturnSelect:checked").length)
      $("#salesReturnchecks").prop('checked', true);
    else
      $("#salesReturnchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .stockTransferRequestSelect': () => {
    if ($(".stockTransferRequestSelect").length === $(".stockTransferRequestSelect:checked").length)
      $("#stockTransferRequestchecks").prop('checked', true);
    else
      $("#stockTransferRequestchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .deliverySelections1': () => {
    if ($(".deliverySelections1").length === $(".deliverySelections1:checked").length)
      $("#deliverycheck1").prop('checked', true);
    else
      $("#deliverycheck1").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .dispatchSelections1': () => {
    if ($(".dispatchSelections1").length === $(".dispatchSelections1:checked").length)
      $("#dispatchcheck1").prop('checked', true);
    else
      $("#dispatchcheck1").prop('checked', false);
  },
  /**
   * TODO: Complete JS doc
   */
  'change .dispatchRejectSelect': () => {
    if ($(".dispatchRejectSelect").length === $(".dispatchRejectSelect:checked").length)
      $("#dispatchRejectchecks").prop('checked', true);
    else
      $("#dispatchRejectchecks").prop('checked', false);
  },
  /**
 * TODO:Complete JS doc
 */
  'change .userSelect': () => {
    if ($(".userSelect").length === $(".userSelect:checked").length)
      $("#userschecks").prop('checked', true);
    else
      $("#userschecks").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .vanSaleUsersSelect': () => {
    if ($(".vanSaleUsersSelect").length === $(".vanSaleUsersSelect:checked").length)
      $("#vanSaleUserschecks").prop('checked', true);
    else
      $("#vanSaleUserschecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .roleSelect': () => {
    if ($(".roleSelect").length === $(".roleSelect:checked").length)
      $("#rolechecks").prop('checked', true);
    else
      $("#rolechecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .designationSelect': () => {
    if ($(".designationSelect").length === $(".designationSelect:checked").length)
      $("#designationchecks").prop('checked', true);
    else
      $("#designationchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .bpAdminSelect': () => {
    if ($(".bpAdminSelect").length === $(".bpAdminSelect:checked").length)
      $("#bpAdminchecks").prop('checked', true);
    else
      $("#bpAdminchecks").prop('checked', false);
  },

  'change .branchTransferSelect': () => {
    if ($(".branchTransferSelect").length === $(".branchTransferSelect:checked").length)
      $("#branchTransferchecks").prop('checked', true);
    else
      $("#branchTransferchecks").prop('checked', false);
  },

  'change .activitySelect': () => {
    if ($(".activitySelect").length === $(".activitySelect:checked").length)
      $("#activitychecks").prop('checked', true);
    else
      $("#activitychecks").prop('checked', false);
  },

  'change .branchTransferApproveSelect': () => {
    if ($(".branchTransferApproveSelect").length === $(".branchTransferApproveSelect:checked").length)
      $("#branchTransferApprovechecks").prop('checked', true);
    else
      $("#branchTransferApprovechecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .leadSelect': () => {
    if ($(".leadSelect").length === $(".leadSelect:checked").length)
      $("#leadchecks").prop('checked', true);
    else
      $("#leadchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .collectionDueTodaySelect': () => {
    if ($(".collectionDueTodaySelect").length === $(".collectionDueTodaySelect:checked").length)
      $("#collectionDueTodaychecks").prop('checked', true);
    else
      $("#collectionDueTodaychecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .creditInvoiceSelect': () => {
    if ($(".creditInvoiceSelect").length === $(".creditInvoiceSelect:checked").length)
      $("#creditInvoicechecks").prop('checked', true);
    else
      $("#creditInvoicechecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .creditNoteSelect': () => {
    if ($(".creditNoteSelect").length === $(".creditNoteSelect:checked").length)
      $("#creditNotechecks").prop('checked', true);
    else
      $("#creditNotechecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .arInvoicePaymentSelect': () => {
    if ($(".arInvoicePaymentSelect").length === $(".arInvoicePaymentSelect:checked").length)
      $("#arInvoicePaymentchecks").prop('checked', true);
    else
      $("#arInvoicePaymentchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .arInvoiceSeniorPaymentSelect': () => {
    if ($(".arInvoiceSeniorPaymentSelect").length === $(".arInvoiceSeniorPaymentSelect:checked").length)
      $("#arInvoiceSeniorPaymentchecks").prop('checked', true);
    else
      $("#arInvoiceSeniorPaymentchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .salesQuotationSelect': () => {
    if ($(".salesQuotationSelect").length === $(".salesQuotationSelect:checked").length)
      $("#salesQuotationchecks").prop('checked', true);
    else
      $("#salesQuotationchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .salesQuotationSeniorSelect': () => {
    if ($(".salesQuotationSeniorSelect").length === $(".salesQuotationSeniorSelect:checked").length)
      $("#salesQuotationSeniorchecks").prop('checked', true);
    else
      $("#salesQuotationSeniorchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .orderApproveSelect': () => {
    if ($(".orderApproveSelect").length === $(".orderApproveSelect:checked").length)
      $("#orderApprovechecks").prop('checked', true);
    else
      $("#orderApprovechecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .invoiceSelect': () => {
    if ($(".invoiceSelect").length === $(".invoiceSelect:checked").length)
      $("#invoicechecks").prop('checked', true);
    else
      $("#invoicechecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .deliveryBoySelect': () => {
    if ($(".deliveryBoySelect").length === $(".deliveryBoySelect:checked").length)
      $("#deliveryBoychecks").prop('checked', true);
    else
      $("#deliveryBoychecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .quotationApproveSelect': () => {
    if ($(".quotationApproveSelect").length === $(".quotationApproveSelect:checked").length)
      $("#quotationApprovechecks").prop('checked', true);
    else
      $("#quotationApprovechecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .salesReturnApproveSelect': () => {
    if ($(".salesReturnApproveSelect").length === $(".salesReturnApproveSelect:checked").length)
      $("#salesReturnApprovechecks").prop('checked', true);
    else
      $("#salesReturnApprovechecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .stockTransferApproveSelect': () => {
    if ($(".stockTransferApproveSelect").length === $(".stockTransferApproveSelect:checked").length)
      $("#stockTransferApprovechecks").prop('checked', true);
    else
      $("#stockTransferApprovechecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .creditNoteApproveSelect': () => {
    if ($(".creditNoteApproveSelect").length === $(".creditNoteApproveSelect:checked").length)
      $("#creditNoteApprovechecks").prop('checked', true);
    else
      $("#creditNoteApprovechecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .creditInvoiceApproveSelect': () => {
    if ($(".creditInvoiceApproveSelect").length === $(".creditInvoiceApproveSelect:checked").length)
      $("#creditInvoiceApprovechecks").prop('checked', true);
    else
      $("#creditInvoiceApprovechecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .pickListSelect': () => {
    if ($(".pickListSelect").length === $(".pickListSelect:checked").length)
      $("#pickListchecks").prop('checked', true);
    else
      $("#pickListchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .orderReportSelect': () => {
    if ($(".orderReportSelect").length === $(".orderReportSelect:checked").length)
      $("#orderReportchecks").prop('checked', true);
    else
      $("#orderReportchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .salesQuotationReportSelect': () => {
    if ($(".salesQuotationReportSelect").length === $(".salesQuotationReportSelect:checked").length)
      $("#salesQuotationReportchecks").prop('checked', true);
    else
      $("#salesQuotationReportchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .arInvoiceReportSelect': () => {
    if ($(".arInvoiceReportSelect").length === $(".arInvoiceReportSelect:checked").length)
      $("#arInvoiceReportchecks").prop('checked', true);
    else
      $("#arInvoiceReportchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .posReportSelect': () => {
    if ($(".posReportSelect").length === $(".posReportSelect:checked").length)
      $("#posReportchecks").prop('checked', true);
    else
      $("#posReportchecks").prop('checked', false);
  },
  /**
 * TODO:Comlete JS doc
 */
  'change .locationSelect': () => {
    if ($(".locationSelect").length === $(".locationSelect:checked").length)
      $("#locationchecks").prop('checked', true);
    else
      $("#locationchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .pendingArInvoiceSelect': () => {
    if ($(".pendingArInvoiceSelect").length === $(".pendingArInvoiceSelect:checked").length)
      $("#pendingArInvoicechecks").prop('checked', true);
    else
      $("#pendingArInvoicechecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .pendingPosInvoiceSelect': () => {
    if ($(".pendingPosInvoiceSelect").length === $(".pendingPosInvoiceSelect:checked").length)
      $("#pendingPosInvoicechecks").prop('checked', true);
    else
      $("#pendingPosInvoicechecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .attendanceSelect': () => {
    if ($(".attendanceSelect").length === $(".attendanceSelect:checked").length)
      $("#attendancechecks").prop('checked', true);
    else
      $("#attendancechecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .routeApproveSelect': () => {
    if ($(".routeApproveSelect").length === $(".routeApproveSelect:checked").length)
      $("#routeApprovechecks").prop('checked', true);
    else
      $("#routeApprovechecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .salesSummaryReportSelect': () => {
    if ($(".salesSummaryReportSelect").length === $(".salesSummaryReportSelect:checked").length)
      $("#salesSummaryReportchecks").prop('checked', true);
    else
      $("#salesSummaryReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .stockSummaryReportSelect': () => {
    if ($(".stockSummaryReportSelect").length === $(".stockSummaryReportSelect:checked").length)
      $("#stockSummaryReportchecks").prop('checked', true);
    else
      $("#stockSummaryReportchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .noSalesReportSelect': () => {
    if ($(".noSalesReportSelect").length === $(".noSalesReportSelect:checked").length)
      $("#noSalesReportchecks").prop('checked', true);
    else
      $("#noSalesReportchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .targetOutletReportSelect': () => {
    if ($(".targetOutletReportSelect").length === $(".targetOutletReportSelect:checked").length)
      $("#targetOutletReportchecks").prop('checked', true);
    else
      $("#targetOutletReportchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .callRateReportSelect': () => {
    if ($(".callRateReportSelect").length === $(".callRateReportSelect:checked").length)
      $("#callRateReportchecks").prop('checked', true);
    else
      $("#callRateReportchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .strikeRateReportSelect': () => {
    if ($(".strikeRateReportSelect").length === $(".strikeRateReportSelect:checked").length)
      $("#strikeRateReportchecks").prop('checked', true);
    else
      $("#strikeRateReportchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .priceUpdateSelect': () => {
    if ($(".priceUpdateSelect").length === $(".priceUpdateSelect:checked").length)
      $("#priceUpdatechecks").prop('checked', true);
    else
      $("#priceUpdatechecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .cxoDashboardSelect': () => {
    if ($(".cxoDashboardSelect").length === $(".cxoDashboardSelect:checked").length)
      $("#cxoDashboardchecks").prop('checked', true);
    else
      $("#cxoDashboardchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .itemWiseReportSelect': () => {
    if ($(".itemWiseReportSelect").length === $(".itemWiseReportSelect:checked").length)
      $("#itemWiseReportchecks").prop('checked', true);
    else
      $("#itemWiseReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .routeWiseReportSelect': () => {
    if ($(".routeWiseReportSelect").length === $(".routeWiseReportSelect:checked").length)
      $("#routeWiseReportchecks").prop('checked', true);
    else
      $("#routeWiseReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .numericalDistributonReportSelect': () => {
    if ($(".numericalDistributonReportSelect").length === $(".numericalDistributonReportSelect:checked").length)
      $("#numericalDistributonReportchecks").prop('checked', true);
    else
      $("#numericalDistributonReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .whsStockReportSelect': () => {
    if ($(".whsStockReportSelect").length === $(".whsStockReportSelect:checked").length)
      $("#whsStockReportchecks").prop('checked', true);
    else
      $("#whsStockReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .weightageDistributionReportSelect': () => {
    if ($(".weightageDistributionReportSelect").length === $(".weightageDistributionReportSelect:checked").length)
      $("#weightageDistributionReportchecks").prop('checked', true);
    else
      $("#weightageDistributionReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .coverageDistributionReportSelect': () => {
    if ($(".coverageDistributionReportSelect").length === $(".coverageDistributionReportSelect:checked").length)
      $("#coverageDistributionReportchecks").prop('checked', true);
    else
      $("#coverageDistributionReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .priceTypeEditSelect': () => {
    if ($(".priceTypeEditSelect").length === $(".priceTypeEditSelect:checked").length)
      $("#priceTypeEditchecks").prop('checked', true);
    else
      $("#priceTypeEditchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .expenseListSelect': () => {
    if ($(".expenseListSelect").length === $(".expenseListSelect:checked").length)
      $("#expenseListchecks").prop('checked', true);
    else
      $("#expenseListchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .vansaleReportSelect': () => {
    if ($(".vansaleReportSelect").length === $(".vansaleReportSelect:checked").length)
      $("#vansaleReportchecks").prop('checked', true);
    else
      $("#vansaleReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .skippedCustomerReportSelect': () => {
    if ($(".skippedCustomerReportSelect").length === $(".skippedCustomerReportSelect:checked").length)
      $("#skippedCustomerReportchecks").prop('checked', true);
    else
      $("#skippedCustomerReportchecks").prop('checked', false);
  },
  /**
* TODO:Comlete JS doc
*/
  'change .routeSelect': () => {
    if ($(".routeSelect").length === $(".routeSelect:checked").length)
      $("#routechecks").prop('checked', true);
    else
      $("#routechecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .masterDataSelect': () => {
    if ($(".masterDataSelect").length === $(".masterDataSelect:checked").length)
      $("#masterDatachecks").prop('checked', true);
    else
      $("#masterDatachecks").prop('checked', false);
  },


  /**
  * TODO:Comlete JS doc
  */
  'change .creditInvoiceReportSelect': () => {
    if ($(".creditInvoiceReportSelect").length === $(".creditInvoiceReportSelect:checked").length)
      $("#creditInvoiceReportchecks").prop('checked', true);
    else
      $("#creditInvoiceReportchecks").prop('checked', false);
  },
  /**
 * TODO:Comlete JS doc
 */
  'change .salesReturnReportSelect': () => {
    if ($(".salesReturnReportSelect").length === $(".salesReturnReportSelect:checked").length)
      $("#salesReturnReportchecks").prop('checked', true);
    else
      $("#salesReturnReportchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .creditNoteReportSelect': () => {
    if ($(".creditNoteReportSelect").length === $(".creditNoteReportSelect:checked").length)
      $("#creditNoteReportchecks").prop('checked', true);
    else
      $("#creditNoteReportchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .branchTransferReportSelect': () => {
    if ($(".branchTransferReportSelect").length === $(".branchTransferReportSelect:checked").length)
      $("#branchTransferReportchecks").prop('checked', true);
    else
      $("#branchTransferReportchecks").prop('checked', false);
  },
  /**
   * TODO:Comlete JS doc
   */
  'change .collectionReportSelect': () => {
    if ($(".collectionReportSelect").length === $(".collectionReportSelect:checked").length)
      $("#collectionReportchecks").prop('checked', true);
    else
      $("#collectionReportchecks").prop('checked', false);
  },
  /**
  * TODO:Comlete JS doc
  */
  'change .stockTransferReportSelect': () => {
    if ($(".stockTransferReportSelect").length === $(".stockTransferReportSelect:checked").length)
      $("#stockTransferReportchecks").prop('checked', true);
    else
      $("#stockTransferReportchecks").prop('checked', false);
  },
  /**
 * TODO:Comlete JS doc
 */
  'change .invoiceReportSelect': () => {
    if ($(".invoiceReportSelect").length === $(".invoiceReportSelect:checked").length)
      $("#invoiceReportchecks").prop('checked', true);
    else
      $("#invoiceReportchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .deliveryReportSelect': () => {
    if ($(".deliveryReportSelect").length === $(".deliveryReportSelect:checked").length)
      $("#deliveryReportchecks").prop('checked', true);
    else
      $("#deliveryReportchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .purchasePrintSelect': () => {
    if ($(".purchasePrintSelect").length === $(".purchasePrintSelect:checked").length)
      $("#purchasePrintchecks").prop('checked', true);
    else
      $("#purchasePrintchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .activitySeniorSelect': () => {
    if ($(".activitySeniorSelect").length === $(".activitySeniorSelect:checked").length)
      $("#activitySeniorchecks").prop('checked', true);
    else
      $("#activitySeniorchecks").prop('checked', false);
  },

  /**
* TODO:Comlete JS doc
*/
  'change .accountantSelect': () => {
    if ($(".accountantSelect").length === $(".accountantSelect:checked").length)
      $("#accountantchecks").prop('checked', true);
    else
      $("#accountantchecks").prop('checked', false);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', { isDeleted: false });
    $('form :input').val("");
  },

  /**
    * TODO: Complete JS doc
    * @param event
 */
  'click .ic-edit-button': (event) => {
    event.preventDefault();
    $("#ic-edit").modal();

    let _id = event.currentTarget.attributes.id.value;
    // let roleDetail= Meteor.roles.findOne({_id: _id});
    Meteor.call('role.roleName', _id, (err, res) => {
      let roleDetail = res;

      let roleDetailName = roleDetail.name;
      let roleDetailDescription = roleDetail.description;
      let roleDetailHomePage = roleDetail.homePage;
      let roleDetailPermissions = roleDetail.permissions;
      let historyView = roleDetailPermissions.includes("historyView");
      let reportView = roleDetailPermissions.includes("reportView");
      let reportOwnView = roleDetailPermissions.includes("reportOwnView");
      let userView = roleDetailPermissions.includes("userView");
      let userUpdate = roleDetailPermissions.includes("userUpdate");
      let userDelete = roleDetailPermissions.includes("userDelete");
      let userCreate = roleDetailPermissions.includes("userCreate");
      let vanSaleUserView = roleDetailPermissions.includes("vanSaleUserView");
      let vanSaleUserUpdate = roleDetailPermissions.includes("vanSaleUserUpdate");
      let vanSaleUserDelete = roleDetailPermissions.includes("vanSaleUserDelete");
      let vanSaleUserCreate = roleDetailPermissions.includes("vanSaleUserCreate");
      let roleView = roleDetailPermissions.includes("roleView");
      let roleCreate = roleDetailPermissions.includes("roleCreate");
      let roleUpdate = roleDetailPermissions.includes("roleUpdate");
      let roleDelete = roleDetailPermissions.includes("roleDelete");
      let designationView = roleDetailPermissions.includes("designationView");
      let designationCreate = roleDetailPermissions.includes("designationCreate");
      let designationUpdate = roleDetailPermissions.includes("designationUpdate");
      let designationDelete = roleDetailPermissions.includes("designationDelete");
      let branchTransferView = roleDetailPermissions.includes("branchTransferView");
      let branchTransferCreate = roleDetailPermissions.includes("branchTransferCreate");
      let branchTransferApproveView = roleDetailPermissions.includes("branchTransferApproveView");
      let activityView = roleDetailPermissions.includes("activityView");
      let activityCreate = roleDetailPermissions.includes("activityCreate");
      let leadView = roleDetailPermissions.includes("leadView");
      let leadCreate = roleDetailPermissions.includes("leadCreate");
      let leadUpdate = roleDetailPermissions.includes("leadUpdate");
      let leadDelete = roleDetailPermissions.includes("leadDelete");
      let salesDashboard = roleDetailPermissions.includes("salesDashboard");
      let salepos = roleDetailPermissions.includes("salepos");
      let dispatchRejectView = roleDetailPermissions.includes("dispatchRejectView");
      let adminDashboard = roleDetailPermissions.includes("adminDashboard");
      let superAdminDashboard = roleDetailPermissions.includes("superAdminDashboard");
      let orderView = roleDetailPermissions.includes("orderView");
      let orderCreate = roleDetailPermissions.includes("orderCreate");
      let orderSeniorView = roleDetailPermissions.includes("orderSeniorView");
      let orderSeniorCreate = roleDetailPermissions.includes("orderSeniorCreate");
      let salesReturnView = roleDetailPermissions.includes("salesReturnView");
      let salesReturnCreate = roleDetailPermissions.includes("salesReturnCreate");
      let stockTransferRequestView = roleDetailPermissions.includes("stockTransferRequestView");
      let stockTransferRequestCreate = roleDetailPermissions.includes("stockTransferRequestCreate");
      let deliveryView = roleDetailPermissions.includes("deliveryView");
      let deliveryUpdate = roleDetailPermissions.includes("deliveryUpdate");
      let dispatchView = roleDetailPermissions.includes("dispatchView");
      let dispatchUpdate = roleDetailPermissions.includes("dispatchUpdate");
      let collectionDueTodayView = roleDetailPermissions.includes("collectionDueToday");
      let collectionDueTodayCreate = roleDetailPermissions.includes("createCollectionDueToday");
      let creditInvoiceView = roleDetailPermissions.includes("creditInvoiceView");
      let creditInvoiceCreate = roleDetailPermissions.includes("creditInvoiceCreate");
      let creditNoteView = roleDetailPermissions.includes("creditNoteView");
      let creditNoteCreate = roleDetailPermissions.includes("creditNoteCreate");
      let arInvoicePaymentView = roleDetailPermissions.includes("arInvoicePaymentView");
      let arInvoicePaymentCreate = roleDetailPermissions.includes("arInvoicePaymentCreate");
      let arInvoiceSeniorPaymentView = roleDetailPermissions.includes("arInvoiceSeniorPaymentView");
      let arInvoiceSeniorPaymentCreate = roleDetailPermissions.includes("arInvoiceSeniorPaymentCreate");
      let salesQuotationView = roleDetailPermissions.includes("salesQuotationView");
      let salesQuotationCreate = roleDetailPermissions.includes("salesQuotationCreate");
      let salesQuotationSeniorView = roleDetailPermissions.includes("salesQuotationSeniorView");
      let salesQuotationSeniorCreate = roleDetailPermissions.includes("salesQuotationSeniorCreate");
      let invoiceView = roleDetailPermissions.includes("invoiceView");
      let deliveryBoyView = roleDetailPermissions.includes("deliveryBoyView");
      let orderApproveView = roleDetailPermissions.includes("orderApproveView");
      let quotationApproveView = roleDetailPermissions.includes("quotationApproveView");
      let salesReturnApproveView = roleDetailPermissions.includes("salesReturnApproveView");
      let stockTransferApproveView = roleDetailPermissions.includes("stockTransferApproveView");
      let creditNoteApproveView = roleDetailPermissions.includes("creditNoteApproveView");
      let creditInvoiceApproveView = roleDetailPermissions.includes("creditInvoiceApproveView");
      let pickListView = roleDetailPermissions.includes("pickListView");
      let orderReportView = roleDetailPermissions.includes("orderReportView");
      let salesQuotationReportView = roleDetailPermissions.includes("salesQuotationReportView");
      let arInvoiceReportView = roleDetailPermissions.includes("arInvoiceReportView");
      let posReportView = roleDetailPermissions.includes("posReportView");
      let locationView = roleDetailPermissions.includes("locationView");
      let pendingArInvoiceView = roleDetailPermissions.includes("pendingArInvoiceView");
      let pendingPosInvoiceView = roleDetailPermissions.includes("pendingPosInvoiceView");
      let attendanceView = roleDetailPermissions.includes("attendanceView");
      let creditInvoiceReportView = roleDetailPermissions.includes("creditInvoiceReportView");
      let salesReturnReportView = roleDetailPermissions.includes("salesReturnReportView");
      let creditNoteReportView = roleDetailPermissions.includes("creditNoteReportView");
      let branchTransferReportView = roleDetailPermissions.includes("branchTransferReportView");
      let collectionReportView = roleDetailPermissions.includes("collectionReportView");
      let stockTransferReportView = roleDetailPermissions.includes("stockTransferReportView");
      let invoiceReportView = roleDetailPermissions.includes("invoiceReportView");
      let deliveryReportView = roleDetailPermissions.includes("deliveryReportView");
      let purchasePrintView = roleDetailPermissions.includes("purchasePrintView");
      let activitySeniorView = roleDetailPermissions.includes("activitySeniorView");
      let accountantView = roleDetailPermissions.includes("accountantView");
      let bpAdminView = roleDetailPermissions.includes("bpAdminView");
      let routeView = roleDetailPermissions.includes("routeView");
      let routeUpdate = roleDetailPermissions.includes("routeUpdate");
      let routeDelete = roleDetailPermissions.includes("routeDelete");
      let routeCreate = roleDetailPermissions.includes("routeCreate");
      let routeApproveView = roleDetailPermissions.includes("routeApproveView");
      let salesSummaryReportView = roleDetailPermissions.includes("salesSummaryReportView");
      let stockSummaryReportView = roleDetailPermissions.includes("stockSummaryReportView");
      let skippedCustomerReportView = roleDetailPermissions.includes("skippedCustomerReportView");
      let noSalesReportView = roleDetailPermissions.includes("noSalesReportView");
      let targetOutletReportView = roleDetailPermissions.includes("targetOutletReportView");
      let callRateReportView = roleDetailPermissions.includes("callRateReportView");
      let strikeRateReportView = roleDetailPermissions.includes("strikeRateReportView");
      let priceUpdateView = roleDetailPermissions.includes("priceUpdateView");
      let vansaleReportView = roleDetailPermissions.includes("vansaleReportView");
      let cxoDashboardView = roleDetailPermissions.includes("cxoDashboardView");
      let itemWiseReportView = roleDetailPermissions.includes("itemWiseReportView");
      let routeWiseReportView = roleDetailPermissions.includes("routeWiseReportView");
      let numericalDistributonReportView = roleDetailPermissions.includes("numericalDistributonReportView");
      let whsStockReportView = roleDetailPermissions.includes("whsStockReportView");
      let weightageDistributionReportView = roleDetailPermissions.includes("weightageDistributionReportView");
      let coverageDistributionReportView = roleDetailPermissions.includes("coverageDistributionReportView");
      let priceTypeEditView = roleDetailPermissions.includes("priceTypeEditView");
      let expenseListView = roleDetailPermissions.includes("expenseListView");

      let masterDataView = roleDetailPermissions.includes("masterDataView");
      let masterDataUpdate = roleDetailPermissions.includes("masterDataUpdate");
      let masterDataDelete = roleDetailPermissions.includes("masterDataDelete");
      let masterDataCreate = roleDetailPermissions.includes("masterDataCreate");
      $("#roleDetailName").val(roleDetailName);
      $("#roleDetailId").val(_id);
      $("#roleDetailDescription").val(roleDetailDescription);
      $("#homeURLUpdate").val(roleDetailHomePage).trigger('change');

      if (historyView === true) { $("#historycheckView").prop('checked', true); }
      else { $("#historycheckView").prop('checked', false); };

      if (reportView === true) { $("#reportcheckView").prop('checked', true); }
      else { $("#reportcheckView").prop('checked', false); };

      if (reportOwnView === true) { $("#reportOwncheckView").prop('checked', true); }
      else { $("#reportOwncheckView").prop('checked', false); };

      if (userView === true) { $("#userscheckView").prop('checked', true); }
      else { $("#userscheckView").prop('checked', false) };
      if (userUpdate === true) { $("#userscheckUpdate").prop('checked', true); }
      else { $("#userscheckUpdate").prop('checked', false); };

      if (userDelete === true) { $("#userscheckDelete").prop('checked', true); }
      else { $("#userscheckDelete").prop('checked', false); };
      if (userCreate === true) { $("#userscheckCreate").prop('checked', true); }
      else { $("#userscheckCreate").prop('checked', false); };

      if (vanSaleUserView === true) { $("#vanSaleUserscheckView").prop('checked', true); }
      else { $("#vanSaleUserscheckView").prop('checked', false) };
      if (vanSaleUserUpdate === true) { $("#vanSaleUserscheckUpdate").prop('checked', true); }
      else { $("#vanSaleUserscheckUpdate").prop('checked', false); };

      if (vanSaleUserDelete === true) { $("#vanSaleUserscheckDelete").prop('checked', true); }
      else { $("#vanSaleUserscheckDelete").prop('checked', false); };
      if (vanSaleUserCreate === true) { $("#vanSaleUserscheckCreate").prop('checked', true); }
      else { $("#vanSaleUserscheckCreate").prop('checked', false); };

      if (roleView === true) { $("#rolecheckView").prop('checked', true); }
      else { $("#rolecheckView").prop('checked', false); };
      if (roleCreate === true) { $("#rolecheckCreate").prop('checked', true); }
      else { $("#rolecheckCreate").prop('checked', false); };
      if (roleUpdate === true) { $("#rolecheckUpdate").prop('checked', true); }
      else { $("#rolecheckUpdate").prop('checked', false); };
      if (roleDelete === true) { $("#rolecheckDelete").prop('checked', true); }
      else { $("#rolecheckDelete").prop('checked', false); };

      if (designationCreate === true) { $("#designationcheckCreate").prop('checked', true); }
      else { $("#designationcheckCreate").prop('checked', false); };
      if (designationView === true) { $("#designationcheckView").prop('checked', true); }
      else { $("#designationcheckView").prop('checked', false); };
      if (designationUpdate === true) { $("#designationcheckUpdate").prop('checked', true); }
      else { $("#designationcheckUpdate").prop('checked', false); };
      if (designationDelete === true) { $("#designationcheckDelete").prop('checked', true); }
      else { $("#designationcheckDelete").prop('checked', false); };

      if (branchTransferCreate === true) { $("#branchTransfercheckCreate").prop('checked', true); }
      else { $("#branchTransfercheckCreate").prop('checked', false); };
      if (branchTransferView === true) { $("#branchTransfercheckView").prop('checked', true); }
      else { $("#branchTransfercheckView").prop('checked', false); };



      if (activityCreate === true) { $("#activitycheckCreate").prop('checked', true); }
      else { $("#activitycheckCreate").prop('checked', false); };
      if (activityView === true) { $("#activitycheckView").prop('checked', true); }
      else { $("#activitycheckView").prop('checked', false); };

      if (branchTransferApproveView === true) { $("#branchTransfercheckApproveView").prop('checked', true); }
      else { $("#branchTransfercheckApproveView").prop('checked', false); };

      if (leadCreate === true) { $("#leadcheckCreate").prop('checked', true); }
      else { $("#leadcheckCreate").prop('checked', false); };
      if (leadView === true) { $("#leadcheckView").prop('checked', true); }
      else { $("#leadcheckView").prop('checked', false); };
      if (leadUpdate === true) { $("#leadcheckUpdate").prop('checked', true); }
      else { $("#leadcheckUpdate").prop('checked', false); };
      if (leadDelete === true) { $("#leadcheckDelete").prop('checked', true); }
      else { $("#leadcheckDelete").prop('checked', false); };

      if (orderView === true) { $("#ordercheckView").prop('checked', true); }
      else { $("#ordercheckView").prop('checked', false); };
      if (orderCreate === true) { $("#ordercheckCreate").prop('checked', true); }
      else { $("#ordercheckCreate").prop('checked', false); };

      if (orderSeniorView === true) { $("#orderSeniorcheckView").prop('checked', true); }
      else { $("#orderSeniorcheckView").prop('checked', false); };
      if (orderSeniorCreate === true) { $("#orderSeniorcheckCreate").prop('checked', true); }
      else { $("#orderSeniorcheckCreate").prop('checked', false); };

      if (salesReturnView === true) { $("#salesReturncheckView").prop('checked', true); }
      else { $("#salesReturncheckView").prop('checked', false); };
      if (salesReturnCreate === true) { $("#salesReturncheckCreate").prop('checked', true); }
      else { $("#salesReturncheckCreate").prop('checked', false); };

      if (stockTransferRequestView === true) { $("#stockTransferRequestcheckView").prop('checked', true); }
      else { $("#stockTransferRequestcheckView").prop('checked', false); };
      if (stockTransferRequestCreate === true) { $("#stockTransferRequestcheckCreate").prop('checked', true); }
      else { $("#stockTransferRequestcheckCreate").prop('checked', false); };

      if (salesDashboard === true) { $("#sdashboardView").prop('checked', true); }
      else { $("#sdashboardView").prop('checked', false); };

      if (salepos === true) { $("#posView").prop('checked', true); }
      else { $("#posView").prop('checked', false); };



      if (dispatchRejectView === true) { $("#dispatchRejectView").prop('checked', true); }
      else { $("#dispatchRejectView").prop('checked', false); };

      if (deliveryView === true) { $("#deliverycheckView").prop('checked', true); }
      else { $("#deliverycheckView").prop('checked', false); };
      if (deliveryUpdate === true) { $("#deliverycheckUpdate").prop('checked', true); }
      else { $("#deliverycheckUpdate").prop('checked', false); };

      if (dispatchView === true) { $("#dispatchcheckView").prop('checked', true); }
      else { $("#dispatchcheckView").prop('checked', false); };
      if (dispatchUpdate === true) { $("#dispatchcheckUpdate").prop('checked', true); }
      else { $("#dispatchcheckUpdate").prop('checked', false); };

      if (adminDashboard === true) { $("#adashboardView").prop('checked', true); }
      else { $("#adashboardView").prop('checked', false); };

      if (superAdminDashboard === true) { $("#superAdmindashboardView").prop('checked', true); }
      else { $("#superAdmindashboardView").prop('checked', false); };

      if (collectionDueTodayCreate === true) { $("#collectionDueTodayCreate").prop('checked', true); }
      else { $("#collectionDueTodayCreate").prop('checked', false); };
      if (collectionDueTodayView === true) { $("#collectionDueTodayView").prop('checked', true); }
      else { $("#collectionDueTodayView").prop('checked', false); };

      if (creditInvoiceCreate === true) { $("#creditInvoiceCreate").prop('checked', true); }
      else { $("#creditInvoiceCreate").prop('checked', false); };
      if (creditInvoiceView === true) { $("#creditInvoiceView").prop('checked', true); }
      else { $("#creditInvoiceView").prop('checked', false); };

      if (creditNoteCreate === true) { $("#creditNoteCreate").prop('checked', true); }
      else { $("#creditNoteCreate").prop('checked', false); };
      if (creditNoteView === true) { $("#creditNoteView").prop('checked', true); }
      else { $("#creditNoteView").prop('checked', false); };

      if (arInvoicePaymentCreate === true) { $("#arInvoicePaymentCreate").prop('checked', true); }
      else { $("#arInvoicePaymentCreate").prop('checked', false); };
      if (arInvoicePaymentView === true) { $("#arInvoicePaymentView").prop('checked', true); }
      else { $("#arInvoicePaymentView").prop('checked', false); };

      if (arInvoiceSeniorPaymentCreate === true) { $("#arInvoiceSeniorPaymentCreate").prop('checked', true); }
      else { $("#arInvoiceSeniorPaymentCreate").prop('checked', false); };
      if (arInvoiceSeniorPaymentView === true) { $("#arInvoiceSeniorPaymentView").prop('checked', true); }
      else { $("#arInvoiceSeniorPaymentView").prop('checked', false); };

      if (salesQuotationCreate === true) { $("#salesQuotationCreate").prop('checked', true); }
      else { $("#salesQuotationCreate").prop('checked', false); };
      if (salesQuotationView === true) { $("#salesQuotationView").prop('checked', true); }
      else { $("#salesQuotationView").prop('checked', false); };

      if (salesQuotationSeniorCreate === true) { $("#salesQuotationSeniorCreate").prop('checked', true); }
      else { $("#salesQuotationSeniorCreate").prop('checked', false); };
      if (salesQuotationSeniorView === true) { $("#salesQuotationSeniorView").prop('checked', true); }
      else { $("#salesQuotationSeniorView").prop('checked', false); };

      if (invoiceView === true) { $("#invoiceView").prop('checked', true); }
      else { $("#invoiceView").prop('checked', false); };

      if (deliveryBoyView === true) { $("#deliveryBoyView").prop('checked', true); }
      else { $("#deliveryBoyView").prop('checked', false); };

      if (orderApproveView === true) { $("#orderApproveView").prop('checked', true); }
      else { $("#orderApproveView").prop('checked', false); };

      if (quotationApproveView === true) { $("#quotationApproveView").prop('checked', true); }
      else { $("#quotationApproveView").prop('checked', false); };

      if (salesReturnApproveView === true) { $("#salesReturnApproveView").prop('checked', true); }
      else { $("#salesReturnApproveView").prop('checked', false); };

      if (stockTransferApproveView === true) { $("#stockTransferApproveView").prop('checked', true); }
      else { $("#stockTransferApproveView").prop('checked', false); };

      if (creditNoteApproveView === true) { $("#creditNoteApproveView").prop('checked', true); }
      else { $("#creditNoteApproveView").prop('checked', false); };

      if (creditInvoiceApproveView === true) { $("#creditInvoiceApproveView").prop('checked', true); }
      else { $("#creditInvoiceApproveView").prop('checked', false); };

      if (pickListView === true) { $("#pickListView").prop('checked', true); }
      else { $("#pickListView").prop('checked', false); };

      if (orderReportView === true) { $("#orderReportView").prop('checked', true); }
      else { $("#orderReportView").prop('checked', false); };

      if (salesQuotationReportView === true) { $("#salesQuotationReportView").prop('checked', true); }
      else { $("#salesQuotationReportView").prop('checked', false); };

      if (arInvoiceReportView === true) { $("#arInvoiceReportView").prop('checked', true); }
      else { $("#arInvoiceReportView").prop('checked', false); };

      if (posReportView === true) { $("#posReportView").prop('checked', true); }
      else { $("#posReportView").prop('checked', false); };

      if (locationView === true) { $("#locationView").prop('checked', true); }
      else { $("#locationView").prop('checked', false); };

      if (pendingArInvoiceView === true) { $("#pendingArInvoiceView").prop('checked', true); }
      else { $("#pendingArInvoiceView").prop('checked', false); };


      if (pendingPosInvoiceView === true) { $("#pendingPosInvoiceView").prop('checked', true); }
      else { $("#pendingPosInvoiceView").prop('checked', false); };


      if (attendanceView === true) { $("#attendanceView").prop('checked', true); }
      else { $("#attendanceView").prop('checked', false); };

      if (creditInvoiceReportView === true) { $("#creditInvoiceReportView").prop('checked', true); }
      else { $("#creditInvoiceReportView").prop('checked', false); };

      if (salesReturnReportView === true) { $("#salesReturnReportView").prop('checked', true); }
      else { $("#salesReturnReportView").prop('checked', false); };

      if (creditNoteReportView === true) { $("#creditNoteReportView").prop('checked', true); }
      else { $("#creditNoteReportView").prop('checked', false); };

      if (branchTransferReportView === true) { $("#branchTransferReportView").prop('checked', true); }
      else { $("#branchTransferReportView").prop('checked', false); };

      if (collectionReportView === true) { $("#collectionReportView").prop('checked', true); }
      else { $("#collectionReportView").prop('checked', false); };

      if (stockTransferReportView === true) { $("#stockTransferReportView").prop('checked', true); }
      else { $("#stockTransferReportView").prop('checked', false); };

      if (invoiceReportView === true) { $("#invoiceReportView").prop('checked', true); }
      else { $("#invoiceReportView").prop('checked', false); };
      if (deliveryReportView === true) { $("#deliveryReportView").prop('checked', true); }
      else { $("#deliveryReportView").prop('checked', false); };

      if (purchasePrintView === true) { $("#purchasePrintView").prop('checked', true); }
      else { $("#purchasePrintView").prop('checked', false); };

      if (activitySeniorView === true) { $("#activitySeniorView").prop('checked', true); }
      else { $("#activitySeniorView").prop('checked', false); };

      if (accountantView === true) { $("#accountantView").prop('checked', true); }
      else { $("#accountantView").prop('checked', false); };
      if (bpAdminView === true) { $("#bpAdminView").prop('checked', true); }
      else { $("#bpAdminView").prop('checked', false); };


      if (routeView === true) { $("#routecheckView").prop('checked', true); }
      else { $("#routecheckView").prop('checked', false) };
      if (routeUpdate === true) { $("#routecheckUpdate").prop('checked', true); }
      else { $("#routecheckUpdate").prop('checked', false); };

      if (routeDelete === true) { $("#routecheckDelete").prop('checked', true); }
      else { $("#routecheckDelete").prop('checked', false); };
      if (routeCreate === true) { $("#routecheckCreate").prop('checked', true); }
      else { $("#routecheckCreate").prop('checked', false); };

      if (masterDataView === true) { $("#masterDatacheckView").prop('checked', true); }
      else { $("#masterDatacheckView").prop('checked', false) };
      if (masterDataUpdate === true) { $("#masterDatacheckUpdate").prop('checked', true); }
      else { $("#masterDatacheckUpdate").prop('checked', false); };

      if (masterDataDelete === true) { $("#masterDatacheckDelete").prop('checked', true); }
      else { $("#masterDatacheckDelete").prop('checked', false); };
      if (masterDataCreate === true) { $("#masterDatacheckCreate").prop('checked', true); }
      else { $("#masterDatacheckCreate").prop('checked', false); };

      if (routeApproveView === true) { $("#routeApproveView").prop('checked', true); }
      else { $("#routeApproveView").prop('checked', false); };

      if (salesSummaryReportView === true) { $("#salesSummaryReportView").prop('checked', true); }
      else { $("#salesSummaryReportView").prop('checked', false); };

      if (stockSummaryReportView === true) { $("#stockSummaryReportView").prop('checked', true); }
      else { $("#stockSummaryReportView").prop('checked', false); };

      if (skippedCustomerReportView === true) { $("#skippedCustomerReportView").prop('checked', true); }
      else { $("#skippedCustomerReportView").prop('checked', false); };

      if (noSalesReportView === true) { $("#noSalesReportView").prop('checked', true); }
      else { $("#noSalesReportView").prop('checked', false); };

      if (targetOutletReportView === true) { $("#targetOutletReportView").prop('checked', true); }
      else { $("#targetOutletReportView").prop('checked', false); };

      if (callRateReportView === true) { $("#callRateReportView").prop('checked', true); }
      else { $("#callRateReportView").prop('checked', false); };

      if (strikeRateReportView === true) { $("#strikeRateReportView").prop('checked', true); }
      else { $("#strikeRateReportView").prop('checked', false); };

      if (priceUpdateView === true) { $("#priceUpdateView").prop('checked', true); }
      else { $("#priceUpdateView").prop('checked', false); };

      if (vansaleReportView === true) { $("#vansaleReportView").prop('checked', true); }
      else { $("#vansaleReportView").prop('checked', false); };

      if (cxoDashboardView === true) { $("#cxoDashboardView").prop('checked', true); }
      else { $("#cxoDashboardView").prop('checked', false); };

      if (itemWiseReportView === true) { $("#itemWiseReportView").prop('checked', true); }
      else { $("#itemWiseReportView").prop('checked', false); };

      if (routeWiseReportView === true) { $("#routeWiseReportView").prop('checked', true); }
      else { $("#routeWiseReportView").prop('checked', false); };

      if (numericalDistributonReportView === true) { $("#numericalDistributonReportView").prop('checked', true); }
      else { $("#numericalDistributonReportView").prop('checked', false); };

      if (whsStockReportView === true) { $("#whsStockReportView").prop('checked', true); }
      else { $("#whsStockReportView").prop('checked', false); };

      if (weightageDistributionReportView === true) { $("#weightageDistributionReportView").prop('checked', true); }
      else { $("#weightageDistributionReportView").prop('checked', false); };

      if (coverageDistributionReportView === true) { $("#coverageDistributionReportView").prop('checked', true); }
      else { $("#coverageDistributionReportView").prop('checked', false); };

      if (priceTypeEditView === true) { $("#priceTypeEditView").prop('checked', true); }
      else { $("#priceTypeEditView").prop('checked', false); };

      if (expenseListView === true) { $("#expenseListView").prop('checked', true); }
      else { $("#expenseListView").prop('checked', false); };

      if ($(".historySelect").length === $(".historySelect:checked").length)
        $("#historychecks").prop('checked', true);
      else
        $("#historychecks").prop('checked', false);

      if ($(".reportSelect").length === $(".reportSelect:checked").length)
        $("#reportchecks").prop('checked', true);
      else
        $("#reportchecks").prop('checked', false);

      if ($(".reportOwnSelect").length === $(".reportOwnSelect:checked").length)
        $("#reportOwnchecks").prop('checked', true);
      else
        $("#reportOwnchecks").prop('checked', false);

      if ($(".designationSelect").length === $(".designationSelect:checked").length)
        $("#designationchecks").prop('checked', true);
      else
        $("#designationchecks").prop('checked', false);

      if ($(".branchTransferSelect").length === $(".branchTransferSelect:checked").length)
        $("#branchTransferchecks").prop('checked', true);
      else
        $("#branchTransferchecks").prop('checked', false);

      if ($(".activitySelect").length === $(".activitySelect:checked").length)
        $("#activitychecks").prop('checked', true);
      else
        $("#activitychecks").prop('checked', false);

      if ($(".branchTransferApproveSelect").length === $(".branchTransferApproveSelect:checked").length)
        $("#branchTransferApprovechecks").prop('checked', true);
      else
        $("#branchTransferApprovechecks").prop('checked', false);

      if ($(".leadSelect").length === $(".leadSelect:checked").length)
        $("#leadchecks").prop('checked', true);
      else
        $("#leadchecks").prop('checked', false);

      if ($(".userSelect").length === $(".userSelect:checked").length)
        $("#userschecks").prop('checked', true);
      else
        $("#userschecks").prop('checked', false);

      if ($(".vanSaleUsersSelect").length === $(".vanSaleUsersSelect:checked").length)
        $("#vanSaleUserschecks").prop('checked', true);
      else
        $("#vanSaleUserschecks").prop('checked', false);

      if ($(".routeSelect").length === $(".routeSelect:checked").length)
        $("#routechecks").prop('checked', true);
      else
        $("#routechecks").prop('checked', false);

      if ($(".masterDataSelect").length === $(".masterDataSelect:checked").length)
        $("#masterDatachecks").prop('checked', true);
      else
        $("#masterDatachecks").prop('checked', false);


      if ($(".roleSelect").length === $(".roleSelect:checked").length)
        $("#rolechecks").prop('checked', true);
      else
        $("#rolechecks").prop('checked', false);
      if ($(".sdashboardSelect").length === $(".sdashboardSelect:checked").length)
        $("#sdashboardchecks").prop('checked', true);
      else
        $("#sdashboardchecks").prop('checked', false);

      if ($(".posSelect").length === $(".posSelect:checked").length)
        $("#poschecks").prop('checked', true);
      else
        $("#poschecks").prop('checked', false);


      if ($(".adashboardSelect").length === $(".adashboardSelect:checked").length)
        $("#adashboardchecks").prop('checked', true);
      else
        $("#adashboardchecks").prop('checked', false);

      if ($(".superAdmindashboardSelect").length === $(".superAdmindashboardSelect:checked").length)
        $("#superAdmindashboardchecks").prop('checked', true);
      else
        $("#superAdmindashboardchecks").prop('checked', false);

      if ($(".orderSelect").length === $(".orderSelect:checked").length)
        $("#orderchecks").prop('checked', true);
      else
        $("#orderchecks").prop('checked', false);

      if ($(".orderSeniorSelect").length === $(".orderSeniorSelect:checked").length)
        $("#orderSeniorchecks").prop('checked', true);
      else
        $("#orderSeniorchecks").prop('checked', false);

      if ($(".salesReturnSelect").length === $(".salesReturnSelect:checked").length)
        $("#salesReturnchecks").prop('checked', true);
      else
        $("#salesReturnchecks").prop('checked', false);

      if ($(".stockTransferRequestSelect").length === $(".stockTransferRequestSelect:checked").length)
        $("#stockTransferRequestchecks").prop('checked', true);
      else
        $("#stockTransferRequestchecks").prop('checked', false);

      if ($(".deliverySelections1").length === $(".deliverySelections1:checked").length)
        $("#deliverycheck1").prop('checked', true);
      else
        $("#deliverycheck1").prop('checked', false);

      if ($(".dispatchSelections1").length === $(".dispatchSelections1:checked").length)
        $("#dispatchcheck1").prop('checked', true);
      else
        $("#dispatchcheck1").prop('checked', false);

      if ($(".dispatchRejectSelect").length === $(".dispatchRejectSelect:checked").length)
        $("#dispatchRejectchecks").prop('checked', true);
      else
        $("#dispatchRejectchecks").prop('checked', false);

      if ($(".collectionDueTodaySelect").length === $(".collectionDueTodaySelect:checked").length)
        $("#collectionDueTodaychecks").prop('checked', true);
      else $("#collectionDueTodaychecks").prop('checked', false);

      if ($(".creditInvoiceSelect").length === $(".creditInvoiceSelect:checked").length)
        $("#creditInvoicechecks").prop('checked', true);
      else $("#creditInvoicechecks").prop('checked', false);

      if ($(".creditNoteSelect").length === $(".creditNoteSelect:checked").length)
        $("#creditNotechecks").prop('checked', true);
      else $("#creditNotechecks").prop('checked', false);

      if ($(".arInvoicePaymentSelect").length === $(".arInvoicePaymentSelect:checked").length)
        $("#arInvoicePaymentchecks").prop('checked', true);
      else $("#arInvoicePaymentchecks").prop('checked', false);

      if ($(".arInvoiceSeniorPaymentSelect").length === $(".arInvoiceSeniorPaymentSelect:checked").length)
        $("#arInvoiceSeniorPaymentchecks").prop('checked', true);
      else $("#arInvoiceSeniorPaymentchecks").prop('checked', false);

      if ($(".salesQuotationSelect").length === $(".salesQuotationSelect:checked").length)
        $("#salesQuotationchecks").prop('checked', true);
      else $("#salesQuotationchecks").prop('checked', false);

      if ($(".salesQuotationSeniorSelect").length === $(".salesQuotationSeniorSelect:checked").length)
        $("#salesQuotationSeniorchecks").prop('checked', true);
      else $("#salesQuotationSeniorchecks").prop('checked', false);

      if ($(".invoiceSelect").length === $(".invoiceSelect:checked").length)
        $("#invoicechecks").prop('checked', true);
      else $("#invoicechecks").prop('checked', false);

      if ($(".deliveryBoySelect").length === $(".deliveryBoySelect:checked").length)
        $("#deliveryBoychecks").prop('checked', true);
      else $("#deliveryBoychecks").prop('checked', false);


      if ($(".orderApproveSelect").length === $(".orderApproveSelect:checked").length)
        $("#orderApprovechecks").prop('checked', true);
      else $("#orderApprovechecks").prop('checked', false);

      if ($(".quotationApproveSelect").length === $(".quotationApproveSelect:checked").length)
        $("#quotationApprovechecks").prop('checked', true);
      else $("#quotationApprovechecks").prop('checked', false);

      if ($(".salesReturnApproveSelect").length === $(".salesReturnApproveSelect:checked").length)
        $("#salesReturnApprovechecks").prop('checked', true);
      else $("#salesReturnApprovechecks").prop('checked', false);

      if ($(".stockTransferApproveSelect").length === $(".stockTransferApproveSelect:checked").length)
        $("#stockTransferApprovechecks").prop('checked', true);
      else $("#stockTransferApprovechecks").prop('checked', false);

      if ($(".creditNoteApproveSelect").length === $(".creditNoteApproveSelect:checked").length)
        $("#creditNoteApprovechecks").prop('checked', true);
      else $("#creditNoteApprovechecks").prop('checked', false);

      if ($(".creditInvoiceApproveSelect").length === $(".creditInvoiceApproveSelect:checked").length)
        $("#creditInvoiceApprovechecks").prop('checked', true);
      else $("#creditInvoiceApprovechecks").prop('checked', false);

      if ($(".pickListSelect").length === $(".pickListSelect:checked").length)
        $("#pickListchecks").prop('checked', true);
      else $("#pickListchecks").prop('checked', false);

      if ($(".orderReportSelect").length === $(".orderReportSelect:checked").length)
        $("#orderReportchecks").prop('checked', true);
      else $("#orderReportchecks").prop('checked', false);

      if ($(".salesQuotationReportSelect").length === $(".salesQuotationReportSelect:checked").length)
        $("#salesQuotationReportchecks").prop('checked', true);
      else $("#salesQuotationReportchecks").prop('checked', false);

      if ($(".arInvoiceReportSelect").length === $(".arInvoiceReportSelect:checked").length)
        $("#arInvoiceReportchecks").prop('checked', true);
      else $("#arInvoiceReportchecks").prop('checked', false);

      if ($(".posReportSelect").length === $(".posReportSelect:checked").length)
        $("#posReportchecks").prop('checked', true);
      else $("#posReportchecks").prop('checked', false);

      if ($(".locationSelect").length === $(".locationSelect:checked").length)
        $("#locationchecks").prop('checked', true);
      else $("#locationchecks").prop('checked', false);

      if ($(".pendingArInvoiceSelect").length === $(".pendingArInvoiceSelect:checked").length)
        $("#pendingArInvoicechecks").prop('checked', true);
      else $("#pendingArInvoicechecks").prop('checked', false);

      if ($(".pendingPosInvoiceSelect").length === $(".pendingPosInvoiceSelect:checked").length)
        $("#pendingPosInvoicechecks").prop('checked', true);
      else $("#pendingPosInvoicechecks").prop('checked', false);


      if ($(".attendanceSelect").length === $(".attendanceSelect:checked").length)
        $("#attendancechecks").prop('checked', true);
      else $("#attendancechecks").prop('checked', false);

      if ($(".routeApproveSelect").length === $(".routeApproveSelect:checked").length)
        $("#routeApprovechecks").prop('checked', true);
      else $("#routeApprovechecks").prop('checked', false);

      if ($(".salesSummaryReportSelect").length === $(".salesSummaryReportSelect:checked").length)
        $("#salesSummaryReportchecks").prop('checked', true);
      else $("#salesSummaryReportchecks").prop('checked', false);

      if ($(".stockSummaryReportSelect").length === $(".stockSummaryReportSelect:checked").length)
        $("#stockSummaryReportchecks").prop('checked', true);
      else $("#stockSummaryReportchecks").prop('checked', false);

      if ($(".noSalesReportSelect").length === $(".noSalesReportSelect:checked").length)
        $("#noSalesReportchecks").prop('checked', true);
      else $("#noSalesReportchecks").prop('checked', false);

      if ($(".targetOutletReportSelect").length === $(".targetOutletReportSelect:checked").length)
        $("#targetOutletReportchecks").prop('checked', true);
      else $("#targetOutletReportchecks").prop('checked', false);

      if ($(".callRateReportSelect").length === $(".callRateReportSelect:checked").length)
        $("#callRateReportchecks").prop('checked', true);
      else $("#callRateReportchecks").prop('checked', false);

      if ($(".strikeRateReportSelect").length === $(".strikeRateReportSelect:checked").length)
        $("#strikeRateReportchecks").prop('checked', true);
      else $("#strikeRateReportchecks").prop('checked', false);

      if ($(".priceUpdateSelect").length === $(".priceUpdateSelect:checked").length)
        $("#priceUpdatechecks").prop('checked', true);
      else $("#priceUpdatechecks").prop('checked', false);

      if ($(".cxoDashboardSelect").length === $(".cxoDashboardSelect:checked").length)
        $("#cxoDashboardchecks").prop('checked', true);
      else $("#cxoDashboardchecks").prop('checked', false);

      if ($(".itemWiseReportSelect").length === $(".itemWiseReportSelect:checked").length)
        $("#itemWiseReportchecks").prop('checked', true);
      else $("#itemWiseReportchecks").prop('checked', false);


      if ($(".routeWiseReportSelect").length === $(".routeWiseReportSelect:checked").length)
        $("#routeWiseReportchecks").prop('checked', true);
      else $("#routeWiseReportchecks").prop('checked', false);

      if ($(".numericalDistributonReportSelect").length === $(".numericalDistributonReportSelect:checked").length)
        $("#numericalDistributonReportchecks").prop('checked', true);
      else $("#numericalDistributonReportchecks").prop('checked', false);

      if ($(".whsStockReportSelect").length === $(".whsStockReportSelect:checked").length)
        $("#whsStockReportchecks").prop('checked', true);
      else $("#whsStockReportchecks").prop('checked', false);

      if ($(".weightageDistributionReportSelect").length === $(".weightageDistributionReportSelect:checked").length)
        $("#weightageDistributionReportchecks").prop('checked', true);
      else $("#weightageDistributionReportchecks").prop('checked', false);

      if ($(".coverageDistributionReportSelect").length === $(".coverageDistributionReportSelect:checked").length)
        $("#coverageDistributionReportchecks").prop('checked', true);
      else $("#coverageDistributionReportchecks").prop('checked', false);

      if ($(".priceTypeEditSelect").length === $(".priceTypeEditSelect:checked").length)
        $("#priceTypeEditchecks").prop('checked', true);
      else $("#priceTypeEditchecks").prop('checked', false);

      if ($(".expenseListSelect").length === $(".expenseListSelect:checked").length)
        $("#expenseListchecks").prop('checked', true);
      else $("#expenseListchecks").prop('checked', false);

      if ($(".vansaleReportSelect").length === $(".vansaleReportSelect:checked").length)
        $("#vansaleReportchecks").prop('checked', true);
      else $("#vansaleReportchecks").prop('checked', false);

      if ($(".skippedCustomerReportSelect").length === $(".skippedCustomerReportSelect:checked").length)
        $("#skippedCustomerReportchecks").prop('checked', true);
      else $("#skippedCustomerReportchecks").prop('checked', false);

      if ($(".routeSelect").length === $(".routeSelect:checked").length)
        $("#routechecks").prop('checked', true);
      else $("#routechecks").prop('checked', false);


      if ($(".creditInvoiceReportSelect").length === $(".creditInvoiceReportSelect:checked").length)
        $("#creditInvoiceReportchecks").prop('checked', true);
      else $("#creditInvoiceReportchecks").prop('checked', false);

      if ($(".salesReturnReportSelect").length === $(".salesReturnReportSelect:checked").length)
        $("#salesReturnReportchecks").prop('checked', true);
      else $("#salesReturnReportchecks").prop('checked', false);

      if ($(".creditNoteReportSelect").length === $(".creditNoteReportSelect:checked").length)
        $("#creditNoteReportchecks").prop('checked', true);
      else $("#creditNoteReportchecks").prop('checked', false);

      if ($(".branchTransferReportSelect").length === $(".branchTransferReportSelect:checked").length)
        $("#branchTransferReportchecks").prop('checked', true);
      else $("#branchTransferReportchecks").prop('checked', false);

      if ($(".collectionReportSelect").length === $(".collectionReportSelect:checked").length)
        $("#collectionReportchecks").prop('checked', true);
      else $("#collectionReportchecks").prop('checked', false);

      if ($(".stockTransferReportSelect").length === $(".stockTransferReportSelect:checked").length)
        $("#stockTransferReportchecks").prop('checked', true);
      else $("#stockTransferReportchecks").prop('checked', false);

      if ($(".invoiceReportSelect").length === $(".invoiceReportSelect:checked").length)
        $("#invoiceReportchecks").prop('checked', true);
      else $("#invoiceReportchecks").prop('checked', false);
      if ($(".deliveryReportSelect").length === $(".deliveryReportSelect:checked").length)
        $("#deliveryReportchecks").prop('checked', true);
      else $("#deliveryReportchecks").prop('checked', false);

      if ($(".purchasePrintSelect").length === $(".purchasePrintSelect:checked").length)
        $("#purchasePrintchecks").prop('checked', true);
      else $("#purchasePrintchecks").prop('checked', false);

      if ($(".activitySeniorSelect").length === $(".activitySeniorSelect:checked").length)
        $("#activitySeniorchecks").prop('checked', true);
      else $("#activitySeniorchecks").prop('checked', false);

      if ($(".accountantSelect").length === $(".accountantSelect:checked").length)
        $("#accountantchecks").prop('checked', true);
      else $("#accountantchecks").prop('checked', false);

      if ($(".bpAdminSelect").length === $(".bpAdminSelect:checked").length)
        $("#bpAdminchecks").prop('checked', true);
      else $("#bpAdminchecks").prop('checked', false);
    });
  },

  /**
       * TODO: Complete JS doc
       * @param event
       */
  'submit .role-update': (event) => {


    event.preventDefault();


    updateRole(event.target);

  },
  /**
    * TODO: Complete JS doc
    */
  'click .closeRole': () => {
    $("#roleAdds").each(function () {
      this.reset();
    });

  },
  /**
   * TODO: Complete JS doc
   */
  'click .close': () => {
    $("#roleAdds").each(function () {
      this.reset();
    });
    $('#duplicateName').val('');
    $('#duplicateName').attr('placeholder', 'Please enter new role');
  },
  /**
* TODO: Complete JS doc
* @param event
*/
  'click .remove': (event) => {
    event.preventDefault();
    let header = $('#categoryHeader');
    let categoryName = $('#confCategoryName');
    let categoryNameDup = $('#categoryNameDup');
    let roleNameDup = $('#roleNameDup');
    let confirmedUuid = $('#confirmedUuid');
    let userTotal = $('#roleTotal');

    $('#categoryDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;


    // const users = Meteor.users.find({roles:$.trim(_id)}).count();
    Meteor.call('user.userCount', _id, (err, res) => {
      let users = res;
      let username = $('#name_' + _id).val();
      $(header).html('Confirm Deletion Of ' + $.trim(username));
      $(categoryName).html(username);
      $(categoryNameDup).html(username);
      $(roleNameDup).html(username);
      $(confirmedUuid).val(_id);
      $(userTotal).html(users);
    });
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .duplicate': (event) => {
    event.preventDefault();
    let header = $('#categoryHeaders');
    let categoryName = $('#confCategoryNames');
    let categoryNameDup = $('#categoryNameDups');
    let roleNameDup = $('#roleNameDups');
    let confirmedUuid = $('#confirmedUuids');
    let userTotal = $('#roleTotals');

    $('#duplicateConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;

    // const users = Meteor.users.find({roles:$.trim(_id)}).count();
    Meteor.call('user.userCount', _id, (err, res) => {
      let users = res;

      let username = $('#name_' + _id).val();
      $(header).html('Confirm Duplication Of ' + $.trim(username));
      $(categoryName).html(username);
      $(categoryNameDup).html(username);
      $(roleNameDup).html(username);
      $(confirmedUuid).val(_id);
      $(userTotal).html(users);
    });
  },
  /**
 * TODO: Complete JS doc
 * @param event
 */
  'click #categoryDuplicate': (event) => {
    event.preventDefault();
    let name = '';
    let duplicateName = $('#duplicateName').val();
    let _id = $('#confirmedUuids').val();
    // let duplicate = Meteor.roles.findOne({_id : _id});
    Meteor.call('role.roleName', _id, (roleError, roleResult) => {
      if (!roleError) {
        let duplicate = roleResult;
        if (duplicateName !== '') {
          name = duplicateName;
        }
        else {
          name = duplicate.name + "_Copy_" + Random.id().toString().slice(-3);
        }

        let description = duplicate.description;
        let homePage = duplicate.homePage;
        let itemLines = duplicate.permissions;

        Meteor.call('role.duplicate', name, description, homePage, itemLines, (error) => {
          if (error) {
            $('#message').html("Internal error - unable to duplicate entry. Please try again");
          } else {
            $('#roleSuccessModal').find('.modal-body').text('Role has been duplicated successfully');
            $('#roleSuccessModal').modal();
          }
          $("#duplicateConfirmation").modal('hide');
        });
        $('#duplicateName').val('');
        $('#duplicateName').attr('placeholder', 'Please enter new role');
      }
    });
  },
  /**
     * TODO: Complete JS doc
     * @param event
     */
  'click #closeDuplicate': (event) => {
    $('#duplicateName').val('');
    $('#duplicateName').attr('placeholder', 'Please enter new role');
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #categoryRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('role.delete', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#roleSuccessModal').find('.modal-body').text('Role has been deleted successfully');
          $('#roleSuccessModal').modal();
        }
        $("#categoryDelConfirmation").modal('hide');
      });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }
});