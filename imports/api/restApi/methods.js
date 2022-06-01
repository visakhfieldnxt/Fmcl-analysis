/**
* @author Visakh
*/
import { allUsers } from '../user/user';
import { Invoice } from '../invoice/invoice';
import { ArInvoicePayment } from '../arInvoice+Payment/arInvoice+Payment';
import { Branch } from '../branch/branch';
import { SalesReturn } from '../salesReturn/salesReturn';
import { WareHouseStock } from '../wareHouseStock/wareHouseStock';
import { WareHouse } from '../wareHouse/wareHouse';
import { CollectionDueToday } from "../collectionDueToday/collectionDueToday";
import { Delivery } from "../delivery/delivery";
import { Customer } from '../customer/customer';
import { CustomerAddress } from '../customerAddress/customerAddress';
import { CustomerPriceList } from '../customerPriceList/customerPriceList';
import { ItemGetPrice } from '../itemGetPrice/itemGetPrice';
import { Order } from '../order/order';
import { SalesQuotation } from '../salesQuotation/salesQuotation';
import { Item } from '../item/item';
import { Unit } from '../unit/unit';
import { Tax } from '../tax/tax';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Config } from '../config/config';
import { CurrentLocation } from '../currentLocation/currentLocation';
import { RouteAssign } from '../routeAssign/routeAssign';
import { RouteGroup } from '../routeGroup/routeGroup';
import { RouteCustomer } from '../routeCustomer/routeCustomer';
import { RouteUpdates } from '../routeUpdates/routeUpdates';
import { Attendance } from '../attendance/attendance';
import { Lead } from '../lead/lead';
import { CustomerGroup } from '../customerGroup/customerGroup';
import { DemoTable } from '../demoTable/demoTable';
import { SkipRemarks } from '../skipRemarks/skipRemarks';
import { LeadQuotation } from '../leadQuotation/leadQuotation';
import { StockTransfer } from '../stockTransfer/stockTransfer';
import { StockTransferSerialNo } from '../stockTransferSerialNo/stockTransferSerialNo';
import { SalesSummaryReport } from "../salesSummaryReport/salesSummaryReport";
import { Expense } from '../expense/expense';
import { ExpenseCategory } from "../expenseCategory/expenseCategory";
import moment from 'moment';
import { StockSummaryRep } from '../stockSummaryRep/stockSummaryRep';
import { LocationNotification } from '../locationNotification/locationNotification';
import { TempSerialNo } from '../tempSerialNo/tempSerialNo';
import { ReturnReason } from '../returnReason/returnReason';
JsonRoutes.ErrorMiddleware.use(RestMiddleware.handleErrorAsJson);
// JsonRoutes.Middleware.use(JsonRoutes.Middleware.parseBearerToken);
// JsonRoutes.Middleware.use(JsonRoutes.Middleware.authenticateMeteorUserByToken);

// Handle errors specifically for the login routes correctly
// JsonRoutes.ErrorMiddleware.use('/addNumbers', RestMiddleware.handleErrorAsJson);

JsonRoutes.Middleware.use(function (req, res, next) {
  next();
  // For Future
  // if (req.authToken  === undefined && req.url !=='/users/login') {    
  //   JsonRoutes.sendResult(res, {
  //     code:401,
  //     data: {
  //       data: "You are not authorized to access this URL"
  //     }
  //   });
  // }else{
  //   console.log("else............");   
  // if(req.url !== '/users/login'){


  //     const user = Meteor.users.findOne({
  //       "services.password.reset.token": req.authToken});
  //     if (!user) { // never existed or already been used
  //       console.log("never existed or already been used");        
  //       // throw new Meteor.Error(403, "Token expired");
  //       JsonRoutes.sendResult(res, {
  //         code:403,
  //         data: {
  //           data: "Token expired"
  //         }
  //       });
  //     }else {
  //       const when = user.services.password.reset.when;
  //       const reason = user.services.password.reset.reason;
  //       let tokenLifetimeMs = Accounts._getPasswordResetTokenLifetimeMs();
  //       if (reason === "enroll") {
  //         tokenLifetimeMs = Accounts._getPasswordEnrollTokenLifetimeMs();   
  //         console.log("enroll");        

  //       }
  //       const currentTimeMs = Date.now();
  //       if ((currentTimeMs - when) > tokenLifetimeMs) { // timeout
  //         console.log("timeout");        
  //         JsonRoutes.sendResult(res, {
  //           code:403,
  //           data: {
  //             data: "Token expired"
  //           }
  //         });
  //         // throw new Meteor.Error(403, "Token expired");
  //       }else{
  //         next();

  //       }
  //     }    
  //   }else{next();}
  // }
});


// /**
//  * Sample POST method for getting the requested body
//  */
// JsonRoutes.add("POST", "/addNumbers", function (req, res, next) {

//   // In the req.body will get the requested params and values.
//   console.log("req", req);

//   //  Do the methods and all coding here and send the only result on data.

//   JsonRoutes.sendResult(res, {
//     data: req.body
//   });
// });


/**
 * Sample POST method for getting the requested body
 * Done By : Nithin
 * Date : 06/01/21
 */
JsonRoutes.add('POST', '/login', function (req, res) {
  let options = req.body;

  let user = '';
  // if (options.hasOwnProperty('email')) {
  //   check(options, {
  //     email: String,
  //     password: String,
  //   });
  //   user = Meteor.users.findOne({ 'emails.address': options.email });
  // } else {
  check(options, {
    username: String,
    password: String,
    latitude: String,
    longitude: String,
  });
  user = Meteor.users.findOne({ username: options.username });
  // }
  if (user === undefined || user === '') {
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "User with that username or email address not found",
        data: {},
      }
    });
  }
  else {

    let result = Accounts._checkPassword(user, options.password);
    check(result, {
      userId: String,
      error: Match.Optional(Meteor.Error),
    });
    if (result.error) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "Incorrect Password",
          data: {},
        }
      });
      // throw result.error;
    }
    else {

      let stampedLoginToken = Accounts._generateStampedLoginToken();
      check(stampedLoginToken, {
        token: String,
        when: Date,
      });

      Accounts._insertLoginToken(result.userId, stampedLoginToken);

      let tokenExpiration = Accounts._tokenExpiration(stampedLoginToken.when);
      check(tokenExpiration, Date);

      let userDetails = Meteor.users.find({ _id: result.userId, userType: 'V', active: 'Y' }).fetch();

      let userArray = '';
      if (userDetails !== undefined && userDetails.length > 0) {

        for (let i = 0; i < userDetails.length; i++) {
          let firstName = userDetails[i].profile.firstName;
          let lastName = userDetails[i].profile.lastName;
          let contactNo = userDetails[i].contactNo;
          let empCode = userDetails[i].profile.empCode;
          let branch = userDetails[i].branch;
          let defaultBranch = '';
          let defaultBranchName = '';
          let branchArray = [];
          let priceList = '';
          let priceListName = '';
          let currency = '';
          let currencyValue = Config.findOne({ name: 'currency' });
          if (currencyValue) {
            currency = currencyValue.value;
          }

          let priceMode = '';
          let custPriceRes = CustomerPriceList.findOne({ cardCode: userDetails[i].cardCode, bPLId: userDetails[i].defaultBranch });
          if (custPriceRes !== undefined) {
            priceList = custPriceRes.prcList;
            priceListName = custPriceRes.pLName;
          }

          let customerDetails = Customer.findOne({ cardCode: userDetails[i].cardCode });
          if (customerDetails !== undefined) {
            priceMode = customerDetails.priceMode;
          }
          if (branch !== undefined) {
            // for (let j = 0; j < branch.length; j++) {
            //   let branchRes = Branch.findOne({ bPLId: branch[j] });
            //   if (branchRes !== undefined && branchRes !== '') {
            //     branchArray.push({ bPLId: branch[j], bPLName: branchRes.bPLName })
            //   }
            // }
            defaultBranch = userDetails[i].defaultBranch;
            defaultBranchName = userDetails[i].defaultBranchName;
          }
          let defaultWareHouse = '';
          let defaultWareHouseName = '';
          defaultWareHouse = userDetails[i].defaultWareHouse;
          defaultWareHouseName = userDetails[i].defaultWareHouseName;
          userArray = {
            id: result.userId, token: stampedLoginToken.token, tokenExpires: tokenExpiration,
            firstName: firstName, lastName: lastName, contactNo: contactNo.toString(), empCode: empCode,
            defaultBranch: defaultBranch, defaultBranchName: defaultBranchName, defaultWareHouse: defaultWareHouse,
            defaultWareHouseName: defaultWareHouseName, customerName: userDetails[i].cardName,
            customerCode: userDetails[i].cardCode, priceList: priceList, priceListName: priceListName, priceMode: priceMode, vansaleFullName: userDetails[i].vansaleFullName, vehicleNumber: userDetails[i].vehicleNumber,
            lorryBoy: userDetails[i].lorryBoy, driverNumber: userDetails[i].driverNumber, driverName: userDetails[i].driverName, currency: currency,
          }
        }
      }
      else {
        JsonRoutes.sendResult(res, {
          code: 404,
          data: {
            code: 404,
            message: "not found",
            data: {},
          }
        });
      }
      if (userArray !== undefined && userArray !== '') {
        JsonRoutes.sendResult(res, {
          code: 200,
          data: {
            code: 200,
            message: "success",
            data: userArray,
          }
        });
        locationUpdatesFun(result.userId, new Date(), options.latitude, options.longitude, "Login");
      }
      // JsonRoutes.sendResult(res, {
      //   code: 200,
      //   data: {
      //     code: 200,
      //     message: "success",
      //     data: {
      //       id: result.userId,
      //       token: stampedLoginToken.token,
      //       tokenExpires: tokenExpiration,
      //     },
      //   }
      // });
    }
  }
});



/** old requirement
 * Sample GET method for calling the Customer details accoriding to user branch
 * Done By : Nithin
 * Date : 06/01/21
 */
JsonRoutes.add("GET", "/customerList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id -", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let branch = [];
          let customersArray = [];
          branch = user.defaultBranch;
          let customerPriceList = CustomerPriceList.find().fetch();
          // console.log("custList",customerPriceList);
          if (branch !== '' && branch !== undefined) {
            customersArray = Customer.find({ bPLId: branch, cardType: "C" }, {
              fields: {
                cardName: 1, cardCode: 1, balance: 1, creditLine: 1, priceMode: 1,
                address: 1, phone1: 1, mailAddres: 1, cntctPrsn: 1, priceList: 1
              }
            }).fetch();

            for (let i = 0; i < customersArray.length; i++) {
              let priceList = customerPriceList.find(x => x.cardCode === customersArray[i].cardCode && x.bPLId === branch);
              // console.log("prcList",priceList);
              if (priceList !== undefined) {
                customersArray[i].priceList = priceList.prcList;
              } else {
                customersArray.splice(i, 1);
              }
            }
            if (customersArray !== undefined && customersArray.length > 0) {
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "success",
                  data: customersArray
                },
              });
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "not found",
                  data: []
                }
              });
            }
          }
          else {
            // console.log("Branch Undefined..!");
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample GET method for calling the Customer master details accoriding to user route
 * Done By : Nithin
 * Date : 18/01/21
 */
JsonRoutes.add("GET", "/routeCustomerMaster/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id -", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeDates = new Date(todayDates);
          let routeEndDate = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let routeArray = [];
          let routeRes = RouteAssign.find({
            routeDateIso: {
              $lt: routeDates,
            }, routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id, active: "Y"
          }, { fields: { routeId: 1, routeDate: 1, routeStatus: 1, routeDateEnd: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            for (let j = 0; j < routeRes.length; j++) {
              let routeCode = '';
              let routeName = '';
              let branchGet = '';
              // get route details
              let routeGrupRes = RouteGroup.findOne({ _id: routeRes[j].routeId });
              if (routeGrupRes !== undefined) {
                routeCode = routeGrupRes.routeCode;
                routeName = routeGrupRes.routeName;
                branchGet = routeGrupRes.branchCode;
              }
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[j].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let k = 0; k < routeCustomerDetails.length; k++) {
                  // get customer priceList deatils
                  let custPriceRes = CustomerPriceList.findOne({ cardCode: routeCustomerDetails[k].customer, bPLId: user.defaultBranch });
                  // get customer deatils
                  let customerData = Customer.findOne({ cardCode: routeCustomerDetails[k].customer },
                    {
                      fields: {
                        cardName: 1, cardCode: 1, balance: 1, creditLine: 1, priceMode: 1,
                        address: 1, phone1: 1, mailAddres: 1, cntctPrsn: 1, priceList: 1,
                        glblLocNum: 1, acctName: 1
                      }
                    });
                  let customerAddressGet = CustomerAddress.findOne({ _id: routeCustomerDetails[k].address, }, {
                    fields: {
                      latitude: 1, longitude: 1, fencingArea: 1, address: 1
                    }
                  });
                  let customerBalance = '';
                  let customerCreditLine = '';
                  let customerPriceMode = '';
                  let customerPriceList = '';
                  let customerAddress = '';
                  let customerPhone1 = '';
                  let customerMailAddres = '';
                  let customercntctPrsn = '';
                  let priceList = '';
                  let priceListName = '';
                  let customerName = '';
                  if (custPriceRes !== undefined) {
                    priceList = custPriceRes.prcList;
                    priceListName = custPriceRes.pLName;
                  }
                  let longitude = '';
                  let latitude = '';
                  let fencArea = '';
                  let addressValue = '';

                  if (customerData !== undefined) {
                    customerBalance = customerData.balance;
                    customerCreditLine = customerData.creditLine;
                    customerPriceMode = customerData.priceMode;
                    customerPriceList = customerData.priceList;
                    customerAddress = customerData.address;
                    customerPhone1 = customerData.phone1;
                    customerMailAddres = customerData.mailAddres;
                    customercntctPrsn = customerData.cntctPrsn;
                    customerName = customerData.cardName;
                    customerTPIN = customerData.glblLocNum;
                    customerAccName = customerData.acctName;
                  }
                  if (customerAddressGet !== undefined) {
                    addressValue = customerAddressGet.address;
                    if (customerAddressGet.latitude) { latitude = customerAddressGet.latitude; };
                    if (customerAddressGet.longitude) { longitude = customerAddressGet.longitude; };
                    if (customerAddressGet.fencingArea) { fencArea = customerAddressGet.fencingArea; } else { fencArea = Config.findOne({ name: "fencingArea" }).value };
                  }
                  else {
                    fencArea = Config.findOne({ name: "fencingArea" }).value
                  }
                  let routeObj =
                  {
                    routeId: routeRes[j]._id,
                    routeCode: routeCode,
                    routeName: routeName,
                    routeDate: routeRes[j].routeDate,
                    routeStatus: routeRes[j].routeStatus,
                    routeEndDate: routeRes[j].routeDateEnd,
                    cardName: customerName,
                    customerTPIN: customerTPIN,
                    customerAccName: customerAccName,
                    cardCode: routeCustomerDetails[k].customer,
                    branch: branchGet,
                    balance: customerBalance,
                    creditLine: customerCreditLine,
                    priceMode: customerPriceMode,
                    address: addressValue,
                    addressId: routeCustomerDetails[k].address,
                    phone1: customerPhone1,
                    mailAddres: customerMailAddres,
                    cntctPrsn: customercntctPrsn,
                    priceList: priceList,
                    priceListName: priceListName,
                    priority: routeCustomerDetails[k].priority,
                    latitude: latitude,
                    longitude: longitude,
                    fencingArea: fencArea
                  }
                  routeArray.push(routeObj);
                }
              }
            }
          }

          if (routeArray !== undefined && routeArray.length > 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: routeArray
              },
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});





/**
 * Sample GET method for calling the item full list accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/itemFullList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let itemList = [];
          let itemFullList = Item.find({ active: "Y" }, { fields: { itemCode: 1, invntryUom: 1, itemNam: 1, ugpCode: 1, vatGourp: 1, taxRate: 1, u_MVATPerStockUnit: 1 } }).fetch();
          if (itemFullList !== undefined && itemFullList.length > 0) {
            for (let i = 0; i < itemFullList.length; i++) {
              let itemObj =
              {
                itemCode: itemFullList[i].itemCode,
                itemNam: itemFullList[i].itemNam,
                ugpCode: itemFullList[i].ugpCode,
                vatGourp: itemFullList[i].vatGourp,
                taxRate: itemFullList[i].taxRate,
                u_MVATPerStockUnit: itemFullList[i].u_MVATPerStockUnit,
                invntryUom: itemFullList[i].invntryUom,
              }
              itemList.push(itemObj);
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
          if (itemList !== undefined && itemList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: itemList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for calling the unit accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/unitFullList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let unitList = [];
          let unitFullList = Unit.find({}, { fields: { ugpCode: 1, uomCode: 1, baseQty: 1, uomEntry: 1 } }).fetch();
          if (unitFullList !== undefined && unitFullList.length > 0) {
            for (let i = 0; i < unitFullList.length; i++) {
              let unitObj =
              {
                uomCode: unitFullList[i].uomCode,
                uomEntry: unitFullList[i].uomEntry,
                ugpCode: unitFullList[i].ugpCode,
                baseQty: unitFullList[i].baseQty,
              }
              unitList.push(unitObj);
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
          if (unitList !== undefined && unitList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: unitList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for creating sales order
 * Done By Nithin 
 * Date 08-01-2020
 */
JsonRoutes.add("POST", "/addSalesOrder", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let custAddress = req.body.addressId;
          let routeId = req.body.routeId;
          let customerName = '';
          let customerAddress = '';
          let street = '';
          let block = '';
          let city = '';
          let routeGroup = '';
          if (req.body.routeId) {
            let routeCheck = RouteAssign.findOne({ _id: req.body.routeId }, {
              fields: { routeId: 1 }
            });
            if (routeCheck) {
              routeGroup = routeCheck.routeId;
            }
          }
          console.log("dddd");
          let customerRes = Customer.findOne({ cardCode: req.body.customer });
          if (customerRes) {
            customerName = customerRes.cardName;
          }
          if (custAddress !== undefined && custAddress !== '') {
            let addressRes = CustomerAddress.findOne({ _id: custAddress });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          else {
            let addressRes = CustomerAddress.findOne({ cardCode: req.body.customer, addressType: "S" });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          let branchName = '';
          let branchRes = Branch.findOne({ bPLId: req.body.branch });
          if (branchRes) {
            branchName = branchRes.bPLName;
          }

          let priceTypeName = '';
          let priceTypeRes = CustomerPriceList.findOne({ prcList: req.body.priceType });
          if (priceTypeRes) {
            priceTypeName = priceTypeRes.pLName;
          }
          let salesManName = '';
          let userres = Meteor.users.findOne({ _id: req.body.employee });
          if (userres) {
            salesManName = `${userres.profile.firstName} ${userres.profile.lastName}`;
          }
          let totalQty = 0;
          let itemsQty = req.body.itemLines;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          let itemArrayVal = [];
          let grosTotal = 0;
          if (req.body.itemLines.length > 0) {
            for (let x = 0; x < req.body.itemLines.length; x++) {
              let itemName = '';
              let itemRes = Item.findOne({ itemCode: req.body.itemLines[x].itemCode });
              if (itemRes) {
                itemName = itemRes.itemNam;
              }

              let taxName = '';
              let taxRes = Tax.findOne({ taxCode: req.body.itemLines[x].vatGroup });
              if (taxRes) {
                taxName = taxRes.name;
              }

              let uoMEntryVal = '';
              let unitRes = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode });
              if (unitRes) {
                uoMEntryVal = unitRes.uomEntry;
              }
              // let grossTotalVal = (Number(req.body.itemLines[x].grossTotal) * Number(req.body.itemLines[x].quantity));
              let beforeDiscountVal = (Number(req.body.itemLines[x].incPrice) * Number(req.body.itemLines[x].quantity));
              let itemObj =
              {
                randomId: Random.id(),
                uoMEntry: uoMEntryVal,
                unitQuantity: req.body.itemLines[x].unitQuantity,
                uomCode: req.body.itemLines[x].uomCode,
                unitPrice: req.body.itemLines[x].unitPrice,
                price: req.body.itemLines[x].unitPrice,
                salesPrice: req.body.itemLines[x].unitPrice,
                grossTotal: req.body.itemLines[x].grossTotal,
                incPrice: req.body.itemLines[x].incPrice,
                excPrice: req.body.itemLines[x].excPrice,
                itemCategory: '',
                itemCode: req.body.itemLines[x].itemCode,
                mVATBoolean: '',
                u_MVATPerStockUnit: '',
                invWeight: req.body.itemLines[x].invWeight,
                itemNam: itemName,
                itemRemark: '',
                quantity: req.body.itemLines[x].quantity,
                taxRate: req.body.itemLines[x].taxRate,
                vatGroup: req.body.itemLines[x].vatGroup,
                vatRate: req.body.itemLines[x].vatRate,
                vatGroupName: taxName,
                discount: '0',
                discountAmount: '0',
                whsCode: req.body.itemLines[x].whsCode,
                beforeDiscount: beforeDiscountVal.toString(),
                afterDiscount: beforeDiscountVal.toString(),
                baseLine: req.body.itemLines[x].baseLine,
              }
              itemArrayVal.push(itemObj);
            }
          }
          let currentDate = moment(new Date()).format('YYYY-MM-DD');
          console.log("currentDate", currentDate);
          let totalAmount = 0;
          let approvalValue = false;
          let orderBalance = customerRes.ordersBal;
          let balanceValue = customerRes.balance;
          let creditLimit = customerRes.creditLine;
          let extraAmt = 0;
          let branchArrayCheck = [];
          let customerArrayCheck = [];
          branchArrayCheck.push('4');
          branchArrayCheck.push('1');
          branchArrayCheck.push('3');
          branchArrayCheck.push('6');
          branchArrayCheck.push('7');
          customerArrayCheck.push('CGZL00000988');
          customerArrayCheck.push('CGZL00000938');
          customerArrayCheck.push('CGZL00000032');
          customerArrayCheck.push('CGZL00000056');
          customerArrayCheck.push('CGZL00000937');
          customerArrayCheck.push('CGZL00000993');
          customerArrayCheck.push('CGZL00000535');
          customerArrayCheck.push('CGZL00000970');
          customerArrayCheck.push('CGZL00000003');
          customerArrayCheck.push('CGZL00000009');
          customerArrayCheck.push('CGZL00000935');
          customerArrayCheck.push('CGZL00000041');
          customerArrayCheck.push('CGZL00000963');
          customerArrayCheck.push('CGZL00000934');
          customerArrayCheck.push('CGZL00000987');
          customerArrayCheck.push('CGZL00000018');
          customerArrayCheck.push('CGZL00001076');
          customerArrayCheck.push('CGZL00000015');
          customerArrayCheck.push('CGZL00000011');
          customerArrayCheck.push('CGZL00000002');
          customerArrayCheck.push('CGZL00000365');
          customerArrayCheck.push('CGZL00001130');
          customerArrayCheck.push('CGZL00000338');
          customerArrayCheck.push('CGZL00000372');
          customerArrayCheck.push('CGZL00000017');
          customerArrayCheck.push('CGZL00000007');
          customerArrayCheck.push('CGZL00000014');
          // check credit limit condition
          let TotalValue = Number(orderBalance) + Number(balanceValue) + Number(req.body.docTotal);
          let approvalResonArray = [];
          if (TotalValue > creditLimit && branchArrayCheck.includes(req.body.branch) === false && customerArrayCheck.includes(customerRes.cardCode) === false) {
            extraAmt = Number(TotalValue).toFixed(6) - Number(creditLimit).toFixed(6);
            let extAmtVal = Number(extraAmt).toFixed(6);
            let reasonObject1 = {
              reason: "Customer Credit Limit Exceeded.",
              reasonValue: `Exceeded Amount ${extAmtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (ZMW).`

            }
            approvalResonArray.push(reasonObject1);
            approvalValue = true;
          }
          // check bill pending condition
          let invoiceRes = Invoice.find({ cardCode: customerRes.cardCode, dueDate: { $lte: currentDate }, docStatus: 'O', creditInv: true, docNum: { $ne: '' } }).fetch();
          if (invoiceRes.length > 0 && branchArrayCheck.includes(req.body.branch) === false && customerArrayCheck.includes(customerRes.cardCode) === false) {
            for (let i = 0; i < invoiceRes.length; i++) {
              if (invoiceRes[i].grandTotal === undefined) {
                totalAmount += Number(invoiceRes[i].docTotal);
              }
              else {
                totalAmount += Number(invoiceRes[i].grandTotal);
              }
            }

            let amtVal = Number(totalAmount).toFixed(2)
            let reasonObject = {
              reason: "Customer Payment Is Pending.",
              totalBills: invoiceRes.length,
              totalAmount: Number(totalAmount).toFixed(2),
              reasonValue: `Total Bills Pending ${invoiceRes.length}. Total Bills Amount Pending ${amtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (ZMW) `
            }

            approvalResonArray.push(reasonObject);
            approvalValue = true;
            // console.log("approvalResonArray", approvalResonArray);
          }

          orderCreateFunction(req.body, customerName, customerAddress, branchName, priceTypeName, itemArrayVal,
            totalQty, salesManName, street, city, block, approvalValue, approvalResonArray, routeId);
          locationTransactionWiseFun(id, new Date(), req.body.latitude, req.body.longitude,
            "Sales Order", customerName, routeGroup, req.body.docTotal);
          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Success",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// 

/**
 * Sample GET method for creating sales return
 * Done By Nithin 
 * Date 13-05-2021
 */
JsonRoutes.add("POST", "/addSalesReturn", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let custAddress = req.body.addressId;
          let routeId = req.body.routeId;
          let invoiceNo = req.body.invoiceNo;
          let customerName = '';
          let customerAddress = '';
          let street = '';
          let block = '';
          let city = '';
          let urDta = '';
          console.log("dddd");
          let customerRes = Customer.findOne({ cardCode: req.body.customer });
          if (customerRes) {
            customerName = customerRes.cardName;
          }
          if (custAddress !== undefined && custAddress !== '') {
            let addressRes = CustomerAddress.findOne({ _id: custAddress });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          else {
            let addressRes = CustomerAddress.findOne({ cardCode: req.body.customer, addressType: "S" });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          let branchName = '';
          let branchRes = Branch.findOne({ bPLId: req.body.branch });
          if (branchRes) {
            branchName = branchRes.bPLName;
          }

          let priceTypeName = '';
          let priceTypeRes = CustomerPriceList.findOne({ prcList: req.body.priceType });
          if (priceTypeRes) {
            priceTypeName = priceTypeRes.pLName;
          }
          let salesManName = '';
          let userres = Meteor.users.findOne({ _id: req.body.employee });
          if (userres) {
            salesManName = `${userres.profile.firstName} ${userres.profile.lastName}`;
            urDta = userres;
          }
          let totalQty = 0;
          let itemsQty = req.body.itemLines;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          let itemArrayVal = [];
          let grosTotal = 0;
          if (req.body.itemLines.length > 0) {
            for (let x = 0; x < req.body.itemLines.length; x++) {
              let itemName = '';
              let itemRes = Item.findOne({ itemCode: req.body.itemLines[x].itemCode });
              if (itemRes) {
                itemName = itemRes.itemNam;
              }

              let taxName = '';
              let taxRes = Tax.findOne({ taxCode: req.body.itemLines[x].vatGroup });
              if (taxRes) {
                taxName = taxRes.name;
              }

              let uoMEntryVal = '';
              let unitRes = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode });
              if (unitRes) {
                uoMEntryVal = unitRes.uomEntry;
              }
              // let grossTotalVal = (Number(req.body.itemLines[x].grossTotal) * Number(req.body.itemLines[x].quantity));
              let beforeDiscountVal = (Number(req.body.itemLines[x].incPrice) * Number(req.body.itemLines[x].quantity));
              let itemObj =
              {
                randomId: Random.id(),
                uoMEntry: uoMEntryVal,
                unitQuantity: req.body.itemLines[x].unitQuantity,
                uomCode: req.body.itemLines[x].uomCode,
                unitPrice: req.body.itemLines[x].unitPrice,
                price: req.body.itemLines[x].unitPrice,
                salesPrice: req.body.itemLines[x].unitPrice,
                grossTotal: req.body.itemLines[x].grossTotal,
                incPrice: req.body.itemLines[x].incPrice,
                excPrice: req.body.itemLines[x].excPrice,
                itemCategory: '',
                itemCode: req.body.itemLines[x].itemCode,
                mVATBoolean: '',
                u_MVATPerStockUnit: '',
                invWeight: req.body.itemLines[x].invWeight,
                itemNam: itemName,
                itemRemark: '',
                quantity: req.body.itemLines[x].quantity,
                taxRate: req.body.itemLines[x].taxRate,
                vatGroup: req.body.itemLines[x].vatGroup,
                vatRate: req.body.itemLines[x].vatRate,
                vatGroupName: taxName,
                discount: '0',
                discountAmount: '0',
                whsCode: req.body.itemLines[x].whsCode,
                invoiceNo: invoiceNo,
                returnReason: '',
                returnReasonName: req.body.itemLines[x].returnReason,
                tempIds: req.body.itemLines[x].itemCode + req.body.itemLines[x].uomCode + invoiceNo,
                beforeDiscount: beforeDiscountVal.toString(),
                afterDiscount: beforeDiscountVal.toString(),
                baseLine: req.body.itemLines[x].baseLine,
              }
              itemArrayVal.push(itemObj);
            }

          }
          console.log('hii');
          salesReturnCreateFunction(req.body, customerName, customerAddress, branchName, priceTypeName, itemArrayVal,
            totalQty, salesManName, street, city, block, routeId, urDta, invoiceNo);

          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Success",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// 


/**
 * Sample GET method for calling the Credit Invoice details accoriding to user :- _id
 * Done by Visakh
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/creditInvoiceList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {

          let id = req.params._id;
          let creditInvArray = [];


          let creditInvData = Invoice.find({ userId: id, creditInvoice: true, posValue: { $ne: true }, },
            {
              fields: {
                cardName: 1, address: 1, branchName: 1, cardCode: 1,
                docNum: 1, docDate: 1, grandTotal: 1, crInv_webId: 1, mobileId: 1
              }
            }).fetch();

          if (creditInvData !== undefined && creditInvData.length > 0) {
            for (let i = 0; i < creditInvData.length; i++) {
              let mobileAppId = '';
              if (creditInvData[i].mobileId !== undefined) {
                mobileAppId = creditInvData[i].mobileId;
              }
              let dataObj =
              {
                _id: creditInvData[i]._id,
                cardName: creditInvData[i].cardName,
                cardCode: creditInvData[i].cardCode,
                address: creditInvData[i].address,
                branchName: creditInvData[i].branchName,
                docNum: creditInvData[i].docNum,
                docDate: moment(creditInvData[i].docDate).format("DD-MM-YYYY"),
                docTotal: creditInvData[i].grandTotal,
                crInv_webId: creditInvData[i].crInv_webId,
                mobileId: mobileAppId
              }
              creditInvArray.push(dataObj);
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
          // console.log("History", history.length);
          if (creditInvArray !== undefined && creditInvArray.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: creditInvArray
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End Credit Invoice List
/**
 * Credit Invoice Details from the credit Invoice webId
 * Done By : Visakh
 * Date : 07/01/21
 */

JsonRoutes.add("GET", "/creditInvoiceDetail/:_id/:creditInvoiceId", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.params", req.params);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {

          let id = req.params._id;
          let webId = req.params.creditInvoiceId;


          let history = Invoice.findOne({ _id: webId, creditInvoice: true },
            {
              fields: {
                itemLines: 1
              }
            });
          if (history !== undefined && history.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: history.itemLines
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End Credit Invoice Details

/**
 * Sample GET method for calling the Direct Invoice details accoriding to user :- _id
 * Done By : Visakh
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/arInvoiceList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let arInvoiceArray = [];
          let arInvoiceData = ArInvoicePayment.find({ userId: id },
            {
              fields: {
                cardName: 1, cardCode: 1, address: 1, branchName: 1, arInvId: 1, grandTotal: 1,
                docNum: 1, docDate: 1, docTotal: 1, arInv_WebId: 1, mobileId: 1
              }
            }).fetch();

          if (arInvoiceData !== undefined && arInvoiceData.length > 0) {

            for (let i = 0; i < arInvoiceData.length; i++) {

              let mobileAppId = '';
              if (arInvoiceData[i].mobileId !== undefined) {
                mobileAppId = arInvoiceData[i].mobileId;
              }
              let arObj = {
                _id: arInvoiceData[i]._id,
                cardCode: arInvoiceData[i].cardCode,
                cardName: arInvoiceData[i].cardName,
                address: arInvoiceData[i].address,
                branchName: arInvoiceData[i].branchName,
                docNum: arInvoiceData[i].arInvId,
                docTotal: arInvoiceData[i].grandTotal,
                docDate: moment(arInvoiceData[i].docDate).format('DD-MM-YYYY'),
                arInv_WebId: arInvoiceData[i].arInv_WebId,
                mobileId: mobileAppId,

              };
              arInvoiceArray.push(arObj);
            }

          }

          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "No Data found",
                data: []
              }
            });
          }

          // console.log("History", history.length);
          if (arInvoiceArray !== undefined && arInvoiceArray.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: arInvoiceArray
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End AR Invoice



/**
 * Sample GET method for calling the Direct Invoice details accoriding to user :- _id
 * Done By : Visakh
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/arInvoiceDetail/:_id/:arInvoiceId", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let arInvoiceId = req.params.arInvoiceId;

          let history = ArInvoicePayment.findOne({ _id: arInvoiceId },
            {
              fields: {
                itemLines: 1
              }
            });

          // console.log("History", history.length);
          if (history !== undefined && history.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: history.itemLines
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End Ar Invoice Detail

/**
 * Sample GET method for calling the POS Invoice details accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/posInvoiceList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let dataArrays = [];
          let history = Invoice.find({ userId: id, posValue: true },
            {
              fields: {
                cardName: 1, cardCode: 1, address: 1, branchName: 1, SAPStatus: 1, docStatus: 1,
                docNum: 1, docDate: 1, grandTotal: 1, crInv_webId: 1, mobileId: 1, creditInvoiceDate: 1,
              }
            }).fetch()

          if (history !== undefined && history.length !== 0) {
            for (let i = 0; i < history.length; i++) {
              let mobileAppId = '';
              if (history[i].mobileId !== undefined) {
                mobileAppId = history[i].mobileId;
              }
              let dataObj =
              {
                _id: history[i]._id,
                cardName: history[i].cardName,
                cardCode: history[i].cardCode,
                address: history[i].address,
                branchName: history[i].branchName,
                status: history[i].SAPStatus,
                docStatus: history[i].docStatus,
                docNum: history[i].docNum,
                docTotal: history[i].grandTotal,
                docDate: moment(history[i].creditInvoiceDate).format('DD-MM-YYYY'),
                mobileId: mobileAppId,
                webId: history[i].crInv_webId,
              }
              dataArrays.push(dataObj);
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }

          if (dataArrays !== undefined && dataArrays.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: dataArrays
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End POS Invoice

/**
 * Sample GET method for calling the POS details accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/posInvoiceDetail/:_id/:posInvId", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let posInvId = req.params.posInvId;

          let history = Invoice.findOne({ _id: posInvId },
            {
              fields: {
                itemLines: 1
              }
            });

          // console.log("History", history.length);
          if (history !== undefined) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: history.itemLines
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End POS Invoice Detail

/**
 * Sample GET method for calling the WareHouseStock details accoriding to user warehouse
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/stockList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.params", req.params);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let wareHouses = user.defaultWareHouse;
          let warehouseStocks = [];
          if (wareHouses !== '' && wareHouses !== undefined) {
            let stockDetailVal = WareHouseStock.find({ whsCode: wareHouses },
              {
                fields: {
                  itemCode: 1, bPLId: 1, whsCode: 1, onHand: 1, avgPrice: 1,
                }
              }).fetch();
            if (stockDetailVal !== undefined && stockDetailVal.length > 0) {
              for (let i = 0; i < stockDetailVal.length; i++) {
                let stockObj = {
                  itemCode: stockDetailVal[i].itemCode,
                  bPLId: stockDetailVal[i].bPLId,
                  whsCode: stockDetailVal[i].whsCode,
                  whsName: user.defaultWareHouseName,
                  onHand: stockDetailVal[i].onHand,
                  avgPrice: stockDetailVal[i].avgPrice
                }
                warehouseStocks.push(stockObj);
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "not found",
                  data: []
                }
              });
            }
            if (warehouseStocks !== undefined && warehouseStocks.length > 0) {
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "success",
                  data: warehouseStocks
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: " warehouse not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for calling the Cpre order delivery details accoriding to user :- _id
 */
JsonRoutes.add("GET", "/logout/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: {},
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: {},
            }
          });
        } else {
          let id = req.params._id;
          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Logged out Successfully",
              data: {}
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: {}
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: {}
      }
    });
  }
});



/**
 * Sample GET method for calling the sales order accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/salesOrderList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let salesOrderList = [];
          let orderObj = ''
          let orderGet = Order.find({ employeeId: id }, {
            fields: {
              employeeId: 1, cardName: 1, branchName: 1, mobileId: 1, salesmanName: 1, SAPStatus: 1,
              docDueDate: 1, docStatus: 1, ord_webId: 1, docTotal: 1, orderId: 1, docNum: 1, address: 1, docDate: 1
            }
          }).fetch();
          if (orderGet !== undefined && orderGet.length > 0) {
            for (let i = 0; i < orderGet.length; i++) {
              let mobileAppId = '';
              if (orderGet[i].mobileId !== undefined) {
                mobileAppId = orderGet[i].mobileId;
              }
              orderObj =
              {
                _id: orderGet[i]._id,
                employeeId: orderGet[i].employeeId,
                webId: orderGet[i].ord_webId,
                mobileId: mobileAppId,
                address: orderGet[i].address,
                cardName: orderGet[i].cardName,
                branchName: orderGet[i].branchName,
                docDate: moment(orderGet[i].docDate).format('DD-MM-YYYY'),
                dueDate: moment(orderGet[i].docDueDate).format('DD-MM-YYYY'),
                docStatus: orderGet[i].docStatus,
                docTotal: orderGet[i].docTotal,
                docNum: orderGet[i].orderId,
                employeeName: orderGet[i].salesmanName,
                SAPStatus: orderGet[i].SAPStatus,
              }
              salesOrderList.push(orderObj)
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
          if (salesOrderList !== undefined && salesOrderList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: salesOrderList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample GET method for calling the sales quotation accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/salesSalesQuotationList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let salesQuotationList = [];
          let quotationGet = SalesQuotation.find({ employeeId: id }, {
            fields: {
              employeeId: 1, cardName: 1, branchName: 1, mobileId: 1, salesmanName: 1, SAPStatus: 1,
              docDueDate: 1, docStatus: 1, sQ_webId: 1, docTotal: 1, sQId: 1, orderId: 1, address: 1, docDate: 1
            }
          }).fetch();
          if (quotationGet !== undefined && quotationGet.length > 0) {
            for (let i = 0; i < quotationGet.length; i++) {
              let mobileAppId = '';
              if (quotationGet[i].mobileId !== undefined) {
                mobileAppId = quotationGet[i].mobileId;
              }
              let quotationObj =
              {
                _id: quotationGet[i]._id,
                employeeId: quotationGet[i].employeeId,
                webId: quotationGet[i].sQ_webId,
                mobileId: mobileAppId,
                address: quotationGet[i].address,
                cardName: quotationGet[i].cardName,
                branchName: quotationGet[i].branchName,
                docDate: moment(quotationGet[i].docDate).format('DD-MM-YYYY'),
                dueDate: moment(quotationGet[i].docDueDate).format('DD-MM-YYYY'),
                docStatus: quotationGet[i].docStatus,
                docTotal: quotationGet[i].docTotal,
                docNum: quotationGet[i].sQId,
                employeeName: quotationGet[i].salesmanName,
                SAPStatus: quotationGet[i].SAPStatus,
                orderId: quotationGet[i].orderId,
              }
              salesQuotationList.push(quotationObj)
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No data Found",
                data: []
              }
            });
          }
          if (salesQuotationList !== undefined && salesQuotationList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: salesQuotationList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// start sales order Detail

/**
 * Sample GET method for calling the sales order details accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/getSalesOrderDetails/:_id/:orderId", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let orderId = req.params.orderId;
          let history = Order.findOne({ _id: orderId },
            {
              fields: {
                itemLines: 1
              }
            });
          if (history !== undefined) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: history.itemLines
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End sales order Detail


// start sales quotation Detail

/**
 * Sample GET method for calling the sales quotation details accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/getSalesQuotationDetails/:_id/:sQId", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let sQId = req.params.sQId;
          let history = SalesQuotation.findOne({ _id: sQId },
            {
              fields: {
                itemLines: 1
              }
            });
          if (history !== undefined) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: history.itemLines
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End sales quotation Detail


// New Mine Edits

/**
 * Sample GET method for calling the Direct Invoice details accoriding to user :- _id
 * Done By : Visakh
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/homeData/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeDates = new Date(todayDates);
          let routeEndDate = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 30);
          dateToday.setDate(dateToday.getDate() + 1);
          // console.log("dateValue", dateValue);
          // console.log("dateToday", dateToday);
          let arAmnt = 0;
          let crAmnt = 0;
          let ordAmnt = 0;
          let arInvoiceAmount = ArInvoicePayment.find({
            userId: id,
            createdAt: {
              $gte: dateValue,
              $lt: dateToday
            }
          }, { fields: { grandTotal: 1 } }).fetch();
          let creditInvoiceAmount = Invoice.find({
            userId: id,
            createdAt: {
              $gte: dateValue,
              $lt: dateToday
            }, creditInvoice: true
          }, { fields: { grandTotal: 1 } }).fetch();
          let orderAmount = Order.find({
            userId: id,
            createdAt: {
              $gte: dateValue,
              $lt: dateToday
            }
          }, { fields: { docTotal: 1 } }).fetch();

          if (arInvoiceAmount !== undefined && arInvoiceAmount.length > 0) {
            for (let i = 0; i < arInvoiceAmount.length; i++) {
              arAmnt += Number(arInvoiceAmount[i].grandTotal);
            }
          }
          if (creditInvoiceAmount !== undefined && creditInvoiceAmount.length > 0) {
            for (let i = 0; i < creditInvoiceAmount.length; i++) {
              crAmnt += Number(creditInvoiceAmount[i].grandTotal);
            }
          }
          if (orderAmount !== undefined && orderAmount.length > 0) {
            for (let i = 0; i < orderAmount.length; i++) {
              ordAmnt += Number(orderAmount[i].docTotal);
            }
          }
          let routeArray = [];
          let date = moment(new Date()).format("DD-MM-YYYY");
          let attendance = Attendance.findOne({ employeeId: id, loginDateCheck: date });
          let attendenceStatus = '';
          let attendenceDate = '';
          if (attendance !== undefined) {
            attendenceStatus = attendance.attendenceStatus;
            attendenceDate = attendance.attendenceDate;
          }
          else {
            attendenceStatus = 'Not Registered';
            attendenceDate = date;
          }
          let routeRes = RouteAssign.find({
            active: "Y",
            assignedTo: id, routeStatus: { $eq: 'Assigned' },
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            }
          }, {
            fields: {
              routeId: 1, routeDate: 1, routeStatus: 1,
              routeDateEnd: 1, boundaryArray: 1
            }
          }).fetch();

          if (routeRes !== undefined && routeRes.length > 0) {
            for (let x = 0; x < routeRes.length; x++) {
              let routeCode = '';
              let routeName = '';
              // get route details
              let routeGrupRes = RouteGroup.findOne({ _id: routeRes[x].routeId });
              // get customer count
              let tortalCustomers = RouteCustomer.find({ routeId: routeRes[x].routeId, active: "Y" }).count();

              if (routeGrupRes !== undefined) {
                routeCode = routeGrupRes.routeCode;
                routeName = routeGrupRes.routeName;
              }
              let locArray = [];
              if (routeRes[x].boundaryArray !== undefined && routeRes[x].boundaryArray.length > 0) {
                locArray = routeRes[x].boundaryArray;
              }
              let routeObj =
              {
                _id: routeRes[x]._id,
                routeCode: routeCode,
                routeName: routeName,
                description: routeRes[x].description,
                routeDate: routeRes[x].routeDate,
                routeEndDate: routeRes[x].routeDateEnd,
                routeStatus: routeRes[x].routeStatus,
                locationBoundary: locArray,
                totalCustomers: tortalCustomers,
              }
              routeArray.push(routeObj);
            }
          }

          let dataObject = {
            arInvoiceTotal: Number(arAmnt).toFixed(2),
            creditInvoiceTotal: Number(crAmnt).toFixed(2),
            orderTotal: Number(ordAmnt).toFixed(2),
            attendenceStatus: attendenceStatus,
            attendenceDate: attendenceDate,
            routeData: routeArray,
          }
          // console.log("History", history.length);
          if (dataObject !== undefined) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: dataObject
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End Ar Invoice Detail

/**
 * Update password api
 * Done by : Visakh
 * Date : 08/01/21
 */
JsonRoutes.add("POST", "/updatePassword", function (req, res, next) {
  //console.log("req.body", req.body);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined) {
      JsonRoutes.sendResult(res, {

        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.userId === req.body._id) {
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          //console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          // Response after the verification of User
          let id = req.body._id; //userId
          let newPassword = req.body.newPassword;
          //console.log("newPassword", newPassword);

          // Accounts.changePassword(oldPassword, newPassword);
          if (newPassword != '' && newPassword !== undefined && newPassword !== null) {
            Accounts.setPassword(id, newPassword);
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Password Changed Successfully",
                data: []
              }
            });
          }
          // Authorisation Response Section     
        }
      }
      else {
        //console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    //console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample GET method for calling the Customer details accoriding to user route
 * Done By : Nithin
 * Date : 13/01/21
 */
JsonRoutes.add("GET", "/routeCustomerList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id -", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeDates = new Date(todayDates);
          let routeEndDate = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let routeArray = [];
          let routeRes = RouteAssign.find({
            active: "Y", routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeId: 1, routeDate: 1, routeStatus: 1, routeDateEnd: 1, } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            for (let j = 0; j < routeRes.length; j++) {
              let routeCode = '';
              let routeName = '';
              let branchGet = '';
              // get route details
              let routeGrupRes = RouteGroup.findOne({ _id: routeRes[j].routeId });
              if (routeGrupRes !== undefined) {
                routeCode = routeGrupRes.routeCode;
                routeName = routeGrupRes.routeName;
                branchGet = routeGrupRes.branchCode;
              }
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[j].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let k = 0; k < routeCustomerDetails.length; k++) {
                  // get customer priceList deatils
                  let custPriceRes = CustomerPriceList.findOne({ cardCode: routeCustomerDetails[k].customer, bPLId: user.defaultBranch });
                  // get customer deatils
                  let customerData = Customer.findOne({ cardCode: routeCustomerDetails[k].customer },
                    {
                      fields: {
                        cardName: 1, cardCode: 1, balance: 1, creditLine: 1, priceMode: 1,
                        address: 1, phone1: 1, mailAddres: 1, cntctPrsn: 1, priceList: 1,
                        glblLocNum: 1, acctName: 1
                      }
                    });
                  let customerAddressGet = CustomerAddress.findOne({ _id: routeCustomerDetails[k].address, }, {
                    fields: {
                      latitude: 1, longitude: 1, fencingArea: 1, address: 1
                    }
                  });
                  let latitude = '';
                  let longitude = '';
                  let fencArea = '';
                  let addressValue = '';
                  if (customerAddressGet !== undefined) {
                    addressValue = customerAddressGet.address;
                    if (customerAddressGet.latitude) { latitude = customerAddressGet.latitude; };
                    if (customerAddressGet.longitude) { longitude = customerAddressGet.longitude; };
                    if (customerAddressGet.fencingArea) { fencArea = customerAddressGet.fencingArea; } else { fencArea = Config.findOne({ name: "fencingArea" }).value };
                  }
                  else {
                    fencArea = Config.findOne({ name: "fencingArea" }).value
                  }
                  let customerBalance = '';
                  let customerCreditLine = '';
                  let customerPriceMode = '';
                  let customerPriceList = '';
                  let customerAddress = '';
                  let customerPhone1 = '';
                  let customerMailAddres = '';
                  let customercntctPrsn = '';
                  let priceList = '';
                  let priceListName = '';
                  let customerName = '';
                  if (custPriceRes !== undefined) {
                    priceList = custPriceRes.prcList;
                    priceListName = custPriceRes.pLName;
                  }
                  if (customerData !== undefined) {
                    customerBalance = customerData.balance;
                    customerCreditLine = customerData.creditLine;
                    customerPriceMode = customerData.priceMode;
                    customerPriceList = customerData.priceList;
                    customerAddress = customerData.address;
                    customerPhone1 = customerData.phone1;
                    customerMailAddres = customerData.mailAddres;
                    customercntctPrsn = customerData.cntctPrsn;
                    customerName = customerData.cardName;
                    customerTPIN = customerData.glblLocNum;
                    customerAccName = customerData.acctName;

                  }
                  let routeObj =
                  {
                    routeId: routeRes[j]._id,
                    routeCode: routeCode,
                    routeName: routeName,
                    routeDate: routeRes[j].routeDate,
                    routeStatus: routeRes[j].routeStatus,
                    routeEndDate: routeRes[j].routeDateEnd,
                    cardName: customerName,
                    customerTPIN: customerTPIN,
                    customerAccName: customerAccName,
                    cardCode: routeCustomerDetails[k].customer,
                    branch: branchGet,
                    balance: customerBalance,
                    creditLine: customerCreditLine,
                    priceMode: customerPriceMode,
                    address: addressValue,
                    addressId: routeCustomerDetails[k].address,
                    phone1: customerPhone1,
                    mailAddres: customerMailAddres,
                    cntctPrsn: customercntctPrsn,
                    priceList: priceList,
                    priceListName: priceListName,
                    priority: routeCustomerDetails[k].priority,
                    latitude: latitude,
                    longitude: longitude,
                    fencingArea: fencArea
                  }
                  routeArray.push(routeObj);
                }
              }

            }
          }

          if (routeArray !== undefined && routeArray.length > 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: routeArray
              },
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});




/**
 * Sample GET method for calling the ietm price based on customer price list
 * Done By : Nithin
 * Date : 13/01/21
 */
JsonRoutes.add("GET", "/itemPriceList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id -", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeDates = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let routeEndDate = new Date(todayDates);
          let customerArray = [];
          let customerArrayUnique = [];
          let priceListArray = [];
          let priceListArrayUnique = [];
          let itemArray = [];
          let finalDataArray = [];
          let userDetails = Meteor.users.findOne({ _id: id });
          let userPriceList = '';
          if (userDetails) {
            let custPriceRes = CustomerPriceList.findOne({ cardCode: userDetails.cardCode, bPLId: userDetails.defaultBranch });
            if (custPriceRes) {
              userPriceList = custPriceRes.prcList;
            }
          }
          let routeRes = RouteAssign.find({
            active: "Y", routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeId: 1, routeDate: 1, routeStatus: 1, } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            // get all customer based on route
            getCustomerList(routeRes);
            function getCustomerList(routeRes) {
              for (let j = 0; j < routeRes.length; j++) {
                let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[j].routeId, active: "Y" }).fetch();
                if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                  for (let k = 0; k < routeCustomerDetails.length; k++) {
                    let custObj = {
                      cardCode: routeCustomerDetails.customer
                    }
                    customerArray.push(custObj)
                  }
                }
              }
              getUniqueCustomers(customerArray);
            }
            // get Unique customerList
            function getUniqueCustomers(customerArray) {
              customerArrayUnique = customerArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                  return e1.cardCode == e2.cardCode
                });
                if (matches.length == 0) {
                  memo.push(e1);
                }
                return memo;
              }, []);
              getCustomerPriceList(customerArrayUnique);
            }
            // get customer priceList based on user branch
            function getCustomerPriceList(customerArrayUnique) {
              for (let k = 0; k < customerArrayUnique.length; k++) {
                let custPriceRes = CustomerPriceList.findOne({ cardCode: customerArrayUnique[k].cardCode, bPLId: user.defaultBranch })

                if (custPriceRes !== undefined) {
                  let custPriceObj =
                  {
                    priceList: custPriceRes.prcList
                  }
                  priceListArray.push(custPriceObj);
                }
              }
              console.log("userPriceListss", userPriceList);
              if (userPriceList !== '' && userPriceList !== undefined) {
                let custPriceObj =
                {
                  priceList: userPriceList
                }
                priceListArray.push(custPriceObj);
              }
              console.log("priceListArrayss", priceListArray);
              getUniquePriceList(priceListArray)
            }
            // get Unique priceList
            function getUniquePriceList(priceListArray) {
              priceListArrayUnique = priceListArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                  return e1.priceList == e2.priceList
                });
                if (matches.length == 0) {
                  memo.push(e1);
                }
                return memo;
              }, []);
              getItemPriceList(priceListArrayUnique);
            }
            // get item list Based on branch and price list
            function getItemPriceList(priceListArrayUnique) {
              itemArray = [];
              if (priceListArrayUnique !== undefined) {
                for (let k = 0; k < priceListArrayUnique.length; k++) {
                  let priceData = ItemGetPrice.find({
                    u_PriceList: priceListArrayUnique[k].priceList,
                    u_BPLId: user.defaultBranch, u_Active: 'Y'
                  }).fetch();
                  if (priceData.length > 0) {
                    for (let a = 0; a < priceData.length; a++) {
                      let priceObj =
                      {
                        u_PriceList: priceData[a].u_PriceList,
                        u_ItemCode: priceData[a].u_ItemCode,
                        u_TaxRate: priceData[a].u_TaxRate,
                        u_EfFrmDt: priceData[a].u_EfFrmDt,
                        u_NetPrc: priceData[a].u_NetPrc,
                        u_GrossPrc: priceData[a].u_GrossPrc,
                        u_UOM: priceData[a].u_UOM,
                        u_TaxAmt: priceData[a].u_TaxAmt,
                        u_TaxCode: priceData[a].u_TaxCode,
                      }
                      itemArray.push(priceObj);
                    }
                  }
                }
              }
              // sort item by price list
              sortItemByPriceList(itemArray, priceListArrayUnique)
            }
          }

          function sortItemByPriceList(itemArray, priceListArrayUnique) {
            for (let k = 0; k < priceListArrayUnique.length; k++) {
              let dataArray = [];

              // for (let a = 0; a < itemArray.length; a++) {
              //   if (itemArray[a].u_PriceList === priceListArrayUnique[k].priceList) {
              //     dataArray.push(itemArray[a]);
              //   }
              // } 

              // group based on price list
              let dataRes1 = itemArray.filter(x => x.u_PriceList === priceListArrayUnique[k].priceList);
              if (dataRes1 !== undefined && dataRes1.length > 0) {
                dataArray = dataRes1;
              }
              latestPriceGet(dataArray);
            }
          }
          function latestPriceGet(dataArray) {
            if (dataArray.length > 0) {
              // get unique item code
              let uniqueItemCode = dataArray.reduce(function (memo, e1) {
                let matches = memo.filter(function (e2) {
                  return e1.u_ItemCode == e2.u_ItemCode
                });
                if (matches.length == 0) {
                  memo.push(e1);
                }
                return memo;
              }, []);
              // gorup by item code
              if (uniqueItemCode.length > 0) {
                for (let j = 0; j < uniqueItemCode.length; j++) {
                  let itemFullArray = [];
                  // for (let p = 0; p < dataArray.length; p++) {
                  //   if (uniqueItemCode[j].u_ItemCode === dataArray[p].u_ItemCode) {
                  //     itemFullArray.push(dataArray[p]);
                  //   }
                  // }
                  let dataRes = dataArray.filter(x => x.u_ItemCode === uniqueItemCode[j].u_ItemCode);
                  if (dataRes !== undefined && dataRes.length > 0) {
                    itemFullArray = dataRes;
                  }
                  // final price list
                  priceCalc(itemFullArray);
                }
              }
            }
          }

          function priceCalc(itemFullArray) {
            if (itemFullArray.length > 0) {
              let dataArrays = [];
              let toDay = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
              let toDate = new Date(toDay);
              // get latest price from item list
              for (let b = 0; b < itemFullArray.length; b++) {
                if (toDate >= new Date(itemFullArray[b].u_EfFrmDt)) {
                  dataArrays.push({ 'u_EfFrmDt': itemFullArray[b].u_EfFrmDt });
                }
              }
              let mostRecentDate = new Date(Math.max.apply(null, dataArrays.map(e => {
                let recentDate = new Date(e.u_EfFrmDt);
                return recentDate;
              })));
              let mostRecentObject = itemFullArray.filter(e => {
                let d = new Date(e.u_EfFrmDt);
                return d.getTime() == mostRecentDate.getTime();
              })[0];
              finalDataArray.push(mostRecentObject);
            }
          }


          if (finalDataArray !== undefined && finalDataArray.length > 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: finalDataArray
              },
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Route Data Update with checkin and checkout data
 * Done by : Visakh
 * Date : 13/01/21
 */
JsonRoutes.add("POST", "/routeDataUpdate", function (req, res, next) {
  //console.log("req.body", req.body);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined) {
      JsonRoutes.sendResult(res, {

        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.userId === req.body._id) {
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          //console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          // Response after the verification of User
          let id = req.body._id; //userId
          // console.log("check data",req.body);..
          let routeCodeId = req.body.routeCode;
          let routeArray = req.body.routeData;
          let transactionDone = req.body.isAddedTransactions;
          // let routeArray = JSON.parse(req.body.routeData);
          if (routeCodeId != undefined && routeCodeId !== '') {
            let routeCheck = RouteAssign.findOne({ _id: routeCodeId });
            if (routeCheck !== undefined) {
              if (routeArray.length > 0) {
                routeDataUpdate(routeCodeId, routeArray, routeCheck.routeId, routeCheck.assignedBy, id,
                  routeCheck.assignedAt, transactionDone, routeCheck.branch);
                updatedRouteAssign(routeCodeId, id);


                JsonRoutes.sendResult(res, {
                  code: 200,
                  data: {
                    code: 200,
                    message: "Route Updated Successfully",
                    data: []
                  }
                });
              } else {
                JsonRoutes.sendResult(res, {
                  code: 200,
                  data: {
                    code: 200,
                    message: "Cannot Find a Route Data To Update",
                    data: []
                  }
                });
              }
            } else {
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "Please check the Route Code",
                  data: []
                }
              });
            }
          } else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "Route Code is a Mandatory Field",
                data: []
              }
            });
          }

          // Authorisation Response Section     
        }
      }
      else {
        //console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    //console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Route status updates
 * Done by : Nithin
 * Date : 12/02/21
 */
JsonRoutes.add("POST", "/routeStatusUpdate", function (req, res, next) {
  //console.log("req.body", req.body);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined) {
      JsonRoutes.sendResult(res, {

        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.userId === req.body._id) {
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          //console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          // Response after the verification of User
          let id = req.body._id; //userId
          // console.log("check data",req.body);..
          let routeCodeId = req.body.routeCode;
          // let routeArray = JSON.parse(req.body.routeData);
          if (routeCodeId != undefined && routeCodeId !== '') {
            let routeCheck = RouteAssign.findOne({ _id: routeCodeId });
            if (routeCheck !== undefined) {
              routeStatusUpdateFn(routeCodeId, id);
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "Route Status Updated Successfully",
                  data: []
                }
              });
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "Please check the Route Code",
                  data: []
                }
              });
            }
          } else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "Route Code is a Mandatory Field",
                data: []
              }
            });
          }
          // Authorisation Response Section     
        }
      }
      else {
        //console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    //console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
* Sample POST method for creating Ar Invoice + Payment
* Done By Nithin 
* Date 15-01-2020
*/
JsonRoutes.add("POST", "/addArInvoicePayment", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let temporaryId = '';
          let tempVal = TempSerialNo.findOne({ arInvoice: true }, { sort: { $natural: -1 } });
          if (!tempVal) {
            temporaryId = "CashSales/Van/1"
          } else {
            temporaryId = "CashSales/Van/" + parseInt(tempVal.serial + 1);
          }
          if (!tempVal) {
            TempSerialNo.insert({
              serial: 1,
              arInvoice: true,
              uuid: Random.id()
            });
          } else {
            TempSerialNo.update(tempVal._id, {
              $set: {
                serial: parseInt(tempVal.serial + 1),
                arInvoice: true,
                updatedAt: new Date()
              }
            });
          }
          let id = req.body._id;
          let custAddress = req.body.addressId;
          let customerName = '';
          let customerAddress = '';
          let routeId = req.body.routeId;
          let street = '';
          let block = '';
          let city = '';
          let routeGroup = '';
          if (req.body.routeId) {
            let routeCheck = RouteAssign.findOne({ _id: req.body.routeId }, {
              fields: { routeId: 1 }
            });
            if (routeCheck) {
              routeGroup = routeCheck.routeId;
            }
          }
          let customerRes = Customer.findOne({ cardCode: req.body.customer });
          if (customerRes) {
            customerName = customerRes.cardName;
          }
          if (custAddress !== undefined && custAddress !== '') {
            let addressRes = CustomerAddress.findOne({ _id: custAddress, });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          else {
            let addressRes = CustomerAddress.findOne({ cardCode: req.body.customer, addressType: "S" });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          let branchName = '';
          let acCode = '';
          let branchRes = Branch.findOne({ bPLId: req.body.branch });
          if (branchRes) {
            branchName = branchRes.bPLName;
          }

          let wareHouseRess = WareHouse.findOne({ whsCode: user.defaultWareHouse });
          if (wareHouseRess) {
            acCode = wareHouseRess.u_cashAcct;
          }

          let priceTypeName = '';
          let priceTypeRes = CustomerPriceList.findOne({ prcList: req.body.priceType });
          if (priceTypeRes) {
            priceTypeName = priceTypeRes.pLName;
          }
          let salesManName = '';
          let urDta = '';
          let userres = Meteor.users.findOne({ _id: req.body.employee });
          if (userres) {
            salesManName = `${userres.profile.firstName} ${userres.profile.lastName}`;
            urDta = userres;
          }
          let totalQty = 0;
          let itemsQty = req.body.itemLines;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          let itemArrayVal = [];
          if (req.body.itemLines.length > 0) {
            for (let x = 0; x < req.body.itemLines.length; x++) {
              let itemName = '';
              let itemRes = Item.findOne({ itemCode: req.body.itemLines[x].itemCode });
              if (itemRes) {
                itemName = itemRes.itemNam;
              }

              let taxName = '';
              let taxRes = Tax.findOne({ taxCode: req.body.itemLines[x].vatGroup });
              if (taxRes) {
                taxName = taxRes.name;
              }

              let uoMEntryVal = '';
              let unitRes = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode });
              if (unitRes) {
                uoMEntryVal = unitRes.uomEntry;
              }
              // let grossTotalVal = (Number(req.body.itemLines[x].grossTotal) * Number(req.body.itemLines[x].quantity));
              let beforeDiscountVal = (Number(req.body.itemLines[x].incPrice) * Number(req.body.itemLines[x].quantity));
              let itemObj =
              {
                randomId: Random.id(),
                uoMEntry: uoMEntryVal,
                unitQuantity: req.body.itemLines[x].unitQuantity,
                uomCode: req.body.itemLines[x].uomCode,
                unitPrice: req.body.itemLines[x].unitPrice,
                price: req.body.itemLines[x].unitPrice,
                salesPrice: req.body.itemLines[x].unitPrice,
                grossTotal: req.body.itemLines[x].grossTotal,
                incPrice: req.body.itemLines[x].incPrice,
                excPrice: req.body.itemLines[x].excPrice,
                itemCategory: '',
                itemCode: req.body.itemLines[x].itemCode,
                mVATBoolean: '',
                u_MVATPerStockUnit: '',
                invWeight: req.body.itemLines[x].invWeight,
                itemNam: itemName,
                itemRemark: '',
                quantity: req.body.itemLines[x].quantity,
                taxRate: req.body.itemLines[x].taxRate,
                vatGroup: req.body.itemLines[x].vatGroup,
                vatRate: req.body.itemLines[x].vatRate,
                vatGroupName: taxName,
                discount: '0',
                discountAmount: '0',
                baseDocEntry: "0",
                refType: '-1',
                whsCode: req.body.itemLines[x].whsCode,
                beforeDiscount: beforeDiscountVal.toString(),
                afterDiscount: beforeDiscountVal.toString(),
                isItemReturn: req.body.itemLines[x].isItemReturn,
                baseLine: req.body.itemLines[x].baseLine,
              }
              itemArrayVal.push(itemObj);
            }
          }
          arinvoiceCreateFunction(req.body, customerName, customerAddress, branchName, acCode, itemArrayVal, totalQty,
            salesManName, street, block, city, priceTypeName, urDta, routeId, temporaryId);
          locationTransactionWiseFun(id, new Date(), req.body.latitude, req.body.longitude,
            "Ar Invoice + Payment", customerName, routeGroup, req.body.docTotal);
          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Ar Invoice + Payment Created Successfully",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
* Sample POST method for creating  Credit Invoice
* Done By Nithin 
* Date 15-01-2020
*/
JsonRoutes.add("POST", "/addCreditInvoice", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let custAddress = req.body.addressId;
          let customerName = '';
          let customerAddress = '';
          let routeId = req.body.routeId;
          let street = '';
          let block = '';
          let city = '';
          let routeGroup = '';
          if (req.body.routeId) {
            let routeCheck = RouteAssign.findOne({ _id: req.body.routeId }, {
              fields: { routeId: 1 }
            });
            if (routeCheck) {
              routeGroup = routeCheck.routeId;
            }
          }
          let customerRes = Customer.findOne({ cardCode: req.body.customer });
          if (customerRes) {
            customerName = customerRes.cardName;
          }
          if (custAddress !== undefined && custAddress !== '') {
            let addressRes = CustomerAddress.findOne({ _id: custAddress, });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          else {
            let addressRes = CustomerAddress.findOne({ cardCode: req.body.customer, addressType: "S" });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          let branchName = '';
          let acCode = '';
          let branchRes = Branch.findOne({ bPLId: req.body.branch });
          if (branchRes) {
            branchName = branchRes.bPLName;
          }

          let wareHouseRess = WareHouse.findOne({ whsCode: user.defaultWareHouse });
          if (wareHouseRess) {
            acCode = wareHouseRess.u_cashAcct;
          }

          let priceTypeName = '';
          let priceTypeRes = CustomerPriceList.findOne({ prcList: req.body.priceType });
          if (priceTypeRes) {
            priceTypeName = priceTypeRes.pLName;
          }
          let salesManName = '';
          let usrDta = '';
          let userres = Meteor.users.findOne({ _id: req.body.employee });
          if (userres) {
            salesManName = `${userres.profile.firstName} ${userres.profile.lastName} `;
            usrDta = userres
          }
          let totalQty = 0;
          let itemsQty = req.body.itemLines;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          let itemArrayVal = [];
          let grosTotal = 0;
          if (req.body.itemLines.length > 0) {
            for (let x = 0; x < req.body.itemLines.length; x++) {
              let itemName = '';
              let itemRes = Item.findOne({ itemCode: req.body.itemLines[x].itemCode });
              if (itemRes) {
                itemName = itemRes.itemNam;
              }

              let taxName = '';
              let taxRes = Tax.findOne({ taxCode: req.body.itemLines[x].vatGroup });
              if (taxRes) {
                taxName = taxRes.name;
              }

              let uoMEntryVal = '';
              let unitRes = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode });
              if (unitRes) {
                uoMEntryVal = unitRes.uomEntry;
              }
              // let grossTotalVal = (Number(req.body.itemLines[x].grossTotal) * Number(req.body.itemLines[x].quantity));
              let beforeDiscountVal = (Number(req.body.itemLines[x].incPrice) * Number(req.body.itemLines[x].quantity));
              let itemObj =
              {
                randomId: Random.id(),
                uoMEntry: uoMEntryVal,
                unitQuantity: req.body.itemLines[x].unitQuantity,
                uomCode: req.body.itemLines[x].uomCode,
                unitPrice: req.body.itemLines[x].unitPrice,
                price: req.body.itemLines[x].unitPrice,
                salesPrice: req.body.itemLines[x].unitPrice,
                grossTotal: req.body.itemLines[x].grossTotal,
                incPrice: req.body.itemLines[x].incPrice,
                excPrice: req.body.itemLines[x].excPrice,
                itemCategory: '',
                itemCode: req.body.itemLines[x].itemCode,
                mVATBoolean: '',
                u_MVATPerStockUnit: '',
                invWeight: req.body.itemLines[x].invWeight,
                itemNam: itemName,
                itemRemark: '',
                quantity: req.body.itemLines[x].quantity,
                taxRate: req.body.itemLines[x].taxRate,
                vatGroup: req.body.itemLines[x].vatGroup,
                vatRate: req.body.itemLines[x].vatRate,
                vatGroupName: taxName,
                discount: '0',
                discountAmount: '0',
                baseDocEntry: "0",
                refType: '-1',
                whsCode: req.body.itemLines[x].whsCode,
                beforeDiscount: beforeDiscountVal.toString(),
                afterDiscount: beforeDiscountVal.toString(),
                baseLine: req.body.itemLines[x].baseLine,
              }
              itemArrayVal.push(itemObj);
            }
          }
          let currentDate = moment(new Date()).format('YYYY-MM-DD');
          console.log("currentDate", currentDate);
          let totalAmount = 0;
          let approvalValue = false;
          let orderBalance = customerRes.ordersBal;
          let balanceValue = customerRes.balance;
          let creditLimit = customerRes.creditLine;
          let extraAmt = 0;
          let branchArrayCheck = [];
          let customerArrayCheck = [];
          branchArrayCheck.push('4');
          branchArrayCheck.push('1');
          branchArrayCheck.push('3');
          branchArrayCheck.push('6');
          branchArrayCheck.push('7');
          customerArrayCheck.push('CGZL00000988');
          customerArrayCheck.push('CGZL00000938');
          customerArrayCheck.push('CGZL00000032');
          customerArrayCheck.push('CGZL00000056');
          customerArrayCheck.push('CGZL00000937');
          customerArrayCheck.push('CGZL00000993');
          customerArrayCheck.push('CGZL00000535');
          customerArrayCheck.push('CGZL00000970');
          customerArrayCheck.push('CGZL00000003');
          customerArrayCheck.push('CGZL00000009');
          customerArrayCheck.push('CGZL00000935');
          customerArrayCheck.push('CGZL00000041');
          customerArrayCheck.push('CGZL00000963');
          customerArrayCheck.push('CGZL00000934');
          customerArrayCheck.push('CGZL00000987');
          customerArrayCheck.push('CGZL00000018');
          customerArrayCheck.push('CGZL00001076');
          customerArrayCheck.push('CGZL00000015');
          customerArrayCheck.push('CGZL00000011');
          customerArrayCheck.push('CGZL00000002');
          customerArrayCheck.push('CGZL00000365');
          customerArrayCheck.push('CGZL00001130');
          customerArrayCheck.push('CGZL00000338');
          customerArrayCheck.push('CGZL00000372');
          customerArrayCheck.push('CGZL00000017');
          customerArrayCheck.push('CGZL00000007');
          customerArrayCheck.push('CGZL00000014');
          // check credit limit condition
          let TotalValue = Number(orderBalance) + Number(balanceValue) + Number(req.body.docTotal);
          let approvalResonArray = [];
          if (TotalValue > creditLimit && branchArrayCheck.includes(req.body.branch) === false && customerArrayCheck.includes(customerRes.cardCode) === false) {
            extraAmt = Number(TotalValue).toFixed(6) - Number(creditLimit).toFixed(6);
            let extAmtVal = Number(extraAmt).toFixed(6);
            let reasonObject1 = {
              reason: "Customer Credit Limit Exceeded.",
              reasonValue: `Exceeded Amount ${extAmtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (ZMW).`

            }
            approvalResonArray.push(reasonObject1);
            approvalValue = true;
          }
          // check bill pending condition
          let invoiceRes = Invoice.find({ cardCode: customerRes.cardCode, dueDate: { $lte: currentDate }, docStatus: 'O', creditInv: true, docNum: { $ne: '' } }).fetch();
          if (invoiceRes.length > 0 && branchArrayCheck.includes(req.body.branch) === false && customerArrayCheck.includes(customerRes.cardCode) === false) {
            for (let i = 0; i < invoiceRes.length; i++) {
              if (invoiceRes[i].grandTotal === undefined) {
                totalAmount += Number(invoiceRes[i].docTotal);
              }
              else {
                totalAmount += Number(invoiceRes[i].grandTotal);
              }
            }

            let amtVal = Number(totalAmount).toFixed(2)
            let reasonObject = {
              reason: "Customer Payment Is Pending.",
              totalBills: invoiceRes.length,
              totalAmount: Number(totalAmount).toFixed(2),
              reasonValue: `Total Bills Pending ${invoiceRes.length}. Total Bills Amount Pending ${amtVal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} (ZMW) `
            }

            approvalResonArray.push(reasonObject);
            approvalValue = true;
            // console.log("approvalResonArray", approvalResonArray);
          }
          console.log("hii")
          creditInvoiceCreateFunction(req.body, customerName, customerAddress, branchName, acCode, itemArrayVal, totalQty,
            salesManName, street, block, city, priceTypeName, usrDta, approvalValue, approvalResonArray, routeId);
          locationTransactionWiseFun(id, new Date(), req.body.latitude, req.body.longitude,
            "Credit Invoice", customerName, routeGroup, req.body.docTotal);
          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Credit Invoice Created Successfully",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
* Sample POST method for creating  POS Invoice
* Done By Nithin 
* Date 15-01-2020
*/
JsonRoutes.add("POST", "/addPOSInvoice", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let custAddress = req.body.addressId;
          let customerName = '';
          let customerAddress = '';
          let street = '';
          let block = '';
          let city = '';
          let routeGroup = '';
          if (req.body.routeId) {
            let routeCheck = RouteAssign.findOne({ _id: req.body.routeId }, {
              fields: { routeId: 1 }
            });
            if (routeCheck) {
              routeGroup = routeCheck.routeId;
            }
          }
          let customerRes = Customer.findOne({ cardCode: req.body.customer });
          if (customerRes) {
            customerName = customerRes.cardName;
          }
          if (custAddress !== undefined && custAddress !== '') {
            let addressRes = CustomerAddress.findOne({ _id: custAddress, });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          else {
            let addressRes = CustomerAddress.findOne({ cardCode: req.body.customer, addressType: "S" });
            if (addressRes) {
              customerAddress = addressRes.address;
              street = addressRes.street;
              block = addressRes.block;
              city = addressRes.city;
            }
          }
          let branchName = '';
          let acCode = '';
          let branchRes = Branch.findOne({ bPLId: req.body.branch });
          if (branchRes) {
            branchName = branchRes.bPLName;
          }

          let wareHouseRess = WareHouse.findOne({ whsCode: user.defaultWareHouse });
          if (wareHouseRess) {
            acCode = wareHouseRess.u_cashAcct;
          }
          let priceTypeName = '';
          let priceTypeRes = CustomerPriceList.findOne({ prcList: req.body.priceType });
          if (priceTypeRes) {
            priceTypeName = priceTypeRes.pLName;
          }
          let salesManName = '';
          let usrData = {};
          let userres = Meteor.users.findOne({ _id: req.body.employee });
          if (userres) {
            salesManName = `${userres.profile.firstName} ${userres.profile.lastName}`;
            usrData = userres;
          }
          let totalQty = 0;
          let itemsQty = req.body.itemLines;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          let itemArrayVal = [];
          if (req.body.itemLines.length > 0) {
            for (let x = 0; x < req.body.itemLines.length; x++) {
              let itemName = '';
              let itemRes = Item.findOne({ itemCode: req.body.itemLines[x].itemCode });
              if (itemRes) {
                itemName = itemRes.itemNam;
              }

              let taxName = '';
              let taxRes = Tax.findOne({ taxCode: req.body.itemLines[x].vatGroup });
              if (taxRes) {
                taxName = taxRes.name;
              }

              let uoMEntryVal = '';
              let unitRes = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode });
              if (unitRes) {
                uoMEntryVal = unitRes.uomEntry;
              }
              // let grossTotalVal = (Number(req.body.itemLines[x].grossTotal) * Number(req.body.itemLines[x].quantity));
              let beforeDiscountVal = (Number(req.body.itemLines[x].incPrice) * Number(req.body.itemLines[x].quantity));
              let itemObj =
              {
                randomId: Random.id(),
                uoMEntry: uoMEntryVal,
                unitQuantity: req.body.itemLines[x].unitQuantity,
                uomCode: req.body.itemLines[x].uomCode,
                unitPrice: req.body.itemLines[x].unitPrice,
                price: req.body.itemLines[x].unitPrice,
                salesPrice: req.body.itemLines[x].unitPrice,
                grossTotal: req.body.itemLines[x].grossTotal,
                incPrice: req.body.itemLines[x].incPrice,
                excPrice: req.body.itemLines[x].excPrice,
                itemCategory: '',
                itemCode: req.body.itemLines[x].itemCode,
                mVATBoolean: '',
                u_MVATPerStockUnit: '',
                invWeight: req.body.itemLines[x].invWeight,
                itemNam: itemName,
                itemRemark: '',
                quantity: req.body.itemLines[x].quantity,
                taxRate: req.body.itemLines[x].taxRate,
                vatGroup: req.body.itemLines[x].vatGroup,
                vatRate: req.body.itemLines[x].vatRate,
                vatGroupName: taxName,
                discount: '0',
                discountAmount: '0',
                refType: '-1',
                baseDocEntry: "0",
                whsCode: req.body.itemLines[x].whsCode,
                beforeDiscount: beforeDiscountVal.toString(),
                afterDiscount: beforeDiscountVal.toString(),
                baseLine: req.body.itemLines[x].baseLine,
              }
              itemArrayVal.push(itemObj);
            }
          }
          posInvoiceCreateFunction(req.body, customerName, customerAddress, branchName, acCode, itemArrayVal, totalQty,
            salesManName, street, block, city, priceTypeName, usrData);
          locationTransactionWiseFun(id, new Date(), req.body.latitude, req.body.longitude,
            "POS Sales", customerName, routeGroup, req.body.docTotal);
          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "POS Invoice Created Successfully",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});



/**
 * For the Route update Process
 * @param {*} routeCodeId 
 * @param {*} routeArray 
 * @param {*} id 
 */
function routeDataUpdate(routeCodeId, routeArray, routeGroup, assignedBy, id, date, transactionDone, branch) {

  for (let x = 0; x < routeArray.length; x++) {
    let timeDiff = '-';
    let date1 = '';
    let date2 = '';
    if (routeArray[x].checkIn !== '' && routeArray[x].checkIn !== undefined &&
      routeArray[x].checkOut !== '' && routeArray[x].checkOut !== undefined) {
      let dateVlues = moment(routeArray[x].date, 'DD/MM/YYYY').format('YYYY-MM-DD')
      let checkInData = routeArray[x].checkIn.replace(".", ":");
      let checkOutData = routeArray[x].checkOut.replace(".", ":");
      date1 = new Date(`${dateVlues} ${checkInData}`);
      date2 = new Date(`${dateVlues} ${checkOutData}`);
      var d = Math.abs(new Date(date2) - new Date(date1)) / 1000;                           // delta
      var r = {};                                                                // result
      var s = {                                                                  // structure
        year: 31536000,
        month: 2592000,
        week: 604800, // uncomment row to ignore
        day: 86400,   // feel free to add your own row
        hour: 3600,
        minute: 60,
        second: 1
      };

      Object.keys(s).forEach(function (key) {
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
      });

      // for example: {year:0,month:0,week:1,day:2,hour:34,minute:56,second:7}
      // console.log(r);
      if (isNaN(r.hour) && isNaN(r.minute)) {
        timeDiff = '0';
      }
      else {
        timeDiff = `${r.hour} Hours ${r.minute} Minutes ${r.second} Seconds`;
      }
    }
    RouteUpdates.insert({
      routeGroup: routeGroup,
      routeAssignId: routeCodeId,
      assignedAt: date,
      assignedTo: id,
      assignedBy: assignedBy,
      customer: routeArray[x].cardCode,
      checkIn: routeArray[x].checkIn,
      checkOut: routeArray[x].checkOut,
      checkInDateIso: date1,
      checkOutDateIso: date2,
      dateValue: routeArray[x].date,
      timeSpent: timeDiff,
      skipStatus: routeArray[x].skipStatus,
      remark: routeArray[x].remark,
      remarkDescription: routeArray[x].remarkDescription,
      latitude: routeArray[x].latitude,
      longitude: routeArray[x].longitude,
      routeUpdatedBy: id,
      branch: branch,
      transactionDone: transactionDone,
      uuid: Random.id(),
      updateAt: new Date(),
      createdAt: new Date(),
    });
    let customerName = '';
    let customerRes = Customer.findOne({ cardCode: routeArray[x].cardCode }, {
      fields: {
        cardName: 1
      }
    });
    if (customerRes) {
      customerName = customerRes.cardName;
    }
    if (routeArray[x].skipStatus === '1') {
      locationRouteWiseFun(id, new Date(), routeArray[x].latitude, routeArray[x].longitude,
        "Shop Skipped", customerName, routeGroup, routeArray[x].checkIn, routeArray[x].checkOut, routeArray[x].date);
      RouteAssign.update({ _id: routeCodeId }, {
        $set:
        {
          skipValue: true,
          skipDate: new Date()
        }
      });
    }
    if (transactionDone === false) {
      locationRouteWiseFun(id, new Date(), routeArray[x].latitude, routeArray[x].longitude,
        "Customer With No Transactions", customerName, routeGroup, routeArray[x].checkIn, routeArray[x].checkOut, routeArray[x].date);
      RouteAssign.update({ _id: routeCodeId }, {
        $set:
        {
          transactionDone: false,
          noTransactionUpdated: new Date()
        }
      });
    }
    else {
      locationRouteWiseFun(id, new Date(), routeArray[x].latitude, routeArray[x].longitude,
        "Check In Details", customerName, routeGroup, routeArray[x].checkIn, routeArray[x].checkOut, routeArray[x].date);
    }
  }
}
/**
 * function for update route assign
 */
function updatedRouteAssign(routeCodeId, id) {
  return RouteAssign.update({ _id: routeCodeId }, {
    $set:
    {
      routeDataUpdated: true,
      updatedBy: id,
      updatedAt: new Date(),
    }
  });

}

/**
 * function for update route status
 */
function routeStatusUpdateFn(routeCodeId, id) {
  return RouteAssign.update({ _id: routeCodeId }, {
    $set:
    {
      routeStatus: 'Completed',
      routeCompletedBy: id,
      routeCompletedAt: new Date(),
    }
  });

}
/**
 * For create ar + payment
 * @param {*} arData 
 * @param {*} customerName 
 * @param {*} customerAddress 
 * @param {*} branchName 
 * @param {*} acCode 
 * @param {*} itemArrayVal 
 * @param {*} totalQty 
 * @param {*} salesManName 
 * @param {*} street 
 * @param {*} block 
 * @param {*} city 
 */

function arinvoiceCreateFunction(arData, customerName, customerAddress, branchName, acCode, itemArrayVal, totalQty,
  salesManName, street, block, city, priceTypeName, urDta, routeId, temporaryId) {
  let arinvoiceData = ArInvoicePayment.insert({
    cardCode: arData.customer,
    cardName: customerName,
    address: customerAddress,
    routeId: routeId,
    addressBilling: customerAddress,
    secondaryCustomer: '',
    branch: arData.branch,
    branchName: branchName,
    acCode: acCode,
    employeeId: arData.employee,
    userId: arData.employee,
    docDueDate: arData.dueDate,
    deliveryDate: arData.dueDate,
    custRefDate: new Date(),
    custRef: arData.mobileAppId,
    priceMode: arData.priceMode,
    priceType: arData.priceType,
    priceTypeName: priceTypeName,
    transporterName: urDta.transporterName,
    vehicleNumber: urDta.vehicleNumber,
    lorryBoy: urDta.lorryBoy,
    driverName: urDta.driverName,
    driverContactNumber: arData.driverContactNumber,
    contactPerson: arData.contactPerson,
    contactNumber: arData.contactNumber,
    discountPercentage: "0",
    delivery: '',
    currency: "ZMW",
    latitude: arData.latitude,
    longitude: arData.longitude,
    docStatus: "O",
    SAPStatus: "Not Approved",
    customerType: "Cash",
    docDate: new Date(arData.docDate),
    ArInvoiceDate: new Date(arData.docDate),
    itemLines: itemArrayVal,
    totalQty: totalQty,
    totalItem: itemArrayVal.length,
    beforeDiscount: arData.docTotal,
    afterDiscount: arData.docTotal,
    grandTotal: arData.docTotal,
    cartItemTotal: arData.cartItemTotal,
    returnItemTotal: arData.returnItemTotal,
    docNum: temporaryId,
    arInvId: temporaryId,
    discPrcnt: "0",
    ArInvoiceRemarks: arData.remark,
    mobileId: arData.mobileAppId,
    sumAmount: arData.docTotal,
    docTotal: arData.docTotal,
    weight: arData.weight,
    taxTotal: arData.taxTotal,
    GST: arData.taxTotal,
    salesmanName: salesManName,
    paymentMethod: 'Cash',
    cashAmountVal: arData.docTotal,
    cashRemarkVal: '',
    transferamtValue: '',
    transferDateValue: '',
    transferRef: '',
    transferRemark: '',
    chequeInfo: [],
    street: street,
    block: block,
    city: city,
    flag: true,
    vansaleApp: true,
    arInv_WebId: 'arInv_' + Random.id(),
    uuid: Random.id(),
    createdAt: new Date(arData.docDate),
    updatedAt: new Date(),
  });
  console.log("arinvoiceDatassssss566s", arinvoiceData);
  if (arinvoiceData) {
    apiCallForArInvoice(arinvoiceData, arData.employee);

    /**
  * for summary report
  */
    if (arinvoiceData && routeId !== undefined) {
      let dateVal = moment(new Date()).format('DD-MM-YYYY')
      let summaryVal = SalesSummaryReport.findOne({
        employeeId: arData.employee,
        attendenceDate: dateVal,
        routeAssignId: routeId,
      });
      if (summaryVal !== undefined) {
        let dataArray = [];
        if (summaryVal.dataArray !== undefined && summaryVal.dataArray.length > 0) {
          dataArray = summaryVal.dataArray
        }
        let dataObj =
        {
          totalQty: totalQty,
          totalItem: itemArrayVal.length,
          docTotal: arData.docTotal,
          transaction: "AR Invoice"

        }

        dataArray.push(dataObj);
        let totalAmt = 0;
        let itemTotal = 0;
        let itemQtyTotal = 0;
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].docTotal !== undefined) {
            totalAmt += Number(dataArray[i].docTotal);
          }
        }
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].totalQty !== undefined) {
            itemQtyTotal += Number(dataArray[i].totalQty);
          }
        }
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].totalItem !== undefined) {
            itemTotal += Number(dataArray[i].totalItem);
          }
        }

        // SalesSummaryReport.update({
        //   _id: summaryVal._id
        // }, {
        //   $set:
        //   {
        //     dataArray: dataArray,
        //     totalAmt: totalAmt.toString(),
        //     itemQtyTotal: itemQtyTotal.toString(),
        //     itemTotal: itemTotal.toString(),
        //     updatedAt: new Date(),
        //   }
        // });
      }
    }
  }
  return arinvoiceData
}


/**
 * 
 * @param {*} orderData 
 * @param {*} customerName 
 * @param {*} customerAddress 
 * @param {*} branchName 
 * @param {*} priceTypeName 
 * @param {*} itemArrayVal 
 * @param {*} totalQty 
 * @param {*} salesManName 
 * @param {*} street 
 * @param {*} city 
 * @param {*} block 
 * @param {*} approvalValue 
 * @param {*} approvalResonArray 
 */
function orderCreateFunction(orderData, customerName, customerAddress, branchName, priceTypeName, itemArrayVal,
  totalQty, salesManName, street, city, block, approvalValue, approvalResonArray, routeId) {
  let orderRes = Order.insert({
    cardCode: orderData.customer,
    cardName: customerName,
    routeId: routeId,
    address: customerAddress,
    addressBilling: customerAddress,
    branch: orderData.branch,
    branchName: branchName,
    employeeId: orderData.employee,
    userId: orderData.employee,
    docDueDate: orderData.dueDate,
    custRefDate: new Date(),
    custRefNo: orderData.mobileAppId,
    priceMode: orderData.priceMode,
    priceType: orderData.priceType,
    priceTypeName: priceTypeName,
    currency: "ZMW",
    latitude: orderData.latitude,
    longitude: orderData.longitude,
    docStatus: "O",
    SAPStatus: "Not Approved",
    docDate: new Date(orderData.docDate),
    itemLines: itemArrayVal,
    totalQty: totalQty,
    totalItem: itemArrayVal.length,
    beforeDiscount: orderData.docTotal,
    afterDiscount: orderData.docTotal,
    docNum: '',
    orderId: '',
    discPrcnt: "0",
    remark_order: orderData.remark,
    mobileId: orderData.mobileAppId,
    docTotal: orderData.docTotal,
    weight: orderData.weight,
    taxTotal: orderData.taxTotal,
    GST: orderData.taxTotal,
    salesmanName: salesManName,
    approvalValue: approvalValue,
    approvalResonArray: approvalResonArray,
    street: street,
    block: block,
    city: city,
    flag: true,
    vansaleApp: true,
    oRStatus: '',
    ord_webId: 'ord_' + Random.id(),
    uuid: Random.id(),
    createdAt: new Date(orderData.docDate),
    updatedAt: new Date(),
  });

  /**
   * for summary report
   */
  if (orderRes && routeId !== undefined) {
    let dateVal = moment(new Date()).format('DD-MM-YYYY')
    let summaryVal = SalesSummaryReport.findOne({
      employeeId: orderData.employee,
      attendenceDate: dateVal,
      routeAssignId: routeId,
    });
    if (summaryVal !== undefined) {
      let dataArray = [];
      if (summaryVal.dataArray !== undefined && summaryVal.dataArray.length > 0) {
        dataArray = summaryVal.dataArray
      }
      let dataObj =
      {
        totalQty: totalQty,
        totalItem: itemArrayVal.length,
        docTotal: orderData.docTotal,
        transaction: "Sales Order"

      }

      dataArray.push(dataObj);
      let totalAmt = 0;
      let itemTotal = 0;
      let itemQtyTotal = 0;
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].docTotal !== undefined) {
          totalAmt += Number(dataArray[i].docTotal);
        }
      }
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].totalQty !== undefined) {
          itemQtyTotal += Number(dataArray[i].totalQty);
        }
      }
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].totalItem !== undefined) {
          itemTotal += Number(dataArray[i].totalItem);
        }
      }

      // SalesSummaryReport.update({
      //   _id: summaryVal._id
      // }, {
      //   $set:
      //   {
      //     dataArray: dataArray,
      //     totalAmt: totalAmt.toString(),
      //     itemQtyTotal: itemQtyTotal.toString(),
      //     itemTotal: itemTotal.toString(),
      //     updatedAt: new Date(),
      //   }
      // });
    }
  }
}



/** create sales return
 * 
 * @param {*} orderData 
 * @param {*} customerName 
 * @param {*} customerAddress 
 * @param {*} branchName 
 * @param {*} priceTypeName 
 * @param {*} itemArrayVal 
 * @param {*} totalQty 
 * @param {*} salesManName 
 * @param {*} street 
 * @param {*} city 
 * @param {*} block 
 * @param {*} approvalValue 
 * @param {*} approvalResonArray 
 */
function salesReturnCreateFunction(orderData, customerName, customerAddress, branchName, priceTypeName, itemArrayVal,
  totalQty, salesManName, street, city, block, routeId, urDta, invoiceNo) {
  console.log("ssss");
  return SalesReturn.insert({
    cardCode: orderData.customer,
    cardName: customerName,
    routeId: routeId,
    address: customerAddress,
    addressBilling: customerAddress,
    branch: orderData.branch,
    branchName: branchName,
    employeeId: orderData.employee,
    userId: orderData.employee,
    docDueDate: orderData.dueDate,
    custRefDate: new Date(),
    custRefNo: orderData.mobileAppId,
    priceMode: orderData.priceMode,
    priceType: orderData.priceType,
    priceTypeName: priceTypeName,
    currency: "ZMW",
    latitude: orderData.latitude,
    longitude: orderData.longitude,
    docStatus: "O",
    SAPStatus: "Not Approved",
    docDate: new Date(orderData.docDate),
    itemLines: itemArrayVal,
    totalQty: totalQty,
    totalItem: itemArrayVal.length,
    beforeDiscount: orderData.docTotal,
    afterDiscount: orderData.docTotal,
    docNum: '',
    orderId: '',
    discPrcnt: "0",
    remark_order: orderData.remark,
    mobileId: orderData.mobileAppId,
    docTotal: orderData.docTotal,
    weight: orderData.weight,
    taxTotal: orderData.taxTotal,
    GST: orderData.taxTotal,
    salesmanName: salesManName,
    transporter: urDta.transporterName,
    vehicle: urDta.vehicleNumber,
    lorryBoy: urDta.lorryBoy,
    driverName: urDta.driverName,
    cnumber: urDta.driverNumber,
    street: street,
    block: block,
    city: city,
    flag: true,
    vansaleApp: true,
    returnType: 'Invoice Wise',
    invoiceNoArray: [invoiceNo],
    imageData: '',
    sRStatus: 'Not Approved',
    crNote_webId: 'crNote_' + Random.id(),
    uuid: Random.id(),
    createdAt: new Date(orderData.docDate),
    updatedAt: new Date(),
  });
}
/**
 * For create credit Invoice
 * @param {*} creditInvData 
 * @param {*} customerName 
 * @param {*} customerAddress 
 * @param {*} branchName 
 * @param {*} acCode 
 * @param {*} itemArrayVal 
 * @param {*} totalQty 
 * @param {*} salesManName 
 * @param {*} street 
 * @param {*} block 
 * @param {*} city 
 * @param {*} approvalValue
 * @param {*} approvalResonArray
 */

function creditInvoiceCreateFunction(creditInvData, customerName, customerAddress, branchName, acCode, itemArrayVal, totalQty,
  salesManName, street, block, city, priceTypeName, usrData, approvalValue, approvalResonArray, routeId) {
  let creditRes = Invoice.insert({
    cardCode: creditInvData.customer,
    cardName: customerName,
    address: customerAddress,
    routeId: routeId,
    addressBilling: customerAddress,
    secondaryCustomer: '',
    branch: creditInvData.branch,
    branchName: branchName,
    acCode: acCode,
    employeeId: creditInvData.employee,
    userId: creditInvData.employee,
    docDueDate: creditInvData.dueDate,
    deliveryDate: creditInvData.dueDate,
    custRefDate: new Date(),
    custRef: creditInvData.mobileAppId,
    priceMode: creditInvData.priceMode,
    priceType: creditInvData.priceType,
    priceTypeName: priceTypeName,
    transporterName: usrData.transporterName,
    vehicleNumber: usrData.vehicleNumber,
    lorryBoy: usrData.lorryBoy,
    driverName: usrData.driverName,
    driverContactNumber: creditInvData.driverContactNumber,
    contactPerson: creditInvData.contactPerson,
    contactNumber: creditInvData.contactNumber,
    delivery: '',
    currency: "ZMW",
    latitude: creditInvData.latitude,
    longitude: creditInvData.longitude,
    discountPercentage: "0",
    docStatus: "O",
    SAPStatus: "Not Approved",
    cIStatus: "Not Approved",
    customerType: "Cash",
    docDate: new Date(creditInvData.docDate),
    creditInvoiceDate: new Date(creditInvData.docDate),
    creditInvoiceRemarks: creditInvData.remark,
    itemLines: itemArrayVal,
    totalQty: totalQty,
    totalItem: itemArrayVal.length,
    beforeDiscount: creditInvData.docTotal,
    afterDiscount: creditInvData.docTotal,
    grandTotal: creditInvData.docTotal,
    docNum: '',
    arInvId: '',
    discPrcnt: "0",
    cIRemark: creditInvData.remark,
    creditInvoice: true,
    mobileId: creditInvData.mobileAppId,
    sumAmount: creditInvData.docTotal,
    docTotal: creditInvData.docTotal,
    weight: creditInvData.weight,
    taxTotal: creditInvData.taxTotal,
    GST: creditInvData.taxTotal,
    salesmanName: salesManName,
    paymentMethod: 'Cash',
    cashAmountVal: creditInvData.docTotal,
    approvalValue: approvalValue,
    approvalResonArray: approvalResonArray,
    cashRemarkVal: '',
    transferamtValue: '',
    transferDateValue: '',
    transferRef: '',
    transferRemark: '',
    chequeInfo: [],
    street: street,
    block: block,
    city: city,
    flag: true,
    vansaleApp: true,
    arInv_WebId: 'crInv_' + Random.id(),
    uuid: Random.id(),
    createdAt: new Date(creditInvData.docDate),
    updatedAt: new Date(),
  });
  if (creditRes) {
    /**
 * for summary report
 */
    if (creditRes && routeId !== undefined) {
      let dateVal = moment(new Date()).format('DD-MM-YYYY')
      let summaryVal = SalesSummaryReport.findOne({
        employeeId: creditInvData.employee,
        attendenceDate: dateVal,
        routeAssignId: routeId,
      });
      if (summaryVal !== undefined) {
        let dataArray = [];
        if (summaryVal.dataArray !== undefined && summaryVal.dataArray.length > 0) {
          dataArray = summaryVal.dataArray
        }
        let dataObj =
        {
          totalQty: totalQty,
          totalItem: itemArrayVal.length,
          docTotal: creditInvData.docTotal,
          transaction: "Credit Invoice"

        }

        dataArray.push(dataObj);
        let totalAmt = 0;
        let itemTotal = 0;
        let itemQtyTotal = 0;
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].docTotal !== undefined) {
            totalAmt += Number(dataArray[i].docTotal);
          }
        }
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].totalQty !== undefined) {
            itemQtyTotal += Number(dataArray[i].totalQty);
          }
        }
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].totalItem !== undefined) {
            itemTotal += Number(dataArray[i].totalItem);
          }
        }

        // SalesSummaryReport.update({
        //   _id: summaryVal._id
        // }, {
        //   $set:
        //   {
        //     dataArray: dataArray,
        //     totalAmt: totalAmt.toString(),
        //     itemQtyTotal: itemQtyTotal.toString(),
        //     itemTotal: itemTotal.toString(),
        //     updatedAt: new Date(),
        //   }
        // });
      }
    }
  }
}


/**
 * For create POS Invoice
 * @param {*} posData 
 * @param {*} customerName 
 * @param {*} customerAddress 
 * @param {*} branchName 
 * @param {*} acCode 
 * @param {*} itemArrayVal 
 * @param {*} totalQty 
 * @param {*} salesManName 
 * @param {*} street 
 * @param {*} block 
 * @param {*} city 
 * @param {*} usrData
 */

function posInvoiceCreateFunction(posData, customerName, customerAddress, branchName, acCode, itemArrayVal, totalQty,
  salesManName, street, block, city, priceTypeName, usrData) {
  let posInvData = Invoice.insert({
    cardCode: posData.customer,
    cardName: customerName,
    address: customerAddress,
    addressBilling: customerAddress,
    secondaryCustomer: '',
    branch: posData.branch,
    branchName: branchName,
    posValue: true,
    acCode: acCode,
    employeeId: posData.employee,
    userId: posData.employee,
    docDueDate: posData.dueDate,
    deliveryDate: posData.dueDate,
    custRefDate: new Date(),
    custRef: posData.mobileAppId,
    priceMode: posData.priceMode,
    priceType: posData.priceType,
    priceTypeName: priceTypeName,
    transporterName: usrData.transporterName,
    vehicleNumber: usrData.vehicleNumber,
    discountPercentage: "0",
    lorryBoy: usrData.lorryBoy,
    driverName: usrData.driverName,
    driverContactNumber: posData.driverContactNumber,
    contactPerson: posData.contactPerson,
    contactNumber: posData.contactNumber,
    delivery: '',
    currency: "ZMW",
    latitude: posData.latitude,
    longitude: posData.longitude,
    docStatus: "O",
    SAPStatus: "Not Approved",
    cIStatus: "Not Approved",
    customerType: "Cash",
    docDate: new Date(posData.docDate),
    creditInvoiceDate: new Date(posData.docDate),
    creditInvoiceRemarks: posData.remark,
    itemLines: itemArrayVal,
    totalQty: totalQty,
    totalItem: itemArrayVal.length,
    beforeDiscount: posData.docTotal,
    afterDiscount: posData.docTotal,
    grandTotal: posData.docTotal,
    docNum: '',
    arInvId: '',
    discPrcnt: "0",
    cIRemark: posData.remark,
    creditInvoice: true,
    mobileId: posData.mobileAppId,
    sumAmount: posData.docTotal,
    docTotal: posData.docTotal,
    weight: posData.weight,
    taxTotal: posData.taxTotal,
    GST: posData.taxTotal,
    salesmanName: salesManName,
    paymentMethod: 'Cash',
    cashAmountVal: posData.docTotal,
    cashRemarkVal: '',
    transferamtValue: '',
    transferDateValue: '',
    transferRef: '',
    transferRemark: '',
    chequeInfo: [],
    street: street,
    block: block,
    city: city,
    flag: true,
    vansaleApp: true,
    arInv_WebId: 'crInv_' + Random.id(),
    uuid: Random.id(),
    createdAt: new Date(posData.docDate),
    updatedAt: new Date(),
  });

  if (posInvData) {
    apiCallForPOSInvoice(posInvData, posData.employee)
  }
  return posInvData;
}

/**
 * Sample POST method for creating sales quotation
 * Done By Visakh 
 * Date 15-01-2020
 */
JsonRoutes.add("POST", "/addSalesQuotation", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let custAddress = req.body.addressId;
          let cardType = req.body.cardType;
          let routeId = req.body.routeId;
          let customerName = '';
          let customerAddress = '';
          let street = '';
          let block = '';
          let city = '';
          let routeGroup = '';
          if (req.body.routeId) {
            let routeCheck = RouteAssign.findOne({ _id: req.body.routeId }, {
              fields: { routeId: 1 }
            });
            if (routeCheck) {
              routeGroup = routeCheck.routeId;
            }
          }
          let customerRes = Customer.findOne({ cardCode: req.body.customer });
          if (customerRes) {
            customerName = customerRes.cardName;
          }
          if (cardType === 'L') {
            let leadData = Lead.findOne({ cardCode: req.body.customer });
            if (leadData) {
              customerAddress = leadData.addresses[0].address;
              street = leadData.addresses[0].street;
              block = leadData.addresses[0].block;
              city = leadData.addresses[0].city;
            }
          }
          else {

            if (custAddress !== undefined && custAddress !== '') {
              let addressRes = CustomerAddress.findOne({ _id: custAddress, });
              if (addressRes) {
                customerAddress = addressRes.address;
                street = addressRes.street;
                block = addressRes.block;
                city = addressRes.city;
              }
            }
            else {
              let addressRes = CustomerAddress.findOne({ cardCode: req.body.customer, addressType: "S" });
              if (addressRes) {
                customerAddress = addressRes.address;
                street = addressRes.street;
                block = addressRes.block;
                city = addressRes.city;
              }
            }
          }
          let branchName = '';
          let branchRes = Branch.findOne({ bPLId: req.body.branch });
          if (branchRes) {
            branchName = branchRes.bPLName;
          }

          let priceTypeName = '';
          let priceTypeRes = CustomerPriceList.findOne({ prcList: req.body.priceType });
          if (priceTypeRes) {
            priceTypeName = priceTypeRes.pLName;
          }
          let salesManName = '';
          let userres = Meteor.users.findOne({ _id: req.body.employee });
          if (userres) {
            salesManName = `${userres.profile.firstName} ${userres.profile.lastName}`;
          }
          let totalQty = 0;
          let itemsQty = req.body.itemLines;

          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          let itemArrayVal = [];

          if (req.body.itemLines.length > 0) {
            for (let x = 0; x < req.body.itemLines.length; x++) {
              let itemName = '';
              let itemRes = Item.findOne({ itemCode: req.body.itemLines[x].itemCode });
              if (itemRes) {
                itemName = itemRes.itemNam;
              }

              let taxName = '';
              let taxRes = Tax.findOne({ taxCode: req.body.itemLines[x].vatGroup });
              if (taxRes) {
                taxName = taxRes.name;
              }

              let uoMEntryVal = '';
              let unitRes = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode });
              if (unitRes) {
                uoMEntryVal = unitRes.uomEntry;
              }
              // let grossTotalVal = (Number(req.body.itemLines[x].grossTotal) * Number(req.body.itemLines[x].quantity));
              let beforeDiscountVal = (Number(req.body.itemLines[x].incPrice) * Number(req.body.itemLines[x].quantity));
              let itemObj =
              {
                randomId: Random.id(),
                uoMEntry: uoMEntryVal,
                unitQuantity: req.body.itemLines[x].unitQuantity,
                uomCode: req.body.itemLines[x].uomCode,
                unitPrice: req.body.itemLines[x].unitPrice,
                price: req.body.itemLines[x].unitPrice,
                salesPrice: req.body.itemLines[x].unitPrice,
                grossTotal: req.body.itemLines[x].grossTotal,
                incPrice: req.body.itemLines[x].incPrice,
                excPrice: req.body.itemLines[x].excPrice,
                itemCategory: '',
                itemCode: req.body.itemLines[x].itemCode,
                vatRate: req.body.itemLines[x].vatRate,
                mVATBoolean: '',
                u_MVATPerStockUnit: '',
                invWeight: req.body.itemLines[x].invWeight,
                itemNam: itemName,
                itemRemark: '',
                quantity: req.body.itemLines[x].quantity,
                taxRate: req.body.itemLines[x].taxRate,
                vatGroup: req.body.itemLines[x].vatGroup,
                vatGroupName: taxName,
                discount: '0',
                discountAmount: '0',
                whsCode: req.body.itemLines[x].whsCode,
                beforeDiscount: beforeDiscountVal.toString(),
                afterDiscount: beforeDiscountVal.toString(),
                baseLine: req.body.itemLines[x].baseLine,
              }
              itemArrayVal.push(itemObj);
            }
          }
          locationTransactionWiseFun(id, new Date(), req.body.latitude, req.body.longitude,
            "Sales Quotation", customerName, routeGroup, req.body.docTotal)
          if (cardType === 'L') {
            let leadName = '';
            let leadRes = Lead.findOne({ cardCode: req.body.customer });
            if (leadRes) {
              leadName = leadRes.cardName;
            }
            LeadQuotation.insert({
              cardCode: req.body.customer,
              cardName: leadName,
              address: customerAddress,
              addressBilling: customerAddress,
              routeId: routeId,
              branch: req.body.branch,
              branchName: branchName,
              employeeId: req.body.employee,
              userId: req.body.employee,
              docDueDate: req.body.dueDate,
              custRefDate: new Date(),
              custRefNo: req.body.mobileAppId,
              priceMode: req.body.priceMode,
              priceType: req.body.priceType,
              priceTypeName: priceTypeName,
              currency: "ZMW",
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              docStatus: "O",
              SAPStatus: "Not Approved",
              docDate: new Date(req.body.docDate),
              itemLines: itemArrayVal,
              totalQty: totalQty,
              totalItem: itemArrayVal.length,
              beforeDiscount: req.body.docTotal,
              afterDiscount: req.body.docTotal,
              docNum: '',
              orderId: '',
              discPrcnt: "0",
              remark_order: '',
              mobileId: req.body.mobileAppId,
              docTotal: req.body.docTotal,
              weight: req.body.weight,
              taxTotal: req.body.taxTotal,
              GST: req.body.taxTotal,
              salesmanName: salesManName,
              discPercnt: '0',
              street: street,
              block: block,
              city: city,
              flag: true,
              vansaleApp: true,
              sQId: "",
              sQStatus: "",
              sQ_webId: 'sQ_' + Random.id(),
              mvats: [],
              driverName: req.body.driverName,
              ribNumber: req.body.ribNumber,
              approvalValue: false,
              uuid: Random.id(),
              createdAt: new Date(req.body.docDate),
            });
          }
          else {

            SalesQuotation.insert({
              cardCode: req.body.customer,
              cardName: customerName,
              address: customerAddress,
              addressBilling: customerAddress,
              routeId: routeId,
              branch: req.body.branch,
              branchName: branchName,
              employeeId: req.body.employee,
              userId: req.body.employee,
              docDueDate: req.body.dueDate,
              custRefDate: new Date(),
              custRefNo: req.body.mobileAppId,
              priceMode: req.body.priceMode,
              priceType: req.body.priceType,
              priceTypeName: priceTypeName,
              currency: "ZMW",
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              docStatus: "O",
              SAPStatus: "Not Approved",
              docDate: new Date(req.body.docDate),
              itemLines: itemArrayVal,
              totalQty: totalQty,
              totalItem: itemArrayVal.length,
              beforeDiscount: req.body.docTotal,
              afterDiscount: req.body.docTotal,
              docNum: '',
              orderId: '',
              discPrcnt: "0",
              remark_order: '',
              mobileId: req.body.mobileAppId,
              docTotal: req.body.docTotal,
              weight: req.body.weight,
              taxTotal: req.body.taxTotal,
              GST: req.body.taxTotal,
              salesmanName: salesManName,
              discPercnt: '0',
              street: street,
              block: block,
              city: city,
              flag: true,
              vansaleApp: true,
              sQId: "",
              sQStatus: "",
              sQ_webId: 'sQ_' + Random.id(),
              mvats: [],
              driverName: req.body.driverName,
              ribNumber: req.body.ribNumber,
              approvalValue: false,
              uuid: Random.id(),
              createdAt: new Date(req.body.docDate),
            });
          }
          let dateVal = moment(new Date()).format('DD-MM-YYYY');
          let summaryVal = SalesSummaryReport.findOne({
            employeeId: req.body.employee,
            attendenceDate: dateVal,
            routeAssignId: routeId,
          });
          if (summaryVal !== undefined) {
            let dataArray = [];
            if (summaryVal.dataArray !== undefined && summaryVal.dataArray.length > 0) {
              dataArray = summaryVal.dataArray
            }
            let dataObj =
            {
              totalQty: totalQty,
              totalItem: itemArrayVal.length,
              docTotal: req.body.docTotal,
              transaction: "Sales Quotation"
            }
            dataArray.push(dataObj);
            let totalAmt = 0;
            let itemTotal = 0;
            let itemQtyTotal = 0;
            for (let i = 0; i < dataArray.length; i++) {
              if (dataArray[i].docTotal !== undefined) {
                totalAmt += Number(dataArray[i].docTotal);
              }
            }
            for (let i = 0; i < dataArray.length; i++) {
              if (dataArray[i].totalQty !== undefined) {
                itemQtyTotal += Number(dataArray[i].totalQty);
              }
            }
            for (let i = 0; i < dataArray.length; i++) {
              if (dataArray[i].totalItem !== undefined) {
                itemTotal += Number(dataArray[i].totalItem);
              }
            }
            // SalesSummaryReport.update({
            //   _id: summaryVal._id
            // }, {
            //   $set:
            //   {
            //     dataArray: dataArray,
            //     totalAmt: totalAmt.toString(),
            //     itemQtyTotal: itemQtyTotal.toString(),
            //     itemTotal: itemTotal.toString(),
            //     updatedAt: new Date(),
            //   }
            // });
          }


          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Sales Quotation Added Successfully",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// 


/** Update ...........
 * Sample GET method for calling the Updated Customer details accoriding to user branch
 * Done By : Nithin
 * Date : 18/01/21
 */
JsonRoutes.add("GET", "/updatedCustomerList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id -", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let toDate = new Date(today);
          let nextDay = new Date(toDate);
          nextDay.setDate(nextDay.getDate() + 1);
          let branch = [];
          let customersArray = [];
          branch = user.defaultBranch;
          let customerPriceList = CustomerPriceList.find().fetch();
          // console.log("custList",customerPriceList);
          if (branch !== '' && branch !== undefined) {
            let customerRes = Customer.find({
              bPLId: branch, cardType: "C",
              updatedAt: {
                $gte: toDate,
                $lt: nextDay
              }
            }, {
              fields: {
                cardName: 1, cardCode: 1, balance: 1, creditLine: 1, priceMode: 1,
                address: 1, phone1: 1, mailAddres: 1, cntctPrsn: 1, priceList: 1
              }
            }).fetch();

            if (customerRes !== undefined && customerRes.length > 0) {
              customersArray = customerRes;
              for (let i = 0; i < customersArray.length; i++) {
                let priceList = customerPriceList.find(x => x.cardCode === customersArray[i].cardCode && x.bPLId === branch);
                // console.log("prcList",priceList);
                if (priceList !== undefined) {
                  customersArray[i].priceList = priceList.prcList;
                } else {
                  customersArray.splice(i, 1);
                }
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "not found",
                  data: []
                }
              });
            }
            if (customersArray !== undefined && customersArray.length > 0) {
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "success",
                  data: customersArray
                },
              });
            }
          }
          else {
            // console.log("Branch Undefined..!");
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/** Update ...........
 * Sample GET method for calling the updated item full list accoriding to user :- _id
 * Done By : Nithin
 * Date : 18/01/21
 */
JsonRoutes.add("GET", "/updatedItemFullList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let toDate = new Date(today);
          let nextDay = new Date(toDate);
          nextDay.setDate(nextDay.getDate() + 1);
          let itemList = [];
          let itemFullList = Item.find({
            active: "Y", updatedAt: {
              $gte: toDate,
              $lt: nextDay
            }
          }, { fields: { itemCode: 1, itemNam: 1, ugpCode: 1, vatGourp: 1, invntryUom: 1, taxRate: 1, u_MVATPerStockUnit: 1 } }).fetch();
          if (itemFullList !== undefined && itemFullList.length > 0) {
            for (let i = 0; i < itemFullList.length; i++) {
              let itemObj =
              {
                itemCode: itemFullList[i].itemCode,
                itemNam: itemFullList[i].itemNam,
                ugpCode: itemFullList[i].ugpCode,
                vatGourp: itemFullList[i].vatGourp,
                taxRate: itemFullList[i].taxRate,
                u_MVATPerStockUnit: itemFullList[i].u_MVATPerStockUnit,
                invntryUom: itemFullList[i].invntryUom,
              }
              itemList.push(itemObj);
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
          if (itemList !== undefined && itemList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: itemList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/** Update ...........
 * Sample GET method for calling the updated unit accoriding to user :- _id
 * Done By : Nithin
 * Date : 18/01/21
 */
JsonRoutes.add("GET", "/updatedUnitFullList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let unitList = [];
          let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let toDate = new Date(today);
          let nextDay = new Date(toDate);
          nextDay.setDate(nextDay.getDate() + 1);
          let unitFullList = Unit.find({
            updatedAt: {
              $gte: toDate,
              $lt: nextDay
            }
          }, { fields: { ugpCode: 1, uomCode: 1, baseQty: 1, uomEntry: 1 } }).fetch();
          console.log("unitFullList", unitFullList);
          if (unitFullList !== undefined && unitFullList.length > 0) {
            for (let i = 0; i < unitFullList.length; i++) {
              let unitObj =
              {
                uomCode: unitFullList[i].uomCode,
                uomEntry: unitFullList[i].uomEntry,
                ugpCode: unitFullList[i].ugpCode,
                baseQty: unitFullList[i].baseQty,
              }
              unitList.push(unitObj);
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
          if (unitList !== undefined && unitList.length > 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: unitList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/** updated......
 * Sample GET method for calling the WareHouseStock details accoriding to user warehouse
 * Done By : Nithin
 * Date : 18/01/21
 */
JsonRoutes.add("GET", "/updatedStockList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.params", req.params);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let wareHouses = user.defaultWareHouse;
          let warehouseStocks = [];
          let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let toDate = new Date(today);
          let nextDay = new Date(toDate);
          nextDay.setDate(nextDay.getDate() + 1);
          if (wareHouses !== '' && wareHouses !== undefined) {
            let stockDetailVal = WareHouseStock.find({
              whsCode: wareHouses, updatedAt: {
                $gte: toDate,
                $lt: nextDay
              }
            },
              {
                fields: {
                  itemCode: 1, bPLId: 1, whsCode: 1, onHand: 1, avgPrice: 1,
                }
              }).fetch();
            if (stockDetailVal !== undefined && stockDetailVal.length > 0) {
              for (let i = 0; i < stockDetailVal.length; i++) {
                let stockObj = {
                  itemCode: stockDetailVal[i].itemCode,
                  bPLId: stockDetailVal[i].bPLId,
                  whsCode: stockDetailVal[i].whsCode,
                  whsName: user.defaultWareHouseName,
                  onHand: stockDetailVal[i].onHand,
                  avgPrice: stockDetailVal[i].avgPrice
                }
                warehouseStocks.push(stockObj);
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "not found",
                  data: []
                }
              });
            }
            if (warehouseStocks !== undefined && warehouseStocks.length > 0) {
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "success",
                  data: warehouseStocks
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: " warehouse not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
* Sample POST method for updating Current Location of the User
* Done By Visakh 
* Date 25-01-2020
*/
JsonRoutes.add("POST", "/currentLocation_update", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used

          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          if (req.body.latitude == '' || req.body.latitude == undefined || req.body.longitude == '' || req.body.longitude == undefined) {
            JsonRoutes.sendResult(res, {
              code: 401,
              data: {
                code: 401,
                message: "Please do check the fields",
                data: []
              }
            });
          } else {
            // let currentData = CurrentLocation.findOne({ userId: req.body._id });
            // if (currentData) {
            //   let historyObj = {
            //     latitude: currentData.latitude,
            //     longitude: currentData.longitude,
            //     date: currentData.date,
            //   }
            //   let locHistory = currentData.locationHistory;
            //   locHistory.push(historyObj);
            //   CurrentLocation.update({ _id: currentData._id }, {
            //     $set: {
            //       latitude: req.body.latitude,
            //       longitude: req.body.longitude,
            //       date: new Date(),
            //       locationHistory: locHistory,
            //       updateAt: new Date()
            //     }
            //   });
            // } else {
            locationUpdateFun(req.body, user.defaultBranch);

            // }
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Location Updated Successfully",
                data: []
              }
            });
          }

        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});



/**
 * Sample GET method for calling the graph details accoriding to user :- _id
 * Done By : Nithin
 * Date : 26/01/2021
 */
JsonRoutes.add("GET", "/getGraphData/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let arInvoiceArray = [];
          let crInvoiceArray = [];
          let orderArray = [];
          let arAmnt = 0;
          let crAmnt = 0;
          let ordAmnt = 0;

          // last 10 days data  ** ar invoice
          for (let x = 0; x < 10; x++) {
            let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
            let dateToday = new Date(todayDates);
            let dateValue = new Date(todayDates);
            arAmnt = 0;
            dateValue.setDate(dateValue.getDate() - x);
            dateToday.setDate(dateValue.getDate() + 1);
            let arInvoiceAmount = ArInvoicePayment.find({
              userId: id,
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            }, { fields: { grandTotal: 1 } }).fetch();
            if (arInvoiceAmount !== undefined && arInvoiceAmount.length > 0) {
              for (let i = 0; i < arInvoiceAmount.length; i++) {
                arAmnt += Number(arInvoiceAmount[i].grandTotal);
              }
            }
            let dateObj =
            {
              date: moment(dateValue).format('DD-MM-YYYY'),
              amount: Number(arAmnt).toFixed(2)
            }
            arInvoiceArray.push(dateObj);
          }
          // last 10 days data ** cr invoice

          for (let x = 0; x < 10; x++) {
            let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
            let dateToday = new Date(todayDates);
            let dateValue = new Date(todayDates);
            crAmnt = 0;
            dateValue.setDate(dateValue.getDate() - x);
            dateToday.setDate(dateValue.getDate() + 1);
            let creditInvoiceAmount = Invoice.find({
              userId: id,
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }, creditInvoice: true
            }, { fields: { grandTotal: 1 } }).fetch();
            if (creditInvoiceAmount !== undefined && creditInvoiceAmount.length > 0) {
              for (let i = 0; i < creditInvoiceAmount.length; i++) {
                crAmnt += Number(creditInvoiceAmount[i].grandTotal);
              }
            }
            let dateObj =
            {
              date: moment(dateValue).format('DD-MM-YYYY'),
              amount: Number(crAmnt).toFixed(2)
            }
            crInvoiceArray.push(dateObj);
          }


          // last 10 days data ** order

          for (let x = 0; x < 10; x++) {
            let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
            let dateToday = new Date(todayDates);
            let dateValue = new Date(todayDates);
            ordAmnt = 0;
            dateValue.setDate(dateValue.getDate() - x);
            dateToday.setDate(dateValue.getDate() + 1);
            let orderAmount = Order.find({
              userId: id,
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            }, { fields: { docTotal: 1 } }).fetch();
            if (orderAmount !== undefined && orderAmount.length > 0) {
              for (let i = 0; i < orderAmount.length; i++) {
                ordAmnt += Number(orderAmount[i].docTotal);
              }
            }
            let dateObj =
            {
              date: moment(dateValue).format('DD-MM-YYYY'),
              amount: Number(ordAmnt).toFixed(2)
            }
            orderArray.push(dateObj);
          }

          let dataObject = {
            arInvoiceTotal: arInvoiceArray,
            creditInvoiceTotal: crInvoiceArray,
            orderTotal: orderArray,
          }
          // console.log("History", history.length);
          if (dataObject !== undefined) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: dataObject
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});




/**
 * Sample GET method for calling the sales order accoriding to customer
 * Done By : Nithin
 * Date : 28/01/21
 */
JsonRoutes.add("GET", "/customerWiseSalesOrderList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let salesOrderList = [];
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeDates = new Date(todayDates);
          let routeEndDate = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let routeRes = RouteAssign.find({
            active: "Y",
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeCode: 1, routeId: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            let customerArrays = [];
            for (let k = 0; k < routeRes.length; k++) {
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[k].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let x = 0; x < routeCustomerDetails.length; x++) {
                  customerArrays.push(routeCustomerDetails[x].customer);
                }
              }
            }
            if (user.cardCode !== undefined && user.cardCode !== '') {
              customerArrays.push(user.cardCode);
            }
            let orderObj = ''
            let orderGet = Order.find({
              employeeId: id, cardCode: { "$in": customerArrays },
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            }, {
              fields: {
                employeeId: 1, cardName: 1, branchName: 1, mobileId: 1, salesmanName: 1, SAPStatus: 1, weight: 1,
                docDueDate: 1, docStatus: 1, ord_webId: 1, docTotal: 1, orderId: 1, docNum: 1, branch: 1, cardCode: 1,
                address: 1, docDate: 1, itemLines: 1, taxTotal: 1, priceMode: 1, priceType: 1, priceTypeName: 1,
              }, sort: { createdAt: -1 }
            }).fetch();
            if (orderGet !== undefined && orderGet.length > 0) {
              for (let i = 0; i < orderGet.length; i++) {
                let itemArray = [];
                for (let m = 0; m < orderGet[i].itemLines.length; m++) {
                  let itemArrayObj = {
                    randomId: orderGet[i].itemLines[m].randomId,
                    itemNam: orderGet[i].itemLines[m].itemNam,
                    itemCode: orderGet[i].itemLines[m].itemCode,
                    uomCode: orderGet[i].itemLines[m].uomCode,
                    uoMEntry: orderGet[i].itemLines[m].uoMEntry,
                    unitQuantity: orderGet[i].itemLines[m].unitQuantity,
                    quantity: orderGet[i].itemLines[m].quantity,
                    taxRate: orderGet[i].itemLines[m].taxRate,
                    incPrice: orderGet[i].itemLines[m].incPrice,
                    excPrice: orderGet[i].itemLines[m].excPrice,
                    vatRate: orderGet[i].itemLines[m].vatRate,
                    grossTotal: orderGet[i].itemLines[m].grossTotal,
                    unitPrice: orderGet[i].itemLines[m].unitPrice,
                    price: orderGet[i].itemLines[m].price,
                    vatGroup: orderGet[i].itemLines[m].vatGroup,
                    invWeight: orderGet[i].itemLines[m].invWeight,
                    baseLine: orderGet[i].itemLines[m].baseLine,
                  }
                  itemArray.push(itemArrayObj);
                }

                let mobileAppId = '';
                if (orderGet[i].mobileId !== undefined) {
                  mobileAppId = orderGet[i].mobileId;
                }
                orderObj =
                {
                  _id: orderGet[i]._id,
                  docNum: orderGet[i].orderId,
                  cardCode: orderGet[i].cardCode,
                  cardName: orderGet[i].cardName,
                  branch: orderGet[i].branch,
                  branchName: orderGet[i].branchName,
                  priceMode: orderGet[i].priceMode,
                  priceType: orderGet[i].priceType,
                  priceTypeName: orderGet[i].priceTypeName,
                  docDate: orderGet[i].docDate,
                  dueDate: orderGet[i].docDueDate,
                  docStatus: orderGet[i].docStatus,
                  webId: orderGet[i].ord_webId,
                  mobileId: mobileAppId,
                  docTotal: orderGet[i].docTotal.toString(),
                  taxTotal: orderGet[i].taxTotal.toString(),
                  weight: orderGet[i].weight.toString(),
                  SAPStatus: orderGet[i].SAPStatus,
                  itemArray: itemArray
                }
                salesOrderList.push(orderObj)
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                data: {
                  code: 404,
                  message: "No Data Found",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
          if (salesOrderList !== undefined && salesOrderList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: salesOrderList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample GET method for calling the sales return accoriding to customer
 * Done By : Nithin
 * Date : 13/05/21
 */
JsonRoutes.add("GET", "/customerWiseSalesReturnList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let salesOrderList = [];
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeDates = new Date(todayDates);
          let routeEndDate = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let routeRes = RouteAssign.find({
            active: "Y",
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeCode: 1, routeId: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            let customerArrays = [];
            for (let k = 0; k < routeRes.length; k++) {
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[k].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let x = 0; x < routeCustomerDetails.length; x++) {
                  customerArrays.push(routeCustomerDetails[x].customer);
                }
              }
            }
            if (user.cardCode !== undefined && user.cardCode !== '') {
              customerArrays.push(user.cardCode);
            }
            let orderObj = ''
            let orderGet = SalesReturn.find({
              employeeId: id, cardCode: { "$in": customerArrays },
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            }, {
              fields: {
                employeeId: 1, cardName: 1, branchName: 1, mobileId: 1, salesmanName: 1, SAPStatus: 1, weight: 1,
                docDueDate: 1, docStatus: 1, ord_webId: 1, docTotal: 1, docNum: 1, docNum: 1, branch: 1, cardCode: 1,
                address: 1, docDate: 1, itemLines: 1, taxTotal: 1, priceMode: 1, priceType: 1, priceTypeName: 1,
              }, sort: { createdAt: -1 }
            }).fetch();
            if (orderGet !== undefined && orderGet.length > 0) {
              for (let i = 0; i < orderGet.length; i++) {
                let itemArray = [];
                for (let m = 0; m < orderGet[i].itemLines.length; m++) {
                  let itemArrayObj = {
                    randomId: orderGet[i].itemLines[m].randomId,
                    itemNam: orderGet[i].itemLines[m].itemNam,
                    itemCode: orderGet[i].itemLines[m].itemCode,
                    uomCode: orderGet[i].itemLines[m].uomCode,
                    uoMEntry: orderGet[i].itemLines[m].uoMEntry,
                    unitQuantity: orderGet[i].itemLines[m].unitQuantity,
                    quantity: orderGet[i].itemLines[m].quantity,
                    taxRate: orderGet[i].itemLines[m].taxRate,
                    incPrice: orderGet[i].itemLines[m].incPrice,
                    excPrice: orderGet[i].itemLines[m].excPrice,
                    vatRate: orderGet[i].itemLines[m].vatRate,
                    grossTotal: orderGet[i].itemLines[m].grossTotal,
                    unitPrice: orderGet[i].itemLines[m].unitPrice,
                    price: orderGet[i].itemLines[m].price,
                    vatGroup: orderGet[i].itemLines[m].vatGroup,
                    invWeight: orderGet[i].itemLines[m].invWeight,
                    baseLine: orderGet[i].itemLines[m].baseLine,
                  }
                  itemArray.push(itemArrayObj);
                }

                let mobileAppId = '';
                if (orderGet[i].mobileId !== undefined) {
                  mobileAppId = orderGet[i].mobileId;
                }
                orderObj =
                {
                  _id: orderGet[i]._id,
                  docNum: orderGet[i].docNum,
                  cardCode: orderGet[i].cardCode,
                  cardName: orderGet[i].cardName,
                  branch: orderGet[i].branch,
                  branchName: orderGet[i].branchName,
                  priceMode: orderGet[i].priceMode,
                  priceType: orderGet[i].priceType,
                  priceTypeName: orderGet[i].priceTypeName,
                  docDate: orderGet[i].docDate,
                  dueDate: orderGet[i].docDueDate,
                  docStatus: orderGet[i].docStatus,
                  webId: orderGet[i].ord_webId,
                  mobileId: mobileAppId,
                  docTotal: orderGet[i].docTotal.toString(),
                  taxTotal: orderGet[i].taxTotal.toString(),
                  weight: orderGet[i].weight.toString(),
                  SAPStatus: orderGet[i].SAPStatus,
                  itemArray: itemArray
                }
                salesOrderList.push(orderObj)
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                data: {
                  code: 404,
                  message: "No Data Found",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
          if (salesOrderList !== undefined && salesOrderList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: salesOrderList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample GET method for calling the sales quotation accoriding to customer
 * Done By : Nithin
 * Date : 28/01/21
 */
JsonRoutes.add("GET", "/customerWiseSalesQuotationList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let salesQuotationList = [];
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeEndDate = new Date(todayDates);
          let routeDates = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let routeRes = RouteAssign.find({
            active: "Y",
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeCode: 1, routeId: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            let customerArrays = [];
            for (let k = 0; k < routeRes.length; k++) {
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[k].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let x = 0; x < routeCustomerDetails.length; x++) {
                  customerArrays.push(routeCustomerDetails[x].customer);
                }
              }
            }
            if (user.cardCode !== undefined && user.cardCode !== '') {
              customerArrays.push(user.cardCode);
            }
            let quotationGet = SalesQuotation.find({
              employeeId: id, cardCode: { "$in": customerArrays },
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            }, {
              fields: {
                cardName: 1, branchName: 1, mobileId: 1, salesmanName: 1, SAPStatus: 1, branch: 1, weight: 1,
                docDueDate: 1, docStatus: 1, itemLines: 1, taxTotal: 1, priceMode: 1, priceType: 1, priceTypeName: 1,
                sQ_webId: 1, docTotal: 1, sQId: 1, orderId: 1, address: 1, docDate: 1, cardCode: 1,
              }, sort: { createdAt: -1 }
            }).fetch();
            if (quotationGet !== undefined && quotationGet.length > 0) {
              for (let i = 0; i < quotationGet.length; i++) {
                let itemArray = [];
                for (let m = 0; m < quotationGet[i].itemLines.length; m++) {
                  let itemArrayObj = {
                    randomId: quotationGet[i].itemLines[m].randomId,
                    itemNam: quotationGet[i].itemLines[m].itemNam,
                    itemCode: quotationGet[i].itemLines[m].itemCode,
                    uomCode: quotationGet[i].itemLines[m].uomCode,
                    uoMEntry: quotationGet[i].itemLines[m].uoMEntry,
                    unitQuantity: quotationGet[i].itemLines[m].unitQuantity,
                    quantity: quotationGet[i].itemLines[m].quantity,
                    taxRate: quotationGet[i].itemLines[m].taxRate,
                    incPrice: quotationGet[i].itemLines[m].incPrice,
                    vatRate: quotationGet[i].itemLines[m].vatRate,
                    excPrice: quotationGet[i].itemLines[m].excPrice,
                    grossTotal: quotationGet[i].itemLines[m].grossTotal,
                    unitPrice: quotationGet[i].itemLines[m].unitPrice,
                    price: quotationGet[i].itemLines[m].price,
                    vatGroup: quotationGet[i].itemLines[m].vatGroup,
                    invWeight: quotationGet[i].itemLines[m].invWeight,
                    baseLine: quotationGet[i].itemLines[m].baseLine,
                  }
                  itemArray.push(itemArrayObj);
                }
                let mobileAppId = '';
                if (quotationGet[i].mobileId !== undefined) {
                  mobileAppId = quotationGet[i].mobileId;
                }
                let orderObj =
                {
                  _id: quotationGet[i]._id,
                  docNum: quotationGet[i].sQId,
                  cardCode: quotationGet[i].cardCode,
                  cardName: quotationGet[i].cardName,
                  branch: quotationGet[i].branch,
                  branchName: quotationGet[i].branchName,
                  priceMode: quotationGet[i].priceMode,
                  priceType: quotationGet[i].priceType,
                  priceTypeName: quotationGet[i].priceTypeName,
                  docDate: quotationGet[i].docDate,
                  dueDate: quotationGet[i].docDueDate,
                  docStatus: quotationGet[i].docStatus,
                  webId: quotationGet[i].sQ_webId,
                  mobileId: mobileAppId,
                  docTotal: quotationGet[i].docTotal.toString(),
                  taxTotal: quotationGet[i].taxTotal.toString(),
                  weight: quotationGet[i].weight.toString(),
                  SAPStatus: quotationGet[i].SAPStatus,
                  orderId: quotationGet[i].orderId,
                  itemArray: itemArray
                }
                salesQuotationList.push(orderObj)
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                data: {
                  code: 404,
                  message: "No Data Found",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
          if (salesQuotationList !== undefined && salesQuotationList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: salesQuotationList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});



/**
 * Sample GET method for calling the Direct Invoice details accoriding to customer
 * Done By : Nithin
 * Date : 28/01/21
 */
JsonRoutes.add("GET", "/customerWiseArInvoiceList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let arInvoiceArray = [];
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeEndDate = new Date(todayDates);
          let routeDates = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let routeRes = RouteAssign.find({
            active: "Y",
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeCode: 1, routeId: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            let customerArrays = [];
            for (let k = 0; k < routeRes.length; k++) {
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[k].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let x = 0; x < routeCustomerDetails.length; x++) {
                  customerArrays.push(routeCustomerDetails[x].customer);
                }
              }
            }
            if (user.cardCode !== undefined && user.cardCode !== '') {
              customerArrays.push(user.cardCode);
            }
            let customerData = Customer.find({ cardCode: { "$in": customerArrays } }, { fields: { cardCode: 1, glblLocNum: 1 } }).fetch();

            let arInvoiceData = ArInvoicePayment.find({
              userId: id, cardCode: { "$in": customerArrays },
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            },
              {
                fields: {
                  cardName: 1, cardCode: 1, branchName: 1, arInvId: 1, grandTotal: 1,
                  docNum: 1, docDate: 1, docTotal: 1, arInv_WebId: 1, mobileId: 1, docDueDate: 1,
                  itemLines: 1, taxTotal: 1, weight: 1, branch: 1, SAPStatus: 1,
                  priceTypeName: 1, priceMode: 1, priceType: 1, docStatus: 1, series: 1,
                  cartItemTotal: 1, returnItemTotal: 1
                }, sort: { createdAt: -1 }
              }).fetch();

            if (arInvoiceData !== undefined && arInvoiceData.length > 0) {
              for (let i = 0; i < arInvoiceData.length; i++) {
                let itemArray = [];
                for (let m = 0; m < arInvoiceData[i].itemLines.length; m++) {
                  let returnValue = "false";
                  if (arInvoiceData[i].itemLines[m].isItemReturn !== undefined &&
                    arInvoiceData[i].itemLines[m].isItemReturn === 'true') {
                    returnValue = "true";
                  }

                  let itemArrayObj = {
                    randomId: arInvoiceData[i].itemLines[m].randomId,
                    itemNam: arInvoiceData[i].itemLines[m].itemNam,
                    itemCode: arInvoiceData[i].itemLines[m].itemCode,
                    uomCode: arInvoiceData[i].itemLines[m].uomCode,
                    uoMEntry: arInvoiceData[i].itemLines[m].uoMEntry,
                    unitQuantity: arInvoiceData[i].itemLines[m].unitQuantity,
                    quantity: arInvoiceData[i].itemLines[m].quantity,
                    taxRate: arInvoiceData[i].itemLines[m].taxRate,
                    incPrice: arInvoiceData[i].itemLines[m].incPrice,
                    excPrice: arInvoiceData[i].itemLines[m].excPrice,
                    grossTotal: arInvoiceData[i].itemLines[m].grossTotal,
                    unitPrice: arInvoiceData[i].itemLines[m].unitPrice,
                    vatRate: arInvoiceData[i].itemLines[m].vatRate,
                    price: arInvoiceData[i].itemLines[m].price,
                    vatGroup: arInvoiceData[i].itemLines[m].vatGroup,
                    invWeight: arInvoiceData[i].itemLines[m].invWeight,
                    baseLine: arInvoiceData[i].itemLines[m].baseLine,
                    isItemReturn: returnValue,
                  }
                  itemArray.push(itemArrayObj);
                }

                let mobileAppId = '';
                if (arInvoiceData[i].mobileId !== undefined) {
                  mobileAppId = arInvoiceData[i].mobileId;
                }
                let cartItemTotal = '0.00';
                if (arInvoiceData[i].cartItemTotal !== undefined) {
                  cartItemTotal = arInvoiceData[i].cartItemTotal;
                }
                let returnItemTotal = '0.00';
                if (arInvoiceData[i].returnItemTotal !== undefined) {
                  returnItemTotal = arInvoiceData[i].returnItemTotal;
                }
                let arObj = {
                  _id: arInvoiceData[i]._id,
                  docNum: arInvoiceData[i].arInvId,
                  cardCode: arInvoiceData[i].cardCode,
                  cardName: arInvoiceData[i].cardName,
                  customerTPIN: customerData.find(x => x.cardCode === arInvoiceData[i].cardCode).glblLocNum,
                  branch: arInvoiceData[i].branch,
                  series: arInvoiceData[i].series,
                  branchName: arInvoiceData[i].branchName,
                  priceMode: arInvoiceData[i].priceMode,
                  priceType: arInvoiceData[i].priceType,
                  priceTypeName: arInvoiceData[i].priceTypeName,
                  docTotal: arInvoiceData[i].grandTotal.toString(),
                  taxTotal: arInvoiceData[i].taxTotal.toString(),
                  weight: arInvoiceData[i].weight.toString(),
                  docDate: arInvoiceData[i].docDate,
                  dueDate: arInvoiceData[i].docDueDate,
                  docStatus: arInvoiceData[i].docStatus,
                  arInv_WebId: arInvoiceData[i].arInv_WebId,
                  SAPStatus: arInvoiceData[i].SAPStatus,
                  mobileId: mobileAppId,
                  cartItemTotal: cartItemTotal,
                  returnItemTotal: returnItemTotal,
                  itemArray: itemArray,

                };
                arInvoiceArray.push(arObj);
              }
              // if (customerData) {
              //   for (let n = 0; n < arInvoiceArray.length; n++) {
              //    let specificCustomer= customerData.find(x => x.cardCode === arInvoiceArray[n].cardCode);
              //    if (specificCustomer) {
              //     arInvoiceArray[n].customerTPIN = specificCustomer.glblLocNum;
              //    }else{
              //     arInvoiceArray[n].customerTPIN = '';
              //    }
              //   }
              // }
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "No Data found",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "No Data found",
                data: []
              }
            });
          }

          // console.log("History", history.length);
          if (arInvoiceArray !== undefined && arInvoiceArray.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: arInvoiceArray
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End AR Invoice



/**
 * Sample GET method for calling the Credit Invoice details accoriding to Customer
 * Done by Nithin
 * Date : 28/01/21
 */
JsonRoutes.add("GET", "/customerWiseCreditInvoiceList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {

          let id = req.params._id;
          let creditInvArray = [];
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeEndDate = new Date(todayDates);
          let routeDates = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let routeRes = RouteAssign.find({
            active: "Y",
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeCode: 1, routeId: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            let customerArrays = [];
            for (let k = 0; k < routeRes.length; k++) {
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[k].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let x = 0; x < routeCustomerDetails.length; x++) {
                  customerArrays.push(routeCustomerDetails[x].customer);
                }
              }
            }
            if (user.cardCode !== undefined && user.cardCode !== '') {
              customerArrays.push(user.cardCode);
            }

            let creditInvData = Invoice.find({
              userId: id, creditInvoice: true,
              posValue: { $ne: true }, cardCode: { "$in": customerArrays },
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            },
              {
                fields: {
                  cardName: 1, address: 1, branchName: 1, cardCode: 1, itemLines: 1,
                  docNum: 1, docDate: 1, grandTotal: 1, crInv_webId: 1, mobileId: 1,
                  employeeId: 1, taxTotal: 1, weight: 1, branch: 1, SAPStatus: 1,
                  priceTypeName: 1, priceMode: 1, priceType: 1, docStatus: 1,
                }, sort: { createdAt: -1 }
              }).fetch();

            if (creditInvData !== undefined && creditInvData.length > 0) {
              for (let i = 0; i < creditInvData.length; i++) {
                let itemArray = [];
                for (let m = 0; m < creditInvData[i].itemLines.length; m++) {
                  let itemArrayObj = {
                    randomId: creditInvData[i].itemLines[m].randomId,
                    itemNam: creditInvData[i].itemLines[m].itemNam,
                    itemCode: creditInvData[i].itemLines[m].itemCode,
                    uomCode: creditInvData[i].itemLines[m].uomCode,
                    uoMEntry: creditInvData[i].itemLines[m].uoMEntry,
                    unitQuantity: creditInvData[i].itemLines[m].unitQuantity,
                    quantity: creditInvData[i].itemLines[m].quantity,
                    taxRate: creditInvData[i].itemLines[m].taxRate,
                    incPrice: creditInvData[i].itemLines[m].incPrice,
                    excPrice: creditInvData[i].itemLines[m].excPrice,
                    vatRate: creditInvData[i].itemLines[m].vatRate,
                    grossTotal: creditInvData[i].itemLines[m].grossTotal,
                    unitPrice: creditInvData[i].itemLines[m].unitPrice,
                    price: creditInvData[i].itemLines[m].price,
                    vatGroup: creditInvData[i].itemLines[m].vatGroup,
                    invWeight: creditInvData[i].itemLines[m].invWeight,
                    baseLine: creditInvData[i].itemLines[m].baseLine,
                  }
                  itemArray.push(itemArrayObj);
                }
                let mobileAppId = '';
                if (creditInvData[i].mobileId !== undefined) {
                  mobileAppId = creditInvData[i].mobileId;
                }
                let dataObj =
                {
                  _id: creditInvData[i]._id,
                  docNum: creditInvData[i].docNum,
                  cardCode: creditInvData[i].cardCode,
                  cardName: creditInvData[i].cardName,
                  branch: creditInvData[i].branch,
                  branchName: creditInvData[i].branchName,
                  priceMode: creditInvData[i].priceMode,
                  priceType: creditInvData[i].priceType,
                  priceTypeName: creditInvData[i].priceTypeName,
                  docDate: creditInvData[i].docDate,
                  dueDate: creditInvData[i].docDueDate,
                  docTotal: creditInvData[i].grandTotal.toString(),
                  taxTotal: creditInvData[i].taxTotal.toString(),
                  weight: creditInvData[i].weight.toString(),
                  crInv_webId: creditInvData[i].crInv_webId,
                  SAPStatus: creditInvData[i].SAPStatus,
                  mobileId: mobileAppId,
                  itemArray: itemArray
                }
                creditInvArray.push(dataObj);
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "not found",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
          // console.log("History", history.length);
          if (creditInvArray !== undefined && creditInvArray.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: creditInvArray
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for calling the POS Invoice details accoriding to user :- _id
 * Done By : Nithin
 * Date : 07/01/21
 */
JsonRoutes.add("GET", "/customerWisePosInvoiceList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let dataArrays = [];
          let today = moment(new Date()).format("DD-MM-YYYY");
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeEndDate = new Date(todayDates);
          let routeDates = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let routeRes = RouteAssign.find({
            active: "Y",
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeCode: 1, routeId: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            let customerArrays = [];
            for (let k = 0; k < routeRes.length; k++) {
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[k].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let x = 0; x < routeCustomerDetails.length; x++) {
                  customerArrays.push(routeCustomerDetails[x].customer);
                }
              }
            }
            if (user.cardCode !== undefined && user.cardCode !== '') {
              customerArrays.push(user.cardCode);
            }
            let history = Invoice.find({
              userId: id, posValue: true,
              cardCode: { "$in": customerArrays },
              createdAt: {
                $gte: dateValue,
                $lt: dateToday
              }
            },
              {
                fields: {
                  cardName: 1, cardCode: 1, branchName: 1, SAPStatus: 1, docStatus: 1,
                  docNum: 1, docDate: 1, grandTotal: 1, crInv_webId: 1, mobileId: 1,
                  creditInvoiceDate: 1, employeeId: 1, itemLines: 1, taxTotal: 1,
                  weight: 1, branch: 1, SAPStatus: 1, docDueDate: 1,
                  priceTypeName: 1, priceMode: 1, priceType: 1, series: 1, creditInvoiceRemarks: 1
                }, sort: { createdAt: -1 }
              }).fetch()

            if (history !== undefined && history.length !== 0) {
              for (let i = 0; i < history.length; i++) {
                let itemArray = [];
                for (let m = 0; m < history[i].itemLines.length; m++) {
                  let itemArrayObj = {
                    randomId: history[i].itemLines[m].randomId,
                    itemNam: history[i].itemLines[m].itemNam,
                    itemCode: history[i].itemLines[m].itemCode,
                    uomCode: history[i].itemLines[m].uomCode,
                    uoMEntry: history[i].itemLines[m].uoMEntry,
                    unitQuantity: history[i].itemLines[m].unitQuantity,
                    quantity: history[i].itemLines[m].quantity,
                    taxRate: history[i].itemLines[m].taxRate,
                    incPrice: history[i].itemLines[m].incPrice,
                    excPrice: history[i].itemLines[m].excPrice,
                    grossTotal: history[i].itemLines[m].grossTotal,
                    vatRate: history[i].itemLines[m].vatRate,
                    unitPrice: history[i].itemLines[m].unitPrice,
                    price: history[i].itemLines[m].price,
                    vatGroup: history[i].itemLines[m].vatGroup,
                    invWeight: history[i].itemLines[m].invWeight,
                    baseLine: history[i].itemLines[m].baseLine,
                  }
                  itemArray.push(itemArrayObj);
                }
                let mobileAppId = '';
                if (history[i].mobileId !== undefined) {
                  mobileAppId = history[i].mobileId;
                }
                let dataObj =
                {
                  _id: history[i]._id,
                  docNum: history[i].docNum,
                  cardCode: history[i].cardCode,
                  cardName: history[i].cardName,
                  address: history[i].address,
                  branchName: history[i].branchName,
                  SAPStatus: history[i].SAPStatus,
                  series: history[i].series,
                  priceMode: history[i].priceMode,
                  priceType: history[i].priceType,
                  priceTypeName: history[i].priceTypeName,
                  docStatus: history[i].docStatus,
                  docTotal: history[i].grandTotal.toString(),
                  taxTotal: history[i].taxTotal.toString(),
                  weight: history[i].weight.toString(),
                  docDate: history[i].creditInvoiceDate,
                  dueDate: history[i].docDueDate,
                  mobileId: mobileAppId,
                  webId: history[i].crInv_webId,
                  remark: history[i].creditInvoiceRemarks,
                  itemArray: itemArray,
                }
                dataArrays.push(dataObj);
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "not found",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }

          if (dataArrays !== undefined && dataArrays.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: dataArrays
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// End POS Invoice


/**
 * Sample GET method for calling the POS Invoice details accoriding to user :- _id
 * Done By : Nithin
 * Date : 26/02/21
 */
JsonRoutes.add("GET", "/customerWiseDeliveryList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let id = req.params._id;
          let dataArrays = [];
          let today = moment(new Date()).format("DD-MM-YYYY");
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeEndDate = new Date(todayDates);
          let routeDates = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let routeRes = RouteAssign.find({
            active: "Y",
            routeDateIso: {
              $lt: routeDates,
            },
            routeDateEndIso: {
              $gte: routeEndDate,
            },
            routeStatus: { $eq: 'Assigned' }, assignedTo: id
          }, { fields: { routeCode: 1, routeId: 1 } }).fetch();
          if (routeRes !== undefined && routeRes.length > 0) {
            let customerArrays = [];
            for (let k = 0; k < routeRes.length; k++) {
              let routeCustomerDetails = RouteCustomer.find({ routeId: routeRes[k].routeId, active: "Y" }).fetch();
              if (routeCustomerDetails !== undefined && routeCustomerDetails.length > 0) {
                for (let x = 0; x < routeCustomerDetails.length; x++) {
                  customerArrays.push(routeCustomerDetails[x].customer);
                }
              }
            }
            if (user.cardCode !== undefined && user.cardCode !== '') {
              customerArrays.push(user.cardCode);
            }
            let history = Invoice.find({
              creditInv: true,
              assignedTo: id,
              cardCode: { "$in": customerArrays },
              // createdAt: {
              //   $gte: dateValue,
              //   $lt: dateToday
              // }
            },
              {
                fields: {
                  cardName: 1, cardCode: 1, branchName: 1, SAPStatus: 1, docStatus: 1,
                  docNum: 1, docDate: 1, grandTotal: 1, mobileId: 1,
                  creditInvoiceDate: 1, employeeId: 1, itemLines: 1, GST: 1,
                  weight: 1, branch: 1, SAPStatus: 1, docDueDate: 1, docNum: 1, deliveryDocNum: 1,
                  priceTypeName: 1, priceMode: 1, priceType: 1, deliveryStatus: 1, orderId: 1,
                  deliveredDate: 1,
                }, sort: { createdAt: -1 }
              }).fetch()
            console.log("history", history);
            if (history !== undefined && history.length !== 0) {
              for (let i = 0; i < history.length; i++) {
                let deliveredDateVal = ''
                if (history[i].deliveredDate !== undefined) {
                  deliveredDateVal = moment(history[i].deliveredDate).format('DD-MM-YYYY');
                }
                let itemArray = [];
                for (let m = 0; m < history[i].itemLines.length; m++) {
                  let itemArrayObj = {
                    randomId: history[i].itemLines[m].randomId,
                    itemNam: history[i].itemLines[m].itemNam,
                    itemCode: history[i].itemLines[m].itemCode,
                    uomCode: history[i].itemLines[m].uomCode,
                    uoMEntry: history[i].itemLines[m].uoMEntry,
                    unitQuantity: history[i].itemLines[m].unitQuantity,
                    quantity: history[i].itemLines[m].quantity,
                    taxRate: history[i].itemLines[m].taxRate,
                    incPrice: history[i].itemLines[m].incPrice,
                    excPrice: history[i].itemLines[m].excPrice,
                    grossTotal: history[i].itemLines[m].grossTotal,
                    vatRate: history[i].itemLines[m].vatRate,
                    unitPrice: history[i].itemLines[m].unitPrice,
                    price: history[i].itemLines[m].price,
                    vatGroup: history[i].itemLines[m].vatGroup,
                    invWeight: history[i].itemLines[m].invWeight,
                    baseLine: history[i].itemLines[m].baseLine,
                  }
                  itemArray.push(itemArrayObj);
                }
                console.log("itemArray", itemArray);
                let mobileAppId = '';
                if (history[i].mobileId !== undefined) {
                  mobileAppId = history[i].mobileId;
                }
                console.log("mobileAppId", mobileAppId);
                let dataObj =
                {
                  _id: history[i]._id,
                  docNum: history[i].docNum,
                  cardCode: history[i].cardCode,
                  cardName: history[i].cardName,
                  address: history[i].address,
                  branchName: history[i].branchName,
                  SAPStatus: history[i].SAPStatus,
                  priceMode: history[i].priceMode,
                  priceType: history[i].priceType,
                  priceTypeName: history[i].priceTypeName,
                  docStatus: history[i].docStatus,
                  docTotal: history[i].grandTotal.toString(),
                  taxTotal: history[i].GST.toString(),
                  weight: history[i].weight.toString(),
                  docDate: moment(history[i].docDate).format('DD-MM-YYYY'),
                  dueDate: moment(history[i].docDueDate).format('DD-MM-YYYY'),
                  mobileId: mobileAppId,
                  webId: '',
                  deliveryStatus: history[i].deliveryStatus,
                  deliveredDate: deliveredDateVal,
                  // invoiceNo: history[i].docNum,
                  deliveyNo: history[i].deliveryDocNum,
                  orderId: history[i].orderId,
                  itemArray: itemArray,
                }
                dataArrays.push(dataObj);
              }
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 404,
                data: {
                  code: 404,
                  message: "not found",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 404,
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }

          if (dataArrays !== undefined && dataArrays.length !== 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: dataArrays
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for attendance register accoriding to user :- _id
 * Done By : Nithin
 * Date : 26/02/21
 */
JsonRoutes.add("POST", "/attendance_register", function (req, res, next) {

  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.userId === req.body._id) {
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          //console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          // Response after the verification of User
          let id = req.body._id;
          let date = req.body.date;
          let time = req.body.time;
          let locationGet = req.body.location;
          let punchOption = req.body.punchOption;
          let latitude = req.body.latitude;
          let longitude = req.body.longitude;
          let dateFormatted = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
          let timeFormatted = moment(time, 'hh:mm A').format('hh:mm A');
          let formattedDate = dateFormatted + ' ' + timeFormatted;

          let employeeDetails = Meteor.users.findOne({ _id: id });
          if (punchOption === 'punchIn') {
            // new function for attendance punch in
            attendancePunchInFn(id, employeeDetails.defaultBranch, employeeDetails.roles, date, formattedDate, time, locationGet, employeeDetails.defaultBranchName, employeeDetails);
            locationUpdatesFun(id, formattedDate, latitude, longitude, "Attendance Punch In");
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Attendance Punched In Successfully",
                data: {}
              }
            });
          } else {
            // new function for attendance punch out
            attendancePunchOutFn(id, date, time, locationGet);
            locationUpdatesFun(id, formattedDate, latitude, longitude, "Attendance Punch Out");
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Attendance Punched Out Successfully",
                data: {}
              }
            });
            // Authorisation Response Section     
          }
        }
      }
      else {
        //console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    //console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
/**
 * delivery list updates
 * Done by : Nithin
 * Date : 26/02/21
 */
JsonRoutes.add("POST", "/deliveryListUpdate", function (req, res, next) {
  //console.log("req.body", req.body);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined) {
      JsonRoutes.sendResult(res, {

        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.userId === req.body._id) {
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          //console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          // Response after the verification of User
          let id = req.body._id; //userId
          // console.log("check data",req.body);..
          let invoiceId = req.body.invoiceId;
          let remarks = req.body.remarks;
          let ackImage = req.body.ackImage;
          // let routeArray = JSON.parse(req.body.routeData); 
          let invoiceData = Invoice.findOne({ _id: invoiceId });
          if (invoiceData !== undefined) {
            deliveryUpdateFun(invoiceId, id, remarks, ackImage);
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Delivery Updated Successfully",
                data: []
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Please check the invoice no",
                data: []
              }
            });
          }
          // Authorisation Response Section     
        }
      }
      else {
        //console.log("Token userId and Param _id are not matching.! ");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    //console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/* Sample POST method for creating lead
* Done By Anand
* Date 26-02-2020
*/
JsonRoutes.add("POST", "/addLead", function (req, res, next) {
  console.log("req.authToken", req.authToken);
  console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {

        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let cardName = req.body.cardName;
          let address = req.body.address;
          let contactNo = req.body.mobile;
          let email = req.body.emailId;
          let mobileAppId = req.body.mobileAppId;
          let branch = [];
          let group = '';
          let groupName = '';
          let priceType = '';
          let addressArray = [];
          let addressShippingObj =
          {
            addressType: 'S',
            addressType1: 'S',
            address: address,
            street: '',
            block: '',
            zipCode: '',
            city: '',
            country: 'US',
            state: 'AK',
          };
          addressArray.push(addressShippingObj);
          let addressBillingObj =
          {
            addressType: 'B',
            addressType1: 'B',
            address: address,
            street: '',
            block: '',
            zipCode: '',
            city: '',
            country: 'US',
            state: 'AK',
          };
          addressArray.push(addressBillingObj);

          if (user.defaultBranch !== undefined && user.defaultBranch !== '') {
            branch.push(user.defaultBranch)
          }
          console.log("branch", branch);
          let customerRes = Customer.findOne({ cardCode: user.cardCode });
          if (customerRes !== undefined) {
            group = customerRes.groupCode;
            priceType = customerRes.priceList;
          }
          console.log("group", group);
          if (group) {
            let groupRes = CustomerGroup.findOne({ groupCode: group });

            if (groupRes !== undefined) {
              groupName = groupRes.groupName;
            }
          }
          let leadRes = Lead.find({ $or: [{ cardName: cardName }, { cardCode: mobileAppId }] }).fetch();
          if (leadRes.length > 0) {
            JsonRoutes.sendResult(res, {
              code: 401,
              data: {
                code: 401,
                message: "Lead Name Or Lead Code Already Exists",
                data: []
              }
            });
          }
          else {
            Lead.insert({
              cardName: cardName,
              cardCode: mobileAppId,
              groupCode: group,
              groupName: groupName,
              cardtype: 'L',
              branches: branch,
              currency: 'ZMW',
              priceList: priceType,
              contactPerson: user.profile.firstName,
              mobile: contactNo,
              emailId: email,
              addresses: addressArray,
              createdBy: id,
              mobileAppId: mobileAppId,
              uuid: Random.id(),
              createdByName: `${user.profile.firstName} ${user.profile.lastName}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              flag: true,
              createdFrom: 'Mobile App',
              vansaleApp: true,
            });
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Success",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    console.log("No Here");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// 
// End Of Lead Creation

/**
 * Sample GET method for calling the lead accoriding to user :- _id
 * Done By : Anand
 * Date : 26/02/21
 */
JsonRoutes.add("GET", "/leadList/:_id", function (req, res, next) {

  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) {
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let leadGet = Lead.find({ createdBy: id }, {
            fields: {
              _id: 1, cardName: 1, cardCode: 1, branches: 1, currency: 1, priceList: 1, contactPerson: 1, groupCode: 1, groupName: 1,
              mobile: 1, emailId: 1, createdBy: 1, createdByName: 1, addresses: 1, createdAt: 1, mobileAppId: 1
            }
          }).fetch();
          if (leadGet !== undefined && leadGet.length > 0) {
            console.log("leadGet", leadGet);
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: leadGet,
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }

        }
      }
      else {
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
//
// End of lead list



/**
 * Sample GET method for calling the sales quotation accoriding to customer
 * Done By : Nithin
 * Date : 12/03/21
 */
JsonRoutes.add("GET", "/getStockTransferList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let stockTransferList = [];
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let routeDates = new Date(todayDates);
          routeDates.setDate(routeDates.getDate() + 1);
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let stockTransferRes = StockTransfer.find({
            userId: id,
            createdAt: {
              $gte: dateValue,
              $lt: dateToday
            }
          }, {
            fields: {
              dueDueDate: 1, docDate: 1, branchName: 1, branch: 1, wareHouseFrom: 1,
              wareHouseFromName: 1, wareHouseTo: 1, wareHouseToName: 1, itemLines: 1, employeeId: 1,
              remark_stock: 1, stockStatus: 1, weight: 1, stockId: 1, stock_webId: 1, tempId: 1
            }, sort: { createdAt: -1 }
          }).fetch();
          if (stockTransferRes !== undefined && stockTransferRes.length > 0) {
            for (let i = 0; i < stockTransferRes.length; i++) {
              let itemArray = [];
              for (let m = 0; m < stockTransferRes[i].itemLines.length; m++) {
                let itemArrayObj = {
                  randomId: stockTransferRes[i].itemLines[m].randomId,
                  itemNam: stockTransferRes[i].itemLines[m].itemNam,
                  itemCode: stockTransferRes[i].itemLines[m].itemCode,
                  // uoMEntry: stockTransferRes[i].itemLines[m].uoMEntry,
                  // uomCode: stockTransferRes[i].itemLines[m].uomCodeName,
                  transferUom: stockTransferRes[i].itemLines[m].transferUom,
                  // invntryUom: stockTransferRes[i].itemLines[m].invntryUom,
                  unitQuantity: stockTransferRes[i].itemLines[m].unitQuantity,
                  quantity: stockTransferRes[i].itemLines[m].transferQty,
                  // transferQty: stockTransferRes[i].itemLines[m].transferQty,
                  whsCode: stockTransferRes[i].itemLines[m].whsCode,
                  whsName: stockTransferRes[i].itemLines[m].itemWareHouseName,
                  invWeight: stockTransferRes[i].itemLines[m].invWeight,
                  baseLine: stockTransferRes[i].itemLines[m].baseLine,
                }
                itemArray.push(itemArrayObj);
                console.log("res",)
              }
              let mobileAppId = '';
              if (stockTransferRes[i].mobileId !== undefined) {
                mobileAppId = stockTransferRes[i].mobileId;
              }
              let orderObj =
              {
                _id: stockTransferRes[i]._id,
                docNum: stockTransferRes[i].stockId,
                branch: stockTransferRes[i].branch,
                employee: stockTransferRes[i].employeeId,
                branchName: stockTransferRes[i].branchName,
                docDate: stockTransferRes[i].docDate,
                dueDate: stockTransferRes[i].docDueDate,
                docStatus: stockTransferRes[i].stockStatus,
                webId: stockTransferRes[i].stock_webId,
                tempId: stockTransferRes[i].tempId,
                mobileId: mobileAppId,
                weight: stockTransferRes[i].weight.toString(),
                remarks: stockTransferRes[i].remark_stock,
                itemArray: itemArray
              }
              stockTransferList.push(orderObj)
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
          if (stockTransferList !== undefined && stockTransferList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: stockTransferList,
              }
            });
          }
        }
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample POST method for creating stock transfer
 * Done By Nithin 
 * Date 12-03-2021
 */
JsonRoutes.add("POST", "/addStockTransfer", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.body._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let branchName = '';
          let temporaryId = '';
          let branchRes = Branch.findOne({ bPLId: req.body.branch });
          if (branchRes) {
            branchName = branchRes.bPLName;
          }
          let salesManName = '';
          let userres = Meteor.users.findOne({ _id: req.body.employee });
          if (userres) {
            salesManName = userres.profile.firstName;
          }
          let wareHouseFromName = '';
          let wareHouseData = WareHouse.findOne({ whsCode: req.body.requestWarehouse });
          if (wareHouseData !== undefined) {
            wareHouseFromName = wareHouseData.whsName;
          }
          let wareHouseToName = '';
          let wareHouseDataTo = WareHouse.findOne({ whsCode: req.body.issueWarehouse });
          if (wareHouseDataTo !== undefined) {
            wareHouseToName = wareHouseDataTo.whsName;
          }
          let totalQty = 0;
          let itemsQty = req.body.itemLines;
          for (let i = 0; i < itemsQty.length; i++) {
            totalQty += Number(itemsQty[i].quantity);
          }
          let tempVal = StockTransferSerialNo.findOne({
            bPLId: req.body.branch
          }, { sort: { $natural: -1 } });
          if (!tempVal) {
            temporaryId = "STRQ/" + branchName.slice(0, 3).toUpperCase() + "/1";
          } else {
            temporaryId = "STRQ/" + branchName.slice(0, 3).toUpperCase() + "/" + parseInt(tempVal.serial + 1);
          }
          if (!tempVal) {
            stockTemIdInsert(req.body.branch);
          } else {
            stockTemIdInsertUpdate(req.body.branch, parseInt(tempVal.serial + 1));
          }
          let itemArrayVal = [];
          if (req.body.itemLines.length > 0) {
            for (let x = 0; x < req.body.itemLines.length; x++) {
              let itemName = '';
              let itemUgpCode = '';
              let itemWareHouseName = '';
              let itemRes = Item.findOne({ itemCode: req.body.itemLines[x].itemCode });
              if (itemRes) {
                itemName = itemRes.itemNam;
                itemUgpCode = itemRes.ugpCode;
              }
              let uoMEntryVal = '';
              let unitRes = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode });
              if (unitRes) {
                uoMEntryVal = unitRes.uomEntry;
              }
              let transferUomData = '';
              if (itemUgpCode !== '') {
                let itemUnitDetail = Unit.findOne({ uomCode: req.body.itemLines[x].uomCode, ugpCode: itemUgpCode });
                if (itemUnitDetail) {
                  transferUomData = itemUnitDetail.uomCode;
                }
              }
              let wareHouseRes = WareHouse.findOne({ whsCode: req.body.itemLines[x].whsCode });

              if (wareHouseRes !== undefined) {
                itemWareHouseName = wareHouseRes.whsName
              }
              let quantityValue = (Number(req.body.itemLines[x].quantity) * Number(req.body.itemLines[x].unitQuantity)).toString();
              let itemObj =
              {
                randomId: Random.id(),
                uoMEntry: itemRes.saleUoMEntry,
                uomCode: itemRes.saleUoMEntry,
                invntryUom: itemRes.saleUoMEntry,
                uomCodeName: itemRes.saleUom,
                unitQuantity: req.body.itemLines[x].unitQuantity,
                itemCode: req.body.itemLines[x].itemCode,
                itemNam: itemName,
                invWeight: req.body.itemLines[x].invWeight,
                transferUom: transferUomData,
                itemRemark: '',
                transferQty: req.body.itemLines[x].quantity,
                quantity: quantityValue,
                itemWareHouseName: itemWareHouseName,
                whsCode: req.body.itemLines[x].whsCode,
                baseLine: req.body.itemLines[x].baseLine,
              }
              itemArrayVal.push(itemObj);
            }
          }

          stockTransferCreateFn(req.body, temporaryId, itemArrayVal, branchName, wareHouseFromName,
            wareHouseToName, salesManName, id, totalQty, itemsQty);

          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Success",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
// 


// functon for posting ar invoice to SAP
function apiCallForArInvoice(id, employee) {
  let call = true;
  let arInvoiceData = ArInvoicePayment.findOne({ _id: id });
  if (arInvoiceData) {
    if (arInvoiceData.flag !== false) {
      call = true;
      count = 0;
      aPICalls();
    }
  }
  function aPICalls() {

    if (call === true) {
      let base_url = Config.findOne({
        name: 'base_url'
      }).value;
      let dbId = Config.findOne({
        name: 'dbId'
      }).value;
      // console.log("aRInvoicePaymentAdd_Url", aRInvoicePaymentAdd_Url);

      let url = base_url + aRInvoicePaymentAdd_Url;
      let dataArray = {
        dbId: dbId,
        cardCode: arInvoiceData.cardCode,
        branch: arInvoiceData.branch,
        docDueDate: moment(arInvoiceData.dueDate).format('YYYYMMDD'),
        discountPercentage: arInvoiceData.discountPercentage,
        currency: arInvoiceData.currency,
        docDate: moment(new Date()).format('YYYYMMDD'),
        sumAmount: arInvoiceData.sumAmount,
        priceMode: arInvoiceData.priceMode,
        priceType: arInvoiceData.priceType,
        priceTypeName: arInvoiceData.priceTypeName,
        acCode: arInvoiceData.acCode,
        transporter: arInvoiceData.transporterName,
        vehicle: arInvoiceData.vehicleNumber,
        itemLines: arInvoiceData.itemLines,
        binEntries: arInvoiceData.binEntries,
        mvats: arInvoiceData.mvats,
        driverName: arInvoiceData.driverName,
        referenceNo: arInvoiceData.custRef,
        customerName: arInvoiceData.secondaryCustomer,
        chequeInfo: arInvoiceData.chequeInfo,
        transferSum: arInvoiceData.transferamtValue.toString(),
        transferDate: arInvoiceData.transferDateValue,
        transferRef: arInvoiceData.transferRef,
        cashSum: arInvoiceData.cashAmountVal.toString(),
        invoicePayment: { sumAmount: arInvoiceData.sumAmount.toString() },
        arInv_WebId: arInvoiceData.arInv_WebId,

      };
      let options = {
        data: dataArray,
        headers: {
          'content-type': 'application/json'
        }
      };
      // console.log("dataArray", dataArray);

      HTTP.call("POST", url, options, (err, result) => {
        // console.log("Result", result);
        if (err) {
          // console.log("err", err);
          // if (count === 1) {
          // Notification.insert({
          //   userId: Meteor.userId(),
          //   message: err.response,
          //   uuid: Random.id()
          // });
          // }
          // if (count < 3) {
          //   count = count + 1;
          //   aPICall();
          // }
          console.log("Ar Inv err", err);
        } else {
          console.log("Ar Inv res", result);
          call = false;

          return ArInvoicePayment.update({
            _id: id
          }, {
            $set: {
              arInvId: result.data.RefNo,
              series: result.data.Series,
              docEntry: result.data.docEntry,
              approvedBy: employee,
              flag: false,
              updatedAt: new Date()
            }
          });
        }
      });
    }
  }
}


// functon for posting POS invoice to SAP

function apiCallForPOSInvoice(id, employee) {
  let call = true;
  let crInvoiceRes = Invoice.findOne({ _id: id });
  if (crInvoiceRes) {
    if (crInvoiceRes.flag !== false) {
      call = true;
      count = 0;
      aPICallss()
    }
  }
  function aPICallss() {
    if (call === true) {
      let base_url = Config.findOne({
        name: 'base_url'
      }).value;
      let dbId = Config.findOne({
        name: 'dbId'
      }).value;
      let url = base_url + branchTransferPost_Url;
      let dataArray = {
        dbId: dbId,
        cardCode: crInvoiceRes.cardCode,
        branch: crInvoiceRes.branch,
        priceMode: crInvoiceRes.priceMode,
        docDueDate: moment(crInvoiceRes.dueDate).format('YYYYMMDD'),
        discountPercentage: crInvoiceRes.discountPercentage,
        currency: crInvoiceRes.currency,
        docDate: moment(new Date()).format('YYYYMMDD'),
        transporter: crInvoiceRes.transporterName,
        vehicle: crInvoiceRes.vehicleNumber,
        itemLines: crInvoiceRes.itemLines,
        binEntries: crInvoiceRes.binEntries,
        mvats: crInvoiceRes.mvats,
        referenceNo: crInvoiceRes.custRef,
        priceType: crInvoiceRes.priceType,
        priceTypeName: crInvoiceRes.priceTypeName,
        priceMode: crInvoiceRes.priceMode,
        driverName: crInvoiceRes.driverName,
        customerName: crInvoiceRes.secondaryCustomer,
        crInv_webId: crInvoiceRes.crInv_webId
      };
      let options = {
        data: dataArray,
        headers: {
          'content-type': 'application/json'
        }
      };
      // console.log("dataArray", dataArray);
      HTTP.call("POST", url, options, (err, result) => {
        if (err) {
          // console.log("err", err);
          // Notification.insert({
          //   userId: Meteor.userId(),
          //   message: err.response,
          //   uuid: Random.id()
          // });
          console.log("Pos Inv err", err);
          return err;
        } else {
          console.log("Pos Inv result", result);
          call = false;
          return Invoice.update({
            _id: id
          }, {
            $set: {
              docNum: result.data.RefNo,
              docEntry: result.data.DocEntry,
              series: result.data.Series,
              cIStatus: 'approved',
              cIRemark: '',
              SAPStatus: 'Approved',
              flag: false,
              approvedBy: employee,
              approvedByName: '',
              approvedByDate: new Date(),
              accountantApproved: true,
              updatedAt: new Date()
            }
          });
        }
      });
    }
  }
}

function deliveryUpdateFun(invoiceId, id, remarks, ackImage) {
  let invDetail = Invoice.findOne({ _id: invoiceId });
  let invDeliver = Invoice.update({
    _id: invoiceId
  }, {
    $set: {
      deliveryStatus: "Delivered",
      deliveryRemark: remarks,
      customerRep: '',
      podDate: moment(new Date()).format('YYYY-MM-DD'),
      acknoledgement_image: ackImage,
      deliveredBy: id,
      deliveredDate: new Date(),
      updatedAt: new Date(),
      updatedFrom: 'Mobile App'
    }
  })
  if (invDeliver) {
    podDateFun();
  }
  function podDateFun() {
    let base_url = Config.findOne({
      name: 'base_url'
    }).value;
    let dbId = Config.findOne({
      name: 'dbId'
    }).value;
    let url = base_url + dispatchUpdate_Url;
    let dataArray = {
      dbId: dbId,
      podDate: moment(new Date()).format('YYYY-MM-DD'),
      invoiceDocNum: invDetail.docNum,
      deliveryDocNum: invDetail.deliveryDocNum,

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
      }
    });
  }
  return invDeliver;
}


// function for attendance punch in

function attendancePunchInFn(id, branch, roles, date, formattedDate, time, locationGet, branchName, employeeDetails) {
  let attendanceRes = Attendance.insert({
    employeeId: id,
    employeeName: `${employeeDetails.profile.firstName} ${employeeDetails.profile.lastName}`,
    empCode: employeeDetails.empCode,
    branch: branch,
    role: roles,
    branchName: branchName,
    attendenceStatus: 'Punch In',
    loginDateCheck: date,
    logoutDateCheck: '',
    attendenceDate: date,
    attendenceDateIso: new Date(formattedDate),
    loginDate: time,
    logoutDate: '',
    loginLocation: locationGet,
    logoutLocation: '',
    uuid: Random.id(),
    createdAt: new Date,
  });
  /**
 *  for sales summary report
 */
  if (attendanceRes) {
    let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    let routeDates = new Date(todayDates);
    let routeEndDate = new Date(todayDates);
    routeDates.setDate(routeDates.getDate() + 1);
    let routeRes = RouteAssign.find({
      active: "Y",
      assignedTo: id, routeStatus: { $eq: 'Assigned' },
      routeDateIso: {
        $lt: routeDates,
      },
      routeDateEndIso: {
        $gte: routeEndDate,
      }
    }, { fields: { routeId: 1, routeDate: 1, routeStatus: 1, routeDateEnd: 1 } }).fetch();
    if (routeRes !== undefined && routeRes.length > 0) {
      for (let i = 0; i < routeRes.length; i++) {
        // SalesSummaryReport.insert
        //   ({
        //     employeeId: id,
        //     branch: branch,
        //     routeId: routeRes[i].routeId,
        //     routeDate: routeRes[i].routeDate,
        //     routeDateEnd: routeRes[i].routeDateEnd,
        //     routeAssignId: routeRes[i]._id,
        //     attendenceDate: date,
        //     attendenceDateIso: new Date(formattedDate),
        //     attendenceStatus: 'Punch In',
        //     loginDateCheck: date,
        //     loginDate: time,
        //     loginLocation: locationGet,
        //     logoutLocation: '',
        //     uuid: Random.id(),
        //     createdAt: new Date,
        //   });
      }
    }
  }
}

// function for attendance punch out 
function attendancePunchOutFn(id, date, time, locationGet) {
  let attendanceRes = Attendance.update({
    employeeId: id, attendenceStatus: 'Punch In',
    loginDateCheck: date
  }, {
    $set:
    {
      attendenceStatus: 'Punch Out',
      logoutDate: time,
      logoutDateCheck: date,
      logoutLocation: locationGet,
      updatedAt: new Date(),
    }
  });
  /**
   *  for sales summary report
   */
  if (attendanceRes) {
    let salesSummaryRes = SalesSummaryReport.find({
      employeeId: id, attendenceStatus: 'Punch In',
      loginDateCheck: date
    }).fetch();
    if (salesSummaryRes !== undefined && salesSummaryRes.length > 0) {
      // for (let i = 0; i < salesSummaryRes.length; i++) {
      //   SalesSummaryReport.update({
      //     _id: salesSummaryRes[i]._id,
      //   }, {
      //     $set:
      //     {
      //       attendenceStatus: 'Punch Out',
      //       logoutDate: time,
      //       logoutDateCheck: date,
      //       logoutLocation: locationGet,
      //       updatedAt: new Date(),
      //     }
      //   });
      // }
    }
  }
}


/**
 * Sample POST customer location for geofencing
 * Done By : Visakh
 * Date : 26/02/21
 */
JsonRoutes.add("POST", "/customerLocationUpdate", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.body._id);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      // console.log("Undefined Token and userId");

      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: [],
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: [],
            }
          });
        } else {
          let customerId = req.body.cardCode;
          let latitude = req.body.latitude;
          let longitude = req.body.longitude;
          let fencingArea = req.body.fencingArea;
          let address = req.body.addressId;
          if (fencingArea == undefined) { fencingArea = ''; }
          if (longitude == undefined) { longitude = ''; }
          if (latitude == undefined) { latitude = ''; }
          let customerRes = Customer.findOne({ cardCode: customerId });
          let customerAdresss = CustomerAddress.findOne({ _id: address });
          if (customerRes !== undefined) {
            if (customerAdresss !== undefined) {
              customerLocupdate(customerId, latitude, longitude, fencingArea, address);
              JsonRoutes.sendResult(res, {
                code: 200,
                data: {
                  code: 200,
                  message: "Customer Location Updated Successfully",
                  data: []
                }
              });
            }
            else {
              JsonRoutes.sendResult(res, {
                code: 401,
                data: {
                  code: 401,
                  message: "Invalid Customer Address",
                  data: []
                }
              });
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              code: 401,
              data: {
                code: 401,
                message: "Invalid Customer",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});
/**
 * customer Location update 
 * @param {*} customerId
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} fencingArea 
 */
function customerLocupdate(customerId, latitude, longitude, fencingArea, address) {
  return CustomerAddress.update({ cardCode: customerId, _id: address, },
    {
      $set:
      {
        latitude: latitude,
        longitude: longitude,
        fencingArea: fencingArea,
        updateAt: new Date()
      }
    });
}

// demo api for testing



/**
 * Sample POST method for demo 
 * Done By : Nithin
 * Date : 26/02/21
 */
JsonRoutes.add("POST", "/GenerateLink", function (req, res, next) {

  let values = req.body;
  DemoTable.insert
    ({
      values: values,
      uuid: Random.id(),
      createdAt: new Date()
    });

  JsonRoutes.sendResult(res, {
    code: 200,
    data: {
      code: 200,
      message: "Link Created Successfully",
      data: {}
    }
  });

});


/**
 * Sample GET method for calling the rmarks accoriding to user :- _id
 * Done By : Nithin
 * Date : 02/03/21
 */
JsonRoutes.add("GET", "/skipRemarksList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let remarksList = [];
          let remarksFullList = SkipRemarks.find({ active: 'Y' }, { fields: { remarksName: 1, remarksCode: 1 } }).fetch();
          if (remarksFullList !== undefined && remarksFullList.length > 0) {
            for (let i = 0; i < remarksFullList.length; i++) {
              let remarksObj =
              {
                remarksCode: remarksFullList[i].remarksCode,
                remarksName: remarksFullList[i].remarksName
              };
              remarksList.push(remarksObj)
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "not found",
                data: []
              }
            });
          }
          if (remarksList !== undefined && remarksList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: remarksList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample GET method for calling the rmarks accoriding to user :- _id
 * Done By : Nithin
 * Date : 02/03/21
 */
JsonRoutes.add("POST", "/customerAdd", function (req, res, next) {
  console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let results = req.body.data;
          console.log("Customer Update Crone Res Success");
          console.log("data", results);
          for (let i = 0; i < results.length; i++) {
            let find = Customer.find({
              cardCode: results[i].CardCode
            }).fetch();
            if (find.length === 0) {
              // insertCount = insertCount + 1;
              Customer.insert({
                cardCode: results[i].CardCode,
                cardType: results[i].CardType,
                cardName: results[i].CardName,
                address: results[i].Address,
                priceMode: results[i].PriceMode,
                priceList: results[i].PriceList,
                phone1: results[i].Phone1,
                cntctPrsn: results[i].CntctPrsn,
                balance: results[i].Balance,
                ordersBal: results[i].OrdersBal,
                creditLine: results[i].CreditLine,
                phone2: results[i].Phone2,
                mailAddres: results[i].MailAddres,
                currency: results[i].Currency,
                createdAt: new Date(),
                uuid: Random.id()
              });
            } else {
              Customer.update(find[0]._id, {
                $set: {
                  cardCode: results[i].CardCode,
                  cardType: results[i].CardType,
                  cardName: results[i].CardName,
                  address: results[i].Address,
                  priceMode: results[i].PriceMode,
                  priceList: results[i].PriceList,
                  phone1: results[i].Phone1,
                  cntctPrsn: results[i].CntctPrsn,
                  balance: results[i].Balance,
                  ordersBal: results[i].OrdersBal,
                  creditLine: results[i].CreditLine,
                  phone2: results[i].Phone2,
                  mailAddres: results[i].MailAddres,
                  currency: results[i].Currency,
                  updatedAt: new Date()
                }
              });
            }
          }

        }
        // if (remarksList !== undefined && remarksList !== []) {
        JsonRoutes.sendResult(res, {
          code: 200,
          data: {
            code: 200,
            message: "success",
            data: [],
          }
        });
        // }



      } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  }
});

/**
 * insert stock trasnfer temp id
 */

function stockTemIdInsert(branch) {
  return StockTransferSerialNo.insert({
    serial: 1,
    bPLId: branch,
    uuid: Random.id(),
    createdAt: new Date()
  });
}

/**
 * insert stock trasnfer temp id update
 */

function stockTemIdInsertUpdate(branchs, serialNo) {
  return StockTransferSerialNo.insert({
    serial: serialNo,
    bPLId: branchs,
    uuid: Random.id(),
    createdAt: new Date()
  });
}
/**
 * 
 * @param {*} stockRes
 * @param {*} temporaryId 
 * @param {*} itemArrayVal 
 * @param {*} branchName 
 * @param {*} wareHouseFromName 
 * @param {*} wareHouseToName 
 * @param {*} salesManName 
 * create stock transfer request
 */
function stockTransferCreateFn(stockRes, temporaryId, itemArrayVal, branchName, wareHouseFromName,
  wareHouseToName, salesManName, id, totalQty, itemsQty) {

  return StockTransfer.insert({
    employeeId: salesManName,
    userId: id,
    dueDueDate: stockRes.dueDate,
    docDate: new Date(),
    branchName: branchName,
    branch: stockRes.branch,
    wareHouseFrom: stockRes.requestWarehouse,
    wareHouseFromName: wareHouseFromName,
    wareHouseTo: stockRes.issueWarehouse,
    wareHouseToName: wareHouseToName,
    itemLines: itemArrayVal,
    remark_stock: stockRes.remark,
    salesmanName: salesManName,
    stockStatus: 'Pending',
    totalQty: totalQty.toString(),
    weight: stockRes.weight,
    totalItem: itemsQty.length.toString(),
    latitude: stockRes.latitude,
    longitude: stockRes.longitude,
    stockId: '',
    tempId: temporaryId,
    flag: true,
    stock_webId: 'stock_' + Random.id(),
    uuid: Random.id(),
    createdAt: new Date()
  });
}
/**
 * current loc update
 */
function locationUpdateFun(locationData, branch) {
  let locationId = CurrentLocation.insert({
    userId: locationData._id,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    branch: branch,
    activity: "User Route",
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  if (locationId) {
    locationDataUpdates(locationId, locationData);
    routeIdUpdates(locationId, locationData._id);
  }

}
/**
 * 
 * @param {*} locationId 
 * @param {*} locationData 
 * update latlong text
 */

function locationDataUpdates(locationId, locationData) {
  let latLongData = "https://us1.locationiq.com/v1/reverse.php?key=e1428615b8b890&lat=" + locationData.latitude + "&lon=" + locationData.longitude + "&format=json";
  HTTP.call('GET', latLongData, {},
    function (error, response) {
      if (error) {
      } else {
        CurrentLocation.update({ _id: locationId }, {
          $set: {
            locationValues: response.data.display_name
          }
        });
      }
    });
};
/**
 * 
 * @param {*} locationId 
 * @param {*} _id 
 * @returns 
 * update route data on location
 */
function routeIdUpdates(locationId, _id) {
  let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  let routeDates = new Date(todayDates);
  let routeEndDate = new Date(todayDates);
  routeDates.setDate(routeDates.getDate() + 1);
  let routeRes = RouteAssign.find({
    active: "Y",
    assignedTo: _id, routeStatus: { $eq: 'Assigned' },
    routeDateIso: {
      $lt: routeDates,
    },
    routeDateEndIso: {
      $gte: routeEndDate,
    }
  }, { fields: { routeId: 1, routeDate: 1, routeStatus: 1, routeDateEnd: 1 } }).fetch();

  if (routeRes !== undefined && routeRes.length > 0) {
    let routeArray = [];
    for (let x = 0; x < routeRes.length; x++) {
      let routeGrupRes = RouteGroup.findOne({ _id: routeRes[x].routeId });
      routeArray.push(routeGrupRes._id);
    }
    return CurrentLocation.update({ _id: locationId }, {
      $set: {
        routeArray: routeArray,
      }
    });
  }
}


/**
 * Sample GET method for calling the rmarks accoriding to user :- _id
 * Done By : Nithin
 * Date : 02/03/21
 */
JsonRoutes.add("POST", "/stockSummaryRep", function (req, res, next) {
  console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let routeData = '';
          let stockSum = [];
          let openingStockData = 0;
          let closingStockData = 0;
          let balanceStockData = 0;
          let _id = req.body._id;
          let stock = req.body.stock;
          let date = req.body.date;
          let route = req.body.route;
          let userDetail = Meteor.users.findOne({ _id: _id });
          // console.log("userDetail", userDetail);
          for (let i = 0; i < route.length; i++) {
            let routeAssignRes = RouteAssign.findOne({ _id: route[i] });
            if (routeAssignRes) {
              let routeGrpRes = RouteGroup.findOne({ _id: routeAssignRes.routeId });
              // console.log("routeGrpRes", routeGrpRes);
              if (i === 0) {
                routeData = routeGrpRes.routeName;
              } else {
                routeData = routeData + ',' + routeGrpRes.routeName;
                // console.log("routeData", routeData);
              }
            }
          }
          for (let i = 0; i < stock.length; i++) {
            let itemName = Item.findOne({ itemCode: stock[i].itemCode });
            // console.log("itemName", itemName);

            if (itemName) {
              itemName = itemName.itemNam;
            } else {
              itemName = '';
            }
            let itmObj = {
              itemCode: stock[i].itemCode,
              itemNam: itemName,
              uom: stock[i].uom,
              openingStock: stock[i].openingStock,
              closingStock: stock[i].closingStock,
              balanceStock: (Number(stock[i].openingStock) - Number(stock[i].closingStock)).toString(),
            }
            // console.log("itmObj", itmObj);

            stockSum.push(itmObj);
            // console.log("stockSum", stockSum);

          }
          for (let j = 0; j < stock.length; j++) {
            openingStockData += Number(stock[j].openingStock);
          }
          // console.log("openingStockData", openingStockData);

          for (let j = 0; j < stock.length; j++) {
            closingStockData += Number(stock[j].closingStock);
          }
          // console.log("closingStockData", closingStockData);

          for (let j = 0; j < stock.length; j++) {
            balanceStockData = (Number(openingStockData) - Number(closingStockData)).toString();
          }
          // console.log("balanceStockData", balanceStockData);

          let stockCheck = StockSummaryRep.findOne({ userId: _id, dated: date });
          // console.log("stockCheck", stockCheck);
          let dateVal = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
          if (stockCheck) {
            StockSummaryRep.update({ _id: stockCheck._id }, {
              $set: {
                userId: _id,
                user: `${userDetail.profile.firstName} ${userDetail.profile.lastName}`,
                dated: date,
                stock: stockSum,
                routes: routeData,
                datedIso: new Date(dateVal),
                openingStock: openingStockData,
                balanceStock: balanceStockData,
                closingStock: closingStockData,
                updatedAt: new Date()
              }
            });
          } else {
            StockSummaryRep.insert({
              userId: _id,
              user: `${userDetail.profile.firstName} ${userDetail.profile.lastName}`,
              dated: date,
              stock: stockSum,
              routes: routeData,
              datedIso: new Date(dateVal),
              openingStock: openingStockData,
              balanceStock: balanceStockData,
              closingStock: closingStockData,
              createdAt: new Date()

            });
          }

        }
        // if (remarksList !== undefined && remarksList !== []) {
        JsonRoutes.sendResult(res, {
          code: 200,
          data: {
            code: 200,
            message: "success",
            data: [],
          }
        });
        // }



      } else {
        // console.log("Undefined Token and userId");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  }
});


/* Sample POST method for creating lead
* Done By Anand
* Date 26-02-2020
*/
JsonRoutes.add("POST", "/addExpense", function (req, res, next) {
  console.log("req.authToken", req.authToken);
  console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {

        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let dateVal = req.body.dateVal;
          let timeVal = req.body.timeVal;
          let expCategory = req.body.expCategory;
          let expAmount = req.body.expAmount;
          let routeId = req.body.routeId;
          let remarks = req.body.remarks;
          let latitude = req.body.latitude;
          let longitude = req.body.longitude;
          let routeGroup = '';
          let mobileAppId = req.body.mobileAppId;
          let ackImage = req.body.ackImage;
          let routeAssignRes = RouteAssign.findOne({
            _id: routeId,
            assignedTo: id,
          }, {
            fields: {
              routeId: 1
            }
          });
          if (routeAssignRes) {
            routeGroup = routeAssignRes.routeId;
          }
          Expense.insert({
            employeeId: id,
            dateVal: dateVal,
            timeVal: timeVal,
            expCategory: expCategory,
            expAmount: expAmount,
            routeId: routeGroup,
            routeAssignId: routeId,
            createdBy: id,
            mobileAppId: mobileAppId,
            branch: user.defaultBranch,
            remarks: remarks,
            latitude: latitude,
            longitude: longitude,
            ackImage: ackImage,
            uuid: Random.id(),
            createdAt: new Date(),
            updatedAt: new Date(),
            flag: true,
            createdFrom: 'Mobile App',
            vansaleApp: true,
          });
          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Success",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId"); 
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});





/* Sample POST method for getting invoice no list based on cardCode
* Done By Nithin
* Date 27-01-2022
*/
JsonRoutes.add("POST", "/getCustomerWiseInvoiceList", function (req, res, next) {
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {

        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let cardCode = req.body.cardCode;
          let invoiceNoArray = [];
          let invoiceList = Invoice.find({ cardCode: cardCode, docNum: { $ne: '' } }, {
            fields: {
              docNum: 1
            }
          }).fetch();
          if (invoiceList.length > 0) {
            for (let i = 0; i < invoiceList.length; i++) {
              invoiceNoArray.push({
                invoiceNo: invoiceList[i].docNum,
                type: 'Credit Invoice'
              });
            }
          }
          let arInvoiceList = ArInvoicePayment.find({ cardCode: cardCode, arInvId: { $ne: '' } }, {
            fields: {
              arInvId: 1
            }
          }).fetch();
          if (arInvoiceList.length > 0) {
            for (let i = 0; i < arInvoiceList.length; i++) {
              invoiceNoArray.push({
                invoiceNo: arInvoiceList[i].arInvId,
                type: 'AR Invoice'
              });
            }
          }
          if (invoiceNoArray.length > 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Success",
                data: invoiceNoArray
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId"); 
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/* Sample POST method for getting invoice details list based on cardCode
* Done By Nithin
* Date 26-02-2020
*/
JsonRoutes.add("POST", "/getInvoiceDetails", function (req, res, next) {
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let invoiceNo = req.body.invoiceNo;
          let type = req.body.type;
          let invoiceNoArray = [];
          if (type === "Credit Invoice") {
            let invoiceList = Invoice.findOne({ docNum: invoiceNo }, {
              fields: {
                branchName: 1,
                cardName: 1,
                docDate: 1, docTotal: 1,
                docNum: 1, GST: 1, itemLines: 1, totalQty: 1, totalItem: 1
              }
            });
            if (invoiceList !== undefined) {
              let itemArray = [];
              for (let i = 0; i < invoiceList.itemLines.length; i++) {
                itemArray.push({
                  itemCode: invoiceList.itemLines[i].itemCode,
                  itemNam: invoiceList.itemLines[i].itemNam,
                  quantity: (Number(invoiceList.itemLines[i].quantity).toFixed(0)).toString(),
                  incPrice: invoiceList.itemLines[i].incPrice,
                  excPrice: invoiceList.itemLines[i].excPrice,
                  vatGroup: invoiceList.itemLines[i].vatGroup,
                  uoMEntry: invoiceList.itemLines[i].uoMEntry,
                  uomCode: invoiceList.itemLines[i].uomCode,
                  taxRate: invoiceList.itemLines[i].taxRate,
                  whsCode: invoiceList.itemLines[i].whsCode,
                  invWeight: invoiceList.itemLines[i].invWeight,
                  unitQuantity: invoiceList.itemLines[i].unitQuantity,
                  grossTotal: invoiceList.itemLines[i].grossTotal,
                });
              }
              invoiceNoArray.push({
                branch: invoiceList.branchName,
                cardName: invoiceList.cardName,
                docTotal: invoiceList.docTotal,
                taxAmount: invoiceList.GST.toString(),
                totalQty: invoiceList.totalQty.toString(),
                totalItem: invoiceList.totalItem.toString(),
                invoiceNo: invoiceList.docNum,
                itemArray: itemArray
              });
            }
          }
          else {
            let arInvoiceList = ArInvoicePayment.findOne({ arInvId: invoiceNo }, {
              fields: {
                branchName: 1,
                cardName: 1,
                docDate: 1, grandTotal: 1,
                arInvId: 1, GST: 1, itemLines: 1, totalQty: 1, totalItem: 1
              }
            });
            if (arInvoiceList !== undefined) {
              let itemArray = [];
              for (let i = 0; i < arInvoiceList.itemLines.length; i++) {
                itemArray.push({
                  itemCode: arInvoiceList.itemLines[i].itemCode,
                  itemNam: arInvoiceList.itemLines[i].itemNam,
                  quantity: arInvoiceList.itemLines[i].quantity,
                  incPrice: arInvoiceList.itemLines[i].incPrice,
                  excPrice: arInvoiceList.itemLines[i].excPrice,
                  vatGroup: arInvoiceList.itemLines[i].vatGroup,
                  uoMEntry: arInvoiceList.itemLines[i].uoMEntry,
                  uomCode: arInvoiceList.itemLines[i].uomCode,
                  taxRate: arInvoiceList.itemLines[i].taxRate,
                  whsCode: arInvoiceList.itemLines[i].whsCode,
                  invWeight: arInvoiceList.itemLines[i].invWeight,
                  unitQuantity: arInvoiceList.itemLines[i].unitQuantity,
                  grossTotal: arInvoiceList.itemLines[i].grossTotal,
                });
              }
              invoiceNoArray.push({
                branch: arInvoiceList.branchName,
                cardName: arInvoiceList.cardName,
                docTotal: arInvoiceList.grandTotal,
                taxAmount: arInvoiceList.GST.toString(),
                totalQty: arInvoiceList.totalQty.toString(),
                totalItem: arInvoiceList.totalItem.toString(),
                invoiceNo: arInvoiceList.arInvId,
                itemArray: itemArray
              });
            }
          }
          if (invoiceNoArray.length > 0) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "Success",
                data: invoiceNoArray
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId"); 
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


/**
 * Sample GET method for calling the sales order accoriding to customer
 * Done By : Nithin
 * Date : 28/01/21
 */
JsonRoutes.add("GET", "/retrunReasonLists/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let reasonArray = ReturnReason.find({
            disabled: { $ne: "Y" },
          }, {
            fields: {
              absEntry: 1, reason: 1
            }
          }).fetch();
          if (reasonArray !== undefined && reasonArray !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: reasonArray,
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});



/* Sample POST method update notification
* Done By Nithin
* Date 15-11-2021
*/
JsonRoutes.add("POST", "/updateLocNotification", function (req, res, next) {
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {

        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) {
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let dateVal = req.body.dateVal;
          let timeVal = req.body.timeVal;
          let latitude = req.body.latitude;
          let longitude = req.body.longitude;
          let boundaryValue = req.body.boundaryValue;
          let mobileAppId = req.body.mobileAppId;
          LocationNotification.insert({
            employeeId: id,
            dateVal: dateVal,
            timeVal: timeVal,
            createdBy: id,
            latitude: latitude,
            longitude: longitude,
            boundaryValue: boundaryValue,
            mobileAppId: mobileAppId,
            branch: user.defaultBranch,
            employeeName: `${user.profile.firstName} ${user.profile.lastName}`,
            uuid: Random.id(),
            createdAt: new Date(),
            updatedAt: new Date(),
            viewed: false,
            flag: true,
            createdFrom: 'Mobile App',
            vansaleApp: true,
          });
          JsonRoutes.sendResult(res, {
            code: 200,
            data: {
              code: 200,
              message: "Success",
              data: []
            }
          });
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId"); 
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for calling the sales order accoriding to customer
 * Done By : Nithin
 * Date : 28/01/21
 */
JsonRoutes.add("GET", "/expenseList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          let expArrayList = [];
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let expenseList = Expense.find({
            employeeId: id,
            createdAt: {
              $gte: dateValue,
              $lt: dateToday
            }
          }, {
            fields: {
              employeeId: 1, dateVal: 1, timeVal: 1,
              expenseAmount: 1, expCategory: 1,
              routeId: 1, mobileAppId: 1, remarks: 1,
              latitude: 1, longitude: 1, routeAssignId: 1,
              expAmount: 1
            }, sort: { createdAt: -1 }
          }).fetch();

          if (expenseList.length > 0) {
            for (let i = 0; i < expenseList.length; i++) {
              let routeCode = '';
              let routeName = '';
              let routeDetails = RouteGroup.findOne({
                _id: expenseList[i].routeId
              });
              if (routeDetails) {
                routeCode = routeDetails.routeCode;
                routeName = routeDetails.routeName;
              }
              let expObj = {
                employeeId: expenseList[i].employeeId,
                routeCode: routeCode,
                routeName: routeName,
                routeName: routeName,
                routeId: expenseList[i].routeAssignId,
                dateVal: expenseList[i].dateVal,
                timeVal: expenseList[i].timeVal,
                expAmount: expenseList[i].expAmount,
                expCategory: expenseList[i].expCategory,
                mobileAppId: expenseList[i].mobileAppId,
                remarks: expenseList[i].remarks,
                latitude: expenseList[i].latitude,
                longitude: expenseList[i].longitude,
                ackImage: '',
              }
              expArrayList.push(expObj);
            }
          }
          if (expArrayList !== undefined && expArrayList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: expArrayList,
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for calling the sales return accoriding to customer
 * Done By : Nithin
 * Date : 13/05/21
 */
JsonRoutes.add("POST", "/customerReturnList", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.body._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.body._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.body._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.body._id;
          let cardCode = req.body.cardCode;
          let salesReturnList = [];
          let todayDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
          let dateToday = new Date(todayDates);
          let dateValue = new Date(todayDates);
          dateValue.setDate(dateValue.getDate() - 10);
          dateToday.setDate(dateToday.getDate() + 1);
          let orderGet = SalesReturn.find({
            employeeId: id, cardCode: cardCode,
            createdAt: {
              $gte: dateValue,
              $lt: dateToday
            }
          }, {
            fields: {
              employeeId: 1, cardName: 1, branchName: 1, mobileId: 1, salesmanName: 1, sRStatus: 1, weight: 1,
              docDueDate: 1, docStatus: 1, ord_webId: 1, docTotal: 1, docNum: 1, docNum: 1, branch: 1, cardCode: 1,
              address: 1, docDate: 1, itemLines: 1, taxTotal: 1,
              priceMode: 1, priceType: 1, priceTypeName: 1, returnType: 1, invoiceNoArray: 1,
            }, sort: { createdAt: -1 }
          }).fetch();
          if (orderGet !== undefined && orderGet.length > 0) {
            for (let i = 0; i < orderGet.length; i++) {
              let mobileAppId = '';
              if (orderGet[i].mobileId !== undefined) {
                mobileAppId = orderGet[i].mobileId;
              }
              let itemArray = [];
              for (let m = 0; m < orderGet[i].itemLines.length; m++) {
                let itemArrayObj = {
                  randomId: orderGet[i].itemLines[m].randomId,
                  itemNam: orderGet[i].itemLines[m].itemNam,
                  itemCode: orderGet[i].itemLines[m].itemCode,
                  uomCode: orderGet[i].itemLines[m].uomCode,
                  uoMEntry: orderGet[i].itemLines[m].uoMEntry,
                  unitQuantity: orderGet[i].itemLines[m].unitQuantity,
                  quantity: orderGet[i].itemLines[m].quantity,
                  taxRate: orderGet[i].itemLines[m].taxRate,
                  incPrice: orderGet[i].itemLines[m].incPrice,
                  excPrice: orderGet[i].itemLines[m].excPrice,
                  vatRate: orderGet[i].itemLines[m].vatRate,
                  grossTotal: orderGet[i].itemLines[m].grossTotal,
                  unitPrice: orderGet[i].itemLines[m].unitPrice,
                  price: orderGet[i].itemLines[m].price,
                  vatGroup: orderGet[i].itemLines[m].vatGroup,
                  invWeight: orderGet[i].itemLines[m].invWeight,
                  baseLine: orderGet[i].itemLines[m].baseLine,
                  returnReason: orderGet[i].itemLines[m].returnReasonName,
                  invoiceNo: orderGet[i].itemLines[m].invoiceNo,
                  mobileAppId: mobileAppId,
                  webId: orderGet[i]._id,
                }
                itemArray.push(itemArrayObj);
              }


              orderObj =
              {
                _id: orderGet[i]._id,
                docNum: orderGet[i].docNum,
                cardCode: orderGet[i].cardCode,
                cardName: orderGet[i].cardName,
                branch: orderGet[i].branch,
                branchName: orderGet[i].branchName,
                priceMode: orderGet[i].priceMode,
                priceType: orderGet[i].priceType,
                priceTypeName: orderGet[i].priceTypeName,
                docDate: orderGet[i].docDate,
                dueDate: orderGet[i].docDueDate,
                docStatus: orderGet[i].docStatus,
                webId: orderGet[i].ord_webId,
                mobileId: mobileAppId,
                docTotal: orderGet[i].docTotal.toString(),
                taxTotal: orderGet[i].taxTotal.toString(),
                weight: orderGet[i].weight.toString(),
                sRStatus: orderGet[i].sRStatus,
                returnType: orderGet[i].returnType,
                invoiceNo: orderGet[i].invoiceNoArray.toString(),
                itemArray: itemArray
              }
              salesReturnList.push(orderObj)
            }
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
          if (salesReturnList !== undefined && salesReturnList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: salesReturnList,
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});

/**
 * Sample GET method for expense Category
 * Done By : Nithin
 * Date : 29/10/21
 */
JsonRoutes.add("GET", "/expenseCategoryList/:_id", function (req, res, next) {
  // console.log("req.authToken", req.authToken);
  // console.log("req.userId", req.userId);
  if (req.authToken !== undefined && req.userId !== undefined) {
    if (req.params._id === undefined && req.url !== '/users/login') {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          code: 401,
          message: "You are not Authorized",
          data: []
        }
      });
    } else {
      if (req.url !== '/users/login' && req.userId === req.params._id) {
        // console.log("req.body._id", req.params._id);
        let user = Meteor.users.findOne({
          _id: req.params._id, active: "Y"
        });
        if (!user) { // never existed or already been used
          // console.log("never existed or already been used");
          JsonRoutes.sendResult(res, {
            code: 401,
            data: {
              code: 401,
              message: "You are not Authorized",
              data: []
            }
          });
        } else {
          let id = req.params._id;
          let expArrayList = ExpenseCategory.find({
            active: "Y"
          }, {
            fields: {
              expenseCategoryName: 1
            }
          }).fetch();
          if (expArrayList !== undefined && expArrayList !== []) {
            JsonRoutes.sendResult(res, {
              code: 200,
              data: {
                code: 200,
                message: "success",
                data: expArrayList,
              }
            });
          }
          else {
            JsonRoutes.sendResult(res, {
              data: {
                code: 404,
                message: "No Data Found",
                data: []
              }
            });
          }
        }
      }
      else {
        // console.log("Token userId and Param _id are not matching.!");
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            code: 401,
            message: "You are not Authorized",
            data: []
          }
        });
      }
    }
  } else {
    // console.log("Undefined Token and userId");
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        code: 401,
        message: "You are not Authorized",
        data: []
      }
    });
  }
});


function locationUpdatesFun(id, formattedDate, latitude, longitude, activity, customer) {
  return CurrentLocation.insert({
    userId: id,
    latitude: latitude,
    longitude: longitude,
    activity: activity,
    customer: customer,
    date: new Date(formattedDate),
    createdAt: new Date(formattedDate),
    updatedAt: new Date()
  });
}

function locationRouteWiseFun(id, formattedDate, latitude, longitude, activity,
  customer, routeId, checkIn, checkOut, routeDate) {
  return CurrentLocation.insert({
    userId: id,
    latitude: latitude,
    longitude: longitude,
    activity: activity,
    customer: customer,
    routeId: routeId,
    routeDate: routeDate,
    branch: '',
    checkIn: checkIn,
    checkOut: checkOut,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

function locationTransactionWiseFun(id, formattedDate, latitude, longitude, activity,
  customer, routeId, amount) {
  return CurrentLocation.insert({
    userId: id,
    latitude: latitude,
    longitude: longitude,
    activity: activity,
    customer: customer,
    routeId: routeId,
    amount: amount,
    branch: '',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}