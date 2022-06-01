/**
 * @author Nithin
 */

import {Category} from "../category";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   Category._ensureIndex({ uuid: 1 }, {  unique: true  });  
   Category._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Category); 
}); 
