/**
 * @author Nithin
 */

import { Verticals } from "../verticals";
import { publishPagination } from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */ 
  Verticals._ensureIndex({ uuid: 1 }, { unique: true });
  Verticals._ensureIndex({ createdAt: 1 }, { unique: false }); 
  publishPagination(Verticals);
});
