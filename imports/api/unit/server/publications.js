/**
 * @author Nithin
 */

import {Unit} from "../unit";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   Unit._ensureIndex({ uuid: 1 }, {  unique: true  });  
   Unit._ensureIndex({ createdAt: 1 }, { unique: false });  
  publishPagination(Unit); 
}); 
