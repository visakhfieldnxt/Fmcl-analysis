/**
 * @author Nithin
 */

import { CollectionDue } from "./collectionDue";
import { Verticals } from '../verticals/verticals';
import { RouteGroup } from '../routeGroup/routeGroup';
import { Outlets } from '../outlets/outlets';
import { allUsers } from '../user/user';
Meteor.methods({
    /**
     * get collection details based on id
     * @param {*} id 
     */
    'collectionDue.id': (id) => {
        let empName = '';
        let routeName = '';
        let verticalName = '';
        let outletName = '';
        let collectionRes = CollectionDue.findOne({ _id: id });
        if (collectionRes) {
            if (collectionRes.route !== undefined && collectionRes.route !== '') {
                let routeRes = RouteGroup.findOne({ _id: collectionRes.route });
                if (routeRes) {
                    routeName = routeRes.routeName;
                }
            }
            if (collectionRes.vertical !== undefined && collectionRes.vertical !== '') {
                let verticalRes = Verticals.findOne({ _id: collectionRes.vertical });
                if (verticalRes) {
                    verticalName = verticalRes.verticalName;
                }
            }
            if (collectionRes.outlet !== undefined && collectionRes.outlet !== '') {
                let outletRes = Outlets.findOne({ _id: collectionRes.outlet });
                if (outletRes) {
                    outletName = outletRes.name;
                }
            }
            if (collectionRes.createdBy !== undefined && collectionRes.createdBy !== '') {
                let userRes = allUsers.findOne({ _id: collectionRes.createdBy });
                if (userRes) {
                    empName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
                }
            }
        } 
        return {
            collectionRes: collectionRes, routeName: routeName, verticalName: verticalName,
            outletName: outletName, empName: empName
        }
    }
});