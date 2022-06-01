/**
 * @author Nithin
 */
import { Meteor } from "meteor/meteor";
import { allUsers } from '../user/user';
import { Verticals } from '../verticals/verticals';
import { CreditSale } from "../creditSale/creditSale";
import { Order } from '../order/order';
Meteor.methods({

  /**
   * TODO: Complete JS doc
   * @param id
   * @param name
   * @param description
   * @param historyView
   * @param reportView 
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
   * @param adminDashboard
   * @param salesDashboard
   * @param orderCreate
   * @param superAdminDashboard 
   * @param superAdminView
   * @param businessHeadView
   * @param bdmView
   * @param coordinatorView
   * @param sdView
   * @param sdUserApproveView
   * @param stockTransferView
   * @param masterDataView
   * @param masterDataUpdate
   * @param masterDataCreate
   * @param masterDataDelete  
   * @param outletsApproveView
   * @param routeAssignView
   * @param vsrView
   * @param omrView
   * @param wseView
   * @param attendanceView
   * @param stockListView
   * @param outletTrackerView
  */
  'role.createOrUpdate': (id, name, description, url, historyView, reportView,
    userView, userUpdate, userCreate, userDelete, vanSaleUserView, vanSaleUserUpdate, vanSaleUserCreate, vanSaleUserDelete,
    roleView, roleUpdate, roleCreate, roleDelete, adminDashboard, salesDashboard,
    orderCreate, orderView, superAdminDashboard, rolesUnder, superAdminView, businessHeadView,
    bdmView, coordinatorView, sdView, sdUserApproveView, stockTransferView,
    masterDataView, masterDataUpdate, masterDataCreate, masterDataDelete, outletsApproveView,
    routeView, routeUpdate, routeCreate, routeDelete, routeAssignView,
    vsrView, omrView, wseView, attendanceView, stockListView,
    verticalsView, verticalsUpdate, verticalsCreate, verticalsDelete,
    outletsView, outletsUpdate, outletsCreate, outletsDelete,
    sdMasterView, sdMasterUpdate, sdMasterCreate, sdMasterDelete, branchView, branchCreate,
    branchUpdate, branchDelete, locationView, locationCreate, locationUpdate,
    locationDelete, priceTypeView, priceTypeCreate, priceTypeUpdate,
    priceTypeDelete, productView, productCreate, productUpdate, productDelete, unitView, unitCreate,
    unitUpdate, unitDelete, priceView, priceCreate, priceUpdate, priceDelete, taxView, taxCreate,
    taxUpdate, taxDelete, administrationView, sdPriceListView, deliveryListView, collectionListView,
    deliveryUpdate, collectionUpdate, orderApprove, stockAcceptView,
    sdOutletsView, sdOutletsUpdate, sdOutletsCreate, sdOutletsDelete,
    cashSalesView, cashSalesUpdate, cashSalesCreate, cashSalesDelete,
    cashSalesReportView, stockReportView,
    creditSaleView, creditSaleUpdate, creditSaleCreate, creditSaleDelete,
    stockReturnView, orderReport, stockSummaryView, creditSaleReport,
    brandView, brandUpdate, brandCreate, brandDelete,
    categoryView, categoryUpdate, categoryCreate, categoryDelete,
    sdUserStockHistoryView, sdUserStockSummaryView, verticalSaleReportview,
    sdReportsView, bdmReportsView, bhReportsView, outletTrackerView,
  ) => {

    let permission = [];
    if (historyView === true) {
      permission.push('historyView');
    };
    if (reportView === true) {
      permission.push('reportView');
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

    if (orderCreate === true) {
      permission.push('orderCreate');
    };
    if (orderView === true) {
      permission.push('orderView');
    };

    if (adminDashboard === true) {
      permission.push('adminDashboard');
    };
    if (salesDashboard === true) {
      permission.push('salesDashboard');
    };
    if (superAdminDashboard === true) {
      permission.push('superAdminDashboard');
    };
    if (superAdminView === true) {
      permission.push('superAdminView');
    };
    if (businessHeadView === true) {
      permission.push('businessHeadView');
    };
    if (bdmView === true) {
      permission.push('bdmView');
    };
    if (coordinatorView === true) {
      permission.push('coordinatorView');
    };
    if (sdView === true) {
      permission.push('sdView');
    };
    if (sdUserApproveView === true) {
      permission.push('sdUserApproveView');
    };
    if (stockTransferView === true) {
      permission.push('stockTransferView');
    };
    if (masterDataCreate === true) {
      permission.push('masterDataCreate');
    };
    if (masterDataDelete === true) {
      permission.push('masterDataDelete');
    };
    if (masterDataUpdate === true) {
      permission.push('masterDataUpdate');
    };
    if (masterDataView === true) {
      permission.push('masterDataView');
    };
    if (outletsApproveView === true) {
      permission.push('outletsApproveView');
    };
    if (routeCreate === true) {
      permission.push('routeCreate');
    };
    if (routeDelete === true) {
      permission.push('routeDelete');
    };
    if (routeUpdate === true) {
      permission.push('routeUpdate');
    };
    if (routeView === true) {
      permission.push('routeView');
    };
    if (routeAssignView === true) {
      permission.push('routeAssignView');
    };
    if (vsrView === true) {
      permission.push('vsrView');
    };
    if (omrView === true) {
      permission.push('omrView');
    };
    if (wseView === true) {
      permission.push('wseView');
    };
    if (attendanceView === true) {
      permission.push('attendanceView');
    };
    if (stockListView === true) {
      permission.push('stockListView');
    };

    if (verticalsCreate === true) {
      permission.push('verticalsCreate');
    };
    if (verticalsDelete === true) {
      permission.push('verticalsDelete');
    };
    if (verticalsUpdate === true) {
      permission.push('verticalsUpdate');
    };
    if (verticalsView === true) {
      permission.push('verticalsView');
    };

    if (outletsCreate === true) {
      permission.push('outletsCreate');
    };
    if (outletsDelete === true) {
      permission.push('outletsDelete');
    };
    if (outletsUpdate === true) {
      permission.push('outletsUpdate');
    };
    if (outletsView === true) {
      permission.push('outletsView');
    };

    if (sdMasterCreate === true) {
      permission.push('sdMasterCreate');
    };
    if (sdMasterDelete === true) {
      permission.push('sdMasterDelete');
    };
    if (sdMasterUpdate === true) {
      permission.push('sdMasterUpdate');
    };
    if (sdMasterView === true) {
      permission.push('sdMasterView');
    };

    if (branchView === true) {
      permission.push('branchView');
    };
    if (branchCreate === true) {
      permission.push('branchCreate');
    };
    if (branchUpdate === true) {
      permission.push('branchUpdate');
    };
    if (branchDelete === true) {
      permission.push('branchDelete');
    };
    if (locationView === true) {
      permission.push('locationView');
    };
    if (locationCreate === true) {
      permission.push('locationCreate');
    };
    if (locationUpdate === true) {
      permission.push('locationUpdate');
    };
    if (locationDelete === true) {
      permission.push('locationDelete');
    };
    if (priceTypeView === true) {
      permission.push('priceTypeView');
    };
    if (priceTypeCreate === true) {
      permission.push('priceTypeCreate');
    };
    if (priceTypeUpdate === true) {
      permission.push('priceTypeUpdate');
    };
    if (priceTypeDelete === true) {
      permission.push('priceTypeDelete');
    };
    if (productView === true) {
      permission.push('productView');
    };
    if (productCreate === true) {
      permission.push('productCreate');
    };
    if (productUpdate === true) {
      permission.push('productUpdate');
    };
    if (productDelete === true) {
      permission.push('productDelete');
    };
    if (unitView === true) {
      permission.push('unitView');
    };
    if (unitCreate === true) {
      permission.push('unitCreate');
    };
    if (unitUpdate === true) {
      permission.push('unitUpdate');
    };
    if (unitDelete === true) {
      permission.push('unitDelete');
    };
    if (priceView === true) {
      permission.push('priceView');
    };
    if (priceCreate === true) {
      permission.push('priceCreate');
    };
    if (priceUpdate === true) {
      permission.push('priceUpdate');
    };
    if (priceDelete === true) {
      permission.push('priceDelete');
    };
    if (taxView === true) {
      permission.push('taxView');
    };
    if (taxCreate === true) {
      permission.push('taxCreate');
    };
    if (taxUpdate === true) {
      permission.push('taxUpdate');
    };
    if (taxDelete === true) {
      permission.push('taxDelete');
    };
    if (administrationView === true) {
      permission.push('administrationView');
    };

    if (sdPriceListView === true) {
      permission.push('sdPriceListView');
    };

    if (deliveryListView === true) {
      permission.push('deliveryListView');
    };
    if (collectionListView === true) {
      permission.push('collectionListView');
    };
    if (deliveryUpdate === true) {
      permission.push('deliveryUpdate');
    };
    if (collectionUpdate === true) {
      permission.push('collectionUpdate');
    };
    if (orderApprove === true) {
      permission.push('orderApprove');
    };
    if (stockAcceptView === true) {
      permission.push('stockAcceptView');
    };

    if (sdOutletsCreate === true) {
      permission.push('sdOutletsCreate');
    };
    if (sdOutletsDelete === true) {
      permission.push('sdOutletsDelete');
    };
    if (sdOutletsUpdate === true) {
      permission.push('sdOutletsUpdate');
    };
    if (sdOutletsView === true) {
      permission.push('sdOutletsView');
    };
    if (cashSalesCreate === true) {
      permission.push('cashSalesCreate');
    };
    if (cashSalesDelete === true) {
      permission.push('cashSalesDelete');
    };
    if (cashSalesUpdate === true) {
      permission.push('cashSalesUpdate');
    };
    if (cashSalesView === true) {
      permission.push('cashSalesView');
    };
    if (cashSalesReportView === true) {
      permission.push('cashSalesReportView');
    };
    if (orderReport === true) {
      permission.push('orderReport');
    };
    if (stockReportView === true) {
      permission.push('stockReportView');
    };
    if (creditSaleCreate === true) {
      permission.push('creditSaleCreate');
    };
    if (creditSaleDelete === true) {
      permission.push('creditSaleDelete');
    };
    if (creditSaleUpdate === true) {
      permission.push('creditSaleUpdate');
    };
    if (creditSaleView === true) {
      permission.push('creditSaleView');
    };
    if (stockReturnView === true) {
      permission.push('stockReturnView');
    };
    if (stockSummaryView === true) {
      permission.push('stockSummaryView');
    };
    if (creditSaleReport === true) {
      permission.push('creditSaleReport');
    };

    if (brandCreate === true) {
      permission.push('brandCreate');
    };
    if (brandDelete === true) {
      permission.push('brandDelete');
    };
    if (brandUpdate === true) {
      permission.push('brandUpdate');
    };
    if (brandView === true) {
      permission.push('brandView');
    };

    if (categoryCreate === true) {
      permission.push('categoryCreate');
    };
    if (categoryDelete === true) {
      permission.push('categoryDelete');
    };
    if (categoryUpdate === true) {
      permission.push('categoryUpdate');
    };
    if (categoryView === true) {
      permission.push('categoryView');
    };
    if (sdUserStockHistoryView === true) {
      permission.push('sdUserStockHistoryView');
    };
    if (sdUserStockSummaryView === true) {
      permission.push('sdUserStockSummaryView');
    };
    if (verticalSaleReportview === true) {
      permission.push('verticalSaleReportview');
    };

    if (sdReportsView === true) {
      permission.push('sdReportsView');
    };

    if (bdmReportsView === true) {
      permission.push('bdmReportsView');
    }; if (bhReportsView === true) {
      permission.push('bhReportsView');
    };
    if (outletTrackerView === true) {
      permission.push('outletTrackerView');
    };

    if (id) {
      return Meteor.roles.update({ _id: id }, {
        $set: {
          name: name.trim(),
          description: description,
          homePage: url,
          permissions: permission,
          rolesUnder: rolesUnder,
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
        rolesUnder: rolesUnder,
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
    return Meteor.roles.find({ 'isDeleted': false, rolesUnder: "MD" }, { sort: { name: 1 } }).fetch();
  },
  'role.details': (r) => {
    return Meteor.roles.find({ _id: r }, { isDeleted: false }).fetch();
  },
  'role.roleName': (id) => {
    return Meteor.roles.findOne({ _id: id });
  },
  'role.roleName1': (user) => {
    let userDetails = allUsers.findOne({ _id: user });
    let id = userDetails.roles;
    let data = Meteor.roles.findOne({ _id: { $in: id } });
    let vsrNot = '';
    if (data) {
      if (data.name == "VSR") {
        vsrNot = userDetails.profile.firstName + '' + userDetails.profile.lastName;
      }
    }
    return vsrNot;
  },
  'role.roleNameUser': (role, user) => {
    let id = role;
    let data = Meteor.roles.findOne({ _id: { $in: id } });
    let vsrNot = '';
    if (data) {
      vsrNot = data.name;
    }
    return vsrNot;
  },
  'role.roleCount': (roleName) => {
    return Meteor.roles.find({
      name: { $regex: new RegExp(roleName.trim(), "i") }
    }).count();
  },
  'role.channelNameGet': () => {
    return Meteor.roles.find({ 'isDeleted': false, rolesUnder: "SD" }, { sort: { name: 1 } }).fetch();
  },

  'roles.rolesListGet': () => {
    return Meteor.roles.find({},).fetch();
  },

  'roles.getTransactionDetails': () => {
    let results = [];
    let subDistributorList = allUsers.find({ active: "Y", userType: "SD" }, {
      fields: {
        profile: 1
      }
    }).fetch();

    if (subDistributorList.length > 0) {
      for (let i = 0; i < subDistributorList.length; i++) {
        let orderCount = Order.find({ subDistributor: subDistributorList[i]._id }).count();
        let creditSales = CreditSale.find({ subDistributor: subDistributorList[i]._id, salesType: 'Credit' }).count();
        let cashSales = CreditSale.find({ subDistributor: subDistributorList[i]._id, salesType: 'Cash' }).count();

        let sudUsers = allUsers.find({ active: "Y", userType: "SDUser", subDistributor: subDistributorList[i]._id }, {
          fields: {
            profile: 1
          }
        }).fetch();
        let userArrays = [];
        if (sudUsers.length > 0) {
          for (let j = 0; j < sudUsers.length; j++) {
            let orderCount1 = Order.find({ sdUser: sudUsers[j]._id }).count();
            let creditSales1 = CreditSale.find({ sdUser: sudUsers[j]._id, salesType: 'Credit' }).count();
            let cashSales1 = CreditSale.find({ sdUser: sudUsers[j]._id, salesType: 'Cash' }).count();
            userArrays.push({
              sdUserName: `${sudUsers[j].profile.firstName} ${sudUsers[j].profile.lastName}`,
              orderCount1: orderCount1,
              creditSales1: creditSales1,
              cashSales1: cashSales1
            })
          }
        }
        results.push({
          subDistributorName: `${subDistributorList[i].profile.firstName} ${subDistributorList[i].profile.lastName}`,
          orderCount: orderCount,
          creditSales: creditSales,
          cashSales: cashSales,
          userArrays: userArrays
        });
      }
    } 
    return results;
  },
  /**
   * 
   * @returns get role wise user details for export
   */
  'roles.getUserExport': () => {
    // get all active roles
    let roleRes = Meteor.roles.find({ 'isDeleted': false }, { sort: { name: 1 } }, { fields: { name: 1 } },).fetch();
    let userListArray = [];
    let roleDetailsGet = [];
    let activeUser = allUsers.find({ active: "Y" }).count();
    let inActiveUser = allUsers.find({ active: "N" }).count();
    if (roleRes.length > 0) {
      for (let i = 0; i < roleRes.length; i++) {
        // get role based user name
        let userDetails = allUsers.find({ roles: roleRes[i]._id },
          { sort: { 'profile.firstName': 1 } },
          {
            fields: {
              profile: 1, username: 1, emails: 1,
              active: 1, vertical: 1, subDistributor: 1, userType: 1
            }
          }).fetch();
        // get inactive use count
        let userDetailsInactive = allUsers.find({ roles: roleRes[i]._id, active: "N" },
        ).count();
        // get active user count
        let userDetailsActive = allUsers.find({ roles: roleRes[i]._id, active: "Y" }
        ).count();
        let roleUserArray = [];
        if (userDetails.length > 0) {
          for (let j = 0; j < userDetails.length; j++) {
            let verticalArray = [];
            let verticalNameArray = [];
            if (userDetails[j].userType === 'SDUser') {
              let sdUserVal = allUsers.findOne({ _id: userDetails[j].subDistributor }, { fields: { vertical: 1 } });
              if (sdUserVal) {
                verticalArray = sdUserVal.vertical;
              }
            }
            else {
              verticalArray = userDetails[j].vertical;
            }
            if (verticalArray.length > 0) {
              for (let k = 0; k < verticalArray.length; k++) {
                let verticalRes = Verticals.findOne({ _id: verticalArray[k] }, { fields: { verticalName: 1 } });
                if (verticalRes) {
                  verticalNameArray.push(verticalRes.verticalName);
                }
              }
            }

            let status = '';
            if (userDetails[j].active === "Y") {
              status = "Active";
            }
            else {
              status = "InActive";
            }
            let roleUserObj = {
              firstName: userDetails[j].profile.firstName,
              lastName: userDetails[j].profile.lastName,
              gender: userDetails[j].profile.gender,
              empCode: userDetails[j].profile.empCode,
              dob: userDetails[j].profile.dateOfBirth,
              userNameVal: userDetails[j].username,
              email: userDetails[j].emails[0].address,
              verticalNameArray: verticalNameArray.toString(),
              status: status,
            };
            roleUserArray.push(roleUserObj);
          }
        }
        let userObj = {
          roleNameVal: roleRes[i].name,
          totalUsersActiveVal: userDetailsActive,
          totalUsersInActiveVal: userDetailsInactive,
          userDetails: roleUserArray,
        };
        userListArray.push(userObj);
      }
      let resDataObj =
      {
        activeUser: activeUser,
        inActiveUser: inActiveUser,
        userListArray: userListArray
      }
      roleDetailsGet.push(resDataObj);
    }
    return roleDetailsGet;
  }
});