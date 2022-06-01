/**
 * @author Nithin
 */

import {StockTransferIssued} from "../stockTransferIssued";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   StockTransferIssued._ensureIndex({ uuid: 1 }, {  unique: true  });
   StockTransferIssued._ensureIndex({ createdAt: 1 }, { unique: false });    
  publishPagination(StockTransferIssued); 
}); 
