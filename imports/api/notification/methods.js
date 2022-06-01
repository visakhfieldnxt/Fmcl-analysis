/**
 * @author Visakh
 */
import { Notification } from './notification';
import { Config } from '../config/config';


Meteor.methods({
    'notification.del': (id) => {
        return Notification.remove({ _id: id });
    },
    'notification.data': (id) => {
        return Notification.find({ user: id }).fetch();
    },
    'notification.outletRemove': (id) => {
        return Notification.remove({ user: id, type: "Outlet" });
    },
    'notification.acceptRem': (id) => {
        return Notification.remove({ user: id, type: "Stock Acceptance" });
    },
    'notification.editRem': (id) => {
        return Notification.remove({ user: id, type: "Stock Edited" });
    },
    'notification.ordrRem': (id) => {
        return Notification.remove({ user: id, type: "New Order" });
    },
    'notification.stockRem': (id) => {
        return Notification.remove({ user: id, type: "New Stock" });
    },
    'notification.outletAprvRem': (id) => {
        return Notification.remove({ user: id, type: "New Outlet" });
    },
    'notification.ordrAprRem': (id) => {
        return Notification.remove({ user: id, type: "Ordr Aprvd" });
    },
    'notification.stockReturn': (id) => {
        return Notification.remove({ user: id, type: "Stock Return" });
    },
    'notification.collection': (id) => {
        return Notification.remove({ user: id, type: "Collection" });
    }
});