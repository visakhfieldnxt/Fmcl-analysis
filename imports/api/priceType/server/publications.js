/**
 * @author Nithin
 */

import {PriceType} from "../priceType";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   PriceType._ensureIndex({ uuid: 1 }, {  unique: true  });  
   PriceType._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(PriceType); 
}); 
