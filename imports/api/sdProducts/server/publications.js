/**
 * @author Nithin
 */

import {SdProducts} from "../sdProducts";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   SdProducts._ensureIndex({ uuid: 1 }, {  unique: true  }); 
   SdProducts._ensureIndex({ createdAt: 1 }, { unique: false });  
  publishPagination(SdProducts); 
}); 
