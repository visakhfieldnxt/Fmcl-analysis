/**
 * @author Subrata
 */

/**
 * TODO: Complete JS doc
 * @param target
 * @param id
 */
createOrUpdateConfig = (target, id) => {
  const name = target.name;
  const description = target.description;
  const username = Meteor.user().username;

  Meteor.call('config.createOrUpdate', id, name.value, description.value, username, (err) => {
    if (err) {  
      $('#configErrorModal').modal();
      $('#configErrorModal').find('.modal-body').text(err.reason);
    }
    else {
      $('#configSuccessModal').modal();
      target.name.value = '';
      target.description.value = '';
    }
    $('#config-create').modal('hide');
  });
};
