/**
 * @author Visakh
 */

import {publishPagination} from 'meteor/kurounin:pagination';
import {Meteor} from 'meteor/meteor';
import {Order} from '../order';

Meteor.startup(() => {
  Order.createIndex({uuid: 1}, {unique: true});
  // Order.createIndex({createdAt: 1}, {unique: false});
  // Order.createIndex({userId: 1}, {unique: false});
  // Order.createIndex({docDate: 1}, {unique: false});
  // Order.createIndex({cardCode: 1}, {unique: false});
  // Order.createIndex({branch: 1}, {unique: false});
  // Order.createIndex({employeeId: 1}, {unique: false});
  
  
  
  publishPagination(Order);

  
});

Meteor.publish('order.list', function () {
  return Order.find({}, {sort: {uuid: 1}},{fields: {createdAt: 1, uuid: 1,userId:1,docDate:1,cardCode:1,branch:1,employeeId:1,itemLines:1}});
  // return Order.find({});
  // {"docDueDate":"2019-04-30","docStatus":"O","docDate":"2019-04-15T07:33:51.406Z","itemLines":[{"randomId":"WPSESof5m9e4WESdd","salesPrice":"429.750000","unitPrice":"429.750000","itemCategory":"IRON","itemCode":"SYSKA Ace SDI-100 Dry Iron - Black Grey","itemNam":"Ace SDI-100 Dry Iron - B/G  W/B","quantity":"1","TaxCode":"18","discount":0,"discountAmount":"0","warehouseId":"SBL001","beforeDiscount":429.75,"afterDiscount":429.75}],"beforeDiscount":"429.75","afterDiscount":"429.75","GST":"77.36","grandTotal":"507.11","flag":true,"uuid":"7szmbyNvFuTnGCHyx","createdAt":"2019-04-15T07:33:51.406Z"}
});
/**
 * TODO COmplete JS doc
 */
Meteor.publish('orderDashboard.list', function () {
  return Order.find({}, {sort: {uuid: 1}},{fields: { slpCode:1,uuid: 1,userId:1,docDate:1,branch:1,docStatus:1}});
  // return Order.find({});
  // {"docDueDate":"2019-04-30","docStatus":"O","docDate":"2019-04-15T07:33:51.406Z","itemLines":[{"randomId":"WPSESof5m9e4WESdd","salesPrice":"429.750000","unitPrice":"429.750000","itemCategory":"IRON","itemCode":"SYSKA Ace SDI-100 Dry Iron - Black Grey","itemNam":"Ace SDI-100 Dry Iron - B/G  W/B","quantity":"1","TaxCode":"18","discount":0,"discountAmount":"0","warehouseId":"SBL001","beforeDiscount":429.75,"afterDiscount":429.75}],"beforeDiscount":"429.75","afterDiscount":"429.75","GST":"77.36","grandTotal":"507.11","flag":true,"uuid":"7szmbyNvFuTnGCHyx","createdAt":"2019-04-15T07:33:51.406Z"}
});

/**
 * TODO COmplete JS doc
 */
Meteor.publish('orderAdding.list', function () {
  return Order.find({docStatus:"O"}, {sort: {uuid: 1}},{fields: {createdAt: 1, uuid: 1,userId:1,docDate:1,cardCode:1,branch:1,employeeId:1,itemLines:1}});
  // return Order.find({});
  // {"docDueDate":"2019-04-30","docStatus":"O","docDate":"2019-04-15T07:33:51.406Z","itemLines":[{"randomId":"WPSESof5m9e4WESdd","salesPrice":"429.750000","unitPrice":"429.750000","itemCategory":"IRON","itemCode":"SYSKA Ace SDI-100 Dry Iron - Black Grey","itemNam":"Ace SDI-100 Dry Iron - B/G  W/B","quantity":"1","TaxCode":"18","discount":0,"discountAmount":"0","warehouseId":"SBL001","beforeDiscount":429.75,"afterDiscount":429.75}],"beforeDiscount":"429.75","afterDiscount":"429.75","GST":"77.36","grandTotal":"507.11","flag":true,"uuid":"7szmbyNvFuTnGCHyx","createdAt":"2019-04-15T07:33:51.406Z"}
});

/**
 * TODO: Complete JS itemResult
 */
Meteor.publish('orderSpecific.list', function (id) {
  return Order.find({_id:id},{sort:{_id:1},fields:{cardCode:1,branch:1,employeeId:1,userId:1,
    docDueDate:1,docStatus:1,draftStatus:1,docDate:1,itemLines:1,beforeDiscount:1,afterDiscount:1,
    GST:1,grandTotal:1,_id:1,uuid:1,createdAt:1,docEntry:1,orderId:1}});
 });