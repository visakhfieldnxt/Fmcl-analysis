/**
 * @author Visakh
 */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {Config} from '../../../api/config/config';

Meteor.startup(() => {
  /**
 * TODO: Complete JS itemResult
 */
  let config = Config.findOne({name: 'appName'});
  let appName = config.value;
  Accounts.emailTemplates.siteName = appName;
  Accounts.emailTemplates.from = appName +'Admin <admin@fieldnxt.com>';
  Accounts.emailTemplates.resetPassword.subject = (user) => {    
    return `Reset Password for you `+ appName +`account, ${user.profile.firstName}`;
  };
    Accounts.emailTemplates.resetPassword.text = function(user, url){
              let token = url.substring(url.lastIndexOf('/')+1, url.length);
              let newUrl = Meteor.absoluteUrl('resetPassword/' + token);
              let str = `Hey ${user.profile.firstName}\n`;
                  str+= 'To reset your '+ appName +' password, please click follow link...\n';
                  str+= newUrl;
              return str;
          }
  
        Accounts.emailTemplates.verifyEmail.subject = (user) => {         
          return `Verify your `+ appName +` account, ${user.profile.firstName}`;
        };
          Accounts.emailTemplates.verifyEmail.text = function(user, url){       
  
                    let token = url.substring(url.lastIndexOf('/')+1, url.length);
                    let newUrl = Meteor.absoluteUrl('verifyEmail/' + token);
                    let str = `Hey ${user.profile.firstName}\n`;
                        str+= 'To verify your '+ appName +' account, please click follow link...\n';
                        str+= newUrl;
                    return str;
                }

});
// http://localhost:3000/#/verify-email/ElyfYHIJ-SwdD_nJEScnBiOKE3iZk2auvvBcrWyjJWh
/**
 * TODO: Complete JS doc
 */
// Meteor.publish('login', function () {
//   // return Meteor.users.find({});
  
// });
