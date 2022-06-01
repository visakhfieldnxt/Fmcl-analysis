/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { allUsers } from '../../../api/user/user';
Template.subDWiseSalesRep.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
  this.userNameArray1 = new ReactiveVar();
  this.userNameArray2 = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.routeExportData = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.routeUpdatedData = new ReactiveVar();
  this.assignedHistoryData = new ReactiveVar();
  this.vansaleUserFullList = new ReactiveVar();
  this.customerUserDetail = new ReactiveVar();
  this.modalLoaderBody = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.routeCodeList = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.userNameTable = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.sdName = new ReactiveVar();
  this.sdNameExport = new ReactiveVar();

  this.pagination = new Meteor.Pagination(allUsers, {
    sort: {
      createdAt: -1
    },
    filters: {
      userType: "SD",active:"Y"
    },
    fields:{profile:1},
    perPage: 25
  });
});
Template.subDWiseSalesRep.onRendered(function () {
  this.modalLoaderBody.set(false);
  $('#bodySpinLoaders').css('display', 'block');
   Meteor.call('verticals.verticalList', (err, res) => {
        if (!err) {
            this.verticalArray.set(res);
        }
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
    $('.selectSDNames').select2({
        placeholder: "Select SD Name",
        tokenSeparators: [','],
        allowClear: true,
        dropdownParent: $(".selectSDNames").parent(),
      });
  
  Meteor.call('user.userNameGet', (err, res) => {
    if (!err)
      // Session.set("userNameArray",res);
      this.userNameArray.set(res)
  });


  $('.selectRouteName').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteName").parent(),
  });  
  $('.selectSDName').select2({
    placeholder: "Select SD Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName").parent(),
  });
  // Template.instance().toDate.set(moment(new Date()).format('DD-MM-YYYY'))
  Template.instance().toDate.set( moment(new Date()).format('YYYY-MM-DD 00:00:00.0'))
  Template.instance().fromDate.set(moment(new Date()).format('YYYY-MM-01 00:00:00.0'))
});
Template.subDWiseSalesRep.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },

  verticalsList: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('vertical.findName', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalid_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalid_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesVolume: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSales', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
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
  salesVolumeExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSales', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
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
  salesValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalAmount', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.salesVal_' + id).html(result.toFixed(2));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.salesVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalAmount', id, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.salesValExport_' + id).html(result.toFixed(2));
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.salesValExport_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleVolumeTotal : () => {
      let fromDate = Template.instance().fromDate.get();
      let toDate = Template.instance().toDate.get();
      let sdName = Template.instance().sdName.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('creditSale.gTotalValueTotal',sdName, fromDate, toDate, (error, result) => {
          if (!error) {
            resolve(result);
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
  saleVolumeTotalExport : () => {
      let fromDate = Template.instance().fromDateExport.get();
      let toDate = Template.instance().toDateExport.get();
      let sdName = Template.instance().sdNameExport.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('creditSale.gTotalValueTotal',sdName, fromDate, toDate, (error, result) => {
          if (!error) {
            resolve(result);
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
  saleValueTotal : () => {
      let fromDate = Template.instance().fromDate.get();
      let toDate = Template.instance().toDate.get();
      let sdName = Template.instance().sdName.get();
      let promiseVal = new Promise((resolve, reject) => {
        Meteor.call('creditSale.gTotalAmountTotal',sdName, fromDate, toDate, (error, result) => {
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
  saleValueTotalExport : () => {
      let fromDate = Template.instance().fromDateExport.get();
      let toDate = Template.instance().toDateExport.get();
      let sdName = Template.instance().sdNameExport.get();
      let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.gTotalAmountTotal',sdName, fromDate, toDate, (error, result) => {
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
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  /**
   * 
   * @param {*} dates 
   * formatting date time
   */

  dateFormats: (dates) => {
    if (dates) {
      return moment(dates).format('DD-MM-YYYY hh:mm A');
    }
    else {
      return '';
    }
  },
  routeDataList: () => {
    return Template.instance().routeUpdatedData.get();

  },
  /**
* get vansale user name
*/

  routeCodeHelp: (id) => {
    let routeData = Template.instance().routeCodeList.get();
    if (routeData) {
      let res = routeData.find(x => x._id === id);
      if (res) {
        return res.routeCode;
      }
    }
  },
  /**
  * get vansale user name
  */

  routeNameHelp: (id) => {
    let routeData = Template.instance().routeCodeList.get();
    if (routeData) {
      let res = routeData.find(x => x._id === id);
      if (res) {
        return res.routeName;
      }
    }
  },
  /**
  * get vansale user name
  */

  routeBranchHelp: (id) => {
    let routeData = Template.instance().routeCodeList.get();
    let branchNameArrayData = Template.instance().branchNameArray.get();
    if (routeData) {
      let res = routeData.find(x => x._id === id);
      if (res) {
        let branchRes = branchNameArrayData.find(x => x.bPLId === res.branchCode);
        if (branchRes) {
          return branchRes.bPLName;
        }
      }
    }
  },
  /**
  * get vansale user name
  */

  vanUserName: (id) => {
    let userData = Template.instance().vansaleUserFullList.get();
    if (userData) {
      let res = userData.find(x => x._id === id);
      if (res) {
        return `${res.profile.firstName} ${res.profile.lastName}`;
      }
    }
  },
  /**
* TODO:Complete JS doc
* @param docDate
*/
  timeSeperate: (docDate) => {
    return moment(docDate).format('hh:mm:ss A');
  },

  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  orderes: function () {
    let exportValue = Template.instance().pagination.getPage();
    if (exportValue.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    Template.instance().todayExport.set(exportValue);
    return Template.instance().pagination.getPage();
  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
  },

  printLoadBody: () => {
    let res = Template.instance().modalLoaderBody.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
 * TODO:Complete JS doc
 * @param discPrcnt 
 */
  discountFormat: (discPrcnt) => {
    return Number(discPrcnt).toFixed(6);
  },
  /**
 * TODO:Complete JS doc
 * @param discPrcnt 
 */
  diff: (itQuantity, deliveredQuantity) => {
    return Number(itQuantity - deliveredQuantity).toFixed(6);
  },


  /**
  * TODO: Complete Js doc
  * @param assignedBy
  */
  username: (assignedTo) => {
    let userAr = Template.instance().userNameArray.get();
    if (assignedTo) {
      if (userAr) {
        return userAr.find(x => x._id === assignedTo).profile.firstName;
      }
    }
  },
  sdList: () => {
    let useDta = Template.instance().userNameArray1.get();
    if (useDta) {
      return useDta.filter(x => x.userType === 'SD' && x.active === 'Y');
    } else {
      return [];
    }
  },
  sdList1: () => {
    let useDta = Template.instance().userNameArray2.get();
    if (useDta) {
      return useDta.filter(x => x.userType === 'SD' && x.active === 'Y');
    } else {
      return [];
    }
  }, 
  sdLists: () => {
    return Template.instance().userNameTable.get();
  },
  /**
 * TODO: Complete Js doc
 * @param deliveredBy
 */
  customerNameHelp: (cardCode) => {
    let custAr = Template.instance().customerUserDetail.get();
    if (custAr) {
      return custAr.find(x => x.cardCode === cardCode).cardName;
    }
  },
  /**
* TODO:Complete JS doc
*/
  routeList: function () {
    return Template.instance().routeCodeList.get();
  },
  /**
 * get vansale user name
 */

  custNameHelp: (cardCode) => {
    let custData = Template.instance().customerNameArray.get();
    if (custData) {
      let res = custData.find(x => x.cardCode === cardCode);
      if (res) {
        return res.cardName;
      }
    }
  },

  /**
     * TODO: Complete JS doc
     * @returns {*}
     */
  delivery: function () {
    let deliveryList = Session.get("deliveryss");
    return deliveryList;
  },
  /**
  * TODO: Complete JS doc
  * @returns {*}
  */
  orderByDateExport: function () {
    return Template.instance().routeExportData.get();
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
  items: () => {
    return Template.instance().itemsDetailsList.get();
  },
  routeDataDetails: () => {
    return Template.instance().routeUpdatedData.get();

  },

  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  dateFormat: (docDate) => {
    let res = moment(docDate).format('DD-MM-YYYY hh:mm A');
    return res.toString();
  },
  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
  },


  /**
  * get assigned data
  */
  assignedData: () => {
    return Template.instance().assignedHistoryData.get();
  },
  /**
   * find no.of customers
   */
  arrayLength: (customers) => {
    if (customers) {
      return customers.length;
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
  },
   vertical1: function () {
    return Template.instance().verticalArray.get();

  }
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.subDWiseSalesRep.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let fromDate =$("#fromDate").val().toString();
    let toDates = $("#toDate").val().toString();
    let sdName = $("#selectSDName").val();
    if (sdName !== null && fromDate != '' && toDates != '' ) {
      fromDate = moment(fromDate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      toDates = moment(toDates,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      template.toDate.set(toDates );
      template.fromDate.set(fromDate);
      template.sdName.set(sdName);
        Template.instance().pagination.settings.set('filters', {
          _id: sdName,
        }); 
    }
    else {
      toastr['error']("Please fill up all fields");
      Template.instance().pagination.settings.set('filters', { userType: 'SD' });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (events,template) => {
    $("#verticalfilter").val('').trigger('change');
    $("#selectSDName").val('').trigger('change');
    template.sdName.set(null);
      Template.instance().toDate.set( moment(new Date()).format('YYYY-MM-DD 00:00:00.0'))
      Template.instance().fromDate.set(moment(new Date()).format('YYYY-MM-01 00:00:00.0'))
      // let sdName = Template.instance().sdName.get();
    Template.instance().pagination.settings.set('filters', {
      userType: 'SD',active:"Y"
    });
    $('form :input').val("");
  },
  /**
      * TODO:Complete JS doc
      * @param event
      */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set(true);
    template.itemsDetailsList.set('');
    template.assignedHistoryData.set('');
    template.routeUpdatedData.set('');
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let routeCode = $('#detailrouteCode');
    let routeName = $('#detailrouteName');
    let description = $('#detailDescription');
    let dateVal = $('#detailDate');
    let detailStatus = $('#detailStatus');
    let detailBranch = $('#detailBranch');
    let detailedAssignedBy = $('#detailedAssignedBy');
    let detailedAssignedTo = $('#detailedAssignedTo');
    let detailedAssigneeRemark = $('#detailedAssigneeRemark');
    let detailedAssignedDate = $('#detailedAssignedDate');
    let detailDateEnd = $('#detailDateEnd');
    $('#orderDetailPage').modal();
    Meteor.call('routeAssign.id', id, (err, res) => {
      if (!err) {
        $(header).html('Details of Route');
        $(routeCode).html(res.routeGrpRes.routeCode);
        $(routeName).html(res.routeGrpRes.routeName);
        $(description).html(res.routeGrpRes.description);
        $(detailedAssignedBy).html(res.assignedByName);
        $(detailedAssignedTo).html(res.assignedToName);
        $(detailedAssigneeRemark).html(res.routeAssignRes.remarks);
        if (res.routeAssignRes.assignedAt !== '') {
          $(detailedAssignedDate).html(moment(res.routeAssignRes.assignedAt).format('DD-MM-YYYY hh:mm A'));
        }
        else {
          $(detailedAssignedDate).html('');
        }
        $(dateVal).html(res.routeAssignRes.routeDate);
        $(detailDateEnd).html(res.routeAssignRes.routeDateEnd);
        if (res.branchName !== undefined) {
          $(detailBranch).html(res.branchName);
        }
        else {
          $(detailBranch).html('');
        }
        $(detailStatus).html(res.routeAssignRes.routeStatus);
        template.modalLoader.set(false);
        template.itemsDetailsList.set(res.customerDetailsArray);
        template.routeUpdatedData.set(res.routeUpdatesArray);
      }
      else {
        template.modalLoader.set(false);
      }
    });
  },
  /**
     * TODO: Complete JS doc
     */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
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
  'submit .exportByDate': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().routeExportData.get();
    if (exportData.length === 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#exportButtons").prop('disabled', true);
      $("#routeReportExportPage").modal('hide');
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

            saveAs(file, "Route Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('form :input').val("");
      }, 5000);
    }
  },

  /**
   * TODO:CompleteJS doc
   */
  'change .startDate': () => {
    $(".endDate").attr("disabled", false);
  },
  /**
   * TODO:CompleteJS doc
   */
  'change .endDate': (event, template) => {
    let startDate = $('.startDate').val();
    let endDate = $('.endDate').val();
    $('.mainLoader').css('display', 'block');
    let dateOne = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    toDate.setDate(toDate.getDate() + 1);
    template.modalLoader.set(false);
    if (startDate.toString() !== 'Invalid Date') {
      template.modalLoader.set(true);
      Meteor.call('routeAssign.export', fromDate, toDate, (err, res) => {
        if (!err) {
          template.routeExportData.set(res);
          template.modalLoader.set(false);
          // console.log("ress", res);
          if (res.length === 0) {
            toastr["error"]('No Records Found');
          }
        }
        else {
          template.modalLoader.set(false);
        }
      });
    }
    else {
      template.modalLoader.set(false);
      $(window).scrollTop(0);
      $("#startDateSpan").html('<font color="#fc5f5f" size="2">Please select a valid date</font>');
      setTimeout(function () {
        $('#startDateSpan').delay(5000).fadeOut('slow');
      }, 5000);
      $('.mainLoader').css('display', 'none');
    }
  },
  /**
   * TODO:Complete JS doc
   */

  'click .exportClose': (event, template) => {
    $('form :input').val("");
    $('#startDateSpan').html('');
    template.routeExportData.set('');
    $(".endDate").attr("disabled", true);
    $('.mainLoader').css('display', 'none');

  },
  /**
    * TODO:Complete JS doc
    */
  'click .export': (event, template) => {
    $(".exportToday").prop('disabled', true);
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.routeExportData.set('');
      $('#verticalfilters').val('').trigger('change');
      $('#selectSDNames').val('').trigger('change');
      $('.startDate1').val('');
      $('.endDate1').val('');
  },
  /**
     * TODO: Complete JS doc
     */
  'click .close': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set(false);
    $('.loadersSpin').css('display', 'none');
  },
  /**
     * TODO: Complete JS doc
     */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.itemsDetailsList.set('');
    template.modalLoader.set(false);
    $('.loadersSpin').css('display', 'none');
  },
  'change #verticalfilter': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#verticalfilter').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let vArray = [];
    vArray.push(vertical);
    Meteor.call('user.userNameGet1',vArray, (err, res) => {
      if (!err)
      template.userNameArray1.set(res);
    });
  },
  'change #verticalfilters': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#verticalfilters').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let vArray = [];
    vArray.push(vertical);
    Meteor.call('user.userNameGet1',vArray, (err, res) => {
      if (!err)
      template.userNameArray2.set(res);
    });
  },
  'submit #exportByModal': (event, template) => {
    event.preventDefault();
      let fromDate =$(".startDate1").val().toString();
      let toDates = $(".endDate1").val().toString();
      let vertical = event.target.verticalfilters.value;
      let sdName = event.target.selectSDNames.value;
      fromDate = moment(fromDate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      toDates = moment(toDates,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      template.toDate.set(toDates );
      template.fromDate.set(fromDate);
  }, 
  'change .endDate1,#verticalfilters,#selectSDNames,.startDate1': (event, template) => {
      let sdate = $(".startDate1").val();
      let edate = $(".endDate1").val();
      let fromDate = moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      let toDates = moment(edate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0");
      template.fromDateExport.set(fromDate);
      template.toDateExport.set(toDates);
      let verticalfilters = $("#verticalfilters").val();
      let selectSDNames = $("#selectSDNames").val();
      template.sdNameExport.set(selectSDNames);
      let vtArray = [];
      vtArray.push(verticalfilters);
      if(verticalfilters!=''){
          $('#spanvertical').html('');
           Meteor.call('user.userListConst',vtArray, selectSDNames, (err, res) => {
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
                template.userNameTable.set(res);
              }
          }
          });
       }
      },
     'click .exportToday': (event, template) => {
      event.preventDefault();
      $('#routeReportExportPage').modal('hide');
      let exportData = template.userNameTable.get();
      if (exportData.length==0) {
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

              saveAs(file, "SD wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
            });
          $("#exportButtons").prop('disabled', false);
        }, 5000);
      }
  }
});
