/**
 * @author Visakh
 */

import {Branch} from "../branch";
import {publishPagination} from 'meteor/kurounin:pagination';


Meteor.startup(() => {
  /**
 * TODO: Complete JS doc
 */
  Branch.createIndex({ uuid: 1 }, {  unique: true  });
  Branch.createIndex({ bPLName: 1 }, {  unique: true  });
  Branch.createIndex({ bPLId: 1 }, {  unique: true  });
  Branch.createIndex({ dflWhs: 1 }, {  unique: true  });
  
  publishPagination(Branch);

});
/**
 * TODO: Complete JS doc
 */
Meteor.publish('branch.list', function () {
  return Branch.find({},{uuid:1,bPLId:1,bPLName:1,dflWhs:1});

});
/**
 * TODO: Complete JS doc
 * Getting specific brand with bpLid from db
 */
Meteor.publish('branchBPLId.list', function (bPLId) {
  return Branch.find({bPLId:bPLId},{uuid:1,bPLId:1,bPLName:1,dflWhs:1});

});
