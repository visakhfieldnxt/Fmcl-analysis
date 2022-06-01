/**
 * @author Nithin
 */
import { StockTransferIssued } from './stockTransferIssued';
import { Product } from '../products/products';
import { Unit } from '../unit/unit';
import { SdPriceType } from '../sdPriceType/sdPriceType';
import { Price } from '../price/price';
import { Verticals } from '../verticals/verticals';
Meteor.methods({
    /**
     * 
     * @param {*} _id 
     * @returns get product count
     */
    'stockTransferIssued.idCount': (_id) => {
        return StockTransferIssued.find({ transferId: _id }).count();
    },

    'stockTransferIssued.dataGet': (_id) => {
        return StockTransferIssued.find({ transferId: _id }).fetch();
    },

    'stockTransferIssued.getDetailss': (_id) => {
        let stockRes = StockTransferIssued.findOne({ _id: _id });
        let productName = ''
        if (stockRes) {
            let productRes = Product.findOne({ _id: stockRes.product });
            if (productRes) {
                productName = productRes.productName;
            }
        }
        return { stockRes: stockRes, productName: productName };
    },
    /**
      * 
      * @param {*} id 
      * get stock value
      */
    'stockTransferIssued.idPriceValGet': (id) => {
        let stockRes = StockTransferIssued.findOne({ _id: id });
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
                let priceVal = Price.findOne({
                    priceType: sdPriceTypeVal.priceType,
                    product: stockRes.product, unit: unitVal._id
                });
                if (priceVal) {
                    let priceAmt = Number(priceVal.priceWs * stockRes.quantity).toFixed(2);
                    totalValAmt = priceAmt.toString();
                }
            }
        }
        return totalValAmt;
    },
    'stockTransferIssued.productList': (id) => {
        let productArrya = [];
        let stockRes = StockTransferIssued.find({ sdUser: id }).fetch();
        if (stockRes) {
            for (let i = 0; i < stockRes.length; i++) {
                let productName = Product.findOne({ _id: stockRes[i].product }, { fields: { productName: 1 } });
                if (productName) {
                    productArrya.push(productName);
                }
            }
        }
        return productArrya;
    },
    'stockTransferIssued.productList1': (product, sdUser) => {
        return StockTransferIssued.find({ sdUser: sdUser, product: product }).fetch();
    },

    /**
     * 
     * @param {*} _id 
     * @returns for reports
     */
    'stockTransferIssued.detailPage': (_id) => {
        let resval = StockTransferIssued.find({ transferId: _id }, {
            fields: {
                transferId: 1, temporaryId: 1, subDistributor: 1, sdUser: 1, acceptedQuantity: 1,
                product: 1, unit: 1, quantity: 1, stock: 1, vertical: 1, transferDate: 1, status: 1
            }
        }).fetch();
        let verticalName = '';
        let empName = '';
        let temporaryId = '';
        let transferDate = '';
        let statusVal = '';
        if (resval.length > 0) {
            let verticalRes = Verticals.findOne({ _id: resval[0].vertical }, {
                fields: {
                    verticalName: 1
                }
            });
            if (verticalRes !== undefined) {
                verticalName = verticalRes.verticalName;
            }
            let sdList = Meteor.users.findOne({ _id: resval[0].sdUser });
            if (sdList) {
                empName = `${sdList.profile.firstName} ${sdList.profile.lastName}`;
            }
            temporaryId = resval[0].temporaryId;
            transferDate = resval[0].transferDate;
            statusVal = resval[0].status;
        }

        return {
            verticalName: verticalName,
            empName: empName,
            transferDate: transferDate,
            statusVal: statusVal,
            temporaryId: temporaryId,
            stockTransferRes: resval
        };
    },
});