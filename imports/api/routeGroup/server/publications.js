/**
 * @author Nithin
 */

import { RouteGroup } from "../routeGroup";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
RouteGroup.createIndex({ uuid: 1 }, { unique: true });
  publishPagination(RouteGroup);

});
/**
 * TODO: Complete JS doc
 */
Meteor.publish('routeGroup.list', function () {
  return RouteGroup.find({});

});
