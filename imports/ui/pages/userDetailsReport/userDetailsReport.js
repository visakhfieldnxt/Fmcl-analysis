/**
 * @author Greeshma
 */
 import { Meteor } from 'meteor/meteor';
 import { allUsers } from "../../../api/user/user";
 
 
 Template.userDetailsReport.onCreated(function () {
   let self = this;
   self.autorun(() => {
 
   });
   this.todayExport = new ReactiveVar();
   this.uListArray = new ReactiveVar();
   this.outletList = new ReactiveVar();
   this.exportList = new ReactiveVar();
   this.verticalListArray = new ReactiveVar();
   let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
   toDay = new Date(today);
   nextDay = new Date(toDay);
   nextDay.setDate(nextDay.getDate() + 1);
   this.pagination = new Meteor.Pagination(allUsers, {
     sort: {
       createdAt: -1
     },
     fields: {
        profile: 1,
        contactNo: 1,
        username: 1,
        emails: 1,
        vertical: 1,
        roles: 1,
        active: 1,
     },
     perPage: 20
   });
 });
 
 Template.userDetailsReport.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
   Meteor.call('user.userListActiveInactive', (err, res) => {
     if (!err)
       this.uListArray.set(res);
   });

  let vList = Session.get("loginUserVerticals");
  Meteor.call('user.userVerticals', vList, (err, res) => {
    if (!err)
     this.verticalListArray.set(res);
  });

   $('.selectrouteName1').select2({
     placeholder: "Select Route Name",
     tokenSeparators: [','],
     allowClear: true
   }); 
    $('.userName').select2({
     placeholder: "Select User Name",
     tokenSeparators: [','],
     allowClear: true
   }); 
    $('.userName1').select2({
     placeholder: "Select User Name",
     tokenSeparators: [','],
     allowClear: true
   });
    $('.userCode').select2({
     placeholder: "Select User Code",
     tokenSeparators: [','],
     allowClear: true
   });
 });
 
 Template.userDetailsReport.helpers({
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
    * @returns {*}
    */
   outletList: function () {
     let exportValue = Template.instance().pagination.getPage();
     if (exportValue.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    else {
     let uniqueSlNo = 0;
     for (let i = 0; i < exportValue.length; i++) {
       uniqueSlNo = parseInt(uniqueSlNo + 1);
       for (let j = 0; j < exportValue[i].length; j++) {
          exportValue[i].itemLines[j].profile.empCode = exportValue[i].profile.empCode,
          exportValue[i].itemLines[j].profile.firstName = exportValue[i].profile.firstName,
          exportValue[i].itemLines[j].profile.lastName = exportValue[i].profile.lastName,
          exportValue[i].itemLines[j].profile.gender = exportValue[i].profile.gender,
          exportValue[i].itemLines[j].profile.dateOfBirth = exportValue[i].profile.dateOfBirth,
          exportValue[i].itemLines[j].contactNo = exportValue[i].contactNo,
          exportValue[i].itemLines[j].username = exportValue[i].username,
          exportValue[i].itemLines[j].emails = exportValue[i].emails,
          exportValue[i].itemLines[j].vertical = exportValue[i].vertical,
          exportValue[i].itemLines[j].roles = exportValue[i].roles,
          exportValue[i].itemLines[j].active = exportValue[i].active
       }
     }
     Template.instance().todayExport.set(exportValue);
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
   exportOutlet: function () {
     return Template.instance().outletList.get();
   },exportList1: function () {
     return Template.instance().exportList.get();
   },
   /**
   * TODO: Complete JS doc
   * @returns {*}
   */
   orderByDateExport: function () {
     return Template.instance().stockInvoice.get();
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
   vertical1: function () {
     return Template.instance().verticalArray.get();
 
   }, 
   uList: function () {
     return Template.instance().uListArray.get();
 
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
 * @param docStatus
 */
   statusExcel: (docStatus) => {
     if (docStatus === 'approved') {
       return 'Approved';
     }
     else if (docStatus === 'rejected') {
       return 'Rejected';
     }
     else if (docStatus === 'onHold') {
       return 'On Hold';
     }
     else if (docStatus === 'Pending') {
       return 'Pending (Waiting For Accountant Approval)';
     }
     else {
       return '';
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
   getUserName: (user) => {
     let promiseVal = new Promise((resolve, reject) => {
       Meteor.call("user.idName", user, (error, result) => {
         if (!error) {
           resolve(result);
         } else {
           reject(error);
         }
       });
     });
     promiseVal.then((result) => {
       $('.userIdVal_' + user).html(result);
       $('#bodySpinLoaders').css('display', 'none');
     }
     ).catch((error) => {
       $('.userIdVal_' + user).html('');
       $('#bodySpinLoaders').css('display', 'none');
     }
     );
   },
   getUserName1: (user) => {
     let promiseVal = new Promise((resolve, reject) => {
       Meteor.call("role.roleName1", user, (error, result) => {
         if (!error) {
           resolve(result);
         } else {
           reject(error);
         }
       });
     });
     promiseVal.then((result) => {
       $('.userIdVal1_' + user).html(result);
       $('#bodySpinLoaders').css('display', 'none');
     }
     ).catch((error) => {
       $('.userIdVal1_' + user).html('');
       $('#bodySpinLoaders').css('display', 'none');
     }
     );
   },
  routeHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('routeGroup.id', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.routeVal_' + id).html(result.routeName);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.routeVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
  },
  emailsHelp: (emails,id) => {
    let promiseVal = new Promise((resolve, reject) => {
      let emailList = ''; 
      for(let u=0;u<emails.length;u++){
        emailList+=emails[u].address;
      }
       if (emailList!='') {
          resolve(emailList);
        } else {
          reject('');
        }
    });
    promiseVal.then((result) => {
      $('.emailsHelp_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.emailsHelp_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
  },
  verticalHelp: (vertical,id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('vertical.listofVertical1', vertical,id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalVal_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.verticalVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
  },
  channelHelp: (roles,id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('role.roleNameUser',roles,id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.channelVal_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');

    }
    ).catch((error) => {
      $('.channelVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');

    });
  },
  statusHelp: (active) => {
   if(active=='Y'){
    return "Active";
   }else{
    return "Inactive";
   }
  },
  
   deliveryDetails: () => {
     return Template.instance().deliveryDetails.get();
   },
  verticalList: () => {
    return Template.instance().verticalListArray.get();

  },
  
 });
 Template.registerHelper('incremented', function (index) {
   index++;
   return index;
 });
 
 Template.userDetailsReport.events({
   /**
    * TODO: Complete JS doc
    * @param event
    */
   'submit .order-filter': (event) => {
     event.preventDefault();
     let userName = event.target.userName.value;
     let userCode = event.target.userCode.value;
     let first = $("#fromDate").val();
     let second = $("#toDate").val();
     let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD  00:00:00.0');
     let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD  00:00:00.0');
     let fromDate = new Date(dateOne);
     let toDate = new Date(dateTwo);

     if(first==='' && second===''){
      toastr['error']('Please fill up Date s');
      return;
     }

     toDate.setDate(toDate.getDate() + 1);
     if(userName && userCode==='' && fromDate && toDate){
      Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          _id: userName
        });

     }else if(userName==='' && userCode && fromDate && toDate){
      Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
          _id: userCode
        });

     }else if(userName && userCode && fromDate && toDate){
      Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          },
           _id: userName
        });

     }else if(userName==='' && userCode==='' && fromDate && toDate){
      Template.instance().pagination.settings.set('filters', {
          createdAt: {
            $gte: fromDate, $lt: toDate
          }
        });

     }else{
        Template.instance().pagination.settings.set('filters', {});
     }
   },
   /**
    * TODO: Complete JS doc
    */
   'click .reset': () => {
     $("#selectSDName").val('').trigger('change');
     $("#userCode").val('').trigger('change');
     $("#userName").val('').trigger('change');
     let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
     toDay = new Date(today);
     nextDay = new Date(toDay);
     nextDay.setDate(nextDay.getDate() + 1);
     Template.instance().pagination.settings.set('filters', {
       // subDistributor: Meteor.userId()
     });
     $('form :input').val("");
   },
   /**
     * TODO:Complete JS doc
     * @param event
     */
   'click .view': (event, template) => {
     event.preventDefault();
     template.itemsDetailsList.set('');
     template.modalLoader.set(true);
     template.deliveryDetails.set('');
     let id = event.currentTarget.id;
     let header = $('#orderHs');
     let sdUser = $('#ordersdUser');
     let subDistributor = $('#ordersubDistributor');
     let vertical = $('#ordervertical');
     let outlet = $('#orderoutletoutlet');
     let _id = $('#order_id_id');
     let docDate = $('#orderdocDatedocDate');
     let docTotal = $('#orderdocTotal');
     let discountAmt = $('#orderdiscountAmt');
     let taxAmount = $('#ordertaxAmount');
     let totalQty = $('#ordertotalQty');
     let docNum = $('#orderdocNum');
     let status = $('#orderstatus');
     let createdBy = $('#ordercreatedBy');
     let discountAmtData = $('#discountAmtData');
 
     $('#orderDetailPage').modal();
     Meteor.call('order.orderData', id, (orderError, orderResult) => {
       if (!orderError) {
         template.modalLoader.set(false);
         let orderResult1 = orderResult.orderList;
         if (orderResult1.itemArray !== undefined && orderResult1.itemArray.length > 0) {
           template.itemsDetailsList.set(orderResult1.itemArray);
         }
         if (orderResult1.status === 'Delivered') {
           template.deliveryDetails.set(orderResult1)
         }
         $(header).html('Details of Order');
         $(sdUser).html(orderResult.sdName);
         $(subDistributor).html(orderResult.sdName1);
         $(vertical).html(orderResult.verticalName);
         $(outlet).html(orderResult.outletName);
         $(_id).html(orderResult.routeName);
         $(docDate).html(orderResult1.docDate);
         $(docTotal).html(orderResult1.docTotal);
         $(discountAmt).html(orderResult1.discountAmt);
         $(taxAmount).html(orderResult1.taxAmount);
         $(totalQty).html(orderResult1.totalQty);
         $(docNum).html(orderResult1.docNum);
         $(status).html(orderResult1.status);
         $(createdBy).html(orderResult.createdByName);
         $(discountAmtData).html(Number(orderResult1.discountAmt).toFixed(2));
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
   'click .exportToday': (event, template) => {
     event.preventDefault();
      $('#routeReportExportPage').modal('hide');
     let exportData = Template.instance().exportList.get();
     if (exportData.length === 0) {
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
 
             saveAs(file, "User Details Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
           });
         $("#exportButtons").prop('disabled', false);
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
     let startDate = new Date($('.startDate').val());
     let endDate = new Date($('.endDate').val());
     endDate.setDate(endDate.getDate() + 1);
     $('.mainLoader').css('display', 'block');
     if (startDate.toString() !== 'Invalid Date') {
       Meteor.call('order.export', startDate, endDate, (err, res) => {
         if (!err) {
           template.stockInvoice.set(res);
         }
       });
     }
     else {
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
 
   'click .exportClose': () => {
     $('form :input').val("");
     $('#startDateSpan').html('');
     Template.instance().stockInvoice.set('');
     $(".endDate").attr("disabled", true);
     $('.mainLoader').css('display', 'none');
 
   },
   /**
     * TODO:Complete JS doc
     */
   'click .export': () => {
      let header = $('#deliveryExportH');
      $('#routeReportExportPage').modal();
      $(header).html('Export Details');
      $('.mainLoader').css('display', 'none');
      // $('#verticalId').val('').trigger('change');
      $('.startDate1').val('');
      $('.endDate1').val('');
   },

  'change .endDate1,.startDate1': (event, template) => {
     let sdate = $(".startDate1").val();
     let edate = $(".endDate1").val();
     let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
     let toDates = new Date(moment(edate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0")); 
     if(fromDate!=''){
      Meteor.call('user.lisWithUser',fromDate,toDates, (err, res) => {
         if (!err){
            if (res.length === 0) {
                  setTimeout(function () {
                    $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
                  }, 0);
                  setTimeout(function () {
                    $('#emptyDataSpan').fadeOut('slow');
                  }, 3000);
            }else{       
               template.exportList.set(res);
           }
         }
     });
    }
     },
   /**
    * TODO:Complete JS doc
    * @param event 
    */
   'submit .exportByDate': (event) => {
     event.preventDefault();
    
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
     let toExcel = document.getElementById("viewNew").innerHTML;
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
 
         saveAs(file, "Order Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
       });
 
     $('#deliveryReportExportPage').modal('hide');
     $('form :input').val("");
     $('#startDateSpan').html('');
     Template.instance().stockInvoice.set('');
     $(".endDate").attr("disabled", true);
     $('.mainLoader').css('display', 'none');
   },
 
   /**
      * TODO: Complete JS doc
      */
   'click .close': (event, template) => {
     $('form :input').val("");
 
     template.itemsDetailsList.set('');
 
     template.modalLoader.set('');
     $('.loadersSpin').css('display', 'none');
   },
   /**
      * TODO: Complete JS doc
      */
   'click .closen': (event, template) => {
     $('form :input').val("");
     template.itemsDetailsList.set('');
     template.modalLoader.set('');
     $('.loadersSpin').css('display', 'none');
   },
 });
 