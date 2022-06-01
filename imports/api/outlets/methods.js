/**
 * @author Nithin
 */
import { Outlets } from './outlets';
import { RouteGroup } from '../routeGroup/routeGroup';
import { RouteAssign } from '../routeAssign/routeAssign';
import { allUsers } from '../user/user';
import { Notification } from '../notification/notification';
import { CreditSale } from '../creditSale/creditSale';

Meteor.methods({
  /**
   * 
   * @param {*} outletName 
   * @param {*} contactPerson 
   * @param {*} contactNo 
   * @param {*} email 
   * @param {*} addressval 
   * @param {*} remarkval 
   * @param {*} insideImage 
   * @param {*} outsideImage 
   * create outlet
   */
  'outlet.createData': (outletName, contactPerson, contactNo,
    email, addressval, remarkval, insideImage, outsideImage, userId, latitude, longitude,
    outletType, outletClass) => {
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
    let routeId = '';
    let routeRes = RouteAssign.find({ assignedTo: userId, routeDate: todaysDate, active: "Y" }).fetch();
    if (routeRes.length > 0) {
      routeId = routeRes[0].routeId;
    }
    let userRes = allUsers.findOne({ _id: userId });
    notificationFUn(userRes.subDistributor, "Outlet")
    Outlets.insert({
      name: outletName,
      address: addressval,
      contactNo: contactNo,
      contactPerson: contactPerson,
      emailId: email,
      remark: remarkval,
      routeId: routeId,
      priority: '',
      createdBy: userId,
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
      createdAt: new Date(),
      uuid: Random.id()
    });
  },
  /**
   * 
   * @param {*} id 
   * get outlets name
   */
  'outlet.idName': (id) => {
    let res = Outlets.findOne({ _id: id });
    if (res) {
      return res.name;
    }
  },
  'outlet.lis': () => {
    return Outlets.find({ approvalStatus: "Approved" }, { fields: { name: 1 } }).fetch();
  },
  'outlet.lisWithRoute': (sd, fromDate, toDate) => {
    toDate.setDate(toDate.getDate() + 1);
    return Outlets.find({ subDistributor: sd, createdAt: { $gte: fromDate, $lt: toDate } }, {
      fields: {
        name: 1,
        createdAt: 1,
        contactPerson: 1,
        contactNo: 1,
        routeId: 1,
        address: 1,
        routeId: 1,
        outletType: 1,
        outletClass: 1,
        subDistributor: 1,
        createdBy: 1
      }
    }).fetch();
  },
  'outlet.sdBase': (sd) => {
    return Outlets.find({ approvalStatus: "Approved", subDistributor: sd, active: 'Y' }, { fields: { name: 1 } }).fetch();
  },
  'outlet.outletFullList': () => {
    return Outlets.find({ active: "Y", approvalStatus: "Approved" }, { fields: { name: 1, address: 1, contactNo: 1, contactPerson: 1 } }).fetch();
  },
  'outlet.outletFullList1': () => {
    return Outlets.find({ approvalStatus: "Approved" }, { fields: { name: 1, address: 1, contactNo: 1, contactPerson: 1 } }).fetch();
  },

  'outlet.listSd': (sd, fromDate, toDates) => {
    return Outlets.find({ approvalStatus: "Approved", subDistributor: sd, active: 'Y', createdAt: { $gte: fromDate, $lt: toDates } }, { fields: { name: 1, address: 1, contactNo: 1, contactPerson: 1, outletType: 1, outletClass: 1, routeId: 1 } }).fetch();
  },

  'outlet.outletData': (id) => {

    let outletsLi = Outlets.findOne({ _id: id });
    let routeName = '';
    let approvedByName = '';
    let createdByName = '';

    if (outletsLi) {
      if (outletsLi.routeId) {
        let routeRes = RouteGroup.findOne({ _id: outletsLi.routeId });
        if (routeRes) {
          routeName = routeRes.routeName;
        }
      }
      if (outletsLi.approvedBy) {
        let userRes = allUsers.findOne({ _id: outletsLi.approvedBy });
        if (userRes) {
          approvedByName = `${userRes.profile.firstName} ${userRes.profile.lastName}`;
        }
      }

      let userRes1 = allUsers.findOne({ _id: outletsLi.createdBy });
      if (userRes1) {
        createdByName = `${userRes1.profile.firstName} ${userRes1.profile.lastName}`;
      }

    }
    return {
      outletsLi: outletsLi, routeName: routeName, approvedByName: approvedByName,
      createdByName: createdByName,
    };
  },
  /**
   * 
   * @param {*} id 
   * @param {*} remarks 
   * @param {*} creditPeriod 
   * @param {*} creditAmount 
   * @returns approve outlets
   */
  'outlet.approve': (id, remarks, creditPeriod, creditAmount) => {
    let outletDetail = Outlets.findOne({ _id: id });
    if (outletDetail) {
      NotificationOutletApprovd(outletDetail.createdBy);
    }
    return Outlets.update({ _id: id }, {
      $set:
      {
        approvalStatus: "Approved",
        approvalRemark: remarks,
        creditPeriod: creditPeriod,
        creditAmount: creditAmount,
        assigned: true,
        priority: "1",
        approvedBy: Meteor.userId(),
        approvedDate: new Date(),
        updatedAt: new Date(),
      }
    });
  },
  'outlet.statusUpdate': (id, remarks, status) => {
    return Outlets.update({ _id: id }, {
      $set:
      {
        approvalStatus: status,
        approvalRemark: remarks,
        approvedBy: Meteor.userId(),
        approvedDate: new Date(),
        updatedAt: new Date(),
      }
    });
  },

  /**
  * deactivate outlet
  * @param {*} id  
  * @returns 
  */
  'outlet.inactive': (id) => {
    return Outlets.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
* update route
* @param {*} id  
* @returns 
*/
  'outlet.updateRoute': (id, route) => {
    return Outlets.update({ _id: id }, {
      $set:
      {
        routeId: route,
        routeUpdatedBy: Meteor.userId(),
        routeUpdatedAt: new Date(),
      }
    });
  },
  /**
   * activate outlet
   * @param {*} id  
   * @returns 
   */
  'outlet.active': (id) => {
    return Outlets.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * 
   * @returns 
   */
  'outlet.outletsdWiseList': (id) => {
    // console.log(id);
    return Outlets.find({ active: "Y", subDistributor: id, approvalStatus: "Approved" }, { fields: { name: 1 } }).fetch();
  },
  'outlet.outletNotapproved': (id) => {
    // console.log(id);
    return Outlets.find({ active: "Y", subDistributor: id, approvalStatus: "Pending" }, { fields: { name: 1 } }).fetch();
  },

  /**
  * 
  * @returns 
  */
  'outlet.sdUsersList': (id) => {

    /**
     * get current route
     */
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
    let routeId = '';
    let routeRes = RouteAssign.find({ assignedTo: id, routeDate: todaysDate, active: "Y" }).fetch();
    if (routeRes.length > 0) {
      routeId = routeRes[0].routeId;
    }
    /**
     * get route wise outlet list
     */
    return Outlets.find({
      active: "Y", createdBy: id, approvalStatus: "Approved",
      assigned: true, routeId: routeId
    }, { fields: { name: 1 } }).fetch();
  },

  /**
 * 
 * @returns 
 */
  'outlet.fullLists': (id) => {
    let data = Outlets.find({
      active: "Y", createdBy: id, approvalStatus: "Approved",
      assigned: true,
    }, { fields: { name: 1 } }).fetch();

    return data;
  },
  /**
   * get image data based on id */
  'outlets.getImages': (id) => {
    console.log("immmm", id);
    return Outlets.findOne({ _id: id }, { fields: { insideImage: 1, outsideImage: 1 } });
  },
  /**
   * 
   * @param {} id 
   * @returns 
   */
  'outlet.idDatas': (id) => {
    return Outlets.findOne({ _id: id, approvalStatus: "Approved" }, { fields: { creditPeriod: 1, creditAmount: 1 } });
  },

  /**
 * 
 * @returns 
 */
  'outlet.sdUseWiseList': (id) => {
    let data = Outlets.find({ approvalStatus: "Approved", createdBy: id }, { fields: { name: 1 } }).fetch();
    return data;
  },
  'outlet.createdByUser': (id) => {
    return Outlets.find({
      createdBy: id,
    }, { fields: { name: 1, outletType: 1, outletClass: 1, latitude: 1, longitude: 1 } }).fetch();
  },
  'outlet.createdBySuD': (id) => {
    return Outlets.find({
      subDistributor: id,
    }, { fields: { name: 1, outletType: 1, outletClass: 1, latitude: 1, longitude: 1 } }).fetch();
  },
  'outlet.updateData': (outletName, contactPerson, contactNo, email, addressval, remarkval, userId, outletType, outletClass, outlet_id) => {
    return Outlets.update({ _id: outlet_id }, {
      $set:
      {
        name: outletName,
        address: addressval,
        contactNo: contactNo,
        contactPerson: contactPerson,
        emailId: email,
        remark: remarkval,
        outletType: outletType,
        outletClass: outletClass,
        updatedAt: new Date(),
        updatedBy: userId
      }
    });
  },
  'outlet.totalOutlets': (subD, fromDate, toDate) => {
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    let res = Outlets.find({ subDistributor: subD, createdAt: { $gte: fromDateFor, $lt: nextDay }, approvalStatus: 'Approved' }).count();
    return res.toString();
  },
  'outlet.totalgOutlets': (vertical, fromDate, toDate, subD) => {
    let sdListArray = []; let vArray = []; let sdList = '';
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    if (vertical != null) {
      vArray.push(vertical);
      sdList = allUsers.find({ userType: "SD", active: "Y", vertical: { $in: vArray } }, { fields: { profile: 1 } }).fetch();
    } else {
      sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
    }

    if (subD !== null) {
      sdListArray.push(subD);
    } else {
      for (u = 0; u < sdList.length; u++) {
        sdListArray.push(sdList[u]._id);
      }
    }

    // console.log(" lenth ",sdListArray.length);
    let res = Outlets.find({ subDistributor: { $in: sdListArray }, createdAt: { $gte: fromDateFor, $lt: nextDay }, approvalStatus: 'Approved' }).count();
    return res.toString();
  },

  'outlet.totalSumOutlets': (sd, vertical, fromDate, toDate) => {
    // let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } });
    // let subdArray = [];
    // if (sd != null) {
    //   subdArray.push(sd);
    // } else {
    //   for (let i = 0; i < subD.length; i++) {
    //     subdArray.push(subD[i]._id);
    //   }
    // }
    // let fromDateFor = new Date(fromDate);
    // let nextDay = new Date(toDate);
    // nextDay.setDate(nextDay.getDate() + 1);
    // let res = Outlets.find({
    //   subDistributor: { $in: subdArray },
    //   createdAt: { $gte: fromDateFor, $lt: nextDay }, approvalStatus: 'Approved'
    // }).count();
    // return res.toString();

    let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } }).fetch();
    let subdArray = [];
    if (sd) {
      subdArray.push(sd);
    } else {
      for (let i = 0; i < subD.length; i++) {
        subdArray.push(subD[i]._id);
      }
    }
    // let fromDateFor = fromDate;
    // let nextDay = toDate;

    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let res = Outlets.find({
      subDistributor: { $in: subdArray },
      approvalStatus: 'Approved',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  }
  ,
  'outlet.newOutlets': (subD, fromDate, toDate) => {
    // let fromDateFor = fromDate;
    // let nextDay = toDate;
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let res = Outlets.find({
      subDistributor: subD,
      approvalStatus: 'Pending',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  },
  'outlet.outletNewTotal': (sd, vertical, fromDate, toDate) => {
    let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } }).fetch();
    let subdArray = [];
    if (sd) {
      subdArray.push(sd);
    } else {
      for (let i = 0; i < subD.length; i++) {
        subdArray.push(subD[i]._id);
      }
    }
    // let fromDateFor = fromDate;
    // let nextDay = toDate;

    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let res = Outlets.find({
      subDistributor: { $in: subdArray },
      approvalStatus: 'Pending',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  },
  'outlet.newgOutlets': (vertical, fromDate, toDate, subD) => {
    console.log(vertical, fromDate, toDate, subD);
    let fromDateFor = new Date(fromDate); let vArray = []; let sdList = '';
    let nextDay = new Date(toDate);
    let sdListArray = [];
    // let sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
    if (vertical !== null) {
      vArray.push(vertical);
      sdList = allUsers.find({ userType: "SD", active: "Y", vertical: { $in: vArray } }, { fields: { profile: 1 } }).fetch();
    } else {
      sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
    }
    // for (u = 0; u < sdList.length; u++) {
    //   sdListArray.push(sdList[u]._id);
    // }
    if (subD !== null) {
      sdListArray.push(subD);
    } else {
      for (u = 0; u < sdList.length; u++) {
        sdListArray.push(sdList[u]._id);
      }
    }
    nextDay.setDate(nextDay.getDate() + 1)
    let res = Outlets.find({
      subDistributor: { $in: sdListArray },
      approvalStatus: 'Pending',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();

    console.log('hai', res);
    return res.toString();
  },
  'outlet.productive': (subD, fromDate, toDate) => {
    let outlet = 0;
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    let outletsAry = Outlets.find({
      subDistributor: subD, approvalStatus: 'Approved',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).fetch();
    if (outletsAry.length > 0) {
      for (let i = 0; i < outletsAry.length; i++) {
        let newsale = CreditSale.findOne({ outlet: outletsAry[i]._id, createdAt: { $gte: fromDateFor, $lt: nextDay } });
        if (newsale) {
          outlet = outlet + 1;
        }
      }
    }
    return outlet.toString();
  },

  'outlet.productiveTotal': (vertical, fromDate, toDate, subD) => {
    let outlet = 0; let vArray = []; let sdList = '';
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    let sdListArray = [];
    // let sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
    if (vertical != null) {
      vArray.push(vertical);
      sdList = allUsers.find({ userType: "SD", active: "Y", vertical: { $in: vArray } }, { fields: { profile: 1 } }).fetch();
    } else {
      sdList = allUsers.find({ userType: "SD", active: "Y" }, { fields: { profile: 1 } }).fetch();
    }
    // for (u = 0; u < sdList.length; u++) {
    //   sdListArray.push(sdList[u]._id);
    // }
    if (subD !== null) {
      sdListArray.push(subD);
    } else {
      for (u = 0; u < sdList.length; u++) {
        sdListArray.push(sdList[u]._id);
      }
    }
    let outletsAry = Outlets.find({
      subDistributor: { $in: sdListArray }, approvalStatus: 'Approved',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).fetch();
    nextDay.setDate(nextDay.getDate() + 1)
    if (outletsAry.length > 0) {
      for (let i = 0; i < outletsAry.length; i++) {
        let newsale = CreditSale.findOne({ outlet: outletsAry[i]._id, createdAt: { $gte: fromDateFor, $lt: nextDay } });
        if (newsale) {
          outlet = outlet + 1;
        }
      }
    }
    return outlet.toString();
  },

  'outlet.pendingList': (subD, fromDate, toDate) => {
    // let fromDateFor = new Date(fromDate);
    // let nextDay = new Date(toDate);
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    let res = Outlets.find({
      subDistributor: subD, approvalStatus: 'Pending',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  },

  'outlet.pendingOutletsTotal': (sd, vertical, fromDate, toDate) => {
    // let subdArray = [];
    // if (sd) {
    //   subdArray.push(sd);
    // } else {
    //   let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } });
    //   for (let i = 0; i < subD.length; i++) {
    //     subdArray.push(subD[i]._id);
    //   }
    // }
    // let fromDateFor = new Date(fromDate);
    // let nextDay = new Date(toDate);
    // nextDay.setDate(nextDay.getDate() + 1);

    // // console.log("fromDateFor, nextDay ",fromDateFor, nextDay);

    // let res = Outlets.find({
    //   subDistributor: { $in: subdArray }, approvalStatus: 'Pending',
    //   createdAt: { $gte: fromDateFor, $lte: nextDay }
    // }).count();
    // return res.toString();

    let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } }).fetch();
    let subdArray = [];
    if (sd) {
      subdArray.push(sd);
    } else {
      for (let i = 0; i < subD.length; i++) {
        subdArray.push(subD[i]._id);
      }
    }
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let res = Outlets.find({
      subDistributor: { $in: subdArray },
      approvalStatus: 'Pending',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  },
  'outlet.onHoldList': (subD, fromDate, toDate) => {
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    let res = Outlets.find({
      subDistributor: subD,
      approvalStatus: 'On Hold',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  },
  'outlet.onHoldOutletsTotal': (sd, vertical, fromDate, toDate) => {
    // let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } });
    // let subdArray = [];
    // if (sd != null) {
    //   subdArray.push(sd);
    // } else {
    //   for (let i = 0; i < subD.length; i++) {
    //     subdArray.push(subD[i]._id);
    //   }
    // }
    // let fromDateFor = new Date(fromDate);
    // let nextDay = new Date(toDate);
    // nextDay.setDate(nextDay.getDate() + 1);
    // let res = Outlets.find({
    //   subDistributor: { $in: subdArray },
    //   approvalStatus: 'On Hold',
    //   createdAt: { $gte: fromDateFor, $lte: nextDay }
    // }).count();
    // return res.toString();

    let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } }).fetch();
    let subdArray = [];
    if (sd) {
      subdArray.push(sd);
    } else {
      for (let i = 0; i < subD.length; i++) {
        subdArray.push(subD[i]._id);
      }
    }
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let res = Outlets.find({
      subDistributor: { $in: subdArray },
      approvalStatus: 'On Hold',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  },
  'outlet.rejectedList': (subD, fromDate, toDate) => {
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    // console.log("fromDateFor", fromDateFor);
    let res = Outlets.find({
      subDistributor: subD,
      approvalStatus: 'Rejected',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    // console.log("outtotal", res);
    return res.toString();
  },
  'outlet.rejectedOutletsTotal': (sd, vertical, fromDate, toDate) => {
    // let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } });
    // let subdArray = [];
    // if (sd) {
    //   subdArray.push(sd);
    // } else {
    //   for (let i = 0; i < subD.length; i++) {
    //     subdArray.push(subD[i]._id);
    //   }
    // }
    // let fromDateFor = new Date(fromDate);
    // let nextDay = new Date(toDate);
    // nextDay.setDate(nextDay.getDate() + 1);

    // let res = Outlets.find({
    //   subDistributor: { $in: subdArray },
    //   approvalStatus: 'Rejected',
    //   createdAt: { $gte: fromDateFor, $lte: nextDay }
    // }).count();
    // return res.toString();

    let subD = allUsers.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y' }, { fields: { profile: 1 } }).fetch();
    let subdArray = [];
    if (sd) {
      subdArray.push(sd);
    } else {
      for (let i = 0; i < subD.length; i++) {
        subdArray.push(subD[i]._id);
      }
    }
    let fromDateFor = new Date(fromDate);
    let nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let res = Outlets.find({
      subDistributor: { $in: subdArray },
      approvalStatus: 'Rejected',
      createdAt: { $gte: fromDateFor, $lte: nextDay }
    }).count();
    return res.toString();
  },
  'outlet.totalOutletsDashMD': () => {
    let labelAry = [];
    let valAry = [];
    let colorAry = [];
    let subD = allUsers.find({ userType: 'SD', active: 'Y' }, { fields: { profile: 1 } }).fetch();
    for (let i = 0; i < subD.length; i++) {
      let res = Outlets.find({ subDistributor: subD[i]._id, active: 'Y' }).count();
      if (res !== 0) {
        var color = `rgb(${randomrgb()}, ${randomrgb()}, ${randomrgb()})`;
        labelAry.push(subD[i].profile.firstName);
        valAry.push(res);
        colorAry.push(color)
      }

    }
    let object = {
      label: labelAry,
      value: valAry,
      color: colorAry
    }

    // console.log("object", object);
    return object;
  },
  'outlet.totalOutletsDashBH': (vertical) => {
    let labelAry = [];
    let valAry = [];
    let colorAry = [];
    if (vertical.length > 0) {
      let subD = allUsers.find({ userType: 'SD', active: 'Y', vertical: { $in: vertical } }, { fields: { profile: 1 } }).fetch();
      for (let i = 0; i < subD.length; i++) {
        let res = Outlets.find({ subDistributor: subD[i]._id, active: 'Y' }).count();
        if (res !== 0) {
          var color = `rgb(${randomrgb()}, ${randomrgb()}, ${randomrgb()})`;
          labelAry.push(subD[i].profile.firstName);
          valAry.push(res);
          colorAry.push(color)
        }

      }
      let object = {
        label: labelAry,
        value: valAry,
        color: colorAry
      }

      // console.log("object", object);
      return object;
    }
  },
  'outlets.currentMontOutlets': (vertical, fromDate, toDate) => {
    let sudArray = [];
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    toDate.setDate(toDate.getDate() + 1);
    let subD = allUsers.find({ userType: 'SD', active: 'Y', vertical: vertical }, { fields: { profile: 1 } }).fetch();
    for (let i = 0; i < subD.length; i++) {
      sudArray.push(subD[i]._id);
    }
    return Outlets.find({ subDistributor: { $in: sudArray }, createdAt: { $gte: fromDate, $lte: toDate } }).count();
  },
  'outlet.outletDataByMonth': (id, fromDate, toDate) => {
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    toDate.setDate(toDate.getDate() + 1);
    return Outlets.find({ subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }, { fields: { approvalStatus: 1, } }).fetch();


  },
  /**
   * 
   * @param {*} routeId 
   * @returns get outlet count based on route
   */
  'outlet.routeCountGet': (routeId) => {
    return Outlets.find({ routeId: routeId, active: "Y" }).count();
  },

  'outlet.loginVerticalWise': (vertical) => {
    let subDArray = [];
    let userRes = allUsers.find({ vertical: { $in: vertical }, userType: "SD", },
      { fields: { _id: 1 } }).fetch();
    if (userRes.length > 0) {
      for (let i = 0; i < userRes.length; i++) {
        subDArray.push(userRes[i]._id);
      }
    }

    return Outlets.find({
      subDistributor: { $in: subDArray },
    }, { fields: { name: 1, outletType: 1, outletClass: 1, latitude: 1, longitude: 1 } }).fetch();
  },
  /**
   * 
   * @param {*} id 
   * @returns 
   */
  'outlet.dataValGet': (id) => {
    return Outlets.findOne({ _id: id }, {
      fields: {
        outletType: 1, name: 1,
        address: 1, outletClass: 1, contactPerson: 1
      }
    });
  }
});

function randomrgb() {
  return Math.random() * 256 >> 0
}
// For Notification for Outlets
function notificationFUn(subd, type) {
  let notData = Notification.findOne({ type: "Outlet", user: subd });
  if (notData) {
    let countData = Number(notData.count + 1);
    return Notification.update({ type: "Outlet", user: subd }, { $set: { count: countData } })
  } else {
    return Notification.insert({
      user: subd,
      type: type,
      count: 1,
      createdAt: new Date()
    });
  }
}
// For Notification for Outlets
function NotificationOutletApprovd(subd) {
  let notData = Notification.findOne({ type: "New Outlet", user: subd });
  if (notData) {
    let countData = Number(notData.count + 1);
    return Notification.update({ type: "New Outlet", user: subd }, { $set: { count: countData } })
  } else {
    return Notification.insert({
      user: subd,
      type: "New Outlet",
      count: 1,
      createdAt: new Date()
    });
  }
}
