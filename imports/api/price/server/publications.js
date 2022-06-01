/**
 * @author Nithin
 */

import {Price} from "../price";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   Price._ensureIndex({ uuid: 1 }, {  unique: true  });  
   Price._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Price); 
}); 
