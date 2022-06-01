/**
 * @author visakh
 */

import { Meteor } from 'meteor/meteor';


Meteor.methods({

  /**
   * TODO: Complete JS doc
   * 
   */

   sendResetPasswordLink() {
      let userId = Meteor.userId();
      if ( userId ) {
        return Accounts.sendResetPasswordEmail( userId );
      }
    }

});
