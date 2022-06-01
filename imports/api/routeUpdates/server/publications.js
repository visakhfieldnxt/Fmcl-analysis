/**
 * @author Nithin
 */

import { RouteUpdates } from "../routeUpdates";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
RouteUpdates.createIndex({ uuid: 1 }, { unique: true });
  publishPagination(RouteUpdates);

});
/**
 * TODO: Complete JS doc
 */
Meteor.publish('routeUpdates.list', function () {
  return RouteUpdates.find({});

});
