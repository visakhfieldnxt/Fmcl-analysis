/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
// import { CreditSale } from "../../../api/creditSale/creditSale";

Template.salesDumpReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.creditSaleArray = new ReactiveVar();
  this.sdUserArray = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.outletArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.vansaleUserFullList = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.listCashsale = new ReactiveVar();
  this.userIdData = new ReactiveVar();
  this.sdUserIdData = new ReactiveVar();
  this.outletData = new ReactiveVar();
  this.fromDateFilter = new ReactiveVar();
  this.toDateFilter = new ReactiveVar();
  this.outletDataFilter = new ReactiveVar();
  this.exportSalesDump = new ReactiveVar();
  this.salesDumpvalues = new ReactiveVar();
  this.routeCodeList = new ReactiveVar();
  this.fromDateView = new ReactiveVar();
  this.toDateView = new ReactiveVar();
  let today = moment(new Date()).format("YYYY-MM-DD");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  this.fromDateView.set(moment(new Date()).format("DD-MM-YYYY"));
  this.toDateView.set(moment(new Date()).format("DD-MM-YYYY"));
  this.fromDateFilter.set(moment(new Date()).format("DD-MM-YYYY"));
  this.toDateFilter.set(moment(new Date()).format("DD-MM-YYYY"));

});

Template.salesDumpReport.onRendered(function () {
  $('#countSpans').html('Count : Last 25 Transactions');
  this.salesDumpvalues.set([]);
  let today = moment(new Date()).format("YYYY-MM-DD");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  this.fromDateFilter.set(moment(new Date()).format("DD-MM-YYYY"));
  this.toDateFilter.set(moment(new Date()).format("DD-MM-YYYY"));
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('creditSales.salesDumpData', loginUserVerticals, toDay, nextDay, (err, res) => {
    if (!err) {
      this.salesDumpvalues.set(res);
    }
  });

  Meteor.call('routeGroup.verticalList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.routeCodeList.set(res);
    }
  });

  $("#my-datepicker").datepicker({
    format: "mm-yyyy",
    startView: "months",
    minViewMode: "months"
  });

  $('#bodySpinLoaders').css('display', 'block');
  $('.sduserfilter').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".sduserfilter").parent(),
  });

  $('.verticalfilter').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilter").parent(),
  });
  $('.routeCodeVal').select2({
    placeholder: "Select Route code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".routeCodeVal").parent(),
  });

  $('.outletfilter').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletfilter").parent(),
  });

  $('.sduserExport').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".sduserExport").parent(),
  });
  $('.verticalfilter1').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilter1").parent(),
  });
  $('.outletExport').select2({
    placeholder: "Select Outlet Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletExport").parent(),
  });
  let vertical = Session.get('loginUserVerticals');
  Meteor.call('user.sdListGet', vertical, (err, res) => {
    if (!err) {
      this.vansaleUserFullList.set(res);
    }
  });

});

Template.salesDumpReport.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  /**
* TODO:Complete Js doc
* Formating the price 
*/
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(2);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
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

  routeCodeLists: function () {
    return Template.instance().routeCodeList.get();
  },

  sunDistributorLiv: function () {
    return Template.instance().sdUserArray.get();

  },
  /**
* get vansale user name
*/

  vanUserNameList: () => {
    return Template.instance().vansaleUserFullList.get();

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

  salesTypeCheck: (type) => {
    if (type === 'Cash' || type === 'Credit' ||
      type === undefined || type === null || type === '') {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
  },
  // ,
  // creditSale: function () {
  //   Template.instance().todayExport.set(Template.instance().pagination.getPage());
  //   return Template.instance().pagination.getPage();

  // }

  sdUserHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('user.idSdName', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.sdUserVal_' + id).html(result);

    }
    ).catch((error) => {
      $('.sdUserVal_' + id).html('');

    });
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

    }
    ).catch((error) => {
      $('.verticalVal_' + id).html('');

    });
  },
  outletHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("outlet.dataValGet", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.outletVal_' + id).html(result.name);
      $('.addressOutlet_' + id).html(result.address);
      $('.contactOutlet_' + id).html(result.contactPerson);
      $('.typeOutlet_' + id).html(result.outletType);
      $('.classOutlet_' + id).html(result.outletClass);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.outletVal_' + id).html('');
      $('.addressOutlet_' + id).html('');
      $('.contactOutlet_' + id).html('');
      $('.typeOutlet_' + id).html('');
      $('.classOutlet_' + id).html('');
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
  /*
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
      $('.productCode_' + id).html(result.productCode);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productVal_' + id).html('');
      $('.productCode_' + id).html('');
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
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  /**
   * get from date
   */
  getFromDate: () => {
    // return Template.instance().fromDateFilter.get();
    return Template.instance().fromDateView.get();

  },
  outletFilterList: function () {
    return Template.instance().outletDataFilter.get();
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
  creditSaleDataArray: function () {
    let result = Template.instance().salesDumpvalues.get();
    if (result !== undefined) {
      if (result.length === 0) {
        $('#bodySpinLoaders').css('display', 'none');
      }
      else {
        let uniqueSlNo = 0;
        for (let i = 0; i < result.length; i++) {
          let itemResVal = result[i].itemArray;
          if (result[i].itemArray.length > 0) {
            for (let j = 0; j < itemResVal.length; j++) {
              uniqueSlNo = parseInt(uniqueSlNo + 1);
              itemResVal[j]._id = Random.id();
              itemResVal[j].subDistributor = result[i].subDistributor;
              itemResVal[j].vertical = result[i].vertical;
              itemResVal[j].outlet = result[i].outlet;
              itemResVal[j].routeId = result[i].routeId;
              itemResVal[j].taxAmount = result[i].taxAmount;
              itemResVal[j].salesType = result[i].salesType;
              itemResVal[j].walkInCustomer = result[i].walkInCustomer;
              itemResVal[j].docDate = result[i].docDate;
              itemResVal[j].createdBy = result[i].createdBy;
              itemResVal[j].uniqueSlNo = uniqueSlNo;
              itemResVal[j].sdUser = result[i].sdUser;
              itemResVal[j].deliveredDate = result[i].deliveredDate;
            }
          }
        }
      }
    }
    return result;
  },


  /**
* TODO: Complete JS doc
* @returns {*}
*/
  exportDataArray: function () {
    let result = Template.instance().exportSalesDump.get();
    if (result !== undefined && result.length > 0) {
      let uniqueSlNo = 0;
      for (let i = 0; i < result.length; i++) {
        let itemResVal = result[i].itemArray;
        if (result[i].itemArray.length > 0) {
          for (let j = 0; j < itemResVal.length; j++) {
            uniqueSlNo = parseInt(uniqueSlNo + 1);
            itemResVal[j]._id = Random.id();
            itemResVal[j].subDistributor = result[i].subDistributor;
            itemResVal[j].vertical = result[i].vertical;
            itemResVal[j].outlet = result[i].outlet;
            itemResVal[j].routeId = result[i].routeId;
            itemResVal[j].taxAmount = result[i].taxAmount;
            itemResVal[j].salesType = result[i].salesType;
            itemResVal[j].walkInCustomer = result[i].walkInCustomer;
            itemResVal[j].docDate = result[i].docDate;
            itemResVal[j].createdBy = result[i].createdBy;
            itemResVal[j].uniqueSlNo = uniqueSlNo;
            itemResVal[j].sdUser = result[i].sdUser;
            itemResVal[j].deliveredDate = result[i].deliveredDate;
          }
        }
      }
    }
    return result;
  },

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
   * 
   * @param {*} id 
   */
  sdRegionHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("branch.sdRegionGet", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.sdRegionVal_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.sdRegionVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  /**
   * 
   * @param {*} id 
   */
  getBrandNameHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("brand.productBrandName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productBrand_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productBrand_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  /**
   * 
   * @param {*} id 
   */
  getCategoryNameHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("category.productCategoryName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productCategory_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productCategory_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },

  /**
   * 
   * @param {*} id 
   */
  getPrincipalNameHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("principal.productprincipalName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productPrincipal_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productPrincipal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.salesDumpReport.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
   * 
   * @param {*} event 
   * filter search
   */
  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let outlet = event.target.outletfilter.value;
    let routeCodeVal = event.target.routeCodeVal.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let vanEmp = event.target.sduserfilter.value;
    let loginUserVerticals = Session.get("loginUserVerticals"); 
    template.fromDateView.set(first);
    template.toDateView.set(second); 
    template.fromDateFilter.set(first);
    template.toDateFilter.set(second);
    toDate.setDate(toDate.getDate() + 1);

    if (outlet && vanEmp === '' && routeCodeVal === '' && fromDate && toDate) {
      template.fromDateFilter.set(fromDate);
      template.toDateFilter.set(toDate);
      Meteor.call('creditSales.salesDumpOutletFilter', loginUserVerticals, outlet, fromDate, toDate, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else if (outlet === '' && vanEmp && routeCodeVal === '' && fromDate && toDate) {
      template.fromDateFilter.set(fromDate);
      template.toDateFilter.set(toDate);
      Meteor.call('creditSales.salesDumpvanEmpFilter', loginUserVerticals, vanEmp, fromDate, toDate, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else if (outlet === '' && vanEmp === '' && routeCodeVal && fromDate && toDate) {
      //new 
      template.fromDateFilter.set(fromDate);
      template.toDateFilter.set(toDate);
      toDate.setDate(toDate.getDate() + 1);
      Meteor.call('creditSales.salesDumpRouteDateFilter', loginUserVerticals, fromDate, toDate, routeCodeVal, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else if (outlet && vanEmp && routeCodeVal === '' && fromDate && toDate) {
      template.fromDateFilter.set(fromDate);
      template.toDateFilter.set(toDate);
      toDate.setDate(toDate.getDate() + 1);
      Meteor.call('creditSales.salesDumpvanEmpOutletFilter', loginUserVerticals, outlet, vanEmp, fromDate, toDate, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else if (outlet && vanEmp === '' && routeCodeVal && fromDate && toDate) {
      //new 
      template.fromDateFilter.set(fromDate);
      template.toDateFilter.set(toDate);
      toDate.setDate(toDate.getDate() + 1);
      Meteor.call('creditSales.salesDumpDateOutletRouteFilter', loginUserVerticals, outlet, fromDate, toDate, routeCodeVal, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else if (outlet === '' && vanEmp && routeCodeVal && fromDate && toDate) {
      //new
      template.fromDateFilter.set(first);
      template.toDateFilter.set(second);
      toDate.setDate(toDate.getDate() + 1);
      Meteor.call('creditSales.salesDumpDateSubDRouteFilter', loginUserVerticals, vanEmp, fromDate, toDate, routeCodeVal, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else if (outlet && vanEmp && routeCodeVal && fromDate && toDate) {
      //new
      template.fromDateFilter.set(first);
      template.toDateFilter.set(second);
      toDate.setDate(toDate.getDate() + 1);
      Meteor.call('creditSales.salesDumpvanEmpOutletRouteFilter', loginUserVerticals, outlet, vanEmp, fromDate, toDate, routeCodeVal, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else if (outlet === '' && vanEmp === '' && routeCodeVal === '' && fromDate && toDate) {
      template.fromDateFilter.set(fromDate);
      template.toDateFilter.set(toDate);
      toDate.setDate(toDate.getDate() + 1);
      Meteor.call('creditSales.salesDumpDateOnlyFilter', loginUserVerticals, fromDate, toDate, (err, res) => {
        if (!err) {
          template.salesDumpvalues.set(res);
        }
      });
      $('#countSpans').html('');
    } else {
      Template.instance().pagination.settings.set('filters', {});
      $('#countSpans').html('');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (evnt, template) => {
    let today = moment(new Date()).format("YYYY-MM-DD");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    template.fromDateView.set(moment(new Date()).format("DD-MM-YYYY"));
    template.toDateView.set(moment(new Date()).format("DD-MM-YYYY"));
    let loginUserVerticals = Session.get("loginUserVerticals");
    Meteor.call('creditSales.salesDumpData', loginUserVerticals, toDay, nextDay, (err, res) => {
      if (!err) {
        template.salesDumpvalues.set(res);
      }
    });
    $('#countSpans').html('Count : Last 25 Transactions');
    $('form :input').val("");
    $("#sduserfilter").val('').trigger('change');
    $("#outletfilter").val('').trigger('change');
    $("#routeCodeVal").val('').trigger('change');
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
  'submit .exportByModal': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().exportSalesDump.get();
    if (exportData.length === 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#routeReportExportPage").modal('hide');
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

            saveAs(file, "Sales Dump Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
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
    $('#CreditSaleDetailPage').modal();
    Meteor.call('creditSale.id', id, (CreditSaleError, CreditSaleResult) => {
      if (!CreditSaleError) {
        let CreditSaleList = CreditSaleResult.creditSaleData;
        if (CreditSaleList.itemArray !== undefined && CreditSaleList.itemArray.length > 0) {
          template.itemsDetailsList.set(CreditSaleList.itemArray);
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
        $(CreditSalecreatedBy).html(CreditSaleResult.createdName);
        $(CreditSalecreatedAt).html(moment(CreditSaleList.createdAt).format('DD-MM-YYYY'));
        template.modalLoader.set(false);
      }

    });

  },

  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    $('#sduserExport').val('').trigger('change');
    $('#outletExport').val('').trigger('change');
    $('form :input').val("");
    $("#fromDatesExp").html('');
    $("#toDatesExp").html('');
    $("#outletExp").html('');
    $("#subDExp").html('');
  },
  'change .startDate': (event, template) => {
    let sdate = $(".startDate").val();
    $("#fromDatesExp").html('');
    $("#toDatesExp").html('');
    $("#outletExp").html('');
    $("#subDExp").html('');
    let sdId = '';
    $('#sduserExport').find(':selected').each(function () {
      sdId = ($(this).val());
    });
    let outlet = '';
    $('#outletExport').find(':selected').each(function () {
      outlet = ($(this).val());
    });
    if (sdId !== '') {
      let userData = Template.instance().vansaleUserFullList.get();
      if (userData) {
        let subDVal = userData.find(x => x._id === sdId);
        if (subDVal) {
          $("#subDExp").html(`${subDVal.profile.firstName} ${subDVal.profile.lastName}`);
        }
        else {
          $("#subDExp").html('');
        }
      }
    }
    if (outlet !== '') {
      if (outlet !== 'Walk-In Customer') {
        let outletData = Template.instance().outletDataFilter.get();
        if (outletData) {
          let outletVal = outletData.find(x => x._id === outlet);
          if (outletVal) {
            $("#outletExp").html(`${outletVal.name}`);
          }
          else {
            $("#outletExp").html('');
          }
        }
      }
      else {
        $("#outletExp").html('Walk-In Customer');
      }
    }
    let fromDate = new Date(moment(sdate, 'MM-YYYY').format("YYYY-MM-01 00:00:00.0"));
    var toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
    $("#fromDatesExp").html(moment(fromDate).format('DD-MM-YYYY'));
    $("#toDatesExp").html(moment(toDate).format('DD-MM-YYYY'));
    toDate.setDate(toDate.getDate() + 1);


    let loginUserVerticals = Session.get("loginUserVerticals");
    template.exportSalesDump.set('');
    Meteor.call('creditSales.exportSalesDump', sdId, outlet, fromDate, toDate, loginUserVerticals, (err, res) => {
      if (!err) {
        if (res.length === 0) {
          setTimeout(function () {
            $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');
          }, 3000);
        }
        else {
          template.exportSalesDump.set(res);
        }
      }
    });
  },


  'change #sduserfilter': (event, template) => {
    event.preventDefault();
    let sdId = '';
    $('#sduserfilter').find(':selected').each(function () {
      sdId = ($(this).val());
    });
    template.outletDataFilter.set('');
    if (sdId !== '') {
      Meteor.call('outlet.sdBase', sdId, (err, res) => {
        if (!err) {
          template.outletDataFilter.set(res);
        }
        else {
          template.outletDataFilter.set('');
        }
      })
    }
  },
  'change #sduserExport': (event, template) => {
    event.preventDefault();
    let sdId = '';
    $('#sduserExport').find(':selected').each(function () {
      sdId = ($(this).val());
    });
    $('.startDate').val('');
    template.modalLoader.set(false);
    template.outletDataFilter.set('');
    if (sdId !== '') {
      template.modalLoader.set(true);
      Meteor.call('outlet.sdBase', sdId, (err, res) => {
        if (!err) {
          template.outletDataFilter.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.outletDataFilter.set('');
          template.modalLoader.set(false);
        }
      })
    }
  },

  'change #outletExport': (event, template) => {
    event.preventDefault();
    template.exportSalesDump.set('');
    $('.startDate').val('');
  },
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});