/**
 * @author Greeshma
 */
import { Order } from './order';
import { Verticals } from '../verticals/verticals';
import { RouteGroup } from '../routeGroup/routeGroup';
import { Outlets } from '../outlets/outlets';
import { Delivery } from '../delivery/delivery';
import { allUsers } from '../user/user';
import { RouteAssign } from '../routeAssign/routeAssign';
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { Notification } from '../notification/notification';
Meteor.methods({
   /**
    * 
    * @param {*} productsArray 
    * @param {*} vertical 
    * @param {*} grandTotal 
    * @param {*} taxTotal 
    * @param {*} latitude 
    * @param {*} longitude 
    * @param {*} outlet 
    * create order
    */
   'order.create': (productsArray, vertical, grandTotal, taxTotal, latitude, longitude, outlet, discount) => {
      let sdVal = '';
      let userDetails = allUsers.findOne({ _id: Meteor.userId() });
      if (userDetails) {
         sdVal = userDetails.subDistributor;
         notificationOrdrFun(userDetails.subDistributor);
      }
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
      let routeRes = RouteAssign.find({ assignedTo: Meteor.userId(), routeDate: todaysDate, active: "Y" }).fetch();
      if (routeRes.length > 0) {
         routeId = routeRes[0].routeId;
      }

      let totalQty = 0;
      let itemsQty = productsArray;
      for (let i = 0; i < itemsQty.length; i++) {
         totalQty += Number(itemsQty[i].quantity);
      }

      return Order.insert({
         sdUser: Meteor.userId(),
         subDistributor: sdVal,
         vertical: vertical,
         outlet: outlet,
         routeId: routeId,
         docDate: moment(new Date).format('DD-MM-YYYY'),
         docTotal: grandTotal.toString(),
         discountAmt: discount,
         taxAmount: taxTotal.toString(),
         latitude: latitude,
         longitude: longitude,
         itemArray: productsArray,
         totalQty: totalQty.toString(),
         totalItems: productsArray.length.toString(),
         afterDiscount: '',
         beforeDiscount: '',
         docNum: '',
         status: "Pending",
         createdBy: Meteor.userId(),
         uuid: Random.id(),
         createdAt: new Date(),
      });
   },
   'order.idSdName': (id) => {
      let sdName = '';
      let sdList = Meteor.users.findOne({ _id: id });
      if (sdList) {
         sdName = `${sdList.profile.firstName} ${sdList.profile.lastName}`;
      }
      return sdName;
   },
   'order.orderData': (id) => {
      let sdName = '';
      let sdName1 = '';
      let verticalName = '';
      let routeName = '';
      let createdByName = '';
      let outletName = '';
      let approvedByName = '';
      let orderList = Order.findOne({ _id: id });
      if (orderList) {
         if (orderList.sdUser) {
            let sdNameList = Meteor.users.findOne({ _id: orderList.sdUser });
            if (sdNameList) sdName = `${sdNameList.profile.firstName} ${sdNameList.profile.lastName}`;
         }
         if (orderList.subDistributor) {
            let sdNameList1 = Meteor.users.findOne({ _id: orderList.subDistributor });
            if (sdNameList1) sdName1 = `${sdNameList1.profile.firstName} ${sdNameList1.profile.lastName}`;
         }
         if (orderList.createdBy) {
            let createdBy12 = Meteor.users.findOne({ _id: orderList.createdBy });
            if (createdBy12) createdByName = `${createdBy12.profile.firstName} ${createdBy12.profile.lastName}`;
         }
         if (orderList.vertical) {
            let verticalNameList = Verticals.findOne({ _id: orderList.vertical });
            if (verticalNameList) verticalName = verticalNameList.verticalName;
         }
         if (orderList.outlet) {
            let outletNameList = Outlets.findOne({ _id: orderList.outlet });
            if (outletNameList) outletName = outletNameList.name;
         }
         if (orderList.routeId) {
            let routeNameList = RouteGroup.findOne({ _id: orderList.routeId });
            if (routeNameList) routeName = routeNameList.routeName;
         }
         if (orderList.approvedBy) {
            let userDatas = Meteor.users.findOne({ _id: orderList.approvedBy });
            if (userDatas) {
               approvedByName = `${userDatas.profile.firstName} ${userDatas.profile.lastName}`;
            }

         }
      }

      return {
         orderList: orderList, sdName: sdName,
         verticalName: verticalName, outletName: outletName,
         routeName: routeName, sdName1: sdName1, createdByName: createdByName, approvedByName: approvedByName
      }

   },
   /**
      * 
      * @param {*} id 
      * @param {*} remarks 
      * @returns approve outlets
      */
   'order.approve': (id, remarks, outlet, assigned_to) => {
      let idNew = 0;

      let temporaryId = '';

      // generate temp code
      let tempVal = TempSerialNo.findOne({
         order: true,
      }, { sort: { $natural: -1 } });
      if (!tempVal) {
         temporaryId = "ORDR/" + "FMC" + "/1";
      } else {
         temporaryId = "ORDR/" + "FMC" + "/" + parseInt(tempVal.serial + 1);
      }
      if (!tempVal) {
         TempSerialNo.insert({
            serial: 1,
            order: true,
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
      let ordrDetail = Order.findOne({ _id: id });
      if (ordrDetail) {
         NotificationOrdrAprvd(ordrDetail.sdUser);

      }
      let data = Order.update({ _id: id }, {
         $set:
         {
            status: "Approved",
            approvalRemark: remarks,
            docNum: temporaryId,
            approvedBy: Meteor.userId(),
            approvedDate: new Date(),
            updatedAt: new Date(),
         }
      });
      if (data) {
         idNew = Delivery.insert({
            uuid: Random.id(),
            outlet: outlet,
            assigned_to: assigned_to,
            date: new Date(),
            location: "",
            active: "Y",
            status: "Pending"
         });
      }
      return idNew;
   },

   /**
        * fetching directsale id
        * @returns 
        */
   'order.id': (id) => {
      let sdName = '';
      let verticalName = '';
      let routeIdName = '';
      let outletName = '';
      let createdName = '';
      let data = Order.findOne({ _id: id });
      if (data) {
         if (data.sdUser) {
            let sdUser1 = allUsers.findOne({ _id: data.sdUser });
            if (sdUser1) {
               sdName = sdUser1.username;
            }
         }
         if (data.vertical) {
            let vertical1 = Verticals.findOne({ _id: data.vertical });
            if (vertical1) {
               verticalName = vertical1.verticalName;
            }
         }
         if (data.routeId) {
            let routeId1 = RouteGroup.findOne({ _id: data.routeId });
            if (routeId1) {
               routeIdName = routeId1.routeName;
            }
         }
         if (data.outlet) {
            let outlet1 = Outlets.findOne({ _id: data.outlet });
            if (outlet1) {
               outletName = outlet1.name;
            }
         }
         if (data.createdBy) {
            let created1 = allUsers.findOne({ _id: data.createdBy });
            if (created1) {
               createdName = created1.username;
            }
         }

      }
      return {
         orderData: data, sdName: sdName, verticalName: verticalName,
         routeIdName: routeIdName, outletName: outletName, createdName: createdName
      };
   },
   /**
      * 
      * @param {*} id 
      * @param {*} remarks 
      * @returns update order status
      */
   'order.statusUpdate': (id, remarks, status) => {
      return Order.update({ _id: id }, {
         $set:
         {
            status: status,
            approvalRemark: remarks,
            docNum: '',
            statusUpdatedBy: Meteor.userId(),
            statusUpdatedDate: new Date(),
            updatedAt: new Date(),
         }
      });
   },
   'order.update': (productsArray, vertical, grandTotal, taxTotal, outlet, idOrder, discountVal) => {
      let totalQty = 0;
      let itemsQty = productsArray;
      for (let i = 0; i < itemsQty.length; i++) {
         // totalQty += Number(itemsQty[i].quantity);
      }
      return Order.update({ _id: idOrder }, {
         $set:
         {
            vertical: vertical,
            outlet: outlet,
            docTotal: grandTotal,
            taxAmount: taxTotal,
            itemArray: productsArray,
            totalQty: totalQty,
            totalItems: productsArray.length,
            discountAmt: discountVal,
            afterDiscount: '',
            beforeDiscount: '',
            docNum: '',
            UpdatedBy: Meteor.userId(),
            UpdatedDate: new Date()
         }
      });

   },
   'order.orderCount': (id, fromDate, toDate) => {
      fromDate = new Date(fromDate);
      toDate = new Date(toDate);
      toDate.setDate(toDate.getDate() + 1);
      return Order.find({ subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }).count();
   },
   'order.orderApproved': (id, fromDate, toDate) => {
      fromDate = new Date(fromDate);
      toDate = new Date(toDate);
      toDate.setDate(toDate.getDate() + 1);
      return Order.find({ status: 'Approved', subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }).count();
   },
   'order.orderOnHold': (id, fromDate, toDate) => {
      fromDate = new Date(fromDate);
      toDate = new Date(toDate);
      toDate.setDate(toDate.getDate() + 1);
      return Order.find({ status: 'On Hold', subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }).count();
   },
   'order.orderRejected': (id, fromDate, toDate) => {
      fromDate = new Date(fromDate);
      toDate = new Date(toDate);
      toDate.setDate(toDate.getDate() + 1);
      return Order.find({ status: 'Rejected', subDistributor: id, createdAt: { $gte: fromDate, $lte: toDate } }).count();
   },


   'order.orderlistExpo': (outlet, route, sd, fromDate, toDates) => {
      console.log("outlet, route, sd, fromDate, toDates", outlet, route, sd, fromDate, toDates);
      if (outlet && route === '') {
         return Order.find({ subDistributor: sd, outlet: outlet, createdAt: { $gte: fromDate, $lte: toDates } }, { fields: { sdUser: 1, vertical: 1, outlet: 1, routeId: 1, docDate: 1, status: 1, docTotal: 1, taxAmount: 1, itemArray: 1 } }).fetch();
      }
      else if (outlet === '' && route) {
         return Order.find({ subDistributor: sd, routeId: route, createdAt: { $gte: fromDate, $lte: toDates } }, { fields: { sdUser: 1, vertical: 1, outlet: 1, routeId: 1, docDate: 1, status: 1, docTotal: 1, taxAmount: 1, itemArray: 1 } }).fetch();
      }
      else if (outlet && route) {
         return Order.find({ subDistributor: sd, outlet: outlet, routeId: route, createdAt: { $gte: fromDate, $lte: toDates } }, { fields: { sdUser: 1, vertical: 1, outlet: 1, routeId: 1, docDate: 1, status: 1, docTotal: 1, taxAmount: 1, itemArray: 1 } }).fetch();
      }
      else {
         return Order.find({ subDistributor: sd, createdAt: { $gte: fromDate, $lte: toDates } }, { fields: { sdUser: 1, vertical: 1, outlet: 1, routeId: 1, docDate: 1, status: 1, docTotal: 1, taxAmount: 1, itemArray: 1 } }).fetch();
      }

   },
   /**
    * 
    * @param {*} sd 
    * @param {*} route 
    * @param {*} outletData 
    * @param {*} fromDate 
    * @param {*} toDate 
    * @param {*} employeeData 
    * @returns 
    */
   'order.docTotalSum': (sd, route, outletData, fromDate, toDate, employeeData) => {
      let docTotalSum = 0;
      let orderData = [];
      if (fromDate && toDate) {
         toDate.setDate(toDate.getDate() + 1)
         if (employeeData && outletData === '' && route === '') {
            orderData = Order.find({
               subDistributor: sd,
               sdUser: employeeData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: {
                  docTotal: 1
               }
            }).fetch();
         } else if (employeeData === '' && outletData && route === '') {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: {
                  docTotal: 1
               }
            }).fetch();
         } else if (employeeData === '' && outletData === '' && route) {
            orderData = Order.find({
               subDistributor: sd,
               routeId: route,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: {
                  docTotal: 1
               }
            }).fetch();
         } else if (employeeData && outletData && route === '') {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               sdUser: employeeData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }).fetch();
         } else if (employeeData && outletData === '' && route) {
            orderData = Order.find({
               subDistributor: sd,
               routeId: route,
               sdUser: employeeData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: {
                  docTotal: 1
               }
            }).fetch();
         } else if (employeeData === '' && outletData && route) {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               routeId: route,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: {
                  docTotal: 1
               }
            }).fetch();
         } else if (employeeData && outletData && route) {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               sdUser: employeeData,
               routeId: route,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: {
                  docTotal: 1
               }
            }).fetch();
         } else {
            orderData = Order.find({
               subDistributor: sd,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: {
                  docTotal: 1
               }
            }).fetch();
         }
         if (orderData.length > 0) {
            for (let j = 0; j < orderData.length; j++) {
               docTotalSum += Number(orderData[j].docTotal);
            }
         }
      }
      return docTotalSum.toFixed(2);
   },
   'order.taxAmountSum': (sd, route, outletData, fromDate, toDate, employeeData) => {
      let docTotalSum = 0, orderData = '';
      if (fromDate && toDate) {
         toDate.setDate(toDate.getDate() + 1);
         if (employeeData && outletData === null && route === null) {
            orderData = Order.find({
               subDistributor: sd,
               sdUser: employeeData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: { taxAmount: 1 }
            }).fetch();
         } else if (employeeData === null && outletData && route === null) {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: { taxAmount: 1 }
            }).fetch();
         } else if (employeeData === null && outletData === null && route) {
            orderData = Order.find({
               subDistributor: sd,
               routeId: route,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: { taxAmount: 1 }
            }).fetch();
         } else if (employeeData && outletData && route === null) {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               sdUser: employeeData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: { taxAmount: 1 }
            }).fetch();
         } else if (employeeData && outletData === null && route) {
            orderData = Order.find({
               subDistributor: sd,
               routeId: route,
               sdUser: employeeData,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: { taxAmount: 1 }
            }).fetch();
         } else if (employeeData === null && outletData && route) {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               routeId: route,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: { taxAmount: 1 }
            }).fetch();
         } else if (employeeData && outletData && route) {
            orderData = Order.find({
               subDistributor: sd,
               outlet: outletData,
               sdUser: employeeData,
               routeId: route,
               createdAt: { $gte: fromDate, $lt: toDate }
            },
               {
                  fields: { taxAmount: 1 }
               }).fetch();
         } else {
            orderData = Order.find({
               subDistributor: sd,
               createdAt: { $gte: fromDate, $lt: toDate }
            }, {
               fields: { taxAmount: 1 }
            }).fetch();
         }
         if (orderData.length > 0) {
            for (let j = 0; j < orderData.length; j++) {
               docTotalSum += Number(orderData[j].taxAmount);
            }
         }
      }

      return docTotalSum.toFixed(2);
   },
   'order.orderIdVarList': (sdUser) => {
      let data = Order.find({ sdUser: sdUser }, { fields: { docNum: 1 } }).fetch();
      if (data) {
         return data;
      }
   }

});
// For Notification for Oredr Add
function notificationOrdrFun(subd) {
   let notData = Notification.findOne({ type: "New Order", user: subd });
   if (notData) {
      let countData = Number(notData.count + 1);
      return Notification.update({ type: "New Order", user: subd }, { $set: { count: countData } })
   } else {
      return Notification.insert({
         user: subd,
         type: "New Order",
         count: 1,
         uuid: Random.id(),
         createdAt: new Date()
      });
   }
}
// For Notification for Oredr Add
function NotificationOrdrAprvd(subd) {
   let notData = Notification.findOne({ type: "Ordr Aprvd", user: subd });
   if (notData) {
      let countData = Number(notData.count + 1);
      return Notification.update({ type: "Ordr Aprvd", user: subd }, { $set: { count: countData } })
   } else {
      return Notification.insert({
         user: subd,
         type: "Ordr Aprvd",
         count: 1,
         createdAt: new Date()
      });
   }
}
