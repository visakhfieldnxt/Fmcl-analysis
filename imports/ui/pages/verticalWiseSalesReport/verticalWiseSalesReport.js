/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { Product } from "../../../api/products/products";

Template.verticalWiseSalesReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.modalLoader = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.verticalVar = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.verticalVarExport = new ReactiveVar();
  this.vertWiseLiExport = new ReactiveVar();
  this.productNameArray = new ReactiveVar();
  this.productVar = new ReactiveVar();
  this.productVarExport = new ReactiveVar();

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

Template.verticalWiseSalesReport.onRendered(function () {
  /**
   * Default date set
   *
   *  */
  let logVertical = Session.get('loginUserVerticals');
  this.verticalVar.set(logVertical);
  this.verticalVarExport.set(logVertical);
  let date = new Date();
  this.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
  this.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));

  this.fromDateExport.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));

  this.toDateExport.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  // let loginUserVerticals = Session.get("loginUserVerticals");
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    Meteor.call('product.productList', (err, res) => {
      if (!err) {
        this.productNameArray.set(res);
      }
    });
  }
  else {
    Meteor.call('product.filterList', logVertical, (err, res) => {
      if (!err) {
        this.productNameArray.set(res);
      }
    });
  }
  $('.productNameSelection').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productNameSelection").parent(),
  });
  $('.verticalfilter').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilter").parent(),
  });
  $('.verticalfilters').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilters").parent(),
  });
  /**
   * Vertical List for filter
   * */
  Meteor.call('verticals.verticalList', (err, res) => {
    if (!err) {
      this.verticalArray.set(res);
    }
  });
});
Template.verticalWiseSalesReport.helpers({
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
  verticalList: function () {
    return Template.instance().verticalArray.get();
  },
  verticalWiseList: function () {
    return Template.instance().pagination.getPage();
  },
  verticalWiseListExport: function () {
    return Template.instance().vertWiseLiExport.get();
  },
  //   productName: (id) => {
  //     let promisVal = new Promise((resolve,reject) => {
  //         Meteor.call("product.productName", id,(error,result) => {
  //             if(!error){
  //                 resolve(result);
  //             }else{
  //                 reject(error);
  //             }
  //         });
  //     });
  //     promisVal.then((result) => {
  //         $('.productIdVal_' + id).html(result);
  //         $('#bodySpinLoaders').css('display', 'none');
  //     }).catch(() => {
  //         $('.productIdVal_' + id).html('');
  //         $('#bodySpinLoaders').css('display', 'none');
  //     });
  //   },
  productNameExport: (id) => {
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("product.productName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promisVal.then((result) => {
      $('.productIdValExport_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.productIdValExport_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
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
  salesByVolumeIdTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalVar.get();
    let product = Template.instance().productVar.get();
    let promisVal = new Promise((resolve, reject) => {
      Meteor.call("creditSales.saleByvolumeTotal1", vertical, fromDate, toDate, product, (error, result) => {
        if (!error) {
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
  }, salesByVolumeIdTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalVarExport.get();
    let product = Template.instance().productVarExport.get();
    let promisVal = new Promise((resolve, reject) => {
      if (fromDate != undefined && toDate != undefined && vertical != undefined) {
        Meteor.call("creditSales.saleByvolumeTotal1", vertical, fromDate, toDate, product, (error, result) => {
          if (!error) {
            let data = result.tCtn + " CTN " + result.finalPcs + " PCS";
            resolve(data);
          } else {
            reject(error);
          }
        });
      } else {
        resolve("0 CTN 0 PCS");
      }
    });


    promisVal.then((result) => {
      $('.salesByVolumeIdTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByVolumeIdTotalExport').html('');
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
      $('.salesByValueIdTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch(() => {
      $('.salesByValueIdTotalExport').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
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
  productLists: function () {
    return Template.instance().productNameArray.get();
  }
});

Template.verticalWiseSalesReport.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .verticalwise-filter': (event, template) => {
    event.preventDefault();
    let verticalName = event.target.verticalfilter.value;
    let productName = event.target.productNameSelection.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    console.log("first ", first);
    if (first === '' || second === '') {
      toastr['error']('Please fill up Date s');
      return;
    }

    if (verticalName === '') {
      toastr['error']('Please fill up  Vertical');
      return;
    }

    let verticalNameAry = [];
    verticalNameAry.push(verticalName);
    template.fromDate.set(fromDate);
    template.toDate.set(toDate);

    if (productName && verticalName === '') {
      template.productVar.set(productName);
      template.verticalVar.set(verticalNameAry);
      Template.instance().pagination.settings.set('filters', {
        _id: productName
      });
    } else if (productName === '' && verticalName) {
      template.verticalVar.set(verticalNameAry);
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: verticalNameAry }
      });
    } else if (productName && verticalName) {
      template.productVar.set(productName);
      template.verticalVar.set(verticalNameAry);
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: verticalNameAry },
        _id: productName
      });
    } else {
      Template.instance().pagination.settings.set('filters', {
      });
    }

  }
  ,
  'click .reset': (event, template) => {
    event.preventDefault();
    $('#productNameSelection').val('').trigger('change');
    $('#verticalfilter').val('').trigger('change');
    $('form :input').val("");
    let date = new Date();
    template.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
    template.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
    let logVertical1 = Session.get('loginUserVerticals');

    template.verticalVar.set(logVertical1);
    template.productVar.set(null);
    Template.instance().pagination.settings.set('filters', {
      vertical: { $in: logVertical1 },
    });
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    $('#verticalfilters').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change #verticalfilters': (event, template) => {
    $('.startDate1').val('');
  },
  'change .startDate1': (event, template) => {
    $(".endDate1").val('');
    $(".endDate1").attr("disabled", false);
    // template.purchaseOrderExport.set('');
  },
  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let vertical = $("#verticalfilters").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDate = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDate);
    template.productVarExport.set(null);
    let verticalAry = [];
    verticalAry.push(vertical);
    template.verticalVarExport.set(verticalAry);
    if (vertical != '') {
      Meteor.call('product.proForCredit', vertical, (err, res) => {
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
    }
  }, 'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
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