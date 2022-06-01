/**
* @author Visakh
*/
import { SdPriceType } from '../sdPriceType/sdPriceType';
import { Verticals } from '../verticals/verticals';
import { PriceType } from '../priceType/priceType';
import { Outlets } from '../outlets/outlets';
import { RouteAssign } from '../routeAssign/routeAssign';
import { RouteGroup } from '../routeGroup/routeGroup';
import { Attendance } from "../attendance/attendance";
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Config } from '../config/config';
import moment from 'moment';
import { roles } from "../role/role";
import { Unit } from "../unit/unit";
import { StockTransfer } from "../stockTransfer/stockTransfer";
import { StockTransferIssued } from "../stockTransferIssued/stockTransferIssued";
import { Product } from "../products/products";
import { allUsers } from "../user/user";
import { DirectSale } from "../directSale/directSale";
import { WareHouseStock } from "../wareHouseStock/wareHouseStock";
import { CreditSale } from "../creditSale/creditSale";
import { Order } from "../order/order";
import { Price } from "../price/price";
import { SdProducts } from "../sdProducts/sdProducts";
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { StockReturnItems } from '../stockReturnItems/stockReturnItems';
import { StockReturn } from '../stockReturn/stockReturn';
import { Notification } from '../notification/notification';
import { CollectionDue } from '../collectionDue/collectionDue';
import { RouteUpdates } from '../routeUpdates/routeUpdates';

/**
 * Sample POST method for getting the requested body
 * Done By : Nithin
 * Date : 06/01/21
 */
JsonRoutes.add('POST', '/login', function (req, res) {
    let options = req.body;

    let user = '';
    // if (options.hasOwnProperty('email')) {
    //   check(options, {
    //     email: String,
    //     password: String,
    //   });
    //   user = Meteor.users.findOne({ 'emails.address': options.email });
    // } else {
    check(options, {
        username: String,
        password: String,
        appVersion: String,
    });
    user = Meteor.users.findOne({ username: options.username });
    // }
    if (user === undefined || user === '') {
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "User with that username or email address not found",
                data: {},
            }
        });
    }
    else {
        if (user.loggedIn !== undefined && user.loggedIn === true) {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "Your account has been logged in another device",
                    data: {},
                }
            });
        }
        else {
            let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
            if (appversionCheck !== undefined && options.appVersion !== undefined && appversionCheck.value === options.appVersion) {
                let result = Accounts._checkPassword(user, options.password);
                check(result, {
                    userId: String,
                    error: Match.Optional(Meteor.Error),
                });
                if (result.error) {
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "Incorrect Password",
                            data: {},
                        }
                    });
                    // throw result.error;
                }

                let stampedLoginToken = Accounts._generateStampedLoginToken();
                check(stampedLoginToken, {
                    token: String,
                    when: Date,
                });

                Accounts._insertLoginToken(result.userId, stampedLoginToken);

                let tokenExpiration = Accounts._tokenExpiration(stampedLoginToken.when);
                check(tokenExpiration, Date);

                let userDetails = Meteor.users.find({ _id: result.userId, userType: 'SDUser', active: 'Y' }).fetch();
                let userArray = '';
                if (userDetails !== undefined && userDetails.length > 0) {
                    for (let i = 0; i < userDetails.length; i++) {
                        let firstName = userDetails[i].profile.firstName;
                        let lastName = userDetails[i].profile.lastName;
                        let contactNo = userDetails[i].contactNo;
                        let empCode = userDetails[i].profile.empCode;
                        let roleName = '';
                        let verticalArray = [];
                        let priceType = SdPriceType.find({ subDistributor: userDetails[i].subDistributor, active: "Y" }, { fields: { subDistributor: 1, vertical: 1, priceType: 1 } }).fetch();
                        let roleRes = roles.findOne({ _id: userDetails[i].roles[0] }, { fields: { name: 1 } });
                        if (roleRes !== undefined) {
                            roleName = roleRes.name;
                        }
                        if (priceType.length > 0) {
                            for (let k = 0; k < priceType.length; k++) {
                                let verticalName = '';
                                let priceTypeName = '';
                                let verticalRes = Verticals.findOne({ _id: priceType[k].vertical }, { fields: { verticalName: 1 } });
                                if (verticalRes) {
                                    verticalName = verticalRes.verticalName;
                                }
                                let priceTypeRes = PriceType.findOne({ _id: priceType[k].priceType }, { fields: { priceTypeName: 1 } });
                                if (priceTypeRes) {
                                    priceTypeName = priceTypeRes.priceTypeName;
                                }
                                let dataObj = {
                                    verticalId: priceType[k].vertical,
                                    verticalName: verticalName,
                                    priceTypeId: priceType[k].priceType,
                                    priceTypeName: priceTypeName
                                };
                                verticalArray.push(dataObj);
                            }
                        }

                        userArray = {
                            id: result.userId, token: stampedLoginToken.token, tokenExpires: tokenExpiration,
                            firstName: firstName, lastName: lastName, contactNo: contactNo.toString(), empCode: empCode,
                            role: roleName, verticalArray: verticalArray,
                        }
                    }
                }
                else {
                    JsonRoutes.sendResult(res, {
                        code: 404,
                        data: {
                            code: 404,
                            message: "No user Found. Please contact your SD ",
                            data: {},
                        }
                    });
                }
                if (userArray !== undefined && userArray !== '') {
                    JsonRoutes.sendResult(res, {
                        code: 200,
                        data: {
                            code: 200,
                            message: "success",
                            data: userArray,
                        }
                    });
                    updateLoginStatus(result.userId);
                }
            }
            else {
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "Make sure you have the latest version of the FMCL app",
                        data: {},
                    }
                });
            }
        }
    }

});

/**
 * Sample POST method for creating Outlet
 * Done By Visakh 
 * Date 14-06-2021
 */
JsonRoutes.add("POST", "/addOutlet", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let outlet_name = req.body.name;
                        let outlet_contact = req.body.contact;
                        let outlet_contactPerson = req.body.contactPerson;
                        let outlet_address = req.body.address;
                        let outlet_email = req.body.email;
                        let remark = req.body.remark;
                        let routeId = req.body.routeId;
                        let priority = req.body.priority;
                        let insideImage = req.body.insideImage;
                        let outsideImage = req.body.outsideImage;
                        let latitude = req.body.latitude;
                        let longitude = req.body.longitude;
                        let outletType = req.body.outletType;
                        let outletClass = req.body.outletClass;
                        let createdBy = id;
                        let deviceInfo = req.body.deviceInfo;
                        let userRes = Meteor.users.findOne({ _id: id }, { fields: { profile: 1, subDistributor: 1 } });
                        outletCreateFunction(outlet_name, outlet_contact, outlet_contactPerson, outlet_address, outlet_email,
                            remark, createdBy, routeId, priority, userRes, insideImage,
                            outsideImage, latitude, longitude, outletType, outletClass, deviceInfo);
                        notificationFUn(userRes.subDistributor, "Outlet")
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Outlet created Successfully",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});


/**
 * Sample POST method for creating Outlet
 * Done By Visakh 
 * Date 14-06-2021
 */
JsonRoutes.add("POST", "/addCollection", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let outlet = req.body.outlet;
                        let route = req.body.route;
                        let vertical = req.body.vertical;
                        let collectionType = req.body.collectionType;
                        let transactionType = req.body.transactionType;
                        let invoiceNumber = req.body.invoiceNumber;
                        let paymentType = req.body.paymentType;
                        let ackImage = req.body.ackImage;
                        let latitude = req.body.latitude;
                        let longitude = req.body.longitude;
                        let cashInfo = req.body.cashInfo;
                        let chequeInfo = req.body.chequeInfo;
                        let rtgsInfo = req.body.rtgsInfo;
                        let collectionAmt = req.body.collectionAmt;
                        let collectionBalance = req.body.collectionBalance;
                        let createdBy = id;
                        let createdDate = req.body.createdDate;
                        let userRes = Meteor.users.findOne({ _id: id }, { fields: { profile: 1, subDistributor: 1 } });
                        collectionCreateFunction(outlet, route, collectionType,
                            transactionType, invoiceNumber, paymentType, ackImage,
                            latitude, longitude, cashInfo, chequeInfo, rtgsInfo, collectionAmt,
                            createdBy, collectionBalance, userRes, vertical, createdDate);
                        notificationFUnCollection(userRes.subDistributor, "Collection");
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Collection Added Successfully",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }

            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample GET method for attendance register accoriding to user :- _id
 * Done By : Nithin
 * Date : 15-06-2021
 */
JsonRoutes.add("POST", "/attendance_register", function (req, res, next) {

    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined) {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.userId === req.body._id) {
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) {
                    //console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        // Response after the verification of User
                        let id = req.body._id;
                        let date = req.body.date;
                        let time = req.body.time;
                        let locationGet = req.body.location;
                        let punchOption = req.body.punchOption;
                        let deviceInfo = req.body.deviceInfo;
                        let dateFormatted = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                        let timeFormatted = moment(time, 'hh:mm A').format('hh:mm A');
                        let formattedDate = dateFormatted + ' ' + timeFormatted;

                        let employeeDetails = Meteor.users.findOne({ _id: id });
                        if (punchOption === 'punchIn') {
                            // new function for attendance punch in
                            attendancePunchInFn(id, employeeDetails.roles, date,
                                formattedDate, time, locationGet, employeeDetails, deviceInfo);

                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "Attendance Punched In Successfully",
                                    data: {}
                                }
                            });
                        } else {
                            // new function for attendance punch out
                            attendancePunchOutFn(id, date, time, locationGet, deviceInfo);
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "Attendance Punched Out Successfully",
                                    data: {}
                                }
                            });
                            // Authorisation Response Section     
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                //console.log("Token userId and Param _id are not matching.! ");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        //console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});
/**
 * Sample GET method for calling user details accoriding to user :- _id
 * Done By : Nithin
 * Date : 16/06/21
 */
JsonRoutes.add("GET", "/homeData/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.headers.appversion);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let date = moment(new Date()).format("DD-MM-YYYY");
                        let attendance = Attendance.findOne({ employeeId: id, loginDateCheck: date });
                        let attendenceStatus = '';
                        let routeName = '';
                        let attendenceDate = '';
                        let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
                        let monthStart = moment(new Date()).format("YYYY-MM-01 00:00:00.0");
                        let monthDate = new Date(monthStart);
                        let dateToday = new Date(todayDates);
                        // let dateValue = new Date(todayDates);
                        // dateValue.setDate(dateValue.getDate() - 30); 
                        dateToday.setDate(dateToday.getDate() + 1);
                        let cashAmnt = 0;
                        let crAmnt = 0;
                        let ordAmnt = 0;
                        let cashSaleAmt = CreditSale.find({
                            sdUser: id,
                            createdAt: {
                                $gte: monthDate,
                                $lt: dateToday
                            }, salesType: "Cash"
                        }, { fields: { docTotal: 1 } }).fetch();
                        let creditInvoiceAmount = CreditSale.find({
                            sdUser: id,
                            createdAt: {
                                $gte: monthDate,
                                $lt: dateToday
                            }, salesType: "Credit"
                        }, { fields: { docTotal: 1 } }).fetch();
                        let orderAmount = Order.find({
                            sdUser: id,
                            createdAt: {
                                $gte: monthDate,
                                $lt: dateToday
                            }
                        }, { fields: { docTotal: 1 } }).fetch();

                        if (cashSaleAmt !== undefined && cashSaleAmt.length > 0) {
                            for (let i = 0; i < cashSaleAmt.length; i++) {
                                cashAmnt += Number(cashSaleAmt[i].docTotal);
                            }
                        }
                        if (creditInvoiceAmount !== undefined && creditInvoiceAmount.length > 0) {
                            for (let i = 0; i < creditInvoiceAmount.length; i++) {
                                crAmnt += Number(creditInvoiceAmount[i].docTotal);
                            }
                        }
                        if (orderAmount !== undefined && orderAmount.length > 0) {
                            for (let i = 0; i < orderAmount.length; i++) {
                                ordAmnt += Number(orderAmount[i].docTotal);
                            }
                        }
                        if (attendance !== undefined) {
                            attendenceStatus = attendance.attendenceStatus;
                            attendenceDate = attendance.attendenceDate;
                        }
                        else {
                            attendenceStatus = 'Not Registered';
                            attendenceDate = date;
                        }
                        let stockReturnVal = "false";
                        let stockReturnData = StockReturn.find({ sdUser: id, status: "Pending" }).count();
                        if (stockReturnData > 0) {
                            stockReturnVal = "true";
                        }

                        let assignedRoute = [];
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
                        let routeRes = RouteAssign.find({ assignedTo: id, routeDate: todaysDate, active: "Y" }).fetch();
                        if (routeRes !== undefined && routeRes.length > 0) {
                            for (let n = 0; n < routeRes.length; n++) {
                                let routeData = RouteGroup.findOne({ _id: routeRes[n].routeId }, { fields: { routeCode: 1, routeName: 1 } });
                                if (routeData !== undefined) {
                                    let routeObj = {
                                        routeId: routeData._id,
                                        routeCode: routeData.routeCode,
                                        routeName: routeData.routeName,
                                        routeDate: routeRes[n].routeDate,
                                        routeAssignId: routeRes[n]._id,
                                    }
                                    assignedRoute.push(routeObj);
                                    routeName = routeData.routeName;
                                }
                            }
                        }
                        let dataObject = {
                            arInvoiceTotal: (Number(cashAmnt).toFixed(2)).toString(),
                            creditInvoiceTotal: (Number(crAmnt).toFixed(2)).toString(),
                            orderTotal: (Number(ordAmnt).toFixed(2)).toString(),
                            attendenceStatus: attendenceStatus,
                            attendenceDate: attendenceDate,
                            routeData: assignedRoute,
                            routeName: routeName,
                            stockReturn: stockReturnVal,
                        }
                        // console.log("History", history.length);
                        if (dataObject !== undefined) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: dataObject
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});
/**
 * Sample GET method for calling the Customer master details accoriding to user route
 * Done By : Nithin
 * Date : 18/06/2021
 */
JsonRoutes.add("GET", "/routeOutletList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id -", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let routeArray = [];
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
                        let routeRes = RouteAssign.find({ assignedTo: id, routeDate: todaysDate, active: "Y" }).fetch();
                        if (routeRes !== undefined && routeRes.length > 0) {
                            for (let n = 0; n < routeRes.length; n++) {
                                let routeData = RouteGroup.findOne({ _id: routeRes[n].routeId }, { fields: { routeCode: 1, routeName: 1 } });
                                let testObj = {
                                    _id: Random.id(),
                                    routeId: routeData._id,
                                    routeCode: routeData.routeCode,
                                    routeName: routeData.routeName,
                                    routeDate: routeRes[0].routeDate,
                                    routeAssignId: routeRes[0]._id,
                                    cardCode: 'Walk-In Customer',
                                    cardName: 'Walk-In Customer',
                                    address: '',
                                    phone1: '',
                                    mailAddres: '',
                                    cntctPrsn: '',
                                    priority: '1',
                                    remark: '',
                                    status: 'Approved',
                                    latitude: '',
                                    longitude: '',
                                    walkInCustomer: 'true',
                                    fencingArea: "200"
                                };
                                routeArray.push(testObj);
                                let outletRes = Outlets.find({ routeId: routeRes[n].routeId, active: "Y", approvalStatus: "Approved" }, {
                                    fields: {
                                        name: 1, address: 1, contactNo: 1, contactPerson: 1, emailId: 1,
                                        remark: 1, routeId: 1, approvalStatus: 1, priority: 1,
                                        latitude: 1, longitude: 1
                                    }
                                }).fetch();
                                if (outletRes !== undefined && outletRes.length > 0) {
                                    for (let m = 0; m < outletRes.length; m++) {
                                        if (routeData !== undefined) {
                                            let routeObj = {
                                                routeId: routeData._id,
                                                routeCode: routeData.routeCode,
                                                routeName: routeData.routeName,
                                                routeDate: routeRes[n].routeDate,
                                                routeAssignId: routeRes[n]._id,
                                                cardCode: outletRes[m]._id,
                                                cardName: outletRes[m].name,
                                                address: outletRes[m].address,
                                                phone1: outletRes[m].contactNo,
                                                mailAddres: outletRes[m].emailId,
                                                cntctPrsn: outletRes[m].contactPerson,
                                                priority: outletRes[m].priority,
                                                remark: outletRes[m].remark,
                                                status: outletRes[m].approvalStatus,
                                                latitude: outletRes[m].latitude,
                                                longitude: outletRes[m].longitude,
                                                fencingArea: "200",
                                                walkInCustomer: 'false',
                                            }
                                            routeArray.push(routeObj)
                                        }
                                    }
                                }
                            }
                        }

                        if (routeArray !== undefined && routeArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: routeArray
                                },
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.! ");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample GET method for calling the graph details accoriding to user :- _id
 * Done By : Nithin
 * Date : 17/06/2021
 */
JsonRoutes.add("GET", "/getGraphData/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let arInvoiceArray = [];
                        let crInvoiceArray = [];
                        let orderArray = [];
                        let arAmnt = 0;
                        let crAmnt = 0;
                        let ordAmnt = 0;
                        // let monthDate = moment(new Date()).format("YYYY-MM-01 00:00:00.0");

                        let monthDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
                        console.log("monthDatemonthDate", monthDate.getDate())
                        let countVal = monthDate.getDate();
                        // last month days data  ** ar invoice
                        for (let x = 0; x < countVal; x++) {
                            let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
                            let dateToday = new Date(todayDates);
                            let dateValue = new Date(todayDates);
                            arAmnt = 0;
                            dateValue.setDate(dateValue.getDate() - x);
                            dateToday.setDate(dateValue.getDate() + 1);
                            let arInvoiceAmount = CreditSale.find({
                                sdUser: id,
                                createdAt: {
                                    $gte: dateValue,
                                    $lt: dateToday
                                }, salesType: "Cash"
                            }, { fields: { docTotal: 1 } }).fetch();
                            if (arInvoiceAmount !== undefined && arInvoiceAmount.length > 0) {
                                for (let i = 0; i < arInvoiceAmount.length; i++) {
                                    arAmnt += Number(arInvoiceAmount[i].docTotal);
                                }
                            }
                            let dateObj =
                            {
                                date: moment(dateValue).format('DD-MM-YYYY'),
                                amount: Number(arAmnt).toFixed(2)
                            }
                            arInvoiceArray.push(dateObj);
                        }
                        // last month days data ** cr invoice

                        for (let x = 0; x < countVal; x++) {
                            let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
                            let dateToday = new Date(todayDates);
                            let dateValue = new Date(todayDates);
                            crAmnt = 0;
                            dateValue.setDate(dateValue.getDate() - x);
                            dateToday.setDate(dateValue.getDate() + 1);
                            let creditInvoiceAmount = CreditSale.find({
                                sdUser: id,
                                createdAt: {
                                    $gte: dateValue,
                                    $lt: dateToday
                                }, salesType: "Credit"
                            }, { fields: { docTotal: 1 } }).fetch();
                            if (creditInvoiceAmount !== undefined && creditInvoiceAmount.length > 0) {
                                for (let i = 0; i < creditInvoiceAmount.length; i++) {
                                    crAmnt += Number(creditInvoiceAmount[i].docTotal);
                                }
                            }
                            let dateObj =
                            {
                                date: moment(dateValue).format('DD-MM-YYYY'),
                                amount: Number(crAmnt).toFixed(2)
                            }
                            crInvoiceArray.push(dateObj);
                        }


                        // last month data ** order

                        for (let x = 0; x < countVal; x++) {
                            let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
                            let dateToday = new Date(todayDates);
                            let dateValue = new Date(todayDates);
                            ordAmnt = 0;
                            dateValue.setDate(dateValue.getDate() - x);
                            dateToday.setDate(dateValue.getDate() + 1);
                            let orderAmount = Order.find({
                                sdUser: id,
                                createdAt: {
                                    $gte: dateValue,
                                    $lt: dateToday
                                }
                            }, { fields: { docTotal: 1 } }).fetch();
                            if (orderAmount !== undefined && orderAmount.length > 0) {
                                for (let i = 0; i < orderAmount.length; i++) {
                                    ordAmnt += Number(orderAmount[i].docTotal);
                                }
                            }
                            let dateObj =
                            {
                                date: moment(dateValue).format('DD-MM-YYYY'),
                                amount: Number(ordAmnt).toFixed(2)
                            }
                            orderArray.push(dateObj);
                        }
                        let dataObject = {
                            arInvoiceTotal: arInvoiceArray,
                            creditInvoiceTotal: crInvoiceArray,
                            orderTotal: orderArray,
                        }
                        // console.log("History", history.length);
                        if (dataObject !== undefined) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: dataObject
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});


/**
 * Sample GET method for calling the product list details accoriding to user :- _id
 * Done By : Visakh
 * Date : 23/06/2021
 */
JsonRoutes.add("GET", "/getProductUnitList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let unitAry = [];
                        let productArray = [];
                        let priceListArray = [];
                        let productArrayUnique = [];
                        let subDistributor = user.subDistributor;
                        let sdPriceList = SdPriceType.find({ subDistributor: subDistributor, active: "Y" }, { fields: { priceType: 1, vertical: 1 } }).fetch();
                        if (sdPriceList.length > 0) {
                            for (let j = 0; j < sdPriceList.length; j++) {
                                priceListArray.push(sdPriceList[j].priceType);
                            }
                            // get sd wise price list
                            findPriceListFn(priceListArray);
                        }
                        function findPriceListFn(priceListArray) {
                            let priceRes = Price.find({ priceType: { $in: priceListArray }, active: "Y" }, {
                                fields: {
                                    product: 1, priceType: 1
                                }
                            }).fetch();
                            if (priceRes.length > 0) {
                                let sdProductList = [];
                                productArrayUnique = priceRes.reduce(function (memo, e1) {
                                    let matches = memo.filter(function (e2) {
                                        return e1.product == e2.product
                                    });
                                    if (matches.length == 0) {
                                        memo.push(e1);
                                    }
                                    return memo;
                                }, []);
                                //get  unique product array (in case on multiple unit)
                                for (let i = 0; i < productArrayUnique.length; i++) {
                                    let sdProductData = SdProducts.findOne({
                                        product: productArrayUnique[i].product,
                                        subDistributor: subDistributor
                                    });
                                    if (sdProductData !== undefined) {
                                        sdProductList.push(sdProductData.product);
                                    }
                                }
                                productListGetDataFn(sdProductList);
                            }
                        }
                        function productListGetDataFn(sdProductList) {
                            let unitRes = Unit.find({ active: "Y", product: { $in: sdProductList } }, { fields: { unitCode: 1, unitName: 1, product: 1, baseQuantity: 1 } }).fetch();
                            if (unitRes.length > 0) {
                                for (let i = 0; i < unitRes.length; i++) {
                                    let unitObj =
                                    {
                                        unitId: unitRes[i]._id,
                                        unitCode: unitRes[i].unitCode,
                                        unitName: unitRes[i].unitName,
                                        product: unitRes[i].product,
                                        baseQuantity: unitRes[i].baseQuantity.toString()
                                    }
                                    unitAry.push(unitObj);
                                }
                            }
                        }
                        // console.log("History", history.length);
                        if (unitAry !== undefined) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: unitAry
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});


/**
 * Sample GET method for calling the product stock transfer list details accoriding to user :- _id
 * Done By : Nithin
 * Date : 23/06/2021
 */
JsonRoutes.add("GET", "/getProductStockList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let stockArray = []
                        let stockTransferDetails = StockTransfer.find({ sdUser: id, status: "Pending" }
                            , { fields: { temporaryId: 1, transferDate: 1, status: 1 } }).fetch();
                        if (stockTransferDetails.length > 0) {
                            for (let i = 0; i < stockTransferDetails.length; i++) {
                                let itemArray = [];
                                let itemRes = StockTransferIssued.find({ transferId: stockTransferDetails[i]._id },
                                    {
                                        fields: {
                                            temporaryId: 1, subDistributor: 1, product: 1, unit: 1, quantity: 1,
                                            vertical: 1
                                        }
                                    }).fetch();
                                if (itemRes.length > 0) {
                                    for (let j = 0; j < itemRes.length; j++) {
                                        let productName = '';
                                        let unitName = '';
                                        let verticalName = '';
                                        let subDistributorName = ''
                                        if (itemRes[j].product) {
                                            let productRes = Product.findOne({ _id: itemRes[j].product });
                                            if (productRes !== undefined) {
                                                productName = productRes.productName;
                                            }
                                        }
                                        if (itemRes[j].unit) {
                                            let unitRes = Unit.findOne({ _id: itemRes[j].unit });
                                            if (unitRes !== undefined) {
                                                unitName = unitRes.unitName;
                                            }
                                        }
                                        if (itemRes[j].vertical) {
                                            let verticalRes = Verticals.findOne({ _id: itemRes[j].vertical });
                                            if (verticalRes !== undefined) {
                                                verticalName = verticalRes.verticalName;
                                            }
                                        }
                                        if (itemRes[j].subDistributor) {
                                            let userRes = allUsers.findOne({ _id: itemRes[j].subDistributor });
                                            if (userRes !== undefined) {
                                                subDistributorName = `${userRes.profile.firstName} ${userRes.profile.lastName}`
                                            }
                                        }
                                        let itemObj =
                                        {
                                            _id: itemRes[j]._id,
                                            stockTranfserId: itemRes[j].transferId,
                                            productId: itemRes[j].product,
                                            productName: productName,
                                            unitId: itemRes[j].unit,
                                            unitName: unitName,
                                            verticalId: itemRes[j].vertical,
                                            verticalName: verticalName,
                                            subDistributor: itemRes[j].subDistributor,
                                            subDistributorName: subDistributorName,
                                            tempId: itemRes[j].temporaryId,
                                            quantity: itemRes[j].quantity,
                                        }
                                        itemArray.push(itemObj);
                                    }
                                }
                                let stockObj =
                                {
                                    stockTranfserId: stockTransferDetails[i]._id,
                                    tempId: stockTransferDetails[i].temporaryId,
                                    transferDate: stockTransferDetails[i].transferDate,
                                    status: stockTransferDetails[i].status,
                                    productArray: itemArray,
                                }
                                stockArray.push(stockObj);
                            }
                        }

                        // console.log("History", history.length);
                        if (stockArray !== undefined && stockArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: stockArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});


/**
 * Sample GET method for calling the product stock list details accoriding to user :- _id
 * Done By : Nithin
 * Date : 23/06/2021
 */
// JsonRoutes.add("GET", "/getStock/:_id", function (req, res, next) {
//     // console.log("req.authToken", req.authToken);
//     // console.log("req.userId", req.userId);
//     if (req.authToken !== undefined && req.userId !== undefined) {
//         if (req.params._id === undefined && req.url !== '/users/login') {
//             JsonRoutes.sendResult(res, {
//                 code: 401,
//                 data: {
//                     code: 401,
//                     message: "You are not Authorized",
//                     data: [],
//                 }
//             });
//         } else {
//             if (req.url !== '/users/login' && req.userId === req.params._id) {
//                 // console.log("req.body._id", req.params._id);
//                 let user = Meteor.users.findOne({
//                     _id: req.params._id
//                 });
//                 if (!user) { // never existed or already been used
//                     // console.log("never existed or already been used");
//                     JsonRoutes.sendResult(res, {
//                         code: 401,
//                         data: {
//                             code: 401,
//                             message: "You are not Authorized",
//                             data: [],
//                         }
//                     });
//                 } else {
//                     let id = req.params._id;
//                     let stockArray = []
//                     let stockTransferDetails = WareHouseStock.find({ employeeId: id, }
//                         , { fields: { vertical: 1, product: 1, stock: 1 } }).fetch();
//                     if (stockTransferDetails.length > 0) {
//                         for (let j = 0; j < stockTransferDetails.length; j++) {
//                             let productNames = '';
//                             let basicUnitIds = '';
//                             let basicUnitNames = '';
//                             let verticalName = '';
//                             if (stockTransferDetails[j].product) {
//                                 let productRes = Product.findOne({ _id: stockTransferDetails[j].product });
//                                 if (productRes !== undefined) {
//                                     productNames = productRes.productName;
//                                     basicUnitIds = productRes.basicUnit;
//                                     if (basicUnitIds !== undefined) {
//                                         let unitRes = Unit.findOne({ _id: basicUnitIds });
//                                         if (unitRes) {
//                                             basicUnitNames = unitRes.unitName;
//                                         }
//                                     }
//                                 }
//                             }
//                             if (stockTransferDetails[j].vertical) {
//                                 let verticalRes = Verticals.findOne({ _id: stockTransferDetails[j].vertical });
//                                 if (verticalRes !== undefined) {
//                                     verticalName = verticalRes.verticalName;
//                                 }
//                             }
//                             let stockObj =
//                             {
//                                 _id: stockTransferDetails[j]._id,
//                                 productId: stockTransferDetails[j].product,
//                                 productName: productNames,
//                                 basicUnitId: basicUnitIds,
//                                 basicUnitName: basicUnitNames,
//                                 verticalId: stockTransferDetails[j].vertical,
//                                 verticalName: verticalName,
//                                 stock: stockTransferDetails[j].stock,
//                             }
//                             stockArray.push(stockObj);
//                         }
//                     }

//                     // console.log("History", history.length);
//                     if (stockArray !== undefined && stockArray.length > 0) {
//                         JsonRoutes.sendResult(res, {
//                             code: 200,
//                             data: {
//                                 code: 200,
//                                 message: "success",
//                                 data: stockArray
//                             }
//                         });
//                     }
//                     else {
//                         JsonRoutes.sendResult(res, {
//                             code: 404,
//                             data: {
//                                 code: 404,
//                                 message: "not found",
//                                 data: []
//                             }
//                         });
//                     }
//                 }
//             }
//             else {
//                 // console.log("Token userId and Param _id are not matching.!");
//                 JsonRoutes.sendResult(res, {
//                     code: 401,
//                     data: {
//                         code: 401,
//                         message: "You are not Authorized",
//                         data: []
//                     }
//                 });
//             }
//         }
//     } else {
//         // console.log("Undefined Token and userId");
//         JsonRoutes.sendResult(res, {
//             code: 401,
//             data: {
//                 code: 401,
//                 message: "You are not Authorized",
//                 data: []
//             }
//         });
//     }
// });

/**
 * Sample GET method for calling the product stock list details accoriding to user :- _id
 * Done By : Nithin
 * Date : 23/06/2021
 */
JsonRoutes.add("GET", "/getStock/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let stockArray = [];
                        let priceListArray = [];
                        let productArrayUnique = [];
                        let subDistributor = user.subDistributor;
                        let sdPriceList = SdPriceType.find({ subDistributor: subDistributor, active: "Y" }, { fields: { priceType: 1, vertical: 1 } }).fetch();
                        if (sdPriceList.length > 0) {
                            for (let j = 0; j < sdPriceList.length; j++) {
                                priceListArray.push(sdPriceList[j].priceType);
                            }
                            // get sd wise price list
                            findPriceListDataFn(priceListArray);
                        }
                        function findPriceListDataFn(priceListArray) {
                            let priceRes = Price.find({ priceType: { $in: priceListArray }, active: "Y" }, {
                                fields: {
                                    product: 1, priceType: 1
                                }
                            }).fetch();
                            if (priceRes.length > 0) {
                                let sdProductList = [];
                                productArrayUnique = priceRes.reduce(function (memo, e1) {
                                    let matches = memo.filter(function (e2) {
                                        return e1.product == e2.product
                                    });
                                    if (matches.length == 0) {
                                        memo.push(e1);
                                    }
                                    return memo;
                                }, []);
                                //get  unique product array (in case on multiple unit)
                                for (let i = 0; i < productArrayUnique.length; i++) {
                                    let sdProductData = SdProducts.findOne({
                                        product: productArrayUnique[i].product,
                                        subDistributor: subDistributor
                                    });
                                    if (sdProductData !== undefined) {
                                        let productObj = {
                                            _id: sdProductData._id,
                                            priceType: productArrayUnique[i].priceType,
                                            product: sdProductData.product,
                                        }
                                        sdProductList.push(productObj);
                                    }
                                }
                                productListGetFn(sdProductList);
                            }
                        }
                        function productListGetFn(sdProductList) {
                            if (sdProductList.length > 0) {
                                for (let j = 0; j < sdProductList.length; j++) {
                                    let productNames = '';
                                    let basicUnitIds = '';
                                    let basicUnitNames = '';
                                    let verticalNames = '';
                                    let verticalIds = '';
                                    let stockData = '0.00';
                                    let stockResVal = WareHouseStock.findOne({
                                        employeeId: id,
                                        product: sdProductList[j].product, subDistributor: subDistributor
                                    });
                                    if (stockResVal !== undefined) {
                                        stockData = stockResVal.stock;
                                        let verticalRes = Verticals.findOne({ _id: stockResVal.vertical });
                                        if (verticalRes) {
                                            verticalNames = verticalRes.verticalName;
                                        }
                                        verticalIds = stockResVal.vertical;
                                    }
                                    let productRes = Product.findOne({ _id: sdProductList[j].product });
                                    if (productRes !== undefined) {
                                        productNames = productRes.productName;
                                        basicUnitIds = productRes.basicUnit;
                                        if (basicUnitIds !== undefined) {
                                            let unitRes = Unit.findOne({ _id: basicUnitIds });
                                            if (unitRes) {
                                                basicUnitNames = unitRes.unitName;
                                            }
                                        }
                                    }
                                    let resObj =
                                    {
                                        _id: sdProductList[j]._id,
                                        productId: sdProductList[j].product,
                                        productName: productNames,
                                        basicUnitId: basicUnitIds,
                                        basicUnitName: basicUnitNames,
                                        verticalId: verticalIds,
                                        verticalName: verticalNames,
                                        stock: stockData,
                                    }
                                    stockArray.push(resObj);
                                }
                            }
                        }
                        // console.log("History", history.length);
                        if (stockArray !== undefined && stockArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: stockArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});
/**
 * Sample GET method for calling the vertical details accoriding to user :- _id
 * Done By : Nithin
 * Date : 24/06/2021
 */
JsonRoutes.add("GET", "/getVerticalList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let verticalArray = [];
                        let sdPriceDetails = SdPriceType.find({ active: "Y", subDistributor: user.subDistributor }).fetch();
                        if (sdPriceDetails.length > 0) {
                            for (let i = 0; i < sdPriceDetails.length; i++) {
                                let verticalNames = '';
                                let verticalCodes = '';
                                let verticalId = '';
                                let verticalRes = Verticals.findOne({ _id: sdPriceDetails[i].vertical, active: "Y" });
                                if (verticalRes) {
                                    verticalNames = verticalRes.verticalName;
                                    verticalCodes = verticalRes.verticalCode;
                                    verticalId = verticalRes._id;
                                }
                                let verticalObj =
                                {
                                    verticalId: verticalId,
                                    verticalName: verticalNames,
                                    verticalCode: verticalCodes,
                                }
                                verticalArray.push(verticalObj);
                            }
                        }

                        // console.log("History", history.length);
                        if (verticalArray !== undefined && verticalArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: verticalArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample GET method for calling the order details accoriding to user :- _id
 * Done By : Nithin
 * Date : 25/06/2021
 */
JsonRoutes.add("GET", "/getOrderList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let orderArray = [];
                        let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
                        let dateToday = new Date(todayDates);
                        let dateValue = new Date(todayDates);
                        dateValue.setDate(dateValue.getDate() - 10);
                        dateToday.setDate(dateToday.getDate() + 1);
                        let orderDetails = Order.find({
                            createdBy: id,
                            createdAt: {
                                $gte: dateValue,
                                $lt: dateToday
                            }
                        }, { sort: { createdAt: -1 } }, {
                            fields: {
                                routeId: 1, vertical: 1, outlet: 1, itemArray: 1, createdAt: 1, mobileAppId: 1,
                                remarks: 1, docTotal: 1, taxAmount: 1, discountAmt: 1, afterDiscount: 1,
                                beforeDiscount: 1, docNum: 1, status: 1, deliveredDate: 1, deliveryRemarks: 1,
                                collectionBalance: 1
                            }
                        }).fetch();
                        if (orderDetails.length > 0) {
                            for (let i = 0; i < orderDetails.length; i++) {
                                let verticalNames = '';
                                let outletNames = '';
                                let routeNames = '';
                                let productArray = [];
                                // get routeName
                                let routeDetails = RouteGroup.findOne({ _id: orderDetails[i].routeId });
                                if (routeDetails !== undefined) {
                                    routeNames = routeDetails.routeName;
                                }
                                //get vertical name
                                let verticalRes = Verticals.findOne({ _id: orderDetails[i].vertical });
                                if (verticalRes !== undefined) {
                                    verticalNames = verticalRes.verticalName;
                                }
                                //get outlet name
                                let outletRes = Outlets.findOne({ _id: orderDetails[i].outlet });
                                if (outletRes !== undefined) {
                                    outletNames = outletRes.name;
                                }
                                if (orderDetails[i].itemArray !== undefined && orderDetails[i].itemArray.length > 0) {
                                    for (let j = 0; j < orderDetails[i].itemArray.length; j++) {
                                        let productNames = '';
                                        let unitNames = '';
                                        // get product name
                                        let productRes = Product.findOne({ _id: orderDetails[i].itemArray[j].product });
                                        if (productRes !== undefined) {
                                            productNames = productRes.productName;
                                        }
                                        // get unit name
                                        let unitRes = Unit.findOne({ _id: orderDetails[i].itemArray[j].unit });
                                        if (unitRes !== undefined) {
                                            unitNames = unitRes.unitName;
                                        }
                                        let itemObj =
                                        {
                                            randomId: orderDetails[i].itemArray[j].randomId,
                                            productId: orderDetails[i].itemArray[j].product,
                                            productName: productNames,
                                            unitId: orderDetails[i].itemArray[j].unit,
                                            unitName: unitNames,
                                            quantity: orderDetails[i].itemArray[j].quantity,
                                            unitPrice: orderDetails[i].itemArray[j].unitPrice,
                                            grandTotal: orderDetails[i].itemArray[j].grossTotal,
                                            taxrate: orderDetails[i].itemArray[j].taxRate,
                                            baseQuantity: orderDetails[i].itemArray[j].unitQuantity,
                                        }
                                        productArray.push(itemObj)
                                    }
                                }
                                let mobileId = '';
                                let dateVal = moment(orderDetails[i].createdAt).format('DD-MM-YYYY');
                                let createdByWebApp = false;
                                if (orderDetails[i].mobileAppId !== undefined
                                    && orderDetails[i].mobileAppId !== '') {
                                    mobileId = orderDetails[i].mobileAppId;
                                    createdByWebApp = false;
                                }
                                else {
                                    mobileId = `ORDR/WEB/${orderDetails[i]._id}`;
                                    createdByWebApp = true;
                                }
                                let deliveredDateVal = '';
                                let deliveryRemarksVal = '';
                                if (orderDetails[i].status === 'Delivered') {
                                    deliveredDateVal = moment(orderDetails[i].deliveredDate).format('DD-MM-YYYY');
                                    deliveryRemarksVal = orderDetails[i].deliveryRemarks;
                                }
                                let collectAmt = '0.00';
                                if (orderDetails[i].collectionBalance !== undefined &&
                                    orderDetails[i].collectionBalance !== '') {
                                    collectAmt = orderDetails[i].collectionBalance;
                                }
                                else {
                                    collectAmt = orderDetails[i].docTotal;
                                }
                                let orderObj =
                                {
                                    _id: orderDetails[i]._id,
                                    outletId: orderDetails[i].outlet,
                                    outletName: outletNames,
                                    verticalId: orderDetails[i].vertical,
                                    verticalName: verticalNames,
                                    routeId: orderDetails[i].routeId,
                                    routeName: routeNames,
                                    docDate: dateVal,
                                    mobileAppId: mobileId,
                                    remarks: orderDetails[i].remarks,
                                    docTotal: orderDetails[i].docTotal,
                                    taxAmount: orderDetails[i].taxAmount,
                                    discountAmt: orderDetails[i].discountAmt,
                                    afterDiscount: orderDetails[i].afterDiscount,
                                    beforeDiscount: orderDetails[i].beforeDiscount,
                                    docNum: orderDetails[i].docNum,
                                    status: orderDetails[i].status,
                                    createdByWebApp: createdByWebApp.toString(),
                                    deliveredDate: deliveredDateVal,
                                    deliveryRemarks: deliveryRemarksVal,
                                    prevAmount: collectAmt,
                                    itemArray: productArray
                                }
                                orderArray.push(orderObj);
                            }
                        }
                        // console.log("History", history.length);
                        if (orderArray !== undefined && orderArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: orderArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample GET method for calling the direct sales details accoriding to user :- _id
 * Done By : Nithin
 * Date : 25/06/2021
 */
JsonRoutes.add("GET", "/getDirectSaleList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let directSalesArray = [];
                        let directSaleDetails = DirectSale.find({ createdBy: id }).fetch();
                        if (directSaleDetails.length > 0) {
                            for (let i = 0; i < directSaleDetails.length; i++) {
                                let verticalNames = '';
                                let outletNames = '';
                                let routeNames = '';
                                let productArray = [];
                                // get routeName
                                let routeDetails = RouteGroup.findOne({ _id: directSaleDetails[i].routeId });
                                if (routeDetails !== undefined) {
                                    routeNames = routeDetails.routeName;
                                }
                                //get vertical name
                                let verticalRes = Verticals.findOne({ _id: directSaleDetails[i].vertical });
                                if (verticalRes !== undefined) {
                                    verticalNames = verticalRes.verticalName;
                                }
                                //get outlet name
                                let outletRes = Outlets.findOne({ _id: directSaleDetails[i].outlet });
                                if (outletRes !== undefined) {
                                    outletNames = outletRes.name;
                                }
                                if (directSaleDetails[i].itemArray !== undefined && directSaleDetails[i].itemArray.length > 0) {
                                    for (let j = 0; j < directSaleDetails[i].itemArray.length; j++) {
                                        let productNames = '';
                                        let unitNames = '';
                                        // get product name
                                        let productRes = Product.findOne({ _id: directSaleDetails[i].itemArray[j].product });
                                        if (productRes !== undefined) {
                                            productNames = productRes.productName;
                                        }
                                        // get unit name
                                        let unitRes = Unit.findOne({ _id: directSaleDetails[i].itemArray[j].unit });
                                        if (unitRes !== undefined) {
                                            unitNames = unitRes.unitName;
                                        }
                                        let itemObj =
                                        {
                                            randomId: directSaleDetails[i].itemArray[j].randomId,
                                            productId: directSaleDetails[i].itemArray[j].product,
                                            productName: productNames,
                                            unitId: directSaleDetails[i].itemArray[j].unit,
                                            unitName: unitNames,
                                            quantity: directSaleDetails[i].itemArray[j].quantity,
                                            unitPrice: directSaleDetails[i].itemArray[j].unitPrice,
                                            grandTotal: directSaleDetails[i].itemArray[j].grandTotal,
                                            taxrate: directSaleDetails[i].itemArray[j].taxrate,
                                            baseQuantity: directSaleDetails[i].itemArray[j].baseQuantity,
                                        }
                                        productArray.push(itemObj)
                                    }
                                }
                                let orderObj =
                                {
                                    _id: directSaleDetails[i]._id,
                                    outletId: directSaleDetails[i].outlet,
                                    outletName: outletNames,
                                    verticalId: directSaleDetails[i].vertical,
                                    verticalName: verticalNames,
                                    routeId: directSaleDetails[i].routeId,
                                    routeName: routeNames,
                                    docDate: directSaleDetails[i].docDate,
                                    mobileAppId: directSaleDetails[i].mobileAppId,
                                    remarks: directSaleDetails[i].remarks,
                                    docTotal: directSaleDetails[i].docTotal,
                                    taxAmount: directSaleDetails[i].taxAmount,
                                    discountAmt: directSaleDetails[i].discountAmt,
                                    afterDiscount: directSaleDetails[i].afterDiscount,
                                    beforeDiscount: directSaleDetails[i].beforeDiscount,
                                    orderId: directSaleDetails[i].orderId,
                                    status: directSaleDetails[i].status,
                                    itemArray: productArray
                                }
                                directSalesArray.push(orderObj);
                            }
                        }
                        // console.log("History", history.length);
                        if (directSalesArray !== undefined && directSalesArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: directSalesArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample GET method for calling the direct sales details accoriding to user :- _id
 * Done By : Nithin
 * Date : 25/06/2021
 */
JsonRoutes.add("GET", "/getCreditSaleList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let creditSalesArray = [];
                        let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
                        let dateToday = new Date(todayDates);
                        let dateValue = new Date(todayDates);
                        dateValue.setDate(dateValue.getDate() - 10);
                        dateToday.setDate(dateToday.getDate() + 1);
                        let creditSaleDetails = CreditSale.find({
                            createdBy: id,
                            createdAt: {
                                $gte: dateValue,
                                $lt: dateToday
                            }
                        }, { sort: { createdAt: -1 } }, {
                            fields: {
                                routeId: 1, vertical: 1, outlet: 1, itemArray: 1, createdAt: 1, mobileAppId: 1,
                                remarks: 1, docTotal: 1, taxAmount: 1, discountAmt: 1, afterDiscount: 1,
                                beforeDiscount: 1, docNum: 1, status: 1, salesType: 1, collectionBalance: 1
                            }
                        }).fetch();
                        if (creditSaleDetails.length > 0) {
                            for (let i = 0; i < creditSaleDetails.length; i++) {
                                let verticalNames = '';
                                let outletNames = '';
                                let routeNames = '';
                                let salesTypeVal = '';
                                if (creditSaleDetails[i].salesType !== undefined
                                    && creditSaleDetails[i].salesType !== null) {
                                    salesTypeVal = creditSaleDetails[i].salesType;
                                }
                                let productArray = [];
                                // get routeName
                                let routeDetails = RouteGroup.findOne({ _id: creditSaleDetails[i].routeId });
                                if (routeDetails !== undefined) {
                                    routeNames = routeDetails.routeName;
                                }
                                //get vertical name
                                let verticalRes = Verticals.findOne({ _id: creditSaleDetails[i].vertical });
                                if (verticalRes !== undefined) {
                                    verticalNames = verticalRes.verticalName;
                                }
                                //get outlet name
                                if (creditSaleDetails[i].walkInCustomer === true) {
                                    outletNames = "Walk-In Customer";
                                }
                                else {
                                    let outletRes = Outlets.findOne({ _id: creditSaleDetails[i].outlet });
                                    if (outletRes !== undefined) {
                                        outletNames = outletRes.name;
                                    }
                                }
                                if (creditSaleDetails[i].itemArray !== undefined && creditSaleDetails[i].itemArray.length > 0) {
                                    for (let j = 0; j < creditSaleDetails[i].itemArray.length; j++) {
                                        let productNames = '';
                                        let unitNames = '';
                                        // get product name
                                        let productRes = Product.findOne({ _id: creditSaleDetails[i].itemArray[j].product });
                                        if (productRes !== undefined) {
                                            productNames = productRes.productName;
                                        }
                                        // get unit name
                                        let unitRes = Unit.findOne({ _id: creditSaleDetails[i].itemArray[j].unit });
                                        if (unitRes !== undefined) {
                                            unitNames = unitRes.unitName;
                                        }
                                        let itemObj =
                                        {
                                            randomId: creditSaleDetails[i].itemArray[j].randomId,
                                            productId: creditSaleDetails[i].itemArray[j].product,
                                            productName: productNames,
                                            unitId: creditSaleDetails[i].itemArray[j].unit,
                                            unitName: unitNames,
                                            quantity: creditSaleDetails[i].itemArray[j].quantity,
                                            unitPrice: creditSaleDetails[i].itemArray[j].unitPrice,
                                            grandTotal: creditSaleDetails[i].itemArray[j].grossTotal,
                                            taxrate: creditSaleDetails[i].itemArray[j].taxRate,
                                            baseQuantity: creditSaleDetails[i].itemArray[j].unitQuantity,
                                        }
                                        productArray.push(itemObj)
                                    }
                                }
                                let mobileId = '';
                                let dateVal = moment(creditSaleDetails[i].createdAt).format('DD-MM-YYYY');
                                let createdByWebApp = false;
                                if (creditSaleDetails[i].mobileAppId !== undefined
                                    && creditSaleDetails[i].mobileAppId !== '') {
                                    mobileId = creditSaleDetails[i].mobileAppId;
                                    createdByWebApp = false;
                                }
                                else {
                                    mobileId = `CRDINV/WEB/${creditSaleDetails[i]._id}`;
                                    createdByWebApp = true;
                                }
                                let collectAmt = '0.00';
                                if (creditSaleDetails[i].collectionBalance !== undefined &&
                                    creditSaleDetails[i].collectionBalance !== '') {
                                    collectAmt = creditSaleDetails[i].collectionBalance;
                                }
                                else {
                                    collectAmt = creditSaleDetails[i].docTotal;
                                }
                                let orderObj =
                                {
                                    _id: creditSaleDetails[i]._id,
                                    outletId: creditSaleDetails[i].outlet,
                                    outletName: outletNames,
                                    verticalId: creditSaleDetails[i].vertical,
                                    verticalName: verticalNames,
                                    routeId: creditSaleDetails[i].routeId,
                                    routeName: routeNames,
                                    docDate: dateVal,
                                    mobileAppId: mobileId,
                                    remarks: creditSaleDetails[i].remarks,
                                    docTotal: creditSaleDetails[i].docTotal,
                                    taxAmount: creditSaleDetails[i].taxAmount,
                                    discountAmt: creditSaleDetails[i].discountAmt,
                                    afterDiscount: creditSaleDetails[i].afterDiscount,
                                    beforeDiscount: creditSaleDetails[i].beforeDiscount,
                                    docNum: creditSaleDetails[i].docNum,
                                    status: creditSaleDetails[i].status,
                                    createdByWebApp: createdByWebApp.toString(),
                                    salesType: salesTypeVal,
                                    prevAmount: collectAmt,
                                    itemArray: productArray
                                }
                                creditSalesArray.push(orderObj);
                            }
                        }
                        // console.log("History", history.length);
                        if (creditSalesArray !== undefined && creditSalesArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: creditSalesArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});
/**
 * Sample POST method for creating directSale
 * Done By Nithin 
 * Date 23-06-2021
 */
JsonRoutes.add("POST", "/addDirectSale", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let vertical = req.body.vertical;
                        let outlet = req.body.outlet;
                        let docDate = req.body.docDate;
                        let mobileAppId = req.body.mobileAppId;
                        let remarks = req.body.remarks;
                        let docTotal = req.body.docTotal;
                        let discountAmt = req.body.discountAmt;
                        let taxAmount = req.body.taxAmount;
                        let latitude = req.body.latitude;
                        let longitude = req.body.longitude;
                        let routeId = req.body.routeId;
                        let itemArray = req.body.itemArray;
                        let deviceInfo = req.body.deviceInfo;
                        let itemDataArray = [];
                        let sdVal = user.subDistributor;
                        if (itemArray !== undefined && itemArray.length > 0) {
                            for (let i = 0; i < itemArray.length; i++) {
                                let transferStockVal = Number(itemArray[i].baseQuantity) * Number(itemArray[i].quantity);
                                let itemObj =
                                {
                                    randomId: Random.id(),
                                    unit: itemArray[i].unit,
                                    unitQuantity: itemArray[i].baseQuantity.toString(),
                                    unitPrice: itemArray[i].unitPrice.toString(),
                                    price: itemArray[i].unitPrice.toString(),
                                    salesPrice: itemArray[i].unitPrice.toString(),
                                    withOutTax: '',
                                    grossTotal: itemArray[i].grandTotal.toString(),
                                    product: itemArray[i].product,
                                    quantity: itemArray[i].quantity.toString(),
                                    taxPerc: '4',
                                    taxRate: itemArray[i].taxRate.toString(),
                                    taxtAmount: itemArray[i].taxtAmount.toString(),
                                    transferStockVal: transferStockVal.toString()
                                }
                                itemDataArray.push(itemObj);
                            }
                        }

                        directSalesCreateFn(id, vertical, outlet, docDate, mobileAppId, remarks,
                            docTotal, discountAmt, taxAmount, latitude, longitude,
                            routeId, itemDataArray, sdVal, deviceInfo);
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Cash Sale Created Successfully",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample POST method for creating credit sale
 * Done By Nithin 
 * Date 23-06-2021
 */
JsonRoutes.add("POST", "/addCreditSale", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let vertical = req.body.vertical;
                        let outlet = req.body.outlet;
                        let docDate = req.body.docDate;
                        let mobileAppId = req.body.mobileAppId;
                        let remarks = req.body.remarks;
                        let docTotal = req.body.docTotal;
                        let discountAmt = req.body.discountAmt;
                        let taxAmount = req.body.taxAmount;
                        let latitude = req.body.latitude;
                        let longitude = req.body.longitude;
                        let routeId = req.body.routeId;
                        let itemArray = req.body.itemArray;
                        let salesType = req.body.salesType;
                        let itemDataArray = [];
                        let sdVal = user.subDistributor;
                        let walkInCustomer = req.body.walkInCustomer;
                        let deviceInfo = req.body.deviceInfo;
                        let customerVal = false;
                        if (walkInCustomer !== undefined && walkInCustomer !== '') {
                            if (walkInCustomer === 'true') {
                                customerVal = true;
                            }
                            else {
                                customerVal = false;
                            }
                        }
                        if (itemArray !== undefined && itemArray.length > 0) {
                            for (let i = 0; i < itemArray.length; i++) {
                                let transferStockVal = Number(itemArray[i].baseQuantity) * Number(itemArray[i].quantity);
                                let itemObj =
                                {
                                    randomId: Random.id(),
                                    unit: itemArray[i].unit,
                                    unitQuantity: itemArray[i].baseQuantity.toString(),
                                    unitPrice: itemArray[i].unitPrice.toString(),
                                    price: itemArray[i].unitPrice.toString(),
                                    salesPrice: itemArray[i].unitPrice.toString(),
                                    withOutTax: '',
                                    grossTotal: itemArray[i].grandTotal.toString(),
                                    product: itemArray[i].product,
                                    quantity: itemArray[i].quantity.toString(),
                                    taxPerc: '4',
                                    taxRate: itemArray[i].taxRate.toString(),
                                    taxtAmount: itemArray[i].taxtAmount.toString(),
                                    transferStockVal: transferStockVal.toString()
                                }
                                itemDataArray.push(itemObj);
                            }
                        }

                        creditSalesCreateFn(id, vertical, outlet, docDate, mobileAppId, remarks,
                            docTotal, discountAmt, taxAmount, latitude, longitude,
                            routeId, itemDataArray, sdVal, salesType, customerVal, deviceInfo);
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Credit Sale Created Successfully",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample POST method for creating Order
 * Done By Nithin 
 * Date 23-06-2021
 */
JsonRoutes.add("POST", "/addOrder", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let vertical = req.body.vertical;
                        let outlet = req.body.outlet;
                        let docDate = req.body.docDate;
                        let mobileAppId = req.body.mobileAppId;
                        let remarks = req.body.remarks;
                        let docTotal = req.body.docTotal;
                        let discountAmt = req.body.discountAmt;
                        let taxAmount = req.body.taxAmount;
                        let latitude = req.body.latitude;
                        let longitude = req.body.longitude;
                        let routeId = req.body.routeId;
                        let itemArray = req.body.itemArray;
                        let deviceInfo = req.body.deviceInfo;
                        let itemDataArray = [];
                        let sdVal = user.subDistributor;
                        if (itemArray !== undefined && itemArray.length > 0) {
                            for (let i = 0; i < itemArray.length; i++) {
                                let transferStockVal = Number(itemArray[i].baseQuantity) * Number(itemArray[i].quantity);
                                let itemObj =
                                {
                                    randomId: Random.id(),
                                    unit: itemArray[i].unit,
                                    unitQuantity: itemArray[i].baseQuantity.toString(),
                                    unitPrice: itemArray[i].unitPrice.toString(),
                                    price: itemArray[i].unitPrice.toString(),
                                    salesPrice: itemArray[i].unitPrice.toString(),
                                    withOutTax: '',
                                    grossTotal: itemArray[i].grandTotal.toString(),
                                    product: itemArray[i].product,
                                    quantity: itemArray[i].quantity.toString(),
                                    taxPerc: '4',
                                    taxRate: itemArray[i].taxRate.toString(),
                                    taxtAmount: itemArray[i].taxtAmount.toString(),
                                    transferStockVal: transferStockVal.toString()
                                }
                                itemDataArray.push(itemObj);
                            }
                        }

                        createOrderFn(id, vertical, outlet, docDate, mobileAppId, remarks,
                            docTotal, discountAmt, taxAmount, latitude, longitude,
                            routeId, itemDataArray, sdVal, deviceInfo);
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Order Created Successfully",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});


/**
 * Sample POST method for creating credit sale
 * Done By Nithin 
 * Date 23-06-2021
 */
JsonRoutes.add("POST", "/updateStockTransfer", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let stockTranfserId = req.body.stockTranfserId;
                        let productArray = req.body.productArray;
                        updateStockTransferFn(id, stockTranfserId);
                        updateStockTransferIssued(id, stockTranfserId, productArray);
                        notificationAcptStkAPI(user.subDistributor);
                        stockEditCheckFn(user.subDistributor, stockTranfserId, productArray);
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Stock Accepted Successfully",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample POST method for update delivery status
 * Done By Nithin 
 * Date 23-06-2021
 */
JsonRoutes.add("POST", "/updateDeliveryStatus", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let orderId = req.body.orderId;
                        let remarks = req.body.remarks;
                        let deliveredDate = req.body.deliveredDate;
                        let deviceInfo = req.body.deviceInfo;
                        updateOrderStatus(id, orderId, remarks, deliveredDate, deviceInfo);
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Order Successfully Delivered",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample POST method for creating credit sale
 * Done By Nithin 
 * Date 23-06-2021
 */
JsonRoutes.add("POST", "/addStockReturn", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.body._id) {
                // console.log("req.body._id", req.body._id);
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.body._id;
                        let productArray = req.body.productArray;
                        let deviceInfo = req.body.deviceInfo;
                        if (productArray.length > 0) {
                            createStockReturnFn(id, productArray, deviceInfo);
                            notificationStockReturnFUn(user.subDistributor, "Stock Return");
                        }
                        JsonRoutes.sendResult(res, {
                            code: 200,
                            data: {
                                code: 200,
                                message: "Stock Return Added Successfully",
                                data: []
                            }
                        });
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});
/**
 * Sample GET method for calling the product price list details accoriding to user :- _id
 * Done By : Nithin
 * Date : 24/06/2021
 */
JsonRoutes.add("GET", "/getProductPriceList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let priceArray = [];
                        let priceListArray = [];
                        let subDistributor = user.subDistributor;
                        let sdUserChannel = '';
                        let userRole = Meteor.roles.findOne({ _id: user.roles[0] });
                        if (userRole !== undefined) {
                            let vsrCheck = userRole.permissions.includes("vsrView");
                            console.log("vsrCheck", vsrCheck);
                            if (vsrCheck === true) {
                                sdUserChannel = 'VSR';
                            }
                            let omrCheck = userRole.permissions.includes("omrView");
                            console.log("omrCheck", omrCheck);
                            if (omrCheck === true) {
                                sdUserChannel = 'OMR';
                            }
                            let wsCheck = userRole.permissions.includes("wseView");
                            console.log("wsCheck", wsCheck);
                            if (wsCheck === true) {
                                sdUserChannel = 'WS';
                            }
                        }
                        let sdPriceList = SdPriceType.find({ subDistributor: subDistributor, active: "Y" }, { fields: { priceType: 1 } }).fetch();
                        if (sdPriceList.length > 0) {
                            for (let j = 0; j < sdPriceList.length; j++) {
                                priceListArray.push(sdPriceList[j].priceType);
                            }
                        }
                        let priceRes = Price.find({ priceType: { $in: priceListArray }, active: "Y" }, {
                            fields: {
                                product: 1, unit: 1,
                                priceVsr: 1, priceType: 1, priceOmr: 1, priceWs: 1
                            }
                        }).fetch();
                        if (priceRes.length > 0) {
                            for (let p = 0; p < priceRes.length; p++) {
                                let sdProductData = SdProducts.findOne({
                                    product: priceRes[p].product,
                                    subDistributor: subDistributor
                                });
                                let priceVal = '0.00';
                                if (sdUserChannel === "VSR") {
                                    priceVal = Number(priceRes[p].priceVsr).toFixed(2);
                                }
                                else if (sdUserChannel === 'OMR') {
                                    priceVal = Number(priceRes[p].priceOmr).toFixed(2);
                                }
                                else if (sdUserChannel === 'WS') {
                                    priceVal = Number(priceRes[p].priceWs).toFixed(2);
                                }
                                if (sdProductData !== undefined) {
                                    let priceObj =
                                    {
                                        productId: priceRes[p].product,
                                        unitId: priceRes[p].unit,
                                        price: priceVal.toString(),
                                        priceType: priceRes[p].priceType,
                                    }
                                    priceArray.push(priceObj);
                                }
                            }
                        }
                        // console.log("History", history.length);
                        if (priceArray !== undefined && priceArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: priceArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});
/**
 * Sample GET method for calling the product  list details accoriding to user :- _id
 * Done By : Nithin
 * Date : 23/06/2021
 */
JsonRoutes.add("GET", "/getProductList/:_id", function (req, res, next) {
    // console.log("req.authToken", req.authToken);
    // console.log("req.userId", req.userId);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                // console.log("req.body._id", req.params._id);
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) { // never existed or already been used
                    // console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: [],
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let productArray = [];
                        let priceListArray = [];
                        let productArrayUnique = [];
                        let subDistributor = user.subDistributor;
                        let sdPriceList = SdPriceType.find({ subDistributor: subDistributor, active: "Y" }, { fields: { priceType: 1, vertical: 1 } }).fetch();
                        if (sdPriceList.length > 0) {
                            for (let j = 0; j < sdPriceList.length; j++) {
                                priceListArray.push(sdPriceList[j].priceType);
                            }
                            // get sd wise price list
                            findPriceListFn(priceListArray);
                        }
                        function findPriceListFn(priceListArray) {
                            let priceRes = Price.find({ priceType: { $in: priceListArray }, active: "Y" }, {
                                fields: {
                                    product: 1, priceType: 1
                                }
                            }).fetch();
                            if (priceRes.length > 0) {
                                let sdProductList = [];
                                productArrayUnique = priceRes.reduce(function (memo, e1) {
                                    let matches = memo.filter(function (e2) {
                                        return e1.product == e2.product
                                    });
                                    if (matches.length == 0) {
                                        memo.push(e1);
                                    }
                                    return memo;
                                }, []);
                                //get  unique product array (in case on multiple unit)
                                for (let i = 0; i < productArrayUnique.length; i++) {
                                    let sdProductData = SdProducts.findOne({
                                        product: productArrayUnique[i].product,
                                        subDistributor: subDistributor
                                    });
                                    if (sdProductData !== undefined) {
                                        let productObj = {
                                            _id: sdProductData._id,
                                            priceType: productArrayUnique[i].priceType,
                                            product: sdProductData.product,
                                        }
                                        sdProductList.push(productObj);
                                    }
                                }
                                productListGetFn(sdProductList);
                            }
                            function productListGetFn(sdProductList) {
                                for (let p = 0; p < sdProductList.length; p++) {
                                    let verticalIds = '';
                                    let sdPriceDetails = sdPriceList.find(x => x.priceType === sdProductList[p].priceType);
                                    if (sdPriceDetails) {
                                        verticalIds = sdPriceDetails.vertical;
                                    }
                                    let productNames = '';
                                    let productCodes = '';
                                    let baseUnits = '';
                                    let ProductRes = Product.findOne({ _id: sdProductList[p].product },
                                        { fields: { productCode: 1, productName: 1, basicUnit: 1 } });
                                    if (ProductRes) {
                                        productNames = ProductRes.productName;
                                        productCodes = ProductRes.productCode;
                                        baseUnits = ProductRes.basicUnit;
                                    }
                                    let priceObj =
                                    {
                                        productId: sdProductList[p].product,
                                        productCode: productCodes,
                                        productName: productNames,
                                        baseUnitId: baseUnits,
                                        verticalId: verticalIds,
                                    }
                                    productArray.push(priceObj);
                                }
                            }
                        }
                        // console.log("History", history.length);
                        if (productArray !== undefined && productArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: productArray
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 404,
                                data: {
                                    code: 404,
                                    message: "not found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }
                }
            }
            else {
                // console.log("Token userId and Param _id are not matching.!");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * Sample GET method for calling the lead accoriding to user :- _id
 * Done By : Anand
 * Date : 26/02/21
 */
JsonRoutes.add("GET", "/getOutletList/:_id", function (req, res, next) {

    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) {
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let outletArray = [];
                        let testObj = {
                            _id: Random.id(),
                            cardCode: 'Walk-In Customer',
                            cardName: 'Walk-In Customer',
                            routeId: '',
                            routeName: '',
                            emailId: '',
                            priority: '1',
                            insideImage: '',
                            outsideImage: '',
                            contactPerson: '',
                            contactNo: '',
                            remark: '',
                            status: 'Approved',
                            outletType: '',
                            outletClass: '',
                            walkInCustomer: 'true',
                            fencingArea: "200",
                            createdDate: moment(new Date()).format('DD-MM-YYYY'),
                        };
                        outletArray.push(testObj);
                        let outletGet = Outlets.find({ createdBy: id }, {
                            fields: {
                                _id: 1, name: 1, address: 1, contactNo: 1, contactPerson: 1, emailId: 1, remark: 1, routeId: 1, groupName: 1,
                                priority: 1, subDistributor: 1, outletType: 1, outletClass: 1, approvalStatus: 1, mobileAppId: 1, createdAt: 1
                            }
                        }, { sort: { createdAt: -1 } }).fetch();
                        if (outletGet.length > 0) {
                            for (let i = 0; i < outletGet.length; i++) {
                                let routeNames = '';
                                if (outletGet[i].routeId !== '' && outletGet[i].routeId !== undefined) {
                                    let routeDeatils = RouteGroup.findOne({ _id: outletGet[i].routeId });
                                    if (routeDeatils) {
                                        routeNames = routeDeatils.routeName;
                                    }
                                }
                                let outletObj = {
                                    _id: outletGet[i]._id,
                                    cardCode: outletGet[i]._id,
                                    cardName: outletGet[i].name,
                                    routeId: outletGet[i].routeId,
                                    routeName: routeNames,
                                    emailId: outletGet[i].emailId,
                                    priority: outletGet[i].priority,
                                    insideImage: '',
                                    outsideImage: '',
                                    contactPerson: outletGet[i].contactPerson,
                                    contactNo: outletGet[i].contactNo,
                                    remark: outletGet[i].remark,
                                    status: outletGet[i].approvalStatus,
                                    outletType: outletGet[i].outletType,
                                    outletClass: outletGet[i].outletClass,
                                    walkInCustomer: 'false',
                                    fencingArea: "200",
                                    createdDate: moment(outletGet[i].createdAt).format('DD-MM-YYYY'),
                                };
                                outletArray.push(outletObj);
                            }
                        }
                        if (outletArray !== undefined && outletArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: outletArray,
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                data: {
                                    code: 404,
                                    message: "No Data Found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }

                }
            }
            else {
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});


/**
 * Sample GET method:- _id
 * Done By : Nithin
 * Date : 26/02/21
 */
JsonRoutes.add("GET", "/getCollectionList/:_id", function (req, res, next) {

    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.params._id === undefined && req.url !== '/users/login') {
            JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: []
                }
            });
        } else {
            if (req.url !== '/users/login' && req.userId === req.params._id) {
                let user = Meteor.users.findOne({
                    _id: req.params._id
                });
                if (!user) {
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        let id = req.params._id;
                        let collectionArray = [];
                        let collectionGet = CollectionDue.find({ createdBy: id }, {
                            fields: {
                                _id: 1, outlet: 1, route: 1, collectionType: 1, transactionType: 1, invoiceNumber: 1,
                                paymentType: 1, latitude: 1,
                                longitude: 1, cashInfo: 1, chequeInfo: 1, rtgsInfo: 1,
                                collectionAmt: 1, createdBy: 1, vertical: 1,
                                createdAt: 1, collectionBalance: 1, collectionDate: 1
                            }
                        }, { sort: { createdAt: -1 } }).fetch();
                        if (collectionGet.length > 0) {
                            for (let i = 0; i < collectionGet.length; i++) {
                                let routeNames = '';
                                if (collectionGet[i].route !== '' && collectionGet[i].route !== undefined) {
                                    let routeDeatils = RouteGroup.findOne({ _id: collectionGet[i].route });
                                    if (routeDeatils) {
                                        routeNames = routeDeatils.routeName;
                                    }
                                }
                                let outletName = '';
                                if (collectionGet[i].outlet !== '' && collectionGet[i].outlet !== undefined) {
                                    let outletDetails = Outlets.findOne({ _id: collectionGet[i].outlet });
                                    if (outletDetails) {
                                        outletName = outletDetails.name;
                                    }
                                }
                                let verticalName = '';
                                if (collectionGet[i].vertical !== '' && collectionGet[i].vertical !== undefined) {
                                    let verticalDetails = Verticals.findOne({ _id: collectionGet[i].vertical });
                                    if (verticalDetails) {
                                        verticalName = verticalDetails.verticalName;
                                    }
                                }
                                let collectionObj = {
                                    _id: collectionGet[i]._id,
                                    cardCode: collectionGet[i].outlet,
                                    cardName: outletName,
                                    routeId: collectionGet[i].route,
                                    routeName: routeNames,
                                    verticalId: collectionGet[i].vertical,
                                    verticalName: verticalName,
                                    image: '',
                                    collectionType: collectionGet[i].collectionType,
                                    billType: collectionGet[i].transactionType,
                                    paymentType: collectionGet[i].paymentType,
                                    chequeInfo: collectionGet[i].chequeInfo,
                                    cashInfo: collectionGet[i].cashInfo,
                                    rtgsInfo: collectionGet[i].rtgsInfo,
                                    prevAmount: collectionGet[i].collectionBalance,
                                    amount: collectionGet[i].collectionAmt,
                                    invoiceNumber: collectionGet[i].invoiceNumber,
                                    latitude: collectionGet[i].latitude,
                                    longitude: collectionGet[i].longitude,
                                    createdDate: collectionGet[i].collectionDate,
                                };
                                collectionArray.push(collectionObj);
                            }
                        }
                        if (collectionArray !== undefined && collectionArray.length > 0) {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "success",
                                    data: collectionArray,
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                data: {
                                    code: 404,
                                    message: "No Data Found",
                                    data: []
                                }
                            });
                        }
                    }
                    else {
                        JsonRoutes.sendResult(res, {
                            code: 401,
                            data: {
                                code: 401,
                                message: "Make sure you have the latest version of the FMCL app",
                                data: {},
                            }
                        });
                    }

                }
            }
            else {
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});
/**
 * Update password api
 * Done by : Nithin
 * Date : 25/07/21
 */
JsonRoutes.add("POST", "/updatePassword", function (req, res, next) {
    //console.log("req.body", req.body);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined) {
            JsonRoutes.sendResult(res, {

                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.userId === req.body._id) {
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) {
                    //console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    let appversionCheck = Config.findOne({ name: 'vansaleAppVersion' });
                    if (appversionCheck !== undefined && req.headers.appversion !== undefined && appversionCheck.value === req.headers.appversion) {
                        // Response after the verification of User
                        let id = req.body._id; //userId
                        let newPassword = req.body.newPassword;
                        //console.log("newPassword", newPassword);

                        // Accounts.changePassword(oldPassword, newPassword);
                        if (newPassword != '' && newPassword !== undefined && newPassword !== null) {
                            Accounts.setPassword(id, newPassword);
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "Password Changed Successfully",
                                    data: []
                                }
                            });
                        }
                        else {
                            JsonRoutes.sendResult(res, {
                                code: 401,
                                data: {
                                    code: 401,
                                    message: "Make sure you have the latest version of the FMCL app",
                                    data: {},
                                }
                            });
                        }
                    }
                    // Authorisation Response Section     
                }
            }
            else {
                //console.log("Token userId and Param _id are not matching.! ");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        //console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});


/**
 * Route Data Update with checkin and checkout data
 * Done by : Nithin
 * Date : 28/09/21
 */
JsonRoutes.add("POST", "/routeDataUpdate", function (req, res, next) {
    //console.log("req.body", req.body);
    if (req.authToken !== undefined && req.userId !== undefined) {
        if (req.body._id === undefined) {
            JsonRoutes.sendResult(res, {

                code: 401,
                data: {
                    code: 401,
                    message: "You are not Authorized",
                    data: [],
                }
            });
        } else {
            if (req.userId === req.body._id) {
                let user = Meteor.users.findOne({
                    _id: req.body._id
                });
                if (!user) {
                    //console.log("never existed or already been used");
                    JsonRoutes.sendResult(res, {
                        code: 401,
                        data: {
                            code: 401,
                            message: "You are not Authorized",
                            data: []
                        }
                    });
                } else {
                    // Response after the verification of User
                    let id = req.body._id; //userId
                    // console.log("check data",req.body);..
                    let routeCodeId = req.body.routeCode;
                    let routeArray = req.body.routeData;
                    let deviceInfo = req.body.deviceInfo;
                    // let routeArray = JSON.parse(req.body.routeData);
                    if (routeCodeId != undefined && routeCodeId !== '') {
                        let routeCheck = RouteAssign.findOne({ _id: routeCodeId });
                        if (routeCheck !== undefined) {
                            routeDataUpdateFn(routeCodeId, routeArray, routeCheck.routeId, routeCheck.assignedBy, id,
                                routeCheck.assignedAt, routeCheck.vertical, deviceInfo);
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "Route Updated Successfully",
                                    data: []
                                }
                            });
                        } else {
                            JsonRoutes.sendResult(res, {
                                code: 200,
                                data: {
                                    code: 200,
                                    message: "Please check the Route Code",
                                    data: []
                                }
                            });
                        }
                    } else {
                        JsonRoutes.sendResult(res, {
                            code: 404,
                            data: {
                                code: 404,
                                message: "Route Code is a Mandatory Field",
                                data: []
                            }
                        });
                    }

                    // Authorisation Response Section     
                }
            }
            else {
                //console.log("Token userId and Param _id are not matching.! ");
                JsonRoutes.sendResult(res, {
                    code: 401,
                    data: {
                        code: 401,
                        message: "You are not Authorized",
                        data: []
                    }
                });
            }
        }
    } else {
        //console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                code: 401,
                message: "You are not Authorized",
                data: []
            }
        });
    }
});

/**
 * User Token Updating For the Firebase
 */
JsonRoutes.add("POST", "/firebase_token", function (req, res, next) {
    //console.log("req.body", req.body);

    // Response after the verification of User
    let userId = req.body._id;
    let firebaseToken = req.body.firebaseToken;

    // new function for customer user create 
    firebaseTokenUpdateFun(userId, firebaseToken);

    JsonRoutes.sendResult(res, {
        code: 200,
        data: {
            code: 200,
            message: "Success",
            data: []
        }
    });
    //}
    // Authorisation Response Section     
});

/**
 * User Token Updating For the Firebase
 */
JsonRoutes.add("POST", "/logout", function (req, res, next) {
    //console.log("req.body", req.body); 
    // Response after the verification of User
    let userId = req.body._id;
    // new function for customer user create 
    updateUserLogout(userId);
    JsonRoutes.sendResult(res, {
        code: 200,
        data: {
            code: 200,
            message: "Success",
            data: []
        }
    });
    //}
    // Authorisation Response Section     
});
/**
 * Function for Creating the Outlet
 * @param {*} outlet_name 
 * @param {*} outlet_contact 
 * @param {*} outlet_contactPerson 
 * @param {*} outlet_address 
 * @param {*} outlet_email 
 * @param {*} remark 
 * @param {*} createdBy 
 * @param {*} routeId 
 */
function outletCreateFunction(outlet_name, outlet_contact, outlet_contactPerson, outlet_address, outlet_email,
    remark, createdBy, routeId, priority, userRes, insideImage, outsideImage, latitude, longitude,
    outletType, outletClass, deviceInfo) {
    return Outlets.insert({
        name: outlet_name,
        address: outlet_address,
        contactNo: outlet_contact,
        contactPerson: outlet_contactPerson,
        emailId: outlet_email,
        remark: remark,
        routeId: routeId,
        priority: priority,
        createdBy: createdBy,
        subDistributor: userRes.subDistributor,
        insideImage: insideImage,
        outsideImage: outsideImage,
        latitude: latitude,
        longitude: longitude,
        outletType: outletType,
        outletClass: outletClass,
        randomId: Random.id(),
        active: "Y",
        approvalStatus: "Pending",
        deviceInfo: deviceInfo,
        createdAt: new Date(),
        uuid: Random.id()
    });
}
/**
 * 
 * @param {*} outlet 
 * @param {*} route 
 * @param {*} collectionType 
 * @param {*} transactionType 
 * @param {*} invoiceNumber 
 * @param {*} paymentType 
 * @param {*} ackImage 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} cashInfo 
 * @param {*} chequeInfo 
 * @param {*} rtgsInfo 
 * @param {*} collectionAmt 
 * @param {*} createdBy 
 * @returns create collection
 */

function collectionCreateFunction(outlet, route, collectionType,
    transactionType, invoiceNumber, paymentType, ackImage,
    latitude, longitude, cashInfo, chequeInfo, rtgsInfo,
    collectionAmt, createdBy, collectionBalance, userRes, vertical, createdDate) {
    let collectionRes = CollectionDue.insert({
        outlet: outlet,
        route: route,
        collectionType: collectionType,
        transactionType: transactionType,
        invoiceNumber: invoiceNumber,
        paymentType: paymentType,
        ackImage: ackImage,
        latitude: latitude,
        longitude: longitude,
        cashInfo: cashInfo,
        chequeInfo: chequeInfo,
        rtgsInfo: rtgsInfo,
        collectionAmt: collectionAmt,
        collectionBalance: collectionBalance,
        createdBy: createdBy,
        vertical: vertical,
        subDistributor: userRes.subDistributor,
        collectionDate: createdDate,
        createdAt: new Date(),
        uuid: Random.id()
    });
    if (collectionRes) {
        if (transactionType === 'Order') {
            let orderRes = Order.findOne({ docNum: invoiceNumber });
            if (orderRes) {
                Order.update({
                    _id: orderRes._id,
                }, {
                    $set:
                    {
                        collectionBalance: collectionBalance,
                        collectionUpdatedAt: new Date(),
                        updatedAt: new Date(),
                    }
                });
            }
        }
        else {
            let salesRes = CreditSale.findOne({ docNum: invoiceNumber });
            if (salesRes) {
                CreditSale.update({
                    _id: salesRes._id,
                }, {
                    $set:
                    {
                        collectionBalance: collectionBalance,
                        collectionUpdatedAt: new Date(),
                        updatedAt: new Date(),
                    }
                });
            }
        }
    }

    /**
     * 
     * 
     * cashInfo[amount,remark]
     * chequeInfo[amount,bank,remark],
     * rtgsInfo[amount,referenceNumber]
     */
}




// function for attendance punch in

function attendancePunchInFn(id, roles, date, formattedDate, time, locationGet, employeeDetails, deviceInfo) {
    return Attendance.insert({
        employeeId: id,
        role: roles,
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
        deviceInfo: deviceInfo,
        uuid: Random.id(),
        createdAt: new Date,
    });

}

// function for attendance punch out 
function attendancePunchOutFn(id, date, time, locationGet, deviceInfo) {
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
            deviceInfo: deviceInfo,
            updatedAt: new Date(),
        }
    });

}

/**
 * create direct Sale
 * @param {*} id 
 * @param {*} vertical 
 * @param {*} outlet 
 * @param {*} docDate 
 * @param {*} mobileAppId 
 * @param {*} remarks 
 * @param {*} docTotal 
 * @param {*} discountAmt 
 * @param {*} taxAmount 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} routeId 
 * @param {*} itemArray 
 */

function directSalesCreateFn(id, vertical, outlet, docDate, mobileAppId, remarks,
    docTotal, discountAmt, taxAmount, latitude, longitude, routeId, itemArray, sdVal, deviceInfo) {

    let temporaryId = '';

    // generate temp code
    let tempVal = TempSerialNo.findOne({
        cashSale: true,
    }, { sort: { $natural: -1 } });
    if (!tempVal) {
        temporaryId = "CASH/" + "FMC" + "/1";
    } else {
        temporaryId = "CASH/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
    }
    if (!tempVal) {
        TempSerialNo.insert({
            serial: 1,
            cashSale: true,
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

    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
        totalQty += Number(itemsQty[i].quantity);
    }
    let directSaleRes = DirectSale.insert({
        sdUser: id,
        subDistributor: sdVal,
        vertical: vertical,
        outlet: outlet,
        docDate: docDate,
        mobileAppId: mobileAppId,
        remarks: remarks,
        docTotal: docTotal,
        discountAmt: discountAmt,
        taxAmount: taxAmount,
        latitude: latitude,
        longitude: longitude,
        routeId: routeId,
        itemArray: itemArray,
        totalQty: totalQty.toString(),
        totalItems: itemArray.length.toString(),
        afterDiscount: '',
        beforeDiscount: '',
        status: "Approved",
        customerType: 'Walk-In Customer',
        docNum: temporaryId,
        createdBy: id,
        deviceInfo: deviceInfo,
        uuid: Random.id(),
        createdAt: new Date()
    });
    if (directSaleRes) {
        stockUpdateAPIFun(directSaleRes, vertical, sdVal, id, itemArray);
    }

}


/**
 * create credit Sale
 * @param {*} id 
 * @param {*} vertical 
 * @param {*} outlet 
 * @param {*} docDate 
 * @param {*} mobileAppId 
 * @param {*} remarks 
 * @param {*} docTotal 
 * @param {*} discountAmt 
 * @param {*} taxAmount 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} routeId 
 * @param {*} itemArray 
 */

function creditSalesCreateFn(id, vertical, outlet, docDate, mobileAppId, remarks,
    docTotal, discountAmt, taxAmount, latitude, longitude,
    routeId, itemArray, sdVal, salesType, customerVal, deviceInfo) {

    let temporaryId = '';
    // generate temp code
    let tempVal = TempSerialNo.findOne({
        creditSale: true,
    }, { sort: { $natural: -1 } });
    if (!tempVal) {
        temporaryId = "CREDIT/" + "FMC" + "/1";
    } else {
        temporaryId = "CREDIT/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
    }
    if (!tempVal) {
        TempSerialNo.insert({
            serial: 1,
            creditSale: true,
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

    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
        totalQty += Number(itemsQty[i].quantity);
    }


    let creditSaleVal = CreditSale.insert({
        sdUser: id,
        vertical: vertical,
        subDistributor: sdVal,
        outlet: outlet,
        docDate: docDate,
        mobileAppId: mobileAppId,
        remarks: remarks,
        docTotal: docTotal,
        discountAmt: discountAmt,
        taxAmount: taxAmount,
        latitude: latitude,
        longitude: longitude,
        routeId: routeId,
        itemArray: itemArray,
        totalQty: totalQty.toString(),
        totalItems: itemArray.length.toString(),
        salesType: salesType,
        walkInCustomer: customerVal,
        afterDiscount: '',
        beforeDiscount: '',
        docNum: temporaryId,
        createdBy: id,
        deviceInfo: deviceInfo,
        uuid: Random.id(),
        createdAt: new Date()
    });
    if (creditSaleVal) {
        stockUpdateAPIFun(creditSaleVal, vertical, sdVal, id, itemArray);
    }

}


/**
 * create order
 * @param {*} id 
 * @param {*} vertical 
 * @param {*} outlet 
 * @param {*} docDate 
 * @param {*} mobileAppId 
 * @param {*} remarks 
 * @param {*} docTotal 
 * @param {*} discountAmt 
 * @param {*} taxAmount 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} routeId 
 * @param {*} itemArray 
 */

function createOrderFn(id, vertical, outlet, docDate, mobileAppId, remarks,
    docTotal, discountAmt, taxAmount, latitude, longitude, routeId, itemArray, sdVal, deviceInfo) {
    let totalQty = 0;
    let itemsQty = itemArray;
    for (let i = 0; i < itemsQty.length; i++) {
        totalQty += Number(itemsQty[i].quantity);
    }
    return Order.insert({
        sdUser: id,
        vertical: vertical,
        subDistributor: sdVal,
        outlet: outlet,
        docDate: docDate,
        mobileAppId: mobileAppId,
        remarks: remarks,
        docTotal: docTotal,
        discountAmt: discountAmt,
        taxAmount: taxAmount,
        latitude: latitude,
        longitude: longitude,
        routeId: routeId,
        itemArray: itemArray,
        totalQty: totalQty.toString(),
        totalItems: itemArray.length.toString(),
        afterDiscount: '',
        beforeDiscount: '',
        orderId: '',
        status: "Pending",
        deviceInfo: deviceInfo,
        uuid: Random.id(),
        createdBy: id,
        createdAt: new Date()
    });

}
/**
 * 
 * @param {*} id 
 * stock accept status update
 */

function updateStockTransferFn(id, transferId) {
    return StockTransfer.update({
        _id: transferId,
    }, {
        $set:
        {
            status: 'Accepted',
            acceptedDate: new Date(),
            acceptedBy: id,
            updatedAt: new Date(),
        }
    });
}


/**
 * 
 * @param {*} id 
 * stock updates by sd user based on stock transfer
 */

function updateStockTransferIssued(id, transferId, productArray) {
    for (let i = 0; i < productArray.length; i++) {
        let resVal = StockTransferIssued.update({
            transferId: transferId, product: productArray[i].productId,
            unit: productArray[i].unitId, vertical: productArray[i].verticalId
        }, {
            $set:
            {
                acceptedQuantity: productArray[i].quantity,
                acceptedDate: new Date(),
                updatedAt: new Date(),
            }
        });
        if (resVal) {
            console.log("productArray[i]", productArray[i]);
            warehouseStockUpdates(productArray[i], id, transferId)
        }
    }
}

/**
 * 
 * @param {*} productArray 
 * @param {*} empId 
 * @param {*} transferId 
 * update warehouse stock
 */

function warehouseStockUpdates(productArray, empId, transferId) {
    let stockTransferRes = StockTransfer.findOne({ _id: transferId });
    let baseQty = 0;
    let unitRes = Unit.findOne({ _id: productArray.unitId });
    if (unitRes) {
        baseQty = Number(unitRes.baseQuantity);
    }
    if (stockTransferRes) {
        let warehouseRes = WareHouseStock.find({
            employeeId: empId,
            subDistributor: stockTransferRes.subDistributor, product: productArray.productId, vertical: productArray.verticalId
        }).fetch();
        if (warehouseRes.length === 0) {
            let stockVal = Number(productArray.quantity) * baseQty;
            WareHouseStock.insert({
                employeeId: empId,
                subDistributor: stockTransferRes.subDistributor,
                vertical: productArray.verticalId,
                product: productArray.productId,
                stock: stockVal.toString(),
                uuid: Random.id(),
                createdAt: new Date(),
            });
        }
        else {
            let actualStock = Number(warehouseRes[0].stock);
            let transferStock = Number(productArray.quantity) * baseQty;
            let balanceStock = Number(actualStock + transferStock);
            WareHouseStock.update({ _id: warehouseRes[0]._id }, {
                $set: {
                    stock: balanceStock.toString(),
                    updatedAt: new Date(),
                    updatedBy: stockTransferRes.subDistributor
                }
            });
        }
    }
}


/**
 * 
 * @param {*} saleId 
 * @param {*} vertical 
 * @param {*} subDistributor 
 * @param {*} sdUser 
 * @param {*} productsArray 
 * update stock
 */
function stockUpdateAPIFun(saleId, vertical, subDistributor, sdUser, productArray) {
    for (let i = 0; i < productArray.length; i++) {
        let stockRes = WareHouseStock.findOne({
            employeeId: sdUser, subDistributor: subDistributor, vertical: vertical,
            product: productArray[i].product
        });
        if (stockRes) {
            let actualStock = Number(stockRes.stock);
            let transferStock = Number(productArray[i].transferStockVal);
            let balanceStock = Number(actualStock - transferStock);
            let stockVals = '0.00';
            if (Number(balanceStock) > 0) {
                stockVals = balanceStock.toString();
            }
            WareHouseStock.update({ _id: stockRes._id }, {
                $set: {
                    stock: stockVals,
                    updatedAt: new Date(),
                    updatedBy: sdUser
                }
            });
        }
    }
}

function createStockReturnFn(id, productArray, deviceInfo) {
    let subDistributor = '';
    let userResVal = allUsers.findOne({ _id: id });
    if (userResVal) {
        subDistributor = userResVal.subDistributor;
    }
    let temporaryId = '';

    // generate temp code
    let tempVal = TempSerialNo.findOne({
        stockReturn: true,
    }, { sort: { $natural: -1 } });
    if (!tempVal) {
        temporaryId = "SR/" + "FMC" + "/1";
    } else {
        temporaryId = "SR/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
    }
    if (!tempVal) {
        TempSerialNo.insert({
            serial: 1,
            stockReturn: true,
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

    let transferResult = StockReturn.insert({
        subDistributor: subDistributor,
        sdUser: id,
        status: "Pending",
        temporaryId: temporaryId,
        transferDate: moment(new Date()).format('DD-MM-YYYY'),
        transferDateIso: new Date(),
        uuid: Random.id(),
        deviceInfo: deviceInfo,
        createdBy: id,
        createdAt: new Date(),
    });
    if (transferResult) {
        for (let i = 0; i < productArray.length; i++) {
            stockReturnItemsValFn(transferResult, subDistributor, id, temporaryId, productArray[i]);
        }
    }
}

/**
 * 
 * @param {*} transferResult 
 * @param {*} subDistributor 
 * @param {*} empId 
 * @param {*} temporaryId 
 * @param {*} productArray 
 * create issued items collection
 */
function stockReturnItemsValFn(transferResult, subDistributor, empId, temporaryId, productArray) {
    StockReturnItems.insert({
        returnId: transferResult,
        temporaryId: temporaryId,
        subDistributor: subDistributor,
        sdUser: empId,
        product: productArray.product,
        unit: productArray.unit,
        quantity: productArray.quantity,
        stock: productArray.quantity,
        vertical: productArray.vertical,
        status: "Pending",
        transferDate: moment(new Date).format('DD-MM-YYYY'),
        transferDateIso: new Date(),
        uuid: Random.id()
    });
}

/**
 * To update Firebase Token in User Master
 * @param {*} userId 
 * @param {*} firebaseToken 
 */
function firebaseTokenUpdateFun(userId, firebaseToken) {
    return Meteor.users.update(userId, {
        $set: {
            firebaseToken: firebaseToken
        }
    });
}
/**
 * outlet creation notification
 */
function notificationFUn(subd, type) {
    let notData = Notification.findOne({ type: "Outlet", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "Outlet", user: subd }, { $set: { count: countData } });
    } else {
        return Notification.insert({
            user: subd,
            type: type,
            count: 1,
            createdAt: new Date(),
            uuid: Random.id()
        });
    }
}
/**
 * collection creation notification
 */
function notificationFUnCollection(subd, type) {
    let notData = Notification.findOne({ type: "Collection", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "Collection", user: subd }, { $set: { count: countData } });
    } else {
        return Notification.insert({
            user: subd,
            type: type,
            count: 1,
            createdAt: new Date(),
            uuid: Random.id()
        });
    }
}
// For Notification for Stock return
function notificationStockReturnFUn(subd, type) {
    let notData = Notification.findOne({ type: "Stock Return", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "Stock Return", user: subd }, { $set: { count: countData } });
    } else {
        return Notification.insert({
            user: subd,
            type: type,
            count: 1,
            createdAt: new Date(),
            uuid: Random.id()
        });
    }
}


// For Notification for Stock Acceptance
function notificationAcptStkAPI(subd) {
    let notData = Notification.findOne({ type: "Stock Acceptance", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "Stock Acceptance", user: subd }, { $set: { count: countData } })
    } else {
        return Notification.insert({
            user: subd,
            type: "Stock Acceptance",
            count: 1,
            createdAt: new Date()
        });
    }
}

/**
 * check transfer stock edit or not
 */

function stockEditCheckFn(id, transferId, productArray) {
    let stockEditBool = false;
    for (let i = 0; i < productArray.length; i++) {
        let resVal = StockTransferIssued.findOne({
            transferId: transferId, product: productArray[i].productId,
            unit: productArray[i].unitId, vertical: productArray[i].verticalId
        });
        if (resVal) {
            let transferQty = Number(resVal.quantity).toFixed(2);
            let acceptQty = Number(productArray[i].quantity).toFixed(2);
            if (transferQty !== acceptQty) {
                stockEditBool = true;
                StockTransferIssued.update({
                    _id: resVal._id
                }, {
                    $set:
                    {
                        stockEdited: true,
                        updatedAt: new Date(),
                    }
                });
            }
        }
    }
    if (stockEditBool === true) {
        notificationEditStkAPI(id)
    }
}



function notificationEditStkAPI(subd) {
    let notData = Notification.findOne({ type: "Stock Edited", user: subd });
    if (notData) {
        let countData = Number(notData.count + 1);
        return Notification.update({ type: "Stock Edited", user: subd }, { $set: { count: countData } })
    } else {
        return Notification.insert({
            user: subd,
            type: "Stock Edited",
            count: 1,
            createdAt: new Date()
        });
    }
}
/**
 * 
 * @param {*} id 
 * @param {*} orderId 
 * @param {*} remarks 
 * @returns update delivery status
 */

function updateOrderStatus(id, orderId, remarks, deliveryDate, deviceInfo) {
    let orderRes = Order.findOne({ docNum: orderId, status: "Approved" });
    let dateFormates = moment(deliveryDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    if (orderRes) {
        Order.update({ _id: orderRes._id }, {
            $set:
            {
                status: "Delivered",
                deliveryRemarks: remarks,
                deliveredBy: id,
                deviceInfoDelivery: deviceInfo,
                deliveredDate: new Date(dateFormates),
            }
        });
        stockUpdateOrderFun(orderRes.vertical, orderRes.subDistributor,
            id, orderRes.itemArray);

    }

}


/**
 * 
 * @param {*} saleId 
 * @param {*} vertical 
 * @param {*} subDistributor 
 * @param {*} sdUser 
 * @param {*} productsArray 
 * update stock (order -- delivery)
 */
function stockUpdateOrderFun(vertical, subDistributor, sdUser, productArray) {
    for (let i = 0; i < productArray.length; i++) {
        let stockRes = WareHouseStock.findOne({
            employeeId: sdUser, subDistributor: subDistributor, vertical: vertical,
            product: productArray[i].product
        });
        if (stockRes) {
            let actualStock = Number(stockRes.stock);
            let transferStock = Number(productArray[i].unitQuantity) * Number(productArray[i].quantity);
            let balanceStock = Number(actualStock - transferStock);
            let stockVals = '0.00';
            if (Number(balanceStock) > 0) {
                stockVals = balanceStock.toString();
            }
            WareHouseStock.update({ _id: stockRes._id }, {
                $set: {
                    stock: stockVals,
                    updatedAt: new Date(),
                    updatedBy: sdUser,
                    orderDelivery: true,
                }
            });
        }
    }
}



/**
 * For the Route update Process
 * @param {*} routeCodeId 
 * @param {*} routeArray 
 * @param {*} id 
 */
function routeDataUpdateFn(routeCodeId, routeArray, routeGroup, assignedBy, id, date, vertical, deviceInfo) {

    for (let x = 0; x < routeArray.length; x++) {
        let timeDiff = '-';
        let date1 = '';
        let date2 = '';
        if (routeArray[x].checkIn !== '' && routeArray[x].checkIn !== undefined &&
            routeArray[x].checkOut !== '' && routeArray[x].checkOut !== undefined) {
            let dateVlues = moment(routeArray[x].date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            let checkInData = routeArray[x].checkIn.replace(".", ":");
            let checkOutData = routeArray[x].checkOut.replace(".", ":");
            date1 = new Date(`${dateVlues} ${checkInData}`);
            date2 = new Date(`${dateVlues} ${checkOutData}`);
            var d = Math.abs(new Date(date2) - new Date(date1)) / 1000;                           // delta
            var r = {};                                                                // result
            var s = {                                                                  // structure
                year: 31536000,
                month: 2592000,
                week: 604800, // uncomment row to ignore
                day: 86400,   // feel free to add your own row
                hour: 3600,
                minute: 60,
                second: 1
            };

            Object.keys(s).forEach(function (key) {
                r[key] = Math.floor(d / s[key]);
                d -= r[key] * s[key];
            });

            // for example: {year:0,month:0,week:1,day:2,hour:34,minute:56,second:7}
            // console.log(r);
            if (isNaN(r.hour) && isNaN(r.minute)) {
                timeDiff = '0';
            }
            else {
                timeDiff = `${r.hour} Hours ${r.minute} Minutes ${r.second} Seconds`;
            }
        }
        RouteUpdates.insert({
            routeGroup: routeGroup,
            routeAssignId: routeCodeId,
            assignedAt: date,
            assignedTo: id,
            assignedBy: assignedBy,
            outlet: routeArray[x].cardCode,
            checkIn: routeArray[x].checkIn,
            checkOut: routeArray[x].checkOut,
            checkInDateIso: date1,
            checkOutDateIso: date2,
            dateValue: routeArray[x].date,
            timeSpent: timeDiff,
            skipStatus: routeArray[x].skipStatus,
            remark: routeArray[x].remark,
            remarkDescription: routeArray[x].remarkDescription,
            latitude: routeArray[x].latitude,
            longitude: routeArray[x].longitude,
            routeUpdatedBy: id,
            vertical: vertical,
            uuid: Random.id(),
            deviceInfo: deviceInfo,
            updateAt: new Date(),
            createdAt: new Date(),
        });
    }
}


function updateLoginStatus(id) {
    return Meteor.users.update({ _id: id }, {
        $set: {
            loggedIn: true,
        }
    });
}

function updateUserLogout(id) {
    return Meteor.users.update({ _id: id }, {
        $set: {
            loggedIn: false,
            token: '',
            'services.resume.loginTokens': [],
        }
    });
}