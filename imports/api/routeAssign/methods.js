/**
 * @author Nithin
 */
import { RouteAssign } from './routeAssign';
import { RouteGroup } from '../routeGroup/routeGroup';
import { RouteCustomer } from '../routeCustomer/routeCustomer';
import { RouteUpdates } from '../routeUpdates/routeUpdates';
import { Customer } from "../customer/customer";
import { Branch } from "../branch/branch";

Meteor.methods({

    /**
     * assign employee
     */
    'routeAssign.assignEmployee': (id, empId, description, routeDate, routeDateEnd) => {
        let approvalCheck = false;
        let routeStatus = "Assigned";
        let routeAssignRes = RouteAssign.find({
            assignedTo: empId, $and: [{ routeStatus: { $ne: 'Completed' } },
            { routeStatus: { $ne: 'Rejected' } }]
        }).fetch();
        let dataArray = [];
        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                var from = new Date(moment(routeAssignRes[i].routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var to = new Date(moment(routeAssignRes[i].routeDateEnd, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var check = new Date(moment(routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var check2 = new Date(moment(routeDateEnd, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                if ((check >= from && check <= to) === true) {
                    dataArray.push(i);
                }
                else if ((check2 >= from && check2 <= to) === true) {
                    dataArray.push(i);
                }
                else if ((check2 >= from && check <= to) === true) {
                    dataArray.push(i);
                }
            }
        }
        if (dataArray.length > 0) {
            approvalCheck = true;
            routeStatus = "Pending";
        }
        let routeGrpData = RouteGroup.findOne({ _id: id });
        return RouteAssign.insert({
            routeId: id,
            assignedTo: empId,
            remarks: description,
            routeDate: routeDate,
            routeDateIso: new Date(moment(routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD')),
            routeDateEnd: routeDateEnd,
            routeDateEndIso: new Date(moment(routeDateEnd, 'DD-MM-YYYY').format('YYYY-MM-DD')),
            routeStatus: routeStatus,
            approvalCheck: approvalCheck,
            branch: routeGrpData.branchCode,
            uuid: Random.id(),
            groupDeactivated: false,
            active: 'Y',
            assignedAt: new Date(),
            assignedBy: Meteor.userId(),
            createdAt: new Date(),
        });
        // if (routeAssignData) {
        //     let groupResult = RouteGroup.findOne({ _id: id });

        //     if (groupResult) {
        //         for (let i = 0; i < groupResult.customerArray.length; i++) {
        //             // function for create route customer master data
        //             createGroupCustomer(routeAssignData, groupResult.customerArray[i]);
        //         }
        //     }
        // }
        // return routeAssignData;
    },
    // get route data based on id
    'routeAssign.id': (id) => {
        let routeAssignRes = RouteAssign.findOne({ _id: id });
        let assignedToName = '';
        let assignedByName = '';
        let customerDetailsArray = [];
        let routeUpdatesArray = [];
        let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
        let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
        if (userRes) {
            assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`
        }
        let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy });
        if (userRes1) {
            assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`
        }
        let customerRes = RouteCustomer.find({ routeId: routeAssignRes.routeId, active: "Y" }, { sort: { createdAt: -1 } }).fetch();
        if (customerRes !== undefined && customerRes.length > 0) {
            customerDetailsArray = customerRes;
        }
        let routeUpdateRes = RouteUpdates.find({ routeAssignId: id }).fetch();
        if (routeUpdateRes !== undefined && routeUpdateRes.length > 0) {
            routeUpdatesArray = routeUpdateRes;
        }
        let branchName = '';
        let branchRes = Branch.findOne({ bPLId: routeGrpRes.branchCode });
        if (branchRes) {
            branchName = branchRes.bPLName;
        }
        let approvedName = '';
        if (routeAssignRes.approvedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.approvedBy });
            if (userRes) {
                approvedName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
            }
        }
        let rejectedName = '';
        if (routeAssignRes.rejectedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.rejectedBy });
            if (userRes) {
                rejectedName = userRes.profile.firstName;
            }
        }

        return {
            routeAssignRes: routeAssignRes,
            routeGrpRes: routeGrpRes,
            assignedToName: assignedToName,
            assignedByName: assignedByName,
            customerDetailsArray: customerDetailsArray,
            routeUpdatesArray: routeUpdatesArray,
            branchName: branchName,
            approvedName: approvedName,
            rejectedName: rejectedName
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
    'routeAssign.locData': (_id) => {
        let locArry = [];
        let res = RouteAssign.findOne({ _id: _id });
        if (res) {
            if (res.boundaryArray !== undefined && res.boundaryArray.length > 0) {
                locArry = res.boundaryArray;
            }
        }
        return locArry;
    },

    // update boundary route
    'routeAssign.updateBoundary': (id, boundaryArray) => {
        return RouteAssign.update({ _id: id }, {
            $set:
            {
                locationBoundaryUpdated: true,
                boundaryArray: boundaryArray,
                boundaryBy: Meteor.userId(),
                boundaryAt: new Date(),
            }
        });
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
        // let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
        // let routeDates = new Date(todayDates);
        // let routeEndDate = new Date(todayDates);
        // routeDates.setDate(routeDates.getDate() + 1);
        let routeAssign = false;
        // let routeChesks = RouteAssign.find({
        //     assignedTo: user, routeId: id, routeStatus: { $ne: 'Completed' },
        //     //  routeDateIso: {
        //     //     $lt: routeDates,
        //     // },
        //     // routeDateEndIso: {
        //     //     $gte: routeEndDate,
        //     // }
        // }).count();
        // if (routeChesks > 0) {
        //     routeAssign = true;
        // }
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

    'routeAssign.assignedEmployeeList': (id, roles) => {
        let assigRouteRes = RouteAssign.findOne({ _id: id });
        if (assigRouteRes) {
            let routeResult = RouteGroup.findOne({ _id: assigRouteRes.routeId });
            if (routeResult) {
                let userRes = Meteor.users.find({
                    'profile.isDeleted': false, userType: "V", active: 'Y',
                    roles: { $in: roles },
                },
                    { fields: { profile: 1 } }).fetch();
                return { userRes: userRes };
            }
        }
    },

    /**
  * 
  * @param {} id 
  * assign route
  */
    'routeAssign.reAssignEmployee': (id, employee, remarks) => {
        let dataVal = RouteAssign.findOne({ _id: id });
        let approvalCheck = false;
        let routeStatus = "Assigned";
        let routeAssignRes = RouteAssign.find({
            routeId: dataVal.routeId,
            assignedTo: employee, $and: [{ routeStatus: { $ne: 'Completed' } },
            { routeStatus: { $ne: 'Rejected' } }]
        }).fetch();
        let dataArray = [];
        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                var from = new Date(moment(routeAssignRes[i].routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var to = new Date(moment(routeAssignRes[i].routeDateEnd, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var check = new Date(moment(dataVal.routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                if ((check >= from && check <= to) === true) {
                    dataArray.push(i);
                }
            }
        }
        if (dataArray.length > 0) {
            approvalCheck = true;
            routeStatus = "Pending";
        }
        return RouteAssign.update({ _id: id }, {
            $set:
            {
                assignedTo: employee,
                remarks: remarks,
                routeStatus: routeStatus,
                approvalCheck: approvalCheck,
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
            routeId: assignDetails.routeId,
            assignedTo: user, $and: [{ routeStatus: { $ne: 'Completed' } },
            { routeStatus: { $ne: 'Rejected' } }]
        }).fetch();
        let dataArray = [];
        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                var from = new Date(moment(routeAssignRes[i].routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var to = new Date(moment(routeAssignRes[i].routeDateEnd, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var check = new Date(moment(assignDetails.routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                if ((check >= from && check <= to) === true) {
                    dataArray.push(i);
                }
            }
        }
        if (dataArray.length > 0) {
            routeAssign = true;
        }
        console.log("routeAssign", routeAssign);
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
    'routeAssign.mapDataGet': (id) => {
        let locAry = [];
        let routeUpdateRes = RouteUpdates.find({ routeAssignId: id }).fetch();
        if (routeUpdateRes !== undefined && routeUpdateRes.length > 0) {
            locAry = [];
            for (let i = 0; i < routeUpdateRes.length; i++) {
                let customerName = '';
                let assignedUserName = '';
                if (routeUpdateRes[i].customer) {
                    let custRes = Customer.findOne({ cardCode: routeUpdateRes[i].customer });
                    if (custRes) {
                        customerName = custRes.cardName;
                    }
                }
                if (routeUpdateRes[i].assignedTo !== undefined && routeUpdateRes[i].assignedTo !== '') {
                    let userRes = Meteor.users.findOne({ _id: routeUpdateRes[i].assignedTo });
                    if (userRes) {
                        assignedUserName = userRes.profile.firstName;
                    }
                }
                let dataobj = {
                    latitude: routeUpdateRes[i].latitude,
                    longitude: routeUpdateRes[i].longitude,
                    user: assignedUserName,
                    date: routeUpdateRes[i].dateValue,
                    checkIn: routeUpdateRes[i].checkIn,
                    checkOut: routeUpdateRes[i].checkOut,
                    customer: customerName,
                }
                locAry.push(dataobj);
            }
        }
        return locAry;
    },
    /**
     * 
     * @param {*} startDate 
     * @param {*} endDate 
     * export route data
     */
    'routeAssign.export': (startDate, endDate) => {
        let dataRes = [];
        let routeAssignRes = RouteAssign.find({
            routeDateIso: {
                $gte: startDate,
                $lt: endDate
            }
        }).fetch();
        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                let customerData = RouteCustomer.find({ routeId: routeAssignRes[i].routeId, active: "Y" }).fetch();
                let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id }).fetch();

                let dataObj = {
                    customerData: customerData,
                    routeUpdateData: routeUpdateData,
                    routeData: routeAssignRes[i]
                }
                dataRes.push(dataObj);
            }
        }
        return dataRes;
    },


    /**
  * 
  * @param {*} startDate 
  * @param {*} endDate 
  * export route data
  */
    'routeAssign.exportRouteData': (startDate, endDate, managerBranch, branch, salesman) => {
        let dataRes = [];
        let routeAssignRes = [];
        if (branch !== '' && salesman === '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                }, branch: branch
            }).fetch();
        }
        else if (branch === '' && salesman !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                }, assignedTo: salesman,
                branch: { $in: managerBranch }
            }).fetch();
        }
        else if (branch !== '' && salesman !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                }, assignedTo: salesman,
                branch: branch
            }).fetch();
        }
        else {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                }, branch: { $in: managerBranch }
            }).fetch();
        }

        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                let customerData = RouteCustomer.find({ routeId: routeAssignRes[i].routeId, active: "Y" }).fetch();
                let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id }).fetch();

                let dataObj = {
                    customerData: customerData,
                    routeUpdateData: routeUpdateData,
                    routeData: routeAssignRes[i]
                }
                dataRes.push(dataObj);
            }
        }
        return dataRes;
    },
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
    'routeAssign.checkData': (routeGroupId, empId, fromDate) => {
        let approvalCheck = false;
        let routeAssignRes = RouteAssign.find({
            routeId: routeGroupId,
            assignedTo: empId, $and: [{ routeStatus: { $ne: 'Completed' } },
            { routeStatus: { $ne: 'Rejected' } }]
        }).fetch();
        let dataArray = [];
        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                var from = new Date(moment(routeAssignRes[i].routeDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var to = new Date(moment(routeAssignRes[i].routeDateEnd, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                var check = new Date(moment(fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                if ((check >= from && check <= to) === true) {
                    dataArray.push(i);
                }
            }
        }
        if (dataArray.length > 0) {
            approvalCheck = true;
        }
        let assignedByName = ''
        let userRes1 = Meteor.users.findOne({ _id: empId });
        if (userRes1) {
            assignedByName = userRes1.profile.firstName;
        }
        return { approvalCheck: approvalCheck, assignedByName: assignedByName };
    },


    // get route data based on id
    'routeAssign.skippedCustomers': (id) => {
        let routeAssignRes = RouteAssign.findOne({ _id: id });
        let assignedToName = '';
        let assignedByName = '';
        let customerDetailsArray = [];
        let routeUpdatesArray = [];
        let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
        let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
        if (userRes) {
            assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
        }
        let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy });
        if (userRes1) {
            assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
        }
        let customerRes = RouteCustomer.find({ routeId: routeAssignRes.routeId, active: "Y" }, { sort: { createdAt: -1 } }).fetch();
        if (customerRes !== undefined && customerRes.length > 0) {
            customerDetailsArray = customerRes;
        }
        let routeUpdateRes = RouteUpdates.find({ routeAssignId: id, skipStatus: '1' }).fetch();
        if (routeUpdateRes !== undefined && routeUpdateRes.length > 0) {
            routeUpdatesArray = routeUpdateRes;
        }
        let branchName = '';
        let branchRes = Branch.findOne({ bPLId: routeGrpRes.branchCode });
        if (branchRes) {
            branchName = branchRes.bPLName;
        }
        let approvedName = '';
        if (routeAssignRes.approvedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.approvedBy });
            if (userRes) {
                approvedName = userRes.profile.firstName;
            }
        }
        let rejectedName = '';
        if (routeAssignRes.rejectedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.rejectedBy });
            if (userRes) {
                rejectedName = userRes.profile.firstName;
            }
        }

        return {
            routeAssignRes: routeAssignRes,
            routeGrpRes: routeGrpRes,
            assignedToName: assignedToName,
            assignedByName: assignedByName,
            customerDetailsArray: customerDetailsArray,
            routeUpdatesArray: routeUpdatesArray,
            branchName: branchName,
            approvedName: approvedName,
            rejectedName: rejectedName
        }
    },
    /**
   * 
   * @param {*} startDate 
   * @param {*} endDate 
   * export route data
   */
    'routeAssign.exportSkipped': (startDate, endDate, managerBranch, salesman, branch) => {
        let dataRes = [];
        let routeAssignRes = [];
        if (salesman !== '' && branch === '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                skipValue: true,
                assignedTo: salesman
            }).fetch();
        }
        else if (salesman === '' && branch !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                skipValue: true,
                branch: branch
            }).fetch();
        }
        else if (salesman !== '' && branch !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                skipValue: true,
                branch: branch,
                assignedTo: salesman
            }).fetch();
        }
        else {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                skipValue: true,
                branch: { $in: branch },
            }).fetch();
        }
        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id, skipStatus: '1' }).fetch();
                let dataObj = {
                    routeUpdateData: routeUpdateData,
                    routeData: routeAssignRes[i]
                }
                dataRes.push(dataObj);
            }
        }
        return dataRes;
    },
    /**
* 
* @param {*} startDate 
* @param {*} endDate 
* export route data
*/
    'routeAssign.exportNoSales': (startDate, endDate, managerBranch, salesman, branch) => {
        let dataRes = [];
        let routeAssignRes = [];
        if (salesman !== '' && branch === '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                transactionDone: false,
                assignedTo: salesman,
            }).fetch();
        }
        else if (salesman === '' && branch !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                transactionDone: false,
                branch: branch,
            }).fetch();
        }
        else if (salesman !== '' && branch !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                transactionDone: false,
                branch: branch,
                assignedTo: salesman,
            }).fetch();
        }
        else {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                transactionDone: false,
                branch: { $in: managerBranch }
            }).fetch();
        }
        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id, transactionDone: false }).fetch();
                let dataObj = {
                    routeUpdateData: routeUpdateData,
                    routeData: routeAssignRes[i]
                }
                dataRes.push(dataObj);
            }
        }
        return dataRes;
    },


    // get route data based on id
    'routeAssign.noSalesReport': (id) => {
        let routeAssignRes = RouteAssign.findOne({ _id: id });
        let assignedToName = '';
        let assignedByName = '';
        let customerDetailsArray = [];
        let routeUpdatesArray = [];
        let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
        let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
        if (userRes) {
            assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
        }
        let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy });
        if (userRes1) {
            assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
        }
        let customerRes = RouteCustomer.find({ routeId: routeAssignRes.routeId, active: "Y" }, { sort: { createdAt: -1 } }).fetch();
        if (customerRes !== undefined && customerRes.length > 0) {
            customerDetailsArray = customerRes;
        }
        let routeUpdateRes = RouteUpdates.find({ routeAssignId: id, transactionDone: false }).fetch();
        if (routeUpdateRes !== undefined && routeUpdateRes.length > 0) {
            routeUpdatesArray = routeUpdateRes;
        }
        let branchName = '';
        let branchRes = Branch.findOne({ bPLId: routeGrpRes.branchCode });
        if (branchRes) {
            branchName = branchRes.bPLName;
        }
        let approvedName = '';
        if (routeAssignRes.approvedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.approvedBy });
            if (userRes) {
                approvedName = userRes.profile.firstName;
            }
        }
        let rejectedName = '';
        if (routeAssignRes.rejectedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.rejectedBy });
            if (userRes) {
                rejectedName = userRes.profile.firstName;
            }
        }

        return {
            routeAssignRes: routeAssignRes,
            routeGrpRes: routeGrpRes,
            assignedToName: assignedToName,
            assignedByName: assignedByName,
            customerDetailsArray: customerDetailsArray,
            routeUpdatesArray: routeUpdatesArray,
            branchName: branchName,
            approvedName: approvedName,
            rejectedName: rejectedName
        }
    },


    /**
 * 
 * @param {*} startDate 
 * @param {*} endDate 
 * export route data
 */
    'routeAssign.exportOutletData': (startDate, endDate, managerBranch, salesman, branch) => {
        let dataRes = [];
        let routeAssignRes = [];
        if (salesman !== '' && branch === '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                assignedTo: salesman,
                routeStatus:
                {
                    $ne: 'Not Assigned'
                }
            }).fetch();
        }
        else if (salesman === '' && branch !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                branch: branch,
                routeStatus:
                {
                    $ne: 'Not Assigned'
                }
            }).fetch();
        }
        else if (salesman !== '' && branch !== '') {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                branch: branch,
                assignedTo: salesman,
                routeStatus:
                {
                    $ne: 'Not Assigned'
                }
            }).fetch();
        }
        else {
            routeAssignRes = RouteAssign.find({
                routeDateIso: {
                    $gte: startDate,
                    $lt: endDate
                },
                branch: { $in: managerBranch },
                routeStatus:
                {
                    $ne: 'Not Assigned'
                }
            }).fetch();
        }

        if (routeAssignRes !== undefined && routeAssignRes.length > 0) {
            for (let i = 0; i < routeAssignRes.length; i++) {
                let customerData = RouteCustomer.find({ routeId: routeAssignRes[i].routeId, active: "Y" }).fetch();
                let routeUpdateData = RouteUpdates.find({ routeAssignId: routeAssignRes[i]._id }).fetch();

                let dataObj = {
                    customerData: customerData,
                    routeUpdateData: routeUpdateData,
                    routeData: routeAssignRes[i]
                }
                dataRes.push(dataObj);
            }
        }
        return dataRes;
    },

    // get route data based on id
    'routeAssign.dataGets': (id) => {
        let routeAssignRes = RouteAssign.findOne({ _id: id });
        let assignedToName = '';
        let assignedByName = '';
        let routeUpdatesArray = [];
        let visitArray = [];
        let notVisitArray = [];
        let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
        let userRes = Meteor.users.findOne({ _id: routeAssignRes.assignedTo });
        if (userRes) {
            assignedToName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
        }
        let userRes1 = Meteor.users.findOne({ _id: routeAssignRes.assignedBy });
        if (userRes1) {
            assignedByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
        }
        let branchName = '';
        let branchRes = Branch.findOne({ bPLId: routeGrpRes.branchCode });
        if (branchRes) {
            branchName = branchRes.bPLName;
        }
        let approvedName = '';
        if (routeAssignRes.approvedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.approvedBy });
            if (userRes) {
                approvedName = userRes.profile.firstName;
            }
        }
        let rejectedName = '';
        if (routeAssignRes.rejectedBy !== undefined) {
            let userRes = Meteor.users.findOne({ _id: routeAssignRes.rejectedBy });
            if (userRes) {
                rejectedName = userRes.profile.firstName;
            }
        }

        let customerRes = RouteCustomer.find({ routeId: routeAssignRes.routeId, active: "Y" }, { sort: { createdAt: -1 } }).fetch();
        if (customerRes !== undefined && customerRes.length > 0) {
            for (let i = 0; i < customerRes.length; i++) {
                let routeUpdateRes = RouteUpdates.find({
                    routeAssignId: id,
                    customer: customerRes[i].customer,
                }).fetch();
                if (routeUpdateRes.length > 0) {
                    visitArray.push({
                        customer: customerRes[i].customer,
                        priority: customerRes[i].priority
                    });
                }
                else {
                    notVisitArray.push({
                        customer: customerRes[i].customer,
                        priority: customerRes[i].priority
                    });
                }
            }
        }

        return {
            routeAssignRes: routeAssignRes,
            routeGrpRes: routeGrpRes,
            assignedToName: assignedToName,
            assignedByName: assignedByName,
            visitArray: visitArray,
            notVisitArray: notVisitArray,
            routeUpdatesArray: routeUpdatesArray,
            branchName: branchName,
            approvedName: approvedName,
            rejectedName: rejectedName
        }
    },
    /**
     * get data for dashboard */
    'routeAssign.graphData': () => {
        let routeAssignedCount = RouteAssign.find({ routeStatus: "Assigned" }).count();
        let completedCount = RouteAssign.find({ routeStatus: "Completed" }).count();
        let pendingCount = RouteAssign.find({ routeStatus: "Pending" }).count();
        let rejectedCount = RouteAssign.find({ routeStatus: "Rejected" }).count();
        return {
            routeAssignedCount: routeAssignedCount,
            completedCount: completedCount,
            pendingCount: pendingCount,
            rejectedCount: rejectedCount
        };
    },
    'routeAssign.routeNameGetsByDate': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
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
        if (routeAssignRes.length > 0) {
            routeArray = [];
            for (let i = 0; i < routeAssignRes.length; i++) {
                let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes[i].routeId }, { fields: { routeName: 1 } });
                if (routeGrpRes) {
                    routeArray.push(` ${routeGrpRes.routeName}`);
                }
            }
        }
        let resVal = 'Not Assigned';
        if (routeArray.length > 0) {
            resVal = routeArray.toString();
        }
        return resVal;
    },
    'routeAssign.routeCodeGetsByDate': (id, fromDate, toDate, branch) => {
        toDate.setDate(toDate.getDate() + 1);
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
        if (routeAssignRes.length > 0) {
            routeArray = [];
            for (let i = 0; i < routeAssignRes.length; i++) {
                let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes[i].routeId }, { fields: { routeCode: 1 } });
                if (routeGrpRes) {
                    routeArray.push(` ${routeGrpRes.routeCode}`);
                }
            }
        }
        let resVal = 'Not Assigned';
        if (routeArray.length > 0) {
            resVal = routeArray.toString();
        }
        return resVal;
    },
});

