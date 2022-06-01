/**
 * @author Visakh
 */
import { Notification } from './notification';
import { Config } from '../config/config';


Meteor.methods({
 'notification.del':(id)=>{
     Notification.remove({_id:id});
 }
});