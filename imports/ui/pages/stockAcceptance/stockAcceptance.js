/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { StockTransfer } from "../../../api/stockTransfer/stockTransfer";
import XLSX from 'xlsx';

Template.stockAcceptance.onCreated(function () {

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
  this.pagination = new Meteor.Pagination(StockTransfer, {
    filters: {
      sdUser: Meteor.userId(),
      status: "Pending"
    },
    sort: { createdAt: -1 },
    fields: {
      temporaryId: 1,
      transferDate: 1,
      status: 1
    },
    perPage: 20
  });
});

Template.stockAcceptance.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
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
    Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.verticalList.set(res);
      }
    });
    Meteor.call('stockTransfer.SdList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.stockIdList.set(res);
      }
    });
  }
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
  $('.stocktransferIdval').select2({
    placeholder: "Select Stock Transfer Id",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".stocktransferIdval").parent(),
  });

});

Template.stockAcceptance.helpers({
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
  * @param {*} arrays 
  * @returns check not found condition
  */
  lenthCheck: (arrays) => {
    if (arrays !== undefined && arrays.length > 0) {
      return true;
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
      Meteor.call("stockTransferIssued.idCount", id, (error, result) => {
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
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.userIdVal_' + user).html('');
      $('#bodySpinLoaders').css('display', 'none');
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
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.verticalIdVal_' + vertical).html('');
      $('#bodySpinLoaders').css('display', 'none');
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
Template.stockAcceptance.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockFilter': (event) => {
    event.preventDefault();
    let vertical = '';
    let uniqueId = event.target.stocktransferIdval.value;

    if (vertical && uniqueId === '') {
      Template.instance().pagination.settings.set('filters',
        {
          vertical: vertical, sdUser: Meteor.userId(),
          status: "Pending"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (vertical === '' && uniqueId) {
      Template.instance().pagination.settings.set('filters',
        {
          temporaryId: uniqueId, sdUser: Meteor.userId(),
          status: "Pending"
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (vertical && uniqueId) {
      Template.instance().pagination.settings.set('filters',
        {
          temporaryId: uniqueId, sdUser: Meteor.userId(),
          status: "Pending",
          vertical: vertical,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      sdUser: Meteor.userId(),
      status: "Pending"
    });
    $('form :input').val("");
    $("#selectVerticalId").val('').trigger('change');
    $('.taskHeaderList').css('display', 'inline');
    $("#stocktransferIdval").val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-stock-button': () => {
    $("#ic-create-stock").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#stockHeader');
    let stockName = $('#confstockName');
    let stockNameDup = $('#stockNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#stockDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let stockname = $('#stockName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(stockname));
    $(stockName).html(stockname);
    $(stockNameDup).html(stockname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #stockRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('stock.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#stockSuccessModal').modal();
          $('#stockSuccessModal').find('.modal-body').text('Stock inactivated successfully');
        }
        $("#stockDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#stockHeaders');
    let stockName = $('#confstockNames');
    let stockNameDup = $('#stockNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#stockActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let stockname = $('#stockName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(stockname));
    $(stockName).html(stockname);
    $(stockNameDup).html(stockname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #stockActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('stock.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#stockSuccessModal').modal();
          $('#stockSuccessModal').find('.modal-body').text('Stock activated successfully');
        }
        $("#stockActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#stockEditPage').modal();
    template.modalLoader.set(true);
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('stock.id', _id, (err, res) => {
      let stockDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let stockDetailId = _id;
      $(".id").val(stockDetailId);
      $("#stockNameEdits").val(stockDetail.stockName);
      $("#stockCodeEdits").val(stockDetail.stockCode);
      $(header).html('Update Stock');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatestock': (event) => {
    event.preventDefault();
    updatestocklist(event.target);
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
    FlowRouter.go('stockAcceptanceDetails', { _id: id });
    // template.modalLoader.set(true);
    // let header = $('#stockH');
    // let detailTransferId = $('#detailTransferId');
    // let detailSds = $('#detailSds');
    // let detailDate = $('#detailDate');
    // let detailEmp = $('#detailEmp');
    // template.itemsDetailsList.set('');
    // $('.stockData').css('display', 'none');
    // $('.updateProductStock').css('display', 'none');
    // $('.editProductStock').css('display', 'inline');
    // $('.quantityDiv').css('display', 'inline');
    // $('#stockDetailPage').modal();
    // Meteor.call('stockTransfer.id', id, (err, res) => {
    //   if (!err) {
    //     template.modalLoader.set(false);
    //     $(header).html('Details of ' + $.trim(res.transferRes.temporaryId));
    //     $(detailTransferId).html(res.transferRes.temporaryId);
    //     $(detailSds).html(res.subDistributorName);
    //     $(detailDate).html(moment(res.transferRes.transferDateIso).format('DD-MM-YYYY hh:mm A'));
    //     $(detailEmp).html(res.empNameVal);
    //     template.itemsDetailsList.set(res.stockItems);
    //   }
    // });

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
  // number validation
  'keypress .stockData': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $(".stockData").val()
      if (inputValue.indexOf('.') < 1) {
        return true;
      }
      return false;
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * update stock
   */
  'click .updateProductStock': (event, template) => {
    event.preventDefault();
    let stockRes = Template.instance().itemsDetailsList.get();
    let id = event.currentTarget.id;
    let stockVal = $(".stockData").val()
    if (stockVal !== undefined && stockVal !== '') {
      if (stockRes.length > 0) {
        for (let i = 0; i < stockRes.length; i++) {
          if (stockRes[i]._id === id) {
            stockRes[i].quantity = stockVal.toString();
            toastr['success']('Product Stock Updated Successfully');
            $('.stockData').css('display', 'none');
            $('.updateProductStock').css('display', 'none');
            $('.editProductStock').css('display', 'inline');
            $('.quantityDiv').css('display', 'inline');
          }
        }
        template.itemsDetailsList.set(stockRes);
      }
    }
    else {
      toastr['error']('Empty Fields - Quantity');
    }
  },
  'click .editProductStock': (event, template) => {
    event.preventDefault();
    $('.stockData').css('display', 'inline');
    $('.updateProductStock').css('display', 'inline');
    $('.editProductStock').css('display', 'none');
    $('.quantityDiv').css('display', 'none');
  }


});