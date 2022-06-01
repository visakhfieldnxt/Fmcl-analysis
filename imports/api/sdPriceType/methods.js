/**
 * @author Nithin
 */
import { PriceType } from '../priceType/priceType';
import { SdPriceType } from './sdPriceType';

Meteor.methods({
    /**
     * get price type name */

    'sdPriceType.dataGet': (id) => {
        let res = SdPriceType.find({ subDistributor: id, active: "Y" }).fetch();
        let resultArray = [];
        if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                let verticalObj =
                {
                    randomId: res[i]._id,
                    vertical: res[i].vertical,
                    priceType: res[i].priceType,
                }
                resultArray.push(verticalObj);
            }
        }
        return resultArray;
    },
    'priceType.findName':(subD,vertical)=>{
        let typeAry=[];
        let res = SdPriceType.find({ subDistributor: subD, vertical: {$in:vertical} },{fields:{subDistributor:1,vertical:1,priceType:1}}).fetch();   
        if (res.length>0) {
            for (let i = 0; i < res.length; i++) {
               let priceName= PriceType.findOne({_id:res[i].priceType}).priceTypeName;
               typeAry.push(priceName);                
            }
        }
        return typeAry.toString();

    }
});