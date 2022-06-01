import { Delivery } from "./delivery";
import { Order } from "./../order/order";
import { Config } from '../config/config';
import { PickList } from "../pickList/pickList";
import { Notification } from '../notification/notification';
import { allUsers } from '../user/user';
// import {branchTransferPost_Url,deliveryAdd_Url} from '../../startup/client/sapUrls';

let call = true;
let count = 0;

/**
 * @author Visakh
 */

Meteor.methods({
  /**
    * TODO: Complete JS doc
    * @param id
    * @param name
    * @param description
    * @param username
    */
  'delivery.createInvoice': (id, deliveryItems) => {
    let deliveryDetails = Delivery.findOne({ _id: id });
    orderFlag = false;
    if (id) {
      if (orderFlag !== true) {
        call = true;
        count = 0;
        aPICall()
      }
    }

    function aPICall() {

      if (call === true) {
        let base_url = Config.findOne({
          name: 'base_url'
        }).value;
        let dbId = Config.findOne({
          name: 'dbId'
        }).value;
        let url = base_url + branchTransferPost_Url;
        let dataArray = {
          dbId: dbId,
          cardCode: deliveryItems.cardCode,
          branch: deliveryItems.branch,
          discountPercentage: deliveryItems.discountPercentage,
          docDueDate: moment(deliveryDetails.docDueDate).format('YYYYMMDD'),
          docDate: moment(deliveryDetails.docDueDate).format('YYYYMMDD'),
          itemLines: deliveryItems.itemLines,
          batches: deliveryItems.batches,
        };
        // console.log("dataArray", dataArray);
        let options = {
          data: dataArray,
          headers: {
            'content-type': 'application/json'
          }
        };
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
            // console.log("result", result);
            call = false;

            let delvey = Delivery.update({
              _id: id
            }, {
              $set: {
                invoiceId: result.data.RefNo,
                docEntry: result.data.DocEntry,
                flag: true,
                updatedAt: new Date()
              }
            });
            return delvey;
          }
        });
      }
    }

  },
  'delivery.createFromPickList': (pickIdArray, transporter, vehicleNo, ribNumber, driverName) => {
    let itemArray = [];
    let binEntry = [];
    let mvatArray = [];
    let batches = [];
    // getting items list from pickList
    let result = PickList.find({ absEntry: { "$in": pickIdArray }, pickStatus: 'Y' }).fetch();
    // filtering unique item from array.
    let pickListUniques = result.reduce(function (memo, e1) {
      let matches = memo.filter(function (e2) {
        return e1.itemCode == e2.itemCode
      });
      if (matches.length == 0) {
        memo.push(e1);
      }
      return memo;
    }, []);
    // getting unique orderEntry
    let unique = _.uniq(_.pluck(
      result, 'orderEntry'
    ));
    // console.log("unique", unique);
    // getting order from array
    let orderListArray = Order.find({ docEntry: { $in: unique } }).fetch();
    for (let i = 0; i < result.length; i++) {
      // console.log("result", result);

      let ordr = orderListArray.find(x => x.docEntry === result[i].orderEntry);
      // console.log("...", ordr);

      let itemLine = ordr.itemLines;
      let item = itemLine.find(x => x.itemCode === result[i].itemCode);
      // console.log("item", item);

      let qty = parseInt(result[i].pickQtty) / parseInt(item.unitQuantity);

      item.pickQtty = result[i].pickQtty;
      item.absEntry = result[i].absEntry;
      item.docEntry = result[i].orderEntry;
      item.whsCode = result[i].whsCode;
      item.baseDocEntry = result[i].orderEntry;
      item.quantity = qty.toString();
      item.refType = "17"
      if (result[i].binAbs !== '') {
        let binObject = {
          binEntry: result[i].binAbs,
          qty: qty.toString(),
          basLineNum: result[i].baseLine,
          negInventory: "N",
        }
        binEntry.push(binObject);
      }
      if (result[i].mvatAmt !== '') {
        let mVATObject = {
          mvatTotal: result[i].mvatAmt,
          expenseCode: result[i].expnsCode,
          itemCode: result[i].itemCode,
          lineNum: result[i].baseLine,
        }
        mvatArray.push(mVATObject);
      }
      itemArray.push(item);
    }
    // for (let i = 0; i < mvatArray.length; i++) {
    //   mvatArray[i].lineNum = i.toString();
    // }
    for (let i = 0; i < binEntry.length; i++) {
      binEntry[i].serialNumBaseLine = i.toString();
    }
    let taxCal = 0;
    let totalAmnt = 0;
    let weight = 0;

    for (let i = 0; i < itemArray.length; i++) {
      taxCal += Number(itemArray[i].taxRate) * parseInt(itemArray[i].quantity)
      totalAmnt += Number(itemArray[i].incPrice) * parseInt(itemArray[i].quantity)
      weight += Number(itemArray[i].invWeight) * parseInt(itemArray[i].quantity) * parseInt(itemArray[i].unitQuantity)
    }

    let orderId = [];
    let orderDate = [];
    let custRefDate = [];
    let custRefNo = [];
    let sQId = [];
    let orderCollection = Order.find({ docEntry: { $in: unique } }).fetch();

    for (let i = 0; i < orderCollection.length; i++) {
      orderId.push(orderCollection[i].orderId);
      orderDate.push(orderCollection[i].docDate);
      custRefDate.push(orderCollection[i].custRefDate);
      custRefNo.push(orderCollection[i].custRefNo);
      if (orderCollection[i].sQId !== undefined) {
        sQId.push(orderCollection[i].sQId);
      }
    }

    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
      totalQty += Number(itemsQty[i].quantity);
    }

    let deliveryWebId = 'delivery_' + Random.id();
    let deliveryId = Delivery.insert({
      cardName: orderListArray[0].cardName,
      cardCode: orderListArray[0].cardCode,
      branch: orderListArray[0].branch,
      branchName: orderListArray[0].branchName,
      orderCreateDate: orderListArray[0].docDate,
      employeeId: Meteor.userId(),
      userId: Meteor.userId(),
      transporter: transporter,
      vehicleNumber: vehicleNo,
      podDate: '',
      ribNumber: ribNumber,
      driverName: driverName,
      docDueDate: orderListArray[0].docDueDate,
      priceMode: orderListArray[0].priceMode,
      priceType: orderListArray[0].priceType,
      docStatus: "O",
      docDate: new Date(),
      itemLines: itemArray,
      binEntries: binEntry,
      mvats: mvatArray,
      GST: taxCal.toString(),
      discountPercentage: orderListArray[0].discPrcnt,
      currency: orderListArray[0].currency,
      remark_order: orderListArray[0].remark_order,
      grandTotal: totalAmnt.toString(),
      // orderId: orderId,
      weight: weight,
      totalQty: totalQty.toString(),
      totalItem: itemsQty.length.toString(),
      dLStatus: '',
      dLRemark: '',
      deliveryStatus: '',
      assignedTo: '',
      docNum: '',
      docEntry: '',
      invoiceDeliveryStatus: 'Pending',
      flag: true,
      uuid: Random.id(),
      batches: batches,
      orderId: orderId,
      sQId: sQId,
      orderDate: orderDate,
      delivery_webId: deliveryWebId,
      custRefDate: custRefDate,
      custRefNo: custRefNo,
      createdAt: new Date()
    });
    if (deliveryId) {
      // console.log("deliveryId", deliveryId);
      let orderFlag = Delivery.findOne({ _id: deliveryId }).flag;
      // console.log("orderFlag", orderFlag);
      if (orderFlag !== false) {
        call = true;
        count = 0;
        aPICall()
      }
    }
    function aPICall() {
      if (call === true) {
        let base_url = Config.findOne({
          name: 'base_url'
        }).value;
        let dbId = Config.findOne({
          name: 'dbId'
        }).value;
        let url = base_url + deliveryAdd_Url;
        let dataArray = {
          dbId: dbId,
          cardCode: orderListArray[0].cardCode,
          branch: orderListArray[0].branch,
          priceMode: orderListArray[0].priceMode,
          docDueDate: moment(orderListArray[0].docDueDate).format('YYYYMMDD'),
          discountPercentage: orderListArray[0].discPrcnt,
          currency: orderListArray[0].currency,
          docDate: moment(new Date()).format('YYYYMMDD'),
          transporter: transporter,
          vehicleNumber: vehicleNo,
          podDate: '',
          RibNo: ribNumber,
          driverName: driverName,
          itemLines: itemArray,
          binEntries: binEntry,
          mvats: mvatArray,
          batches: batches,
          referenceNo: custRefNo,
          delivery_webId: deliveryWebId
        };
        // console.log("dataArray", dataArray);
        let options = {
          data: dataArray,
          headers: {
            'content-type': 'application/json'
          }
        };
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
            return Delivery.update({
              _id: deliveryId
            }, {
              $set: {
                docNum: result.data.RefNo,
                docEntry: result.data.DocEntry,
                series: result.data.Series,
                docTotal: result.data.DocTotal,
                discTotal: result.data.DiscTotal,
                vatSum: result.data.VatSum,
                flag: false,
                updatedAt: new Date()
              }
            });
          }
        });
      }
    }
    return deliveryId;
  },
  'delivery.createOrUpdate': (cardName, customer, docDueDate, currency, itemArray, mvatArray, branch, employee, beforeDiscount,
    afterDiscount, GST, docTotal, discountPercentage, remark_order, batches, transporter, vehicleNumber, priceMode, orderId, binEntry) => {
    // console.log("docDueDate", docDueDate);
    let priceType = Order.findOne({ orderId: orderId }).priceType;
    let deliveryId = Delivery.insert({
      cardName: cardName,
      cardCode: customer,
      branch: branch,
      employeeId: employee,
      userId: Meteor.userId(),
      transporter: transporter,
      vehicleNumber: vehicleNumber,
      docDueDate: docDueDate,
      priceMode: priceMode,
      priceType: priceType,
      docStatus: "O",
      docDate: new Date(),
      itemLines: itemArray,
      binEntries: binEntry,
      mvats: mvatArray,
      beforeDiscount: beforeDiscount,
      afterDiscount: afterDiscount,
      GST: GST,
      discountPercentage: discountPercentage,
      currency: currency,
      remark_order: remark_order,
      grandTotal: docTotal,
      orderId: orderId,
      dLStatus: '',
      dLRemark: '',
      deliveryStatus: '',
      assignedTo: '',
      docNum: '',
      docEntry: '',
      invoiceDeliveryStatus: 'Pending',
      flag: true,
      uuid: Random.id(),
      batches: batches,
      createdAt: new Date()
    });

    if (deliveryId) {
      // console.log("deliveryId", deliveryId);
      let orderFlag = Delivery.findOne({ _id: deliveryId }).flag;
      // console.log("orderFlag", orderFlag);
      if (orderFlag !== false) {
        call = true;
        count = 0;
        aPICall()
      }
    }
    function aPICall() {
      if (call === true) {
        let base_url = Config.findOne({
          name: 'base_url'
        }).value;
        let dbId = Config.findOne({
          name: 'dbId'
        }).value;
        let url = base_url + deliveryAdd_Url;
        let dataArray = {
          dbId: dbId,
          cardCode: customer,
          branch: branch,
          priceMode: priceMode,
          docDueDate: moment(docDueDate).format('YYYYMMDD'),
          discountPercentage: discountPercentage,
          currency: currency,
          docDate: moment(new Date()).format('YYYYMMDD'),
          transporter: transporter,
          vehicleNumber: vehicleNumber,
          itemLines: itemArray,
          binEntries: binEntry,
          mvats: mvatArray,
          batches: batches
        };
        // console.log("dataArray", dataArray);
        let options = {
          data: dataArray,
          headers: {
            'content-type': 'application/json'
          }
        };
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
            return Delivery.update({
              _id: deliveryId
            }, {
              $set: {
                docNum: result.data.RefNo,
                docEntry: result.data.DocEntry,
                docTotal: result.data.DocTotal,
                discTotal: result.data.DiscTotal,
                vatSum: result.data.VatSum,
                flag: false,
                updatedAt: new Date()
              }
            });
          }
        });
      }
    }
    return deliveryId;
  },
  'delivery.updateAssigne': (id, assigneeRemark, vehicleNoAssignee, transporterName, user) => {
    let find = Delivery.findOne({ _id: id });
    if (find.assignedHistory) {
      let invId = Delivery.update({
        _id: id
      }, {
        $set: {
          invoiceStatus: 'Assigned',
          assignedTo: user,
          vehicleNoAssignee: vehicleNoAssignee,
          transporterName: transporterName,
          assigneeRemark: assigneeRemark,
          assignedAt: new Date(),
          updatedAt: new Date(),
          deliveryStatus: "Pending",
          updatedBy: Meteor.user().username,
          userId: Meteor.userId()
        }
      });
      return invId;
    }
    else {
      let invId = Delivery.update({
        _id: id
      }, {
        $set: {
          invoiceStatus: 'Assigned',
          assignedTo: user,
          assignedBy: Meteor.userId(),
          vehicleNoAssignee: vehicleNoAssignee,
          transporterName: transporterName,
          assigneeRemark: assigneeRemark,
          deliveryStatus: "Pending",
          assignedAt: new Date(),
          updatedAt: new Date(),
          assignedHistory: [],
          updatedBy: Meteor.user().username,
          userId: Meteor.userId()
        }
      });
      return invId;
    }
  },
  'delivery.deliveryDateGet': (docNum) => {
    let data = Delivery.findOne({ docNum: docNum }).docDate;
    return moment(data).format('DD-MMM-YYYY');
  },
  /**
    * TODO:Comlete JS doc
    * @param id
    */
  'delivery.removeAssign': (id) => {
    let assignDetail = Delivery.findOne({
      _id: id
    });
    let assignedHistory = assignDetail.assignedHistory;
    let assignedOld = {
      assignedToOld: assignDetail.assignedTo,
      vehicleNoAssigneeOld: assignDetail.vehicleNoAssignee,
      transporterName: assignDetail.vehicleNoAssignee,
      assigneeRemarkOld: assignDetail.assigneeRemark,
      assignedAtOld: assignDetail.assignedAt,
      deliveredByOld: assignDetail.deliveredByOld,
      deliveredDateOld: assignDetail.deliveredDate,
      deliveryStatusOld: assignDetail.deliveryStatus
    }
    assignedHistory.push(assignedOld);
    return Delivery.update({
      _id: id
    }, {
      $set: {
        invoiceStatus: 'Unassigned',
        assignedHistory: assignedHistory,
        assignedTo: '',
        vehicleNoAssignee: '',
        transporterName: '',
        assigneeRemark: '',
        assignedAt: '',
        deliveredBy: '',
        deliveredDate: '',
        deliveryStatus: '',
        updatedAt: new Date(),
        updatedBy: Meteor.user().username
      }
    });
  },

  /**
   * TODO: Complete JS doc
   * @param remark
   * @param status
   * @param itemArray
   * @param branch
   * @param dealedBy
   */
  'delivery.update': (id, status, remark, imageData, dealedBy) => {
    // let base_url = Config.findOne({
    //   name: 'base_url'
    // }).value;
    // let url = base_url + "B1iXcellerator/exec/ipo/vP.001sap0000.in_HCSX/com.sap.b1i.vplatform.runtime/INB_HT_CALL_SYNC_XPT/INB_HT_CALL_SYNC_XPT.ipo/proc/update/invoiceDeliveryInfo";
    // let statusUpdate = base_url + "B1iXcellerator/exec/ipo/vP.001sap0000.in_HCSX/com.sap.b1i.vplatform.runtime/INB_HT_CALL_SYNC_XPT/INB_HT_CALL_SYNC_XPT.ipo/proc/update/invoiceStatus";

    // let find = Invoice.findOne({
    //   uuid: id
    // });
    // let itemLines = InvoiceItems.find({invoiceNo:find.invoiceNo}).fetch();
    // let branchId ='';
    // if (find.bPLName === 'GENXT MOBILE') {
    //   branchId = '1';
    // }else{
    //   branchId='2';
    // }

    let invDeliver = Delivery.update({
      _id: id
    }, {
      $set: {
        deliveryStatus: status,
        deliveryRemark: remark,
        customerRep: dealedBy,
        acknoledgement_image: imageData,
        deliveredBy: Meteor.userId(),
        deliveredDate: new Date(),
        updatedAt: new Date()
      }
    });
    return invDeliver;
  },
  /**
* TODO: Complete Js doc
* Fetching full details with id
*/
  'delivery.id': (id) => {
    return Delivery.findOne({ _id: id });
  },
  'delivery.idHistory': (id) => {
    return Delivery.findOne({ _id: id }, {
      fields: {
        itemLines: 1, cardCode: 1, docNum: 1, docDate: 1,
        docDueDate: 1, docTotal: 1
      }
    });
  },
  'delivery.idDispatch': (id) => {
    return Delivery.findOne({ _id: id }, {
      fields: {
        cardCode: 1, branch: 1, deliveryDate: 1, docDate: 1, docNum: 1
        , address: 1, docTotal: 1, itemLines: 1
      }
    });
  },

  'delivery.idForDelivery': (id) => {
    return Delivery.findOne({ _id: id }, {
      fields: {
        cardCode: 1, branch: 1, deliveredBy: 1, docTotal: 1
        , deliveryDate: 1, docDate: 1, docNum: 1, address: 1, deliveryStatus: 1, assigneeRemark: 1, transporterName: 1,
        vehicleNoAssignee: 1, deliveryRemark: 1, dealedBy: 1, itemLines: 1, docStatus: 1
      }
    });
  },
  /**
  * TODO:Complete Js doc
  * Open Print Count
  * 
  */
  'delivery.printCheck': (id) => {
    let user = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    let order = Delivery.findOne({ _id: id });
    if (order.printCount === undefined) {
      Delivery.update({
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
        Delivery.update({
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
        Delivery.update({
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
  }
});