/**
 * @author Nithin
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
  $("#rolesUnder").val('').trigger('change');
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

  $('.rolesUnder').select2({
    placeholder: "Select Value",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".rolesUnder").parent(),
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
  'click #sdUserApprovecheck': () => {
    if ($("#sdUserApprovecheck").prop("checked") === true) {
      $("#sdUserApprovechecking").prop('checked', true);
    } else {
      $("#sdUserApprovechecking").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #superAdmincheck': () => {
    if ($("#superAdmincheck").prop("checked") === true) {
      $("#superAdminchecking").prop('checked', true);
    } else {
      $("#superAdminchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #businessHeadcheck': () => {
    if ($("#businessHeadcheck").prop("checked") === true) {
      $("#businessHeadchecking").prop('checked', true);
    } else {
      $("#businessHeadchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #bdmcheck': () => {
    if ($("#bdmcheck").prop("checked") === true) {
      $("#bdmchecking").prop('checked', true);
    } else {
      $("#bdmchecking").prop('checked', false);
    }
  },
'click #bhcheck': () => {
    if ($("#bhcheck").prop("checked") === true) {
      $("#bhchecking").prop('checked', true);
    } else {
      $("#bhchecking").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #coordinatorcheck': () => {
    if ($("#coordinatorcheck").prop("checked") === true) {
      $("#coordinatorchecking").prop('checked', true);
    } else {
      $("#coordinatorchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #sdcheck': () => {
    if ($("#sdcheck").prop("checked") === true) {
      $("#sdchecking").prop('checked', true);
    } else {
      $("#sdchecking").prop('checked', false);
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
  'click #stockTransfercheck': () => {
    if ($("#stockTransfercheck").prop("checked") === true) {
      $("#stockTransferchecking").prop('checked', true);
    } else {
      $("#stockTransferchecking").prop('checked', false);
    }
  },
  /**
 * TODO:Complete JS doc
 */
  'click #stockListcheck': () => {
    if ($("#stockListcheck").prop("checked") === true) {
      $("#stockListchecking").prop('checked', true);
    } else {
      $("#stockListchecking").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #outletsApprovecheck': () => {
    if ($("#outletsApprovecheck").prop("checked") === true) {
      $("#outletsApprovechecking").prop('checked', true);
    } else {
      $("#outletsApprovechecking").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #routeAssigncheck': () => {
    if ($("#routeAssigncheck").prop("checked") === true) {
      $("#routeAssignchecking").prop('checked', true);
    } else {
      $("#routeAssignchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #attendancecheck': () => {
    if ($("#attendancecheck").prop("checked") === true) {
      $("#attendancechecking").prop('checked', true);
    } else {
      $("#attendancechecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #stockAcceptcheck': () => {
    if ($("#stockAcceptcheck").prop("checked") === true) {
      $("#stockAcceptchecking").prop('checked', true);
    } else {
      $("#stockAcceptchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #stockReportcheck': () => {
    if ($("#stockReportcheck").prop("checked") === true) {
      $("#stockReportchecking").prop('checked', true);
    } else {
      $("#stockReportchecking").prop('checked', false);
    }
  },
    /**
* TODO:Complete JS doc
*/
'click #outletTrackercheck': () => {
  if ($("#outletTrackercheck").prop("checked") === true) {
    $("#soutletTrackerchecking").prop('checked', true);
  } else {
    $("#outletTrackerchecking").prop('checked', false);
  }
},
  /**
* TODO:Complete JS doc
*/
  'click #stockReturncheck': () => {
    if ($("#stockReturncheck").prop("checked") === true) {
      $("#stockReturnchecking").prop('checked', true);
    } else {
      $("#stockReturnchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #stockSummarycheck': () => {
    if ($("#stockSummarycheck").prop("checked") === true) {
      $("#stockSummarychecking").prop('checked', true);
    } else {
      $("#stockSummarychecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #vsrcheck': () => {
    if ($("#vsrcheck").prop("checked") === true) {
      $("#vsrchecking").prop('checked', true);
    } else {
      $("#vsrchecking").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #wsecheck': () => {
    if ($("#wsecheck").prop("checked") === true) {
      $("#wsechecking").prop('checked', true);
    } else {
      $("#wsechecking").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #omrcheck': () => {
    if ($("#omrcheck").prop("checked") === true) {
      $("#omrchecking").prop('checked', true);
    } else {
      $("#omrchecking").prop('checked', false);
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
  'click #verticalscheck': () => {
    if ($("#verticalscheck").prop("checked") === true) {
      $("#verticalschecking").prop('checked', true);
      $("#verticalscheckin").prop('checked', true);
      $("#verticalschecki").prop('checked', true);
      $("#verticalscheckings").prop('checked', true);
    } else {
      $("#verticalschecking").prop('checked', false);
      $("#verticalscheckin").prop('checked', false);
      $("#verticalschecki").prop('checked', false);
      $("#verticalscheckings").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #sdMastercheck': () => {
    if ($("#sdMastercheck").prop("checked") === true) {
      $("#sdMasterchecking").prop('checked', true);
      $("#sdMastercheckin").prop('checked', true);
      $("#sdMasterchecki").prop('checked', true);
      $("#sdMastercheckings").prop('checked', true);
    } else {
      $("#sdMasterchecking").prop('checked', false);
      $("#sdMastercheckin").prop('checked', false);
      $("#sdMasterchecki").prop('checked', false);
      $("#sdMastercheckings").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #outletscheck': () => {
    if ($("#outletscheck").prop("checked") === true) {
      $("#outletschecking").prop('checked', true);
      $("#outletscheckin").prop('checked', true);
      $("#outletschecki").prop('checked', true);
      $("#outletscheckings").prop('checked', true);
    } else {
      $("#outletschecking").prop('checked', false);
      $("#outletscheckin").prop('checked', false);
      $("#outletschecki").prop('checked', false);
      $("#outletscheckings").prop('checked', false);
    }
  },

  /**
* TODO:Complete JS doc
*/
  'click #sdOutletscheck': () => {
    if ($("#sdOutletscheck").prop("checked") === true) {
      $("#sdOutletschecking").prop('checked', true);
      $("#sdOutletscheckin").prop('checked', true);
      $("#sdOutletschecki").prop('checked', true);
      $("#sdOutletscheckings").prop('checked', true);
    } else {
      $("#sdOutletschecking").prop('checked', false);
      $("#sdOutletscheckin").prop('checked', false);
      $("#sdOutletschecki").prop('checked', false);
      $("#sdOutletscheckings").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #cashSalescheck': () => {
    if ($("#cashSalescheck").prop("checked") === true) {
      $("#cashSaleschecking").prop('checked', true);
      $("#cashSalescheckin").prop('checked', true);
      $("#cashSaleschecki").prop('checked', true);
      $("#cashSalescheckings").prop('checked', true);
    } else {
      $("#cashSaleschecking").prop('checked', false);
      $("#cashSalescheckin").prop('checked', false);
      $("#cashSaleschecki").prop('checked', false);
      $("#cashSalescheckings").prop('checked', false);
    }
  },
  /**
* TODO:Complete JS doc
*/
  'click #creditSalecheck': () => {
    if ($("#creditSalecheck").prop("checked") === true) {
      $("#creditSalechecking").prop('checked', true);
      $("#creditSalecheckin").prop('checked', true);
      $("#creditSalechecki").prop('checked', true);
      $("#creditSalecheckings").prop('checked', true);
    } else {
      $("#creditSalechecking").prop('checked', false);
      $("#creditSalecheckin").prop('checked', false);
      $("#creditSalechecki").prop('checked', false);
      $("#creditSalecheckings").prop('checked', false);
    }
  },
    /**
* TODO:Complete JS doc
*/
'click #brandcheck': () => {
  if ($("#brandcheck").prop("checked") === true) {
    $("#brandchecking").prop('checked', true);
    $("#brandcheckin").prop('checked', true);
    $("#brandchecki").prop('checked', true);
    $("#brandcheckings").prop('checked', true);
  } else {
    $("#brandchecking").prop('checked', false);
    $("#brandcheckin").prop('checked', false);
    $("#brandchecki").prop('checked', false);
    $("#brandcheckings").prop('checked', false);
  }
},
    /**
* TODO:Complete JS doc
*/
'click #categorycheck': () => {
  if ($("#categorycheck").prop("checked") === true) {
    $("#categorychecking").prop('checked', true);
    $("#categorycheckin").prop('checked', true);
    $("#categorychecki").prop('checked', true);
    $("#categorycheckings").prop('checked', true);
  } else {
    $("#categorychecking").prop('checked', false);
    $("#categorycheckin").prop('checked', false);
    $("#categorychecki").prop('checked', false);
    $("#categorycheckings").prop('checked', false);
  }
},
'click #sdUserStockHistorycheck': () => {
  if ($("#sdUserStockHistorycheck").prop("checked") === true) {
    $("#sdUserStockHistorychecking").prop('checked', true);
  } else {
    $("#sdUserStockHistorychecking").prop('checked', false);
  }
},
'click #sdUserStockSummarycheck': () => {
  if ($("#sdUserStockSummarycheck").prop("checked") === true) {
    $("#sdUserStockSummarychecking").prop('checked', true);
  } else {
    $("#sdUserStockSummarychecking").prop('checked', false);
  }
  },
  'click #verticalSaleReportcheck': () => {
  if ($("#verticalSaleReportcheck").prop("checked") === true) {
    $("#verticalSaleReportchecking").prop('checked', true);
  } else {
    $("#verticalSaleReportchecking").prop('checked', false);
  }
  },
'click #sdReportscheck': () => {
  if ($("#sdReportscheck").prop("checked") === true) {
    $("#sdReportschecking").prop('checked', true);
  } else {
    $("#sdReportschecking").prop('checked', false);
  }
  },
  'click #bdmReportscheck': () => {
  if ($("#bdmReportscheck").prop("checked") === true) {
    $("#bdmReportschecking").prop('checked', true);
  } else {
    $("#bdmReportschecking").prop('checked', false);
  }
  },
  'click #bhReportscheck': () => {
  if ($("#bhReportscheck").prop("checked") === true) {
    $("#bhReportschecking").prop('checked', true);
  } else {
    $("#bhReportschecking").prop('checked', false);
  }
  }
  ,
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
  'click #cashSalesReportcheck': () => {
    if ($("#cashSalesReportcheck").prop("checked") === true) {
      $("#cashSalesReportchecking").prop('checked', true);

    } else {
      $("#cashSalesReportchecking").prop('checked', false);

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
 * TODO: Complete JS doc
 */
  'click #branchchecks1': () => {
    if ($("#branchchecks1").prop("checked") === true) {
      $("#branchcheckView1").prop('checked', true);
      $("#branchcheckCreate1").prop('checked', true);
      $("#branchcheckUpdate1").prop('checked', true);
      $("#branchcheckDelete1").prop('checked', true);
    } else {
      $("#branchcheckView1").prop('checked', false);
      $("#branchcheckCreate1").prop('checked', false);
      $("#branchcheckUpdate1").prop('checked', false);
      $("#branchcheckDelete1").prop('checked', false);
    }
  },

  /**
 * TODO: Complete JS doc
 */
  'click #locationchecks1': () => {
    if ($("#locationchecks1").prop("checked") === true) {
      $("#locationcheckView1").prop('checked', true);
      $("#locationcheckCreate1").prop('checked', true);
      $("#locationcheckUpdate1").prop('checked', true);
      $("#locationcheckDelete1").prop('checked', true);
    } else {
      $("#locationcheckView1").prop('checked', false);
      $("#locationcheckCreate1").prop('checked', false);
      $("#locationcheckUpdate1").prop('checked', false);
      $("#locationcheckDelete1").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #priceTypechecks1': () => {
    if ($("#priceTypechecks1").prop("checked") === true) {
      $("#priceTypecheckView1").prop('checked', true);
      $("#priceTypecheckCreate1").prop('checked', true);
      $("#priceTypecheckUpdate1").prop('checked', true);
      $("#priceTypecheckDelete1").prop('checked', true);
    } else {
      $("#priceTypecheckView1").prop('checked', false);
      $("#priceTypecheckCreate1").prop('checked', false);
      $("#priceTypecheckUpdate1").prop('checked', false);
      $("#priceTypecheckDelete1").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #productchecks1': () => {
    if ($("#productchecks1").prop("checked") === true) {
      $("#productcheckView1").prop('checked', true);
      $("#productcheckCreate1").prop('checked', true);
      $("#productcheckUpdate1").prop('checked', true);
      $("#productcheckDelete1").prop('checked', true);
    } else {
      $("#productcheckView1").prop('checked', false);
      $("#productcheckCreate1").prop('checked', false);
      $("#productcheckUpdate1").prop('checked', false);
      $("#productcheckDelete1").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #unitchecks1': () => {
    if ($("#unitchecks1").prop("checked") === true) {
      $("#unitcheckView1").prop('checked', true);
      $("#unitcheckCreate1").prop('checked', true);
      $("#unitcheckUpdate1").prop('checked', true);
      $("#unitcheckDelete1").prop('checked', true);
    } else {
      $("#unitcheckView1").prop('checked', false);
      $("#unitcheckCreate1").prop('checked', false);
      $("#unitcheckUpdate1").prop('checked', false);
      $("#unitcheckDelete1").prop('checked', false);
    }
  },
  /**
  * TODO: Complete JS doc
  */
  'click #pricechecks1': () => {
    if ($("#pricechecks1").prop("checked") === true) {
      $("#pricecheckView1").prop('checked', true);
      $("#pricecheckCreate1").prop('checked', true);
      $("#pricecheckUpdate1").prop('checked', true);
      $("#pricecheckDelete1").prop('checked', true);
    } else {
      $("#pricecheckView1").prop('checked', false);
      $("#pricecheckCreate1").prop('checked', false);
      $("#pricecheckUpdate1").prop('checked', false);
      $("#pricecheckDelete1").prop('checked', false);
    }
  },

  /**
  * TODO: Complete JS doc
  */
  'click #taxchecks1': () => {
    if ($("#taxchecks1").prop("checked") === true) {
      $("#taxcheckView1").prop('checked', true);
      $("#taxcheckCreate1").prop('checked', true);
      $("#taxcheckUpdate1").prop('checked', true);
      $("#taxcheckDelete1").prop('checked', true);
    } else {
      $("#taxcheckView1").prop('checked', false);
      $("#taxcheckCreate1").prop('checked', false);
      $("#taxcheckUpdate1").prop('checked', false);
      $("#taxcheckDelete1").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #SdPriceListchecks1': () => {
    if ($("#SdPriceListchecks1").prop("checked") === true) {
      $("#SdPriceListcheckView1").prop('checked', true);

    } else {
      $("#SdPriceListcheckView1").prop('checked', false);

    }
  },/**
* TODO: Complete JS doc
*/
  'click #deliveryListchecks1': () => {
    if ($("#deliveryListchecks1").prop("checked") === true) {
      $("#deliveryListcheckView1").prop('checked', true);
      $("#deliveryListcheckUpdate1").prop('checked', true);

    } else {
      $("#deliveryListcheckView1").prop('checked', false);
      $("#deliveryListcheckUpdate1").prop('checked', false);

    }
  },
  /**
  * TODO: Complete JS doc
  */
  'click #collectionListchecks1': () => {
    if ($("#collectionListchecks1").prop("checked") === true) {
      $("#collectionListcheckView1").prop('checked', true);
      $("#collectionListcheckUpdate1").prop('checked', true);

    } else {
      $("#collectionListcheckView1").prop('checked', false);
      $("#collectionListcheckUpdate1").prop('checked', false);

    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #administrationchecks1': () => {
    if ($("#administrationchecks1").prop("checked") === true) {
      $("#administrationcheckView1").prop('checked', true);
    } else {
      $("#administrationcheckView1").prop('checked', false);
    }
  },
  /**
* TODO: Complete JS doc
*/
  'click #orderApListchecks1': () => {
    if ($("#orderApListchecks1").prop("checked") === true) {
      $("#orderApListcheckView1").prop('checked', true);

    } else {
      $("#orderApListcheckView1").prop('checked', false);

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
* TODO: Complete JS doc
*/
  'click #orderReportchecks1': () => {
    if ($("#orderReportchecks1").prop("checked") === true) {
      $("#orderReportcheckView1").prop('checked', true);

    } else {
      $("#orderReportcheckView1").prop('checked', false);

    }
  },
  /**
      * TODO:Complete JS doc
      */
  'change .orderReportselect1': () => {
    if ($(".orderReportselect1").length === $(".orderReportselect1:checked").length)
      $("#orderReportchecks1").prop('checked', true);
    else
      $("#orderReportchecks1").prop('checked', false);
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
  'change .sdashboardSelections': () => {
    if ($(".sdashboardSelections").length === $(".sdashboardSelections:checked").length)
      $("#sdashboardcheck").prop('checked', true);
    else
      $("#sdashboardcheck").prop('checked', false);
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
  'change .historySelections': () => {
    if ($(".historySelections").length === $(".historySelections:checked").length)
      $("#historycheck").prop('checked', true);
    else
      $("#historycheck").prop('checked', false);
  },

  /**
 * TODO:Complete JS doc
 */
  'change .sdUserApproveSelections': () => {
    if ($(".sdUserApproveSelections").length === $(".sdUserApproveSelections:checked").length)
      $("#sdUserApprovecheck").prop('checked', true);
    else
      $("#sdUserApprovecheck").prop('checked', false);
  },

  /**
* TODO:Complete JS doc
*/
  'change .superAdminSelections': () => {
    if ($(".superAdminSelections").length === $(".superAdminSelections:checked").length)
      $("#superAdmincheck").prop('checked', true);
    else
      $("#superAdmincheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .businessHeadSelections': () => {
    if ($(".businessHeadSelections").length === $(".businessHeadSelections:checked").length)
      $("#businessHeadcheck").prop('checked', true);
    else
      $("#businessHeadcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .bdmSelections': () => {
    if ($(".bdmSelections").length === $(".bdmSelections:checked").length)
      $("#bdmcheck").prop('checked', true);
    else
      $("#bdmcheck").prop('checked', false);
  },'change .bhSelections': () => {
    if ($(".bhSelections").length === $(".bhSelections:checked").length)
      $("#bhcheck").prop('checked', true);
    else
      $("#bhcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .coordinatorSelections': () => {
    if ($(".coordinatorSelections").length === $(".coordinatorSelections:checked").length)
      $("#coordinatorcheck").prop('checked', true);
    else
      $("#coordinatorcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .sdSelections': () => {
    if ($(".sdSelections").length === $(".sdSelections:checked").length)
      $("#sdcheck").prop('checked', true);
    else
      $("#sdcheck").prop('checked', false);
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
  'change .stockTransferSelections': () => {
    if ($(".stockTransferSelections").length === $(".stockTransferSelections:checked").length)
      $("#stockTransfercheck").prop('checked', true);
    else
      $("#stockTransfercheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .stockListSelections': () => {
    if ($(".stockListSelections").length === $(".stockListSelections:checked").length)
      $("#stockListcheck").prop('checked', true);
    else
      $("#stockListcheck").prop('checked', false);
  },


  /**
* TODO:Complete JS doc
*/
  'change .outletsApproveSelections': () => {
    if ($(".outletsApproveSelections").length === $(".outletsApproveSelections:checked").length)
      $("#outletsApprovecheck").prop('checked', true);
    else
      $("#outletsApprovecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .routeAssignSelections': () => {
    if ($(".routeAssignSelections").length === $(".routeAssignSelections:checked").length)
      $("#routeAssigncheck").prop('checked', true);
    else
      $("#routeAssigncheck").prop('checked', false);
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
  'change .stockAcceptSelections': () => {
    if ($(".stockAcceptSelections").length === $(".stockAcceptSelections:checked").length)
      $("#stockAcceptcheck").prop('checked', true);
    else
      $("#stockAcceptcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .stockReportSelections': () => {
    if ($(".stockReportSelections").length === $(".stockReportSelections:checked").length)
      $("#stockReportcheck").prop('checked', true);
    else
      $("#stockReportcheck").prop('checked', false);
  },

    /**
* TODO:Complete JS doc
*/
'change .outletTrackerSelections': () => {
  if ($(".outletTrackerSelections").length === $(".outletTrackerSelections:checked").length)
    $("#outletTrackercheck").prop('checked', true);
  else
    $("#outletTrackercheck").prop('checked', false);
},
  /**
* TODO:Complete JS doc
*/
  'change .stockReturnSelections': () => {
    if ($(".stockReturnSelections").length === $(".stockReturnSelections:checked").length)
      $("#stockReturncheck").prop('checked', true);
    else
      $("#stockReturncheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .stockSummarySelections': () => {
    if ($(".stockSummarySelections").length === $(".stockSummarySelections:checked").length)
      $("#stockSummarycheck").prop('checked', true);
    else
      $("#stockSummarycheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .vsrSelections': () => {
    if ($(".vsrSelections").length === $(".vsrSelections:checked").length)
      $("#vsrcheck").prop('checked', true);
    else
      $("#vsrcheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .wseSelections': () => {
    if ($(".wseSelections").length === $(".wseSelections:checked").length)
      $("#wsecheck").prop('checked', true);
    else
      $("#wsecheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .omrSelections': () => {
    if ($(".omrSelections").length === $(".omrSelections:checked").length)
      $("#omrcheck").prop('checked', true);
    else
      $("#omrcheck").prop('checked', false);
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
  'change .masterDataSelections': () => {
    if ($(".masterDataSelections").length === $(".masterDataSelections:checked").length)
      $("#masterDatacheck").prop('checked', true);
    else
      $("#masterDatacheck").prop('checked', false);
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
  'change .verticalsSelections': () => {
    if ($(".verticalsSelections").length === $(".verticalsSelections:checked").length)
      $("#verticalscheck").prop('checked', true);
    else
      $("#verticalscheck").prop('checked', false);
  },
  /**
  * TODO:Complete JS doc
  */
  'change .sdMasterSelections': () => {
    if ($(".sdMasterSelections").length === $(".sdMasterSelections:checked").length)
      $("#sdMastercheck").prop('checked', true);
    else
      $("#sdMastercheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .outletsSelections': () => {
    if ($(".outletsSelections").length === $(".outletsSelections:checked").length)
      $("#outletscheck").prop('checked', true);
    else
      $("#outletscheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .sdOutletsSelections': () => {
    if ($(".sdOutletsSelections").length === $(".sdOutletsSelections:checked").length)
      $("#sdOutletscheck").prop('checked', true);
    else
      $("#sdOutletscheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .cashSalesSelections': () => {
    if ($(".cashSalesSelections").length === $(".cashSalesSelections:checked").length)
      $("#cashSalescheck").prop('checked', true);
    else
      $("#cashSalescheck").prop('checked', false);
  },
  /**
* TODO:Complete JS doc
*/
  'change .creditSaleSelections': () => {
    if ($(".creditSaleSelections").length === $(".creditSaleSelections:checked").length)
      $("#creditSalecheck").prop('checked', true);
    else
      $("#creditSalecheck").prop('checked', false);
  },
    /**
* TODO:Complete JS doc
*/
'change .brandSelections': () => {
  if ($(".brandSelections").length === $(".brandSelections:checked").length)
    $("#brandcheck").prop('checked', true);
  else
    $("#brandcheck").prop('checked', false);
},
    /**
* TODO:Complete JS doc
*/
'change .categorySelections': () => {
  if ($(".categorySelections").length === $(".categorySelections:checked").length)
    $("#categorycheck").prop('checked', true);
  else
    $("#categorycheck").prop('checked', false);
},
  /**
* TODO:Complete JS doc
*/
  'change .cashSalesReportSelections': () => {
    if ($(".cashSalesReportSelections").length === $(".cashSalesReportSelections:checked").length)
      $("#cashSalesReportcheck").prop('checked', true);
    else
      $("#cashSalesReportcheck").prop('checked', false);
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
   * TODO:Comlete JS doc
   */
  'change .roleSelections': () => {
    if ($(".roleSelections").length === $(".roleSelections:checked").length)
      $("#rolecheck").prop('checked', true);
    else
      $("#rolecheck").prop('checked', false);
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
      $("#rolesUnder").val('').trigger('change');
    });
  },
  /**
    * TODO: Complete JS doc
    */
  'change .branchelect1': () => {
    if ($(".branchelect1").length === $(".branchelect1:checked").length)
      $("#branchchecks1").prop('checked', true);
    else
      $("#branchchecks1").prop('checked', false);
  },

  /**
    * TODO: Complete JS doc
    */
  'change .locationelect1': () => {
    if ($(".locationelect1").length === $(".locationelect1:checked").length)
      $("#locationchecks1").prop('checked', true);
    else
      $("#locationchecks1").prop('checked', false);
  },

  /**
    * TODO: Complete JS doc
    */
  'change .priceTypeelect1': () => {
    if ($(".priceTypeelect1").length === $(".priceTypeelect1:checked").length)
      $("#priceTypechecks1").prop('checked', true);
    else
      $("#priceTypechecks1").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .productelect1': () => {
    if ($(".productelect1").length === $(".productelect1:checked").length)
      $("#productchecks1").prop('checked', true);
    else
      $("#productchecks1").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .unitelect1': () => {
    if ($(".unitelect1").length === $(".unitelect1:checked").length)
      $("#unitchecks1").prop('checked', true);
    else
      $("#unitchecks1").prop('checked', false);
  },

  /**
      * TODO: Complete JS doc
      */
  'change .priceelect1': () => {
    if ($(".priceelect1").length === $(".priceelect1:checked").length)
      $("#pricechecks1").prop('checked', true);
    else
      $("#pricechecks1").prop('checked', false);
  },
  /**
      * TODO: Complete JS doc
      */
  'change .taxelect1': () => {
    if ($(".taxelect1").length === $(".taxelect1:checked").length)
      $("#taxchecks1").prop('checked', true);
    else
      $("#taxchecks1").prop('checked', false);
  },/**
    * TODO: Complete JS doc
    */
  'change .administrationselect1': () => {
    if ($(".administrationelect1").length === $(".administrationselect1:checked").length)
      $("#administrationchecks1").prop('checked', true);
    else
      $("#administrationchecks1").prop('checked', false);
  },/**
    * TODO: Complete JS doc
    */
  'change .SdPriceListselect1': () => {
    if ($(".SdPriceListselect1").length === $(".SdPriceListselect1:checked").length)
      $("#SdPriceListchecks1").prop('checked', true);
    else
      $("#SdPriceListchecks1").prop('checked', false);
  },/**
    * TODO: Complete JS doc
    */
  'change .collectionListselect1': () => {
    if ($(".collectionListselect1").length === $(".collectionListselect1:checked").length)
      $("#collectionListchecks1").prop('checked', true);
    else
      $("#collectionListchecks1").prop('checked', false);
  },/**
    * TODO: Complete JS doc
    */
  'change .deliveryListselect1': () => {
    if ($(".deliveryListselect1").length === $(".deliveryListselect1:checked").length)
      $("#deliveryListchecks1").prop('checked', true);
    else
      $("#deliveryListchecks1").prop('checked', false);
  },
  /**
    * TODO: Complete JS doc
    */
  'change .orderApListelect1': () => {
    if ($(".orderApListselect1").length === $(".orderApListselect1:checked").length)
      $("#orderApListchecks1").prop('checked', true);
    else
      $("#orderApListchecks1").prop('checked', false);
  },
    'click #creditSaleReportchecks1': () => {
    if ($("#creditSaleReportchecks1").prop("checked") === true) {
      $("#creditSaleReportcheckView1").prop('checked', true);
    } else {
      $("#creditSaleReportcheckView1").prop('checked', false);
    }
  },

   'change .creditSaleReportselect1': () => {
    if ($(".creditSaleReportselect1").length === $(".creditSaleReportselect1:checked").length)
      $("#creditSaleReportchecks1").prop('checked', true);
    else
      $("#creditSaleReportchecks1").prop('checked', false);
  },
  'change .sdUserStockHistorySelections': () => {
    if ($(".sdUserStockHistorySelections").length === $(".sdUserStockHistorySelections:checked").length)
      $("#sdUserStockHistorycheck").prop('checked', true);
    else
      $("#sdUserStockHistorycheck").prop('checked', false);
  },
  'change .sdUserStockSummarySelections': () => {
    if ($(".sdUserStockSummarySelections").length === $(".sdUserStockSummarySelections:checked").length)
      $("#sdUserStockSummarycheck").prop('checked', true);
    else
      $("#sdUserStockSummarycheck").prop('checked', false);
  },
  'change .verticalSaleReportSelections': () => {
    if ($(".verticalSaleReportSelections").length === $(".verticalSaleReportSelections:checked").length)
      $("#verticalSaleReportcheck").prop('checked', true);
    else
      $("#verticalSaleReportcheck").prop('checked', false);
  }  ,
  'change .sdReportsSelections': () => {
    if ($(".sdReportsSelections").length === $(".sdReportsSelections:checked").length)
      $("#sdReportscheck").prop('checked', true);
    else
      $("#sdReportscheck").prop('checked', false);
  },
  'change .bdmReportsSelections': () => {
    if ($(".bdmReportsSelections").length === $(".bdmReportsSelections:checked").length)
      $("#bdmReportscheck").prop('checked', true);
    else
      $("#bdmReportscheck").prop('checked', false);
  },
  'change .bhReportsSelections': () => {
    if ($(".bhReportsSelections").length === $(".bhReportsSelections:checked").length)
      $("#bhReportscheck").prop('checked', true);
    else
      $("#bhReportscheck").prop('checked', false);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .roleAdd': (event) => {

    event.preventDefault();
    createRole(event.target);
    $('#ic-create').modal('hide');
  }
});
