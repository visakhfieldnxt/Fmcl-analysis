/**
 * @author Subrata
 */
import { Config } from '../../../api/config/config';
import { Meteor } from 'meteor/meteor';


Template.menu.onCreated(function () {

  let self = this;
  self.autorun(() => {
    self.subscribe('role.list');
    self.subscribe('user.list');
    self.subscribe('config.list');
  });

  // window.console.log = function(){
  //   console.error('Sorry , developers tools are blocked here....');
  //   window.console.log = function() {
  //       return false;
  //   }
  // }
});

Template.registerHelper('printLoaderImage', () => {
  // let config = Config.findOne({ name: 'printLoader' });
   return { printLoaderImg: printLoader_Image };
});

Template.registerHelper('connectionLoad', () => {
  // let config = Config.findOne({ name: 'connectionLoader' });
 return { connectionLoaderImg: connectionLoader_Image };
});

Template.registerHelper('userName', () => {
  let config = Config.findOne({ name: 'userName' });
  if (config) return { user: config.value };
});

// Template.registerHelper('vanSaleUserName', () => {
//   let config = Config.findOne({ name: 'vanSaleUserName' });
//   if (config) return { vanSaleUser: config.value };
// });

// Template.registerHelper('itemName', () => {
//   let config = Config.findOne({ name: 'itemName' });
//   if (config) return { item: config.value };
// });

Template.registerHelper('appName', () => {
  let config = Config.findOne({ name: 'appName' });
  if (config) return { app: config.value };
});
Template.registerHelper('bodyLoader', () => {
  // let config = Config.findOne({ name: 'bodyLoader' });
   return { bodyLoader_img: bodyLoader_Image };
});

Template.registerHelper('href', () => {
  let config = Config.findOne({ name: 'url' });
  if (config) return { href_url: config.value };
});

Template.registerHelper('logo', () => {
  let config = Config.findOne({ name: 'logo' });
  if (config) return { logo_img: config.value };
});

Template.registerHelper('roleName', () => {
  let config = Config.findOne({ name: 'roleName' });
  if (config) return { role: config.value };
});

// Template.registerHelper('designationName', () => {
//   let config = Config.findOne({ name: 'designationName' });
//   if (config) return { designation: config.value };
// });

Template.registerHelper('pendingOrderList', () => {
  let res = Session.get("accountantCheckValue");
  if (res === true) {
    return false;
  }
  else {
    return true;
  }
});


/**
 * This is to load all required config objects for login page in a single call
 */
Template.registerHelper('loginConfig', () => {
  let configObjects = Config.find({ name: { $in: ['userName', 'url', 'logo', 'appName'] } });
  let values = {};

  configObjects.forEach(config => {
    values[config.name] = config.value;
  });
  return values;
});

Template.registerHelper('userCan', function (permissions) {
  if (permissions !== undefined) {

    let roleList = [];
    let role = [];
    role = Meteor.user();
    // roleList = Meteor.user().roles;
    if (role !== undefined && role !== null) {
      roleList = role.roles;
    }
    let userPermission = [];

    let permissionSet = [];
    permissionSet = Session.get("userPermission");
    //  console.log("permissionSet",permissionSet);
    if (permissionSet !== undefined && permissionSet.length > 0) {
      let permis = $.inArray(permissions, permissionSet);
      if (permis === -1) {
        return false; //changed
      } else {
        return true;
      }
    } else {

      if (roleList !== undefined && roleList.length > 0) {
        for (let i = 0; i < roleList.length; i++) {
          // let roleArray = roleList[i]; 

          let roleCheck = Meteor.roles.find({ _id: roleList[i] }).fetch();
          // console.log(roleCheck);
          if (roleCheck.length > 0) {
            $.each(roleCheck[0].permissions, function (key, val) {
              userPermission.push(val);
            });
          }

        };
        //  console.log("userPermission",userPermission);
        if (userPermission !== undefined && permissions !== undefined) {
          Session.set("userPermission", userPermission);
          let permisionCheck = $.inArray(permissions, userPermission);
          if (permisionCheck === -1) {
            return false; //changed
          } else {
            return true;
          }
        }
      }

    }
  }

});

Template.menu.events({
  'click .Menuhide': (e) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === true) {
      $('[data-toggle="push-menu"]').pushMenu('toggle');
    }
  },
  'click .menuScrollTop': function () {
    $(window).scrollTop(0);
    $(".wrapper").scrollTop(0);
  }
});


