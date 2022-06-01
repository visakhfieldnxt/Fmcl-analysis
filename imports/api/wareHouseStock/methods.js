/**
 * @author Nithin
 */
import { WareHouseStock } from './wareHouseStock';
import { Product } from '../products/products';
import { Unit } from '../unit/unit';
import { Stock } from '../stock/stock';
import { allUsers } from '../user/user';
import { Verticals } from '../verticals/verticals';
import { SdPriceType } from '../sdPriceType/sdPriceType';
import { Price } from '../price/price';
Meteor.methods({
    /**
 * 
 * @param {*} vertical 
 * @param {*} user 
 * @returns get product list based on price type for cash sales
 */
    'wareHouseStock.cashSales': (vertical, user) => {
        let sdDetails = allUsers.findOne({ _id: user });
        if (sdDetails) {
            let productArray = [];
            let productList = WareHouseStock.find({
                employeeId: user, vertical: vertical,
                subDistributor: sdDetails.subDistributor
            }).fetch();
            if (productList.length > 0) {
                for (let i = 0; i < productList.length; i++) {
                    let productName = '';
                    let productCode = '';
                    let basicUnitsName = '';
                    let productRes = Product.findOne({ _id: productList[i].product });
                    if (productRes) {
                        productName = productRes.productName;
                        productCode = productRes.productCode;
                        if (productRes.basicUnit !== undefined) {
                            let unitRes = Unit.findOne({ _id: productRes.basicUnit });
                            if (unitRes) {
                                basicUnitsName = unitRes.unitName;
                            }
                        }
                    }
                    let productObj =
                    {
                        _id: Random.id(),
                        product: productList[i].product,
                        productName: productName,
                        productCode: productCode,
                        basicUnitsName: basicUnitsName,
                        quantity: productList[i].stock,
                    }
                    productArray.push(productObj);
                }
            }
            return productArray;
        }
    },
    /**
     * 
     * @param {*} user 
     * @returns get data for sales return
     */
    'wareHouseStock.userWiseList': (user, vertical) => {
        let productList = WareHouseStock.find({ employeeId: user, vertical: vertical }).fetch();
        let productArray = [];
        if (productList.length > 0) {
            for (let i = 0; i < productList.length; i++) {
                let productName = '';
                let productCode = '';
                let basicUnitsName = '';
                let basicUnit = '';
                let baseQty = '';
                let productRes = Product.findOne({ _id: productList[i].product });
                if (productRes) {
                    productName = productRes.productName;
                    productCode = productRes.productCode;
                    if (productRes.basicUnit !== undefined) {
                        let unitRes = Unit.findOne({ product: productList[i].product, unitName: "CTN" });
                        if (unitRes) {
                            basicUnit = unitRes._id;
                            basicUnitsName = "CTN";
                            baseQty = unitRes.baseQuantity;
                        }
                    }
                }
                let stockVal = Number(productList[i].stock);
                if (stockVal > 0) {
                    let qtyValue = '0.00';
                    if (baseQty !== '' && baseQty !== undefined) {
                        let resVal = Number(productList[i].stock) / Number(baseQty);
                        qtyValue = Math.trunc(resVal);
                    }
                    let productObj =
                    {
                        _id: Random.id(),
                        product: productList[i].product,
                        productName: productName,
                        productCode: productCode,
                        basicUnitsName: basicUnitsName,
                        basicUnit: basicUnit,
                        quantity: qtyValue.toString(),
                        baseQty: baseQty,
                    }
                    productArray.push(productObj);
                }
            }
        }
        return productArray;
    },
    /**
     * 
     * @param {*} user 
     * @returns get result for summary report
     */
    'wareHouseStock.stockSummary': (user, vertical, product) => {
        let stockRes = '';

        if (user && vertical === '' && product === '') {
            stockRes = WareHouseStock.find({
                employeeId: user,
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        } else if (user === '' && vertical && product === '') {
            stockRes = WareHouseStock.find({
                vertical: vertical,
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        } else if (user === '' && vertical === '' && product) {
            stockRes = WareHouseStock.find({
                product: product
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        } else if (user && vertical && product === '') {
            stockRes = WareHouseStock.find({
                employeeId: user,
                vertical: vertical
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        } else if (user && vertical === '' && product) {
            stockRes = WareHouseStock.find({
                employeeId: user,
                product: product
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        } else if (user === '' && vertical && product) {
            stockRes = WareHouseStock.find({
                vertical: vertical,
                product: product
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        } else if (user && vertical && product) {
            stockRes = WareHouseStock.find({
                employeeId: user,
                vertical: vertical,
                product: product
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        } else {
            stockRes = WareHouseStock.find({
            },
                { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
        }
        let stockArray = [];
        if (stockRes.length > 0) {
            for (let i = 0; i < stockRes.length; i++) {
                let productNames = '';
                let unitName = '';
                let userName = ''
                let verticalName = '';
                let userRes = allUsers.findOne({ _id: user });
                if (userRes) {
                    userName = `${userRes.profile.firstName}${userRes.profile.lastName}`;
                }
                let verticalRes = Verticals.findOne({ _id: stockRes[i].vertical });
                if (verticalRes) {
                    verticalName = verticalRes.verticalName;
                }
                let productRes = Product.findOne({ _id: stockRes[i].product });
                if (productRes) {
                    productNames = productRes.productName;
                    if (productRes.basicUnit) {
                        let unitRes = Unit.findOne({ _id: productRes.basicUnit });
                        if (unitRes) {
                            unitName = unitRes.unitName;
                        }
                    }
                }
                let stockObj =
                {
                    productName: productNames,
                    unitName: unitName,
                    empName: userName,
                    stock: stockRes[i].stock,
                    verticalName: verticalName
                };
                stockArray.push(stockObj);
            }
        }
        return stockArray;
    },

    /**
* 
* @param {*} vertical 
* @param {*} user 
* @returns get product list based on price type for cash sales
*/
    'wareHouseStock.productList': (vertical, user, brand, category, principal) => {
        let sdDetails = allUsers.findOne({ _id: user });
        if (sdDetails) {
            let productArray = [];
            let productList = WareHouseStock.find({
                employeeId: user, vertical: vertical,
                subDistributor: sdDetails.subDistributor
            }).fetch();
            if (productList.length > 0) {
                for (let i = 0; i < productList.length; i++) {
                    let productName = '';
                    let productCode = '';
                    let basicUnitsName = '';
                    let productRes = Product.findOne({
                        _id: productList[i].product,
                        brand: brand, category: category,
                        principal: principal
                    });
                    if (productRes !== undefined) {
                        productName = productRes.productName;
                        productCode = productRes.productCode;
                        if (productRes.basicUnit !== undefined) {
                            let unitRes = Unit.findOne({ _id: productRes.basicUnit });
                            if (unitRes) {
                                basicUnitsName = unitRes.unitName;
                            }
                        }
                        let productObj =
                        {
                            _id: Random.id(),
                            product: productList[i].product,
                            productName: productName,
                            productCode: productCode,
                            basicUnitsName: basicUnitsName,
                            quantity: productList[i].stock,
                        };
                        productArray.push(productObj);
                    }

                }
            }
            return productArray;
        }
    },
    'wareHouseStock.userWiseListId': (id) => {
        let productList = WareHouseStock.findOne({ _id: id });
        let empName = '';
        let subDistributorName = '';
        let verticalName = '';
        let productName = '';
        if (productList) {
            if (productList.employeeId) { //employee name
                let emp = Meteor.users.findOne({ _id: productList.employeeId });
                if (emp) {
                    empName = `${emp.profile.firstName} ${emp.profile.lastName}`;
                }
            }
            if (productList.subDistributor) {//sd name
                let sddata = Meteor.users.findOne({ _id: productList.subDistributor });
                if (sddata) {
                    subDistributorName = `${sddata.profile.firstName} ${sddata.profile.lastName}`;
                }
            }
            if (productList.vertical) {
                let vertical1 = Verticals.findOne({ _id: productList.vertical });
                if (vertical1) {
                    verticalName = vertical1.verticalName;
                }
            }
            if (productList.product) {
                let prodData = Product.findOne({ _id: productList.product }, { fields: { productName: 1 } });
                if (prodData) {
                    productName = prodData.productName;
                }
            }

        }
        return { productList: productList, empName: empName, subDistributorName: subDistributorName, verticalName: verticalName, productName: productName };
    },

    /**
 * 
 * @param {*} id 
 * get stock value
 */
    'wareHouseStock.idPriceValGet': (id) => {
        let stockRes = WareHouseStock.findOne({ _id: id });
        let totalValAmt = "0.00";
        if (stockRes) {
            let productRes = Product.findOne({ _id: stockRes.product });
            if (productRes) {
                // get ctn unit id
                let unitVal = Unit.findOne({ product: stockRes.product, _id: productRes.basicUnit });
                // get sd price type based on vertical
                let sdPriceTypeVal = SdPriceType.findOne({
                    subDistributor: stockRes.subDistributor,
                    vertical: stockRes.vertical, active: "Y"
                });
                // get price details
                console.log("sdPriceTypeVal", sdPriceTypeVal);
                console.log("unitVal", unitVal);
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
                    console.log("priceVal", priceVal);
                    if (priceVal) {
                        let priceAmt = Number(priceVal.priceWs * stockVal).toFixed(2);
                        totalValAmt = priceAmt.toString();
                    }
                }
            }
        }
        return totalValAmt;
    },
    'wareHouseStock.sdStockList': (vertical, sd, fromDate, toDate) => {
        let stockRes = WareHouseStock.find({ subDistributor: sd, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate }
        let stock = 0;
        for (let i = 0; i < stockRes.length; i++) {
            stock = stock + Number(stockRes[i].stock);
        }
        return stock;
    },
    'wareHouseStock.wareHousestockvalue': (vertical, sd, fromDate, toDate) => {
        let stockRes = WareHouseStock.find({ subDistributor: sd, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0; let amount = 0;
        for (let i = 0; i < stockRes.length; i++) {
            let productRes = Product.findOne({ _id: stockRes[i].product }, {
                fields: {
                    basicUnit: 1
                }
            });
            if (productRes) {
                let productPrice = Price.findOne({
                    product: stockRes[i].product,
                    unit: productRes.basicUnit
                });
                if (productPrice) {
                    amount = (Number(amount) + Number(stockRes[i].stock) * Number(productPrice.priceVsr)).toFixed(2);
                }
            }
        }
        return amount;
    },
    'wareHouseStock.sdStockWarehouseList': (vertical, sd, fromDate, toDate) => { //1fun
        toDate.setDate(toDate.getDate() + 1)
        let stockRes = Stock.find({ subDistributor: sd, vertical: { $in: vertical } }).fetch();
        // , createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0;
        for (let i = 0; i < stockRes.length; i++) {
            stock = stock + Number(stockRes[i].stock);
        }
        return stock;
    },
    'wareHouseStock.sdStockWarehouseValueSD': (vertical, sd, fromDate, toDate) => {
        let stockRes = Stock.find({ subDistributor: sd, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock, amount = 0;
        for (let i = 0; i < stockRes.length; i++) {
            let productRes = Product.findOne({ _id: stockRes[i].product }, {
                fields: {
                    basicUnit: 1
                }
            });
            if (productRes) {
                let productPrice = Price.findOne({
                    product: stockRes[i].product
                    , unit: productRes.basicUnit
                });
                if (productPrice) {
                    amount = (Number(amount) + Number(stockRes[i].stock) * Number(productPrice.priceVsr)).toFixed(2);
                }
            }
        }
        return amount;
    },
    'wareHouseStock.totalqty': (vertical, sd, fromDate, toDate) => {
        let stockRes = WareHouseStock.find({ subDistributor: sd, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0;
        for (let i = 0; i < stockRes.length; i++) {
            stock = stock + Number(stockRes[i].stock);
        }
        let stock1 = 0;
        let stockRes1 = Stock.find({ subDistributor: sd, vertical: vertical[0] }).fetch();
        for (let i = 0; i < stockRes1.length; i++) {
            stock1 = stock1 + Number(stockRes1[i].stock);
        }
        return Number(Number(stock) + Number(stock1));
    },
    'wareHouseStock.totalvalue': (vertical, sd, fromDate, toDate) => {
        let stockRes = WareHouseStock.find({ subDistributor: sd, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0; let amount = 0;
        for (let i = 0; i < stockRes.length; i++) {
            let productRes = Product.findOne({
                _id: stockRes[i].product
            }, {
                fields: {
                    basicUnit: 1
                }
            });
            if (productRes) {
                let productPrice = Price.findOne({
                    product: stockRes[i].product,
                    unit: productRes.basicUnit
                });
                if (productPrice) {
                    amount = (Number(amount) + Number(stockRes[i].stock) * Number(productPrice.priceVsr)).toFixed(2);
                }
            }
        }
        let amount1 = 0;
        let stockRes1 = Stock.find({ subDistributor: sd, vertical: { $in: vertical } }).fetch();
        for (let i = 0; i < stockRes1.length; i++) {
            let productRes = Product.findOne({
                _id: stockRes1[i].product
            }, {
                fields: {
                    basicUnit: 1
                }
            });
            if (productRes) {
                let productPrice1 = Price.findOne({
                    product: stockRes1[i].product,
                    unit: productRes.basicUnit
                });
                if (productPrice1) {
                    amount1 = (Number(amount1) + Number(stockRes1[i].stock) * Number(productPrice1.priceVsr)).toFixed(2);
                }
            }
        }
        return Number(Number(amount) + Number(amount1));
    },
    'wareHouseStock.sdStockqtyTotal': (vertical, fromDate, toDate) => { //sdStockWarehouseList
        let sdListArray = [];
        let sdList = allUsers.find({ vertical: { $in: vertical }, userType: 'SD', active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let stockRes = Stock.find({ subDistributor: { $in: sdListArray }, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0;
        for (let i = 0; i < stockRes.length; i++) {
            stock = stock + Number(stockRes[i].stock);
        }

        return stock;
    },
    'wareHouseStock.sdStockValueCalTotal': (vertical, fromDate, toDate) => { //sdStockWarehouseValueSD
        let sdListArray = [];
        let sdList = allUsers.find({ vertical: { $in: vertical }, userType: 'SD', active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let stockRes = Stock.find({ subDistributor: { $in: sdListArray }, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock, amount = 0;
        for (let i = 0; i < stockRes.length; i++) {
            let productRes = Product.findOne({ _id: stockRes[i].product }, {
                fields: {
                    basicUnit: 1
                }
            });
            if (productRes) {
                let productPrice = Price.findOne({
                    product: stockRes[i].product,
                    unit: productRes.basicUnit
                });
                if (productPrice) {
                    amount = (Number(amount) + Number(stockRes[i].stock) * Number(productPrice.priceVsr)).toFixed(2);
                }
            }
        }
        return amount;
    },
    'wareHouseStock.vanQuantityTotal': (vertical, fromDate, toDate) => { //sdStockList
        let sdListArray = [];
        let sdList = allUsers.find({ vertical: { $in: vertical }, userType: 'SD', active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let stockRes = WareHouseStock.find({ subDistributor: { $in: sdListArray }, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0;
        for (let i = 0; i < stockRes.length; i++) {
            stock = stock + Number(stockRes[i].stock);
        }
        return stock;
    },
    'wareHouseStock.vanstockvalueTotal': (vertical, fromDate, toDate) => {// wareHousestockvalue
        let sdListArray = [];
        let sdList = allUsers.find({ vertical: { $in: vertical }, userType: 'SD', active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let stockRes = WareHouseStock.find({ subDistributor: { $in: sdListArray }, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0; let amount = 0;
        for (let i = 0; i < stockRes.length; i++) {
            let productRes = Product.findOne({
                _id: stockRes[i].product
            }, {
                fields: {
                    basicUnit: 1
                }
            });
            if (productRes) {
                let productPrice = Price.findOne({
                    product: stockRes[i].product,
                    unit: productRes.basicUnit
                });
                if (productPrice) {
                    amount = (Number(amount) + Number(stockRes[i].stock) * Number(productPrice.priceVsr)).toFixed(2);
                }
            }
        }
        return amount;
    },
    'wareHouseStock.totalqtyTotal': (vertical, fromDate, toDate) => { //totalqty
        let sdListArray = [];
        let sdList = allUsers.find({ vertical: { $in: vertical }, userType: 'SD', active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let stockRes = WareHouseStock.find({ subDistributor: { $in: sdListArray }, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0;
        for (let i = 0; i < stockRes.length; i++) {
            stock = stock + Number(stockRes[i].stock);
        }
        let stock1 = 0;
        let stockRes1 = Stock.find({ subDistributor: { $in: sdListArray }, vertical: vertical[0] }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        for (let i = 0; i < stockRes1.length; i++) {
            stock1 = stock1 + Number(stockRes1[i].stock);
        }
        return Number(Number(stock) + Number(stock1));
    },
    'wareHouseStock.totalvalueTotal': (vertical, fromDate, toDate) => { //totalvalue
        let sdListArray = [];
        let sdList = allUsers.find({ vertical: { $in: vertical }, userType: 'SD', active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let stockRes = WareHouseStock.find({ subDistributor: { $in: sdListArray }, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        let stock = 0; let amount = 0;
        for (let i = 0; i < stockRes.length; i++) {
            let productRes = Product.findOne({ _id: stockRes[i].product },
                {
                    fields: {
                        basicUnit: 1
                    }
                });
            if (productRes) {
                let productPrice = Price.findOne({
                    product: stockRes[i].product,
                    unit: productRes.basicUnit
                });
                if (productPrice) {
                    amount = (Number(amount) + Number(stockRes[i].stock) * Number(productPrice.priceVsr)).toFixed(2);
                }
            }
        }
        let amount1 = 0;
        let stockRes1 = Stock.find({ subDistributor: { $in: sdListArray }, vertical: { $in: vertical } }).fetch();
        // ,createdAt: { $gte: fromDate, $lt: toDate}
        for (let i = 0; i < stockRes1.length; i++) {
            let productRes = Product.findOne({ _id: stockRes1[i].product },
                {
                    fields: {
                        basicUnit: 1
                    }
                });
            if (productRes) {
                let productPrice1 = Price.findOne({
                    product: stockRes1[i].product,
                    unit: productRes.basicUnit
                });
                if (productPrice1) {
                    amount1 = (Number(amount1) + Number(stockRes1[i].stock) * Number(productPrice1.priceVsr)).toFixed(2);
                }
            }
        }
        return Number(Number(amount) + Number(amount1));
    },
    /**
     * clear negative stock
     */
    'warehouseStock.clearStock': () => {
        let stockRes = WareHouseStock.find({}, { fields: { stock: 1 } }).fetch();
        if (stockRes.length > 0) {
            for (let i = 0; i < stockRes.length; i++) {
                if (Number(stockRes[i].stock) < 0) {
                    WareHouseStock.update({
                        _id: stockRes[i]._id,
                    }, {
                        $set:
                        {
                            stock: '0.00',
                            stockCleared: new Date()
                        }
                    });
                }
            }
        }
    }
});