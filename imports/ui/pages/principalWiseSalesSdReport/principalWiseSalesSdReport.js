/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { CreditSale } from "../../../api/creditSale/creditSale";
import { Principal } from "../../../api/principal/principal";

Template.principalWiseSalesSdReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.modalLoader = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.verticalArray1 = new ReactiveVar();
  this.listArray1 = new ReactiveVar();
  this.regionArray = new ReactiveVar();
  this.principalArray = new ReactiveVar();
  this.brandArray = new ReactiveVar();
  this.categoryArray = new ReactiveVar();
  this.principalNameArray = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.brandfilter = new ReactiveVar();
  this.categoryfilter = new ReactiveVar();
  this.brandArray1 = new ReactiveVar();
  this.categoryArray1 = new ReactiveVar();
  this.plistArray = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.brandfilterExport = new ReactiveVar();
  this.categoryfilterExport = new ReactiveVar();
  this.principalfilter = new ReactiveVar();
  this.principalfilterExport = new ReactiveVar();

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);

  this.pagination = new Meteor.Pagination(Principal, {
    fields: { principalName: 1 },
    perPage: 20
  });
});

Template.principalWiseSalesSdReport.onRendered(function () {
  this.brandfilter.set('');
  this.categoryfilter.set('');
  $('#bodySpinLoaders').css('display', 'block');
  Meteor.call('branch.branchList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.regionArray.set(res);
    }
  });
  Meteor.call('verticals.verticalList', (err, res) => {
    if (!err) {
      this.verticalArray1.set(res);
    }
  });

  $('.principalNameSelection').select2({
    placeholder: "Select Principal Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalNameSelection").parent(),
  });
  $('.regionfilter').select2({
    placeholder: "Select Region Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".regionfilter").parent(),
  });
  $('.principalfilter').select2({
    placeholder: "Select Principal Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalfilter").parent(),
  }); $('.brandfilter').select2({
    placeholder: "Select Brand Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".brandfilter").parent(),
  });
  $('.categoryfilter').select2({
    placeholder: "Select Category Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryfilter").parent(),
  });

  $('.principalNameSelection1').select2({
    placeholder: "Select Principal Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalNameSelection1").parent(),
  });
  $('.brandfilter1').select2({
    placeholder: "Select Brand Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".brandfilter1").parent(),
  });
  $('.categoryfilter1').select2({
    placeholder: "Select Category Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryfilter1").parent(),
  });

  //  let date = new Date();
  //  let fromDate = new Date (moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  //  let toDate = new Date ( moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));

  // Meteor.call('creditSale.principalWiseSdSaleList', fromDate, toDate, principalName='', verticalfilter='', brandfilter='', categoryfilter='', (err, res) => {

  //     if (!err) {
  //         this.listArray1.set(res.productArray1);
  //         $('#total').html(res.tableCtn+' CTN & '+res.tablePC+' PCS');
  //         $('#gtotal').html(res.tableTotal.toFixed(2));
  //     }
  // });
  Meteor.call('principal.principalList1', (principalError, principalResult) => {
    if (!principalError) {
      this.principalNameArray.set(principalResult);
    }
  });
  let date = new Date();
  Template.instance().toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  Template.instance().fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
});

Template.principalWiseSalesSdReport.helpers({
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
  vertical1: function () {
    return Template.instance().verticalArray1.get();

  }, listOfData: function () {
    return Template.instance().listArray1.get();

  }, listofRegion: function () {
    return Template.instance().regionArray.get();

  }, listofPrincipal: function () {
    return Template.instance().principalArray.get();

  }, dataList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return result;

  }, brandList: function () {
    return Template.instance().brandArray.get();

  }, categoryList: function () {
    return Template.instance().categoryArray.get();

  }, brandList1: function () {
    return Template.instance().brandArray1.get();

  }, categoryList1: function () {
    return Template.instance().categoryArray1.get();

  },
  formateAmountFix: (docTotal) => {
    if (docTotal == '') {
      return '0.00';
    } else
      return Number(docTotal).toFixed(2);
  },
  getProductName: (product) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.idName", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productIdVal_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  }, dates: (date) => {
    if (date != '')
      return moment(date).format('DD-MM-YYYY');

  },
  roundIt: (value) => {
    return value.toFixed(2);
  }, principalLists: function () {
    return Template.instance().principalNameArray.get();
  }, getPrincipalName: (principal) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("principal.idprincipalName", principal, (error, result) => {

        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.principalIdVal_' + principal).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.principalIdVal_' + principal).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  salesByVolume: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesSdVolume', id, fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), (error, result) => {
        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
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
  salesByValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesSdValue', id, fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), (error, result) => {
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
  salesByVolumeExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesSdVolume', id, fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), (error, result) => {
        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolExport_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVolExport_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesSdValue', id, fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), (error, result) => {
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValExport_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleValExport_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleVolumeTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let principalfilter = Template.instance().principalfilter.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleVolumeSdTotal', fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), principalfilter, (error, result) => {
        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolumeTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVolumeTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleValueTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let principalfilter = Template.instance().principalfilter.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleValueSdTotal', fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), principalfilter, (error, result) => {
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValueTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleValueTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleVolumeTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let principalfilter = Template.instance().principalfilterExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleVolumeSdTotal', fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), principalfilter, (error, result) => {
        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolumeTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVolumeTotalExport').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleValueTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let principalfilter = Template.instance().principalfilterExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleValueSdTotal', fromDate, toDate, brandfilter, categoryfilter, Meteor.userId(), principalfilter, (error, result) => {
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValueTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleValueTotalExport').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  }, datesfrom: () => {
    return moment(Template.instance().fromDate.get()).format('DD-MM-YYYY');

  }, datesto: () => {
    return moment(Template.instance().toDate.get()).format('DD-MM-YYYY');
  }, listData: function () {
    return Template.instance().plistArray.get();

  }
});


Template.principalWiseSalesSdReport.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .principal-filter': (event, template) => {
    event.preventDefault();
    let principalName = event.target.principalNameSelection.value;
    let brandfilter = event.target.brandfilter.value;
    let categoryfilter = event.target.categoryfilter.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    template.toDate.set(toDate);
    template.fromDate.set(fromDate);
    template.principalfilter.set(null);
    template.brandfilter.set(null);
    template.categoryfilter.set(null);
    if (first == '') {
      setTimeout(function () {
        $("#itemArrayspan").html('<style> #itemArrayspan { color:#fc5f5f }</style><span id ="itemArrayspan">Please Select From date</span>').fadeIn('fast');
      }, 0);
      return;
    } else {
      $("#itemArrayspan").html('');
    }
    if (second == '') {
      setTimeout(function () {
        $("#itemArrayspan_1").html('<style> #itemArrayspan_1 { color:#fc5f5f }</style><span id ="itemArrayspan_1">Please Select To date</span>').fadeIn('fast');
      }, 0);
      return;
    } else {
      $("#itemArrayspan_1").html('');
    }

    if (principalName && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && isNaN(toDate)) {
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && isNaN(fromDate) && isNaN(toDate)) {

      template.brandfilter.set(brandfilter);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter === '' && fromDate && isNaN(toDate)) {
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.toDate.set(toDate);
    }
    else if (principalName && brandfilter && categoryfilter === '' && isNaN(fromDate) && isNaN(toDate)) {
      template.principalfilter.set(principalName);
      template.brandfilter.set(brandfilter);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter === '' && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.principalfilter.set(principalName);
      template.categoryfilter.set(categoryfilter);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && fromDate && isNaN(toDate)) {
      template.fromDate.set(fromDate);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.toDate.set(toDate);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && fromDate && isNaN(toDate)) {
      template.brandfilter.set(brandfilter);
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && fromDate && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && isNaN(fromDate) && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.toDate.set(toDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter === '' && fromDate && toDate) {
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.toDate.set(toDate);
      template.principalfilter.set(principalName);
    }
    else if (principalName && brandfilter && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter && fromDate && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && fromDate && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate)
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && fromDate && toDate) {
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter && fromDate && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.fromDate.set(fromDate);
      template.principalfilter.set(principalName);

      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter && fromDate && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);

    }
    else if (principalName && brandfilter === '' && categoryfilter && fromDate && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter === '' && fromDate && toDate) {
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter && isNaN(fromDate) && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter && fromDate && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      template.principalfilter.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
    }


  },
  'click .reset': (event, template) => {
    template.principalfilter.set(null);
    template.brandfilter.set(null);
    template.categoryfilter.set(null);
    event.preventDefault();
    $('#principalNameSelection').val('').trigger('change');
    $('#brandfilter').val('').trigger('change');
    $('#categoryfilter').val('').trigger('change');
    $('#fromDate').val('');
    $('#toDate').val('');
    let date = new Date();
    Template.instance().toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
    Template.instance().fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
    Template.instance().pagination.settings.set('filters', {
    });
  },
  //    'submit .exportToday': (event, template) => {
  //     event.preventDefault();
  //     let exportValue = Template.instance().pagination.getPage();
  //     if (exportValue=== 0) {
  //       toastr["error"]('No Records Found');
  //     }
  //     else {
  //       $("#exportButtons").prop('disabled', true);
  //       Meteor.setTimeout(() => {
  //         let uri = 'data:application/vnd.ms-excel;base64,',
  //           template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
  //           base64 = function (s) {
  //             return window.btoa(unescape(encodeURIComponent(s)))
  //           },
  //           format = function (s, c) {
  //             return s.replace(/{(\w+)}/g, function (m, p) {
  //               return c[p];
  //             });
  //           }
  //         let toExcel = document.getElementById("exportTodayOrder").innerHTML;
  //         let ctx = {
  //           worksheet: name || 'Excel',
  //           table: toExcel
  //         };

  //         function urltoFile(url, filename, mimeType) {
  //           return (fetch(url)
  //             .then(function (res) { return res.arrayBuffer(); })
  //             .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
  //           );
  //         };

  //         //Usage example:
  //         urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
  //           .then(function (file) {

  //             saveAs(file, "Principal wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
  //           });
  //         $("#exportButtons").prop('disabled', false);
  //       }, 5000);
  //     }
  // },
  'change #principalNameSelection': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#principalNameSelection').find(':selected').each(function () {
      principal = $(this).val();
    });
    Meteor.call('brand.prinFullList', principal, (err, res) => {
      if (!err)
        template.brandArray.set(res)
    });


  },
  'change #brandfilter': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#brandfilter').find(':selected').each(function () {
      brand = $(this).val();
    });
    Meteor.call('category.brandWiseList', brand, (err, res) => {
      if (!err)
        template.categoryArray.set(res)
    });

  },
  'change #principalNameSelection1': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#principalNameSelection1').find(':selected').each(function () {
      principal = $(this).val();
    });
    if (principal) {
      template.modalLoader.set(true);
      Meteor.call('brand.prinFullList', principal, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.brandArray1.set(res);
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }

    $('#brandfilter1').val('').trigger('change');
    $('#categoryfilter1').val('').trigger('change');
    $('#startDate1').val('');
    $('#endDate1').val('');
  },
  'change #categoryfilter1': () => {
    $('#startDate1').val('');
    $('#endDate1').val('');
  },
  'change #startDate1': () => {
    $('#endDate1').val('');
  },
  'change #brandfilter1': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#brandfilter1').find(':selected').each(function () {
      brand = $(this).val();
    });
    if (brand) {
      template.modalLoader.set(true);
      Meteor.call('category.brandWiseList', brand, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.categoryArray1.set(res);
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
    $('#categoryfilter1').val('').trigger('change');
    $('#startDate1').val('');
    $('#endDate1').val('');

  },

  //////////////////////////////////

  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.plistArray.set('');
    $('#principalNameSelection1').val('').trigger('change');
    $('#brandfilter1').val('').trigger('change');
    $('#categoryfilter1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let principalNameSelections = $("#principalNameSelection1").val();
    let brandfilters = $("#brandfilter1").val();
    let categoryfilters = $("#categoryfilter1").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDates);
    template.principalfilterExport.set(principalNameSelections);
    template.brandfilterExport.set(brandfilters);
    template.categoryfilterExport.set(categoryfilters);
    template.modalLoader.set(true);
    Meteor.call('principal.principalList', principalNameSelections, (err, res) => {
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
          template.plistArray.set(res);
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

            saveAs(file, "Principal wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  }, 'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});