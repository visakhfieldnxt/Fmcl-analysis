/**
 * @author Nithin
 */

import {Product} from "../products";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   Product._ensureIndex({ uuid: 1 }, {  unique: true  }); 
   Product._ensureIndex({ createdAt: 1 }, { unique: false }); 
  publishPagination(Product); 
}); 
