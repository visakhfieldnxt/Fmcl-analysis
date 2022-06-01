/**
 * @author Visakh
 */

import { allUsers } from "../user";
import { publishPagination } from 'meteor/kurounin:pagination';
import { Meteor } from 'meteor/meteor';
  

Meteor.startup(() => { 
  // allUsers._dropIndex('username_1')
  // allUsers._dropIndex('role_1')
  // allUsers._dropIndex('defaultBranch_1')
  // allUsers.createIndex({ username: 1 }, { unique: true });
  // // allUsers.createIndex({ slpCode: 1  }, {unique: false});
  allUsers.createIndex({ role: 1 }, { unique: false });
  allUsers.createIndex({ defaultBranch: 1 }, { unique: false });
 
  // allUsers.createIndex({ username: 1 }, { unique: true }); 
  publishPagination(allUsers);

  // allUsers._dropIndex("profile");
});

/**
 * TODO: Complete JS usrResult
 */
Meteor.publish('user.list', function () {
  return Meteor.users.find(this.userId,
    {
      fields:
      {
        username: 1,
        emails: 1,
        u_Sales_Employee_Code: 1,
        slpCode: 1,
        profile: 1,
        roles: 1,
        active: 1,
        branch: 1,
        defaultBranch: 1,
        defaultBranchName: 1,
        userType: 1,
        cardCode: 1,
        vansaleFullName: 1,
        transporterName: 1,
        vehicleNumber: 1,
        lorryBoy: 1,
        driverName: 1,
        driverNumber: 1,
        defaultWareHouse: 1,
        defaultWareHouse: 1,
        address: 1
      }
    });
});
