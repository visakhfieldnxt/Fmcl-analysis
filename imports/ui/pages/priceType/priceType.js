/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { PriceType } from "../../../api/priceType/priceType";
import XLSX from 'xlsx';

Template.priceType.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.priceTypeNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.verticalListGet = new ReactiveVar();
  this.verticalEdit = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.verticalFullList = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    this.pagination = new Meteor.Pagination(PriceType, {
      filters: {
        active: "Y"
      },
      sort: { createdAt: -1 },
      fields: {
        priceTypeCode: 1,
        priceTypeName: 1,
        vertical: 1,
        active: 1
      },
      perPage: 20
    });
  }
  else {
    this.pagination = new Meteor.Pagination(PriceType, {
      filters: {
        active: "Y", vertical: { $in: loginUserVerticals },
      },
      sort: { createdAt: -1 },
      fields: {
        priceTypeCode: 1,
        priceTypeName: 1,
        vertical: 1,
        active: 1
      },
      perPage: 20
    });
  }
});

Template.priceType.onRendered(function () {
  let loginUserVerticals = Session.get("loginUserVerticals");
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
  let superAdminValue = Session.get("superAdminValue");
  if (superAdminValue === true) {
    Meteor.call('priceType.priceTypeFullList', (err, res) => {
      if (!err) {
        this.priceTypeNameArray.set(res);
      }
    });
  }
  else {
    Meteor.call('priceType.filterList', loginUserVerticals, (err, res) => {
      if (!err) {
        this.priceTypeNameArray.set(res);
      }
    });

  }
  /**
   * get branch list for edit
   */
  Meteor.call('verticals.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.verticalListGet.set(res);
    }
  });

  /**
   * get vertical full list for excel upload
   */

  Meteor.call('verticals.verticalList', (err, res) => {
    if (!err) {
      this.verticalFullList.set(res);
    }
  });
  /**
   * TODO: Complete JS doc
   */
  $('.priceTypeNameSelection').select2({
    placeholder: "Select PriceType Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".priceTypeNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.priceTypeCodeSelection').select2({
    placeholder: "Select PriceType Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".priceTypeCodeSelection").parent(),
  });

  $('.selectVerticalEdit').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectVerticalEdit").parent(),
  });

});

Template.priceType.helpers({
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
 * get branch list
 */
  getverticalListEdit: () => {
    let verticalId = Template.instance().verticalEdit.get();
    if (verticalId) {
      Meteor.setTimeout(function () {
        $('#selectVerticalEdit').val(verticalId).trigger('change');
      }, 100);
    }
    return Template.instance().verticalListGet.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('priceTypes');
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
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('priceTypes');
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
  priceTypeList: function () {
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
  priceTypeLists: function () {
    return Template.instance().priceTypeNameArray.get();
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

Template.priceType.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .priceTypeFilter': (event) => {
    event.preventDefault();
    let priceTypeCode = event.target.priceTypeCodeSelection.value;
    let priceTypeName = event.target.priceTypeNameSelection.value;
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      if (priceTypeCode && priceTypeName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            priceTypeCode: priceTypeCode,
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (priceTypeName && priceTypeCode === '') {
        Template.instance().pagination.settings.set('filters',
          {
            priceTypeName: priceTypeName
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (priceTypeCode && priceTypeName) {
        Template.instance().pagination.settings.set('filters',
          {
            priceTypeCode: priceTypeCode,
            priceTypeName: priceTypeName
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        Template.instance().pagination.settings.set('filters', {
        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
    //else

    else {
      if (priceTypeCode && priceTypeName === '') {
        Template.instance().pagination.settings.set('filters',
          {
            priceTypeCode: priceTypeCode, vertical: { $in: loginUserVerticals },
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (priceTypeName && priceTypeCode === '') {
        Template.instance().pagination.settings.set('filters',
          {
            priceTypeName: priceTypeName, vertical: { $in: loginUserVerticals },
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else if (priceTypeCode && priceTypeName) {
        Template.instance().pagination.settings.set('filters',
          {
            priceTypeCode: priceTypeCode,
            priceTypeName: priceTypeName, vertical: { $in: loginUserVerticals },
          }
        );
        $('.taskHeaderList').css('display', 'none');
      }
      else {
        Template.instance().pagination.settings.set('filters', {
        });
        $('.taskHeaderList').css('display', 'none');
      }
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y", vertical: { $in: loginUserVerticals },
      });
    }
    $('form :input').val("");
    $("#priceTypeCodeSelection").val('').trigger('change');
    $("#priceTypeNameSelection").val('').trigger('change');
    $('.taskHeaderList').css('display', 'inline');

    let element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    let elements = document.getElementById("activeFilter");
    elements.classList.add("active");
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-priceType-button': () => {
    $("#ic-create-priceType").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#priceTypeHeader');
    let priceTypeName = $('#confpriceTypeName');
    let priceTypeNameDup = $('#priceTypeNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#priceTypeDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let priceTypename = $('#priceTypeName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(priceTypename));
    $(priceTypeName).html(priceTypename);
    $(priceTypeNameDup).html(priceTypename);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #priceTypeRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('priceType.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#priceTypeSuccessModal').modal();
          $('#priceTypeSuccessModal').find('.modal-body').text('PriceType inactivated successfully');
        }
        $("#priceTypeDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#priceTypeHeaders');
    let priceTypeName = $('#confpriceTypeNames');
    let priceTypeNameDup = $('#priceTypeNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#priceTypeActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let priceTypename = $('#priceTypeName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(priceTypename));
    $(priceTypeName).html(priceTypename);
    $(priceTypeNameDup).html(priceTypename);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #priceTypeActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('priceType.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#priceTypeSuccessModal').modal();
          $('#priceTypeSuccessModal').find('.modal-body').text('PriceType activated successfully');
        }
        $("#priceTypeActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#priceTypeEditPage').modal();
    template.modalLoader.set(true);
    template.verticalEdit.set('');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('priceType.id', _id, (err, res) => {
      let priceTypeDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let priceTypeDetailId = _id;
      $(".id").val(priceTypeDetailId);
      $("#priceTypeNameEdits").val(priceTypeDetail.priceTypeName);
      $("#priceTypeCodeEdits").val(priceTypeDetail.priceTypeCode);
      template.verticalEdit.set(priceTypeDetail.vertical);
      $(header).html('Update PriceType');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatepriceType': (event) => {
    event.preventDefault();
    let vertical = '';
    $('#selectVerticalEdit').find(':selected').each(function () {
      vertical = $(this).val();
    });
    updatePriceTypelist(event.target, vertical);
    $('#selectVerticalEdit').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatepriceType").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#selectVerticalEdit').val('').trigger('change');
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#priceTypeH');
    let priceTypeName = $('#detailpriceTypeName');
    let priceTypeCode = $('#detailpriceTypeCode');
    let branchName = $('#detailBranch');
    let status = $('#detailStatus');
    $('#priceTypeDetailPage').modal();
    Meteor.call('priceType.idDataGet', id, (priceTypeError, priceTypeResult) => {
      if (!priceTypeError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(priceTypeResult.priceTypeRes.priceTypeName));
        if (priceTypeResult.priceTypeRes.active === "Y") {
          $(status).html("Active");
        }
        else if (priceTypeResult.priceTypeRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(priceTypeName).html(priceTypeResult.priceTypeRes.priceTypeName);
        $(priceTypeCode).html(priceTypeResult.priceTypeRes.priceTypeCode);
        $(branchName).html(priceTypeResult.verticalName);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Meteor.call('priceType.priceTypeFullList', (err, res) => {
        if (!err) {
          template.priceTypeNameArray.set(res);
        }
      });
    }
    else {
      Meteor.call('priceType.filterList', loginUserVerticals, (err, res) => {
        if (!err) {
          template.priceTypeNameArray.set(res);
        }
      });

    }
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
  'click #fileUploadpriceType': (event, template) => {
    event.preventDefault();
    $("#uploadpriceType").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#priceTypeUploadHeader');
    $('#priceTypeUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadpriceType': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadpriceTypeFile");
    let verticalArray = Template.instance().verticalFullList.get();
    let myFile = $('.uploadpriceTypeFile').prop('files')[0];
    let fileType = myFile["type"];
    let loginUserVerticals = Session.get("loginUserVerticals");
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
      $('#priceTypeErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#priceTypeErrorModal').modal();
      $('#priceTypeUploadConfirmation').modal('hide');
      $("#uploadpriceType")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let priceTypeArray = [];
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
          let priceTypeCode = excelRows[i].PriceTypeCode;
          let priceTypeName = excelRows[i].PriceTypeName;
          let vertical = excelRows[i].Vertical;
          let verticalId = '';
          if (vertical !== undefined && vertical !== '') {
            let resVal = verticalArray.find(x => x.verticalName === vertical.trim())
            if (resVal !== undefined) {
              verticalId = resVal._id;
            }
          }
          if (priceTypeCode !== undefined && priceTypeCode !== '' &&
            priceTypeName !== undefined && priceTypeName !== '' &&
            verticalId !== undefined && verticalId !== '') {
            priceTypeArray.push({
              priceTypeCode: priceTypeCode.toString(), priceTypeName: priceTypeName, vertical: verticalId,
            });
          }
        }
      }
      else {
        $('#priceTypeErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#priceTypeErrorModal').modal();
        $('#priceTypeUploadConfirmation').modal('hide');
        $("#uploadpriceType")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (priceTypeArray.length !== 0 && priceTypeArray !== undefined) {
        $('#priceTypeUploadConfirmation').modal('hide');
        return Meteor.call('priceType.createUpload', priceTypeArray, loginUserVerticals, (error, result) => {
          if (error) {
            $('#priceTypeErrorModal').find('.modal-body').text(error.reason);
            $('#priceTypeErrorModal').modal();
            $('#priceTypeUploadConfirmation').modal('hide');
            $("#uploadpriceType")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#priceTypeUploadConfirmation').modal('hide');
            $("#uploadpriceType")[0].reset();
            $('#priceTypeSuccessModal').find('.modal-body').text(` PriceType has been registered successfully (${priceTypeArray.length} Nos)`);
            $('#priceTypeSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#priceTypeErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#priceTypeErrorModal').modal();
        $('#priceTypeUploadConfirmation').modal('hide');
        $("#uploadpriceType")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #priceTypeFileClose': (event, template) => {
    $("#uploadpriceType").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadpriceType': (event, template) => {
    event.preventDefault();
    let data = [{
      PriceTypeCode: '', PriceTypeName: '', Vertical: ''
    }];
    dataCSV = data.map(element => ({
      'PriceTypeCode': '',
      'PriceTypeName': '',
      'Vertical': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "priceTypeFormat.xls");
  },
  'change .uploadpriceTypeFile': function (event, template) {
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
    $('#bodySpinLoaders').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinLoaders').css('display', 'none');
    }, 3000);
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "Y"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "Y", vertical: { $in: loginUserVerticals },
      });
    }
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    $('#bodySpinLoaders').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinLoaders').css('display', 'none');
    }, 3000);
    let loginUserVerticals = Session.get("loginUserVerticals");
    let superAdminValue = Session.get("superAdminValue");
    if (superAdminValue === true) {
      Template.instance().pagination.settings.set('filters', {
        active: "N"
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
        active: "N", vertical: { $in: loginUserVerticals },
      });
    }
  },

});