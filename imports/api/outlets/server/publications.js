/**
 * @author Nithin
 */

import {Outlets} from "../outlets";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
  Outlets._ensureIndex({ uuid: 1 }, {  unique: true  });  
  Outlets._ensureIndex({ createdAt: 1 }, {  unique: false  });  
  publishPagination(Outlets); 
}); 
