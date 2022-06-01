/**
 * @author Nithin
 */

import { RouteAssign } from "../routeAssign";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
RouteAssign.createIndex({ uuid: 1 }, { unique: true });
  publishPagination(RouteAssign);

});
/**
 * TODO: Complete JS doc
 */
Meteor.publish('routeAssign.list', function () {
  return RouteAssign.find({});

});
