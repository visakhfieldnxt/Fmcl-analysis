/**
 * @author Subrata
 */
import { Notification } from '../../../api/notification/notification';

Meteor.subscribe('notification.list');

Template.successModal.helpers({
  /**
   * TODO: Complete JS doc
   * @param id
   * @returns {*}
   */
  generateId: (id) => {
    return collectId(id, 'successModal');
  }
});

Template.errorModal.helpers({
  /**
   * TODO: Complete JS doc
   * @param id
   * @returns {*}
   */
  generateId: (id) => {
    return collectId(id, 'errorModal');
  }
});

Template.warningModal.helpers({
  /**
   * TODO: Complete JS doc
   * @param id
   * @returns {*}
   */
  generateId: (id) => {
    return collectId(id, 'warningModal');
  },
  notification:()=>{
    
    $(".modal-backdrop").css("z-index","1000");
    let notification = Notification.findOne({ userId: Meteor.userId() });
// console.log("hi",notification.message.content);
    if (notification) {
      return notification.message.content;
    }else{      
      return '<p>Not Found</p>';
    }
  }
});

/**
 * TODO: Complete JS doc
 * @param id
 * @param defaultId
 * @returns {*}
 */
function collectId(id, defaultId) {
  let modalId = defaultId;
  if (id && $.trim(id)) {
    modalId = $.trim(id);
  }

  return modalId;
}