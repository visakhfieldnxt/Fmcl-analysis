// // // /**
// // //  * @author Visakh
// // //  */

// // import { Branch } from "../branch/branch";
// // import { Customer } from "../customer/customer";
// // import { Order } from "../order/order";
// // import { PickList } from "../pickList/pickList";
// // import { Item } from "../item/item";
// // import { Config } from "../config/config"
// // import { HTTP } from 'meteor/http';
// // import { ItemCategory } from "../itemCategory/itemCategory";
// // import { ItemPriceList } from "../itemPriceList/itemPriceList";
// // import { ItemGetPrice } from "../itemGetPrice/itemGetPrice";
// // import { ItemSpecialPrice } from "../itemSpecialPrice/itemSpecialPrice";
// // import { WareHouse } from "../wareHouse/wareHouse";
// // import { Unit } from "../unit/unit";
// // import { WareHouseStock } from "../wareHouseStock/wareHouseStock";
// // import { Delivery } from "../delivery/delivery";
// // import { Batch } from "../batch/batch";
// // import { Invoice } from "../invoice/invoice";
// // import { SalesReturn } from "../salesReturn/salesReturn";
// // import { CustomerAddress } from "../customerAddress/customerAddress";
// // import { CustomerPriceList } from "../customerPriceList/customerPriceList";
// // import { CreditNote } from "../creditNote/creditNote";
// // import { Currency } from "../currency/currency";
// // import { Tax } from "../tax/tax";
// // import { Country } from "../country/country";
// // import { State } from "../state/state";
// // import { CustomerGroup } from "../customerGroup/customerGroup";
// // import { BinQuantity } from "../binQuantity/binQuantity";
// // import { Bin } from "../bin/bin";
// // import { CronResult } from "../cronResult/cronResult";
// // import { DefaultWareHouse } from '../defaultWareHouse/defaultWareHouse';
// // import { ArInvoicePayment } from '../arInvoice+Payment/arInvoice+Payment';
// import { RouteAssign } from '../routeAssign/routeAssign';


// // //crone order
// // SyncedCron.add({
// //     name: 'Order Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 50 sec');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + orderUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             // "2019-03-22 00:00:00.000",
// //             dbId: dbId
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Order Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Order Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let ordrResult = result.data.data;
// //                 // console.log(ordrResult);
// //                 console.log("Order Update Crone Res Success");
// //                 for (let i = 0; i < ordrResult.length; i++) {
// //                     let OFind = Order.find({
// //                         docEntry: ordrResult[i].DocEntry
// //                     }).fetch();
// //                     if (OFind.length > 0) {
// //                         updateCount = updateCount + 1;
// //                         Order.update(OFind[0]._id, {
// //                             $set: {
// //                                 docStatus: ordrResult[i].DocStatus,
// //                                 docType: ordrResult[i].DocType,
// //                                 paidDpm: ordrResult[i].PaidDpm,
// //                                 discPrcnt: ordrResult[i].DiscPrcnt,
// //                                 canceled: ordrResult[i].CANCELED,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Order Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // // 

// // //cron ItemGetPrice Update Full
// // SyncedCron.add({
// //     name: 'ItemGetPrice Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 3 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + itemGetPriceUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 180000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             console.log("ItemGetPrice Update Crone send..........");
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'ItemGetPrice Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // }); 
// //                 CronResult.insert({
// //                     name: 'ItemGetPrice Update Crone',
// //                     result: err,
// //                     cronDate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss A"),
// //                     createdAt: new Date()
// //                 });
// //                 console.log("ItemGetPrice Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 CronResult.insert({
// //                     name: 'ItemGetPrice Update Crone',
// //                     result: 'success',
// //                     cronDate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss A"),
// //                     createdAt: new Date()
// //                 });
// //                 let itemGetPriceResult = result.data.data;
// //                 console.log("ItemGetPrice Update Crone Res", itemGetPriceResult);
// //                 for (let i = 0; i < itemGetPriceResult.length; i++) {
// //                     let ItFind = ItemGetPrice.find({
// //                         u_ItemCode: itemGetPriceResult[i].U_ItemCode, u_EfFrmDt: itemGetPriceResult[i].U_EfFrmDt,
// //                         u_BPLId: itemGetPriceResult[i].U_BPLId, u_PriceList: itemGetPriceResult[i].U_PrcList
// //                     }).fetch();
// //                     if (ItFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         ItemGetPrice.insert({
// //                             u_BPLId: itemGetPriceResult[i].U_BPLId,
// //                             u_PriceList: itemGetPriceResult[i].U_PrcList,
// //                             u_Curr: itemGetPriceResult[i].U_Curr,
// //                             u_ItemCode: itemGetPriceResult[i].U_ItemCode,
// //                             u_EfFrmDt: itemGetPriceResult[i].U_EfFrmDt,
// //                             u_TaxCode: itemGetPriceResult[i].U_TaxCode,
// //                             u_TaxRate: itemGetPriceResult[i].U_TaxRate,
// //                             u_NetPrc: itemGetPriceResult[i].U_NetPrc,
// //                             u_GrossPrc: itemGetPriceResult[i].U_GrossPrc,
// //                             u_TaxAmt: itemGetPriceResult[i].U_TaxAmt,
// //                             u_UOM: itemGetPriceResult[i].U_UOM,
// //                             u_Active: itemGetPriceResult[i].U_Active,
// //                             sRNM: itemGetPriceResult[i].SRNO,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         ItemGetPrice.update(ItFind[0]._id, {
// //                             $set: {
// //                                 u_BPLId: itemGetPriceResult[i].U_BPLId,
// //                                 u_PriceList: itemGetPriceResult[i].U_PrcList,
// //                                 u_Curr: itemGetPriceResult[i].U_Curr,
// //                                 u_ItemCode: itemGetPriceResult[i].U_ItemCode,
// //                                 u_EfFrmDt: itemGetPriceResult[i].U_EfFrmDt,
// //                                 u_TaxCode: itemGetPriceResult[i].U_TaxCode,
// //                                 u_TaxRate: itemGetPriceResult[i].U_TaxRate,
// //                                 u_NetPrc: itemGetPriceResult[i].U_NetPrc,
// //                                 u_GrossPrc: itemGetPriceResult[i].U_GrossPrc,
// //                                 u_TaxAmt: itemGetPriceResult[i].U_TaxAmt,
// //                                 u_UOM: itemGetPriceResult[i].U_UOM,
// //                                 u_Active: itemGetPriceResult[i].U_Active,
// //                                 sRNM: itemGetPriceResult[i].SRNO,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'ItemGetPrice Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // //Customer Addreesfull

// // //      // Customer Address Full list 
// // SyncedCron.add({
// //     name: 'Customer Address Update List',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + customerAddressUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Customer Address Update List',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Customer Address Update List Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("Customer Address Update List Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = CustomerAddress.find({
// //                         cardCode: deliveryList[i].CardCode,
// //                         address: deliveryList[i].Address,
// //                         addressType: deliveryList[i].AdresType
// //                     }).fetch();
// //                     if (ItCFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         CustomerAddress.insert({
// //                             cardCode: deliveryList[i].CardCode,
// //                             address: deliveryList[i].Address,
// //                             street: deliveryList[i].Street,
// //                             block: deliveryList[i].Block,
// //                             zipCode: deliveryList[i].ZipCode,
// //                             city: deliveryList[i].City,
// //                             country: deliveryList[i].Country,
// //                             state: deliveryList[i].State,
// //                             taxCode: deliveryList[i].TaxCode,
// //                             addressType: deliveryList[i].AdresType,
// //                             uuid: Random.id(),
// //                             createdAt: new Date()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         CustomerAddress.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 cardCode: deliveryList[i].CardCode,
// //                                 address: deliveryList[i].Address,
// //                                 street: deliveryList[i].Street,
// //                                 block: deliveryList[i].Block,
// //                                 zipCode: deliveryList[i].ZipCode,
// //                                 city: deliveryList[i].City,
// //                                 country: deliveryList[i].Country,
// //                                 state: deliveryList[i].State,
// //                                 taxCode: deliveryList[i].TaxCode,
// //                                 addressType: deliveryList[i].AdresType,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Customer Address Update List',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // //Customer Addrees Update End
// // // cron Customer PriceList Full
// // SyncedCron.add({
// //     name: 'Customer Update Price List Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + customerUpdatedPrice_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Customer Update Price List Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Customer Update Price List Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let priceListResult = result.data.data;
// //                 for (let i = 0; i < priceListResult.length; i++) {
// //                     let priceListFind = CustomerPriceList.find({
// //                         cardCode: priceListResult[i].CardCode, bPLId: priceListResult[i].BPLId
// //                     }).fetch();
// //                     if (priceListFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         CustomerPriceList.insert({
// //                             cardCode: priceListResult[i].CardCode,
// //                             cardName: priceListResult[i].CardName,
// //                             bPLId: priceListResult[i].BPLId,
// //                             prcList: priceListResult[i].PrcList,
// //                             pLName: priceListResult[i].PLName,
// //                             u_Assgnd: priceListResult[i].U_Assgnd,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         CustomerPriceList.update(priceListFind[0]._id, {
// //                             $set: {
// //                                 cardCode: priceListResult[i].CardCode,
// //                                 cardName: priceListResult[i].CardName,
// //                                 bPLId: priceListResult[i].BPLId,
// //                                 prcList: priceListResult[i].PrcList,
// //                                 pLName: priceListResult[i].PLName,
// //                                 u_Assgnd: priceListResult[i].U_Assgnd,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                         // CronResult.insert({
// //                         //     name: 'Customer Update Price List Crone',
// //                         //     result: result,
// //                         //     insertCount: insertCount,
// //                         //     updateCount: updateCount,
// //                         //     date: new Date()
// //                         // });
// //                     }
// //                 }
// //             }
// //         });
// //     }
// // });

// // // //customer update crone 
// // SyncedCron.add({
// //     name: 'Customer Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + customerUpdate_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Customer Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Customer Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let results = result.data.data;
// //                 console.log("Customer Update Crone Res Success");
// //                 for (let i = 0; i < results.length; i++) {
// //                     let find = Customer.find({
// //                         cardCode: results[i].CardCode
// //                     }).fetch();
// //                     if (find.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Customer.insert({
// //                             cardCode: results[i].CardCode,
// //                             cardType: results[i].CardType,
// //                             cardName: results[i].CardName,
// //                             address: results[i].Address,
// //                             priceMode: results[i].PriceMode,
// //                             priceList: results[i].PriceList,
// //                             slpCode: results[i].SlpCode,
// //                             phone1: results[i].Phone1,
// //                             cntctPrsn: results[i].CntctPrsn,
// //                             balance: results[i].Balance,
// //                             ordersBal: results[i].OrdersBal,
// //                             creditLine: results[i].CreditLine,
// //                             groupCode: results[i].GroupCode,
// //                             phone2: results[i].Phone2,
// //                             mailAddres: results[i].MailAddres,
// //                             currency: results[i].Currency,
// //                             pymntGroup: results[i].PymntGroup,
// //                             u_CashSale: results[i].U_CashSale,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         if (find[0].cardType !== "L") {
// //                             Customer.update(find[0]._id, {
// //                                 $set: {
// //                                     cardCode: results[i].CardCode,
// //                                     cardType: results[i].CardType,
// //                                     cardName: results[i].CardName,
// //                                     address: results[i].Address,
// //                                     priceMode: results[i].PriceMode,
// //                                     priceList: results[i].PriceList,
// //                                     slpCode: results[i].SlpCode,
// //                                     phone1: results[i].Phone1,
// //                                     cntctPrsn: results[i].CntctPrsn,
// //                                     balance: results[i].Balance,
// //                                     ordersBal: results[i].OrdersBal,
// //                                     creditLine: results[i].CreditLine,
// //                                     groupCode: results[i].GroupCode,
// //                                     phone2: results[i].Phone2,
// //                                     mailAddres: results[i].MailAddres,
// //                                     currency: results[i].Currency,
// //                                     pymntGroup: results[i].PymntGroup,
// //                                     u_CashSale: results[i].U_CashSale,
// //                                     updatedAt: new Date()
// //                                 }
// //                             });
// //                         }
// //                         else {
// //                             Customer.update(find[0]._id, {
// //                                 $set: {
// //                                     cardCode: results[i].CardCode,
// //                                     cardType: results[i].CardType,
// //                                     cardName: results[i].CardName,
// //                                     address: results[i].Address,
// //                                     priceMode: results[i].PriceMode,
// //                                     priceList: results[i].PriceList,
// //                                     slpCode: results[i].SlpCode,
// //                                     phone1: results[i].Phone1,
// //                                     cntctPrsn: results[i].CntctPrsn,
// //                                     balance: results[i].Balance,
// //                                     ordersBal: results[i].OrdersBal,
// //                                     creditLine: results[i].CreditLine,
// //                                     groupCode: results[i].GroupCode,
// //                                     phone2: results[i].Phone2,
// //                                     mailAddres: results[i].MailAddres,
// //                                     pymntGroup: results[i].PymntGroup,
// //                                     u_CashSale: results[i].U_CashSale,
// //                                     updatedAt: new Date()
// //                                 }
// //                             });
// //                         }
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Customer Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // // cron customer update end

// // // //// cron Items Update
// // SyncedCron.add({
// //     name: 'Items Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 5 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + itemUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Items Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Items Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let itemResult = result.data.data;
// //                 console.log("Items Update Crone Res Success");
// //                 for (let i = 0; i < itemResult.length; i++) {
// //                     let ItFind = Item.find({
// //                         itemCode: itemResult[i].ItemCode
// //                     }).fetch();
// //                     if (ItFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Item.insert({
// //                             itemCode: itemResult[i].ItemCode,
// //                             itemNam: itemResult[i].ItemName,
// //                             onHand: itemResult[i].OnHand,
// //                             itmsGrpCod: itemResult[i].ItmsGrpCod,
// //                             foreignName: itemResult[i].ForeignName,
// //                             avgPrice: itemResult[i].AvgPrice,
// //                             dfltWH: itemResult[i].DfltWH,
// //                             weightUnit: itemResult[i].WeightUnit,
// //                             invWeight: itemResult[i].InvWeight,
// //                             ugpCode: itemResult[i].UgpCode,
// //                             preferredVendor: itemResult[i].PreferredVendor,
// //                             vatGourp: itemResult[i].VatGourp,
// //                             taxRate: itemResult[i].TaxRate,
// //                             u_MVATPerStockUnit: itemResult[i].U_MVATPerStockUnit,
// //                             brand: itemResult[i].Brand,
// //                             manufacturer: itemResult[i].Manufacturer,
// //                             invntryUom: itemResult[i].InvntryUom,
// //                             priceUnit: itemResult[i].PriceUnit,
// //                             active: itemResult[i].Active,
// //                             purUom: itemResult[i].PurUom,
// //                             purUoMEntry: itemResult[i].PurUoMEntry,
// //                             saleUom: itemResult[i].SaleUom,
// //                             saleUoMEntry: itemResult[i].SaleUoMEntry,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Item.update(ItFind[0]._id, {
// //                             $set: {
// //                                 itemCode: itemResult[i].ItemCode,
// //                                 itemNam: itemResult[i].ItemName,
// //                                 onHand: itemResult[i].OnHand,
// //                                 itmsGrpCod: itemResult[i].ItmsGrpCod,
// //                                 foreignName: itemResult[i].ForeignName,
// //                                 avgPrice: itemResult[i].AvgPrice,
// //                                 dfltWH: itemResult[i].DfltWH,
// //                                 weightUnit: itemResult[i].WeightUnit,
// //                                 invWeight: itemResult[i].InvWeight,
// //                                 ugpCode: itemResult[i].UgpCode,
// //                                 preferredVendor: itemResult[i].PreferredVendor,
// //                                 vatGourp: itemResult[i].VatGourp,
// //                                 taxRate: itemResult[i].TaxRate,
// //                                 u_MVATPerStockUnit: itemResult[i].U_MVATPerStockUnit,
// //                                 brand: itemResult[i].Brand,
// //                                 manufacturer: itemResult[i].Manufacturer,
// //                                 invntryUom: itemResult[i].InvntryUom,
// //                                 priceUnit: itemResult[i].PriceUnit,
// //                                 active: itemResult[i].Active,
// //                                 purUom: itemResult[i].PurUom,
// //                                 purUoMEntry: itemResult[i].PurUoMEntry,
// //                                 saleUom: itemResult[i].SaleUom,
// //                                 saleUoMEntry: itemResult[i].SaleUoMEntry,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                         // CronResult.insert({
// //                         //     name: 'Items Update Crone',
// //                         //     result: result,
// //                         //     insertCount: insertCount,
// //                         //     updateCount: updateCount,
// //                         //     date: new Date()
// //                         // });
// //                     }
// //                 }
// //             }
// //         });
// //     }
// // });
// // // //

// // //start WhareHouse  Update crone
// // SyncedCron.add({
// //     name: 'WhareHouse Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + wareHouseUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'WhareHouse Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 // response = err;
// //                 console.log("WhareHouse Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let res = result.data.data;
// //                 console.log("WhareHouse Update Crone Success");
// //                 for (let i = 0; i < res.length; i++) {
// //                     let bFind = WareHouse.find({
// //                         whsCode: res[i].WhsCode
// //                     }).fetch();
// //                     if (bFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         WareHouse.insert({
// //                             bPLId: res[i].BPLId,
// //                             whsCode: res[i].WhsCode,
// //                             whsName: res[i].WhsName,
// //                             disabled: res[i].Disabled,
// //                             u_bonded: res[i].U_bonded,
// //                             u_salable: res[i].U_salable,
// //                             u_vansalewh: res[i].U_vansalewh,
// //                             inactive: res[i].Inactive,
// //                             u_cashAcct: res[i].U_CashAcct,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         WareHouse.update(bFind[0]._id, {
// //                             $set: {
// //                                 bPLId: res[i].BPLId,
// //                                 whsCode: res[i].WhsCode,
// //                                 whsName: res[i].WhsName,
// //                                 disabled: res[i].Disabled,
// //                                 u_bonded: res[i].U_bonded,
// //                                 u_salable: res[i].U_salable,
// //                                 u_vansalewh: res[i].U_vansalewh,
// //                                 inactive: res[i].Inactive,
// //                                 u_cashAcct: res[i].U_CashAcct,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'WhareHouse Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }

// //         });
// //         // return response;
// //     }
// // });
// // // // end whareHouse crone

// // // //cron ItemSpecialPrice Update
// // SyncedCron.add({
// //     name: 'ItemSpecialPrice Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let url = base_url + itemSpecialPriceUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'ItemSpecialPrice Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("ItemSpecialPrice Update  Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let itemSpecialPriceResult = result.data.data;
// //                 console.log("ItemSpecialPrice Update Crone Res Success");
// //                 for (let i = 0; i < itemSpecialPriceResult.length; i++) {
// //                     let ItFind = ItemSpecialPrice.find({
// //                         itemCode: itemSpecialPriceResult[i].ItemCode
// //                     }).fetch();
// //                     if (ItFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         ItemSpecialPrice.insert({
// //                             itemCode: itemSpecialPriceResult[i].ItemCode,
// //                             cardCode: itemSpecialPriceResult[i].CardCode,
// //                             priceList: itemSpecialPriceResult[i].PriceList,
// //                             specialPrice: itemSpecialPriceResult[i].SpecialPrice,
// //                             currency: itemSpecialPriceResult[i].Currency,
// //                             discount: itemSpecialPriceResult[i].Discount,
// //                             valid: itemSpecialPriceResult[i].Valid,
// //                             uomEntry: itemSpecialPriceResult[i].UomEntry,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         ItemSpecialPrice.update(ItFind[0]._id, {
// //                             $set: {
// //                                 itemCode: itemSpecialPriceResult[i].ItemCode,
// //                                 cardCode: itemSpecialPriceResult[i].CardCode,
// //                                 priceList: itemSpecialPriceResult[i].PriceList,
// //                                 specialPrice: itemSpecialPriceResult[i].SpecialPrice,
// //                                 currency: itemSpecialPriceResult[i].Currency,
// //                                 discount: itemSpecialPriceResult[i].Discount,
// //                                 valid: itemSpecialPriceResult[i].Valid,
// //                                 uomEntry: itemSpecialPriceResult[i].UomEntry,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'ItemSpecialPrice Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // // 

// // // //crone WareHouse STock Update
// // SyncedCron.add({
// //     name: 'WareHouse Stock update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 3 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + wareHouseStockUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             // timeout: 180000,
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (errData, resultData) => {
// //             console.log("*********************wareHouseStock Update Crone send********************");
// //             if (errData) {
// //                 console.log("xxxxxxxxxxxxxxxxxxxWareHouse Stock update Crone Errxxxxxxxxxxxxxxxxxxxxxxxxx", errData);
// //                 // CronResult.insert({
// //                 //     name: 'wareHouse Stock Update Crone',
// //                 //     result: err,
// //                 //     cronDate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss A"),
// //                 //     createdAt: new Date()
// //                 // });
// //                 return errData;
// //             // } else if (result.data !== null && result.data !== undefined) {
// //             } else {
// //                 console.log("++++++++++++++++//////////////////WareHouse Stock update Crone Res//////////////////////+++++++++++++++++++", resultData);
// //                 let ordrResult = resultData.data.data;
// //                 CronResult.insert({
// //                     name: 'wareHouse Stock Update Crone',
// //                     result: 'success',
// //                     cronDate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss A"),
// //                     createdAt: new Date()
// //                 });
// //                 // response = result;

// //                 for (let i = 0; i < ordrResult.length; i++) {
// //                     let OFind = WareHouseStock.find({
// //                         itemCode: ordrResult[i].ItemCode,
// //                         whsCode: ordrResult[i].WhsCode,
// //                         bPLId: ordrResult[i].BPLId

// //                     }, { sort: { createdAt: -1 } }).fetch();
// //                     if (OFind.length > 0) {
// //                         // updateCount = updateCount + 1;
// //                         WareHouseStock.update(OFind[0]._id, {
// //                             $set: {
// //                                 bPLId: ordrResult[i].BPLId,
// //                                 onHand: ordrResult[i].OnHand,
// //                                 avgPrice: ordrResult[i].AvgPrice,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     } else {
// //                         // insertCount = insertCount + 1;
// //                         WareHouseStock.insert({
// //                             bPLId: ordrResult[i].BPLId,
// //                             itemCode: ordrResult[i].ItemCode,
// //                             whsCode: ordrResult[i].WhsCode,
// //                             avgPrice: ordrResult[i].AvgPrice,
// //                             onHand: ordrResult[i].OnHand,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     }
// //                 }
// //                 CronResult.insert({
// //                     name: 'WareHouse Stock update Crone',
// //                     result: resultData,
// //                     insertCount: insertCount,
// //                     updateCount: updateCount,
// //                     date: new Date()
// //                 });
// //             }
// //         });
// //         // console.log("response", response);
// //         // return response; 
// //     }
// // });
// // // //end crone WareHouse Stock Update

// // //crone pickList updated
// // SyncedCron.add({
// //     name: 'Pick List Updated Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 30 sec');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + pickListUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // response = err;
// //                 // CronResult.insert({
// //                 //     name: 'Pick List Updated Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Pick List Updated Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 // response = result;
// //                 // console.log("result...", result);
// //                 let pickListResult = result.data.data;
// //                 console.log("Pick List Updated Crone Success");
// //                 for (let i = 0; i < pickListResult.length; i++) {
// //                     let PFind = PickList.find({
// //                         cardCode: pickListResult[i].CardCode,
// //                         itemCode: pickListResult[i].ItemCode,
// //                         orderEntry: pickListResult[i].OrderEntry,
// //                         absEntry: pickListResult[i].AbsEntry,
// //                         quantity: pickListResult[i].Quantity,
// //                     }).fetch();
// //                     if (PFind.length > 0) {
// //                         updateCount = updateCount + 1;
// //                         PickList.update(PFind[0]._id, {
// //                             $set: {
// //                                 pickQtty: pickListResult[i].PickQtty,
// //                                 relQtty: pickListResult[i].RelQtty,
// //                                 prevReleas: pickListResult[i].PrevReleas,
// //                                 pickStatus: pickListResult[i].PickStatus,
// //                                 whsCode: pickListResult[i].WhsCode,
// //                                 createDate: pickListResult[i].CreateDate,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     } else {
// //                         let cardName = Customer.findOne({ cardCode: pickListResult[i].CardCode, }).cardName;
// //                         let itemName = Item.findOne({ itemCode: pickListResult[i].ItemCode }).itemNam;
// //                         let orderDetail = Order.findOne({ docEntry: pickListResult[i].OrderEntry });
// //                         let priceMode = '';
// //                         let orderId = '';
// //                         let docDueDate = '';
// //                         let docDate = '';
// //                         if (orderDetail) {
// //                             priceMode = orderDetail.priceMode;
// //                             orderId = orderDetail.orderId;
// //                             docDueDate = orderDetail.docDueDate;
// //                             docDate = orderDetail.docDate;
// //                         } else {
// //                             priceMode = '';
// //                             orderId = '';
// //                             docDueDate = '';
// //                             docDate = '';
// //                         }
// //                         insertCount = insertCount + 1;
// //                         PickList.insert({
// //                             cardCode: pickListResult[i].CardCode,
// //                             cardName: cardName,
// //                             absEntry: pickListResult[i].AbsEntry,
// //                             orderEntry: pickListResult[i].OrderEntry,
// //                             pickQtty: pickListResult[i].PickQtty,
// //                             pickQtty: pickListResult[i].PickQtty,
// //                             priceMode: priceMode,
// //                             orderId: orderId,
// //                             deliveryDate: docDueDate,
// //                             orderDate: docDate,
// //                             prevReleas: pickListResult[i].PrevReleas,
// //                             itemCode: pickListResult[i].ItemCode,
// //                             itemNam: itemName,
// //                             whsCode: pickListResult[i].WhsCode,
// //                             baseLine: pickListResult[i].BaseLine,
// //                             quantity: pickListResult[i].Quantity,
// //                             pickStatus: pickListResult[i].PickStatus,
// //                             uomEntry: pickListResult[i].UomEntry,
// //                             uomCode: pickListResult[i].UomCode,
// //                             binAbs: pickListResult[i].BinAbs,
// //                             bnPickQty: pickListResult[i].BinPickQty,
// //                             expnsCode: pickListResult[i].ExpnsCode,
// //                             mvatAmt: pickListResult[i].MvatAmt,
// //                             createDate: pickListResult[i].CreateDate,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Pick List Updated Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //         // console.log("pickResponse", response);
// //         // return response;
// //     }
// // });
// // //

// // // //cron Items Category
// // SyncedCron.add({
// //     name: 'Items Category Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + itemGroupsUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Items Category Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Items Category Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let itemGrpResult = result.data.data;
// //                 console.log("Items Category Crone Res Success");
// //                 for (let i = 0; i < itemGrpResult.length; i++) {
// //                     let ItCFind = ItemCategory.find({
// //                         itmsGrpCod: itemGrpResult[i].ItmsGrpCod
// //                     }).fetch();
// //                     if (ItCFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         ItemCategory.insert({
// //                             itmsGrpNam: itemGrpResult[i].ItmsGrpNam,
// //                             itmsGrpCod: itemGrpResult[i].ItmsGrpCod,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         insertCount = updateCount + 1;
// //                         ItemCategory.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 itmsGrpNam: itemGrpResult[i].ItmsGrpNam,
// //                                 itmsGrpCod: itemGrpResult[i].ItmsGrpCod,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Items Category Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //

// // // // let usr = '';
// // // // //User Crone
// // SyncedCron.add({
// //     name: 'User Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 5 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + employeeDataGet_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;

// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'User Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // })
// //                 console.log("User Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let usrResult = result.data.data;
// //                 console.log("User Crone Success ");
// //                 for (let i = 0; i < usrResult.length; i++) {
// //                     if (usrResult[i].SlpCode != '-1' && usrResult[i].Mobil != '' && usrResult[i].Email != '') {
// //                         let uFind = Meteor.users.find({
// //                             slpCode: usrResult[i].SlpCode
// //                         }).fetch();
// //                         if (usrResult[i].U_TL_CODE === '-' || usrResult[i].U_TL_CODE === '') {
// //                             this.supervisor = '';
// //                         } else {
// //                             let supFind = Meteor.users.findOne({
// //                                 u_Sales_Employee_Code: usrResult[i].U_TL_CODE
// //                             })._id;
// //                             if (supFind != undefined) {
// //                                 this.supervisor = supFind;
// //                             }
// //                         }
// //                         if (uFind.length === 0) {
// //                             insertCount = insertCount + 1;
// //                             let userId = Accounts.createUser({
// //                                 profile: {
// //                                     empCode: usrResult[i].SlpCode,
// //                                     firstName: usrResult[i].SlpName,
// //                                     lastName: '',
// //                                     gender: 'Male',
// //                                     dateOfBirth: '',
// //                                     isDeleted: false,
// //                                     image: ''
// //                                 },
// //                                 email: usrResult[i].Email,
// //                                 username: usrResult[i].Mobil,
// //                                 password: 'User@123',
// //                                 createdAt: new Date(),
// //                                 createdBy: 'admin',
// //                                 uuid: Random.id()
// //                             });
// //                             if (userId) {
// //                                 let token = Accounts._generateStampedLoginToken().token;
// //                                 Meteor.setTimeout(function () {
// //                                     Accounts.sendVerificationEmail(userId);
// //                                 }, 1000);
// //                                 // Set user's role    
// //                                 Meteor.users.update(userId, {
// //                                     $set: {
// //                                         token: token,
// //                                         slpCode: usrResult[i].SlpCode,
// //                                         active: usrResult[i].Active,
// //                                         u_Sales_Employee_Code: usrResult[i].U_Sales_Employee_Code,
// //                                         u_TL_CODE: usrResult[i].U_TL_CODE,
// //                                         u_COMPANY_NAME: usrResult[i].U_COMPANY_NAME
// //                                     }
// //                                 });
// //                             };
// //                         } else {
// //                             updateCount = updateCount + 1;
// //                             Meteor.users.update(uFind[0]._id, {
// //                                 $set: {
// //                                     profile: {
// //                                         image: Meteor.users.findOne({
// //                                             _id: uFind[0]._id
// //                                         }).profile.image,
// //                                         empCode: usrResult[i].SlpCode,
// //                                         firstName: usrResult[i].SlpName,
// //                                         lastName: uFind[0].profile.lastName,
// //                                         gender: uFind[0].profile.gender,
// //                                         dateOfBirth: uFind[0].profile.dateOfBirth,
// //                                         isDeleted: false
// //                                     },
// //                                     slpCode: usrResult[i].SlpCode,
// //                                     active: usrResult[i].Active,
// //                                     u_Sales_Employee_Code: usrResult[i].U_Sales_Employee_Code,
// //                                     u_TL_CODE: usrResult[i].U_TL_CODE,
// //                                     u_COMPANY_NAME: usrResult[i].U_COMPANY_NAME,
// //                                     supervisor: this.supervisor,
// //                                     updatedAt: new Date()
// //                                 }
// //                             });
// //                             let oldEmail = uFind[0].emails[0].address;
// //                             Meteor.users.update({
// //                                 _id: uFind[0]._id,
// //                                 'emails.0.address': oldEmail
// //                             }, {
// //                                 $set: {
// //                                     'emails.0.address': usrResult[i].Email,
// //                                     'emails.0.verified': true
// //                                 }
// //                             });
// //                         }
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'User Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //

// // // //cron Unit Group
// // SyncedCron.add({
// //     name: 'Unit Group',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + unitUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Unit Group',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Unit Group Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let itemGrpResult = result.data.data;
// //                 console.log("Unit Group Res Success");
// //                 for (let i = 0; i < itemGrpResult.length; i++) {
// //                     let ItCFind = Unit.find({
// //                         ugpCode: itemGrpResult[i].UgpCode, uomCode: itemGrpResult[i].UomCode
// //                     }).fetch();
// //                     if (ItCFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Unit.insert({
// //                             ugpCode: itemGrpResult[i].UgpCode,
// //                             uomCode: itemGrpResult[i].UomCode,
// //                             baseQty: itemGrpResult[i].BaseQty,
// //                             uomEntry: itemGrpResult[i].UomEntry,
// //                             wghtFactor: itemGrpResult[i].WghtFactor,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Unit.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 ugpCode: itemGrpResult[i].UgpCode,
// //                                 uomCode: itemGrpResult[i].UomCode,
// //                                 baseQty: itemGrpResult[i].BaseQty,
// //                                 uomEntry: itemGrpResult[i].UomEntry,
// //                                 wghtFactor: itemGrpResult[i].WghtFactor,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Unit Group',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //end unit group

// // //  //Getting  Invoice Update List
// // SyncedCron.add({
// //     name: 'Invoice Update List Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + invoiceUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Invoice Update List Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Invoice Update List Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("Invoice Update List Crone Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = '';
// //                     if (deliveryList[i].isArPay === "Y") {
// //                         ItCFind = ArInvoicePayment.find({
// //                             docEntry: deliveryList[i].DocEntry
// //                         }).fetch();
// //                         if (ItCFind.length > 0) {
// //                             updateCount = updateCount + 1;
// //                             ArInvoicePayment.update(ItCFind[0]._id, {
// //                                 $set: {
// //                                     canceled: deliveryList[i].CANCELED,
// //                                     updatedAt: new Date()
// //                                 }
// //                             });
// //                         }
// //                     }
// //                     else {
// //                         ItCFind = Invoice.find({
// //                             docEntry: deliveryList[i].DocEntry
// //                         }).fetch();
// //                         let cardName = Customer.findOne({ cardCode: deliveryList[i].CardCode }).cardName;
// //                         if (ItCFind.length > 0) {

// //                             updateCount = updateCount + 1;
// //                             Invoice.update(ItCFind[0]._id, {
// //                                 $set: {
// //                                     docEntry: deliveryList[i].DocEntry,
// //                                     docNum: deliveryList[i].DocNum,
// //                                     docStatus: deliveryList[i].DocStatus,
// //                                     branch: deliveryList[i].Branch,
// //                                     cardCode: deliveryList[i].CardCode,
// //                                     cardName: cardName,
// //                                     numAtCard: deliveryList[i].NumAtCard,
// //                                     vatPercent: deliveryList[i].VatPercent,
// //                                     vatSum: deliveryList[i].VatSum,
// //                                     address: deliveryList[i].Address,
// //                                     docType: deliveryList[i].DocType,
// //                                     docDate: deliveryList[i].DocDate,
// //                                     docDueDate: deliveryList[i].DocDueDate,
// //                                     docTotal: deliveryList[i].DocTotal,
// //                                     discPrcnt: deliveryList[i].DiscPrcnt,
// //                                     slpCode: deliveryList[i].SlpCode,
// //                                     paidToDate: deliveryList[i].PaidToDate,
// //                                     remarks: deliveryList[i].Remarks,
// //                                     updatedAt: new Date()
// //                                 }
// //                             });
// //                         }
// //                     }
// //                 }


// //                 // CronResult.insert({
// //                 //     name: 'Invoice Update List Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //end update batch

// // //  //Getting  Invoice Update List
// // SyncedCron.add({
// //     name: 'New Invoice Update List Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + invoiceNewUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'New Invoice Update List Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("New Invoice Update List Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("New Invoice Update List Crone Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = Invoice.find({
// //                         docEntry: deliveryList[i].DocEntry
// //                     }).fetch();
// //                     let cardName = Customer.findOne({ cardCode: deliveryList[i].CardCode }).cardName;
// //                     if (ItCFind.length > 0) {

// //                         updateCount = updateCount + 1;
// //                         Invoice.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 docEntry: deliveryList[i].DocEntry,
// //                                 docNum: deliveryList[i].DocNum,
// //                                 docStatus: deliveryList[i].DocStatus,
// //                                 branch: deliveryList[i].Branch,
// //                                 cardCode: deliveryList[i].CardCode,
// //                                 cardName: cardName,
// //                                 numAtCard: deliveryList[i].NumAtCard,
// //                                 vatPercent: deliveryList[i].VatPercent,
// //                                 vatSum: deliveryList[i].VatSum,
// //                                 address: deliveryList[i].Address,
// //                                 docType: deliveryList[i].DocType,
// //                                 docDate: deliveryList[i].DocDate,
// //                                 docDueDate: deliveryList[i].DocDueDate,
// //                                 docTotal: deliveryList[i].DocTotal,
// //                                 discPrcnt: deliveryList[i].DiscPrcnt,
// //                                 slpCode: deliveryList[i].SlpCode,
// //                                 paidToDate: deliveryList[i].PaidToDate,
// //                                 remarks: deliveryList[i].Remarks,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'New Invoice Update List Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //

// // // Invoice Items Update list 
// // SyncedCron.add({
// //     name: 'Invoice Items Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + invoiceItemUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Invoice Items Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Invoice Items Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("Invoice Items Update Crone Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = Invoice.find({
// //                         docEntry: deliveryList[i].DocEntry
// //                     }).fetch();
// //                     let itemNam = Item.findOne({ itemCode: deliveryList[i].ItemCode }).itemNam;
// //                     if (ItCFind.length > 0) {
// //                         let delveryItems = [];
// //                         delveryItems = ItCFind[0].itemLines;
// //                         if (delveryItems !== '' && delveryItems !== undefined) {
// //                             for (let l = 0; l < delveryItems.length; l++) {
// //                                 if (delveryItems[l].itemCode === deliveryList[i].ItemCode) {
// //                                     delveryItems[l].baseRef = deliveryList[i].BaseRef;
// //                                     delveryItems[l].docEntry = deliveryList[i].DocEntry;
// //                                     delveryItems[l].baseType = deliveryList[i].BaseType;
// //                                     delveryItems[l].baseEntry = deliveryList[i].BaseEntry;
// //                                     delveryItems[l].itemCode = deliveryList[i].ItemCode;
// //                                     delveryItems[l].itemNam = itemNam;
// //                                     delveryItems[l].quantity = deliveryList[i].Quantity;
// //                                     delveryItems[l].price = deliveryList[i].Price;
// //                                     delveryItems[l].openQty = deliveryList[i].OpenQty;
// //                                     delveryItems[l].pickStatus = deliveryList[i].PickStatus;
// //                                     delveryItems[l].pickOty = deliveryList[i].PickOty;
// //                                     delveryItems[l].whsCode = deliveryList[i].WhsCode;
// //                                     delveryItems[l].trgetEntry = deliveryList[i].TrgetEntry;
// //                                     delveryItems[l].uomCode = deliveryList[i].UomCode;
// //                                     delveryItems[l].uomEntry = deliveryList[i].UomEntry;
// //                                     delveryItems[l].updatedAt = new Date();
// //                                 }
// //                             }
// //                             let entry = delveryItems.find(function (e) { return e.itemCode === deliveryList[i].ItemCode; });
// //                             if (!entry) {
// //                                 let itemData = {
// //                                     baseRef: deliveryList[i].BaseRef,
// //                                     docEntry: deliveryList[i].DocEntry,
// //                                     baseType: deliveryList[i].BaseType,
// //                                     baseEntry: deliveryList[i].BaseEntry,
// //                                     itemCode: deliveryList[i].ItemCode,
// //                                     itemNam: itemNam,
// //                                     quantity: deliveryList[i].Quantity,
// //                                     price: deliveryList[i].Price,
// //                                     openQty: deliveryList[i].OpenQty,
// //                                     pickStatus: deliveryList[i].PickStatus,
// //                                     pickOty: deliveryList[i].PickOty,
// //                                     whsCode: deliveryList[i].WhsCode,
// //                                     trgetEntry: deliveryList[i].TrgetEntry,
// //                                     uomCode: deliveryList[i].UomCode,
// //                                     uomEntry: deliveryList[i].UomEntry,
// //                                     updatedAt: new Date()
// //                                 }
// //                                 delveryItems.push(itemData);
// //                             }
// //                         } else {
// //                             delveryItems = [];
// //                             let itemData = {
// //                                 baseRef: deliveryList[i].BaseRef,
// //                                 docEntry: deliveryList[i].DocEntry,
// //                                 baseType: deliveryList[i].BaseType,
// //                                 baseEntry: deliveryList[i].BaseEntry,
// //                                 itemCode: deliveryList[i].ItemCode,
// //                                 itemNam: itemNam,
// //                                 quantity: deliveryList[i].Quantity,
// //                                 price: deliveryList[i].Price,
// //                                 openQty: deliveryList[i].OpenQty,
// //                                 pickStatus: deliveryList[i].PickStatus,
// //                                 pickOty: deliveryList[i].PickOty,
// //                                 whsCode: deliveryList[i].WhsCode,
// //                                 trgetEntry: deliveryList[i].TrgetEntry,
// //                                 uomCode: deliveryList[i].UomCode,
// //                                 uomEntry: deliveryList[i].UomEntry,
// //                                 updatedAt: new Date()
// //                             }
// //                             delveryItems.push(itemData);
// //                         }
// //                         updateCount = updateCount + 1;
// //                         Invoice.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 itemLines: delveryItems,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Invoice Items Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // end delivery Item

// // // // //cron State Full
// // SyncedCron.add({
// //     name: 'State Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 2 hours');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + stateDataGet_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'State Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("State Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let countryResult = result.data.data;
// //                 console.log("State Crone Res Success");
// //                 for (let i = 0; i < countryResult.length; i++) {
// //                     let countryFind = State.find({
// //                         code: countryResult[i].Code
// //                     }).fetch();
// //                     if (countryFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         State.insert({
// //                             code: countryResult[i].Code,
// //                             country: countryResult[i].Country,
// //                             name: countryResult[i].Name,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         State.update(countryFind[0]._id, {
// //                             $set: {
// //                                 code: countryResult[i].Code,
// //                                 country: countryResult[i].Country,
// //                                 name: countryResult[i].Name,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'State Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //

// // // // //cron Country Full
// // SyncedCron.add({
// //     name: 'Country Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 2 hours');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + countryDataGet_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Country Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Country Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let countryResult = result.data.data;
// //                 console.log("Country Crone Res Success");
// //                 for (let i = 0; i < countryResult.length; i++) {
// //                     let countryFind = Country.find({
// //                         code: countryResult[i].Code
// //                     }).fetch();
// //                     if (countryFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Country.insert({
// //                             code: countryResult[i].Code,
// //                             name: countryResult[i].Name,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Country.update(countryFind[0]._id, {
// //                             $set: {
// //                                 code: countryResult[i].Code,
// //                                 name: countryResult[i].Name,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Country Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //
// // //  //Getting  batch Update
// // SyncedCron.add({
// //     name: 'Batch Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + batchUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Batch Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Batch Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("Batch Update Crone Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = Batch.find({
// //                         itemCode: deliveryList[i].ItemCode, batchNumber: deliveryList[i].BatchNumber
// //                     }).fetch();
// //                     if (ItCFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Batch.insert({
// //                             itemCode: deliveryList[i].ItemCode,
// //                             batchNumber: deliveryList[i].BatchNumber,
// //                             expDate: deliveryList[i].ExpDate,
// //                             whsCode: deliveryList[i].WhsCode,
// //                             inDate: deliveryList[i].InDate,
// //                             quantity: deliveryList[i].Quantity,
// //                             createdAt: new Date()
// //                         })
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Batch.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 itemCode: deliveryList[i].ItemCode,
// //                                 batchNumber: deliveryList[i].BatchNumber,
// //                                 expDate: deliveryList[i].ExpDate,
// //                                 whsCode: deliveryList[i].WhsCode,
// //                                 inDate: deliveryList[i].InDate,
// //                                 quantity: deliveryList[i].Quantity,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Batch Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //end update batch

// // //  //Getting  batch New
// // SyncedCron.add({
// //     name: 'Batch New Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 2 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + batchNewUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Batch New Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Batch Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("Batch Crone Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = Batch.find({
// //                         itemCode: deliveryList[i].ItemCode, batchNumber: deliveryList[i].BatchNumber
// //                     }).fetch();
// //                     if (ItCFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Batch.insert({
// //                             itemCode: deliveryList[i].ItemCode,
// //                             batchNumber: deliveryList[i].BatchNumber,
// //                             expDate: deliveryList[i].ExpDate,
// //                             whsCode: deliveryList[i].WhsCode,
// //                             inDate: deliveryList[i].InDate,
// //                             quantity: deliveryList[i].Quantity,
// //                             createdAt: new Date()
// //                         })
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Batch.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 itemCode: deliveryList[i].ItemCode,
// //                                 batchNumber: deliveryList[i].BatchNumber,
// //                                 expDate: deliveryList[i].ExpDate,
// //                                 whsCode: deliveryList[i].WhsCode,
// //                                 inDate: deliveryList[i].InDate,
// //                                 quantity: deliveryList[i].Quantity,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Batch New Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //end new batch

// // // crone bin 
// // SyncedCron.add({
// //     name: 'Bin Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + binDataUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Bin Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Bin Update Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let binResult = result.data.data;
// //                 console.log("Bin Update Crone Res Success");
// //                 for (let i = 0; i < binResult.length; i++) {
// //                     let BFind = Bin.find({
// //                         binCode: binResult[i].BinCode
// //                     }).fetch();
// //                     if (BFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Bin.insert({
// //                             binCode: binResult[i].BinCode,
// //                             whsCode: binResult[i].WhsCode,
// //                             absEntry: binResult[i].AbsEntry,
// //                             descr: binResult[i].Descr,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Bin.update(BFind[0]._id, {
// //                             $set: {
// //                                 binCode: binResult[i].BinCode,
// //                                 whsCode: binResult[i].WhsCode,
// //                                 absEntry: binResult[i].AbsEntry,
// //                                 descr: binResult[i].Descr,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Bin Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //

// // // crone bin Quantity
// // SyncedCron.add({
// //     name: 'Bin Quantity Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + binQuantityUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Bin Quantity Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Bin Quantity Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let binResult = result.data.data;
// //                 console.log("Bin Quantity Crone Res Success");
// //                 for (let i = 0; i < binResult.length; i++) {
// //                     let BFind = BinQuantity.find({
// //                         absEntry: binResult[i].AbsEntry//            
// //                     }).fetch();
// //                     if (BFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         BinQuantity.insert({
// //                             absEntry: binResult[i].AbsEntry,
// //                             itemCode: binResult[i].ItemCode,
// //                             whsCode: binResult[i].WhsCode,
// //                             onHandQty: binResult[i].OnHandQty,
// //                             binAbs: binResult[i].BinAbs,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     }
// //                     else {
// //                         updateCount = updateCount + 1;
// //                         BinQuantity.update(BFind[0]._id, {
// //                             $set: {
// //                                 absEntry: binResult[i].AbsEntry,
// //                                 itemCode: binResult[i].ItemCode,
// //                                 whsCode: binResult[i].WhsCode,
// //                                 onHandQty: binResult[i].OnHandQty,
// //                                 binAbs: binResult[i].BinAbs,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Bin Quantity Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // //

// // // // cron Currency Full
// // SyncedCron.add({
// //     name: 'Currency Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + currencyDataGet_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Currency Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Currency Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let currencyResult = result.data.data;
// //                 console.log("Currency Crone Res Success");
// //                 for (let i = 0; i < currencyResult.length; i++) {
// //                     let CurFind = Currency.find({
// //                         currCode: currencyResult[i].CurrCode
// //                     }).fetch();
// //                     if (CurFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Currency.insert({
// //                             currCode: currencyResult[i].CurrCode,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Currency.update(CurFind[0]._id, {
// //                             $set: {
// //                                 currCode: currencyResult[i].CurrCode,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Currency Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // // //

// // // start branch crone
// // SyncedCron.add({
// //     name: 'Branch Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + branchUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Branch Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Branch Crone Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let res = result.data.data;
// //                 console.log("Branch Crone Res Success");
// //                 for (let i = 0; i < res.length; i++) {
// //                     let bFind = Branch.find({
// //                         bPLId: res[i].BPLId
// //                     }).fetch();
// //                     if (bFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Branch.insert({
// //                             bPLId: res[i].BPLId,
// //                             bPLName: res[i].BPLName,
// //                             dflWhs: res[i].DflWhs,
// //                             disabled: res[i].Disabled,
// //                             address: res[i].Address,
// //                             pmtClrAct: res[i].PmtClrAct,
// //                             acctName: res[i].AcctName,
// //                             dflCust: res[i].DflCust,
// //                             dflVendor: res[i].DflVendor,
// //                             streetNo: res[i].StreetNo,
// //                             u_cashAcct: res[i].U_CashAcct,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Branch.update(bFind[0]._id, {
// //                             $set: {
// //                                 bPLId: res[i].BPLId,
// //                                 bPLName: res[i].BPLName,
// //                                 dflWhs: res[i].DflWhs,
// //                                 disabled: res[i].Disabled,
// //                                 address: res[i].Address,
// //                                 pmtClrAct: res[i].PmtClrAct,
// //                                 // acctName: res[i].AcctName,
// //                                 dflCust: res[i].DflCust,
// //                                 dflVendor: res[i].DflVendor,
// //                                 streetNo: res[i].StreetNo,
// //                                 u_cashAcct: res[i].U_CashAcct,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Branch Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // // end branch crone

// // // // cron Tax Full
// // SyncedCron.add({
// //     name: 'Tax Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + taxUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Tax Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Tax Cron Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let taxResult = result.data.data;
// //                 console.log("Tax Cron Res Success");
// //                 for (let i = 0; i < taxResult.length; i++) {
// //                     let TaxFind = Tax.find({
// //                         taxCode: taxResult[i].TaxCode
// //                     }).fetch();
// //                     if (TaxFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         Tax.insert({
// //                             taxCode: taxResult[i].TaxCode,
// //                             name: taxResult[i].Name,
// //                             rate: taxResult[i].Rate,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Tax.update(TaxFind[0]._id, {
// //                             $set: {
// //                                 taxCode: taxResult[i].TaxCode,
// //                                 name: taxResult[i].Name,
// //                                 rate: taxResult[i].Rate,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Tax Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // // //

// // //  //Getting  CreditNote List
// // SyncedCron.add({
// //     name: 'Credit Note Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + creditNoteUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Credit Note Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Credit Note Update Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("Credit Note Update Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = CreditNote.find({
// //                         docEntry: deliveryList[i].DocEntry
// //                     }).fetch();
// //                     let cardName = Customer.findOne({ cardCode: deliveryList[i].CardCode }).cardName;
// //                     if (ItCFind.length === 0) {

// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         CreditNote.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 docEntry: deliveryList[i].DocEntry,
// //                                 docNum: deliveryList[i].DocNum,
// //                                 docStatus: deliveryList[i].DocStatus,
// //                                 branch: deliveryList[i].Branch,
// //                                 cardCode: deliveryList[i].CardCode,
// //                                 cardName: cardName,
// //                                 numAtCard: deliveryList[i].NumAtCard,
// //                                 discSum: deliveryList[i].DiscSum,
// //                                 address: deliveryList[i].Address,
// //                                 docDate: deliveryList[i].DocDate,
// //                                 docDueDate: deliveryList[i].DocDueDate,
// //                                 docTotal: deliveryList[i].DocTotal,
// //                                 discPrcnt: deliveryList[i].DiscPrcnt,
// //                                 slpCode: deliveryList[i].SlpCode,
// //                                 paidToDate: deliveryList[i].PaidToDate,
// //                                 remarks: deliveryList[i].Remarks,
// //                                 vatSum: deliveryList[i].VatSum,
// //                                 vatPercent: deliveryList[i].VatPercent,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Credit Note Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }

// // });
// // //end CreditNote list

// // //      // Credit NoteItems Full list 
// // SyncedCron.add({
// //     name: 'Credit Note  Items Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + creditNoteItemUpdatePost_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019-03-22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Credit Note  Items Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 console.log("Credit Note Item Update Err", err);
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let deliveryList = result.data.data;
// //                 console.log("Credit Note Item Update Res Success");
// //                 for (let i = 0; i < deliveryList.length; i++) {
// //                     let ItCFind = CreditNote.find({
// //                         docEntry: deliveryList[i].DocEntry
// //                     }).fetch();
// //                     if (ItCFind.length > 0) {
// //                         let delveryItems = [];
// //                         delveryItems = ItCFind[0].itemLines;
// //                         if (delveryItems !== '' && delveryItems !== undefined) {
// //                             for (let l = 0; l < delveryItems.length; l++) {
// //                                 if (delveryItems[l].itemCode === deliveryList[i].ItemCode) {
// //                                     delveryItems[l].baseRef = deliveryList[i].BaseRef;
// //                                     delveryItems[l].docEntry = deliveryList[i].DocEntry;
// //                                     delveryItems[l].baseType = deliveryList[i].BaseType;
// //                                     delveryItems[l].baseEntry = deliveryList[i].BaseEntry;
// //                                     delveryItems[l].itemCode = deliveryList[i].ItemCode;
// //                                     delveryItems[l].quantity = deliveryList[i].Quantity;
// //                                     delveryItems[l].price = deliveryList[i].Price;
// //                                     delveryItems[l].lineVat = deliveryList[i].LineVat;
// //                                     delveryItems[l].itemName = deliveryList[i].ItemName;
// //                                     delveryItems[l].whsCode = deliveryList[i].WhsCode;
// //                                     delveryItems[l].currency = deliveryList[i].Currency;
// //                                     delveryItems[l].lineTotal = deliveryList[i].LineTotal;
// //                                     delveryItems[l].docDate = deliveryList[i].DocDate;
// //                                     delveryItems[l].baseCard = deliveryList[i].BaseCard;
// //                                     delveryItems[l].discPrcnt = deliveryList[i].DiscPrcnt;
// //                                     delveryItems[l].vatPrcnt = deliveryList[i].VatPrcnt;
// //                                     delveryItems[l].vatSum = deliveryList[i].VatSum;
// //                                     delveryItems[l].priceBefDi = deliveryList[i].PriceBefDi;
// //                                     delveryItems[l].uomEntry = deliveryList[i].UomEntry;
// //                                     delveryItems[l].uomCode = deliveryList[i].UomCode;
// //                                     delveryItems[l].updatedAt = new Date();
// //                                 }
// //                             }
// //                             let entry = delveryItems.find(function (e) { return e.itemCode === deliveryList[i].ItemCode; });
// //                             if (!entry) {
// //                                 let itemData = {
// //                                     baseRef: deliveryList[i].BaseRef,
// //                                     docEntry: deliveryList[i].DocEntry,
// //                                     baseType: deliveryList[i].BaseType,
// //                                     baseEntry: deliveryList[i].BaseEntry,
// //                                     itemCode: deliveryList[i].ItemCode,
// //                                     quantity: deliveryList[i].Quantity,
// //                                     price: deliveryList[i].Price,
// //                                     whsCode: deliveryList[i].WhsCode,
// //                                     lineVat: deliveryList[i].LineVat,
// //                                     itemName: deliveryList[i].ItemName,
// //                                     currency: deliveryList[i].Currency,
// //                                     lineTotal: deliveryList[i].LineTotal,
// //                                     docDate: deliveryList[i].DocDate,
// //                                     baseCard: deliveryList[i].BaseCard,
// //                                     discPrcnt: deliveryList[i].DiscPrcnt,
// //                                     vatPrcnt: deliveryList[i].VatPrcnt,
// //                                     vatSum: deliveryList[i].VatSum,
// //                                     priceBefDi: deliveryList[i].PriceBefDi,
// //                                     uomEntry: deliveryList[i].UomEntry,
// //                                     uomCode: deliveryList[i].UomCode,
// //                                     updatedAt: new Date()
// //                                 }
// //                                 delveryItems.push(itemData);
// //                             }
// //                         } else {
// //                             delveryItems = [];
// //                             let itemData = {
// //                                 baseRef: deliveryList[i].BaseRef,
// //                                 docEntry: deliveryList[i].DocEntry,
// //                                 baseType: deliveryList[i].BaseType,
// //                                 baseEntry: deliveryList[i].BaseEntry,
// //                                 itemCode: deliveryList[i].ItemCode,
// //                                 quantity: deliveryList[i].Quantity,
// //                                 price: deliveryList[i].Price,
// //                                 whsCode: deliveryList[i].WhsCode,
// //                                 lineVat: deliveryList[i].LineVat,
// //                                 itemName: deliveryList[i].ItemName,
// //                                 currency: deliveryList[i].Currency,
// //                                 lineTotal: deliveryList[i].LineTotal,
// //                                 docDate: deliveryList[i].DocDate,
// //                                 baseCard: deliveryList[i].BaseCard,
// //                                 discPrcnt: deliveryList[i].DiscPrcnt,
// //                                 vatPrcnt: deliveryList[i].VatPrcnt,
// //                                 vatSum: deliveryList[i].VatSum,
// //                                 priceBefDi: deliveryList[i].PriceBefDi,
// //                                 uomEntry: deliveryList[i].UomEntry,
// //                                 uomCode: deliveryList[i].UomCode,
// //                                 updatedAt: new Date()
// //                             }
// //                             delveryItems.push(itemData);
// //                         }
// //                         updateCount = updateCount + 1;
// //                         CreditNote.update(ItCFind[0]._id, {
// //                             $set: {
// //                                 itemLines: delveryItems,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Credit Note Items Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // //credit note item update

// // // start WhareHouse  Update crone
// // SyncedCron.add({
// //     name: 'Default WhareHouse Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + itemDfltWarehouseUpdated_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Default WhareHouse Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 // response = err;
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let res = result.data.data;
// //                 for (let i = 0; i < res.length; i++) {
// //                     let bFind = WareHouse.find({
// //                         whsCode: res[i].WhsCode
// //                     }).fetch();
// //                     if (bFind.length === 0) {
// //                         insertCount = insertCount + 1;
// //                         DefaultWareHouse.insert({
// //                             bPLId: res[i].BPLId,
// //                             itemCode: res[i].ItemCode,
// //                             itemNam: res[i].ItemName,
// //                             whsCode: res[i].WhsCode,
// //                             whsName: res[i].WhsName,
// //                             createdAt: new Date(),
// //                             uuid: Random.id()
// //                         });
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         DefaultWareHouse.update(bFind[0]._id, {
// //                             $set: {
// //                                 bPLId: res[i].BPLId,
// //                                 itemCode: res[i].ItemCode,
// //                                 itemNam: res[i].ItemName,
// //                                 whsCode: res[i].WhsCode,
// //                                 whsName: res[i].WhsName,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Default WhareHouse Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //         // return response;
// //     }
// // });
// // // // end whareHouse crone

// // // start Customer branch  Update crone
// // SyncedCron.add({
// //     name: 'Customer Branch Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + customerBranchUpdate_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         // let response = '';
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Customer Branch Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 // response = err;
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 console.log("result5555", result);
// //                 let results = result.data.data;
// //                 for (let i = 0; i < results.length; i++) {
// //                     let find = Customer.find({ cardCode: results[i].CardCode }).fetch();
// //                     let nameArr = [];
// //                     nameArr = results[i].Branches.split(',');
// //                     if (find.length !== 0) {
// //                         if (find[0].cardType !== "L") {
// //                             Customer.update(find[0]._id, {
// //                                 $set: {
// //                                     bPLId: nameArr,
// //                                     updatedAt: new Date()
// //                                 }
// //                             });
// //                         }
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Customer Branch Update Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //         // return response;
// //     }
// // });
// // SyncedCron.add({
// //     name: 'Customer Balance Update Crone',
// //     schedule: function (parser) {
// //         // parser is a later.parse object
// //         return parser.text('every 1 min');
// //     },
// //     job: function () {
// //         let base_url = Config.findOne({
// //             name: 'base_url'
// //         }).value;
// //         let dbId = Config.findOne({
// //             name: 'dbId'
// //         }).value;
// //         let url = base_url + customerBalanceUpdate_Url;
// //         let date = moment(new Date()).format("YYYY.MM.DD");
// //         let fullDate = date + " 00:00:00.000";
// //         let dataArray = {
// //             dated: fullDate,
// //             dbId: dbId
// //             // "2019.03.22 00:00:00.000",
// //         }
// //         let options = {
// //             data: dataArray,
// //             headers: {
// //                 'content-type': 'application/json'
// //             },
// //             timeout: 60000
// //         };
// //         let insertCount = 0;
// //         let updateCount = 0;
// //         HTTP.call("POST", url, options, (err, result) => {
// //             if (err) {
// //                 // CronResult.insert({
// //                 //     name: 'Customer Balance Update Crone',
// //                 //     result: err,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //                 return err;
// //             } else if (result.data !== null && result.data !== undefined) {
// //                 let results = result.data.data;
// //                 console.log("Customer Balance Update Crone Res Success");
// //                 for (let i = 0; i < results.length; i++) {
// //                     let find = Customer.find({
// //                         cardCode: results[i].CardCode
// //                     }).fetch();
// //                     if (find.length === 0) {
// //                     } else {
// //                         updateCount = updateCount + 1;
// //                         Customer.update(find[0]._id, {
// //                             $set: {
// //                                 balance: results[i].Balance,
// //                                 updatedAt: new Date()
// //                             }
// //                         });
// //                     }
// //                 }
// //                 // CronResult.insert({
// //                 //     name: 'Customer Balance Crone',
// //                 //     result: result,
// //                 //     insertCount: insertCount,
// //                 //     updateCount: updateCount,
// //                 //     date: new Date()
// //                 // });
// //             }
// //         });
// //     }
// // });
// // // // cron customer update end


// // // cron jobs for Route Complete

// SyncedCron.add({
//     name: 'Route Complete Cron',
//     schedule: function (parser) {
//         // parser is a later.parse object
//         return parser.text('at 11:59 pm');
//     },
//     job: function () {
//         let today = moment(new Date()).format("DD-MM-YYYY");
//         console.log("today", today);
//         let routeRes = RouteAssign.find({
//             routeDateEnd: today,
//             $or: [{ routeStatus: 'Not Started' }, { routeStatus: 'Active' }, { routeStatus: 'Assigned' }]
//         }).fetch();

//         if (routeRes !== undefined && routeRes.length > 0) {
//             for (let i = 0; i < routeRes.length; i++) {
//                 RouteAssign.update(routeRes[i]._id, {
//                     $set: {
//                         routeStatus: 'Completed',
//                         remark: 'Time limit exceeded',
//                         routeForcefullyCompleted: true
//                     }
//                 });
//                 console.log("i", i);
//             }
//         }
//     }
// });