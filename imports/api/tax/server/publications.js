/**
 * @author Greeshma
 */

 import {publishPagination} from 'meteor/kurounin:pagination';
 import {Meteor} from 'meteor/meteor';
 import {Tax} from '../tax';
 
 Meteor.startup(() => {
   publishPagination(Tax);
 });
 Meteor.publish('tax.list', function () {
    return Tax.find();
});
 