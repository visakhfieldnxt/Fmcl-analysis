/**
 * @author Subrata
 */

import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";
import { Meteor } from "meteor/meteor";
import { allUsers } from "../../api/user/user";


currentPath = '/';
Tracker.autorun(function () {
  Meteor.subscribe('user.list');
  Meteor.subscribe('role.list');
  Meteor.subscribe('config.list');
});
/**
 * Secured route definition for most of the navigation
 */
let secureRoute = FlowRouter.group({
  name: 'secure-route',
  triggersEnter: [
    checkAuthentication
  ],
});
/**
 * Public routing for few non secured pages
 */
let publicRoute = FlowRouter.group({
  name: 'public-route',
  triggersEnter: [
    loginAuthentication
  ],
});
function checkAuthentication() {
  let path = FlowRouter.current().path;
  if (path.indexOf('/login') === -1) {
    currentPath = path;
    if (!Meteor.userId()) {
      Session.set("userRole", '');
      FlowRouter.redirect('/login');
    }
    else {
      // let userRes = Meteor.users.findOne({ _id: Meteor.userId() });
      // if (userRes) {
      //   let roleRes = Meteor.roles.findOne({ _id: userRes[0] });
      //   if (roleRes) {
      //     currentPath = roleRes.homePage;
      //   }
      // }
      Session.set("userPermission", '');
      FlowRouter.redirect(currentPath);
    }
  }
}
function loginAuthentication() {
  let path = FlowRouter.current().path;
  if (Meteor.userId() && path === '/login') {
    Meteor.logout(() => {
      Session.set("userRole", '');
      FlowRouter.redirect('/login');
    })
  }
}
secureRoute.route('/', {
  name: 'home',
  action: () => {
    let loginRole = [];
    let loginBranch = [];
    let loginUserNameGet = '';
    let defaultLoginBranchGet = '';
    let loginUserVerticals = [];
    Meteor.users.find({
      _id: this.Meteor.userId()
    }).map(function (docs) {
      loginRole = docs.roles;
      loginBranch = docs.branch;
      loginUserNameGet = docs.profile.firstName;
      loginUserVerticals = docs.vertical;
    });
    Session.setPersistent("managerBranch", loginBranch);
    Session.setPersistent("loginUserNameValue", loginUserNameGet);
    Session.setPersistent("loginDefBranchGet", defaultLoginBranchGet);
    Session.setPersistent("subDistributorValue", false);
    Session.setPersistent("superAdminValue", false);
    Session.setPersistent("loginUserVerticals", loginUserVerticals);
    Session.setPersistent("sdUserChannel", '');

    if (loginRole.length === undefined || loginRole.length === 0) {
      Meteor.logout(() => {
        Session.set("userRole", '');
        FlowRouter.redirect('/login');
      })
    }
    for (let j = 0; j < loginRole.length; j++) {
      if (j === 0) {
        Meteor.roles.find({
          _id: loginRole[j]
        }).map(function (docum) {
          loginHomePage = docum.homePage;
          if (docum.name) {
            FlowRouter.redirect(loginHomePage);
          }
          let permissions = 'sdView';
          let sdViews = $.inArray(permissions, docum.permissions);
          if (sdViews !== -1) {
            Session.setPersistent("subDistributorValue", true);
          }
          let permissionsAdmin = 'superAdminView';
          let adminView = $.inArray(permissionsAdmin, docum.permissions);
          if (adminView !== -1) {
            Session.setPersistent("superAdminValue", true);
          }

          let vsrCheck = $.inArray("vsrView", docum.permissions);
          if (vsrCheck !== -1) {
            Session.setPersistent("sdUserChannel", 'VSR');
          }
          let omrCheck = $.inArray("omrView", docum.permissions);
          if (omrCheck !== -1) {
            Session.setPersistent("sdUserChannel", 'OMR');
          }
          let wsCheck = $.inArray("wseView", docum.permissions);
          if (wsCheck !== -1) {
            Session.setPersistent("sdUserChannel", 'WS');
          }
        });

      }
    }
    for (let i = 0; i < loginRole.length; i++) {
      Meteor.roles.find({
        _id: loginRole[i]
      }).map(function (doc) {
        if (doc.name) {
          Session.setPersistent("userRole", doc.name);
        }
        let permissions = 'sdView';
        let sdViews = $.inArray(permissions, doc.permissions);
        if (sdViews !== -1) {
          Session.setPersistent("subDistributorValue", true);
        }
        let permissionsAdmin = 'superAdminView';
        let adminView = $.inArray(permissionsAdmin, doc.permissions);
        if (adminView !== -1) {
          Session.setPersistent("superAdminValue", true);
        }
        let vsrCheck = $.inArray("vsrView", doc.permissions);
        if (vsrCheck !== -1) {
          Session.setPersistent("sdUserChannel", 'VSR');
        }
        let omrCheck = $.inArray("omrView", doc.permissions);
        if (omrCheck !== -1) {
          Session.setPersistent("sdUserChannel", 'OMR');
        }
        let wsCheck = $.inArray("wseView", doc.permissions);
        if (wsCheck !== -1) {
          Session.setPersistent("sdUserChannel", 'WS');
        }
      });

    }
  },
});
publicRoute.route('/login', {
  name: 'login',
  action: () => {
    BlazeLayout.render('main', { name: 'login_view' });
  }
});
publicRoute.route('/signup', {
  name: 'signup',
  action: () => {
    BlazeLayout.render('main', { name: 'signup_create' });
  }
});
publicRoute.route('/signout', {
  name: 'logout_view',
  action: () => {
    Session.set("userPermission", '');
    Meteor.logout(() => {
      FlowRouter.redirect('/login');
    });
    Session.setPersistent("subDistributorValue", false);
    Session.setPersistent("loginUserVerticals", []);
    Session.setPersistent("superAdminValue", false);
    Session.setPersistent("sdUserChannel", '');
    console.log("fff");
  }

});
publicRoute.route('/login/forgetPassword', {
  name: 'forgetPassword',
  action: () => {
    BlazeLayout.render('main', { name: 'forgetPassword' });
  }
});


secureRoute.route('/user/list', {
  name: 'user',
  action: () => {
    BlazeLayout.render('main', { name: 'user' });
  }
});
secureRoute.route('/user/create', {
  name: 'user.create',
  action: () => {
    BlazeLayout.render('main', { name: 'user_create' });
  }
});




secureRoute.route('/profile/update', {
  name: 'profile.update',
  action: () => {
    BlazeLayout.render('main', { name: 'update_profile' });
  }
});




secureRoute.route('/role/list', {
  name: 'role',
  action: () => {
    BlazeLayout.render('main', { name: 'role_list' });
  }
});
secureRoute.route('/role/create', {
  name: 'role.create',
  action: () => {
    BlazeLayout.render('main', { name: 'role_create' });
  }
});


secureRoute.route('/order/list', {
  name: 'order.list',
  action: () => {
    BlazeLayout.render('main', { name: 'order' });
  }
});

secureRoute.route('/createOrder/list', {
  name: 'createOrder',
  action: () => {
    BlazeLayout.render('main', { name: 'createOrder' });
  }
});
secureRoute.route('/admin/dashboard', {
  name: 'admin.dashboard',
  action: () => {
    BlazeLayout.render('main', { name: 'admin_dashboard' });
  }
});

secureRoute.route('/superAdmin/dashboard', {
  name: 'superAdmin.dashboard',
  action: () => {
    BlazeLayout.render('main', { name: 'superAdminDashboard' });
  }
});

secureRoute.route('/routeWiseMap/:_id', {
  name: 'routeWiseMap',
  action: () => {
    BlazeLayout.render('main', { name: 'routeWiseMap' });
  }
});

secureRoute.route('/branch/list', {
  name: 'branch',
  action: () => {
    BlazeLayout.render('main', { name: 'branch' });
  }
});
secureRoute.route('/verticals/list', {
  name: 'verticals',
  action: () => {
    BlazeLayout.render('main', { name: 'verticals' });
  }
});

secureRoute.route('/location/list', {
  name: 'location',
  action: () => {
    BlazeLayout.render('main', { name: 'location' });
  }
});

secureRoute.route('/product/list', {
  name: 'product',
  action: () => {
    BlazeLayout.render('main', { name: 'product' });
  }
});

secureRoute.route('/priceType/list', {
  name: 'priceType',
  action: () => {
    BlazeLayout.render('main', { name: 'priceType' });
  }
});

secureRoute.route('/unit/list', {
  name: 'unit',
  action: () => {
    BlazeLayout.render('main', { name: 'unit' });
  }
});

secureRoute.route('/price/list', {
  name: 'price',
  action: () => {
    BlazeLayout.render('main', { name: 'price' });
  }
});

secureRoute.route('/subDistributor/list', {
  name: 'subDistributor',
  action: () => {
    BlazeLayout.render('main', { name: 'subDistributor' });
  }
});

secureRoute.route('/sdUser/list', {
  name: 'sdUser',
  action: () => {
    BlazeLayout.render('main', { name: 'sdUser' });
  }
});

secureRoute.route('/sdUserApproval/list', {
  name: 'sdUserApproval',
  action: () => {
    BlazeLayout.render('main', { name: 'sdUserApproval' });
  }
});

secureRoute.route('/approvedSdUsers/list', {
  name: 'approvedSdUsers',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedSdUsers' });
  }
});

secureRoute.route('/rejectedSdUsers/list', {
  name: 'rejectedSdUsers',
  action: () => {
    BlazeLayout.render('main', { name: 'rejectedSdUsers' });
  }
});

secureRoute.route('/tax/list', {
  name: 'tax_dash',
  action: () => {
    BlazeLayout.render('main', { name: 'tax_dash' });
  }
});

secureRoute.route('/routeGroup/list', {
  name: 'routeGroup',
  action: () => {
    BlazeLayout.render('main', { name: 'routeGroup' });
  }
});

secureRoute.route('/routeAssign/list', {
  name: 'routeAssign',
  action: () => {
    BlazeLayout.render('main', { name: 'routeAssign' });
  }
});

secureRoute.route('/attendance/list', {
  name: 'attendance',
  action: () => {
    BlazeLayout.render('main', { name: 'attendance' });
  }
});
publicRoute.notFound = {
  action() {
    BlazeLayout.render('main', { name: 'notFound' });
  },
};
secureRoute.route('/outletApproval/list', {
  name: "outletApprove",
  action: () => {
    BlazeLayout.render('main', { name: 'outletApprove' });
  }
});
secureRoute.route('/outletApproved/list', {
  name: "outletApproved",
  action: () => {
    BlazeLayout.render('main', { name: 'outletApproved' });
  }
});

secureRoute.route('/stockList/list', {
  name: "stockList",
  action: () => {
    BlazeLayout.render('main', { name: 'stockList' });
  }
});

secureRoute.route('/stockTransfer/list', {
  name: "stockTransfer",
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransfer' });
  }
});

secureRoute.route('/outletMaster/list', {
  name: "outletMaster",
  action: () => {
    BlazeLayout.render('main', { name: 'outletMaster' });
  }
});

secureRoute.route('/sdPrice/list', {
  name: "sdPrice",
  action: () => {
    BlazeLayout.render('main', { name: 'sdPrice' });
  }
});
secureRoute.route('/stockTransferDetails/:_id', {
  name: "stockTransferDetails",
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransferDetails' });
  }
});

secureRoute.route('/delivery/list', {
  name: "delivery",
  action: () => {
    BlazeLayout.render('main', { name: 'delivery' });
  }
});

secureRoute.route('/collection/list', {
  name: "collection",
  action: () => {
    BlazeLayout.render('main', { name: 'collection' });
  }
});

secureRoute.route('/orderApprove/list', {
  name: "orderApprove",
  action: () => {
    BlazeLayout.render('main', { name: 'orderApprove' });
  }
});

secureRoute.route('/approveOrder/list', {
  name: "approveOrder",
  action: () => {
    BlazeLayout.render('main', { name: 'approveOrder' });
  }
});

secureRoute.route('/stockAcceptance/list', {
  name: "stockAcceptance",
  action: () => {
    BlazeLayout.render('main', { name: 'stockAcceptance' });
  }
});


secureRoute.route('/stockAcceptanceDetails/:_id', {
  name: "stockAcceptanceDetails",
  action: () => {
    BlazeLayout.render('main', { name: 'stockAcceptanceDetails' });
  }
});
secureRoute.route('/approvedOutletsReportBDM/list', {
  name: "approvedOutletsReportBDM",
  action: () => {
    BlazeLayout.render('main', { name: 'approvedOutletsReportBDM' });
  }
});

secureRoute.route('/cashSaleReport/list', {
  name: "cashSaleReport",
  action: () => {
    BlazeLayout.render('main', { name: 'cashSaleReport' });
  }
});
secureRoute.route('/sdOutletList/list', {
  name: "sdOutletList",
  action: () => {
    BlazeLayout.render('main', { name: 'sdOutletList' });
  }
});
secureRoute.route('/sdUserStockList/list', {
  name: "sdUserStockList",
  action: () => {
    BlazeLayout.render('main', { name: 'sdUserStockList' });
  }
});
secureRoute.route('/updateStockList/list', {
  name: "updateStockList",
  action: () => {
    BlazeLayout.render('main', { name: 'updateStockList' });
  }
});
secureRoute.route('/createSTransfer/list', {
  name: "createSTransfer",
  action: () => {
    BlazeLayout.render('main', { name: 'createSTransfer' });
  }
});

secureRoute.route('/cashSales/list', {
  name: "cashSales",
  action: () => {
    BlazeLayout.render('main', { name: 'cashSales' });
  }
});

secureRoute.route('/sales/dashboard', {
  name: "salesDashboard",
  action: () => {
    BlazeLayout.render('main', { name: 'sales_dashboard' });
  }
});

secureRoute.route('/createCashSales/list', {
  name: "createCashSales",
  action: () => {
    BlazeLayout.render('main', { name: 'createCashSales' });
  }
});

secureRoute.route('/creditSale/list', {
  name: "creditSale",
  action: () => {
    BlazeLayout.render('main', { name: 'creditSale' });
  }
});

secureRoute.route('/createCreditSale/list', {
  name: "createCreditSale",
  action: () => {
    BlazeLayout.render('main', { name: 'createCreditSale' });
  }
});


secureRoute.route('/stockUpdatesReport/list', {
  name: "stockUpdatesReport",
  action: () => {
    BlazeLayout.render('main', { name: 'stockUpdatesReport' });
  }
});
secureRoute.route('/subDDetailsRep/list', {
  name: "subDDetailsRep",
  action: () => {
    BlazeLayout.render('main', { name: 'subDDetailsRep' });
  }
});


secureRoute.route('/stockReturn/list', {
  name: "stockReturn",
  action: () => {
    BlazeLayout.render('main', { name: 'stockReturn' });
  }
});

secureRoute.route('/sdMap/view', {
  name: "sdMap",
  action: () => {
    BlazeLayout.render('main', { name: 'sdMap' });
  }
});

secureRoute.route('/createStockReturn/list', {
  name: "createStockReturn",
  action: () => {
    BlazeLayout.render('main', { name: 'createStockReturn' });
  }
});

secureRoute.route('/orderReport/list', {
  name: "orderReport",
  action: () => {
    BlazeLayout.render('main', { name: 'orderReport' });
  }
});

secureRoute.route('/stockReturnDetails/:_id', {
  name: "stockReturnDetails",
  action: () => {
    BlazeLayout.render('main', { name: 'stockReturnDetails' });
  }
});

secureRoute.route('/stockReturnAccept/list', {
  name: "stockReturnAccept",
  action: () => {
    BlazeLayout.render('main', { name: 'stockReturnAccept' });
  }
});


secureRoute.route('/stockReturnAcceptDetails/:_id', {
  name: "stockReturnAcceptDetails",
  action: () => {
    BlazeLayout.render('main', { name: 'stockReturnAcceptDetails' });
  }
});

secureRoute.route('/stockListDetails/:_id/:idVal', {
  name: "stockListDetails",
  action: () => {
    BlazeLayout.render('main', { name: 'stockListDetails' });
  }
});

secureRoute.route('/creditSaleReport/:_id', {
  name: "creditSaleReport",
  action: () => {
    BlazeLayout.render('main', { name: 'creditSaleReport' });
  }
});
secureRoute.route('/stockSummary/list', {
  name: "stockSummary",
  action: () => {
    BlazeLayout.render('main', { name: 'stockSummary' });
  }
});

secureRoute.route('/orderOnHold/list', {
  name: "orderOnHold",
  action: () => {
    BlazeLayout.render('main', { name: 'orderOnHold' });
  }
});

secureRoute.route('/orderRejected/list', {
  name: "orderRejected",
  action: () => {
    BlazeLayout.render('main', { name: 'orderRejected' });
  }
});
secureRoute.route('/outletOnHold/list', {
  name: "outletOnHold",
  action: () => {
    BlazeLayout.render('main', { name: 'outletOnHold' });
  }
});
secureRoute.route('/outletReject/list', {
  name: "outletReject",
  action: () => {
    BlazeLayout.render('main', { name: 'outletReject' });
  }
});

secureRoute.route('/brand/list', {
  name: "brand",
  action: () => {
    BlazeLayout.render('main', { name: 'brand' });
  }
});

secureRoute.route('/category/list', {
  name: "category",
  action: () => {
    BlazeLayout.render('main', { name: 'category' });
  }
});

secureRoute.route('/principal/list', {
  name: "principal",
  action: () => {
    BlazeLayout.render('main', { name: 'principal' });
  }
});

secureRoute.route('/market_Outstanding/list', {
  name: "market_Outstanding_BDM",
  action: () => {
    BlazeLayout.render('main', { name: 'market_Outstanding_BDM' });
  }
});
secureRoute.route('/market_Outstanding_SD/list', {
  name: "market_Outstanding_SD",
  action: () => {
    BlazeLayout.render('main', { name: 'market_Outstanding_SD' });
  }
});
secureRoute.route('/market_Outstanding_SDUser/list', {
  name: "market_Outstanding_SDUser",
  action: () => {
    BlazeLayout.render('main', { name: 'market_Outstanding_SDUser' });
  }
});

secureRoute.route('/sdUserStockHistory/list', {
  name: "sdUserStockHistory",
  action: () => {
    BlazeLayout.render('main', { name: 'sdUserStockHistory' });
  }
});

secureRoute.route('/sdUserStockSummary/list', {
  name: "sdUserStockSummary",
  action: () => {
    BlazeLayout.render('main', { name: 'sdUserStockSummary' });
  }
});
secureRoute.route('/verticalWiseSalesReport/list', {
  name: "verticalWiseSalesReport",
  action: () => {
    BlazeLayout.render('main', { name: 'verticalWiseSalesReport' });
  }
});

secureRoute.route('/regionWiseSalesReport/list', {
  name: "regionWiseSalesReport",
  action: () => {
    BlazeLayout.render('main', { name: 'regionWiseSalesReport' });
  }
});

secureRoute.route('/subDWiseSalesRep/list', {
  name: "subDWiseSalesRep",
  action: () => {
    BlazeLayout.render('main', { name: 'subDWiseSalesRep' });
  }
});
secureRoute.route('/ouletWiseReport/list', {
  name: "ouletWiseReport",
  action: () => {
    BlazeLayout.render('main', { name: 'ouletWiseReport' });
  }
});
secureRoute.route('/outletApprovedReport/list', {
  name: "outletApprovedReport",
  action: () => {
    BlazeLayout.render('main', { name: 'outletApprovedReport' });
  }
});

secureRoute.route('/principalWiseSalesReport/list', {
  name: "principalWiseSalesReport",
  action: () => {
    BlazeLayout.render('main', { name: 'principalWiseSalesReport' });
  }
});

// ******************** //

secureRoute.route('/verticalWiseSalesSdReport/list', {
  name: "verticalWiseSalesSdReport",
  action: () => {
    BlazeLayout.render('main', { name: 'verticalWiseSalesSdReport' });
  }
});
secureRoute.route('/regionWiseSalesSdReport/list', {
  name: "regionWiseSalesSdReport",
  action: () => {
    BlazeLayout.render('main', { name: 'regionWiseSalesSdReport' });
  }
});
secureRoute.route('/principalWiseSalesSdReport/list', {
  name: "principalWiseSalesSdReport",
  action: () => {
    BlazeLayout.render('main', { name: 'principalWiseSalesSdReport' });
  }
});


secureRoute.route('/verticalWiseSalesBdmReport/list', {
  name: "verticalWiseSalesBdmReport",
  action: () => {
    BlazeLayout.render('main', { name: 'verticalWiseSalesBdmReport' });
  }
});
secureRoute.route('/regionWiseSalesBdmReport/list', {
  name: "regionWiseSalesBdmReport",
  action: () => {
    BlazeLayout.render('main', { name: 'regionWiseSalesBdmReport' });
  }
});
secureRoute.route('/subDWiseSalesBdmReport/list', {
  name: "subDWiseSalesBdmReport",
  action: () => {
    BlazeLayout.render('main', { name: 'subDWiseSalesBdmReport' });
  }
});
secureRoute.route('/principalWiseSalesBdmReport/list', {
  name: "principalWiseSalesBdmReport",
  action: () => {
    BlazeLayout.render('main', { name: 'principalWiseSalesBdmReport' });
  }
});
secureRoute.route('/categoryWiseReport/list', {
  name: "categoryWiseReport",
  action: () => {
    BlazeLayout.render('main', { name: 'categoryWiseReport' });
  }
});

secureRoute.route('/sdStockRep/list', {
  name: "sdStockRep",
  action: () => {
    BlazeLayout.render('main', { name: 'sdStockRep' });
  }
});

// 26072021

secureRoute.route('/saleVsLastMonthBdm/list', {
  name: "saleVsLastMonthBdm",
  action: () => {
    BlazeLayout.render('main', { name: 'saleVsLastMonthBdm' });
  }
});
secureRoute.route('/saleVsLastMonthSd/list', {
  name: "saleVsLastMonthSd",
  action: () => {
    BlazeLayout.render('main', { name: 'saleVsLastMonthSd' });
  }
});

secureRoute.route('/saleVsLastMonthSdUser/list', {
  name: "saleVsLastMonthSdUser",
  action: () => {
    BlazeLayout.render('main', { name: 'saleVsLastMonthSdUser' });
  }
});

secureRoute.route('/deliveredOrders/list', {
  name: "deliveredOrders",
  action: () => {
    BlazeLayout.render('main', { name: 'deliveredOrders' });
  }
});

secureRoute.route('/routeReport/list', {
  name: "routeReport",
  action: () => {
    BlazeLayout.render('main', { name: 'routeReport' });
  }
});

secureRoute.route('/productsReport/list', {
  name: "productsReport",
  action: () => {
    BlazeLayout.render('main', { name: 'productsReport' });
  }
});

secureRoute.route('/priceReport/list', {
  name: "priceReport",
  action: () => {
    BlazeLayout.render('main', { name: 'priceReport' });
  }
});

secureRoute.route('/salesDumpReport/list', {
  name: "salesDumpReport",
  action: () => {
    BlazeLayout.render('main', { name: 'salesDumpReport' });
  }
});



secureRoute.route('/systemConfig/list', {
  name: "systemConfig",
  action: () => {
    BlazeLayout.render('main', { name: 'systemConfig' });
  }
});
secureRoute.route('/outletDetailsReport/list', {
  name: "outletDetailsReport",
  action: () => {
    BlazeLayout.render('main', { name: 'outletDetailsReport' });
  }
});

secureRoute.route('/loginUsers/list', {
  name: "loginUsers",
  action: () => {
    BlazeLayout.render('main', { name: 'loginUsers' });
  }
});

secureRoute.route('/userDetailsReport/list', {
  name: "userDetailsReport",
  action: () => {
    BlazeLayout.render('main', { name: 'userDetailsReport' });
  }
});

secureRoute.route('/stockTransferReport/list', {
  name: "stockTransferReport",
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransferReport' });
  }
});

secureRoute.route('/subDStockUpdatesReport/list', {
  name: "subDStockUpdatesReport",
  action: () => {
    BlazeLayout.render('main', { name: 'subDStockUpdatesReport' });
  }
});

secureRoute.route('/stockUpdateReportBDM/list', {
  name: "stockUpdateReportBDM",
  action: () => {
    BlazeLayout.render('main', { name: 'stockUpdateReportBDM' });
  }
});


secureRoute.route('/stockReturnReport/list', {
  name: "stockReturnReport",
  action: () => {
    BlazeLayout.render('main', { name: 'stockReturnReport' });
  }
});

secureRoute.route('/categoryWiseReportBDM/list', {
  name: "categoryWiseReportBDM",
  action: () => {
    BlazeLayout.render('main', { name: 'categoryWiseReportBDM' });
  }
});





