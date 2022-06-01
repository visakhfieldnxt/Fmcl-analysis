/**
 * @author Nithin
 */

import {roles} from "../role";
import {publishPagination} from 'meteor/kurounin:pagination';
import {Meteor} from "meteor/meteor";


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
  roles._ensureIndex({name: 1}, {unique: true});
  publishPagination(roles);
  
});

/**
 * TODO: Complete JS doc
 */
Meteor.publish('role.list', function () {
  return Meteor.roles.find({},{fields:{name:1,homePage:1,permissions:1,rolesUnder:1,isDeleted:1}});

});


