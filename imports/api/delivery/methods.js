import { Delivery } from "./delivery";
import { Outlets } from '../outlets/outlets'; 
import { allUsers } from '../user/user'; 
/**
 * @author Greeshma
 */

Meteor.methods({
   'delivery.deliveryList': () => {
      return Delivery.find().fetch();
  } ,
  'delivery.deliveryData': (id) => {
   let outlet = '';
   let assigned_to = '';
   let nameOutlet ='';
   let nameassigned_to ='';
   let data ='';
       data = Delivery.findOne({_id:id});
      if(data){
         if(data.outlet){
            nameOutlet = Outlets.findOne({ _id: data.outlet }, { fields:{ name:1 } });
            if(nameOutlet) outlet = nameOutlet.name;
         }
      if(data.assigned_to){
            nameassigned_to = allUsers.findOne({ _id: data.assigned_to }, { fields : { username:1 }});
            if(nameassigned_to) assigned_to = nameassigned_to.username;
         }
      }
      return {data:data,nameOutlet:outlet,nameassigned_to:assigned_to}
  }
});