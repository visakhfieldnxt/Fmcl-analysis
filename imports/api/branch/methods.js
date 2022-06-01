/**
 * @author Visakh
 */
import { Branch } from './branch';
import { Config } from '../config/config';
import { WareHouse } from '../wareHouse/wareHouse';
import { Customer } from '../customer/customer';
// import  {branchDataGet_Url} from'../../startup/client/sapUrls';


Meteor.methods({
  /**
 * TODO:Complete JS doc
 * Fetching Branch List
*/
  'branch.branchList': () => {
    return Branch.find({ disabled: 'N' }, { sort: { bPLName: 1 } }).fetch();
  },
  'branch.userBranchList': (branch) => {
    return Branch.find({ disabled: 'N', bPLId: { $in: branch } }, { sort: { bPLName: 1 } }).fetch();
  },
  'branch.listGet': (branch) => {
    let branchArray = [];
    let res = Branch.find({ disabled: 'N', bPLId: { $in: branch } },
      { sort: { bPLName: 1 } }, { fields: { bPLName: 1 } }).fetch();
    if (res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        branchArray.push(res[i].bPLName);
      }
    }
    return branchArray.toString();
  },
  /**
   * TODO:Complet Js doc
   * Fetching the branch name with branch id 
   */
  'branch.branchBPLId': (id) => {
    return Branch.findOne({ bPLId: id, disabled: 'N' }).bPLName;
  },
  'branch.branchUser': (b) => {
    let res = Branch.findOne({ bPLId: b, disabled: 'N' });
    if (res !== undefined && res !== '') {
      return res.bPLName;
    }
  },

  /**
  * TODO:Complet Js doc
  * Fetching the branch name with branch id 
  */
  'branch.idBranchName': (id) => {
    let res = Branch.findOne({ bPLId: id });
    if (res) {
      return res.bPLName;
    }
  },
  /**
* TODO:Complet Js doc
* Fetching the branch name with branch id 
*/
  'branch.managerBranchGet': (branch) => {
    return Branch.find({ bPLId: { $in: branch } }, { fields: { bPLId: 1, bPLName: 1 } }).fetch();

  },
  /**
 * TODO:Complet Js doc
 * Fetching the branch name with branch id 
 */
  'branch.findOneCust': (id) => {
    return Branch.findOne({ bPLId: id, disabled: 'N' }, { fields: { dflVendor: 1, dflCust: 1 } });
  },
  /**
   * TODO:Complet Js doc
   * Fetching the branch name with branch id 
   */
  'branch.findOne': (id) => {
    return Branch.findOne({ bPLId: id, disabled: 'N' });
  },
  'branch.defWare': (brnch) => {
    return Branch.findOne({ dflWhs: brnch, disabled: 'N' }).bPLName;
  },
  /**
 * TODO:Complete Js doc
 * Fetching the branch full list
 */
  'branch.branchNameGet': () => {
    return Branch.find({ disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1, address: 1 } }).fetch();
  },
  /**
   * TODO:Complete Js doc
   * Getting user branch
   */
  'branch.branchUserList': () => {
    if (Meteor.user() !== undefined && Meteor.user() !== null) {
      return Branch.find({ bPLId: { $in: Meteor.user().branch }, disabled: 'N' }, { sort: { bPLName: 1 } },
        { fields: { bPLName: 1, bPLId: 1, dflWhs: 1 } }).fetch();
    }

  },
  'branch.branchListArInv': (branch) => {
    return Branch.find({ bPLId: branch, disabled: 'N' }, { fields: { bPLName: 1, bPLId: 1, dflWhs: 1 } }).fetch();
  },
  'branch.branchDetail': (branch) => {
    return Branch.findOne({ bPLId: branch, disabled: 'N' });
  },
  'branch.dataSync': () => {
    let base_url = Config.findOne({
      name: 'base_url'
    }).value;
    let dbId = Config.findOne({
      name: 'dbId'
    }).value;
    let url = base_url + branchDataGet_Url;
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
        let branchResult = result.data.data;

        for (let i = 0; i < branchResult.length; i++) {

          let BFind = Branch.find({
            bPLId: branchResult[i].BPLId
          }).fetch();
          if (BFind.length === 0) {
            Branch.insert({
              bPLId: branchResult[i].BPLId,
              bPLName: branchResult[i].BPLName,
              dflWhs: branchResult[i].DflWhs,
              disabled: branchResult[i].Disabled,
              address: branchResult[i].Address,
              pmtClrAct: branchResult[i].PmtClrAct,
              acctName: branchResult[i].AcctName,
              dflCust: branchResult[i].DflCust,
              dflVendor: branchResult[i].DflVendor,
              streetNo: branchResult[i].StreetNo,
              u_cashAcct: branchResult[i].U_CashAcct,
              createdAt: new Date(),
              uuid: Random.id()
            });
          } else {
            Branch.update(BFind[0]._id, {
              $set: {
                bPLId: branchResult[i].BPLId,
                bPLName: branchResult[i].BPLName,
                dflWhs: branchResult[i].DflWhs,
                disabled: branchResult[i].Disabled,
                address: branchResult[i].Address,
                pmtClrAct: branchResult[i].PmtClrAct,
                acctName: branchResult[i].AcctName,
                dflCust: branchResult[i].DflCust,
                dflVendor: branchResult[i].DflVendor,
                streetNo: branchResult[i].StreetNo,
                u_cashAcct: branchResult[i].U_CashAcct,
                updatedAt: new Date()
              }
            });

          }
          console.log("/**i**/", i);
        }
      }
    });
  },
  'branch.branchDefaultCustomer': (branch) => {
    return Branch.findOne({ bPLId: branch, disabled: 'N' }).dflCust;
  },
  'branch.branchDetailsGet': (id) => {
    let branchRes = Branch.findOne({ _id: id });
    let whsName = '';
    let whsRes = WareHouse.findOne({ whsCode: branchRes.dflWhs });
    if (whsRes) {
      whsName = whsRes.whsName;
    }
    let dflCustName = '';
    let defCustRes = Customer.findOne({ cardCode: branchRes.dflCust });
    if (defCustRes) {
      dflCustName = defCustRes.cardName;
    }
    let dflVenderName = '';
    let dflVenderRes = Customer.findOne({ cardCode: branchRes.dflVendor });
    if (dflVenderRes) {
      dflVenderName = dflVenderRes.cardName;
    }
    return { branchRes: branchRes, whsName: whsName, dflCustName: dflCustName, dflVenderName: dflVenderName };
  },
  /**
* TODO: Complete JS doc
* 
* @param cardCode
* @param address
* @param street
* @param block
* @param city
* @param state
*/
  'branch.create': (branchName, branchCode, customerCode,
    supplierCode, wareHouse, address, street, paymentClearAct) => {

    let createdByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      createdByName = user.profile.firstName;
    }

    let branchId = Branch.insert({

      bPLId: branchCode,
      bPLName: branchName,
      dflWhs: wareHouse,
      disabled: "N",
      address: address,
      pmtClrAct: paymentClearAct,
      acctName: "",
      dflCust: customerCode,
      dflVendor: supplierCode,
      streetNo: street,
      createdBy: Meteor.userId(),
      createdByName: createdByName,
      createdByWeb: true,
      uuid: Random.id(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("branch", branchId);
    return branchId;
  },

  /**
   * TODO: Complete JS doc
   * 
   * @param cardCode
   * @param address
   * @param street
   * @param block
   * @param city
   * @param state
    */
  'branch.update': (id, branchName, branchCode, customerCode,
    supplierCode, wareHouse, address, street, paymentClearAct) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return Branch.update({ _id: id }, {
      $set:
      {
        bPLId: branchCode,
        bPLName: branchName,
        dflWhs: wareHouse,
        address: address,
        pmtClrAct: paymentClearAct,
        acctName: "",
        dflCust: customerCode,
        dflVendor: supplierCode,
        streetNo: street,
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  'branch.inactive': (id) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return Branch.update({ _id: id }, {
      $set:
      {
        disabled: "Y",
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  'branch.active': (id) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return Branch.update({ _id: id }, {
      $set:
      {
        disabled: "N",
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  /**
* TODO: Complete JS doc
* 
*/
  'branch.createUpload': (branchArray) => {
    if (branchArray !== undefined && branchArray !== []) {
      for (let a = 0; a < branchArray.length; a++) {
        let branchDetails = Branch.find({
          bPLId: branchArray[a].bPLId,
        }).fetch();
        if (branchDetails.length === 0) {
          Branch.insert({
            bPLId: branchArray[a].bPLId,
            bPLName: branchArray[a].bPLName,
            dflWhs: branchArray[a].dflWhs,
            address: branchArray[a].address,
            pmtClrAct: branchArray[a].pmtClrAct,
            dflCust: branchArray[a].dflCust,
            dflVendor: branchArray[a].dflVendor,
            streetNo: branchArray[a].streetNo,
            acctName: "",
            disabled: "N",
            createdBy: Meteor.userId(),
            createdByWeb: true,
            uuid: Random.id(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        else {

          Branch.update({
            bPLId: branchArray[a].bPLId,
            bPLName: branchArray[a].bPLName,
          }, {
            $set: {
              bPLId: branchArray[a].bPLId,
              bPLName: branchArray[a].bPLName,
              dflWhs: branchArray[a].dflWhs,
              address: branchArray[a].address,
              pmtClrAct: branchArray[a].pmtClrAct,
              dflCust: branchArray[a].dflCust,
              dflVendor: branchArray[a].dflVendor,
              streetNo: branchArray[a].streetNo,
              updatedBy: Meteor.userId(),
              updatedAt: new Date(),
            }
          });
        }
      }
    }
  },
  'branch.branch_id': (id) => {
    return Branch.findOne({ _id: id });
  },
});