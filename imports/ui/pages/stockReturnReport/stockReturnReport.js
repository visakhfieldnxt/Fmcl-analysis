/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { StockReturn } from "../../../api/stockReturn/stockReturn";
import XLSX from 'xlsx';

Template.stockReturnReport.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.stockNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.stockIdList = new ReactiveVar();
  this.employeeList = new ReactiveVar();
  this.stockTransferExports = new ReactiveVar();
  let date = new Date();
  let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
  let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
  toiDate.setDate(toiDate.getDate() + 1);
  this.pagination = new Meteor.Pagination(StockReturn, {
    filters: {
      subDistributor: Meteor.userId(),
      createdAt: { $gte: fromiDate, $lt: toiDate }
    },
    sort: { createdAt: -1 },
    fields: {
      temporaryId: 1,
      transferDate: 1,
      sdUser: 1,
      status: 1,
      createdAt: 1
    },
    perPage: 20
  });
});

Template.stockReturnReport.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  /**
 * TODO: Complete JS doc
 */
  $('.selectVerticalId').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalId").parent(),
  });
  /**
 * TODO: Complete JS doc
 */
  $('.employeeId').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".employeeId").parent(),
  });

  /**
* TODO: Complete JS doc
*/
  $('.employeeIdExport').select2({
    placeholder: "Select Employee",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".employeeIdExport").parent(),
  });


  /**
   * TODO: Complete JS doc
   */
  $('.stocktransferIdval').select2({
    placeholder: "Select Stock Return Id",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".stocktransferIdval").parent(),
  });
  /**
 * active and inactive list based on nav bar
 */
  $('.taskHeaderList').css('display', 'inline');
  var header = document.getElementById("taskHeader");
  if (header) {
    var btns = header.getElementsByClassName("paginationFilterValue");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("activeHeaders");
        current[0].className = current[0].className.replace(" activeHeaders", "");
        this.className += " activeHeaders";
      });
    }
  }
  /**
    * TODO: Complete JS doc
    * for filter
    */
  /**
   * get product list
   */
  Meteor.call('product.activeList', (err, res) => {
    if (!err) {
      this.productListGet.set(res);
    }
  });
  if (Meteor.user()) {
    Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
    Meteor.call('stockReturn.idListAll', Meteor.userId(), (err, res) => {
      if (!err) {
        this.stockIdList.set(res);
      }
    });

  }

  Meteor.call('user.sdUserListSd', Meteor.userId(), (err, res) => {
    if (!err) {
      this.employeeList.set(res);
    }
  });
});

Template.stockReturnReport.helpers({
  /**
               * TODO: Complete JS doc
               * @returns {any | *}
               */
  labelName: function () {
    let name = Template.instance().fileName.get();
    if (name !== undefined) {
      return name;
    }
    else {
      return false;
    }
  },
  /**
* get vertical list */
  getVertical: () => {
    return Template.instance().verticalList.get();
  },/**
   * 
   * @returns product list
   */
  getProductList: () => {
    return Template.instance().productListGet.get();
  },
  /**
   * get stock transfer id
   */
  stocktransferIdList: () => {
    return Template.instance().stockIdList.get();
  },
  employeeListSd: () => {
    return Template.instance().employeeList.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('stocks');
  },
  productListGets: () => {
    return Template.instance().itemsDetailsList.get();
  },

  stockDataExport: () => {
    return Template.instance().stockTransferExports.get();
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
* get product name
* @param {} product 
*/
  getProductNames: (product) => {
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
      $('.productIdVals_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVals_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get product name
* @param {} id 
*/
  getProductCount: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("stockReturnItems.idCount", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.prouctCounts_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.prouctCounts_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
* get vansale user name
*/

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
    }
    ).catch((error) => {
      $('.userIdVal_' + user).html('');
    }
    );
  },
  /**
* get unit name
* @param {} unit 
*/
  getUnitNames: (unit) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("unit.idName", unit, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.unitNameVals_' + unit).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.unitNameVals_' + unit).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
  * get branch name
  * @param {} vertical 
  */
  getVerticalName: (vertical) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("verticals.idName", vertical, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.verticalIdVal_' + vertical).html(result);
    }
    ).catch((error) => {
      $('.verticalIdVal_' + vertical).html('');
    }
    );
  },
  /**
   * get status values
   * @param {*} status 
   */
  getActiveStatus: (status) => {
    if (status === 'Y') {
      return 'Active';
    }
    else {
      return 'Inactive';
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('stocks');
    config.textarea = true;

    return config;
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
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  stockList: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return Template.instance().pagination.getPage();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  stockLists: function () {
    return Template.instance().stockNameArray.get();
  },
  /**
     * TODO: Complete JS doc
     * @returns {*}
     */
  activeHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "Y") {
      return true;
    }
    else {
      return false
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  inactiveHelper: function (active) {
    let activeCheck = active;
    if (activeCheck === "N") {
      return true;
    }
    else {
      return false
    }
  },
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },



});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.stockReturnReport.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockFilter': (event) => {
    event.preventDefault();
    let uniqueId = event.target.stocktransferIdval.value;
    let employeeId = event.target.employeeId.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let fromDate = new Date(moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD'));
    let toDates = new Date(moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD'));
    toDates.setDate(toDates.getDate() + 1)
    if (uniqueId && employeeId === '' && isNaN(fromDate) && isNaN(toDates)) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), temporaryId: uniqueId
      });
      $('.taskHeaderList').css('display', 'none');
    } else if (uniqueId === '' && employeeId && isNaN(fromDate) && isNaN(toDates)) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
      });
      $('.taskHeaderList').css('display', 'none');
    } else if (uniqueId === '' && employeeId === '' && fromDate && isNaN(toDates)) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), transferDateIso: { $gte: fromDate },
      });
      $('.taskHeaderList').css('display', 'none');
    } else if (uniqueId === '' && employeeId === '' && isNaN(fromDate) && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), transferDateIso: { $lt: toDates }
      });
      $('.taskHeaderList').css('display', 'none');
    } else if (uniqueId && employeeId && isNaN(fromDate) && isNaN(toDates)) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId, temporaryId: uniqueId
      });
      $('.taskHeaderList').css('display', 'none');
    } else if (uniqueId && employeeId === '' && fromDate && isNaN(toDates)) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $gte: fromDate, $lt: toDates }, temporaryId: uniqueId
      });
      $('.taskHeaderList').css('display', 'none');
    } else if (uniqueId && employeeId === '' && isNaN(fromDate) && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        transferDateIso: { $lt: toDates }, temporaryId: uniqueId
      });
      $('.taskHeaderList').css('display', 'none');
    } else if (uniqueId === '' && employeeId && fromDate && isNaN(toDates)) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $gte: fromDate }
      });
    } else if (uniqueId === '' && employeeId && isNaN(fromDate) && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $lt: toDates }
      });
    } else if (uniqueId === '' && employeeId === '' && fromDate && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), transferDateIso: { $gte: fromDate, $lt: toDates }
      });
    } else if (uniqueId && employeeId && fromDate && isNaN(toDates)) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $gte: fromDate }, temporaryId: uniqueId
      });
    } else if (uniqueId && employeeId && isNaN(fromDate) && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $lt: toDates }, temporaryId: uniqueId
      });
    } else if (uniqueId === '' && employeeId && fromDate && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $gte: fromDate, $lt: toDates }
      });
    } else if (uniqueId && employeeId === '' && fromDate && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(),
        transferDateIso: { $gte: fromDate, $lt: toDates }, temporaryId: uniqueId
      });
    } else if (uniqueId && employeeId && isNaN(fromDate) && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $lt: toDates }, temporaryId: uniqueId
      });
    } else if (uniqueId && employeeId && fromDate && toDates) {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId(), sdUser: employeeId,
        transferDateIso: { $gte: fromDate, $lt: toDates }, temporaryId: uniqueId
      });
      $('.taskHeaderList').css('display', 'none');
    } else {
      Template.instance().pagination.settings.set('filters', {
        subDistributor: Meteor.userId()
      });
    }

  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let date = new Date();
    let fromiDate = new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0'));
    let toiDate = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0'));
    toiDate.setDate(toiDate.getDate() + 1);
    Template.instance().pagination.settings.set('filters', {
      subDistributor: Meteor.userId(),
      createdAt: { $gte: fromiDate, $lt: toiDate }
    });
    $('form :input').val("");
    $("#selectVerticalId").val('').trigger('change');
    $("#employeeId").val('').trigger('change');
    $('.taskHeaderList').css('display', 'inline');
    $("#stocktransferIdval").val('').trigger('change');
  },




  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatestock").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let detailTransferId = $('#detailTransferId');
    let detailvertical = $('#detailvertical');
    let detailDate = $('#detailDate');
    let detailEmp = $('#detailEmp');
    let detailStatus=$('#detailStatus');
    $('#stockH').html("Stock Transfer Details");
    template.itemsDetailsList.set('');
    $('#stockDetailPage').modal();
    Meteor.call('stockReturnItems.detailPage', id, (err, res) => {
      if (!err) {
        template.modalLoader.set(false);
        $(detailTransferId).html(res.temporaryId);
        $(detailvertical).html(res.verticalName);
        $(detailDate).html(res.transferDate);
        $(detailStatus).html(res.statusVal);
        $(detailEmp).html(res.empName);
        if (res.stockTransferRes.length > 0) {
          template.itemsDetailsList.set(res.stockTransferRes);
        }
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('stock.stockList', (stockError, stockResult) => {
      if (!stockError) {
        template.stockNameArray.set(stockResult);
      }
    });
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },
  /**
           * TODO: Complete JS doc
           * @param event
           */
  'click #fileUploadstock': (event, template) => {
    event.preventDefault();
    $("#uploadstock").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#stockUploadHeader');
    $('#stockUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadstock': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadstockFile");
    let myFile = $('.uploadstockFile').prop('files')[0];
    let fileType = myFile["type"];
    console.log("fileType", fileType);
    if (myFile.type === 'application/vnd.ms-excel' || myFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      if (fileUpload !== null && fileUpload !== '' && fileUpload !== undefined) {
        if (typeof (FileReader) != "undefined") {
          let reader = new FileReader();
          //For Browsers other than IE.
          if (reader.readAsBinaryString) {
            reader.onload = function (e) {
              processExcel(e.target.result);
            };
            reader.readAsBinaryString(fileUpload.files[0]);
          } else {
            //For IE Browser.
            reader.onload = function (e) {
              let data = "";
              let bytes = new Uint8Array(e.target.result);
              for (let i = 0; i < bytes.byteLength; i++) {
                data += String.fromCharCode(bytes[i]);
              }
              processExcel(data);
            };
            reader.readAsArrayBuffer(fileUpload.files[0]);
          }
        }
        else {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#fileArrayspan").html('<style>#fileArrayspan {color :#fc5f5f }</style><span id="fileArrayspan">This browser does not support HTML5.</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#fileArrayspan').fadeOut('slow');
          }, 3000);
        }
      }
      else {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#fileArrayspan").html('<style>#fileArrayspan {color :#fc5f5f }</style><span id="fileArrayspan">A file needed</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#fileArrayspan').fadeOut('slow');
        }, 3000);
      }
    }
    else {
      $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#stockErrorModal').modal();
      $('#stockUploadConfirmation').modal('hide');
      $("#uploadstock")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let stockArray = [];
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      //Fetch the name of First Sheet.
      let firstSheet = workbook.SheetNames[0];
      //Read all rows from First Sheet into an JSON array.
      let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
      if (excelRows !== undefined && excelRows.length > 0) {
        //Add the data rows from Excel file.
        for (let i = 0; i < excelRows.length; i++) {
          let subDistributor = excelRows[i].SubDistributor;
          let vertical = excelRows[i].Vertical;
          let product = excelRows[i].Product;
          let stock = excelRows[i].Stock;
          if (subDistributor !== undefined && subDistributor !== '' &&
            product !== undefined && product !== '' &&
            stock !== undefined && stock !== '' &&
            vertical !== undefined && vertical !== '') {
            stockArray.push({
              subDistributor: subDistributor, vertical: vertical, product: product, stock: stock.toString()
            });
          }
        }
      }
      else {
        $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#stockErrorModal').modal();
        $('#stockUploadConfirmation').modal('hide');
        $("#uploadstock")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (stockArray.length !== 0 && stockArray !== undefined) {
        $('#stockUploadConfirmation').modal('hide');
        return Meteor.call('stock.createUpload', stockArray, (error, result) => {
          if (error) {
            $('#stockErrorModal').find('.modal-body').text(error.reason);
            $('#stockErrorModal').modal();
            $('#stockUploadConfirmation').modal('hide');
            $("#uploadstock")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#stockUploadConfirmation').modal('hide');
            $("#uploadstock")[0].reset();
            $('#stockSuccessModal').find('.modal-body').text(` Stock has been updated successfully (${stockArray.length} Nos)`);
            $('#stockSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#stockErrorModal').modal();
        $('#stockUploadConfirmation').modal('hide');
        $("#uploadstock")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #stockFileClose': (event, template) => {
    $("#uploadstock").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadstock': (event, template) => {
    event.preventDefault();
    let data = [{
      SubDistributor: '', Vertical: '', Product: '', Stock: ''
    }];
    dataCSV = data.map(element => ({
      'SubDistributor': '',
      'Vertical': '',
      'Product': '',
      'Stock': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "stockFormat.xls");
  },
  'change .uploadstockFile': function (event, template) {
    let func = this;
    let file = event.currentTarget.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      fileName = file.name,
        fileContent = reader.result,
        template.fileName.set(file.name);
    };
    reader.readAsDataURL(file);
  },

  /**
* TODO: Complete JS doc
* 
*/
  'click .activeFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "Y"
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "N"
    });
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   */
  'click .export': (event, template) => {
    event.preventDefault();
    $('#deliveryExportH').html('Export Data');
    $('#employeeIdExport').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
    $('#stockTransferExport').modal();
    template.stockTransferExports.set('');
  },

  'change .endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let sdUser = $("#employeeIdExport").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD"));
    toDates.setDate(toDates.getDate() + 1);
    template.stockTransferExports.set('');
    template.modalLoader.set(true);
    Meteor.call('stockReturn.exportData', Meteor.userId(), sdUser, fromDate, toDates, (err, res) => {
      if (!err) {
        template.modalLoader.set(false);
        if (res.length === 0) {
          setTimeout(function () {
            $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#emptyDataSpan').fadeOut('slow');
          }, 3000);
        } else {
          template.stockTransferExports.set(res);
        }
      }
      else {
        template.modalLoader.set(false);
      }
    });
  },

  /**
   * TODO:Complete JS doc
   */
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#stockTransferExport').modal('hide');
    let exportData = Template.instance().stockTransferExports.get();
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

            saveAs(file, "Stock Return Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
        $('#employeeIdExport').val('').trigger('change');
        $('.startDate1').val('');
        $('.endDate1').val('');
      }, 5000);
    }
  },
});