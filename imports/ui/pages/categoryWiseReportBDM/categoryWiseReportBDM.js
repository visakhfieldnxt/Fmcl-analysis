/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { Category } from "../../../api/category/category";

Template.categoryWiseReportBDM.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.modalLoader = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.verticalArray1 = new ReactiveVar();
  this.listArray1 = new ReactiveVar();
  this.regionArray = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.categoryList = new ReactiveVar();
  this.category = new ReactiveVar();
  this.detailsExport = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.categoryExport = new ReactiveVar();
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  this.pagination = new Meteor.Pagination(Category, {
    filters: {
      active: 'Y'
    },
    perPage: 20
  });
});
let loginUserVerticals = Session.get("loginUserVerticals");

Template.categoryWiseReportBDM.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  let date = new Date();
  this.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')))
  this.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')))
  Meteor.call('category.userWise', (err, res) => {
    if (!err)
      this.categoryList.set(res);
  });
  this.category.set('');
  $(".categoryfilter").select2({
    placeholder: "Select Categoty",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryfilter").parent(),
  });
  $(".categoryfilter1").select2({
    placeholder: "Select Categoty",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryfilter1").parent(),
  });
});

Template.categoryWiseReportBDM.helpers({

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
  catList: () => {
    return Template.instance().categoryList.get();
  },
  dataList: () => {
    return Template.instance().detailsExport.get();
  },
  formateAmountFix: (docTotal) => {
    if (docTotal == '') {
      return '0.00';
    } else
      return Number(docTotal).toFixed(2);
  }, dates: (date) => {
    if (date != '')
      return moment(date).format('DD-MM-YYYY');

  },
  roundIt: (value) => {
    return value.toFixed(2);
  },
  listData: function () {
    let exportValue = Template.instance().pagination.getPage();
    if (exportValue.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  salesVolume: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCategoryVolumeBDM', vertical, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.roundCtn + ' CTN & ' + result.findPcs + ' PCS');
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVol_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVol_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCategoryValueBDM', vertical, id, fromDate, toDate, (error, result) => { // totalSalesCategoryWise
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVal_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesVolumeExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCategoryVolumeBDM', vertical, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.roundCtn + ' CTN & ' + result.findPcs + ' PCS');
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolExport_' + id).html(result);
    }).catch((error) => {
      $('.saleVolExport_' + id).html('');
    });
  },
  salesValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCategoryValueBDM', vertical, id, fromDate, toDate, (error, result) => { // totalSalesCategoryWise
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValExport_' + id).html(result);
    }).catch((error) => {
      $('.saleValExport_' + id).html('');
    });
  },
  totalVolume: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let category = Template.instance().category.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCatVlmTotalBDM',vertical, fromDate, toDate, category, (error, result) => { // totalSalesCategoryWise
        if (!error) {
          resolve(result.roundCtn + ' CTN & ' + result.findPcs + ' PCS');
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolTotal_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVolTotal_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  gtotalValue: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let category = Template.instance().category.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCatVleTotalBDM',vertical, fromDate, toDate, category, (error, result) => { // totalSalesCategoryWise
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValTotal_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleValTotal_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  totalVolumeExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let category = Template.instance().categoryExport.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCatVlmTotalBDM',vertical, fromDate, toDate, category, (error, result) => { // totalSalesCategoryWise
        if (!error) {
          resolve(result.roundCtn + ' CTN & ' + result.findPcs + ' PCS');
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolTotalExport_').html(result);
    }).catch((error) => {
      $('.saleVolTotalExport_').html('');
    });
  },
  gtotalValueExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let category = Template.instance().categoryExport.get();
    let vertical = Session.get("loginUserVerticals");
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesCatVleTotalBDM',vertical, fromDate, toDate, category, (error, result) => { // totalSalesCategoryWise
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValTotalExport_').html(result);
    }).catch((error) => {
      $('.saleValTotalExport_').html('');
    });
  },
  fromDate1: (id) => {
    let date = new Date();
    let fromDate = Template.instance().fromDate.get();
    let ddate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'))
    if (moment(fromDate).format('DD-MM-YYYY') != 'Invalid date') {
      return (moment(fromDate).format('DD-MM-YYYY'));
    } else {
      Template.instance().fromDate.set(ddate);
      return moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('DD-MM-YYYY')
    }
  },
  todate1: (id) => {
    let date = new Date();
    let toDate = Template.instance().toDate.get();
    let ddate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'))
    // if(moment(toDate).format('DD-MM-YYYY')!='Invalid date'){
    //   let toD = moment(toDate).format('DD-MM-YYYY');
    //   return (toD.setDate(toD.getDate()));
    // }else{
    // Template.instance().toDate.set(ddate);
    return moment(toDate).format('DD-MM-YYYY');
    // }   
  },
  fromDate1Export: (id) => {
    let date = new Date();
    let fromDate = Template.instance().fromDateExport.get();
    let ddate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'))
    if (moment(fromDate).format('DD-MM-YYYY') != 'Invalid date') {
      return (moment(fromDate).format('DD-MM-YYYY'));
    } else {
      Template.instance().fromDateExport.set(ddate);
      return moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('DD-MM-YYYY')
    }
  },
  todate1Export: (id) => {
    let date = new Date();
    let toDate = Template.instance().toDateExport.get();
    let ddate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'))
    if (moment(toDate).format('DD-MM-YYYY') != 'Invalid date') {
      return (moment(toDate).format('DD-MM-YYYY'));
    } else {
      Template.instance().toDateExport.set(ddate);
      return moment(new Date()).format('DD-MM-YYYY')
    }
  }
});


Template.categoryWiseReportBDM.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },

  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let category = event.target.categoryfilter.value;
    template.toDate.set(toDate);
    template.fromDate.set(fromDate);
    template.category.set(category);
    if (category && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          _id: category, active: 'Y'
        });
      }
      else {
        // toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          _id: category, active: 'Y'
        });
      }
    } else {
      toastr["error"]('Please fill all fields');
    }


  },
  'click .reset': (event, template) => {
    template.category.set(null);
    let date = new Date();
    template.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
    template.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
    $("#categoryfilter").val('').trigger('change');
    Template.instance().pagination.settings.set('filters', {
      active: 'Y'
    });
    $('form :input').val("");
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.detailsExport.set('');
    $('#categoryfilter1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let category = $("#categoryfilter1").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDates);
    template.categoryExport.set(category);
    template.detailsExport.set('');
    template.modalLoader.set(true);
    Meteor.call('category.listdata', category, (err, res) => {
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
          template.detailsExport.set(res);
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
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportValue = template.detailsExport.get();
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

            saveAs(file, "Category wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   */
  'change .categoryfilter1': (event, template) => {
    $(".startDate1").val('');
    $(".endDate1").val('');

  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});