/**
 * @author Greeshma
 */
import { Tax } from "../../../api/tax/tax";
import { Meteor } from 'meteor/meteor';

Template.tax_dash.onCreated(function () {
  Blaze._allowJavascriptUrls();
  let self = this;
  self.autorun(() => {
  });
  this.taxLists = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Tax, {
    filters: {
      active: true
    },
    fields: {
      taxCode: 1,
      taxName: 1,
      taxPercentage: 1,
      active: 1
    },
    perPage: 20
  });



});

Template.tax_dash.onRendered(function () {
  $('.taskHeaderList').css('display', 'inline');
  var header = document.getElementById("taskHeader");
  if (header) {
    var btns = header.getElementsByClassName("paginationFilterValue");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("activeHeaders");
        current[0].className = current[0].className.replace(" activeHeaders", "");
        this.className += " activeHeaders";
      });
    }
  }

  $('.taxNameSelection').select2({
    placeholder: "Select Tax Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".taxNameSelection").parent(),
  });
  $('.taxCodeSelection').select2({
    placeholder: "Select Tax Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".taxCodeSelection").parent(),
  });

});


Template.tax_dash.helpers({
  /* list all orders */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  /**
  * TODO: Complete JS doc
  * @returns {Function}
  */
  handlePagination: function () {
    return function (e, templateInstance, clickedPage) {
      e.preventDefault();
      console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
    };
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  taxlist: function () {
    return Template.instance().pagination.getPage();
  },

  activeHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === true) { //"Y"
      return true;
    }
    else {
      return false
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  inactiveHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === false) { //"N"
      return true;
    }
    else {
      return false
    }
  },
  getActiveStatus: (status) => {
    if (status === true) {
      return 'Active';
    }
    else {
      return 'Inactive';
    }
  },
  taxList: function () {
    return Template.instance().taxLists.get();
  },
  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  }

});
Template.tax_dash.events({
  'click #tax-create-button': () => {
    $("#tax-create").modal();
  },
  'click .edit': (event, template) => {
    let _id = event.currentTarget.attributes.id.value;
    $("#taxEditPage").modal();
    template.modalLoader.set(true);
    Meteor.call('tax.gettax', _id, (err, res) => {
      taxlist = res;
      $('#taxCode1').val(taxlist[0].taxCode);
      $('#taxName1').val(taxlist[0].taxName);
      $('#taxPrec1').val(taxlist[0].taxPercentage);
      $('#taxid1').val(taxlist[0]._id);
      $('.headtit1').html('Tax');
      $('.modalhead11').html('Update Tax');
      template.modalLoader.set(false);
    });
  },
  'submit .tax-update': (event) => {
    event.preventDefault();
    tid = 0;
    updateTax(event.target);
    $("#taxEditPage").modal('hide');
  },
  'keyup #taxPrec1': () => {
    if ($('#taxPrec1').val() > 100) {
      $('#taxPrec1').val(100);
    }
    if ($('#taxPrec1').val() < 0) {
      $('#taxPrec1').val(0);
    }
    if (isNaN($('#taxPrec1').val())) {
      $('#taxPrec1').val(0);
    }
  },
  'click .activeFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: true //Y
    });
  },

  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: false //N
    });
  },
  'click .activateTax': (event) => {
    event.preventDefault();
    let header = $('#taxHeaders');
    let taxName = $('#conftaxNames');
    let taxNameDup = $('#taxNameDups');
    let confirmedUuid = $('#confirmedUuids');

    $('#taxActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    $('#taxRemAndActId').val(_id);
    let taxname = $('#taxName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(taxname));
  },
  'click #taxActivate': (event) => {
    event.preventDefault();
    let _id = $('#taxRemAndActId').val();
    Meteor.call('tax.activateTax', _id, (err, res) => {
      if (err) {

        $('#message').html("Internal error - unable to remove entry. Please try again");
      } else {
        $('#taxSuccessModal').modal();
        $('#taxSuccessModal').find('.modal-body').text('Tax activated successfully');
      }
      $("#taxActiveConfirmation").modal('hide');
    });
  },
  'click .deactivateTax': (event) => {
    event.preventDefault();
    let header = $('#taxHeader');
    let taxName = $('#conftaxName');
    let taxNameDup = $('#taxNameDup');
    let confirmedUuid = $('#confirmedUuid');

    $('#taxDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    $('#taxRemAndActId').val(_id);
    let taxname = $('#taxName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(taxname));
    $(taxName).html(taxname);
    // let _id = event.currentTarget.attributes.id.value;
    // Meteor.call('tax.deactivateTax', _id, (err, res) => {

    // });
  },
  'click #taxRemove': (event) => {
    event.preventDefault();
    let _id = $('#taxRemAndActId').val();
    Meteor.call('tax.deactivateTax', _id, (err, res) => {
      if (err) {

        $('#message').html("Internal error - unable to remove entry. Please try again");
      } else {
        $('#taxSuccessModal').modal();
        $('#taxSuccessModal').find('.modal-body').text('Tax deactivated successfully');
      }
      $("#taxDelConfirmation").modal('hide');
    });
  },
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    $('#taxDetailPage').modal();
    template.modalLoader.set(true);
    Meteor.call('tax.withid', id, (err, res) => {
      if (!err) {
        $('#taxHead').html('Details of ' + $.trim(res.taxName));
        if (res.active === true) {
          $(detailStatus).html("Active");
        }
        else if (res.active === false) {
          $(detailStatus).html("Inactive");
        }
        else {
          $(detailStatus).html("");
        }
        $(detailtaxName).html(res.taxName);
        $(detailtaxCode).html(res.taxCode);
        $(detailtaxPerc).html(res.taxPercentage);
        template.modalLoader.set(false);
      }
    });

  },
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('tax.List', (err, res) => {
      if (!err) {
        template.taxLists.set(res);
      }
    });
  }, 'submit .taxFilter': (event) => {
    event.preventDefault();
    let taxCode = event.target.taxCodeSelection.value;
    let taxName = event.target.taxNameSelection.value;

    if (taxCode && taxName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          taxCode: taxCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxName && taxCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          taxName: taxName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxCode && taxName) {
      Template.instance().pagination.settings.set('filters',
        {
          taxCode: taxCode,
          taxName: taxName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
  }, 'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      active: true
    });
    $('form :input').val("");
    $("#taxCodeSelection").val('').trigger('change');
    $("#taxNameSelection").val('').trigger('change');
    $('.taskHeaderList').css('display', 'inline');

    let element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    let elements = document.getElementById("activeFilter");
    elements.classList.add("active");
  },

});