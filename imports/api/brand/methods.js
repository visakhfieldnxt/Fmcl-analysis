/**
 * @author Nithin
 */
import { Brand } from './brand';
import { Principal } from "../principal/principal";
import { Product } from '../products/products';

Meteor.methods({

  /**
   * create brand
   * @param brandName
   * @param brandCode
   * @returns 
   */
  'brand.create': (brandName, brandCode, loginUserVerticals, principal) => {
    let brandRes = Brand.insert({
      brandCode: brandCode,
      brandName: brandName,
      vertical: loginUserVerticals,
      principal: principal,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (brandRes) {
      return brandRes;
    }
  },
  /**
   * update brand
   * @param {*} id 
   * @param {*} brandName 
   * @param {*} brandCode 
   * @returns 
   */
  'brand.update': (id, brandName, brandCode, loginUserVerticals, principal) => {
    return Brand.update({ _id: id }, {
      $set:
      {
        brandCode: brandCode,
        brandName: brandName,
        principal: principal,
        vertical: loginUserVerticals,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get brand details using id
   * @param {*} id 
   * @returns 
   */
  'brand.id': (id) => {
    return Brand.findOne({ _id: id }, { fields: { brandName: 1, brandCode: 1, active: 1, principal: 1 } });
  },
  /**
   * fetching brand full details 
   * @returns 
   */
  'brand.brandList': () => {
    return Brand.find({}, { fields: { brandName: 1, brandCode: 1 } }, { sort: { brandName: 1 } }).fetch();
  },
  /**
   * activate brand
   * @param {*} id  
   * @returns 
   */
  'brand.active': (id) => {
    return Brand.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate brand
 * @param {*} id  
 * @returns 
 */
  'brand.inactive': (id) => {
    return Brand.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * return active brand list
   */
  'brand.brandActiveList': () => {
    return Brand.find({ active: "Y" }, { fields: { brandCode: 1, brandName: 1 } }, { sort: { brandName: 1 } }).fetch();
  },
  /**
  * return active brand list
  */
  'brand.verticalList': (vertical) => {
    return Brand.find({ active: "Y", vertical: { $in: vertical } }, { fields: { brandCode: 1, brandName: 1 } }, { sort: { brandName: 1 } }).fetch();
  },
  /**
 * return active brand list
 */
  'brand.verticalFullList': (vertical) => {
    return Brand.find({ vertical: { $in: vertical } }, { fields: { brandCode: 1, brandName: 1 } }, { sort: { brandName: 1 } }).fetch();
  },
  'brand.prinFullList': (principal) => {
    return Brand.find({ principal: principal }, { fields: { brandCode: 1, brandName: 1 } }, { sort: { brandName: 1 } }).fetch();
  },
  /**
   * get brand name based on id
   * @param {*} id 
   */
  'brand.idbrandName': (id) => {
    let res = Brand.findOne({ _id: id }, { fields: { brandName: 1 } });
    if (res) {
      return res.brandName;
    }
  },

  /**
* get category details using id
* @param {*} id 
* @returns 
*/
  'brand.idDataGet': (id) => {
    let brandRes = Brand.findOne({ _id: id });
    let principalName = '';
    if (brandRes) {
      let pricipalRes = Principal.findOne({ _id: brandRes.principal });
      if (pricipalRes) {
        principalName = pricipalRes.principalName;
      }
      return { brandRes: brandRes, principalName: principalName };
    }
  },

  /**
 * 
 * @param {*} brandArray  
 * @returns excel upload
 */
  'brand.createUpload': (brandArray) => {
    for (let i = 0; i < brandArray.length; i++) {
      let principalId = '';
      let principalRes = Principal.findOne({ principalName: brandArray[i].principal.trim() });
      if (principalRes) {
        principalId = principalRes._id;
      }
      if (principalId !== undefined && principalId !== '') {
        let brandRes = Brand.find({
          brandName: brandArray[i].brandName.trim(),
          principal: principalId
        }).fetch();

        if (brandRes.length === 0) {
          Brand.insert({
            brandCode: brandArray[i].brandCode,
            brandName: brandArray[i].brandName,
            principal: principalId,
            active: 'Y',
            uuid: Random.id(),
            excelUpload: true,
            createdBy: Meteor.userId(),
            createdAt: new Date(),
          });
        }
        else {
          Brand.update({ _id: brandRes[0]._id }, {
            $set:
            {
              brandCode: brandArray[i].brandCode,
              brandName: brandArray[i].brandName,
              principal: principalId,
              excelUpload: true,
              updatedBy: Meteor.userId(),
              updatedAt: new Date(),
            }
          });
        }
      }
    }
  },
  'brand.principalDataExport': (principal, vertical) => {
    let productRes = Product.find({ principal: principal, vertical: { $in: vertical } }, {
      fields: {
        productCode: 1,
        productName: 1,
        principal: 1,
        brand: 1,
        category: 1,
        createdAt: 1,
        active: 1,
        vertical: 1
      }
    }).fetch();
    let brandRes = Brand.find({ active: "Y", principal: principal }, { fields: { brandName: 1 } }).fetch();

    return { productRes: productRes, brandRes: brandRes };
  },

  'brand.principalWiseList': (principal) => {
    return Brand.find({ active: "Y", principal: principal }, { fields: { brandName: 1 } }).fetch();
  },

  'brand.productBrandName': (productId) => {
    let productRes = Product.findOne({ _id: productId }, { fields: { brand: 1 } });
    if (productRes) {
      let brandRes = Brand.findOne({ _id: productRes.brand }, { fields: { brandName: 1 } });
      if (brandRes) {
        return brandRes.brandName;
      }
    }

  }
});