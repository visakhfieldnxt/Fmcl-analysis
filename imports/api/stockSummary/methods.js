/**
 * @author Greeshma
 */

import { StockSummary } from './stockSummary';
Meteor.methods({
    'stockSummary.sdUserstockList': (id) => {
        return StockSummary.find({employeeId:id}, { fields: { productName: 1, productCode: 1 } }, { sort: { productName: 1 } }).fetch();
    },
    'stockSummary.sdUserstockWdate': (id,fromDate,toDate) => {
        return StockSummary.find({employeeId:id,createdAt:{ $gte: fromDate, $lte: toDate }}, { fields: { product: 1,date:1, openingStock:1, soldStock:1, closingStock:1 } }, { sort: { productName: 1 } }).fetch();
    },
    'stockSummary.openingStockTotal': (fromDate,toDate) => {

        let sumofOpening = 0;
        let data = '';
        if(fromDate!=null && toDate!=null){
           data = StockSummary.find({employeeId: Meteor.userId(),createdAt: { $gte:fromDate,$lte:toDate }}, { fields: { product: 1,date:1, openingStock:1, soldStock:1, closingStock:1 } }, { sort: { productName: 1 } }).fetch(); 
        }else{
            data = StockSummary.find({employeeId: Meteor.userId(),date: moment(new Date()).format('DD-MM-YYYY')}, { fields: { product: 1,date:1, openingStock:1, soldStock:1, closingStock:1 } }, { sort: { productName: 1 } }).fetch();
        }
        for(let i=0;i<data.length;i++){
            sumofOpening +=Number(data[i].openingStock);
        }
        return sumofOpening.toFixed(2);
    }, 'stockSummary.soldStockTotal': (fromDate,toDate) => {

        let sumofSold = 0;
        let data = '';
        if(fromDate!=null && toDate!=null){
           data = StockSummary.find({employeeId: Meteor.userId(),createdAt: { $gte:fromDate,$lte:toDate }}, { fields: { product: 1,date:1, openingStock:1, soldStock:1, closingStock:1 } }, { sort: { productName: 1 } }).fetch(); 
        }else{
            data = StockSummary.find({employeeId: Meteor.userId(),date: moment(new Date()).format('DD-MM-YYYY')}, { fields: { product: 1,date:1, openingStock:1, soldStock:1, closingStock:1 } }, { sort: { productName: 1 } }).fetch();
        }
        for(let i=0;i<data.length;i++){
            sumofSold +=Number(data[i].soldStock);
        }
        return sumofSold.toFixed(2);
    },
    'stockSummary.closingStockTotal': (fromDate,toDate) => {
        let sumofSold = 0;
        let data = '';
        if(fromDate!=null && toDate!=null){
           data = StockSummary.find({employeeId: Meteor.userId(),createdAt: { $gte:fromDate,$lte:toDate }}, { fields: { product: 1,date:1, openingStock:1, soldStock:1, closingStock:1 } }, { sort: { productName: 1 } }).fetch(); 
        }else{
            data = StockSummary.find({employeeId: Meteor.userId(),date: moment(new Date()).format('DD-MM-YYYY')}, { fields: { product: 1,date:1, openingStock:1, soldStock:1, closingStock:1 } }, { sort: { productName: 1 } }).fetch();
        }
        for(let i=0;i<data.length;i++){
            sumofSold +=Number(data[i].closingStock);
        }
        return sumofSold.toFixed(2);
    },

});

