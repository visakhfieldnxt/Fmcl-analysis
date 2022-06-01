/**
 * @author Nithin
 */
import { Verticals } from './verticals';
import { allUsers } from '../user/user'

Meteor.methods({

  /**
   * create verticals
   * @param verticalName
   * @param verticalCode
   * @returns 
   */
  'verticals.create': (verticalName, verticalCode) => {
    let verticalRes = Verticals.insert({
      verticalCode: verticalCode,
      verticalName: verticalName,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (verticalRes) {
      return verticalRes;
    }
  },
  /**
   * update branch
   * @param {*} id 
   * @param verticalName
   * @param verticalCode
   * @returns 
   */
  'verticals.update': (id, verticalName, verticalCode,) => {
    return Verticals.update({ _id: id }, {
      $set:
      {
        verticalCode: verticalCode,
        verticalName: verticalName,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get verticals details using id
   * @param {*} id 
   * @returns 
   */
  'verticals.id': (id) => {
    return Verticals.findOne({ _id: id }, { fields: { verticalName: 1, verticalCode: 1, active: 1 } });
  },
  'vertical.findName': (vertical) => {
    let verticlName = [];
    let verticalList = Verticals.find({ _id: { $in: vertical } }, { fields: { verticalName: 1 } }).fetch();
    if (verticalList.length > 0) {
      for (let i = 0; i < verticalList.length; i++) {
        verticlName.push(verticalList[i].verticalName)
      }
    }
    return verticlName.toString();
  },
  /**
   * fetching verticals full details 
   * @returns 
   */
  'verticals.verticalList': () => {
    return Verticals.find({}, { fields: { verticalName: 1, verticalCode: 1 } }, { sort: { verticalName: 1 } }).fetch();
  },
  'verticals.list': () => {
    return Verticals.find({}, { fields: { verticalName: 1, active: 1 } }).fetch();
  },
  /**
   * activate verticals
   * @param {*} id  
   * @returns 
   */
  'verticals.active': (id) => {
    return Verticals.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate verticals
 * @param {*} id  
 * @returns 
 */
  'verticals.inactive': (id) => {
    return Verticals.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
  * return active verticals list
  */
  'verticals.activeList': () => {
    return Verticals.find({ active: "Y" }, { fields: { verticalCode: 1, verticalName: 1 } }, { sort: { verticalCode: 1 } }).fetch();
  },
  /**
  * return active verticals list
  */
  'verticals.userWiseList': (vertical) => {
    return Verticals.find({ active: "Y", _id: { $in: vertical }, }, { fields: { verticalCode: 1, verticalName: 1 } }, { sort: { verticalCode: 1 } }).fetch();


  },
  /**
   * get vertical name based on id
   * @param {*} id 
   */
  'verticals.idName': (id) => {
    let res = Verticals.findOne({ _id: id }, { fields: { verticalName: 1 } });
    if (res) {
      return res.verticalName;
    }
  },

  /**
  * get vertical name based on id
  * @param {*} id 
  */
  'verticals.idValues': (verticalArray) => {
    let verticalNameArray = [];
    if (verticalArray.length > 0) {
      for (let i = 0; i < verticalArray.length; i++) {
        let res = Verticals.findOne({ _id: verticalArray[i] }, { fields: { verticalName: 1 } });
        if (res !== undefined) {
          verticalNameArray.push(res.verticalName);
        }
      }
    }
    return verticalNameArray.toString();
  },

  /**
   * get user wise vertical list
   */
  'vertical.userList': (id) => {
    let userRes = allUsers.findOne({ _id: id }, { fields: { vertical: 1 } });
    let verticalArray = [];
    if (userRes) {
      if (userRes.vertical !== undefined && userRes.vertical.length > 0) {
        for (let i = 0; i < userRes.vertical.length; i++) {
          let verticalRes = Verticals.findOne({ _id: userRes.vertical[i] }, { fields: { verticalName: 1 } });
          if (verticalRes) {
            verticalArray.push(verticalRes);
          }
        }
      }
    }
    return verticalArray;
  },

  /**
  * get user wise vertical list
  */
  'vertical.SduserList': (id) => {
    let userRes = allUsers.findOne({ _id: id }, { fields: { vertical: 1, subDistributor: 1 } });
    if (userRes) {
      let sdUser = allUsers.findOne({ _id: userRes.subDistributor });
      let verticalArray = [];
      if (sdUser) {
        if (sdUser.vertical !== undefined && sdUser.vertical.length > 0) {
          for (let i = 0; i < sdUser.vertical.length; i++) {
            let verticalRes = Verticals.findOne({ _id: sdUser.vertical[i] });
            if (verticalRes) {
              verticalArray.push(verticalRes);
            }
          }
        }
      }
      return verticalArray;
    }
  },
  'vertical.SduserList1': (id) => {
    let userRes = allUsers.findOne({ _id: id }, { fields: { vertical: 1, subDistributor: 1 } });
    if (userRes) {
      let sdUser = allUsers.findOne({ _id: userRes.subDistributor });
      let verticalArray = [];
      if (sdUser) {
        if (sdUser.vertical !== undefined && sdUser.vertical.length > 0) {
          for (let i = 0; i < sdUser.vertical.length; i++) {
            let verticalRes = Verticals.findOne({ _id: sdUser.vertical[i] });
            if (verticalRes) {
              verticalArray.push(verticalRes._id);
            }
          }
        }
      }
      return verticalArray;
    }
  },


  /**
  * get user wise vertical list
  */
  'vertical.sdLists': (id) => {
    let res = allUsers.find({ vertical: { $in: id }, userType: "SD", active: "Y" }, { fields: { profile: 1, } }).fetch();
    return res;
  },
  /**
   * For the Vertical name Listing
   * @param {*} id 
   * @returns 
   */
  'vertical.findName': (id) => {
    let veticaNameAry = [];
    let res = allUsers.findOne({ _id: id, userType: "SD", active: "Y" }, { fields: { vertical: 1 } });
    let verticalAry = Verticals.find({}, { fields: { verticalName: 1 } }).fetch();
    if (res) {
      let vdata = res.vertical;
      for (let i = 0; i < vdata.length; i++) {
        let name = verticalAry.find(x => x._id == vdata[i]).verticalName;
        veticaNameAry.push(name);
      }
      return veticaNameAry.join(',');
    }

  },
  'vertical.findName1': (id) => {
    let veticaNameAry = [];
    let res = allUsers.findOne({ _id: id, userType: "SD", active: "Y" }, { fields: { vertical: 1 } });
    let verticalAry = Verticals.find({}, { fields: { verticalName: 1 } }).fetch();
    if (res) {
      let vdata = res.vertical;
      for (let i = 0; i < vdata.length; i++) {
        let name = verticalAry.find(x => x._id == vdata[i]).verticalName;
        veticaNameAry.push(name);
      }
      return veticaNameAry.join(',');
    }

  }, 'vertical.bdmListVertical': (id) => {
    let userRes = allUsers.findOne({ _id: id }, { fields: { vertical: 1, subDistributor: 1 } });
    if (userRes) {
      let verticalArray = [];
      if (userRes.vertical !== undefined && userRes.vertical.length > 0) {
        for (let i = 0; i < userRes.vertical.length; i++) {
          let verticalRes = Verticals.findOne({ _id: userRes.vertical[i] });
          if (verticalRes) {
            verticalArray.push(verticalRes);
          }
        }
      }
      return verticalArray;
    }
  }, 'vertical.bdmListVertical1': (id) => {
    let userRes = allUsers.findOne({ _id: id }, { fields: { vertical: 1, subDistributor: 1 } });
    if (userRes) {
      return userRes.vertical;
    }
  },
  'vertical.bdmListVertical1': (id) => {
    let userRes = allUsers.findOne({ _id: id }, { fields: { vertical: 1, subDistributor: 1 } });
    if (userRes) {
      return userRes.vertical;
    }
  },
  'vertical.listofVertical': (id) => {
    let vertList = ''; let comma = ',';
    let userRes = allUsers.findOne({ _id: id }, { fields: { vertical: 1, subDistributor: 1 } });
    if (userRes) {
      let verticalList = Verticals.find({ _id: { $in: userRes.vertical } }).fetch();
      if (verticalList) {
        for (let r = 0; r < verticalList.length; r++) {
          if (r == vertList.length) {
            comma = '';
          }
          vertList += verticalList[r].verticalName + comma;
        }
      }

    }
    return vertList;
  },
  'vertical.listofVertical1': (vertical, id) => {
    let vertList = []; 
    if (vertical && vertical.length > 0) {
      let verticalList = Verticals.find({ _id: { $in: vertical } }, { fields: { verticalName: 1 } }).fetch();
      if (verticalList.length > 0) {
        for (let r = 0; r < verticalList.length; r++) {
          vertList.push(verticalList[r].verticalName);
        }
      }
    }
    else {
      let userRes = allUsers.findOne({ _id: id }, { fields: { subDistributor: 1 } });
      if (userRes) {
        let verticalRes = allUsers.findOne({ _id: userRes.subDistributor }, { fields: { vertical: 1 } });
        if (verticalRes) {
          if (verticalRes.vertical !== undefined && verticalRes.vertical.length > 0) {
            let verticalList = Verticals.find({ _id: { $in: verticalRes.vertical } }, { fields: { verticalName: 1 } }).fetch();
            if (verticalList.length > 0) {
              for (let r = 0; r < verticalList.length; r++) {
                vertList.push(verticalList[r].verticalName);
              }
            }
          }
        }
      }
    }
    return vertList.toString();
  },
  /**
 * For the Vertical name Listing
 * @param {*} id 
 * @returns 
 */
  'vertical.nameArrayList': (vertical) => {
    let veticaNameAry = [];
    if (vertical !== undefined && vertical.length > 0) {
      for (let i = 0; i < vertical.length; i++) {
        let verticalRes = Verticals.findOne({ _id: vertical[i] }, { fields: { verticalName: 1 } });
        if (verticalRes) {
          veticaNameAry.push(verticalRes.verticalName);
        }
      }
      return veticaNameAry.toString();
    }
  }
});