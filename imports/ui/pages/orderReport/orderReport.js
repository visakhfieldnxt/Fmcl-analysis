/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { Order } from "../../../api/order/order";


Template.orderReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.customerNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.stockInvoice = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.outletArray = new ReactiveVar();
  this.accValue = new ReactiveVar();
  this.routeList = new ReactiveVar();
  this.userExpoList = new ReactiveVar();
  this.deliveryDetails = new ReactiveVar();
  this.userIdData = new ReactiveVar();
  this.routeData = new ReactiveVar();
  this.outletData = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.userIdDataExport = new ReactiveVar();
  this.routeDataExport = new ReactiveVar();
  this.outletDataExport = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.employelIstVar = new ReactiveVar();
  this.employeeData = new ReactiveVar();
  this.employeeDataExport = new ReactiveVar();
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  let date = new Date();
  let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  toiDate.setDate(toiDate.getDate() + 1);
  this.pagination = new Meteor.Pagination(Order, {
    filters: {
      subDistributor: Meteor.userId(),
      createdAt: { $gte: fromiDate, $lt: toiDate }
    },
    sort: {
      createdAt: -1
    },
    fields: {
      sdUser: 1,
      subDistributor: 1,
      vertical: 1,
      outlet: 1,
      routeId: 1,
      docDate: 1,
      docTotal: 1,
      // itemArray: 1,
      taxAmount: 1,
      status: 1,
      createdAt: 1
    },
    perPage: 20
  });

});

Template.orderReport.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  this.userIdData.set(Meteor.userId());
  this.userIdDataExport.set(Meteor.userId());
  $("#my-datepicker").datepicker({
    format: "mm-yyyy",
    startView: "months",
    minViewMode: "months"
  });
  Meteor.call('verticals.verticalList', (err, res) => {
    if (!err)
      this.verticalArray.set(res);
  });
  Meteor.call('outlet.sdBase', Meteor.userId(), (err, res) => {
    if (!err)
      this.outletArray.set(res);
  });
  Meteor.call('user.userSdList', Meteor.userId(), (err, res) => {
    if (!err)
      this.employelIstVar.set(res);
  });


  $('.selectEmployeeName').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true
  });

  $('.selectCustomerName').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true
  });
  Meteor.call('routeGroup.sdWiselist', Meteor.userId(), (err, res) => {
    if (!err) {
      this.routeList.set(res);
    };
  });
  $('.selectrouteName').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.selectCustomerName1').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.selectrouteName1').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [','],
    allowClear: true
  });
  let date = new Date();
  let fromDate1 = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  let toDate1 = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  this.fromDate.set(fromDate1);
  this.toDate.set(toDate1);

  this.fromDateExport.set('');
  this.toDateExport.set('');

});

Template.orderReport.helpers({
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
   * TODO: Complete JS doc
   * @returns {*}
   */
  orderes: function () {
    let exportValue = Template.instance().pagination.getPage();
    if (exportValue.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
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
  }, vertical1: function () {
    return Template.instance().verticalArray.get();

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
  // /**
  // * TODO:Complete JS doc
  // * 
  // * @param docStatus
  // */
  // status: (docStatus) => {
  //   if (docStatus === 'approved') {
  //     return 'Approved';
  //   }
  //   else if (docStatus === 'rejected') {
  //     return 'Rejected';
  //   }
  //   else if (docStatus === 'onHold') {
  //     return 'On Hold';
  //   }
  //   else if (docStatus === 'Pending') {
  //     return 'Pending';
  //   }
  //   else {
  //     return '';
  //   }
  // },
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
  },/**
  * get vertical name
  * @param {} vertical 
  */
  getVerticalName: (vertical) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.idName", vertical, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalIdVal_' + vertical).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalIdVal_' + vertical).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  outletHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("outlet.idName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletVal_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.outletVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
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
  getproductHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('product.id', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productVal_' + id).html(result.productName);
      $('.loadersSpinVals').css('display', 'none');
    }
    ).catch((error) => {
      $('.productVal_' + id).html('');
      $('.loadersSpinVals').css('display', 'none');
    });
  },
  getunitHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('unit.id', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.unitVal_' + id).html(result.unitName);
      $('.loadersSpinVals').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitVal_' + id).html('');
      $('.loadersSpinVals').css('display', 'none');
    });
  }, outlet1: function () {
    return Template.instance().outletArray.get();

  },
  routeLists: function () {
    return Template.instance().routeList.get();

  },
  formateAmountFix: (docTotal) => {
    return Number(docTotal).toFixed(2);
  },
  userExport: function () {
    return Template.instance().userExpoList.get();
  },
  /**
   * get delivery details
   */
  deliveryDetails: () => {
    return Template.instance().deliveryDetails.get();
  },
  docTotalSum: () => {
    let routeData = Template.instance().routeData.get();
    let outletData = Template.instance().outletData.get();
    let employeeData = Template.instance().employeeData.get();
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('order.docTotalSum', Meteor.userId(), routeData, outletData, fromDate, toDate, employeeData, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.docTotalSum').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.docTotalSum').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  docTotalSumExport: () => {
    let userIdData = Template.instance().userIdDataExport.get();
    let routeData = Template.instance().routeDataExport.get();
    let outletData = Template.instance().outletDataExport.get();
    let employeeData = Template.instance().employeeDataExport.get();
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('order.docTotalSum', userIdData, routeData, outletData, fromDate, toDate, employeeData, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.docTotalSumExport').html(result);
    }).catch((error) => {
      $('.docTotalSumExport').html('');
    });
  },
  taxAmountSum: () => {
    let userIdData = Template.instance().userIdData.get();
    let routeData = Template.instance().routeData.get();
    let outletData = Template.instance().outletData.get();
    let employeeData = Template.instance().employeeData.get();
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('order.taxAmountSum', userIdData, routeData, outletData, fromDate, toDate, employeeData, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.taxAmountSum').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.taxAmountSum').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
    promiseVal.then((result) => {
      $('.taxAmountSum').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.taxAmountSum').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });

  },
  taxAmountSumExport: () => {
    let userIdData = Template.instance().userIdDataExport.get();
    let routeData = Template.instance().routeDataExport.get();
    let outletData = Template.instance().outletDataExport.get();
    let employeeData = Template.instance().employeeDataExport.get();
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('order.taxAmountSum', userIdData, routeData, outletData, fromDate, toDate, employeeData, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.taxAmountSumExport').html(result);
    }).catch((error) => {
      $('.taxAmountSumExport').html('');
    });

  },
  employelIst: () => {
    return Template.instance().employelIstVar.get();
  }
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.orderReport.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let outletSerach = event.target.selectCustomerName.value;
    let routeSearch = event.target.selectrouteName.value;
    let employeeSearch = event.target.selectEmployeeName.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD  00:00:00.0');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD  00:00:00.0');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    if (first === '' && second === '') {
      toastr["error"]('Please fill Dates');
      return;
    }
    template.outletData.set('');
    template.routeData.set('');
    template.employeeData.set('');

    template.fromDate.set(fromDate);
    template.toDate.set(toDate);

    if (outletSerach && routeSearch === '' && employeeSearch === '' && fromDate && toDate) {
      template.outletData.set(outletSerach);
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        outlet: outletSerach,
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    } else if (outletSerach === '' && routeSearch && employeeSearch === '' && fromDate && toDate) {
      template.routeData.set(routeSearch);
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        routeId: routeSearch,
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    } else if (outletSerach === '' && routeSearch === '' && employeeSearch && fromDate && toDate) {
      template.employeeData.set(employeeSearch);
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        sdUser: employeeSearch,
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    } else if (outletSerach && routeSearch && employeeSearch === '' && fromDate && toDate) {
      template.routeData.set(routeSearch);
      template.outletData.set(outletSerach);
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        outlet: outletSerach,
        routeId: routeSearch,
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    } else if (outletSerach && routeSearch === '' && employeeSearch && fromDate && toDate) {
      template.employeeData.set(employeeSearch);
      template.outletData.set(outletSerach);
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        outlet: outletSerach,
        sdUser: employeeSearch,
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    } else if (outletSerach === '' && routeSearch && employeeSearch && fromDate && toDate) {
      template.employeeData.set(employeeSearch);
      template.routeData.set(routeSearch);
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        routeId: routeSearch,
        sdUser: employeeSearch,
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    } else if (outletSerach && routeSearch && employeeSearch && fromDate && toDate) {
      template.employeeData.set(employeeSearch);
      template.routeData.set(routeSearch);
      template.outletData.set(outletSerach);
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        outlet: outletSerach,
        routeId: routeSearch,
        sdUser: employeeSearch,
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    } else {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        createdAt: {
          $gte: fromDate, $lt: toDate
        }
      });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (event, template) => {
    $("#selectCustomerName").val('').trigger('change');
    $("#selectrouteName").val('').trigger('change');
    $("#selectEmployeeName").val('').trigger('change');
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    template.outletData.set('');
    template.routeData.set('');
    template.employeeData.set('');

    let date = new Date();
    let fDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
    let tDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
    template.fromDate.set(fDate);
    template.toDate.set(tDate);

    tDate.setDate(tDate.getDate() + 1);
    Template.instance().pagination.settings.set('filters', {
      subDistributor: Meteor.userId(),
      createdAt: { $gte: fDate, $lt: tDate }
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
    let orderDevice = $('#orderDevice');

    $('#orderDetailPage').modal();
    $('.loadersSpinVals').css('display', 'block');
    Meteor.call('order.orderData', id, (orderError, orderResult) => {
      if (!orderError) {
        // template.modalLoader.set(false);
        let orderResult1 = orderResult.orderList;

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
        if (orderResult1.deviceInfo !== undefined) {
          $(orderDevice).html(orderResult1.deviceInfo);
        }
        else {
          $(orderDevice).html('');
        }
        $(discountAmtData).html(Number(orderResult1.discountAmt).toFixed(2));
        if (orderResult1.itemArray !== undefined && orderResult1.itemArray.length > 0) {
          $('.loadersSpinVals').css('display', 'none');
          template.modalLoader.set(false);
          console.log('as');
          template.itemsDetailsList.set(orderResult1.itemArray);
        } else {
          console.log('hai');
          template.modalLoader.set(true);
        }
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
    $('#deliveryReportExportPage').modal('hide');
    let exportData = Template.instance().userExpoList.get();
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

            saveAs(file, "Order Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
    template.outletData.set('');
    template.routeData.set('');
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
    Template.instance().stockInvoice.set('');
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');

  },
  /**
    * TODO:Complete JS doc
    */
  'click .export': () => {
    $('.exportToday').attr("disabled", true);
    let header = $('#deliveryExportH');
    $('#deliveryReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    $('#selectCustomerName1').val('').trigger('change');
    $('#selectrouteName1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change .startDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let outlet = $("#selectCustomerName1").val();
    let route = ''
    $('#selectrouteName1').find(':selected').each(function () {
      route = $(this).val();
    });
    $('#selectCustomerName1').find(':selected').each(function () {
      outlet = $(this).val();
    });
    let fromDate = new Date(moment(sdate, 'MM-YYYY').format("YYYY-MM-01 00:00:00.0"));
    var toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
    template.routeDataExport.set(route);
    template.outletDataExport.set(outlet);
    template.employeeDataExport.set('');
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDate);
    template.outletData.set('');
    template.userExpoList.set('');
    template.modalLoader.set(true);
    Meteor.call('order.orderlistExpo', outlet, route, Meteor.userId(), fromDate, toDate, (err, res) => {
      if (!err) {
        template.modalLoader.set(false);
        if (res.length === 0) {
          $('.exportToday').attr("disabled", true);
          setTimeout(function () {
            $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');
          }, 3000);
        }
        else {
          template.userExpoList.set(res);
          $('.exportToday').attr("disabled", false);
          setTimeout(function () {
            $("#emptyDataSpan").html('<style> #emptyDataSpans { color:#2ECC71 }</style><span id ="emptyDataSpans">Records are ready for export.</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');
          }, 3000);
        }
      }
      else {
        template.modalLoader.set(false);
      }
    });
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
  /**
* 
* @param {*} event 
* @param {*} template 
*/
  'change .selectrouteName1': (event, template) => {
    $(".startDate1").val('');
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 */
  'change .selectCustomerName1': (event, template) => {
    $(".startDate1").val('');
    $('#selectrouteName1').val('').trigger('change');
  }
});
