/**
 * @author Nithin
 */
import { Stock } from './stock';
import { allUsers } from '../user/user';
import { Verticals } from '../verticals/verticals';
import { Product } from '../products/products';
import { Unit } from '../unit/unit';
import { SdPriceType } from '../sdPriceType/sdPriceType';
import { SdProducts } from '../sdProducts/sdProducts';
import { Price } from '../price/price';
import { StockInvoices } from '../stockInvoices/stockInvoices';
Meteor.methods({
    /**
     * create stock
     * @param {*} vertical 
     * @param {*} productArray 
     */
    'stock.create': (productArray, vertical, invoiceNo, stockDate) => {
        for (let i = 0; i < productArray.length; i++) {
            if (productArray[i].stockUpdated === true) {
                let stockRes = Stock.find({
                    subDistributor: Meteor.userId(), vertical: vertical,
                    product: productArray[i].product
                }).fetch();
                if (stockRes.length === 0) {
                    // let productArrayData = [];
                    // let productObj = {
                    //     randomId: Random.id(),
                    //     unit: productArray[i].updatedUnit,
                    //     product: productArray[i].product,
                    //     vertical: vertical,
                    //     invoiceNo: invoiceNo,
                    //     oldStock: productArray[i].oldStock,
                    //     newStock: productArray[i].newStock,
                    //     qtyCTN: productArray[i].qtyCTN,
                    //     stockDate: stockDate,
                    //     stock: productArray[i].updatedStock,
                    // };
                    // productArrayData.push(productObj);
                    let stockData = Stock.insert({
                        subDistributor: Meteor.userId(),
                        vertical: vertical,
                        product: productArray[i].product,
                        stock: productArray[i].quantity,
                        invoiceNo: invoiceNo,
                        stockDate: stockDate,
                        // productArray: productArrayData,
                        uuid: Random.id(),
                        createdBy: Meteor.userId(),
                        updatedAt: new Date(),
                        createdAt: new Date(),
                    });
                    if (stockData) {
                        StockInvoices.insert({
                            unit: productArray[i].updatedUnit,
                            product: productArray[i].product,
                            vertical: vertical,
                            invoiceNo: invoiceNo,
                            oldStock: productArray[i].oldStock,
                            newStock: productArray[i].newStock,
                            qtyCTN: productArray[i].qtyCTN,
                            stockDate: stockDate,
                            stock: productArray[i].updatedStock,
                            subDistributor: Meteor.userId(),
                            uuid: Random.id(),
                            updatedAt: new Date(),
                            createdAt: new Date(),
                        });
                    }
                }
                else {
                    let productArrayData = [];
                    if (stockRes[0].productArray !== undefined && stockRes[0].productArray.length > 0) {
                        productArrayData = stockRes[0].productArray;
                    }
                    // let productObj = {
                    //     randomId: Random.id(),
                    //     unit: productArray[i].updatedUnit,
                    //     product: productArray[i].product,
                    //     vertical: vertical,
                    //     invoiceNo: invoiceNo,
                    //     stockDate: stockDate,
                    //     oldStock: productArray[i].oldStock,
                    //     newStock: productArray[i].newStock,
                    //     qtyCTN: productArray[i].qtyCTN,
                    //     stock: productArray[i].updatedStock,
                    // };
                    // productArrayData.push(productObj);
                    let stockData = Stock.update({ _id: stockRes[0]._id }, {
                        $set: {
                            stock: productArray[i].quantity,
                            invoiceNo: invoiceNo,
                            stockDate: stockDate,
                            // productArray: productArrayData,
                            updatedAt: new Date(),
                            updatedBy: Meteor.userId()
                        }
                    }); 
                    if (stockData) {
                        StockInvoices.insert({
                            unit: productArray[i].updatedUnit,
                            product: productArray[i].product,
                            vertical: vertical,
                            invoiceNo: invoiceNo,
                            oldStock: productArray[i].oldStock,
                            newStock: productArray[i].newStock,
                            qtyCTN: productArray[i].qtyCTN,
                            stockDate: stockDate,
                            stock: productArray[i].updatedStock,
                            subDistributor: Meteor.userId(),
                            uuid: Random.id(),
                            updatedAt: new Date(),
                            createdAt: new Date(),
                        });
                    }
                }
            }
        }
    },

    /**
 * upload stock
 * @param {*} vertical 
 * @param {*} stockDetailArray 
 */
    'stock.createUpload': (stockDetailArray) => {
        for (let i = 0; i < stockDetailArray.length; i++) {
            let productId = '';
            let productData = Product.findOne({
                productName:
                {
                    $regex: new RegExp(stockDetailArray[i].product.trim(), "i")
                }
            });
            if (productData) {
                productId = productData._id;
            }

            if (productId !== '') {
                let stockRes = Stock.find({
                    subDistributor: stockDetailArray[i].subDistributor, vertical: stockDetailArray[i].vertical,
                    product: productId,
                }).fetch();
                if (stockRes.length === 0) {
                    Stock.insert({
                        subDistributor: stockDetailArray[i].subDistributor,
                        vertical: stockDetailArray[i].vertical,
                        product: productId,
                        stock: stockDetailArray[i].stock,
                        uuid: Random.id(),
                        excelUpload: true,
                        createdBy: Meteor.userId(),
                        createdAt: new Date(),
                    });
                }
                else {
                    Stock.update({ _id: stockRes[0]._id }, {
                        $set: {
                            stock: stockDetailArray[i].stock,
                            excelUpload: true,
                            updatedAt: new Date(),
                            updatedBy: Meteor.userId()
                        }
                    })
                }
            }
        }
    },
    // /**
    //  * 
    //  * @param {*} product 
    //  * @param {*} transferQtys 
    //  * @param {*} user 
    //  * @param {*} vertical 
    //  * reduce stock based on transfer
    //  */
    // 'stock.reduceStock': (product, transferQtys, user, vertical) => {
    //     let stockRes = Stock.findOne({
    //         subDistributor: user, vertical: vertical,
    //         product: product
    //     });
    //     if (stockRes) {
    //         let actualStock = Number(stockRes.stock);
    //         let transferStock = Number(transferQtys);
    //         let balanceStock = Number(actualStock - transferStock);
    //         Stock.update({ _id: stockRes._id }, {
    //             $set: {
    //                 stock: balanceStock.toString(),
    //                 updatedAt: new Date(),
    //                 updatedBy: user
    //             }
    //         });
    //     }
    // },

    //     /**
    //  * 
    //  * @param {*} product 
    //  * @param {*} transferQtys 
    //  * @param {*} user 
    //  * @param {*} vertical 
    //  * add stock based on transfer
    //  */
    //     'stock.addStock': (productArray, user, vertical) => {
    //         let stockRes = Stock.findOne({
    //             subDistributor: user, vertical: vertical,
    //             product: productArray.product
    //         });
    //         if (stockRes) {
    //             let actualStock = Number(stockRes.stock);
    //             let transferStock = Number(productArray.transferQty);
    //             let balanceStock = Number(actualStock + transferStock);
    //             Stock.update({ _id: stockRes._id }, {
    //                 $set: {
    //                     stock: balanceStock.toString(),
    //                     updatedAt: new Date(),
    //                     updatedBy: user
    //                 }
    //             });
    //         }
    //     },
    /**
     * 
     * @param {*} user 
     * @param {*} vertical 
     * @returns get stock report
     */
    'stock.stockReports': (user, vertical, sdProduct) => {
        let sdProductList = [];
        let productArray = [];
        let verticalProducts = '';
        let subDistributorName = '';

        let userDataRes = allUsers.findOne({ _id: user });
        if (userDataRes) {
            subDistributorName = `${userDataRes.profile.firstName} ${userDataRes.profile.lastName}`;
        }
        let productRes = SdPriceType.findOne({ subDistributor: user, vertical: { $in: vertical } }
            , { fields: { priceType: 1 } });
        if (productRes !== undefined) {
            if (sdProduct != '') {
                verticalProducts = Price.find({ priceType: productRes.priceType, product: sdProduct }, { fields: { product: 1 } }).fetch();
            } else {
                verticalProducts = Price.find({ priceType: productRes.priceType }, { fields: { product: 1 } }).fetch();
            }

            if (verticalProducts.length > 0) {
                let productUnique = verticalProducts.reduce(function (memo, e1) {
                    let matches = memo.filter(function (e2) {
                        return e1.product == e2.product
                    });
                    if (matches.length == 0) {
                        memo.push(e1);
                    }
                    return memo;
                }, []);
                if (productUnique.length > 0) {
                    for (let i = 0; i < productUnique.length; i++) {
                        let sdProductData = SdProducts.findOne({
                            product: productUnique[i].product,
                            subDistributor: user
                        });
                        if (sdProductData !== undefined) {
                            sdProductList.push(sdProductData);
                        }
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
                                subDistributor: user, vertical: vertical[0],
                                product: sdProductList[i].product
                            });
                            if (stockRes !== undefined) {
                                productStock = stockRes.stock;
                            }
                        }
                        let lowStock = false;
                        if (Number(productStock) < Number(sdProductList[i].minimumQty)) {
                            lowStock = true;
                        }
                        let productObj =
                        {
                            _id: Random.id(),
                            product: sdProductList[i].product,
                            productName: productName,
                            lowStock: lowStock,
                            minStock: sdProductList[i].minimumQty,
                            quantity: productStock,
                            basicUnitsName: basicUnitsName,
                            subDistributorName: subDistributorName
                        }
                        productArray.push(productObj);
                    }
                    return productArray;
                }
            }
        }

    },
    /**
     * 
     * @param {*} id 
     * @returns id details
     */
    'stock.id': (id) => {
        return Stock.findOne({ _id: id });
    },
    /**
     * 
     * @param {*} id 
     * get stock value
     */
    'stock.idPriceValGet': (id) => {
        let stockRes = Stock.findOne({ _id: id });
        let totalValAmt = "0.00";
        if (stockRes) {
            // get ctn unit id
            let unitVal = Unit.findOne({ product: stockRes.product, unitName: "CTN" });
            // get sd price type based on vertical
            let sdPriceTypeVal = SdPriceType.findOne({
                subDistributor: stockRes.subDistributor,
                vertical: stockRes.vertical, active: "Y"
            });
            // get price details
            if (sdPriceTypeVal && unitVal) {
                let stockVal = "0.00";
                if (unitVal.baseQuantity !== undefined && unitVal.baseQuantity !== '') {
                    let stockCalc = Number(stockRes.stock) / Number(unitVal.baseQuantity);
                    let roundVal = Math.trunc(stockCalc);
                    stockVal = roundVal.toString();
                }
                let priceVal = Price.findOne({
                    priceType: sdPriceTypeVal.priceType,
                    product: stockRes.product, unit: unitVal._id
                });
                if (priceVal) {
                    let priceAmt = Number(priceVal.priceWs * stockVal).toFixed(2);
                    totalValAmt = priceAmt.toString();
                }
            }
        }
        return totalValAmt;
    },

    /**
  * 
  * @param {*} id 
  * get stock value
  */
    'stock.totalProductValue': (id, vertical) => {
        let stockRes = [];
        if (vertical !== undefined && vertical !== '') {
            stockRes = Stock.find({ subDistributor: id, vertical: vertical }).fetch();
        }
        else {
            stockRes = Stock.find({ subDistributor: id }).fetch();
        }
        let totalValAmt = 0;
        if (stockRes.length > 0) {
            for (let i = 0; i < stockRes.length; i++) {
                // get ctn unit id
                let unitVal = Unit.findOne({ product: stockRes[i].product, unitName: "CTN" });
                // get sd price type based on vertical
                let sdPriceTypeVal = SdPriceType.findOne({
                    subDistributor: stockRes[i].subDistributor,
                    vertical: stockRes[i].vertical, active: "Y"
                });
                // get price details
                if (sdPriceTypeVal && unitVal) {
                    let stockVal = "0.00";
                    if (unitVal.baseQuantity !== undefined && unitVal.baseQuantity !== '') {
                        let stockCalc = Number(stockRes[i].stock) / Number(unitVal.baseQuantity);
                        let roundVal = Math.trunc(stockCalc);
                        stockVal = roundVal.toString();
                    }
                    let priceVal = Price.findOne({
                        priceType: sdPriceTypeVal.priceType,
                        product: stockRes[i].product, unit: unitVal._id
                    });
                    if (priceVal) {
                        totalValAmt += Number(priceVal.priceWs) * Number(stockVal);
                    }
                }
            }
        }
        return Number(totalValAmt).toFixed(2);
    },
});