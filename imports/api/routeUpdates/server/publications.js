/**
 * @author Nithin
 */

import { RouteUpdates } from "../routeUpdates";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
RouteUpdates._ensureIndex({ uuid: 1 }, { unique: true });
RouteUpdates._ensureIndex({ createdAt: 1 }, { unique: false }); 
  publishPagination(RouteUpdates);

});
/**
 * TODO: Complete JS doc
 */
Meteor.publish('routeUpdates.list', function () {
  return RouteUpdates.find({});

});
