/**
 * @author Subrata
 */
import { Config } from './config';

Meteor.methods({
  /**
     * TODO: Complete JS doc
     * @param id
     * @param name
     * @param description
     * @param username
     */
  'config.createOrUpdate': (id, name, description, username) => {
    let configObject = {
      name: name.trim(),
      value: description,
      view: true
    };
    configObject.uuid = Random.id();
    return Config.insert(configObject);
  },
  'config.latLongGet': () => {
    let latitudeVal = '';
    let longitudeVal = '';
    let configval = Config.findOne({ name: 'boundaryLat' });
    if (configval) {
      latitudeVal = configval.value;
    }
    let configval2 = Config.findOne({ name: 'boundaryLng' });
    if (configval2) {
      longitudeVal = configval2.value;
    }
    return { latitudeVal: latitudeVal, longitudeVal: longitudeVal };
  },
  'config.currencyGet': () => {
    let currencyVal = '';
    let configval = Config.findOne({ name: 'currency' });
    if (configval) {
      currencyVal = configval.value;
    }
    return currencyVal;
  }
});