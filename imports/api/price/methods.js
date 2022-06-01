/**
 * @author Nithin
 */
import { Price } from './price';
import { Product } from '../products/products';
import { Unit } from '../unit/unit';
import { PriceType } from '../priceType/priceType';
import { SdPriceType } from "../sdPriceType/sdPriceType";
import { Stock } from '../stock/stock';
import { allUsers } from '../user/user';
import { SdProducts } from "../sdProducts/sdProducts";

Meteor.methods({

  /**
   * create price
   * @param priceName
   * @param priceCode
   * @returns 
   */
  'price.create': (price, product, priceType, unit, priceGetOmr, priceWs, vertical) => {

    let priceRes = Price.find({ unit: unit, product: product, priceType: priceType }).fetch();
    if (priceRes.length === 0) {
      Price.insert({
        product: product,
        priceType: priceType,
        unit: unit,
        priceOmr: priceGetOmr,
        priceVsr: price,
        priceWs: priceWs,
        vertical: vertical,
        active: 'Y',
        uuid: Random.id(),
        createdBy: Meteor.userId(),
        createdAt: new Date(),
      });
    }
    else {
      Price.update({ _id: priceRes[0]._id }, {
        $set:
        {
          priceVsr: price,
          priceOmr: priceGetOmr,
          priceWs: priceWs,
          vertical: vertical,
          updatedBy: Meteor.userId(),
          updatedAt: new Date(),
        }
      });
    }

  },
  /**
   * update price
   * @param {*} id 
   * @param {*} priceName 
   * @param {*} priceCode 
   * @returns 
   */
  'price.update': (id, product, price, priceType, unit, priceOmr, priceWs, vertical) => {
    return Price.update({ _id: id }, {
      $set:
      {
        product: product,
        priceType: priceType,
        unit: unit,
        priceOmr: priceOmr,
        priceVsr: price,
        vertical: vertical,
        priceWs: priceWs,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get price details using id
   * @param {*} id 
   * @returns 
   */
  'price.id': (id) => {
    return Price.findOne({ _id: id }, { fields: { product: 1, priceType: 1, active: 1, unit: 1, priceOmr: 1, priceWs: 1, priceVsr: 1 } });

  },
  /**
   * activate price
   * @param {*} id  
   * @returns 
   */
  'price.active': (id) => {
    return Price.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate price
 * @param {*} id  
 * @returns 
 */
  'price.inactive': (id) => {
    return Price.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * get price details using id
 * @param {*} id 
 * @returns 
 */
  'price.idDataGet': (id) => {
    let priceRes = Price.findOne({ _id: id }, { fields: { product: 1, priceType: 1, active: 1, unit: 1, priceOmr: 1, priceWs: 1, priceVsr: 1 } });
    let productName = '';
    let unitName = '';
    let priceTypeName = '';
    if (priceRes) {
      let productRes = Product.findOne({ _id: priceRes.product });
      if (productRes) {
        productName = productRes.productName;
      }
      let unitRes = Unit.findOne({ _id: priceRes.unit });
      if (unitRes) {
        unitName = unitRes.unitName;
      }
      let priceTypeRes = PriceType.findOne({ _id: priceRes.priceType });
      if (priceTypeRes) {
        priceTypeName = priceTypeRes.priceTypeName;
      }
      return { priceRes: priceRes, productName: productName, unitName: unitName, priceTypeName: priceTypeName };
    }
  },

  /**
  * 
  * @param {*} priceArray  
  * @returns excel upload
  */
  'price.createUpload': (priceArray, vertical) => {
    for (let i = 0; i < priceArray.length; i++) {
      let unitRes = Unit.findOne({ unitName: priceArray[i].unit.trim(), product: priceArray[i].product });
      if (unitRes !== undefined) {
        let priceRes = Price.find({ unit: unitRes._id, product: priceArray[i].product, priceType: priceArray[i].priceType }).fetch();
        if (priceRes.length === 0) {
          Price.insert({
            product: priceArray[i].product,
            priceType: priceArray[i].priceType,
            unit: unitRes._id,
            priceVsr: priceArray[i].price,
            priceOmr: priceArray[i].priceOmr,
            priceWs: priceArray[i].priceWs,
            vertical: vertical,
            active: 'Y',
            uuid: Random.id(),
            excelUpload: true,
            createdBy: Meteor.userId(),
            createdAt: new Date(),
          });
        }
        else {
          Price.update({ _id: priceRes[0]._id }, {
            $set:
            {
              priceVsr: priceArray[i].price,
              priceOmr: priceArray[i].priceOmr,
              priceWs: priceArray[i].priceWs,
              vertical: vertical,
              excelUpload: true,
              updatedBy: Meteor.userId(),
              updatedAt: new Date(),
            }
          });
        }
      }

    }

  },
  /**
   * 
   * @param {*} vertical 
   * @param {*} user 
   * @returns get product list based on price type
   */
  'price.sdUserWiseList': (vertical, user) => {
    let userDetail = SdPriceType.findOne({ subDistributor: user, vertical: vertical });
    if (userDetail !== undefined) {
      let productArray = [];
      let sdProductList = [];
      let productList = Price.find({ priceType: userDetail.priceType }, { fields: { product: 1, priceType: 1 } }).fetch();
      if (productList.length > 0) {
        let productUnique = productList.reduce(function (memo, e1) {
          let matches = memo.filter(function (e2) {
            return e1.product == e2.product
          });
          if (matches.length == 0) {
            memo.push(e1);
          }
          return memo;
        }, []);

        for (let i = 0; i < productUnique.length; i++) {
          let sdProductData = SdProducts.findOne({
            product: productUnique[i].product,
            subDistributor: user
          });
          if (sdProductData !== undefined) {
            sdProductList.push(sdProductData);
          }
        }
        if (sdProductList.length > 0) {
          for (let i = 0; i < sdProductList.length; i++) {
            let productName = '';
            let productCode = '';
            let basicUnitsName = '';
            let unitUids = '';
            let productStock = '0.00';
            let productRes = Product.findOne({ _id: sdProductList[i].product });
            if (productRes) {
              productName = productRes.productName;
              productCode = productRes.productCode;
              if (productRes.basicUnit !== undefined) {
                unitUids = productRes.basicUnit;
                let unitRes = Unit.findOne({ _id: productRes.basicUnit });
                if (unitRes) {
                  basicUnitsName = unitRes.unitName;
                }
              }
              let stockRes = Stock.findOne({
                subDistributor: user, vertical: vertical,
                product: sdProductList[i].product
              });
              if (stockRes !== undefined) {
                productStock = stockRes.stock;
              }
            }
            let productObj =
            {
              _id: Random.id(),
              product: sdProductList[i].product,
              productName: productName,
              productCode: productCode,
              basicUnitsName: basicUnitsName,
              transferStock: '0.00',
              transferUnit: '',
              transferStockVal: '0.00',
              unitUids: unitUids,
              stockUpdated: false,
              quantity: productStock,
            }
            productArray.push(productObj);
          }
        }
      }
      return productArray;
    }
  },

  /**
  * 
  * @param {*} vertical 
  * @param {*} user 
  * @returns get product list based on price type for cash sales
  */
  'price.cashSales': (vertical, user) => {
    let sdDetails = allUsers.findOne({ _id: user });
    if (sdDetails) {
      let userDetail = SdPriceType.findOne({ subDistributor: sdDetails.subDistributor, vertical: vertical });
      if (userDetail !== undefined) {

        let productArray = [];
        let sdProductList = [];
        let productList = Price.find({ priceType: userDetail.priceType }, { fields: { product: 1, priceType: 1 } }).fetch();
        if (productList.length > 0) {
          let productUnique = productList.reduce(function (memo, e1) {
            let matches = memo.filter(function (e2) {
              return e1.product == e2.product
            });
            if (matches.length == 0) {
              memo.push(e1);
            }
            return memo;
          }, []);

          for (let i = 0; i < productUnique.length; i++) {
            let sdProductData = SdProducts.findOne({
              product: productUnique[i].product,
              subDistributor: sdDetails.subDistributor
            });
            if (sdProductData !== undefined) {
              sdProductList.push(sdProductData);
            }
          }
          if (sdProductList.length > 0) {
            for (let i = 0; i < sdProductList.length; i++) {
              let productName = '';
              let productCode = '';
              let basicUnitsName = '';
              let productStock = '0.00';
              let productRes = Product.findOne({ _id: sdProductList[i].product });
              if (productRes) {
                productName = productRes.productName;
                productCode = productRes.productCode;
                if (productRes.basicUnit !== undefined) {
                  let unitRes = Unit.findOne({ _id: productRes.basicUnit });
                  if (unitRes) {
                    basicUnitsName = unitRes.unitName;
                  }
                }
                let stockRes = Stock.findOne({
                  subDistributor: sdDetails.subDistributor, vertical: vertical,
                  product: sdProductList[i].product
                });
                if (stockRes !== undefined) {
                  productStock = stockRes.stock;
                }
              }
              let productObj =
              {
                _id: Random.id(),
                product: sdProductList[i].product,
                productName: productName,
                productCode: productCode,
                basicUnitsName: basicUnitsName,
                quantity: productStock,
              }
              productArray.push(productObj);
            }

            return productArray;
          }
        }
      }
    }
  },
  /**
 * 
 * @param {*} vertical 
 * @param {*} user 
 * @returns get product list based on price type for cash sales
 */
  'price.cashSalesSd': (vertical, user) => {
    let sdDetails = allUsers.findOne({ _id: user });
    if (sdDetails) {
      let userDetail = SdPriceType.findOne({ subDistributor: user, vertical: vertical });
      if (userDetail !== undefined) {

        let productArray = [];
        let sdProductList = [];
        let productList = Price.find({ priceType: userDetail.priceType }, { fields: { product: 1, priceType: 1 } }).fetch();
        if (productList.length > 0) {
          let productUnique = productList.reduce(function (memo, e1) {
            let matches = memo.filter(function (e2) {
              return e1.product == e2.product
            });
            if (matches.length == 0) {
              memo.push(e1);
            }
            return memo;
          }, []);

          for (let i = 0; i < productUnique.length; i++) {
            let sdProductData = SdProducts.findOne({
              product: productUnique[i].product,
              subDistributor: user
            });
            if (sdProductData !== undefined) {
              sdProductList.push(sdProductData);
            }
          }
          if (sdProductList.length > 0) {
            for (let i = 0; i < sdProductList.length; i++) {
              let productName = '';
              let productCode = '';
              let basicUnitsName = '';
              let productStock = '0.00';
              let productRes = Product.findOne({ _id: sdProductList[i].product });
              if (productRes) {
                productName = productRes.productName;
                productCode = productRes.productCode;
                if (productRes.basicUnit !== undefined) {
                  let unitRes = Unit.findOne({ _id: productRes.basicUnit });
                  if (unitRes) {
                    basicUnitsName = unitRes.unitName;
                  }
                }
                let stockRes = Stock.findOne({
                  subDistributor: user, vertical: vertical,
                  product: sdProductList[i].product
                });
                if (stockRes !== undefined) {
                  productStock = stockRes.stock;
                }
              }
              let productObj =
              {
                _id: Random.id(),
                product: sdProductList[i].product,
                productName: productName,
                productCode: productCode,
                basicUnitsName: basicUnitsName,
                quantity: productStock,
              }
              productArray.push(productObj);
            }

            return productArray;
          }
        }
      }
    }
  },
  /**
   * 
   * @param {*} vertical 
   * @param {*} sd 
   * get price details based on vertical and sd
   */
  'price.sdDataGet': (vertical, sd, product, type) => {
    let priceListGet = '', priceRes = '';
    if(vertical!==undefined && vertical!==''){
        priceListGet = SdPriceType.findOne({ subDistributor: sd, vertical: vertical });
     }else{
        priceListGet = SdPriceType.findOne({ subDistributor: sd });
     }
    if (priceListGet !== undefined) {
      if(product!=='' && type===''){
            priceRes = Price.find({ product:product }, { fields: {
            product: 1, priceType: 1, active: 1, unit: 1, priceOmr: 1, priceWs: 1, priceVsr: 1}}).fetch();
      }else if(product==='' && type!==''){
            priceRes = Price.find({ priceType: type }, { fields: {
            product: 1, priceType: 1, active: 1, unit: 1, priceOmr: 1, priceWs: 1, priceVsr: 1}}).fetch();
      }else if(product!=='' && type!==''){
            priceRes = Price.find({ product:product, priceType: type }, { fields: {
            product: 1, priceType: 1, active: 1, unit: 1, priceOmr: 1, priceWs: 1, priceVsr: 1}}).fetch();
      }else{  
           priceRes = Price.find({ priceType: priceListGet.priceType }, { fields: { product: 1, priceType: 1, active: 1, unit: 1, priceOmr: 1, priceWs: 1, priceVsr: 1 } }).fetch();
      }

      if (priceRes.length > 0) {
        let productArray = [];
        for (let i = 0; i < priceRes.length; i++) {
          let sdProductData = SdProducts.findOne({ product: priceRes[i].product, subDistributor: sd });
          if (sdProductData !== undefined) {
            let productNames = '';
            let unitNames = '';
            let priceTypeNames = '';
            let productRes = Product.findOne({ _id: priceRes[i].product });
            if (productRes) {
              productNames = productRes.productName;
            }
            let unitRes = Unit.findOne({ _id: priceRes[i].unit });
            if (unitRes) {
              unitNames = unitRes.unitName;
            }
            let priceTypeRes = PriceType.findOne({ _id: priceRes[i].priceType });
            if (priceTypeRes) {
              priceTypeNames = priceTypeRes.priceTypeName;
            }
            let productObj =
            {
              product: productNames,
              unit: unitNames,
              active: priceRes[i].active,
              priceVsr: priceRes[i].priceVsr,
              priceOmr: priceRes[i].priceOmr,
              priceWs: priceRes[i].priceWs,
              priceType: priceTypeNames,
            }
            productArray.push(productObj);
          }
        }
        return productArray;
      }
    }
  },


  /**
  * 
  * @param {*} vertical 
  * @param {*} user 
  * @param {*} brand
  * @param {*} category
  * @returns get product list based on price type ,vertical,brand,category
  */
  'price.categoryWiseData': (vertical, user, brand, category, principal) => {
    let sdDetails = allUsers.findOne({ _id: user });
    if (sdDetails) {
      let userDetail = SdPriceType.findOne({ subDistributor: sdDetails.subDistributor, vertical: vertical });
      if (userDetail !== undefined) {
        let productArray = [];
        let sdProductList = [];
        let productList = Price.find({ priceType: userDetail.priceType }, { fields: { product: 1, priceType: 1 } }).fetch();
        if (productList.length > 0) {
          let productUnique = productList.reduce(function (memo, e1) {
            let matches = memo.filter(function (e2) {
              return e1.product == e2.product
            });
            if (matches.length == 0) {
              memo.push(e1);
            }
            return memo;
          }, []);

          for (let i = 0; i < productUnique.length; i++) {
            let sdProductData = SdProducts.findOne({
              product: productUnique[i].product,
              subDistributor: sdDetails.subDistributor
            });
            if (sdProductData !== undefined) {
              sdProductList.push(sdProductData);
            }
          }
          if (sdProductList.length > 0) {
            for (let i = 0; i < sdProductList.length; i++) {
              let productName = '';
              let productCode = '';
              let basicUnitsName = '';
              let productStock = '0.00';
              // check category and brand condition
              let productRes = Product.findOne({
                _id: sdProductList[i].product,
                brand: brand, category: category,
                principal: principal
              });
              if (productRes !== undefined) {
                if (productRes) {
                  productName = productRes.productName;
                  productCode = productRes.productCode;
                  if (productRes.basicUnit !== undefined) {
                    let unitRes = Unit.findOne({ _id: productRes.basicUnit });
                    if (unitRes) {
                      basicUnitsName = unitRes.unitName;
                    }
                  }
                  let stockRes = Stock.findOne({
                    subDistributor: sdDetails.subDistributor, vertical: vertical,
                    product: sdProductList[i].product,
                  });
                  if (stockRes !== undefined) {
                    productStock = stockRes.stock;
                  }
                }
                let productObj =
                {
                  _id: Random.id(),
                  product: sdProductList[i].product,
                  productName: productName,
                  productCode: productCode,
                  basicUnitsName: basicUnitsName,
                  quantity: productStock,
                }
                productArray.push(productObj);
              }
            }
            return productArray;
          }
        }
      }
    }
  },

  /**
 * 
 * @param {*} vertical 
 * @param {*} user 
 * @returns get product list based on price type
 */
  'price.sdStockUpdatesList': (vertical, user) => {
    let userDetail = SdPriceType.findOne({ subDistributor: user, vertical: vertical });
    if (userDetail !== undefined) {
      let productArray = [];
      let sdProductList = [];
      let productList = Price.find({ priceType: userDetail.priceType }, { fields: { product: 1, priceType: 1 } }).fetch();
      if (productList.length > 0) {
        let productUnique = productList.reduce(function (memo, e1) {
          let matches = memo.filter(function (e2) {
            return e1.product == e2.product
          });
          if (matches.length == 0) {
            memo.push(e1);
          }
          return memo;
        }, []);

        for (let i = 0; i < productUnique.length; i++) {
          let sdProductData = SdProducts.findOne({
            product: productUnique[i].product,
            subDistributor: user
          });
          if (sdProductData !== undefined) {
            sdProductList.push(sdProductData);
          }
        }
        if (sdProductList.length > 0) {
          for (let i = 0; i < sdProductList.length; i++) {
            let productPrice = '0.00';
            let productName = '';
            let productCode = '';
            let basicUnitsName = '';
            let unitUids = '';
            let productStock = '0.00';
            let basicUnit = '';
            let baseQty = '';
            let productRes = Product.findOne({ _id: sdProductList[i].product });
            if (productRes) {
              productName = productRes.productName;
              productCode = productRes.productCode;
              if (productRes.basicUnit !== undefined) {
                unitUids = productRes.basicUnit;
                let unitRes = Unit.findOne({ product: sdProductList[i].product, unitName: "CTN" });
                if (unitRes) {
                  basicUnitsName = "CTN";
                  baseQty = unitRes.baseQuantity;
                  basicUnit = unitRes._id;
                }
              }
              // get ctn price 
              let ctnPrice = Price.findOne({
                priceType: userDetail.priceType,
                product: sdProductList[i].product, unit: basicUnit
              });
              if (ctnPrice !== undefined) {
                let priceWs = Number(ctnPrice.priceWs).toFixed(2);
                productPrice = priceWs.toString();
              }
              let stockRes = Stock.findOne({
                subDistributor: user, vertical: vertical,
                product: sdProductList[i].product
              });
              if (stockRes !== undefined) {
                productStock = stockRes.stock;
              }
            }
            let qtyValue = '0.00';
            let stockVal = Number(productStock);
            if (stockVal > 0) {
              if (baseQty !== '' && baseQty !== undefined) {
                let resVal = Number(productStock) / Number(baseQty);
                qtyValue = Math.trunc(resVal);
              }
            }
            let productObj =
            {
              _id: Random.id(),
              product: sdProductList[i].product,
              productName: productName,
              productCode: productCode,
              basicUnitsName: basicUnitsName,
              transferStock: '0.00',
              transferUnit: '',
              transferStockVal: '0.00',
              unitUids: unitUids,
              stockUpdated: false,
              quantity: productStock,
              qtyCTN: qtyValue,
              baseQty: baseQty,
              productPrice: productPrice,
            }
            productArray.push(productObj);
          }
        }
      }
      return productArray;
    }
  },
  /**
   * 
   * @param {*} product 
   * @param {*} priceType 
   * @param {*} vertical 
   * @returns data expot
   */
  'price.productWiseExp': (product, priceType, vertical) => {
    if (priceType !== undefined && priceType !== '') {
      return Price.find({ product: product, priceType: priceType, vertical: { $in: vertical } }, {
        fields: {
          product: 1,
          priceType: 1,
          unit: 1,
          priceVsr: 1,
          priceOmr: 1,
          priceWs: 1,
          priceName: 1,
          vertical: 1,
          active: 1
        }
      }).fetch();
    }
    else {
      return Price.find({ product: product, vertical: { $in: vertical } }, {
        fields: {
          product: 1,
          priceType: 1,
          unit: 1,
          priceVsr: 1,
          priceOmr: 1,
          priceWs: 1,
          priceName: 1,
          vertical: 1,
          active: 1
        }
      }).fetch();
    }
  },


  /**
 * 
 * @param {*} product 
 * @param {*} priceType 
 * @param {*} vertical 
 * @returns data expot
 */
  'price.priceTypeWiseExp': (product, priceType, vertical) => {
    if (product !== undefined && product !== '') {
      return Price.find({ product: product, priceType: priceType, vertical: { $in: vertical } }, {
        fields: {
          product: 1,
          priceType: 1,
          unit: 1,
          priceVsr: 1,
          priceOmr: 1,
          priceWs: 1,
          priceName: 1,
          vertical: 1,
          active: 1
        }
      }).fetch();
    }
    else {
      return Price.find({ priceType: priceType, vertical: { $in: vertical } }, {
        fields: {
          product: 1,
          priceType: 1,
          unit: 1,
          priceVsr: 1,
          priceOmr: 1,
          priceWs: 1,
          priceName: 1,
          vertical: 1,
          active: 1
        }
      }).fetch();
    }
  },
  'price.getTypeVar': (sd,verticals) => {
    let priceTypeArray =[];
    let data = SdPriceType.find({ subDistributor:sd , vertical:{ $in:verticals } },{ fields: { priceType:1 }}).fetch();
    if(data){
      for(i=0; i<data.length; i++){
          let priceData = PriceType.findOne( { _id:data[i].priceType }, { fields:{ priceTypeName:1 } } );
          if(priceData){
              let obj = {
                  _id : priceData._id,
                  priceTypeName : priceData.priceTypeName

              }
              priceTypeArray.push(obj);
          }
         
      }
    }
    return priceTypeArray;
  }
});