// Client entry point, imports all client code

import '/imports/startup/client';
import '/imports/startup/both';
import { Config } from '../imports/api/config/config.js'

Meteor.subscribe('config.list');  

setTimeout(function () {
  const appName = Config.findOne({ name: 'headerName' });
  if (appName) {
    $('#title').html(appName.value);
  }
}, 800);
