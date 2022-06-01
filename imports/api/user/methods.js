/**
* @author Visakh
*/

import { allUsers } from './user';
import { Meteor } from 'meteor/meteor';
import { Employee } from '../employee/employee';
import { DeletedUser } from "../deletedUser/deletedUser";    
import { Branch } from '../branch/branch'; 
import { Customer } from '../customer/customer';
import { WareHouse } from '../wareHouse/wareHouse';
import { CustomerAddress } from '../customerAddress/customerAddress';
import { CronResult } from "../cronResult/cronResult";
import { Config } from "../config/config";
import { SupplierOrder } from '../supplierOrder/supplierOrder';
import { SupplierInvoice } from '../supplierInvoice/supplierInvoice';
import { Invoice } from '../invoice/invoice'; 

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
  * @param designationName  
  * @param supervisor
  */
  'user.create': (firstName, lastName, email, contact, username, password, gender, dateOfBirth, empCode, roleArray,
    supervisor, branch, defaultBranch, slpCode) => {
    // let slpName = Employee.findOne({ slpCode: slpCode }).slpName;
    let defaultBranchName = Branch.findOne({ bPLId: defaultBranch }).bPLName;
    let userId = Accounts.createUser({
      profile: {
        empCode: empCode, firstName: firstName,
        lastName: lastName, gender: gender, dateOfBirth: dateOfBirth, isDeleted: false,
        image: ''
      },
      email: email,
      username: username,
      password: password,
      createdAt: new Date(),
      createdBy: username,
      // slpCode:empCode
    });
    // return userId;
    if (userId) {
      let token = Accounts._generateStampedLoginToken().token;
      // Meteor.setTimeout(function () { Accounts.sendVerificationEmail(userId); }, 1000);
      // Set user's role    

      return Meteor.users.update(userId, {
        $set: {
          token: token,
          // designation: designationName,
          roles: roleArray,
          supervisor: supervisor,
          contactNo: contact,
          branch: branch,
          defaultBranch: defaultBranch,
          defaultBranchName: defaultBranchName,
          active: "Y",
          slpCode: slpCode,
          // slpName: slpName,
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
    email, hiddenemail, password, gender, empCode, roleArray, supervisor, defaultBranch, branch, slpCode) => {
    // let slpName = Employee.findOne({ slpCode: slpCode }).slpName;
    let defaultBranchName = Branch.findOne({ bPLId: defaultBranch }).bPLName;
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
        roles: roleArray,
        // designation:designationName,
        supervisor: supervisor,
        branch: branch,
        defaultBranch: defaultBranch,
        defaultBranchName: defaultBranchName,
        slpCode: slpCode,
        // slpName: slpName,
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
  //   /**
  //  * TODO: Complete JS doc
  //  * @param _id
  //  */
  //   'user.delete': (_id) => {
  //     let AllUsers = allUsers.findOne({ _id: _id.trim() });
  //     if (AllUsers) {
  //       allUsers.findOne({ _id: _id.trim() })
  //       AllUsers.profile.isDeleted = true;
  //       allUsers.update({ _id: AllUsers._id }, AllUsers);
  //     }

  //   },
  'user.delete': (_id) => {
    let userData = allUsers.findOne({ _id: _id });
    let deletedOrderData = DeletedUser.insert({
      userCreatedAt: userData.createdAt,
      services: userData.services,
      username: userData.username,
      emails: userData.emails,
      profile: userData.profile,
      active: userData.active,
      branch: userData.branch,
      contactNo: userData.contactNo,
      defaultBranch: userData.defaultBranch,
      defaultBranchName: userData.defaultBranchName,
      roles: userData.roles,
      slpCode: userData.slpCode,
      supervisor: userData.supervisor,
      token: userData.token,
      createdAt: new Date(),
    });
    if (deletedOrderData) {
      return allUsers.remove({ _id: _id });
    }
    return deletedOrderData;
  },

  /**
   * TODO:Complete JS doc
   * Fetching User List - For Credit Invoice Creation
*/
  'user.userList': () => {
    return Meteor.users.find({ 'profile.isDeleted': false }, { sort: { 'profile.firstName': 1 } }).fetch();
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
* Fetching User List - For vansale
*/
  'user.vanUserData': (roles) => {
    let res = Meteor.users.find({
      userType: "V",
      roles: { $in: roles }
    }, { fields: { profile: 1 } }).fetch();
    return res;
  },
  /**
* TODO:Complete JS doc
* Fetching User List - For vansale
*/
  'user.branchUserVansale': (branch) => {
    return Meteor.users.find({ branch: { $in: branch }, userType: "V", 'profile.isDeleted': false },
      { fields: { profile: 1 } }).fetch();
  },
  /**
* TODO:Complete JS doc
* Fetching User List - For vansale
*/
  'user.branchUserVansaleRole': (branch, role) => {
    return Meteor.users.find({
      branch: { $in: branch },
      roles: { $in: role },
      userType: "V", 'profile.isDeleted': false
    },
      { fields: { profile: 1 } }).fetch();
  },
  /**
* TODO:Complete JS doc
* Fetching User List - For vansale
*/
  'user.vanUserDataPos': (user) => {
    return Meteor.users.find({ _id: user }, { fields: { profile: 1 } }).fetch();
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
  },
  /**
 * TODO:Complete Js doc
 * Fetching the customer full list
 */
  'user.userNameGet': () => {
    return Meteor.users.find({
      'profile.isDeleted': false,
      $and: [{ userType: { $ne: 'V' } }, { userType: { $ne: 'C' } },
      { userType: { $ne: 'S' } }]
    }, { sort: { 'profile.firstName': 1 } }, { fields: { 'profile.firstName': 1, _id: 1, 'emails.address': 1, contactNo: 1 } }).fetch();
  },
  'user.userNameGetAdmin': () => {
    return Meteor.users.find({
      $and: [{ userType: { $ne: 'V' } }, { userType: { $ne: 'C' } },
      { userType: { $ne: 'S' } }]
    }, { sort: { 'profile.firstName': 1 } }, { fields: { 'profile.firstName': 1, _id: 1, 'emails.address': 1, contactNo: 1 } }).fetch();
  },

  'user.vansaleList': () => {
    return Meteor.users.find({
      'profile.isDeleted': false,
      userType: "V", active: "Y"
    }, { fields: { profile: 1 } }).fetch();
  },

  'user.vansaleListBranch': (branch, roles) => {
    return Meteor.users.find({
      'profile.isDeleted': false, userType: "V",
      roles: { $in: roles },
      branch: { $in: branch }
    }, { fields: { profile: 1 } }).fetch();
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
  'user.idUserName': (id) => {
    return allUsers.findOne({ _id: id }).profile.firstName;
  },
  'user.idAuthorizedBy': (id) => {

    return Meteor.users.findOne({ _id: id }, { fields: { profile: 1, emails: 1, contactNo: 1 } })
  },
  'user.userListForArInv': (id) => {
    return Meteor.users.find({ _id: id, 'profile.isDeleted': false }, { fields: { profile: 1 } }).fetch();
  },
  'user.loginDetails': () => {
    return Meteor.users.findOne({ _id: Meteor.userId() });
  },
  'user.user_id': (_id) => {
    return Meteor.users.findOne({ _id: _id, 'profile.isDeleted': false });
  },
  'user.userCount': (_id) => {
    return Meteor.users.find({ roles: _id, 'profile.isDeleted': false }).count();
  }
  ,
  'user.userSlp': (slpCode) => {
    return Meteor.users.findOne({ slpCode: slpCode });
  },
  'user.userDetailss': (id) => {
    return Meteor.users.findOne({ _id: id });
  },
  /**
   * TODO:Complete JS doc
   * Fetching Branch List
*/
  'user.branchList': () => {
    return Meteor.users.findOne({ _id: Meteor.userId() }).branch;
  },
  'user.arInvFilter': () => {
    return Meteor.users.find({
      'profile.isDeleted': false,
      $and: [{ userType: { $ne: 'C' } },
      { userType: { $ne: 'S' } }]
    }, { fields: { profile: 1 } }).fetch();
  },
  /**
  * activate sub user - business partner
  */

  'user.activateCustomer': (id) => {
    let user = Meteor.users.findOne({ _id: id });
    let userName = Meteor.users.findOne({ _id: Meteor.userId() }).profile.firstName;
    Meteor.users.update({ _id: id }, {
      $set:
      {
        profile:
        {
          isDeleted: false,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          userType: user.profile.userType,
          gender: user.profile.gender,
          image: user.profile.image,
          locationAddress: user.profile.locationAddress,
          dateOfBirth: user.profile.dateOfBirth,
          customerUser: user.profile.customerUser,
          customerActivate: true,
          cardCode: user.profile.cardCode,
          cardName: user.profile.cardName,
          address: user.profile.address
        },
        approvalStatus: "Active",
        adminApprove: true,
        activatedBy: Meteor.userId(),
        activatedByName: userName,
        updatedAt: new Date(),
        activatedByDate: new Date()
      }
    });
  },
  /**
   * deactivate sub users - Business partner
   */
  'user.deactivateCustomer': (id) => {
    let user = Meteor.users.findOne({ _id: id });
    let userName = Meteor.users.findOne({ _id: Meteor.userId() }).profile.firstName;
    Meteor.users.update({ _id: id }, {
      $set:
      {
        profile:
        {
          isDeleted: false,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          userType: user.profile.userType,
          gender: user.profile.gender,
          image: user.profile.image,
          locationAddress: user.profile.locationAddress,
          dateOfBirth: user.profile.dateOfBirth,
          customerUser: user.profile.customerUser,
          customerActivate: false,
          cardCode: user.profile.cardCode,
          cardName: user.profile.cardName,
          address: user.profile.address
        },
        approvalStatus: "Rejected",
        adminApprove: false,
        rejectedBy: Meteor.userId(),
        rejectedByName: userName,
        updatedAt: new Date(),
        rejectedByDate: new Date(),
      }
    });
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
 * @param designationName
 * @param supervisor
 */
  'user.createCustomer': (type, customerName, address, street, block, city, email, contactNo,
    username, password, roleArray, defaultBranch) => {
    let customerDetails = Customer.findOne({ cardCode: customerName });
    let branch = customerDetails.bPLId;
    let defaultBranchName = Branch.findOne({ bPLId: defaultBranch }).bPLName;
    let customer = Customer.findOne({ cardCode: customerName }).cardName;
    let permissionArray = [];
    let cardType = "";
    if (type === "C") {
      permissionArray.push('salesQuotationView', 'salesOrderView', 'deliveryView',
        'invoiceView', 'salesReturnView', 'paymentsView', 'reportsView');
      cardType = "Customer";
      apiCallCustomerInvoice(customerName);
    }
    else {
      permissionArray.push('supplierView');
      cardType = "Supplier";
      apiCallOrder(customerName);
      apiCallInvoice(customerName);
      console.log("hiiii");
    }
    let userId = Accounts.createUser({
      profile: {
        isDeleted: false,
        firstName: customer,
        cardName: customer,
        cardCode: customerName,
        userType: type,
        businessPartner: true,
        address: address,
        street: street,
        block: block,
        city: city,
      },
      email: email,
      username: username,
      password: password,
      createdAt: new Date(),
      createdBy: Meteor.users.findOne({ _id: Meteor.userId() }).profile.firstName,
    });
    if (userId) {
      Customer.update({
        cardCode: customerName
      }, {
        $set: {
          userAdminCreate: true,
          userAdminUpdated: new Date()
        }
      });

      let token = Accounts._generateStampedLoginToken().token;
      return Meteor.users.update(userId, {
        $set: {
          token: token,
          cardCode: customerName,
          cardName: customer,
          address: address,
          street: street,
          block: block,
          city: city,
          roles: roleArray,
          contactNo: contactNo,
          userType: type,
          cardType: cardType,
          branch: branch,
          defaultBranch: defaultBranch,
          defaultBranchName: defaultBranchName,
          permissionArray: permissionArray,
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
  'user.updateCustomer': (id, username, contactNo, email, hiddenemail, password, defaultBranch) => {
    let user = Meteor.users.findOne({ _id: id });
    let defaultBranchName = Branch.findOne({ bPLId: defaultBranch }).bPLName;
    let permissionArray = [];
    if (user.userType === 'C') {
      permissionArray.push('salesQuotationView', 'salesOrderView', 'deliveryView',
        'invoiceView', 'salesReturnView', 'paymentsView', 'reportsView');
    }
    else {
      permissionArray.push('supplierView');
    }
    Meteor.users.update({ _id: id }, {
      $set:
      {
        profile:
        {
          isDeleted: false,
          firstName: user.profile.firstName,
          cardCode: user.profile.cardCode,
          cardName: user.profile.cardName,
          supervisor: user.profile.supervisor,
          supervisorName: user.profile.supervisorName,
          userType: user.profile.userType,
          businessPartner: true,
          address: user.profile.address,
          street: user.profile.street,
          block: user.profile.block,
          city: user.profile.city,
        },
        username: username,
        contactNo: contactNo,
        defaultBranch: defaultBranch,
        defaultBranchName: defaultBranchName,
        permissionArray: permissionArray
      }
    });
    let oldEmail = hiddenemail;
    Meteor.users.update({ _id: id, 'emails.0.address': oldEmail }, {
      $set:
        { 'emails.0.address': email }
    });
    if (password != '') {
      Accounts.setPassword(id, password);
    }
    return true
  },
  /**
    * deactivate business partner
    */
  'user.deactivateBusinessPartner': (id) => {
    Meteor.users.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedAt: new Date()
      }
    });
    /**
     * deactivate sub users under business partner
     */
    let businessPartnerGet = Meteor.users.findOne({ _id: id });
    let userValue = Meteor.users.find({
      cardCode: businessPartnerGet.cardCode,
      'profile.customerUser': true, approvalStatus: 'Active'
    }).fetch();
    if (userValue.length !== 0) {
      for (let i = 0; i < userValue.length; i++) {
        Meteor.users.update({ _id: userValue[i]._id }, {
          $set:
          {
            profile:
            {
              isDeleted: false,
              firstName: userValue[i].profile.firstName,
              lastName: userValue[i].profile.lastName,
              userType: userValue[i].profile.userType,
              gender: userValue[i].profile.gender,
              image: userValue[i].profile.image,
              locationAddress: userValue[i].profile.locationAddress,
              dateOfBirth: userValue[i].profile.dateOfBirth,
              customerUser: userValue[i].profile.customerUser,
              customerActivate: false,
              cardCode: userValue[i].profile.cardCode,
              cardName: userValue[i].profile.cardName,
              address: userValue[i].profile.address
            },
            approvalStatus: "InActive",
            bpDeactivated: true,
            deactivated: Meteor.userId(),
            updatedAt: new Date(),
            deActivatedByDate: new Date()
          }
        });
      }
    }
  },
  /**
   * activate business partner
   */
  'user.activateBusinessPartner': (id) => {
    Meteor.users.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedAt: new Date()
      }
    });
    // activate sub users under business partner
    let businessPartnerGet = Meteor.users.findOne({ _id: id });
    let userValue = Meteor.users.find({
      cardCode: businessPartnerGet.cardCode,
      'profile.customerUser': true, bpDeactivated: true,
    }).fetch();
    if (userValue.length !== 0) {
      for (let i = 0; i < userValue.length; i++) {
        Meteor.users.update({ _id: userValue[i]._id }, {
          $set:
          {
            profile:
            {
              isDeleted: false,
              firstName: userValue[i].profile.firstName,
              lastName: userValue[i].profile.lastName,
              userType: userValue[i].profile.userType,
              gender: userValue[i].profile.gender,
              image: userValue[i].profile.image,
              locationAddress: userValue[i].profile.locationAddress,
              dateOfBirth: userValue[i].profile.dateOfBirth,
              customerUser: userValue[i].profile.customerUser,
              customerActivate: true,
              cardCode: userValue[i].profile.cardCode,
              cardName: userValue[i].profile.cardName,
              address: userValue[i].profile.address
            },
            approvalStatus: "Active",
            bpDeactivated: false,
            activatedBy: Meteor.userId(),
            updatedAt: new Date(),
            activatedByDate: new Date()
          }
        });
      }

    }
  },

  'user.userActiveList': () => {
    let activeList = Meteor.users.find({ customerUser: true, approvalStatus: "Active" }, { fields: { cardCode: 1 } }).fetch();
    let inactiveList = Meteor.users.find({ customerUser: true, $or: [{ approvalStatus: "Pending" }, { approvalStatus: "InActive" }, { approvalStatus: "Rejected" }] }, { fields: { cardCode: 1 } }).fetch();
    let resObj =
    {
      activeList: activeList,
      inactiveList: inactiveList
    }
    return resObj;
  },
  /**
 * active and inactive list
 */
  'user.userStatusList': (_id) => {
    let userList = Meteor.users.findOne({ _id: _id });
    let activeList = Meteor.users.find({ cardCode: userList.cardCode, approvalStatus: 'Active' }).fetch();
    let inactiveList = Meteor.users.find({ cardCode: userList.cardCode, $or: [{ approvalStatus: 'Pending' }, { approvalStatus: 'Rejected' }, { approvalStatus: 'InActive' }] }).fetch();
    let userObj = {
      userList: userList,
      activeList: activeList,
      inactiveList: inactiveList,
    }
    return userObj;
  },
  /**
  * activate sub users by admin
  */
  'user.activateSubCustomerAdmin': (id) => {
    let user = Meteor.users.findOne({ _id: id });
    let userName = Meteor.users.findOne({ _id: Meteor.userId() }).profile.firstName;
    Meteor.users.update({ _id: id }, {
      $set:
      {
        profile:
        {
          isDeleted: false,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          userType: user.profile.userType,
          gender: user.profile.gender,
          image: user.profile.image,
          locationAddress: user.profile.locationAddress,
          dateOfBirth: user.profile.dateOfBirth,
          customerUser: user.profile.customerUser,
          customerActivate: true,
          cardCode: user.profile.cardCode,
          cardName: user.profile.cardName,
          address: user.profile.address
        },
        approvalStatus: "Active",
        adminApprove: true,
        activatedBy: Meteor.userId(),
        activatedByName: userName,
        updatedAt: new Date(),
        activatedByDate: new Date()
      }
    });
  },
  /**
   * deactivate sub users by admin
   */
  'user.deactivateSubCustomerAdmin': (id) => {
    let user = Meteor.users.findOne({ _id: id });
    let userName = Meteor.users.findOne({ _id: Meteor.userId() }).profile.firstName;
    Meteor.users.update({ _id: id }, {
      $set:
      {
        profile:
        {
          isDeleted: false,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          userType: user.profile.userType,
          gender: user.profile.gender,
          image: user.profile.image,
          locationAddress: user.profile.locationAddress,
          dateOfBirth: user.profile.dateOfBirth,
          customerUser: user.profile.customerUser,
          customerActivate: false,
          cardCode: user.profile.cardCode,
          cardName: user.profile.cardName,
          address: user.profile.address
        },
        approvalStatus: "InActive",
        adminApprove: false,
        rejectedBy: Meteor.userId(),
        rejectedByName: userName,
        updatedAt: new Date(),
        deActivatedByDate: new Date()
      }
    });
  },
  'user.idGet': (id) => {
    return Meteor.users.findOne({ _id: id });
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
 * @param designationName
 * @param supervisor
 */
  'user.vanSaleUserCreate': (firstName, lastName, email, contact, username, password, gender, dateOfBirth, empCode, roleArray,
    supervisor, branch, defaultBranch, defaultWhs, slpCode, customer, address, street, block, city,
    vansaleFullName, transporterName, vehicleNumber, lorryBoy, selectDriverName, driverNumber) => {


    let createdByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      createdByName = user.profile.firstName;
    }

    let defaultBranchName = '';
    let branchs = Branch.findOne({ bPLId: defaultBranch });
    if (branchs !== undefined) {
      defaultBranchName = branchs.bPLName;
    }
    let defaultWhsName = '';
    let warehouses = WareHouse.findOne({ whsCode: defaultWhs });
    if (warehouses !== undefined) {
      defaultWhsName = warehouses.whsName;
    }
    let cardName = '';
    let custDetails = Customer.findOne({ cardCode: customer });
    if (custDetails !== undefined) {
      cardName = custDetails.cardName;
    }
    // console.log("custDetails",custDetails);
    // console.log("cardName",cardName);
    // console.log("cardCode",customer);
    let userId = Accounts.createUser({
      profile: {
        empCode: empCode, firstName: firstName,
        lastName: lastName, gender: gender, dateOfBirth: dateOfBirth, isDeleted: false,
        image: '', userType: "V"
      },
      email: email,
      username: username,
      password: password,
      createdAt: new Date(),
      createdBy: createdByName,
    });
    if (userId) {
      let token = Accounts._generateStampedLoginToken().token;

      return Meteor.users.update(userId, {
        $set: {
          token: token,
          roles: roleArray,
          userType: "V",
          supervisor: supervisor,
          contactNo: contact,
          branch: branch,
          defaultBranch: defaultBranch,
          defaultBranchName: defaultBranchName,
          defaultWareHouse: defaultWhs,
          defaultWareHouseName: defaultWhsName,
          active: "Y",
          slpCode: slpCode,
          cardName: cardName,
          cardCode: customer,
          address: address,
          street: street,
          city: city,
          block: block,
          vansaleFullName: vansaleFullName,
          transporterName: transporterName,
          vehicleNumber: vehicleNumber,
          lorryBoy: lorryBoy,
          driverName: selectDriverName,
          driverNumber: driverNumber
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
  'user.vanSaleUserUpdate': (id, firstName, lastName, dateOfBirth, username, contact,
    email, hiddenemail, password, gender, empCode, roleArray, supervisor, defaultBranch, branch, defaultWhs, slpCode,
    customer, address, street, block, city, vansaleFullName, transporterName, vehicleNumber, lorryBoy,
    selectDriverName, driverNumber) => {


    // console.log("haiiiii",id, firstName, lastName, dateOfBirth, username, contact,
    // email, hiddenemail, password, gender, empCode, roleArray, supervisor, defaultBranch, branch, defaultWhs, slpCode,
    // customer, address, street, block, city, vansaleFullName, transporterName, vehicleNumber, lorryBoy,
    // selectDriverName, driverNumber);
    let defaultBranchName = '';
    let branchs = Branch.findOne({ bPLId: defaultBranch });
    if (branchs !== undefined) {
      defaultBranchName = branchs.bPLName;
    }
    let defaultWhsName = '';
    let warehouses = WareHouse.findOne({ whsCode: defaultWhs });
    if (warehouses !== undefined) {
      defaultWhsName = warehouses.whsName;
    }

    let cardName = "";
    let custDetails = Customer.findOne({ cardCode: customer });
    if (custDetails !== undefined) {
      cardName = custDetails.cardName;
    }

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
        roles: roleArray,
        supervisor: supervisor,
        branch: branch,
        defaultBranch: defaultBranch,
        defaultBranchName: defaultBranchName,
        defaultWareHouse: defaultWhs,
        defaultWareHouseName: defaultWhsName,
        slpCode: slpCode,
        cardName: cardName,
        cardCode: customer,
        address: address,
        street: street,
        city: city,
        block: block,
        vansaleFullName: vansaleFullName,
        transporterName: transporterName,
        vehicleNumber: vehicleNumber,
        lorryBoy: lorryBoy,
        driverName: selectDriverName,
        driverNumber: driverNumber
      }
    });
    let oldEmail = hiddenemail;
    Meteor.users.update({ _id: id, 'emails.0.address': oldEmail }, {
      $set:
        { 'emails.0.address': email }
    });
    if (password != '') {
      Accounts.setPassword(id, password);
    }
    return true
  },
  'user.inactive': (id) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "N",
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  'user.active': (id) => {
    let updatedByName = '';
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user !== undefined) {
      updatedByName = user.profile.firstName;
    }
    return Meteor.users.update({ _id: id }, {
      $set:
      {
        active: "Y",
        updatedBy: Meteor.userId(),
        updatedName: updatedByName,
        updatedAt: new Date(),
      }
    });
  },
  /**
* TODO:Complete Js doc
* Fetching the customer full list
*/
  'user.vansaleGet': () => {
    return Meteor.users.find({ userType: "V" }, { sort: { 'profile.firstName': 1 } }, { fields: { 'profile.firstName': 1, _id: 1, 'emails.address': 1, contactNo: 1 } }).fetch();
  },

  'user.numericalExport': (id, managerBranch, branch) => {
    if (id !== '' && branch === '') {
      return allUsers.find({ _id: id }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
    }
    else if (id === '' && branch !== '') {
      return allUsers.find({
        branch: branch, userType: 'V',
        'profile.isDeleted': false,
      }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
    }
    else if (id !== '' && branch !== '') {
      return allUsers.find({ branch: branch, _id: id }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
    }
    else {
      return allUsers.find({
        userType: 'V',
        'profile.isDeleted': false,
        branch: { $in: managerBranch },
      }, { fields: { profile: 1, userType: 1, branch: 1 } }).fetch();
    }
  },

  /**
* TODO: Complete JS doc
* 
*/
  'user.createUpload': (userArray) => {
    if (userArray !== undefined && userArray !== []) {

      for (let a = 0; a < userArray.length; a++) {
        let defaultBranchName = '';
        let branchs = Branch.findOne({ bPLId: userArray[a].defaultBranch });
        if (branchs !== undefined) {
          defaultBranchName = branchs.bPLName;
        }
        let wareHouseCodes = userArray[a].defaultWareHouse;
        let defaultWhsName = '';
        let warehouses = WareHouse.findOne({ whsCode: userArray[a].defaultWareHouse });
        if (warehouses !== undefined) {
          defaultWhsName = warehouses.whsName;
        }
        else {
          let whsRes = WareHouse.findOne({ bPLId: userArray[a].defaultBranch });
          if (whsRes) {
            wareHouseCodes = whsRes.whsCode;
            defaultWhsName = whsRes.whsName;
          }
        }

        let customerName = '';
        let custRes = Customer.findOne({ cardCode: userArray[a].customer });
        if (custRes !== undefined) {
          customerName = custRes.cardName;
        }


        let street = '';
        let city = '';
        let block = '';
        let addressRes = CustomerAddress.findOne({ address: userArray[a].address, addressType: "S" });
        if (addressRes !== undefined) {
          street = addressRes.street;
          city = addressRes.city;;
          block = addressRes.block;;
        }
        let userDetails = allUsers.find({
          username: userArray[a].username,
        }).fetch();

        if (userDetails.length === 0) {
          let userId = Accounts.createUser({
            profile: {
              empCode: userArray[a].empCode,
              firstName: userArray[a].firstName,
              lastName: userArray[a].lastName,
              gender: userArray[a].gender,
              dateOfBirth: userArray[a].dateOfBirth,
              isDeleted: false,
              image: '',
              userType: "V"
            },
            email: userArray[a].email,
            username: userArray[a].username,
            password: userArray[a].password,
            createdAt: new Date(),
          });
          if (userId) {
            let token = Accounts._generateStampedLoginToken().token;
            allUsers.update(userId, {
              $set: {
                token: token,
                roles: userArray[a].roles,
                userType: "V",
                supervisor: userArray[a].supervisor,
                contactNo: userArray[a].contactNo,
                branch: userArray[a].branch,
                defaultBranch: userArray[a].defaultBranch,
                defaultBranchName: defaultBranchName,
                wareHouse: [],
                defaultWareHouse: wareHouseCodes,
                defaultWareHouseName: defaultWhsName,
                active: "Y",
                slpCode: userArray[a].slpCode,
                cardName: customerName,
                cardCode: userArray[a].customer,
                address: userArray[a].address,
                street: street,
                city: city,
                block: block,
                vansaleFullName: userArray[a].vansaleFullName,
                transporterName: userArray[a].transporterName,
                vehicleNumber: userArray[a].vehicleNumber,
                lorryBoy: userArray[a].lorryBoy,
                driverName: userArray[a].driverName,
                driverNumber: userArray[a].driverNumber,
                excelUpload: true
              }
            });
          };
        }
        else {
          allUsers.update({ username: userArray[a].username }, {
            $set:
            {
              profile:
              {
                image: allUsers.findOne({ username: userArray[a].username }).profile.image,
                empCode: userArray[a].empCode,
                firstName: userArray[a].firstName,
                lastName: userArray[a].lastName,
                gender: userArray[a].gender,
                dateOfBirth: userArray[a].dateOfBirth,
                isDeleted: false
              },
              username: userArray[a].username,
              'emails.0.address': userArray[a].email,
              contactNo: userArray[a].contactNo,
              roles: userArray[a].roles,
              supervisor: userArray[a].supervisor,
              branch: userArray[a].branch,
              defaultBranch: userArray[a].defaultBranch,
              defaultBranchName: defaultBranchName,
              wareHouse: [],
              defaultWareHouse: wareHouseCodes,
              defaultWareHouseName: defaultWhsName,
              slpCode: userArray[a].slpCode,
              cardName: customerName,
              cardCode: userArray[a].customer,
              address: userArray[a].address,
              street: street,
              city: city,
              block: block,
              vansaleFullName: userArray[a].vansaleFullName,
              transporterName: userArray[a].transporterName,
              vehicleNumber: userArray[a].vehicleNumber,
              lorryBoy: userArray[a].lorryBoy,
              driverName: userArray[a].driverName,
              driverNumber: userArray[a].driverNumber
            }
          });
        }
      }
    }
  },
});




function apiCallOrder(customerName) {
  console.log("order api call");
  let base_url = Config.findOne({
    name: 'base_url'
  }).value;
  let dbId = Config.findOne({
    name: 'dbId'
  }).value;
  let customerCode = "'" + customerName + "'";
  console.log("customerCode", customerCode);
  let url = base_url + supplierOrderDataGet_Url;
  let dataArray = {
    dbId: dbId,
    cardCodes: customerCode
  };
  let options = {
    data: dataArray,
    headers: {
      'content-type': 'application/json'
    }
  };
  console.log("dataArrayOrders", dataArray);
  HTTP.call("POST", url, options, (err, result) => {
    if (err && result !== undefined) {
      console.log("err", err);
      CronResult.insert({
        name: 'Supplier Purchase Order Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date(),
      });
      CronResult.insert({
        name: 'Supplier Purchase Order Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date(),
      });
      return err;

    } else if (result.data !== undefined && result.data !== null) {
      // console.log("res", result.data.data);
      let orderResult = result.data.data;
      for (let i = 0; i < orderResult.length; i++) {
        let OrderFind = SupplierOrder.find({
          cardCode: orderResult[i].CardCode,
          docNum: orderResult[i].DocNum,
          docEntry: orderResult[i].DocEntry,
        }).fetch();
        if (OrderFind.length === 0 || OrderFind === undefined) {
          SupplierOrder.insert({
            docNum: orderResult[i].DocNum,
            docEntry: orderResult[i].DocEntry,
            canceled: orderResult[i].CANCELED,
            docStatus: orderResult[i].DocStatus,
            docDate: orderResult[i].DocDate,
            docDateIso: new Date(moment(orderResult[i].DocDate).format('YYYY-MM-DD')),
            docDueDate: orderResult[i].DocDueDate,
            cardCode: orderResult[i].CardCode,
            cardName: orderResult[i].CardName,
            branch: orderResult[i].BPLId,
            branchName: orderResult[i].BPLName,
            address: orderResult[i].Address,
            numAtCard: orderResult[i].NumAtCard,
            vatSum: orderResult[i].VatSum,
            discPrcnt: orderResult[i].DiscPrcnt,
            discSum: orderResult[i].DiscSum,
            docCur: orderResult[i].DocCur,
            docTotal: orderResult[i].DocTotal,
            comments: orderResult[i].Comments,
            weight: orderResult[i].Weight,
            unitDisply: orderResult[i].UnitDisply,
            priceMode: orderResult[i].PriceMode,
            slpName: orderResult[i].SlpName,
            createdAt: new Date(),
            uuid: Random.id()
          });
        }
        else {
          SupplierOrder.update(OrderFind[0]._id, {
            $set: {
              docNum: orderResult[i].DocNum,
              canceled: orderResult[i].CANCELED,
              docStatus: orderResult[i].DocStatus,
              docDate: orderResult[i].DocDate,
              docDateIso: new Date(moment(orderResult[i].DocDate).format('YYYY-MM-DD')),
              docDueDate: orderResult[i].DocDueDate,
              cardCode: orderResult[i].CardCode,
              cardName: orderResult[i].CardName,
              branch: orderResult[i].BPLId,
              branchName: orderResult[i].BPLName,
              address: orderResult[i].Address,
              numAtCard: orderResult[i].NumAtCard,
              vatSum: orderResult[i].VatSum,
              discPrcnt: orderResult[i].DiscPrcnt,
              discSum: orderResult[i].DiscSum,
              docCur: orderResult[i].DocCur,
              docTotal: orderResult[i].DocTotal,
              comments: orderResult[i].Comments,
              weight: orderResult[i].Weight,
              unitDisply: orderResult[i].UnitDisply,
              priceMode: orderResult[i].PriceMode,
              slpName: orderResult[i].SlpName,
              updatedAt: new Date()
            }
          });
        }
      }
      apiCallOrderTwo(customerName);
    }
    else {
      console.log("invoice order else");
      CronResult.insert({
        name: 'Supplier Purchase Order Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date(),
      });
      CronResult.insert({
        name: 'Supplier Purchase Order Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date(),
      });
    }
  });
}

//for order items
function apiCallOrderTwo(customerName) {
  console.log("hiiii");
  let base_url = Config.findOne({
    name: 'base_url'
  }).value;
  let dbId = Config.findOne({
    name: 'dbId'
  }).value;
  let customerCode = "'" + customerName + "'";
  console.log("customerCode", customerCode);
  let url = base_url + supplierOrderItemDataGet_Url;
  let dataArray = {
    dbId: dbId,
    cardCodes: customerCode
  };
  let options = {
    data: dataArray,
    headers: {
      'content-type': 'application/json'
    }
  };
  console.log("dataArrayItem", dataArray);
  HTTP.call("POST", url, options, (itemErr, itemresult) => {
    if (itemErr && itemresult !== undefined) {
      console.log("err", itemErr);
      CronResult.insert({
        name: 'Supplier Purchase Order Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      return itemErr;

    } else if (itemresult.data !== undefined && itemresult.data !== null) {
      let orderResultItem = itemresult.data.data;
      // console.log("orderResultItem", orderResultItem)
      for (let k = 0; k < orderResultItem.length; k++) {
        let orderData = SupplierOrder.find({ docEntry: orderResultItem[k].DocEntry }).fetch();
        if (orderData.length > 0) {
          let orderItems = [];
          orderItems = orderData[0].itemLines;
          // console.log("orderItems", orderItems)
          if (orderItems !== '' && orderItems !== undefined) {
            for (let l = 0; l < orderItems.length; l++) {
              // console.log("55666655sadgfhtfbv");
              if (orderItems[l].itemCode === orderResultItem[k].ItemCode) {
                orderItems[l].docEntry = orderResultItem[k].DocEntry,
                  orderItems[l].lineNum = orderResultItem[k].LineNum,
                  orderItems[l].docEntry = orderResultItem[k].DocEntry,
                  orderItems[l].dscription = orderResultItem[k].Dscription,
                  orderItems[l].quantity = orderResultItem[k].Quantity,
                  orderItems[l].price = orderResultItem[k].Price,
                  orderItems[l].discPrcnt = orderResultItem[k].DiscPrcnt,
                  orderItems[l].grossTotal = orderResultItem[k].LineTotal,
                  orderItems[l].whsCode = orderResultItem[k].WhsCode,
                  orderItems[l].taxStatus = orderResultItem[k].TaxStatus,
                  orderItems[l].useBaseUn = orderResultItem[k].UseBaseUn,
                  orderItems[l].uomEntry = orderResultItem[k].UomEntry,
                  orderItems[l].uomCode = orderResultItem[k].UomCode,
                  orderItems[l].u_PrcType = orderResultItem[k].U_PrcType,
                  orderItems[l].u_TaxAmt = orderResultItem[k].U_TaxAmt,
                  orderItems[l].freeTxt = orderResultItem[k].FreeTxt,
                  orderItems[l].vatGroup = orderResultItem[k].VatGroup,
                  orderItems[l].vatSum = orderResultItem[k].VatSum,
                  orderItems[l].inclusivePrice = orderResultItem[k].InclusivePrice,
                  orderItems[l].exclusivePrice = orderResultItem[k].ExclusivePrice,
                  orderItems[l].weightItem = orderResultItem[k].Weight,
                  orderItems[l].unitDisplyItem = orderResultItem[k].UnitDisply,
                  orderItems[l].updatedAt = new Date();
              }
            }
            let entry = orderItems.find(function (e) { return e.itemCode === orderResultItem[k].ItemCode; });
            // console.log("entryVal", entry);
            if (!entry) {
              let itemData = {
                docEntry: orderResultItem[k].DocEntry,
                lineNum: orderResultItem[k].LineNum,
                itemCode: orderResultItem[k].ItemCode,
                dscription: orderResultItem[k].Dscription,
                quantity: orderResultItem[k].Quantity,
                price: orderResultItem[k].Price,
                discPrcnt: orderResultItem[k].DiscPrcnt,
                grossTotal: orderResultItem[k].LineTotal,
                whsCode: orderResultItem[k].WhsCode,
                taxStatus: orderResultItem[k].TaxStatus,
                useBaseUn: orderResultItem[k].UseBaseUn,
                uomEntry: orderResultItem[k].UomEntry,
                uomCode: orderResultItem[k].UomCode,
                u_PrcType: orderResultItem[k].U_PrcType,
                u_TaxAmt: orderResultItem[k].U_TaxAmt,
                freeTxt: orderResultItem[k].FreeTxt,
                vatGroup: orderResultItem[k].VatGroup,
                vatSum: orderResultItem[k].VatSum,
                inclusivePrice: orderResultItem[k].InclusivePrice,
                exclusivePrice: orderResultItem[k].ExclusivePrice,
                weightItem: orderResultItem[k].Weight,
                unitDisplyItem: orderResultItem[k].UnitDisply,
                updatedAt: new Date()
              }
              orderItems.push(itemData);
              // console.log("entryVal11", orderItems);
            }
          } else {
            orderItems = [];
            // console.log("orderResultItem555", orderResultItem);
            let itemData = {
              docEntry: orderResultItem[k].DocEntry,
              lineNum: orderResultItem[k].LineNum,
              itemCode: orderResultItem[k].ItemCode,
              dscription: orderResultItem[k].Dscription,
              quantity: orderResultItem[k].Quantity,
              price: orderResultItem[k].Price,
              discPrcnt: orderResultItem[k].DiscPrcnt,
              grossTotal: orderResultItem[k].LineTotal,
              whsCode: orderResultItem[k].WhsCode,
              taxStatus: orderResultItem[k].TaxStatus,
              useBaseUn: orderResultItem[k].UseBaseUn,
              uomEntry: orderResultItem[k].UomEntry,
              uomCode: orderResultItem[k].UomCode,
              u_PrcType: orderResultItem[k].U_PrcType,
              u_TaxAmt: orderResultItem[k].U_TaxAmt,
              freeTxt: orderResultItem[k].FreeTxt,
              vatGroup: orderResultItem[k].VatGroup,
              vatSum: orderResultItem[k].VatSum,
              inclusivePrice: orderResultItem[k].InclusivePrice,
              exclusivePrice: orderResultItem[k].ExclusivePrice,
              weightItem: orderResultItem[k].Weight,
              unitDisplyItem: orderResultItem[k].UnitDisply,
              updatedAt: new Date()
            }

            orderItems.push(itemData);
            // console.log("itemData", orderItems);
          }

          let totalQty = 0;
          let itemsQty = orderItems;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          SupplierOrder.update(orderData[0]._id, {
            $set: {
              itemLines: orderItems,
              totalQty: totalQty.toString(),
              totalItem: itemsQty.length.toString(),
              updatedAt: new Date()
            }
          });
        }
      }
    }
    else {
      console.log("order item error else");
      CronResult.insert({
        name: 'Supplier Purchase Order Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
    }
  });
}


function apiCallInvoice(customerName) {
  console.log("invoiceApiCall");
  let base_url = Config.findOne({
    name: 'base_url'
  }).value;
  let dbId = Config.findOne({
    name: 'dbId'
  }).value;
  let customerCode = "'" + customerName + "'";
  console.log("customerCode", customerCode);
  let url = base_url + supplierInvoiceGet_Url;
  let dataArray = {
    dbId: dbId,
    cardCodes: customerCode
  };
  let options = {
    data: dataArray,
    headers: {
      'content-type': 'application/json'
    }
  };
  console.log("dataArrayInvoice", dataArray);
  HTTP.call("POST", url, options, (err, result) => {
    if (err && result !== undefined) {
      console.log("err", err);
      CronResult.insert({
        name: 'Supplier Purchase Invoice Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      CronResult.insert({
        name: 'Supplier Purchase Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      return err;

    } else if (result.data !== undefined && result.data !== null) {
      // console.log("resInvoice", result.data.data);
      let invoiceResult = result.data.data;
      for (let i = 0; i < invoiceResult.length; i++) {
        let invoiceFind = SupplierInvoice.find({
          cardCode: invoiceResult[i].CardCode,
          docNum: invoiceResult[i].DocNum,
          docEntry: invoiceResult[i].DocEntry
        }).fetch();
        if (invoiceFind.length === 0 || invoiceFind === undefined) {
          SupplierInvoice.insert({
            docNum: invoiceResult[i].DocNum,
            docEntry: invoiceResult[i].DocEntry,
            canceled: invoiceResult[i].CANCELED,
            docStatus: invoiceResult[i].DocStatus,
            docDate: invoiceResult[i].DocDate,
            docDateIso: new Date(moment(invoiceResult[i].DocDate).format('YYYY-MM-DD')),
            docDueDate: invoiceResult[i].DocDueDate,
            cardCode: invoiceResult[i].CardCode,
            cardName: invoiceResult[i].CardName,
            branch: invoiceResult[i].BPLId,
            branchName: invoiceResult[i].BPLName,
            address: invoiceResult[i].Address,
            numAtCard: invoiceResult[i].NumAtCard,
            vatSum: invoiceResult[i].VatSum,
            discPrcnt: invoiceResult[i].DiscPrcnt,
            discSum: invoiceResult[i].DiscSum,
            docCur: invoiceResult[i].DocCur,
            docTotal: invoiceResult[i].DocTotal,
            comments: invoiceResult[i].Comments,
            paidToDate: invoiceResult[i].PaidToDate,
            weight: invoiceResult[i].Weight,
            unitDisply: invoiceResult[i].UnitDisply,
            priceMode: invoiceResult[i].PriceMode,
            slpName: invoiceResult[i].SlpName,
            createdAt: new Date(),
            uuid: Random.id()
          });
        }
        else {
          SupplierInvoice.update(invoiceFind[0]._id, {
            $set: {
              docNum: invoiceResult[i].DocNum,
              canceled: invoiceResult[i].CANCELED,
              docStatus: invoiceResult[i].DocStatus,
              docDate: invoiceResult[i].DocDate,
              docDateIso: new Date(moment(invoiceResult[i].DocDate).format('YYYY-MM-DD')),
              docDueDate: invoiceResult[i].DocDueDate,
              cardCode: invoiceResult[i].CardCode,
              cardName: invoiceResult[i].CardName,
              branch: invoiceResult[i].BPLId,
              branchName: invoiceResult[i].BPLName,
              address: invoiceResult[i].Address,
              numAtCard: invoiceResult[i].NumAtCard,
              vatSum: invoiceResult[i].VatSum,
              discPrcnt: invoiceResult[i].DiscPrcnt,
              discSum: invoiceResult[i].DiscSum,
              docCur: invoiceResult[i].DocCur,
              docTotal: invoiceResult[i].DocTotal,
              comments: invoiceResult[i].Comments,
              paidToDate: invoiceResult[i].PaidToDate,
              weight: invoiceResult[i].Weight,
              unitDisply: invoiceResult[i].UnitDisply,
              priceMode: invoiceResult[i].PriceMode,
              slpName: invoiceResult[i].SlpName,
              updatedAt: new Date()
            }
          });
        }
      }
      // for invoice item
      apiCallInvoiceTwo(customerName);
    }
    else {
      console.log("invoice error else");
      CronResult.insert({
        name: 'Supplier Purchase Invoice Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      CronResult.insert({
        name: 'Supplier Purchase Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
    }
  });
}
// for invoice item
function apiCallInvoiceTwo(customerName) {
  console.log("invoiceItem");
  let base_url = Config.findOne({
    name: 'base_url'
  }).value;
  let dbId = Config.findOne({
    name: 'dbId'
  }).value;
  let customerCode = "'" + customerName + "'";
  console.log("customerCode", customerCode);
  let url = base_url + supplierInvoiceItemGet_Url;
  let dataArray = {
    dbId: dbId,
    cardCodes: customerCode
  };
  let options = {
    data: dataArray,
    headers: {
      'content-type': 'application/json'
    }
  };
  console.log("dataArrayinvoiceItem", dataArray);
  HTTP.call("POST", url, options, (itemErr, itemresult) => {
    if (itemErr && itemresult !== undefined) {
      console.log("err", itemErr);
      CronResult.insert({
        name: 'Supplier Purchase Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      return itemErr;

    } else if (itemresult.data !== undefined && itemresult.data !== null) {
      let invoiceResultItem = itemresult.data.data;
      // console.log("invoiceItemResult", invoiceResultItem)
      for (let k = 0; k < invoiceResultItem.length; k++) {
        let invoiceData = SupplierInvoice.find({ docEntry: invoiceResultItem[k].DocEntry }).fetch();
        if (invoiceData.length > 0) {
          let orderItems = [];
          orderItems = invoiceData[0].itemLines;
          // console.log("orderItems", orderItems)
          if (orderItems !== '' && orderItems !== undefined) {
            for (let l = 0; l < orderItems.length; l++) {
              // console.log("55666655sadgfhtfbv");
              if (orderItems[l].itemCode === invoiceResultItem[k].ItemCode) {
                orderItems[l].docEntry = invoiceResultItem[k].DocEntry,
                  orderItems[l].lineNum = invoiceResultItem[k].LineNum,
                  orderItems[l].docEntry = invoiceResultItem[k].DocEntry,
                  orderItems[l].dscription = invoiceResultItem[k].Dscription,
                  orderItems[l].quantity = invoiceResultItem[k].Quantity,
                  orderItems[l].price = invoiceResultItem[k].Price,
                  orderItems[l].discPrcnt = invoiceResultItem[k].DiscPrcnt,
                  orderItems[l].grossTotal = invoiceResultItem[k].LineTotal,
                  orderItems[l].whsCode = invoiceResultItem[k].WhsCode,
                  orderItems[l].taxStatus = invoiceResultItem[k].TaxStatus,
                  orderItems[l].useBaseUn = invoiceResultItem[k].UseBaseUn,
                  orderItems[l].uomEntry = invoiceResultItem[k].UomEntry,
                  orderItems[l].uomCode = invoiceResultItem[k].UomCode,
                  orderItems[l].u_PrcType = invoiceResultItem[k].U_PrcType,
                  orderItems[l].u_TaxAmt = invoiceResultItem[k].U_TaxAmt,
                  orderItems[l].u_GrossAmt = invoiceResultItem[k].U_GrossAmt,
                  orderItems[l].vatSum = invoiceResultItem[k].VatSum,
                  orderItems[l].inclusivePrice = invoiceResultItem[k].InclusivePrice,
                  orderItems[l].exclusivePrice = invoiceResultItem[k].ExclusivePrice,
                  orderItems[l].weightItem = invoiceResultItem[k].Weight,
                  orderItems[l].unitDisplyItem = invoiceResultItem[k].UnitDisply,
                  orderItems[l].baseRef = invoiceResultItem[k].BaseRef,
                  orderItems[l].baseType = invoiceResultItem[k].BaseType,
                  orderItems[l].vatGroup = invoiceResultItem[k].VatGroup,
                  orderItems[l].updatedAt = new Date();
              }
            }
            let entry = orderItems.find(function (e) { return e.itemCode === invoiceResultItem[k].ItemCode; });
            // console.log("entryVal", entry);
            if (!entry) {
              let itemData = {
                docEntry: invoiceResultItem[k].DocEntry,
                lineNum: invoiceResultItem[k].LineNum,
                itemCode: invoiceResultItem[k].ItemCode,
                dscription: invoiceResultItem[k].Dscription,
                quantity: invoiceResultItem[k].Quantity,
                price: invoiceResultItem[k].Price,
                discPrcnt: invoiceResultItem[k].DiscPrcnt,
                grossTotal: invoiceResultItem[k].LineTotal,
                whsCode: invoiceResultItem[k].WhsCode,
                taxStatus: invoiceResultItem[k].TaxStatus,
                useBaseUn: invoiceResultItem[k].UseBaseUn,
                uomEntry: invoiceResultItem[k].UomEntry,
                uomCode: invoiceResultItem[k].UomCode,
                u_PrcType: invoiceResultItem[k].U_PrcType,
                u_TaxAmt: invoiceResultItem[k].U_TaxAmt,
                u_GrossAmt: invoiceResultItem[k].U_GrossAmt,
                vatSum: invoiceResultItem[k].VatSum,
                inclusivePrice: invoiceResultItem[k].InclusivePrice,
                exclusivePrice: invoiceResultItem[k].ExclusivePrice,
                weightItem: invoiceResultItem[k].Weight,
                unitDisplyItem: invoiceResultItem[k].UnitDisply,
                baseRef: invoiceResultItem[k].BaseRef,
                baseType: invoiceResultItem[k].BaseType,
                vatGroup: invoiceResultItem[k].VatGroup,
                updatedAt: new Date()
              }
              orderItems.push(itemData);
              // console.log("entryVal11", orderItems);
            }
          } else {
            orderItems = [];
            // console.log("orderResultItem555", invoiceResultItem);
            let itemData = {
              docEntry: invoiceResultItem[k].DocEntry,
              lineNum: invoiceResultItem[k].LineNum,
              itemCode: invoiceResultItem[k].ItemCode,
              dscription: invoiceResultItem[k].Dscription,
              quantity: invoiceResultItem[k].Quantity,
              price: invoiceResultItem[k].Price,
              discPrcnt: invoiceResultItem[k].DiscPrcnt,
              grossTotal: invoiceResultItem[k].LineTotal,
              whsCode: invoiceResultItem[k].WhsCode,
              taxStatus: invoiceResultItem[k].TaxStatus,
              useBaseUn: invoiceResultItem[k].UseBaseUn,
              uomEntry: invoiceResultItem[k].UomEntry,
              uomCode: invoiceResultItem[k].UomCode,
              u_PrcType: invoiceResultItem[k].U_PrcType,
              u_TaxAmt: invoiceResultItem[k].U_TaxAmt,
              u_GrossAmt: invoiceResultItem[k].U_GrossAmt,
              vatSum: invoiceResultItem[k].VatSum,
              inclusivePrice: invoiceResultItem[k].InclusivePrice,
              exclusivePrice: invoiceResultItem[k].ExclusivePrice,
              weightItem: invoiceResultItem[k].Weight,
              unitDisplyItem: invoiceResultItem[k].UnitDisply,
              baseRef: invoiceResultItem[k].BaseRef,
              baseType: invoiceResultItem[k].BaseType,
              vatGroup: invoiceResultItem[k].VatGroup,
              updatedAt: new Date()
            }

            orderItems.push(itemData);
            // console.log("itemData", orderItems);
          }

          let totalQty = 0;
          let itemsQty = orderItems;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          SupplierInvoice.update(invoiceData[0]._id, {
            $set: {
              itemLines: orderItems,
              totalQty: totalQty.toString(),
              totalItem: itemsQty.length.toString(),
              updatedAt: new Date()
            }
          });
        }
      }
    }
    else {
      console.log("invoice item else")
      CronResult.insert({
        name: 'Supplier Purchase Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
    }
  });

}

function apiCallCustomerInvoice(customerName) {
  console.log("invoiceCustomerApiCall");
  let base_url = Config.findOne({
    name: 'base_url'
  }).value;
  let dbId = Config.findOne({
    name: 'dbId'
  }).value;
  let customerCode = "'" + customerName + "'";
  console.log("customerCode-customer", customerCode);
  let url = base_url + customerInvoiceGet_Url;
  let dataArray = {
    dbId: dbId,
    cardCodes: customerCode
  };
  let options = {
    data: dataArray,
    headers: {
      'content-type': 'application/json'
    }
  };
  console.log("dataArrayInvoice", dataArray);
  HTTP.call("POST", url, options, (err, result) => {
    if (err && result !== undefined) {
      console.log("err", err);
      CronResult.insert({
        name: 'Customer Invoice Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      CronResult.insert({
        name: 'Customer Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      return err;

    } else if (result.data !== undefined && result.data !== null) {
      // console.log("resInvoice", result.data.data);
      let invoiceResult = result.data.data;
      for (let i = 0; i < invoiceResult.length; i++) {
        let invoiceFind = Invoice.find({
          cardCode: invoiceResult[i].CardCode,
          docNum: invoiceResult[i].DocNum,
          docEntry: invoiceResult[i].DocEntry
        }).fetch();
        if (invoiceFind.length === 0 || invoiceFind === undefined) {
          Invoice.insert({
            deliveryDocNum: '',
            cardCode: invoiceResult[i].CardCode,
            cardName: invoiceResult[i].CardName,
            branch: invoiceResult[i].BPLId,
            branchName: invoiceResult[i].BPLName,
            employeeId: '',
            userId: '',
            docDueDate: invoiceResult[i].DocDueDate,
            dueDate: invoiceResult[i].DocDueDate,
            docStatus: invoiceResult[i].DocStatus,
            docEntry: invoiceResult[i].DocEntry,
            canceled: invoiceResult[i].CANCELED,
            docDate: new Date(moment(invoiceResult[i].DocDate).format('YYYY-MM-DD')),
            docDateIso: new Date(invoiceResult[i].DocDate),
            beforeDiscount: invoiceResult[i].DocTotal,
            afterDiscount: invoiceResult[i].DocTotal,
            GST: invoiceResult[i].VatSum,
            discountPercentage: invoiceResult[i].DiscPrcnt,
            remark_order: invoiceResult[i].Comments,
            docTotal: invoiceResult[i].DocTotal,
            grandTotal: invoiceResult[i].DocTotal,
            docNum: invoiceResult[i].DocNum,
            currency: '',
            transporterName: '',
            vehicleNoAssignee: '',
            driverName: '',
            deliveryStatus: '',
            assignedTo: '',
            priceMode: invoiceResult[i].PriceMode,
            priceType: '',
            orderId: [],
            flag: true,
            creditInv: true,
            weight: invoiceResult[i].Weight,
            invName: true,
            SAPSync: true,
            address: invoiceResult[i].Address,
            numAtCard: invoiceResult[i].NumAtCard,
            discPrcnt: invoiceResult[i].DiscPrcnt,
            discSum: invoiceResult[i].DiscSum,
            docCur: invoiceResult[i].DocCur,
            paidToDate: invoiceResult[i].PaidToDate,
            unitDisply: invoiceResult[i].UnitDisply,
            slpName: invoiceResult[i].SlpName,
            createdAt: new Date(),
            uuid: Random.id()
          });
        }
        else {
          Invoice.update(invoiceFind[0]._id, {
            $set: {
              deliveryDocNum: '',
              cardCode: invoiceResult[i].CardCode,
              cardName: invoiceResult[i].CardName,
              branch: invoiceResult[i].BPLId,
              branchName: invoiceResult[i].BPLName,
              employeeId: '',
              userId: '',
              docDueDate: invoiceResult[i].DocDueDate,
              dueDate: invoiceResult[i].DocDueDate,
              docStatus: invoiceResult[i].DocStatus,
              docEntry: invoiceResult[i].DocEntry,
              canceled: invoiceResult[i].CANCELED,
              docDate: new Date(moment(invoiceResult[i].DocDate).format('YYYY-MM-DD')),
              docDateIso: new Date(invoiceResult[i].DocDate),
              beforeDiscount: invoiceResult[i].DocTotal,
              afterDiscount: invoiceResult[i].DocTotal,
              GST: invoiceResult[i].VatSum,
              discountPercentage: invoiceResult[i].DiscPrcnt,
              remark_order: invoiceResult[i].Comments,
              docTotal: invoiceResult[i].DocTotal,
              grandTotal: invoiceResult[i].DocTotal,
              docNum: invoiceResult[i].DocNum,
              currency: '',
              transporterName: '',
              vehicleNoAssignee: '',
              driverName: '',
              deliveryStatus: '',
              assignedTo: '',
              priceMode: invoiceResult[i].PriceMode,
              priceType: '',
              orderId: [],
              flag: true,
              creditInv: true,
              weight: invoiceResult[i].Weight,
              invName: true,
              SAPSync: true,
              address: invoiceResult[i].Address,
              numAtCard: invoiceResult[i].NumAtCard,
              discPrcnt: invoiceResult[i].DiscPrcnt,
              discSum: invoiceResult[i].DiscSum,
              docCur: invoiceResult[i].DocCur,
              paidToDate: invoiceResult[i].PaidToDate,
              unitDisply: invoiceResult[i].UnitDisply,
              slpName: invoiceResult[i].SlpName,
              updatedAt: new Date()
            }
          });
        }
      }
      // for invoice item
      apiCallCustomerInvoiceItem(customerName);
    }
    else {
      console.log("invoice error else");
      CronResult.insert({
        name: 'Customer Invoice Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      CronResult.insert({
        name: 'Customer Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
    }
  });
}

function apiCallCustomerInvoiceItem(customerName) {
  console.log("CustomerinvoiceItem");
  let base_url = Config.findOne({
    name: 'base_url'
  }).value;
  let dbId = Config.findOne({
    name: 'dbId'
  }).value;
  let customerCode = "'" + customerName + "'";
  console.log("customerCode-inv", customerCode);
  let url = base_url + updatedCustomerInvoiceGet_Url;
  let dataArray = {
    dbId: dbId,
    cardCodes: customerCode
  };
  let options = {
    data: dataArray,
    headers: {
      'content-type': 'application/json'
    }
  };
  console.log("dataArrayinvoiceItem", dataArray);
  HTTP.call("POST", url, options, (itemErr, itemresult) => {
    if (itemErr && itemresult !== undefined) {
      console.log("err", itemErr);
      CronResult.insert({
        name: 'Customer Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
      return itemErr;

    } else if (itemresult.data !== undefined && itemresult.data !== null) {
      let invoiceResultItem = itemresult.data.data;
      // console.log("invoiceItemResult", invoiceResultItem)
      for (let k = 0; k < invoiceResultItem.length; k++) {
        let invoiceData = Invoice.find({ docEntry: invoiceResultItem[k].DocEntry }).fetch();
        if (invoiceData.length > 0) {
          let orderItems = [];
          orderItems = invoiceData[0].itemLines;
          // console.log("orderItems", orderItems)
          if (orderItems !== '' && orderItems !== undefined) {
            for (let l = 0; l < orderItems.length; l++) {
              // console.log("55666655sadgfhtfbv");
              if (orderItems[l].itemCode === invoiceResultItem[k].ItemCode) {
                orderItems[l].docEntry = invoiceResultItem[k].DocEntry,
                  orderItems[l].baseLine = invoiceResultItem[k].LineNum,
                  orderItems[l].docEntry = invoiceResultItem[k].DocEntry,
                  orderItems[l].itemNam = invoiceResultItem[k].Dscription,
                  orderItems[l].quantity = invoiceResultItem[k].Quantity,
                  orderItems[l].price = invoiceResultItem[k].Price,
                  orderItems[l].unitPrice = invoiceResultItem[k].Price,
                  orderItems[l].salesPrice = invoiceResultItem[k].Price,
                  orderItems[l].incPrice = invoiceResultItem[k].Price,
                  orderItems[l].excPrice = invoiceResultItem[k].Price,
                  orderItems[l].vatGroup = invoiceResultItem[k].VatGroup,
                  orderItems[l].category = '',
                  orderItems[l].discPrcnt = invoiceResultItem[k].DiscPrcnt,
                  orderItems[l].grossTotal = invoiceResultItem[k].LineTotal,
                  orderItems[l].whsCode = invoiceResultItem[k].WhsCode,
                  orderItems[l].taxStatus = invoiceResultItem[k].TaxStatus,
                  orderItems[l].useBaseUn = invoiceResultItem[k].UseBaseUn,
                  orderItems[l].uomEntry = invoiceResultItem[k].UomEntry,
                  orderItems[l].uomCode = invoiceResultItem[k].UomCode,
                  orderItems[l].u_PrcType = invoiceResultItem[k].U_PrcType,
                  orderItems[l].taxRate = invoiceResultItem[k].U_TaxAmt,
                  orderItems[l].u_GrossAmt = invoiceResultItem[k].U_GrossAmt,
                  orderItems[l].vatSum = invoiceResultItem[k].VatSum,
                  orderItems[l].invWeight = invoiceResultItem[k].Weight,
                  orderItems[l].unitDisplyItem = invoiceResultItem[k].UnitDisply,
                  orderItems[l].baseRef = invoiceResultItem[k].BaseRef,
                  orderItems[l].baseType = invoiceResultItem[k].BaseType,
                  orderItems[l].updatedAt = new Date();
              }
            }
            let entry = orderItems.find(function (e) { return e.itemCode === invoiceResultItem[k].ItemCode; });
            // console.log("entryVal", entry);
            if (!entry) {
              let itemData = {
                docEntry: invoiceResultItem[k].DocEntry,
                baseLine: invoiceResultItem[k].LineNum,
                itemCode: invoiceResultItem[k].ItemCode,
                itemNam: invoiceResultItem[k].Dscription,
                quantity: invoiceResultItem[k].Quantity,
                price: invoiceResultItem[k].Price,
                salesPrice: invoiceResultItem[k].Price,
                unitPrice: invoiceResultItem[k].Price,
                incPrice: invoiceResultItem[k].Price,
                excPrice: invoiceResultItem[k].Price,
                discPrcnt: invoiceResultItem[k].DiscPrcnt,
                grossTotal: invoiceResultItem[k].LineTotal,
                whsCode: invoiceResultItem[k].WhsCode,
                taxStatus: invoiceResultItem[k].TaxStatus,
                useBaseUn: invoiceResultItem[k].UseBaseUn,
                uomEntry: invoiceResultItem[k].UomEntry,
                uomCode: invoiceResultItem[k].UomCode,
                u_PrcType: invoiceResultItem[k].U_PrcType,
                taxRate: invoiceResultItem[k].U_TaxAmt,
                u_GrossAmt: invoiceResultItem[k].U_GrossAmt,
                vatSum: invoiceResultItem[k].VatSum,
                invWeight: invoiceResultItem[k].Weight,
                unitDisplyItem: invoiceResultItem[k].UnitDisply,
                baseRef: invoiceResultItem[k].BaseRef,
                baseType: invoiceResultItem[k].BaseType,
                vatGroup: invoiceResultItem[k].VatGroup,
                updatedAt: new Date()
              }
              orderItems.push(itemData);
              // console.log("entryVal11", orderItems);
            }
          } else {
            orderItems = [];
            // console.log("orderResultItem555", invoiceResultItem);
            let itemData = {
              docEntry: invoiceResultItem[k].DocEntry,
              baseLine: invoiceResultItem[k].LineNum,
              itemCode: invoiceResultItem[k].ItemCode,
              itemNam: invoiceResultItem[k].Dscription,
              quantity: invoiceResultItem[k].Quantity,
              price: invoiceResultItem[k].Price,
              salesPrice: invoiceResultItem[k].Price,
              unitPrice: invoiceResultItem[k].Price,
              incPrice: invoiceResultItem[k].Price,
              excPrice: invoiceResultItem[k].Price,
              discPrcnt: invoiceResultItem[k].DiscPrcnt,
              grossTotal: invoiceResultItem[k].LineTotal,
              whsCode: invoiceResultItem[k].WhsCode,
              taxStatus: invoiceResultItem[k].TaxStatus,
              useBaseUn: invoiceResultItem[k].UseBaseUn,
              uomEntry: invoiceResultItem[k].UomEntry,
              uomCode: invoiceResultItem[k].UomCode,
              u_PrcType: invoiceResultItem[k].U_PrcType,
              taxRate: invoiceResultItem[k].U_TaxAmt,
              u_GrossAmt: invoiceResultItem[k].U_GrossAmt,
              vatSum: invoiceResultItem[k].VatSum,
              invWeight: invoiceResultItem[k].Weight,
              unitDisplyItem: invoiceResultItem[k].UnitDisply,
              baseRef: invoiceResultItem[k].BaseRef,
              baseType: invoiceResultItem[k].BaseType,
              vatGroup: invoiceResultItem[k].VatGroup,
              updatedAt: new Date()
            }

            orderItems.push(itemData);
            // console.log("itemData", orderItems);
          }

          let totalQty = 0;
          let itemsQty = orderItems;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          Invoice.update(invoiceData[0]._id, {
            $set: {
              itemLines: orderItems,
              totalQty: totalQty.toString(),
              totalItem: itemsQty.length.toString(),
              updatedAt: new Date()
            }
          });
        }
      }
    }
    else {
      console.log("invoice item else")
      CronResult.insert({
        name: 'Customer Invoice Item Cron',
        cardCode: customerName,
        cronResult: false,
        uuid: Random.id(),
        createdAt: new Date()
      });
    }
  });

}
