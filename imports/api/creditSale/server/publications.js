/**
 * @author Nithin
 */

import {CreditSale} from "../creditSale";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   CreditSale._ensureIndex({ uuid: 1 }, {  unique: true  });  
   CreditSale._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(CreditSale); 
}); 
