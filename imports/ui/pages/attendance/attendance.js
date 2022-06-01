/**
 * @author Nithin
 */

import { Attendance } from "../../../api/attendance/attendance";
import { Meteor } from 'meteor/meteor';

let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);
Template.attendance.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.modalLoader = new ReactiveVar();
  this.userNameArray = new ReactiveVar();
  this.userNameOrder = new ReactiveVar();
  this.branchArrayList = new ReactiveVar();
  this.attendanceExportData = new ReactiveVar();
  this.roleArrayList = new ReactiveVar();
  let managerBranch = Session.get("managerBranch");
  this.pagination = new Meteor.Pagination(Attendance, {
    filters: {
      attendenceDateIso: {
        $gte: toDay,
        $lt: nextDay
      },
      branch: { $in: managerBranch },
    }, sort: { createdAt: -1 },
    perPage: 20
  });
});
Template.attendance.onRendered(function () {
  $('#bodySpinVal').css('display', 'block');
  let managerBranch = Session.get("managerBranch");
  /**
  * TODO: Complete JS doc
  * for getting user name
  * 
  */
  Meteor.call('user.vansaleGet', (userError, userResult) => {
    if (!userError) {
      this.userNameArray.set(userResult);
    }
  });

  Meteor.call("branch.userBranchList", managerBranch, (err, res) => {
    if (!err) {
      this.branchArrayList.set(res);
    }
  })

  Meteor.call("role.roleNameGet", (err, res) => {
    if (!err) {
      this.roleArrayList.set(res);
    }
  })
  /**
   * TODO:Complete Js doc
   * Getting customerPriceList List
   * 
   */

  Meteor.call('user.userList', (err, res) => {
    if (!err) {
      this.userNameOrder.set(res);
    }
  });

  $('.selectEmpData').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectEmpData").parent(),
  });
  $('.selectBranchs').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectBranchs").parent(),
  });
  $('#selectBranchNameExport').select2({
    placeholder: "Select Branch",
    tokenSeparators: [',', ' '],
    allowClear: true,
    dropdownParent: $("#selectBranchNameExport").parent(),
  });
  $('.selectSalesPersonExport').select2({
    placeholder: "Select Sales Person",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSalesPersonExport").parent(),
  });
  $('.selectRoleExport').select2({
    placeholder: "Select Role",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRoleExport").parent(),
  });
});
Template.attendance.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper(orderCollectionName);
  },
  /**
   * 
   * @returns get roles array
   */
  rolesDataList: () => {
    return Template.instance().roleArrayList.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper(orderCollectionName);
    config.textarea = true;
    return config;
  },
  branchArrayListGet: () => {
    return Template.instance().branchArrayList.get();
  },
  /**
   * 
   * @param {*} role 
   * @param {*} id 
   * get role name
   */
  getRoleNames: (role, id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("role.idNameArray", role, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.getRoles_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.getRoles_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
  },
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  taxFormats: (quantity, taxRate) => {
    let res = (parseInt(quantity) * Number(taxRate)).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
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
  orderByDateExport: function () {
    return Template.instance().attendanceExportData.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  attendances: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinVal').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
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


  vansaleuserList: () => {
    return Template.instance().userNameArray.get();
  },

  /**
    * TODO:Complete JS doc
    * @param docDate
    */
  date: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
     * TODO:Complete JS doc
     * @param docDueDate
     */
  dates: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YYYY');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },
  datesVal: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YYYY hh:mm:ss A');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },

  /**
* TODO:Complete JS doc
* @param price 
*/
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
  * TODO:Complete JS doc
  * @param docDate
  */
  dateHelp: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },


  /**
   * TODO:Complete Js doc
   * Showing todays date
   */
  date: function () {
    return new Date();
  },

  /**
   * TODO:Complete Js doc
   * Formating the price 
   */
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },


  /**
   * TODO:Complete JS doc
   * 
   */
  printLoad: () => {
    return Template.instance().modalLoader.get();
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.attendance.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event) => {
    event.preventDefault();

    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let employeeId = event.target.selectEmpData.value;
    let managerBranch = Session.get("managerBranch");
    let branch = event.target.selectBranchs.value;
    if (employeeId && isNaN(fromDate) && isNaN(toDate) && branch === '') {
      Template.instance().pagination.settings.set('filters', {
        employeeId: employeeId, branch: { $in: managerBranch }
      });
    }
    else if (employeeId === '' && isNaN(fromDate) && isNaN(toDate) && branch) {
      Template.instance().pagination.settings.set('filters', {
        branch: branch
      });
    }
    else if (employeeId && isNaN(fromDate) && isNaN(toDate) && branch) {
      Template.instance().pagination.settings.set('filters', {
        employeeId: employeeId, branch: branch
      });
    }
    else if (fromDate && isNaN(toDate) && employeeId === '' && branch === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        attendenceDateIso: {
          $lte: fromDate
        },
        branch: { $in: managerBranch }
      });
    }
    else if (toDate && isNaN(fromDate) && employeeId === '' && branch === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        attendenceDateIso: {
          $lte: toDate
        },
        branch: { $in: managerBranch }
      });
    }

    else if (fromDate && toDate && employeeId === '' && branch === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lt: toDate
          }, branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lte: toDate
          },
          branch: { $in: managerBranch }
        });
      }
    }
    else if (fromDate && toDate && employeeId === '' && branch) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lt: toDate
          }, branch: branch
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lte: toDate
          },
          branch: branch
        });
      }
    }
    else if (fromDate && toDate && employeeId && branch === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lt: toDate
          }, employeeId: employeeId, branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lte: toDate
          },
          employeeId: employeeId, branch: { $in: managerBranch }
        });
      }
    }
    else if (employeeId && toDate && fromDate && branch) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lt: toDate
          },
          employeeId: employeeId,
          branch: branch
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lte: toDate
          },
          employeeId: employeeId,
          branch: branch
        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    let toDay = new Date(today);
    let nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    $("#selectEmpData").val('').trigger('change');
    $("#selectBranchs").val('').trigger('change');
    let managerBranch = Session.get("managerBranch");
    Template.instance().pagination.settings.set('filters', {
      attendenceDateIso: {
        $gte: toDay,
        $lt: nextDay
      },
      branch: { $in: managerBranch }
    });
    $('form :input').val("");
  },


  /**
     * TODO:Complete JS doc
     * @param event
     */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set('');
    let id = event.currentTarget.id;
    let header = $('#orderH');
    let detailEmpName = $('#detailEmpName');
    let detailBranch = $('#detailBranch');
    let detailLoginDate = $('#detailLoginDate');
    let detailLogoutDate = $('#detailLogoutDate');
    let detailloginLocation = $('#detailloginLocation');
    let detaillogoutLocation = $('#detaillogoutLocation');
    $('#orderDetailPage').modal();
    Meteor.call('attendance.id', id, (err, res) => {
      if (!err) {
        template.modalLoader.set(res);
        let attendance = res;
        $(header).html('Details of Attendance');
        $(detailEmpName).html(attendance.employeeName);
        $(detailBranch).html(attendance.branchName);
        $(detailLoginDate).html(`${attendance.attendenceDate} ${attendance.loginDate} `);
        if (attendance.logoutDateCheck !== undefined && attendance.logoutDateCheck !== '') {
          $(detailLogoutDate).html(`${attendance.attendenceDate} ${attendance.logoutDate} `);
        }
        else {
          $(detailLogoutDate).html('');
        }
        $(detailloginLocation).html(attendance.loginLocation);
        if (attendance.logoutLocation !== undefined && attendance.logoutLocation !== '') {
          $(detaillogoutLocation).html(attendance.logoutLocation);
        }
        else {
          $(detaillogoutLocation).html('');
        }
      }
    });
  },
  /**
* TODO: Complete JS doc
* for show filter display
*/
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
* for hide filter display
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

  /**
     * TODO: Complete JS doc
     * clear data when click close button
     */
  'click .close': (event, template) => {
    $('form :input').val("");
    $('#oRStatus').val('').trigger('change');
    $("#submit").attr("disabled", false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');

  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $('form :input').val("");
    $("#submit").attr("disabled", false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },
  /**
     * TODO:Complete JS doc
     */
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#attendanceExport').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    template.attendanceExportData.set('');
    $('#selectBranchNameExport').val('').trigger('change');
    $('#selectSalesPersonExport').val('').trigger('change');
  },
  /**
 * TODO:CompleteJS doc
 */
  'change .startDate': (event, template) => {
    $(".endDate").val('');
    $(".endDate").attr("disabled", false);
    template.attendanceExportData.set('');
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
    let managerBranch = Session.get("managerBranch");
    template.modalLoader.set(false);
    template.attendanceExportData.set('');
    $('#fromDateId').html('');
    $('#toDateId').html('');
    let id = '';
    $('#selectSalesPersonExport').find(':selected').each(function () {
      id = $(this).val();
    });
    let branch = '';
    $('#selectBranchNameExport').find(':selected').each(function () {
      branch = $(this).val();
    });
    let role = '';
    $('#selectRoleExport').find(':selected').each(function () {
      role = $(this).val();
    });
    if (endDate !== '' && startDate !== '') {
      if (startDate.toString() !== 'Invalid Date') {
        template.modalLoader.set(true);
        console.log("fromDate", fromDate);
        console.log("toDate", toDate);
        Meteor.call('attendance.exportData', id, fromDate, toDate, branch, managerBranch, role, (err, res) => {
          if (!err) {
            template.attendanceExportData.set(res);
            template.modalLoader.set(false);
            $('#fromDateId').html(startDate);
            $('#toDateId').html(endDate);
            if (res.length === 0) {
              setTimeout(function () {
                $("#alertSpan").html('<style> #alertSpan { color:#fc5f5f }</style><span id ="alertSpans">No Records Found !</span>').fadeIn('fast');
              }, 0);
              setTimeout(function () {
                $('#alertSpan').fadeOut('slow');
              }, 3000);
            }
            else {
              setTimeout(function () {
                $("#alertSpan").html('<style> #alertSpans { color:#2ECC71 }</style><span id ="alertSpans">Records are ready for export.</span>').fadeIn('fast');
              }, 0);
              setTimeout(function () {
                $('#alertSpan').fadeOut('slow');
  
              }, 3000);
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
    }
  },
  /**
  * 
  * @param {*} event 
  * @param {*} template 
  * clear data when sales person change
  */
  'change #selectSalesPersonExport': (event, template) => {
    event.preventDefault();
    $('#selectBranchNameExport').val('').trigger('change');
    $(".startDate").val('');
    $(".endDate").val('');
    $(".endDate").attr("disabled", false);
    template.attendanceExportData.set('');
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * clear data when branch changes
   */
  'change #selectBranchNameExport': (event, template) => {
    event.preventDefault();
    $(".startDate").val('');
    $(".endDate").val('');
    $(".endDate").attr("disabled", false);
    template.attendanceExportData.set('');
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 * clear data when role changes
 */
  'change #selectRoleExport': (event, template) => {
    event.preventDefault();
    $(".startDate").val('');
    $(".endDate").val('');
    $(".endDate").attr("disabled", false);
    template.attendanceExportData.set('');
  },
  /**
    * TODO:Complete JS doc
    */
  'submit .exportByDate': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().attendanceExportData.get();
    if (exportData.length === 0) {
      toastr["error"]('No Records Found');
    }
    else {
      $("#exportButtons").prop('disabled', true);
      $("#attendanceExport").modal('hide');
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

            saveAs(file, "Attendance Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('form :input').val("");
        $('#selectBranchNameExport').val('').trigger('change');
        $('#selectSalesPersonExport').val('').trigger('change');
      }, 5000);
    }
  },
});


