/**
 * @author Nithin
 */

import { CollectionDue } from "../collectionDue";
import { publishPagination } from 'meteor/kurounin:pagination';

Meteor.startup(() => {
  /**
   * TODO: Complete JS 
   */
  CollectionDue._ensureIndex({ uuid: 1 }, { unique: true });
  CollectionDue._ensureIndex({ createdAt: 1 }, { unique: false });
  publishPagination(CollectionDue);

});

