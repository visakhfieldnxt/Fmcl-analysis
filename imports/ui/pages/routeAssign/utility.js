/**
 * @author Nithin
 */
import { HTTP } from 'meteor/http'


/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
assignRouteValues = (target, routeGroupId, empId) => {
  let description = target.descriptionVal;
  let routeDate = target.routeDate;
  let routeDateEnd = target.routeDateEnd;
  Meteor.call('routeAssign.assignEmployee', routeGroupId, empId, description.value, routeDate.value, routeDateEnd.value, (err, res) => {
    if (err) {
      $('#routeErrorModal').modal();
      $('#routeErrorModal').find('.modal-body').text(err.reason);
      $("#submit").attr("disabled", false);
    }
    else {
      $('#routeSuccessModal').find('.modal-body').text('Route Assigned Successfully');
      $('#routeSuccessModal').modal();
      $("#submit").attr("disabled", false);
    }
  });
};



