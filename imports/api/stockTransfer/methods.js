/**
 * @author Nithin
 */
import { StockTransfer } from './stockTransfer';
import { WareHouseStock } from '../wareHouseStock/wareHouseStock';
import { Stock } from '../stock/stock';
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { Verticals } from '../verticals/verticals';
import { allUsers } from '../user/user';
import { StockTransferIssued } from '../stockTransferIssued/stockTransferIssued';
import { StockSummary } from '../stockSummary/stockSummary';
import moment from 'moment';
import { Unit } from '../unit/unit';
import { Notification } from '../notification/notification';
Meteor.methods({
    /**
    * create stock
    * @param {*} vertical 
    * @param {*} productArray 
    */
    'stockTransfer.create': (productArray, empId, vertical) => {

        let temporaryId = '';

        // generate temp code
        let tempVal = TempSerialNo.findOne({
            stocktransfer: true,
        }, { sort: { $natural: -1 } });
        if (!tempVal) {
            temporaryId = "ST/" + "FMC" + "/1";
        } else {
            temporaryId = "ST/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
        }
        if (!tempVal) {
            TempSerialNo.insert({
                serial: 1,
                stocktransfer: true,
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
        NotificationStkTrnsfrFun(empId);
        let transferResult = StockTransfer.insert({
            subDistributor: Meteor.userId(),
            sdUser: empId,
            status: "Pending",
            temporaryId: temporaryId,
            transferDate: moment(new Date()).format('DD-MM-YYYY'),
            transferDateIso: new Date(),
            uuid: Random.id(),
            createdBy: Meteor.userId(),
            createdAt: new Date(),
        });
        if (transferResult) {
            // warehouseStockUpdates(productArray, empId, Meteor.userId());
            stockTarnsferIssuedCreateFn(transferResult, Meteor.userId(), empId, temporaryId, productArray, vertical);
            // stockTarnsferSummaryCreateFn(transferResult, Meteor.userId(), empId, temporaryId, productArray, vertical);
            reduceStock(productArray, Meteor.userId(), vertical);
        }

    },
    /**
     * 
     * @param {*} id 
     * @returns get stock transfer details
     */
    'stockTransfer.id': (id) => {
        let transferRes = StockTransfer.findOne({ _id: id });
        let verticalName = '';
        let empNameVal = '';
        let subDistributorName = '';
        let stockItems = [];
        if (transferRes) {
            let verticalRes = Verticals.findOne({ _id: transferRes.vertical });
            if (verticalRes) {
                verticalName = verticalRes.verticalName;
            }
            let userRes = allUsers.findOne({ _id: transferRes.sdUser });
            if (userRes) {
                empNameVal = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
            }

            let userRes1 = allUsers.findOne({ _id: transferRes.subDistributor });
            if (userRes1) {
                subDistributorName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
            }
            stockItems = StockTransferIssued.find({ transferId: transferRes._id },
                { fields: { product: 1, unit: 1, stock: 1, quantity: 1, vertical: 1 } }).fetch();
        }
        return {
            transferRes: transferRes, verticalName: verticalName,
            empNameVal: empNameVal, stockItems: stockItems, subDistributorName: subDistributorName
        }
    },
    /**
     * get unique id based on sd */
    'stockTransfer.idList': (id) => {
        return StockTransfer.find({ subDistributor: id }, { fields: { temporaryId: 1 } }).fetch();
    },
    /**
   * get unique id based on sd */
    'stockTransfer.SdList': (id) => {
        let userRes = allUsers.findOne({ _id: id });
        if (userRes) {
            return StockTransfer.find({ subDistributor: userRes.subDistributor, status: "Pending" }, { fields: { temporaryId: 1 } }).fetch();
        }
    },
    /**
     * 
     * @param {*} id 
     * @param {*} productArray 
     */
    'stockTransfer.acceptStock': (id, productArray, sdUser, stockEdited) => {
        let stockTransferDetails = StockTransfer.findOne({ _id: id });

        if (stockTransferDetails) {
            notificationAcptStk(stockTransferDetails.subDistributor);
            if (stockEdited === true) {
                notificationEditStk(stockTransferDetails.subDistributor);
            }
            let stockRes = StockTransfer.update({
                _id: id,
            }, {
                $set:
                {
                    status: 'Accepted',
                    acceptedDate: new Date(),
                    acceptedBy: id,
                    updatedAt: new Date(),
                }
            });
            if (stockRes) {
                updateStockTransferIssuedss(sdUser, id, productArray);
                stockTarnsferSummaryCreateFn(stockTransferDetails.subDistributor, Meteor.userId(), productArray);
                warehouseStockUpdates(productArray, sdUser, stockTransferDetails.subDistributor);
            }
        }
    },
    /**
     * 
     * @param {*} subDistributor 
     * @param {*} sdUser 
     * @param {*} fromDate 
     * @param {*} toDate 
     * data for export
     */
    'stockTransfer.exportData': (subDistributor, sdUser, fromDate, toDate) => {
        let stockRes = [];
        let resultArray = [];
        if (sdUser !== undefined && sdUser !== '') {
            stockRes = StockTransfer.find({
                subDistributor: subDistributor,
                sdUser: sdUser,
                createdAt: { $gte: fromDate, $lt: toDate }
            }, {
                fields: {
                    subDistributor: 1, sdUser: 1, status: 1, temporaryId: 1, transferDate: 1
                }
            }).fetch();
        }
        else {
            stockRes = StockTransfer.find({
                subDistributor: subDistributor,
                createdAt: { $gte: fromDate, $lt: toDate }
            }, {
                fields: {
                    subDistributor: 1, sdUser: 1, status: 1,
                    temporaryId: 1, transferDate: 1, vertical: 1
                }
            }).fetch();
        }
        if (stockRes.length > 0) {
            let verticalRes = '';
            for (let i = 0; i < stockRes.length; i++) {
                let itemRes = StockTransferIssued.find({ transferId: stockRes[i]._id }, {
                    fields: {
                        transferId: 1, temporaryId: 1, subDistributor: 1, sdUser: 1, acceptedQuantity: 1,
                        product: 1, unit: 1, quantity: 1, stock: 1, vertical: 1, transferDate: 1
                    }
                }).fetch()
                if (itemRes.length > 0) {
                    verticalRes = itemRes[0].vertical;
                }
                resultArray.push({
                    stockRes: stockRes[i],
                    itemRes: itemRes,
                    verticalRes: verticalRes,

                })
            }
        }
        return resultArray;
    },

});

//  update warehouse stock

function warehouseStockUpdates(productArray, empId, subDistributor) {
    for (let i = 0; i < productArray.length; i++) {
        let baseQty = 0;
        let unitRes = Unit.findOne({ _id: productArray[i].unit });
        if (unitRes) {
            baseQty = Number(unitRes.baseQuantity);
        }
        let warehouseRes = WareHouseStock.find({
            employeeId: empId,
            subDistributor: subDistributor, product: productArray[i].product, vertical: productArray[i].vertical
        }).fetch();
        if (warehouseRes.length === 0) {
            let stockVal = Number(productArray[i].quantity) * baseQty;
            WareHouseStock.insert({
                employeeId: empId,
                subDistributor: subDistributor,
                vertical: productArray[i].vertical,
                product: productArray[i].product,
                stock: stockVal.toString(),
                uuid: Random.id(),
                createdAt: new Date(),
            });
        }
        else {
            let actualStock = Number(warehouseRes[0].stock);
            let transferStock = Number(productArray[i].quantity) * baseQty;
            let balanceStock = Number(actualStock + transferStock);
            WareHouseStock.update({ _id: warehouseRes[0]._id }, {
                $set: {
                    stock: balanceStock.toString(),
                    updatedAt: new Date(),
                    updatedBy: subDistributor
                }
            });
        }
    }
}

// function for reduce sd manager stock

function reduceStock(productArray, user, vertical) {
    for (let i = 0; i < productArray.length; i++) {
        if (productArray[i].stockUpdated === true) {
            let stockRes = Stock.findOne({
                subDistributor: user, vertical: vertical,
                product: productArray[i].product
            });
            if (stockRes) {
                let actualStock = Number(stockRes.stock);
                let transferStock = Number(productArray[i].transferStockVal);
                let balanceStock = Number(actualStock - transferStock);
                Stock.update({ _id: stockRes._id }, {
                    $set: {
                        stock: balanceStock.toString(),
                        updatedAt: new Date(),
                        updatedBy: user
                    }
                });
            }
        }
    }
}

/**
 * 
 * @param {*} transferResult 
 * @param {*} subDistributor 
 * @param {*} empId 
 * @param {*} temporaryId 
 * @param {*} productArray 
 * create issued items collection
 */
function stockTarnsferIssuedCreateFn(transferResult, subDistributor, empId, temporaryId, productArray, vertical) {
    for (let i = 0; i < productArray.length; i++) {
        if (productArray[i].stockUpdated === true) {
            StockTransferIssued.insert({
                transferId: transferResult,
                temporaryId: temporaryId,
                subDistributor: subDistributor,
                sdUser: empId,
                product: productArray[i].product,
                unit: productArray[i].transferUnit,
                quantity: productArray[i].transferStock,
                stock: productArray[i].transferStockVal,
                vertical: vertical,
                status: "Pending",
                transferDate: moment(new Date).format('DD-MM-YYYY'),
                transferDateIso: new Date(),
                uuid: Random.id()
            });
        }
    }
}
function stockTarnsferSummaryCreateFn(subDistributor, empId, productArray) {
    for (let i = 0; i < productArray.length; i++) {
        let listofData = StockSummary.findOne({ subDistributor: subDistributor, employeeId: empId, product: productArray[i].product, date: productArray[i].transferDate });
        if (listofData) {
            let opstock = Number(productArray[i].stock) + Number(listofData.openingStock);
            let clstock = Number(productArray[i].stock) + Number(listofData.openingStock) - Number(listofData.soldStock);
            StockSummary.update({
                _id: listofData._id
            }, {
                employeeId: listofData.employeeId,
                subDistributor: listofData.subDistributor,
                product: listofData.product,
                date: listofData.date,
                openingStock: opstock,
                closingStock: clstock,
                soldStock: listofData.soldStock,
                closingStock: Number(productArray[i].stock),
                createdAt: listofData.createdAt,
                updatedAt: new Date(),
            });
        } else {
            StockSummary.insert({
                employeeId: empId,
                subDistributor: subDistributor,
                product: productArray[i].product,
                date: moment(new Date).format('DD-MM-YYYY'),
                openingStock: Number(productArray[i].stock),
                soldStock: 0,
                closingStock: Number(productArray[i].stock),
                createdAt: new Date(),
            });
        }
    }
}

function updateStockTransferIssuedss(id, transferId, productArray) {
    for (let i = 0; i < productArray.length; i++) {
        let remarksRes = ''
        if (productArray[i].remarks !== undefined) {
            remarksRes = productArray[i].remarks;
        }
        StockTransferIssued.update({
            transferId: transferId, product: productArray[i].product,
            unit: productArray[i].unit, vertical: productArray[i].vertical
        }, {
            $set:
            {
                acceptedQuantity: productArray[i].quantity,
                remarks: remarksRes,
                acceptedDate: new Date(),
                updatedBy: id,
                updatedAt: new Date(),
            }
        });
    }
}

// For Notification for Stock Acceptance
function notificationAcptStk(subd) {
    let notData = Notification.findOne({ type: "Stock Acceptance", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "Stock Acceptance", user: subd }, { $set: { count: countData } })
    } else {
        return Notification.insert({
            user: subd,
            type: "Stock Acceptance",
            count: 1,
            createdAt: new Date()
        });
    }
}
// For Notification for Stock Edit
function notificationEditStk(subd) {
    let notData = Notification.findOne({ type: "Stock Edited", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "Stock Edited", user: subd }, { $set: { count: countData } })
    } else {
        return Notification.insert({
            user: subd,
            type: "Stock Edited",
            count: 1,
            createdAt: new Date()
        });
    }
}
// For Notification for Stock Transfer
function NotificationStkTrnsfrFun(subd) {
    let notData = Notification.findOne({ type: "New Stock", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "New Stock", user: subd }, { $set: { count: countData } })
    } else {
        return Notification.insert({
            user: subd,
            type: "New Stock",
            count: 1,
            createdAt: new Date()
        });
    }
}