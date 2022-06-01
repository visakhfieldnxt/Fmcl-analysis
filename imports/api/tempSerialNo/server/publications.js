/**
 * @author Visakh
 */

import {TempSerialNo} from "../tempSerialNo";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => { 

  TempSerialNo.createIndex({ uuid: 1}, { unique: true}); 
  publishPagination(TempSerialNo);

});

