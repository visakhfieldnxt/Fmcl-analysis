/**
 * @author Nithin
 */
import { Branch } from './branch';
import { Verticals } from '../verticals/verticals';
import { allUsers } from '../user/user';

Meteor.methods({

  /**
   * create branch
   * @param branchName
   * @param branchCode
   * @returns 
   */
  'branch.create': (branchName, branchCode, loginUserVerticals) => {
    let branchRes = Branch.insert({
      branchCode: branchCode,
      branchName: branchName,
      vertical: loginUserVerticals,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (branchRes) {
      return branchRes;
    }
  },
  /**
   * update branch
   * @param {*} id 
   * @param {*} branchName 
   * @param {*} branchCode 
   * @returns 
   */
  'branch.update': (id, branchName, branchCode, loginUserVerticals) => {
    return Branch.update({ _id: id }, {
      $set:
      {
        branchCode: branchCode,
        branchName: branchName,
        vertical: loginUserVerticals,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get branch details using id
   * @param {*} id 
   * @returns 
   */
  'branch.id': (id) => {
    return Branch.findOne({ _id: id }, { fields: { branchName: 1, branchCode: 1, active: 1 } });
  },
  'branch.findName': (id) => {
    return Branch.findOne({ _id: id }).branchName;
  },
  /**
   * fetching branch full details 
   * @returns 
   */
  'branch.branchList': () => {
    return Branch.find({}, { fields: { branchName: 1, branchCode: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  'branch.branchListVertical': (vertical) => {
    let verticalVar = [];
    verticalVar.push(vertical);
    console.log("vertical ", verticalVar);
    return Branch.find({ vertical: { $in: verticalVar } }, { fields: { branchName: 1, branchCode: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  /**
   * activate branch
   * @param {*} id  
   * @returns 
   */
  'branch.active': (id) => {
    return Branch.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate branch
 * @param {*} id  
 * @returns 
 */
  'branch.inactive': (id) => {
    return Branch.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * return active branch list
   */
  'branch.branchActiveList': () => {
    return Branch.find({ active: "Y" }, { fields: { branchCode: 1, branchName: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  /**
  * return active branch list
  */
  'branch.verticalListVar': (vertical) => {
    let varAry = [];
    varAry.push(vertical);
    return Branch.find({ active: "Y", vertical: { $in: varAry } }, { fields: { branchCode: 1, branchName: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  'branch.verticalList': (vertical) => {
    return Branch.find({ active: "Y", vertical: { $in: vertical } }, { fields: { branchCode: 1, branchName: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  'branch.verticalBranch': (vertical) => {
    return Branch.find({ active: "Y", vertical: vertical }, { fields: { branchCode: 1, branchName: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  'branch.verticalBranch1': () => {
    return Branch.find({ active: "Y" }, { fields: { branchCode: 1, branchName: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  /**
 * return active branch list
 */
  'branch.verticalFullList': (vertical) => {
    return Branch.find({ vertical: { $in: vertical } }, { fields: { branchCode: 1, branchName: 1 } }, { sort: { branchName: 1 } }).fetch();
  },
  /**
   * get branch name based on id
   * @param {*} id 
   */
  'branch.idBranchName': (id) => {
    let res = Branch.findOne({ _id: id }, { fields: { branchName: 1 } });
    if (res) {
      return res.branchName;
    }
  },
  'branch.withRegion': (region) => {
    let userRes = allUsers.find({ branch: region, userType: 'SD' }).fetch();
    let verticalArray = [];
    if (userRes) {
      for (let j = 0; j < userRes.length; j++) {
        let verticalsAry = userRes[j].vertical;
        for (let i = 0; i < verticalsAry.length; i++) {
          let verticalRes = Verticals.findOne({ _id: verticalsAry[i] });
          if (verticalRes) {
            verticalArray.push(verticalRes);
          }
        }
      }
    }
    return verticalArray;
  },
  'branch.withRegionVerical': (vertical) => {
    let vertArray = [];
    vertArray.push(vertical);
    let regionList = Branch.find({ vertical: { $in: vertArray } }).fetch();
    return regionList;

  },
  /**
   * 
   * @param {*} id 
   * @returns get sd region
   */
  'branch.sdRegionGet': (id) => {
    let sdDetials = allUsers.findOne({ _id: id }, { fields: { branch: 1 } });
    if (sdDetials) {
      let branchRes = Branch.findOne({ _id: sdDetials.branch }, { fields: { branchName: 1 } });
      if (branchRes) {
        return branchRes.branchName;
      }
    }
  },
});