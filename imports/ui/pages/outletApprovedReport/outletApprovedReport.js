/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { allUsers } from '../../../api/user/user';
Template.outletApprovedReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.routeExportData = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.assignedHistoryData = new ReactiveVar();
  this.vansaleUserFullList = new ReactiveVar();
  this.customerUserDetail = new ReactiveVar();
  this.modalLoaderBody = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.routeCodeList = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.verticalDataList = new ReactiveVar();
  this.userNameArray1 = new ReactiveVar();
  this.plistArray = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.subd = new ReactiveVar();
  this.subdExport = new ReactiveVar();
  let vertical = Session.get("loginUserVerticals");
  this.pagination = new Meteor.Pagination(allUsers, {
    sort: {
      createdAt: -1
    },
    filters: {
      userType: 'SD', vertical: { $in: vertical }, active: 'Y'
    },
    fields: { profile: 1 },
    perPage: 25
  });
});
Template.outletApprovedReport.onRendered(function () {
  this.modalLoaderBody.set(false);
  $('#bodySpinLoaders').css('display', 'block');
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('user.userNameGet1', loginUserVerticals, (err, res) => {
    if (!err)
      this.userNameArray1.set(res);
  });
  $('.selectSDName').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName").parent(),
  });

  $('.userNameClass').select2({
    placeholder: "Select User Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".userNameClass").parent(),
  });
  $('.userNameClassd').select2({
    placeholder: "Select User Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".userNameClassd").parent(),
  });

  //  Template.instance().fromDate.set(moment(new Date()).format('YYYY-MM-01 00:00:00.0'))
  // let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  //  toDay = new Date(today);
  //  nextDay = new Date(toDay);
  //  nextDay.setDate(nextDay.getDate() + 1);
  //  Template.instance().toDate.set(nextDay)
  this.fromDate.set(moment(new Date()).format('YYYY-MM-01 00:00:00.0'))
  this.toDate.set(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'))
});
Template.outletApprovedReport.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },

  outletTotal: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.totalOutlets', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVol_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.saleVol_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  }, outletTotalExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.totalOutlets', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolExport_' + id).html(result); 
    }
    ).catch((error) => {
      $('.saleVolExport_' + id).html(''); 
    });
  },

  outletTotalSum: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let subd = Template.instance().subd.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.totalSumOutlets', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletTotalSum_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.outletTotalSum_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },

  outletTotalSumExport: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let subd = Template.instance().subdExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.totalSumOutlets', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletTotalSumExport_').html(result); 
    }
    ).catch((error) => {
      $('.outletTotalSumExport_').html(''); 
    });
  },
  outletNew: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.newOutlets', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalid_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.verticalid_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  outletNewExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.newOutlets', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalidExport_' + id).html(result); 
    }).catch((error) => {
      $('.verticalidExport_' + id).html(''); 
    });
  },
  outletNewTotal: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let subd = Template.instance().subd.get();
    console.log("subd ", subd);
    console.log("fromDate ", fromDate);
    console.log("toDate ", toDate);

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.outletNewTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletNewTotal_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.outletNewTotal_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  outletNewTotalExport: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let subd = Template.instance().subdExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.outletNewTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletNewTotalExport_').html(result); 
    }).catch((error) => {
      $('.outletNewTotalExport_').html(''); 
    });
  },
  pendingOutlets: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.pendingList', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.pending_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.pending_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  pendingOutletsExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.pendingList', id, fromDate, toDate, (error, result) => {
        if (!error) {
          console.log("resut", result);
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.pendingExport_' + id).html(result); 
    }).catch((error) => {
      $('.pendingExport_' + id).html(''); 
    });
  },
  pendingOutletsTotal: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let subd = Template.instance().subd.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.pendingOutletsTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.pendingOutletsTotal_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.pendingOutletsTotal_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  pendingOutletsTotalExport: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let subd = Template.instance().subdExport.get();

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.pendingOutletsTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          console.log("resut", result);
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.pendingOutletsTotalExport_').html(result); 
    }).catch((error) => {
      $('.pendingOutletsTotalExport_').html(''); 
    });
  },
  onHoldOutlets: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.onHoldList', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.onHoldOutlets_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.onHoldOutlets_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  onHoldOutletsExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.onHoldList', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.onHoldOutletsExport_' + id).html(result); 
    }).catch((error) => {
      $('.onHoldOutletsExport_' + id).html(''); 
    });
  },
  onHoldOutletsTotal: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let subd = Template.instance().subd.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.onHoldOutletsTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.onHoldOutletsTotal_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.onHoldOutletsTotal_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  onHoldOutletsTotalExport: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let subd = Template.instance().subdExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.onHoldOutletsTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.onHoldOutletsTotalExport_').html(result); 
    }).catch((error) => {
      $('.onHoldOutletsTotalExport_').html(''); 
    });
  },
  rejectedOutlets: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.rejectedList', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.rejectedOutlets_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.rejectedOutlets_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  rejectedOutletsExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.rejectedList', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.rejectedOutletsExport_' + id).html(result); 
    }).catch((error) => {
      $('.rejectedOutletsExport_' + id).html(''); 
    });
  },
  rejectedOutletsTotal: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let subd = Template.instance().subd.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.rejectedOutletsTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.rejectedOutletsTotal_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.rejectedOutletsTotal_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  rejectedOutletsTotalExport: () => {
    let vertical = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let subd = Template.instance().subdExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlet.rejectedOutletsTotal', subd, vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.rejectedOutletsTotalExport_').html(result); 
    }).catch((error) => {
      $('.rejectedOutletsTotalExport_').html(''); 
    });
  },

  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  /**
   * 
   * @param {*} dates 
   * formatting date time
   */

  dateFormats: (dates) => {
    if (dates) {
      return moment(dates).format('DD-MM-YYYY hh:mm A');
    }
    else {
      return '';
    }
  },


  /**
* TODO:Complete JS doc
* @param docDate
*/
  timeSeperate: (docDate) => {
    return moment(docDate).format('hh:mm:ss A');
  },

  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  orderes: function () {
    let exportValue = Template.instance().pagination.getPage();
    if (exportValue.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    Template.instance().todayExport.set(exportValue);
    return Template.instance().pagination.getPage();
  }, listData: function () {
    return Template.instance().plistArray.get();

  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
  },
  userList: function () {
    return Template.instance().userNameArray1.get();
  },

  printLoadBody: () => {
    let res = Template.instance().modalLoaderBody.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },



  /**
  * TODO: Complete JS doc
  * @returns {*}
  */
  orderByDateExport: function () {
    return Template.instance().routeExportData.get();
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
   */
  sortIcon: () => {
    genericSortIcons();
  },

  /**
  * TODO:Complete JS doc
  */
  items: () => {
    return Template.instance().itemsDetailsList.get();
  },

  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  dateFormat: (docDate) => {
    let res = moment(docDate).format('DD-MM-YYYY hh:mm A');
    return res.toString();
  },
  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
  },


  /**
  * TODO:Complete JS doc
  * 
  */
  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
let vertical = Session.get('loginUserVerticals');

Template.outletApprovedReport.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let fromDate = $("#fromDate").val().toString();
    let toDates = $("#toDate").val().toString();
    let sdName = $("#userNameClass").val();
    // console.log("fromDate ",fromDate);
    // console.log("toDates ",toDates);

    if (sdName !== null && fromDate != '' && toDates != '') {
      fromDate = moment(fromDate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      toDates = moment(toDates, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      template.toDate.set(toDates);
      template.fromDate.set(fromDate);
      template.subd.set(sdName);

      Template.instance().pagination.settings.set('filters', {
        userType: 'SD', vertical: { $in: vertical }, active: 'Y', _id: sdName
      });

    }
    else {
      toastr['error']("Please fill up all fields");

      Template.instance().pagination.settings.set('filters', { userType: 'SD', vertical: { $in: vertical }, active: 'Y' });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (event, template) => {
    event.preventDefault();
    template.subd.set(null);
    let vertical1 = Session.get("loginUserVerticals");
    $("#userNameClass").val('').trigger('change');
    let fromDate = moment(new Date()).format("YYYY-MM-01 00:00:00.0");
    let toDates = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    template.toDate.set(toDates);
    template.fromDate.set(fromDate);
    Template.instance().pagination.settings.set('filters', {
      userType: 'SD', vertical: { $in: vertical1 }, active: 'Y'
    });
    $('form :input').val("");
  },
  /**
      * TODO:Complete JS doc
      * @param event
      */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set(true);
    template.itemsDetailsList.set('');
    template.assignedHistoryData.set('');
    template.routeUpdatedData.set('');
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let routeCode = $('#detailrouteCode');
    let routeName = $('#detailrouteName');
    let description = $('#detailDescription');
    let dateVal = $('#detailDate');
    let detailStatus = $('#detailStatus');
    let detailBranch = $('#detailBranch');
    let detailedAssignedBy = $('#detailedAssignedBy');
    let detailedAssignedTo = $('#detailedAssignedTo');
    let detailedAssigneeRemark = $('#detailedAssigneeRemark');
    let detailedAssignedDate = $('#detailedAssignedDate');
    let detailDateEnd = $('#detailDateEnd');
    $('#orderDetailPage').modal();
    Meteor.call('routeAssign.id', id, (err, res) => {
      if (!err) {
        $(header).html('Details of Route');
        $(routeCode).html(res.routeGrpRes.routeCode);
        $(routeName).html(res.routeGrpRes.routeName);
        $(description).html(res.routeGrpRes.description);
        $(detailedAssignedBy).html(res.assignedByName);
        $(detailedAssignedTo).html(res.assignedToName);
        $(detailedAssigneeRemark).html(res.routeAssignRes.remarks);
        if (res.routeAssignRes.assignedAt !== '') {
          $(detailedAssignedDate).html(moment(res.routeAssignRes.assignedAt).format('DD-MM-YYYY hh:mm A'));
        }
        else {
          $(detailedAssignedDate).html('');
        }
        $(dateVal).html(res.routeAssignRes.routeDate);
        $(detailDateEnd).html(res.routeAssignRes.routeDateEnd);
        if (res.branchName !== undefined) {
          $(detailBranch).html(res.branchName);
        }
        else {
          $(detailBranch).html('');
        }
        $(detailStatus).html(res.routeAssignRes.routeStatus);
        template.modalLoader.set(false);
        template.itemsDetailsList.set(res.customerDetailsArray);
        template.routeUpdatedData.set(res.routeUpdatesArray);
      }
      else {
        template.modalLoader.set(false);
      }
    });
  },
  /**
     * TODO: Complete JS doc
     */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  /**
    * TODO:Complete JS doc
    */
  'submit .exportByDate': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().routeExportData.get();
    if (exportData.length === 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#exportButtons").prop('disabled', true);
      $("#routeReportExportPage").modal('hide');
      Meteor.setTimeout(() => {
        let uri = 'data:application/vnd.ms-excel;base64,',
          template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
          base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
          },
          format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
              return c[p];
            });
          }
        let toExcel = document.getElementById("exportTodayOrder").innerHTML;
        let ctx = {
          worksheet: name || 'Excel',
          table: toExcel
        };
        //return a promise that resolves with a File instance
        function urltoFile(url, filename, mimeType) {
          return (fetch(url)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
          );
        };

        //Usage example:
        urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
          .then(function (file) {

            saveAs(file, "Route Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('form :input').val("");
      }, 5000);
    }
  },

  /**
   * TODO:CompleteJS doc
   */
  'change .startDate': () => {
    $(".endDate").attr("disabled", false);
  },
  /**
   * TODO:CompleteJS doc
   */
  'change .endDate': (event, template) => {
    let startDate = $('.startDate').val();
    let endDate = $('.endDate').val();
    $('.mainLoader').css('display', 'block');
    let dateOne = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    toDate.setDate(toDate.getDate() + 1);
    template.modalLoader.set(false);
    if (startDate.toString() !== 'Invalid Date') {
      template.modalLoader.set(true);
      // console.log("fromDate", fromDate);
      // console.log("toDate", toDate);
      Meteor.call('routeAssign.export', fromDate, toDate, (err, res) => {
        if (!err) {
          template.routeExportData.set(res);
          template.modalLoader.set(false);
          // console.log("ress", res);
          if (res.length === 0) {
            toastr["error"]('No Records Found');
          }
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
    else {
      template.modalLoader.set(false);
      $(window).scrollTop(0);
      $("#startDateSpan").html('<font color="#fc5f5f" size="2">Please select a valid date</font>');
      setTimeout(function () {
        $('#startDateSpan').delay(5000).fadeOut('slow');
      }, 5000);
      $('.mainLoader').css('display', 'none');
    }
  },
  /**
   * TODO:Complete JS doc
   */

  'click .exportClose': (event, template) => {
    $('form :input').val("");
    $('#startDateSpan').html('');
    template.routeExportData.set('');
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');

  },
  /**
    * TODO:Complete JS doc
    */
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.routeExportData.set('');
    $('#userNameClassd').val('').trigger('change');
    $('#startDate1').val('');
    $('#endDate1').val('');
  },

  /**
     * TODO: Complete JS doc
     */
  'click .close': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set(false);
    $('.loadersSpin').css('display', 'none');
  },
  /**
     * TODO: Complete JS doc
     */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set(false);
    $('.loadersSpin').css('display', 'none');
  },
  'change .endDate1,#userNameClassd,.startDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let userNameClassd = $("#userNameClassd").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDates);
    template.subdExport.set(userNameClassd);
    let vertical = Session.get("loginUserVerticals");
    if (userNameClassd != null) {
      Meteor.call('user.userListConst', vertical, userNameClassd, (err, res) => {
        if (!err) {
          if (res.length === 0) {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
          } else {
            template.plistArray.set(res);
          }
        }

      });
    }

  },
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportValue = template.plistArray.get();
    if (exportValue.length == 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#exportButtons").prop('disabled', true);
      Meteor.setTimeout(() => {
        let uri = 'data:application/vnd.ms-excel;base64,',
          template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
          base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
          },
          format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
              return c[p];
            });
          }
        let toExcel = document.getElementById("exportTodayOrder").innerHTML;
        let ctx = {
          worksheet: name || 'Excel',
          table: toExcel
        };

        function urltoFile(url, filename, mimeType) {
          return (fetch(url)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
          );
        };

        //Usage example:
        urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
          .then(function (file) {

            saveAs(file, "Outlet Status Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  }
});
