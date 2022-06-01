/**
 * @author Subrata
 */

Template.config_create.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .config-add': (event) => {
    event.preventDefault();
    createOrUpdateConfig(event.target);
  },
  /**
      * TODO: Complete JS doc
      */
     'click .closeConfig': () => {
      $("#configAdd").each(function () {
        this.reset();
      });
    },
});
