/**
 * @author Nithin
 */
import { StockInvoices } from './stockInvoices';
Meteor.methods({
    /**
     * 
     * @param {*} vertical 
     * @param {*} product 
     * @param {*} user 
     * @param {*} fromDate 
     * @param {*} toDates 
     */
    'stockInvoices.exportData': (vertical, product, user, fromDate, toDates) => {
        let resultArray = [];

        if (vertical && product === '') {
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: user, vertical: vertical
            }).fetch();
        }
        else if (vertical === '' && product) {
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: user, product: product
            }).fetch();
        }
        else if (vertical && product) {
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: user, product: product, vertical: vertical
            }).fetch();
        }
        else {
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: user,
            }).fetch();
        }

        return resultArray;
    },
    /**
     * 
     * @param {*} vertical 
     * @param {*} product 
     * @param {*} subDistributor 
     * @param {*} loginVertical 
     * @param {*} fromDate 
     * @param {*} toDates 
     */
    'stockInvoices.exportDataBDM': (vertical, product, subDistributor, loginVertical, fromDate, toDates) => {
        let resultArray = []; 
        if (vertical && product === '' && subDistributor === '') { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                vertical: vertical
            }).fetch();
        }
        else if (vertical === '' && product && subDistributor === '') { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                product: product, vertical: { $in: loginVertical }
            }).fetch();
        }
        else if (vertical === '' && product === '' && subDistributor) { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: subDistributor, vertical: { $in: loginVertical }
            }).fetch();
        }
        else if (vertical && product && subDistributor === '') { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                product: product, vertical: vertical
            }).fetch();
        }
        else if (vertical && product === '' && subDistributor) { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: subDistributor, vertical: vertical
            }).fetch();
        }
        else if (vertical === '' && product && subDistributor) { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: subDistributor, product: product, vertical: { $in: loginVertical }
            }).fetch();
        }
        else if (vertical && product && subDistributor) { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                subDistributor: subDistributor, product: product, vertical: vertical
            }).fetch();
        }
        else { 
            resultArray = StockInvoices.find({
                createdAt: { $gte: fromDate, $lt: toDates },
                vertical: { $in: loginVertical }
            }).fetch();
        }
        return resultArray;
    },
});