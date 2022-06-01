/**
 * @author Visakh
 */

import { Order } from './order';
import { Branch } from '../branch/branch';
import { Notification } from '../notification/notification';
import { Config } from '../config/config';
import { Customer } from '../customer/customer';
import { allUsers } from '../user/user';
import { DeletedOrder } from "../deletedOrder/deletedOrder";
import { CustomerPriceList } from '../customerPriceList/customerPriceList';
// import {salesOrderPost_Url} from '../../startup/client/sapUrls';

let call = true;
let count = 0;
Meteor.methods({

  /**
   * TODO: Complete JS doc
   * @param customer
   * @param dueDate
   * @param itemArray
   * @param branch
   * @param employee
   * @param beforeDiscount
   * @param afterDiscount
   * @param GST
   * @param grandTotal
   */
  'order.createOrUpdate': (customer, dueDate, itemArray, branch, employee, beforeDiscount, afterDiscount, GST,
    grandTotal, totalDiscPercent, remark_order, custRefDate, custRef, address, priceType, priceMode, currency, latitude, longitude, mVATArrayList, weight, taxTotal, street, block, city, ribNumber, driverName, approvalValue, approvalResonArray) => {
    let customerName = Customer.findOne({ cardCode: customer }).cardName;
    let priceTypeName = CustomerPriceList.findOne({ cardCode: customer }).pLName;
    let salesmanName = allUsers.findOne({ _id: employee }).profile.firstName;
    let slpcode = Meteor.user().slpCode;

    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
      totalQty += Number(itemsQty[i].quantity);
    }

    let branchName = Branch.findOne({ bPLId: branch }).bPLName;

    let orderId = Order.insert({
      cardCode: customer,
      cardName: customerName,
      address: address,
      branch: branch,
      branchName: branchName,
      employeeId: employee,
      userId: Meteor.userId(),
      docDueDate: dueDate,
      custRefDate: custRefDate,
      custRefNo: custRef,
      priceMode: priceMode,
      priceType: priceType,
      priceTypeName: priceTypeName,
      currency: currency,
      latitude: latitude,
      longitude: longitude,
      docStatus: "O",
      SAPStatus: "Not Approved",
      docDate: new Date(),
      itemLines: itemArray,
      totalQty: totalQty.toString(),
      totalItem: itemsQty.length.toString(),
      beforeDiscount: beforeDiscount,
      afterDiscount: afterDiscount,
      GST: GST,
      weight: weight,
      discPrcnt: totalDiscPercent.toString(),
      remark_order: remark_order,
      docTotal: grandTotal,
      oRStatus: '',
      orderId: '',
      draftNo: '',
      street: street,
      city: city,
      block: block,
      salesmanName: salesmanName,
      slpcode: slpcode,
      approvalStatus: '',
      flag: true,
      mvats: mVATArrayList,
      ribNumber: ribNumber,
      driverName: driverName,
      approvalValue: approvalValue,
      approvalResonArray: approvalResonArray,
      ord_webId: 'ord_' + Random.id(),
      uuid: Random.id(),
      taxTotal: taxTotal,
      createdAt: new Date(),
    });
    return orderId;
  },
  /**
  * TODO:Complete JS doc
  */
  'order.approved': (id, status, remark) => {
    let ordId = Order.findOne({ _id: id });
    let approvedByName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    // console.log("orderId", ordId);
    if (id) {
      let orderFlag = Order.findOne({ _id: id }).flag;
      // console.log("orderFlag", orderFlag);
      if (orderFlag !== false) {
        call = true;
        count = 0;
        Order.update({
          _id: id
        }, {
          $set: {
            updatedAt: new Date(),
            approvalStatus: "Approved",
          }
        });

        if (ordId.approvalValue === true) {
          Order.update({
            _id: id
          }, {
            $set: {
              updatedAt: new Date(),
              oRStatus: 'Pending',
              docStatus: "O",
              SAPStatus: "Pending",
              accountantApproval: true,
              firstAppoval: Meteor.userId(),
              firstAppovalName: approvedByName,
              firstAppovalDate: new Date(),
              firstApprovalRemarks: remark,
              onHoldByName: '',
              onHoldDate: '',
            }
          });
        }
        else {
          aPICall()
          // console.log("hiii");
        }
      }
    }
    function aPICall() {
      for (let i = 0; i < ordId.itemLines.length; i++) {
        ordId.itemLines[i].refType = "-1";
      }
      if (call === true) {

        let base_url = Config.findOne({
          name: 'base_url'
        }).value;
        let dbId = Config.findOne({
          name: 'dbId'
        }).value;
        let url = base_url + salesOrderPost_Url;
        let dataArray = {
          dbId: dbId,
          cardCode: ordId.cardCode,
          address: ordId.address,
          branch: ordId.branch,
          currency: ordId.currency,
          priceMode: ordId.priceMode,
          priceType: ordId.priceType,
          priceTypeName: ordId.priceTypeName,
          referenceNo: ordId.custRefNo,
          driverName: ordId.driverName,
          RibNo: ordId.ribNumber,
          discountPercentage: ordId.discPrcnt,
          docDueDate: moment(ordId.docDueDate).format('YYYYMMDD'),
          docDate: moment(ordId.docDate).format('YYYYMMDD'),
          itemLines: ordId.itemLines,
          mvats: ordId.mvats,
          ord_webId: ordId.ord_webId,
        };
        let options = {
          data: dataArray,
          headers: {
            'content-type': 'application/json'
          }
        };
        // console.log("dataArray", dataArray);
        HTTP.call("POST", url, options, (err, result) => {
          if (err) {
            // console.log("err", err);
            // if (count === 1) {
            Notification.insert({
              userId: Meteor.userId(),
              message: err.response,
              uuid: Random.id()
            });
            // }

            // if (count < 3) {
            //   count = count + 1;
            //   aPICall();
            // }
          } else {

            call = false;
            Order.update({
              _id: id
            }, {
              $set: {
                orderId: result.data.RefNo,
                docEntry: result.data.DocEntry,
                series: result.data.Series,
                flag: false,
                updatedBy: Meteor.userId(),
                updatedAt: new Date(),
                approvedBy: Meteor.userId(),
                approvedByName: approvedByName,
                approvedByDate: new Date(),
                oRStatus: status,
                oRRemark: remark,
                docStatus: "O",
                SAPStatus: "Approved"
              }
            });
          }
        });
      }
    }
    return id;
  },
  /**
   * TODO:Complete JS doc
   */
  'order.updates': (id, status, remark) => {
    //
    let updatedByName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    if (status === 'rejected') {
      return Order.update({
        _id: id
      }, {
        $set: {
          oRStatus: status,
          oRRemark: remark,
          docStatus: 'R',
          flag: true,
          updatedBy: Meteor.userId(),
          rejectedByName: updatedByName,
          rejectedDate: new Date(),
          updatedAt: new Date(),
          SAPStatus: "Rejected"
        }
      });
    }
    else if (status === 'onHold') {
      return Order.update({
        _id: id
      }, {
        $set: {
          oRStatus: status,
          oRRemark: remark,
          docStatus: 'onHold',
          SAPStatus: "On Hold",
          flag: true,
          updatedBy: Meteor.userId(),
          onHoldByName: updatedByName,
          updatedAt: new Date(),
          onHoldDate: new Date()
        }
      });
    }
    //
  },


  /**
 * TODO:Complete JS doc
 * approved by accountant
 */
  'order.accountantApproved': (id, status, remark) => {
    let ordId = Order.findOne({ _id: id });
    let approvedByName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    // console.log("orderId", ordId);
    if (id) {
      let orderFlag = Order.findOne({ _id: id }).flag;
      // console.log("orderFlag", orderFlag);
      if (orderFlag !== false) {
        call = true;
        count = 0;
        Order.update({
          _id: id
        }, {
          $set: {
            updatedAt: new Date(),
            approvalStatus: "Approved",
          }
        });
        aPICall()
        // console.log("hiii");
      }
    }
    function aPICall() {
      for (let i = 0; i < ordId.itemLines.length; i++) {
        ordId.itemLines[i].refType = "-1";
      }
      if (call === true) {

        let base_url = Config.findOne({
          name: 'base_url'
        }).value;
        let dbId = Config.findOne({
          name: 'dbId'
        }).value;
        let url = base_url + salesOrderPost_Url;
        let dataArray = {
          dbId: dbId,
          cardCode: ordId.cardCode,
          address: ordId.address,
          branch: ordId.branch,
          currency: ordId.currency,
          priceMode: ordId.priceMode,
          priceType: ordId.priceType,
          priceTypeName: ordId.priceTypeName,
          referenceNo: ordId.custRefNo,
          driverName: ordId.driverName,
          RibNo: ordId.ribNumber,
          discountPercentage: ordId.discPrcnt,
          docDueDate: moment(ordId.docDueDate).format('YYYYMMDD'),
          docDate: moment(ordId.docDate).format('YYYYMMDD'),
          itemLines: ordId.itemLines,
          mvats: ordId.mvats,
          ord_webId: ordId.ord_webId,
        };
        let options = {
          data: dataArray,
          headers: {
            'content-type': 'application/json'
          }
        };
        // console.log("dataArray", dataArray);
        HTTP.call("POST", url, options, (err, result) => {
          if (err) {
            // console.log("err", err);
            // if (count === 1) {
            Notification.insert({
              userId: Meteor.userId(),
              message: err.response,
              uuid: Random.id()
            });
            // }

            // if (count < 3) {
            //   count = count + 1;
            //   aPICall();
            // }
          } else {

            call = false;
            Order.update({
              _id: id
            }, {
              $set: {
                orderId: result.data.RefNo,
                docEntry: result.data.DocEntry,
                series: result.data.Series,
                flag: false,
                updatedBy: Meteor.userId(),
                updatedAt: new Date(),
                approvedBy: Meteor.userId(),
                approvedByName: approvedByName,
                approvedByDate: new Date(),
                accountantApproved: true,
                oRStatus: status,
                oRRemark: remark,
                docStatus: "O",
                SAPStatus: "Approved"
              }
            });
          }
        });
      }
    }
    return id;
  },

  /**
 * TODO:Complete JS doc
 * update by accountant
 */
  'order.accountantUpdates': (id, status, remark) => {
    //
    let updatedByName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    if (status === 'rejected') {
      return Order.update({
        _id: id
      }, {
        $set: {
          oRStatus: status,
          oRRemark: remark,
          docStatus: 'R',
          flag: true,
          updatedBy: Meteor.userId(),
          rejectedByName: updatedByName,
          rejectedDate: new Date(),
          accountantRejected: true,
          updatedAt: new Date(),
          SAPStatus: "Rejected"
        }
      });
    }
    else if (status === 'onHold') {
      return Order.update({
        _id: id
      }, {
        $set: {
          oRStatus: status,
          oRRemark: remark,
          docStatus: 'onHold',
          SAPStatus: "On Hold",
          flag: true,
          updatedBy: Meteor.userId(),
          accountantOnHold: true,
          onHoldByName: updatedByName,
          updatedAt: new Date(),
          onHoldDate: new Date()
        }
      });
    }
    //
  },

  /**
 * TODO: Complete Js doc
 * Fetching full details with id
 */
  'order.id': (id) => {
    return Order.findOne({ _id: id });
  },
  'order.GetUuid': (id) => {
    return Order.findOne({ uuid: id });
  },
  'order.orderPrint': (id) => {
    return Order.findOne({ _id: id });

  },
  'order.docNumArray': (docNum) => {
    let data = Order.findOne({ orderId: docNum }).docDate;
    return moment(data).format('DD-MMM-YYYY');
  },
  'order.editOrUpdate': (id, itemArray, beforeDiscount, afterDiscount, GST,
    grandTotal, totalDiscPercent, latitude, longitude, mVATArrayList, weight, taxTotal, approvalValue, approvalResonArray) => {
    // remark, custRefDate, custRef,
    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
      totalQty += Number(itemsQty[i].quantity);
    }

    return Order.update({
      _id: id
    }, {
      $set: {
        latitude: latitude,
        longitude: longitude,
        itemLines: itemArray,
        totalQty: totalQty.toString(),
        totalItem: itemsQty.length.toString(),
        beforeDiscount: beforeDiscount,
        afterDiscount: afterDiscount,
        discPercnt: totalDiscPercent,
        approvalResonArray: approvalResonArray,
        GST: GST,
        weight: weight,
        docTotal: grandTotal,
        approvalValue: approvalValue,
        flag: true,
        oRStatus: '',
        orderId: '',
        mvats: mVATArrayList,
        taxTotal: taxTotal,
        uuid: Random.id(),
        updatedAt: new Date()
      }
    });
  },
  /**
  * TODO: Complete Js doc
  * Fetching full item lines
  */
  'order.itemLines': (id) => {
    return Order.findOne({ _id: id });
  },
  /**
   * TODO:Complete Js doc
   */
  'order.itemArrayUpdate': (id, itemArray) => {
    return Order.update({
      _id: id
    }, {
      $set: {
        itemLines: itemArray,
        itemArrayUpdated: new Date(),
        updatedAt: new Date()
      }
    });
  },
  /**
  * TODO: Complete Js doc
  * Fetching full details with id
  */
  'order.docEntry': (docEntry) => {
    return Order.findOne({ docEntry: docEntry });
  },
  /**
  * TODO: Complete Js doc
  * Fetching full details with id
  */
  'order.orderId': (orderId) => {
    return Order.findOne({ orderId: orderId });
  },
  /**
   * TODO:Complete Js doc
   * Open order list
   */
  'order.open': () => {
    return Order.find({ docStatus: "O" }).fetch();

  },
  'order.idList': (id) => {
    return Order.findOne({ _id: id }, {
      fields: {
        itemLines: 1, cardName: 1, cardCode: 1, grandTotal: 1, beforeDiscount: 1, afterDiscount: 1
        , GST: 1, docDueDate: 1, createdAt, orderId: 1, docEntry: 1, branch: 1
      }
    });
  },
  'order.delete': (_id) => {
    let orderData = Order.findOne({ _id: _id });
    let DeletedOrderData = DeletedOrder.insert({
      cardCode: orderData.cardCode,
      cardName: orderData.cardName,
      address: orderData.address,
      branch: orderData.branch,
      branchName: orderData.branchName,
      employeeId: orderData.employeeId,
      userId: orderData.userId,
      docDueDate: orderData.docDueDate,
      custRefDate: orderData.custRefDate,
      custRefNo: orderData.custRefNo,
      priceMode: orderData.priceMode,
      priceType: orderData.priceType,
      currency: orderData.currency,
      latitude: orderData.latitude,
      longitude: orderData.longitude,
      docStatus: orderData.docStatus,
      docDate: orderData.docDate,
      itemLines: orderData.itemLines,
      totalQty: orderData.totalQty,
      totalItem: orderData.totalItem,
      beforeDiscount: orderData.beforeDiscount,
      afterDiscount: orderData.afterDiscount,
      GST: orderData.GST,
      weight: orderData.weight,
      discPrcnt: orderData.discPrcnt,
      remark_order: orderData.remark_order,
      docTotal: orderData.docTotal,
      oRStatus: orderData.oRStatus,
      orderId: orderData.orderId,
      draftNo: orderData.draftNo,
      street: orderData.street,
      city: orderData.city,
      block: orderData.block,
      salesmanName: orderData.salesmanName,
      flag: orderData.flag,
      mvats: orderData.mvats,
      uuid: Random.id(),
      taxTotal: orderData.taxTotal,
      createdAt: orderData.createdAt,
      deletedAt: new Date,
      deletedBy: Meteor.userId()

    }
    );
    if (DeletedOrderData) {
      return Order.remove({ _id: _id });
    }
    return DeletedOrderData;
  },
  /**
   * TODO:Complete Js doc
   * Open order list
   */
  'order.dashBoardApproved': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    let toDate = new Date(today);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      oRStatus: { $eq: 'approved' },
      // approvedByDate: {
      //   $gte: toDay,
      //   $lt: nextDay
      // }, 
      docStatus: 'O'
    }).count();
  },
  /**
  * TODO:Complete Js doc
  * Open order list
  */
  'order.dashBoardPending': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    let toDate = new Date(today);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      $or: [{ oRStatus: { $eq: '' } }, { oRStatus: { $eq: 'Pending' } }],
      orderId: { $eq: '' },
      docStatus: 'O',
    }).count();
  },
  /**
  * TODO:Complete Js doc
  * Open order list
  */
  'order.dashBoardRejected': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    let toDate = new Date(today);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      oRStatus: { $eq: 'rejected' },
      docStatus: 'R',
      // rejectedDate: {
      //   $gte: toDay,
      //   $lt: nextDay
      // },
    }).count();
  },
  /**
  * TODO:Complete Js doc
  * Open order list
  */
  'order.dashBoardOnHold': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    let toDate = new Date(today);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      oRStatus: { $eq: 'onHold' },
      docStatus: 'onHold',
      // onHoldDate: {
      //   $gte: toDay,
      //   $lt: nextDay
      // },
    }).count();
  },
  'order.orderCount': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    let nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      userId: Meteor.userId(),
      docDate: {
        $gte: toDay,
        $lt: nextDay
      }
    }).count();

  },
  'order.orderApprovedCount': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    let nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      userId: Meteor.userId(),
      oRStatus: { $eq: 'approved' },
      approvedByDate: {
        $gte: toDay,
        $lt: nextDay
      }
    }).count();
  },
  'order.orderonHoldCount': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    let nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      userId: Meteor.userId(),
      oRStatus: { $eq: 'onHold' },
      docStatus: 'onHold',
      onHoldDate: {
        $gte: toDay,
        $lt: nextDay
      }
    }).count();
  },
  'order.orderRejectCount': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    let nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return Order.find({
      userId: Meteor.userId(),
      oRStatus: { $eq: 'rejected' },
      docStatus: 'R',
      rejectedDate: {
        $gte: toDay,
        $lt: nextDay
      }
    }).count();
  },
  'order.docEntryOrder': (orderEntry) => {
    return Order.findOne({ docEntry: orderEntry });
  },
  /**
   * TODO:Complete Js doc
   * Open Print Count
   * 
   */
  'order.printCheck': (id) => {
    let user = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    let order = Order.findOne({ _id: id });
    if (order.printCount === undefined) {
      Order.update({
        _id: id
      }, {
        $set: {
          printType: "Duplicate",
          printTimeFirst: new Date(),
          printByFirst: Meteor.userId(),
          printByFirstName: user,
          printCount: 0
        }
      });
    } else {
      let printC = order.printCount + 1;
      if (printC === 1) {
        Order.update({
          _id: id
        }, {
          $set: {
            printType: "Triplicate",
            printTimeSecond: new Date(),
            printBySecond: Meteor.userId(),
            printBySecondName: user,
            printCount: 1
          }
        });
      }
      else if (printC >= 2) {
        Order.update({
          _id: id
        }, {
          $set: {
            printType: "Copy",
            printTimeThird: new Date(),
            printByThird: Meteor.userId(),
            printByThirdName: user,
            printCount: 2
          }
        });
      }
    }
  },
  'order.pickListOrderDetails': (orderEntry) => {
    return Order.findOne({ docEntry: orderEntry });
  },
});
