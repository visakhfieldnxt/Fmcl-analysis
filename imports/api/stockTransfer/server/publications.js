/**
 * @author Nithin
 */

import {StockTransfer} from "../stockTransfer";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
  StockTransfer._ensureIndex({ uuid: 1 }, {  unique: true  });  
  StockTransfer._ensureIndex({ createdAt: 1 }, { unique: false });  
  publishPagination(StockTransfer); 
}); 
