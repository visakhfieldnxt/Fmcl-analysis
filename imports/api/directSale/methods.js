import { DirectSale } from "./directSale";
import { allUsers } from '../user/user';
import { RouteGroup } from '../routeGroup/routeGroup';
import { Verticals } from '../verticals/verticals';
import { Outlets } from '../outlets/outlets';
import { RouteAssign } from '../routeAssign/routeAssign';
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { Stock } from '../stock/stock';
import { WareHouseStock } from '../wareHouseStock/wareHouseStock';
/**
 * @author Greeshma
 */

Meteor.methods({

  'directSale.create': (productsArray, vertical, grandTotal, taxTotal, latitude, longitude) => {
    let sdVal = '';
    let userDetails = allUsers.findOne({ _id: Meteor.userId() });
    if (userDetails) {
      sdVal = userDetails.subDistributor;
    }
    let a = new Date();
    let days = new Array(7);
    days[0] = "Sunday";
    days[1] = "Monday";
    days[2] = "Tuesday";
    days[3] = "Wednesday";
    days[4] = "Thursday";
    days[5] = "Friday";
    days[6] = "Saturday";
    let todaysDate = days[a.getDay()];
    let routeId = '';
    let routeRes = RouteAssign.find({ assignedTo: Meteor.userId(), routeDate: todaysDate, active: "Y" }).fetch();
    if (routeRes.length > 0) {
      routeId = routeRes[0].routeId;
    }
    let temporaryId = '';

    // generate temp code
    let tempVal = TempSerialNo.findOne({
      cashSale: true,
    }, { sort: { $natural: -1 } });
    if (!tempVal) {
      temporaryId = "CASH/" + "FMC" + "/1";
    } else {
      temporaryId = "CASH/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
    }
    if (!tempVal) {
      TempSerialNo.insert({
        serial: 1,
        cashSale: true,
        uuid: Random.id(),
        createdAt: new Date()
      });
    } else {
      TempSerialNo.update({ _id: tempVal._id }, {
        $set: {
          serial: parseInt(tempVal.serial + 1),
          updatedAt: new Date()
        }
      });
    }

    let totalQty = 0;
    let itemsQty = productsArray;
    for (let i = 0; i < itemsQty.length; i++) {
      totalQty += Number(itemsQty[i].quantity);
    }

    let directSaleRes = DirectSale.insert({
      sdUser: Meteor.userId(),
      subDistributor: sdVal,
      vertical: vertical,
      outlet: '',
      routeId: routeId,
      docDate: moment(new Date).format('DD-MM-YYYY'),
      docTotal: grandTotal.toString(),
      discountAmt: '0.00',
      taxAmount: taxTotal.toString(),
      latitude: latitude,
      longitude: longitude,
      itemArray: productsArray,
      totalQty: totalQty.toString(),
      totalItems: productsArray.length.toString(),
      afterDiscount: '',
      beforeDiscount: '',
      docNum: temporaryId,
      status: "Approved",
      customerType:'Walk-In Customer',
      createdBy: Meteor.userId(),
      uuid: Random.id(),
      createdAt: new Date(),
    });
    if (directSaleRes) {
      stockUpdateFun(directSaleRes, vertical, sdVal, Meteor.userId(), productsArray);
    }
  },
  /**
     * fetching directsale full details 
     * @returns 
     */
  'directSale.list': () => {
    return DirectSale.find().fetch();
  },
  /**
     * fetching directsale id
     * @returns 
     */
  'directSale.id': (id) => {
    let sdName = '';
    let verticalName = '';
    let routeIdName = '';
    let outletName = '';
    let createdName = '';
    let data = DirectSale.findOne({ _id: id });
    if (data) {
      if (data.sdUser) {
        let sdUser1 = allUsers.findOne({ _id: data.sdUser });
        if (sdUser1) {
          sdName = sdUser1.username;
        }
      }
      if (data.vertical) {
        let vertical1 = Verticals.findOne({ _id: data.vertical });
        if (vertical1) {
          verticalName = vertical1.verticalName;
        }
      }
      if (data.routeId) {
        let routeId1 = RouteGroup.findOne({ _id: data.routeId });
        if (routeId1) {
          routeIdName = routeId1.routeName;
        }
      }
      if (data.outlet) {
        let outlet1 = Outlets.findOne({ _id: data.outlet });
        if (outlet1) {
          outletName = outlet1.name;
        }
      }
      if (data.createdBy) {
        let created1 = allUsers.findOne({ _id: data.createdBy });
        if (created1) {
          createdName = created1.username;
        }
      }

    }
    return { directSdata: data, sdName: sdName, verticalName: verticalName, routeIdName: routeIdName, outletName: outletName, createdName: createdName };
  },




});

/**
 * 
 * @param {*} saleId 
 * @param {*} vertical 
 * @param {*} subDistributor 
 * @param {*} sdUser 
 * @param {*} productsArray 
 * update stock
 */
function stockUpdateFun(saleId, vertical, subDistributor, sdUser, productArray) {
  for (let i = 0; i < productArray.length; i++) {
    let stockRes = WareHouseStock.findOne({
      employeeId: sdUser, subDistributor: subDistributor, vertical: vertical,
      product: productArray[i].product
    });
    if (stockRes) {
      let actualStock = Number(stockRes.stock);
      let transferStock = Number(productArray[i].transferStockVal);
      let balanceStock = Number(actualStock - transferStock);
      WareHouseStock.update({ _id: stockRes._id }, {
        $set: {
          stock: balanceStock.toString(),
          updatedAt: new Date(),
          updatedBy: sdUser
        }
      });
    }
  }
}