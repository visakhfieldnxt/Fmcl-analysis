/**
 * @author Nithin
 */
import { HTTP } from 'meteor/http'


/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createrRouteGroup = (target, customerArray, branch) => {
  let routeName = target.routeNameValue;
  let description = target.descriptionVal; 
  Meteor.call('routeGroup.create', routeName.value, description.value, customerArray, branch, (err, res) => {
    if (err) {
      $('#routeErrorModal').modal();
      $('#routeErrorModal').find('.modal-body').text(err.reason);
      $("#submit").attr("disabled", false);
    }
    else {
      $('#routeSuccessModal').find('.modal-body').text('Route has been created successfully');
      $('#routeSuccessModal').modal();
      $("#submit").attr("disabled", false);
    }
  });
};


/**
 * update route based on id
 */

editOrUpdateRouteGroup = (target, routeId, customerArray) => {
  let routeName = target.routeNameEdit;
  let description = target.routeDescripEdit; 
  Meteor.call('routeGroup.update', description.value,routeName.value, customerArray, routeId, (err, res) => {
    if (err) {
      $('#routeErrorModal').modal();
      $('#routeErrorModal').find('.modal-body').text(err.reason);
      $("#submit").attr("disabled", false);
    }
    else {
      $('#routeSuccessModal').find('.modal-body').text('Route has been updated successfully');
      $('#routeSuccessModal').modal();
      $("#submit").attr("disabled", false);
    }
  });
};
