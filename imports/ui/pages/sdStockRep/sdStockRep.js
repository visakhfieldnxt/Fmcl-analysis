/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { allUsers } from "../../../api/user/user";

Template.sdStockRep.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.modalLoader = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.verticalArray1 = new ReactiveVar();
  this.listArray1 = new ReactiveVar();
  this.regionArray = new ReactiveVar();
  this.userNameArray1 = new ReactiveVar();
  this.listSd = new ReactiveVar();
  this.filterCheck = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.toDate = new ReactiveVar();

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);
  let loginUserVerticals = Session.get("loginUserVerticals");
  this.pagination = new Meteor.Pagination(allUsers, {
    filters: {
      vertical: { $in: loginUserVerticals },
      userType: 'SD',
      active: "Y"
    }, sort: {
      'profile.firstName': 1
    },
    perPage: 20
  });
});

Template.sdStockRep.onRendered(function () {
  let loginUserVerticals = Session.get("loginUserVerticals");
  this.filterCheck.set(false);
  $('#bodySpinLoaders').css('display', 'block');
  Meteor.call('user.userNameGetNew', loginUserVerticals, (err, res) => {
    if (!err)
      this.userNameArray1.set(res);
  });

  $('.selectSDName').select2({
    placeholder: "Select Sub Distributor Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName").parent(),
  });
  $('.selectSDName1').select2({
    placeholder: "Select Sub Distributor Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName1").parent(),
  });

  let date = new Date();
  this.fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
  this.toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
});

Template.sdStockRep.helpers({

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
   * hide or shows total amt
   */
  totalAmtShows: () => {
    let filterRes = Template.instance().filterCheck.get();
    if (filterRes === false) { return true }
    else {
      return false;
    }

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
  vanQuantity: (id) => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.sdStockList', loginUserVerticals, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.vanqty_' + id).html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.vanqty_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  vanQuantityTotal: () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.vanQuantityTotal', loginUserVerticals, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.vanQuantityTotal').html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.vanQuantityTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  vanstockvalue: (id) => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.wareHousestockvalue', loginUserVerticals, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.vanstockvalue_' + id).html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.vanstockvalue_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  vanstockvalueTotal: () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.vanstockvalueTotal', loginUserVerticals, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.vanstockvalueTotal').html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.vanstockvalueTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  sdStockqty: (id) => { //1
    let loginUserVerticals = Session.get("loginUserVerticals");
    let date = new Date();
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.sdStockWarehouseList', loginUserVerticals, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.sdStockqty_' + id).html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.sdStockqty_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  sdStockqtyTotal: () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.sdStockqtyTotal', loginUserVerticals, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.sdStockqtyTotal').html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.sdStockqtyTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  sdStockValueCal: (id) => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.sdStockWarehouseValueSD', loginUserVerticals, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.sdStockvalue_' + id).html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.sdStockvalue_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  sdStockValueCalTotal: () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.sdStockValueCalTotal', loginUserVerticals, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.sdStockValueCalTotal').html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.sdStockValueCalTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  totalqty: (id) => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.totalqty', loginUserVerticals, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.totalqty_' + id).html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.totalqty_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  totalqtyTotal: () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.totalqtyTotal', loginUserVerticals, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.totalqtyTotal').html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.totalqtyTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  totalvalue: (id) => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.totalvalue', loginUserVerticals, id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.totalvalue_' + id).html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.totalvalue_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  totalvalueTotal: () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('wareHouseStock.totalvalueTotal', loginUserVerticals, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      let res = Number(result).toFixed(2);
      $('.totalvalueTotal').html(res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.totalvalueTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  sdList: () => {
    let useDta = Template.instance().userNameArray1.get();
    return useDta;
  },
  sdListExpo: () => {
    let useDta = Template.instance().listSd.get();
    return useDta;
  }
});


Template.sdStockRep.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }, 'submit .order-filter': (event, template) => {
    event.preventDefault();
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let sdName = event.target.selectSDName.value;
    let loginUserVerticals = Session.get("loginUserVerticals");
    template.filterCheck.set(true);
    if (sdName && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        _id: sdName,
        vertical: { $in: loginUserVerticals },
        userType: 'SD',
        active: "Y"
      });
    }
    else if (sdName === '' && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: loginUserVerticals },
        userType: 'SD',
        active: "Y"
      });
    }
    else if (sdName === '' && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: loginUserVerticals },
        userType: 'SD',
        active: "Y",
        createdAt: {
          $lte: fromDate
        }
      });
    } else if (sdName === '' && isNaN(fromDate) && toDate) {
      toDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: loginUserVerticals },
        userType: 'SD',
        active: "Y",
        createdAt: {
          $lte: toDate
        }
      });
    } else if (sdName && fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        _id: sdName,
        vertical: { $in: loginUserVerticals },
        userType: 'SD',
        active: "Y",
        createdAt: {
          $lte: fromDate
        }
      });
    } else if (sdName === '' && fromDate && toDate) {

      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          vertical: { $in: loginUserVerticals },
          userType: 'SD',
          active: "Y",
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          vertical: { $in: loginUserVerticals },
          userType: 'SD',
          active: "Y",
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }

    } else if (sdName && isNaN(fromDate) && toDate) {
      toDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        _id: sdName,
        vertical: { $in: loginUserVerticals },
        userType: 'SD',
        active: "Y",
        createdAt: {
          $lte: toDate
        }
      });
    } else if (sdName && fromDate && toDate) {

      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          _id: sdName,
          vertical: { $in: loginUserVerticals },
          userType: 'SD',
          active: "Y",
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          _id: sdName,
          vertical: { $in: loginUserVerticals },
          userType: 'SD',
          active: "Y",
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
    } else {
      Template.instance().pagination.settings.set('filters', {
        vertical: { $in: loginUserVerticals },
        userType: 'SD',
        active: "Y"
      });
    }
  },
  // 'submit .order-filter': (event, template) => {
  //   event.preventDefault();
  //   let first = $("#fromDate").val();
  //   let second = $("#toDate").val();
  //   let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
  //   let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
  //   let fromDate = new Date(dateOne);
  //   let toDate = new Date(dateTwo);
  //   let sdName = event.target.selectSDName.value;
  //   let loginUserVerticals = Session.get("loginUserVerticals");
  //   template.filterCheck.set(true);
  //   template.fromDate.set(fromDate);
  //   template.toDate.set(toDate);
  //   // if(first==='' && second===''){
  //   //   toastr['error']('Please fill up Date s');
  //   //   return;
  //   // }

  //   if (sdName === '' && fromDate && toDate) {
  //       toDate.setDate(toDate.getDate() + 1);
  //       Template.instance().pagination.settings.set('filters', {
  //         vertical: { $in: loginUserVerticals },
  //         userType: 'SD',
  //         // createdAt: {
  //         //   $gte: fromDate, $lt: toDate
  //         // }
  //       });
  //   } else if (sdName && fromDate && toDate) {
  //       toDate.setDate(toDate.getDate() + 1);
  //       Template.instance().pagination.settings.set('filters', {
  //         _id: sdName,
  //         vertical: { $in: loginUserVerticals },
  //         userType: 'SD',
  //         // createdAt: {
  //         //   $gte: fromDate, $lt: toDate
  //         // }
  //       });
  //   } else {
  //     Template.instance().pagination.settings.set('filters', {
  //       vertical: { $in: loginUserVerticals },
  //       userType: 'SD',
  //     });
  //   }
  // },
  'click .reset': (event, template) => {
    template.filterCheck.set(false);
    let loginUserVerticals = Session.get("loginUserVerticals");
    Template.instance().pagination.settings.set('filters', {
      vertical: { $in: loginUserVerticals }, userType: 'SD',
      active: "Y"
    });
    $('form :input').val("");
    $("#selectSDName").val('').trigger('change');
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.listSd.set('');
    $('#selectSDName1').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change #selectSDName1': (event, template) => {
    let sd = $("#selectSDName1").val();
    template.listSd.set('');
    if (sd) {
      template.modalLoader.set(true);
      Meteor.call('user.userNameGetNew1', sd, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.listSd.set(res);
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
    let exportValue = template.listSd.get();
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

            saveAs(file, "SD Stock Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});


