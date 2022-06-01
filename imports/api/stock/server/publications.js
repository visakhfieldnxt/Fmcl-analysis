/**
 * @author Nithin
 */

import {Stock} from "../stock";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   Stock._ensureIndex({ uuid: 1 }, {  unique: true  });  
   Stock._ensureIndex({ createdAt: 1 }, { unique: false });  
  publishPagination(Stock); 
}); 
