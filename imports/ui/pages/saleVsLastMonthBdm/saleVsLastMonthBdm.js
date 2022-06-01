/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { allUsers } from "../../../api/user/user";

Template.saleVsLastMonthBdm.onCreated(function () {
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
  this.sdName = new ReactiveVar();
  this.userList = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.sdNameExport = new ReactiveVar();
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  let vertical = Session.get('loginUserVerticals');
  this.pagination = new Meteor.Pagination(allUsers, {
    filters: {
      userType: 'SD', active: 'Y', vertical: { $in: vertical }
    },
    fields: { profile: 1 },
    perPage: 20
  });
});

Template.saleVsLastMonthBdm.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('user.sdListGet', loginUserVerticals, (err, res) => {
    if (!err)
      this.userNameArray1.set(res);
  });
  this.sdName.set('');
  $('.selectSDName').select2({
    placeholder: "Select SD Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName").parent(),
  });
  $('.selectSDName1').select2({
    placeholder: "Select SD Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName1").parent(),
  });
  let date = new Date();
  Template.instance().fromDate.set(new Date(moment(new Date()).format('YYYY-MM-01 00:00:00.0')))
  Template.instance().toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')))

  let fromDate = Template.instance().fromDate.get();
  let toDate = Template.instance().toDate.get();
  Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, Meteor.userId(), (err, res) => {
    if (!err) {
      $('#total').html(res.total.toFixed(2));
      $('#gtotal').html(res.gtotal.toFixed(2));
      $('#ltotal').html(res.ltotal.toFixed(2));
      $('#lgtotal').html(res.lgtotal.toFixed(2));
    }
  });
});
let loginUserVerticals = Session.get("loginUserVerticals");

Template.saleVsLastMonthBdm.helpers({
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
  lastMonthSaleQty: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  lastMonthSaleValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  currentSaleQty: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  currentSaleValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  lastMonthSaleQtyExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  lastMonthSaleValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  currentSaleQtyExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  currentSaleValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, id, (error, result) => {
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
  }
  , sdList: () => {
    return Template.instance().userNameArray1.get();

  },
  getLtotal: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let sdName = Template.instance().sdName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.ltotal);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.ltotalvalue_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.ltotalvalue_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  getLgtotal: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let sdName = Template.instance().sdName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.lgtotal);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lgtotalvalue_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.lgtotalvalue_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  getTotal: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let sdName = Template.instance().sdName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.total);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.totalvalue_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.totalvalue_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  getGtotal: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let sdName = Template.instance().sdName.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.gtotal);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.gtotalvalue_').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.gtotalvalue_').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  getLtotalExport: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let sdName = Template.instance().sdNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.ltotal);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.ltotalvalueExport_').html(result);
    }).catch((error) => {
      $('.ltotalvalueExport_').html('');
    });
  },
  getLgtotalExport: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let sdName = Template.instance().sdNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.lgtotal);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.lgtotalvalueExport_').html(result);
    }).catch((error) => {
      $('.lgtotalvalueExport_').html('');
    });
  },
  getTotalExport: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let sdName = Template.instance().sdNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.total);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.totalvalueExport_').html(result);
    }).catch((error) => {
      $('.totalvalueExport_').html('');
    });
  },
  getGtotalExport: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let sdName = Template.instance().sdNameExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleLastMonthBdm1', fromDate, toDate, vertical, sdName, (error, result) => {
        if (!error) {
          resolve(result.gtotal);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.gtotalvalueExport_').html(result);
    }).catch((error) => {
      $('.gtotalvalueExport_').html('');
    });
  }, listofExport: () => {
    return Template.instance().userList.get();
  },
  // 'change .endDate1': (event, template) => {
  //     let sdate = $(".startDate1").val();
  //     let edate = $(".endDate1").val();
  //     let vertical = $("#verticalfilters").val();
  //     let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
  //     let toDates = new Date(moment(edate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
  //     let vtArray = [];
  //     vtArray.push(vertical);
  //     template.fromDate.set(fromDate);
  //     template.toDate.set(toDates);
  //     template.verticalVar.set(vertical);
  //      Meteor.call('branch.verticalBranch',vtArray, (err, res) => {
  //         if (!err)
  //         template.listBranch.set(res);
  //     });
  //     }

});


Template.saleVsLastMonthBdm.events({
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
    let sdName = event.target.selectSDName.value;
    template.fromDate.set(fromDate);
    template.toDate.set(toDate);
    template.sdName.set(sdName);
    let vertical1 = Session.get('loginUserVerticals');

    if (sdName && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        _id: sdName
      });
    } else if (sdName === '' && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: vertical1 },
        userType: 'SD', active: 'Y',
        // createdAt: {
        //    $lte: fromDate
        // }
      });
    } else if (sdName === '' && isNaN(fromDate) && toDate) {
      toDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: vertical1 },
        userType: 'SD', active: 'Y',
      });
    } else if (sdName && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        _id: sdName,
        vertical: { $in: vertical1 },
        userType: 'SD', active: 'Y',
      });
    } else if (sdName === '' && fromDate && toDate) {

      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          vertical: { $in: vertical1 },
          userType: 'SD', active: 'Y'
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          vertical: { $in: vertical1 },
          userType: 'SD', active: 'Y'
        });
      }

    } else if (sdName && isNaN(fromDate) && toDate) {
      toDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        _id: sdName,
        vertical: { $in: vertical1 },
        userType: 'SD', active: 'Y'
      });
    } else if (sdName && fromDate && toDate) {

      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          _id: sdName,
          vertical: { $in: vertical1 },
          userType: 'SD', active: 'Y'
        });
      }
      else {

        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          _id: sdName,
          vertical: { $in: vertical1 },
          userType: 'SD', active: 'Y'
        });
      }
    } else {
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: vertical1 },
        userType: 'SD', active: 'Y',
      });
    }
    Meteor.call('creditSale.saleLastMonthBdm', fromDate, toDate, Meteor.userId(), (err, res) => {
      if (!err) {
        $('#total').html(res.total.toFixed(2));
        $('#gtotal').html(res.gtotal.toFixed(2));
        $('#ltotal').html(res.ltotal.toFixed(2));
        $('#lgtotal').html(res.lgtotal.toFixed(2));
      }
    });
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.userList.set('');
    $('#selectSDName1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let sd = $("#selectSDName1").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDates);
    template.sdNameExport.set(sd);
    let vertical = Session.get("loginUserVerticals");
    template.modalLoader.set(true);
    template.userList.set('');
    Meteor.call('user.userlistMarket', sd, vertical, (err, res) => {
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
          setTimeout(function () {
            $("#emptyDataSpan").html('<style> #emptyDataSpans { color:#2ECC71 }</style><span id ="emptyDataSpans">Records are ready for export.</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');
          }, 3000);
          template.userList.set(res);
        }
      }
      else {
        template.modalLoader.set(false);
      }
    });
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 */
  'change #selectSDName1': (event, template) => {
    $(".startDate1").val('');
    $(".endDate1").val('');
    template.userList.set('');
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

            saveAs(file, "Sale vs Lat Month Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },
  'click .reset': (events, template) => {
    let verticals = Session.get("loginUserVerticals");
    $("#selectSDName").val('').trigger('change');
    let date = new Date();
    Template.instance().fromDate.set(new Date(moment(new Date()).format('YYYY-MM-01 00:00:00.0')))
    Template.instance().toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')))
    template.sdName.set('');
    Template.instance().pagination.settings.set('filters', {
      userType: 'SD', active: 'Y', vertical: { $in: verticals }
    });
    $('form :input').val("");
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }

});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});