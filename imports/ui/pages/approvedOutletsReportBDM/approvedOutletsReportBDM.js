/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor'
import { Outlets } from "../../../api/outlets/outlets";
Template.approvedOutletsReportBDM.onCreated(function () {
  const self = this;
  self.autorun(() => {

  });
  let fromDateFor =new Date(moment(new Date()).format('YYYY-MM-01 00:00:00.0'));
  let toDateFor =new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  toDateFor.setDate(toDateFor.getDate()+1);
  let verticals= Session.get("loginUserSDs");
  this.pagination = new Meteor.Pagination(Outlets, {
    filters: {
      active: "Y",
      approvalStatus: "Approved",
      subDistributor:{$in:verticals},
      createdAt:{ $gte: fromDateFor, $lt: toDateFor }
    },
    sort: { createdAt: -1 },
    fields: { name: 1, address: 1, contactPerson: 1, outletType: 1, outletClass: 1, routeId: 1, username: 1,approvalStatus:1 },
    perPage: 20
  });
  this.outletId = new ReactiveVar();
  this.outletListsAp = new ReactiveVar();
  this.routeListAp = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.outletListExport = new ReactiveVar();
});
let vertical = Session.get('loginUserSDs');
Template.approvedOutletsReportBDM.onRendered(function () {
  $('#bodySpinVal').css('display', 'block');
  if (Meteor.user()) {
    let vertical = Session.get('loginUserVerticals');
    Meteor.call('user.sdListGet',vertical, (err, res) => {
      if (!err) {
        this.outletListsAp.set(res);
      };
    });
  }
  $('.selectOutletSe1').select2({
    placeholder: "Select SubDistributor ",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectOutletSe1").parent(),
  });

  $('.selectRouteSe1').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteSe1").parent(),
  });

  $('.subDistributorSel').select2({
    placeholder: "Select SubDistributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".subDistributorSel").parent(),
  });
  $('.outletTypeVal').select2({
    placeholder: "Select Outlet Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletTypeVal").parent(),
  });
  $('.outletClassVal').select2({
    placeholder: "Select Outlet Class",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletClassVal").parent(),
  });

});
Template.approvedOutletsReportBDM.helpers({

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
  },/**
  * TODO: Complete JS doc
  * @returns {*}
  */
  outletList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinVal').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },  
  outletListExpo: function () {
    return Template.instance().outletListExport.get();
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
  outletLisAp: function () {
    return Template.instance().outletListsAp.get();

  },
  routeListsAp: function () {
    return Template.instance().routeListAp.get();

  }
});

Template.approvedOutletsReportBDM.events({
  /** 
 * TODO:Complete JS doc
 * @param event
 */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.outletId.set(id);
    let header = $('#outletH');
    let outletName = $('#outletName');
    let outletAddress = $('#outletAddress');
    let outletContactno = $('#outletContactno');
    let outletCperson = $('#outletCperson');
    let outletemailId = $('#outletemailId');
    let outletremark = $('#outletremark');
    let outletrouteId = $('#outletrouteId');
    let outletapprovalstatus = $('#outletapprovalstatus');
    let outletapDate = $('#outletapDate');
    let outletapBy = $('#outletapBy');
    let outletapRemark = $('#outletapRemark');
    let detailCreditPeriod = $('#detailCreditPeriod');
    let detailCreditAmt = $('#detailCreditAmt');
    let outletTypes = $('#outletTypes');
    let outletClass = $('#outletClass');
    let detailCreatedBy = $('#detailCreatedBy');
    $('#outletDetailPage').modal();
    template.modalLoader.set(true);
    Meteor.call('outlet.outletData', id, (error, res) => {
      if (!error) {
        let outlet = res.outletsLi;
        template.modalLoader.set(false);
        template.outletId.set(id);
        $(header).html('Details of ' + outlet.name);
        $(outletName).html(outlet.name);
        $(outletAddress).html(outlet.address);
        $(outletemailId).html(outlet.emailId);
        $(outletremark).html(outlet.remark);
        $(outletTypes).html(outlet.outletType);
        $(outletClass).html(outlet.outletClass);
        $(outletrouteId).html(res.routeName);
        $(detailCreatedBy).html(res.createdByName);
        if (outlet.creditPeriod !== undefined && outlet.creditPeriod !== '') {
          $(detailCreditPeriod).html(outlet.creditPeriod);
        }
        else {
          $(detailCreditPeriod).html('');
        }
        if (outlet.creditAmount !== undefined && outlet.creditAmount !== '') {
          $(detailCreditAmt).html(outlet.creditAmount);
        }
        else {
          $(detailCreditAmt).html('');
        }
        $(outletapprovalstatus).html(outlet.approvalStatus);
        if (outlet.approvedDate) {
          $(outletapDate).html(moment(outlet.approvedDate).format('DD-MM-YYYY hh:mm A'));
        }
        else {
          $(outletapDate).html('');
        }
        $(outletapBy).html(res.approvedByName);
        if (outlet.approvalRemark !== undefined && outlet.approvalRemark !== '') {
          $(outletapRemark).html(outlet.approvalRemark);
        } else {
          $(outletapRemark).html('');
        }
        if (outlet.contactNo !== undefined && outlet.contactNo !== '') {
          $(outletContactno).html(outlet.contactNo);
        } else {
          $(outletContactno).html('');
        }
        if (outlet.contactPerson !== undefined && outlet.contactPerson !== '') {
          $(outletCperson).html(outlet.contactPerson);
        } else {
          $(outletCperson).html('');
        }
        if (outlet.insideImage) {
          $("#attachment1").attr('style', 'display:block');
          $("#attachment1").attr('src', outlet.insideImage);
        }
        else {
          $("#attachment1").attr('src', '');
          $("#insideImgDiv").val('');
        }

        if (outlet.outsideImage) {
          $("#attachment2").attr('style', 'display:block');
          $("#attachment2").attr('src', outlet.outsideImage);
        }
        else {
          $("#attachment2").attr('src', '');
          $("#ousideImgDiv").val('');
        }

        $(document).ready(function () {
          $('.attachment').click(function () {
            let src = $(this).attr('src');
            $('#fullScreen').css({
              background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
              backgroundSize: 'contain',
              width: '100%', height: '100%',
              position: 'fixed',
              zIndex: '10000',
              top: '0', left: '0',
              cursor: 'zoom-out'
            });
            $('#fullScreen').fadeIn();
          });
          $('#fullScreen').click(function () {
            $(this).fadeOut();
          });
        });
      }
      else {
        template.modalLoader.set(false);
      }
    });

  },
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .outletFilterap': (event) => {
    event.preventDefault();
    let outlet = event.target.selectOutletSe1.value;
    let TypeVal = event.target.outletTypeVal.value;
    let ClassVal = event.target.outletClassVal.value;
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let dateOne = new Date(moment(fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD 00:00:00.0'));
    let dateTwo = new Date(moment(toDate, 'DD-MM-YYYY').format('YYYY-MM-DD 00:00:00.0'));

    if(fromDate==='' && toDate===''){
      toastr['error']('Please fill up Date s');
      return;
    } 
     
    if(outlet && TypeVal==='' && ClassVal==='' && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          subDistributor: outlet, 
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(outlet==='' && TypeVal && ClassVal==='' && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          outletType:TypeVal,
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(outlet==='' && TypeVal==='' && ClassVal && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          outletClass:ClassVal, 
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(outlet && TypeVal && ClassVal==='' && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          outletType:TypeVal,
          subDistributor: outlet, 
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(outlet && TypeVal==='' && ClassVal && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          outletClass:ClassVal,
          subDistributor: outlet, 
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(outlet==='' && TypeVal && ClassVal && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          outletType:TypeVal,
          outletClass:ClassVal, 
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(outlet && TypeVal && ClassVal && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          outletType:TypeVal,
          outletClass:ClassVal,
          subDistributor: outlet, 
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else if(outlet==='' && TypeVal==='' && ClassVal==='' && dateOne && dateTwo){
      Template.instance().pagination.settings.set('filters',
        { 
          createdAt: { $gte: dateOne, $lt: dateTwo },
          active:'Y',  
          approvalStatus: "Approved"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }else{
       let verticalList= Session.get("loginUserSDs");
      Template.instance().pagination.settings.set('filters',
        { 
          active: "Y",
          approvalStatus: "Approved",
          subDistributor:{$in:verticalList},
          createdAt: { $gte: dateOne, $lt: dateTwo },
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
  },
  'click .reset': () => {
    let fromDateFor =new Date(moment(new Date()).format('YYYY-MM-01 00:00:00.0'));
    let toDateFor =new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
    let verticals= Session.get("loginUserSDs");

    Template.instance().pagination.settings.set('filters', {
      subDistributor:{$in:verticals}, createdAt: { $gte: fromDateFor, $lt: toDateFor },active:'Y',  approvalStatus: "Approved"
    });
    $('form :input').val("");
    $('#selectOutletSe1').val('').trigger('change');
    $('#selectRouteSe1').val('').trigger('change');
    $('#outletTypeVal').val('').trigger('change');
    $('#outletClassVal').val('').trigger('change');
  },
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
   'click .export': (event, template) => {
        let header = $('#deliveryExportH');
        $('#routeReportExportPage').modal();
        $(header).html('Export Details');
        $('.mainLoader').css('display', 'none');
        template.outletListExport.set('');

        $("#subDistributorSel").val('').trigger('change');
        $(".startDate1").val('');
        $(".endDate1").val('');
    },
    'change .endDate1,#subDistributorSel,.startDate1': (event, template) => {
        let sdate = $(".startDate1").val();
        let edate = $(".endDate1").val();
        let sd = $("#subDistributorSel").val();
        let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
        let toDates = new Date(moment(edate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
        if(sd!=null){
          Meteor.call('outlet.listSd',sd,fromDate,toDates, (err, res) => {
            if (!err){
               if (res.length === 0) {
                setTimeout(function () {
                  $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
                }, 0);
                setTimeout(function () {
                  $('#emptyDataSpan').fadeOut('slow');
                }, 3000);
              }else{
                 template.outletListExport.set(res);
              }
             
            }
         });
        }
    },
     'click .exportToday': (event, template) => {
      event.preventDefault();

      if($("#subDistributorSel").val()==''){
         setTimeout(function () {
            $("#itemArrya1").html('<style> #itemArrya1 { color:#fc5f5f }</style><span id ="itemArrya1">Please Select SD</span>').fadeIn('fast');
          }, 0);
          return;
      }
      if($("#startDate1").val()==''){
         setTimeout(function () {
            $("#startDateSpan").html('<style> #startDateSpan { color:#fc5f5f }</style><span id ="startDateSpan">Please Select From Date</span>').fadeIn('fast');
          }, 0);
          return;
      }
      if($("#endDate1").val()==''){
         setTimeout(function () {
            $("#endDateSpan").html('<style> #endDateSpan { color:#fc5f5f }</style><span id ="endDateSpan">Please Select To Date</span>').fadeIn('fast');
          }, 0);
          return;
      }

      $('#routeReportExportPage').modal('hide');
      let exportValue = template.outletListExport.get();
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
            //Usage example:
            urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
              .then(function (file) {

                saveAs(file, "Approved Outlets Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
              });
            $("#exportButtons").prop('disabled', false);
          }, 5000);
        }
  }
});