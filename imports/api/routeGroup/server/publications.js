/**
 * @author Nithin
 */

import { RouteGroup } from "../routeGroup";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
RouteGroup._ensureIndex({ uuid: 1 }, { unique: true });
RouteGroup._ensureIndex({ createdAt: 1 }, { unique: false }); 
  publishPagination(RouteGroup);

});
/**
 * TODO: Complete JS doc
 */
// Meteor.publish('routeGroup.list', function () {
//   return RouteGroup.find({});

// });
