/**
 * @author Nithin
 */
import { CreditSale } from '../creditSale/creditSale';
import { Product } from '../products/products';
import { Order } from '../order/order';
import { Principal } from './principal';

Meteor.methods({

  /**
   * create principal
   * @param principalName
   * @param principalCode
   * @returns 
   */
  'principal.create': (principalName, principalCode, loginUserVerticals) => {
    let principalRes = Principal.insert({
      principalCode: principalCode,
      principalName: principalName,
      vertical: loginUserVerticals,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (principalRes) {
      return principalRes;
    }
  },
  /**
   * update principal
   * @param {*} id 
   * @param {*} principalName 
   * @param {*} principalCode 
   * @returns 
   */
  'principal.update': (id, principalName, principalCode, loginUserVerticals) => {
    return Principal.update({ _id: id }, {
      $set:
      {
        principalCode: principalCode,
        principalName: principalName,
        vertical: loginUserVerticals,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get principal details using id
   * @param {*} id 
   * @returns 
   */
  'principal.id': (id) => {
    return Principal.findOne({ _id: id }, { fields: { principalName: 1, principalCode: 1, active: 1 } });
  },
  /**
   * fetching principal full details 
   * @returns 
   */
  'principal.principalList1': () => {
    return Principal.find({}, { fields: { principalName: 1, principalCode: 1 } }, { sort: { principalName: 1 } }).fetch();
  },
  'principal.principalList': (principal) => {
    if (principal) {
      return Principal.find({ _id: principal, active: "Y" }, { fields: { principalName: 1, principalCode: 1 } }, { sort: { principalName: 1 } }).fetch();
    } else {
      return Principal.find({ active: "Y" }, { fields: { principalName: 1, principalCode: 1 } }, { sort: { principalName: 1 } }).fetch();
    }

  },
  'principal.principalListBdm': () => {

    return Principal.find({}, { fields: { principalName: 1, principalCode: 1 } }, { sort: { principalName: 1 } }).fetch();

  },

  /**
   * activate principal
   * @param {*} id  
   * @returns 
   */
  'principal.active': (id) => {
    return Principal.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate principal
 * @param {*} id  
 * @returns 
 */
  'principal.inactive': (id) => {
    return Principal.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * return active principal list
   */
  'principal.principalActiveList': () => {
    return Principal.find({ active: "Y" }, { fields: { principalCode: 1, principalName: 1 } }, { sort: { principalName: 1 } }).fetch();
  },
  /**
  * return active principal list
  */
  'principal.verticalList': (vertical) => {
    return Principal.find({ active: "Y", vertical: { $in: vertical } }, { fields: { principalCode: 1, principalName: 1 } }, { sort: { principalName: 1 } }).fetch();
  },
  /**
 * return active principal list
 */
  'principal.verticalFullList': (vertical) => {
    return Principal.find({ vertical: { $in: vertical } }, { fields: { principalCode: 1, principalName: 1 } }, { sort: { principalName: 1 } }).fetch();
  },
  /**
   * get principal name based on id
   * @param {*} id 
   */
  'principal.idprincipalName': (id) => {
    let res = Principal.findOne({ _id: id }, { fields: { principalName: 1 } });
    if (res) {
      return res.principalName;
    }
  },

  /**
 * 
 * @param {*} principalArray  
 * @returns excel upload
 */
  'principal.createUpload': (principalArray) => {
    for (let i = 0; i < principalArray.length; i++) {
      let principalRes = Principal.find({ principalName: principalArray[i].principalName.trim() }).fetch();

      if (principalRes.length === 0) {
        Principal.insert({
          principalCode: principalArray[i].principalCode,
          principalName: principalArray[i].principalName,
          active: 'Y',
          uuid: Random.id(),
          excelUpload: true,
          createdBy: Meteor.userId(),
          createdAt: new Date(),
        });
      }
      else {
        Principal.update({ _id: principalRes[0]._id }, {
          $set:
          {
            principalCode: principalArray[i].principalCode,
            principalName: principalArray[i].principalName,
            excelUpload: true,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }
    }
  },
  'principal.wisesalesMD': (fromDate, toDate) => {
    let fromDateFor = new Date(fromDate);
    let toDateFor = new Date(toDate);
    let principalRes = Principal.find({ active: 'Y' }, { fields: { principalName: 1 } }).fetch();
    let credit = CreditSale.find({ createdAt: { $gte: fromDateFor, $lt: toDateFor } }, { fields: { itemArray: 1 } }).fetch();
    let order = Order.find({ createdAt: { $gte: fromDateFor, $lt: toDateFor } }, { fields: { itemArray: 1 } }).fetch();

    for (let i = 0; i < principalRes.length; i++) {

    }

  },

  'principal.productprincipalName': (productId) => {
    let productRes = Product.findOne({ _id: productId }, { fields: { principal: 1 } });
    if (productRes) {
      let principalRes = Principal.findOne({ _id: productRes.principal }, { fields: { principalName: 1 } });
      if (principalRes) {
        return principalRes.principalName;
      }
    }

  }
});