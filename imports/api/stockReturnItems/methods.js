/**
 * @author Nithin
 */
import { StockReturnItems } from './stockReturnItems';
import { Product } from '../products/products'; 
import { Verticals } from '../verticals/verticals';
Meteor.methods({
    /**
     * 
     * @param {*} _id 
     * @returns get product count
     */
    'stockReturnItems.idCount': (_id) => {
        return StockReturnItems.find({ returnId: _id }).count();
    },

    'stockReturnItems.dataGet': (_id) => {
        return StockReturnItems.find({ returnId: _id }).fetch();
    },

    'stockReturnItems.getDetailss': (_id) => {
        let stockRes = StockReturnItems.findOne({ _id: _id });
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
     * @param {*} _id 
     * @returns get product count
     */
         'stockReturnItems.idCount': (_id) => {
            return StockReturnItems.find({ returnId: _id }).count();
        },

           /**
     * 
     * @param {*} _id 
     * @returns for reports
     */
    'stockReturnItems.detailPage': (_id) => {
        let resval = StockReturnItems.find({ returnId: _id }, {
            fields: {
                returnId: 1, temporaryId: 1, subDistributor: 1, sdUser: 1, acceptedQuantity: 1,
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