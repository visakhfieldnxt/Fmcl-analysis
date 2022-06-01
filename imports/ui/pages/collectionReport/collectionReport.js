/**
 * @author Visakh
 */


import { Meteor } from 'meteor/meteor';
import { CollectionDueToday } from "../../../api/collectionDueToday/collectionDueToday";

Template.collectionReport.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.cashArrays = new ReactiveVar();
  this.chequeArrays = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  let managerBranch = Session.get("managerBranch");
  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  let toDay = new Date(today);
  let nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);

  this.pagination = new Meteor.Pagination(CollectionDueToday, {

    filters: {
      branch: { $in: managerBranch },
    }, sort: { createdAt: -1 },
    perPage: 25
  });
})


Template.collectionReport.onRendered(function () {
  /**
  * TODO:Complete Js doc
  * Getting customer list
  */
  Meteor.call('customer.customerNameGet', (err, res) => {
    if (!err)
      this.customerNameArray.set(res);
  });
  $('.selectCustomerName').select2({
    placeholder: "Select Customer Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectCustomerName").parent(),
  });
});
Template.collectionReport.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper(orderCollectionName);
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
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper(orderCollectionName);
    config.textarea = true;

    return config;
  },
  /**
 * TODO:Complete Js doc
 * for getting customer list
 */
  customersList: function () {
    return Template.instance().customerNameArray.get();
  },

  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  currencyGet: () => {
    let currencyValues = Session.get("currencyValues");
    return currencyValues;
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  priceFormat: (amount) => {
    let res = Number(amount).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  collections: function () {
    Template.instance().todayExport.set(Template.instance().pagination.getPage());
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
    * @param docDate
    */
  dates: (date) => {
    return moment(date).format('DD-MM-YYYY');

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
   */
  cash: () => {

    let cashList = Template.instance().cashArrays.get();
    return cashList;
  },
  /**
   * TODO:Complete JS doc
   */
  cheque: () => {

    let chequeList = Template.instance().chequeArrays.get();
    return chequeList;
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

Template.collectionReport.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .collectionFilter': (event) => {
    event.preventDefault();
    let managerBranch = Session.get("managerBranch");
    let cardName = event.target.cardName.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    if (cardName && isNaN(toDate) && isNaN(fromDate)) {
      Template.instance().pagination.settings.set('filters',
        {
          branch: { $in: managerBranch },
          cardName: cardName,
        }
      );
    }
    else if (fromDate && isNaN(toDate) && cardName === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        docDate: {
          $lte: fromDate
        },
        branch: { $in: managerBranch },
      });
    }
    else if (toDate && isNaN(fromDate) && cardName === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        docDate: {
          $lte: toDate
        },
        branch: { $in: managerBranch },
      });
    }
    else if (fromDate && toDate && cardName === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          branch: { $in: managerBranch },
          docDate: {
            $gte: fromDate, $lt: toDate
          }
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          branch: { $in: managerBranch },
          docDate: {
            $gte: fromDate, $lte: toDate
          },
        });
      }
    }
    else if (cardName && toDate && fromDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          branch: { $in: managerBranch },
          docDate: {
            $gte: fromDate, $lt: toDate
          },
          cardName: cardName
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          branch: { $in: managerBranch },
          docDate: {
            $gte: fromDate, $lte: toDate
          },
          cardName: cardName
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
    $("#selectCustomerName").val('').trigger('change');
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    Template.instance().pagination.settings.set('filters', {
      branch: { $in: managerBranch },
    });
    $('form :input').val("");
  },
  /**
          * TODO:Complete JS doc
          * @param event
          */
  'click .view': (event, template) => {
    event.preventDefault();
    Template.instance().modalLoader.set('');
    let id = event.currentTarget.id;
    let header = $('#orderH');
    let cardName = $('#detailCardName');
    let address = $('#detailAddress');
    let cardCode = $('#detailCardCode');
    let branchs = $('#detailBranch');
    let collectionType = $('#detailCollectionType');
    let date = $('#detailDate');
    let cashAmount = $('#detailCashAmount');
    let chequeAmount = $('#detailChequeAmount');
    let createdBy = $('#detailCreatedBy');
    let detailCollectionId = $('#detailCollectionId');
    let currencyValues = Session.get("currencyValues");
    $('#orderDetailPage').modal();
    Meteor.call('collectionDueToday.id', id, (collectionError, collectionResult) => {
      if (!collectionError) {
        let collection = collectionResult;
        template.modalLoader.set(collectionResult);
        $(header).html('Details of Collection Taken');
        $(cardName).html(collection.cardName);
        $(address).html(collection.address);
        $(cardCode).html(collection.cardCode);
        if (collection.collectionId !== undefined && collection.collectionId !== '') {
          $(detailCollectionId).html(collection.collectionId);
        }
        else {
          $(detailCollectionId).html('');
        }
        if (collection.collectionType === "Bill Wise") {
          $(collectionType).html(collection.collectionType + "(" + collection.invoiceNo + ")");
        } else {
          $(collectionType).html(collection.collectionType);
        }
        $(date).html(moment(collection.date).format("DD-MM-YYYY hh:mm:ss A"));
        let cashAmt = Number(collection.invoicePayment.sumApplied).toFixed(6);
        $(cashAmount).html(`<b>${currencyValues}</b>` + ' ' + cashAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        $(chequeAmount).html(collection.chequeSum);
        $(createdBy).html(collection.createdBy);
        template.cashArrays.set(collection.cashInfo);
        template.chequeArrays.set(collection.chequeInfo);
        branchDetailsView(collection.branch);
      }
    });
    function branchDetailsView(branch) {

      Meteor.call('branch.branchBPLId', branch, (branchError, branchResult) => {
        if (!branchError) {

          if (branchResult !== undefined) {
            $(branchs).html(branchResult);
          }
          else {
            $(branchs).html(branch);
          }
        }
      });
    }

  },
  /**
* TODO: Complete JS doc
* Cash and Cheque Acknowledgement View
*/
  'click .attachment': (event) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    let src = $('#' + id).attr('src');
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
  },
  /**
* TODO: Complete JS doc
*/
  'click #fullScreen': () => {
    $('#fullScreen').fadeOut();
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
     * TODO: Complete JS doc
     */
  'click .close': (event, template) => {
    $('form :input').val("");
    template.modalLoader.set('');
    template.cashArrays.set('');
    template.chequeArrays.set('');
    $("#detailCollectionId").html('');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $('form :input').val("");
    template.modalLoader.set('');
    template.cashArrays.set('');
    template.chequeArrays.set('');
    $("#detailCollectionId").html('');
  },
  /**
   * TODO:Complete JS doc
   */
  'submit .exportToday': (event, template) => {
    event.preventDefault();
    let exportData = Template.instance().todayExport.get();
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

            saveAs(file, "Collection Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  },
});
