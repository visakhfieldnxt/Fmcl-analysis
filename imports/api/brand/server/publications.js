/**
 * @author Nithin
 */

import {Brand} from "../brand";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
  Brand._ensureIndex({ uuid: 1 }, {  unique: true  });  
  Brand._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Brand); 
}); 
