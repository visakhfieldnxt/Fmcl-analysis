import { Meteor } from 'meteor/meteor';

Template.databaseSync.events({
    'click #dataSync':()=>{
        // Meteor.call('customer.dataSync');
        // Meteor.call('itemCategory.dataSync');
        Meteor.call('item.dataSync');
        // Meteor.call('itemGetPrice.dataSync');
        // Meteor.call('customer.branchSync');
        
    }
});