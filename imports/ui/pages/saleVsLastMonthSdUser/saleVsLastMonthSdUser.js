/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { StockTransferIssued } from "../../../api/stockTransferIssued/stockTransferIssued";

Template.saleVsLastMonthSdUser.onCreated(function () {
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
  this.toDate = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.userNameArray1 = new ReactiveVar();
  this.prodListArray = new ReactiveVar();
  this.userList = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.productName = new ReactiveVar();
  this.productNameExport = new ReactiveVar();

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  this.pagination = new Meteor.Pagination(StockTransferIssued, {
    filters: {
      sdUser: Meteor.userId(),
    },
    fields: { sdUser: 1, product: 1, subDistributor: 1, vertical: 1 },
    perPage: 20
  });
});

Template.saleVsLastMonthSdUser.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');

  Meteor.call('stockTransferIssued.productList', Meteor.userId(), (err, res) => {
    if (!err)
      this.prodListArray.set(res);
  });

  Meteor.call('user.sdUserDataList1', Meteor.userId(), (err, res) => {
    if (!err)
      this.userNameArray1.set(res);
  });

  $('.productName').select2({
    placeholder: "Select Product Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productName").parent(),
  });
  $('.productName1').select2({
    placeholder: "Select Product Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productName1").parent(),
  });
  let date = new Date();
  Template.instance().fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')))
  Template.instance().toDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('YYYY-MM-DD 00:00:00.0')))

});

Template.saleVsLastMonthSdUser.helpers({
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
  listData: function () {
    let exportValue = Template.instance().pagination.getPage();
    if (exportValue.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    } 
    return Template.instance().pagination.getPage();
  },
  sdList: () => {
    let useDta = Template.instance().userNameArray1.get();
    if (useDta) {
      return useDta.filter(x => x.userType === 'SDUser' && x.active === 'Y');
    } else {
      return [];
    }
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
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html(''); 
    }
    );
  },
  lastMonthSaleQty: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.lmtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lstMonthqty_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.lstMonthqty_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  lastMonthSaleQtyExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.lmtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lstMonthqtyExport_' + id).html(result); 
    }).catch((error) => {
      $('.lstMonthqtyExport_' + id).html(''); 
    });
  },
  lastMonthSaleValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.lmtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lstMonthvalue_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.lstMonthvalue_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  lastMonthSaleValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.lmtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lstMonthvalueExport_' + id).html(result); 
    }).catch((error) => {
      $('.lstMonthvalueExport_' + id).html(''); 
    });
  },
  currentSaleQty: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.crtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentqty_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.currentqty_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  currentSaleQtyExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.crtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentqtyExport_' + id).html(result); 
    }).catch((error) => {
      $('.currentqtyExport_' + id).html(''); 
    });
  },
  currentSaleValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.crtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentvalue_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.currentvalue_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  currentSaleValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, id, (error, result) => {
        if (!error) {
          resolve(result.crtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentvalueExport_' + id).html(result); 
    }).catch((error) => {
      $('.currentvalueExport_' + id).html(''); 
    });
  },
  prodList: () => {
    return Template.instance().prodListArray.get();
  }, listofExport: () => {
    return Template.instance().userList.get();
  },
  lastMonthSaleQtyTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let productName = Template.instance().productName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleQtyTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.lmtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lastMonthSaleQtyTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.lastMonthSaleQtyTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  lastMonthSaleQtyTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let productName = Template.instance().productNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleQtyTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.lmtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lastMonthSaleQtyTotalExport').html(result); 
    }).catch((error) => {
      $('.lastMonthSaleQtyTotalExport').html(''); 
    });
  },
  lastMonthSaleValueTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let productName = Template.instance().productName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleValueTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.lmtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lastMonthSaleValueTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.lastMonthSaleValueTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  lastMonthSaleValueTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let productName = Template.instance().productNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleValueTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.lmtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lastMonthSaleValueTotalExport').html(result); 
    }).catch((error) => {
      $('.lastMonthSaleValueTotalExport').html(''); 
    });
  },
  currentSaleQtyTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let productName = Template.instance().productName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleQtyTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.crtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentSaleQtyTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.currentSaleQtyTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  currentSaleQtyTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let productName = Template.instance().productNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleQtyTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.crtQty);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentSaleQtyTotalExport').html(result); 
    }).catch((error) => {
      $('.currentSaleQtyTotalExport').html(''); 
    });
  },
  currentSaleValueTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let productName = Template.instance().productName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleValueTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.crtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentSaleValueTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.currentSaleValueTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  currentSaleValueTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let productName = Template.instance().productNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.lastMonthSaleValueTotal', productName, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result.crtValue);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.currentSaleValueTotalExport').html(result); 
    }).catch((error) => {
      $('.currentSaleValueTotalExport').html(''); 
    });
  }
});

Template.saleVsLastMonthSdUser.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .verticalwise-filter': (event, template) => {
    event.preventDefault();
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let productName = event.target.productName.value;
    template.fromDate.set(fromDate);
    template.toDate.set(toDate);
    template.productName.set(productName);
    if (productName && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        product: productName,
        sdUser: Meteor.userId(),

      });
    } else if (productName === '' && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        sdUser: Meteor.userId(),

        // transferDateIso: {
        //      $lte: fromDate
        //  }
      });
    } else if (productName === '' && isNaN(fromDate) && toDate) {
      toDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        sdUser: Meteor.userId(),

        // transferDateIso: {
        //      $lte: toDate
        //  }
      });
    } else if (productName && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        product: productName,
        sdUser: Meteor.userId(),

        // transferDateIso: {
        //      $lte: fromDate
        //  }
      });
    } else if (productName === '' && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          sdUser: Meteor.userId(),

          //  transferDateIso: {
          //   $gte: fromDate, $lt: toDate
          // }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          sdUser: Meteor.userId(),

          // transferDateIso: {
          //    $gte: fromDate, $lt: toDate
          //  }
        });
      }

    } else if (productName && isNaN(fromDate) && toDate) {
      toDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        product: productName,
        sdUser: Meteor.userId(),

        // transferDateIso: {
        //      $lte: toDate
        //  }
      });
    } else if (productName && fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          product: productName,
          sdUser: Meteor.userId(),

          //  transferDateIso: {
          //   $gte: fromDate, $lt: toDate
          // }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          product: productName,
          sdUser: Meteor.userId(),

          // transferDateIso: {
          //    $gte: fromDate, $lt: toDate
          //  }
        });
      }
    } else {
      Template.instance().pagination.settings.set('filters', {
        sdUser: Meteor.userId(),

      });
    }
    Meteor.call('creditSale.saleLastMonthSdUser', fromDate, toDate, productName, (err, res) => {
      if (!err) {
        $('#total1').html(res.total);
        $('#gtotal').html(res.gtotal);
        $('#ltotal').html(res.ltotal);
        $('#lgtotal').html(res.lgtotal);
      }
    });
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.userList.set('');
    $('#productName1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change .endDate1,#productName1,.startDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let product = $("#productName1").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDates);
    template.productNameExport.set(product);
    Meteor.call('stockTransferIssued.productList1', product, Meteor.userId(), (err, res) => {
      if (!err)
        template.userList.set(res);
    });
  },
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportValue = template.userList.get();
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
            saveAs(file, "Sale vs Last Month Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },

  'click .reset': (events, template) => {
    let date = new Date();
    Template.instance().fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')))
    Template.instance().toDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('YYYY-MM-DD 00:00:00.0')))
    template.productName.set(null);
    Template.instance().pagination.settings.set('filters', {
      sdUser: Meteor.userId(),
    });
    $('form :input').val("");
    $("#productName").val('').trigger('change');
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});