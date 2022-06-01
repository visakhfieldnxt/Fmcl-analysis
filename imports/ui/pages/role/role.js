/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor'
import { roles } from "../../../api/role/role";

Template.role_list.onCreated(function () {

  const self = this;
  self.autorun(() => {


  });
  this.orderByDateExport = new ReactiveVar();
  this.userTransactionsExport = new ReactiveVar();
  this.pagination = new Meteor.Pagination(roles, {
    filters: { 'isDeleted': false },
    sort: { 'name': 1 },
    fields: {
      name: 1,
      description: 1
    },
    perPage: 20
  });

});
Template.role_list.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  $('.homeURLUpdate').select2({
    placeholder: "Select Home Page",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".homeURLUpdate").parent(),

  });
  $('.rolesUnderEdit').select2({
    placeholder: "Select Value",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".rolesUnderEdit").parent(),
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
  orderByDateExport: () => {
    return Template.instance().orderByDateExport.get();
  },

  userTransExport: () => {
    return Template.instance().userTransactionsExport.get();
  },
  /**
   * TODO: Complete JS doc
    @returns {}
   */
  roles: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
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
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idRoleCount", role_id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.totalUsers_' + role_id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.totalUsers_' + role_id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
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
* TODO: Complete JS doc
*/
  'click #sdUserApprovechecks': () => {
    if ($("#sdUserApprovechecks").prop("checked") === true) {
      $("#sdUserApprovecheckView").prop('checked', true);
    } else {
      $("#sdUserApprovecheckView").prop('checked', false);
    }
  },
  /**
    * TODO: Complete JS doc
    */
  'click #superAdminchecks': () => {
    if ($("#superAdminchecks").prop("checked") === true) {
      $("#superAdmincheckView").prop('checked', true);
    } else {
      $("#superAdmincheckView").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #businessHeadchecks': () => {
    if ($("#businessHeadchecks").prop("checked") === true) {
      $("#businessHeadcheckView").prop('checked', true);
    } else {
      $("#businessHeadcheckView").prop('checked', false);
    }
  },

  /**
* TODO: Complete JS doc
*/
  'click #bdmchecks': () => {
    if ($("#bdmchecks").prop("checked") === true) {
      $("#bdmcheckView").prop('checked', true);
    } else {
      $("#bdmcheckView").prop('checked', false);
    }
  }, 'click #bhchecks': () => {
    if ($("#bhchecks").prop("checked") === true) {
      $("#bhcheckView").prop('checked', true);
    } else {
      $("#bhcheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #coordinatorchecks': () => {
    if ($("#coordinatorchecks").prop("checked") === true) {
      $("#coordinatorcheckView").prop('checked', true);
    } else {
      $("#coordinatorcheckView").prop('checked', false);
    }
  },

  /**
* TODO: Complete JS doc
*/
  'click #sdchecks': () => {
    if ($("#sdchecks").prop("checked") === true) {
      $("#sdcheckView").prop('checked', true);
    } else {
      $("#sdcheckView").prop('checked', false);
    }
  },

  /**
* TODO: Complete JS doc
*/
  'click #vsrchecks': () => {
    if ($("#vsrchecks").prop("checked") === true) {
      $("#vsrcheckView").prop('checked', true);
    } else {
      $("#vsrcheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #omrchecks': () => {
    if ($("#omrchecks").prop("checked") === true) {
      $("#omrcheckView").prop('checked', true);
    } else {
      $("#omrcheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #wsechecks': () => {
    if ($("#wsechecks").prop("checked") === true) {
      $("#wsecheckView").prop('checked', true);
    } else {
      $("#wsecheckView").prop('checked', false);
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
  'click #stockTransferchecks': () => {
    if ($("#stockTransferchecks").prop("checked") === true) {
      $("#stockTransfercheckView").prop('checked', true);
    } else {
      $("#stockTransfercheckView").prop('checked', false);
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click #stockListchecks': () => {
    if ($("#stockListchecks").prop("checked") === true) {
      $("#stockListcheckView").prop('checked', true);
    } else {
      $("#stockListcheckView").prop('checked', false);
    }
  },

  /**
* TODO: Complete JS doc
*/
  'click #outletsApprovechecks': () => {
    if ($("#outletsApprovechecks").prop("checked") === true) {
      $("#outletsApprovecheckView").prop('checked', true);
    } else {
      $("#outletsApprovecheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #routeAssignchecks': () => {
    if ($("#routeAssignchecks").prop("checked") === true) {
      $("#routeAssigncheckView").prop('checked', true);
    } else {
      $("#routeAssigncheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #attendancechecks': () => {
    if ($("#attendancechecks").prop("checked") === true) {
      $("#attendancecheckView").prop('checked', true);
    } else {
      $("#attendancecheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #stockAcceptchecks': () => {
    if ($("#stockAcceptchecks").prop("checked") === true) {
      $("#stockAcceptcheckView").prop('checked', true);
    } else {
      $("#stockAcceptcheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #stockReportchecks': () => {
    if ($("#stockReportchecks").prop("checked") === true) {
      $("#stockReportcheckView").prop('checked', true);
    } else {
      $("#stockReportcheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #outletTrackerchecks': () => {
    if ($("#outletTrackerchecks").prop("checked") === true) {
      $("#outletTrackercheckView").prop('checked', true);
    } else {
      $("#outletTrackercheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #stockReturnchecks': () => {
    if ($("#stockReturnchecks").prop("checked") === true) {
      $("#stockReturncheckView").prop('checked', true);
    } else {
      $("#stockReturncheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #stockSummarychecks': () => {
    if ($("#stockSummarychecks").prop("checked") === true) {
      $("#stockSummarycheckView").prop('checked', true);
    } else {
      $("#stockSummarycheckView").prop('checked', false);
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

  'click #verticalschecks': () => {
    if ($("#verticalschecks").prop("checked") === true) {
      $("#verticalscheckView").prop('checked', true);
      $("#verticalscheckCreate").prop('checked', true);
      $("#verticalscheckUpdate").prop('checked', true);
      $("#verticalscheckDelete").prop('checked', true);
    } else {
      $("#verticalscheckView").prop('checked', false);
      $("#verticalscheckCreate").prop('checked', false);
      $("#verticalscheckUpdate").prop('checked', false);
      $("#verticalscheckDelete").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/

  'click #sdMasterchecks': () => {
    if ($("#sdMasterchecks").prop("checked") === true) {
      $("#sdMastercheckView").prop('checked', true);
      $("#sdMastercheckCreate").prop('checked', true);
      $("#sdMastercheckUpdate").prop('checked', true);
      $("#sdMastercheckDelete").prop('checked', true);
    } else {
      $("#sdMastercheckView").prop('checked', false);
      $("#sdMastercheckCreate").prop('checked', false);
      $("#sdMastercheckUpdate").prop('checked', false);
      $("#sdMastercheckDelete").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/

  'click #outletschecks': () => {
    if ($("#outletschecks").prop("checked") === true) {
      $("#outletscheckView").prop('checked', true);
      $("#outletscheckCreate").prop('checked', true);
      $("#outletscheckUpdate").prop('checked', true);
      $("#outletscheckDelete").prop('checked', true);
    } else {
      $("#outletscheckView").prop('checked', false);
      $("#outletscheckCreate").prop('checked', false);
      $("#outletscheckUpdate").prop('checked', false);
      $("#outletscheckDelete").prop('checked', false);
    }
  },

  /**
* TODO: Complete JS doc
*/

  'click #sdOutletschecks': () => {
    if ($("#sdOutletschecks").prop("checked") === true) {
      $("#sdOutletscheckView").prop('checked', true);
      $("#sdOutletscheckCreate").prop('checked', true);
      $("#sdOutletscheckUpdate").prop('checked', true);
      $("#sdOutletscheckDelete").prop('checked', true);
    } else {
      $("#sdOutletscheckView").prop('checked', false);
      $("#sdOutletscheckCreate").prop('checked', false);
      $("#sdOutletscheckUpdate").prop('checked', false);
      $("#sdOutletscheckDelete").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/

  'click #cashSaleschecks': () => {
    if ($("#cashSaleschecks").prop("checked") === true) {
      $("#cashSalescheckView").prop('checked', true);
      $("#cashSalescheckCreate").prop('checked', true);
      $("#cashSalescheckUpdate").prop('checked', true);
      $("#cashSalescheckDelete").prop('checked', true);
    } else {
      $("#cashSalescheckView").prop('checked', false);
      $("#cashSalescheckCreate").prop('checked', false);
      $("#cashSalescheckUpdate").prop('checked', false);
      $("#cashSalescheckDelete").prop('checked', false);
    }
  },

  /**
* TODO: Complete JS doc
*/

  'click #creditSalechecks': () => {
    if ($("#creditSalechecks").prop("checked") === true) {
      $("#creditSalecheckView").prop('checked', true);
      $("#creditSalecheckCreate").prop('checked', true);
      $("#creditSalecheckUpdate").prop('checked', true);
      $("#creditSalecheckDelete").prop('checked', true);
    } else {
      $("#creditSalecheckView").prop('checked', false);
      $("#creditSalecheckCreate").prop('checked', false);
      $("#creditSalecheckUpdate").prop('checked', false);
      $("#creditSalecheckDelete").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/

  'click #brandchecks': () => {
    if ($("#brandchecks").prop("checked") === true) {
      $("#brandcheckView").prop('checked', true);
      $("#brandcheckCreate").prop('checked', true);
      $("#brandcheckUpdate").prop('checked', true);
      $("#brandcheckDelete").prop('checked', true);
    } else {
      $("#brandcheckView").prop('checked', false);
      $("#brandcheckCreate").prop('checked', false);
      $("#brandcheckUpdate").prop('checked', false);
      $("#brandcheckDelete").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/

  'click #categorychecks': () => {
    if ($("#categorychecks").prop("checked") === true) {
      $("#categorycheckView").prop('checked', true);
      $("#categorycheckCreate").prop('checked', true);
      $("#categorycheckUpdate").prop('checked', true);
      $("#categorycheckDelete").prop('checked', true);
    } else {
      $("#categorycheckView").prop('checked', false);
      $("#categorycheckCreate").prop('checked', false);
      $("#categorycheckUpdate").prop('checked', false);
      $("#categorycheckDelete").prop('checked', false);
    }
  },
  'click #sdUserStockHistory1check': () => {
    if ($("#sdUserStockHistory1check").prop("checked") === true) {
      $("#sdUserStockHistory1checking").prop('checked', true);
    } else {
      $("#sdUserStockHistory1checking").prop('checked', false);
    }
  },
  'click #sdUserStockSummary1check': () => {
    if ($("#sdUserStockSummary1check").prop("checked") === true) {
      $("#sdUserStockSummary1checking").prop('checked', true);
    } else {
      $("#sdUserStockSummary1checking").prop('checked', false);
    }
  },
  'click #verticalSaleReport1check': () => {
    if ($("#verticalSaleReport1check").prop("checked") === true) {
      $("#verticalSaleReport1checking").prop('checked', true);
    } else {
      $("#verticalSaleReport1checking").prop('checked', false);
    }
  },
  'click #sdReports1check': () => {
    if ($("#sdReports1check").prop("checked") === true) {
      $("#sdReports1checking").prop('checked', true);
    } else {
      $("#sdReports1checking").prop('checked', false);
    }
  },
  'click #bdmReports1check': () => {
    if ($("#bdmReports1check").prop("checked") === true) {
      $("#bdmReports1checking").prop('checked', true);
    } else {
      $("#bdmReports1checking").prop('checked', false);
    }
  }, 'click #bhReports1check': () => {
    if ($("#bhReports1check").prop("checked") === true) {
      $("#bhReports1checking").prop('checked', true);
    } else {
      $("#bhReports1checking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #cashSalesRepEditcheck': () => {
    if ($("#cashSalesRepEditcheck").prop("checked") === true) {
      $("#cashSalesRepEditchecking").prop('checked', true);

    } else {
      $("#cashSalesRepEditchecking").prop('checked', false);

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
  }, /**
* TODO: Complete JS doc
*/
  'click #branchchecks': () => {
    if ($("#branchchecks").prop("checked") === true) {
      $("#branchcheckView").prop('checked', true);
      $("#branchcheckCreate").prop('checked', true);
      $("#branchcheckUpdate").prop('checked', true);
      $("#branchcheckDelete").prop('checked', true);
    } else {
      $("#branchcheckView").prop('checked', false);
      $("#branchcheckCreate").prop('checked', false);
      $("#branchcheckUpdate").prop('checked', false);
      $("#branchcheckDelete").prop('checked', false);
    }
  },

  /**
 * TODO: Complete JS doc
 */
  'click #locationchecks': () => {
    if ($("#locationchecks").prop("checked") === true) {
      $("#locationcheckView").prop('checked', true);
      $("#locationcheckCreate").prop('checked', true);
      $("#locationcheckUpdate").prop('checked', true);
      $("#locationcheckDelete").prop('checked', true);
    } else {
      $("#locationcheckView").prop('checked', false);
      $("#locationcheckCreate").prop('checked', false);
      $("#locationcheckUpdate").prop('checked', false);
      $("#locationcheckDelete").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #priceTypechecks': () => {
    if ($("#priceTypechecks").prop("checked") === true) {
      $("#priceTypecheckView").prop('checked', true);
      $("#priceTypecheckCreate").prop('checked', true);
      $("#priceTypecheckUpdate").prop('checked', true);
      $("#priceTypecheckDelete").prop('checked', true);
    } else {
      $("#priceTypecheckView").prop('checked', false);
      $("#priceTypecheckCreate").prop('checked', false);
      $("#priceTypecheckUpdate").prop('checked', false);
      $("#priceTypecheckDelete").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #productchecks': () => {
    if ($("#productchecks").prop("checked") === true) {
      $("#productcheckView").prop('checked', true);
      $("#productcheckCreate").prop('checked', true);
      $("#productcheckUpdate").prop('checked', true);
      $("#productcheckDelete").prop('checked', true);
    } else {
      $("#productcheckView").prop('checked', false);
      $("#productcheckCreate").prop('checked', false);
      $("#productcheckUpdate").prop('checked', false);
      $("#productcheckDelete").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #unitchecks': () => {
    if ($("#unitchecks").prop("checked") === true) {
      $("#unitcheckView").prop('checked', true);
      $("#unitcheckCreate").prop('checked', true);
      $("#unitcheckUpdate").prop('checked', true);
      $("#unitcheckDelete").prop('checked', true);
    } else {
      $("#unitcheckView").prop('checked', false);
      $("#unitcheckCreate").prop('checked', false);
      $("#unitcheckUpdate").prop('checked', false);
      $("#unitcheckDelete").prop('checked', false);
    }
  },
  /**
  * TODO: Complete JS doc
  */
  'click #pricechecks': () => {
    if ($("#pricechecks").prop("checked") === true) {
      $("#pricecheckView").prop('checked', true);
      $("#pricecheckCreate").prop('checked', true);
      $("#pricecheckUpdate").prop('checked', true);
      $("#pricecheckDelete").prop('checked', true);
    } else {
      $("#pricecheckView").prop('checked', false);
      $("#pricecheckCreate").prop('checked', false);
      $("#pricecheckUpdate").prop('checked', false);
      $("#pricecheckDelete").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #taxchecks': () => {
    if ($("#taxchecks").prop("checked") === true) {
      $("#taxcheckView").prop('checked', true);
      $("#taxcheckCreate").prop('checked', true);
      $("#taxcheckUpdate").prop('checked', true);
      $("#taxcheckDelete").prop('checked', true);
    } else {
      $("#taxcheckView").prop('checked', false);
      $("#taxcheckCreate").prop('checked', false);
      $("#taxcheckUpdate").prop('checked', false);
      $("#taxcheckDelete").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #SdPriceListchecks': () => {
    if ($("#SdPriceListchecks").prop("checked") === true) {
      $("#SdPriceListcheckView").prop('checked', true);

    } else {
      $("#SdPriceListcheckView").prop('checked', false);

    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #deliveryListchecks': () => {
    if ($("#deliveryListchecks").prop("checked") === true) {
      $("#deliveryListcheckView").prop('checked', true);
      $("#deliveryListcheckUpdate").prop('checked', true);

    } else {
      $("#deliveryListcheckView").prop('checked', false);
      $("#deliveryListcheckUpdate").prop('checked', false);

    }
  },
  /**
 * TODO: Complete JS doc
 */
  'click #collectionListchecks': () => {
    if ($("#collectionListchecks").prop("checked") === true) {
      $("#collectionListcheckView").prop('checked', true);
      $("#collectionListcheckUpdate").prop('checked', true);

    } else {
      $("#collectionListcheckView").prop('checked', false);
      $("#collectionListcheckUpdate").prop('checked', false);

    }
  },
  /**
  * TODO: Complete JS doc
  */
  'click #administrationchecks': () => {
    if ($("#administrationchecks").prop("checked") === true) {
      $("#administrationcheckView").prop('checked', true);
    } else {
      $("#administrationcheckView").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #orderApListchecks': () => {
    if ($("#orderApListchecks").prop("checked") === true) {
      $("#orderApListcheckView").prop('checked', true);

    } else {
      $("#orderApListcheckView").prop('checked', false);

    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #orderReportchecks': () => {
    if ($("#orderReportchecks").prop("checked") === true) {
      $("#orderReportcheckView").prop('checked', true);

    } else {
      $("#orderReportcheckView").prop('checked', false);

    }
  },
  /**
    * TODO:Complete JS doc
    */
  'change .orderReportselect': () => {
    if ($(".orderReportselect").length === $(".orderReportselect:checked").length)
      $("#orderReportchecks").prop('checked', true);
    else
      $("#orderReportchecks").prop('checked', false);
  },
  /**
    * TODO: Complete JS doc
    */
  'change .sdUserApproveSelect': () => {
    if ($(".sdUserApproveSelect").length === $(".sdUserApproveSelect:checked").length)
      $("#sdUserApprovechecks").prop('checked', true);
    else
      $("#sdUserApprovechecks").prop('checked', false);
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
  'change .superAdminSelect': () => {
    if ($(".superAdminSelect").length === $(".superAdminSelect:checked").length)
      $("#superAdminchecks").prop('checked', true);
    else
      $("#superAdminchecks").prop('checked', false);
  },

  /**
* TODO: Complete JS doc
*/
  'change .businessHeadSelect': () => {
    if ($(".businessHeadSelect").length === $(".businessHeadSelect:checked").length)
      $("#businessHeadchecks").prop('checked', true);
    else
      $("#businessHeadchecks").prop('checked', false);
  },

  /**
* TODO: Complete JS doc
*/
  'change .bdmSelect': () => {
    if ($(".bdmSelect").length === $(".bdmSelect:checked").length)
      $("#bdmchecks").prop('checked', true);
    else
      $("#bdmchecks").prop('checked', false);
  }, 'change .bhSelect': () => {
    if ($(".bhSelect").length === $(".bhSelect:checked").length)
      $("#bhchecks").prop('checked', true);
    else
      $("#bhchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .coordinatorSelect': () => {
    if ($(".coordinatorSelect").length === $(".coordinatorSelect:checked").length)
      $("#coordinatorchecks").prop('checked', true);
    else
      $("#coordinatorchecks").prop('checked', false);
  },

  /**
* TODO: Complete JS doc
*/
  'change .sdSelect': () => {
    if ($(".sdSelect").length === $(".sdSelect:checked").length)
      $("#sdchecks").prop('checked', true);
    else
      $("#sdchecks").prop('checked', false);
  },

  /**
* TODO: Complete JS doc
*/
  'change .vsrSelect': () => {
    if ($(".vsrSelect").length === $(".vsrSelect:checked").length)
      $("#vsrchecks").prop('checked', true);
    else
      $("#vsrchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .omrSelect': () => {
    if ($(".omrSelect").length === $(".omrSelect:checked").length)
      $("#omrchecks").prop('checked', true);
    else
      $("#omrchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .wseSelect': () => {
    if ($(".wseSelect").length === $(".wseSelect:checked").length)
      $("#wsechecks").prop('checked', true);
    else
      $("#wsechecks").prop('checked', false);
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
  'change .stockTransferSelect': () => {
    if ($(".stockTransferSelect").length === $(".stockTransferSelect:checked").length)
      $("#stockTransferchecks").prop('checked', true);
    else
      $("#stockTransferchecks").prop('checked', false);
  },
  /**
 * TODO: Complete JS doc
 */
  'change .stockListSelect': () => {
    if ($(".stockListSelect").length === $(".stockListSelect:checked").length)
      $("#stockListchecks").prop('checked', true);
    else
      $("#stockListchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .outletsApproveSelect': () => {
    if ($(".outletsApproveSelect").length === $(".outletsApproveSelect:checked").length)
      $("#outletsApprovechecks").prop('checked', true);
    else
      $("#outletsApprovechecks").prop('checked', false);
  },

  /**
* TODO: Complete JS doc
*/
  'change .routeAssignSelect': () => {
    if ($(".routeAssignSelect").length === $(".routeAssignSelect:checked").length)
      $("#routeAssignchecks").prop('checked', true);
    else
      $("#routeAssignchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .attendanceSelect': () => {
    if ($(".attendanceSelect").length === $(".attendanceSelect:checked").length)
      $("#attendancechecks").prop('checked', true);
    else
      $("#attendancechecks").prop('checked', false);
  },

  /**
* TODO: Complete JS doc
*/
  'change .stockAcceptSelect': () => {
    if ($(".stockAcceptSelect").length === $(".stockAcceptSelect:checked").length)
      $("#stockAcceptchecks").prop('checked', true);
    else
      $("#stockAcceptchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .stockReportSelect': () => {
    if ($(".stockReportSelect").length === $(".stockReportSelect:checked").length)
      $("#stockReportchecks").prop('checked', true);
    else
      $("#stockReportchecks").prop('checked', false);
  },

  /**
* TODO: Complete JS doc
*/
  'change .outletTrackerSelect': () => {
    if ($(".outletTrackerSelect").length === $(".outletTrackerSelect:checked").length)
      $("#outletTrackerchecks").prop('checked', true);
    else
      $("#outletTrackerchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .stockReturnSelect': () => {
    if ($(".stockReturnSelect").length === $(".stockReturnSelect:checked").length)
      $("#stockReturnchecks").prop('checked', true);
    else
      $("#stockReturnchecks").prop('checked', false);
  },
  /**
* TODO: Complete JS doc
*/
  'change .stockSummarySelect': () => {
    if ($(".stockSummarySelect").length === $(".stockSummarySelect:checked").length)
      $("#stockSummarychecks").prop('checked', true);
    else
      $("#stockSummarychecks").prop('checked', false);
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
  'change .masterDataSelect': () => {
    if ($(".masterDataSelect").length === $(".masterDataSelect:checked").length)
      $("#masterDatachecks").prop('checked', true);
    else
      $("#masterDatachecks").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .routeSelect': () => {
    if ($(".routeSelect").length === $(".routeSelect:checked").length)
      $("#routechecks").prop('checked', true);
    else
      $("#routechecks").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .verticalsSelect': () => {
    if ($(".verticalsSelect").length === $(".verticalsSelect:checked").length)
      $("#verticalschecks").prop('checked', true);
    else
      $("#verticalschecks").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .sdMasterSelect': () => {
    if ($(".sdMasterSelect").length === $(".sdMasterSelect:checked").length)
      $("#sdMasterchecks").prop('checked', true);
    else
      $("#sdMasterchecks").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .outletsSelect': () => {
    if ($(".outletsSelect").length === $(".outletsSelect:checked").length)
      $("#outletschecks").prop('checked', true);
    else
      $("#outletschecks").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .sdOutletsSelect': () => {
    if ($(".sdOutletsSelect").length === $(".sdOutletsSelect:checked").length)
      $("#sdOutletschecks").prop('checked', true);
    else
      $("#sdOutletschecks").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .cashSalesSelect': () => {
    if ($(".cashSalesSelect").length === $(".cashSalesSelect:checked").length)
      $("#cashSaleschecks").prop('checked', true);
    else
      $("#cashSaleschecks").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .creditSaleSelect': () => {
    if ($(".creditSaleSelect").length === $(".creditSaleSelect:checked").length)
      $("#creditSalechecks").prop('checked', true);
    else
      $("#creditSalechecks").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .brandSelect': () => {
    if ($(".brandSelect").length === $(".brandSelect:checked").length)
      $("#brandchecks").prop('checked', true);
    else
      $("#brandchecks").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .categorySelect': () => {
    if ($(".categorySelect").length === $(".categorySelect:checked").length)
      $("#categorychecks").prop('checked', true);
    else
      $("#categorychecks").prop('checked', false);
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
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', { isDeleted: false });
    $('form :input').val("");
  },
  /**
    * TODO: Complete JS doc
    */
  'change .branchelect': () => {
    if ($(".branchelect").length === $(".branchelect:checked").length)
      $("#branchchecks").prop('checked', true);
    else
      $("#branchchecks").prop('checked', false);
  },

  /**
    * TODO: Complete JS doc
    */
  'change .locationelect': () => {
    if ($(".locationelect").length === $(".locationelect:checked").length)
      $("#locationchecks").prop('checked', true);
    else
      $("#locationchecks").prop('checked', false);
  },

  /**
    * TODO: Complete JS doc
    */
  'change .priceTypeelect': () => {
    if ($(".priceTypeelect").length === $(".priceTypeelect:checked").length)
      $("#priceTypechecks").prop('checked', true);
    else
      $("#priceTypechecks").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .productelect': () => {
    if ($(".productelect").length === $(".productelect:checked").length)
      $("#productchecks").prop('checked', true);
    else
      $("#productchecks").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .unitelect': () => {
    if ($(".unitelect").length === $(".unitelect:checked").length)
      $("#unitchecks").prop('checked', true);
    else
      $("#unitchecks").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .priceelect': () => {
    if ($(".priceelect").length === $(".priceelect:checked").length)
      $("#pricechecks").prop('checked', true);
    else
      $("#pricechecks").prop('checked', false);
  },
  /**
      * TODO: Complete JS doc
      */
  'change .taxelect': () => {
    if ($(".taxelect").length === $(".taxelect:checked").length)
      $("#taxchecks").prop('checked', true);
    else
      $("#taxchecks").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .SdPriceListelect': () => {
    if ($(".SdPriceListselect").length === $(".SdPriceListselect:checked").length)
      $("#SdPriceListchecks").prop('checked', true);
    else
      $("#SdPriceListchecks").prop('checked', false);
  },
  /**
      * TODO: Complete JS doc
      */
  'change .administrationselect': () => {
    if ($(".administrationselect").length === $(".administrationselect:checked").length)
      $("#administrationchecks").prop('checked', true);
    else
      $("#administrationchecks").prop('checked', false);
  },
  /**
      * TODO: Complete JS doc
      */
  'change .SdPriceListselect': () => {
    if ($(".SdPriceListselect").length === $(".SdPriceListselect:checked").length)
      $("#SdPriceListchecks").prop('checked', true);
    else
      $("#SdPriceListchecks").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .collectionListelect': () => {
    if ($(".collectionListselect").length === $(".collectionListselect:checked").length)
      $("#collectionListchecks").prop('checked', true);
    else
      $("#collectionListchecks").prop('checked', false);
  },
  /**
      * TODO: Complete JS doc
      */
  'change .deliveryListelect': () => {
    if ($(".deliveryListselect").length === $(".deliveryListselect:checked").length)
      $("#deliveryListchecks").prop('checked', true);
    else
      $("#deliveryListchecks").prop('checked', false);
  },
  /**
    * TODO: Complete JS doc
    */
  'change .orderApListelect': () => {
    if ($(".orderApListselect").length === $(".orderApListselect:checked").length)
      $("#orderApListchecks").prop('checked', true);
    else
      $("#orderApListchecks").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .cashSalesRepEdittSelections': () => {
    if ($(".cashSalesRepEdittSelections").length === $(".cashSalesRepEdittSelections:checked").length)
      $("#cashSalesRepEdittcheck").prop('checked', true);
    else
      $("#cashSalesRepEdittcheck").prop('checked', false);
  },
  'click #creditSaleReportchecks': () => {
    if ($("#creditSaleReportchecks").prop("checked") === true) {
      $("#creditSaleReportcheckView").prop('checked', true);
    } else {
      $("#creditSaleReportcheckView").prop('checked', false);
    }
  }
  ,
  'change .creditSaleReportselect': () => {
    if ($(".creditSaleReportselect").length === $(".creditSaleReportselect:checked").length)
      $("#creditSaleReportchecks").prop('checked', true);
    else
      $("#creditSaleReportchecks").prop('checked', false);
  },
  'change .sdUserStockHistory1Selections': () => {
    if ($(".sdUserStockHistory1Selections").length === $(".sdUserStockHistory1Selections:checked").length)
      $("#sdUserStockHistory1check").prop('checked', true);
    else
      $("#sdUserStockHistory1check").prop('checked', false);
  },
  'change .sdUserStockSummary1Selections': () => {
    if ($(".sdUserStockSummary1Selections").length === $(".sdUserStockSummary1Selections:checked").length)
      $("#sdUserStockSummary1check").prop('checked', true);
    else
      $("#sdUserStockSummary1check").prop('checked', false);
  },
  'change .verticalSaleReport1Selections': () => {
    if ($(".verticalSaleReport1Selections").length === $(".verticalSaleReport1Selections:checked").length)
      $("#verticalSaleReport1check").prop('checked', true);
    else
      $("#verticalSaleReport1check").prop('checked', false);
  }
  ,
  'change .sdReports1Selections': () => {
    if ($(".sdReports1Selections").length === $(".sdReports1Selections:checked").length)
      $("#sdReports1check").prop('checked', true);
    else
      $("#sdReports1check").prop('checked', false);
  },
  'change .bdmReports1Selections': () => {
    if ($(".bdmReports1Selections").length === $(".bdmReports1Selections:checked").length)
      $("#bdmReports1check").prop('checked', true);
    else
      $("#bdmReports1check").prop('checked', false);
  },
  'change .bhReports1Selections': () => {
    if ($(".bhReports1Selections").length === $(".bhReports1Selections:checked").length)
      $("#bhReports1check").prop('checked', true);
    else
      $("#bhReports1check").prop('checked', false);
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
      let rolesUderVal = roleDetail.rolesUnder;
      let superAdminView = roleDetailPermissions.includes("superAdminView");
      let businessHeadView = roleDetailPermissions.includes("businessHeadView");
      let bdmView = roleDetailPermissions.includes("bdmView");
      let coordinatorView = roleDetailPermissions.includes("coordinatorView");
      let sdView = roleDetailPermissions.includes("sdView");
      let vsrView = roleDetailPermissions.includes("vsrView");
      let omrView = roleDetailPermissions.includes("omrView");
      let wseView = roleDetailPermissions.includes("wseView");
      let historyView = roleDetailPermissions.includes("historyView");
      let reportView = roleDetailPermissions.includes("reportView");
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
      let salesDashboard = roleDetailPermissions.includes("salesDashboard");
      let adminDashboard = roleDetailPermissions.includes("adminDashboard");
      let superAdminDashboard = roleDetailPermissions.includes("superAdminDashboard");
      let orderView = roleDetailPermissions.includes("orderView");
      let orderCreate = roleDetailPermissions.includes("orderCreate");
      let sdUserApproveView = roleDetailPermissions.includes("sdUserApproveView");
      let stockTransferView = roleDetailPermissions.includes("stockTransferView");
      let stockListView = roleDetailPermissions.includes("stockListView");

      let masterDataView = roleDetailPermissions.includes("masterDataView");
      let masterDataUpdate = roleDetailPermissions.includes("masterDataUpdate");
      let masterDataDelete = roleDetailPermissions.includes("masterDataDelete");
      let masterDataCreate = roleDetailPermissions.includes("masterDataCreate");
      let outletsApproveView = roleDetailPermissions.includes("outletsApproveView");
      let routeAssignView = roleDetailPermissions.includes("routeAssignView");
      let attendanceView = roleDetailPermissions.includes("attendanceView");
      let stockAcceptView = roleDetailPermissions.includes("stockAcceptView");
      let routeView = roleDetailPermissions.includes("routeView");
      let routeUpdate = roleDetailPermissions.includes("routeUpdate");
      let routeDelete = roleDetailPermissions.includes("routeDelete");
      let routeCreate = roleDetailPermissions.includes("routeCreate");
      let stockReportView = roleDetailPermissions.includes("stockReportView");
      let outletTrackerView = roleDetailPermissions.includes("outletTrackerView");
      let stockReturnView = roleDetailPermissions.includes("stockReturnView");
      let stockSummaryView = roleDetailPermissions.includes("stockSummaryView");
      let verticalsView = roleDetailPermissions.includes("verticalsView");
      let verticalsUpdate = roleDetailPermissions.includes("verticalsUpdate");
      let verticalsDelete = roleDetailPermissions.includes("verticalsDelete");
      let verticalsCreate = roleDetailPermissions.includes("verticalsCreate");

      let outletsView = roleDetailPermissions.includes("outletsView");
      let outletsUpdate = roleDetailPermissions.includes("outletsUpdate");
      let outletsDelete = roleDetailPermissions.includes("outletsDelete");
      let outletsCreate = roleDetailPermissions.includes("outletsCreate");


      let sdOutletsView = roleDetailPermissions.includes("sdOutletsView");
      let sdOutletsUpdate = roleDetailPermissions.includes("sdOutletsUpdate");
      let sdOutletsDelete = roleDetailPermissions.includes("sdOutletsDelete");
      let sdOutletsCreate = roleDetailPermissions.includes("sdOutletsCreate");

      let cashSalesView = roleDetailPermissions.includes("cashSalesView");
      let cashSalesUpdate = roleDetailPermissions.includes("cashSalesUpdate");
      let cashSalesDelete = roleDetailPermissions.includes("cashSalesDelete");
      let cashSalesCreate = roleDetailPermissions.includes("cashSalesCreate");

      let creditSaleView = roleDetailPermissions.includes("creditSaleView");
      let creditSaleUpdate = roleDetailPermissions.includes("creditSaleUpdate");
      let creditSaleDelete = roleDetailPermissions.includes("creditSaleDelete");
      let creditSaleCreate = roleDetailPermissions.includes("creditSaleCreate");

      let brandView = roleDetailPermissions.includes("brandView");
      let brandUpdate = roleDetailPermissions.includes("brandUpdate");
      let brandDelete = roleDetailPermissions.includes("brandDelete");
      let brandCreate = roleDetailPermissions.includes("brandCreate");

      let categoryView = roleDetailPermissions.includes("categoryView");
      let categoryUpdate = roleDetailPermissions.includes("categoryUpdate");
      let categoryDelete = roleDetailPermissions.includes("categoryDelete");
      let categoryCreate = roleDetailPermissions.includes("categoryCreate");

      let sdMasterView = roleDetailPermissions.includes("sdMasterView");
      let sdMasterUpdate = roleDetailPermissions.includes("sdMasterUpdate");
      let sdMasterDelete = roleDetailPermissions.includes("sdMasterDelete");
      let sdMasterCreate = roleDetailPermissions.includes("sdMasterCreate");

      // code 22062021
      let branchView = roleDetailPermissions.includes("branchView");
      let branchCreate = roleDetailPermissions.includes("branchCreate");
      let branchUpdate = roleDetailPermissions.includes("branchUpdate");
      let branchDelete = roleDetailPermissions.includes("branchDelete");
      let locationView = roleDetailPermissions.includes("locationView");
      let locationCreate = roleDetailPermissions.includes("locationCreate");
      let locationUpdate = roleDetailPermissions.includes("locationUpdate");
      let locationDelete = roleDetailPermissions.includes("locationDelete");
      let priceTypeView = roleDetailPermissions.includes("priceTypeView");
      let priceTypeCreate = roleDetailPermissions.includes("priceTypeCreate");
      let priceTypeUpdate = roleDetailPermissions.includes("priceTypeUpdate");
      let priceTypeDelete = roleDetailPermissions.includes("priceTypeDelete");
      let productView = roleDetailPermissions.includes("productView");
      let productCreate = roleDetailPermissions.includes("productCreate");
      let productUpdate = roleDetailPermissions.includes("productUpdate");
      let productDelete = roleDetailPermissions.includes("productDelete");
      let unitView = roleDetailPermissions.includes("unitView");
      let unitCreate = roleDetailPermissions.includes("unitCreate");
      let unitUpdate = roleDetailPermissions.includes("unitUpdate");
      let unitDelete = roleDetailPermissions.includes("unitDelete");
      let priceView = roleDetailPermissions.includes("priceView");
      let priceCreate = roleDetailPermissions.includes("priceCreate");
      let priceUpdate = roleDetailPermissions.includes("priceUpdate");
      let priceDelete = roleDetailPermissions.includes("priceDelete");
      let taxView = roleDetailPermissions.includes("taxView");
      let taxCreate = roleDetailPermissions.includes("taxCreate");
      let taxUpdate = roleDetailPermissions.includes("taxUpdate");
      let taxDelete = roleDetailPermissions.includes("taxDelete");
      let administrationView = roleDetailPermissions.includes("administrationView");
      let sdPriceListView = roleDetailPermissions.includes("sdPriceListView");
      // code 22062021
      let deliveryListView = roleDetailPermissions.includes("deliveryListView");
      let deliveryUpdate = roleDetailPermissions.includes("deliveryUpdate");

      let collectionListView = roleDetailPermissions.includes("collectionListView");
      let collectionUpdate = roleDetailPermissions.includes("collectionUpdate");
      let orderApprove = roleDetailPermissions.includes("orderApprove");

      let cashSalesReportView = roleDetailPermissions.includes("cashSalesReportView");

      let orderReport = roleDetailPermissions.includes("orderReport");
      let creditSaleReport = roleDetailPermissions.includes("creditSaleReport");
      let sdUserStockHistoryView = roleDetailPermissions.includes("sdUserStockHistoryView");
      let sdUserStockSummaryView = roleDetailPermissions.includes("sdUserStockSummaryView");
      let verticalSaleReportview = roleDetailPermissions.includes("verticalSaleReportview");

      let sdReportsView = roleDetailPermissions.includes("sdReportsView");
      let bdmReportsView = roleDetailPermissions.includes("bdmReportsView");
      let bhReportsView = roleDetailPermissions.includes("bhReportsView");

      $("#roleDetailName").val(roleDetailName);
      $("#roleDetailId").val(_id);
      $("#roleDetailDescription").val(roleDetailDescription);
      $("#homeURLUpdate").val(roleDetailHomePage).trigger('change');
      $("#rolesUnderEdit").val(rolesUderVal).trigger('change');

      if (superAdminView === true) { $("#superAdmincheckView").prop('checked', true); }
      else { $("#superAdmincheckView").prop('checked', false); };

      if (businessHeadView === true) { $("#businessHeadcheckView").prop('checked', true); }
      else { $("#businessHeadcheckView").prop('checked', false); };

      if (bdmView === true) { $("#bdmcheckView").prop('checked', true); }
      else { $("#bdmcheckView").prop('checked', false); };

      if (coordinatorView === true) { $("#coordinatorcheckView").prop('checked', true); }
      else { $("#coordinatorcheckView").prop('checked', false); };

      if (sdView === true) { $("#sdcheckView").prop('checked', true); }
      else { $("#sdcheckView").prop('checked', false); };

      if (vsrView === true) { $("#vsrcheckView").prop('checked', true); }
      else { $("#vsrcheckView").prop('checked', false); };

      if (omrView === true) { $("#omrcheckView").prop('checked', true); }
      else { $("#omrcheckView").prop('checked', false); };

      if (wseView === true) { $("#wsecheckView").prop('checked', true); }
      else { $("#wsecheckView").prop('checked', false); };

      if (historyView === true) { $("#historycheckView").prop('checked', true); }
      else { $("#historycheckView").prop('checked', false); };

      if (reportView === true) { $("#reportcheckView").prop('checked', true); }
      else { $("#reportcheckView").prop('checked', false); };

      if (stockTransferView === true) { $("#stockTransfercheckView").prop('checked', true); }
      else { $("#stockTransfercheckView").prop('checked', false); };

      if (stockListView === true) { $("#stockListcheckView").prop('checked', true); }
      else { $("#stockListcheckView").prop('checked', false); };

      if (attendanceView === true) { $("#attendancecheckView").prop('checked', true); }
      else { $("#attendancecheckView").prop('checked', false); };

      if (stockAcceptView === true) { $("#stockAcceptcheckView").prop('checked', true); }
      else { $("#stockAcceptcheckView").prop('checked', false); };

      if (stockReportView === true) { $("#stockReportcheckView").prop('checked', true); }
      else { $("#stockReportcheckView").prop('checked', false); };

      if (outletTrackerView === true) { $("#outletTrackercheckView").prop('checked', true); }
      else { $("#outletTrackercheckView").prop('checked', false); };

      if (stockReturnView === true) { $("#stockReturncheckView").prop('checked', true); }
      else { $("#stockReturncheckView").prop('checked', false); };

      if (stockSummaryView === true) { $("#stockSummarycheckView").prop('checked', true); }
      else { $("#stockSummarycheckView").prop('checked', false); };

      if (outletsApproveView === true) { $("#outletsApprovecheckView").prop('checked', true); }
      else { $("#outletsApprovecheckView").prop('checked', false); };

      if (routeAssignView === true) { $("#routeAssigncheckView").prop('checked', true); }
      else { $("#routeAssigncheckView").prop('checked', false); };

      if (sdUserApproveView === true) { $("#sdUserApprovecheckView").prop('checked', true); }
      else { $("#sdUserApprovecheckView").prop('checked', false); };

      if (userView === true) { $("#userscheckView").prop('checked', true); }
      else { $("#userscheckView").prop('checked', false) };
      if (userUpdate === true) { $("#userscheckUpdate").prop('checked', true); }
      else { $("#userscheckUpdate").prop('checked', false); };

      if (userDelete === true) { $("#userscheckDelete").prop('checked', true); }
      else { $("#userscheckDelete").prop('checked', false); };
      if (userCreate === true) { $("#userscheckCreate").prop('checked', true); }
      else { $("#userscheckCreate").prop('checked', false); };

      if (masterDataView === true) { $("#masterDatacheckView").prop('checked', true); }
      else { $("#masterDatacheckView").prop('checked', false) };
      if (masterDataUpdate === true) { $("#masterDatacheckUpdate").prop('checked', true); }
      else { $("#masterDatacheckUpdate").prop('checked', false); };

      if (masterDataDelete === true) { $("#masterDatacheckDelete").prop('checked', true); }
      else { $("#masterDatacheckDelete").prop('checked', false); };
      if (masterDataCreate === true) { $("#masterDatacheckCreate").prop('checked', true); }
      else { $("#masterDatacheckCreate").prop('checked', false); };

      if (routeView === true) { $("#routecheckView").prop('checked', true); }
      else { $("#routecheckView").prop('checked', false) };
      if (routeUpdate === true) { $("#routecheckUpdate").prop('checked', true); }
      else { $("#routecheckUpdate").prop('checked', false); };

      if (routeDelete === true) { $("#routecheckDelete").prop('checked', true); }
      else { $("#routecheckDelete").prop('checked', false); };
      if (routeCreate === true) { $("#routecheckCreate").prop('checked', true); }
      else { $("#routecheckCreate").prop('checked', false); };

      if (verticalsView === true) { $("#verticalscheckView").prop('checked', true); }
      else { $("#verticalscheckView").prop('checked', false) };
      if (verticalsUpdate === true) { $("#verticalscheckUpdate").prop('checked', true); }
      else { $("#verticalscheckUpdate").prop('checked', false); };

      if (verticalsDelete === true) { $("#verticalscheckDelete").prop('checked', true); }
      else { $("#verticalscheckDelete").prop('checked', false); };
      if (verticalsCreate === true) { $("#verticalscheckCreate").prop('checked', true); }
      else { $("#verticalscheckCreate").prop('checked', false); };

      if (outletsView === true) { $("#outletscheckView").prop('checked', true); }
      else { $("#outletscheckView").prop('checked', false) };
      if (outletsUpdate === true) { $("#outletscheckUpdate").prop('checked', true); }
      else { $("#outletscheckUpdate").prop('checked', false); };
      if (outletsDelete === true) { $("#outletscheckDelete").prop('checked', true); }
      else { $("#outletscheckDelete").prop('checked', false); };
      if (outletsCreate === true) { $("#outletscheckCreate").prop('checked', true); }
      else { $("#outletscheckCreate").prop('checked', false); };

      if (sdOutletsView === true) { $("#sdOutletscheckView").prop('checked', true); }
      else { $("#sdOutletscheckView").prop('checked', false) };
      if (sdOutletsUpdate === true) { $("#sdOutletscheckUpdate").prop('checked', true); }
      else { $("#sdOutletscheckUpdate").prop('checked', false); };
      if (sdOutletsDelete === true) { $("#sdOutletscheckDelete").prop('checked', true); }
      else { $("#sdOutletscheckDelete").prop('checked', false); };
      if (sdOutletsCreate === true) { $("#sdOutletscheckCreate").prop('checked', true); }
      else { $("#sdOutletscheckCreate").prop('checked', false); };

      if (cashSalesView === true) { $("#cashSalescheckView").prop('checked', true); }
      else { $("#cashSalescheckView").prop('checked', false) };
      if (cashSalesUpdate === true) { $("#cashSalescheckUpdate").prop('checked', true); }
      else { $("#cashSalescheckUpdate").prop('checked', false); };
      if (cashSalesDelete === true) { $("#cashSalescheckDelete").prop('checked', true); }
      else { $("#cashSalescheckDelete").prop('checked', false); };
      if (cashSalesCreate === true) { $("#cashSalescheckCreate").prop('checked', true); }
      else { $("#cashSalescheckCreate").prop('checked', false); };


      if (creditSaleView === true) { $("#creditSalecheckView").prop('checked', true); }
      else { $("#creditSalecheckView").prop('checked', false) };
      if (creditSaleUpdate === true) { $("#creditSalecheckUpdate").prop('checked', true); }
      else { $("#creditSalecheckUpdate").prop('checked', false); };
      if (creditSaleDelete === true) { $("#creditSalecheckDelete").prop('checked', true); }
      else { $("#creditSalecheckDelete").prop('checked', false); };
      if (creditSaleCreate === true) { $("#creditSalecheckCreate").prop('checked', true); }
      else { $("#creditSalecheckCreate").prop('checked', false); };

      if (brandView === true) { $("#brandcheckView").prop('checked', true); }
      else { $("#brandcheckView").prop('checked', false) };
      if (brandUpdate === true) { $("#brandcheckUpdate").prop('checked', true); }
      else { $("#brandcheckUpdate").prop('checked', false); };
      if (brandDelete === true) { $("#brandcheckDelete").prop('checked', true); }
      else { $("#brandcheckDelete").prop('checked', false); };
      if (brandCreate === true) { $("#brandcheckCreate").prop('checked', true); }
      else { $("#brandcheckCreate").prop('checked', false); };

      if (categoryView === true) { $("#categorycheckView").prop('checked', true); }
      else { $("#categorycheckView").prop('checked', false) };
      if (categoryUpdate === true) { $("#categorycheckUpdate").prop('checked', true); }
      else { $("#categorycheckUpdate").prop('checked', false); };
      if (categoryDelete === true) { $("#categorycheckDelete").prop('checked', true); }
      else { $("#categorycheckDelete").prop('checked', false); };
      if (categoryCreate === true) { $("#categorycheckCreate").prop('checked', true); }
      else { $("#categorycheckCreate").prop('checked', false); };


      if (cashSalesReportView === true) { $("#cashSalesRepEditchecking").prop('checked', true); }
      else { $("#cashSalesRepEditchecking").prop('checked', false) };

      if (sdMasterView === true) { $("#sdMastercheckView").prop('checked', true); }
      else { $("#sdMastercheckView").prop('checked', false) };
      if (sdMasterUpdate === true) { $("#sdMastercheckUpdate").prop('checked', true); }
      else { $("#sdMastercheckUpdate").prop('checked', false); };

      if (sdMasterDelete === true) { $("#sdMastercheckDelete").prop('checked', true); }
      else { $("#sdMastercheckDelete").prop('checked', false); };
      if (sdMasterCreate === true) { $("#sdMastercheckCreate").prop('checked', true); }
      else { $("#sdMastercheckCreate").prop('checked', false); };

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

      if (orderView === true) { $("#ordercheckView").prop('checked', true); }
      else { $("#ordercheckView").prop('checked', false); };
      if (orderCreate === true) { $("#ordercheckCreate").prop('checked', true); }
      else { $("#ordercheckCreate").prop('checked', false); };

      if (salesDashboard === true) { $("#sdashboardView").prop('checked', true); }
      else { $("#sdashboardView").prop('checked', false); };

      if (adminDashboard === true) { $("#adashboardView").prop('checked', true); }
      else { $("#adashboardView").prop('checked', false); };

      if (superAdminDashboard === true) { $("#superAdmindashboardView").prop('checked', true); }
      else { $("#superAdmindashboardView").prop('checked', false); };

      // code 22062021

      if (branchView === true) { $("#branchcheckView").prop('checked', true); }
      else { $("#branchcheckView").prop('checked', false); };
      if (branchCreate === true) { $("#branchcheckCreate").prop('checked', true); }
      else { $("#branchcheckCreate").prop('checked', false); };
      if (branchUpdate === true) { $("#branchcheckUpdate").prop('checked', true); }
      else { $("#branchcheckUpdate").prop('checked', false); };
      if (branchDelete === true) { $("#branchcheckDelete").prop('checked', true); }
      else { $("#branchcheckDelete").prop('checked', false); };

      if (locationView === true) { $("#locationcheckView").prop('checked', true); }
      else { $("#locationcheckView").prop('checked', false); };
      if (locationCreate === true) { $("#locationcheckCreate").prop('checked', true); }
      else { $("#locationcheckCreate").prop('checked', false); };
      if (locationUpdate === true) { $("#locationcheckUpdate").prop('checked', true); }
      else { $("#locationcheckUpdate").prop('checked', false); };
      if (locationDelete === true) { $("#locationcheckDelete").prop('checked', true); }
      else { $("#locationcheckDelete").prop('checked', false); };

      if (priceTypeView === true) { $("#priceTypecheckView").prop('checked', true); }
      else { $("#priceTypecheckView").prop('checked', false); };
      if (priceTypeCreate === true) { $("#priceTypecheckCreate").prop('checked', true); }
      else { $("#priceTypecheckCreate").prop('checked', false); };
      if (priceTypeUpdate === true) { $("#priceTypecheckUpdate").prop('checked', true); }
      else { $("#priceTypecheckUpdate").prop('checked', false); };
      if (priceTypeDelete === true) { $("#priceTypecheckDelete").prop('checked', true); }
      else { $("#priceTypecheckDelete").prop('checked', false); };

      if (productView === true) { $("#productcheckView").prop('checked', true); }
      else { $("#productcheckView").prop('checked', false); };
      if (productCreate === true) { $("#productcheckCreate").prop('checked', true); }
      else { $("#productcheckCreate").prop('checked', false); };
      if (productUpdate === true) { $("#productcheckUpdate").prop('checked', true); }
      else { $("#productcheckUpdate").prop('checked', false); };
      if (productDelete === true) { $("#productcheckDelete").prop('checked', true); }
      else { $("#productcheckDelete").prop('checked', false); };

      if (unitView === true) { $("#unitcheckView").prop('checked', true); }
      else { $("#unitcheckView").prop('checked', false); };
      if (unitCreate === true) { $("#unitcheckCreate").prop('checked', true); }
      else { $("#unitcheckCreate").prop('checked', false); };
      if (unitUpdate === true) { $("#unitcheckUpdate").prop('checked', true); }
      else { $("#unitcheckUpdate").prop('checked', false); };
      if (unitDelete === true) { $("#unitcheckDelete").prop('checked', true); }
      else { $("#unitcheckDelete").prop('checked', false); };

      if (priceView === true) { $("#pricecheckView").prop('checked', true); }
      else { $("#pricecheckView").prop('checked', false); };
      if (priceCreate === true) { $("#pricecheckCreate").prop('checked', true); }
      else { $("#pricecheckCreate").prop('checked', false); };
      if (priceUpdate === true) { $("#pricecheckUpdate").prop('checked', true); }
      else { $("#pricecheckUpdate").prop('checked', false); };
      if (priceDelete === true) { $("#pricecheckDelete").prop('checked', true); }
      else { $("#pricecheckDelete").prop('checked', false); };

      if (taxView === true) { $("#taxcheckView").prop('checked', true); }
      else { $("#taxcheckView").prop('checked', false); };
      if (taxCreate === true) { $("#taxcheckCreate").prop('checked', true); }
      else { $("#taxcheckCreate").prop('checked', false); };
      if (taxUpdate === true) { $("#taxcheckUpdate").prop('checked', true); }
      else { $("#taxcheckUpdate").prop('checked', false); };
      if (taxDelete === true) { $("#taxcheckDelete").prop('checked', true); }
      else { $("#taxcheckDelete").prop('checked', false); };

      if (administrationView === true) { $("#administrationcheckView").prop('checked', true); }
      else { $("#administrationcheckView").prop('checked', false); };

      if (sdPriceListView === true) { $("#SdPriceListcheckView").prop('checked', true); }
      else { $("#SdPriceListcheckView").prop('checked', false); };

      // code 22062021
      if (deliveryListView === true) { $("#deliveryListcheckView").prop('checked', true); }
      else { $("#deliveryListcheckView").prop('checked', false); };
      if (deliveryUpdate === true) { $("#deliveryListcheckUpdate").prop('checked', true); }
      else { $("#deliveryListcheckUpdate").prop('checked', false); };

      if (collectionListView === true) { $("#collectionListcheckView").prop('checked', true); }
      else { $("#collectionListcheckView").prop('checked', false); };
      if (collectionUpdate === true) { $("#collectionListcheckUpdate").prop('checked', true); }
      else { $("#collectionListcheckUpdate").prop('checked', false); };

      if (orderApprove === true) { $("#orderApListcheckView").prop('checked', true); }
      else { $("#orderApListcheckView").prop('checked', false); };

      if (orderReport === true) { $("#orderReportcheckView").prop('checked', true); }
      else { $("#orderReportcheckView").prop('checked', false); };


      if (creditSaleReport === true) { $("#creditSaleReportcheckView").prop('checked', true); }
      else { $("#creditSaleReportcheckView").prop('checked', false); };

      if (sdUserStockHistoryView === true) { $("#sdUserStockHistory1checking").prop('checked', true); }
      else { $("#sdUserStockHistory1checking").prop('checked', false); };

      if (sdUserStockSummaryView === true) { $("#sdUserStockSummary1checking").prop('checked', true); }
      else { $("#sdUserStockSummary1checking").prop('checked', false); };

      if (verticalSaleReportview === true) { $("#verticalSaleReport1checking").prop('checked', true); }
      else { $("#verticalSaleReport1checking").prop('checked', false); };

      if (sdReportsView === true) { $("#sdReports1checking").prop('checked', true); }
      else { $("#sdReports1checking").prop('checked', false); };

      if (bdmReportsView === true) { $("#bdmReports1checking").prop('checked', true); }
      else { $("#bdmReports1checking").prop('checked', false); };

      if (bhReportsView === true) { $("#bhReports1checking").prop('checked', true); }
      else { $("#bhReports1checking").prop('checked', false); };


      if ($(".historySelect").length === $(".historySelect:checked").length)
        $("#historychecks").prop('checked', true);
      else
        $("#historychecks").prop('checked', false);

      if ($(".sdUserApproveSelect").length === $(".sdUserApproveSelect:checked").length)
        $("#sdUserApprovechecks").prop('checked', true);
      else
        $("#sdUserApprovechecks").prop('checked', false);

      if ($(".superAdminSelect").length === $(".superAdminSelect:checked").length)
        $("#superAdminchecks").prop('checked', true);
      else
        $("#superAdminchecks").prop('checked', false);

      if ($(".businessHeadSelect").length === $(".businessHeadSelect:checked").length)
        $("#businessHeadchecks").prop('checked', true);
      else
        $("#businessHeadchecks").prop('checked', false);

      if ($(".bdmSelect").length === $(".bdmSelect:checked").length)
        $("#bdmchecks").prop('checked', true);
      else
        $("#bdmchecks").prop('checked', false);

      if ($(".coordinatorSelect").length === $(".coordinatorSelect:checked").length)
        $("#coordinatorchecks").prop('checked', true);
      else
        $("#coordinatorchecks").prop('checked', false);

      if ($(".sdSelect").length === $(".sdSelect:checked").length)
        $("#sdchecks").prop('checked', true);
      else
        $("#sdchecks").prop('checked', false);

      if ($(".vsrSelect").length === $(".vsrSelect:checked").length)
        $("#vsrchecks").prop('checked', true);
      else
        $("#vsrchecks").prop('checked', false);

      if ($(".omrSelect").length === $(".omrSelect:checked").length)
        $("#omrchecks").prop('checked', true);
      else
        $("#omrchecks").prop('checked', false);

      if ($(".wseSelect").length === $(".wseSelect:checked").length)
        $("#wsechecks").prop('checked', true);
      else
        $("#wsechecks").prop('checked', false);

      if ($(".reportSelect").length === $(".reportSelect:checked").length)
        $("#reportchecks").prop('checked', true);
      else
        $("#reportchecks").prop('checked', false);

      if ($(".stockTransferSelect").length === $(".stockTransferSelect:checked").length)
        $("#stockTransferchecks").prop('checked', true);
      else
        $("#stockTransferchecks").prop('checked', false);


      if ($(".stockListSelect").length === $(".stockListSelect:checked").length)
        $("#stockListchecks").prop('checked', true);
      else
        $("#stockListchecks").prop('checked', false);


      if ($(".outletsApproveSelect").length === $(".outletsApproveSelect:checked").length)
        $("#outletsApprovechecks").prop('checked', true);
      else
        $("#outletsApprovechecks").prop('checked', false);

      if ($(".routeAssignSelect").length === $(".routeAssignSelect:checked").length)
        $("#routeAssignchecks").prop('checked', true);
      else
        $("#routeAssignchecks").prop('checked', false);

      if ($(".attendanceSelect").length === $(".attendanceSelect:checked").length)
        $("#attendancechecks").prop('checked', true);
      else
        $("#attendancechecks").prop('checked', false);

      if ($(".stockAcceptSelect").length === $(".stockAcceptSelect:checked").length)
        $("#stockAcceptchecks").prop('checked', true);
      else
        $("#stockAcceptchecks").prop('checked', false);

      if ($(".stockReportSelect").length === $(".stockReportSelect:checked").length)
        $("#stockReportchecks").prop('checked', true);
      else
        $("#stockReportchecks").prop('checked', false);

      if ($(".outletTrackerSelect").length === $(".outletTrackerSelect:checked").length)
        $("#outletTrackerchecks").prop('checked', true);
      else
        $("#outletTrackerchecks").prop('checked', false);

      if ($(".stockReturnSelect").length === $(".stockReturnSelect:checked").length)
        $("#stockReturnchecks").prop('checked', true);
      else
        $("#stockReturnchecks").prop('checked', false);

      if ($(".stockSummarySelect").length === $(".stockSummarySelect:checked").length)
        $("#stockSummarychecks").prop('checked', true);
      else
        $("#stockSummarychecks").prop('checked', false);

      if ($(".userSelect").length === $(".userSelect:checked").length)
        $("#userschecks").prop('checked', true);
      else
        $("#userschecks").prop('checked', false);

      if ($(".masterDataSelect").length === $(".masterDataSelect:checked").length)
        $("#masterDatachecks").prop('checked', true);
      else
        $("#masterDatachecks").prop('checked', false);

      if ($(".routeSelect").length === $(".routeSelect:checked").length)
        $("#routechecks").prop('checked', true);
      else
        $("#routechecks").prop('checked', false);

      if ($(".verticalsSelect").length === $(".verticalsSelect:checked").length)
        $("#verticalschecks").prop('checked', true);
      else
        $("#verticalschecks").prop('checked', false);

      if ($(".sdMasterSelect").length === $(".sdMasterSelect:checked").length)
        $("#sdMasterchecks").prop('checked', true);
      else
        $("#sdMasterchecks").prop('checked', false);

      if ($(".outletsSelect").length === $(".outletsSelect:checked").length)
        $("#outletschecks").prop('checked', true);
      else
        $("#outletschecks").prop('checked', false);

      if ($(".sdOutletsSelect").length === $(".sdOutletsSelect:checked").length)
        $("#sdOutletschecks").prop('checked', true);
      else
        $("#sdOutletschecks").prop('checked', false);

      if ($(".cashSalesSelect").length === $(".cashSalesSelect:checked").length)
        $("#cashSaleschecks").prop('checked', true);
      else
        $("#cashSaleschecks").prop('checked', false);

      if ($(".creditSaleSelect").length === $(".creditSaleSelect:checked").length)
        $("#creditSalechecks").prop('checked', true);
      else
        $("#creditSalechecks").prop('checked', false);

      if ($(".brandSelect").length === $(".brandSelect:checked").length)
        $("#brandchecks").prop('checked', true);
      else
        $("#brandchecks").prop('checked', false);

      if ($(".categorySelect").length === $(".categorySelect:checked").length)
        $("#categorychecks").prop('checked', true);
      else
        $("#categorychecks").prop('checked', false);

      if ($(".vanSaleUsersSelect").length === $(".vanSaleUsersSelect:checked").length)
        $("#vanSaleUserschecks").prop('checked', true);
      else
        $("#vanSaleUserschecks").prop('checked', false);

      if ($(".roleSelect").length === $(".roleSelect:checked").length)
        $("#rolechecks").prop('checked', true);
      else
        $("#rolechecks").prop('checked', false);
      if ($(".sdashboardSelect").length === $(".sdashboardSelect:checked").length)
        $("#sdashboardchecks").prop('checked', true);
      else
        $("#sdashboardchecks").prop('checked', false);

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
      // code 22062021
      if ($(".branchelect").length === $(".branchelect:checked").length)
        $("#branchchecks").prop('checked', true);
      else
        $("#branchchecks").prop('checked', false);
      if ($(".locationelect").length === $(".locationelect:checked").length)
        $("#locationchecks").prop('checked', true);
      else
        $("#locationchecks").prop('checked', false);
      if ($(".priceTypeelect").length === $(".priceTypeelect:checked").length)
        $("#priceTypechecks").prop('checked', true);
      else
        $("#priceTypechecks").prop('checked', false);

      if ($(".productelect").length === $(".productelect:checked").length)
        $("#productchecks").prop('checked', true);
      else
        $("#productchecks").prop('checked', false);
      if ($(".unitelect").length === $(".unitelect:checked").length)
        $("#unitchecks").prop('checked', true);
      else
        $("#unitchecks").prop('checked', false);
      if ($(".priceelect").length === $(".priceelect:checked").length)
        $("#pricechecks").prop('checked', true);
      else
        $("#pricechecks").prop('checked', false);

      if ($(".taxelect").length === $(".taxelect:checked").length)
        $("#taxchecks").prop('checked', true);
      else
        $("#taxchecks").prop('checked', false);

      if ($(".administrationselect").length === $(".administrationselect:checked").length)
        $("#administrationchecks").prop('checked', true);
      else
        $("#administrationchecks").prop('checked', false);

      if ($(".SdPriceListselect").length === $(".SdPriceListselect:checked").length)
        $("#SdPriceListchecks").prop('checked', true);
      else
        $("#SdPriceListchecks").prop('checked', false);

      if ($(".deliveryListselect").length === $(".deliveryListselect:checked").length)
        $("#deliveryListchecks").prop('checked', true);
      else
        $("#deliveryListchecks").prop('checked', false);

      if ($(".collectionListselect").length === $(".collectionListselect:checked").length)
        $("#collectionListchecks").prop('checked', true);
      else
        $("#collectionListchecks").prop('checked', false);

      if ($(".orderApListselect").length === $(".orderApListselect:checked").length)
        $("#orderApListchecks").prop('checked', true);
      else
        $("#orderApListchecks").prop('checked', false);

      if ($(".cashSalesRepEditSelections").length === $(".cashSalesRepEditSelections:checked").length)
        $("#cashSalesRepEditcheck").prop('checked', true);
      else
        $("#cashSalesRepEditcheck").prop('checked', false);

      if ($(".orderReportselect").length === $(".orderReportselect:checked").length)
        $("#orderReportchecks").prop('checked', true);
      else
        $("#orderReportchecks").prop('checked', false);


      if ($(".creditSaleReportselect").length === $(".creditSaleReportselect:checked").length)
        $("#creditSaleReportchecks").prop('checked', true);
      else
        $("#creditSaleReportchecks").prop('checked', false);

      if ($(".sdUserStockHistory1Selections").length === $(".sdUserStockHistory1Selections:checked").length)
        $("#sdUserStockHistory1check").prop('checked', true);
      else
        $("#sdUserStockHistory1check").prop('checked', false);

      if ($(".sdUserStockSummary1Selections").length === $(".sdUserStockSummary1Selections:checked").length)
        $("#sdUserStockSummary1check").prop('checked', true);
      else
        $("#sdUserStockSummary1check").prop('checked', false);

      if ($(".verticalSaleReport1Selections").length === $(".verticalSaleReport1Selections:checked").length)
        $("#verticalSaleReport1check").prop('checked', true);
      else
        $("#verticalSaleReport1check").prop('checked', false);


      if ($(".sdReports1Selections").length === $(".sdReports1Selections:checked").length)
        $("#sdReports1check").prop('checked', true);
      else
        $("#sdReports1check").prop('checked', false);

      if ($(".bdmReports1Selections").length === $(".bdmReports1Selections:checked").length)
        $("#bdmReports1check").prop('checked', true);
      else
        $("#bdmReports1check").prop('checked', false);


      if ($(".bhReports1Selections").length === $(".bhReports1Selections:checked").length)
        $("#bhReports1check").prop('checked', true);
      else
        $("#bhReports1check").prop('checked', false);


      // code 22062021
    });
  },

  /**
       * TODO: Complete JS doc
       * @param event
       */
  'submit .role-update': (event) => {
    event.preventDefault();
    updateRole(event.target);
    $('#ic-edit').modal('hide');
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
  },


  /**
  * TODO:Complete JS doc
  */
  'click #exportButtons': (event, template) => {
    event.preventDefault();
    $('#activeUserId').html('');
    $('#inActiveUserId').html('');
    Meteor.call('roles.getUserExport', (err, res) => {
      if (!err) {
        if (res.length > 0) {
          template.orderByDateExport.set(res[0].userListArray);
          $('#activeUserId').html(res[0].activeUser);
          $('#inActiveUserId').html(res[0].inActiveUser);
          $("#exportButtons").prop('disabled', true);
          Meteor.setTimeout(() => {
            let uri = 'data:application/vnd.ms-excel;base64,',
              templates = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
              base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
              },
              format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                  return c[p];
                });
              }
            let toExcel = document.getElementById("exportTodayOrder").innerHTML;
            let ctx = {
              worksheet: name || 'Excel',
              table: toExcel
            };
            //return a promise that resolves with a File instance
            function urltoFile(url, filename, mimeType) {
              return (fetch(url)
                .then(function (res) { return res.arrayBuffer(); })
                .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
              );
            };

            //Usage example:
            urltoFile(uri + base64(format(templates, ctx)), 'hello.xls', 'text/csv')
              .then(function (file) {

                saveAs(file, "User Details(" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
              });
            $("#exportButtons").prop('disabled', false);
          }, 5000);
        }
      }
      else {
        template.orderByDateExport.set('');
        toastr["error"]('No Records Found');
        $('#activeUserId').html('');
        $('#inActiveUserId').html('');
      }
    });
  },

  /**
* TODO:Complete JS doc
*/
  'click #exportButtons2': (event, template) => {
    event.preventDefault();
    template.userTransactionsExport.set('');
    Meteor.call('roles.getTransactionDetails', (err, res) => {
      if (!err) {
        if (res.length > 0) {
          template.userTransactionsExport.set(res);
          $("#exportButtons2").prop('disabled', true);
          Meteor.setTimeout(() => {
            let uri = 'data:application/vnd.ms-excel;base64,',
              templates = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
              base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
              },
              format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                  return c[p];
                });
              }
            let toExcel = document.getElementById("exportTodayOrder1").innerHTML;
            let ctx = {
              worksheet: name || 'Excel',
              table: toExcel
            };
            //return a promise that resolves with a File instance
            function urltoFile(url, filename, mimeType) {
              return (fetch(url)
                .then(function (res) { return res.arrayBuffer(); })
                .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
              );
            };

            //Usage example:
            urltoFile(uri + base64(format(templates, ctx)), 'hello.xls', 'text/csv')
              .then(function (file) {

                saveAs(file, "User Transaction Details(" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
              });
            $("#exportButtons2").prop('disabled', false);
          }, 5000);
        }
      }
      else {
        template.userTransactionsExport.set('');
        toastr["error"]('No Records Found');
      }
    });
  }
});