/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { CreditSale } from "../../../api/creditSale/creditSale";
import { Branch } from "../../../api/branch/branch";

Template.regionWiseSalesBdmReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.modalLoader = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.verticalArray1 = new ReactiveVar();
  this.listArray1 = new ReactiveVar();
  this.regionArray = new ReactiveVar();
  this.routeExportData = new ReactiveVar();
  this.listBranch = new ReactiveVar();
  this.listBranch1 = new ReactiveVar();
  this.verticalVar = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.verticalVarExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.regionVar = new ReactiveVar();
  this.regionVarExport = new ReactiveVar();
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);

  this.pagination = new Meteor.Pagination(Branch, {
    filters: {
      active: "Y"
    },
    fields: {
      branchName: 1
    },
    perPage: 20
  });
});

Template.regionWiseSalesBdmReport.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  Meteor.call('verticals.verticalList', (err, res) => {
    if (!err) {
      this.verticalArray1.set(res);
    }
  });
  $('.verticalfilter').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilter").parent(),
  });

  $('.regionfilter').select2({
    placeholder: "Select Region Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".regionfilter").parent(),
  });

  $('.verticalfilters').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilters").parent(),
  });
  $('.regionName').select2({
    placeholder: "Select Region",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".regionName").parent(),
  });


  let loginverticals = Session.get("loginUserVerticals");
  // this.verticalVar.set(loginverticals);
  this.verticalVar.set(null);
  this.verticalVarExport.set(loginverticals);

  let date = new Date();
  this.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  this.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
  this.toDateExport.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  this.fromDateExport.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
  Meteor.call('branch.branchList', (err, res) => {
    if (!err) {
      this.regionArray.set(res);
    }
  });
  Meteor.call('branch.branchList', (branchError, branchResult) => {
    //,vertical branchListVertical
    if (!branchError) {
      this.branchNameArray.set(branchResult);
    }
  });

});

Template.regionWiseSalesBdmReport.helpers({

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
    return Template.instance().verticalArray1.get();

  }, listOfData: function () {
    return Template.instance().listArray1.get();

  }, listofRegion: function () {
    return Template.instance().regionArray.get();

  }, branchLists: function () {
    return Template.instance().branchNameArray.get();
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
  getRegionName: (region) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("branch.id", region, (error, result) => {
        let bName = '';
        if (result) {
          bName = result.branchName;
        }
        if (!error) {
          resolve(bName);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.regionIdVal_' + region).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.regionIdVal_' + region).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  }, dates: (date) => {
    if (date != '')
      return moment(date).format('DD-MM-YYYY');

  },
  roundIt: (value) => {
    return value.toFixed(2);
  }, dataList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return result;

  },
  salesByVolume: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalVar.get();

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesRegMdVolume', id, fromDate, toDate, vertical, (error, result) => {
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
  salesByVolumeExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalVarExport.get();

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesRegMdVolume', id, fromDate, toDate, vertical, (error, result) => {
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
  salesByValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let vertical = Template.instance().verticalVar.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesRegMdValue', id, fromDate, toDate, vertical, (error, result) => {
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
  salesByValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let vertical = Template.instance().verticalVarExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesRegMdValue', id, fromDate, toDate, vertical, (error, result) => {
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
    let vertical = Template.instance().verticalVar.get();
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let regionVar = Template.instance().regionVar.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleVolumeRegMdTotal', fromDate, toDate, vertical, regionVar, (error, result) => {
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
  saleVolumeTotalExport: () => {
    let vertical = Template.instance().verticalVarExport.get();
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let regionVar = Template.instance().regionVarExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleVolumeRegMdTotal', fromDate, toDate, vertical, regionVar, (error, result) => {
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
  saleValueTotal: () => {
    let vertical = Template.instance().verticalVar.get();
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let regionVar = Template.instance().regionVar.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleValueRegMdTotal', fromDate, toDate, vertical, regionVar, (error, result) => {
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
  saleValueTotalExport: () => {
    let vertical = Template.instance().verticalVarExport.get();
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let regionVar = Template.instance().regionVarExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleValueRegMdTotal', fromDate, toDate, vertical, regionVar, (error, result) => {
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
  }, datesfrom: (id) => {
    return moment(Template.instance().fromDate.get()).format('DD-MM-YYYY');
  }, datesto: (id) => {
    return moment(Template.instance().toDate.get()).format('DD-MM-YYYY');
  }, datesfromExport: (id) => {
    return moment(Template.instance().fromDateExport.get()).format('DD-MM-YYYY');
  }, datestoExport: (id) => {
    return moment(Template.instance().toDateExport.get()).format('DD-MM-YYYY');
  },
  bnLists: () => {
    return Template.instance().listBranch1.get();
  }
});


Template.regionWiseSalesBdmReport.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'click #subIdSubmit': (event, template) => {
    event.preventDefault();
    // $('#bodySpinLoaders').css('display', 'block');
    let verticalName = $('#verticalfilter').val();
    let region = $('#regionName').val();
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let verticalVar = [];
    verticalVar.push(verticalName);
    template.regionVar.set(null);

    if (first === '' || second === '') {
      toastr['error']('Please fill up all Date s');
      return;
    }
    template.fromDate.set(fromDate);
    template.toDate.set(toDate);
    if (verticalName && region === '' && fromDate && toDate) {
      template.verticalVar.set(verticalName);
      template.regionVar.set(null);
      Template.instance().pagination.settings.set('filters', {
        active: "Y"
      });
    } else if (verticalName === '' && region && fromDate && toDate) {
      template.verticalVar.set(null);
      template.regionVar.set(region);
      Template.instance().pagination.settings.set('filters', {
        _id: region,
        active: "Y"
      });
    } else if (verticalName && region && fromDate && toDate) {
      template.verticalVar.set(verticalName);
      template.regionVar.set(region);
      Template.instance().pagination.settings.set('filters', {
        _id: region,
        active: "Y"
      });
    } else if (verticalName === '' && region === '' && fromDate && toDate) {
      template.verticalVar.set(null);
      template.regionVar.set(null);
      Template.instance().pagination.settings.set('filters', {
        active: "Y"
      });
    } else {
      template.verticalVar.set(verticalName);
      template.regionVar.set(region);
      Template.instance().pagination.settings.set('filters', {
        _id: region,
        active: "Y"
      });
    }
  },
  'click .reset': (event, template) => {
    let date = new Date();
    template.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
    template.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
    $("#regionfilter").val('').trigger('change');
    $("#verticalfilter").val('').trigger('change');
    $("#regionName").val('').trigger('change');
    template.verticalVar.set(null);
    template.regionVar.set(null);

    Template.instance().pagination.settings.set('filters', {
      active: "Y"
    });
    $('#itemArrayspan1').html('');
    $('form :input').val("");
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('.exportToday').prop("disabled", true);
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.routeExportData.set('');
    $('#verticalfilters').val('').trigger('change');;
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'submit #exportByModal': (event, template) => {
    event.preventDefault();
    let fromDate = $(".startDate1").val().toString();
    let toDates = $(".endDate1").val().toString();
    let vertical = event.target.verticalfilters.value;
    fromDate = new Date(moment(fromDate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    toDates = new Date(moment(toDates, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.toDate.set(toDates);
    template.fromDate.set(fromDate);
  },
  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let vertical = $("#verticalfilters").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0")); 
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDates);
    template.verticalVarExport.set(vertical);
    template.regionVarExport.set(null);
    template.listBranch1.set('');
    Meteor.call('branch.verticalBranch', vertical , (err, res) => {
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
          setTimeout(function () {
            $("#emptyDataSpan").html('<style> #emptyDataSpans { color:#2ECC71 }</style><span id ="emptyDataSpans">Records are ready for export.</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');

          }, 3000);
          template.listBranch1.set(res);
        }
      }
    });
  },
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportValue = template.listBranch1.get();
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

            saveAs(file, "Region wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
    Template.instance().pagination.settings.set('filters', {
      active: 'Y'
    });
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  'change #verticalfilters': (event, template) => {
  $('#startDate1').val('');
  $('#endDate1').val('');
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});