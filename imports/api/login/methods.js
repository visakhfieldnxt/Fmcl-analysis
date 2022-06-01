/**
 * @author visakh
 */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({

  /**
   * TODO: Complete JS doc
   * @param id
   * @param firstname
   * @param lasname
   * @param username
   * @param password
   * @param email
   * @param dateOfBirth
   * @param gender
   */
  'signup.create': (id, firstName, lastName, email, username, password, gender, dateOfBirth) => {
    let userId =  Accounts.createUser({
      profile: { firstName: firstName, lastName : lastName, gender: gender, dateOfBirth: dateOfBirth, isDeleted: false },
      email: email,
      username:username,
      password:password,
      createdAt : new Date(),
      createdBy : username
    });
    if (userId) {
        let token = Accounts._generateStampedLoginToken().token;
      Accounts.sendVerificationEmail( userId );      
      return Meteor.users.update(userId,  {$set: {token: token}});
    };

  },

});
