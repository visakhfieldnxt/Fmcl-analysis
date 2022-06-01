/**
 * @author Nithin
 */
import { PriceType } from './priceType';
import { Verticals } from '../verticals/verticals';
import { Unit } from '../unit/unit'; 

Meteor.methods({

  /**
   * create priceType
   * @param priceTypeName
   * @param priceTypeCode
   * @returns 
   */
  'priceType.create': (priceTypeName, priceTypeCode, vertical) => {
    let priceTypeRes = PriceType.insert({
      priceTypeCode: priceTypeCode,
      priceTypeName: priceTypeName,
      vertical: vertical,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (priceTypeRes) {
      return priceTypeRes;
    }
  },
  /**
   * update priceType
   * @param {*} id 
   * @param {*} priceTypeName 
   * @param {*} priceTypeCode 
   * @returns 
   */
  'priceType.update': (id, priceTypeName, priceTypeCode, vertical) => {
    return PriceType.update({ _id: id }, {
      $set:
      {
        priceTypeCode: priceTypeCode,
        priceTypeName: priceTypeName,
        vertical: vertical,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get priceType details using id
   * @param {*} id 
   * @returns 
   */
  'priceType.id': (id) => {
    return PriceType.findOne({ _id: id }, { fields: { priceTypeName: 1, priceTypeCode: 1, active: 1, vertical: 1 } });


  },
  /**
   * fetching priceType full details 
   * @returns 
   */
  'priceType.priceTypeList': () => {
    return PriceType.find({ active: "Y" }, { fields: { priceTypeName: 1, priceTypeCode: 1 } }, { sort: { priceTypeName: 1 } }).fetch();
  },
  /**
 * fetching priceType full details 
 * @returns 
 */
  'priceType.priceTypeFullList': () => {
    return PriceType.find({}, { fields: { priceTypeName: 1, priceTypeCode: 1 } }, { sort: { priceTypeName: 1 } }).fetch();
  },
  /**
   * activate priceType
   * @param {*} id  
   * @returns 
   */
  'priceType.active': (id) => {
    return PriceType.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate priceType
 * @param {*} id  
 * @returns 
 */
  'priceType.inactive': (id) => {
    return PriceType.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * get priceType details using id
 * @param {*} id 
 * @returns 
 */
  'priceType.idDataGet': (id) => {
    let priceTypeRes = PriceType.findOne({ _id: id }, { fields: { priceTypeName: 1, priceTypeCode: 1, active: 1, vertical: 1 } });
    let verticalName = '';
    if (priceTypeRes) {
      let verticalRes = Verticals.findOne({ _id: priceTypeRes.vertical });
      if (verticalRes) {
        verticalName = verticalRes.verticalName;
      }
      return { priceTypeRes: priceTypeRes, verticalName: verticalName };
    }
  },
  /**
  * fetching priceType full details 
  * @returns 
  */
  'priceType.activeList': () => {
    return PriceType.find({ active: "Y" }, { fields: { priceTypeName: 1, priceTypeCode: 1 } }, { sort: { priceTypeName: 1 } }).fetch();
  },
  /**
* fetching priceType full details 
* @returns 
*/
  'priceType.userWiseList': (vertical) => {
    return PriceType.find({ active: "Y", vertical: { $in: vertical } }, { fields: { priceTypeName: 1, priceTypeCode: 1 } }, { sort: { priceTypeName: 1 } }).fetch();
  },
  /**
* fetching priceType full details 
* @returns 
*/
  'priceType.filterList': (vertical) => {
    return PriceType.find({ vertical: { $in: vertical } }, { fields: { priceTypeName: 1, priceTypeCode: 1 } }, { sort: { priceTypeName: 1 } }).fetch();
  },
  /**
  * get pricetype name based on id
  * @param {*} id 
  */
  'priceType.idName': (id) => {
    let res = PriceType.findOne({ _id: id }, { fields: { priceTypeName: 1 } });
    if (res) {
      return res.priceTypeName;
    }
  },
  /**
   * array of verticals
   * @param {} vertical 
   * @returns 
   */
  'priceType.verticalList': (vertical) => {
    return PriceType.find({ active: "Y", vertical: { $in: vertical } }).fetch();
  }
  ,
  /**
   * single
   * @param vertical 
   * @returns 
   */
  'priceType.verticalDataList': (vertical) => {
    return PriceType.find({ active: "Y", vertical: vertical }).fetch();
  },

  /**
  * 
  * @param {*} priceTypeArray  
  * @returns excel upload
  */
  'priceType.createUpload': (priceTypeArray, vertical) => {
    for (let i = 0; i < priceTypeArray.length; i++) {
      let priceTypeRes = PriceType.find({ priceTypeCode: priceTypeArray[i].priceTypeCode.trim() }).fetch();
      if (priceTypeRes.length === 0) {
        PriceType.insert({
          priceTypeCode: priceTypeArray[i].priceTypeCode,
          priceTypeName: priceTypeArray[i].priceTypeName,
          vertical: priceTypeArray[i].vertical,
          active: 'Y',
          uuid: Random.id(),
          excelUpload: true,
          createdBy: Meteor.userId(),
          createdAt: new Date(),
        });
      }
      else {
        PriceType.update({ _id: priceTypeRes[0]._id }, {
          $set:
          {
            priceTypeCode: priceTypeArray[i].priceTypeName,
            vertical: priceTypeArray[i].vertical,
            excelUpload: true,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }

    }

  }, 
});