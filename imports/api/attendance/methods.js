/**
 * @author Nithin
 */
import { Attendance } from './attendance';

Meteor.methods({
    'attendance.id': (_id) => {
        return Attendance.findOne({ _id: _id });
    },
    /**
     * 
     * @param {*} id 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} branch 
     * @param {*} managerBranch 
     * @returns export attendance data
     */
    'attendance.exportData': (id, fromDate, toDate, branch, managerBranch, role) => {
        let attendanceRes = [];
        if (id !== '' && branch !== '' && role !== '') {
            attendanceRes = Attendance.find({
                employeeId: id, branch: branch,
                role: role,
                attendenceDateIso: {
                    $gte: fromDate,
                    $lt: toDate
                },
            }, {
                fields: {
                    employeeName: 1, branchName: 1, loginDate: 1, logoutDate: 1,
                    attendenceDate: 1, logoutLocation: 1, loginLocation: 1, role: 1
                }
            }).fetch();
        } else if (id !== '' && branch === '' && role === '') {
            attendanceRes = Attendance.find({
                employeeId: id, branch: { $in: managerBranch },
                attendenceDateIso: {
                    $gte: fromDate,
                    $lt: toDate
                },
            }, {
                fields: {
                    employeeName: 1, branchName: 1, loginDate: 1, logoutDate: 1,
                    attendenceDate: 1, logoutLocation: 1, loginLocation: 1, role: 1
                }
            }).fetch();
        } else if (id === '' && branch && role === '') {
            attendanceRes = Attendance.find({
                branch: branch,
                attendenceDateIso: {
                    $gte: fromDate,
                    $lt: toDate
                },
            }, {
                fields: {
                    employeeName: 1, branchName: 1, loginDate: 1, logoutDate: 1,
                    attendenceDate: 1, logoutLocation: 1, loginLocation: 1, role: 1
                }
            }).fetch();
        }
        else if (id === '' && branch === '' && role) {
            attendanceRes = Attendance.find({
                role: role,
                attendenceDateIso: {
                    $gte: fromDate,
                    $lt: toDate
                },
            }, {
                fields: {
                    employeeName: 1, branchName: 1, loginDate: 1, logoutDate: 1,
                    attendenceDate: 1, logoutLocation: 1, loginLocation: 1, role: 1
                }
            }).fetch();
        }
        else if (id === '' && branch && role) {
            attendanceRes = Attendance.find({
                role: role,
                branch: branch,
                attendenceDateIso: {
                    $gte: fromDate,
                    $lt: toDate
                },
            }, {
                fields: {
                    employeeName: 1, branchName: 1, loginDate: 1, logoutDate: 1,
                    attendenceDate: 1, logoutLocation: 1, loginLocation: 1, role: 1
                }
            }).fetch();
        }
        else {
            attendanceRes = Attendance.find({
                branch: { $in: managerBranch },
                attendenceDateIso: {
                    $gte: fromDate,
                    $lt: toDate
                },
            }, { sort: { attendenceDateIso: -1 } }, {
                fields: {
                    employeeName: 1, branchName: 1, loginDate: 1, logoutDate: 1,
                    attendenceDate: 1, logoutLocation: 1, logoutLocation: 1, role: 1,
                    attendenceDateIso: 1
                }
            }).fetch();
        }
        return attendanceRes;
    }
});