/**
 * @author Visakh
 */

import {Delivery} from "../delivery";
import {publishPagination} from 'meteor/kurounin:pagination';

Meteor.startup(() => { 
/**
 * TODO: Complete JS 
 */
  Delivery._ensureIndex({    uuid: 1  }, {    unique: true  });
  Delivery._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Delivery);
  
});

/**
 * TODO: Complete JS itemResult
 */
Meteor.publish('delivery.list', function () {
  return Delivery.find({});

});
/**
 * TODO: Complete JS itemResult
 */
Meteor.publish('deliveryFiltered.list', function () {
  return Delivery.find({},{sort:{uuid:1},fields:{uuid:1,docEntry:1,docNum:1,docStatus:1,cardCode:1,address:1,
  docType:1,docDate:1,docDueDate:1,docTotal:1,paidDpm:1,remarks:1,itemLines:1}});
 });
 /**
 * TODO: Complete JS itemResult
 */
Meteor.publish('deliverySpecific.list', function (deliveryId) {
  return Delivery.find({uuid:deliveryId},{sort:{uuid:1},fields:{uuid:1,docEntry:1,docNum:1,docStatus:1,cardCode:1,address:1,
  docType:1,docDate:1,docDueDate:1,docTotal:1,paidDpm:1,remarks:1,itemLines:1}});
 });
