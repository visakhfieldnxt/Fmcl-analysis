/**
 * @author Visakh
 */

import {roles} from "../role";
import {publishPagination} from 'meteor/kurounin:pagination';
import {Meteor} from "meteor/meteor";


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
  roles.createIndex({name: 1}, {unique: true});
  publishPagination(roles);
  
});

/**
 * TODO: Complete JS doc
 */
Meteor.publish('role.list', function () {
  return Meteor.roles.find({});

});


