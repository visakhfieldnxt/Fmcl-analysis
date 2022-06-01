/**
 * @author Nithin
 */
import { SdProducts } from './sdProducts';
import { Product } from '../products/products';
Meteor.methods({
    /**
     * 
     * @param {*} id 
     * @param {*} productArray 
     * upload sd products list
     **/
    'sdProducts.createUpload': (id, productArray) => {
        if (productArray.length > 0) {
            for (let i = 0; i < productArray.length; i++) {
                let productData = Product.findOne({ productName: productArray[i].productName });
                if (productData) {
                    let productRes = SdProducts.find({
                        subDistributor: id,
                        product: productData._id
                    }).fetch();
                    if (productRes.length === 0) {
                        SdProducts.insert({
                            subDistributor: id,
                            product: productData._id,
                            minimumQty: productArray[i].minQty,
                            active: "Y",
                            excelUpload: true,
                            uuid: Random.id(),
                            createdBy: Meteor.userId(),
                            createdAt: new Date(),
                        });
                    }
                    else {
                        SdProducts.update({ _id: productRes[0]._id },
                            {
                                $set: {
                                    minimumQty: productArray[i].minQty,
                                    active: "Y",
                                    updatedAt: new Date(),
                                }
                            });
                    }
                }
            }
        }
    },
    'sdProducts.list': (id) => {
         let  prodList =  SdProducts.find({subDistributor: id}).fetch();
         let productObj='';
         let productArray = [];
         if(prodList){
            for (let i = 0; i < prodList.length; i++) {
                let productName='';
                let  prodNameList =  Product.findOne({_id: prodList[i]['product']});
                if(prodNameList){
                    productName = prodNameList.productName;
                    productObj = {
                        productId: prodList[i].product,
                        productname: productName,
                    }
                    productArray.push(productObj);
                }
            }
         }
         return productArray;
    },
    'sdProducts.getProductVar':(sd)=>{
       let productArray = [];
       let data = SdProducts.find({ subDistributor:sd }, { fields: { product:1 }}).fetch();
       if(data){
            for(i=0; i<data.length; i++){
                let productData = Product.findOne( { _id:data[i].product }, { fields:{ productName:1 } } );
                if(productData){
                    let obj = {
                        _id:productData._id,
                        product:productData.productName
                    }
                    productArray.push(obj);
                }
               
            }
       }
       return productArray;
    }
});