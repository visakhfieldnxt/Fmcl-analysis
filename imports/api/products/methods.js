/**
 * @author Nithin
 */
import { Product } from './products';
import { Unit } from '../unit/unit';
import { Brand } from '../brand/brand';
import { Category } from '../category/category';
import { allUsers } from '../user/user';
import { Principal } from "../principal/principal";
Meteor.methods({

  /**
   * create product
   * @param productName
   * @param productCode
   * @returns 
   */
  'product.create': (productName, productCode, vertical, unit, baseQty, brand, category, principal) => {
    let productRes = Product.insert({
      productCode: productCode,
      productName: productName,
      vertical: vertical,
      brand: brand,
      principal: principal,
      category: category,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (productRes) {
      unitCreateFun(productRes, unit, baseQty, vertical, Meteor.userId());
    }
  },
  /**
   * update product
   * @param {*} id 
   * @param {*} productName 
   * @param {*} productCode 
   * @returns 
   */
  'product.update': (id, productName, productCode, vertical, unit, brand, category, principal) => {
    return Product.update({ _id: id }, {
      $set:
      {
        productCode: productCode,
        productName: productName,
        vertical: vertical,
        basicUnit: unit,
        brand: brand,
        principal: principal,
        category: category,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get product details using id
   * @param {*} id 
   * @returns 
   */
  'product.id': (id) => {
    return Product.findOne({ _id: id }, { fields: { productName: 1, productCode: 1, active: 1 } });
  },
  'product.idValuesGet': (id) => {
    let unitNameGet = '';
    let brandNameGet = '';
    let categoryNameGet = '';
    let principalName = '';
    let productRes = Product.findOne({ _id: id }, {
      fields: {
        productName: 1, productCode: 1, active: 1,
        basicUnit: 1, brand: 1, category: 1, principal: 1
      }
    });
    if (productRes) {
      let unitRes = Unit.findOne({ _id: productRes.basicUnit, active: "Y" });
      if (unitRes) {
        unitNameGet = unitRes.unitName;
      }
      let brandRes = Brand.findOne({ _id: productRes.brand });
      if (brandRes) {
        brandNameGet = brandRes.brandName;
      }
      let categoryRes = Category.findOne({ _id: productRes.category });
      if (categoryRes) {
        categoryNameGet = categoryRes.categoryName;
      }
      let pricipalRes = Principal.findOne({ _id: productRes.principal });
      if (pricipalRes) {
        principalName = pricipalRes.principalName;
      }
    }
    console.log("productRes", productRes);
    return {
      productRes: productRes, unitNameGet: unitNameGet, brandNameGet: brandNameGet
      , categoryNameGet: categoryNameGet, principalName: principalName
    }
  },
  /**
   * fetching product full details 
   * @returns 
   */
  'product.productList': () => {
    return Product.find({}, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
  },
  /**
   * fetching product full details 
   * @returns 
   */
  'product.userWiseList': (vertical) => {
    return Product.find({ active: "Y", vertical: { $in: vertical } }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
  },
  /**
  * fetching product full details 
  * @returns 
  */
  'product.sdUserList': (SDUser) => {
    let vertical = [];
    let userRes = allUsers.findOne({ _id: SDUser });
    if (userRes) {
      let sdDetails = allUsers.findOne({ _id: userRes.subDistributor });
      if (sdDetails) {
        vertical = sdDetails.vertical;
      }
    }
    return Product.find({ active: "Y", vertical: { $in: vertical } }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
  },
  /**
  * fetching product full details 
  * @returns 
  */
  'product.filterList': (vertical) => {
    return Product.find({ vertical: { $in: vertical } }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
  },
  /**
   * activate product
   * @param {*} id  
   * @returns 
   */
  'product.active': (id) => {
    return Product.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate product
 * @param {*} id  
 * @returns 
 */
  'product.inactive': (id) => {
    return Product.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * return active product list
   */
  'product.productActiveList': () => {
    return Product.find({ active: "Y" }, { fields: { productCode: 1, productName: 1 } }, { sort: { productName: 1 } }).fetch();
  },
  /**
   * get product name based on id
   * @param {*} id 
   */
  'product.idproductName': (id) => {
    let res = Product.findOne({ _id: id }, { fields: { productName: 1 } });
    if (res) {
      return res.productName;
    }
  },
  /**
    * get product name based on id
    * @param {*} id 
    */
  'product.idBasicUnit': (id) => {
    let res = Product.findOne({ _id: id }, { fields: { basicUnit: 1 } });
    let unitName = '';
    if (res) {
      let unitRes = Unit.findOne({ _id: res.basicUnit });
      if (unitRes) {
        unitName = unitRes.unitName;
      }
    }
    return unitName;
  },
  /**
  * get product name based on id
  * @param {*} id 
  */
  'product.idCTNUnit': (id) => {
    let unitRes = Unit.findOne({ product: id, unitName: "CTN" });
    let unitName = '';
    let baseQty = '';
    if (unitRes) {
      unitName = unitRes.unitName;
      baseQty = unitRes.baseQuantity;
    }
    return { unitName: unitName, baseQty: baseQty };
  },
  /**
  * return active branch list
  */
  'product.activeList': () => {
    return Product.find({ active: "Y" }, { fields: { productCode: 1, productName: 1 } }, { sort: { productName: 1 } }).fetch();
  },
  /**
   * get product name based on id
   * @param {*} id 
   */
  'product.idName': (id) => {
    let res = Product.findOne({ _id: id }, { fields: { productName: 1 } });
    if (res) {
      return res.productName;
    }
  },
  /**
  * get product name based on id
  * @param {*} id 
  */
  'product.idCode': (id) => {
    let res = Product.findOne({ _id: id }, { fields: { productCode: 1 } });
    if (res) {
      return res.productCode;
    }
  },
  /**
   * 
   * @param {*} productArray  
   * @returns excel upload
   */
  'product.productscreateUpload': (productArray, vertical) => {
    for (let i = 0; i < productArray.length; i++) {
      let productRes = Product.find({ productCode: productArray[i].productCode.trim() }).fetch();
      let brandId = '';
      let categoryId = '';
      let brandDetails = Brand.findOne({ brandName: productArray[i].brand.trim() });
      if (brandDetails !== undefined) {
        brandId = brandDetails._id;
      }
      let categoryDetails = Category.findOne({
        categoryName: productArray[i].category.trim(),
        brand: brandId
      });
      if (categoryDetails !== undefined) {
        categoryId = categoryDetails._id;
      }
      let principalId = '';
      let principalRes = Principal.findOne({ principalName: productArray[i].principal.trim() });
      if (principalRes !== undefined) {
        principalId = principalRes._id;
      }
      if (brandId !== '' && brandId !== undefined &&
        categoryId !== '' && categoryId !== undefined &&
        principalId !== '' && principalId !== undefined) {
        if (productRes.length === 0) {
          let productVal = Product.insert({
            productCode: productArray[i].productCode,
            productName: productArray[i].productName,
            brand: brandId,
            category: categoryId,
            principal: principalId,
            active: 'Y',
            vertical: vertical,
            uuid: Random.id(),
            excelUpload: true,
            createdBy: Meteor.userId(),
            createdAt: new Date(),
          });
          if (productVal) {
            unitCreateFun(productVal, productArray[i].baseUnit, productArray[i].baseQty, vertical, Meteor.userId());
          }
        }
        else {
          Product.update({ _id: productRes[0]._id }, {
            $set:
            {
              productName: productArray[i].productName,
              excelUpload: true,
              brand: brandId,
              category: categoryId,
              vertical: vertical,
              principal: principalId,
              updatedBy: Meteor.userId(),
              updatedAt: new Date(),
            }
          });
        }
      }

    }

  },
  'product.baseUnitGet': (product) => {
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
    return baseUnit;
  },
  /**
   * 
   * @param {*} id 
   * @returns get product details for edit
   */
  "product.idEdits": (id) => {
    let productRes = Product.findOne({ _id: id });
    let unitRes = Unit.find({ product: id, active: "Y" }, {
      fields: {
        unitCode: 1, unitName: 1,
        baseQuantity: 1, product: 1
      }
    }).fetch();
    return { productRes: productRes, unitRes: unitRes }
  },
  'product.filterList1': (vertical) => {
    return Product.find({ vertical: vertical }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
  },
  'product.sdUserList1': (SDUser) => {
    let vertical = [];
    let userRes = allUsers.findOne({ _id: SDUser });
    if (userRes) {
      let sdDetails = allUsers.findOne({ _id: userRes.subDistributor });
      if (sdDetails) {
        vertical = sdDetails.vertical;
      }
    }

    return vertical;
  },
  /**
   * 
   * @param {*} id 
   * @returns get principal name based on product 
   */
  'product.pricipalNameGet': (id) => {
    let principalNames = '';
    let productRes = Product.findOne({ _id: id }, { fields: { principal: 1 } });
    if (productRes) {
      let principalRes = Principal.findOne({ _id: productRes.principal }, { fields: { principalName: 1 } });
      if (principalRes) {
        principalNames = principalRes.principalName;
      }
    }
    return principalNames;
  },
  'product.productName':(id)=>{
    let pName = '';
    let productName = Product.findOne({ _id: id }, { fields: { productName: 1 } });
    if(productName){
      pName = productName.productName;
    }
    return pName;
  },
  'product.proForCredit':(vertical)=>{
    let verticalArray = [];
    verticalArray.push(vertical);
    let productName = Product.find({ vertical: { $in:verticalArray } }, { fields: { productName: 1 } }).fetch();
    return productName;
  },
  'product.proForCredit_1':()=>{
    let productName = Product.find({ }, { fields: { productName: 1 } }).fetch();
    return productName;
  },

});


/**
 * create unit 
 */

function unitCreateFun(productRes, unit, baseQty, vertical, user) {
  let unitRes = Unit.insert({
    unitCode: `${unit}_${Random.id().toString().slice(-5)}`,
    unitName: unit,
    product: productRes,
    baseQuantity: baseQty,
    vertical: vertical,
    active: 'Y',
    uuid: Random.id(),
    createdBy: user,
    createdAt: new Date(),
  });
  if (unitRes) {
    Product.update({ _id: productRes }, {
      $set:
      {
        basicUnit: unitRes,
        updatedAt: new Date(),
      }
    });
  }
}