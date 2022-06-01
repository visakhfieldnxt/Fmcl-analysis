/**
 * @author Nithin
 */
import { RouteAssign } from './routeAssign';
import { RouteGroup } from '../routeGroup/routeGroup';
// import { RouteCustomer } from '../routeCustomer/routeCustomer';
// import { RouteUpdates } from '../routeUpdates/routeUpdates';
// import { Customer } from "../customer/customer";
import { Branch } from "../branch/branch";
import { roles } from "../role/role";
import { Outlets } from '../outlets/outlets';

Meteor.methods({

    /**
     * assign employee
     */
    'routeAssign.assignEmployee': (id, empId, description, routeDate, loginUserVerticals) => {
        let routeGrpData = RouteGroup.findOne({ _id: id });
        return RouteAssign.insert({
            routeId: id,
            assignedTo: empId,
            remarks: description,
            routeDate: routeDate,
            routeStatus: "Assigned",
            subDistributor: routeGrpData.subDistributor,
            vertical: loginUserVerticals,
            uuid: Random.id(),
            groupDeactivated: false,
            active: 'Y',
            assignedAt: new Date(),
            assignedBy: Meteor.userId(),
            createdAt: new Date(),
        });
    },
    // get route data based on id
    'routeAssign.id': (id) => {
        let routeAssignRes = RouteAssign.findOne({ _id: id });
        let assignedToName = '';
        let assignedByName = '';
        let subDitributorName = '';
        let customerDetailsArray = [];
        let routeUpdatesArray = [];
        let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
        let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo },
            {
                fields: { profile: 1 }
            });
        if (userRes) {
            assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`
        }
        let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy },
            { fields: { profile: 1 } });
        if (userRes1) {
            assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`
        }
        let userRes2 = Meteor.users.findOne({ _id: routeAssignRes.subDistributor },
            { fields: { profile: 1 } });
        if (userRes2) {
            subDitributorName = `${userRes2.profile.firstName} ${userRes2.profile.lastName}`
        }
        let customerRes = Outlets.find({ routeId: routeAssignRes.routeId, active: "Y", approvalStatus: "Approved", assigned: true },
            {
                fields: {
                    name: 1, priority: 1,
                }
            }).fetch();
        if (customerRes !== undefined && customerRes.length > 0) {
            customerDetailsArray = customerRes;
        }
        return {
            routeAssignRes: routeAssignRes,
            routeGrpRes: routeGrpRes,
            assignedToName: assignedToName,
            assignedByName: assignedByName,
            customerDetailsArray: customerDetailsArray,
            routeUpdatesArray: routeUpdatesArray,
            subDitributorName: subDitributorName,
        }
    },
    // deactivate route

    'routeAssign.deactivate': (id) => {
        return RouteAssign.update({ _id: id }, {
            $set:
            {
                active: "N",
                routeDeactivated: true,
                updatedBy: Meteor.userId(),
                updatedAt: new Date(),
            }
        });
    },
    // activate route
    'routeAssign.activate': (id) => {
        return RouteAssign.update({ _id: id }, {
            $set:
            {
                active: "Y",
                routeDeactivated: false,
                updatedBy: Meteor.userId(),
                updatedAt: new Date(),
            }
        });
    },
    'routeAssign.dataGet': (_id) => {
        return RouteAssign.findOne({ _id: _id });
    },

    /**
  * TODO:Comlete JS doc
  * remove assignee
  * @param id
  */
    'routeAssign.removeAssign': (id) => {
        let assignDetail = RouteAssign.findOne({
            _id: id
        });
        let assignedHistory = [];
        if (assignDetail.assignedHistory !== undefined) {
            assignedHistory = assignDetail.assignedHistory;
        }
        let assignedOld = {
            randomId: Random.id(),
            assignedTo: assignDetail.assignedTo,
            assignedAt: assignDetail.assignedAt,
            assignedBy: assignDetail.assignedBy,
            assignRemarks: assignDetail.remarks,
            updatedAt: new Date(),
        }
        assignedHistory.push(assignedOld);
        return RouteAssign.update({
            _id: id
        }, {
            $set: {
                assignedAt: '',
                assignedBy: '',
                assignedTo: '',
                remarks: '',
                routeStatus: "Not Assigned",
                assignedHistory: assignedHistory,
                updatedAt: new Date(),
            }
        });
    },

    /**
 * route assign check
 */
    'routeAssign.routeCheck': (id, user) => {
        let routeAssign = false;
        let assignedByName = ''
        let userRes1 = Meteor.users.findOne({ _id: user });
        if (userRes1) {
            assignedByName = userRes1.profile.firstName;
        }
        return { routeAssign: routeAssign, assignedByName: assignedByName, }
    },

    /**
* TODO: Complete Js doc
* Fetching vansale employess based on route data
*/

    'routeAssign.assignedEmployeeList': (id) => {
        let assigRouteRes = RouteAssign.findOne({ _id: id });
        if (assigRouteRes) {
            let userRes = Meteor.users.find({
                active: 'Y', userType: "SDUser", subDistributor: assigRouteRes.subDistributor
            },
                { fields: { profile: 1, roles: 1 } }).fetch();
            let sdUserArray = [];
            if (userRes.length > 0) {
                for (let k = 0; k < userRes.length; k++) {
                    let permissionsData = 'vsrView';
                    let roleData = roles.findOne({ _id: userRes[k].roles[0] });
                    if (roleData !== undefined) {
                        let vsrView = roleData.permissions.includes(permissionsData);
                        if (vsrView === true) {
                            sdUserArray.push(userRes[k]);
                        }
                    }
                }
            }
            return { userRes: sdUserArray };
        }
    },

    /**
  * 
  * @param {} id 
  * assign route
  */
    'routeAssign.reAssignEmployee': (id, employee, remarks, loginUserVerticals) => {
        let routeStatus = "Assigned";
        return RouteAssign.update({ _id: id }, {
            $set:
            {
                assignedTo: employee,
                remarks: remarks,
                routeStatus: routeStatus,
                approvalCheck: false,
                vertical: loginUserVerticals,
                assignedBy: Meteor.userId(),
                assignedAt: new Date(),
                updatedAt: new Date(),
            }
        });
    },

    /**
* route assign check
*/
    'routeAssign.routeReAssignCheck': (id, user) => {
        let assignDetails = RouteAssign.findOne({ _id: id });
        let routeAssign = false;
        let routeAssignRes = RouteAssign.find({
            assignedTo: user, routeDate: assignDetails.routeDate
        }).fetch();
        if (routeAssignRes.length > 0) {
            routeAssign = true;
        }
        let assignedByName = ''
        let userRes1 = Meteor.users.findOne({ _id: user });
        if (userRes1) {
            assignedByName = userRes1.profile.firstName;
        }
        return { routeAssign: routeAssign, assignedByName: assignedByName };

    },
    /**
    * get data for map view
    */
    // 'routeAssign.mapDataGet': (id) => {
    //     let locAry = [];
    //     let routeUpdateRes = RouteUpdates.find({ routeAssignId: id }).fetch();
    //     if (routeUpdateRes !== undefined && routeUpdateRes.length > 0) {
    //         locAry = [];
    //         for (let i = 0; i < routeUpdateRes.length; i++) {
    //             let customerName = '';
    //             let assignedUserName = '';
    //             if (routeUpdateRes[i].customer) {
    //                 let custRes = Customer.findOne({ cardCode: routeUpdateRes[i].customer });
    //                 if (custRes) {
    //                     customerName = custRes.cardName;
    //                 }
    //             }
    //             if (routeUpdateRes[i].assignedTo !== undefined && routeUpdateRes[i].assignedTo !== '') {
    //                 let userRes = Meteor.users.findOne({ _id: routeUpdateRes[i].assignedTo });
    //                 if (userRes) {
    //                     assignedUserName = userRes.profile.firstName;
    //                 }
    //             }
    //             let dataobj = {
    //                 latitude: routeUpdateRes[i].latitude,
    //                 longitude: routeUpdateRes[i].longitude,
    //                 user: assignedUserName,
    //                 date: routeUpdateRes[i].dateValue,
    //                 checkIn: routeUpdateRes[i].checkIn,
    //                 checkOut: routeUpdateRes[i].checkOut,
    //                 customer: customerName,
    //             }
    //             locAry.push(dataobj);
    //         }
    //     }
    //     return locAry;
    // },
    /**
     * 
     * @param {*} startDate 
     * @param {*} endDate 
     * export route data
     */
    // 'routeAssign.export': (startDate, endDate) => {
    //     let dataRes = [];
    //     let routeAssignRes = RouteAssign.find({
    //         routeDateIso: {
    //             $gte: startDate,
    //             $lt: endDate
    //         }
    //     }).fetch();
    //     if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
    //         for (let i = 0; i < routeAssignRes.length; i++) {
    //             let customerData = RouteCustomer.find({ routeId: routeAssignRes[i].routeId, active: "Y" }).fetch();
    //             let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id }).fetch();

    //             let dataObj = {
    //                 customerData: customerData,
    //                 routeUpdateData: routeUpdateData,
    //                 routeData: routeAssignRes[i]
    //             }
    //             dataRes.push(dataObj);
    //         }
    //     }
    //     return dataRes;
    // },

    /**
  * TODO:Complete JS doc
  * approve route
  */
    'routeAssign.approved': (id, remark) => {
        return RouteAssign.update({
            _id: id
        }, {
            $set: {
                routeStatus: "Assigned",
                statusRemarks: remark,
                approvedBy: Meteor.userId(),
                approvedDate: new Date(),
                updatedAt: new Date(),
            }
        });
        //
    },
    /**
     * 
     * @param {*} id 
     * @param {*} remark 
     * reject route
     */
    'routeAssign.Statusupdates': (id, remark) => {
        return RouteAssign.update({
            _id: id
        }, {
            $set: {
                routeStatus: "Rejected",
                statusRemarks: remark,
                rejectedBy: Meteor.userId(),
                rejectedDate: new Date(),
                updatedAt: new Date(),
            }
        });
        //
    },
    /**
     * 
     * @param {*} routeGroupId 
     * @param {*} empId 
     * @param {*} fromDate 
     * check route already assigned or not
     */
    'routeAssign.checkData': (routeGroupId, empId, routeDate) => {
        let approvalCheck = false;
        let routeAssignRes = RouteAssign.find({
            // routeId: routeGroupId,
            assignedTo: empId,
            routeDate: routeDate,
        }).fetch();

        if (routeAssignRes.length > 0) {
            approvalCheck = true;
        }
        let assignedByName = ''
        let userRes1 = Meteor.users.findOne({ _id: empId });
        if (userRes1) {
            assignedByName = userRes1.profile.firstName;
        }
        return { approvalCheck: approvalCheck, assignedByName: assignedByName };
    },


    // // get route data based on id
    // 'routeAssign.skippedCustomers': (id) => {
    //     let routeAssignRes = RouteAssign.findOne({ _id: id });
    //     let assignedToName = '';
    //     let assignedByName = '';
    //     let customerDetailsArray = [];
    //     let routeUpdatesArray = [];
    //     let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
    //     let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
    //     if (userRes) {
    //         assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
    //     }
    //     let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy });
    //     if (userRes1) {
    //         assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
    //     }
    //     let customerRes = RouteCustomer.find({ routeId: routeAssignRes.routeId, active: "Y" }, { sort: { createdAt: -1 } }).fetch();
    //     if (customerRes !== undefined && customerRes.length > 0) {
    //         customerDetailsArray = customerRes;
    //     }
    //     let routeUpdateRes = RouteUpdates.find({ routeAssignId: id, skipStatus: '1' }).fetch();
    //     if (routeUpdateRes !== undefined && routeUpdateRes.length > 0) {
    //         routeUpdatesArray = routeUpdateRes;
    //     }
    //     let branchName = '';
    //     let branchRes = Branch.findOne({ bPLId: routeGrpRes.branchCode });
    //     if (branchRes) {
    //         branchName = branchRes.bPLName;
    //     }
    //     let approvedName = '';
    //     if (routeAssignRes.approvedBy !== undefined) {
    //         let userRes = Meteor.users.findOne({ _id: routeAssignRes.approvedBy });
    //         if (userRes) {
    //             approvedName = userRes.profile.firstName;
    //         }
    //     }
    //     let rejectedName = '';
    //     if (routeAssignRes.rejectedBy !== undefined) {
    //         let userRes = Meteor.users.findOne({ _id: routeAssignRes.rejectedBy });
    //         if (userRes) {
    //             rejectedName = userRes.profile.firstName;
    //         }
    //     }

    //     return {
    //         routeAssignRes: routeAssignRes,
    //         routeGrpRes: routeGrpRes,
    //         assignedToName: assignedToName,
    //         assignedByName: assignedByName,
    //         customerDetailsArray: customerDetailsArray,
    //         routeUpdatesArray: routeUpdatesArray,
    //         branchName: branchName,
    //         approvedName: approvedName,
    //         rejectedName: rejectedName
    //     }
    // },
    /**
   * 
   * @param {*} startDate 
   * @param {*} endDate 
   * export route data
   */
    // 'routeAssign.exportSkipped': (startDate, endDate) => {
    //     let dataRes = [];
    //     let routeAssignRes = RouteAssign.find({
    //         routeDateIso: {
    //             $gte: startDate,
    //             $lt: endDate
    //         },
    //         skipValue: true
    //     }).fetch();
    //     if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
    //         for (let i = 0; i < routeAssignRes.length; i++) {
    //             let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id, skipStatus: '1' }).fetch();
    //             let dataObj = {
    //                 routeUpdateData: routeUpdateData,
    //                 routeData: routeAssignRes[i]
    //             }
    //             dataRes.push(dataObj);
    //         }
    //     }
    //     return dataRes;
    // },
    /**
* 
* @param {*} startDate 
* @param {*} endDate 
* export route data
*/
    // 'routeAssign.exportNoSales': (startDate, endDate) => {
    //     let dataRes = [];
    //     let routeAssignRes = RouteAssign.find({
    //         routeDateIso: {
    //             $gte: startDate,
    //             $lt: endDate
    //         },
    //         transactionDone: false
    //     }).fetch();
    //     if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
    //         for (let i = 0; i < routeAssignRes.length; i++) {
    //             let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id, transactionDone: false }).fetch();
    //             let dataObj = {
    //                 routeUpdateData: routeUpdateData,
    //                 routeData: routeAssignRes[i]
    //             }
    //             dataRes.push(dataObj);
    //         }
    //     }
    //     return dataRes;
    // },


    // // get route data based on id
    // 'routeAssign.noSalesReport': (id) => {
    //     let routeAssignRes = RouteAssign.findOne({ _id: id });
    //     let assignedToName = '';
    //     let assignedByName = '';
    //     let customerDetailsArray = [];
    //     let routeUpdatesArray = [];
    //     let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
    //     let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
    //     if (userRes) {
    //         assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
    //     }
    //     let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy });
    //     if (userRes1) {
    //         assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
    //     }
    //     let customerRes = RouteCustomer.find({ routeId: routeAssignRes.routeId, active: "Y" }, { sort: { createdAt: -1 } }).fetch();
    //     if (customerRes !== undefined && customerRes.length > 0) {
    //         customerDetailsArray = customerRes;
    //     }
    //     let routeUpdateRes = RouteUpdates.find({ routeAssignId: id, transactionDone: false }).fetch();
    //     if (routeUpdateRes !== undefined && routeUpdateRes.length > 0) {
    //         routeUpdatesArray = routeUpdateRes;
    //     }
    //     let branchName = '';
    //     let branchRes = Branch.findOne({ bPLId: routeGrpRes.branchCode });
    //     if (branchRes) {
    //         branchName = branchRes.bPLName;
    //     }
    //     let approvedName = '';
    //     if (routeAssignRes.approvedBy !== undefined) {
    //         let userRes = Meteor.users.findOne({ _id: routeAssignRes.approvedBy });
    //         if (userRes) {
    //             approvedName = userRes.profile.firstName;
    //         }
    //     }
    //     let rejectedName = '';
    //     if (routeAssignRes.rejectedBy !== undefined) {
    //         let userRes = Meteor.users.findOne({ _id: routeAssignRes.rejectedBy });
    //         if (userRes) {
    //             rejectedName = userRes.profile.firstName;
    //         }
    //     }

    //     return {
    //         routeAssignRes: routeAssignRes,
    //         routeGrpRes: routeGrpRes,
    //         assignedToName: assignedToName,
    //         assignedByName: assignedByName,
    //         customerDetailsArray: customerDetailsArray,
    //         routeUpdatesArray: routeUpdatesArray,
    //         branchName: branchName,
    //         approvedName: approvedName,
    //         rejectedName: rejectedName
    //     }
    // },


    /**
 * 
 * @param {*} startDate 
 * @param {*} endDate 
 * export route data
 */
    // 'routeAssign.exportOutletData': (startDate, endDate, routeCode) => {
    //     let dataRes = [];
    //     let routeAssignRes = RouteAssign.find({
    //         routeDateIso: {
    //             $gte: startDate,
    //             $lt: endDate
    //         },
    //         routeId: routeCode,
    //         routeStatus:
    //         {
    //             $ne: 'Not Assigned'
    //         }
    //     }).fetch();
    //     if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
    //         for (let i = 0; i < routeAssignRes.length; i++) {
    //             let customerData = RouteCustomer.find({ routeId: routeAssignRes[i].routeId, active: "Y" }).fetch();
    //             let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id }).fetch();

    //             let dataObj = {
    //                 customerData: customerData,
    //                 routeUpdateData: routeUpdateData,
    //                 routeData: routeAssignRes[i]
    //             }
    //             dataRes.push(dataObj);
    //         }
    //     }
    //     return dataRes;
    // },

    // // get route data based on id
    // 'routeAssign.dataGets': (id) => {
    //     let routeAssignRes = RouteAssign.findOne({ _id: id });
    //     let assignedToName = '';
    //     let assignedByName = '';
    //     let routeUpdatesArray = [];
    //     let visitArray = [];
    //     let notVisitArray = [];
    //     let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
    //     let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
    //     if (userRes) {
    //         assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
    //     }
    //     let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy });
    //     if (userRes1) {
    //         assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
    //     }
    //     let branchName = '';
    //     let branchRes = Branch.findOne({ bPLId: routeGrpRes.branchCode });
    //     if (branchRes) {
    //         branchName = branchRes.bPLName;
    //     }
    //     let approvedName = '';
    //     if (routeAssignRes.approvedBy !== undefined) {
    //         let userRes = Meteor.users.findOne({ _id: routeAssignRes.approvedBy });
    //         if (userRes) {
    //             approvedName = userRes.profile.firstName;
    //         }
    //     }
    //     let rejectedName = '';
    //     if (routeAssignRes.rejectedBy !== undefined) {
    //         let userRes = Meteor.users.findOne({ _id: routeAssignRes.rejectedBy });
    //         if (userRes) {
    //             rejectedName = userRes.profile.firstName;
    //         }
    //     }

    //     let customerRes = RouteCustomer.find({ routeId: routeAssignRes.routeId, active: "Y" }, { sort: { createdAt: -1 } }).fetch();
    //     if (customerRes !== undefined && customerRes.length > 0) {
    //         for (let i = 0; i < customerRes.length; i++) {
    //             let routeUpdateRes = RouteUpdates.find({
    //                 routeAssignId: id,
    //                 customer: customerRes[i].customer,
    //             }).fetch();
    //             if (routeUpdateRes.length > 0) {
    //                 visitArray.push({
    //                     customer: customerRes[i].customer,
    //                     priority: customerRes[i].priority
    //                 });
    //             }
    //             else {
    //                 notVisitArray.push({
    //                     customer: customerRes[i].customer,
    //                     priority: customerRes[i].priority
    //                 });
    //             }
    //         }
    //     }

    //     return {
    //         routeAssignRes: routeAssignRes,
    //         routeGrpRes: routeGrpRes,
    //         assignedToName: assignedToName,
    //         assignedByName: assignedByName,
    //         visitArray: visitArray,
    //         notVisitArray: notVisitArray,
    //         routeUpdatesArray: routeUpdatesArray,
    //         branchName: branchName,
    //         approvedName: approvedName,
    //         rejectedName: rejectedName
    //     }
    // },
    /**
     * 
     * @param {*} id 
     * @returns check route assigned or not
     */
    'routeAssign.checkRoute': (id) => {
        let a = new Date();
        let days = new Array(7);
        days[0] = "Sunday";
        days[1] = "Monday";
        days[2] = "Tuesday";
        days[3] = "Wednesday";
        days[4] = "Thursday";
        days[5] = "Friday";
        days[6] = "Saturday";
        let todaysDate = days[a.getDay()];
        // console.log(a.getDay());
        return routeRes = RouteAssign.find({
            assignedTo: id,
            routeDate: todaysDate, active: "Y"
        }).fetch();
    },
    /**
     * Checking the assigned Status
     * @param {*} routeCode 
     * @param {*} Date 
     * @returns Boolean
     */
    'routeAssign.checkDateAssigned': (routeCode, Date) => {
        let routeRes = RouteAssign.findOne({
            routeDate: Date, active: "Y", routeId: routeCode, routeStatus: 'Assigned',
        });
        if (routeRes) {
            return true;
        } else {
            return false;
        }

    },
    /**
     * 
     * @param {*} id 
     * @returns get route assigned name
     */
    'routeAssign.assignedIdName': (id) => {
        let assignedToName = '';
        let routeAssignRes = RouteAssign.findOne({ _id: id }, { fields: { assignedTo: 1 } });
        if (routeAssignRes) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
            if (userRes) {
                assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`
            }
        }
        return assignedToName;
    }
});

