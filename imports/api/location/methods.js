/**
 * @author Nithin
 */
import { Location } from './location';
import { Branch } from '../branch/branch';

Meteor.methods({

  /**
   * create location
   * @param locationName
   * @param locationCode
   * @returns 
   */
  'location.create': (locationName, locationCode, branch, vertical) => {
    let locationRes = Location.insert({
      locationCode: locationCode,
      locationName: locationName,
      branch: branch,
      vertical: vertical,
      active: 'Y',
      uuid: Random.id(),
      createdBy: Meteor.userId(),
      createdAt: new Date(),
    });

    if (locationRes) {
      return locationRes;
    }
  },
  /**
   * update location
   * @param {*} id 
   * @param {*} locationName 
   * @param {*} locationCode 
   * @returns 
   */
  'location.update': (id, locationName, locationCode, branch, vertical) => {
    return Location.update({ _id: id }, {
      $set:
      {
        locationCode: locationCode,
        locationName: locationName,
        branch: branch,
        vertical: vertical,
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },
  /**
   * get location details using id
   * @param {*} id 
   * @returns 
   */
  'location.id': (id) => {
    return Location.findOne({ _id: id }, { fields: { locationName: 1, locationCode: 1, active: 1, branch: 1 } });


  },
  'location.findName':(id)=>{
    return Location.findOne({ _id: id }).locationName;

  },
  /**
   * fetching location full details 
   * @returns 
   */
  'location.locationList': () => {
    return Location.find({}, { fields: { locationName: 1, locationCode: 1 } }, { sort: { locationName: 1 } }).fetch();
  },
  'location.locationByBranch': (branch) => {
    return Location.find({branch:branch}, { fields: { locationName: 1, locationCode: 1 } }, { sort: { locationName: 1 } }).fetch();
  },
  /**
  * fetching location full details 
  * @returns 
  */
  'location.userWise': (vertical) => {
    return Location.find({ vertical: { $in: vertical } }, { fields: { locationName: 1, locationCode: 1 } }, { sort: { locationName: 1 } }).fetch();
  },
  /**
   * activate location
   * @param {*} id  
   * @returns 
   */
  'location.active': (id) => {
    return Location.update({ _id: id }, {
      $set:
      {
        active: 'Y',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * deactivate location
 * @param {*} id  
 * @returns 
 */
  'location.inactive': (id) => {
    return Location.update({ _id: id }, {
      $set:
      {
        active: 'N',
        updatedBy: Meteor.userId(),
        updatedAt: new Date(),
      }
    });
  },

  /**
 * get location details using id
 * @param {*} id 
 * @returns 
 */
  'location.idDataGet': (id) => {
    let locRes = Location.findOne({ _id: id }, { fields: { locationName: 1, locationCode: 1, active: 1, branch: 1 } });
    let branchName = '';
    if (locRes) {
      let branchRes = Branch.findOne({ _id: locRes.branch });
      if (branchRes) {
        branchName = branchRes.branchName;
      }
      return { locRes: locRes, branchName: branchName };
    }
  },
  /**
   * return branch wise locations */
  'location.branchData': (branch) => {
    return Location.find({ active: "Y", branch: branch }, { fields: { locationName: 1 } }).fetch();
  },
  /**
 * get branch name based on id
 * @param {*} id 
 */
  'location.idlocation': (id) => {
    let res = Location.findOne({ _id: id }, { fields: { locationName: 1 } });
    if (res) {
      return res.locationName;
    }
  }
});