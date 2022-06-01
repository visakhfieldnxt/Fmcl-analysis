/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { Outlets } from "../../../api/outlets/outlets";


Template.outletDetailsReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.todayExport = new ReactiveVar();
  this.routeArray = new ReactiveVar();
  this.outletList = new ReactiveVar();
  this.userNameArray1 = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.userNameArray1 = new ReactiveVar();
  this.fromDateView = new ReactiveVar();
  this.toDateView = new ReactiveVar();
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  let subDs = Session.get("loginUserSDs");
  let date = new Date();
  let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  this.fromDateView.set(moment(fromiDate).format("DD-MM-YYYY"));
  this.toDateView.set(moment(toiDate).format("DD-MM-YYYY"));
  this.pagination = new Meteor.Pagination(Outlets, {
    filters: {
      subDistributor: { $in: subDs },
      createdAt: { $gte: fromiDate, $lt: toiDate }
    },
    sort: {
      createdAt: -1
    },
    fields: {
      name: 1,
      createdAt: 1,
      contactPerson: 1,
      contactNo: 1,
      routeId: 1,
      address: 1,
      routeId: 1,
      outletType: 1,
      outletClass: 1,
      // verticals
      subDistributor: 1,
      createdBy: 1
    },
    perPage: 20
  });
});

Template.outletDetailsReport.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('user.userNameGet1', loginUserVerticals, (err, res) => {
    if (!err)
      this.userNameArray1.set(res);
  });
  Meteor.call('routeGroup.list', (err, res) => {
    if (!err)
      this.routeArray.set(res);
  });

  $('.selectrouteName1').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.selectSDName').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.selectSDName1').select2({
    placeholder: "Select SD Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.userNameClass').select2({
    placeholder: "Select SD Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.outletClassVal').select2({
    placeholder: "Select Class",
    tokenSeparators: [','],
    allowClear: true
  });

  let verticals = Session.get("loginUserVerticals");
  // console.log("verticals", verticals);
  // Meteor.call('user.userLis', verticals, (err, res) => {
  //   if (!err)
  //     this.userNameArray1.set(res);
  // });
});

Template.outletDetailsReport.helpers({
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
  },
  /**
 * get from date
 */
  getFromDate: () => {
    // return Template.instance().fromDateFilter.get();
    return Template.instance().fromDateView.get();

  },
  /**
* get to date
*/
  getToDate: () => {
    return Template.instance().toDateView.get();
    // return Template.instance().toDateFilter.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  outletList: function () {
    let exportValue = Template.instance().pagination.getPage();
    if (exportValue.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    else {
      let uniqueSlNo = 0;
      for (let i = 0; i < exportValue.length; i++) {
        uniqueSlNo = parseInt(uniqueSlNo + 1);
        for (let j = 0; j < exportValue[i].length; j++) {
          exportValue[i].itemLines[j].name = exportValue[i].name,
            exportValue[i].itemLines[j].createdAt = exportValue[i].createdAt,
            exportValue[i].itemLines[j].contactPerson = exportValue[i].contactPerson,
            exportValue[i].itemLines[j].contactNo = exportValue[i].contactNo,
            exportValue[i].itemLines[j].routeId = exportValue[i].routeId,
            exportValue[i].itemLines[j].address = exportValue[i].address
          exportValue[i].itemLines[j].outletType = exportValue[i].outletType
          exportValue[i].itemLines[j].outletClass = exportValue[i].outletClass
          exportValue[i].itemLines[j].subDistributor = exportValue[i].subDistributor
          exportValue[i].itemLines[j].createdBy = exportValue[i].createdBy
        }
      }
      Template.instance().todayExport.set(exportValue);
    }
    return Template.instance().pagination.getPage();
  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
  }, exportOutlet: function () {
    return Template.instance().outletList.get();
  },
  /**
  * TODO: Complete JS doc
  * @returns {*}
  */
  orderByDateExport: function () {
    return Template.instance().stockInvoice.get();
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
  vertical1: function () {
    return Template.instance().verticalArray.get();

  },
  routeList: function () {
    return Template.instance().routeArray.get();
  },
  userList: function () {
    return Template.instance().userNameArray1.get();
  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  dateFormat: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  timeSeperate: (docDate) => {
    return moment(docDate).format('hh:mm:ss A');
  },


  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
  },
  statusValCheck: (status) => {
    if (status === 'Pending') {
      return true;
    }
    else {
      return false;
    }
  },

  /**
* TODO:Complete JS doc
* 
* @param docStatus
*/
  statusExcel: (docStatus) => {
    if (docStatus === 'approved') {
      return 'Approved';
    }
    else if (docStatus === 'rejected') {
      return 'Rejected';
    }
    else if (docStatus === 'onHold') {
      return 'On Hold';
    }
    else if (docStatus === 'Pending') {
      return 'Pending (Waiting For Accountant Approval)';
    }
    else {
      return '';
    }
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
  getUserName1: (user) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("role.roleName1", user, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.userIdVal1_' + user).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.userIdVal1_' + user).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  routeHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('routeGroup.id', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.routeVal_' + id).html(result.routeName);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
  },
  verticalHelper: (sd) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('vertical.listofVertical', sd, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalVal_' + sd).html(result);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.verticalVal_' + sd).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
  },

  deliveryDetails: () => {
    return Template.instance().deliveryDetails.get();
  },
  sdList: () => {
    return Template.instance().userNameArray1.get();

  },

});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.outletDetailsReport.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let routeId = event.target.selectSDName.value;
    let userName = event.target.userNameClass.value;
    let ClassVal = event.target.outletClassVal.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    template.fromDateView.set(first);
    template.toDateView.set(second);
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD  00:00:00.0');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD  00:00:00.0');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let subDs = Session.get("loginUserSDs");
    toDate.setDate(toDate.getDate() + 1);
    if (routeId && userName === '' && ClassVal === '') {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        },
        routeId: routeId,
        subDistributor: { $in: subDs },
      });
    } else if (routeId === '' && userName && ClassVal === '') {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        },
        subDistributor: userName,
      });
    } else if (routeId === '' && userName === '' && ClassVal) {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        },
        outletClass: ClassVal, subDistributor: { $in: subDs },
      });
    } else if (routeId && userName && ClassVal === '') {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        },
        routeId: routeId,
        subDistributor: userName,
      });
    } else if (routeId && userName === '' && ClassVal) {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        },
        routeId: routeId, subDistributor: { $in: subDs },
        outletClass: ClassVal,
      });
    } else if (routeId === '' && userName && ClassVal) {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        },
        subDistributor: userName,
        outletClass: ClassVal,
      });
    } else if (routeId && userName && ClassVal) {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        },
        routeId: routeId,
        subDistributor: userName,
        outletClass: ClassVal,
      });
    } else if (routeId === '' && userName === '' && ClassVal === '') {
      Template.instance().pagination.settings.set('filters', {
        createdAt: {
          $gte: fromDate, $lt: toDate
        }, subDistributor: { $in: subDs },
      });
    } else {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: { $in: subDs }
      });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (event, template) => {
    $("#userNameClass").val('').trigger('change');
    $("#selectSDName").val('').trigger('change');
    $("#outletClassVal").val('').trigger('change');
    let date = new Date();
    let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
    let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
    let subDs = Session.get("loginUserSDs");
    template.fromDateView.set(moment(fromiDate).format("DD-MM-YYYY"));
    template.toDateView.set(moment(toiDate).format("DD-MM-YYYY"));
    Template.instance().pagination.settings.set('filters', {
      subDistributor: { $in: subDs },
      createdAt: { $gte: fromiDate, $lt: toiDate }
    });
    $('form :input').val("");
  },
  /**
    * TODO:Complete JS doc
    * @param event
    */
  'click .view': (event, template) => {
    event.preventDefault();
    template.itemsDetailsList.set('');
    template.modalLoader.set(true);
    template.deliveryDetails.set('');
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let sdUser = $('#ordersdUser');
    let subDistributor = $('#ordersubDistributor');
    let vertical = $('#ordervertical');
    let outlet = $('#orderoutletoutlet');
    let routeId = $('#orderrouteIdrouteId');
    let docDate = $('#orderdocDatedocDate');
    let docTotal = $('#orderdocTotal');
    let discountAmt = $('#orderdiscountAmt');
    let taxAmount = $('#ordertaxAmount');
    // itemArray  = $('#orderitemArray')
    let totalQty = $('#ordertotalQty');
    // totalItems
    let docNum = $('#orderdocNum');
    let status = $('#orderstatus');
    let createdBy = $('#ordercreatedBy');
    let discountAmtData = $('#discountAmtData');

    $('#orderDetailPage').modal();
    Meteor.call('order.orderData', id, (orderError, orderResult) => {
      if (!orderError) {
        template.modalLoader.set(false);
        let orderResult1 = orderResult.orderList;
        if (orderResult1.itemArray !== undefined && orderResult1.itemArray.length > 0) {
          template.itemsDetailsList.set(orderResult1.itemArray);
        }
        if (orderResult1.status === 'Delivered') {
          template.deliveryDetails.set(orderResult1)
        }
        $(header).html('Details of Order');
        $(sdUser).html(orderResult.sdName);
        $(subDistributor).html(orderResult.sdName1);
        $(vertical).html(orderResult.verticalName);
        $(outlet).html(orderResult.outletName);
        $(routeId).html(orderResult.routeName);
        $(docDate).html(orderResult1.docDate);
        $(docTotal).html(orderResult1.docTotal);
        $(discountAmt).html(orderResult1.discountAmt);
        $(taxAmount).html(orderResult1.taxAmount);
        $(totalQty).html(orderResult1.totalQty);
        $(docNum).html(orderResult1.docNum);
        $(status).html(orderResult1.status);
        $(createdBy).html(orderResult.createdByName);
        $(discountAmtData).html(Number(orderResult1.discountAmt).toFixed(2));
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
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportData = Template.instance().outletList.get();
    if (exportData.length === 0) {
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

            saveAs(file, "Outlet Details Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
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
    let startDate = new Date($('.startDate').val());
    let endDate = new Date($('.endDate').val());
    endDate.setDate(endDate.getDate() + 1);
    $('.mainLoader').css('display', 'block');
    if (startDate.toString() !== 'Invalid Date') {
      Meteor.call('order.export', startDate, endDate, (err, res) => {
        if (!err) {
          template.stockInvoice.set(res);
        }
      });
    }
    else {
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

  'click .exportClose': () => {
    $('form :input').val("");
    $('#startDateSpan').html(''); 
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');

  },
  /**
    * TODO:Complete JS doc
    */
  'click .export': () => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    $('#selectSDName1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },

  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    template.outletList.set('');
    let sd = $("#selectSDName1").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    if (sd && fromDate && toDates) {
      template.modalLoader.set(true);
      Meteor.call('outlet.lisWithRoute', sd, fromDate, toDates, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          if (res.length === 0) {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
          } else {
            $('.exportToday').attr("disabled", false);
            setTimeout(function () {
              $("#emptyDataSpan").html('<style> #emptyDataSpans { color:#2ECC71 }</style><span id ="emptyDataSpans">Records are ready for export.</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
            template.outletList.set(res);
          }
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
  },
  /**
   * TODO:Complete JS doc
   * @param event 
   */
  'submit .exportByDate': (event) => {
    event.preventDefault();

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
    let toExcel = document.getElementById("viewNew").innerHTML;
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

        saveAs(file, "Order Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
      });

    $('#deliveryReportExportPage').modal('hide');
    $('form :input').val("");
    $('#startDateSpan').html('');
    Template.instance().stockInvoice.set('');
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');
  },

  /**
     * TODO: Complete JS doc
     */
  'click .close': (event, template) => {
    $('form :input').val("");

    template.itemsDetailsList.set('');

    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
  /**
     * TODO: Complete JS doc
     */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },

  'change .selectSDName1': (event, template) => {
    event.preventDefault();
    $('#toDate1').val('');
    $('#fromDate1').val('');
  },

  'change #fromDate1': (event, template) => {
    event.preventDefault();
    $('#toDate1').val('');
  },
});
