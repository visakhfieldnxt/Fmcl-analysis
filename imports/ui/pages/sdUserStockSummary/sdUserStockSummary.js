/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { StockSummary } from "../../../api/stockSummary/stockSummary";
Template.sdUserStockSummary.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });

  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.productNameArray = new ReactiveVar();
  this.stockListArray = new ReactiveVar();
  this.stockSummaryExport = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.prodListArray = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  this.pagination = new Meteor.Pagination(StockSummary, {
    filters: {
      employeeId: Meteor.userId(),
      date: moment(new Date()).format('DD-MM-YYYY')
    },
    sort: {
      createdAt: -1
    },
    fields: {
      product: 1,
      date: 1,
      openingStock: 1,
      soldStock: 1,
      closingStock: 1
    },
    perPage: 20
  });
});


Template.sdUserStockSummary.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
    if (!err)
      this.verticalArray.set(res);
  });

  Meteor.call('stockSummary.sdUserstockList', Meteor.userId(), (err, res) => {
    if (!err)
      this.stockListArray.set(res);
  });
    Meteor.call('stockTransferIssued.productList', Meteor.userId(), (err, res) => {
        if (!err)
        this.prodListArray.set(res);
      });
  $('.selectVerticalName').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true
  });

  $('.selectProductName').select2({
    placeholder: "Select Product Name",
    tokenSeparators: [','],
    allowClear: true
  });
  $('.productName').select2({
    placeholder: "Select Product Name",
    tokenSeparators: [','],
    allowClear: true
  });
});

Template.sdUserStockSummary.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  dateValGet: () => {
    return moment(new Date()).format('DD-MM-YYYY');
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
  stocklist: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return result;
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
  vertical1: function () {
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
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.productVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
  }, vertical1: function () {
    return Template.instance().verticalArray.get();

  }, 
  productLists: function () {
    return Template.instance().productNameArray.get();
  },
  listofExport: () => {
    return Template.instance().stockSummaryExport.get();
  },
  getProduct: () => {
    return Template.instance().getProductVar.get();
  },
  prodList: () => {
       return Template.instance().prodListArray.get();
  },  
  openingStockTotal: () => {
      let fromDate = Template.instance().fromDate.get();
      let toDate = Template.instance().toDate.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('stockSummary.openingStockTotal',fromDate,toDate, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
           reject(error);
          }
        });
      });
      promiseVal.then((result) => {
        $('.openingStockTotal').html(result);
        $('#bodySpinLoaders').css('display', 'none');
      }).catch((error) => {
        $('.openingStockTotal').html('');
        $('#bodySpinLoaders').css('display', 'none');
      });
  },  
  openingStockTotalExport: () => {
      let fromDate = Template.instance().fromDateExport.get();
      let toDate = Template.instance().toDateExport.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('stockSummary.openingStockTotal',fromDate,toDate, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
           reject(error);
          }
        });
      });
      promiseVal.then((result) => {
        $('.openingStockTotalExport').html(result);
        $('#bodySpinLoaders').css('display', 'none');
      }).catch((error) => {
        $('.openingStockTotalExport').html('');
        $('#bodySpinLoaders').css('display', 'none');
      });
  },  
  soldStockTotal: () => {
      let fromDate = Template.instance().fromDate.get();
      let toDate = Template.instance().toDate.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('stockSummary.soldStockTotal',fromDate,toDate, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
           reject(error);
          }
        });
      });
      promiseVal.then((result) => {
        $('.soldStockTotal').html(result);
        $('#bodySpinLoaders').css('display', 'none');
      }).catch((error) => {
        $('.soldStockTotal').html('');
        $('#bodySpinLoaders').css('display', 'none');
      });
  },  
  soldStockTotalExport: () => {
      let fromDate = Template.instance().fromDateExport.get();
      let toDate = Template.instance().toDateExport.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('stockSummary.soldStockTotal',fromDate,toDate, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
           reject(error);
          }
        });
      });
      promiseVal.then((result) => {
        $('.soldStockTotalExport').html(result);
        $('#bodySpinLoaders').css('display', 'none');
      }).catch((error) => {
        $('.soldStockTotalExport').html('');
        $('#bodySpinLoaders').css('display', 'none');
      });
  },  
  closingStockTotal: () => {
      let fromDate = Template.instance().fromDate.get();
      let toDate = Template.instance().toDate.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('stockSummary.closingStockTotal',fromDate,toDate, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
           reject(error);
          }
        });
      });
      promiseVal.then((result) => {
        $('.closingStockTotal').html(result);
        $('#bodySpinLoaders').css('display', 'none');
      }).catch((error) => {
        $('.closingStockTotal').html('');
        $('#bodySpinLoaders').css('display', 'none');
      });
  } , 
  closingStockTotalExport: () => {
      let fromDate = Template.instance().fromDateExport.get();
      let toDate = Template.instance().toDateExport.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('stockSummary.closingStockTotal',fromDate,toDate, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
           reject(error);
          }
        });
      });
      promiseVal.then((result) => {
        $('.closingStockTotalExport').html(result);
        $('#bodySpinLoaders').css('display', 'none');
      }).catch((error) => {
        $('.closingStockTotalExport').html('');
        $('#bodySpinLoaders').css('display', 'none');
      });
  }
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.sdUserStockSummary.events({
  // 'click .view': (event, template) => {
  //   event.preventDefault();
  //   template.modalLoader.set(true);
  //   let id = event.currentTarget.id;
  //   let header = $('#orderHs');
  //   let employeeId = $('#employeeId');
  //   let subDistributor = $('#subDistributor');
  //   let vertical = $('#vertical');
  //   let product = $('#product');
  //   let stock = $('#stock');
  //   $('#orderDetailPage').modal();
  //   Meteor.call('StockSummary.userWiseListId', id, (error, result) => {
  //     if (!error) {
  //       let prod = result.productList;
  //       template.modalLoader.set(false);
  //       $(header).html('Details of Order');
  //       $(employeeId).html(result.empName);
  //       $(subDistributor).html(result.subDistributorName);
  //       $(vertical).html(result.verticalName);
  //       $(product).html(result.productName);
  //       $(stock).html(prod.stock);
  //     }
  //   });
  // },
  /**
     * TODO: Complete JS doc
     */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
*/
  // 'click #removeSearch': () => {
  //   document.getElementById('filterDisplay').style.display = "none";
  // },
  'submit .stock-filter': (event,template) => {
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

     if(first==='' && second===''){
      toastr['error']('Please fill Date');
     }
     toDate.setDate(toDate.getDate() + 1);
     if(fromDate && toDate && productName===''){
       Template.instance().pagination.settings.set('filters', {
          employeeId: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
        });
     }else if(fromDate && toDate && productName){
       Template.instance().pagination.settings.set('filters', {
          product:productName,
          employeeId: Meteor.userId(),
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
        });
     }else{
         Template.instance().pagination.settings.set('filters', {
            employeeId: Meteor.userId(),
            date: moment(new Date()).format('DD-MM-YYYY')
        });
     }

    // if (fromDate && isNaN(toDate)) {
    //   fromDate.setDate(fromDate.getDate() + 1);
    //   Template.instance().pagination.settings.set('filters', {
    //     employeeId: Meteor.userId(),
    //     createdAt: {
    //       $lte: fromDate
    //     },
    //   });
    // } else if (isNaN(fromDate) && toDate) {
    //   toDate.setDate(toDate.getDate() + 1);
    //   Template.instance().pagination.settings.set('filters', {
    //     employeeId: Meteor.userId(),
    //     createdAt: {
    //       $lte: toDate
    //     },
    //   });
    // } else if (fromDate && toDate) {

    //   if (fromDate.toString() === toDate.toString()) {
    //     toDate.setDate(toDate.getDate() + 1);
    //     Template.instance().pagination.settings.set('filters', {
    //       employeeId: Meteor.userId(),
    //       createdAt: {
    //         $gte: fromDate, $lt: toDate
    //       },
    //     });
    //   }
    //   else {
    //     toDate.setDate(toDate.getDate() + 1);
    //     Template.instance().pagination.settings.set('filters', {
    //       employeeId: Meteor.userId(),
    //       createdAt: {
    //         $gte: fromDate, $lt: toDate
    //       },
    //     });
    //   }

    // } else {
    //   Template.instance().pagination.settings.set('filters', {
    //     employeeId: Meteor.userId(),
    //     createdAt: moment(new Date()).format('DD-MM-YYYY')
    //   });
    // }
  },
  'click .reset': (event,template) => {
      template.fromDate.set(''); 
      template.toDate.set(''); 
      $('#fromDate').val('');
      $('#toDate').val('');
      Template.instance().pagination.settings.set('filters', {
      employeeId: Meteor.userId(),
      date: moment(new Date()).format('DD-MM-YYYY')
      });
  }, 
  'click .export': (event, template) => {
      let header = $('#deliveryExportH');
      $('#routeReportExportPage').modal();
      $(header).html('Export Details');
      $('.mainLoader').css('display', 'none');
      template.stockSummaryExport.set('');
      $('.startDate1').val('');
      $('.endDate1').val('');
  },
 'change .endDate1,.startDate1': (event, template) => {
        let sdate = $(".startDate1").val();
        let edate = $(".endDate1").val();
        let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
        let toDates = new Date(moment(edate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
        template.fromDateExport.set(fromDate);
        template.toDateExport.set(toDates);
         Meteor.call('stockSummary.sdUserstockWdate',Meteor.userId(),fromDate,toDates, (err, res) => {
            if (!err){
              if (res.length === 0) {
                setTimeout(function () {
                  $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
                }, 0);
                setTimeout(function () {
                  $('#emptyDataSpan').fadeOut('slow');
                }, 3000);
              }
              else {
                template.stockSummaryExport.set(res);
              }
         } 
        });
    },
   'click .exportToday': (event, template) => {
      event.preventDefault();
      $('#routeReportExportPage').modal('hide');
      let exportValue = template.stockSummaryExport.get();
      if (exportValue.length==0) {
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
          urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
            .then(function (file) {

              saveAs(file, "Stock Summary Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
            });
          $("#exportButtons").prop('disabled', false);
        }, 5000);
      } 
  }
});
