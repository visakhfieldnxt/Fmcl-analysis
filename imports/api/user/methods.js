/**
* @author Nithin
*/

import { allUsers } from './user';
import { Meteor } from 'meteor/meteor';
import { Branch } from '../branch/branch';
import { Location } from '../location/location';
// import { Customer } from '../customer/customer';
import { Verticals } from '../verticals/verticals';
import { roles } from "../role/role";
import { TempSerialNo } from "../tempSerialNo/tempSerialNo";
import { SdPriceType } from "../sdPriceType/sdPriceType";
import { PriceType } from '../priceType/priceType';
import { SdProducts } from "../sdProducts/sdProducts";
Meteor.methods({
  /**
  * TODO: Complete JS doc
  * @param firstname
  * @param lasname
  * @param username
  * @param password
  * @param email
  * @param dateOfBirth
  * @param gender
  * @param empCode
  * @param roleArray 
  * @param supervisor
  */
  'user.create': (firstName, lastName, email, contact, username, password, gender, dateOfBirth, empCode,
    contactPerson, roleArray, vertical) => {
    let verticalArray = [vertical];
    let userId = Accounts.createUser({
      profile: {
        empCode: empCode, firstName: firstName,
        lastName: lastName, gender: gender, dateOfBirth: dateOfBirth,
        image: ''
      },
      email: email,
      username: username,
      password: password,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
    });
    // return userId;
    if (userId) {
      let token = Accounts._generateStampedLoginToken().token;
      // Meteor.setTimeout(function () { Accounts.sendVerificationEmail(userId); }, 1000);
      // Set user's role    
      return Meteor.users.update(userId, {
        $set: {
          token: token,
          roles: roleArray,
          contactNo: contact,
          contactPerson: contactPerson,
          vertical: verticalArray,
          userType: "MainUser",
          active: "Y",
        }
      });
    };

  },
  /**
 * TODO: Complete JS doc
 * @param id
 * @param firstName
 * @param lastName
 * @param dateOfBirth
 * @param username
 * @param email
 * @param hiddenemail
 * @param password
 * @param gender
 * @param empCode
 * @param roleArray
 * @param designationName
 * @param supervisor
 */
  'user.updateUser': (id, firstName, lastName, dateOfBirth, username, contact,
    email, hiddenemail, password, gender, empCode, contactPerson, roleArray, vertical) => {
    let verticalArray = [vertical];

    Meteor.users.update({ _id: id }, {
      $set:
      {
        profile:
        {
          image: Meteor.users.findOne({ _id: id }).profile.image,
          empCode: empCode,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          dateOfBirth: dateOfBirth,
          isDeleted: false
        },
        username: username,
        contactNo: contact,
        contactPerson: contactPerson,
        roles: roleArray,
        vertical: verticalArray,
      }
    });
    let oldEmail = hiddenemail;
    Meteor.users.update({ _id: id, 'emails.0.address': oldEmail }, {
      $set:
        { 'emails.0.address': email }
    });
    // Update password
    if (password != '') {
      Accounts.setPassword(id, password);
    }
    return true
  },


  /**
   * TODO:Complete JS doc
   * Fetching User List - For Credit Invoice Creation
*/
  'user.userList': () => {
    return Meteor.users.find({ active: "Y" }, { sort: { 'profile.firstName': 1 } }).fetch();
  },
  'user.userListActiveInactive': () => {
    return Meteor.users.find({}, { sort: { 'profile.firstName': 1 } }).fetch();
  },
  'user.userlistDetails': (branchfiltersSec, locationFiltersSec, selectSDNameSec) => {
    let data = Meteor.users.find({ branch: branchfiltersSec, location: locationFiltersSec, _id: selectSDNameSec, userType: "SD" }, { sort: { 'profile.firstName': 1 } }).fetch();
    return data;
  },
  'user.userListConst': (vertical, sd) => {
    if (sd) {
      return Meteor.users.find({ _id: sd, userType: "SD", active: "Y", vertical: { $in: vertical } }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    } else {
      return Meteor.users.find({ userType: "SD", active: "Y", vertical: { $in: vertical } }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    }

  },
  'user.filterDatas': (vertical, sd) => {
    if (sd) {
      return Meteor.users.find({ _id: sd, userType: "SD", active: "Y", vertical: vertical }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    } else {
      return Meteor.users.find({ userType: "SD", active: "Y", vertical: vertical }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    }

  },
  'user.userListConst1': (vertical) => {
    // console.log("vertical",vertical);
    // if(vertical!="null"){
    //   console.log('7');
    let vArray = [];
    vArray.push(vertical);
    return Meteor.users.find({ userType: "SD", active: "Y", vertical: { $in: vArray } }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    // }else{
    //   console.log('8');
    // return Meteor.users.find({ userType: "SD",active:"Y" }, { fields: { profile: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();   
    // }
  },
  'user.userLis': (vertical) => {
    return Meteor.users.find({ vertical: { $in: vertical } }, { fields: { profile: 1, userType: 1, active: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
  },
  'user.userVerticals': (vertical) => {
    // return Verticals.find({ _id: {$in:vertical} }, { fields: {verticalName: 1 } }).fetch();
    return Verticals.find({}, { fields: { verticalName: 1 } }).fetch();
  },

  /**
 * TODO:Complete JS doc
 * Fetching User List - For vansale
*/
  'user.vansaleUserList': () => {
    return Meteor.users.find({}, { fields: { profile: 1 } }).fetch();
  },
  /**
     * TODO:Complete JS doc
     * Fetching User Name - For Order Creation
  */
  'user.firstName': () => {
    return Meteor.users.findOne({ _id: Meteor.userId() }).profile.firstName;
  },
  /**
   * TODO:Complete JS doc
   * Fetching User Name - For Order Creation
*/
  'user.idName': (id) => {
    let res = Meteor.users.findOne({ _id: id });
    if (res) {
      return `${res.profile.firstName} ${res.profile.lastName}`;
    }
  }, 'user.idName1': (id) => {
    let res = Meteor.users.findOne({ _id: id });
    if (res) {
      return `${res.profile.firstName} ${res.profile.lastName}`;
    }
  },

  'user.subDList': (vertical) => {
    if (vertical !== undefined && vertical.length > 0) {
      return Meteor.users.find({ vertical: { $in: vertical }, userType: "SD", active: "Y" }, { fields: { profile: 1, userType: 1, active: 1 } }, { sort: { 'profile.firstName': 1 } }).fetch();
    }
  },
  /**
 * TODO:Complete Js doc
 * Fetching the customer full list
 */
  'user.userNameGet': () => {
    return Meteor.users.find({}, { sort: { 'profile.firstName': 1 } }, { fields: { 'profile.firstName': 1, _id: 1, 'emails.address': 1, contactNo: 1 } }).fetch();
  },

  'user.userNameGet1': (vertical) => {
    return Meteor.users.find({ userType: 'SD', active: 'Y', vertical: { $in: vertical } }, { fields: { profile: 1, userType: 1, active: 1 } }).fetch();
  },
  'user.userNameGetNew': (vertical) => {
    return Meteor.users.find({ userType: 'SD', vertical: { $in: vertical }, active: "Y" }, { fields: { profile: 1 } }).fetch();
  },
  'user.userNameGetNew1': (id) => {
    return Meteor.users.find({ userType: 'SD', _id: id }, { fields: { profile: 1 } }).fetch();
  },
  'user.userNameGetAdmin': () => {
    return Meteor.users.find({ userType: { $ne: "C" } }, { sort: { 'profile.firstName': 1 } }, { fields: { 'profile.firstName': 1, _id: 1, 'emails.address': 1, contactNo: 1 } }).fetch();
  },

  'user.vansaleList': () => {
    return Meteor.users.find({ 'profile.isDeleted': false, userType: "V" }, { fields: { profile: 1 } }).fetch();
  },

  'user.userlistMarket': (sd, vertical) => {
    if (sd) {
      return Meteor.users.find({ userType: 'SD', active: 'Y', _id: sd }, { fields: { profile: 1, userType: 1, active: 1 } }).fetch();
    }
    else {
      return Meteor.users.find({ userType: 'SD', vertical: { $in: vertical }, active: 'Y', }, { fields: { profile: 1, userType: 1, active: 1 } }).fetch();
    }

  },
/**
 * 
 * @param {*} sduser 
 * @param {*} vertical 
 * @returns 
 */
  'user.userlistEx': (sduser, vertical) => {
    if (sduser) {
      return Meteor.users.find({ userType: 'SDUser', active: 'Y', _id: sduser }, { fields: { profile: 1, userType: 1, active: 1 } }).fetch();
    }
    else {
      return Meteor.users.find({ userType: 'SDUser', active: 'Y', vertical: { $in: vertical }, }, { fields: { profile: 1, userType: 1, active: 1 } }).fetch();

    }
  },

  'user.userSdList': (sd) => {
    return Meteor.users.find({ userType: 'SDUser', active: 'Y', subDistributor: sd }, { fields: { profile: 1, userType: 1, active: 1 } }).fetch();
  },
  /**
   * 
    * TODO:Complete JS doc
    * Fetching User Name - For Order Creation
    * 
 */
  'user.id': (id) => {
    return Meteor.users.findOne({ _id: Meteor.userId() }).profile.firstName;
  },

  'user.idAuthorizedBy': (id) => {
    return Meteor.users.findOne({ _id: id }, { fields: { profile: 1, emails: 1, contactNo: 1 } })
  },

  'user.user_id': (_id) => {
    return Meteor.users.findOne({ _id: _id });
  },
  'user.userCount': (_id) => {
    return Meteor.users.find({ roles: _id, active: "Y" }).count();
  },
  'user.userDetailss': (id) => {
    return Meteor.users.findOne({ _id: id });
  },

  'user.idGet': (id) => {
    return Meteor.users.findOne({ _id: id });
  },
  /**
   * 
   * @param {*} id 
   * @returns 
   * deactivate main users
   */
  'user.inactive': (id) => {
    return Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "N",
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * 
   * @param {} id 
   * @returns
   * activate main users 
   */
  'user.active': (id) => {
    return Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "Y",
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
   * 
   * @param {} id 
   * @returns
   * approve sd users
   */
  'user.approved': (id, remarks) => {
    return Meteor.users.update({ _id: id }, {
      $set:
      {
        approvalStatus: 'Approved',
        approvalRemark: remarks,
        approvedBy: Meteor.userId(),
        approvedDate: new Date(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * 
 * @param {} id 
 * @returns
 * reject sd user
 */
  'user.rejected': (id, remarks) => {
    return Meteor.users.update({ _id: id }, {
      $set:
      {
        approvalStatus: 'Rejected',
        approvalRemark: remarks,
        rejectedBy: Meteor.userId(),
        rejectedDate: new Date(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * 
   * @returns deactivate SDs
   */
  'user.sdInactive': (id) => {
    Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "N",
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
    let subUserList = allUsers.find({ subDistributor: id }).fetch();
    if (subUserList.length > 0) {
      for (let i = 0; i < subUserList.length; i++) {
        Meteor.users.update({ _id: subUserList[i]._id }, {
          $set:
          {
            active: "N",
            adminDeactivate: true,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }
    }
  },
  /**
 * 
 * @returns deactivate SDs
 */
  'user.sdActivate': (id) => {
    Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "Y",
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
    // active subuser list
    let subUserList = allUsers.find({ subDistributor: id, sdDeactivated: false, }).fetch();
    if (subUserList.length > 0) {
      for (let i = 0; i < subUserList.length; i++) {
        Meteor.users.update({ _id: subUserList[i]._id }, {
          $set:
          {
            active: "Y",
            adminDeactivate: false,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }
    }
    // inactive Sub users list
    let subUserInactiveList = allUsers.find({ subDistributor: id, sdDeactivated: true, }).fetch();
    if (subUserInactiveList.length > 0) {
      for (let i = 0; i < subUserInactiveList.length; i++) {
        Meteor.users.update({ _id: subUserInactiveList[i]._id }, {
          $set:
          {
            active: "N",
            adminDeactivate: false,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }
    }
  },
  /**
 * 
 * @param {*} id 
 * @returns 
 * deactivate sub sd users
 */
  'user.subUserInactive': (id) => {
    return Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "N",
        sdDeactivated: true,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
* 
* @param {*} id 
* @returns 
* activate sub sd users
*/
  'user.subUserActivate': (id) => {
    return Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "Y",
        sdDeactivated: false,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
* TODO:Complete Js doc
* Fetching the customer full list
*/
  'user.vansaleGet': () => {
    return Meteor.users.find({ userType: "SDUser" }, { sort: { 'profile.firstName': 1 } }, { fields: { profile: 1 } }).fetch();
  },

  /**
* TODO:Complete Js doc
* Fetching the customer full list
*/
  'user.vansaleGetAttendance': (id) => {
    return Meteor.users.find({ userType: "SDUser", subDistributor: id, active: 'Y' }, { sort: { 'profile.firstName': 1 } }, { fields: { profile: 1 } }).fetch();
  },
  /**
* TODO: Complete JS doc
* 
*/
  // 'user.createUpload': (userArray) => {
  //   if (userArray !== undefined && userArray !== []) {

  //     for (let a = 0; a < userArray.length; a++) {
  //       let defaultBranchName = '';
  //       let branchs = Branch.findOne({ bPLId: userArray[a].defaultBranch });
  //       if (branchs !== undefined) {
  //         defaultBranchName = branchs.bPLName;
  //       }
  //       let wareHouseCodes = userArray[a].defaultWareHouse;
  //       let defaultWhsName = '';
  //       let warehouses = WareHouse.findOne({ whsCode: userArray[a].defaultWareHouse });
  //       if (warehouses !== undefined) {
  //         defaultWhsName = warehouses.whsName;
  //       }
  //       else {
  //         let whsRes = WareHouse.findOne({ bPLId: userArray[a].defaultBranch });
  //         if (whsRes) {
  //           wareHouseCodes = whsRes.whsCode;
  //           defaultWhsName = whsRes.whsName;
  //         }
  //       }

  //       let customerName = '';
  //       let custRes = Customer.findOne({ cardCode: userArray[a].customer });
  //       if (custRes !== undefined) {
  //         customerName = custRes.cardName;
  //       }


  //       let street = '';
  //       let city = '';
  //       let block = '';
  //       let addressRes = CustomerAddress.findOne({ address: userArray[a].address, addressType: "S" });
  //       if (addressRes !== undefined) {
  //         street = addressRes.street;
  //         city = addressRes.city;;
  //         block = addressRes.block;;
  //       }
  //       let userDetails = allUsers.find({
  //         username: userArray[a].username,
  //       }).fetch();

  //       if (userDetails.length === 0) {
  //         let userId = Accounts.createUser({
  //           profile: {
  //             empCode: userArray[a].empCode,
  //             firstName: userArray[a].firstName,
  //             lastName: userArray[a].lastName,
  //             gender: userArray[a].gender,
  //             dateOfBirth: userArray[a].dateOfBirth,
  //             isDeleted: false,
  //             image: '',
  //             userType: "V"
  //           },
  //           email: userArray[a].email,
  //           username: userArray[a].username,
  //           password: userArray[a].password,
  //           createdAt: new Date(),
  //         });
  //         if (userId) {
  //           let token = Accounts._generateStampedLoginToken().token;
  //           allUsers.update(userId, {
  //             $set: {
  //               token: token,
  //               roles: userArray[a].roles,
  //               userType: "V",
  //               supervisor: userArray[a].supervisor,
  //               contactNo: userArray[a].contactNo,
  //               branch: userArray[a].branch,
  //               defaultBranch: userArray[a].defaultBranch,
  //               defaultBranchName: defaultBranchName,
  //               wareHouse: [],
  //               defaultWareHouse: wareHouseCodes,
  //               defaultWareHouseName: defaultWhsName,
  //               active: "Y",
  //               slpCode: userArray[a].slpCode,
  //               cardName: customerName,
  //               cardCode: userArray[a].customer,
  //               address: userArray[a].address,
  //               street: street,
  //               city: city,
  //               block: block,
  //               vansaleFullName: userArray[a].vansaleFullName,
  //               transporterName: userArray[a].transporterName,
  //               vehicleNumber: userArray[a].vehicleNumber,
  //               lorryBoy: userArray[a].lorryBoy,
  //               driverName: userArray[a].driverName,
  //               driverNumber: userArray[a].driverNumber,
  //               excelUpload: true
  //             }
  //           });
  //         };
  //       }
  //       else {
  //         allUsers.update({ username: userArray[a].username }, {
  //           $set:
  //           {
  //             profile:
  //             {
  //               image: allUsers.findOne({ username: userArray[a].username }).profile.image,
  //               empCode: userArray[a].empCode,
  //               firstName: userArray[a].firstName,
  //               lastName: userArray[a].lastName,
  //               gender: userArray[a].gender,
  //               dateOfBirth: userArray[a].dateOfBirth,
  //               isDeleted: false
  //             },
  //             username: userArray[a].username,
  //             'emails.0.address': userArray[a].email,
  //             contactNo: userArray[a].contactNo,
  //             roles: userArray[a].roles,
  //             supervisor: userArray[a].supervisor,
  //             branch: userArray[a].branch,
  //             defaultBranch: userArray[a].defaultBranch,
  //             defaultBranchName: defaultBranchName,
  //             wareHouse: [],
  //             defaultWareHouse: wareHouseCodes,
  //             defaultWareHouseName: defaultWhsName,
  //             slpCode: userArray[a].slpCode,
  //             cardName: customerName,
  //             cardCode: userArray[a].customer,
  //             address: userArray[a].address,
  //             street: street,
  //             city: city,
  //             block: block,
  //             vansaleFullName: userArray[a].vansaleFullName,
  //             transporterName: userArray[a].transporterName,
  //             vehicleNumber: userArray[a].vehicleNumber,
  //             lorryBoy: userArray[a].lorryBoy,
  //             driverName: userArray[a].driverName,
  //             driverNumber: userArray[a].driverNumber
  //           }
  //         });
  //       }
  //     }
  //   }
  // },
  /**
   * 
   * @param {*} id 
   * @returns user data based on id
   */
  'user.dataGets': (id) => {
    let userRes = Meteor.users.findOne({ _id: id });
    let verticalName = '';
    let roleName = '';
    if (userRes) {
      let verticalRes = Verticals.findOne({ _id: userRes.vertical[0] });
      if (verticalRes) {
        verticalName = verticalRes.verticalName;
      }
      let roleRes = Meteor.roles.findOne({ _id: userRes.roles[0] });
      if (roleRes) {
        roleName = roleRes.name;
      }

      return { verticalName: verticalName, roleName: roleName, userRes: userRes }
    }
  },
  /**
    * 
    * @param {*} id 
    * @returns user data based on id
    */
  'user.sdUserData': (id) => {
    let userRes = Meteor.users.findOne({ _id: id });
    let verticalName = [];
    let roleName = '';
    let branchName = '';
    let locationName = '';
    let sdName = '';
    let approvedByName = '';
    let rejectedByName = '';
    if (userRes) {
      let sdUserData = Meteor.users.findOne({ _id: userRes.subDistributor });
      if (sdUserData) {
        sdName = sdUserData.profile.firstName;
        if (sdUserData.vertical.length > 0) {
          for (let k = 0; k < sdUserData.vertical.length; k++) {
            let verticalRes = Verticals.findOne({ _id: sdUserData.vertical[k] });
            if (verticalRes) {
              verticalName.push(verticalRes.verticalName);
            }
          }
        }
        let roleRes = Meteor.roles.findOne({ _id: userRes.roles[0] });
        if (roleRes) {
          roleName = roleRes.name;
        }

        let branchRes = Branch.findOne({ _id: sdUserData.branch });
        if (branchRes) {
          branchName = branchRes.branchName;
        }
        let locRes = Location.findOne({ _id: sdUserData.location });
        if (locRes) {
          locationName = locRes.locationName;
        }
      }
      if (userRes.approvalStatus === "Approved") {
        let userVal = Meteor.users.findOne({ _id: userRes.approvedBy });
        if (userVal !== undefined) {
          approvedByName = `${userVal.profile.firstName} ${userVal.profile.lastName}`
        }
      }
      if (userRes.approvalStatus === "Rejected") {
        let userVal = Meteor.users.findOne({ _id: userRes.approvedBy });
        if (userVal !== undefined) {
          rejectedByName = `${userVal.profile.firstName} ${userVal.profile.lastName}`
        }
      }
      return {
        verticalName: verticalName.toString(), roleName: roleName, userRes: userRes,
        branchName: branchName, locationName: locationName, sdName: sdName, approvedByName: approvedByName,
        rejectedByName: rejectedByName,
      }
    }
  },
  /**
* TODO:Complete JS doc
* get user name based on id
*/
  'user.idSearch': (name, branch, location) => {
    return allUsers.find(
      {
        "profile.firstName": {
          $regex: new RegExp(name.trim(), "i")
        }, userType: "SD",
        branch: branch,
        location: location,
      }, { limit: 100 }, { fields: { profile: 1, address: 1, contactNo: 1, contactPerson: 1, vertical: 1, username: 1 } }).fetch();
  },
  /**
 * TODO: Complete JS doc
 * @param firstname
 * @param lasname
 * @param username
 * @param password
 * @param email
 * @param dateOfBirth
 * @param gender
 * @param empCode
 * @param roleArray 
 * @param supervisor
 */
  'user.sdCreate': (firstName, email, contact, username, password, gender, dateOfBirth,
    vertical, branch, location, contactPerson, address, priceType, superAdminValue) => {
    let verticalArrays = [];
    /**
     * check sd is present or not
     */
    let userResult = allUsers.find(
      {
        "profile.firstName": {
          $regex: new RegExp(firstName.trim(), "i")
        }, userType: "SD",
        branch: branch,
        location: location,
      }).fetch();
    /**
     * if vertical array is empty : Sd created by BDM/MIC/BH 
     * otherwise Super admin
     */
    if (vertical.length === 0) {
      if (userResult.length > 0) {
        verticalArrays = userResult[0].vertical;
      }
      // get users(BDM/MIC/BH) data 
      let loginUserData = Meteor.users.findOne({ _id: Meteor.userId() });
      if (loginUserData) {
        let verticalPresent = verticalArrays.includes(loginUserData.vertical[0]);
        // check vertical is present in the array or not
        if (verticalPresent === false) {
          verticalArrays.push(loginUserData.vertical[0]);
        }
      }
    }
    else {
      for (let k = 0; k < vertical.length; k++) {
        verticalArrays.push(vertical[k].vertical)
      }
    }
    /**
* if not present insert new value
*/
    if (userResult.length === 0) {
      let branchName = '';
      let branchRes = Branch.findOne({ _id: branch }, { fields: { branchName: 1 } });
      if (branchRes) {
        branchName = branchRes.branchName;
      }
      let temporaryId = '';
      // generate route code
      let tempVal = TempSerialNo.findOne({
        branch: branch,
        sdUser: true,
      }, { sort: { $natural: -1 } });
      if (!tempVal) {
        temporaryId = "SD/" + branchName.slice(0, 5).toUpperCase() + "/1";
      } else {
        temporaryId = "SD/" + branchName.slice(0, 5).toUpperCase() + "/" + parseInt(tempVal.serial + 1);
      }
      if (!tempVal) {
        TempSerialNo.insert({
          serial: 1,
          branch: branch,
          sdUser: true,
          uuid: Random.id(),
          createdAt: new Date()
        });
      } else {
        TempSerialNo.update({ _id: tempVal._id }, {
          $set: {
            serial: parseInt(tempVal.serial + 1),
            updatedAt: new Date()
          }
        });
      }
      let userId = Accounts.createUser({
        profile: {
          empCode: temporaryId, firstName: firstName,
          lastName: '', gender: gender, dateOfBirth: dateOfBirth,
          image: '', isDeleted: false
        },
        email: email,
        username: username,
        password: password,
        createdAt: new Date(),
        // slpCode:empCode
      });
      // return userId;
      if (userId) {
        let token = Accounts._generateStampedLoginToken().token;
        // Meteor.setTimeout(function () { Accounts.sendVerificationEmail(userId); }, 1000);
        // Set user's role    
        let permissionsData = 'sdView';
        let roleArray = [];
        let roleData = roles.find({ isDeleted: false }).fetch();
        if (roleData.length > 0) {
          for (let i = 0; i < roleData.length; i++) {
            let sdViews = roleData[i].permissions.includes(permissionsData);
            if (sdViews === true) {
              roleArray.push(roleData[i]._id)
            }
          }
        }
        Meteor.users.update(userId, {
          $set: {
            token: token,
            roles: roleArray,
            contactNo: contact,
            vertical: verticalArrays,
            branch: branch,
            location: location,
            contactPerson: contactPerson,
            address: address,
            userType: "SD",
            active: "Y",
            createdBy: Meteor.userId(),
          }
        });
      };
      if (superAdminValue === false) {
        PriceTypeMappingFun(userId, priceType);
      }
      else {
        PriceTypeMappingSuperAdminFun(userId, vertical);
      }
    }
    /**
* if  present update values
*/
    else {
      if (superAdminValue === false) {
        // console.log("hhhhh");
        PriceTypeMappingFun(userResult[0]._id, priceType);
      }
      else {
        // console.log("nnn");
        PriceTypeMappingSuperAdminFun(userResult[0]._id, vertical);
      }
      return Meteor.users.update({ _id: userResult[0]._id }, {
        $set:
        {
          vertical: verticalArrays,
        }
      });
    }
  },
  /**
   * 
   * @param {*} id 
   * @returns 
   * get SD data for view modal
   */
  'user.sdDataGets': (id) => {
    let userRes = Meteor.users.findOne({ _id: id });
    let verticalName = [];
    let branchName = '';
    let locationName = '';
    if (userRes) {
      if (userRes.vertical.length > 0) {
        for (let k = 0; k < userRes.vertical.length; k++) {
          let verticalRes = Verticals.findOne({ _id: userRes.vertical[k] });
          if (verticalRes) {
            verticalName.push(verticalRes.verticalName);
          }
        }
      }
      let branchRes = Branch.findOne({ _id: userRes.branch });
      if (branchRes) {
        branchName = branchRes.branchName;
      }
      let locRes = Location.findOne({ _id: userRes.location });
      if (locRes) {
        locationName = locRes.locationName;
      }

      return { verticalName: verticalName.toString(), userRes: userRes, branchName: branchName, locationName: locationName }
    }
  },


  /**
  * 
  * @param {*} id 
  * @returns 
  * get SD data for view modal
  */
  'user.sdUserList': (id) => {
    let userRes = Meteor.users.findOne({ _id: id });
    let verticalName = [];
    let branchName = '';
    let locationName = '';
    if (userRes) {
      if (userRes.vertical.length > 0) {
        for (let k = 0; k < userRes.vertical.length; k++) {
          let verticalRes = Verticals.findOne({ _id: userRes.vertical[k] });
          if (verticalRes) {
            verticalName.push(verticalRes.verticalName);
          }
        }
      }
      let branchRes = Branch.findOne({ _id: userRes.branch });
      if (branchRes) {
        branchName = branchRes.branchName;
      }
      let locRes = Location.findOne({ _id: userRes.location });
      if (locRes) {
        locationName = locRes.locationName;
      }
      let priceTypeData = SdPriceType.find({ active: 'Y', subDistributor: id }).fetch();
      let productData = SdProducts.find({ active: 'Y', subDistributor: id }).fetch();

      return {
        verticalName: verticalName.toString(), userRes: userRes,
        branchName: branchName, locationName: locationName,
        priceTypeData: priceTypeData, productData: productData
      }
    }
  },
  /**
   * update sub Distributor
* TODO: Complete JS doc
* @param id 
* @param username
* @param email
* @param hiddenemail
* @param password 
* @param supervisor
*/
  'user.updateSD': (id, username, contact,
    email, hiddenemail, password, contactPerson, vertical, address, priceType, superAdminValue, productArray) => {
    // else condition  
    let verticalArrays = [];
    let permissionsData = 'sdView';
    let roleArray = [];
    let roleData = roles.find({ isDeleted: false }).fetch();
    if (roleData.length > 0) {
      for (let i = 0; i < roleData.length; i++) {
        let sdViews = roleData[i].permissions.includes(permissionsData);
        if (sdViews === true) {
          roleArray.push(roleData[i]._id)
        }
      }
    }
    if (superAdminValue === false) {
      Meteor.users.update({ _id: id }, {
        $set:
        {
          username: username,
          contactNo: contact,
          roles: roleArray,
          contactPerson: contactPerson,
          address: address,
        }
      });
      let oldEmail = hiddenemail;
      Meteor.users.update({ _id: id, 'emails.0.address': oldEmail }, {
        $set:
          { 'emails.0.address': email }
      });
      // Update password
      if (password != '') {
        Accounts.setPassword(id, password);
      }

      PriceTypeMappingFun(id, priceType);
    }
    else {
      PriceTypeMappingSuperAdminFun(id, vertical);
      for (let k = 0; k < vertical.length; k++) {
        verticalArrays.push(vertical[k].vertical)
      }
      Meteor.users.update({ _id: id }, {
        $set:
        {
          username: username,
          contactNo: contact,
          roles: roleArray,
          contactPerson: contactPerson,
          vertical: verticalArrays,
          address: address,
        }
      });
      let oldEmail = hiddenemail;
      Meteor.users.update({ _id: id, 'emails.0.address': oldEmail }, {
        $set:
          { 'emails.0.address': email }
      });
      // Update password
      if (password != '') {
        Accounts.setPassword(id, password);
      }
    }
    productMappingFun(productArray, id);
  },
  /**
  * TODO: Complete JS doc
  * @param firstname
  * @param lasname
  * @param username
  * @param password
  * @param email
  * @param dateOfBirth
  * @param gender
  * @param empCode
  * @param roleArray  
  */
  'user.sdUserCreate': (firstName, lastName, email, contact, username, password, gender, dateOfBirth, empCode,
    contactPerson, roleArray, employeeId) => {
    let userId = Accounts.createUser({
      profile: {
        empCode: empCode, firstName: firstName,
        lastName: lastName, gender: gender, dateOfBirth: dateOfBirth,
        image: ''
      },
      email: email,
      username: username,
      password: password,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
    });
    // return userId;
    if (userId) {
      let token = Accounts._generateStampedLoginToken().token;
      // Meteor.setTimeout(function () { Accounts.sendVerificationEmail(userId); }, 1000);
      // Set user's role    
      return Meteor.users.update(userId, {
        $set: {
          token: token,
          roles: roleArray,
          contactNo: contact,
          contactPerson: contactPerson,
          subDistributor: employeeId,
          adminDeactivate: false,
          sdDeactivated: false,
          approvalStatus: "Approved",
          userType: "SDUser",
          active: "Y",
        }
      });
    };

  },
  /**
 * TODO: Complete JS doc
 * @param id
 * @param firstName
 * @param lastName
 * @param dateOfBirth
 * @param username
 * @param email
 * @param hiddenemail
 * @param password
 * @param gender
 * @param empCode
 * @param roleArray
 * @param designationName
 * @param supervisor
 */
  'user.updateSDUser': (id, firstName, lastName, dateOfBirth, username, contact,
    email, hiddenemail, password, gender, empCode, contactPerson, roleArray) => {
    Meteor.users.update({ _id: id }, {
      $set:
      {
        profile:
        {
          image: Meteor.users.findOne({ _id: id }).profile.image,
          empCode: empCode,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          dateOfBirth: dateOfBirth,
          isDeleted: false
        },
        username: username,
        contactNo: contact,
        contactPerson: contactPerson,
        roles: roleArray,
      }
    });
    let oldEmail = hiddenemail;
    Meteor.users.update({ _id: id, 'emails.0.address': oldEmail }, {
      $set:
        { 'emails.0.address': email }
    });
    // Update password
    if (password != '') {
      Accounts.setPassword(id, password);
    }
    return true
  },
  /**
   * 
   * @param {*} vertical 
   * @returns vertical wise sd list
   */
  'user.sdListGet': (vertical) => {
    if (vertical) {
      return Meteor.users.find({ active: "Y", userType: "SD", vertical: { $in: vertical } }, { fields: { profile: 1 } }).fetch();
    }
  },
  'user.sdUserFullList': () => {
    return Meteor.users.find({ active: "Y", userType: "SD", }, { fields: { profile: 1 } }).fetch();
  },
  'user.sdUsersingleList': (id) => {
    return Meteor.users.find({ active: "Y", userType: "SD", _id: id }, { fields: { profile: 1 } }).fetch();
  },
  /**
   * get vertical name based on sd
   *  */
  'user.idVerticalName': (user) => {
    let userRes = Meteor.users.findOne({ _id: user });
    let verticalNameArray = [];
    if (userRes) {
      if (userRes.vertical.length > 0) {
        for (let i = 0; i < userRes.vertical.length; i++) {
          let verticalRes = Verticals.findOne({ _id: userRes.vertical[i] });
          if (verticalRes) {
            verticalNameArray.push(verticalRes.verticalName);
          }
        }
      }
    }
    return verticalNameArray.toString();
  },
  /**
   * 
   * @param {*} _id 
   * @returns 
   * get data for sd user edits
   */
  'user.sdEdit': (_id) => {
    let userRes = Meteor.users.findOne({ _id: _id });
    let priceType = '';
    let loginUserData = Meteor.users.findOne({ _id: Meteor.userId() });
    if (userRes) {
      let priceTypeRes = SdPriceType.findOne({ subDistributor: _id, vertical: loginUserData.vertical[0] });
      if (priceTypeRes) {
        priceType = priceTypeRes.priceType;
      }
    }
    let priceRes = SdPriceType.find({ subDistributor: _id, active: "Y" }).fetch();
    let priceResultArray = [];
    if (priceRes.length > 0) {
      for (let i = 0; i < priceRes.length; i++) {
        let verticalObj =
        {
          randomId: priceRes[i]._id,
          vertical: priceRes[i].vertical,
          priceType: priceRes[i].priceType,
        }
        priceResultArray.push(verticalObj);
      }
    }
    let productData = SdProducts.find({ active: 'Y', subDistributor: _id }).fetch();
    return {
      userRes: userRes, priceType: priceType,
      priceResultArray: priceResultArray, productData: productData
    };
  },

  /**
   * 
   * @param {*} role_id 
   * get users count based on role
   */
  'user.idRoleCount': (role_id) => {
    let userResult = Meteor.users.find({ active: "Y" }, { fields: { roles: 1 } }).fetch();
    let count = 0;
    if (userResult !== undefined && userResult.length > 0) {
      for (let i = 0; i < userResult.length; i++) {
        let rolesCheck = userResult[i].roles.includes(role_id);
        if (rolesCheck === true) {
          count = count + 1;
        }
      }
    }
    return count;
  },
  /**
 * 
 * @param {*} _id 
 * get users count based on sd
 */
  'users.sdCount': (_id) => {
    let userResult = Meteor.users.find({ active: "Y", userType: "SDUser", subDistributor: _id }).count();
    // console.log("userResult " + userResult);
    return userResult;
  },
  /**
   * get sd users list */
  'user.sdUserDataList': (_id) => {
    return allUsers.find({ subDistributor: _id, active: "Y" }, { fields: { profile: 1 } }).fetch();
  },
  'user.sdUserDataList1': (_id) => {
    return allUsers.find({ subDistributor: _id, active: "Y" }, { fields: { username: 1, userType: 1, active: 1, profile: 1 } }).fetch();
  },

  'user.idSdName': (id) => {
    let sdName = '';
    let sdList = Meteor.users.findOne({ _id: id });
    if (sdList) {
      sdName = sdList.username;
    }
    return sdName;
  },
  'user.getOmrWholesaleUser': (id) => {
    // console.log("id", id);

    let sdUsersList = Meteor.users.find({ subDistributor: id, active: "Y" }, { fields: { profile: 1, roles: 1 } }).fetch();
    // console.log("sdUsersList", sdUsersList);
    let sdUserArray = [];
    if (sdUsersList.length > 0) {
      for (let k = 0; k < sdUsersList.length; k++) {
        let permissionsData = ['omrView', 'wseView'];
        for (let i = 0; i < permissionsData.length; i++) {
          let roleData = roles.findOne({ _id: sdUsersList[k].roles[0] });
          if (roleData !== undefined) {
            let vsrView = roleData.permissions.includes(permissionsData[i]);
            if (vsrView === true) {
              sdUserArray.push(sdUsersList[k]);
            }
          }
        }
      }
    }
    return sdUserArray
  },
  'user.getSdUsers': () => {
    let sdUsersList = Meteor.users.find({ userType: "SDUser", active: "Y" }).fetch();
    return sdUsersList;
  },
  'users.getSubD': (id) => {
    let sdAry = [];
    let dataUser = Meteor.users.findOne({ _id: id, userType: 'MainUser' }, { fields: { vertical: 1 } });
    if (dataUser) {
      let sdData = Meteor.users.find({ vertical: { $in: dataUser.vertical }, active: "Y" }, { fields: { profile: 1 } }).fetch();
      if (sdData.length > 0) {
        for (let i = 0; i < sdData.length; i++) {
          sdAry.push(sdData[i]._id);
        }
        return sdAry;
      } else {
        return false
      }
    } else
      return false
  },
  // 'user.lisWithUser': (userId, fromDate, toDate) => {
  //   return allUsers.find({ _id: userId, createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
  // },
  'user.lisWithUser': (fromDate, toDate) => {
    return allUsers.find({ createdAt: { $gte: fromDate, $lt: toDate } }).fetch();
  },
  'user.clearToken': (user) => {
    if (user === 'allUsers') {
      let sdUsersList = Meteor.users.find({ userType: "SDUser", active: "Y" }, {
        fields: { profile: 1 }
      }).fetch();
      if (sdUsersList.length > 0) {
        for (let i = 0; i < sdUsersList.length; i++) {
          Meteor.users.update({ _id: sdUsersList[i]._id }, {
            $set: {
              token: '',
              'services.resume.loginTokens': [],
              loggedIn: false,
            }
          });
        }
      }
    }
    else {
      Meteor.users.update({ _id: user }, {
        $set: {
          token: '',
          'services.resume.loginTokens': [],
          loggedIn: false,
        }
      });
    }
  },
  'user.updateLoginVal': (user) => {
    Meteor.users.update({ _id: user }, {
      $set: {
        loggedIn: true,
      }
    });
  },

  'user.updateLogoutVal': (user) => {
    Meteor.users.update({ _id: user }, {
      $set: {
        loggedIn: false,
      }
    });
  },
  'user.sdUserListSd': (sd) => {
    let list = allUsers.find({ subDistributor: sd, userType: "SDUser" }, { fields: { profile: 1 } }).fetch();
    if (list) {
      return list;
    }
  }
});


/**
 * price type mapping
 */
function PriceTypeMappingFun(userId, priceType) {
  let loginUserData = Meteor.users.findOne({ _id: Meteor.userId() });
  let priceTypeRes = SdPriceType.find({ subDistributor: userId, vertical: loginUserData.vertical[0] }).fetch();

  if (priceTypeRes.length === 0) {
    SdPriceType.insert({
      subDistributor: userId,
      vertical: loginUserData.vertical[0],
      priceType: priceType,
      randomId: Random.id(),
      uuid: Random.id(),
      active: "Y",
      createdBy: Meteor.userId(),
      createdAt: new Date()
    });
  }
  else {
    SdPriceType.update({
      subDistributor: userId,
      vertical: loginUserData.vertical[0]
    }, {
      $set:
      {
        priceType: priceType,
        active: "Y",
        updatedBy: Meteor.userId(),
        updatedAt: new Date()
      }
    });
  }
}
/**
 * 
 * @param {*} id 
 * @param {*} verticalArray 
 * price type mapping for super admin
 */
function PriceTypeMappingSuperAdminFun(id, verticalArray) {
  // console.log("nnnmmjikthin");
  let subDistributorArray = SdPriceType.find({ subDistributor: id, active: "Y" }).fetch();
  if (subDistributorArray !== undefined && subDistributorArray.length > 0) {
    priceTypeStatUpdate(subDistributorArray);
    // console.log("hii1");
  }
  // deactivate priceType if not present in verticalArray
  function priceTypeStatUpdate(subDistributorArray) {
    for (let i = 0; i < subDistributorArray.length; i++) {
      let verticalRes = verticalArray.find(x => x.vertical === subDistributorArray[i].vertical);
      if (verticalRes === undefined) {
        SdPriceType.update({
          subDistributor: id,
          vertical: subDistributorArray[i].vertical
        }, {
          $set:
          {
            active: 'N',
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }

    }
    // vertical updates
    priceTypeInsert(verticalArray);

  }

  function priceTypeInsert(verticalArray) {
    // console.log("hii2");
    for (let k = 0; k < verticalArray.length; k++) {

      let priceTypeRes = SdPriceType.find({ subDistributor: id, vertical: verticalArray[k].vertical }).fetch();
      // Insert data if not present
      if (priceTypeRes.length === 0) {
        // console.log("hii3");
        SdPriceType.insert({
          subDistributor: id,
          vertical: verticalArray[k].vertical,
          priceType: verticalArray[k].priceType,
          randomId: verticalArray[k].randomId,
          createdAt: new Date(),
          uuid: Random.id(),
          active: 'Y',
        });
      }
      // update status if priceType is inactive
      else if (priceTypeRes[0].active === 'N') {
        // console.log("hii4");
        SdPriceType.update({
          subDistributor: id,
          vertical: priceTypeRes[0].vertical
        }, {
          $set:
          {
            active: 'Y',
            priceType: verticalArray[k].priceType,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }
      else {
        SdPriceType.update({
          subDistributor: id,
          vertical: priceTypeRes[0].vertical
        }, {
          $set:
          {
            active: 'Y',
            priceType: verticalArray[k].priceType,
            updatedBy: Meteor.userId(),
            updatedAt: new Date(),
          }
        });
      }
    }
  }

  // insert data if no priceType found

  let priceTypeCheck = SdPriceType.find({ subDistributor: id },).fetch();

  if (priceTypeCheck !== undefined && priceTypeCheck.length === 0) {
    // console.log("hii5");
    for (let k = 0; k < verticalArray.length; k++) {
      SdPriceType.insert({
        subDistributor: id,
        vertical: verticalArray[k].vertical,
        priceType: verticalArray[k].priceType,
        randomId: verticalArray[k].randomId,
        createdAt: new Date(),
        uuid: Random.id(),
        active: 'Y',
      });
    }
  }
}
/**
 * 
 * @param {*} productArray 
 * @param {*} id 
 * product mapping updation (SD)
 */
function productMappingFun(productArray, id) {
  let productData = SdProducts.find({ subDistributor: id }).fetch();
  if (productData.length > 0) {
    for (let i = 0; i < productData.length; i++) {
      SdProducts.remove({ _id: productData[i]._id });
    }
    insertProductData(productArray);
  }

  function insertProductData(productArray) {
    for (let j = 0; j < productArray.length; j++) {
      SdProducts.insert({
        subDistributor: id,
        product: productArray[j].product,
        minimumQty: productArray[j].minimumQty,
        active: "Y",
        excelUpload: true,
        uuid: Random.id(),
        createdBy: Meteor.userId(),
        createdAt: new Date(),
      });
    }
  }

}