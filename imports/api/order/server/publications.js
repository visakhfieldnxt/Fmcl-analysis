/**
 * @author Visakh
 */

import {publishPagination} from 'meteor/kurounin:pagination';
import {Meteor} from 'meteor/meteor';
import {Order} from '../order';

Meteor.startup(() => {
  Order._ensureIndex({uuid: 1}, {unique: true});  
  Order._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(Order);
 
});

 