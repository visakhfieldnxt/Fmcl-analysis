/**
 * @author Nithin
 */
import { CollectionDue } from "../../../api/collectionDue/collectionDue";
import { Meteor } from 'meteor/meteor';

Template.collection.onCreated(function () {
  Blaze._allowJavascriptUrls();
  let self = this;
  self.autorun(() => {
  });
  this.collectionArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.collectionDataArray = new ReactiveVar();
  this.outletArray = new ReactiveVar();
  this.pagination = new Meteor.Pagination(CollectionDue, {
    filters: {
      subDistributor: Meteor.userId()
    },
    sort: { createdAt: -1 },
    fields: {
      outlet: 1,
      createdBy: 1,
      collectionAmt: 1,
      collectionDate: 1,
      subDistributor: 1
    },
    perPage: 20
  });
});

Template.collection.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  /**
   * 
   */
  if (Meteor.user()) {
    Meteor.call('outlet.sdBase', Meteor.userId(), (err, res) => {
      if (!err)
        this.outletArray.set(res);
    });
  }
  $('.selectOutlets').select2({
    placeholder: "Select Outlet",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutlets").parent(),
  });

});


Template.collection.helpers({
  /* list all orders */
  isReady: function () {
    return Template.instance().pagination.ready();
  }, /**
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
   * 
   * @returns oulet listing for filter
   */
  outletList: () => {
    return Template.instance().outletArray.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
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
  collectionlist: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
   * 
   * @returns 
   */
  chequeInfoArray: () => {
    let res = Template.instance().collectionDataArray.get();
    if (res) {
      if (res.chequeInfo !== undefined && res.chequeInfo.length > 0) {
        return res.chequeInfo;
      }
    }
  },
  /**
 * 
 * @returns 
 */
  cashInfoArray: () => {
    let res = Template.instance().collectionDataArray.get();
    if (res) {
      if (res.cashInfo !== undefined && res.cashInfo.length > 0) {
        return res.cashInfo;
      }
    }
  },
  /**
 * 
 * @returns 
 */
  rtgsInfoArray: () => {
    let res = Template.instance().collectionDataArray.get();
    if (res) {
      if (res.rtgsInfo !== undefined && res.rtgsInfo.length > 0) {
        return res.rtgsInfo;
      }
    }
  },
  /**
* get vansale user name
*/

  getOutletName: (outlet) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("outlet.idName", outlet, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletIdVal_' + outlet).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.outletIdVal_' + outlet).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get user name
* @param {} user 
*/
  getUserName: (user) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idName", user, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.userIdVal_' + user).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.userIdVal_' + user).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
});
Template.collection.events({
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
  },/**
    * TODO: Complete JS doc
    * for hide filter display
    */
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  /**
 * TODO: Complete JS doc
 * @param event
 */
  'submit .collectionFilter': (event) => {
    event.preventDefault();
    let outlet = event.target.selectOutlets.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    if (outlet && isNaN(toDate) && isNaN(fromDate)) {
      Template.instance().pagination.settings.set('filters',
        {
          subDistributor: Meteor.userId(),
          outlet: outlet,
        }
      );
    }
    else if (fromDate && isNaN(toDate) && outlet === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: fromDate
        },
        subDistributor: Meteor.userId()
      });
    }
    else if (toDate && isNaN(fromDate) && outlet === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $lte: toDate
        },
        subDistributor: Meteor.userId()
      });
    }
    else if (fromDate && toDate && outlet === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          subDistributor: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          subDistributor: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lte: toDate
          },
        });
      }
    }
    else if (outlet && toDate && fromDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          subDistributor: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          outlet: outlet,
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          subDistributor: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lte: toDate
          },
          outlet: outlet,
        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      subDistributor: Meteor.userId()
    });
    $('form :input').val("");
    $("#selectOutlets").val('').trigger('change');
  },
  /**
    * TODO:Complete JS doc
    * @param event
    */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#collectionHead');
    $(header).html('Details of collection');
    let detailOutlet = $('#detailOutlet');
    let detailEmp = $('#detailEmp');
    let detailCollectionType = $('#detailCollectionType');
    let detailTransType = $('#detailTransType');
    let detailInvNo = $('#detailInvNo');
    let detailAmt = $('#detailAmt');
    let detailRoute = $('#detailRoute');
    $('#collectionDetailPage').modal();
    template.collectionDataArray.set('');
    Meteor.call('collectionDue.id', id, (err, res) => {
      if (!err) {
        template.modalLoader.set(false);
        $(detailOutlet).html(res.outletName);
        $(detailEmp).html(res.empName);
        $(detailRoute).html(res.routeName);
        $(detailCollectionType).html(res.collectionRes.collectionType);
        $(detailTransType).html(res.collectionRes.transactionType);
        $(detailInvNo).html(res.collectionRes.invoiceNumber);
        $(detailAmt).html(res.collectionRes.collectionAmt);
        template.collectionDataArray.set(res.collectionRes);
        if (res.collectionRes.ackImage) {
          $("#attachment1").attr('style', 'display:block');
          $("#attachment1").attr('src', res.collectionRes.ackImage);
        }
        else {
          $("#attachment1").attr('src', '');
          $("#insideImgDiv").val('');
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
});