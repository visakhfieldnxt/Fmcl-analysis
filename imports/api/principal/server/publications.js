/**
 * @author Visakh
 */

import {Principal} from "../principal";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
  Principal._ensureIndex({ uuid: 1 }, {  unique: true  });  
  Principal._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Principal); 
}); 
