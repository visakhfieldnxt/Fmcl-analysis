/**
 * @author Subrata
 */

/**
 * TODO: Complete JS doc
 * @param collectionName
 * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
 */
globalOptionsHelper = (collectionName) => {
  return {
    collection: collectionName,
    acceptEmpty: false,
    substitute: '<i class="fa fa-pencil"></i>',
    eventType: "dblclick"
  }
};

/**
 * @author Subrata
 */

/**
 * TODO: Complete JS doc
 * @param event
 * @param instance
 */
getSearchedResults = function (event, instance) {
  let value = $.trim(event.target.value);

  if (event.keyCode === 13) {
    instance.pagination.settings.set('filters', {});

    if (value) {
      setTimeout(function () {
        instance.pagination.settings.set('filters', {name: {$regex: new RegExp(value, "i")}});
      }, 200);
    }
  }
  else if(event.keyCode === 8 && ! $.trim(value)) {
    instance.pagination.settings.set('filters', {});
  }
};

/**
 * TODO: Complete JS doc
 * @returns {*|any}
 */
isReady = function () {
  return Template.instance().pagination.ready();
};

/**
 * TODO: Complete JS doc
 * @returns {Function}
 */
handleCommonPagination = function () {
  return function (e, templateInstance, clickedPage) {
    e.preventDefault();
    console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
  };
};


/**
 * TODO: Complete JS doc
 */
triggerSort = function () {
  let sort = getSortOptions();
  Template.instance().pagination.settings.set('sort', sort);
};


/**
 * TODO: Complete JS doc
 * @returns {*}
 */
getTemplatePagination = function () {
  return Template.instance().pagination;
};


/**
 * TODO: Complete JS doc
 * @returns {*}
 */
getInstances = function () {
  return Template.instance().pagination.getPage();
};

/**
 * TODO: Complete JS doc
 */
genericSortIcons = () => {
  let order = Session.get('order');
  let fieldName = Session.get('field');
  Meteor.setTimeout(function () {
    $("#order").remove();
    if (order === 1) {
      $("#" + fieldName).prepend('<i id="order" class="fa fa-angle-double-up icon-align"></i>');
    }
    else {
      $("#" + fieldName).prepend('<i id="order" class="fa fa-angle-double-down icon-align"></i>');
    }
  }, 200);
};


/**
 * TODO: Complete JS doc
 * @returns {{}}
 */
getSortOptions = () => {
  let fieldName = $(event.target).attr('id');
  let order = (Session.get('field') !== fieldName) ? null : Session.get('order');
  let sortOrder = order && order === 1 ? -1 : 1;

  Session.setPersistent('order', sortOrder);
  Session.setPersistent('field', fieldName);

  let sort = {};
  sort[fieldName] = sortOrder;

  return sort;
};