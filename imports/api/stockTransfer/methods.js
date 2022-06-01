/**
 * @author Visakh
 */

import { StockTransfer } from './stockTransfer';
import { WareHouse } from '../../api/wareHouse/wareHouse';
import { Notification } from '../notification/notification';
import { Config } from '../config/config';
import { allUsers } from '../user/user';
import { Branch } from '../branch/branch';
import { StockTransferSerialNo } from '../stockTransferSerialNo/stockTransferSerialNo';
// import {stockTransferPost_Url} from '../../startup/client/sapUrls';

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
  'stockTransfer.create': (dueDate, itemArray, wareHouseFrom, wareHouseTo, employee, remark_stock, branchs, weight) => {
    let wareHouseFromName = WareHouse.findOne({ whsCode: wareHouseFrom }).whsName;
    let wareHouseToName = WareHouse.findOne({ whsCode: wareHouseTo }).whsName;
    let branchName = Branch.findOne({ bPLId: branchs }).bPLName;
    let salesmanName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
      totalQty += Number(itemsQty[i].quantity);
    }
    let tempVal = StockTransferSerialNo.findOne({
      bPLId: branchs
    }, { sort: { $natural: -1 } });
    if (!tempVal) {
      temporaryId = "STRQ/" + branchName.slice(0, 3).toUpperCase() + "/1";
    } else {
      temporaryId = "STRQ/" + branchName.slice(0, 3).toUpperCase() + "/" + parseInt(tempVal.serial + 1);
    }
    if (!tempVal) {
      StockTransferSerialNo.insert({
        serial: 1,
        bPLId: branchs,
        uuid: Random.id(),
        createdAt: new Date()
      });
    } else {
      StockTransferSerialNo.insert({
        serial: parseInt(tempVal.serial + 1),
        bPLId: branchs,
        uuid: Random.id(),
        createdAt: new Date()
      });
    }
    let stockId = StockTransfer.insert({
      employeeId: employee,
      userId: Meteor.userId(),
      dueDueDate: dueDate,
      docDate: new Date(),
      branchName: branchName,
      branch: branchs,
      wareHouseFrom: wareHouseFrom,
      wareHouseFromName: wareHouseFromName,
      wareHouseTo: wareHouseTo,
      wareHouseToName: wareHouseToName,
      itemLines: itemArray,
      remark_stock: remark_stock,
      salesmanName: salesmanName,
      stockStatus: 'Pending',
      totalQty: totalQty.toString(),
      weight: weight,
      totalItem: itemsQty.length.toString(),
      stockId: '',
      tempId: temporaryId,
      flag: true,
      stock_webId: 'stock_' + Random.id(),
      uuid: Random.id(),
      createdAt: new Date()
    });

    return stockId;
  },
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
  'stockTransfer.approval': (id, status, remark) => {
    let stockId = StockTransfer.findOne({ _id: id });
    let approvedByName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    if (id) {
      if (stockId !== false) {
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
        let url = base_url + stockTransferPost_Url;
        let dataArray = {
          dbId: dbId,
          dueDate: moment(stockId.dueDueDate).format('YYYYMMDD'),
          docDate: moment(stockId.docDate).format('YYYYMMDD'),
          fromWarehouse: stockId.wareHouseTo,
          toWarehouse: stockId.wareHouseFrom,
          itemLines: stockId.itemLines,
          stock_webId: stockId.stock_webId,
        };
        let options = {
          data: dataArray,
          headers: {
            'content-type': 'application/json'
          }
        };
        // console.log("dataArray:", dataArray);
        HTTP.call("POST", url, options, (err, result) => {
          if (err) {
            // console.log("err", err);
            // if (count < 3) {
            //   count = count + 1;
            //   aPICall();
            // }
            Notification.insert({
              userId: Meteor.userId(),
              message: err.response,
              uuid: Random.id()
            });
          } else {

            call = false;

            return StockTransfer.update({
              _id: id
            }, {
              $set: {
                stockId: result.data.RefNo,
                docEntry: result.data.DocEntry,
                stockStatus: status,
                oRRemark: remark,
                flag: false,
                approvedBy: Meteor.userId(),
                approvedByName: approvedByName,
                approvedByDate: new Date(),
                updatedBy: Meteor.userId(),
                updatedAt: new Date()
              }
            });
          }
        });
      }
    }
    return id;
  },
  'stockTransfer.editORUpdate': (id, itemArray, weight) => {
    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
      totalQty += Number(itemsQty[i].quantity);
    }
    return StockTransfer.update({
      _id: id
    }, {
      $set: {
        itemLines: itemArray,
        weight: weight,
        totalQty: totalQty.toString(),
        totalItem: itemsQty.length.toString(),
        stockId: '',
        uuid: Random.id(),
        updatedAt: new Date()
      }
    });
  },
  /**
   * TODO:Complete JS doc
   */
  'stockTransfer.updates': (id, status, remark) => {
    let updatedByName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    //
    if (status === 'Rejected') {
      return StockTransfer.update({
        _id: id
      }, {
        $set: {
          stockStatus: status,
          oRRemark: remark,
          flag: true,
          updatedBy: Meteor.userId(),
          updatedAt: new Date(),
          rejectedByName: updatedByName,
          rejectedDate: new Date(),
        }
      });
    }
    else if (status === 'OnHold') {
      return StockTransfer.update({
        _id: id
      }, {
        $set: {
          stockStatus: status,
          oRRemark: remark,
          flag: true,
          updatedBy: Meteor.userId(),
          updatedAt: new Date(),
          onHoldByName: updatedByName,
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
  'stockTransfer.id': (id) => {
    return StockTransfer.findOne({ _id: id });
  },
   /**
     * TODO:Complete Js doc
     * Open Print Slip Count
     * 
     */
    'stockTransfer.printSlipCheck': (id) => {
      let user = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
      let order = StockTransfer.findOne({ _id: id });
      if (order.printSlipCount === undefined) {
        StockTransfer.update({
          _id: id
        }, {
          $set: {
            printSlipType: "Duplicate",
            printSlipTimeFirst: new Date(),
            printSlipByFirst: Meteor.userId(),
            printSlipByFirstName: user,
            printSlipCount: 0
          }
        });
      } else {
        let printC = order.printSlipCount + 1;
        if (printC === 1) {
          StockTransfer.update({
            _id: id
          }, {
            $set: {
              printSlipType: "Triplicate",
              printSlipTimeSecond: new Date(),
              printSlipBySecond: Meteor.userId(),
              printSlipBySecondName: user,
              printSlipCount: 1
            }
          });
        }
        else if (printC >= 2) {
          StockTransfer.update({
            _id: id
          }, {
            $set: {
              printSlipType: "Copy",
              printSlipTimeThird: new Date(),
              printSlipByThird: Meteor.userId(),
              printSlipByThirdName: user,
              printSlipCount: 2
            }
          });
        }
      }
    },
  /**
     * TODO:Complete Js doc
     * Open Print Count
     * 
     */
  'stockTransfer.printCheck': (id) => {
    let user = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    let order = StockTransfer.findOne({ _id: id });
    if (order.printCount === undefined) {
      StockTransfer.update({
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
        StockTransfer.update({
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
        StockTransfer.update({
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
  'stockTransfer.delete': (uuid) => {
    let updatedByName = allUsers.findOne({ _id: Meteor.userId() }).profile.firstName;
    return StockTransfer.update({
      uuid: uuid
    }, {
      $set: {
        stockStatus: "Cancelled",
        updatedBy: Meteor.userId(),
        cancelledByName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
});
