/**
 * @author Visakh
 */

import {publishPagination} from 'meteor/kurounin:pagination';
import {Meteor} from 'meteor/meteor';
import {StockTransfer} from '../stockTransfer';

Meteor.startup(() => {
  StockTransfer.createIndex({uuid: 1}, {unique: true});
  StockTransfer.createIndex({cardCode: 1}, {unique: false});
  publishPagination(StockTransfer);
});

Meteor.publish('stockTransfer.list', function () {
  return StockTransfer.find({}, {sort: {uuid: 1}},{fields: {createdAt: 1, uuid: 1,userId:1,docDate:1,cardCode:1,branch:1,employeeId:1,itemLines:1}});
  // return Order.find({});
  // {"docDueDate":"2019-04-30","docStatus":"O","docDate":"2019-04-15T07:33:51.406Z","itemLines":[{"randomId":"WPSESof5m9e4WESdd","salesPrice":"429.750000","unitPrice":"429.750000","itemCategory":"IRON","itemCode":"SYSKA Ace SDI-100 Dry Iron - Black Grey","itemNam":"Ace SDI-100 Dry Iron - B/G  W/B","quantity":"1","TaxCode":"18","discount":0,"discountAmount":"0","warehouseId":"SBL001","beforeDiscount":429.75,"afterDiscount":429.75}],"beforeDiscount":"429.75","afterDiscount":"429.75","GST":"77.36","grandTotal":"507.11","flag":true,"uuid":"7szmbyNvFuTnGCHyx","createdAt":"2019-04-15T07:33:51.406Z"}
});

