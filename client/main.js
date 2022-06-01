// Client entry point, imports all client code

import '/imports/startup/client';
import '/imports/startup/both';
import {Config} from '../imports/api/config/config.js'

 
setTimeout(function () {
  const appName = Config.findOne({name: 'headerName'});
  $('#title').html(appName.value);
}, 800);
