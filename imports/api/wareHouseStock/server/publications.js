/**
 * @author Nithin
 */

import {WareHouseStock} from "../wareHouseStock";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */  
   WareHouseStock._ensureIndex({ uuid: 1 }, {  unique: true  });  
   WareHouseStock._ensureIndex({ createdAt: 1 }, { unique: false }); 
  publishPagination(WareHouseStock); 
}); 
