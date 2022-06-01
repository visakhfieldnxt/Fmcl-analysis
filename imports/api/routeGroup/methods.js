/**
 * @author Nithin
 */
import { RouteGroup } from './routeGroup';
import { Branch } from '../branch/branch';
import { Customer } from '../customer/customer';
import { TempSerialNo } from '../tempSerialNo/tempSerialNo';
import { RouteAssign } from '../routeAssign/routeAssign';
import { RouteCustomer } from '../routeCustomer/routeCustomer';
import { RouteUpdates } from '../routeUpdates/routeUpdates';
import { CustomerAddress } from '../customerAddress/customerAddress';
import { Invoice } from '../invoice/invoice';
import { ArInvoicePayment } from '../arInvoice+Payment/arInvoice+Payment';
import { allUsers } from '../user/user';
import { Order } from '../order/order';
import { SalesQuotation } from '../salesQuotation/salesQuotation';
import moment from 'moment';
import { Item } from '../item/item';
Meteor.methods({
    /** 
     * @param routeName
     * @param description
     * @param customerArray
     */
    'routeGroup.create': (routeName, description, customerArray, branch) => {

        // find branch Name
        let branchName = '';
        let branchRes = Branch.findOne({ bPLId: branch }, { fields: { bPLName: 1 } });
        if (branchRes) {
            branchName = branchRes.bPLName;
        }
        let temporaryId = '';
        // generate route code
        let tempVal = TempSerialNo.findOne({
            bPLId: branch,
            routeMaster: true,
        }, { sort: { $natural: -1 } });
        if (!tempVal) {
            temporaryId = "Route/" + branchName.slice(0, 3).toUpperCase() + "/1";
        } else {
            temporaryId = "Route/" + branchName.slice(0, 3).toUpperCase() + "/" + parseInt(tempVal.serial + 1);
        }
        if (!tempVal) {
            TempSerialNo.insert({
                serial: 1,
                bPLId: branch,
                routeMaster: true,
                uuid: Random.id(),
                createdAt: new Date()
            });
        } else {
            TempSerialNo.insert({
                serial: parseInt(tempVal.serial + 1),
                bPLId: branch,
                routeMaster: true,
                uuid: Random.id(),
                createdAt: new Date()
            });
        }
        let routeGroupDta = RouteGroup.insert({
            routeCode: temporaryId,
            routeName: routeName,
            description: description,
            branchCode: branch,
            uuid: Random.id(),
            active: 'Y',
            createdAt: new Date(),
        });

        if (routeGroupDta) {
            if (customerArray !== undefined && customerArray.length) {
                for (let i = 0; i < customerArray.length; i++) {
                    // function for create route customer master data
                    createGroupCustomer(routeGroupDta, customerArray[i]);
                }
            }
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
* route groute name based on id
*/
    'routeGroup.routeListData': (branch) => {
        return RouteGroup.find({ branchCode: { $in: branch }, active: "Y" }, {
            sort: {
                routeName: 1
            }
        }, {
            fields: {
                routeCode: 1, routeName: 1
            }
        }).fetch();

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
    'routeGroup.idBranchDetails': (id) => {
        let res = RouteGroup.findOne({ _id: id });
        if (res) {
            let branchData = Branch.findOne({ bPLId: res.branchCode });
            if (branchData) {
                return branchData.bPLName;
            }
        }
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
        let assignRes = RouteAssign.find({ routeId: id, routeStatus: { $ne: 'Completed' }, }).fetch();
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
        let assignRes = RouteAssign.find({ routeId: id, routeDeactivated: { $ne: true }, routeStatus: { $ne: 'Completed' }, }).fetch();
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
        let deactivatedRoutes = RouteAssign.find({ routeId: id, routeDeactivated: true, routeStatus: { $ne: 'Completed' }, }).fetch();
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
    'routeGroup.update': (description, routeName, customerArray, routeId) => {
        let routeData = RouteGroup.update({ _id: routeId }, {
            $set:
            {
                routeName: routeName,
                description: description,
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
        return RouteGroup.find({}).fetch();
    },
    /**
* TODO: Complete Js doc
* Fetching full route data
*/
    'routeGroup.listActives': () => {
        return RouteGroup.find({ active: "Y" }, {
            fields: {
                routeName: 1
            }
        }).fetch();
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

    'routeGroup.assignedEmployeeList': (id, roles) => {
        let routeResult = RouteGroup.findOne({ _id: id });
        let userRes = Meteor.users.find({
            'profile.isDeleted': false, userType: "V", active: 'Y',
            roles: { $in: roles },
        },
            { fields: { profile: 1 } }).fetch();
        let routeCustList = RouteCustomer.find({ active: "Y", routeId: routeResult._id }).fetch();
        return { userRes: userRes, routeResult: routeResult, routeCustList: routeCustList };
    },
    /**
* TODO: Complete Js doc
* Fetching vansale employess and group data based on route data
*/

    'routeGroup.masterDataGet': () => {
        let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
        let vanUsersFilter = Meteor.users.find({ userType: "V" }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
        let groupRes = RouteGroup.find({}, { fields: { routeCode: 1, routeName: 1, description: 1, branchCode: 1, active: 1 } }).fetch();
        let branchRes = Branch.find({ disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1 } }).fetch();
        let routeCustomers = RouteCustomer.find({ active: 'Y' }, { fields: { routeId: 1, customer: 1, address: 1, routeId: 1 } }).fetch();
        let custRes = Customer.find({}, { sort: { cardName: 1 } }, { fields: { cardName: 1, cardCode: 1 } }).fetch();
        return {
            userRes: userRes, groupRes: groupRes, vanUsersFilter: vanUsersFilter,
            branchRes: branchRes, custRes: custRes, routeCustomers: routeCustomers
        };
    },


    'routeGroup.masterForApprovalPages': (roles) => {
        let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
        let vanUsersFilter = Meteor.users.find({
            userType: "V",
            roles: { $in: roles },
        }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
        let groupRes = RouteGroup.find({}, { fields: { routeCode: 1, routeName: 1, description: 1, branchCode: 1, active: 1 } }).fetch();

        return {
            userRes: userRes, groupRes: groupRes, vanUsersFilter: vanUsersFilter,
        };
    },
    /**
* TODO: Complete Js doc
* Fetching vansale employess and group data based on route data
*/

    'routeGroup.noTransActionReport': () => {
        let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
        let vanUsersFilter = Meteor.users.find({ userType: "V" }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
        let groupRes = RouteGroup.find({}).fetch();
        let routeUpdateRes = RouteUpdates.find({ transactionDone: false }).fetch();
        let branchRes = Branch.find({ disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1 } }).fetch();
        let routeCustomers = RouteCustomer.find({ active: 'Y' }, { fields: { routeId: 1, customer: 1, address: 1 } }).fetch();
        let custRes = Customer.find({}, { sort: { cardName: 1 } }, { fields: { cardName: 1, cardCode: 1 } }).fetch();
        return {
            userRes: userRes, groupRes: groupRes, vanUsersFilter: vanUsersFilter,
            branchRes: branchRes, custRes: custRes, routeCustomers: routeCustomers,
            routeUpdateRes: routeUpdateRes
        };
    },
    /**
 * TODO: Complete Js doc
 * Fetching vansale employess and group data based on route data
 */

    'routeGroup.skippedCustReport': (roles) => {
        let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
        let vanUsersFilter = Meteor.users.find({
            userType: "V",
            roles: { $in: roles }
        }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
        return {
            userRes: userRes, vanUsersFilter: vanUsersFilter,

        };
    },



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
        let branchName = '';
        let branchRes = Branch.findOne({ bPLId: groupRes.branchCode });
        if (branchRes) {
            branchName = branchRes.bPLName;
        }
        let customerList = RouteCustomer.find({ active: 'Y', routeId: groupRes._id }).fetch();


        return { groupRes: groupRes, branchName: branchName, customerList: customerList }
    },
    /**
     * 
     * @param {*} id 
     * @param {*} customerArray 
     * customer excel uploads
     */

    'routeGroup.customerUpload': (id, customerArray) => {
        for (let i = 0; i < customerArray.length; i++) {

            let customerRes = RouteCustomer.find({ routeId: id, customer: customerArray[i].customer }).fetch();

            if (customerRes.length === 0) {
                RouteCustomer.insert({
                    routeId: id,
                    customer: customerArray[i].customer,
                    priority: customerArray[i].priority,
                    address: customerArray[i].address,
                    randomId: Random.id(),
                    createdAt: new Date(),
                    uuid: Random.id(),
                    active: 'Y',
                });
            }
            else {
                RouteCustomer.update({
                    _id: customerRes[0]._id
                }, {
                    $set:
                    {
                        priority: customerArray[i].priority,
                        address: customerArray[i].address,
                        active: 'Y',
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }

        }

    },
    /**
* TODO: Complete Js doc
* Fetching vansale employess and group data based on route data
*/

    'routeGroup.masterDataForReports': () => {
        let userRes = Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
        let vanUsersFilter = Meteor.users.find({ userType: "V" }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
        let groupRes = RouteGroup.find({}).fetch();
        let branchRes = Branch.find({ disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1 } }).fetch();
        let routeCustomers = RouteCustomer.find({ active: 'Y' }, { fields: { routeId: 1, customer: 1, address: 1, routeId: 1 } }).fetch();
        let custRes = Customer.find({}, { sort: { cardName: 1 } }, { fields: { cardName: 1, cardCode: 1 } }).fetch();
        let routeUpdatesGet = RouteUpdates.find({}).fetch();
        return {
            userRes: userRes, groupRes: groupRes, vanUsersFilter: vanUsersFilter,
            branchRes: branchRes, custRes: custRes, routeCustomers: routeCustomers,
            routeUpdatesGet: routeUpdatesGet,
        };
    },


    /**
* TODO: Complete Js doc
* Fetching vansale employess and group data based on route data
*/

    'routeGroup.masterDataForReportsNew': (roles) => {
        let vanUsersFilter = Meteor.users.find({
            userType: "V",
            roles: { $in: roles }
        }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
        let groupRes = RouteGroup.find({}, { fields: { routeCode: 1, routeName: 1 } }).fetch();
        return {
            groupRes: groupRes, vanUsersFilter: vanUsersFilter,
        };
    },
    /**
     * 
     * @param {} routeId 
     * @param {*} assignId 
     * @returns call rate report
     */
    'routeGroup.callRateGet': (routeId, assignId) => {
        let customerData = RouteCustomer.find({ routeId: routeId, active: "Y" },
            { fields: { _id: 1, customer: 1 } }).fetch();
        let count = 0;
        let customerCount = 0;
        if (customerData.length > 0) {
            customerCount = customerData.length;
            for (let i = 0; i < customerData.length; i++) {
                let customerCountGet = RouteUpdates.find({
                    routeAssignId: assignId,
                    customer: customerData[i].customer
                }).count();
                if (customerCountGet > 0) {
                    count = count + 1;
                }
            }
        }
        let result = Number((count / customerCount) * 100).toFixed(2);
        if (result === undefined || isNaN(result)) {
            return '0';
        }
        else {
            return result;
        }
    },
    /**
     * 
     * @param {*} routeId 
     * @param {*} assignId 
     * @returns visited outlets count
     */
    'routeGroup.noOfVisitedCount': (routeId, assignId) => {
        let customerData = RouteCustomer.find({ routeId: routeId, active: "Y" },
            { fields: { _id: 1, customer: 1 } }).fetch();
        let count = 0;
        if (customerData.length > 0) {
            for (let i = 0; i < customerData.length; i++) {
                let customerCountGet = RouteUpdates.find({
                    routeAssignId: assignId,
                    customer: customerData[i].customer
                }).count();
                if (customerCountGet > 0) {
                    count = count + 1;
                }
            }
        }
        if (count === undefined || isNaN(count)) {
            return '0';
        }
        else {
            return count;
        }
    },

    /**
   * 
   * @param {*} routeId 
   * @param {*} assignId 
   * @returns not visited outlets count
   */
    'routeGroup.noOfNotVisitedCount': (routeId, assignId) => {
        let customerData = RouteCustomer.find({ routeId: routeId, active: "Y" },
            { fields: { _id: 1, customer: 1 } }).fetch();
        let count = 0;
        let customerCount = 0;
        if (customerData.length > 0) {
            customerCount = customerData.length;
            for (let i = 0; i < customerData.length; i++) {
                let customerCountGet = RouteUpdates.find({
                    routeAssignId: assignId,
                    customer: customerData[i].customer
                }).count();
                if (customerCountGet > 0) {
                    count = count + 1;
                }
            }
        }
        let result = customerCount - count;
        if (result === undefined || isNaN(result)) {
            return '0';
        }
        else {
            return result;
        }
    },
    /**
* 
* @param {*} routeId 
* @param {*} assignId 
* @returns not visited outlets count
*/
    'routeGroup.totalOutletsGet': (routeId) => {
        return RouteCustomer.find({ routeId: routeId, active: "Y" },
        ).count();

    },
    /**
     * 
     * @param {*} customer 
     * @param {*} route 
     * @returns get customer address
     */
    'routeGroup.custAddress': (customer, route) => {
        let routeCustRes = RouteCustomer.findOne({ customer: customer, routeId: route });
        if (routeCustRes) {
            if (routeCustRes.address) {
                let addressval = CustomerAddress.findOne(routeCustRes.address);
                if (addressval) {
                    return addressval.address;
                }
            }
        }
    },
    /**
     * 
     * @param {*} assignId 
     * @returns get route update count
     */
    'routeGroup.routeUpdateCount': (assignId) => {
        return RouteUpdates.find({
            routeAssignId: assignId, skipStatus: '1'
        }).count();
    },
    /**
  * 
  * @param {*} assignId 
  * @returns get route update count
  */
    'routeGroup.noTransactionCounts': (assignId) => {
        return RouteUpdates.find({
            routeAssignId: assignId, transactionDone: false
        }).count();
    },
    /**
     * 
     * @param {*} item 
     * @param {*} fromDate 
     * @param {*} toDate 
     * get total number outlets in the active route
     */
    'routeGroup.totalOutletGets': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        let customerArray = [];
        // get actice route current month
        let activeRoute = RouteAssign.find({
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            }
            , routeStatus: "Assigned", active: "Y",
            branch: { $in: branch },
            assignedTo: id,
        }, {
            fields: { routeId: 1, routeDate: 1, routeDateEnd: 1, assignedTo: 1 }
        }).fetch();
        let totalOutletCount = 0;
        if (activeRoute.length > 0) {
            getUniqueRoute(activeRoute);
        }
        // get unique route
        function getUniqueRoute(activeRoute) {
            let uniqueRoute = activeRoute.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.routeId == e2.routeId
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            if (uniqueRoute.length > 0) {
                getOutletCounts(uniqueRoute);
            }
        }
        // get customer list based on route
        function getOutletCounts(uniqueRoute) {
            for (let i = 0; i < uniqueRoute.length; i++) {
                let customerCount = RouteCustomer.find({ active: 'Y', routeId: uniqueRoute[i].routeId }, {
                    fields: {
                        customer: 1
                    }
                }).fetch();
                if (customerCount.length > 0) {
                    for (let r = 0; r < customerCount.length; r++) {
                        let custObj = {
                            cardCode: customerCount[r].customer
                        };
                        customerArray.push(custObj);
                    }
                }
            }
            if (customerArray.length > 0) {
                getUniqueCustomer(customerArray);
            }
        }
        // get unique customer count
        function getUniqueCustomer(customerArray) {
            let uniqueOutlets = customerArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.cardCode == e2.cardCode
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            totalOutletCount = uniqueOutlets.length;
        }
        return totalOutletCount;
    },
    /**
  * 
  * @param {*} item 
  * @param {*} fromDate 
  * @param {*} toDate 
  * get total number of visited outlets in the active route
  */
    'routeGroup.visitedCountGet': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        // get actice route current month
        let routeAssignArray = [];
        let customerArray = [];
        let visitedOutletArray = [];
        let activeRoute = RouteAssign.find({
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            }
            , routeStatus: "Assigned", active: "Y",
            branch: { $in: branch },
            assignedTo: id
        }, {
            fields: { routeId: 1, routeDate: 1, routeDateEnd: 1, assignedTo: 1 }
        }).fetch();
        let totalOutletCount = 0;
        if (activeRoute.length > 0) {
            for (let m = 0; m < activeRoute.length; m++) {
                routeAssignArray.push(activeRoute[m]._id);
            }
            getUniqueRoute(activeRoute);
        }
        // get unique route
        function getUniqueRoute(activeRoute) {
            let uniqueRoute = activeRoute.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.routeId == e2.routeId
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            if (uniqueRoute.length > 0) {
                getOutletCounts(uniqueRoute);
            }
        }
        // get customer list based on route
        function getOutletCounts(uniqueRoute) {
            for (let i = 0; i < uniqueRoute.length; i++) {
                let customerCount = RouteCustomer.find({ active: 'Y', routeId: uniqueRoute[i].routeId }, {
                    fields: {
                        customer: 1
                    }
                }).fetch();
                if (customerCount.length > 0) {
                    for (let r = 0; r < customerCount.length; r++) {
                        let custObj = {
                            cardCode: customerCount[r].customer
                        };
                        customerArray.push(custObj);
                    }
                }
            }
            if (customerArray.length > 0) {
                getUniqueCustomer(customerArray);
            }
        }
        // get unique customer count
        function getUniqueCustomer(customerArray) {
            let uniqueOutlets = customerArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.cardCode == e2.cardCode
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            transactionCalc(routeAssignArray, uniqueOutlets);
        }
        // get arinv ,pos and credit inv details
        function transactionCalc(routeAssignArray, uniqueOutlets) {
            for (let k = 0; k < routeAssignArray.length; k++) {
                for (let l = 0; l < uniqueOutlets.length; l++) {
                    let customerCountGet = RouteUpdates.find({
                        routeAssignId: routeAssignArray[k],
                        assignedTo: id,
                        customer: uniqueOutlets[l].cardCode
                    }).count();
                    if (customerCountGet > 0) {
                        visitedOutletArray.push({
                            cardCode: uniqueOutlets[l].cardCode
                        });
                    }
                }
            }
            getUniqueVisitedCustomer(visitedOutletArray)
        }

        function getUniqueVisitedCustomer(visitedOutletArray) {
            let uniqueVisitedOutlets = visitedOutletArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.cardCode == e2.cardCode
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            totalOutletCount = uniqueVisitedOutlets.length;
        }

        return totalOutletCount;
    },
    /**
   * 
   * @param {*} item 
   * @param {*} fromDate 
   * @param {*} toDate 
   * get  numeric distribution perc value
   */
    'routeGroup.numericPerce': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        // get actice route current month
        let routeAssignArray = [];
        let customerArray = [];
        let visitedOutletArray = [];
        let uniqueVisitedOutlets = [];
        let uniqueOutlets = [];
        let visitedCount = 0;
        let totalOutletCount = 0;
        let percVal = 0;
        let activeRoute = RouteAssign.find({
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            }
            , routeStatus: "Assigned", active: "Y",
            branch: { $in: branch },
            assignedTo: id
        }, {
            fields: { routeId: 1, routeDate: 1, routeDateEnd: 1, assignedTo: 1 }
        }).fetch();
        if (activeRoute.length > 0) {
            for (let m = 0; m < activeRoute.length; m++) {
                routeAssignArray.push(activeRoute[m]._id);
            }
            getUniqueRoute(activeRoute);
        }
        // get unique route
        function getUniqueRoute(activeRoute) {
            let uniqueRoute = activeRoute.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.routeId == e2.routeId
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            if (uniqueRoute.length > 0) {
                getOutletCounts(uniqueRoute);
            }
        }
        // get customer list based on route
        function getOutletCounts(uniqueRoute) {
            for (let i = 0; i < uniqueRoute.length; i++) {
                let customerCount = RouteCustomer.find({ active: 'Y', routeId: uniqueRoute[i].routeId }, {
                    fields: {
                        customer: 1
                    }
                }).fetch();
                if (customerCount.length > 0) {
                    for (let r = 0; r < customerCount.length; r++) {
                        let custObj = {
                            cardCode: customerCount[r].customer
                        };
                        customerArray.push(custObj);
                    }
                }
            }
            if (customerArray.length > 0) {
                getUniqueCustomer(customerArray);
            }
        }
        // get unique customer count
        function getUniqueCustomer(customerArray) {
            uniqueOutlets = customerArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.cardCode == e2.cardCode
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            totalOutletCount = uniqueOutlets.length;
            transactionCalc(routeAssignArray, uniqueOutlets);
        }
        // get arinv ,pos and credit inv details
        function transactionCalc(routeAssignArray, uniqueOutlets) {
            for (let k = 0; k < routeAssignArray.length; k++) {
                for (let l = 0; l < uniqueOutlets.length; l++) {
                    let customerCountGet = RouteUpdates.find({
                        routeAssignId: routeAssignArray[k],
                        assignedTo: id,
                        customer: uniqueOutlets[l].cardCode
                    }).count();
                    if (customerCountGet > 0) {
                        visitedOutletArray.push({
                            cardCode: uniqueOutlets[l].cardCode
                        });
                    }
                }
            }
            getUniqueVisitedCustomer(visitedOutletArray)
        }

        function getUniqueVisitedCustomer(visitedOutletArray) {
            uniqueVisitedOutlets = visitedOutletArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.cardCode == e2.cardCode
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            visitedCount = uniqueVisitedOutlets.length;
        }

        if (visitedCount > 0) {
            percVal = (Number(visitedCount) / Number(totalOutletCount)) * 100;
        }
        return percVal.toFixed(2);
    },
    /**
* 
* @param {*} item 
* @param {*} fromDate 
* @param {*} toDate 
* get total numerical distribution value
*/
    'routeGroup.numericalCal': (item, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        // get actice route current month
        let routeAssignArray = [];
        let customerArray = [];
        let visitedCount = 0;
        let activeRoute = RouteAssign.find({
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            }, branch: { $in: branch }
            , routeStatus: "Assigned", active: "Y",
        }, {
            fields: { routeId: 1, routeDate: 1, routeDateEnd: 1, assignedTo: 1 }
        }).fetch();
        let totalOutletCount = 0;

        if (activeRoute.length > 0) {
            for (let m = 0; m < activeRoute.length; m++) {
                routeAssignArray.push(activeRoute[m]._id);
                let userRes = allUsers.findOne({ _id: activeRoute[m].assignedTo }, { fields: { cardCode: 1 } });
                if (userRes) {
                    if (userRes.cardCode !== undefined) {
                        customerArray.push({ cardCode: userRes.cardCode });
                    }
                }
            }
            getUniqueRoute(activeRoute);
        }
        // get unique route
        function getUniqueRoute(activeRoute) {
            let uniqueRoute = activeRoute.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.routeId == e2.routeId
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            if (uniqueRoute.length > 0) {
                getOutletCounts(uniqueRoute);
            }
        }
        // get customer list based on route
        function getOutletCounts(uniqueRoute) {
            for (let i = 0; i < uniqueRoute.length; i++) {
                let customerCount = RouteCustomer.find({ active: 'Y', routeId: uniqueRoute[i].routeId }, {
                    fields: {
                        customer: 1
                    }
                }).fetch();
                if (customerCount.length > 0) {
                    for (let r = 0; r < customerCount.length; r++) {
                        let custObj = {
                            cardCode: customerCount[r].customer
                        };
                        customerArray.push(custObj);
                    }
                }
            }
            if (customerArray.length > 0) {
                getUniqueCustomer(customerArray);
            }
        }
        // get unique customer count
        function getUniqueCustomer(customerArray) {
            let uniqueOutlets = customerArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                    return e1.cardCode == e2.cardCode
                });
                if (matches.length == 0) {
                    memo.push(e1);
                }
                return memo;
            }, []);
            totalOutletCount = uniqueOutlets.length;
            transactionCalc(routeAssignArray, uniqueOutlets);
        }
        // get arinv ,pos and credit inv details
        function transactionCalc(routeAssignArray, uniqueOutlets) {
            let transArray = [];
            let arInvRes = ArInvoicePayment.find({
                routeId: { $in: routeAssignArray },
                createdAt: {
                    $gte: fromDate,
                    $lt: toDate
                }, branch: { $in: branch }
            }, { fields: { itemLines: 1, cardCode: 1 } }).fetch();
            if (arInvRes.length > 0) {
                for (let j = 0; j < arInvRes.length; j++) {
                    for (let p = 0; p < arInvRes[j].itemLines.length; p++) {
                        let itemObjs =
                        {
                            cardCode: arInvRes[j].cardCode,
                            itemCode: arInvRes[j].itemLines[p].itemCode,
                            itemName: arInvRes[j].itemLines[p].itemNam
                        }
                        transArray.push(itemObjs)
                    }
                }
            }
            let posInv = Invoice.find({
                creditInvoice: true,
                vansaleApp: true,
                posValue: true,
                branch: { $in: branch },
                createdAt: {
                    $gte: fromDate,
                    $lt: toDate
                }
            }, { fields: { itemLines: 1, cardCode: 1 } }).fetch();
            if (posInv.length > 0) {
                for (let j = 0; j < posInv.length; j++) {
                    for (let p = 0; p < posInv[j].itemLines.length; p++) {
                        let itemObjs =
                        {
                            cardCode: posInv[j].cardCode,
                            itemCode: posInv[j].itemLines[p].itemCode,
                            itemName: posInv[j].itemLines[p].itemNam
                        }
                        transArray.push(itemObjs)
                    }
                }
            }

            let crInvoice = Invoice.find({
                routeId: { $in: routeAssignArray },
                creditInvoice: true,
                vansaleApp: true,
                branch: { $in: branch },
                posValue: { $ne: true },
                createdAt: {
                    $gte: fromDate,
                    $lt: toDate
                }
            }, { fields: { itemLines: 1, cardCode: 1 } }).fetch();
            if (crInvoice.length > 0) {
                for (let j = 0; j < crInvoice.length; j++) {
                    for (let p = 0; p < crInvoice[j].itemLines.length; p++) {
                        let itemObjs =
                        {
                            cardCode: crInvoice[j].cardCode,
                            itemCode: crInvoice[j].itemLines[p].itemCode,
                            itemName: crInvoice[j].itemLines[p].itemNam
                        }
                        transArray.push(itemObjs)
                    }
                }
            }
            if (transArray.length > 0) {
                finalCheck(transArray, uniqueOutlets);
            }
        }
        // check item sold or not
        function finalCheck(transArray, uniqueOutlets) {
            let visitedArray = [];
            for (let k = 0; k < uniqueOutlets.length; k++) {
                let res = transArray.filter(itemData => {
                    return item === itemData.itemCode &&
                        uniqueOutlets[k].cardCode === itemData.cardCode
                });
                if (res.length > 0) {
                    visitedArray.push({ cardCode: uniqueOutlets[k].cardCode });
                }
            }

            if (visitedArray.length > 0) {
                let visitedArrayUnique = visitedArray.reduce(function (memo, e1) {
                    let matches = memo.filter(function (e2) {
                        return e1.cardCode == e2.cardCode
                    });
                    if (matches.length == 0) {
                        memo.push(e1);
                    }
                    return memo;
                }, []);
                visitedCount = visitedArrayUnique.length;
            }
        }

        let countVal = (visitedCount / totalOutletCount * 100);

        if (Number(countVal) !== undefined) {
            return countVal.toFixed(2);
        }
        else {
            return '0.00';
        }


    },
    /**
* 
* @param {*} item 
* @param {*} fromDate 
* @param {*} toDate 
* get total numerical distribution detail page
*/
    'routeGroup.numericDetails': (item, fromDate, toDate, branch) => {
        let fromDateVal = moment(fromDate).format('DD-MM-YYYY');
        let toDateVal = moment(toDate).format('DD-MM-YYYY');
        toDate.setDate(toDate.getDate() + 1);
        let routeAssignArray = [];
        let customerTransArray = [];
        let salesManArray = [];
        let routeNameArray = [];
        let posInvArray = [];
        let itemNameGet = '';
        let itemRes = Item.findOne({ itemCode: item }, { fields: { itemNam: 1 } });
        if (itemRes) {
            itemNameGet = itemRes.itemNam;
        }
        let activeRoute = RouteAssign.find({
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            }
            , routeStatus: "Assigned", active: "Y",
            branch: { $in: branch }
        }, {
            fields: { routeId: 1, routeDate: 1, routeDateEnd: 1 }
        }).fetch();

        if (activeRoute.length > 0) {
            if (activeRoute.length > 0) {
                for (let m = 0; m < activeRoute.length; m++) {
                    routeAssignArray.push(activeRoute[m]._id);
                }
            }
            transactionCalculation(routeAssignArray);
        }
        function transactionCalculation(routeAssignArray) {
            customerTransArray = [];
            salesManArray = [];
            routeNameArray = [];
            posInvArray = [];
            let arInvRes = ArInvoicePayment.find({
                routeId: { $in: routeAssignArray },
                createdAt: {
                    $gte: fromDate,
                    $lt: toDate
                }, branch: { $in: branch }
            }, {
                fields: {
                    itemLines: 1, cardCode: 1, createdAt: 1, cardName: 1,
                    employeeId: 1, salesmanName: 1, routeId: 1
                }
            }).fetch();
            let creditInvRes = Invoice.find({
                routeId: { $in: routeAssignArray },
                creditInvoice: true,
                posValue: { $ne: true },
                createdAt: {
                    $gte: fromDate,
                    $lt: toDate
                }, branch: { $in: branch }
            }, {
                fields: {
                    itemLines: 1, cardCode: 1, createdAt: 1,
                    cardName: 1, employeeId: 1, salesmanName: 1, routeId: 1
                }
            }).fetch();

            let posInvRes = Invoice.find({
                vansaleApp: true,
                creditInvoice: true,
                posValue: true,
                createdAt: {
                    $gte: fromDate,
                    $lt: toDate
                }, branch: { $in: branch }
            }, {
                fields: {
                    itemLines: 1, cardCode: 1, createdAt: 1,
                    cardName: 1, employeeId: 1, salesmanName: 1, routeId: 1
                }
            }).fetch();
            // Ar inv calculation
            if (arInvRes.length > 0) {
                for (let j = 0; j < arInvRes.length; j++) {
                    for (let p = 0; p < arInvRes[j].itemLines.length; p++) {
                        if (arInvRes[j].itemLines[p].itemCode === item) {
                            let itemObjs =
                            {
                                cardCode: arInvRes[j].cardCode,
                                cardName: arInvRes[j].cardName,
                                itemCode: arInvRes[j].itemLines[p].itemCode,
                                itemNameVal: arInvRes[j].itemLines[p].itemNam,
                                itemQty: arInvRes[j].itemLines[p].quantity,
                                createdAtDate: moment(arInvRes[j].createdAt).format('DD-MM-YYYY')
                            };
                            let salesManObj = {
                                itemCode: arInvRes[j].itemLines[p].itemCode,
                                itemNameVal: arInvRes[j].itemLines[p].itemNam,
                                empId: arInvRes[j].employeeId,
                                empNameVal: arInvRes[j].salesmanName,
                                itemQty: arInvRes[j].itemLines[p].quantity,
                                createdAtDate: moment(arInvRes[j].createdAt).format('DD-MM-YYYY')
                            };
                            let routeIdVal = '';
                            let routeNameVal = '';
                            let routeAssignVal = RouteAssign.findOne({ _id: arInvRes[j].routeId }, { fields: { routeId: 1 } });
                            if (routeAssignVal) {
                                let routeRes = RouteGroup.findOne({ _id: routeAssignVal.routeId }, { fields: { routeName: 1 } });
                                if (routeRes) {
                                    routeIdVal = routeRes._id;
                                    routeNameVal = routeRes.routeName;
                                }
                            }
                            let routeArrayObj = {
                                itemCode: arInvRes[j].itemLines[p].itemCode,
                                itemNameVal: arInvRes[j].itemLines[p].itemNam,
                                routeId: routeIdVal,
                                routeName: routeNameVal,
                                itemQty: arInvRes[j].itemLines[p].quantity,
                                createdAtDate: moment(arInvRes[j].createdAt).format('DD-MM-YYYY')
                            };
                            // if (customerTransArray.length > 0) {
                            //     let res = customerTransArray.filter(itemData => {
                            //         return arInvRes[j].itemLines[p].itemCode === itemData.itemCode &&
                            //             arInvRes[j].cardCode === itemData.cardCode
                            //     });
                            //     console.log("resss0", res);
                            //     if (res.length > 0) {
                            //         for (let m = 0; m < customerTransArray.length; m++) {
                            //             if (customerTransArray[m].itemCode === item &&
                            //                 customerTransArray[m].cardCode === res[0].cardCode) {
                            //                 customerTransArray[m].itemQty = (Number(customerTransArray[m].itemQty) + Number(arInvRes[j].itemLines[p].quantity)).toString();
                            //                 break;
                            //             }
                            //         }
                            //     }
                            //     else { 
                            //         customerTransArray.push(itemObjs);
                            //     }
                            // }
                            // else { 
                            customerTransArray.push(itemObjs);
                            // }

                            // if (salesManArray.length > 0) {
                            //     let res = salesManArray.filter(itemData => {
                            //         return arInvRes[j].itemLines[p].itemCode === itemData.itemCode &&
                            //             arInvRes[j].employeeId === itemData.empId
                            //     });
                            //     if (res.length > 0) {
                            //         for (let m = 0; m < salesManArray.length; m++) {
                            //             if (salesManArray[m].itemCode === item &&
                            //                 salesManArray[m].empId === res[0].empId) {
                            //                 salesManArray[m].itemQty = (Number(salesManArray[m].itemQty) + Number(arInvRes[j].itemLines[p].quantity)).toString();
                            //                 break;
                            //             }
                            //         }
                            //     }
                            //     else {
                            //         salesManArray.push(salesManObj);
                            //     }
                            // }
                            // else {
                            salesManArray.push(salesManObj);
                            // } 
                            if (routeNameArray.length > 0) {
                                let res = routeNameArray.filter(itemData => {
                                    return arInvRes[j].itemLines[p].itemCode === itemData.itemCode &&
                                        routeIdVal === itemData.routeId
                                });
                                if (res.length > 0) {
                                    for (let m = 0; m < routeNameArray.length; m++) {
                                        if (routeNameArray[m].itemCode === item &&
                                            routeNameArray[m].routeId === res[0].routeId) {
                                            routeNameArray[m].itemQty = (Number(routeNameArray[m].itemQty) + Number(arInvRes[j].itemLines[p].quantity)).toString();
                                            break;
                                        }
                                    }
                                }
                                else {
                                    routeNameArray.push(routeArrayObj);
                                }
                            }
                            else {
                                routeNameArray.push(routeArrayObj);
                            }
                        }
                    }
                }
            }
            // cr inv calculation
            if (creditInvRes.length > 0) {
                for (let j = 0; j < creditInvRes.length; j++) {
                    for (let p = 0; p < creditInvRes[j].itemLines.length; p++) {
                        if (creditInvRes[j].itemLines[p].itemCode === item) {
                            let itemObjs =
                            {
                                cardCode: creditInvRes[j].cardCode,
                                cardName: creditInvRes[j].cardName,
                                itemCode: creditInvRes[j].itemLines[p].itemCode,
                                itemNameVal: creditInvRes[j].itemLines[p].itemNam,
                                itemQty: creditInvRes[j].itemLines[p].quantity,
                                createdAtDate: moment(creditInvRes[j].createdAt).format('DD-MM-YYYY')
                            };
                            let salesManObj = {
                                itemCode: creditInvRes[j].itemLines[p].itemCode,
                                itemNameVal: creditInvRes[j].itemLines[p].itemNam,
                                empId: creditInvRes[j].employeeId,
                                empNameVal: creditInvRes[j].salesmanName,
                                itemQty: creditInvRes[j].itemLines[p].quantity,
                                createdAtDate: moment(creditInvRes[j].createdAt).format('DD-MM-YYYY')
                            };
                            let routeIdVal = '';
                            let routeNameVal = '';
                            let routeAssignVal = RouteAssign.findOne({ _id: creditInvRes[j].routeId }, { fields: { routeId: 1 } });
                            if (routeAssignVal) {
                                let routeRes = RouteGroup.findOne({ _id: routeAssignVal.routeId }, { fields: { routeName: 1 } });
                                if (routeRes) {
                                    routeIdVal = routeRes._id;
                                    routeNameVal = routeRes.routeName;
                                }
                            }
                            let routeArrayObj = {
                                itemCode: creditInvRes[j].itemLines[p].itemCode,
                                itemNameVal: creditInvRes[j].itemLines[p].itemNam,
                                routeId: routeIdVal,
                                routeName: routeNameVal,
                                itemQty: creditInvRes[j].itemLines[p].quantity,
                                createdAtDate: moment(creditInvRes[j].createdAt).format('DD-MM-YYYY')
                            };
                            // if (customerTransArray.length > 0) {
                            //     let res = customerTransArray.filter(itemData => {
                            //         return creditInvRes[j].itemLines[p].itemCode === itemData.itemCode &&
                            //             creditInvRes[j].cardCode === itemData.cardCode
                            //     }); 
                            //     if (res.length > 0) {
                            //         for (let m = 0; m < customerTransArray.length; m++) {
                            //             if (customerTransArray[m].itemCode === item &&
                            //                 customerTransArray[m].cardCode === res[0].cardCode) {
                            //                 customerTransArray[m].itemQty = (Number(customerTransArray[m].itemQty) + Number(creditInvRes[j].itemLines[p].quantity)).toString();
                            //                 break;
                            //             }
                            //         }
                            //     }
                            //     else {
                            //         customerTransArray.push(itemObjs);
                            //     }
                            // }
                            // else {
                            customerTransArray.push(itemObjs);
                            // }

                            // if (salesManArray.length > 0) {
                            //     let res = salesManArray.filter(itemData => {
                            //         return creditInvRes[j].itemLines[p].itemCode === itemData.itemCode &&
                            //             creditInvRes[j].employeeId === itemData.empId
                            //     });
                            //     if (res.length > 0) {
                            //         for (let m = 0; m < salesManArray.length; m++) {
                            //             if (salesManArray[m].itemCode === item &&
                            //                 salesManArray[m].empId === res[0].empId) {
                            //                 salesManArray[m].itemQty = (Number(salesManArray[m].itemQty) + Number(creditInvRes[j].itemLines[p].quantity)).toString();
                            //                 break;
                            //             }
                            //         }
                            //     }
                            //     else {
                            //         salesManArray.push(salesManObj);
                            //     }
                            // }
                            // else {
                            salesManArray.push(salesManObj);
                            // } 
                            if (routeNameArray.length > 0) {
                                let res = routeNameArray.filter(itemData => {
                                    return creditInvRes[j].itemLines[p].itemCode === itemData.itemCode &&
                                        routeIdVal === itemData.routeId
                                });
                                if (res.length > 0) {
                                    for (let m = 0; m < routeNameArray.length; m++) {
                                        if (routeNameArray[m].itemCode === item &&
                                            routeNameArray[m].routeId === res[0].routeId) {
                                            routeNameArray[m].itemQty = (Number(routeNameArray[m].itemQty) + Number(creditInvRes[j].itemLines[p].quantity)).toString();
                                            break;
                                        }
                                    }
                                }
                                else {
                                    routeNameArray.push(routeArrayObj);
                                }
                            }
                            else {
                                routeNameArray.push(routeArrayObj);
                            }
                        }
                    }
                }
            }

            // pos inv calculation
            if (posInvRes.length > 0) {
                for (let j = 0; j < posInvRes.length; j++) {
                    for (let p = 0; p < posInvRes[j].itemLines.length; p++) {
                        if (posInvRes[j].itemLines[p].itemCode === item) {
                            let itemObjs =
                            {
                                cardCode: posInvRes[j].cardCode,
                                cardName: posInvRes[j].cardName,
                                itemCode: posInvRes[j].itemLines[p].itemCode,
                                itemNameVal: posInvRes[j].itemLines[p].itemNam,
                                itemQty: posInvRes[j].itemLines[p].quantity,
                                createdAtDate: moment(posInvRes[j].createdAt).format('DD-MM-YYYY')
                            };
                            if (posInvArray.length > 0) {
                                let res = posInvArray.filter(itemData => {
                                    return posInvRes[j].itemLines[p].itemCode === itemData.itemCode &&
                                        posInvRes[j].cardCode === itemData.cardCode
                                });
                                if (res.length > 0) {
                                    for (let m = 0; m < posInvArray.length; m++) {
                                        if (posInvArray[m].itemCode === item &&
                                            posInvArray[m].cardCode === res[0].cardCode) {
                                            posInvArray[m].itemQty = (Number(posInvArray[m].itemQty) + Number(posInvRes[j].itemLines[p].quantity)).toString();
                                            break;
                                        }
                                    }
                                }
                                else {
                                    posInvArray.push(itemObjs);
                                }
                            }
                            else {
                                posInvArray.push(itemObjs);
                            }
                        }
                    }
                }
            }
        }
        return {
            itemNameVal: itemNameGet,
            itemCodeval: item,
            fromDateVal: fromDateVal,
            toDateVal: toDateVal,
            customerTransArray: customerTransArray,
            salesManArray: salesManArray,
            routeNameArray: routeNameArray,
            posInvArray: posInvArray
        }
    },

    /**
* 
* @param {*} item 
* @param {*} fromDate 
* @param {*} toDate 
* get total weightage distribution value
*/
    'routeGroup.weightageDistributionCalc': (item, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        // get actice route current month
        let routeAssignArray = [];
        let totalWeight = 0;
        let itemWeight = '0';
        let itemDetails = Item.findOne({ itemCode: item }, { fields: { invWeight: 1 } });
        if (itemDetails) {
            itemWeight = itemDetails.invWeight;
        }
        let activeRoute = RouteAssign.find({
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            }, branch: { $in: branch }
            , routeStatus: "Assigned", active: "Y",
        }, {
            fields: { routeId: 1, routeDate: 1, routeDateEnd: 1, assignedTo: 1 }
        }).fetch();

        if (activeRoute.length > 0) {
            for (let m = 0; m < activeRoute.length; m++) {
                routeAssignArray.push(activeRoute[m]._id);
                transactionCalc(routeAssignArray);
            }
            // get arinv ,pos and credit inv details
            function transactionCalc(routeAssignArray, uniqueOutlets) {
                let transArray = [];
                let arInvRes = ArInvoicePayment.find({
                    routeId: { $in: routeAssignArray },
                    createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: branch }
                }, { fields: { itemLines: 1, cardCode: 1 } }).fetch();
                if (arInvRes.length > 0) {
                    for (let j = 0; j < arInvRes.length; j++) {
                        for (let p = 0; p < arInvRes[j].itemLines.length; p++) {
                            if (arInvRes[j].itemLines[p].itemCode === item) {
                                let itemObjs =
                                {
                                    cardCode: arInvRes[j].cardCode,
                                    itemCode: arInvRes[j].itemLines[p].itemCode,
                                    itemName: arInvRes[j].itemLines[p].itemNam,
                                    itemQty: arInvRes[j].itemLines[p].quantity,
                                }
                                transArray.push(itemObjs);
                            }
                        }
                    }
                }
                let posInv = Invoice.find({
                    creditInvoice: true,
                    vansaleApp: true,
                    posValue: true,
                    branch: { $in: branch },
                    createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }
                }, { fields: { itemLines: 1, cardCode: 1 } }).fetch();
                if (posInv.length > 0) {
                    for (let j = 0; j < posInv.length; j++) {
                        for (let p = 0; p < posInv[j].itemLines.length; p++) {
                            if (posInv[j].itemLines[p].itemCode === item) {
                                let itemObjs =
                                {
                                    cardCode: posInv[j].cardCode,
                                    itemCode: posInv[j].itemLines[p].itemCode,
                                    itemName: posInv[j].itemLines[p].itemNam,
                                    itemQty: posInv[j].itemLines[p].quantity,
                                }
                                transArray.push(itemObjs);
                            }
                        }
                    }
                }

                let crInvoice = Invoice.find({
                    routeId: { $in: routeAssignArray },
                    creditInvoice: true,
                    vansaleApp: true,
                    branch: { $in: branch },
                    posValue: { $ne: true },
                    createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }
                }, { fields: { itemLines: 1, cardCode: 1 } }).fetch();
                if (crInvoice.length > 0) {
                    for (let j = 0; j < crInvoice.length; j++) {
                        for (let p = 0; p < crInvoice[j].itemLines.length; p++) {
                            if (crInvoice[j].itemLines[p].itemCode === item) {
                                let itemObjs =
                                {
                                    cardCode: crInvoice[j].cardCode,
                                    itemCode: crInvoice[j].itemLines[p].itemCode,
                                    itemName: crInvoice[j].itemLines[p].itemNam,
                                    itemQty: crInvoice[j].itemLines[p].quantity,
                                }
                                transArray.push(itemObjs);
                            }
                        }
                    }
                }
                if (transArray.length > 0) {
                    finalCheck(transArray);
                }
            }
            // check item sold or not
            function finalCheck(transArray) {
                let totalQty = 0;
                for (let x = 0; x < transArray.length; x++) {
                    totalQty += Number(transArray[x].itemQty);
                }
                totalWeight = (Number(itemWeight) * Number(totalQty)).toFixed(2);
            }
        }
        return totalWeight.toString();
    },
    /**
* 
* @param {*} id 
* @param {*} fromDate 
* @param {*} toDate 
* get total weightage distribution detail page
*/
    'routeGroup.weightageDetails': (id, fromDate, toDate, branch) => {
        let fromDateVal = moment(fromDate).format('DD-MM-YYYY');
        let toDateVal = moment(toDate).format('DD-MM-YYYY');
        toDate.setDate(toDate.getDate() + 1);
        let transArray = [];
        let arInvAmount = 0;
        let posAmount = 0;
        let customerArray = [];
        let arInvRes = ArInvoicePayment.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1, cardName: 1, cardCode: 1 } }).fetch();
        let arInvCount = arInvRes.length;
        if (arInvRes.length > 0) {
            for (let i = 0; i < arInvRes.length; i++) {
                arInvAmount = arInvAmount + Number(arInvRes[i].docTotal);
                if (customerArray.length === 0) {
                    customerArray.push({
                        customerName: arInvRes[i].cardName,
                        customerCode: arInvRes[i].cardCode,
                        totalAmt: Number(arInvRes[i].docTotal)
                    });
                }
                else {
                    let res = customerArray.filter(itemData => {
                        return arInvRes[i].cardCode === itemData.customerCode
                    });
                    if (res.length > 0) {
                        for (let m = 0; m < customerArray.length; m++) {
                            if (customerArray[m].customerCode === res[0].customerCode) {
                                customerArray[m].totalAmt = Number(customerArray[m].totalAmt) +
                                    Number(arInvRes[i].docTotal);
                                break;
                            }
                        }
                    }
                    else {
                        customerArray.push({
                            customerName: arInvRes[i].cardName,
                            customerCode: arInvRes[i].cardCode,
                            totalAmt: Number(arInvRes[i].docTotal)
                        });
                    }
                }
            }
        }
        let arInvObj = {
            transactionName: "AR Invoice + Payment",
            transactionCount: arInvCount,
            transactionAmount: arInvAmount.toFixed(6)
        };
        transArray.push(arInvObj);
        let posRes = Invoice.find({
            vansaleApp: true, posValue: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { grandTotal: 1, cardName: 1, cardCode: 1 } }).fetch();
        let posCount = posRes.length;
        if (posRes.length > 0) {
            for (let i = 0; i < posRes.length; i++) {
                posAmount = posAmount + Number(posRes[i].grandTotal);
                if (customerArray.length === 0) {
                    customerArray.push({
                        customerName: posRes[i].cardName,
                        customerCode: posRes[i].cardCode,
                        totalAmt: Number(posRes[i].grandTotal)
                    });
                }
                else {
                    let res = customerArray.filter(itemData => {
                        return posRes[i].cardCode === itemData.customerCode
                    });
                    if (res.length > 0) {
                        for (let m = 0; m < customerArray.length; m++) {
                            if (customerArray[m].customerCode === res[0].customerCode) {
                                customerArray[m].totalAmt = Number(customerArray[m].totalAmt) +
                                    Number(posRes[i].grandTotal);
                                break;
                            }
                        }
                    }
                    else {
                        customerArray.push({
                            customerName: posRes[i].cardName,
                            customerCode: posRes[i].cardCode,
                            totalAmt: Number(posRes[i].grandTotal)
                        });
                    }
                }
            }
        }
        let posObj = {
            transactionName: "POS Sales",
            transactionCount: posCount,
            transactionAmount: posAmount.toFixed(6)
        };
        transArray.push(posObj);

        let salesManName = '';
        let branchArray = [];
        let userDetails = allUsers.findOne({ _id: id }, { fields: { profile: 1, branch: 1 } });
        if (userDetails) {
            salesManName = `${userDetails.profile.firstName} ${userDetails.profile.lastName}`;
            for (let i = 0; i < userDetails.branch.length; i++) {
                let branchRes = Branch.findOne({ bPLId: userDetails.branch[i] });
                if (branchRes) {
                    branchArray.push(branchRes.bPLName);
                }
            }
        }
        let routeArray = [];
        let routeAssignRes = RouteAssign.find({
            active: "Y",
            assignedTo: id, routeStatus: { $eq: 'Assigned' },
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            },
            branch: { $in: branch },
        }, { fields: { routeId: 1, } }).fetch();
        let routeNameArray = [];
        if (routeAssignRes.length > 0) {
            routeArray = [];
            for (let i = 0; i < routeAssignRes.length; i++) {
                let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes[i].routeId }, { fields: { routeName: 1, routeCode: 1 } });
                if (routeGrpRes) {
                    routeArray.push(` ${routeGrpRes.routeName}`);
                    routeNameArray.push(` ${routeGrpRes.routeCode}`);
                }
            }
        }
        let routeCodeVal = 'Not Assigned';
        let routeNameVal = 'Not Assigned';
        if (routeArray.length > 0) {
            routeCodeVal = routeArray.toString();
        }
        if (routeNameArray.length > 0) {
            routeNameVal = routeNameArray.toString();
        }
        let noOfTransaction = 0;;
        let totalAmtVal = 0;
        if (transArray.length > 0) {
            for (let i = 0; i < transArray.length; i++) {
                noOfTransaction = noOfTransaction + Number(transArray[i].transactionCount);
                totalAmtVal = totalAmtVal + Number(transArray[i].transactionAmount);
            }
        }

        if (customerArray.length > 0) {
            for (let i = 0; i < customerArray.length; i++) {
                customerArray[i].weight = (Number(customerArray[i].totalAmt) /
                    Number(totalAmtVal)) * 100
            }
        }
        return {
            noOfTransaction: noOfTransaction,
            totalAmtVal: totalAmtVal.toFixed(2),
            transArray: transArray,
            branchArray: branchArray.toString(),
            salesManName: salesManName,
            fromDateVal: fromDateVal,
            customerListArray: customerArray,
            toDateVal: toDateVal,
            routeCodeVal: routeCodeVal,
            routeNameVal: routeNameVal
        };
    },

    /**
* 
* @param {*} id 
* @param {*} fromDate 
* @param {*} toDate 
* get total weightage distribution Export
*/
    'routeGroup.weightageDetailsExport': (id, fromDate, toDate, managerBranch, branch) => {
        let fromDateVal = moment(fromDate).format('DD-MM-YYYY');
        let toDateVal = moment(toDate).format('DD-MM-YYYY');
        toDate.setDate(toDate.getDate() + 1);
        let userRes = [];
        let userValues = [];
        if (id !== '' && branch !== '') {
            userRes = allUsers.find({ _id: id, branch: branch }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        else if (id === '' && branch !== '') {
            userRes = allUsers.find({
                branch: branch, userType: 'V',
                'profile.isDeleted': false,
            }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        else if (id !== '' && branch === '') {
            userRes = allUsers.find({ _id: id }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        else {
            userRes = allUsers.find({
                branch: {
                    $in: managerBranch
                }, userType: 'V',
                'profile.isDeleted': false,
            }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        if (userRes.length > 0) {
            let transArray = [];
            for (let k = 0; k < userRes.length; k++) {
                let arInvAmount = 0;
                let posAmount = 0;
                let customerArray = [];
                let branchArray = [];
                transArray = [];
                let arInvRes = ArInvoicePayment.find({
                    vansaleApp: true, userId: userRes[k]._id, createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: managerBranch }
                }, { fields: { docTotal: 1, cardName: 1, cardCode: 1 } }).fetch();
                let arInvCount = arInvRes.length;
                if (arInvRes.length > 0) {
                    for (let i = 0; i < arInvRes.length; i++) {
                        arInvAmount = arInvAmount + Number(arInvRes[i].docTotal);
                        if (customerArray.length === 0) {
                            customerArray.push({
                                customerName: arInvRes[i].cardName,
                                customerCode: arInvRes[i].cardCode,
                                totalAmt: Number(arInvRes[i].docTotal)
                            });
                        }
                        else {
                            let res = customerArray.filter(itemData => {
                                return arInvRes[i].cardCode === itemData.customerCode
                            });
                            if (res.length > 0) {
                                for (let m = 0; m < customerArray.length; m++) {
                                    if (customerArray[m].customerCode === res[0].customerCode) {
                                        customerArray[m].totalAmt = Number(customerArray[m].totalAmt) +
                                            Number(arInvRes[i].docTotal);
                                        break;
                                    }
                                }
                            }
                            else {
                                customerArray.push({
                                    customerName: arInvRes[i].cardName,
                                    customerCode: arInvRes[i].cardCode,
                                    totalAmt: Number(arInvRes[i].docTotal)
                                });
                            }
                        }
                    }
                }
                let arInvObj = {
                    transactionName: "AR Invoice + Payment",
                    transactionCount: arInvCount,
                    transactionAmount: arInvAmount.toFixed(6)
                };
                transArray.push(arInvObj);
                let posRes = Invoice.find({
                    vansaleApp: true, posValue: true, userId: userRes[k]._id, createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: managerBranch }
                }, { fields: { grandTotal: 1, cardName: 1, cardCode: 1 } }).fetch();
                let posCount = posRes.length;
                if (posRes.length > 0) {
                    for (let i = 0; i < posRes.length; i++) {
                        posAmount = posAmount + Number(posRes[i].grandTotal);
                        if (customerArray.length === 0) {
                            customerArray.push({
                                customerName: posRes[i].cardName,
                                customerCode: posRes[i].cardCode,
                                totalAmt: Number(posRes[i].grandTotal)
                            });
                        }
                        else {
                            let res = customerArray.filter(itemData => {
                                return posRes[i].cardCode === itemData.customerCode
                            });
                            if (res.length > 0) {
                                for (let m = 0; m < customerArray.length; m++) {
                                    if (customerArray[m].customerCode === res[0].customerCode) {
                                        customerArray[m].totalAmt = Number(customerArray[m].totalAmt) +
                                            Number(posRes[i].grandTotal);
                                        break;
                                    }
                                }
                            }
                            else {
                                customerArray.push({
                                    customerName: posRes[i].cardName,
                                    customerCode: posRes[i].cardCode,
                                    totalAmt: Number(posRes[i].grandTotal)
                                });
                            }
                        }
                    }
                }
                let posObj = {
                    transactionName: "POS Sales",
                    transactionCount: posCount,
                    transactionAmount: posAmount.toFixed(6)
                };
                transArray.push(posObj);
                for (let i = 0; i < userRes[k].branch.length; i++) {
                    let branchRes = Branch.findOne({ bPLId: userRes[k].branch[i] });
                    if (branchRes) {
                        branchArray.push(branchRes.bPLName);
                    }
                }
                let routeArray = [];
                let routeAssignRes = RouteAssign.find({
                    active: "Y",
                    assignedTo: id, routeStatus: { $eq: 'Assigned' },
                    routeDateIso: {
                        $lt: toDate,
                    },
                    routeDateEndIso: {
                        $gte: fromDate,
                    },
                    branch: { $in: managerBranch },
                }, { fields: { routeId: 1, } }).fetch();
                let routeNameArray = [];
                if (routeAssignRes.length > 0) {
                    routeArray = [];
                    for (let i = 0; i < routeAssignRes.length; i++) {
                        let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes[i].routeId }, { fields: { routeName: 1, routeCode: 1 } });
                        if (routeGrpRes) {
                            routeArray.push(` ${routeGrpRes.routeName}`);
                            routeNameArray.push(` ${routeGrpRes.routeCode}`);
                        }
                    }
                }
                let routeCodeVal = 'Not Assigned';
                let routeNameVal = 'Not Assigned';
                if (routeArray.length > 0) {
                    routeCodeVal = routeArray.toString();
                }
                if (routeNameArray.length > 0) {
                    routeNameVal = routeNameArray.toString();
                }
                let noOfTransaction = 0;;
                let totalAmtVal = 0;
                if (transArray.length > 0) {
                    for (let i = 0; i < transArray.length; i++) {
                        noOfTransaction = noOfTransaction + Number(transArray[i].transactionCount);
                        totalAmtVal = totalAmtVal + Number(transArray[i].transactionAmount);
                    }
                }

                if (customerArray.length > 0) {
                    for (let i = 0; i < customerArray.length; i++) {
                        customerArray[i].weight = (Number(customerArray[i].totalAmt) /
                            Number(totalAmtVal)) * 100
                    }
                }

                let userObj =
                {
                    _id: userRes[k]._id,
                    salesManName: `${userRes[k].profile.firstName} ${userRes[k].profile.lastName}`,
                    branchArrayDatas: branchArray.toString(),
                    userType: userRes[k].userType,
                    transArray: transArray,
                    fromDateVal: fromDateVal,
                    toDateVal: toDateVal,
                    routeCodeVal: routeCodeVal,
                    routeNameVal: routeNameVal,
                    noOfTransaction: noOfTransaction,
                    customerListArray: customerArray,
                    totalAmtVal: totalAmtVal
                }
                userValues.push(userObj);
            }
        }
        return userValues;
    },
    /**
     * 
     * @param {*} id 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} branch 
     * @returns get transaction count for sales summary report
     */
    'routeGroup.transactionCount': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        let countVal = 0;
        let orderRes = Order.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }).count();
        countVal = countVal + orderRes;
        let quotRes = SalesQuotation.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }).count();
        countVal = countVal + quotRes;
        let ArInvRes = ArInvoicePayment.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }).count();
        countVal = countVal + ArInvRes;
        let posRes = Invoice.find({
            vansaleApp: true, posValue: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }).count();
        countVal = countVal + posRes;
        let creditInvRes = Invoice.find({
            vansaleApp: true, posValue: { $ne: true }, creditInvoice: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }).count();
        countVal = countVal + creditInvRes;
        return countVal;
    },
    /**
     * 
     * @param {*} id 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} branch 
     * @returns get transaction count for sales summary report
     */
    'routeGroup.transactionCountWeight': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        let countVal = 0;
        let ArInvRes = ArInvoicePayment.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }).count();
        countVal = countVal + ArInvRes;
        let posRes = Invoice.find({
            vansaleApp: true, posValue: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }).count();
        countVal = countVal + posRes;
        return countVal;
    },
    /**
   * 
   * @param {*} id 
   * @param {*} fromDate 
   * @param {*} toDate 
   * @param {*} branch 
   * @returns get transaction amount for sales summary report
   */
    'routeGroup.transactionAmount': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        let amtVal = 0;
        let orderRes = Order.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1 } }).fetch();
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                amtVal = amtVal + Number(orderRes[i].docTotal);
            }
        }
        let quotRes = SalesQuotation.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1 } }).fetch();
        if (quotRes.length > 0) {
            for (let i = 0; i < quotRes.length; i++) {
                amtVal = amtVal + Number(quotRes[i].docTotal);
            }
        }
        let ArInvRes = ArInvoicePayment.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1 } }).fetch();
        if (ArInvRes.length > 0) {
            for (let i = 0; i < ArInvRes.length; i++) {
                amtVal = amtVal + Number(ArInvRes[i].docTotal);
            }
        }
        let posRes = Invoice.find({
            vansaleApp: true, posValue: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { grandTotal: 1 } }).fetch();
        if (posRes.length > 0) {
            for (let i = 0; i < posRes.length; i++) {
                amtVal = amtVal + Number(posRes[i].grandTotal);
            }
        }
        let creditInvRes = Invoice.find({
            vansaleApp: true, posValue: { $ne: true }, creditInvoice: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { grandTotal: 1 } }).fetch();
        if (creditInvRes.length > 0) {
            for (let i = 0; i < creditInvRes.length; i++) {
                amtVal = amtVal + Number(creditInvRes[i].grandTotal);
            }
        }

        return amtVal.toFixed(2);
    },

    /**
 * 
 * @param {*} id 
 * @param {*} fromDate 
 * @param {*} toDate 
 * @param {*} branch 
 * @returns get transaction amount for Weightage Distribution
 */
    'routeGroup.amtWeightageDistribution': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
        let amtVal = 0;
        let ArInvRes = ArInvoicePayment.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1 } }).fetch();
        if (ArInvRes.length > 0) {
            for (let i = 0; i < ArInvRes.length; i++) {
                amtVal = amtVal + Number(ArInvRes[i].docTotal);
            }
        }
        let posRes = Invoice.find({
            vansaleApp: true, posValue: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { grandTotal: 1 } }).fetch();
        if (posRes.length > 0) {
            for (let i = 0; i < posRes.length; i++) {
                amtVal = amtVal + Number(posRes[i].grandTotal);
            }
        }

        return amtVal.toFixed(2);
    },
    /**
   * 
   * @param {*} id 
   * @param {*} fromDate 
   * @param {*} toDate 
   * @param {*} branch 
   * @returns get transaction amount for sales summary report
   */
    'routeGroup.salesSummaryDetail': (id, fromDate, toDate, branch) => {
        let fromDateVal = moment(fromDate).format('DD-MM-YYYY');
        let toDateVal = moment(toDate).format('DD-MM-YYYY');
        toDate.setDate(toDate.getDate() + 1);
        let transArray = [];
        let orderAmount = 0;
        let quotationAmount = 0;
        let arInvAmount = 0;
        let posAmount = 0;
        let crInvAmount = 0;
        let orderRes = Order.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1 } }).fetch();
        let orderCount = orderRes.length;
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                orderAmount = orderAmount + Number(orderRes[i].docTotal);
            }
        }
        let orderObj = {
            transactionName: "Sales Order",
            transactionCount: orderCount,
            transactionAmount: orderAmount.toFixed(6)
        };
        transArray.push(orderObj);
        let quotRes = SalesQuotation.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1 } }).fetch();
        let quotCount = quotRes.length;
        if (quotRes.length > 0) {
            for (let i = 0; i < quotRes.length; i++) {
                quotationAmount = quotationAmount + Number(quotRes[i].docTotal);
            }
        }
        let quotObj = {
            transactionName: "Sales Quotation",
            transactionCount: quotCount,
            transactionAmount: quotationAmount.toFixed(6)
        };
        transArray.push(quotObj);
        let arInvRes = ArInvoicePayment.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { docTotal: 1 } }).fetch();
        let arInvCount = arInvRes.length;
        if (arInvRes.length > 0) {
            for (let i = 0; i < arInvRes.length; i++) {
                arInvAmount = arInvAmount + Number(arInvRes[i].docTotal);
            }
        }
        let arInvObj = {
            transactionName: "AR Invoice + Payment",
            transactionCount: arInvCount,
            transactionAmount: arInvAmount.toFixed(6)
        };
        transArray.push(arInvObj);
        let posRes = Invoice.find({
            vansaleApp: true, posValue: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { grandTotal: 1 } }).fetch();
        let posCount = posRes.length;
        if (posRes.length > 0) {
            for (let i = 0; i < posRes.length; i++) {
                posAmount = posAmount + Number(posRes[i].grandTotal);
            }
        }
        let posObj = {
            transactionName: "POS Sales",
            transactionCount: posCount,
            transactionAmount: posAmount.toFixed(6)
        };
        transArray.push(posObj);
        let creditInvRes = Invoice.find({
            vansaleApp: true, posValue: { $ne: true }, creditInvoice: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: { $in: branch }
        }, { fields: { grandTotal: 1 } }).fetch();
        let creditInvCount = creditInvRes.length;
        if (creditInvRes.length > 0) {
            for (let i = 0; i < creditInvRes.length; i++) {
                crInvAmount = crInvAmount + Number(creditInvRes[i].grandTotal);
            }
        }
        let crInvObj = {
            transactionName: "Credit Invoice",
            transactionCount: creditInvCount,
            transactionAmount: crInvAmount.toFixed(6)
        };
        transArray.push(crInvObj);
        let salesManName = '';
        let branchArray = [];
        let userDetails = allUsers.findOne({ _id: id }, { fields: { profile: 1, branch: 1 } });
        if (userDetails) {
            salesManName = `${userDetails.profile.firstName} ${userDetails.profile.lastName}`;
            for (let i = 0; i < userDetails.branch.length; i++) {
                let branchRes = Branch.findOne({ bPLId: userDetails.branch[i] });
                if (branchRes) {
                    branchArray.push(branchRes.bPLName);
                }
            }
        }
        let routeArray = [];
        let routeAssignRes = RouteAssign.find({
            active: "Y",
            assignedTo: id, routeStatus: { $eq: 'Assigned' },
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            },
            branch: { $in: branch },
        }, { fields: { routeId: 1, } }).fetch();
        let routeNameArray = [];
        if (routeAssignRes.length > 0) {
            routeArray = [];
            for (let i = 0; i < routeAssignRes.length; i++) {
                let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes[i].routeId }, { fields: { routeName: 1, routeCode: 1 } });
                if (routeGrpRes) {
                    routeArray.push(` ${routeGrpRes.routeName}`);
                    routeNameArray.push(` ${routeGrpRes.routeCode}`);
                }
            }
        }
        let routeCodeVal = 'Not Assigned';
        let routeNameVal = 'Not Assigned';
        if (routeArray.length > 0) {
            routeCodeVal = routeArray.toString();
        }
        if (routeNameArray.length > 0) {
            routeNameVal = routeNameArray.toString();
        }
        let noOfTransaction = 0;;
        let totalAmtVal = 0;
        if (transArray.length > 0) {
            for (let i = 0; i < transArray.length; i++) {
                noOfTransaction = noOfTransaction + Number(transArray[i].transactionCount);
                totalAmtVal = totalAmtVal + Number(transArray[i].transactionAmount);
            }
        }
        return {
            noOfTransaction: noOfTransaction,
            totalAmtVal: totalAmtVal.toFixed(2),
            transArray: transArray,
            branchArray: branchArray.toString(),
            salesManName: salesManName,
            fromDateVal: fromDateVal,
            toDateVal: toDateVal,
            routeCodeVal: routeCodeVal,
            routeNameVal: routeNameVal
        };
    },
    /**
* 
* @param {*} id 
* @param {*} fromDate 
* @param {*} toDate 
* @param {*} branch 
* @returns get transaction amount for sales summary report export
*/
    'routeGroup.salesSummaryDetailExport': (id, fromDate, toDate, branch) => {
        let fromDateVal = moment(fromDate).format('DD-MM-YYYY');
        let toDateVal = moment(toDate).format('DD-MM-YYYY');
        toDate.setDate(toDate.getDate() + 1);
        let transArray = [];
        let orderAmount = 0;
        let quotationAmount = 0;
        let arInvAmount = 0;
        let posAmount = 0;
        let crInvAmount = 0;
        let orderRes = Order.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: branch
        }, { fields: { docTotal: 1 } }).fetch();
        let orderCount = orderRes.length;
        if (orderRes.length > 0) {
            for (let i = 0; i < orderRes.length; i++) {
                orderAmount = orderAmount + Number(orderRes[i].docTotal);
            }
        }
        let orderObj = {
            transactionName: "Sales Order",
            transactionCount: orderCount,
            transactionAmount: orderAmount.toFixed(6)
        };
        transArray.push(orderObj);
        let quotRes = SalesQuotation.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: branch
        }, { fields: { docTotal: 1 } }).fetch();
        let quotCount = quotRes.length;
        if (quotRes.length > 0) {
            for (let i = 0; i < quotRes.length; i++) {
                quotationAmount = quotationAmount + Number(quotRes[i].docTotal);
            }
        }
        let quotObj = {
            transactionName: "Sales Quotation",
            transactionCount: quotCount,
            transactionAmount: quotationAmount.toFixed(6)
        };
        transArray.push(quotObj);
        let arInvRes = ArInvoicePayment.find({
            vansaleApp: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: branch
        }, { fields: { docTotal: 1 } }).fetch();
        let arInvCount = arInvRes.length;
        if (arInvRes.length > 0) {
            for (let i = 0; i < arInvRes.length; i++) {
                arInvAmount = arInvAmount + Number(arInvRes[i].docTotal);
            }
        }
        let arInvObj = {
            transactionName: "AR Invoice + Payment",
            transactionCount: arInvCount,
            transactionAmount: arInvAmount.toFixed(6)
        };
        transArray.push(arInvObj);
        let posRes = Invoice.find({
            vansaleApp: true, posValue: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: branch
        }, { fields: { grandTotal: 1 } }).fetch();
        let posCount = posRes.length;
        if (posRes.length > 0) {
            for (let i = 0; i < posRes.length; i++) {
                posAmount = posAmount + Number(posRes[i].grandTotal);
            }
        }
        let posObj = {
            transactionName: "POS Sales",
            transactionCount: posCount,
            transactionAmount: posAmount.toFixed(6)
        };
        transArray.push(posObj);
        let creditInvRes = Invoice.find({
            vansaleApp: true, posValue: { $ne: true }, creditInvoice: true, userId: id, createdAt: {
                $gte: fromDate,
                $lt: toDate
            }, branch: branch
        }, { fields: { grandTotal: 1 } }).fetch();
        let creditInvCount = creditInvRes.length;
        if (creditInvRes.length > 0) {
            for (let i = 0; i < creditInvRes.length; i++) {
                crInvAmount = crInvAmount + Number(creditInvRes[i].grandTotal);
            }
        }
        let crInvObj = {
            transactionName: "Credit Invoice",
            transactionCount: creditInvCount,
            transactionAmount: crInvAmount.toFixed(6)
        };
        transArray.push(crInvObj);
        let salesManName = '';
        let branchArray = [];
        let userDetails = allUsers.findOne({ _id: id }, { fields: { profile: 1, branch: 1 } });
        if (userDetails) {
            salesManName = `${userDetails.profile.firstName} ${userDetails.profile.lastName}`;
            for (let i = 0; i < userDetails.branch.length; i++) {
                let branchRes = Branch.findOne({ bPLId: userDetails.branch[i] });
                if (branchRes) {
                    branchArray.push(branchRes.bPLName);
                }
            }
        }
        let routeArray = [];
        let routeAssignRes = RouteAssign.find({
            active: "Y",
            assignedTo: id, routeStatus: { $eq: 'Assigned' },
            routeDateIso: {
                $lt: toDate,
            },
            routeDateEndIso: {
                $gte: fromDate,
            },
            branch: branch,
        }, { fields: { routeId: 1, } }).fetch();
        let routeNameArray = [];
        if (routeAssignRes.length > 0) {
            routeArray = [];
            for (let i = 0; i < routeAssignRes.length; i++) {
                let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes[i].routeId }, { fields: { routeName: 1, routeCode: 1 } });
                if (routeGrpRes) {
                    routeArray.push(` ${routeGrpRes.routeName}`);
                    routeNameArray.push(` ${routeGrpRes.routeCode}`);
                }
            }
        }
        let routeCodeVal = 'Not Assigned';
        let routeNameVal = 'Not Assigned';
        if (routeArray.length > 0) {
            routeCodeVal = routeArray.toString();
        }
        if (routeNameArray.length > 0) {
            routeNameVal = routeNameArray.toString();
        }
        let noOfTransaction = 0;;
        let totalAmtVal = 0;
        if (transArray.length > 0) {
            for (let i = 0; i < transArray.length; i++) {
                noOfTransaction = noOfTransaction + Number(transArray[i].transactionCount);
                totalAmtVal = totalAmtVal + Number(transArray[i].transactionAmount);
            }
        }
        return {
            noOfTransaction: noOfTransaction,
            totalAmtVal: totalAmtVal.toFixed(2),
            transArray: transArray,
            branchArray: branchArray.toString(),
            salesManName: salesManName,
            fromDateVal: fromDateVal,
            toDateVal: toDateVal,
            routeCodeVal: routeCodeVal,
            routeNameVal: routeNameVal
        };
    },
    /**
     * 
     * @param {*} vansaleRoles 
     * @returns get vansale user details
     */
    'routeGroup.getUserDetails': (vansaleRoles) => {
        let userArray = [];
        let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
        let toDay = new Date();
        let dateOne = moment(toDay).format('YYYY-MM-DD');
        let toDate = new Date(dateOne);
        let nextDay = new Date(toDate);
        nextDay.setDate(nextDay.getDate() + 1);
        let routeDates = new Date(todayDates);
        let routeEndDate = new Date(todayDates);
        routeDates.setDate(routeDates.getDate() + 1);
        let userData = allUsers.find({
            userType: "V", active: "Y",
            roles: { $in: vansaleRoles }
        }, {
            fields: {
                profile: 1
            }
        }).fetch();

        if (userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let routeArray = [];
                let routeDateArray = [];
                let routeRes = RouteAssign.find({
                    active: "Y",
                    assignedTo: userData[i]._id, routeStatus: { $eq: 'Assigned' },
                    routeDateIso: {
                        $lt: routeDates,
                    },
                    routeDateEndIso: {
                        $gte: routeEndDate,
                    }
                }, {
                    fields: {
                        routeId: 1, routeDate: 1, routeStatus: 1, routeDateEnd: 1,
                        routeDateEnd: 1, routeDate: 1
                    }
                }).fetch();
                if (routeRes !== undefined && routeRes.length > 0) {
                    for (let x = 0; x < routeRes.length; x++) {
                        let routeName = '';
                        let startDate = routeRes[x].routeDate;
                        let endDate = routeRes[x].routeDateEnd;
                        // get route details
                        let routeGrupRes = RouteGroup.findOne({ _id: routeRes[x].routeId });
                        // get customer count  
                        if (routeGrupRes !== undefined) {
                            routeName = routeGrupRes.routeName;
                        }
                        routeArray.push(routeName);
                        let dateVal = `${startDate}
                         ${endDate}`;
                        routeDateArray.push(dateVal);
                    }
                }

                let amtVal = 0;
                let orderRes = Order.find({
                    userId: userData[i]._id, createdAt: {
                        $gte: toDate,
                        $lt: nextDay
                    },
                }, { fields: { docTotal: 1 } }).fetch();
                if (orderRes.length > 0) {
                    for (let i = 0; i < orderRes.length; i++) {
                        amtVal = amtVal + Number(orderRes[i].docTotal);
                    }
                }
                let quotRes = SalesQuotation.find({
                    vansaleApp: true, userId: userData[i]._id, createdAt: {
                        $gte: toDate,
                        $lt: nextDay
                    },
                }, { fields: { docTotal: 1 } }).fetch();
                if (quotRes.length > 0) {
                    for (let i = 0; i < quotRes.length; i++) {
                        amtVal = amtVal + Number(quotRes[i].docTotal);
                    }
                }
                let ArInvRes = ArInvoicePayment.find({
                    vansaleApp: true, userId: userData[i]._id, createdAt: {
                        $gte: toDate,
                        $lt: nextDay
                    },
                }, { fields: { docTotal: 1 } }).fetch();
                if (ArInvRes.length > 0) {
                    for (let i = 0; i < ArInvRes.length; i++) {
                        amtVal = amtVal + Number(ArInvRes[i].docTotal);
                    }
                }
                let posRes = Invoice.find({
                    vansaleApp: true, posValue: true, userId: userData[i]._id, createdAt: {
                        $gte: toDate,
                        $lt: nextDay
                    }
                }, { fields: { grandTotal: 1 } }).fetch();
                if (posRes.length > 0) {
                    for (let i = 0; i < posRes.length; i++) {
                        amtVal = amtVal + Number(posRes[i].grandTotal);
                    }
                }
                let creditInvRes = Invoice.find({
                    vansaleApp: true, posValue: { $ne: true }, creditInvoice: true, userId: userData[i]._id, createdAt: {
                        $gte: toDate,
                        $lt: nextDay
                    },
                }, { fields: { grandTotal: 1 } }).fetch();
                if (creditInvRes.length > 0) {
                    for (let i = 0; i < creditInvRes.length; i++) {
                        amtVal = amtVal + Number(creditInvRes[i].grandTotal);
                    }
                }
                userArray.push({
                    _id: userData[i]._id,
                    profile: userData[i].profile,
                    routeArray: routeArray.toString(),
                    amtVal: Number(amtVal).toFixed(2),
                    routeDateArray: routeDateArray.toString()
                });
            }
        }
        return userArray;
    },
    /**
* 
* @param {*} id 
* @param {*} fromDate 
* @param {*} toDate 
* @param {*} branch 
* @returns get transaction amount for sales summary report export
*/
    'routeGroup.salesSummaryDetailExportNew': (id, fromDate, toDate, branch, managerBranch) => {
        let userRes = [];
        let userValues = [];
        let fromDateVal = moment(fromDate).format('DD-MM-YYYY');
        let toDateVal = moment(toDate).format('DD-MM-YYYY');
        toDate.setDate(toDate.getDate() + 1);
        if (id !== '' && branch !== '') {
            userRes = allUsers.find({ _id: id, branch: branch }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        else if (id === '' && branch !== '') {
            userRes = allUsers.find({
                branch: branch, userType: 'V',
                'profile.isDeleted': false,
            }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        else if (id !== '' && branch === '') {
            userRes = allUsers.find({ _id: id }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        else {
            userRes = allUsers.find({
                branch: {
                    $in: managerBranch
                }, userType: 'V',
                'profile.isDeleted': false,
            }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
        }
        if (userRes.length > 0) {
            let transArray = [];
            for (let k = 0; k < userRes.length; k++) {
                let orderAmount = 0;
                let quotationAmount = 0;
                let arInvAmount = 0;
                let posAmount = 0;
                let crInvAmount = 0;
                let branchArray = [];
                transArray = [];
                let orderRes = Order.find({
                    vansaleApp: true, userId: userRes[k]._id, createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: managerBranch }
                }, { fields: { docTotal: 1 } }).fetch();
                let orderCount = orderRes.length;
                if (orderRes.length > 0) {
                    for (let i = 0; i < orderRes.length; i++) {
                        orderAmount = orderAmount + Number(orderRes[i].docTotal);
                    }
                }
                let orderObj = {
                    transactionName: "Sales Order",
                    transactionCount: orderCount,
                    transactionAmount: orderAmount.toFixed(6)
                };
                transArray.push(orderObj);
                let quotRes = SalesQuotation.find({
                    vansaleApp: true, userId: userRes[k]._id, createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: managerBranch }
                }, { fields: { docTotal: 1 } }).fetch();
                let quotCount = quotRes.length;
                if (quotRes.length > 0) {
                    for (let i = 0; i < quotRes.length; i++) {
                        quotationAmount = quotationAmount + Number(quotRes[i].docTotal);
                    }
                }
                let quotObj = {
                    transactionName: "Sales Quotation",
                    transactionCount: quotCount,
                    transactionAmount: quotationAmount.toFixed(6)
                };
                transArray.push(quotObj);
                let arInvRes = ArInvoicePayment.find({
                    vansaleApp: true, userId: userRes[k]._id, createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: managerBranch }
                }, { fields: { docTotal: 1 } }).fetch();
                let arInvCount = arInvRes.length;
                if (arInvRes.length > 0) {
                    for (let i = 0; i < arInvRes.length; i++) {
                        arInvAmount = arInvAmount + Number(arInvRes[i].docTotal);
                    }
                }
                let arInvObj = {
                    transactionName: "AR Invoice + Payment",
                    transactionCount: arInvCount,
                    transactionAmount: arInvAmount.toFixed(6)
                };
                transArray.push(arInvObj);
                let posRes = Invoice.find({
                    vansaleApp: true, posValue: true, userId: userRes[k]._id, createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: managerBranch }
                }, { fields: { grandTotal: 1 } }).fetch();
                let posCount = posRes.length;
                if (posRes.length > 0) {
                    for (let i = 0; i < posRes.length; i++) {
                        posAmount = posAmount + Number(posRes[i].grandTotal);
                    }
                }
                let posObj = {
                    transactionName: "POS Sales",
                    transactionCount: posCount,
                    transactionAmount: posAmount.toFixed(6)
                };
                transArray.push(posObj);
                let creditInvRes = Invoice.find({
                    vansaleApp: true, posValue: { $ne: true }, creditInvoice: true, userId: userRes[k]._id, createdAt: {
                        $gte: fromDate,
                        $lt: toDate
                    }, branch: { $in: managerBranch }
                }, { fields: { grandTotal: 1 } }).fetch();
                let creditInvCount = creditInvRes.length;
                if (creditInvRes.length > 0) {
                    for (let i = 0; i < creditInvRes.length; i++) {
                        crInvAmount = crInvAmount + Number(creditInvRes[i].grandTotal);
                    }
                }
                let crInvObj = {
                    transactionName: "Credit Invoice",
                    transactionCount: creditInvCount,
                    transactionAmount: crInvAmount.toFixed(6)
                };
                transArray.push(crInvObj);
                for (let i = 0; i < userRes[k].branch.length; i++) {
                    let branchRes = Branch.findOne({ bPLId: userRes[k].branch[i] });
                    if (branchRes) {
                        branchArray.push(branchRes.bPLName);
                    }
                }
                let routeArray = [];
                let routeAssignRes = RouteAssign.find({
                    active: "Y",
                    assignedTo: userRes[k]._id, routeStatus: { $eq: 'Assigned' },
                    routeDateIso: {
                        $lt: toDate,
                    },
                    routeDateEndIso: {
                        $gte: fromDate,
                    },
                    branch: { $in: managerBranch },
                }, { fields: { routeId: 1, } }).fetch();
                let routeNameArray = [];
                if (routeAssignRes.length > 0) {
                    routeArray = [];
                    for (let i = 0; i < routeAssignRes.length; i++) {
                        let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes[i].routeId }, { fields: { routeName: 1, routeCode: 1 } });
                        if (routeGrpRes) {
                            routeArray.push(` ${routeGrpRes.routeName}`);
                            routeNameArray.push(` ${routeGrpRes.routeCode}`);
                        }
                    }
                }
                let routeCodeVal = 'Not Assigned';
                let routeNameVal = 'Not Assigned';
                if (routeArray.length > 0) {
                    routeCodeVal = routeArray.toString();
                }
                if (routeNameArray.length > 0) {
                    routeNameVal = routeNameArray.toString();
                }
                let noOfTransaction = 0;;
                let totalAmtVal = 0;
                if (transArray.length > 0) {
                    for (let i = 0; i < transArray.length; i++) {
                        noOfTransaction = noOfTransaction + Number(transArray[i].transactionCount);
                        totalAmtVal = totalAmtVal + Number(transArray[i].transactionAmount);
                    }
                }
                let userObj =
                {
                    _id: userRes[k]._id,
                    salesManName: `${userRes[k].profile.firstName} ${userRes[k].profile.lastName}`,
                    branchArrayDatas: branchArray.toString(),
                    userType: userRes[k].userType,
                    transArray: transArray,
                    fromDateVal: fromDateVal,
                    toDateVal: toDateVal,
                    routeCodeVal: routeCodeVal,
                    routeNameVal: routeNameVal,
                    noOfTransaction: noOfTransaction,
                    totalAmtVal: totalAmtVal
                }
                userValues.push(userObj);
            }
        }
        return userValues;
    },
});



// function for create route customer master data

function createGroupCustomer(id, groupResult) {
    return RouteCustomer.insert({
        routeId: id,
        customer: groupResult.customer,
        priority: groupResult.priority,
        randomId: groupResult.randomId,
        createdAt: new Date(),
        uuid: Random.id(),
        active: 'Y',
    })

}


// function for update customer master updates

function customerMasterUpdate(customerArray, routeId) {
    let routeCustomerArray = RouteCustomer.find({ routeId: routeId, active: "Y" },).fetch();
    if (routeCustomerArray !== undefined && routeCustomerArray.length > 0) {
        customerStatUpdate(routeCustomerArray);
    }
    // deactivate customer if not present in customerArray
    function customerStatUpdate(routeCustomerArray) {
        for (let i = 0; i < routeCustomerArray.length; i++) {
            let custRes = customerArray.find(x => x.customer === routeCustomerArray[i].customer);
            if (custRes === undefined) {
                RouteCustomer.update({
                    routeId: routeId,
                    customer: routeCustomerArray[i].customer
                }, {
                    $set:
                    {
                        active: 'N',
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }

        }
        // customer updates
        customerInsert(customerArray);

    }

    function customerInsert(customerArray) {

        for (let k = 0; k < customerArray.length; k++) {

            let routeCustRes = RouteCustomer.find({ routeId: routeId, customer: customerArray[k].customer }).fetch();
            // Insert data if not present
            if (routeCustRes.length === 0) {
                RouteCustomer.insert({
                    routeId: routeId,
                    customer: customerArray[k].customer,
                    priority: customerArray[k].priority,
                    randomId: customerArray[k].randomId,
                    address: customerArray[k].address,
                    createdAt: new Date(),
                    uuid: Random.id(),
                    active: 'Y',
                })
            }
            // update status if customer is inactive
            else if (routeCustRes[0].active === 'N') {
                RouteCustomer.update({
                    routeId: routeId,
                    customer: routeCustRes[0].customer
                }, {
                    $set:
                    {
                        active: 'Y',
                        priority: customerArray[k].priority,
                        address: customerArray[k].address,
                        updatedBy: Meteor.userId(),
                        updatedAt: new Date(),
                    }
                });
            }
        }

    }


    // insert data if no customer found

    let routeCustomerCheck = RouteCustomer.find({ routeId: routeId },).fetch();

    if (routeCustomerCheck !== undefined && routeCustomerCheck.length === 0) {
        for (let k = 0; k < customerArray.length; k++) {
            RouteCustomer.insert({
                routeId: routeId,
                customer: customerArray[k].customer,
                priority: customerArray[k].priority,
                randomId: customerArray[k].randomId,
                address: customerArray[k].address,
                createdAt: new Date(),
                uuid: Random.id(),
                active: 'Y',
            });
        }
    }
}