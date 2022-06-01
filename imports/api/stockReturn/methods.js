/**
 * @author Nithin
 */
import { StockReturn } from './stockReturn';
import { StockReturnItems } from '../stockReturnItems/stockReturnItems';
import { WareHouseStock } from '../wareHouseStock/wareHouseStock';
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { allUsers } from '../user/user';
import { Stock } from '../stock/stock';
import { Unit } from '../unit/unit';
Meteor.methods({
    /**
      * create stock
      * @param {*} vertical 
      * @param {*} productArray 
      */
    'stockReturn.create': (productArray, empId, vertical) => {
        let subDistributor = '';
        let userResVal = allUsers.findOne({ _id: empId });
        if (userResVal) {
            subDistributor = userResVal.subDistributor;
        }
        let temporaryId = '';

        // generate temp code
        let tempVal = TempSerialNo.findOne({
            stockReturn: true,
        }, { sort: { $natural: -1 } });
        if (!tempVal) {
            temporaryId = "SR/" + "FMC" + "/1";
        } else {
            temporaryId = "SR/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
        }
        if (!tempVal) {
            TempSerialNo.insert({
                serial: 1,
                stockReturn: true,
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
        let transferResult = StockReturn.insert({
            subDistributor: subDistributor,
            sdUser: empId,
            status: "Pending",
            temporaryId: temporaryId,
            transferDate: moment(new Date()).format('DD-MM-YYYY'),
            transferDateIso: new Date(),
            uuid: Random.id(),
            createdBy: empId,
            createdAt: new Date(),
        });
        if (transferResult) {
            stockReturnItemsFn(transferResult, subDistributor, empId, temporaryId, productArray, vertical);
        }

    },
    /**
       * get unique id based on sd */
    'stockReturn.idList': (id) => {
        let userRes = allUsers.findOne({ _id: id });
        if (userRes) {
            return StockReturn.find({ subDistributor: userRes.subDistributor, status: "Pending" }, { fields: { temporaryId: 1 } }).fetch();
        }
    },
    /**
  * get unique id based on sd */
    'stockReturn.idListAll': (id) => {
        return StockReturn.find({ subDistributor: id }, { fields: { temporaryId: 1 } }).fetch();
    },
    /**
    * get unique id based on sd */
    'stockReturn.SdList': (id) => {
        return StockReturn.find({ subDistributor: id, status: "Pending" }, { fields: { temporaryId: 1 } }).fetch();

    },
    'stockReturn.pendingList': () => {
        return StockReturn.find({ status: "Pending" }, { fields: { temporaryId: 1 } }).fetch();
    },
    /**
     * accept stock
     */
    'stockReturn.acceptStock': (returnId, productArray, userId) => {
        // console.log("returnId",returnId);
        let stockReturnDetails = StockReturn.findOne({ _id: returnId });
        // console.log("stockReturnDetails",stockReturnDetails);

        if (stockReturnDetails) {
            let stockRes = StockReturn.update({
                _id: returnId,
            }, {
                $set:
                {
                    status: 'Accepted',
                    acceptedDate: new Date(),
                    acceptedBy: userId,
                    updatedAt: new Date(),
                }
            });
            if (stockRes) {
                warehouseStockUpdatesFns(productArray, stockReturnDetails.sdUser, stockReturnDetails.subDistributor);
                addStock(productArray, stockReturnDetails.subDistributor);
            }
        }
    },

    'stockReturn.cancel': (returnId) => {
        return StockReturn.update({
            _id: returnId,
        }, {
            $set:
            {
                status: 'Cancelled',
                cancelled: new Date(),
            }
        });
    },
    /**
 * 
 * @param {*} subDistributor 
 * @param {*} sdUser 
 * @param {*} fromDate 
 * @param {*} toDate 
 * data for export
 */
    'stockReturn.exportData': (subDistributor, sdUser, fromDate, toDate) => {
        let stockRes = [];
        let resultArray = [];
        if (sdUser !== undefined && sdUser !== '') {
            stockRes = StockReturn.find({
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
            stockRes = StockReturn.find({
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
                let itemRes = StockReturnItems.find({ returnId: stockRes[i]._id }, {
                    fields: {
                        returnId: 1, temporaryId: 1, subDistributor: 1, sdUser: 1, acceptedQuantity: 1,
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


/**
 * 
 * @param {*} transferResult 
 * @param {*} subDistributor 
 * @param {*} empId 
 * @param {*} temporaryId 
 * @param {*} productArray 
 * create issued items collection
 */
function stockReturnItemsFn(transferResult, subDistributor, empId, temporaryId, productArray, vertical) {

    for (let i = 0; i < productArray.length; i++) {
        StockReturnItems.insert({
            returnId: transferResult,
            temporaryId: temporaryId,
            subDistributor: subDistributor,
            sdUser: empId,
            product: productArray[i].product,
            unit: productArray[i].basicUnit,
            quantity: productArray[i].quantity,
            stock: productArray[i].quantity,
            vertical: vertical,
            status: "Pending",
            transferDate: moment(new Date).format('DD-MM-YYYY'),
            transferDateIso: new Date(),
            uuid: Random.id()
        });
    }
}


function warehouseStockUpdatesFns(productArray, empId, subDistributor) {
    for (let i = 0; i < productArray.length; i++) {
        // console.log("productArray",productArray[i]);
        let warehouseRes = WareHouseStock.find({
            employeeId: empId,
            subDistributor: subDistributor, product: productArray[i].product, vertical: productArray[i].vertical
        }).fetch();
        let uniData = Unit.find({ product: productArray[i].product, unitName: "CTN" }).fetch();
        // console.log("productArray[i].stock",productArray[i].stock);
        // console.log("warehouseRes[0].stock",warehouseRes[0].stock);
        // console.log("uniData",uniData[0].baseQuantity);
        if (warehouseRes.length > 0) {
            if (uniData.length > 0) {
                let multiData = Number(productArray[i].stock * uniData[0].baseQuantity);
                // console.log("multiData",multiDatloa);
                let stockupdate = Number(warehouseRes[0].stock - multiData);
                // console.log("stockupdate",stockupdate); 
                let stockVal = '0.00';
                if (Number(stockupdate) > 0) {
                    stockVal = stockupdate.toString();
                }
                WareHouseStock.update({ _id: warehouseRes[0]._id }, {
                    $set: {
                        stock: stockVal,
                        updatedAt: new Date(),
                        updatedBy: subDistributor
                    }
                });
            }

        }
    }
}


// function for add sd manager stock

function addStock(productArray, user,) {
    for (let i = 0; i < productArray.length; i++) {
        let stockRes = Stock.findOne({
            subDistributor: user, vertical: productArray[i].vertical,
            product: productArray[i].product
        });
        let uniData = Unit.findOne({ product: productArray[i].product, unitName: "CTN" });

        if (stockRes) {
            let actualStock = Number(stockRes.stock);
            let transferStock = Number(productArray[i].quantity * uniData.baseQuantity);
            let balanceStock = Number(actualStock + transferStock);
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