/**
 * @author Nithin
 */
import { CreditSale } from "./creditSale";
import { allUsers } from '../user/user';
import { RouteGroup } from '../routeGroup/routeGroup';
import { Verticals } from '../verticals/verticals';
import { Outlets } from '../outlets/outlets';
import { RouteAssign } from '../routeAssign/routeAssign';
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { Stock } from '../stock/stock';
import { WareHouseStock } from '../wareHouseStock/wareHouseStock';
import { StockSummary } from '../stockSummary/stockSummary';
import { Product } from '../products/products';
import { Unit } from '../unit/unit';
import { Principal } from '../principal/principal';
import { Branch } from '../branch/branch';
import { Category } from '../category/category';
import { Order } from '../order/order';
import { StockTransferIssued } from '../stockTransferIssued/stockTransferIssued';


Meteor.methods({

    'creditSale.create': (productsArray, vertical, grandTotal, taxTotal, latitude,
        longitude, outlet, salesType, walkInCustomer) => {
        let sdVal = '';
        let userDetails = allUsers.findOne({ _id: Meteor.userId() }, { fields: { subDistributor: 1 } });
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
            creditSale: true,
        }, { sort: { $natural: -1 } });
        if (!tempVal) {
            temporaryId = "CREDIT/" + "FMC" + "/1";
        } else {
            temporaryId = "CREDIT/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
        }
        if (!tempVal) {
            TempSerialNo.insert({
                serial: 1,
                creditSale: true,
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

        let creditSaleRes = CreditSale.insert({
            sdUser: Meteor.userId(),
            subDistributor: sdVal,
            vertical: vertical,
            outlet: outlet,
            routeId: routeId,
            docDate: moment(new Date).format('DD-MM-YYYY'),
            docTotal: grandTotal.toString(),
            discountAmt: '0.00',
            taxAmount: taxTotal.toString(),
            latitude: latitude,
            salesType: salesType,
            longitude: longitude,
            itemArray: productsArray,
            totalQty: totalQty.toString(),
            walkInCustomer: walkInCustomer,
            totalItems: productsArray.length.toString(),
            afterDiscount: '',
            beforeDiscount: '',
            docNum: temporaryId,
            status: "Approved",
            createdBy: Meteor.userId(),
            uuid: Random.id(),
            createdAt: new Date(),
        });
        if (creditSaleRes) {
            stockUpdateFun(creditSaleRes, vertical, sdVal, Meteor.userId(), productsArray);
        }
    },
    /**
    * fetching directsale id
    * @returns 
    */
    'creditSale.id': (id) => {
        let sdName = '';
        let verticalName = '';
        let routeIdName = '';
        let outletName = '';
        let createdName = '';
        let data = CreditSale.findOne({ _id: id });
        if (data) {
            if (data.sdUser) {
                let sdUser1 = allUsers.findOne({ _id: data.sdUser }, { fields: { username: 1 } });
                if (sdUser1) {
                    sdName = sdUser1.username;
                }
            }
            if (data.vertical) {
                let vertical1 = Verticals.findOne({ _id: data.vertical }, { fields: { verticalName: 1 } });
                if (vertical1) {
                    verticalName = vertical1.verticalName;
                }
            }
            if (data.routeId) {
                let routeId1 = RouteGroup.findOne({ _id: data.routeId }, { fields: { routeName: 1 } });
                if (routeId1) {
                    routeIdName = routeId1.routeName;
                }
            }
            if (data.walkInCustomer === true) {
                outletName = "Walk-In Customer"
            }
            else {
                if (data.outlet) {
                    let outlet1 = Outlets.findOne({ _id: data.outlet }, { fields: { name: 1 } });
                    if (outlet1) {
                        outletName = outlet1.name;
                    }
                }
            }
            if (data.createdBy) {
                let created1 = allUsers.findOne({ _id: data.createdBy }, { fields: { username: 1 } });
                if (created1) {
                    createdName = created1.username;
                }
            }

        }
        return { creditSaleData: data, sdName: sdName, verticalName: verticalName, routeIdName: routeIdName, outletName: outletName, createdName: createdName };
    },
    // 'creditSale.verticalWiseSaleList': (fromDate, toDate, verticalName) => {
    //     let listofData = '';
    //     let fDate = fromDate;
    //     let tDate = toDate;
    //     if (verticalName && fromDate === '' && toDate === '') {
    //         listofData = CreditSale.find({ vertical: verticalName }, { fields: { itemArray: 1 } }).fetch();
    //     } else if (verticalName === '' && fromDate && toDate === '') {
    //         fromDate.setDate(fromDate.getDate() + 1);
    //         listofData = CreditSale.find({ createdAt: { $lte: fromDate } }, { fields: { itemArray: 1 } }).fetch();
    //     } else if (verticalName === '' && fromDate === '' && toDate) {
    //         if(toDate!=null) toDate.setDate(toDate.getDate() + 1);
    //         listofData = CreditSale.find({ createdAt: { $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
    //     }
    //     else if (verticalName && fromDate && toDate === '') {
    //         fromDate.setDate(fromDate.getDate() + 1);
    //         listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: fromDate } }, { fields: { itemArray: 1 } }).fetch();
    //     }
    //     else if (verticalName && fromDate === '' && toDate) {
    //         if(toDate!=null) toDate.setDate(toDate.getDate() + 1);
    //         listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
    //     }
    //     else if (verticalName === '' && fromDate && toDate) {
    //         if (fromDate.toString() === toDate.toString()) {
    //             if(toDate!=null) toDate.setDate(toDate.getDate() + 1);
    //             listofData = CreditSale.find({ createdAt: fromDate }, { fields: { itemArray: 1 } }).fetch();
    //         } else {
    //             listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
    //         }
    //     } else if (verticalName && fromDate && toDate) {
    //         if (fromDate.toString() === toDate.toString()) {
    //             if(toDate!=null) toDate.setDate(toDate.getDate() + 1);
    //             listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
    //         }
    //         else {
    //             listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
    //         }
    //     } else {
    //         listofData = CreditSale.find({}, { fields: { itemArray: 1 } }).fetch();
    //     }
    //     let productArray = [];
    //     let productArray1 = [];
    //     let productList = '';
    //     if (verticalName != '') {
    //         productList = Product.find({ vertical: verticalName }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
    //     } else {
    //         productList = Product.find({ active: 'Y' }, { fields: { productName: 1, productCode: 1 } }).fetch();
    //     }

    //     for (let i = 0; i < listofData.length; i++) {
    //         for (let j = 0; j < listofData[i].itemArray.length; j++) {
    //             let prod = listofData[i].itemArray[j];
    //             let productObj = {
    //                 productId: prod.product,
    //                 productUnit: prod.unit,
    //                 unit: prod.unit,
    //                 unitQuantity: prod.unitQuantity,
    //                 unitPrice: prod.unitPrice,
    //                 price: prod.price,
    //                 salesPrice: prod.salesPrice,
    //                 withOutTax: prod.withOutTax,
    //                 grossTotal: prod.grossTotal,
    //                 product: prod.product,
    //                 quantity: prod.quantity,
    //                 taxPerc: prod.taxPerc,
    //                 taxRate: prod.taxRate,
    //                 taxtAmount: prod.taxtAmount,
    //                 transferStockVal: prod.transferStockVal,
    //             }
    //             productArray.push(productObj);
    //         }

    //     }
    //     let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
    //     for (let u = 0; u < productList.length; u++) {
    //         let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
    //         let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
    //         productId = productList[u]._id;
    //         for (let k = 0; k < productArray.length; k++) {
    //             if (productList[u]._id == productArray[k].productId) {
    //                 count = count + 1;
    //                 tableTotal = tableTotal + Number(productArray[k].grossTotal);
    //                 grossTotal = grossTotal + Number(productArray[k].grossTotal);
    //                 let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
    //                 if (ctn) {
    //                     ctnCount = ctn.baseQuantity;
    //                 }
    //                 let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
    //                 if (unitl) {
    //                     if (unitl.unitName == 'CTN') {
    //                         ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
    //                     }
    //                     if (unitl.unitName == 'PAC') {
    //                         packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
    //                     }
    //                     if (unitl.unitName == 'PCS') {
    //                         pcs = pcs + Number(productArray[k].quantity);
    //                     }
    //                 }
    //             }

    //         }


    //         if (count != 0) {
    //             if (pcs != 0) {
    //                 pcsTotal = pcsTotal + pcs;
    //             }
    //             if (packToPcs != 0) {
    //                 pcsTotal = pcsTotal + packToPcs;
    //             }
    //             let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
    //             let pcsToCTN = totalPcs / ctnCount;//19.16
    //             let roundCtn = Math.round(pcsToCTN, 0);
    //             let findPcsCount = roundCtn * ctnCount;
    //             let findPcs = 0;
    //             if (totalPcs > findPcsCount) {
    //                 findPcs = totalPcs - findPcsCount;
    //             } else {
    //                 findPcs = (totalPcs - findPcsCount) * -1;
    //             }
    //             tablePC = tablePC + findPcs;
    //             tableCtn = tableCtn + roundCtn;
    //             productObj1 = {
    //                 productId: productId,
    //                 fromDate: fDate,
    //                 toDate: tDate,
    //                 ctnTotal: roundCtn,
    //                 pcsBalance: findPcs,
    //                 sale_by_val: grossTotal
    //             }
    //             productArray1.push(productObj1);
    //         }

    //     }
    //     return { productArray1: productArray1, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    // },
    'creditSale.regionalWiseSaleList': (fromDate, toDate, verticalName) => { //, regionName
        let listofData = '';
        let sdlist = '';

        sdlist = allUsers.find({}, { fields: { username: 1 } }).fetch();

        let regionWiseSdArray = [];
        let regionFullArray = [];
        for (i = 0; i < sdlist.length; i++) {
            regionWiseSdArray.push(sdlist[i]._id);
        }
        if (verticalName && fromDate === '' && toDate === '') {
            listofData = CreditSale.find({ vertical: verticalName, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        } else if (verticalName === '' && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: fromDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        } else if (verticalName === '' && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: fromDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName === '' && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else if (verticalName && fromDate && toDate) {

            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else {
            listofData = CreditSale.find({}, { fields: { itemArray: 1 } }).fetch();
        }
        let productArray = [];
        let productArray1 = [];
        if (verticalName != '') {
            productList = Product.find({ vertical: verticalName }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            productList = Product.find({}, { fields: { productName: 1, productCode: 1 } }).fetch();
        }
        for (let i = 0; i < listofData.length; i++) {
            for (let j = 0; j < listofData[i].itemArray.length; j++) {
                let prod = listofData[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                    subDistributor: listofData[i].subDistributor
                }
                productArray.push(productObj);
            }

        }

        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0; let subDistributor = 0;
            productId = productList[u]._id;
            let subEach = 0;
            for (let k = 0; k < productArray.length; k++) {
                subDistributor = productArray[k].subDistributor;
                if (productList[u]._id == productArray[k].productId) {
                    subEach = productArray[k].subDistributor;
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }

                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;

                let subRegion = Meteor.users.findOne({ _id: subEach });
                productObj1 = {
                    productId: productId,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal,
                    regionName: subRegion.branch,
                    subDistributor: subDistributor
                }
                productArray1.push(productObj1);
            }

        }
        let lastArray = []; let prObj = {};
        let regionList = Branch.find({}, { fields: { branchName: 1, branchCode: 1 } }, { sort: { branchName: 1 } }).fetch();

        for (let k = 0; k < regionList.length; k++) {
            let region = regionList[k]._id;
            let ctnTotal1 = 0, pcsBalance1 = 0, sale_by_val1 = 0;
            for (let l = 0; l < productArray1.length; l++) {
                if (productArray1[l].regionName == region) {
                    ctnTotal1 = ctnTotal1 + Number(productArray1[l].ctnTotal);
                    pcsBalance1 = pcsBalance1 + Number(productArray1[l].pcsBalance);
                    sale_by_val1 = sale_by_val1 + Number(productArray1[l].sale_by_val);
                }
            }
            prObj = {
                region: regionList[k]._id,
                fromDate: fromDate,
                toDate: toDate,
                ctnTotal: ctnTotal1,
                pcsBalance: pcsBalance1,
                sale_by_val: sale_by_val1
            }
            lastArray.push(prObj);

        }
        return { productArray1: lastArray, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    },
    'creditSale.regionalWiseSaleList1': (fromDate, toDate, verticalName) => { //, regionName
        let listofData = '';
        let sdlist = '';
        // if (regionName != '') {
        //     sdlist = allUsers.find({ branch: regionName }, { fields: { username: 1 } }).fetch();
        // } else {
        sdlist = allUsers.find({ createdBy: Meteor.userId() }, { fields: { username: 1 } }).fetch();
        // }

        let regionWiseSdArray = [];
        let regionFullArray = [];
        for (i = 0; i < sdlist.length; i++) {
            regionWiseSdArray.push(sdlist[i]._id);
        }
        if (verticalName && fromDate === '' && toDate === '') {
            listofData = CreditSale.find({ vertical: verticalName, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        } else if (verticalName === '' && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: fromDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        } else if (verticalName === '' && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: fromDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName === '' && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else if (verticalName && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else {
            listofData = CreditSale.find({}, { fields: { itemArray: 1 } }).fetch();
        }

        let productArray = [];
        let productArray1 = [];
        if (verticalName != '') {
            productList = Product.find({ vertical: verticalName }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            productList = Product.find({}, { fields: { productName: 1, productCode: 1 } }).fetch();
        }
        for (let i = 0; i < listofData.length; i++) {
            for (let j = 0; j < listofData[i].itemArray.length; j++) {
                let prod = listofData[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                    subDistributor: listofData[i].subDistributor
                }
                productArray.push(productObj);
            }

        }

        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0; let subDistributor = 0;
            productId = productList[u]._id;
            let subEach = 0;
            for (let k = 0; k < productArray.length; k++) {
                subDistributor = productArray[k].subDistributor;
                if (productList[u]._id == productArray[k].productId) {
                    subEach = productArray[k].subDistributor;
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }

                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;
                let subRegion = Meteor.users.findOne({ _id: subEach });
                productObj1 = {
                    productId: productId,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal,
                    regionName: subRegion.branch,
                    subDistributor: subDistributor
                }
                productArray1.push(productObj1);
            }

        }
        let lastArray = []; let prObj = {};
        let regionList = Branch.find({}, { fields: { branchName: 1, branchCode: 1 } }, { sort: { branchName: 1 } }).fetch();

        for (let k = 0; k < regionList.length; k++) {
            let region = regionList[k]._id;
            let ctnTotal1 = 0, pcsBalance1 = 0, sale_by_val1 = 0;
            for (let l = 0; l < productArray1.length; l++) {
                if (productArray1[l].regionName == region) {
                    ctnTotal1 = ctnTotal1 + Number(productArray1[l].ctnTotal);
                    pcsBalance1 = pcsBalance1 + Number(productArray1[l].pcsBalance);
                    sale_by_val1 = sale_by_val1 + Number(productArray1[l].sale_by_val);
                }
            }
            prObj = {
                region: regionList[k]._id,
                fromDate: fromDate,
                toDate: toDate,
                ctnTotal: ctnTotal1,
                pcsBalance: pcsBalance1,
                sale_by_val: sale_by_val1
            }
            lastArray.push(prObj);

        }
        return { productArray1: lastArray, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    },
    'creditSale.principalWiseSaleList': (fromDate, toDate, principalName, vertical, brand, category) => {

        let listofData = '';
        if (vertical && fromDate === '' && toDate === '') {
            listofData = CreditSale.find({ vertical: vertical }, { fields: { itemArray: 1 } }).fetch();
        } else if (vertical === '' && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: fromDate } }, { fields: { itemArray: 1 } }).fetch();
        } else if (vertical === '' && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        } else if (vertical && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: vertical, createdAt: { $lte: fromDate } }, { fields: { itemArray: 1 } }).fetch();
        } else if (vertical === '' && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lt: toDate } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else if (vertical && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: vertical, createdAt: { $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        } else if (vertical && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: vertical, createdAt: { $gte: fromDate, $lt: toDate } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: vertical, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else {
            listofData = CreditSale.find({}, { fields: { itemArray: 1 } }).fetch();
        }

        let productArray = [];
        let productArray1 = [];
        let princpArray = [];
        let pList = principalName;
        if (principalName === '') {
            pList = Principal.find().fetch();
        }
        for (let j = 0; j < pList.length; j++) {
            princpArray.push(pList[j]._id);
        }
        let productList = '';
        if (brand && category === '') {
            productList = Product.find({ brand: brand, principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brand === '' && category) {
            productList = Product.find({ category: category, principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brand && category) {
            productList = Product.find({ category: category, brand: brand, principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        else {
            productList = Product.find({ principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        for (let i = 0; i < listofData.length; i++) {
            for (let j = 0; j < listofData[i].itemArray.length; j++) {
                let prod = listofData[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                }
                productArray.push(productObj);
            }
        }

        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
            productId = productList[u]._id;
            principal = productList[u].principal;
            for (let k = 0; k < productArray.length; k++) {
                if (productList[u]._id == productArray[k].productId) {
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }
                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;

                productObj1 = {
                    productId: productId,
                    principal: principal,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal
                }
                productArray1.push(productObj1);
            }

        }
        let lastArray = []; let prObj = {};
        let prinList = Principal.find({}, { fields: { principalName: 1 } }).fetch();
        if (princpArray) {
            prinList = Principal.find({ _id: { $in: princpArray } }, { fields: { principalName: 1 } }).fetch();
        }
        for (let k = 0; k < prinList.length; k++) {
            let ctnTotal1 = 0, pcsBalance1 = 0, sale_by_val1 = 0;
            for (let u = 0; u < productArray1.length; u++) {
                if (productArray1[u].principal == prinList[k]._id) {
                    ctnTotal1 = ctnTotal1 + Number(productArray1[u].ctnTotal);
                    pcsBalance1 = pcsBalance1 + Number(productArray1[u].pcsBalance);
                    sale_by_val1 = sale_by_val1 + Number(productArray1[u].sale_by_val);
                }
            }
            prObj = {
                principal: prinList[k]._id,
                fromDate: fromDate,
                toDate: toDate,
                ctnTotal: ctnTotal1,
                pcsBalance: pcsBalance1,
                sale_by_val: sale_by_val1
            }
            lastArray.push(prObj);

        }
        return { productArray1: lastArray, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    },

    'creditSale.totalSalesVolume': (id, fromDate, toDate, brandfilter, categoryfilter) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r])
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r])
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (brandfilter && categoryfilter === null) {
            prodLst = Product.find({ principal: id, brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter === null && categoryfilter) {
            prodLst = Product.find({ principal: id, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: id, brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({ principal: id }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        let count = 0; let ctnCount = 1;
        let tableCtn = 0, tablePC = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);

                            // let ctn = Unit.findOne({ product: aryLs.product, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                            // if (ctn) {
                            //     ctnCount = ctn.baseQuantity;
                            // }
                            // let unitl = Unit.findOne({ product: aryLs.product, _id: aryLs.unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                            // if (unitl) {
                            //     if (unitl.unitName == 'CTN') {
                            //         ctnToPcs = ctnToPcs + (aryLs.quantity * ctnCount);
                            //     }
                            //     if (unitl.unitName == 'PAC') {
                            //         packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(aryLs.quantity));
                            //     }
                            //     if (unitl.unitName == 'PCS') {
                            //         pcs = pcs + Number(aryLs.quantity);
                            //     }
                            // }
                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }

        // if (pcs != 0) {
        //     pcsTotal = pcsTotal + pcs;
        // }
        // if (packToPcs != 0) {
        //     pcsTotal = pcsTotal + packToPcs;
        // }
        // let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
        // let pcsToCTN = totalPcs / ctnCount;
        // let roundCtn = Math.round(pcsToCTN, 0);
        // let findPcsCount = roundCtn * ctnCount;
        // let findPcs = 0;
        // if (totalPcs > findPcsCount) {
        //     findPcs = totalPcs - findPcsCount;
        // } else {
        //     findPcs = (totalPcs - findPcsCount) * -1;
        // }

        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    'creditSale.totalSalesValue': (id, fromDate, toDate, brandfilter, categoryfilter) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate }
            , status: "Delivered"
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (brandfilter && categoryfilter === null) {
            prodLst = Product.find({ principal: id, brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter === null && categoryfilter) {
            prodLst = Product.find({ principal: id, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: id, brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({ principal: id }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        let sumVlm = 0;
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    //c1
    'creditSale.saleVolumeTotal': (fromDate, toDate, principal, brandfilter, categoryfilter) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length > 0; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length > 0; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (principal && brandfilter == null && categoryfilter == null) {
            prodLst = Product.find({ principal: principal }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal == null && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter, principal: principal }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ principal: principal, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter) {
            prodLst = Product.find({ brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: principal, brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({}, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        let count = 0; let ctnCount = 1;
        let tableCtn = 0, tablePC = 0;;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }
        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    //c2
    'creditSale.saleValueTotal': (fromDate, toDate, principal, brandfilter, categoryfilter) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (principal && brandfilter == null && categoryfilter == null) {
            prodLst = Product.find({ principal: principal }, { fields: { _id: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter }, { fields: { _id: 1 } }).fetch();
        } else if (principal == null && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ category: categoryfilter }, { fields: { _id: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter, principal: principal }, { fields: { _id: 1 } }).fetch();
        } else if (principal && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ principal: principal, category: categoryfilter }, { fields: { _id: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter) {
            prodLst = Product.find({ brand: brandfilter, category: categoryfilter }, { fields: { _id: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: principal, brand: brandfilter, category: categoryfilter }, { fields: { _id: 1 } }).fetch();
        } else {
            prodLst = Product.find({}, { fields: { _id: 1 } }).fetch();
        }
        let sumVlm = 0;
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    //1
    'creditSale.salesByVolmBdm': (id, fromDate, toDate, principal, brandfilter, categoryfilter, loginUserVerticals) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered"
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (brandfilter && categoryfilter === null) {
            prodLst = Product.find({ principal: id, brand: brandfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (brandfilter === null && categoryfilter) {
            prodLst = Product.find({ principal: id, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: id, brand: brandfilter, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else {
            prodLst = Product.find({ principal: id, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        }
        let count = 0; let ctnCount = 1;
        let pcsTotal = 0; let tableCtn = 0, tablePC = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            let totPcs = 0; let pnalance = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs += ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }
        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    //2
    'creditSale.salesByValBdm': (id, fromDate, toDate, principal, brandfilter, categoryfilter, loginUserVerticals) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered"
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = [];
        if (brandfilter && categoryfilter === null) {
            prodLst = Product.find({ principal: id, brand: brandfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (brandfilter === null && categoryfilter) {
            prodLst = Product.find({ principal: id, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: id, brand: brandfilter, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } },).fetch();
        } else {
            prodLst = Product.find({ principal: id, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        }
        let sumVlm = 0;
        let grossTotal = 0;
        if (prodLst.length > 0) {
            for (let j = 0; j < prodLst.length; j++) {
                if (salesDataArray.length > 0) {
                    for (let i = 0; i < salesDataArray.length; i++) {
                        for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                            let aryLs = salesDataArray[i].itemArray[k];
                            if (aryLs.product == prodLst[j]._id) {
                                grossTotal = grossTotal + Number(aryLs.grossTotal);
                            }
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    //3
    'creditSale.saleVolumeTotalBdm': (fromDate, toDate, principal, brandfilter, categoryfilter, loginUserVerticals) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (principal && brandfilter == null && categoryfilter == null) {
            prodLst = Product.find({ principal: principal, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (principal == null && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter, principal: principal, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (principal && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ principal: principal, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter) {
            prodLst = Product.find({ brand: brandfilter, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: principal, brand: brandfilter, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }).fetch();
        } else {
            prodLst = Product.find({ vertical: { $in: loginUserVerticals } }, { fields: { _id: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        let ctnCount = 1;
        let count = 0; let tableCtn = 0, tablePC = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            let totPcs = 0; let pnalance = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs += ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }
        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    //4
    'creditSale.saleValueTotalBdm': (fromDate, toDate, principal, brandfilter, categoryfilter, loginUserVerticals) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered"
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';



        // if (brandfilter && categoryfilter === '') {
        //     prodLst = Product.find({ brand: brandfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        // } else if (brandfilter === '' && categoryfilter) {
        //     prodLst = Product.find({ category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        // } else if (brandfilter && categoryfilter) {
        //     prodLst = Product.find({ brand: brandfilter, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        // } else {
        //     prodLst = Product.find({ vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        // }


        if (principal && brandfilter == null && categoryfilter == null) {
            prodLst = Product.find({ principal: principal, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal == null && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter, principal: principal, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ principal: principal, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal == null && brandfilter && categoryfilter) {
            prodLst = Product.find({ brand: brandfilter, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principal && brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: principal, brand: brandfilter, category: categoryfilter, vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({ vertical: { $in: loginUserVerticals } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }

        let sumVlm = 0;
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    'creditSale.totalSalesSdVolume': (id, fromDate, toDate, brandfilter, categoryfilter, sdId) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ subDistributor: sdId, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            subDistributor: sdId, status: "Delivered",
            deliveredDate: { $gte: fromDate, $lte: toDate }
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (brandfilter && categoryfilter === null) {
            prodLst = Product.find({ principal: id, brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter === null && categoryfilter) {
            prodLst = Product.find({ principal: id, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: id, brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({ principal: id }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        let tableCtn = 0, tablePC = 0;
        let count = 0; let ctnCount = 1;
        let pcsTotal = 0; let pnalance = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            let totPcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs += ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }

        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    'creditSale.totalSalesSdValue': (id, fromDate, toDate, brandfilter, categoryfilter, sdId) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ subDistributor: sdId, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ subDistributor: sdId, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (brandfilter && categoryfilter === null) {
            prodLst = Product.find({ principal: id, brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter === null && categoryfilter) {
            prodLst = Product.find({ principal: id, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: id, brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({ principal: id }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        let sumVlm = 0;
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    'creditSale.saleVolumeSdTotal': (fromDate, toDate, brandfilter, categoryfilter, sdId, principalfilter) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ subDistributor: sdId, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ subDistributor: sdId, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';
        if (principalfilter && brandfilter == null && categoryfilter == null) {
            prodLst = Product.find({ principal: principalfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter == null && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter == null && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ principal: principalfilter, brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ principal: principalfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter == null && brandfilter && categoryfilter) {
            prodLst = Product.find({ brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter && brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: principalfilter, brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({}, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }

        let ctnCount = 1; let count = 0;
        let pcsTotal = 0; let tableCtn = 0, tablePC = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            let totPcs = 0; let pnalance = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs += ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }
        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    'creditSale.saleValueSdTotal': (fromDate, toDate, brandfilter, categoryfilter, sdId, principalfilter) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ subDistributor: sdId, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ subDistributor: sdId, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = '';

        if (principalfilter && brandfilter == null && categoryfilter == null) {
            prodLst = Product.find({ principal: principalfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter == null && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter == null && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter && brandfilter && categoryfilter == null) {
            prodLst = Product.find({ principal: principalfilter, brand: brandfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter && brandfilter == null && categoryfilter) {
            prodLst = Product.find({ principal: principalfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter == null && brandfilter && categoryfilter) {
            prodLst = Product.find({ brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (principalfilter && brandfilter && categoryfilter) {
            prodLst = Product.find({ principal: principalfilter, brand: brandfilter, category: categoryfilter }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            prodLst = Product.find({}, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        let sumVlm = 0;
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    'creditSale.totalSalesRegMdVolume': (id, fromDate, toDate, vertical) => {
        let sdlist = [];
        if (vertical !== null) {
            sdlist = allUsers.find({ branch: id, vertical: vertical, userType: "SD" }, { fields: { _id: 1 } }).fetch();
        } else {
            sdlist = allUsers.find({ branch: id, userType: "SD" }, { fields: { _id: 1 } }).fetch();
        }
        let regionWiseSdArray = [];
        if (sdlist.length > 0) {
            for (i = 0; i < sdlist.length; i++) {
                regionWiseSdArray.push(sdlist[i]._id);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({
            createdAt: { $gte: fromDate, $lte: toDate },
            subDistributor: { $in: regionWiseSdArray }
        }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered",
            subDistributor: { $in: regionWiseSdArray }
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code

        let prodLst = Product.find({}, { fields: { _id: 1 } }).fetch();
        let sumVlm = 0;
        let count = 0; let ctnCount = 1; let ctnLast = 0, totPcs = 0, tctn = 0, pnalance = 0, npcs = 0;
        let tablePC = 0; let tableCtn = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (prodLst[j]._id == aryLs.product) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }
        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    'creditSale.totalSalesRegMdValue': (id, fromDate, toDate, vertical) => {
        let sdlist = [];
        if (vertical !== null) {
            sdlist = allUsers.find({ branch: id, vertical: vertical }, { fields: { _id: 1 } }).fetch();
        } else {
            sdlist = allUsers.find({ branch: id }, { fields: { _id: 1 } }).fetch();
        }
        let regionWiseSdArray = [];
        if (sdlist.length > 0) {
            for (i = 0; i < sdlist.length; i++) {
                regionWiseSdArray.push(sdlist[i]._id);
            }
        }
        let salesDataArray = [];
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let creditSale = CreditSale.find({
            createdAt: { $gte: fromDate, $lte: toDate },
            subDistributor: { $in: regionWiseSdArray }
        }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered",
            subDistributor: { $in: regionWiseSdArray }
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({}, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        let sumVlm = 0;
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    'creditSale.saleVolumeRegMdTotal': (fromDate, toDate, vertical, region) => {
        let verticalArray = []; let sdlist = ''; let branch = '';
        verticalArray.push(vertical);
        if (vertical !== null) {
            branch = Branch.find({ active: "Y", vertical: { $in: verticalArray } }, { fields: { branchName: 1 } }).fetch();
        } else {
            branch = Branch.find({ active: "Y" }, { fields: { branchName: 1 } }).fetch();
        }
        let branchArray = [];
        if (region !== null) {
            branchArray.push(region);
        } else {
            for (i = 0; i < branch.length; i++) {
                branchArray.push(branch[i]._id);
            }
        }
        if (vertical !== null) {
            sdlist = allUsers.find({ branch: { $in: branchArray }, vertical: { $in: verticalArray }, userType: "SD", active: "Y" }, { fields: { username: 1 } }).fetch();
        } else {
            sdlist = allUsers.find({ branch: { $in: branchArray }, userType: "SD", active: "Y" }, { fields: { username: 1 } }).fetch();
        }
        let regionWiseSdArray = [];
        for (i = 0; i < sdlist.length; i++) {
            regionWiseSdArray.push(sdlist[i]._id);
        }
        let salesDataArray = [];
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered", subDistributor: { $in: regionWiseSdArray }
        }, { fields: { itemArray: 1 } }).fetch();

        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({}, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        let count = 0; let ctnCount = 1, tableCtn = 0, tablePC = 0;;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (prodLst[j]._id == aryLs.product) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                            // let ctn = Unit.findOne({ product: aryLs.product, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                            // if (ctn) {
                            //     ctnCount = ctn.baseQuantity;
                            // }
                            // let unitl = Unit.findOne({ product: aryLs.product, _id: aryLs.unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                            // if (unitl) {
                            //     if (unitl.unitName == 'CTN') {
                            //         ctnToPcs = ctnToPcs + (aryLs.quantity * ctnCount);
                            //     }
                            //     if (unitl.unitName == 'PAC') {
                            //         packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(aryLs.quantity));
                            //     }
                            //     if (unitl.unitName == 'PCS') {
                            //         pcs = pcs + Number(aryLs.quantity);
                            //     }
                            // }
                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }
        // if (pcs != 0) {
        //     pcsTotal = pcsTotal + pcs;
        // }
        // if (packToPcs != 0) {
        //     pcsTotal = pcsTotal + packToPcs;
        // }
        // let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
        // let pcsToCTN = totalPcs / ctnCount;
        // let roundCtn = Math.round(pcsToCTN, 0);
        // let findPcsCount = roundCtn * ctnCount;
        // let findPcs = 0;
        // if (totalPcs > findPcsCount) {
        //     findPcs = totalPcs - findPcsCount;
        // } else {
        //     findPcs = (totalPcs - findPcsCount) * -1;
        // }
        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    'creditSale.saleValueRegMdTotal': (fromDate, toDate, vertical, region) => {
        let verticalArray = []; let sdlist = ''; let branch = '';
        verticalArray.push(vertical);
        if (vertical) {
            branch = Branch.find({ active: "Y", vertical: { $in: verticalArray } }, { fields: { branchName: 1 } }).fetch();
        } else {
            branch = Branch.find({ active: "Y" }, { fields: { branchName: 1 } }).fetch();
        }
        let branchArray = [];
        if (region !== null) {
            branchArray.push(region);
        } else {
            for (i = 0; i < branch.length; i++) {
                branchArray.push(branch[i]._id);
            }
        }
        if (vertical) {
            sdlist = allUsers.find({ branch: { $in: branchArray }, vertical: { $in: verticalArray }, userType: "SD", active: "Y" }, { fields: { username: 1 } }).fetch();
        } else {
            sdlist = allUsers.find({ branch: { $in: branchArray }, userType: "SD", active: "Y" }, { fields: { username: 1 } }).fetch();
        }
        let regionWiseSdArray = [];
        for (i = 0; i < sdlist.length; i++) {
            regionWiseSdArray.push(sdlist[i]._id);
        }
        let salesDataArray = [];
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered",
            subDistributor: { $in: regionWiseSdArray }
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({}, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        let sumVlm = 0;
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    'creditSale.totalSales': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        let salesDataArray = [];
        creditSale = CreditSale.find({ subDistributor: id.trim(), createdAt: { $gte: fromDateFor, $lt: toDateFor } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            subDistributor: id.trim(),
            status: "Delivered", deliveredDate: { $gte: fromDateFor, $lt: toDateFor }
        },
            { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                let iteAry = salesDataArray[i].itemArray;
                for (let j = 0; j < iteAry.length; j++) {
                    qty += Number(iteAry[j].quantity * iteAry[j].unitQuantity);
                }
            }
        }
        return qty;
    },
    'creditSale.gTotalSales': (id, fromDate, toDate) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        let sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (u = 0; u < sdList.length; u++) {
            sdListArray.push(sdList[u]._id);
        }
        creditSale = CreditSale.find({ subDistributor: { $in: sdListArray }, createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                let iteAry = creditSale[i].itemArray;
                for (let j = 0; j < iteAry.length; j++) {
                    qty += Number(iteAry[j].quantity * iteAry[j].unitQuantity);
                }
            }
        }
        return qty;
    },
    'creditSale.totalAmount': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        let salesDataArray = [];
        creditSale = CreditSale.find({ subDistributor: id.trim(), createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            subDistributor: id.trim(), status: "Delivered",
            deliveredDate: { $gte: fromDateFor, $lt: toDateFor }
        },
            { fields: { docTotal: 1 } }).fetch();

        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                qty += Number(salesDataArray[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.gTotalAmount': (id, fromDate, toDate) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        let sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
        for (u = 0; u < sdList.length; u++) {
            sdListArray.push(sdList[u]._id);
        }
        creditSale = CreditSale.find({ subDistributor: { $in: sdListArray }, createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.gTotalValueTotal': (sdName, fromDate, toDate) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        let sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
        if (sdName !== null) {
            sdListArray.push(sdName);
        } else {
            for (u = 0; u < sdList.length; u++) {
                sdListArray.push(sdList[u]._id);
            }
        }
        let salesDataArray = [];
        creditSale = CreditSale.find({ subDistributor: { $in: sdListArray }, createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { totalQty: 1, itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r])
            }
        }

        let orderRes = Order.find({ subDistributor: { $in: sdListArray }, status: "Delivered", deliveredDate: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { totalQty: 1, itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r])
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                // qty += Number(creditSale[i].totalQty);
                let iteAry = salesDataArray[i].itemArray;
                for (let j = 0; j < iteAry.length; j++) {
                    qty += Number(iteAry[j].quantity * iteAry[j].unitQuantity);
                }
            }
        }
        return qty;
    },
    'creditSale.gTotalAmountTotal': (sdName, fromDate, toDate) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        let sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
        if (sdName !== null) {
            sdListArray.push(sdName);
        } else {
            for (u = 0; u < sdList.length; u++) {
                sdListArray.push(sdList[u]._id);
            }
        }
        let salesDataArray = [];
        creditSale = CreditSale.find({ subDistributor: { $in: sdListArray }, createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ subDistributor: { $in: sdListArray }, deliveredDate: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                qty += Number(salesDataArray[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.verticalWiseSaleSdList': (fromDate, toDate, verticalName) => {
        let listofData = '';
        if (verticalName && fromDate === '' && toDate === '') {

            listofData = CreditSale.find({ vertical: verticalName, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        } else if (verticalName === '' && fromDate && toDate === '') {

            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: fromDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        } else if (verticalName === '' && fromDate === '' && toDate) {

            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        }
        else if (verticalName && fromDate && toDate === '') {

            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: fromDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        }
        else if (verticalName && fromDate === '' && toDate) {

            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName === '' && fromDate && toDate) {

            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            } else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            }
        } else if (verticalName && fromDate && toDate) {

            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            }
        } else {
            listofData = CreditSale.find({ subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
        }
        let productArray = [];
        let productArray1 = [];
        let productList = '';
        if (verticalName != '') {
            productList = Product.find({ vertical: verticalName }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            productList = Product.find({}, { fields: { productName: 1, productCode: 1 } }).fetch();
        }

        for (let i = 0; i < listofData.length; i++) {
            for (let j = 0; j < listofData[i].itemArray.length; j++) {
                let prod = listofData[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                }
                productArray.push(productObj);
            }

        }
        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
            productId = productList[u]._id;
            for (let k = 0; k < productArray.length; k++) {
                if (productList[u]._id == productArray[k].productId) {
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }
                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;//19.16
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;
                productObj1 = {
                    productId: productId,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal
                }
                productArray1.push(productObj1);
            }

        }
        return { productArray1: productArray1, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    },
    'creditSale.regionalWiseSaleSdList': (fromDate, toDate, verticalName, regionName) => {
        let listofData = '';
        let sdlist = '';
        if (regionName != '') {
            sdlist = allUsers.find({ branch: regionName }, { fields: { username: 1 } }).fetch();
        } else {
            sdlist = allUsers.find().fetch();
        }
        let regionWiseSdArray = [];
        for (i = 0; i < sdlist.length; i++) {
            if (Meteor.userId() == sdlist[i]._id)
                regionWiseSdArray.push(sdlist[i]._id);
        }
        if (verticalName && fromDate === '' && toDate === '') {
            listofData = CreditSale.find({ vertical: verticalName, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        } else if (verticalName === '' && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: fromDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        } else if (verticalName === '' && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: fromDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: verticalName, createdAt: { $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (verticalName === '' && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else if (verticalName && fromDate && toDate) {

            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                listofData = CreditSale.find({ vertical: verticalName, createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: { $in: regionWiseSdArray } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else {
            listofData = CreditSale.find({}, { fields: { itemArray: 1 } }).fetch();
        }
        let productArray = [];
        let productArray1 = [];
        if (verticalName != '') {
            productList = Product.find({ vertical: verticalName }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            productList = Product.find({}, { fields: { productName: 1, productCode: 1 } }).fetch();
        }
        for (let i = 0; i < listofData.length; i++) {
            for (let j = 0; j < listofData[i].itemArray.length; j++) {
                let prod = listofData[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                    subDistributor: listofData[i].subDistributor
                }
                productArray.push(productObj);
            }

        }

        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
            productId = productList[u]._id;
            let subEach = 0;
            for (let k = 0; k < productArray.length; k++) {
                if (productList[u]._id == productArray[k].productId) {
                    subEach = productArray[k].subDistributor;
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }

                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;
                let subRegion = Meteor.users.findOne({ _id: subEach });
                productObj1 = {
                    productId: productId,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal,
                    regionName: subRegion.branch
                }
                productArray1.push(productObj1);
            }

        }

        let lastArray = []; let prObj = {};
        let regionList = Branch.find({}, { fields: { branchName: 1, branchCode: 1 } }, { sort: { branchName: 1 } }).fetch();
        for (let k = 0; k < regionList.length; k++) {
            let region = regionList[k]._id;
            let ctnTotal1 = 0, pcsBalance1 = 0, sale_by_val1 = 0;
            for (let l = 0; l < productArray1.length; l++) {
                if (productArray1[l].regionName == region) {
                    ctnTotal1 = ctnTotal1 + Number(productArray1[l].ctnTotal);
                    pcsBalance1 = pcsBalance1 + Number(productArray1[l].pcsBalance);
                    sale_by_val1 = sale_by_val1 + Number(productArray1[l].sale_by_val);
                }
            }
            prObj = {
                region: regionList[k]._id,
                fromDate: fromDate,
                toDate: toDate,
                ctnTotal: ctnTotal1,
                pcsBalance: pcsBalance1,
                sale_by_val: sale_by_val1
            }
            lastArray.push(prObj);

        }



        return { productArray1: lastArray, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    },
    'creditSale.principalWiseSdSaleList': (fromDate, toDate, principalName, vertical, brand, category) => {

        let listofData = '';
        if (vertical && fromDate === '' && toDate === '') {

            listofData = CreditSale.find({ vertical: vertical, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        } else if (vertical === '' && fromDate && toDate === '') {

            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: fromDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        } else if (vertical === '' && fromDate === '' && toDate) {

            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        } else if (vertical && fromDate && toDate === '') {

            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: vertical, createdAt: { $lte: fromDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        } else if (vertical === '' && fromDate && toDate) {

            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            }

        } else if (vertical && fromDate === '' && toDate) {

            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: vertical, createdAt: { $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();

        } else if (vertical && fromDate && toDate) {

            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: vertical, createdAt: { $gte: fromDate, $lt: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: vertical, createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
            }

        } else {
            listofData = CreditSale.find({ subDistributor: Meteor.userId() }, { fields: { itemArray: 1 } }).fetch();
        }

        let productArray = [];
        let productArray1 = [];
        let princpArray = [];
        let pList = principalName;
        if (principalName === '') {
            pList = Principal.find().fetch();
        }

        for (let j = 0; j < pList.length; j++) {
            princpArray.push(pList[j]._id);
        }
        let productList = '';
        if (brand && category === '') {
            productList = Product.find({ brand: brand, principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brand === '' && category) {
            productList = Product.find({ category: category, principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        } else if (brand && category) {
            productList = Product.find({ category: category, brand: brand, principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }
        else {
            productList = Product.find({ principal: { $in: princpArray } }, { fields: { productName: 1, productCode: 1, principal: 1 } }, { sort: { productName: 1 } }).fetch();
        }

        for (let i = 0; i < listofData.length; i++) {
            for (let j = 0; j < listofData[i].itemArray.length; j++) {
                let prod = listofData[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                }
                productArray.push(productObj);
            }
        }

        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
            productId = productList[u]._id;
            let principal = productList[u].principal;
            for (let k = 0; k < productArray.length; k++) {
                if (productList[u]._id == productArray[k].productId) {
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }
                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;

                productObj1 = {
                    productId: productId,
                    principal: principal,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal
                }
                productArray1.push(productObj1);
            }

        }

        let lastArray = []; let prObj = {};
        let prinList = Principal.find().fetch();

        for (let k = 0; k < prinList.length; k++) {
            let ctnTotal1 = 0, pcsBalance1 = 0, sale_by_val1 = 0;
            for (let u = 0; u < productArray1.length; u++) {
                if (productArray1[u].principal == prinList[k]._id) {
                    ctnTotal1 = ctnTotal1 + Number(productArray1[u].ctnTotal);
                    pcsBalance1 = pcsBalance1 + Number(productArray1[u].pcsBalance);
                    sale_by_val1 = sale_by_val1 + Number(productArray1[u].sale_by_val);
                }

            }
            prObj = {
                principal: prinList[k]._id,
                fromDate: fromDate,
                toDate: toDate,
                ctnTotal: ctnTotal1,
                pcsBalance: pcsBalance1,
                sale_by_val: sale_by_val1
            }
            lastArray.push(prObj);

        }
        return { productArray1: lastArray, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    },
    'creditSale.verticalWiseSaleBdmList': (fromDate, toDate, vertical) => {
        let listofData = [];
        let salesDataArray = [];
        let orderRes = [];
        if (vertical.length > 0 && fromDate === '' && toDate === '') {
            listofData = CreditSale.find({ vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
            orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
        } else if (vertical.length === 0 && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: fromDate } }, { fields: { itemArray: 1 } }).fetch();
            orderRes = Order.find({ deliveredDate: { $lte: fromDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();

        } else if (vertical.length === 0 && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ createdAt: { $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            orderRes = Order.find({ deliveredDate: { $lte: toDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (vertical.length > 0 && fromDate && toDate === '') {
            fromDate.setDate(fromDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $lte: fromDate } }, { fields: { itemArray: 1 } }).fetch();
            orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $lte: fromDate } }, { fields: { itemArray: 1 } }).fetch();
        }
        else if (vertical.length > 0 && fromDate === '' && toDate) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            listofData = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();

        }
        else if (vertical.length === 0 && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lt: toDate } }, { fields: { itemArray: 1 } }).fetch();
                orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lt: toDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
            } else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
                orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
            }
        } else if (vertical.length > 0 && fromDate && toDate) {
            if (fromDate.toString() === toDate.toString()) {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
                orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            }
            else {
                if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
                listofData = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $gte: fromDate, $lt: toDate } }, { fields: { itemArray: 1 } }).fetch();
                orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $gte: fromDate, $lt: toDate } }, { fields: { itemArray: 1 } }).fetch();
            }
        } else {
            listofData = CreditSale.find({}, { fields: { itemArray: 1 } }).fetch();
            orderRes = Order.find({ status: "Delivered" }, { fields: { itemArray: 1 } }).fetch();
        }
        if (listofData.length > 0) {
            for (let r = 0; r < listofData.length; r++) {
                salesDataArray.push(listofData[r]);
            }
        }
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1);
        let productArray = [];
        let productArray1 = [];
        let productList = '';
        if (vertical.length > 0) {
            productList = Product.find({ vertical: { $in: vertical } }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
        } else {
            productList = Product.find({}, { fields: { productName: 1, productCode: 1 } }).fetch();
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                for (let j = 0; j < salesDataArray[i].itemArray.length; j++) {
                    let prod = salesDataArray[i].itemArray[j];
                    let productObj = {
                        productId: prod.product,
                        productUnit: prod.unit,
                        unit: prod.unit,
                        unitQuantity: prod.unitQuantity,
                        unitPrice: prod.unitPrice,
                        price: prod.price,
                        salesPrice: prod.salesPrice,
                        withOutTax: prod.withOutTax,
                        grossTotal: prod.grossTotal,
                        product: prod.product,
                        quantity: prod.quantity,
                        taxPerc: prod.taxPerc,
                        taxRate: prod.taxRate,
                        taxtAmount: prod.taxtAmount,
                        transferStockVal: prod.transferStockVal,
                    }
                    productArray.push(productObj);
                }
            }
        }
        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
            productId = productList[u]._id;
            for (let k = 0; k < productArray.length; k++) {
                if (productList[u]._id == productArray[k].productId) {
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }
                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;
                productObj1 = {
                    productId: productId,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal
                }
                productArray1.push(productObj1);
            }

        }
        return { productArray1: productArray1, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal };
    },
    'creditSale.totalSalesCategoryWise': (categoryid, fromDate, toDate) => {
        let productList = Product.find({ category: categoryid }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
        let productArray = [];
        let productArray1 = [];
        let qty = 0;
        listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();

        for (let i = 0; i < listofData.length; i++) {
            for (let j = 0; j < listofData[i].itemArray.length; j++) {
                let prod = listofData[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                    dateCreated: listofData[i].createdAt
                }
                productArray.push(productObj);
            }

        }
        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
            productId = productList[u]._id;

            for (let k = 0; k < productArray.length; k++) {
                if (productList[u]._id == productArray[k].productId) {
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);
                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }
                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }
            }
            if (count != 0) {
                if (pcs != 0) {
                    pcsTotal = pcsTotal + pcs;
                }
                if (packToPcs != 0) {
                    pcsTotal = pcsTotal + packToPcs;
                }
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;//19.16
                let roundCtn = Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;
                let findPcs = 0;
                if (totalPcs > findPcsCount) {
                    findPcs = totalPcs - findPcsCount;
                } else {
                    findPcs = (totalPcs - findPcsCount) * -1;
                }
                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;
                productObj1 = {
                    productId: productId,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal
                }
                productArray1.push(productObj1);
            }

        }
        return { productArray1: productArray1, tablePC: tablePC, tableCtn: tableCtn, tableTotal: tableTotal, fromDate: fromDate, toDate: toDate };
    },

    // 03082021   
    'creditSale.totalSalesCategoryVolume': (sd, categoryid, fromDate, toDate) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: sd }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered", subDistributor: sd
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: categoryid }, { fields: { _id: 1 } }).fetch();
        let ctnCount = 1; let pcsTotal = 0; let tableCtn = 0, tablePC = 0, count = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }

        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    /**
     * 
     * @param {*} sd 
     * @param {*} categoryid 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @returns 
     */
    'creditSale.totalSalesCategoryVolumeBDM': (vertical, categoryid, fromDate, toDate) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered", vertical: { $in: vertical }
        }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: categoryid }, { fields: { _id: 1 } }).fetch();
        let ctnCount = 1; let pcsTotal = 0; let tableCtn = 0, tablePC = 0, count = 0;
        for (let j = 0; j < prodLst.length; j++) {
            let packToPcs = 0; let pcs = 0; let ctnToPcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);
                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }

        return { roundCtn: tableCtn, findPcs: tablePC };
    },

    'creditSale.totalSalesCategoryValue': (sd, categoryid, fromDate, toDate) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: sd }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", subDistributor: sd }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: categoryid }, { fields: { _id: 1 } }).fetch();
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    /**
     * 
     * @param {*} sd 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} cat 
     * @returns 
     */
    'creditSale.totalSalesCategoryValueBDM': (vertical, categoryid, fromDate, toDate) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: categoryid }, { fields: { _id: 1 } }).fetch();
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    'creditSale.totalSalesCatVlmTotal': (sd, fromDate, toDate, cat) => {
        let cateGory = [];
        if (cat) {
            cateGory = Category.find({ _id: cat }, { fields: { categoryName: 1 } }).fetch();
        } else {
            cateGory = Category.find({ active: "Y" }, { fields: { categoryName: 1 } }).fetch();
        }

        let catArray = [];
        for (let i = 0; i < cateGory.length; i++) {
            catArray.push(cateGory[i]._id);
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: sd }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", subDistributor: sd }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: { $in: catArray } }, { fields: { _id: 1 } }).fetch();

        let count = 0; let ctnCount = 1; let tableCtn = 0, tablePC = 0;

        for (let j = 0; j < prodLst.length; j++) {
            let ctnToPcs = 0; let packToPcs = 0; let pcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);

                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }

        return { roundCtn: tableCtn, findPcs: tablePC };
    },

    /**
     * 
     * @param {*} sd 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} cat 
     * @returns 
     */

    'creditSale.totalSalesCatVlmTotalBDM': (vertical, fromDate, toDate, cat) => {
        let cateGory = [];
        if (cat) {
            cateGory = Category.find({ _id: cat }, { fields: { categoryName: 1 } }).fetch();
        } else {
            cateGory = Category.find({ active: 'Y' }, { fields: { categoryName: 1 } }).fetch();
        }

        let catArray = [];
        for (let i = 0; i < cateGory.length; i++) {
            catArray.push(cateGory[i]._id);
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: { $in: catArray } }, { fields: { _id: 1 } }).fetch();

        let count = 0; let ctnCount = 1; let tableCtn = 0, tablePC = 0;

        for (let j = 0; j < prodLst.length; j++) {
            let ctnToPcs = 0; let packToPcs = 0; let pcs = 0;
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            ctn = getCtn(aryLs.product); //find ctn of product aryLs.product
                            count++;
                            //convert ctn,pack to pcs
                            ctnToPcs += getctnToPcs(aryLs, ctn);
                            packToPcs += getpackToPcs(aryLs);
                            pcs += getpcs(aryLs);

                        }
                        totPcs = +ctnToPcs + packToPcs + pcs;
                    }
                }
            }
            if (count > 0) {
                ctnCount = totPcs / ctn;
                if (ctnCount < 1) {
                    tctn = 0;
                    pnalance = totPcs;
                } else {
                    tctn = Math.floor(ctnCount);
                    npcs = ctn * tctn;
                    pnalance = totPcs - npcs;
                }
                tableCtn += tctn;
                tablePC += pnalance;
            }
        }

        return { roundCtn: tableCtn, findPcs: tablePC };
    },
    'creditSale.totalSalesCatVleTotal': (sd, fromDate, toDate, cat) => {
        let cateGory = [];
        if (cat) {
            cateGory = Category.find({ _id: cat }, { fields: { categoryName: 1 } }).fetch();
        } else {
            cateGory = Category.find({ active: "Y" }, { fields: { categoryName: 1 } }).fetch();
        }

        // let cateGory = Category.find({}, { fields: { categoryName: 1 } }).fetch();
        let catArray = [];
        for (let i = 0; i < cateGory.length; i++) {
            catArray.push(cateGory[i]._id);
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: sd }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", subDistributor: sd }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: { $in: catArray } }, { fields: { _id: 1 } }).fetch();
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    /**
     * 
     * @param {*} id 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @returns 
     */
    'creditSale.totalSalesCatVleTotalBDM': (vertical, fromDate, toDate, cat) => {
        let cateGory = [];
        if (cat) {
            cateGory = Category.find({ _id: cat }, { fields: { categoryName: 1 } }).fetch();
        } else {
            cateGory = Category.find({ active: "Y" }, { fields: { categoryName: 1 } }).fetch();
        }

        // let cateGory = Category.find({}, { fields: { categoryName: 1 } }).fetch();
        let catArray = [];
        for (let i = 0; i < cateGory.length; i++) {
            catArray.push(cateGory[i]._id);
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let creditSale = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", vertical: { $in: vertical } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let prodLst = Product.find({ category: { $in: catArray } }, { fields: { _id: 1 } }).fetch();
        let grossTotal = 0;
        for (let j = 0; j < prodLst.length; j++) {
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let k = 0; k < salesDataArray[i].itemArray.length; k++) {
                        let aryLs = salesDataArray[i].itemArray[k];
                        if (aryLs.product == prodLst[j]._id) {
                            grossTotal = grossTotal + Number(aryLs.grossTotal);
                        }
                    }
                }
            }
        }
        return grossTotal;
    },
    // 03082021
    'creditSale.cashSold': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;

        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ subDistributor: id.trim(), salesType: 'Cash', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.creditSold': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;

        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ subDistributor: id.trim(), salesType: 'Credit', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },

    'creditSale.creditSoldSD': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;

        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ sdUser: id.trim(), salesType: 'Credit', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },

    'creditSale.creditSoldSdTotal': (fromDate, toDate, sdName) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let sdList = allUsers.find({ userType: 'SDUser', subDistributor: Meteor.userId(), active: 'Y' }, { fields: { profile: 1 } }).fetch();
        if (sdName !== null) {
            sdListArray.push(sdName);
        } else {
            for (let i = 0; i < sdList.length; i++) {
                sdListArray.push(sdList[i]._id);
            }
        }
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ sdUser: { $in: sdListArray }, salesType: 'Credit', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.cashSoldSD': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;

        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ sdUser: id.trim(), salesType: 'Cash', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.cashSoldSdTotal': (fromDate, toDate, sdName) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let sdList = allUsers.find({ userType: 'SDUser', subDistributor: Meteor.userId(), active: 'Y' }, { fields: { profile: 1 } }).fetch();
        if (sdName !== null) {
            sdListArray.push(sdName);
        } else {
            for (let i = 0; i < sdList.length; i++) {
                sdListArray.push(sdList[i]._id);
            }
        }
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ sdUser: { $in: sdListArray }, salesType: 'Cash', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.creditSoldSdUserTotal': (fromDate, toDate, outlet) => {
        let creditSale = [], sdListArray = [], sdList = '';
        let qty = 0;
        if (outlet !== null) {
            sdList = Outlets.find({ _id: outlet, createdBy: Meteor.userId(), active: 'Y' }, { fields: { profile: 1 } }).fetch();
        } else {
            sdList = Outlets.find({ createdBy: Meteor.userId(), active: 'Y' }, { fields: { profile: 1 } }).fetch();
        }

        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        creditSale = CreditSale.find({ outlet: { $in: sdListArray }, salesType: 'Credit', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    }
    ,
    'creditSale.cashSoldSdUserTotal': (fromDate, toDate, outlet) => {
        let creditSale = [], sdListArray = [], sdList = '';
        let qty = 0;
        if (outlet !== null) {
            sdList = Outlets.find({ _id: outlet, createdBy: Meteor.userId(), active: 'Y' }, { fields: { profile: 1 } }).fetch();
        } else {
            sdList = Outlets.find({ createdBy: Meteor.userId(), active: 'Y' }, { fields: { profile: 1 } }).fetch();
        }

        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        creditSale = CreditSale.find({ outlet: { $in: sdListArray }, salesType: 'Cash', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    }



    ,
    'creditSale.cashSoldSDUser': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;

        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        creditSale = CreditSale.find({ outlet: id.trim(), salesType: 'Cash', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.creditSoldSDUser': (id, fromDate, toDate) => {
        let creditSale = [];
        let qty = 0;

        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ outlet: id.trim(), salesType: 'Credit', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.saleLastMonthBdm': (fromDate, toDate, id) => {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: id }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData.length > 0) {
            for (let r = 0; r < listofData.length; r++) {
                salesDataArray.push(listofData[r]);
            }
        }
        let orderRes = Order.find({
            deliveredDate: { $gte: fromDate, $lte: toDate },
            status: "Delivered", subDistributor: id
        }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let crtValue = 0, crtQty = 0, lmtValue = 0, lmtQty = 0, total = 0, gtotal = 0, ltotal = 0, lgtotal = 0;
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                crtValue = crtValue + Number(salesDataArray[i].docTotal);
                crtQty = crtQty + Number(salesDataArray[i].totalQty);
                total = total + Number(crtValue);
                gtotal = gtotal + Number(crtQty);
            }
        }
        let salesDataArray1 = [];
        let listofData1 = CreditSale.find({ createdAt: { $gte: firstDay, $lte: lastDay }, subDistributor: id }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData1.length > 0) {
            for (let r = 0; r < listofData1.length; r++) {
                salesDataArray1.push(listofData1[r]);
            }
        }
        let orderRes1 = Order.find({
            deliveredDate: { $gte: firstDay, $lte: lastDay }, status: "Delivered",
            subDistributor: id
        }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes1.length > 0) {
            for (let r = 0; r < orderRes1.length; r++) {
                salesDataArray1.push(orderRes1[r]);
            }
        }
        if (salesDataArray1.length > 0) {
            for (let j = 0; j < salesDataArray1.length; j++) {
                lmtValue = lmtValue + Number(salesDataArray1[j].docTotal);
                lmtQty = lmtQty + Number(salesDataArray1[j].totalQty);

                ltotal = ltotal + Number(lmtValue);
                lgtotal = lgtotal + Number(lmtQty);
            }
        }
        // return { crtValue: Math.round(crtValue, 2), crtQty: Math.round(crtQty, 2), lmtValue: Math.round(lmtValue, 2), lmtQty: Math.round(lmtQty, 2), total: Math.round(total, 2), gtotal: Math.round(gtotal, 2), ltotal: Math.round(ltotal, 2), lgtotal: Math.round(lgtotal, 2) };
        return { crtValue: crtValue.toFixed(2), crtQty: crtQty.toFixed(2), lmtValue: lmtValue.toFixed(2), lmtQty: lmtQty.toFixed(2), total: total.toFixed(2), gtotal: gtotal.toFixed(2), ltotal: ltotal.toFixed(2), lgtotal: lgtotal.toFixed(2) };
    },
    'creditSale.saleLastMonthBdm1': (fromDate, toDate, vertical, sdName) => {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        let usersList = [];
        if (sdName) {
            usersList.push(sdName);
        } else {
            let allu = allUsers.find({ userType: 'SD', active: 'Y', vertical: { $in: vertical } }).fetch();

            for (i = 0; i < allu.length; i++) {
                usersList.push(allu[i]._id);
            }
        }

        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, subDistributor: { $in: usersList } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData.length > 0) {
            for (let r = 0; r < listofData.length; r++) {
                salesDataArray.push(listofData[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", subDistributor: { $in: usersList } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let crtValue = 0, crtQty = 0, lmtValue = 0, lmtQty = 0, total = 0, gtotal = 0, ltotal = 0, lgtotal = 0;
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                total = total + Number(salesDataArray[i].docTotal);
                gtotal = gtotal + Number(salesDataArray[i].totalQty);
            }
        }
        let salesDataArray1 = [];
        let listofData1 = CreditSale.find({ createdAt: { $gte: firstDay, $lte: lastDay }, subDistributor: { $in: usersList } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData1.length > 0) {
            for (let r = 0; r < listofData1.length; r++) {
                salesDataArray1.push(listofData1[r]);
            }
        }
        let orderRes1 = Order.find({
            deliveredDate: { $gte: firstDay, $lte: lastDay },
            status: "Delivered", subDistributor: { $in: usersList }
        }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes1.length > 0) {
            for (let r = 0; r < orderRes1.length; r++) {
                salesDataArray1.push(orderRes1[r]);
            }
        }
        if (salesDataArray1.length > 0) {
            for (let j = 0; j < salesDataArray1.length; j++) {
                ltotal = ltotal + Number(salesDataArray1[j].docTotal);
                lgtotal = lgtotal + Number(salesDataArray1[j].totalQty);
            }
        }
        return { total: total.toFixed(2), gtotal: gtotal.toFixed(2), ltotal: ltotal.toFixed(2), lgtotal: lgtotal.toFixed(2) };
    },
    'creditSale.saleLastMonthSd': (fromDate, toDate, id) => {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, sdUser: id }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData.length > 0) {
            for (let r = 0; r < listofData.length; r++) {
                salesDataArray.push(listofData[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", sdUser: id }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let crtValue = 0, crtQty = 0, lmtValue = 0, lmtQty = 0, total = 0, gtotal = 0, ltotal = 0, lgtotal = 0;
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                crtValue = crtValue + Number(salesDataArray[i].docTotal);
                crtQty = crtQty + Number(salesDataArray[i].totalQty);
                total = total + Number(crtValue);
                gtotal = gtotal + Number(crtQty);
            }
        }
        let salesDataArray1 = [];
        let listofData1 = CreditSale.find({ createdAt: { $gte: firstDay, $lte: lastDay }, sdUser: id }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData1.length > 0) {
            for (let r = 0; r < listofData1.length; r++) {
                salesDataArray1.push(listofData1[r]);
            }
        }
        let orderRes1 = Order.find({ deliveredDate: { $gte: firstDay, $lte: lastDay }, status: "Delivered", sdUser: id }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes1.length > 0) {
            for (let r = 0; r < orderRes1.length; r++) {
                salesDataArray1.push(orderRes1[r]);
            }
        }
        if (salesDataArray1.length > 0) {
            for (let i = 0; i < salesDataArray1.length; i++) {
                lmtValue = lmtValue + Number(salesDataArray1[i].docTotal);
                lmtQty = lmtQty + Number(salesDataArray1[i].totalQty);
                ltotal = ltotal + Number(lmtValue);
                lgtotal = lgtotal + Number(lmtQty);
            }
        }
        return { crtValue: crtValue.toFixed(2), crtQty: crtQty, lmtValue: lmtValue.toFixed(2), lmtQty: lmtQty, ltotal: ltotal.toFixed(2), lgtotal: lgtotal.toFixed(2), total: total.toFixed(2), gtotal: gtotal.toFixed(2) };
    },
    'creditSale.saleLastMonthSd1': (fromDate, toDate, sdName) => {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        let usersList = [];
        if (sdName !== null) {
            usersList.push(sdName);
        } else {
            let allu = allUsers.find({ userType: "SDUser", active: 'Y', subDistributor: Meteor.userId() }).fetch();
            for (i = 0; i < allu.length; i++) {
                usersList.push(allu[i]._id);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1); // date code
        let salesDataArray = [];
        let listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate }, sdUser: { $in: usersList } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData.length > 0) {
            for (let r = 0; r < listofData.length; r++) {
                salesDataArray.push(listofData[r]);
            }
        }
        let orderRes = Order.find({ deliveredDate: { $gte: fromDate, $lte: toDate }, status: "Delivered", sdUser: { $in: usersList } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (toDate !== null) toDate.setDate(toDate.getDate() - 1); // date code
        let crtValue = 0, crtQty = 0, lmtValue = 0, lmtQty = 0, total = 0, gtotal = 0, ltotal = 0, lgtotal = 0;
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                total = total + Number(salesDataArray[i].docTotal);
                gtotal = gtotal + Number(salesDataArray[i].totalQty);
            }
        }
        let salesDataArray1 = [];
        let listofData1 = CreditSale.find({ createdAt: { $gte: firstDay, $lte: lastDay }, sdUser: { $in: usersList } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData1.length > 0) {
            for (let r = 0; r < listofData1.length; r++) {
                salesDataArray1.push(listofData1[r]);
            }
        }
        let orderRes1 = Order.find({ deliveredDate: { $gte: firstDay, $lte: lastDay }, status: "Delivered", sdUser: { $in: usersList } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (orderRes1.length > 0) {
            for (let r = 0; r < orderRes1.length; r++) {
                salesDataArray1.push(orderRes1[r]);
            }
        }
        if (salesDataArray1.length > 0) {
            for (let i = 0; i < salesDataArray1.length; i++) {
                ltotal = ltotal + Number(salesDataArray1[i].docTotal);
                lgtotal = lgtotal + Number(salesDataArray1[i].totalQty);

            }
        }
        return { ltotal: ltotal.toFixed(2), lgtotal: lgtotal.toFixed(2), total: total.toFixed(2), gtotal: gtotal.toFixed(2) };
    },
    'creditSale.saleLastMonthSdUser': (fromDate, toDate, id) => {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        let listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        let crtValue = 0, crtQty = 0, lmtValue = 0, lmtQty = 0, total = 0, gtotal = 0, ltotal = 0, lgtotal = 0;
        if (listofData) {
            for (let i = 0; i < listofData.length; i++) {
                for (let j = 0; j < listofData[i].itemArray.length; j++) {
                    let prodData = listofData[i].itemArray[j];

                    if (prodData.product == id) {
                        crtValue = crtValue + Number(prodData.grossTotal);
                        crtQty = crtQty + Number(prodData.quantity);
                        total = total + Number(crtValue);
                        gtotal = gtotal + Number(crtQty);
                    }

                }

            }
        }
        let listofData1 = CreditSale.find({ createdAt: { $gte: firstDay, $lte: lastDay } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData1) {
            for (let i = 0; i < listofData1.length; i++) {
                for (let j = 0; j < listofData1[i].itemArray.length; j++) {
                    let prodData1 = listofData1[i].itemArray[j];

                    if (prodData1.product == id) {
                        lmtValue = lmtValue + Number(prodData1.grossTotal);
                        lmtQty = lmtQty + Number(prodData1.quantity);
                        ltotal = ltotal + Number(lmtValue);
                        lgtotal = lgtotal + Number(lmtQty);
                    }

                }

            }

        }

        return { crtValue: crtValue.toFixed(2), crtQty: crtQty.toFixed(2), lmtValue: lmtValue.toFixed(2), lmtQty: lmtQty.toFixed(2), ltotal: ltotal, lgtotal: lgtotal, total: total, gtotal: gtotal };
    },
    'creditSale.verticalwiseSaleDashboardMD': (fromDate, toDate) => {
        let creditSale, datAry = [];
        let total = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        let verticals = Verticals.find({}, { fields: { verticalName: 1 } }).fetch();
        for (let i = 0; i < verticals.length; i++) {
            let salesDataArray = [];
            creditSale = CreditSale.find({ vertical: verticals[i]._id, createdAt: { $gte: fromDateFor, $lt: toDateFor } },
                { fields: { docTotal: 1 } }).fetch();
            if (creditSale.length > 0) {
                for (let r = 0; r < creditSale.length; r++) {
                    salesDataArray.push(creditSale[r]);
                }
            }
            let orderRes = Order.find({
                vertical: verticals[i]._id,
                status: "Delivered", deliveredDate: { $gte: fromDateFor, $lt: toDateFor }
            },
                { fields: { docTotal: 1 } }).fetch();
            if (orderRes.length > 0) {
                for (let r = 0; r < orderRes.length; r++) {
                    salesDataArray.push(orderRes[r]);
                }
            }
            if (salesDataArray.length > 0) {
                total = 0;
                for (let j = 0; j < salesDataArray.length; j++) {
                    total += Number(salesDataArray[j].docTotal);

                }
                let obj = {
                    label: verticals[i].verticalName,
                    value: total.toFixed(2)
                }
                total = 0;
                datAry.push(obj);
            } else {
                total = 0;
                let obj = {
                    label: verticals[i].verticalName,
                    value: total.toFixed(2)
                }
                datAry.push(obj);
            }
        }
        return datAry;
    },
    'creditSale.subDwiseSaleDashBH': (vertical, fromDate, toDate) => {
        let creditSale = [];
        let lablAry = [];
        let valAry = [];
        let colorAry = [];
        let total = 0;
        let fromDateFor = new Date(fromDate);
        toDate = new Date(toDate);
        if (vertical.length > 0) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            let allUserData = allUsers.find({ userType: 'SD', active: 'Y', vertical: { $in: vertical } }, {
                fields: {
                    profile: 1
                }
            }).fetch();
            for (let z = 0; z < allUserData.length; z++) {
                let salesDataArray = [];
                creditSale = CreditSale.find({ subDistributor: allUserData[z]._id, createdAt: { $gte: fromDateFor, $lte: toDate } },
                    { fields: { docTotal: 1 } }).fetch();
                if (creditSale.length > 0) {
                    for (let r = 0; r < creditSale.length; r++) {
                        salesDataArray.push(creditSale[r]);
                    }
                }
                let orderRes = Order.find({
                    subDistributor: allUserData[z]._id,
                    status: "Delivered",
                    deliveredDate: { $gte: fromDateFor, $lte: toDate }
                },
                    { fields: { docTotal: 1 } }).fetch();

                if (orderRes.length > 0) {
                    for (let r = 0; r < orderRes.length; r++) {
                        salesDataArray.push(orderRes[r]);
                    }
                }

                if (salesDataArray.length > 0) {
                    total = 0;
                    for (let j = 0; j < salesDataArray.length; j++) {
                        total += Number(salesDataArray[j].docTotal);
                    }

                    lablAry.push(allUserData[z].profile.firstName);
                    valAry.push(total.toFixed(2));
                    colorAry.push(getRandomColor());

                    total = 0;

                } else {
                    total = 0;
                    lablAry.push(allUserData[z].profile.firstName);
                    valAry.push(total.toFixed(2));
                    colorAry.push(getRandomColor());
                }
            }

            let obj = {
                label: lablAry,
                value: valAry,
                colorCode: colorAry
            }
            return obj;
        }
    },
    'creditSale.subDwiseSaleDashMD': (fromDate, toDate) => {
        let creditSale = [];
        let lablAry = [];
        let valAry = [];
        let colorAry = [];
        let total = 0;
        let fromDateFor = new Date(fromDate);
        toDate = new Date(toDate);
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
        let allUserData = allUsers.find({ userType: 'SD', active: 'Y' }).fetch();
        for (let z = 0; z < allUserData.length; z++) {
            let dataSalesArray = [];
            creditSale = CreditSale.find({ subDistributor: allUserData[z]._id, createdAt: { $gte: fromDateFor, $lte: toDate } },
                { fields: { docTotal: 1 } }).fetch();

            if (creditSale.length > 0) {
                for (let r = 0; r < creditSale.length; r++) {
                    dataSalesArray.push(creditSale[r]);
                }
            }
            let orderRes = Order.find({
                subDistributor: allUserData[z]._id,
                status: "Delivered",
                deliveredDate: { $gte: fromDateFor, $lte: toDate }
            },
                { fields: { docTotal: 1 } }).fetch();
            if (orderRes.length > 0) {
                for (let r = 0; r < orderRes.length; r++) {
                    dataSalesArray.push(orderRes[r]);
                }
            }

            if (dataSalesArray.length > 0) {
                total = 0;
                for (let j = 0; j < dataSalesArray.length; j++) {
                    total += Number(dataSalesArray[j].docTotal);
                }

                lablAry.push(allUserData[z].profile.firstName);
                valAry.push(total.toFixed(2));
                colorAry.push(getRandomColor());

                total = 0;

            } else {
                total = 0;
                lablAry.push(allUserData[z].profile.firstName);
                valAry.push(total.toFixed(2));
                colorAry.push(getRandomColor());
            }
        }

        let obj = {
            label: lablAry,
            value: valAry,
            colorCode: colorAry
        }
        return obj;
    },

    'creditSale.reginWiseDashMD': (fromDate, toDate) => {
        let total = 0;
        let labelAry = [];
        let valAry = [];
        let colorAry = [];
        let sdArray = [];
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        let region = Branch.find({ active: 'Y' }, { fields: { branchName: 1 } }).fetch();
        for (let i = 0; i < region.length; i++) {
            let salesDataArray = [];
            total = 0;
            let sds = allUsers.find({ branch: region[i]._id, userType: 'SD', active: 'Y' }, { fields: { userType: 1 } }).fetch();
            if (sds.length > 0) {
                sdArray = [];
                for (let j = 0; j < sds.length; j++) {
                    sdArray.push(sds[j]._id);
                }
                let salesData = CreditSale.find({ subDistributor: { $in: sdArray }, createdAt: { $gte: fromDateFor, $lt: toDateFor } },
                    { fields: { docTotal: 1 } }).fetch();

                if (salesData.length > 0) {
                    for (let r = 0; r < salesData.length; r++) {
                        salesDataArray.push(salesData[r]);
                    }
                }
                let orderRes = Order.find({
                    subDistributor: { $in: sdArray },
                    status: "Delivered",
                    deliveredDate: { $gte: fromDateFor, $lt: toDateFor }
                },
                    { fields: { docTotal: 1 } }).fetch();
                if (orderRes.length > 0) {
                    for (let r = 0; r < orderRes.length; r++) {
                        salesDataArray.push(orderRes[r]);
                    }
                }
                total = 0;
                if (salesDataArray.length > 0) {
                    for (let z = 0; z < salesDataArray.length; z++) {
                        total += Number(salesDataArray[z].docTotal);
                    }
                    labelAry.push(region[i].branchName);
                    valAry.push(total.toFixed(2));
                    // colorAry.push(getRandomColor());
                } else {
                    labelAry.push(region[i].branchName);
                    valAry.push(total);
                    // colorAry.push(getRandomColor());
                }
            } else {
                labelAry.push(region[i].branchName);
                valAry.push(total);
                // colorAry.push(getRandomColor());
            }
        }
        let obj = {
            label: labelAry,
            value: valAry,
            color: '#FF006E'
        }

        return obj;
    },
    'creditSale.reginWiseDashBH': (vertical, fromDate, toDate) => {
        let total = 0;
        let labelAry = [];
        let valAry = [];
        let colorAry = [];
        let sdArray = [];
        let fromDateFor = new Date(fromDate);
        toDate = new Date(toDate);
        if (vertical.length > 0) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            let region = Branch.find({ active: 'Y' }, { fields: { branchName: 1 } }).fetch();
            for (let i = 0; i < region.length; i++) {
                let salesDataArray = [];
                total = 0;
                let sds = allUsers.find({ branch: region[i]._id, userType: 'SD', active: 'Y', vertical: { $in: vertical } }, { fields: { userType: 1 } }).fetch();
                if (sds.length > 0) {
                    sdArray = [];
                    for (let j = 0; j < sds.length; j++) {
                        sdArray.push(sds[j]._id);
                    }

                    let salesData = CreditSale.find({ subDistributor: { $in: sdArray }, createdAt: { $gte: fromDateFor, $lte: toDate } },
                        { fields: { docTotal: 1 } }).fetch();
                    total = 0;
                    if (salesData.length > 0) {
                        for (let r = 0; r < salesData.length; r++) {
                            salesDataArray.push(salesData[r]);
                        }
                    }
                    let orderData = Order.find({
                        subDistributor: { $in: sdArray },
                        status: "Delivered", deliveredDate: { $gte: fromDateFor, $lte: toDate }
                    },
                        { fields: { docTotal: 1 } }).fetch();
                    total = 0;
                    if (orderData.length > 0) {
                        for (let r = 0; r < orderData.length; r++) {
                            salesDataArray.push(orderData[r]);
                        }
                    }
                    if (salesDataArray.length > 0) {
                        for (let z = 0; z < salesDataArray.length; z++) {
                            total += Number(salesDataArray[z].docTotal);
                        }
                        labelAry.push(region[i].branchName);
                        valAry.push(total.toFixed(2));
                    } else {
                        labelAry.push(region[i].branchName);
                        valAry.push(total);
                    }
                } else {
                    labelAry.push(region[i].branchName);
                    valAry.push(total);
                }
            }
            let obj = {
                label: labelAry,
                value: valAry,
                color: '#FF006E'
            }

            return obj;
        }
    },
    'creditSale.currentMontOutstanding': (id, fromDate, toDate) => {
        let sd = [];
        let qty = 0;
        let allUserData = allUsers.find({ userType: 'SD', active: 'Y', vertical: { $in: id } }, { fields: { username: 1 } }).fetch();
        let fromDateFor = new Date(fromDate);
        toDate = new Date(toDate);
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);

        if (allUserData) {
            for (let i = 0; i < allUserData.length; i++) {
                sd.push(allUserData[i]._id);
            }
        }
        let salesDataArray = [];
        let creditSale = CreditSale.find({ subDistributor: { $in: sd }, createdAt: { $gte: fromDateFor, $lte: toDate } },
            { fields: { docTotal: 1 } }).fetch();

        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r])
            }
        }

        let orderRes = Order.find({
            subDistributor: { $in: sd },
            status: "Delivered",
            deliveredDate: { $gte: fromDateFor, $lte: toDate }
        },
            { fields: { docTotal: 1 } }).fetch();

        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r])
            }
        }


        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                qty += Number(salesDataArray[i].docTotal);
            }
        }
        return qty.toFixed(2);
    },
    'creditSales.cashCount': (id, fromDate, toDate) => {
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        toDate.setDate(toDate.getDate() + 1);
        return CreditSale.find({ salesType: 'Cash', subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }).count();
    },
    'creditSales.creditCount': (id, fromDate, toDate) => {
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        toDate.setDate(toDate.getDate() + 1);
        return CreditSale.find({ salesType: 'Credit', subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }).count();
    },
    'creditSales.currentOutstanding': (id, fromDate, toDate) => {
        let total = 0;
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        toDate.setDate(toDate.getDate() + 1);
        let salesDataArray = [];
        let credits = CreditSale.find({ subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } },
            { fields: { docTotal: 1 } }).fetch();
        if (credits.length > 0) {
            for (let r = 0; r < credits.length; r++) {
                salesDataArray.push(credits[r]);
            }
        }
        let orderRes = Order.find({
            subDistributor: id,
            status: "Delivered",
            deliveredDate: { $gte: fromDate, $lte: toDate }
        },
            { fields: { docTotal: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                total += Number(salesDataArray[i].docTotal);
            }
        }
        return total;
    },
    'creditSale.approvedCurrent': (id, fromDate, toDate) => {
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        return CreditSale.find({ salesType: 'Credit', status: 'Approved', subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }).count();
    },

    'creditSales.creditList': (sdUser, vertical, outlet, fromDate, toDates, sd) => {
        toDates.setDate(toDates.getDate() + 1);
        let data = CreditSale.find({ salesType: 'Cash', vertical: vertical, subDistributor: sd, sdUser: sdUser, createdAt: { $gte: fromDate, $lte: toDates } }).fetch();
        return data;
    },
    'creditSales.creditSaleList': (sdUser, vertical, outlet, fromDate, toDates, sd) => {
        let data = '';
        if (outlet !== null) {
            data = CreditSale.find({ salesType: 'Credit', vertical: vertical, outlet: outlet, subDistributor: sd, sdUser: sdUser, createdAt: { $gte: fromDate, $lte: toDates } }).fetch();
        } else {
            data = CreditSale.find({ salesType: 'Credit', vertical: vertical, subDistributor: sd, sdUser: sdUser, createdAt: { $gte: fromDate, $lte: toDates } }).fetch();
        }

        return data;
    },

    'creditSale.gTotalSalesBDM': (sd, verticals, fromDate, toDate) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        if (sd !== null) {
            sdListArray.push(sd);
        } else {
            let sdList = allUsers.find({ userType: "SD", active: "Y", vertical: { $in: verticals } }, { fields: { profile: 1 } }).fetch();
            for (u = 0; u < sdList.length; u++) {
                sdListArray.push(sdList[u]._id);
            }
        }
        let salesDataArray = [];
        creditSale = CreditSale.find({ subDistributor: { $in: sdListArray }, createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { itemArray: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }
        let orderRes = Order.find({
            subDistributor: { $in: sdListArray },
            status: "Delivered",
            deliveredDate: { $gte: fromDateFor, $lt: toDateFor }
        },
            { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                let iteAry = salesDataArray[i].itemArray;
                for (let j = 0; j < iteAry.length; j++) {
                    qty += Number(iteAry[j].quantity * iteAry[j].unitQuantity);
                }
            }
        }
        return qty;
    },
    'creditSale.gTotalAmountBDM': (sd, verticals, fromDate, toDate) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        if (sd !== null) {
            sdListArray.push(sd);
        } else {
            let sdList = allUsers.find({ userType: "SD", active: "Y", vertical: { $in: verticals } }, { fields: { profile: 1 } }).fetch();
            for (u = 0; u < sdList.length; u++) {
                sdListArray.push(sdList[u]._id);
            }
        }

        let salesDataArray = [];
        creditSale = CreditSale.find({
            subDistributor: { $in: sdListArray },
            createdAt: { $gte: fromDateFor, $lt: toDateFor }
        },
            { fields: { docTotal: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let r = 0; r < creditSale.length; r++) {
                salesDataArray.push(creditSale[r]);
            }
        }

        let orderRes = Order.find({
            subDistributor: { $in: sdListArray },
            status: "Delivered",
            deliveredDate: { $gte: fromDateFor, $lt: toDateFor }
        },
            { fields: { docTotal: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                qty += Number(salesDataArray[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.docTotalSum': (sd, sdUser, fromDate, toDate, outletData, vertical) => {
        let docTotalSum = 0;
        let orderData = [];
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
        if (outletData !== null && sdUser === null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData !== null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData === null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        }
        if (orderData) {
            for (let j = 0; j < orderData.length; j++) {
                docTotalSum += Number(orderData[j].docTotal);
            }
        }
        return docTotalSum.toFixed(2);
    },
    'creditSale.taxAmountSum': (sd, sdUser, outletData, fromDate, toDate, vertical) => {
        let docTotalSum = 0, orderData = [];
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
        // if(sdUser && outlet===null && fromDate && toDate){
        //         orderData = CreditSale.find({
        //             subDistributor: sd, 
        //             salesType: "Cash", 
        //             sdUser: sdUser ,
        //             createdAt: { $gte: fromDate, $lt: toDate }
        //         }, 
        //         { fields: { taxAmount: 1 } }).fetch();
        // }else if(sdUser===null && outlet && fromDate && toDate){
        //         orderData = CreditSale.find({
        //             subDistributor: sd, 
        //             salesType: "Cash", 
        //             createdAt: { $gte: fromDate, $lt: toDate },
        //             outlet:outlet
        //         }, 
        //         { fields: { taxAmount: 1 } }).fetch();
        // }else if(sdUser && outlet && fromDate && toDate){
        //          orderData = CreditSale.find({
        //             subDistributor: sd, 
        //             salesType: "Cash", 
        //             sdUser: sdUser ,
        //             createdAt: { $gte: fromDate, $lt: toDate },
        //             outlet:outlet
        //         }, 
        //         { fields: { taxAmount: 1 } }).fetch();
        // }else if(sdUser===null && outlet===null && fromDate && toDate){
        //         orderData = CreditSale.find({
        //             subDistributor: sd, 
        //             salesType: "Cash", 
        //             createdAt: { $gte: fromDate, $lt: toDate },
        //         }, 
        //         { fields: { taxAmount: 1 } }).fetch();
        // }else{
        //     orderData = CreditSale.find({
        //             subDistributor: sd, 
        //             salesType: "Cash", 
        //         }, 
        //         { fields: { taxAmount: 1 } }).fetch();
        // }
        if (outletData !== null && sdUser === null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData !== null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData === null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Cash", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Cash", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        }



        if (orderData) {
            for (let j = 0; j < orderData.length; j++) {
                docTotalSum += Number(orderData[j].taxAmount);
            }
        }

        return docTotalSum.toFixed(2);
    },
    'creditSale.docTotalCreditSum': (sd, sdUser, outletData, fromDate, toDate, vertical) => {
        let docTotalSum = 0;
        let orderData = [];
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
        // if (outletData !== null && sdUser === null) {
        //     orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // } else if (outletData === null && sdUser !== null) {
        //     orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // } else if (outletData !== null && sdUser !== null) {
        //     orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // } else {
        //     orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // }


        if (outletData !== null && sdUser === null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData !== null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData === null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        }

        if (orderData) {
            for (let j = 0; j < orderData.length; j++) {
                docTotalSum += Number(orderData[j].docTotal);
            }
        }
        return docTotalSum.toFixed(2);
    },
    'creditSale.taxAmountCreditSum': (sd, sdUser, outletData, fromDate, toDate, vertical) => {
        let docTotalSum = 0, orderData = '';
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
        // if (outletData !== null && sdUser === null) {
        //     orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // } else if (outletData === null && sdUser !== null) {
        //     orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // } else if (outletData !== null && sdUser !== null) {
        //     orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // } else {
        //     orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        // }
        if (outletData !== null && sdUser === null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData === null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical === null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        } else if (outletData !== null && sdUser === null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData === null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else if (outletData !== null && sdUser !== null && vertical !== null) {
            orderData = CreditSale.find({ subDistributor: sd, outlet: outletData, salesType: "Credit", sdUser: sdUser, createdAt: { $gte: fromDate, $lt: toDate }, vertical: vertical }).fetch();
        } else {
            orderData = CreditSale.find({ subDistributor: sd, salesType: "Credit", createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
        }

        if (orderData) {
            for (let j = 0; j < orderData.length; j++) {
                docTotalSum += Number(orderData[j].taxAmount);
            }
        }
        return docTotalSum.toFixed(2);
    },

    'creditSale.creditSoldBdmTotal': (fromDate, toDate, vertical, sdName) => {
        let creditSale = [], sdListArray = [];
        let qty = 0;
        let sdList = '';
        if (sdName !== null) {
            sdList = allUsers.find({ _id: sdName, userType: 'SD', vertical: vertical[0], active: 'Y' }, { fields: { profile: 1 } }).fetch();
        } else {
            sdList = allUsers.find({ userType: 'SD', vertical: vertical[0], active: 'Y' }, { fields: { profile: 1 } }).fetch();
        }

        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ subDistributor: { $in: sdListArray }, salesType: 'Credit', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.cashSoldBdmTotal': (fromDate, toDate, vertical, sdName) => {
        let creditSale = [], sdListArray = [];
        let sdList = '';
        let qty = 0;

        if (sdName !== null) {
            sdList = allUsers.find({ _id: sdName, userType: 'SD', vertical: vertical[0], active: 'Y' }, { fields: { profile: 1 } }).fetch();
        } else {
            sdList = allUsers.find({ userType: 'SD', vertical: vertical[0], active: 'Y' }, { fields: { profile: 1 } }).fetch();
        }
        for (let i = 0; i < sdList.length; i++) {
            sdListArray.push(sdList[i]._id);
        }
        let fromDateFor = new Date(fromDate);
        let toDateFor = new Date(toDate);
        toDateFor.setDate(toDateFor.getDate() + 1);
        creditSale = CreditSale.find({ subDistributor: { $in: sdListArray }, salesType: 'Cash', createdAt: { $gte: fromDateFor, $lt: toDateFor } },
            { fields: { docTotal: 1 } }).fetch();
        if (creditSale.length > 0) {
            for (let i = 0; i < creditSale.length; i++) {
                qty += Number(creditSale[i].docTotal);
            }
        }
        return qty;
    },
    'creditSale.lastMonthSaleQtyTotal': (productName, fromDate, toDate) => {
        let date = new Date();
        let productList = '';
        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        if (productName !== null) {
            productList = StockTransferIssued.find({ sdUser: Meteor.userId(), product: productName }).fetch();
        } else {
            productList = StockTransferIssued.find({ sdUser: Meteor.userId() }).fetch();
        }
        listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        let crtQty = 0, lmtQty = 0;
        if (listofData) {
            for (let i = 0; i < listofData.length; i++) {
                for (let j = 0; j < listofData[i].itemArray.length; j++) {
                    let prodData = listofData[i].itemArray[j];
                    for (let p = 0; p < productList.length; p++) {
                        if (prodData.product == productList[p].product) {
                            crtQty = crtQty + Number(prodData.quantity);
                        }
                    }
                }
            }
        }
        listofData1 = CreditSale.find({ createdAt: { $gte: firstDay, $lte: lastDay } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData1) {
            for (let i = 0; i < listofData1.length; i++) {
                for (let j = 0; j < listofData1[i].itemArray.length; j++) {
                    let prodData1 = listofData1[i].itemArray[j];
                    for (let q = 0; q < productList.length; q++) {
                        if (prodData1.product == productList[q].product) {
                            lmtQty = lmtQty + Number(prodData1.quantity);
                        }
                    }
                }
            }
        }
        return { crtQty: crtQty.toFixed(2), lmtQty: lmtQty.toFixed(2) };
    },
    'creditSale.lastMonthSaleValueTotal': (productName, fromDate, toDate) => {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        // let productList = StockTransferIssued.find({ sdUser: Meteor.userId() }).fetch();
        let productList = '';
        if (productName !== null) {
            productList = StockTransferIssued.find({ sdUser: Meteor.userId(), product: productName }).fetch();
        } else {
            productList = StockTransferIssued.find({ sdUser: Meteor.userId() }).fetch();
        }
        listofData = CreditSale.find({ createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        let crtValue = 0, lmtValue = 0;
        if (listofData) {
            for (let i = 0; i < listofData.length; i++) {
                for (let j = 0; j < listofData[i].itemArray.length; j++) {
                    let prodData = listofData[i].itemArray[j];
                    for (let p = 0; p < productList.length; p++) {
                        if (prodData.product == productList[p].product) {
                            crtValue = crtValue + Number(prodData.grossTotal);
                        }
                    }
                }
            }
        }
        listofData1 = CreditSale.find({ createdAt: { $gte: firstDay, $lte: lastDay } }, { fields: { itemArray: 1, docTotal: 1, totalQty: 1 } }).fetch();
        if (listofData1) {
            for (let i = 0; i < listofData1.length; i++) {
                for (let j = 0; j < listofData1[i].itemArray.length; j++) {
                    let prodData1 = listofData1[i].itemArray[j];
                    for (let q = 0; q < productList.length; q++) {
                        if (prodData1.product == productList[q].product) {
                            lmtValue = lmtValue + Number(prodData1.grossTotal);
                        }
                    }
                }
            }
        }
        return { crtValue: crtValue.toFixed(2), lmtValue: lmtValue.toFixed(2) };
    },
    /**
     * get credit sales data for export
     */
    'creditSales.exportSalesDump': (sd, outlet, fromDate, toDate, vertical) => {
        let dataArray = [];
        if (sd && outlet === '') {
            dataArray = [];
            let salesRes = CreditSale.find({
                subDistributor: sd,
                vertical: { $in: vertical },
                createdAt: { $gte: fromDate, $lte: toDate }
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();

            if (salesRes.length > 0) {
                for (let i = 0; i < salesRes.length; i++) {
                    dataArray.push(salesRes[i]);
                }
            }
            let orderRes = Order.find({
                status: "Delivered", vertical: { $in: vertical },
                deliveredDate: {
                    $gte: fromDate,
                    $lt: toDate
                },
                subDistributor: sd,
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();
            if (orderRes.length > 0) {
                for (let i = 0; i < orderRes.length; i++) {
                    dataArray.push(orderRes[i]);
                }
            }
        }
        else if (sd === '' && outlet) {
            dataArray = [];
            let salesRes = CreditSale.find({
                outlet: outlet,
                vertical: { $in: vertical },
                createdAt: { $gte: fromDate, $lte: toDate }
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();
            if (salesRes.length > 0) {
                for (let i = 0; i < salesRes.length; i++) {
                    dataArray.push(salesRes[i]);
                }
            }
            let orderRes = Order.find({
                status: "Delivered", vertical: { $in: vertical },
                deliveredDate: {
                    $gte: fromDate,
                    $lt: toDate
                },
                outlet: outlet,
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();
            if (orderRes.length > 0) {
                for (let i = 0; i < orderRes.length; i++) {
                    dataArray.push(orderRes[i]);
                }
            }
        }
        else if (sd && outlet) {
            dataArray = [];
            let salesRes = CreditSale.find({
                outlet: outlet,
                vertical: { $in: vertical },
                subDistributor: sd,
                createdAt: { $gte: fromDate, $lte: toDate }
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();
            if (salesRes.length > 0) {
                for (let i = 0; i < salesRes.length; i++) {
                    dataArray.push(salesRes[i]);
                }
            }
            let orderRes = Order.find({
                status: "Delivered", vertical: { $in: vertical },
                deliveredDate: {
                    $gte: fromDate,
                    $lt: toDate
                },
                outlet: outlet,
                subDistributor: sd,
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();
            if (orderRes.length > 0) {
                for (let i = 0; i < orderRes.length; i++) {
                    dataArray.push(orderRes[i]);
                }
            }
        }
        else if (sd === '' && outlet === '') {
            dataArray = [];
            let salesRes = CreditSale.find({
                vertical: { $in: vertical },
                createdAt: { $gte: fromDate, $lte: toDate }
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();
            if (salesRes.length > 0) {
                for (let i = 0; i < salesRes.length; i++) {
                    dataArray.push(salesRes[i]);
                }
            }
            let orderRes = Order.find({
                status: "Delivered", vertical: { $in: vertical },
                deliveredDate: {
                    $gte: fromDate,
                    $lt: toDate
                },
            }, {
                fields: {
                    sdUser: 1,
                    vertical: 1,
                    subDistributor: 1,
                    routeId: 1,
                    salesType: 1,
                    walkInCustomer: 1,
                    outlet: 1,
                    docDate: 1,
                    docTotal: 1,
                    taxAmount: 1,
                    createdAt: 1,
                    itemArray: 1,
                }
            }).fetch();
            if (orderRes.length > 0) {
                for (let i = 0; i < orderRes.length; i++) {
                    dataArray.push(orderRes[i]);
                }
            }
        }
        return dataArray;
    },
    /**
     * get route details based on id
     */
    'outlets.idDataVal': (id) => {
        return Outlets.findOne({ _id: id }, { fields: { routeId: 1 } });
    },
    //changed vertical md
    'creditSales.saleByvolume': (vertical, productId, fromDate, toDate) => {
        toDate.setDate(toDate.getDate() + 1);
        let count = 0, ctnToPcs = 0, packToPcs = 0, pcs = 0, revfPcs = 0, finalPcs = 0, totPcs = 0, ctn = 1;
        let ctnCount = 0, tctn = 0, npcs = 0, pnalance = 0, tableCtn = 0; tablePC = 0;
        let salesDataArray = [];
        let creditList = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (creditList.length > 0) {
            for (let r = 0; r < creditList.length; r++) {
                salesDataArray.push(creditList[r]);
            }
        }
        let orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        ctn = getCtn(productId);// find ctn of product
        if (salesDataArray.length > 0) {
            for (i = 0; i < salesDataArray.length; i++) {
                for (j = 0; j < salesDataArray[i].itemArray.length; j++) {
                    let prodAry = salesDataArray[i].itemArray[j];
                    if (productId == prodAry.product) {
                        count++;
                        // convert Ctn, Pack to pcs
                        // ctnToPcs = + getctnToPcs(prodAry, ctn);
                        // packToPcs = + getpackToPcs(prodAry);
                        // pcs = + getpcs(prodAry);
                        ctnToPcs += getctnToPcs(prodAry, ctn);
                        packToPcs += getpackToPcs(prodAry);
                        pcs += getpcs(prodAry);
                    }
                    totPcs = +ctnToPcs + packToPcs + pcs;
                }
            }
        }
        if (count > 0) {
            ctnCount = totPcs / ctn;
            if (ctnCount < 1) {
                tctn = 0;
                pnalance = totPcs;
            } else {
                tctn = Math.floor(ctnCount);
                npcs = ctn * tctn;
                pnalance = totPcs - npcs;
            }
            tableCtn += tctn;
            tablePC += pnalance;
        }
        // totPcs = Number(ctnToPcs) + Number(packToPcs) + Number(pcs);//find total pcs
        // tCtn = Math.round((totPcs / ctn), 0);//pices to ctn
        // revfPcs = Number(tCtn) * Number(ctn);

        // if (totPcs > revfPcs)
        //     finalPcs = totPcs - revfPcs;
        // else
        //     finalPcs = (totPcs - revfPcs) * -1;
        // if (isNaN(tCtn)) tCtn = 0;
        // if (isNaN(finalPcs)) finalPcs = 0;
        return { tCtn: tableCtn, finalPcs: tablePC }
    },
    'creditSales.saleByvolumeTotal1': (vertical, fromDate, toDate, product) => {
        if (vertical) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            let productArray = [], tableCtn = 0, tablePC = 0;
            let salesDataArray = [];
            let creditList = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            if (creditList.length > 0) {
                for (let r = 0; r < creditList.length; r++) {
                    salesDataArray.push(creditList[r]);
                }
            }
            let orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            if (orderRes.length > 0) {
                for (let r = 0; r < orderRes.length; r++) {
                    salesDataArray.push(orderRes[r]);
                }
            }
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let j = 0; j < salesDataArray[i].itemArray.length; j++) {
                        let prod = salesDataArray[i].itemArray[j];
                        let productObj = {
                            product: prod.product,
                            unit: prod.unit,
                            quantity: prod.quantity
                        }
                        productArray.push(productObj);
                    }
                }
            }
            let productList = [];
            if (product != null) {
                productList = Product.find({ _id: product, vertical: vertical }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
            } else {
                productList = Product.find({ vertical: vertical }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
            }

            for (i = 0; i < productList.length; i++) {
                let packToPcs = 0; let pcs = 0; let ctnToPcs = 0; let ctn = 1; let count = 0;
                let ctnCount = 0, tctn = 0, npcs = 0, pnalance = 0;
                for (j = 0; j < productArray.length; j++) {
                    let prodAry = productArray[j];
                    if (productList[i]._id == prodAry.product) {
                        ctn = getCtn(prodAry.product); //find ctn of product prodAry.product
                        count++;
                        //convert ctn,pack to pcs
                        ctnToPcs += getctnToPcs(prodAry, ctn);
                        packToPcs += getpackToPcs(prodAry);
                        pcs += getpcs(prodAry);
                    }
                    totPcs = +ctnToPcs + packToPcs + pcs;

                }
                if (count > 0) {
                    ctnCount = totPcs / ctn;
                    if (ctnCount < 1) {
                        tctn = 0;
                        pnalance = totPcs;
                    } else {
                        tctn = Math.floor(ctnCount);
                        npcs = ctn * tctn;
                        pnalance = totPcs - npcs;
                    }
                    tableCtn += tctn;
                    tablePC += pnalance;
                }
            }
            return { tCtn: tableCtn, finalPcs: tablePC }
        }

    },
    //changed vertical md
    'creditSales.salesByValueId': (vertical, productId, fromDate, toDate) => {
        let pArray = ''; let grossTotal = 0;
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
        let salesDataArray = [];
        let credit = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (credit.length > 0) {
            for (let r = 0; r < credit.length; r++) {
                salesDataArray.push(credit[r]);
            }
        }
        let orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let r = 0; r < orderRes.length; r++) {
                salesDataArray.push(orderRes[r]);
            }
        }
        if (salesDataArray.length > 0) {
            for (let i = 0; i < salesDataArray.length; i++) {
                for (let j = 0; j < salesDataArray[i].itemArray.length; j++) {
                    pArray = salesDataArray[i].itemArray[j];
                    if (pArray.product == productId) {
                        //calculation 
                        grossTotal += Number(pArray.grossTotal);
                        //calculation 
                    }
                }
            }
        }
        return grossTotal.toFixed(2);
    },
    //changed vertical md
    'creditSales.saleByvolumeTotal': (vertical, fromDate, toDate) => {
        if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
        let credit = CreditSale.find({ vertical: vertical, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();

        let productArray = [];
        let productArray1 = [];
        let productList = '';
        productList = Product.find({ vertical: vertical }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();

        for (let i = 0; i < credit.length; i++) {
            for (let j = 0; j < credit[i].itemArray.length; j++) {
                let prod = credit[i].itemArray[j];
                let productObj = {
                    productId: prod.product,
                    productUnit: prod.unit,
                    unit: prod.unit,
                    unitQuantity: prod.unitQuantity,
                    unitPrice: prod.unitPrice,
                    price: prod.price,
                    salesPrice: prod.salesPrice,
                    withOutTax: prod.withOutTax,
                    grossTotal: prod.grossTotal,
                    product: prod.product,
                    quantity: prod.quantity,
                    taxPerc: prod.taxPerc,
                    taxRate: prod.taxRate,
                    taxtAmount: prod.taxtAmount,
                    transferStockVal: prod.transferStockVal,
                }
                productArray.push(productObj);
            }

        }
        let productObj1 = {}; let tableTotal = 0; let tablePC = 0; let tableCtn = 0;
        for (let u = 0; u < productList.length; u++) {
            let count = 0; let ctnCount = 1; let packToPcs = 0; let pcs = 0; let ctnLast = 0;
            let pcsCount = 1; let pcsTotal = 0; let ctnToPcs = 0; let grossTotal = 0;
            productId = productList[u]._id;
            for (let k = 0; k < productArray.length; k++) {
                if (productList[u]._id == productArray[k].productId) {
                    count = count + 1;
                    tableTotal = tableTotal + Number(productArray[k].grossTotal);
                    grossTotal = grossTotal + Number(productArray[k].grossTotal);

                    let ctn = Unit.findOne({ product: productArray[k].productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (ctn) {
                        ctnCount = ctn.baseQuantity;
                    }
                    let unitl = Unit.findOne({ product: productArray[k].productId, _id: productArray[k].unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
                    if (unitl) {
                        if (unitl.unitName == 'CTN') {
                            ctnToPcs = ctnToPcs + (productArray[k].quantity * ctnCount);
                        }
                        if (unitl.unitName == 'PAC') {
                            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(productArray[k].quantity));
                        }
                        if (unitl.unitName == 'PCS') {
                            pcs = pcs + Number(productArray[k].quantity);
                        }
                    }
                }

            }
            if (count != 0) {
                // if (pcs != 0) {
                //     pcsTotal = pcsTotal + pcs;
                // }
                // if (packToPcs != 0) {
                //     pcsTotal = pcsTotal + packToPcs;
                // }
                // let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                // let pcsToCTN = totalPcs / ctnCount;//19.16
                // let roundCtn = Math.round(pcsToCTN, 0);
                // let findPcsCount = roundCtn * ctnCount;
                // let findPcs = 0;
                // if (totalPcs > findPcsCount) {
                //     findPcs = totalPcs - findPcsCount;
                // } else {
                //     findPcs = (totalPcs - findPcsCount) * -1;
                // }
                pcsTotal = pcsTotal + pcs;
                pcsTotal = pcsTotal + packToPcs;
                let totalPcs = (Number(ctnToPcs) + Number(pcsTotal));
                let pcsToCTN = totalPcs / ctnCount;
                let roundCtn = + Math.round(pcsToCTN, 0);
                let findPcsCount = roundCtn * ctnCount;

                if (totalPcs > findPcsCount) {
                    findPcs = + totalPcs - findPcsCount;
                } else {
                    findPcs = + (totalPcs - findPcsCount) * -1;
                }

                tablePC = tablePC + findPcs;
                tableCtn = tableCtn + roundCtn;
                productObj1 = {
                    productId: productId,
                    fromDate: fromDate,
                    toDate: toDate,
                    ctnTotal: roundCtn,
                    pcsBalance: findPcs,
                    sale_by_val: grossTotal
                }
                productArray1.push(productObj1);
            }

        }
        return { tablePC, tableCtn };
    },
    // 'creditSales.salesByValueTotal': (vertical, fromDate, toDate, product) => {
    //     if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
    //     let salesDataArray = [];
    //     let grossTotal = 0;
    //     if (vertical && vertical.length > 0) {
    //         let credit = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
    //         if (credit.length > 0) {
    //             for (let r = 0; r < credit.length; r++) {
    //                 salesDataArray.push(credit[r]);
    //             }
    //         }
    //         let orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
    //         if (orderRes.length > 0) {
    //             for (let r = 0; r < orderRes.length; r++) {
    //                 salesDataArray.push(orderRes[r]);
    //             }
    //         }
    //         let productArray = [];
    //         let productArray1 = [];
    //         let productList = '';
    //         if(product!=null){
    //              productList = Product.find({ _id:product, vertical: { $in: vertical } }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
    //         }else{
    //             productList = Product.find({ vertical: { $in: vertical } }, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
    //         }

    //         if (salesDataArray.length > 0) {
    //             for (let i = 0; i < salesDataArray.length; i++) {
    //                 for (let j = 0; j < salesDataArray[i].itemArray.length; j++) {
    //                     let prod = salesDataArray[i].itemArray[j];
    //                     let productObj = {
    //                         productId: prod.product,
    //                         grossTotal: prod.grossTotal,
    //                     }
    //                     productArray.push(productObj);
    //                 }
    //             }
    //         }
    //         for (let u = 0; u < productList.length; u++) {
    //             for (let k = 0; k < productArray.length; k++) {
    //                 if (productList[u]._id == productArray[k].productId) {
    //                     grossTotal = grossTotal + Number(productArray[k].grossTotal);
    //                 }

    //             }
    //         }
    //     }
    //     return grossTotal.toFixed(2);
    // },
    'creditSales.salesByValueTotal': (vertical, fromDate, toDate, product) => {
        if (vertical) {
            if (toDate !== null) toDate.setDate(toDate.getDate() + 1);
            let productArray = [], tableCtn = 0, tablePC = 0, grossTotal = 0;
            let salesDataArray = [];
            let creditList = CreditSale.find({ vertical: { $in: vertical }, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            if (creditList.length > 0) {
                for (let r = 0; r < creditList.length; r++) {
                    salesDataArray.push(creditList[r]);
                }
            }
            let orderRes = Order.find({ vertical: { $in: vertical }, status: "Delivered", deliveredDate: { $gte: fromDate, $lte: toDate } }, { fields: { itemArray: 1 } }).fetch();
            if (orderRes.length > 0) {
                for (let r = 0; r < orderRes.length; r++) {
                    salesDataArray.push(orderRes[r]);
                }
            }
            if (salesDataArray.length > 0) {
                for (let i = 0; i < salesDataArray.length; i++) {
                    for (let j = 0; j < salesDataArray[i].itemArray.length; j++) {
                        let prod = salesDataArray[i].itemArray[j];
                        let productObj = {
                            product: prod.product,
                            unit: prod.unit,
                            quantity: prod.quantity,
                            grossTotal: prod.grossTotal,
                        }
                        productArray.push(productObj);
                    }
                }
            }
            let productList = [];
            if (product != null) {
                productList = Product.find({ _id: product, vertical: { $in: vertical } }, { fields: { _id: 1 } }).fetch();
            } else {
                productList = Product.find({ vertical: { $in: vertical } }, { fields: { _id: 1 } }).fetch();
            }
            if (productList.length > 0) {
                for (i = 0; i < productList.length; i++) {
                    for (j = 0; j < productArray.length; j++) {
                        let prodAry = productArray[j];
                        if (productList[i]._id == prodAry.product) {
                            grossTotal = grossTotal + Number(prodAry.grossTotal);
                        }
                    }
                }
            }
            return grossTotal.toFixed(2);
        }

    },
    /**
     * sales dump data (both delivered order and sales)
     */
    'creditSales.salesDumpData': (vertical, fromDate, toDate) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            vertical: { $in: vertical },
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
        },
            { sort: { createdAt: -1 }, limit: 25 }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();

        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }
        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
        }, { sort: { createdAt: -1 }, limit: 25 }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },

    /**
      * sales dump data outlet filter
      */
    'creditSales.salesDumpOutletFilter': (vertical, outlet, fromDate, toDate) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            vertical: { $in: vertical },
            outlet: outlet,
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();

        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }

        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            outlet: outlet,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                deliveredDate: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },

    /**
   * sales dump data subd filter
   */
    'creditSales.salesDumpvanEmpFilter': (vertical, subDistributor, fromDate, toDate) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            vertical: { $in: vertical },
            subDistributor: subDistributor,
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();

        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }

        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            subDistributor: subDistributor,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                deliveredDate: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },

    /**
 * sales dump data subd and outlet filter
 */
    'creditSales.salesDumpvanEmpOutletFilter': (vertical, outlet, subDistributor, fromDate, toDate) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            vertical: { $in: vertical },
            subDistributor: subDistributor,
            outlet: outlet,
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();

        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }

        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            subDistributor: subDistributor,
            outlet: outlet,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },

    /**
 * sales dump data date wise filter
 */
    'creditSales.salesDumpDateOnlyFilter': (vertical, fromDate, toDate) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            vertical: { $in: vertical },
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }
        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },

    /**
* sales dump data date and outlet wise filter
*/
    'creditSales.salesDumpDateOutletFilter': (vertical, outlet, fromDate, toDate) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            vertical: { $in: vertical },
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
            outlet: outlet,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }
        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            outlet: outlet
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },
    /**
* sales dump data date and outlet wise filter
*/
    'creditSales.salesDumpDateSubDFilter': (vertical, subDistributor, fromDate, toDate) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            vertical: { $in: vertical },
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
            subDistributor: subDistributor,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }
        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            subDistributor: subDistributor
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },
    'creditSale.SaleIdList': (sdUser) => {
        let salesRes1 = CreditSale.find({ createdBy: sdUser }, { fields: { docNum: 1 } }).fetch();
        if (salesRes1) {
            return salesRes1;
        }
    },
    'creditSales.salesDumpRouteDateFilter': (vertical, fromDate, toDate, routeId) => {// sale dump route and date filter
        let dataArray = [];
        let salesRes = CreditSale.find({
            routeId: routeId,
            vertical: { $in: vertical },
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }
        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },
    'creditSales.salesDumpDateOutletRouteFilter': (vertical, outlet, fromDate, toDate, routeId) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            routeId: routeId,
            vertical: { $in: vertical },
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
            outlet: outlet,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }
        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            outlet: outlet
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },
    'creditSales.salesDumpDateSubDRouteFilter': (vertical, subDistributor, fromDate, toDate, routeCodeVal) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            routeId: routeCodeVal,
            vertical: { $in: vertical },
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
            subDistributor: subDistributor,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();
        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }
        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            subDistributor: subDistributor
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },

    'creditSales.salesDumpvanEmpOutletRouteFilter': (vertical, outlet, subDistributor, fromDate, toDate, routeId) => {
        let dataArray = [];
        let salesRes = CreditSale.find({
            routeId: routeId,
            vertical: { $in: vertical },
            subDistributor: subDistributor,
            outlet: outlet,
            createdAt: {
                $gte: fromDate,
                $lt: toDate
            },
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                itemArray: 1,
            }
        }).fetch();

        if (salesRes.length > 0) {
            for (let i = 0; i < salesRes.length; i++) {
                dataArray.push(salesRes[i]);
            }
        }

        let orderRes = Order.find({
            status: "Delivered", vertical: { $in: vertical },
            deliveredDate: {
                $gte: fromDate,
                $lt: toDate
            },
            subDistributor: subDistributor,
            outlet: outlet,
        }, {
            fields: {
                sdUser: 1,
                vertical: 1,
                subDistributor: 1,
                routeId: 1,
                salesType: 1,
                walkInCustomer: 1,
                outlet: 1,
                docDate: 1,
                docTotal: 1,
                taxAmount: 1,
                createdAt: 1,
                deliveredDate: 1,
                itemArray: 1,
            }
        }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                dataArray.push(orderRes[i]);
            }
        }
        return dataArray;
    },
    /**
     * 
     * @param {*} sdUser 
     * @param {*} vertical 
     * @param {*} outlet 
     * @param {*} fromDate 
     * @param {*} toDates 
     * @param {*} sd 
     * @returns updated by nithin 03-05-2022
     */
    'creditSales.creditListNew': (sdUser, vertical, fromDate, toDates, sd) => {
        let dataArray = [];
        toDates.setDate(toDates.getDate() + 1);
        if (sdUser && vertical === '') {
            dataArray = CreditSale.find({
                salesType: 'Cash', subDistributor: sd, sdUser: sdUser,
                createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }).fetch();
        }
        else if (sdUser === '' && vertical) {
            dataArray = CreditSale.find({
                salesType: 'Cash', subDistributor: sd,
                vertical: vertical, createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }).fetch();
        }
        else if (sdUser && vertical) {
            dataArray = CreditSale.find({
                salesType: 'Cash', subDistributor: sd,
                sdUser: sdUser, vertical: vertical, createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }).fetch();
        }
        else {
            dataArray = CreditSale.find({
                salesType: 'Cash', subDistributor: sd,
                createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }
            ).fetch();
        }

        return dataArray;
    },
    /**
     * 
     * @param {*} sd 
     * @param {*} sdUser 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} outletData 
     * @param {*} vertical 
     * @returns 
     */
    'creditSale.docTotalSumNew': (sd, sdUser, fromDate, toDate, vertical) => {
        let docTotalSum = 0;
        let cashData = [];
        if (fromDate && toDate) {
            toDate.setDate(toDate.getDate() + 1);
            if (sdUser && vertical === '') {
                cashData = CreditSale.find({
                    subDistributor: sd, sdUser: sdUser, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            else if (sdUser === '' && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            else if (sdUser && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, sdUser: sdUser, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            else {
                cashData = CreditSale.find({
                    subDistributor: sd, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            if (cashData.length > 0) {
                for (let j = 0; j < cashData.length; j++) {
                    docTotalSum += Number(cashData[j].docTotal);
                }
            }
        }
        return docTotalSum.toFixed(2);
    },
    /**
     * 
     * @param {*} sd 
     * @param {*} sdUser 
     * @param {*} outletData 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} vertical 
     * @returns 
     */
    'creditSale.taxAmountSumNew': (sd, sdUser, fromDate, toDate, vertical) => {
        let docTotalSum = 0, cashData = [];
        if (fromDate && toDate) {
            toDate.setDate(toDate.getDate() + 1);
            if (sdUser && vertical === '') {
                cashData = CreditSale.find({
                    subDistributor: sd, sdUser: sdUser, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }
            else if (sdUser === '' && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }
            else if (sdUser && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, sdUser: sdUser, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }
            else {
                cashData = CreditSale.find({
                    subDistributor: sd, salesType: "Cash",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }

            if (cashData.length) {
                for (let j = 0; j < cashData.length; j++) {
                    docTotalSum += Number(cashData[j].taxAmount);
                }
            }
        }

        return docTotalSum.toFixed(2);
    },

    /**
  * 
  * @param {*} sdUser 
  * @param {*} vertical 
  * @param {*} outlet 
  * @param {*} fromDate 
  * @param {*} toDates 
  * @param {*} sd 
  * @returns updated by nithin 03-05-2022
  */
    'creditSales.creditSaleListNew': (sdUser, vertical, fromDate, toDates, sd) => {
        let dataArray = [];
        toDates.setDate(toDates.getDate() + 1);
        if (sdUser && vertical === '') {
            dataArray = CreditSale.find({
                salesType: 'Credit', subDistributor: sd, sdUser: sdUser,
                createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }).fetch();
        }
        else if (sdUser === '' && vertical) {
            dataArray = CreditSale.find({
                salesType: 'Credit', subDistributor: sd,
                vertical: vertical, createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }).fetch();
        }
        else if (sdUser && vertical) {
            dataArray = CreditSale.find({
                salesType: 'Credit', subDistributor: sd,
                sdUser: sdUser, vertical: vertical, createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }).fetch();
        }
        else {
            dataArray = CreditSale.find({
                salesType: 'Credit', subDistributor: sd,
                createdAt: { $gte: fromDate, $lte: toDates }
            },
                {
                    fields: {
                        sdUser: 1, vertical: 1, walkInCustomer: 1, outlet: 1,
                        docDate: 1, docTotal: 1, taxAmount: 1, itemArray: 1,
                    }
                }
            ).fetch();
        }

        return dataArray;
    },

    /**
  * 
  * @param {*} sd 
  * @param {*} sdUser 
  * @param {*} fromDate 
  * @param {*} toDate 
  * @param {*} outletData 
  * @param {*} vertical 
  * @returns 
  */
    'creditSale.docTotalCreditSumNew': (sd, sdUser, fromDate, toDate, vertical) => {
        let docTotalSum = 0;
        let cashData = [];
        if (fromDate && toDate) {
            toDate.setDate(toDate.getDate() + 1);
            if (sdUser && vertical === '') {
                cashData = CreditSale.find({
                    subDistributor: sd, sdUser: sdUser, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            else if (sdUser === '' && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            else if (sdUser && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, sdUser: sdUser, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            else {
                cashData = CreditSale.find({
                    subDistributor: sd, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        docTotal: 1
                    }
                }).fetch();
            }
            if (cashData.length > 0) {
                for (let j = 0; j < cashData.length; j++) {
                    docTotalSum += Number(cashData[j].docTotal);
                }
            }
        }
        return docTotalSum.toFixed(2);
    },
    /**
     * 
     * @param {*} sd 
     * @param {*} sdUser 
     * @param {*} outletData 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} vertical 
     * @returns 
     */
    'creditSale.taxAmountCreditSumNew': (sd, sdUser, fromDate, toDate, vertical) => {
        let docTotalSum = 0, cashData = [];
        if (fromDate && toDate) {
            toDate.setDate(toDate.getDate() + 1);
            if (sdUser && vertical === '') {
                cashData = CreditSale.find({
                    subDistributor: sd, sdUser: sdUser, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }
            else if (sdUser === '' && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }
            else if (sdUser && vertical) {
                cashData = CreditSale.find({
                    subDistributor: sd, vertical: vertical, sdUser: sdUser, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }
            else {
                cashData = CreditSale.find({
                    subDistributor: sd, salesType: "Credit",
                    createdAt: { $gte: fromDate, $lt: toDate }
                }, {
                    fields: {
                        taxAmount: 1
                    }
                }).fetch();
            }

            if (cashData.length) {
                for (let j = 0; j < cashData.length; j++) {
                    docTotalSum += Number(cashData[j].taxAmount);
                }
            }
        }

        return docTotalSum.toFixed(2);
    },

});
/**
 * 
 * @returns Dynamic Color Codes
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
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
            let stockVals = '0.00';
            if (Number(balanceStock) > 0) {
                stockVals = balanceStock.toString();
            }
            WareHouseStock.update({ _id: stockRes._id }, {
                $set: {
                    stock: stockVals,
                    updatedAt: new Date(),
                    updatedBy: sdUser
                }
            });
            // let ddate
            let dateOne = moment(new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY');
            let fromDate = new Date(dateOne);

            let listofData = StockSummary.findOne({ subDistributor: subDistributor, employeeId: sdUser, product: productArray[i].product, date: dateOne });
            if (listofData) {
                StockSummary.update({ _id: listofData._id }, {
                    $set: {
                        soldStock: Number(listofData.soldStock) + Number(transferStock),
                        closingStock: Number(listofData.openingStock) - Number(listofData.soldStock) - Number(transferStock),
                        updatedAt: new Date(),
                        updatedBy: sdUser
                    }
                });
            }

        }
    }
}


function getCtn(productId) {
    let ctnCount = 0;
    let ctn = Unit.findOne({ product: productId, unitName: "CTN" }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });

    if (ctn) {
        ctnCount = ctn.baseQuantity;
    }
    return ctnCount;
}

function getctnToPcs(list, ctn) {
    let ctnToPcs = 0;
    let unitl = Unit.findOne({ product: list.product, _id: list.unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
    if (unitl) {
        if (unitl.unitName == 'CTN') {
            ctnToPcs = ctnToPcs + (list.quantity * ctn);
        }
    }
    return ctnToPcs;
}
function getpackToPcs(list) {
    let packToPcs = 0;
    let unitl = Unit.findOne({ product: list.product, _id: list.unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
    if (unitl) {
        if (unitl.unitName == 'PAC') {
            packToPcs = packToPcs + (Number(unitl.baseQuantity) * Number(list.quantity));
        }
    }
    return packToPcs;
}
function getpcs(list) {
    let ctn = 0, pcs = 0;
    let unitl = Unit.findOne({ product: list.product, _id: list.unit }, { fields: { unitName: 1, unitCode: 1, active: 1, product: 1, baseQuantity: 1 } });
    if (unitl) {
        if (unitl.unitName == 'PCS') {
            pcs = pcs + Number(list.quantity);
        }
    }
    return pcs;
}