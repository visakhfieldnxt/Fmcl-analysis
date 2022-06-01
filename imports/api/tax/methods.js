/**
* @author Visakh
*/

import { Tax } from './tax';
import { Meteor } from 'meteor/meteor';
import { Config } from '../config/config';
// import {taxDataGet_Url} from '../../startup/client/sapUrls';

Meteor.methods({
  /**
    * TODO:Complete JS doc
    * Fetching Branch List
 */
  'tax.taxList': () => {
    return Tax.find({}, { sort: { name: 1 } }).fetch();
  },
  /**
   * TODO:COmplete Js doc
   * Fettung details with code.
   */
  'tax.findOne': (taxCode) => {
    return Tax.findOne({ taxCode: taxCode });
  },
  'tax.dataSync': () => {
    let base_url = Config.findOne({
      name: 'base_url'
    }).value;
    let dbId = Config.findOne({
      name: 'dbId'
    }).value;
    let url = base_url + taxDataGet_Url;
    let dataArray = {
      dbId: dbId
    };
    let options = {
      data: dataArray,
      headers: {
        'content-type': 'application/json'
      }
    };
    HTTP.call("POST", url, options, (err, result) => {
      if (err) {
        return err;
      } else {
        let taxResult = result.data.data;
        for (let i = 0; i < taxResult.length; i++) {
          let TaxFind = Tax.find({
            taxCode: taxResult[i].TaxCode
          }).fetch();
          if (TaxFind.length === 0) {
            Tax.insert({
              taxCode: taxResult[i].TaxCode,
              name: taxResult[i].Name,
              rate: taxResult[i].Rate,
              category: taxResult[i].Category,
              createdAt: new Date(),
              uuid: Random.id()
            });
          } else {
            Tax.update(TaxFind[0]._id, {
              $set: {
                taxCode: taxResult[i].TaxCode,
                name: taxResult[i].Name,
                rate: taxResult[i].Rate,
                category: taxResult[i].Category,
                updatedAt: new Date()
              }
            });
          }
          console.log("**-**", i);

        }
      }
    });
  },
  /**
 * TODO:Complete JS doc
 * Fetching inward Tax List
*/
  'tax.taxListInward': () => {
    return Tax.find({ category: 'I' }, { sort: { name: 1 } }).fetch();
  },
  /**
    * TODO:Complete JS doc
    * Fetching OutWard List
  */
  'tax.taxListOutWard': () => {
    return Tax.find({ category: 'O' }, { sort: { name: 1 } }).fetch();
  },
  /**
* TODO: Complete JS doc
* 
*/
  'tax.create': (taxName, taxCode, taxRate, category) => {
    let createdByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      createdByName = user.profile.firstName;
    }
    let taxId = Tax.insert({
      taxCode: taxCode,
      name: taxName,
      rate: taxRate,
      category: category,
      disabled: "N",
      createdBy: Meteor.userId(),
      createdByName: createdByName,
      createdByWeb: true,
      uuid: Random.id(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("tax", taxId);
    return taxId;
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'tax.update': (id, taxName, taxCode, taxRate, category) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return Tax.update({ _id: id }, {
      $set:
      {
        taxCode: taxCode,
        name: taxName,
        rate: taxRate,
        category: category,
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  'tax.inactive': (id) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return Tax.update({ _id: id }, {
      $set:
      {
        disabled: "Y",
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  'tax.active': (id) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return Tax.update({ _id: id }, {
      $set:
      {
        disabled: "N",
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  'tax.tax_id': (id) => {
    return Tax.findOne({ _id: id });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'tax.createUpload': (taxArray) => {
    if (taxArray !== undefined && taxArray !== []) {
      let createdByName = '';
      let user = Meteor.users.findOne({ _id: Meteor.userId() });
      if (user !== undefined) {
        createdByName = user.profile.firstName;
      }
      for (let a = 0; a < taxArray.length; a++) {
        let taxDetails = Tax.find({ name: taxArray[a].name }).fetch();
        if (taxDetails.length === 0) {
          Tax.insert({
            taxCode: taxArray[a].taxCode,
            name: taxArray[a].name,
            rate: taxArray[a].rate,
            category: taxArray[a].category,
            disabled: "N",
            createdBy: Meteor.userId(),
            createdByName: createdByName,
            createdByWeb: true,
            uuid: Random.id(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        else {
          let updatedByName = '';
          let user = Meteor.users.findOne({ _id: Meteor.userId() });
          if (user !== undefined) {
            updatedByName = user.profile.firstName;
          }
          Tax.update({ name: taxArray[a].name, taxCode: taxArray[a].taxCode }, {
            $set: {
              taxCode: taxArray[a].taxCode,
              name: taxArray[a].name,
              rate: taxArray[a].rate,
              category: taxArray[a].category,
              updatedBy: Meteor.userId(),
              updatedName: updatedByName,
              updatedAt: new Date(),
            }
          });
        }
      }
    }
  },
});
