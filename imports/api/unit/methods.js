/**
 * @author Visakh
 */
import { Unit } from "./unit";
import { Item } from './../../api/item/item';
import { Config } from "../config/config";
// import {unitDataGet_Url} from '../../startup/client/sapUrls';

Meteor.methods({
  /**
   * TODO:Complete JS doc
   * @param itemCode
*/
  'unit.itemCode': (itemCode) => {
    if (itemCode) {
      let itemUgcode = Item.findOne({ itemCode: itemCode }).ugpCode;
      return Unit.find({ ugpCode: itemUgcode }).fetch();
    }
  },
  /**
   * TODO: Complete Js doc
   */
  'unit.unitEntryS': (itemCode, uomEntry) => {
    if (itemCode) {
      let itemUgcode = Item.findOne({ itemCode: itemCode }).ugpCode;
      return Unit.find({ ugpCode: itemUgcode, uomEntry }).fetch();
    }
  },

  /**
     * TODO:Complete JS doc
     * @param uomCode
     * @param ugpCode
  */
  'unit.uomCodeUgpCode': (uomCode, itemCode) => {
    let itemUgpCode = Item.findOne({ itemCode: itemCode }).ugpCode;
    return Unit.findOne({ uomCode: uomCode, ugpCode: itemUgpCode });
  },
  /**
  * TODO:Complete JS doc
  * @param uomCode
  */
  'unit.uomCode': (uomCode) => {
    return Unit.findOne({ uomCode: uomCode });
  },
  /**
   * TODO:Complete Js doc
   * To get data by uomEntry
   */
  'unit.uomEntry': (uomEntry, ugpCode) => {
    // console.log(uomEntry, ugpCode);
    return Unit.findOne({ uomCode: uomEntry, ugpCode: ugpCode });

  },
  'unit.uomEntryGet': (ugpCode, uomCode) => {
    return Unit.findOne({ ugpCode: ugpCode, uomCode: uomCode });
  },
  'unit.ugpCodeuomEntry': (uomEntry, ugpCode) => {
    return Unit.findOne({ uomEntry: uomEntry, ugpCode: ugpCode });

  },
  /**
   * TODO:COmplete Js doc
   * Getting unit detail with itemcode & ugpcode
   */
  'unit.itemUgp': (uomEntry, ugpCode) => {
    return Unit.find({ uomEntry: uomEntry, ugpCode: ugpCode }).fetch();

  },
  /**
 * TODO:Complete JS doc
 * Fetching Batch List using 
 * @param itemCode
*/
  'unit.unitList': () => {
    return Unit.find({}, { fields: { uomCode: 1, uomEntry: 1, ugpCode: 1 } }).fetch();
  },
  'unit.dataSync': () => {
    let base_url = Config.findOne({
      name: 'base_url'
    }).value;
    let dbId = Config.findOne({
      name: 'dbId'
    }).value;
    let url = base_url + unitDataGet_Url;
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
        let itemGrpResult = result.data.data;
        for (let i = 0; i < itemGrpResult.length; i++) {

          let ItCFind = Unit.find({
            ugpCode: itemGrpResult[i].UgpCode, uomCode: itemGrpResult[i].UomCode
          }).fetch();
          if (ItCFind.length === 0) {
            Unit.insert({

              ugpCode: itemGrpResult[i].UgpCode,
              uomCode: itemGrpResult[i].UomCode,
              baseQty: itemGrpResult[i].BaseQty,
              uomEntry: itemGrpResult[i].UomEntry,
              wghtFactor: itemGrpResult[i].WghtFactor,
              createdAt: new Date(),
              uuid: Random.id()
            });
          } else {
            Unit.update(ItCFind[0]._id, {
              $set: {
                ugpCode: itemGrpResult[i].UgpCode,
                uomCode: itemGrpResult[i].UomCode,
                baseQty: itemGrpResult[i].BaseQty,
                uomEntry: itemGrpResult[i].UomEntry,
                wghtFactor: itemGrpResult[i].WghtFactor,
                updatedAt: new Date()
              }
            });
          }
          console.log("++i", i);

        }
      }
    });
  },
  /**
* TODO: Complete JS doc
* 
*/
  'unit.create': (uomCode, baseQty, uomEntry, ugpCode,) => {
    let unitId = Unit.insert({
      ugpCode: ugpCode,
      uomCode: uomCode,
      baseQty: baseQty,
      uomEntry: uomEntry,
      disabled: "N",
      createdBy: Meteor.userId(),
      createdByWeb: true,
      uuid: Random.id(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return unitId;
  },

  /**
  * TODO: Complete JS doc
  * 
  */
  'unit.update': (id, uomCode, baseQty, uomEntry, ugpCode) => {
    return Unit.update({ _id: id }, {
      $set:
      {
        ugpCode: ugpCode,
        uomCode: uomCode,
        baseQty: baseQty,
        uomEntry: uomEntry,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  'unit.inactive': (id) => {
    return Unit.update({ _id: id }, {
      $set:
      {
        disabled: "Y",
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  'unit.active': (id) => {
    return Unit.update({ _id: id }, {
      $set:
      {
        disabled: "N",
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  'unit.unit_id': (id) => {
    return Unit.findOne({ _id: id });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'unit.createUpload': (unitArray) => {
    if (unitArray !== undefined && unitArray !== []) {
      for (let a = 0; a < unitArray.length; a++) {
        let unitDetails = Unit.find({
          ugpCode: unitArray[a].ugpCode,
          uomCode: unitArray[a].uomCode
        }).fetch();
        if (unitDetails.length === 0) {
          Unit.insert({
            ugpCode: unitArray[a].ugpCode,
            uomCode: unitArray[a].uomCode,
            baseQty: unitArray[a].baseQty,
            uomEntry: unitArray[a].uomEntry,
            disabled: "N",
            createdBy: Meteor.userId(),
            createdByWeb: true,
            uuid: Random.id(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        else {
          Unit.update({
            ugpCode: unitArray[a].ugpCode,
            uomCode: unitArray[a].uomCode
          }, {
            $set: {
              ugpCode: unitArray[a].ugpCode,
              uomCode: unitArray[a].uomCode,
              baseQty: unitArray[a].baseQty,
              uomEntry: unitArray[a].uomEntry,
              updatedBy: Meteor.userId(),
              updatedAt: new Date(),
            }
          });
        }
      }
    }
  },

  'unit.dataGet': (id) => {
    let unitRes = Unit.findOne({ _id: id });
    let itemName = '';
    let itemResult = Item.findOne({ ugpCode: unitRes.ugpCode });
    if (itemResult) {
      itemName = itemResult.itemNam;
    }
    return { unitRes: unitRes, itemName: itemName }
  },
});