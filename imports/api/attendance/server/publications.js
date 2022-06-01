/**
 * @author Nithin
 */

import { Attendance } from "../attendance";
import { publishPagination } from 'meteor/kurounin:pagination';

Meteor.startup(() => {
  /**
 * TODO: Complete JS invResult
 */
  Attendance.createIndex({ uuid: 1 }, { unique: false });
  publishPagination(Attendance);

});
/**
 * TODO: Complete JS invResult
 */
Meteor.publish('attendance.list', function () {
  return Attendance.find({});

});
