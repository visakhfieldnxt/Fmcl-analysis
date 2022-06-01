/**
 * @author Subrata
 */

import { Meteor } from 'meteor/meteor';
import { Notification } from '../../../api/notification/notification';
let latitude = '';
let longitude = '';
Template.header.onCreated(function () {
  Blaze._allowJavascriptUrls();
  let self = this;
  self.autorun(() => {
  });
  this.rolesList = new ReactiveVar();
  this.attendanceUpdate = new ReactiveVar();
});

Template.header.onRendered(function () {

  Meteor.call('users.getSubD', Meteor.userId(), (err, res) => {
    if (!err) {
      // console.log("resSubD",res);
      Session.setPersistent("loginUserSDs", res);

    }
  });

  // get locations
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  function success(pos) {
    var crd = pos.coords;
    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
    latitude = crd.latitude;
    longitude = crd.longitude;
  }
  function error(err) {
    // console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);

  Meteor.call("roles.rolesListGet", (err, res) => {
    if (!err) {
      this.rolesList.set(res);
    }
  });
  Meteor.setInterval(function () {
    Meteor.call("attendance.data", Meteor.userId(), (err, res) => {
      if (!err) {
        Session.set("attendanceData", res);
      }
    });
    Meteor.call("notification.data", Meteor.userId(), (err, res) => {
      if (!err) {
        Session.set("notificationData", res);
      }
    });

  }, 1000);


});
Meteor.subscribe('config.list');
// Meteor.subscribe('notification.list');
Template.header.helpers({
  user: function () {
    return Meteor.user();
  },
  date: (date) => {
    return moment(date).format("MMM YYYY");
  },
  attCheck: () => {
    let attData = Session.get("attendanceData");
    if (attData == '' || attData == undefined) {
      return '<a href="#" class="btn btn-default btn-flat" id="punch">Punch In </a>'
    } else if (attData.attendenceStatus == 'Punch In') {
      return '<a href="#" class="btn btn-default btn-flat" id="punch">Punch Out</a>'
    } else {
      return ' You have already registered todays attendance!'
    }
  },
  notificationCount: () => {
    let cnt = Session.get("notificationData");
    let total = 0;
    if (cnt) {
      for (let i = 0; i < cnt.length; i++) {
        total += cnt[i].count;
      }
    }
    if (total == 0) {
      return false;
    } else {
      return total;
    }
  },
  notificationOutletChecker: () => {
    let outletNotify = Session.get("notificationData");
    if (outletNotify) {
      let nottypeO = outletNotify.find(x => x.type == 'Outlet');
      if (nottypeO && nottypeO.type == 'Outlet') {
        return `New ${nottypeO.count} Outlets are waiting for Approval`;
      } else {
        return false;
      }
    }
  },
  notificationAcceptChecker: () => {
    let acceptStkNotify = Session.get("notificationData");
    if (acceptStkNotify) {
      let nottypeO = acceptStkNotify.find(x => x.type == 'Stock Acceptance');
      if (nottypeO && nottypeO.type == 'Stock Acceptance') {
        return `New ${nottypeO.count} Stock has been Accepted`;
      } else {
        return false;
      }
    }
  },
  notificationEditChecker: () => {
    let acceptStkNotify = Session.get("notificationData");
    if (acceptStkNotify) {
      let nottypeO = acceptStkNotify.find(x => x.type == 'Stock Edited');
      if (nottypeO && nottypeO.type == 'Stock Edited') {
        return `New ${nottypeO.count} Stock has been Edited`;
      } else {
        return false;
      }
    }
  },
  notificationOrderChecker: () => {
    let acceptStkNotify = Session.get("notificationData");
    if (acceptStkNotify) {
      let nottypeO = acceptStkNotify.find(x => x.type == 'New Order');
      if (nottypeO && nottypeO.type == 'New Order') {
        return `New ${nottypeO.count} Orders are waiting for Approval`;
      } else {
        return false;
      }
    }
  },
  notificationStockAccept: () => {
    let acceptStkNotify = Session.get("notificationData");
    if (acceptStkNotify) {
      let nottypeO = acceptStkNotify.find(x => x.type == 'New Stock');
      if (nottypeO && nottypeO.type == 'New Stock') {
        return `New ${nottypeO.count} Stocks are waiting for Approval`;
      } else {
        return false;
      }
    }
  },
  notificationOutletAprvd: () => {
    let acceptStkNotify = Session.get("notificationData");
    if (acceptStkNotify) {
      let nottypeO = acceptStkNotify.find(x => x.type == 'New Outlet');
      if (nottypeO && nottypeO.type == 'New Outlet') {
        return `New ${nottypeO.count} Outlets has been Approved`;
      } else {
        return false;
      }
    }
  },
  notificationOrdrAprvd: () => {
    let acceptStkNotify = Session.get("notificationData");
    if (acceptStkNotify) {
      let nottypeO = acceptStkNotify.find(x => x.type == 'Ordr Aprvd');
      if (nottypeO && nottypeO.type == 'Ordr Aprvd') {
        return `New ${nottypeO.count} Orders has been Approved`;
      } else {
        return false;
      }
    }
  },
  notificationCollectionAdd: () => {
    let acceptStkNotify = Session.get("notificationData");
    if (acceptStkNotify) {
      let nottypeO = acceptStkNotify.find(x => x.type == 'Collection');
      if (nottypeO && nottypeO.type == 'Collection') {
        return `New ${nottypeO.count} Collection has been Added`;
      } else {
        return false;
      }
    }
  },
  notificationStockRtn: () => {
    let acceptStkNotify = Session.get("notificationData");
    console.log("ddd");
    if (acceptStkNotify) {
      console.log("dddw");
      let nottypeO = acceptStkNotify.find(x => x.type == 'Stock Return');
      console.log("nottypeO", nottypeO);
      if (nottypeO && nottypeO.type == 'Stock Return') {
        return `New ${nottypeO.count} Stocks has been Returned`;
      } else {
        return false;
      }
    }
  },
  // notification: () => {
  //   toastr.options = {
  //     "preventDuplicates": true
  //   }
  // let notification = Notification.findOne({ userId: Meteor.userId() });
  // if (notification) {
  //   $('#notificationWarnigModal').modal();
  //   Meteor.setTimeout(function () {
  //     Meteor.call('notification.del', notification._id);

  //   }, 50000);
  // }
  // },
  roleNameGet: (roles) => {
    let roleArray = [];
    let roleDetailsGet = Template.instance().rolesList.get();
    if (roleDetailsGet) {
      for (let i = 0; i < roles.length; i++) {
        let res = roleDetailsGet.find(x => x._id === roles[i]);
        if (res) {
          roleArray.push(res.name);
        }
      }
      return roleArray.toString();
    }
  },
});

Template.header.events({
  'click #ic-update': (event) => {
    $("#ic-update-modal").modal();
  },
  'click #outletRem': () => {
    Meteor.call('notification.outletRemove', Meteor.userId());
  },
  'click #acceptRem': () => {
    Meteor.call('notification.acceptRem', Meteor.userId());
  },
  'click #editRem': () => {
    Meteor.call('notification.editRem', Meteor.userId());
  },
  'click #ordrRem': () => {
    Meteor.call('notification.ordrRem', Meteor.userId());
  },
  'click #stockRem': () => {
    Meteor.call('notification.stockRem', Meteor.userId());
  },
  'click #outletAprvRem': () => {
    Meteor.call('notification.outletAprvRem', Meteor.userId());
  },
  'click #ordrAprRem': () => {
    Meteor.call('notification.ordrAprRem', Meteor.userId());
  },
  'click #stockReturnId': () => {
    Meteor.call('notification.stockReturn', Meteor.userId());
  },
  'click #collectionId': () => {
    Meteor.call('notification.collection', Meteor.userId());
  },
  'click .signOutVal': () => {
    Meteor.call('user.updateLogoutVal', Meteor.userId());
    FlowRouter.go('/signout');
  },

  'click #closeWarnig': (event) => {
    // console.log("this._id",this._id);
    $('#notificationWarnigModal').modal('hide');
  },
  'click #punch': (event) => {
    // let loc = getCurrentPosition();

    // console.log("loc", latitude, longitude);
    let loc = [latitude, longitude];
    let attStatus = '';
    let attData = Session.get("attendanceData");
    if (attData == undefined) {
      attStatus = 'Punch In';
    } else if (attData.attendenceStatus == 'Punch In') {
      attStatus = 'Punch Out';
    }
    Meteor.call('attendance.punch', Meteor.userId(), loc, attStatus, (err, res) => {
      // console.log("err",err);
      // console.log("resAt", res);

      if (res) {
        // console.log("resAt", res);
        // Alert(`Attendance ${attStatus} Successfully`);
        toastr['success'](`Attendance ${attStatus} Successfully`);

      }
    })
  }
});
