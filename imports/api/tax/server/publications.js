/**
 * @author Visakh
 */

import {Tax} from "../tax";
import {publishPagination} from 'meteor/kurounin:pagination';
import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
    Tax.createIndex({ taxCode : 1}, {unique: true});
    // Tax.createIndex({ }, {unique: false});
  publishPagination(Tax);
});

/**
 * TODO: Complete JS usrResult
 */
Meteor.publish('tax.list', function () {
  // return Tax.find({},{sort:{_id:1},fields:{}});
});
