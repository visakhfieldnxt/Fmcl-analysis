/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor'
import { Outlets } from "../../../api/outlets/outlets";
Template.outletApproved.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.outletId = new ReactiveVar();
  this.outletListsAp = new ReactiveVar();
  this.routeListAp = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Outlets, {
    filters: {
      active: "Y",
      approvalStatus: "Approved",
      subDistributor: Meteor.userId()
    },
    sort: { createdAt: -1 }, 
    fields: {
      name: 1, address: 1, contactPerson: 1, outletType: 1, outletClass: 1,
      routeId: 1, username: 1, approvalStatus: 1, createdAt: 1
    },
    perPage: 20
  });
});
Template.outletApproved.onRendered(function () {
  $('#bodySpinVal').css('display', 'block');
  if (Meteor.user()) {
    Meteor.call('outlet.outletsdWiseList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.outletListsAp.set(res);
      };
    });
  }
  Meteor.call('routeGroup.list', (err, res) => {
    if (!err) {
      this.routeListAp.set(res);
    };
  });

  $('.selectOutletSe1').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutletSe1").parent(),
  });

  $('.selectRouteSe1').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteSe1").parent(),
  });

});
Template.outletApproved.helpers({

  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },
  /**
* get vansale route name
*/

  routeNameHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.idRouteName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.routeVal_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    });
  },
  /**
* TODO: Complete JS doc
* @returns {any | *}
*/
  isReady: function () {
    return Template.instance().pagination.ready();
  },

  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },/**
  * TODO: Complete JS doc
  * @returns {*}
  */
  outletList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinVal').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
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
  outletLisAp: function () {
    return Template.instance().outletListsAp.get();

  },
  routeListsAp: function () {
    return Template.instance().routeListAp.get();

  },
  dateFormates: (date) => {
    return moment(date).format('DD-MM-YYYY')
  },
  /**
 * TODO: Complete JS doc
 */
  sortIcon: () => {
    genericSortIcons();
  },
});

Template.outletApproved.events({
  /** 
 * TODO:Complete JS doc
 * @param event
 */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.outletId.set(id);
    let header = $('#outletH');
    let outletName = $('#outletName');
    let outletAddress = $('#outletAddress');
    let outletContactno = $('#outletContactno');
    let outletCperson = $('#outletCperson');
    let outletemailId = $('#outletemailId');
    let outletremark = $('#outletremark');
    let outletrouteId = $('#outletrouteId');
    let outletapprovalstatus = $('#outletapprovalstatus');
    let outletapDate = $('#outletapDate');
    let outletapBy = $('#outletapBy');
    let outletapRemark = $('#outletapRemark');
    let detailCreditPeriod = $('#detailCreditPeriod');
    let detailCreditAmt = $('#detailCreditAmt');
    let outletTypes = $('#outletTypes');
    let outletClass = $('#outletClass');
    let detailCreatedBy = $('#detailCreatedBy');
    $('#outletDetailPage').modal();
    template.modalLoader.set(true);
    Meteor.call('outlet.outletData', id, (error, res) => {
      if (!error) {
        let outlet = res.outletsLi;
        template.modalLoader.set(false);
        template.outletId.set(id);
        $(header).html('Details of ' + outlet.name);
        $(outletName).html(outlet.name);
        $(outletAddress).html(outlet.address);
        $(outletemailId).html(outlet.emailId);
        $(outletremark).html(outlet.remark);
        $(outletTypes).html(outlet.outletType);
        $(outletClass).html(outlet.outletClass);
        $(outletrouteId).html(res.routeName);
        $(detailCreatedBy).html(res.createdByName);
        if (outlet.creditPeriod !== undefined && outlet.creditPeriod !== '') {
          $(detailCreditPeriod).html(outlet.creditPeriod);
        }
        else {
          $(detailCreditPeriod).html('');
        }
        if (outlet.creditAmount !== undefined && outlet.creditAmount !== '') {
          $(detailCreditAmt).html(outlet.creditAmount);
        }
        else {
          $(detailCreditAmt).html('');
        }
        $(outletapprovalstatus).html(outlet.approvalStatus);
        if (outlet.approvedDate) {
          $(outletapDate).html(moment(outlet.approvedDate).format('DD-MM-YYYY hh:mm A'));
        }
        else {
          $(outletapDate).html('');
        }
        $(outletapBy).html(res.approvedByName);
        if (outlet.approvalRemark !== undefined && outlet.approvalRemark !== '') {
          $(outletapRemark).html(outlet.approvalRemark);
        } else {
          $(outletapRemark).html('');
        }
        if (outlet.contactNo !== undefined && outlet.contactNo !== '') {
          $(outletContactno).html(outlet.contactNo);
        } else {
          $(outletContactno).html('');
        }
        if (outlet.contactPerson !== undefined && outlet.contactPerson !== '') {
          $(outletCperson).html(outlet.contactPerson);
        } else {
          $(outletCperson).html('');
        }
        if (outlet.insideImage) {
          $("#attachment1").attr('style', 'display:block');
          $("#attachment1").attr('src', outlet.insideImage);
        }
        else {
          $("#attachment1").attr('src', '');
          $("#insideImgDiv").val('');
        }

        if (outlet.outsideImage) {
          $("#attachment2").attr('style', 'display:block');
          $("#attachment2").attr('src', outlet.outsideImage);
        }
        else {
          $("#attachment2").attr('src', '');
          $("#ousideImgDiv").val('');
        }

        $(document).ready(function () {
          $('.attachment').click(function () {
            let src = $(this).attr('src');
            $('#fullScreen').css({
              background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
              backgroundSize: 'contain',
              width: '100%', height: '100%',
              position: 'fixed',
              zIndex: '10000',
              top: '0', left: '0',
              cursor: 'zoom-out'
            });
            $('#fullScreen').fadeIn();
          });
          $('#fullScreen').click(function () {
            $(this).fadeOut();
          });
        });
      }
      else {
        template.modalLoader.set(false);
      }
    });

  },
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .outletFilterap': (event) => {
    event.preventDefault();
    let outlet = event.target.selectOutletSe1.value;
    let route = event.target.selectRouteSe1.value;

    if (outlet && route === '') {
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet, subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (route && outlet === '') {
      Template.instance().pagination.settings.set('filters',
        {
          routeId: route, subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (outlet && route) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          routeId: route, subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
  },
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      active: "Y",
      approvalStatus: "Approved",
      subDistributor: Meteor.userId()
    });
    $('form :input').val("");
    $('#selectOutletSe1').val('').trigger('change');
    $('#selectRouteSe1').val('').trigger('change');
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
});