/**
 * @author Nithin
 */
import { Unit } from './unit';
import { Product } from '../products/products';
import { Stock } from '../stock/stock';
import { allUsers } from '../user/user';
import { Price } from '../price/price';
import { SdPriceType } from "../sdPriceType/sdPriceType";
import { WareHouseStock } from '../wareHouseStock/wareHouseStock';

Meteor.methods({

  /**
   * create unit
   * @param unitName
   * @param unitCode
   * @returns 
   */
  'unit.create': (unitName, unitCode, product, baseQuantity, vertical) => {
    let unitRes = Unit.insert({
      unitCode: unitCode,
      unitName: unitName,
      product: product,
      baseQuantity: baseQuantity,
      vertical: vertical,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (unitRes) {
      return unitRes;
    }
  },
  /**
   * update unit
   * @param {*} id 
   * @param {*} unitName 
   * @param {*} unitCode 
   * @returns 
   */
  'unit.update': (id, unitName, unitCode, product, baseQuantity, vertical) => {
    return Unit.update({ _id: id }, {
      $set:
      {
        unitCode: unitCode,
        unitName: unitName,
        product: product,
        vertical: vertical,
        baseQuantity: baseQuantity,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get unit details using id
   * @param {*} id 
   * @returns 
   */
  'unit.id': (id) => {
    return Unit.findOne({ _id: id }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });


  },
  /**
   * fetching unit full details 
   * @returns 
   */
  'unit.unitList': () => {
    return Unit.find({}, { fields: { unitName: 1, unitCode: 1 } }, { sort: { unitName: 1 } }).fetch();
  },
  /**
   * activate unit
   * @param {*} id  
   * @returns 
   */
  'unit.active': (id) => {
    return Unit.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate unit
 * @param {*} id  
 * @returns 
 */
  'unit.inactive': (id) => {
    return Unit.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * get unit details using id
 * @param {*} id 
 * @returns 
 */
  'unit.idDataGet': (id) => {
    let unitRes = Unit.findOne({ _id: id }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
    let productName = '';
    if (unitRes) {
      let productRes = Product.findOne({ _id: unitRes.product });
      if (productRes) {
        productName = productRes.productName;
      }
      return { unitRes: unitRes, productName: productName };
    }
  },
  /**
   * 
   * @param {*} product 
   * get units based on products
   */
  'unit.unitCodeGet': (product) => {
    return Unit.find({ product: product, active: "Y" }, { fields: { unitName: 1, baseQuantity: 1 } }).fetch();
  },
  /**
* get pricetype name based on id
* @param {*} id 
*/
  'unit.idName': (id) => {
    let res = Unit.findOne({ _id: id }, { fields: { unitName: 1 } });
    if (res) {
      return res.unitName;
    }
  },

  /**
  * 
  * @param {*} unitArray  
  * @returns excel upload
  */
  'unit.createUpload': (unitArray, vertical) => {
    for (let i = 0; i < unitArray.length; i++) {
      let unitRes = Unit.find({ unitName: unitArray[i].unitName.trim(), product: unitArray[i].product }).fetch();
      if (unitRes.length === 0) {
        Unit.insert({
          unitCode: unitArray[i].unitCode,
          unitName: unitArray[i].unitName,
          product: unitArray[i].product,
          baseQuantity: unitArray[i].baseQuantity,
          vertical: vertical,
          active: 'Y',
          uuid: Random.id(),
          excelUpload: true,
          createdBy: Meteor.userId(),
          createdAt: new Date(),
        });
      }
      else {
        Unit.update({ _id: unitRes[0]._id }, {
          $set:
          {
            unitName: unitArray[i].unitName,
            product: unitArray[i].product,
            baseQuantity: unitArray[i].baseQuantity,
            vertical: vertical,
            excelUpload: true,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }
    }
  },
  /**
  * 
  * @param {*} product 
  * get units based on products
  */
  'unit.baseQtyGet': (product, unit, vertical, subDistributor) => {
    let unitRes = Unit.findOne({ product: product, _id: unit, active: "Y" }, { fields: { unitName: 1, baseQuantity: 1 } });
    let stockRes = Stock.findOne({ product: product, vertical: vertical, subDistributor: subDistributor });
    let productBaseUnit = Product.findOne({ _id: product });
    let baseUnit = '';
    if (productBaseUnit) {
      if (productBaseUnit.basicUnit !== undefined) {
        let unitVal = Unit.findOne({ _id: productBaseUnit.basicUnit });
        if (unitVal) {
          baseUnit = unitVal.unitName;
        }
      }
    }

    return { unitRes: unitRes, stockRes: stockRes, baseUnit: baseUnit }
  },

  /**
* 
* @param {*} product 
* get units based on products
*/
  'unit.priceCal': (product, unit, vertical, user, channelval) => {
    let sdDetails = allUsers.findOne({ _id: user });
    if (sdDetails) {
      let productPrice = '0.00';
      let unitRes = Unit.findOne({ product: product, _id: unit, active: "Y" }, { fields: { unitName: 1, baseQuantity: 1 } });
      let stockRes = WareHouseStock.findOne({
        product: product, vertical: vertical,
        subDistributor: sdDetails.subDistributor, employeeId: user
      });
      let productBaseUnit = Product.findOne({ _id: product });
      // console.log("channelval", channelval);
      let sdPriceTypeRes = SdPriceType.findOne({ subDistributor: sdDetails.subDistributor, vertical: vertical });
      // console.log("sdPriceTypeRes", sdPriceTypeRes);
      if (sdPriceTypeRes) {
        let priceVal = Price.findOne({ priceType: sdPriceTypeRes.priceType, product: product, unit: unit },
          { fields: { priceOmr: 1, priceVsr: 1, priceWs: 1 } });
        if (priceVal) {
          if (channelval === 'VSR') {
            productPrice = priceVal.priceVsr;
          }
          else if (channelval === 'OMR') {
            productPrice = priceVal.priceOmr;
          }
          else if (channelval === 'WS') {
            productPrice = priceVal.priceWs;
          }
        }
      }
      let baseUnit = '';
      if (productBaseUnit) {
        if (productBaseUnit.basicUnit !== undefined) {
          let unitVal = Unit.findOne({ _id: productBaseUnit.basicUnit });
          if (unitVal) {
            baseUnit = unitVal.unitName;
          }
        }
      }
      return {
        unitRes: unitRes, stockRes: stockRes,
        baseUnit: baseUnit, productPrice: productPrice
      };
    }
  },


  /**
* 
* @param {*} product 
* get units based on products
*/
  'unit.priceCalEdit': (product, unit, vertical, user, sdUser) => {
    let sdDetails = allUsers.findOne({ _id: user });
    if (sdDetails) {
      let productPrice = '0.00';
      let unitRes = Unit.findOne({ product: product, _id: unit, active: "Y" }, { fields: { unitName: 1, baseQuantity: 1 } });
      let stockRes = WareHouseStock.findOne({
        product: product, vertical: vertical,
        subDistributor: user, employeeId: sdUser
      });
      let productBaseUnit = Product.findOne({ _id: product });
      let channelval = '';
      let userRes = allUsers.findOne({ _id: sdUser });
      if (userRes) {
        let roleRes = Meteor.roles.findOne({ _id: userRes.roles[0] });
        if (roleRes) {
          let vsrCheck = roleRes.permissions.includes('vsrView');
          if (vsrCheck === true) {
            channelval = 'VSR'
          }
          let omrCheck = roleRes.permissions.includes('omrView');
          if (omrCheck === true) {
            channelval = 'OMR';
          }
          let wsCheck = roleRes.permissions.includes('wseView');
          if (wsCheck === true) {
            channelval = 'WS';
          }
        }
      }
      let sdPriceTypeRes = SdPriceType.findOne({ subDistributor: user, vertical: vertical });
      if (sdPriceTypeRes) {
        let priceVal = Price.findOne({ priceType: sdPriceTypeRes.priceType, product: product, unit: unit },
          { fields: { priceOmr: 1, priceVsr: 1, priceWs: 1 } });
        if (priceVal) {
          if (channelval === 'VSR') {
            productPrice = priceVal.priceVsr;
          }
          else if (channelval === 'OMR') {
            productPrice = priceVal.priceOmr;
          }
          else if (channelval === 'WS') {
            productPrice = priceVal.priceWs;
          }
        }
      }
      let baseUnit = '';
      if (productBaseUnit) {
        if (productBaseUnit.basicUnit !== undefined) {
          let unitVal = Unit.findOne({ _id: productBaseUnit.basicUnit });
          if (unitVal) {
            baseUnit = unitVal.unitName;
          }
        }
      }
      return {
        unitRes: unitRes, stockRes: stockRes,
        baseUnit: baseUnit, productPrice: productPrice
      };
    }
  },

 /**
  * return unit name based on product
  *  */ 
  'unit.productUnitList': (productId) => {
    let unitArray = [];
    let unitRes = Unit.find({ product: productId,active:"Y" }, { fields: { unitName: 1 } }).fetch();
    if (unitRes.length > 0) {
      for (let i = 0; i < unitRes.length; i++) {
        unitArray.push(unitRes[i].unitName);
      }
    }
    return unitArray.toString();
  },
});