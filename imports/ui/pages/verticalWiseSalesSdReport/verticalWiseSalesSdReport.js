/**
 * @author Greeshma
 */
 import { Meteor } from 'meteor/meteor';
 import { CreditSale } from "../../../api/creditSale/creditSale";
 
 Template.verticalWiseSalesSdReport.onCreated(function () {
   let self = this;
   self.autorun(() => {
 
   });
   this.modalLoader = new ReactiveVar();
   this.todayExport = new ReactiveVar();
   this.verticalArray = new ReactiveVar();
   this.listArray1 = new ReactiveVar();
 
   let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
   toDay = new Date(today);
   nextDay = new Date(toDay);
   nextDay.setDate(nextDay.getDate() + 1);
 
   this.pagination = new Meteor.Pagination(CreditSale, {
     perPage: 20,
     fields:{productId:1},
   });
 });
 
 Template.verticalWiseSalesSdReport.onRendered(function () {
    $('#bodySpinLoaders').css('display', 'block');
      $('.verticalfilter').select2({
        placeholder: "Select Vertical Name",
        tokenSeparators: [','],
        allowClear: true,
        dropdownParent: $(".verticalfilter").parent(),
      });
        Meteor.call('verticals.verticalList', (err, res) => {
        if (!err) {
            this.verticalArray.set(res);
        }
    });
      // let first = moment(new Date()).format("YYYY-MM-DD");
      // var fromDate = new Date(first);

     let date = new Date();
       let fromDate = new Date (moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
       let toDate = new Date ( moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
      Meteor.call('creditSale.verticalWiseSaleSdList', fromDate, toDate, verticalName='', (err, res) => {
        if (!err) {
          console.log(res);
            this.listArray1.set(res.productArray1);
            $('#total').html(res.tableCtn+' CTN & '+res.tablePC+' PCS');
            $('#gtotal').html(res.tableTotal.toFixed(2));
        }
  });

 });
 
 Template.verticalWiseSalesSdReport.helpers({
 
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
    return Template.instance().verticalArray.get();

  },listOfData: function () {
    return Template.instance().listArray1.get();

  },
   formateAmountFix: (docTotal) => {
     if(docTotal==''){
       return '0.00';
     }else
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
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html('');
    }
    );
  }, dates: (date) => {
    if(date!='')
    return moment(date).format('DD-MM-YYYY');

  },
  roundIt : (value) => {
      return value.toFixed(2);
  }
 });

 
 Template.verticalWiseSalesSdReport.events({
    'click #filterSearch': () => {
        document.getElementById('filterDisplay').style.display = "block";
    },
    'submit .verticalwise-filter' : (event, template) => {
        event.preventDefault();
        let verticalName = event.target.verticalfilter.value;
        let first = $("#fromDate").val();
        let second = $("#toDate").val();   
        if(verticalName==''){
          setTimeout(function () {
            $("#itemArrayspan1").html('<style> #itemArrayspan { color:#fc5f5f }</style><span id ="itemArrayspan">Please Select Vertical</span>').fadeIn('fast');
          }, 0);
          return;
        }else{
           $("#itemArrayspan1").html('');
        }
        if(first=='' && second==''){
          setTimeout(function () {
            $("#itemArrayspan").html('<style> #itemArrayspan { color:#fc5f5f }</style><span id ="itemArrayspan">Please Select From and to date</span>').fadeIn('fast');
          }, 0);
          return;
        }else{
           $("#itemArrayspan").html('');
        }
        let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');   
        var fromDate = new Date(dateOne);
        let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
        var toDate = new Date(dateTwo);
        Meteor.call('creditSale.verticalWiseSaleSdList', fromDate, toDate, verticalName, (err, res) => {
            if (!err) {
                template.listArray1.set(res.productArray1);
                $('#total').html(res.tableCtn+' CTN & '+res.tablePC+' PCS');
                $('#gtotal').html(res.tableTotal.toFixed(2));
            }
        });

    },
    'click .reset': (event, template) => {
      event.preventDefault();
      $('#verticalfilter').val('').trigger('change');
      template.listArray1.set('');
      $('form :input').val("");
      $('#total').html('');
      $('#gtotal').html('');
    },
     'submit .exportToday': (event, template) => {
      event.preventDefault();
      let exportData = template.listArray1.get();
      if (exportData=== undefined) {
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

              saveAs(file, "Vertical wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
            });
          $("#exportButtons").prop('disabled', false);
        }, 5000);
      }
  },'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }
 });
 
 Template.registerHelper('incremented', function (index) {
   index++;
   return index;
 });