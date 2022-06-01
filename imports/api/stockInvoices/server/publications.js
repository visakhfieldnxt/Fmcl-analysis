/**
 * @author Nithin
 */

import {StockInvoices} from "../stockInvoices";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   StockInvoices._ensureIndex({ uuid: 1 }, {  unique: true  });  
   StockInvoices._ensureIndex({ createdAt: 1 }, { unique: false });  
  publishPagination(StockInvoices); 
}); 
