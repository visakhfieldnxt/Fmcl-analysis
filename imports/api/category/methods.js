/**
 * @author Nithin
 */
import { Category } from './category';
import { Brand } from '../brand/brand';
import { Principal } from "../principal/principal";
import { Product } from '../products/products';

Meteor.methods({

  /**
   * create category
   * @param categoryName
   * @param categoryCode
   * @returns 
   */
  'category.create': (categoryName, categoryCode, brand, vertical, principal) => {
    let categoryRes = Category.insert({
      categoryCode: categoryCode,
      categoryName: categoryName,
      brand: brand,
      vertical: vertical,
      principal: principal,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (categoryRes) {
      return categoryRes;
    }
  },
  /**
   * update category
   * @param {*} id 
   * @param {*} categoryName 
   * @param {*} categoryCode 
   * @returns 
   */
  'category.update': (id, categoryName, categoryCode, brand, vertical, principal) => {
    return Category.update({ _id: id }, {
      $set:
      {
        categoryCode: categoryCode,
        categoryName: categoryName,
        brand: brand,
        vertical: vertical,
        principal: principal,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get category details using id
   * @param {*} id 
   * @returns 
   */
  'category.id': (id) => {
    return Category.findOne({ _id: id }, { fields: { categoryName: 1, categoryCode: 1, active: 1, brand: 1, principal: 1 } });
  },
  'category.listdata': (id) => {
    if (id) {
      return Category.find({ _id: id }, { fields: { categoryName: 1, categoryCode: 1, active: 1, brand: 1, principal: 1 } }).fetch();
    }
    else {
      return Category.find({ active: "Y" }, { fields: { categoryName: 1, categoryCode: 1, active: 1, brand: 1, principal: 1 } }).fetch();
    }

  },
  /**
   * fetching category full details 
   * @returns 
   */
  'category.categoryList': () => {
    return Category.find({}, { fields: { categoryName: 1, categoryCode: 1 } }, { sort: { categoryName: 1 } }).fetch();
  },
  /**
  * fetching category full details 
  * @returns 
  */
  'category.userWise': () => {
    return Category.find({ active: 'Y' }, { fields: { categoryName: 1, categoryCode: 1 } }, { sort: { categoryName: 1 } }).fetch();
  },
  /**
   * activate category
   * @param {*} id  
   * @returns 
   */
  'category.active': (id) => {
    return Category.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate category
 * @param {*} id  
 * @returns 
 */
  'category.inactive': (id) => {
    return Category.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * get category details using id
 * @param {*} id 
 * @returns 
 */
  'category.idDataGet': (id) => {
    let locRes = Category.findOne({ _id: id }, { fields: { categoryName: 1, categoryCode: 1, active: 1, brand: 1, principal: 1 } });
    let brandName = '';
    let principalName = '';
    if (locRes) {
      let brandRes = Brand.findOne({ _id: locRes.brand });
      if (brandRes) {
        brandName = brandRes.brandName;
      }
      let pricipalRes = Principal.findOne({ _id: locRes.principal });
      if (pricipalRes) {
        principalName = pricipalRes.principalName;
      }
      return { locRes: locRes, brandName: brandName, principalName: principalName };
    }
  },

  /**
 * get branch name based on id
 * @param {*} id 
 */
  'category.idcategory': (id) => {
    let res = Category.findOne({ _id: id }, { fields: { categoryName: 1 } });
    if (res) {
      return res.categoryName;
    }
  },
  'category.brandWiseList': (brand) => {
    return Category.find({ active: "Y", brand: brand }, { fields: { categoryName: 1 } }).fetch();
  },
  /**
   * data for export
   */
  'category.brandWiseListExport': (brand, principal, vertical) => {
    let productRes = Product.find({ vertical: { $in: vertical }, brand: brand, principal: principal }, {
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
    let categoryRes = Category.find({ active: "Y", brand: brand }, { fields: { categoryName: 1 } }).fetch();
    return { productRes: productRes, categoryRes: categoryRes }
  },

  /**
 * data for export brand,category and principal
 */
  'category.fullListExport': (principal, brand, category, vertical) => {
    return Product.find({ vertical: { $in: vertical }, category: category, brand: brand, principal: principal }, {
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
  },
  /**
* 
* @param {*} categoryArray  
* @returns excel upload
*/
  'category.createUpload': (categoryArray) => {
    for (let i = 0; i < categoryArray.length; i++) {
      let brandId = '';
      let brandRes = Brand.findOne({ brandName: categoryArray[i].brandName.trim() });
      if (brandRes !== undefined) {
        brandId = brandRes._id;
      }
      let principalId = '';
      let principalRes = Principal.findOne({ principalName: categoryArray[i].principal.trim() });
      if (principalRes !== undefined) {
        principalId = principalRes._id;
      }
      if (brandId !== '' && brandId !== undefined && principalId !== undefined && principalId !== '') {
        let categoryRes = Category.find({
          categoryName: categoryArray[i].categoryName.trim(),
          brand: brandId, principal: principalId
        }).fetch();
        if (categoryRes.length === 0) {
          Category.insert({
            categoryCode: categoryArray[i].categoryCode,
            categoryName: categoryArray[i].categoryName,
            brand: brandId,
            principal: principalId,
            active: 'Y',
            uuid: Random.id(),
            excelUpload: true,
            createdBy: Meteor.userId(),
            createdAt: new Date(),
          });
        }
        else {
          Category.update({ _id: categoryRes[0]._id }, {
            $set:
            {
              categoryName: categoryArray[i].categoryName,
              brand: brandId,
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
  'category.productCategoryName': (productId) => {
    let productRes = Product.findOne({ _id: productId }, { fields: { category: 1 } });
    if (productRes) {
      let categoryRes = Category.findOne({ _id: productRes.category }, { fields: { categoryName: 1 } });
      if (categoryRes) {
        return categoryRes.categoryName;
      }
    }

  }
});