/**
 * @author Nithin
 */

import { RouteAssign } from "../routeAssign";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
RouteAssign._ensureIndex({ uuid: 1 }, { unique: true });
RouteAssign._ensureIndex({ createdAt: 1 }, { unique: false }); 
  publishPagination(RouteAssign);

});
/**
 * TODO: Complete JS doc
 */
Meteor.publish('routeAssign.list', function () {
  return RouteAssign.find({});

});
