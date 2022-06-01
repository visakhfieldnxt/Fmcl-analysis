/**
 * @author Nithin
 */

import {Branch} from "../branch";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
  Branch._ensureIndex({ uuid: 1 }, {  unique: true  });  
  Branch._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Branch); 
}); 
