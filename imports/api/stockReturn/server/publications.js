/**
 * @author Nithin
 */

import {StockReturn} from "../stockReturn";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   StockReturn._ensureIndex({ uuid: 1 }, {  unique: true  }); 
   StockReturn._ensureIndex({ createdAt: 1 }, { unique: false });   
  publishPagination(StockReturn); 
}); 
