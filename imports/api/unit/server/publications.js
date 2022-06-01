/**
 * @author Visakh
 */

import {Unit} from "../unit";
import {publishPagination} from 'meteor/kurounin:pagination';

Meteor.startup(() => {
  /**
 * TODO: Complete JS invResult
 */
Unit.createIndex({ uuid: 1 }, { unique: true});
Unit.createIndex({ ugpCode: 1 }, { unique: false});
Unit.createIndex({ uomCode: 1 }, { unique: false});
Unit.createIndex({ baseQty: 1 }, { unique: false});
  
  
  publishPagination(Unit);
  
});
/**
 * TODO: Complete JS invResult
 */
Meteor.publish('unit.list', function () {
  return Unit.find({});

});
/**
 * TODO: Complete JS invResult
 */
Meteor.publish('unitFiltered.list', function () {  
  return Unit.find({},{sort:{updatedAt:-1},
    fields:{_id:1,ugpCode:1,uomCode:1,uuid:1,baseQty:1,uomEntry:1},
    });
});
/**
 * TODO: Complete JS invResult
 */
Meteor.publish('unitSpecific.list', function (unitK,unitUgmCode) {  
  return Unit.find({uomCode:unitK,ugpCode:unitUgmCode},{sort:{updatedAt:-1},
    fields:{_id:1,ugpCode:1,uomCode:1,uuid:1,baseQty:1,uomEntry:1},
    });
});

/**
 * TODO: Complete JS invResult
 */
Meteor.publish('unitUgpCode.list', function (itemUgcode) {  
  return Unit.find({ugpCode:itemUgcode},{
    fields:{_id:1,ugpCode:1,uomCode:1,uuid:1,baseQty:1},
    });
});