/**
 * @author Nithin
 */

import {Location} from "../location";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   Location._ensureIndex({ uuid: 1 }, {  unique: true  });  
   Location._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Location); 
}); 
