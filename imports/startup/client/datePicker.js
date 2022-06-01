/**
 * @author Subrata
 */

/**
 * TODO: Complete JS doc
 */
bindDatePicker = function () {
  $.each(arguments, function (index, id) {
    $(id).datepicker({format: 'dd/mm/yyyy', autoclose: true});
  })
};