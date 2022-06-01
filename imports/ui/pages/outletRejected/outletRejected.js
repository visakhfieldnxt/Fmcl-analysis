/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor'
import { Outlets } from "../../../api/outlets/outlets";

Template.outletReject.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  this.pagination = new Meteor.Pagination(Outlets, {
    filters: {
      active: "Y",
      approvalStatus: "Rejected",
      subDistributor: Meteor.userId()
    },
    sort: { createdAt: -1 },
    fields: {
      name:1,
      address:1,
      contactPerson:1,
      outletType:1,
      outletClass:1,
      routeId:1,
      username:1
    },
    perPage: 20
  });
  this.outletId = new ReactiveVar();
  this.outletLists = new ReactiveVar();
  this.routeList = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
});

Template.outletReject.onRendered(function () {
  /**
   * 
   */
  if (Meteor.user()) {
    Meteor.call('outlet.outletsdWiseList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.outletLists.set(res);
      };
    });
  }
  Meteor.call('routeGroup.list', (err, res) => {
    if (!err) {
      this.routeList.set(res);
    };
  });

  $('.selectOutletSe').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutletSe").parent(),
  });
  $('.selectRouteSe').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteSe").parent(),
  });
  
    $('.selectoutletstatus').select2({
    placeholder: "Select Status",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectoutletstatus").parent(),
  });

});
Template.outletReject.helpers({
  //   printLoad: () => {
  //   return Template.instance().modalLoader.get();
  // },
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
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
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
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
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
  outletLis: function () {
    return Template.instance().outletLists.get();

  },
  routeLists: function () {
    return Template.instance().routeList.get();

  },
  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },
  dateFormates: (date) => {
    return moment(date).format('DD-MM-YYYY')
  }
});

Template.outletReject.events({
  /** 
 * TODO:Complete JS doc
 * @param event
 */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    // template.modalLoader.set('');
    template.outletId.set(id);
    let header = $('#outletH');
    let outletName = $('#outletName');
    let outletAddress = $('#outletAddress');
    let outletContactno = $('#outletContactno');
    let outletCperson = $('#outletCperson');
    let outletemailId = $('#outletemailId');
    let outletremark = $('#outletremark');
    let outletrouteId = $('#outletrouteId');
    let outletTypes = $('#outletTypes');
    let outletClass = $('#outletClass');
    let detailCreatedBy=$('#detailCreatedBy');
    let outletapprovalstatus = $('#outletapprovalstatus');
    $('#outletDetailPage').modal();
    template.modalLoader.set(true);
    Meteor.call('outlet.outletData', id, (error, res) => {
      console.log(res);
      if (!error) {
        // template.modalLoader.set(res);
        template.modalLoader.set(false);
        let outlet = res.outletsLi;
        template.outletId.set(id);
        $(header).html('Details of ' + outlet.name);
        $(outletName).html(outlet.name);
        $(outletAddress).html(outlet.address);
        $(outletemailId).html(outlet.emailId);
        $(outletremark).html(outlet.remark);
        $(outletrouteId).html(res.routeName);
        $(outletTypes).html(outlet.outletType);
        $(outletClass).html(outlet.outletClass);
        $(outletapprovalstatus).html(outlet.approvalStatus);
        $(detailCreatedBy).html(res.createdByName);

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
    });

  }, /**
* TODO: Complete JS doc
* @param event
* for updating quotation status
*/
  'submit .statusUpdate': (event, template) => {
    console.log(event.target);
    event.preventDefault();
    let target = event.target;
    $("#outletDetailPage").modal('hide');
    let outletId = Template.instance().outletId.get();
    let status = target.outletUpStatus.value;
    let remarks = target.outletUpRemark.value;
    let creditPeriod = target.creditPeriod.value;
    let creditAmount = target.creditAmt.value;
    if (status === 'Approved') {
      Meteor.call('outlet.approve', outletId, remarks, creditPeriod, creditAmount, (error) => {
        if (error) {

          $('#message').html("Internal error - unable to approve entry. Please try again");
          template.outletId.set('');
          $('#outletUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        } else {

          $('#outletSuccessModal').find('.modal-body').text('Outlet Approved Successfully');
          $('#outletSuccessModal').modal();
          template.outletId.set('');
          $('#outletUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        }

      });
    }
    else {
      Meteor.call('outlet.statusUpdate', outletId, remarks, status, (error) => {
        if (error) {
          $('#message').html("Internal error - unable to update entry. Please try again");
          template.outletId.set('');
          $('#outletUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        } else {
          $("#orderDetailPage").modal('hide');
          $('#outletSuccessModal').find('.modal-body').text('Outlet Status Updated Successfully');
          $('#outletSuccessModal').modal();
          template.outletId.set('');
          $('#outletUpStatus').val('').trigger('change');
          $('.statusUpdate').each(function () {
            this.reset();
          });
        }
      });
    }
  },
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },

  'submit .outletFilter': (event) => {
    event.preventDefault();
    let outlet = event.target.selectOutletSe.value;
    let route = event.target.selectRouteSe.value;

    if (outlet && route === '') {
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (route && outlet === '') {
      Template.instance().pagination.settings.set('filters',
        {
          routeId: route,
          subDistributor: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (outlet && route) {
      Template.instance().pagination.settings.set('filters',
        {
          _id: outlet,
          routeId: route,
          subDistributor: Meteor.userId()
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
      approvalStatus: "Rejected",
      subDistributor: Meteor.userId()
    });
    $('form :input').val("");
    $('#selectOutletSe').val('').trigger('change');
    $('#selectRouteSe').val('').trigger('change');
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  // number validation
  'keypress #creditAmt': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $("#creditAmt").val()
      if (inputValue.indexOf('.') < 1) {
        return true;
      }
      return false;
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  },
});