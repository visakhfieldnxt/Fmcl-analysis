/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import { RouteAssign } from '../../../api/routeAssign/routeAssign';
Template.routeAssignReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.userNameArray = new ReactiveVar();
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
  this.vansaleUserListGet = new ReactiveVar(); 
  let managerBranch = Session.get("managerBranch");
  this.pagination = new Meteor.Pagination(RouteAssign, {
    sort: {
      createdAt: -1
    },
    filters: {
      branch: { $in: managerBranch }
    },
    perPage: 25
  });
});
Template.routeAssignReport.onRendered(function () {
  $('#bodySpinVal').css('display', 'block');
  let vansaleRoles = Session.get("vansaleRoles");
  /**
* TODO:Complete Js doc
* Getting vansale user list
*/
  Meteor.call('routeGroup.list', (err, res) => {
    if (!err) {
      this.routeCodeList.set(res);
    }
  });
  let managerBranch = Session.get("managerBranch");
  Meteor.call('branch.managerBranchGet', managerBranch, (err, res) => {
    if (!err)
      this.branchNameArray.set(res);
  });
  /**
   * TODO:Complete Js doc
   * Getting customer list
   */
  Meteor.call('customer.customerRouteData', (err, res) => {
    if (!err)
      this.customerNameArray.set(res);
  });
  // for getting allUser Name 
  Meteor.call('user.userNameGet', (err, res) => {
    if (!err)
      // Session.set("userNameArray",res);
      this.userNameArray.set(res)
  });
  // for getting allUser Name 
  Meteor.call('user.vansaleListBranch', managerBranch,vansaleRoles, (err, res) => {
    if (!err)
      this.vansaleUserListGet.set(res)
  });

  /**
   * TODO:Complete Js doc
   * Getting customer list
   */
  Meteor.call('customer.customerRouteData', (err, res) => {
    if (!err)
      this.customerUserDetail.set(res);
  });

  $('.selectRouteName').select2({
    placeholder: "Select Route Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteName").parent(),
  });
  $('#selectBranchName').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectBranchName").parent(),
  });
  $('#selectVanemp').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectVanemp").parent(),
  });
  $('#selectBranchNameExport').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectBranchNameExport").parent(),
  });
  $('#selectVanempExport').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $("#selectVanempExport").parent(),
  });
});
Template.routeAssignReport.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  vanUsersList: () => {
    return Template.instance().vansaleUserListGet.get()
  },
  /**
   * 
   * @param {*} index 
   * @returns get row index
   */
  indexCountGet: (index) => {
    let res = Template.instance().pagination;
    if (res) {
      let pageValue = res.settings.keys.page;
      if (pageValue !== undefined && pageValue > 1) {
        return (25 * (pageValue - 1)) + index + 1;
      }
      else {
        return index + 1;
      }
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
   * 
   * @param {*} dates 
   * formatting date time
   */
  /**
* TODO:Complete JS doc
*/
  branchList: function () {
    return Template.instance().branchNameArray.get();
  },
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
    Template.instance().todayExport.set(exportValue);
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinVal').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
    * TODO: Complete JS doc
    * @returns {*}
    */
  orderTodayExport: function () {
    return Template.instance().todayExport.get();
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
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("customer.idCardName", cardCode, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.customerVal_' + cardCode).html(result);
      $('.loadersSpinPromise').css('display', 'none');
    }
    ).catch((error) => {
      $('.customerVal_' + cardCode).html('');
      $('.loadersSpinPromise').css('display', 'none');
    }
    );
  },


  vanUserName: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.vanUserName_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.vanUserName_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
  },
  /**
 * get vansale route code
 */

  routeCodeHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.idRouteCode", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.routeCodeVal_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.routeCodeVal_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
  },
  /**
 * get vansale route name
 */

  routeNameHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.idRouteName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.routeVal_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    });
  },
  /**
* get vansale route name
*/

  routeBranchHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("routeGroup.idBranchDetails", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.branchVal_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.branchVal_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    });
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
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.routeAssignReport.events({
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
    let managerBranch = Session.get("managerBranch");
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let routeCode = event.target.selectRouteName.value;
    let branch = event.target.selectBranchName.value;
    let salesman = event.target.selectVanemp.value;
    if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch === '' && salesman === '') {
      Template.instance().pagination.settings.set('filters', {
        routeId: routeCode,
        branch: { $in: managerBranch }
      });
      console.log("routeCode", routeCode)
    }
    else if (routeCode === '' && isNaN(fromDate) && isNaN(toDate) && branch === '' && salesman) {
      Template.instance().pagination.settings.set('filters', {
        assignedTo: salesman,
        branch: { $in: managerBranch }
      });
    }
    else if (routeCode === '' && isNaN(fromDate) && isNaN(toDate) && branch && salesman === '') {
      Template.instance().pagination.settings.set('filters', {
        branch: branch
      });
    }
    else if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch && salesman === '') {
      Template.instance().pagination.settings.set('filters', {
        branch: branch,
        routeId: routeCode,
      });
    }
    else if (routeCode === '' && isNaN(fromDate) && isNaN(toDate) && branch && salesman) {
      Template.instance().pagination.settings.set('filters', {
        branch: branch,
        assignedTo: salesman,
      });
    }
    else if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch === '' && salesman) {
      Template.instance().pagination.settings.set('filters', {
        branch: { $in: managerBranch },
        routeId: routeCode,
        assignedTo: salesman,
      });
    }
    else if (routeCode && isNaN(fromDate) && isNaN(toDate) && branch && salesman) {
      Template.instance().pagination.settings.set('filters', {
        branch: { $in: managerBranch },
        routeId: routeCode,
        assignedTo: salesman,
        branch: branch,
      });
    }
    else if (fromDate && isNaN(toDate) && routeCode === '' && branch === '' && salesman === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: fromDate
        }, branch: { $in: managerBranch }
      });
    }
    else if (toDate && isNaN(fromDate) && routeCode === '' && branch === '' && salesman === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        routeDateIso: {
          $lte: toDate
        }, branch: { $in: managerBranch }
      });
    }

    else if (fromDate && toDate && routeCode === '' && branch === '' && salesman === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          }, branch: { $in: managerBranch }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          }, branch: { $in: managerBranch }
        });
      }
    }
    else if (fromDate && toDate && routeCode === '' && branch && salesman === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          }, branch: branch
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          }, branch: branch
        });
      }
    }
    else if (fromDate && toDate && routeCode && branch === '' && salesman === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          }, routeId: routeCode,
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          }, routeId: routeCode,
        });
      }
    }
    else if (fromDate && toDate && routeCode === '' && branch === '' && salesman) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          }, assignedTo: salesman,
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          }, assignedTo: salesman,
        });
      }
    }
    else if (routeCode && toDate && fromDate && branch && salesman === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          routeId: routeCode,
          branch: branch
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          routeId: routeCode,
          branch: branch
        });
      }
    }
    else if (routeCode === '' && toDate && fromDate && branch && salesman) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: salesman,
          branch: branch
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: salesman,
          branch: branch
        });
      }
    }
    else if (routeCode && toDate && fromDate && branch === '' && salesman) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: salesman,
          routeId: routeCode,
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: salesman,
          routeId: routeCode,
        });
      }
    }

    else if (routeCode && toDate && fromDate && branch && salesman) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lt: toDate
          },
          assignedTo: salesman,
          routeId: routeCode,
          branch: branch
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          routeDateIso: {
            $gte: fromDate, $lte: toDate
          },
          assignedTo: salesman,
          routeId: routeCode,
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
    $("#selectRouteName").val('').trigger('change');
    $("#selectBranchName").val('').trigger('change');
    $("#selectVanemp").val('').trigger('change');
    let managerBranch = Session.get("managerBranch");
    Template.instance().pagination.settings.set('filters', {
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
    template.modalLoader.set(true);
    template.itemsDetailsList.set('');
    template.assignedHistoryData.set('');
    $('.loadersSpinPromise').css('display', 'block');
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
        if (res.customerDetailsArray.length === 0) {
          $('.loadersSpinPromise').css('display', 'none');
        }
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
        $('#selectVanempExport').val('').trigger('change');
        $('#selectBranchNameExport').val('').trigger('change');
      }, 5000);
    }
  },

  /**
   * TODO:CompleteJS doc
   */
  'change .startDate': (event, template) => {
    $(".endDate").attr("disabled", false);
    $('.endDate').val('');
    template.routeExportData.set('');
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
    let salesman = '';
    $('#selectVanempExport').find(':selected').each(function () {
      salesman = $(this).val();
    });
    let branch = '';
    $('#selectBranchNameExport').find(':selected').each(function () {
      branch = $(this).val();
    });
    let managerBranch = Session.get("managerBranch");
    template.routeExportData.set('');
    if (startDate.toString() !== 'Invalid Date') {
      template.modalLoader.set(true);
      console.log("fromDate", fromDate);
      console.log("toDate", toDate);
      Meteor.call('routeAssign.exportRouteData', fromDate, toDate, managerBranch, branch, salesman, (err, res) => {
        if (!err) {
          template.routeExportData.set(res);
          template.modalLoader.set(false);
          if (res.length === 0) {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
          } else {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style> #emptyDataSpans { color:#2ECC71 }</style><span id ="emptyDataSpans">Records are ready for export.</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');

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
  },

  'change #selectBranchNameExport': (event, template) => {
    $('#selectVanempExport').val('').trigger('change');
    $('.startDate').val('');
    $('.endDate').val('');
    template.routeExportData.set('');
  },

  'change #selectVanempExport': (event, template) => {
    $('.startDate').val('');
    $('.endDate').val('');
    template.routeExportData.set('');
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
    $('#selectVanempExport').val('').trigger('change');
    $('#selectBranchNameExport').val('').trigger('change');
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
    $('#selectVanempExport').val('').trigger('change');
    $('#selectBranchNameExport').val('').trigger('change');
  },
  // /**
  //  * TODO:Complete JS doc
  //  * @param event 
  //  */
  // 'submit .exportByDate': (event) => {
  //   event.preventDefault();

  //   let uri = 'data:application/vnd.ms-excel;base64,',
  //     template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
  //     base64 = function (s) {
  //       return window.btoa(unescape(encodeURIComponent(s)))
  //     },
  //     format = function (s, c) {
  //       return s.replace(/{(\w+)}/g, function (m, p) {
  //         return c[p];
  //       });
  //     }
  //   let toExcel = document.getElementById("exportTodayOrder").innerHTML;
  //   let ctx = {
  //     worksheet: name || 'Excel',
  //     table: toExcel
  //   };
  //   //return a promise that resolves with a File instance
  //   function urltoFile(url, filename, mimeType) {
  //     return (fetch(url)
  //       .then(function (res) { return res.arrayBuffer(); })
  //       .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
  //     );
  //   };

  //   //Usage example:
  //   urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
  //     .then(function (file) {

  //       saveAs(file, "Order Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
  //     });

  //   $('#routeReportExportPage').modal('hide');
  //   $('form :input').val("");
  //   $('#startDateSpan').html('');
  //   Template.instance().routeExportData.set('');
  //   $(".endDate").attr("disabled", true);
  //   $('.mainLoader').css('display', 'none');
  // },

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
});
