/**
 * @author Nithin
 */

import {SdPriceType} from "../sdPriceType";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   SdPriceType._ensureIndex({ uuid: 1 }, {  unique: true  });  
   SdPriceType._ensureIndex({ createdAt: 1 }, { unique: false }); 
  publishPagination(SdPriceType); 
}); 
