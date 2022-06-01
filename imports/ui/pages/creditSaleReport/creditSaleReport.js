/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { CreditSale } from "../../../api/creditSale/creditSale";

Template.creditSaleReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.creditSaleArray = new ReactiveVar();
  this.sdUserArray = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.outletArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.listCreditsale = new ReactiveVar();
  this.userIdData = new ReactiveVar();
  this.sdUserIdData = new ReactiveVar();
  this.outletData = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.userIdDataExport = new ReactiveVar();
  this.sdUserIdDataExport = new ReactiveVar();
  this.outletDataExport = new ReactiveVar();
  this.verticalAry = new ReactiveVar();
  this.verticalAryExport = new ReactiveVar();

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  let date = new Date();
  let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  toiDate.setDate(toiDate.getDate() + 1);
  this.pagination = new Meteor.Pagination(CreditSale, {
    filters: {
      salesType: "Credit",
      subDistributor: Meteor.userId(),
      createdAt: { $gte: fromiDate, $lte: toiDate }
    },
    sort: {
      createdAt: -1
    },
    fields: {
      sdUser: 1,
      vertical: 1,
      outlet: 1,
      docDate: 1,
      docTotal: 1,
      taxAmount: 1,
      createdAt: 1
    },
    perPage: 20
  });
});


Template.creditSaleReport.onRendered(function () {
  let date = new Date();
  let from = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  let to = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  this.fromDate.set(from);
  this.toDate.set(to);
  this.fromDateExport.set('');
  this.toDateExport.set('');
  this.verticalAry.set('');
  let vertical = Session.get('loginUserVerticals');
  $('#bodySpinLoaders').css('display', 'block');
  $('.sduserfilter').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true
  });

  $("#my-datepicker").datepicker({
    format: "mm-yyyy",
    startView: "months",
    minViewMode: "months"
  });

  $('.verticalfilter').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.outletfilter').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true
  });


  $('.sduserfilter1').select2({
    placeholder: "Select Sd User Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.verticalfilter1').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.outletfilter1').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true
  });

  Meteor.call('user.vansaleGetAttendance', Meteor.userId(), (err, res) => {
    if (!err)
      this.sdUserArray.set(res);
  });

  Meteor.call('verticals.userWiseList', vertical, (err, res) => {
    if (!err)
      this.verticalArray.set(res);
  });
  // Meteor.call('outlet.sdBase', Meteor.userId(), (err, res) => {
  //   if (!err)
  //     this.outletArray.set(res);
  // });
});

Template.creditSaleReport.helpers({

  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
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

  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
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
  sdUser1: function () {
    return Template.instance().sdUserArray.get();

  }, vertical1: function () {
    return Template.instance().verticalArray.get();

  }, outlet1: function () {
    return Template.instance().outletArray.get();
  },

  verticalHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.id", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let verticalname = result.verticalName;
      $('.verticalVal_' + id).html(verticalname);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.verticalVal_' + id).html('');
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
  }, getUserName: (user) => {
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
  }, getVerticalName: (vertical) => {
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
  /**
      * TODO:Complete JS doc
      * @param docDate
      */
  date1: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
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
      // $('.loadersSpinModal').css('display', 'none');
    }
    ).catch((error) => {
      $('.productVal_' + id).html('');
      // $('.loadersSpinModal').css('display', 'none');
    });
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
      $('.loadersSpinModal').css('display', 'none');

    }
    ).catch((error) => {
      $('.unitVal_' + id).html('');
      $('.loadersSpinModal').css('display', 'none');
    });
  },
  /**
 * TODO: Complete JS doc
 * @returns {*}
 */
  creditSale: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  formateAmountFix: (docTotal) => {
    if (docTotal == '') {
      return '0.00';
    } else
      return Number(docTotal).toFixed(2);
  },
  cashExpo: function () {
    return Template.instance().listCreditsale.get();
  },
  docTotalSum: () => {
    let sdUserIdData = Template.instance().sdUserIdData.get();
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalAry.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.docTotalCreditSumNew', Meteor.userId(), sdUserIdData, fromDate, toDate, vertical, (error, result) => {
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
  taxAmountSum: () => {
    let sdUserIdData = Template.instance().sdUserIdData.get();
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalAry.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.taxAmountCreditSumNew', Meteor.userId(), sdUserIdData, fromDate, toDate, vertical, (error, result) => {
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

  },
  docTotalSumExport: () => {
    let sdUserIdData = Template.instance().sdUserIdDataExport.get();
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalAryExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.docTotalCreditSumNew', Meteor.userId(), sdUserIdData, fromDate, toDate, vertical, (error, result) => {
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
  taxAmountSumExport: () => {
    let sdUserIdData = Template.instance().sdUserIdDataExport.get();
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalAryExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.taxAmountCreditSumNew', Meteor.userId(), sdUserIdData, fromDate, toDate, vertical, (error, result) => {
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

  }
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.creditSaleReport.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },

  //   'submit .order-filter': (event,template) => {
  //    event.preventDefault();
  //    let employee = event.target.sduserfilter.value;
  //    let vertical = event.target.verticalfilter.value;
  //    let outlet = event.target.outletfilter.value;
  //    let first = $("#fromDate").val();
  //    let second = $("#toDate").val();
  //    if (first !='' && second !='') {      
  //    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD 00:00:00.0');
  //    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD 00:00:00.0');
  //    let fromDate = new Date(dateOne);
  //    let toDate = new Date(dateTwo);

  //    template.userIdData.set(employee);
  //    template.outletData.set(outlet);
  //    template.sdUserIdData.set(Meteor.userId());

  //    if (employee != '' && vertical=='' && outlet=='') {
  //      Template.instance().pagination.settings.set('filters', {
  //        subDistributor: Meteor.userId(),salesType:"Credit",createdBy:employee,createdAt:{$gte:fromDate,$lte:toDate}
  //      },{fields:{sdUser:1, vertical:1,walkInCustomer:1,outlet:1,docDate:1,docTotal:1,taxAmount:1
  //       }});
  //    }else if(employee != '' && vertical!='' && outlet==''){
  //      Template.instance().pagination.settings.set('filters', {
  //        subDistributor: Meteor.userId(),salesType:"Credit",createdBy:employee,vertical:vertical,createdAt:{$gte:fromDate,$lte:toDate}
  //      },{fields:{sdUser:1, vertical:1,walkInCustomer:1,outlet:1,docDate:1,docTotal:1,taxAmount:1
  //       }});
  //    }else if(employee != '' && vertical!='' && outlet!=''){
  //      Template.instance().pagination.settings.set('filters', {
  //        subDistributor: Meteor.userId(),salesType:"Credit",createdBy:employee,vertical:vertical,outlet:outlet,createdAt:{$gte:fromDate,$lte:toDate}
  //      },{fields:{sdUser:1, vertical:1,walkInCustomer:1,outlet:1,docDate:1,docTotal:1,taxAmount:1
  //       }});
  //    }else if(employee != '' && vertical=='' && outlet!=''){
  //      Template.instance().pagination.settings.set('filters', {
  //        subDistributor: Meteor.userId(),salesType:"Credit",createdBy:employee,outlet:outlet,createdAt:{$gte:fromDate,$lte:toDate}
  //      },{fields:{sdUser:1, vertical:1,walkInCustomer:1,outlet:1,docDate:1,docTotal:1,taxAmount:1
  //       }});
  //    }if(employee == '' && vertical=='' && outlet==''){
  //      Template.instance().pagination.settings.set('filters', {
  //        subDistributor: Meteor.userId(),salesType:"Credit",createdAt:{$gte:fromDate,$lte:toDate}
  //      },{fields:{sdUser:1, vertical:1,walkInCustomer:1,outlet:1,docDate:1,docTotal:1,taxAmount:1
  //       }});
  //    }
  //  }else{
  //    toastr['error']('Please Select the Dates')
  //  }   



  // //       

  //  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (event, template) => {
    let date = new Date();
    let fromDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
    let toDate = new Date(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
    toDate.setDate(toDate.getDate() + 1);
    template.fromDate.set(fromDate);
    template.toDate.set(toDate);
    template.outletData.set(null);
    template.sdUserIdData.set(null);
    template.verticalAry.set(null);
    Template.instance().pagination.settings.set('filters', {
      salesType: "Credit",
      subDistributor: Meteor.userId(),
      createdAt: { $gte: fromDate, $lt: toDate }
    });
    $('form :input').val("");
    $("#sduserfilter").val('').trigger('change');
    $("#verticalfilter").val('').trigger('change');
    $("#outletfilter").val('').trigger('change');
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
  'submit .exportToday': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().todayExport.get();

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
        let toExcel = document.getElementById("exportTodayOrder1").innerHTML;
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

            saveAs(file, "Credit Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });

        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.itemsDetailsList.set('');
    template.modalLoader.set(true);
    let header = $('#CreditSaleH');
    let CreditSalesdUser = $('#CreditSalesdUser');
    let CreditSalevertical = $('#CreditSalevertical');
    let CreditSaleoutlet = $('#CreditSaleoutlet');
    let CreditSaledocDate = $('#CreditSaledocDate');
    let CreditSaleremarks = $('#CreditSaleremarks');
    let CreditSaledocTotal = $('#CreditSaledocTotal');
    let CreditSalediscountAmt = $('#CreditSalediscountAmt');
    let CreditSaletaxAmount = $('#CreditSaletaxAmount');
    let CreditSalelatitude = $('#CreditSalelatitude');
    let CreditSalelongitude = $('#CreditSalelongitude');
    let CreditSalerouteId = $('#CreditSalerouteId');
    let CreditSaleafterDiscount = $('#CreditSaleafterDiscount');
    let CreditSalebeforeDiscount = $('#CreditSalebeforeDiscount');
    let CreditSaledocNum = $('#CreditSaledocNum');
    let CreditSalecreatedBy = $('#CreditSalecreatedBy');
    let CreditSalecreatedAt = $('#CreditSalecreatedAt');
    let detailDeviceInfo = $('#detailDeviceInfo');
    $('.loadersSpinModal').css('display', 'block');
    $('#CreditSaleDetailPage').modal();
    Meteor.call('creditSale.id', id, (CreditSaleError, CreditSaleResult) => {
      if (!CreditSaleError) {
        let CreditSaleList = CreditSaleResult.creditSaleData;
        if (CreditSaleList.itemArray !== undefined && CreditSaleList.itemArray.length > 0) {
          template.itemsDetailsList.set(CreditSaleList.itemArray);
        }
        else {
          $('.loadersSpinModal').css('display', 'none');
        }
        $(header).html('Details of Cash Sale');
        $(CreditSalesdUser).html(CreditSaleResult.sdName);
        $(CreditSalevertical).html(CreditSaleResult.verticalName);
        $(CreditSaleoutlet).html(CreditSaleResult.outletName);
        $(CreditSaledocDate).html(CreditSaleList.docDate);
        $(CreditSaleremarks).html(CreditSaleList.remarks);
        $(CreditSaledocTotal).html(CreditSaleList.docTotal);
        $(CreditSalediscountAmt).html(CreditSaleList.discountAmt);
        $(CreditSaletaxAmount).html(CreditSaleList.taxAmount);
        $(CreditSalelatitude).html(CreditSaleList.latitude);
        $(CreditSalelongitude).html(CreditSaleList.longitude);
        $(CreditSalerouteId).html(CreditSaleResult.routeIdName);
        $(CreditSaleafterDiscount).html(CreditSaleList.afterDiscount);
        $(CreditSalebeforeDiscount).html(CreditSaleList.beforeDiscount);
        $(CreditSaledocNum).html(CreditSaleList.docNum);
        if (CreditSaleList.deviceInfo !== undefined) {
          $(detailDeviceInfo).html(CreditSaleList.deviceInfo);
        }
        else {
          $(detailDeviceInfo).html('')
        }
        $(CreditSalecreatedBy).html(CreditSaleResult.createdName);
        $(CreditSalecreatedAt).html(moment(CreditSaleList.createdAt).format('DD-MM-YYYY'));
        template.modalLoader.set(false);
      }

    });

  },
  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let createdBy1 = event.target.sduserfilter.value;
    let vertical = event.target.verticalfilter.value;
    let outlet = '';
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    template.userIdData.set(Meteor.userId());
    template.outletData.set(outlet);
    template.sdUserIdData.set(createdBy1);
    template.fromDate.set(fromDate);
    template.toDate.set(toDate);
    template.verticalAry.set(vertical);

    if (outlet && createdBy1 === '' && vertical === '' && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        outlet: outlet,
      });
    }
    else if (outlet === '' && createdBy1 && vertical === '' && isNaN(fromDate) && isNaN(toDate)) {

      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
      });
    }
    else if (outlet === '' && createdBy1 === '' && vertical && isNaN(fromDate) && isNaN(toDate)) {
      // console.log('3');

      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        vertical: vertical,
      });
    }
    else if (outlet === '' && createdBy1 === '' && vertical === '' && fromDate && isNaN(toDate)) {

      fromDate.setDate(fromDate.getDate() + 1);

      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        createdAt: {
          $lte: fromDate
        }
      });
    }
    else if (outlet === '' && createdBy1 === '' && vertical === '' && isNaN(fromDate) && toDate) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        createdAt: {
          $lte: toDate
        }
      });
    }
    else if (outlet && createdBy1 === '' && vertical && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        vertical: vertical,
        outlet: outlet,

      });
    }
    else if (outlet === '' && createdBy1 === '' && vertical && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        vertical: vertical,
        createdAt: {
          $lte: fromDate
        }
      });
    }
    else if (outlet && createdBy1 && vertical === '' && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        outlet: outlet,

      });
    }
    else if (outlet && createdBy1 === '' && vertical === '' && isNaN(fromDate) && toDate) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        outlet: outlet,
        createdAt: {
          $lte: toDate
        }
      });
    }
    else if (outlet === '' && createdBy1 && vertical && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        vertical: vertical,
      });
    }
    else if (outlet === '' && createdBy1 === '' && vertical === '' && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet && createdBy1 && vertical && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        vertical: vertical,
        outlet: outlet,
      });
    }
    else if (outlet && createdBy1 && vertical === '' && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        outlet: outlet,
        createdAt: {
          $lte: fromDate
        }
      });
    }
    else if (outlet && createdBy1 && vertical === '' && isNaN(fromDate) && toDate) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        outlet: outlet,
        createdAt: {
          $lte: toDate
        }
      });
    }
    else if (outlet && createdBy1 === '' && vertical && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        vertical: vertical,
        outlet: outlet,
        createdAt: {
          $lte: fromDate
        }
      });
    }
    else if (outlet && createdBy1 === '' && vertical && isNaN(fromDate) && toDate) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),

        vertical: vertical,
        outlet: outlet,
        createdAt: {
          $lte: toDate
        }
      });
    }
    else if (outlet && createdBy1 === '' && vertical === '' && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        outlet: outlet,
        createdAt: {
          $lte: fromDate
        }
      });
    } else if (outlet && createdBy1 === '' && vertical === '' && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet === '' && createdBy1 && vertical && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        vertical: vertical,
        createdAt: {
          $lte: fromDate
        }
      });
    }
    else if (outlet === '' && createdBy1 && vertical && isNaN(fromDate) && toDate) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        vertical: vertical,
        createdAt: {
          $lte: toDate
        }
      });
    }
    else if (outlet === '' && createdBy1 && vertical === '' && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet === '' && createdBy1 === '' && vertical && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          vertical: vertical,
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          vertical: vertical,
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet === '' && createdBy1 && vertical && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          vertical: vertical,
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {

        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          vertical: vertical,
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet && createdBy1 === '' && vertical && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          vertical: vertical,
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          vertical: vertical,
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet && createdBy1 && vertical === '' && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet && createdBy1 && vertical && isNaN(fromDate) && toDate) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        vertical: vertical,
        outlet: outlet,
        createdAt: {
          $lte: toDate
        }
      });
    }
    else if (outlet && createdBy1 && vertical && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
        sdUser: createdBy1,// createdBy: createdBy1,
        vertical: vertical,
        outlet: outlet,
        createdAt: {
          $lte: fromDate
        }
      });
    }
    else if (outlet && createdBy1 && vertical && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          vertical: vertical,
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          salesType: "Credit",
          subDistributor: Meteor.userId(),
          sdUser: createdBy1,// createdBy: createdBy1,
          vertical: vertical,
          outlet: outlet,
          createdAt: {
            $gte: fromDate, $lte: toDate
          }
        });
      }
    }
    else if (outlet === '' && createdBy1 === '' && vertical === '' && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
      });
    } else {
      Template.instance().pagination.settings.set('filters', {
        salesType: "Credit",
        subDistributor: Meteor.userId(),
      });
    }
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.listCreditsale.set('');
    $('#sduserfilter1').val('').trigger('change');
    $('#verticalfilter1').val('').trigger('change');
    $('#outletfilter1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change .startDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let sd = '';
    let vertical = '';
    $('#verticalfilter1').find(':selected').each(function () {
      vertical = $(this).val();
    });
    $('#sduserfilter1').find(':selected').each(function () {
      sd = $(this).val();
    });
    let fromDate = new Date(moment(sdate, 'MM-YYYY').format("YYYY-MM-01 00:00:00.0"));
    var toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
    toDate.setDate(toDate.getDate() + 1);
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDate);
    template.sdUserIdDataExport.set(sd);
    template.verticalAryExport.set(vertical);
    template.listCreditsale.set('');
    if (sdate) {
      template.modalLoader.set(true);
      Meteor.call('creditSales.creditSaleListNew', sd, vertical, fromDate, toDate, Meteor.userId(), (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          if (res.length === 0) {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
          }
          else {
            console.log("res", res);
            template.listCreditsale.set(res);
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
    }
  },
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportValue = template.listCreditsale.get();
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

            saveAs(file, "Credit Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
    template.sdUserIdData.set(null);
    template.outletData.set(null);
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 */
  'change sduserfilter1': (event, template) => {
    $(".startDate1").val('');
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 */
  'change verticalfilter1': (event, template) => {
    $(".startDate1").val('');
    $('#verticalfilter1').val('').trigger('change');
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});