/**
 * @author Visakh
 */

import {publishPagination} from 'meteor/kurounin:pagination';
import {Meteor} from 'meteor/meteor';

Meteor.startup(() => {
     // Enable cross origin requests for all endpoints
     JsonRoutes.setResponseHeaders({
      "Cache-Control": "no-store",
      "Pragma": "no-cache",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    });
  
  
});

