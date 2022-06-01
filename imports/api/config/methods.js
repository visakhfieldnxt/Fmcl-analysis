/**
 * @author Subrata
 */
import {Config} from './config';

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
});