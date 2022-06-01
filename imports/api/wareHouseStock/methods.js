/**
 * @author Visakh
 */

import { WareHouseStock } from "./wareHouseStock";
import { Config } from "../config/config";
import { WareHouse } from '../wareHouse/wareHouse';
import { Branch } from '../branch/branch';
import { Item } from '../item/item';
// import {wareHouseStockDataGet_Url} from '../../startup/client/sapUrls';

Meteor.methods({
  /**
  * TODO:Complete JS doc
  * Fetching Warehouse Stock List 
*/
  'wareHouseStock.itemCodeWhsCode': (itemCode, whsCode) => {
    return WareHouseStock.findOne({
      itemCode: itemCode, whsCode: whsCode
    });
  },

  'wareHouseStock.wareHouseList': (itemCode) => {
    return WareHouseStock.find({
      itemCode: itemCode, bPLId: Meteor.user().defaultBranch
    }).fetch();
  },

  'wareHouseStock.wareHouseListBranch': (branch, selecteditem) => {
    return WareHouseStock.find({
      bPLId: branch, itemCode: selecteditem
    }).fetch();

  },
  'wareHouseStock.itemStockList': (wareHouse, itemCode, bPLId) => {
    let wareHouseData = WareHouseStock.findOne({ whsCode: wareHouse, itemCode: itemCode, bPLId: bPLId, onHand: { $ne: '' } });
    // let mostRecentDate = new Date(Math.max.apply(null, wareHouseData.map(e => {
    //   return new Date(e.createdAt);
    // })));
    // let mostRecentObject = wareHouseData.filter(e => {
    //   let d = new Date(e.createdAt);
    //   return d.getTime() == mostRecentDate.getTime();
    // })[0];
    // console.log("mostRecentObject...", mostRecentObject);

    // return mostRecentObject;
    return wareHouseData;
  },
  // 'wareHouseStock.wareHousePurchase':(itemCode,bPLId)=>{
  //   let b=WareHouseStock.findOne({itemCode: itemCode,bPLId:bPLId,onHand:{$ne:''}});
  //   console.log("b",b);
  //   return b;


  // },
  'wareHouseStock.wareHouseListForSenior': (itemCode, brch) => {
    return WareHouseStock.find({
      itemCode: itemCode, bPLId: brch
    }).fetch();
  },

  'wareHouseStock.deleteStock': (whsDate) => {
    let today = moment(whsDate).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);

    // console.log("Date 1", toDay);
    // console.log("Date 2", nextDay);
    return WareHouseStock.remove({ createdAt: { $gte: toDay, $lt: nextDay } });
  },
  'wareHouseStock.dataSync': () => {
    let base_url = Config.findOne({
      name: 'base_url'
    }).value;
    let dbId = Config.findOne({
      name: 'dbId'
    }).value;
    let url = base_url + wareHouseStockDataGet_Url;
    let dataArray = {
      dbId: dbId
    };
    let options = {
      data: dataArray,
      headers: {
        'content-type': 'application/json'
      }
    };
    HTTP.call("POST", url, options, (err, result) => {
      if (err) {
        return err;
      } else {
        let res = result.data.data;
        // console.log("message", res);
        for (let i = 0; i < res.length; i++) {
          let bFind = WareHouseStock.find({
            itemCode: res[i].ItemCode,
            whsCode: res[i].WhsCode,
            bPLId: res[i].BPLId
          }, { sort: { createdAt: -1 } }).fetch();
          if (bFind.length === 0) {

            WareHouseStock.insert({
              bPLId: res[i].BPLId,
              itemCode: res[i].ItemCode,
              whsCode: res[i].WhsCode,
              onHand: res[i].OnHand,
              avgPrice: res[i].AvgPrice,
              createdAt: new Date(),
              uuid: Random.id()
            });
          }
          else {
            WareHouseStock.update(bFind[0]._id, {
              $set: {
                bPLId: res[i].BPLId,
                itemCode: res[i].ItemCode,
                whsCode: res[i].WhsCode,
                onHand: res[i].OnHand,
                avgPrice: res[i].AvgPrice,
                updatedAt: new Date()
              }
            });
          }
          console.log("-*/66*/-", i);

        }
      }
    });
  },

  'wareHouseStock.dateWiseDataSync': (dateVal) => {
    let base_url = Config.findOne({
      name: 'base_url'
    }).value;
    let dbId = Config.findOne({
      name: 'dbId'
    }).value;
    let url = base_url + wareHouseStockUpdatePost_Url;
    let date = moment(dateVal).format("YYYY.MM.DD");
    let todayDate = moment(new Date()).format("YYYY.MM.DD");
    let fullDate = date + " 00:00:00.000";
    let dataArray = {
      dated: fullDate,
      dbId: dbId
    };
    let options = {
      data: dataArray,
      headers: {
        'content-type': 'application/json'
      }
    };
    // console.log("fullDate", fullDate);
    // console.log("dataArray", dataArray);
    HTTP.call("POST", url, options, (err, result) => {
      if (err) {
        return err;
      } else {
        let res = result.data.data;
        // console.log("message", res);
        for (let i = 0; i < res.length; i++) {
          let bFind = WareHouseStock.find({
            itemCode: res[i].ItemCode,
            whsCode: res[i].WhsCode,
            bPLId: res[i].BPLId
          }, { sort: { createdAt: -1 } }).fetch();
          if (bFind.length === 0) {

            WareHouseStock.insert({
              bPLId: res[i].BPLId,
              itemCode: res[i].ItemCode,
              whsCode: res[i].WhsCode,
              onHand: res[i].OnHand,
              avgPrice: res[i].AvgPrice,
              insertdateValue: todayDate,
              createdAt: new Date(),
              uuid: Random.id()
            });
          }
          else {
            WareHouseStock.update(bFind[0]._id, {
              $set: {
                bPLId: res[i].BPLId,
                itemCode: res[i].ItemCode,
                whsCode: res[i].WhsCode,
                onHand: res[i].OnHand,
                avgPrice: res[i].AvgPrice,
                updatedateValue: todayDate,
                updatedAt: new Date()
              }
            });
          }
          console.log("-*/66*/ Total Count-", i);

        }
      }
    });
  },


  'wareHouseStock.filter': (branch, warehouse, item) => {
    let resultArray = [];
    let stockResArray = [];
    if (branch && warehouse && item === '') {
      resultArray = WareHouseStock.find({
        whsCode: warehouse, bPLId: branch
      }, { sort: { onHand: -1 } }, {
        fields: {
          itemCode: 1, bPLId: 1, whsCode: 1, onHand: 1,
          avgPrice: 1, createdAt: 1, updatedAt: 1, _id: 1
        }
      }).fetch();
      if (resultArray.length > 0) {
        for (let i = 0; i < resultArray.length; i++) {
          if (Number(resultArray[i].onHand) > 0) {
            let itemNames = '';
            let warehouseNames = '';
            let branchNames = '';
            let itemRes = Item.findOne({ itemCode: resultArray[i].itemCode }, { fields: { itemNam: 1 } });
            if (itemRes) {
              itemNames = itemRes.itemNam;
            }
            let branchRes = Branch.findOne({ bPLId: resultArray[i].bPLId }, { fields: { bPLName: 1 } });
            if (branchRes) {
              branchNames = branchRes.bPLName;
            }
            let warehouseRes = WareHouse.findOne({ whsCode: resultArray[i].whsCode }, { fields: { whsName: 1 } });
            if (warehouseRes) {
              warehouseNames = warehouseRes.whsName;
            }
            let resObj = {
              _id: resultArray[i]._id,
              itemCodeVal: resultArray[i].itemCode,
              itemNameVal: itemNames,
              whsCode: resultArray[i].whsCode,
              whsName: branchNames,
              bPLId: resultArray[i].bPLId,
              bPLName: warehouseNames,
              onHand: resultArray[i].onHand,
              avgPrice: resultArray[i].avgPrice,
              createdAt: resultArray[i].createdAt,
              updatedAt: resultArray[i].updatedAt
            };
            stockResArray.push(resObj);
          }
        }
      }
    }
    else if (branch && warehouse && item) {
      resultArray = WareHouseStock.find({
        whsCode: warehouse, bPLId: branch, itemCode: item
      }, { sort: { onHand: -1 } }, {
        fields: {
          itemCode: 1, bPLId: 1, whsCode: 1, onHand: 1,
          avgPrice: 1, createdAt: 1, updatedAt: 1, _id: 1
        }
      }).fetch();
      if (resultArray.length > 0) {
        for (let i = 0; i < resultArray.length; i++) {
          let itemNames = '';
          let warehouseNames = '';
          let branchNames = '';
          let itemRes = Item.findOne({ itemCode: resultArray[i].itemCode }, { fields: { itemNam: 1 } });
          if (itemRes) {
            itemNames = itemRes.itemNam;
          }
          let branchRes = Branch.findOne({ bPLId: resultArray[i].bPLId }, { fields: { bPLName: 1 } });
          if (branchRes) {
            branchNames = branchRes.bPLName;
          }
          let warehouseRes = WareHouse.findOne({ whsCode: resultArray[i].whsCode }, { fields: { whsName: 1 } });
          if (warehouseRes) {
            warehouseNames = warehouseRes.whsName;
          }
          let resObj = {
            _id: resultArray[i]._id,
            itemCodeVal: resultArray[i].itemCode,
            itemNameVal: itemNames,
            whsCode: resultArray[i].whsCode,
            whsName: branchNames,
            bPLId: resultArray[i].bPLId,
            bPLName: warehouseNames,
            onHand: resultArray[i].onHand,
            avgPrice: resultArray[i].avgPrice,
            createdAt: resultArray[i].createdAt,
            updatedAt: resultArray[i].updatedAt
          };
          stockResArray.push(resObj);
        }
      }
    }
    return stockResArray;
  },

  'wareHouseStock.remove': (_id) => {
    return WareHouseStock.remove({ _id: _id });
  },
  /**
* TODO: Complete JS doc
* 
*/
  'wareHouseStock.create': (itemCode, branch, wareHouse, onHand, averagePrice) => {
    return WareHouseStock.insert({
      itemCode: itemCode,
      whsCode: wareHouse,
      bPLId: branch,
      onHand: onHand,
      avgPrice: averagePrice,
      disabled: "N",
      createdBy: Meteor.userId(),
      createdByWeb: true,
      uuid: Random.id(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'wareHouseStock.update': (id, itemCode, branch, wareHouse, onHand, averagePrice) => {
    return WareHouseStock.update({ _id: id }, {
      $set:
      {
        itemCode: itemCode,
        whsCode: wareHouse,
        bPLId: branch,
        onHand: onHand,
        avgPrice: averagePrice,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  'wareHouseStock.inactive': (id) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return WareHouseStock.update({ _id: id }, {
      $set:
      {
        disabled: "Y",
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  'wareHouseStock.active': (id) => {
    return WareHouseStock.update({ _id: id }, {
      $set:
      {
        disabled: "N",
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  'wareHouseStock.wareHouseStock_id': (id) => {
    return WareHouseStock.findOne({ _id: id });
  },
  'wareHouseStock.bPLId': (bPLId) => {
    if (bPLId !== undefined && bPLId !== '') {
      return WareHouseStock.find({ bPLId: bPLId, disabled: { $ne: 'Y' } }, { fields: { whsName: 1, whsCode: 1 } });
    }
  },
  /**
    * TODO: Complete JS doc
    * 
    */
  'wareHouseStock.createUpload': (wareHouseStockArray) => {
    if (wareHouseStockArray !== undefined && wareHouseStockArray !== []) {
      for (let a = 0; a < wareHouseStockArray.length; a++) {
        let wareHouseStockDetails = WareHouseStock.find({
          itemCode: wareHouseStockArray[a].itemCode,
          whsCode: wareHouseStockArray[a].whsCode,
          bPLId: wareHouseStockArray[a].bPLId,
        }).fetch();
        if (wareHouseStockDetails.length === 0) {
          WareHouseStock.insert({
            itemCode: wareHouseStockArray[a].itemCode,
            whsCode: wareHouseStockArray[a].whsCode,
            bPLId: wareHouseStockArray[a].bPLId,
            onHand: wareHouseStockArray[a].onHand,
            avgPrice: wareHouseStockArray[a].avgPrice,
            uuid: Random.id(),
            createdAt: new Date(),
          });
        }
        else {
          WareHouseStock.update({
            itemCode: wareHouseStockArray[a].itemCode,
            whsCode: wareHouseStockArray[a].whsCode,
            bPLId: wareHouseStockArray[a].bPLId,
          }, {
            $set: {
              itemCode: wareHouseStockArray[a].itemCode,
              whsCode: wareHouseStockArray[a].whsCode,
              bPLId: wareHouseStockArray[a].bPLId,
              onHand: wareHouseStockArray[a].onHand,
              avgPrice: wareHouseStockArray[a].avgPrice,
              updatedAt: new Date(),
            }
          });
        }
        console.log("///Stock///", a);
      }
    }
  },

  'wareHouseStock.wareHouseStockDetailsGet': (id) => {
    let whsRes = WareHouseStock.findOne({ _id: id });

    let itemName = '';
    let itemResult = Item.findOne({ itemCode: whsRes.itemCode });
    if (itemResult) {
      itemName = itemResult.itemNam;
    }

    let whsName = '';
    let whsResult = WareHouse.findOne({ whsCode: whsRes.whsCode });
    if (whsResult) {
      whsName = whsResult.whsName;
    }


    let branchName = '';
    let branchRes = Branch.findOne({ bPLId: whsRes.bPLId });
    if (branchRes) {
      branchName = branchRes.bPLName;
    }

    return { whsRes: whsRes, itemName: itemName, whsName: whsName, branchName: branchName }

  },
});