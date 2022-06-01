/**
 * @author Nithin
 */

import {StockReturnItems} from "../stockReturnItems";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   StockReturnItems._ensureIndex({ uuid: 1 }, {  unique: true  });  
   StockReturnItems._ensureIndex({ createdAt: 1 }, { unique: false });  
  publishPagination(StockReturnItems); 
}); 
