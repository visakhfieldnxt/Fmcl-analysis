/**
 * @author Subrata
 */

import { Meteor } from 'meteor/meteor';
import { Notification } from '../../../api/notification/notification';

Meteor.subscribe('config.list');
Meteor.subscribe('notification.list');

Template.header.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  // new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
});

Template.header.onRendered(function () {
  // new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');


  Meteor.call("roles.vansaleRoleGet", (err, res) => {
    if (!err) {
      Session.setPersistent("vansaleRoles", res);
    }
  });

  Meteor.call("config.latLongGet", (err, res) => {
    if (!err) {
      Session.setPersistent("locationLat", res.latitudeVal);
      Session.setPersistent("locationLng", res.longitudeVal);
    }
  });

  Meteor.call("config.currencyGet", (err, res) => {
    if (!err) {
      Session.setPersistent("currencyValues", res);
    }
  });

  Meteor.setInterval(function () {
    Meteor.call("locationNotification.getData", (err, res) => {
      if (!err) {
        Session.set("notificationData", res);
      }
    });
  }, 1000);

});
Template.header.helpers({
  user: function () {
    return Meteor.user();
  },
  date: (date) => {
    return moment(date).format("MMM YYYY");
  },
  notification: () => {
    toastr.options = {
      "preventDuplicates": true
    }
    let notification = Notification.findOne({ userId: Meteor.userId() });
    if (notification) {
      $('#notificationWarnigModal').modal();
      Meteor.setTimeout(function () {
        Meteor.call('notification.del', notification._id);

      }, 50000);
    }
  },

  notificationCount: () => {
    let cnt = Session.get("notificationData");
    let total = 0;
    if (cnt) {
      for (let i = 0; i < cnt.length; i++) {
        total = total + 1;
      }
    }
    if (total == 0) {
      return false;
    } else {
      return total;
    }
  },

  notificationCheck: () => {
    return Session.get("notificationData");
  },
  boundaryValueCheck: (val) => {
    if (val === 'InSide') {
      return true;
    }
    else {
      return false;
    }
  },
});

Template.header.events({
  'click #ic-update': (event) => {
    $("#ic-update-modal").modal();
  },
  'click #closeWarnig': (event) => {
    // console.log("this._id",this._id);
    $('#notificationWarnigModal').modal('hide');


  },

  'click #stockRem': () => {
    Meteor.call('locationNotification.updateNotification');
  },
});


