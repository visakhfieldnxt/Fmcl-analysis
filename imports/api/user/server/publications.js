/**
 * @author Visakh
 */

import { allUsers } from "../user";
import { publishPagination } from 'meteor/kurounin:pagination';
import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
  allUsers._ensureIndex({ username: 1 }, { unique: true });
  // allUsers._ensureIndex({ slpCode: 1  }, {unique: false});
  allUsers._ensureIndex({ role: 1 }, { unique: false });
  allUsers._ensureIndex({ defaultBranch: 1 }, { unique: false });
  allUsers._ensureIndex({ createdAt: 1 }, { unique: false }); 
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
        profile: 1,
        roles: 1,
        active: 1,
        subDistributor: 1,
        userType: 1,
        vertical: 1,
        loggedIn: 1
      }
    });
});
