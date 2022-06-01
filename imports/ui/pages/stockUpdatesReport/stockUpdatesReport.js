/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import XLSX from 'xlsx';

Template.stockUpdatesReport.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.stockNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.subDistributorList = new ReactiveVar();
  this.stockArrayGet = new ReactiveVar();
  this.stockArrayGet1 = new ReactiveVar();
  this.getSubProductArray = new ReactiveVar();
});

Template.stockUpdatesReport.onRendered(function () {

  let loginUserVerticals = Session.get("loginUserVerticals");
  /**
   * get vertical List
   */
  if (loginUserVerticals) {
    Meteor.call('vertical.sdLists', loginUserVerticals, (err, res) => {
      if (!err) {
        this.subDistributorList.set(res);
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
  $('.sdProduct').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".sdProduct").parent(),
  });
  
  /**
   * TODO: Complete JS doc
   */
  $('.selectSdVal').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSdVal").parent(),
  });

  /**
  * TODO: Complete JS doc
  */
  $('.selectVerticalVal').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalVal").parent(),
  });
/**
  * TODO: Complete JS doc
  */
  $('.selectSdVal1').select2({
    placeholder: "Select Select SD",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSdVal1").parent(),
  });
/**
  * TODO: Complete JS doc
  */
  $('.sdProduct1').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".sdProduct1").parent(),
  });

});

Template.stockUpdatesReport.helpers({
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
 * 
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
   * 
   * @returns 
   */
  getStockDataList: () => {
    return Template.instance().stockArrayGet.get();
  },
  /**
   * 
   * @returns 
   */
  getStockDataList1: () => {
    return Template.instance().stockArrayGet1.get();
  },
  /**
 * get sd list */
  getSubDistributor: () => {
    return Template.instance().subDistributorList.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('stocks');
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
 * get product name
 * @param {} product 
 */
  getStocksUnit: (product, stock, _id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("product.idBasicUnit", product, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.stockVal_' + _id).html(`${stock} (${result})`);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.stockVal_' + _id).html(stock);
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
   * 
   * @returns check stock
   */
  checkStockStatus: (status) => {
    if (status === true) {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  stockLists: function () {
    return Template.instance().stockNameArray.get();
  },
  getSubProduct: function () {
    return Template.instance().getSubProductArray.get();
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

Template.stockUpdatesReport.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .stockFilter': (event, template) => {
    event.preventDefault();
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    // let fromDate = new Date(dateOne);
    // let toDate = new Date(dateTwo);

    let fromDate = null;
    let toDate = null;

    let sdUser = '';
    let sdProduct = '';

    $('#selectSdVal').find(':selected').each(function () {
      sdUser = $(this).val();
    });

    $('#sdProduct').find(':selected').each(function () {
      sdProduct = $(this).val();
    });

    template.modalLoader.set(false);
    let loginUserVerticals = Session.get("loginUserVerticals");
    if (sdUser !== '' && first!=='' && second!=='') {
      template.modalLoader.set(true);
      Meteor.call('stock.stockReports', sdUser, loginUserVerticals, sdProduct, (err, res) => {
        if (!err) {
          template.stockArrayGet.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.modalLoader.set(false);
          template.stockArrayGet.set('');
        }
      });
    }else{
      toastr['error']('Please fill Dates and Sd User');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (event, template) => {
    event.preventDefault();
     $('form :input').val("");
    $('#selectSdVal').val('').trigger('change');
    template.stockArrayGet.set('');
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
    template.modalLoader.set(true);
    let header = $('#stockH');
    let stockName = $('#detailstockName');
    let stockCode = $('#detailstockCode');
    let status = $('#detailStatus');
    $('#stockDetailPage').modal();
    Meteor.call('stock.id', id, (stockError, stockResult) => {
      if (!stockError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(stockResult.stockName));
        if (stockResult.active === "Y") {
          $(status).html("Active");
        }
        else if (stockResult.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(stockName).html(stockResult.stockName);
        $(stockCode).html(stockResult.stockCode);
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
    $('#selectVerticalVal').val('').trigger('change');
    $('#stockUploadConfirmation').modal();
    $(header).html(' Upload Stock');
  },
  'submit #uploadstock': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let verticalVal = '';
    $('#selectVerticalVal').find(':selected').each(function () {
      verticalVal = ($(this).val());
    });
    let subDistributorVal = Meteor.userId();
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
      $('#selectVerticalVal').val('').trigger('change');
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
          let subDistributor = subDistributorVal;
          let vertical = verticalVal;
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
        $('#selectVerticalVal').val('').trigger('change');
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
            $('#selectVerticalVal').val('').trigger('change');
            $("#uploadstock")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#stockUploadConfirmation').modal('hide');
            $("#uploadstock")[0].reset();
            $('#stockSuccessModal').find('.modal-body').text(` Stock has been updated successfully (${stockArray.length} Nos)`);
            $('#stockSuccessModal').modal();
            $('#selectVerticalVal').val('').trigger('change');
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#stockErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#stockErrorModal').modal();
        $('#stockUploadConfirmation').modal('hide');
        $('#selectVerticalVal').val('').trigger('change');
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
      Product: '', Stock: ''
    }];
    dataCSV = data.map(element => ({
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
  'change #selectSdVal': function(event, template) {
    $('#selectSdVal').find(':selected').each(function () {
      sdId = $(this).val();
    });
    Meteor.call('sdProducts.list', sdId, (err, res) => {
      if (!err) {
        template.getSubProductArray.set(res);
      }
    });
  }
,
 /**
  * TODO: Complete JS doc
  * 
  */
  'click .export':() => {
      $('#selectSdVal1').val('').trigger('change');
      $('#sdProduct1').val('').trigger('change');
      // $('.startDate1').val('');
      // $('.endDate1').val('');
      $('#alertSpan').html('');
      $('#routeReportExportPage').modal();
      $('#deliveryExportH').html('Export Details');
       $("#exportButtons").prop('disabled', true);
  }, 
  
  'change #selectSdVal1': (event,template) => {
      $('#selectSdVal1').find(':selected').each(function () {
        sdId = $(this).val();
      });
      Meteor.call('sdProducts.list', sdId, (err, res) => {
        if (!err) {
          template.getSubProductArray.set(res);
        }
      });
      // common code
         let loginUserVerticals = Session.get("loginUserVerticals");
          let sdate = $(".startDate1").val();
          let edate = $(".endDate1").val();
          let selectSdVal1 = $("#selectSdVal1").val();
          let sdProduct1 = $("#sdProduct1").val();
          let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
          let toDates = new Date(moment(edate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
            Meteor.call('stock.stockReports', selectSdVal1, loginUserVerticals, sdProduct1, (err, res) => {
            if (!err) {
              template.stockArrayGet1.set(res);
              template.modalLoader.set(false);
                if (res.length === 0) {
                   $("#exportButtons").prop('disabled', false);
                        setTimeout(function () {
                          $("#alertSpan").html('<style> #alertSpan { color:#fc5f5f }</style><span id ="alertSpans">No Records Found !</span>').fadeIn('fast');
                        }, 0);
                        setTimeout(function () {
                          $('#alertSpan').fadeOut('slow');
                        }, 3000);
                }
                else {
                  setTimeout(function () {
                    $("#alertSpan").html('<style> #alertSpan { color:#2ECC71 }</style><span id ="alertSpans">Records are ready for export.</span>').fadeIn('fast');
                  }, 0);
                  setTimeout(function () {
                    $('#alertSpan').fadeOut('slow');

                  }, 3000);
                }
            }
            else {
              template.modalLoader.set(false);
              template.stockArrayGet1.set('');
            }
          });
      // common code
   }, 
  'change #sdProduct1': (event,template) => {
      let loginUserVerticals = Session.get("loginUserVerticals");
      let sdate = $(".startDate1").val();
      let edate = $(".endDate1").val();
      let selectSdVal1 = $("#selectSdVal1").val();
      let sdProduct1 = $("#sdProduct1").val();
      let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
      let toDates = new Date(moment(edate,'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
        Meteor.call('stock.stockReports', selectSdVal1, loginUserVerticals, sdProduct1, (err, res) => {
        if (!err) {
          template.stockArrayGet1.set(res);
          template.modalLoader.set(false);
            if (res.length === 0) {
               $("#exportButtons").prop('disabled', false);
                    setTimeout(function () {
                      $("#alertSpan").html('<style> #alertSpan { color:#fc5f5f }</style><span id ="alertSpans">No Records Found !</span>').fadeIn('fast');
                    }, 0);
                    setTimeout(function () {
                      $('#alertSpan').fadeOut('slow');
                    }, 3000);
            }
            else {
              setTimeout(function () {
                $("#alertSpan").html('<style> #alertSpan { color:#2ECC71 }</style><span id ="alertSpans">Records are ready for export.</span>').fadeIn('fast');
              }, 0);
              setTimeout(function () {
                $('#alertSpan').fadeOut('slow');

              }, 3000);
            }
        }
        else {
          template.modalLoader.set(false);
          template.stockArrayGet1.set('');
        }
      });
      
   },
   
    /**
    * TODO:Complete JS doc
    */
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportData = Template.instance().stockArrayGet1.get();
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

            saveAs(file, "Stock Updates Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  }
});