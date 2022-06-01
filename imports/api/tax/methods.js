import { Tax } from './tax';
import { Branch } from './../branch/branch';
import { Meteor } from 'meteor/meteor';
import { Config } from '../config/config';

Meteor.methods({
	 /**
  * TODO: Complete JS doc
  * @param code
  * @param name
  * @param percentage
  * @param active
  */
  'tax.create': (code,name,percentage,taxid) => {
      let taxId = Tax.insert({
         taxCode:code,
         taxName:name,
         active:true,
         taxPercentage:Number(percentage)
      });
      return taxId;
  }, 
  'tax.gettax': (_id) => {
    return Tax.find({ _id: _id}).fetch();
 },
 'tax.deactivateTax': (_id) => {
   let taxId = Tax.update({_id:_id},{
      $set:{
        active:false
      }
   });
   return taxId;
  },
  'tax.activateTax': (_id) => {
   let taxId = Tax.update({_id:_id},{
      $set:{
        active:true
      }
   });
   return taxId;
  },
  'tax.withid': (_id) => {
   return Tax.findOne({ _id: _id});
  },
  'tax.update': (code,name,percentage,taxid) => {
   let taxId = Tax.update({_id:taxid},{
      $set:{
         taxCode:code,
         taxName:name, 
         taxPercentage:Number(percentage)
      }
   });
   return taxId;
  },
  'tax.List': (_id) => {
   return Tax.find().fetch();
  }

});
