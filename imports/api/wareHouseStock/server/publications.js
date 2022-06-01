/**
 * @author Visakh
 */

import {WareHouseStock} from "../wareHouseStock";
import {publishPagination} from 'meteor/kurounin:pagination';

Meteor.startup(() => {
  /**
 * TODO: Complete JS invResult
 */
WareHouseStock.createIndex({ uuid: 1 }, { unique: true});
WareHouseStock.createIndex({ whsCode: 1 }, { unique: false});
WareHouseStock.createIndex({ itemCode: 1 }, { unique: false});
WareHouseStock.createIndex({ onHand: 1 }, { unique: false});
  
  
  publishPagination(WareHouseStock);
  
});
/**
 * TODO: Complete JS invResult
 */
Meteor.publish('wareHouseStock.list', function () {
  return WareHouseStock.find({});

});
/**
 * TODO: Complete JS invResult
 */
Meteor.publish('wareHouseStockFiltered.list', function () {  
  return WareHouseStock.find({},{
    fields:{_id:1,whsCode:1,itemCode:1,uuid:1,onHand:1},
    });
});
/**
 * TODO: Complete JS invResult
 */
Meteor.publish('wareHouseStockGet.list', function (itemCode,wareHouse) {  
  return WareHouseStock.find({itemCode:itemCode,whsCode:wareHouse},{
    fields:{whsCode:1,itemCode:1,uuid:1,onHand:1},
    });
});