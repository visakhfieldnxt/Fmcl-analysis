/**
 * @author Visakh
 */

import { Notification } from "../notification";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
Notification._ensureIndex({ user: 1 }, { unique: false });
  publishPagination(Notification);

});
/**
 * TODO: Complete JS doc
 */
Meteor.publish('notification.list', function () {
  return Notification.find({userId:Meteor.userId()});

});
