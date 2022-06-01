/**
 * @author Visakh
 */

import {DirectSale} from "../directSale";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
  DirectSale._ensureIndex({ uuid: 1 }, {  unique: true  });  
  DirectSale._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(DirectSale); 
}); 
