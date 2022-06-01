/**
 * @author Nithin
 */
import { Attendance } from './attendance';
import { allUsers } from '../user/user';

Meteor.methods({
    'attendance.id': (_id) => {
        let attendanceRes = Attendance.findOne({ _id: _id },
            {
                fields: {
                    employeeId: 1, subDistributor: 1,
                    roles: 1, attendenceStatus: 1, loginDateCheck: 1, logoutDateCheck: 1,
                    attendenceDate: 1, attendenceDateIso: 1, loginDate: 1, logoutDate: 1,
                    logoutLocation: 1, loginLocation: 1
                }
            });
        let empName = '';
        let subDistributorName = '';
        if (attendanceRes) {
            let userRes = allUsers.findOne({ _id: attendanceRes.employeeId }, { fields: { profile: 1 } });
            if (userRes) {
                empName = `${userRes.profile.firstName} ${userRes.profile.lastName} `;
            }
            let userRes1 = allUsers.findOne({ _id: attendanceRes.subDistributor });
            if (userRes1) {
                subDistributorName = `${userRes1.profile.firstName} ${userRes1.profile.lastName} `;
            }
        } else {
            attendanceRes = '';
        }
        return { attendanceRes: attendanceRes, empName: empName, subDistributorName: subDistributorName };
    },

    'attendance.data': (id) => {
        let date = moment(new Date()).format('DD-MM-YYYY');
        // console.log("date",date);
        return Attendance.findOne({ employeeId: id, attendenceDate: date });

    },
    'attendance.punch': (id, locationGet, punchOption) => {
        let date = moment(new Date()).format('DD-MM-YYYY');
        let time = moment(new Date()).format('hh:mm:ss A');
        let dateFormatted = moment(new Date()).format('YYYY-MM-DD');
        let timeFormatted = moment(new Date()).format('hh:mm A');
        let formattedDate = dateFormatted + ' ' + timeFormatted;
        let employeeDetails = Meteor.users.findOne({ _id: id }, { fields: { roles: 1, subDistributor: 1 } });
        let res = '';
        // console.log("hi");
        if (punchOption === 'Punch In') {
            return Attendance.insert({
                employeeId: id,
                role: employeeDetails.roles,
                subDistributor: employeeDetails.subDistributor,
                attendenceStatus: 'Punch In',
                loginDateCheck: date,
                logoutDateCheck: '',
                attendenceDate: date,
                attendenceDateIso: new Date(formattedDate),
                loginDate: time,
                logoutDate: '',
                loginLocation: locationGet,
                logoutLocation: '',
                uuid: Random.id(),
                createdAt: new Date,
            });
        } else {
            return Attendance.update({
                employeeId: id, attendenceStatus: 'Punch In',
                loginDateCheck: date
            }, {
                $set:
                {
                    attendenceStatus: 'Punch Out',
                    logoutDate: time,
                    logoutDateCheck: date,
                    logoutLocation: locationGet,
                    updatedAt: new Date(),
                }
            });
        }

    },
    
});