/**
 * @author Subrata
 */

import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";
import { Meteor } from "meteor/meteor";


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
      // BlazeLayout.render('main', { name: 'login_view' });
      Session.set("userRole", '');
      FlowRouter.redirect('/login');
    }
    else {
      // FlowRouter.subscriptions = function () {
      //   this.register('Users', Meteor.subscribe('user.list'));
      //   this.register('roles', Meteor.subscribe('role.list'));
      //   //   this.register('order', Meteor.subscribe("order.list"));
      //   //   this.register('invoice', Meteor.subscribe("invoice.list"));
      // };
      // let pathin = FlowRouter.current().path;
      // sessionStorage.clear();
      // if (pathin === '/login') {
      //   Meteor.logout(() => {
      //     FlowRouter.redirect('/login');
      //
      //   })
      //
      // } else {
      Session.set("userPermission", '');
      FlowRouter.redirect(currentPath);
      // }
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
    Meteor.users.find({
      _id: this.Meteor.userId()
    }).map(function (docs) {
      loginRole = docs.roles;
      loginBranch = docs.branch;
      loginUserNameGet = docs.profile.firstName;
      defaultLoginBranchGet = docs.defaultBranch;
    });
    Session.setPersistent("managerBranch", loginBranch);
    Session.setPersistent("loginUserNameValue", loginUserNameGet);
    Session.setPersistent("loginDefBranchGet", defaultLoginBranchGet);
    Session.setPersistent("accountantCheckValue", false);
    Session.setPersistent("priceUpdateValue", false);
    Session.setPersistent("priceTypeEditValue", false);
    if (loginRole.length === undefined || loginRole.length === 0) {
      Meteor.logout(() => {
        Session.set("userRole", '');
        Session.setPersistent("activitySeniorValue", false);
        FlowRouter.redirect('/login');
      })
    }
    for (let j = 0; j < loginRole.length; j++) {
      if (j === 0) {
        Meteor.roles.find({
          _id: loginRole[j]
        }).map(function (docum) {
          loginHomePage = docum.homePage;
          if (docum.name === "Admin") {
            FlowRouter.redirect('/admin/dashboard');
          }
          else if (docum.name === "Super Admin") {
            FlowRouter.redirect('/superAdmin/dashboard');
          }
          else if (docum.name === "Sales Person") {
            FlowRouter.redirect(loginHomePage);
          }
          else if (docum.name === "Senior Sales Person") {
            FlowRouter.redirect(loginHomePage);
          }
          else if (docum.name === "Dispatch Manager") {
            FlowRouter.redirect(loginHomePage);
          }
          else if (docum.name === "Delivery Boy") {
            FlowRouter.redirect(loginHomePage);
          }
          else if (docum.name === "Accountant") {
            FlowRouter.redirect(loginHomePage);
          }
          else if (docum.name === "Van Sale") {
            FlowRouter.redirect(loginHomePage);
          }
          else if (docum.name) {
            FlowRouter.redirect(loginHomePage);
          }
          let permissions = 'activitySeniorView';
          let activityCheck = $.inArray(permissions, docum.permissions);
          // console.log("activityCheck", activityCheck);
          if (activityCheck === -1) {
            Session.setPersistent("activitySeniorValue", false);
          }
          else {
            Session.setPersistent("activitySeniorValue", true);
          }

          let accountantPermissions = 'accountantView';
          let accountantCheck = $.inArray(accountantPermissions, docum.permissions);
          // console.log("accountantCheck", accountantCheck);
          if (accountantCheck === -1) {
            // Session.setPersistent("accountantCheckValue", false);
          }
          else {
            Session.setPersistent("accountantCheckValue", true);
          }

          let priceUpdatePermissions = 'priceUpdateView';
          let priceUpdateCheck = $.inArray(priceUpdatePermissions, docum.permissions);
          if (priceUpdateCheck === -1) {
          }
          else {
            Session.setPersistent("priceUpdateValue", true);
          }

          let priceTypePermissions = 'priceTypeEditView';
          let priceTypeEditCheck = $.inArray(priceTypePermissions, docum.permissions);
          if (priceTypeEditCheck === -1) {
          }
          else {
            Session.setPersistent("priceTypeEditValue", true);
          }
        })
      }
    }
    for (let i = 0; i < loginRole.length; i++) {
      Meteor.roles.find({
        _id: loginRole[i]
      }).map(function (doc) {
        // loginHomePage = doc.homePage; //Default Home Page Settings
        if (doc.name === "Admin") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect('/admin/dashboard');
        }
        else if (doc.name === "Super Admin") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect('/admin/dashboard');
        }
        else if (doc.name === "Sales Person") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect(loginHomePage);
        }
        else if (doc.name === "Senior Sales Person") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect(loginHomePage);
        }
        else if (doc.name === "Dispatch Manager") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect(loginHomePage);
        }
        else if (doc.name === "Delivery Boy") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect(loginHomePage);
        }
        else if (doc.name === "Accountant") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect(loginHomePage);
        }
        else if (doc.name === "Van Sale") {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect(loginHomePage);
        }
        else if (doc.name) {
          Session.setPersistent("userRole", doc.name);
          // FlowRouter.redirect(loginHomePage);
        }
        let permissions = 'activitySeniorView';
        let activityCheck = $.inArray(permissions, doc.permissions);
        // console.log("activityCheck1", activityCheck);
        if (activityCheck === -1) {
          Session.setPersistent("activitySeniorValue", false);
        }
        else {
          Session.setPersistent("activitySeniorValue", true);
        }

        let accountantPermissions = 'accountantView';
        let accountantCheck = $.inArray(accountantPermissions, doc.permissions);
        // console.log("accountantCheck", accountantCheck);
        if (accountantCheck === -1) {
          // Session.setPersistent("accountantCheckValue", false);
        }
        else {
          Session.setPersistent("accountantCheckValue", true);
        }
        // console.log("doc", doc);

        let priceUpdatePermissions = 'priceUpdateView';
        let priceUpdateCheck = $.inArray(priceUpdatePermissions, doc.permissions);
        if (priceUpdateCheck === -1) {
        }
        else {
          Session.setPersistent("priceUpdateValue", true);
        }

        let priceTypePermissions = 'priceTypeEditView';
        let priceTypeEditCheck = $.inArray(priceTypePermissions, doc.permissions);
        if (priceTypeEditCheck === -1) {
        }
        else {
          Session.setPersistent("priceTypeEditValue", true);
        }
      });
    }
  },
});
publicRoute.route('/login', {
  name: 'login',
  // triggersEnter: [function (context, redirect) {
  //   /*window.onpopstate = function () {
  //    history.go(1);
  //    };
  //    window.history.forward();
  //    sessionStorage.clear();*/
  //   Session.clear();
  // }],
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
    Session.setPersistent("accountantCheckValue", false);
    Session.setPersistent("priceUpdateValue", false);
    Session.setPersistent("activitySeniorValue", false);
    Session.setPersistent("priceTypeEditValue", false);
    Meteor.logout(() => {
      FlowRouter.redirect('/login');
    });
  }
});
publicRoute.route('/login/forgetPassword', {
  name: 'forgetPassword',
  action: () => {
    BlazeLayout.render('main', { name: 'forgetPassword' });
  }
});
publicRoute.route('/resetPassword/:token', {
  name: 'resetPassword',
  action: (params) => {
    Session.set('resetPasswordToken', params.token);
    BlazeLayout.render('main', { name: 'resetPassword' });
  }
});
publicRoute.route('/verifyEmail/:token', {
  name: 'verifyEmail',
  action: (params) => {
    Session.set('verifyEmailToken', params.token);
    BlazeLayout.render('main', { name: 'verifyEmail' });
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

secureRoute.route('/vanSaleUser/list', {
  name: 'vanSaleUser',
  action: () => {
    BlazeLayout.render('main', { name: 'vanSaleUser' });
  }
});
secureRoute.route('/vanSaleUser/create', {
  name: 'vanSaleUser.create',
  action: () => {
    BlazeLayout.render('main', { name: 'vanSaleUser_create' });
  }
});

secureRoute.route('/profile/update', {
  name: 'profile.update',
  action: () => {
    BlazeLayout.render('main', { name: 'update_profile' });
  }
});

secureRoute.route('/routeReport/list', {
  name: 'routeReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'routeReport' });
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
secureRoute.route('/designation/list', {
  name: 'designation.list',
  action: () => {
    BlazeLayout.render('main', { name: 'designations' });
  }
});
secureRoute.route('/locationTracker/list', {
  name: 'locationTracker.list',
  action: () => {
    BlazeLayout.render('main', { name: 'locationTracker' });
  }
});
secureRoute.route('/order/create', {
  name: 'order.create',
  action: () => {
    BlazeLayout.render('main', {
      name: 'order_create'
    });
  }
});
secureRoute.route('/order/list', {
  name: 'order.list',
  action: () => {
    BlazeLayout.render('main', { name: 'order' });
  }
});
secureRoute.route('/orderSenior/create', {
  name: 'orderSenior.create',
  action: () => {
    BlazeLayout.render('main', {
      name: 'order_createSenior'
    });
  }
});
secureRoute.route('/orderSenior/list', {
  name: 'orderSenior.list',
  action: () => {
    BlazeLayout.render('main', { name: 'orderSenior' });
  }
});
secureRoute.route('/orderHistory/list', {
  name: 'orderHistory.list',
  action: () => {
    BlazeLayout.render('main', { name: 'orderHistory' });
  }
});
secureRoute.route('/orderReport/list', {
  name: 'orderReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'orderReport' });
  }
});
secureRoute.route('/orderOwnReport/list', {
  name: 'orderOwnReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'orderOwnReport' });
  }
});
secureRoute.route('/salesQuotationOwnReport/list', {
  name: 'sQOwnReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'sQOwnReport' });
  }
});
secureRoute.route('/arInvoiceOwnReport/list', {
  name: 'arInvoiceOwnReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'arInvoiceOwnReport' });
  }
});
secureRoute.route('/creditInvoiceOwnReport/list', {
  name: 'creditInvoiceOwnReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'creditInvoiceOwnReport' });
  }
});
secureRoute.route('/salesReturnOwnReport/list', {
  name: 'salesReturnOwnReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturnOwnReport' });
  }
});
secureRoute.route('/creditNoteOwnReport/list', {
  name: 'creditNoteOwnReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'creditNoteOwnReport' });
  }
});
secureRoute.route('/collectionOwnReport/list', {
  name: 'collectionOwnReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionOwnReport' });
  }
});
secureRoute.route('/order/edit', {
  name: 'order.edit',
  action: () => {
    BlazeLayout.render('main', {
      name: 'orderEdits'
    });
  }
});
secureRoute.route('/approvedOrdersForUser/list', {
  name: 'approvedOrdersForUser.list',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedOrdersForUser' });
  }
});
secureRoute.route('/lead/list', {
  name: 'lead.list',
  action: () => {
    BlazeLayout.render('main', { name: 'lead' });
  }
});
secureRoute.route('/lead/create', {
  name: 'lead.create',
  action: () => {
    BlazeLayout.render('main', {
      name: 'lead_create'
    });
  }
});
secureRoute.route('/pickList/create', {
  name: 'pickList.create',
  action: () => {
    BlazeLayout.render('main', {
      name: 'pickList_create'
    });
  }
});
secureRoute.route('/orderApprove/list', {
  name: 'orderApprove.list',
  action: () => {
    BlazeLayout.render('main', { name: 'orderApprove' });
  }
});
secureRoute.route('/approvedOrders/list', {
  name: 'approvedOrders.list',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedOrders' });
  }
});
secureRoute.route('/databaseSync/list', {
  name: 'databaseSync.list',
  action: () => {
    BlazeLayout.render('main', { name: 'databaseSync' });
  }
});
secureRoute.route('/orderOnHold/list', {
  name: 'orderOnHold.list',
  action: () => {
    BlazeLayout.render('main', { name: 'orderOnHold' });
  }
});
secureRoute.route('/orderRejected/list', {
  name: 'orderRejected.list',
  action: () => {
    BlazeLayout.render('main', { name: 'orderRejected' });
  }
});
secureRoute.route('/creditInvoice/list', {
  name: 'creditInvoice',
  action: () => {
    BlazeLayout.render('main', { name: 'creditInvoice' });
  }
});
secureRoute.route('/creditInvoice/create', {
  name: 'creditInvoice.create',
  action: () => {
    BlazeLayout.render('main', { name: 'creditInvoice_create' });
  }
});
secureRoute.route('/creditInvoiceApprove/list', {
  name: 'creditInvoiceApprove',
  action: () => {
    BlazeLayout.render('main', { name: 'creditInvoiceApprove' });
  }
});
secureRoute.route('/approvedCreditInvoice/list', {
  name: 'approvedCreditInvoice',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedCreditInvoice' });
  }
});
secureRoute.route('/creditInvoiceOnHold/list', {
  name: 'creditInvoiceOnHold',
  action: () => {
    BlazeLayout.render('main', { name: 'creditInvoiceOnHold' });
  }
});
secureRoute.route('/creditInvoiceRejected/list', {
  name: 'creditInvoiceRejected',
  action: () => {
    BlazeLayout.render('main', { name: 'creditInvoiceRejected' });
  }
});
secureRoute.route('/branchTransfer/list', {
  name: 'branchTransfer',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransfer' });
  }
});
secureRoute.route('/branchTransferIssue/list', {
  name: 'branchTransferIssue',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransferIssue' });
  }
});
secureRoute.route('/branchTransfer/create', {
  name: 'branchTransfer_create',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransfer_create' });
  }
});
secureRoute.route('/branchTransferIssued/list', {
  name: 'branchTransferIssued',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransferIssued' });
  }
});
secureRoute.route('/branchTransferOnHold/list', {
  name: 'branchTransferOnHold',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransferOnHold' });
  }
});
secureRoute.route('/branchTransferRejected/list', {
  name: 'branchTransferRejected',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransferRejected' });
  }
});

secureRoute.route('/posArInvoicePayment/create', {
  name: 'posArInvoicePayment.create',
  action: () => {
    BlazeLayout.render('main', { name: 'posArInvoicePayment_create' });
  }
});
secureRoute.route('/posArInvoicePayment/list', {
  name: 'arInvoicePayment',
  action: () => {
    BlazeLayout.render('main', { name: 'posArInvoicePayment' });
  }
});

secureRoute.route('/arInvoicePayment/create', {
  name: 'arInvoicePayment.create',
  action: () => {
    BlazeLayout.render('main', { name: 'arInvoicePayment_create' });
  }
});
secureRoute.route('/arInvoicePayment/list', {
  name: 'arInvoicePayment',
  action: () => {
    BlazeLayout.render('main', { name: 'arInvoicePayment' });
  }
});
secureRoute.route('/arInvoicePaymentCreateSenior/create', {
  name: 'arInvoicePaymentCreateSenior.create',
  action: () => {
    BlazeLayout.render('main', { name: 'arInvoicePaymentCreateSenior' });
  }
});
secureRoute.route('/arInvoiceSenior/list', {
  name: 'arInvoiceSenior',
  action: () => {
    BlazeLayout.render('main', { name: 'arInvoiceSenior' });
  }
});
secureRoute.route('/arInvoicePaymentReport/list', {
  name: 'arInvoicePaymentReport',
  action: () => {
    BlazeLayout.render('main', { name: 'arInvoicePaymentReport' });
  }
});
secureRoute.route('/posInvoiceReport/list', {
  name: 'posInvoiceReport',
  action: () => {
    BlazeLayout.render('main', { name: 'posInvoiceReport' });
  }
});
secureRoute.route('/creditInvoiceReport/list', {
  name: 'creditInvoiceReport',
  action: () => {
    BlazeLayout.render('main', { name: 'creditInvoiceReport' });
  }
});
secureRoute.route('/creditNoteReport/list', {
  name: 'creditNoteReport',
  action: () => {
    BlazeLayout.render('main', { name: 'creditNoteReport' });
  }
});
secureRoute.route('/salesReturnReport/list', {
  name: 'salesReturnReport',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturnReport' });
  }
});
secureRoute.route('/branchTransferReport/list', {
  name: 'branchTransferReport',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransferReport' });
  }
});
secureRoute.route('/approvedBranchTransfer/list', {
  name: 'approvedBranchTransfer',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedBranchTransfer' });
  }
});
secureRoute.route('/salesQuotation/list', {
  name: 'salesQuotation',
  action: () => {
    BlazeLayout.render('main', { name: 'salesQuotation' });
  }
});
secureRoute.route('/salesQuotationSenior/list', {
  name: 'salesQuotationSenior',
  action: () => {
    BlazeLayout.render('main', { name: 'salesQuotationSenior' });
  }
});
secureRoute.route('/salesQuotation/create', {
  name: 'salesQuotation.create',
  action: () => {
    BlazeLayout.render('main', { name: 'salesQuotation_create' });
  }
});
secureRoute.route('/salesQuotationCreateSenior/create', {
  name: 'salesQuotation_createSenior.create',
  action: () => {
    BlazeLayout.render('main', { name: 'salesQuotation_createSenior' });
  }
});
secureRoute.route('/salesQuotationApprove/list', {
  name: 'salesQuotationApprove.create',
  action: () => {
    BlazeLayout.render('main', { name: 'quotationApprove' });
  }
});
secureRoute.route('/systemConfig/list', {
  name: 'systemConfig.list',
  action: () => {
    BlazeLayout.render('main', { name: 'systemConfig' });
  }
});
secureRoute.route('/approvedSalesQuotations/list', {
  name: 'approvedSalesQuotations.create',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedQuotations' });
  }
});
secureRoute.route('/salesQuotationOnHold/list', {
  name: 'quotationOnHold.create',
  action: () => {
    BlazeLayout.render('main', { name: 'quotationOnHold' });
  }
});
secureRoute.route('/salesQuotationRejected/list', {
  name: 'quotationRejected.create',
  action: () => {
    BlazeLayout.render('main', { name: 'quotationRejected' });
  }
});
secureRoute.route('/salesQuotationReport/list', {
  name: 'sQReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'sQReport' });
  }
});
secureRoute.route('/pickList/list', {
  name: 'pickList.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pickList' });
  }
});
secureRoute.route('/pickListHistory/list', {
  name: 'pickListHistory.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pickListHistory' });
  }
});
secureRoute.route('/salesReturn/list', {
  name: 'salesReturn.list',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturn' });
  }
});
secureRoute.route('/deliveryDispatch/list', {
  name: 'deliveryDispatch.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryDispatch' });
  }
});
secureRoute.route('/deliveryManagerHistory/list', {
  name: 'deliveryManagerHistory.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryManagerHistory' });
  }
});
secureRoute.route('/salesReturn/create', {
  name: 'salesReturn.create',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturn_create' });
  }
});
secureRoute.route('/salesReturnApprove/list', {
  name: 'salesReturnApprove.list',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturnApprove' });
  }
});
secureRoute.route('/approvedSalesReturn/list', {
  name: 'approvedSalesReturn.list',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedSalesReturn' });
  }
});
secureRoute.route('/salesReturnOnHold/list', {
  name: 'salesReturnOnHold.list',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturnOnHold' });
  }
});
secureRoute.route('/salesReturnRejected/list', {
  name: 'salesReturnRejected.list',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturnRejected' });
  }
});

// secureRoute.route('/activitiesFullList/list', {
//   name: 'activitiesFullList.list',
//   action: () => {
//     BlazeLayout.render('main', { name: 'activitiesFullList' });
//   }
// });

secureRoute.route('/stockTransferApproval/list', {
  name: 'stockTransferApproval.list',
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransferApproval' });
  }
});
secureRoute.route('/stockTransferApproved/list', {
  name: 'stockTransferApproved.list',
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransferApproved' });
  }
});
secureRoute.route('/stockTransferOnHold/list', {
  name: 'stockTransferOnHold.list',
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransferOnHold' });
  }
});
secureRoute.route('/stockTransferRejected/list', {
  name: 'stockTransferRejected.list',
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransferRejected' });
  }
});
secureRoute.route('/stockTransferReport/list', {
  name: 'stockTransferReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransferReport' });
  }
});
secureRoute.route('/creditNote/list', {
  name: 'creditNote.list',
  action: () => {
    BlazeLayout.render('main', { name: 'creditNote' });
  }
});
secureRoute.route('/creditNote/create', {
  name: 'creditNote.create',
  action: () => {
    BlazeLayout.render('main', { name: 'creditNote_create' });
  }
});
secureRoute.route('/creditNoteApprove/list', {
  name: 'creditNoteApprove.list',
  action: () => {
    BlazeLayout.render('main', { name: 'creditNoteApprove' });
  }
});
secureRoute.route('/approvedCreditNote/list', {
  name: 'approvedCreditNote.list',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedCreditNote' });
  }
});
secureRoute.route('/creditNoteOnHold/list', {
  name: 'creditNoteOnHold.list',
  action: () => {
    BlazeLayout.render('main', { name: 'creditNoteOnHold' });
  }
});
secureRoute.route('/creditNoteRejected/list', {
  name: 'creditNoteRejected.list',
  action: () => {
    BlazeLayout.render('main', { name: 'creditNoteRejected' });
  }
});
secureRoute.route('/invoice/list', {
  name: 'invoice.list',
  action: () => {
    BlazeLayout.render('main', { name: 'invoice' });
  }
});
secureRoute.route('/collectionList/list', {
  name: 'collectionList.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionList' });
  }
});
secureRoute.route('/collectionReport/list', {
  name: 'collectionReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionReport' });
  }
});
secureRoute.route('/invoice/create', {
  name: 'invoice.create',
  action: () => {
    BlazeLayout.render('main', { name: 'invoice_create' });
  }
});
secureRoute.route('/sales/dashboard', {
  name: 'sales.dashboard',
  action: () => {
    BlazeLayout.render('main', { name: 'sales_dashboard' });
  }
});
secureRoute.route('/admin/dashboard', {
  name: 'admin.dashboard',
  action: () => {
    BlazeLayout.render('main', { name: 'admin_dashboard' });
  }
});
secureRoute.route('/cxo/dashboard', {
  name: 'cxo.dashboard',
  action: () => {
    BlazeLayout.render('main', { name: 'cxo_Dashboard' });
  }
});
secureRoute.route('/delivery/list', {
  name: 'delivery.list',
  action: () => {
    BlazeLayout.render('main', { name: 'delivery' });
  }
});
secureRoute.route('/warehouseStockReport/list', {
  name: 'warehouseStockReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'warehouseStockReport' });
  }
});
secureRoute.route('/deliveryHistory/list', {
  name: 'deliveryHistory.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryHistory' });
  }
});
secureRoute.route('/invoiceHistory/list', {
  name: 'invoiceHistory.list',
  action: () => {
    BlazeLayout.render('main', { name: 'invoiceHistory' });
  }
});
secureRoute.route('/deliveryBoyHistory/list', {
  name: 'deliveryBoyHistory.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryBoyHistory' });
  }
});
secureRoute.route('/deliveryBoyHistoryForUsers/list', {
  name: 'deliveryBoyHistoryForUsers.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryBoyHistoryForUsers' });
  }
});
secureRoute.route('/dispatch/list', {
  name: 'dispatch.list',
  action: () => {
    BlazeLayout.render('main', { name: 'dispatch' });
  }
});
secureRoute.route('/collectionDueToday/list', {
  name: 'collectionDueToday.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionDueToday' });
  }
});
secureRoute.route('/collection/list', {
  name: 'collection.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionDueToday' });
  }
});
secureRoute.route('/collection/create', {
  name: 'collection.create',
  action: () => {
    BlazeLayout.render('main', { name: 'collection_create' });
  }
});
secureRoute.route('/stockTransfer/list', {
  name: 'stockTransfer.list',
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransfer' });
  }
});
secureRoute.route('/stockTransfer/create', {
  name: 'stockTransfer.create',
  action: () => {
    BlazeLayout.render('main', { name: 'stockTransfer_create' });
  }
});
secureRoute.route('/deliveryReport/list', {
  name: 'deliveryReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryReport' });
  }
});
secureRoute.route('/deliveryReportForUsers/list', {
  name: 'deliveryReportForUsers.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryReportForUsers' });
  }
});
secureRoute.route('/dispatchDelivered/list', {
  name: 'dispatchDelivered.list',
  action: () => {
    BlazeLayout.render('main', { name: 'dispatchDelivered' });
  }
});
secureRoute.route('/dispatchPartiallyDelivered/list', {
  name: 'dispatchRejected.list',
  action: () => {
    BlazeLayout.render('main', { name: 'dispatchRejected' });
  }
});
secureRoute.route('/dispatchForDelivery/list', {
  name: 'dispatchForDelivery.list',
  action: () => {
    BlazeLayout.render('main', { name: 'dispatchForDelivery' });
  }
});
secureRoute.route('/collectionList/list', {
  name: 'collectionList.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionList' });
  }
});
secureRoute.route('/collectionListForAccountant/list', {
  name: 'collectionListForAccountant.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionListForAccountant' });
  }
});
secureRoute.route('/collectionLists/list', {
  name: 'collectionLists.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionLists' });
  }
});
secureRoute.route('/collectionDueTodayFullList/list', {
  name: 'collectionDueTodayFullList.list',
  action: () => {
    BlazeLayout.render('main', { name: 'collectionDueTodayFullList' });
  }
});
secureRoute.route('/systemConfig/list', {
  name: 'systemConfig.list',
  action: () => {
    BlazeLayout.render('main', { name: 'systemConfig' });
  }
});
secureRoute.route('/invoice/list', {
  name: 'invoice.list',
  action: () => {
    BlazeLayout.render('main', { name: 'invoice' });
  }
});
secureRoute.route('/invoiceReport/list', {
  name: 'invoiceReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'invoiceReport' });
  }
});
secureRoute.route('/deliveryAssignedHistory/list', {
  name: 'deliveryAssignedHistory.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryAssignedHistory' });
  }
});
secureRoute.route('/deliveryReport/list', {
  name: 'deliveryReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'deliveryReport' });
  }
});
secureRoute.route('/purchaseInvoice/list', {
  name: 'purchaseInvoice.list',
  action: () => {
    BlazeLayout.render('main', { name: 'purchaseInvoice' });
  }
});
secureRoute.route('/purchaseInvoiceReport/list', {
  name: 'purchaseInvoiceReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'purchaseInvoiceReport' });
  }
});
secureRoute.route('/branchTransferIssuedReport/list', {
  name: 'branchTransferIssuedReport.list',
  action: () => {
    BlazeLayout.render('main', { name: 'branchTransferIssuedReport' });
  }
});
secureRoute.route('/approvedOrdersDashboard/list', {
  name: 'approvedOrdersDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedOrdersDashboard' });
  }
});
secureRoute.route('/pendingOrdersDashboard/list', {
  name: 'pendingOrdersDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pendingOrdersDashboard' });
  }
});
secureRoute.route('/pendingOrders/list', {
  name: 'pendingOrders.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pendingOrders' });
  }
});
secureRoute.route('/rejectedOrdersDashboard/list', {
  name: 'rejectedOrdersDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'rejectedOrdersDashboard' });
  }
});
secureRoute.route('/onHoldOrdersDashboard/list', {
  name: 'onHoldOrdersDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'onHoldOrdersDashboard' });
  }
});
secureRoute.route('/approvedQuotationsDashboard/list', {
  name: 'approvedQuotationsDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedQuotationsDashboard' });
  }
});
secureRoute.route('/pendingQuotationsDashboard/list', {
  name: 'pendingQuotationsDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pendingQuotationsDashboard' });
  }
});
secureRoute.route('/rejectedQuotationsDashboard/list', {
  name: 'rejectedQuotationsDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'rejectedQuotationsDashboard' });
  }
});
secureRoute.route('/onHoldQuotationsDashboard/list', {
  name: 'onHoldQuotationsDashboard.list',
  action: () => {
    BlazeLayout.render('main', { name: 'onHoldQuotationsDashboard' });
  }
});
secureRoute.route('/activities/list', {
  name: 'activities.list',
  action: () => {
    BlazeLayout.render('main', { name: 'activities' });
  }
});
secureRoute.route('/invoiceApprove/list', {
  name: 'invoiceApprove.list',
  action: () => {
    BlazeLayout.render('main', { name: 'invoiceApprove' });
  }
});
secureRoute.route('/approvedInvoice/list', {
  name: 'approvedInvoice.list',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedInvoice' });
  }
});
secureRoute.route('/invoiceOnHold/list', {
  name: 'invoiceOnHold.list',
  action: () => {
    BlazeLayout.render('main', { name: 'invoiceOnHold' });
  }
});
secureRoute.route('/invoiceRejected/list', {
  name: 'invoiceRejected.list',
  action: () => {
    BlazeLayout.render('main', { name: 'invoiceRejected' });
  }
});
secureRoute.route('/pendingInvoices/list', {
  name: 'pendingInvoices.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pendingInvoices' });
  }
});
secureRoute.route('/pendingCreditInvoice/list', {
  name: 'pendingCreditInvoice.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pendingCreditInvoice' });
  }
});

// for customer portal
secureRoute.route('/userApproval/list', {
  name: 'userApproval.list',
  action: () => {
    BlazeLayout.render('main', { name: 'userApproval' });
  }
});
secureRoute.route('/rejectedUsers/list', {
  name: 'rejectedUsers.list',
  action: () => {
    BlazeLayout.render('main', { name: 'rejectedUsers' });
  }
});
secureRoute.route('/customer/list', {
  name: 'bpUser',
  action: () => {
    BlazeLayout.render('main', { name: 'bpUser' });
  }
});
secureRoute.route('/salesReturnRequest/list', {
  name: 'salesReturnRequest.list',
  action: () => {
    BlazeLayout.render('main', { name: 'salesReturnRequest' });
  }
});
secureRoute.route('/customerPaymentRequest/list', {
  name: 'customerPaymentRequest.list',
  action: () => {
    BlazeLayout.render('main', { name: 'customerPaymentRequest' });
  }
});
secureRoute.route('/posCreditInvoice/list', {
  name: 'posCreditInvoice.list',
  action: () => {
    BlazeLayout.render('main', { name: 'posCreditInvoice' });
  }
});
secureRoute.route('/group/list', {
  name: 'group.list',
  action: () => {
    BlazeLayout.render('main', { name: 'group' });
  }
});
secureRoute.route('/group/create', {
  name: 'group.create',
  action: () => {
    BlazeLayout.render('main', { name: 'group_create' });
  }
});

secureRoute.route('/route/list', {
  name: 'route.list',
  action: () => {
    BlazeLayout.render('main', { name: 'route' });
  }
});

secureRoute.route('/pendingArInvoicePayment/list', {
  name: 'pendingArInvoicePayment.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pendingArInvoicePayment' });
  }
});

secureRoute.route('/pendingPosInvoices/list', {
  name: 'pendingPosInvoices.list',
  action: () => {
    BlazeLayout.render('main', { name: 'pendingPosInvoices' });
  }
});
secureRoute.route('/route/create', {
  name: 'route.create',
  action: () => {
    BlazeLayout.render('main', { name: 'route_create' });
  }
});

secureRoute.route('/routeWiseMap/:_id', {
  name: 'routeWiseMap',
  action: () => {
    BlazeLayout.render('main', { name: 'routeWiseMap' });
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

secureRoute.route('/routeAssignReport/list', {
  name: 'routeAssignReport',
  action: () => {
    BlazeLayout.render('main', { name: 'routeAssignReport' });
  }
});

secureRoute.route('/routeCheckInOutReport/list', {
  name: 'routeCheckInOutReport',
  action: () => {
    BlazeLayout.render('main', { name: 'routeCheckInOutReport' });
  }
});

secureRoute.route('/attendance/list', {
  name: 'attendance',
  action: () => {
    BlazeLayout.render('main', { name: 'attendance' });
  }
});

secureRoute.route('/routeApprove/list', {
  name: 'routeApprove',
  action: () => {
    BlazeLayout.render('main', { name: 'routeApprove' });
  }
});

secureRoute.route('/approvedRoutes/list', {
  name: 'approvedRoutes',
  action: () => {
    BlazeLayout.render('main', { name: 'approvedRoutes' });
  }
});

secureRoute.route('/rejectedRoutes/list', {
  name: 'rejectedRoutes',
  action: () => {
    BlazeLayout.render('main', { name: 'rejectedRoutes' });
  }
});

secureRoute.route('/skipRemarks/list', {
  name: 'skipRemarks',
  action: () => {
    BlazeLayout.render('main', { name: 'skipRemarks' });
  }
});

secureRoute.route('/leadQuotation/list', {
  name: 'leadQuotation',
  action: () => {
    BlazeLayout.render('main', { name: 'leadQuotation' });
  }
});

secureRoute.route('/salesmanWiseLocReport/list', {
  name: 'salesmanWiseLocReport',
  action: () => {
    BlazeLayout.render('main', { name: 'salesmanWiseLocReport' });
  }
});

secureRoute.route('/skippedCustomerReport/list', {
  name: 'skippedCustomerReport',
  action: () => {
    BlazeLayout.render('main', { name: 'skippedCustomerReport' });
  }
});

secureRoute.route('/noTransactionReport/list', {
  name: 'noTransactionReport',
  action: () => {
    BlazeLayout.render('main', { name: 'noTransactionReport' });
  }
});

secureRoute.route('/salesSummaryReport/list', {
  name: 'salesSummaryReport',
  action: () => {
    BlazeLayout.render('main', { name: 'salesSummaryReport' });
  }
});


secureRoute.route('/stockSummaryReport/list', {
  name: 'stockSummaryReport',
  action: () => {
    BlazeLayout.render('main', { name: 'stockSummaryReport' });
  }
});

secureRoute.route('/superAdmin/dashboard', {
  name: 'superAdmin.dashboard',
  action: () => {
    BlazeLayout.render('main', { name: 'superAdminDashboard' });
  }
});

secureRoute.route('/targetOutletReport/list', {
  name: 'targetOutletReport',
  action: () => {
    BlazeLayout.render('main', { name: 'targetOutletReport' });
  }
});

secureRoute.route('/callRateReport/list', {
  name: 'callRateReport',
  action: () => {
    BlazeLayout.render('main', { name: 'callRateReport' });
  }
});

secureRoute.route('/strikeRateReport/list', {
  name: 'strikeRateReport',
  action: () => {
    BlazeLayout.render('main', { name: 'strikeRateReport' });
  }
});
secureRoute.route('/itemWiseSalesReport/list', {
  name: 'itemWiseSalesReport',
  action: () => {
    BlazeLayout.render('main', { name: 'itemWiseSalesReport' });
  }
});
secureRoute.route('/numericalDistributon/list', {
  name: 'numericalDistributon',
  action: () => {
    BlazeLayout.render('main', { name: 'numericalDistributon' });
  }
});

secureRoute.route('/branchWiseStockReport/list', {
  name: 'branchWiseStockReport',
  action: () => {
    BlazeLayout.render('main', { name: 'branchWiseStockReport' });
  }
});

secureRoute.route('/weightageDistributionReport/list', {
  name: 'weightageDistributionReport',
  action: () => {
    BlazeLayout.render('main', { name: 'weightageDistributionReport' });
  }
});

secureRoute.route('/coverageDistributionReport/list', {
  name: 'coverageDistributionReport',
  action: () => {
    BlazeLayout.render('main', { name: 'coverageDistributionReport' });
  }
});

secureRoute.route('/expenseReport/list', {
  name: 'expenseReport',
  action: () => {
    BlazeLayout.render('main', { name: 'expenseReport' });
  }
});

secureRoute.route('/expenseCategory/list', {
  name: 'expenseCategory',
  action: () => {
    BlazeLayout.render('main', { name: 'expenseCategory' });
  }
});

secureRoute.route('/locationManagement/list', {
  name: 'locationManagement',
  action: () => {
    BlazeLayout.render('main', { name: 'locationManagement' });
  }
});

secureRoute.route('/routeBoundaryUpdate/:_id', {
  name: 'routeBoundaryUpdate',
  action: () => {
    BlazeLayout.render('main', { name: 'routeBoundaryUpdate' });
  }
});

secureRoute.route('/branch/list', {
  name: 'branch',
  action: () => {
    BlazeLayout.render('main', { name: 'branch' });
  }
});

secureRoute.route('/wareHouse/list', {
  name: 'wareHouse',
  action: () => {
    BlazeLayout.render('main', { name: 'wareHouse' });
  }
});

secureRoute.route('/wareHouseStock/list', {
  name: 'wareHouseStock',
  action: () => {
    BlazeLayout.render('main', { name: 'wareHouseStock' });
  }
});
secureRoute.route('/customerMaster/list', {
  name: 'customer',
  action: () => {
    BlazeLayout.render('main', { name: 'customer' });
  }
});
secureRoute.route('/customerAddress/list', {
  name: 'customerAddress',
  action: () => {
    BlazeLayout.render('main', { name: 'customerAddress' });
  }
});

secureRoute.route('/customerPriceList/list', {
  name: 'customerPriceList',
  action: () => {
    BlazeLayout.render('main', { name: 'customerPriceList' });
  }
});

secureRoute.route('/items/list', {
  name: 'item',
  action: () => {
    BlazeLayout.render('main', { name: 'item' });
  }
});

secureRoute.route('/itemsCategory/list', {
  name: 'itemCategory',
  action: () => {
    BlazeLayout.render('main', { name: 'itemCategory' });
  }
});

secureRoute.route('/itemPriceListMaster/list', {
  name: 'itemPriceListMaster',
  action: () => {
    BlazeLayout.render('main', { name: 'itemPriceListMaster' });
  }
});

secureRoute.route('/itemGetPrice/list', {
  name: 'itemGetPrice',
  action: () => {
    BlazeLayout.render('main', { name: 'itemGetPrice' });
  }
});

secureRoute.route('/unit/list', {
  name: 'unit',
  action: () => {
    BlazeLayout.render('main', { name: 'unit' });
  }
});

secureRoute.route('/tax/list', {
  name: 'tax',
  action: () => {
    BlazeLayout.render('main', { name: 'tax' });
  }
});

secureRoute.route('/returnReason/list', {
  name: 'returnReason',
  action: () => {
    BlazeLayout.render('main', { name: 'returnReason' });
  }
});

secureRoute.route('/returnAction/list', {
  name: 'returnAction',
  action: () => {
    BlazeLayout.render('main', { name: 'returnAction' });
  }
});

publicRoute.notFound = {
  action() {
    BlazeLayout.render('main', { name: 'notFound' });
  },
};