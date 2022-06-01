/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { Product } from "../../../api/products/products";

Template.verticalWiseSalesBdmReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.modalLoader = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.listArray1 = new ReactiveVar();
  this.listArray2 = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.verticalVar = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.verticalVarExport = new ReactiveVar();
  this.vertWiseLiExport = new ReactiveVar();
  this.productNameArray = new ReactiveVar();
  this.productVar = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.productVarExport = new ReactiveVar();

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);

  let vertical = Session.get('loginUserVerticals');
  this.pagination = new Meteor.Pagination(Product, {
    filters: {
      vertical: { $in: vertical }
    },
    perPage: 20,
    fields: {
      productName: 1,
      productCode: 1
    }
  });
});

Template.verticalWiseSalesBdmReport.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  this.productVar.set(null);
  let logVertical = Session.get('loginUserVerticals');
  this.verticalVar.set(logVertical);
  this.verticalVarExport.set(logVertical);
  let date = new Date();
  this.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
  this.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  this.fromDateExport.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
  this.toDateExport.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  console.log("fromDateExport ", new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
  console.log("toDateExport ", new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  $('.verticalfilter').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilter").parent(),
  }); $('.productNameSelection').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productNameSelection").parent(),
  });
  Meteor.call('verticals.verticalList', (err, res) => {
    if (!err) {
      this.verticalArray.set(res);
    }
  });
  /**
  * get price type list
  */let loginUserVerticals = Session.get("loginUserVerticals");
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    Meteor.call('product.productList', (err, res) => {
      if (!err) {
        this.productNameArray.set(res);
      }
    });
  }
  else {
    Meteor.call('product.filterList', loginUserVerticals, (err, res) => {
      if (!err) {
        this.productNameArray.set(res);
      }
    });
  }
});

Template.verticalWiseSalesBdmReport.helpers({

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
  vertical1: function () {
    return Template.instance().verticalArray.get();
  },
  listOfData: function () {
    let result = Template.instance().listArray1.get();
    if (result != undefined) {
      if (result.length === 0) {
        $('#bodySpinLoaders').css('display', 'none');
      }
    }
    return result;
  },
  dataExport: function () {
    // return Template.instance().listArray2.get();
    return Template.instance().vertWiseLiExport.get();
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
  },
  dates: (date) => {
    if (date != '')
      return moment(date).format('DD-MM-YYYY');

  },
  roundIt: (value) => {
    return value.toFixed(2);
  },
  verticalWiseList: function () {
    return Template.instance().pagination.getPage();
  },
  salesByVolumeId: (productId) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalVar.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.saleByvolume", vertical, productId, fromDate, toDate, (error, result) => {
        let data = result.tCtn + " CTN " + result.finalPcs + " PCS";
        if (!error) {
          resolve(data);
        } else {
          reject(error);
        }
      });
    });
    promisVal.then((result) => {
      $('.salesByVolumeId' + productId).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByVolumeId' + productId).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByValueId: (productId) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalVar.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.salesByValueId", vertical, productId, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promisVal.then((result) => {
      $('.salesByValueId' + productId).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByValueId' + productId).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByVolumeIdTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalVar.get();
    let product = Template.instance().productVar.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.saleByvolumeTotal1", vertical, fromDate, toDate, product, (error, result) => {
        if (!error && result !== undefined) {
          let data = result.tCtn + " CTN " + result.finalPcs + " PCS";
          resolve(data);
        } else {
          reject(error);
        }
      });

    });
    promisVal.then((result) => {
      $('.saleByvolumeTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.saleByvolumeTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByValueIdTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalVar.get();
    let product = Template.instance().productVar.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.salesByValueTotal", vertical, fromDate, toDate, product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promisVal.then((result) => {
      $('.salesByValueTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByValueTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },

  //export
  salesByVolumeIdExport: (productId) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalVarExport.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.saleByvolume", vertical, productId, fromDate, toDate, (error, result) => {
        let data = result.tCtn + " CTN " + result.finalPcs + " PCS";
        if (!error) {
          resolve(data);
        } else {
          reject(error);
        }
      });
    });
    promisVal.then((result) => {
      $('.salesByVolumeIdExport' + productId).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByVolumeIdExport' + productId).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByValueIdExport: (productId) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalVarExport.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.salesByValueId", vertical, productId, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promisVal.then((result) => {
      $('.salesByValueIdExport' + productId).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByValueIdExport' + productId).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByVolumeIdTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalVarExport.get();
    let product = Template.instance().productVarExport.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.saleByvolumeTotal1", vertical, fromDate, toDate, product, (error, result) => {
        if (!error && result !== undefined) {
          let data = result.tCtn + " CTN " + result.finalPcs + " PCS";
          resolve(data);
        } else {
          reject(error);
        }
      });

    });
    promisVal.then((result) => {
      $('.saleByvolumeTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.saleByvolumeTotalExport').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByValueIdTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalVarExport.get();
    let product = Template.instance().productVarExport.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.salesByValueTotal", vertical, fromDate, toDate, product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promisVal.then((result) => {
      $('.salesByValueTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByValueTotalExport').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  }





  ,
  dateFrom: () => {
    let dateFr = Template.instance().fromDate.get();
    return moment(dateFr).format('DD-MM-YY');
  },
  dateTo: () => {
    let dateTo = Template.instance().toDate.get();
    return moment(dateTo).format('DD-MM-YY');
  },
  dateFromExport: () => {
    let dateFr = Template.instance().fromDateExport.get();
    return moment(dateFr).format('DD-MM-YY');
  },
  dateToExport: () => {
    let dateTo = Template.instance().toDateExport.get();
    return moment(dateTo).format('DD-MM-YY');
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  productLists: function () {
    return Template.instance().productNameArray.get();
  }
});

Template.verticalWiseSalesBdmReport.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .verticalwise-filter': (event, template) => {
    event.preventDefault();
    let vertical2 = Session.get('loginUserVerticals');
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let productNameSelection = event.target.productNameSelection.value;
    console.log("productNameSelection ", productNameSelection);
    if (fromDate != "Invalid Date" && toDate != "Invalid Date") {
      let verticalNameAry = [];
      verticalNameAry.push(vertical2);
      if (fromDate && toDate && productNameSelection === '') {
        template.fromDate.set(fromDate);
        template.toDate.set(toDate);
        Template.instance().pagination.settings.set('filters', {
        });
      } else if (fromDate && toDate && productNameSelection) {
        template.productVar.set(productNameSelection);
        template.fromDate.set(fromDate);
        template.toDate.set(toDate);
        Template.instance().pagination.settings.set('filters', {
          _id: productNameSelection
        });
      } else {
        Template.instance().pagination.settings.set('filters', {
          vertical: { $in: verticalNameAry }
        });
      }

      //  if (fromDate && isNaN(toDate)) {
      //   template.fromDate.set(fromDate);
      //   Template.instance().pagination.settings.set('filters', {
      //   });
      // } else if (isNaN(fromDate) && toDate) {
      //   template.toDate.set(toDate);
      //   Template.instance().pagination.settings.set('filters', {
      //   });
      // } else if (fromDate && toDate) {
      //   template.fromDate.set(fromDate);
      //   template.toDate.set(toDate);
      //   Template.instance().pagination.settings.set('filters', {
      //   });
      // } else {
      //   Template.instance().pagination.settings.set('filters', {
      //     vertical: { $in: verticalNameAry }
      //   });
      // }


    } else {
      toastr["error"]('Please fill Dates');
    }
  },
  // 'submit .verticalwise-filter': (event, template) => {
  //   event.preventDefault();
  //   let first = $("#fromDate").val();
  //   let second = $("#toDate").val();
  //   if (first == '' && second == '') {
  //     setTimeout(function () {
  //       $("#itemArrayspan").html('<style> #itemArrayspan { color:#fc5f5f }</style><span id ="itemArrayspan">Please Select From and to date</span>').fadeIn('fast');
  //     }, 0);
  //     return;
  //   } else {
  //     $("#itemArrayspan").html('');
  //   }
  //   let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
  //   var fromDate = new Date(dateOne);
  //   let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
  //   var toDate = new Date(dateTwo);
  //   let verticals = Session.get("loginUserVerticals");
  //   Meteor.call('creditSale.verticalWiseSaleBdmList', fromDate, toDate, verticals, (err, res) => {
  //     if (!err) {
  //       template.listArray1.set(res.productArray1);
  //       $('#total').html(res.tableCtn + ' CTN & ' + res.tablePC + ' PCS');
  //       $('#gtotal').html(res.tableTotal.toFixed(2));
  //     }
  //   });
  // },

  'click .reset': (event, template) => {
    event.preventDefault();
    template.productVar.set(null);
    $('#verticalfilter').val('').trigger('change');
    $('#productNameSelection').val('').trigger('change');
    $('form :input').val("");
    let date = new Date();
    template.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
    template.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
    let logVertical1 = Session.get('loginUserVerticals');
    Template.instance().pagination.settings.set('filters', {
      vertical: { $in: logVertical1 },
    });
    template.verticalVar.set(logVertical1);
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.listArray2.set('');
    $(".startDate1").val('');
    $(".endDate1").val('');
  },

  'change .startDate1,.endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    // let vertical = $("#verticalfilters").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDate = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    console.log("fromDate ", fromDate);
    console.log("toDate ", toDate);
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDate);
    let vertical1 = Session.get('loginUserVerticals');
    let verticalAry = [];
    verticalAry.push(vertical1);
    // template.verticalVarExport.set(verticalAry);
    template.verticalVarExport.set(vertical1);
    // if (sdate !== '') {
    Meteor.call('product.proForCredit', vertical1, (err, res) => {
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
          template.vertWiseLiExport.set(res);
        }
      }
    });
    // }
  },
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    // let exportValue = template.listArray2.get();
    let exportValue = template.vertWiseLiExport.get();
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

            saveAs(file, "Vertical wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});