/**
 * @author Nithin
 */

import {TempSerialNo} from "../tempSerialNo";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => { 

  TempSerialNo._ensureIndex({ uuid: 1}, { unique: true}); 
  publishPagination(TempSerialNo);

});

