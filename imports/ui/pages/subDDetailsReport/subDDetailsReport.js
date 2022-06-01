/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { StockReturn } from '../../../api/stockReturn/stockReturn';
// import { RouteAssign } from '../../../api/routeAssign/routeAssign';
import { allUsers } from '../../../api/user/user';
Template.subDDetailsRep.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
  this.userNameArray1 = new ReactiveVar();
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
  this.branchArray = new ReactiveVar();
  this.userNameTable = new ReactiveVar();
  this.locationArrayExport = new ReactiveVar();
  this.locationArrayExpo = new ReactiveVar();
  this.sdListArray = new ReactiveVar();
  this.verticalListArray = new ReactiveVar();
  let verticals = Session.get("loginUserVerticals");
  this.pagination = new Meteor.Pagination(allUsers, {
    sort: {
      createdAt: -1
    },
    filters: {
      userType: "SD", active: "Y",
      vertical: { $in: verticals },
    },
    fields: { profile: 1, branch: 1, contactPerson: 1, location: 1, contactNo: 1, emails: 1, username: 1, address: 1, vertical: 1 },
    perPage: 20
  });
});
Template.subDDetailsRep.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
 this.modalLoaderBody.set(false);
 Meteor.call('branch.branchList', (err, res) => {
      if (!err) {
          this.branchArray.set(res);
      }
  });
  let v = Session.get("loginUserVerticals");
  Meteor.call('user.userLis', v, (err, res) => {
    if (!err)
      this.userNameArray1.set(res);
  });
  let vList = Session.get("loginUserVerticals");
  Meteor.call('user.userVerticals', vList, (err, res) => {
    if (!err)
     this.verticalListArray.set(res);
  });
    
  $('.verticalfilter').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilter").parent(),
  });
  $('.branchfilters').select2({
    placeholder: "Select Branch Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchfilters").parent(),
  });
  $('.locationFilters').select2({
    placeholder: "Select Location Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".locationFilters").parent(),
  });

  $('.branchfilter').select2({
    placeholder: "Select Branch Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchfilter").parent(),
  });
  $('.locationFilter').select2({
    placeholder: "Select Location Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".locationFilter").parent(),
  });
  $('.selectSDName').select2({
    placeholder: "Select SD Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDName").parent(),
  });

  $('.verticalId').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalId").parent(),
  });


  $('.branchfiltersSec').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchfiltersSec").parent(),
  });


  $('.locationFiltersSec').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".locationFiltersSec").parent(),
  });


  $('.selectSDNameSec').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSDNameSec").parent(),
  });

  let date = new Date();
  Template.instance().fromDate.set(moment(new Date()).format('YYYY-MM-01 00:00:00.0'))
  Template.instance().toDate.set(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'))

});
Template.subDDetailsRep.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },

  branchNameHelp: (branchName, id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('branch.findName', branchName, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.branchNam_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.branchNam_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },

  locationNameHelp: (locationName, id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('location.findName', locationName, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.locationNam_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.locationNam_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  priceType: (id) => {
    let verticals = Session.get("loginUserVerticals");

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('priceType.findName', id, verticals, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.priceTypeName_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.priceTypeName_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  verticalNameHelper: (id) => {
    let verticals = Session.get("loginUserVerticals");

    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('vertical.findName', id, verticals, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalN_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalN_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  verticalName1: (id) => {
    console.log("id ",id);
    let verticals = Session.get("loginUserVerticals");
      Meteor.call('vertical.findName', id, verticals, (error, result) => {
      console.log("result ",result);
        if (!error) {
          return result;
        } else {
          return '';
        }
      });
  },

  emailId: (email) => {
    return email[0].address;
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
  sdListData: () => {
    return Template.instance().sdListArray.get();

  },
  verticalList: () => {
    return Template.instance().verticalListArray.get();

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
    let pageData= Template.instance().pagination.getPage();
    if (pageData.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return pageData;
    // Template.instance().todayExport.set(exportValue);
    // return Template.instance().pagination.getPage();
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
  branchList: function () {
    return Template.instance().branchArray.get();

  },
  locationExport: () => {
    return Template.instance().locationArrayExport.get();
    
  },
  locationArrayExpo: () => {
    return Template.instance().locationArrayExpo.get();
    
  },

});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.subDDetailsRep.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event, template) => {
    event.preventDefault();
    let sdName = $("#selectSDName").val();
    let branchfilter = $("#branchfilter").val();
    let locationFilter = $("#locationFilter").val();
    if (sdName !== null && branchfilter !== null && locationFilter !== null) {
      Template.instance().pagination.settings.set('filters', {
        _id: sdName,
        branch: branchfilter,
        location: locationFilter
      });
    }
    else {
      toastr['error']("Please fill up all fields");
      let verticals = Session.get("loginUserVerticals");
      Template.instance().pagination.settings.set('filters', {
        userType: 'SD', active: 'Y',
        vertical: { $in: verticals },
      });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    $("#branchfilter").val('').trigger('change');
    $("#locationFilter").val('').trigger('change');
    $("#selectSDName").val('').trigger('change');
    let verticals = Session.get("loginUserVerticals");
    Template.instance().pagination.settings.set('filters', {
       userType: 'SD', active: 'Y', vertical: { $in: verticals }
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
      // console.log("fromDate", fromDate);
      // console.log("toDate", toDate);
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
    $("#branchfilter").val('').trigger('change');
    $("#locationFilter").val('').trigger('change');
    $("#selectSDName").val('').trigger('change');
  },
  /**
    * TODO:Complete JS doc
    */
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.routeExportData.set('');
     // $('#branchfilters').val('').trigger('change');
     // $('#locationFilters').val('').trigger('change');
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
  // 'change #verticalfilter': (event, template) => {
  //   event.preventDefault();
  //   let vertical = '';
  //   $('#verticalfilter').find(':selected').each(function () {
  //     vertical = $(this).val();
  //   });
  //   let varray = [];
  //   varray.push(vertical);
  //   Meteor.call('user.userNameGet1', varray, (err, res) => {
  //     if (!err)
  //       template.userNameArray1.set(res);
  //   });

  // },
  'change #branchfilters': (event, template) => {
    event.preventDefault();
    let branch = '';
    $('#branchfilters').find(':selected').each(function () {
      branch = $(this).val();
    });
    Meteor.call('location.locationByBranch', branch, (err, res) => {
      if (!err)
        template.locationArrayExport.set(res);
    });
  },
  'change #branchfiltersSec': (event, template) => {
    event.preventDefault();
    let branch = '';
    $('#branchfiltersSec').find(':selected').each(function () {
      branch = $(this).val();
    });
    Meteor.call('location.locationByBranch', branch, (err, res) => {
      if (!err)
        template.locationArrayExpo.set(res);
    });
  },
  'change #branchfilter': (event, template) => {
    event.preventDefault();
    let branch = '';
    $('#branchfilter').find(':selected').each(function () {
      branch = $(this).val();
    });
    Meteor.call('location.locationByBranch', branch, (err, res) => {
      if (!err)
        template.locationArrayExport.set(res);
    });
  },
  'change .branchfiltersSec,.locationFiltersSec,.selectSDNameSec': (event, template) => {
    let branchfiltersSec = $(".branchfiltersSec").val();
    let locationFiltersSec = $(".locationFiltersSec").val();
    let selectSDNameSec = $(".selectSDNameSec").val();
    if(branchfiltersSec!==null && locationFiltersSec!==null && selectSDNameSec!==null ){
      Meteor.call('user.userlistDetails',branchfiltersSec,locationFiltersSec,selectSDNameSec, (err, res) => {
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
              template.sdListArray.set(res);
          }
        }
      });
    }else{
      toastr['error']("Please fill up all fields");
    }
  },
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');

    let exportData = template.sdListArray.get();
    if (exportData.length == 0) {
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

            saveAs(file, "SD Details Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  }
});
