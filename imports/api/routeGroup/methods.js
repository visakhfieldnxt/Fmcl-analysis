/**
 * @author Nithin
 */
import { RouteGroup } from './routeGroup';
import { Branch } from '../branch/branch';
// import { Customer } from '../customer/customer';
import { RouteAssign } from '../routeAssign/routeAssign';
// import { RouteCustomer } from '../routeCustomer/routeCustomer';
// import { RouteUpdates } from '../routeUpdates/routeUpdates';
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { Verticals } from '../verticals/verticals';
import { Location } from '../location/location';
import { roles } from "../role/role";
import { Outlets } from '../outlets/outlets';

Meteor.methods({
    /** 
     * @param routeName
     * @param description 
     */
    'routeGroup.create': (routeName, description, subDistributor, loginUserVerticals) => {

        let temporaryId = '';
        // generate route code
        let tempVal = TempSerialNo.findOne({
            routeMaster: true,
        }, { sort: { $natural: -1 } });
        if (!tempVal) {
            temporaryId = "FMC/Route/" + "/1";
        } else {
            temporaryId = "FMC/Route/" + parseInt(tempVal.serial + 1);
        }
        if (!tempVal) {
            TempSerialNo.insert({
                serial: 1,
                routeMaster: true,
                uuid: Random.id(),
                createdAt: new Date()
            });
        } else {
            TempSerialNo.update({ _id: tempVal._id }, {
                $set: {
                    serial: parseInt(tempVal.serial + 1),
                    updatedAt: new Date()
                }
            });
        }
        let routeGroupData = RouteGroup.insert({
            routeCode: temporaryId,
            routeName: routeName,
            description: description,
            subDistributor: subDistributor,
            vertical: loginUserVerticals,
            uuid: Random.id(),
            active: 'Y',
            createdAt: new Date(),
        });
        if (routeGroupData) {
            return routeGroupData;
        }

    },
    /**
* route Code already exist validation
*/
    'routeGroup.routeCodeCheck': (routeName) => {
        var routeNameGet = new RegExp(["^", routeName, "$"].join(""), "i");
        let res = RouteGroup.find({ routeName: routeNameGet }).fetch();
        if (res === undefined || res.length === 0) {
            return false;
        }
        else if (res.length > 0) {
            return true;
        }
    },
    /**
 * route groute details based on id
 */
    'routeGroup.id': (id) => {
        return RouteGroup.findOne({ _id: id });
    },
    /**
* route groute name based on id
*/
    'routeGroup.idRouteName': (id) => {
        let res = RouteGroup.findOne({ _id: id });
        if (res) {
            return res.routeName;
        }
    },

    /**
* route groute code based on id
*/
    'routeGroup.idRouteCode': (id) => {
        let res = RouteGroup.findOne({ _id: id });
        if (res) {
            return res.routeCode;
        }
    },
    /**
* route groute code based on id
*/
    'routeGroup.assignedList': (id) => {
        let resVal = RouteAssign.find({ assignedTo: id, active: "Y" }, { fields: { routeId: 1 } }).fetch();
        let routeArray = [];
        if (resVal.length > 0) {
            let routeIdUnique = resVal.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.routeId == e2.routeId
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            if (routeIdUnique.length > 0) {
                for (let i = 0; i < routeIdUnique.length; i++) {
                    let routeRes = RouteGroup.findOne({ _id: routeIdUnique[i].routeId },
                        { fields: { routeName: 1, _id: 1 } });
                    if (routeRes) {
                        routeArray.push(routeRes);
                    }
                }
            }
        }
        return routeArray;
    },
    /**
* route groute details based on id
*/
    'getUserName': (id) => {
        return RouteGroup.findOne({ _id: id });
    },
    /**
 * deactivate route
 */

    'routeGroup.deactivate': (id) => {
        RouteGroup.update({ _id: id }, {
            $set:
            {
                active: "N",
                updatedBy: Meteor.userId(),
                updatedAt: new Date(),
            }
        });
        let assignRes = RouteAssign.find({ routeId: id, }).fetch();
        if (assignRes !== undefined && assignRes.length > 0) {
            for (let i = 0; i < assignRes.length; i++) {
                RouteAssign.update({ _id: assignRes[i]._id }, {
                    $set:
                    {
                        active: "N",
                        groupDeactivated: true,
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }

        }
    },
    /**
* activate route
*/
    'routeGroup.activate': (id) => {
        RouteGroup.update({ _id: id }, {
            $set:
            {
                active: "Y",
                updatedBy: Meteor.userId(),
                updatedAt: new Date(),
            }
        });
        // update group deactivated route
        let assignRes = RouteAssign.find({ routeId: id, routeDeactivated: { $ne: true } }).fetch();
        if (assignRes !== undefined && assignRes.length > 0) {
            for (let i = 0; i < assignRes.length; i++) {
                RouteAssign.update({ _id: assignRes[i]._id }, {
                    $set:
                    {
                        active: "Y",
                        groupDeactivated: false,
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }
        }
        // update assign deactivated route
        let deactivatedRoutes = RouteAssign.find({ routeId: id, routeDeactivated: true, }).fetch();
        if (deactivatedRoutes !== undefined && deactivatedRoutes.length > 0) {
            for (let i = 0; i < deactivatedRoutes.length; i++) {
                RouteAssign.update({ _id: deactivatedRoutes[i]._id }, {
                    $set:
                    {
                        groupDeactivated: false,
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }
        }

    },

    /**
* TODO: Complete Js doc
* update route data
*/
    'routeGroup.update': (description, routeName, customerArray, routeId, loginUserVerticals) => {
        let routeData = RouteGroup.update({ _id: routeId }, {
            $set:
            {
                routeName: routeName,
                description: description,
                vertical: loginUserVerticals,
                updatedBy: Meteor.userId(),
                updatedAt: new Date(),
            }
        });
        // update customer master table
        if (routeData) {
            customerMasterUpdate(customerArray, routeId);
        }

        return routeData;

    },
    /**
* TODO: Complete Js doc
* Fetching full route data
*/
    'routeGroup.list': () => {
        return RouteGroup.find({}, { fields: { routeCode: 1, routeName: 1 } }).fetch();
    },

    /**
* TODO: Complete Js doc
* Fetching full route data
*/
    'routeGroup.subDList': (id) => {
        return RouteGroup.find({ subDistributor: id, active: "Y" }, { fields: { routeCode: 1, routeName: 1 } }).fetch();
    },
    /**
* TODO: Complete Js doc
* Fetching full route data
*/
    'routeGroup.verticalList': (vertical) => {
        return RouteGroup.find({ vertical: { $in: vertical } }, { sort: { routeName: 1 } }, { fields: { routeCode: 1, routeName: 1 } }).fetch();
    },
    /**
* TODO: Complete Js doc
* Fetching full route data
*/
    'routeGroup.sdWiselist': (id) => {
        return RouteGroup.find({ subDistributor: id }, { fields: { routeCode: 1, routeName: 1 } }).fetch();
    },
    /**
* TODO: Complete Js doc
* Fetching full route data
*/
    'routeGroup.listReport': () => {
        let routeRes = RouteGroup.find({}, { fields: { routeCode: 1, routeName: 1 } }).fetch();
        let branchRes = Branch.find({}, { fields: { bPLId: 1, bPLName: 1 } }).fetch();
        let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
        return { routeRes: routeRes, branchRes: branchRes, userRes: userRes };
    },
    /**
* TODO: Complete Js doc
* Fetching full route data
*/
    'routeGroup.activelist': () => {
        return RouteGroup.find({ active: "Y" }).fetch();
    },
    /**
  * TODO: Complete Js doc
  * Fetching vansale employess based on route data
  */

    'routeGroup.assignedEmployeeList': (id) => {
        let routeCustList = Outlets.find({
            active: "Y", routeId: id,
            approvalStatus: "Approved", assigned: true
        }, { fields: { name: 1, priority: 1 } }).fetch();
        return { routeCustList: routeCustList };
    },
    /**
* TODO: Complete Js doc
* Fetching vansale employess and group data based on route data
*/

    'routeGroup.masterDataGet': () => {
        let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
        let groupRes = RouteGroup.find({}, { fields: { routeCode: 1, routeName: 1 } }).fetch();
        let sdUsersList = Meteor.users.find({ userType: "SDUser", active: "Y" }, { fields: { profile: 1, roles: 1 } }).fetch();
        let sdUserArray = [];
        if (sdUsersList.length > 0) {
            for (let k = 0; k < sdUsersList.length; k++) {
                let permissionsData = 'vsrView';
                let roleData = roles.findOne({ _id: sdUsersList[k].roles[0] });
                if (roleData !== undefined) {
                    let vsrView = roleData.permissions.includes(permissionsData);
                    if (vsrView === true) {
                        sdUserArray.push(sdUsersList[k]);
                    }
                }
            }
        }
        return {
            userRes: userRes, groupRes: groupRes, vanUsersFilter: sdUserArray,

        };
    },
    /**
* TODO: Complete Js doc
* Fetching vansale employess and group data based on route data
*/

    // 'routeGroup.noTransActionReport': () => {
    //     let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
    //     let vanUsersFilter = Meteor.users.find({ userType: "V" }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    //     let groupRes = RouteGroup.find({}).fetch();
    //     let routeUpdateRes = RouteUpdates.find({ transactionDone: false }).fetch();
    //     let branchRes = Branch.find({ disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1 } }).fetch();
    //     let routeCustomers = RouteCustomer.find({ active: 'Y' }, { fields: { routeId: 1, customer: 1, address: 1 } }).fetch();
    //     let custRes = Customer.find({}, { sort: { cardName: 1 } }, { fields: { cardName: 1, cardCode: 1 } }).fetch();
    //     return {
    //         userRes: userRes, groupRes: groupRes, vanUsersFilter: vanUsersFilter,
    //         branchRes: branchRes, custRes: custRes, routeCustomers: routeCustomers,
    //         routeUpdateRes: routeUpdateRes
    //     };
    // },
    /**
 * TODO: Complete Js doc
 * Fetching vansale employess and group data based on route data
 */

    // 'routeGroup.skippedCustReport': () => {
    //     let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
    //     let vanUsersFilter = Meteor.users.find({ userType: "V" }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    //     let groupRes = RouteGroup.find({}).fetch();
    //     let routeUpdateRes = RouteUpdates.find({ skipStatus: '1' }).fetch();
    //     let branchRes = Branch.find({ disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1 } }).fetch();
    //     let routeCustomers = RouteCustomer.find({ active: 'Y' }, { fields: { routeId: 1, customer: 1, address: 1 } }).fetch();
    //     let custRes = Customer.find({}, { sort: { cardName: 1 } }, { fields: { cardName: 1, cardCode: 1 } }).fetch();
    //     return {
    //         userRes: userRes, groupRes: groupRes, vanUsersFilter: vanUsersFilter,
    //         branchRes: branchRes, custRes: custRes, routeCustomers: routeCustomers,
    //         routeUpdateRes: routeUpdateRes
    //     };
    // },



    /**
    * TODO: Complete Js doc
    * Fetching full route data
    */
    'routeGroup.branchWise': (branch) => {
        if (branch) {
            return RouteGroup.find({ active: "Y", branchCode: branch }).fetch();
        }
    },


    /**
* route groute details based on id
*/
    'routeGroup.idGet': (id) => {
        let groupRes = RouteGroup.findOne({ _id: id });
        let sdUserName = '';
        if (groupRes) {
            let sdUserRes = Meteor.users.findOne({ _id: groupRes.subDistributor });
            if (sdUserRes) {
                sdUserName = `${sdUserRes.profile.firstName} ${sdUserRes.profile.lastName}`;
            }
        }
        let outletsArray = [];
        let customerList = Outlets.find({ active: 'Y', routeId: groupRes._id, approvalStatus: "Approved", assigned: true }, { fields: { name: 1, priority: 1, randomId: 1 } }).fetch();
        let outletFullList = Outlets.find({ routeId: groupRes._id, approvalStatus: "Approved" }, { fields: { name: 1, priority: 1, randomId: 1 } }).fetch();

        if (customerList.length > 0) {
            for (let i = 0; i < customerList.length; i++) {
                let outletObj =
                {
                    customer: customerList[i]._id,
                    priority: customerList[i].priority,
                    randomId: customerList[i].randomId,
                }
                outletsArray.push(outletObj);
            }
        }

        return { groupRes: groupRes, sdUserName: sdUserName, customerList: outletsArray, outletFullList: outletFullList }
    },

    /**
* route groute details based on id
*/
    'routeGroup.idGetAdmin': (id, superAdminValue) => {
        let groupRes = RouteGroup.findOne({ _id: id });
        let sdUserName = '';
        if (groupRes) {
            let sdUserRes = Meteor.users.findOne({ _id: groupRes.subDistributor });
            if (sdUserRes) {
                sdUserName = `${sdUserRes.profile.firstName} ${sdUserRes.profile.lastName}`;
            }
        }
        let outletsArray = [];
        let customerList = [];
        let outletFullList = [];
        if (superAdminValue === true) {
            customerList = Outlets.find({ active: 'Y', routeId: groupRes._id, approvalStatus: "Approved", assigned: true }, { fields: { name: 1, priority: 1, randomId: 1 } }).fetch();
            outletFullList = Outlets.find({ approvalStatus: "Approved" }, { fields: { name: 1, priority: 1, randomId: 1 } }).fetch();
        }
        else {
            customerList = Outlets.find({ active: 'Y', routeId: groupRes._id, approvalStatus: "Approved", assigned: true }, { fields: { name: 1, priority: 1, randomId: 1 } }).fetch();
            outletFullList = Outlets.find({ routeId: groupRes._id, approvalStatus: "Approved" }, { fields: { name: 1, priority: 1, randomId: 1 } }).fetch();
        }


        if (customerList.length > 0) {
            for (let i = 0; i < customerList.length; i++) {
                let outletObj =
                {
                    customer: customerList[i]._id,
                    priority: customerList[i].priority,
                    randomId: customerList[i].randomId,

                }
                outletsArray.push(outletObj);
            }
        }

        return { groupRes: groupRes, sdUserName: sdUserName, customerList: outletsArray, outletFullList: outletFullList }
    },
    'routeGroup.outletData': (id) => {
        let customerList = Outlets.find({ active: 'Y', routeId: id, approvalStatus: "Approved", assigned: true },
            { fields: { name: 1, priority: 1, randomId: 1, latitude: 1, longitude: 1, insideImage: 1, outsideImage: 1 } }).fetch();
        // console.log("cust",customerList);
        return customerList
    },
    /**
     * 
     * @param {*} id 
     * @param {*} customerArray 
     * customer excel uploads
     */

    // 'routeGroup.customerUpload': (id, customerArray) => {
    //     for (let i = 0; i < customerArray.length; i++) {

    //         let customerRes = RouteCustomer.find({ routeId: id, customer: customerArray[i].customer }).fetch();

    //         if (customerRes.length === 0) {
    //             RouteCustomer.insert({
    //                 routeId: id,
    //                 customer: customerArray[i].customer,
    //                 priority: customerArray[i].priority,
    //                 address: customerArray[i].address,
    //                 randomId: Random.id(),
    //                 createdAt: new Date(),
    //                 uuid: Random.id(),
    //                 active: 'Y',
    //             });
    //         }
    //         else {
    //             RouteCustomer.update({
    //                 _id: customerRes[0]._id
    //             }, {
    //                 $set:
    //                 {
    //                     priority: customerArray[i].priority,
    //                     address: customerArray[i].address,
    //                     active: 'Y',
    //                     updatedBy: Meteor.userId(),
    //                     updatedAt: new Date(),
    //                 }
    //             });
    //         }

    //     }

    // },
    /**
* TODO: Complete Js doc
* Fetching vansale employess and group data based on route data
*/

    // 'routeGroup.masterDataForReports': () => {
    //     let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
    //     let vanUsersFilter = Meteor.users.find({ userType: "V" }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    //     let groupRes = RouteGroup.find({}).fetch();
    //     let branchRes = Branch.find({ disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1 } }).fetch();
    //     let routeCustomers = RouteCustomer.find({ active: 'Y' }, { fields: { routeId: 1, customer: 1, address: 1, routeId: 1 } }).fetch();
    //     let custRes = Customer.find({}, { sort: { cardName: 1 } }, { fields: { cardName: 1, cardCode: 1 } }).fetch();
    //     let routeUpdatesGet = RouteUpdates.find({}).fetch();
    //     return {
    //         userRes: userRes, groupRes: groupRes, vanUsersFilter: vanUsersFilter,
    //         branchRes: branchRes, custRes: custRes, routeCustomers: routeCustomers,
    //         routeUpdatesGet: routeUpdatesGet,
    //     };
    // },

    /**
     * get sub distributor deatils and route list */
    'routeGroup.vsrUserList': (id) => {
        let routeRes = RouteGroup.find({ active: "Y", subDistributor: id },
            { fields: { routeCode: 1, routeName: 1, subDistributor: 1 } }).fetch();
        let userRes = Meteor.users.findOne({ _id: id });
        let verticalName = [];
        let branchName = '';
        let locationName = '';
        if (userRes) {
            if (userRes.vertical.length > 0) {
                for (let k = 0; k < userRes.vertical.length; k++) {
                    let verticalRes = Verticals.findOne({ _id: userRes.vertical[k] });
                    if (verticalRes) {
                        verticalName.push(verticalRes.verticalName);
                    }
                }
            }
            let branchRes = Branch.findOne({ _id: userRes.branch });
            if (branchRes) {
                branchName = branchRes.branchName;
            }
            let locRes = Location.findOne({ _id: userRes.location });
            if (locRes) {
                locationName = locRes.locationName;
            }
        }
        let sdUsersList = Meteor.users.find({ subDistributor: id, active: "Y" }, { fields: { profile: 1, roles: 1 } }).fetch();
        let sdUserArray = [];
        if (sdUsersList.length > 0) {
            for (let k = 0; k < sdUsersList.length; k++) {
                let permissionsData = 'vsrView';
                let roleData = roles.findOne({ _id: sdUsersList[k].roles[0] });
                if (roleData !== undefined) {
                    let vsrView = roleData.permissions.includes(permissionsData);
                    if (vsrView === true) {
                        sdUserArray.push(sdUsersList[k]);
                    }
                }
            }
        }
        return {
            verticalName: verticalName.toString(), userRes: userRes,
            routeRes: routeRes, locationName: locationName, branchName: branchName, sdUsersList: sdUserArray
        }
    },
    /**
     * 
     * @param {*} vertical 
     * return vertical wise route report
     */
    'routeGroup.exportDataValues': (vertical) => {
        return RouteGroup.find({ vertical: { $in: vertical } }, {
            sort: {
                createdAt: -1,
            }
        }, {
            fields: {
                routeCode: 1,
                routeName: 1, vertical: 1, active: 1, subDistributor: 1
            }
        }).fetch();
    }
});






// function for update customer master updates

function customerMasterUpdate(customerArray, routeId) {
    let routeCustomerArray = Outlets.find({ routeId: routeId },).fetch();
    if (routeCustomerArray !== undefined && routeCustomerArray.length > 0) {
        customerStatUpdate(routeCustomerArray);
    }
    else {
        customerStatUpdateNews(customerArray);
    }
    // deactivate customer if not present in customerArray
    function customerStatUpdate(routeCustomerArray) {
        for (let i = 0; i < routeCustomerArray.length; i++) {
            let custRes = customerArray.find(x => x.customer === routeCustomerArray[i]._id);
            if (custRes === undefined) {
                Outlets.update({
                    routeId: routeId,
                    _id: routeCustomerArray[i]._id
                }, {
                    $set:
                    {
                        active: 'N',
                        assigned: true,
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }

        }
        // customer updates
        customerUpdates(customerArray);
    }

    function customerUpdates(customerArray) {
        for (let k = 0; k < customerArray.length; k++) {
            let routeCustRes = Outlets.find({ routeId: routeId, _id: customerArray[k].customer }).fetch();
            if (routeCustRes !== undefined && routeCustRes.length > 0) {
                Outlets.update({
                    routeId: routeId,
                    _id: routeCustRes[0]._id
                }, {
                    $set:
                    {
                        active: 'Y',
                        routeId: routeId,
                        assigned: true,
                        priority: customerArray[k].priority,
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }
            else {
                Outlets.update({
                    _id: customerArray[k].customer
                }, {
                    $set:
                    {
                        active: 'Y',
                        routeId: routeId,
                        assigned: true,
                        priority: customerArray[k].priority,
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }
        }
    }

    function customerStatUpdateNews(customerArray) {
        for (let k = 0; k < customerArray.length; k++) {
            Outlets.update({
                _id: customerArray[k].customer
            }, {
                $set:
                {
                    active: 'Y',
                    assigned: true,
                    routeId: routeId,
                    priority: customerArray[k].priority,
                    updatedBy: Meteor.userId(),
                    updatedAt: new Date(),
                }
            });
        }
    }
}