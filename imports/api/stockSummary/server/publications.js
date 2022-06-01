/**
 * @author Nithin
 */

import {StockSummary} from "../stockSummary";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
  //  StockSummary._ensureIndex({ uuid: 1 }, {  unique: true  });  
   publishPagination(StockSummary); 
}); 
