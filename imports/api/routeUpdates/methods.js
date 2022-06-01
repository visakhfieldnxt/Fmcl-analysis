/**
 * @author Nithin
 */
import { RouteUpdates } from './routeUpdates';
import { RouteAssign } from '../routeAssign/routeAssign';
import { RouteGroup } from '../routeGroup/routeGroup';
import { Branch } from '../branch/branch';
import { Customer } from "../customer/customer";

Meteor.methods({
    // get route data based on id
    'routeUpdates.id': (id) => {
        let routeUpdateRes = RouteUpdates.findOne({ _id: id });
        let routeAssignRes = RouteAssign.findOne({ _id: routeUpdateRes.routeAssignId });
        let assignedToName = '';
        let assignedByName = '';

        let routeGrpRes = RouteGroup.findOne({ _id: routeUpdateRes.routeGroup });
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
        let customerDet = Customer.findOne({ cardCode: routeUpdateRes.customer });

        return {
            customerDet: customerDet,
            routeUpdateRes: routeUpdateRes,
            routeAssignRes: routeAssignRes,
            routeGrpRes: routeGrpRes,
            assignedToName: assignedToName,
            assignedByName: assignedByName,
            branchName: branchName
        }
    },
    /**
     * 
     * @param {*} startDate 
     * @param {*} endDate 
     * @param {*} managerBranch 
     * @param {*} salesman 
     * @param {*} branch 
     * @returns export route checkin checkout report
     */
    'routeUpdate.export': (startDate, endDate, managerBranch, salesman, branch) => {
        let routeUpdateRes = [];
        if (salesman !== '' && branch === '') {
            routeUpdateRes = RouteUpdates.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }, assignedTo: salesman
            }).fetch();
        }
        else if (salesman === '' && branch !== '') {
            routeUpdateRes = RouteUpdates.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }, branch: branch
            }).fetch();
        }
        else if (salesman !== '' && branch !== '') {
            routeUpdateRes = RouteUpdates.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }, branch: branch, assignedTo: salesman
            }).fetch();
        }
        else {
            routeUpdateRes = RouteUpdates.find({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }, branch: { $in: managerBranch }
            }).fetch();
        }
        return routeUpdateRes;
    },
    /**
     * data for dashboard
     */
    'routeUpdates.dashboardData': () => {
        let vansaleUserData = Meteor.users.find({ userType: "V" }).fetch();
        let todayDates = moment(new Date()).format("DD-MM-YYYY");
        let userArray = [];
        if (vansaleUserData.length > 0) {
            userArray = [];
            for (let i = 0; i < vansaleUserData.length; i++) {
                let routeDetails = RouteUpdates.find({
                    dateValue: todayDates,
                    assignedTo: vansaleUserData[i]._id
                }).fetch();
                let resObj =
                {
                    empName: `${vansaleUserData[i].profile.firstName} ${vansaleUserData[i].profile.lastName}`,
                    data: routeDetails.length,
                    dateValue: todayDates,
                }
                userArray.push(resObj);
            }

        }
        let sortedArray = userArray.sort(function (a, b) {
            return parseFloat(b.data) - parseFloat(a.data);
        });
        let topSixItems = sortedArray.slice(0, 10);
        return topSixItems;
    },


    /**
  * data for dashboard filter
  */
    'routeUpdates.dashboardDataDateWise': (filterDate) => {
        let vansaleUserData = Meteor.users.find({ userType: "V" }).fetch();
        let userArray = [];
        if (vansaleUserData.length > 0) {
            userArray = [];
            for (let i = 0; i < vansaleUserData.length; i++) {
                let routeDetails = RouteUpdates.find({
                    dateValue: filterDate,
                    assignedTo: vansaleUserData[i]._id
                }).fetch();
                let resObj =
                {
                    empName: `${vansaleUserData[i].profile.firstName} ${vansaleUserData[i].profile.lastName}`,
                    data: routeDetails.length,
                    dateValue: filterDate,
                }
                userArray.push(resObj);
            }

        }
        let sortedArray = userArray.sort(function (a, b) {
            return parseFloat(b.data) - parseFloat(a.data);
        });
        let topSixItems = sortedArray.slice(0, 10);
        return topSixItems;
    },



    /**
  * data for modal view  dashboard
  */
    'routeUpdates.filterDataGet': (filterDate) => {
        let vansaleUserData = Meteor.users.find({ userType: "V" }).fetch();
        let dataArray = [];
        if (vansaleUserData.length > 0) {
            for (let j = 0; j < vansaleUserData.length; j++) {
                let customerArray = [];
                let routeDetails = RouteUpdates.find({
                    dateValue: filterDate,
                    assignedTo: vansaleUserData[j]._id
                }).fetch();

                if (routeDetails.length > 0) {
                    for (let i = 0; i < routeDetails.length; i++) {
                        let customerName = '';
                        let customerDet = Customer.findOne({ cardCode: routeDetails[i].customer });
                        if (customerDet) {
                            customerName = customerDet.cardName;
                        }
                        let custObj =
                        {
                            customerName: customerName,
                            empNames: `${vansaleUserData[j].profile.firstName} ${vansaleUserData[j].profile.lastName}`,
                            checkIn: routeDetails[i].checkIn,
                            checkOut: routeDetails[i].checkOut,
                            dateValue: routeDetails[i].dateValue,
                            timeSpent: routeDetails[i].timeSpent
                        }
                        customerArray.push(custObj);
                    }
                }
                if (customerArray.length > 0) {
                    let dataObj = {
                        empNames: `${vansaleUserData[j].profile.firstName} ${vansaleUserData[j].profile.lastName}`,
                        customerArray: customerArray,
                        filterDate: filterDate,
                        noOfOutlet: customerArray.length
                    }
                    dataArray.push(dataObj);
                }
            }
        }
        return dataArray;
    }
});