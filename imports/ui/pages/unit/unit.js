/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Unit } from "../../../api/unit/unit";
import XLSX from 'xlsx';

Template.unit.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.fileName = new ReactiveVar();
  this.unitLists = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.itemFullList = new ReactiveVar();
  this.unitUgpEdits = new ReactiveVar();
  this.bodyLoaderValue = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Unit, {
    filters: {
      disabled: { $ne: 'Y' },
    },
    sort: { createdAt: -1 },
    perPage: 20
  });

});

Template.unit.onRendered(function () {
  this.bodyLoaderValue.set(true);
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
     * TODO:Complete Js doc
     * Getting user itemGetPrice list
     */
  Meteor.call('item.itemListGet', (err, res) => {
    if (!err) {
      this.bodyLoaderValue.set(false);
      this.itemFullList.set(res);
    }
    this.bodyLoaderValue.set(false);
  });
  /**
     * TODO:Complete Js doc
     * Getting user itemGetPrice list
     */
  Meteor.call('unit.unitList', (err, res) => {
    if (!err) {
      this.unitLists.set(res);
    }
  });
  $('.itemCodeEdits').select2({
    placeholder: "Select Item ",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".itemCodeEdits").parent(),
  });

  $('.unitCodeSelection').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".unitCodeSelection").parent(),
  });
  $('.unitEntrySelection').select2({
    placeholder: "Select Item",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".unitEntrySelection").parent(),
  });
});

Template.unit.helpers({
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
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('units');
  },
  /**
  * TODO:Complete JS doc
  * 
  */
  printLoad: () => {
    return Template.instance().modalLoader.get();
  },

  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('units');
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
  unitList: function () {
    return Template.instance().pagination.getPage();
  },
  /**
* TODO:COmplete Js doc
* Getting specific customers base on itemGetPrice
*/
  unitsLists: function () {
    return Template.instance().unitLists.get();
  },
  /**
* TODO:COmplete Js doc
* Getting specific customers base on itemGetPrice
*/
  itemsList: function () {
    let itemval = Template.instance().unitUgpEdits.get();
    if (itemval) {
      Meteor.setTimeout(function () {
        if (itemval) {
          $('#itemCodeEdits').val(itemval).trigger('change');
        }
      }, 200);
    }

    return Template.instance().itemFullList.get();
  },
  /**
     * TODO: Complete JS doc
     * @returns {*}
     */
  activeHelper: function (active) {
    let activeCheck = active;
    if (activeCheck !== "Y") {
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
    if (activeCheck === "Y") {
      return true;
    }
    else {
      return false
    }
  },
  /**
 * TODO:Complete Js doc
 * @param branch
 */
  itemNameGet: (ugpCode) => {
    if (ugpCode) {
      let itemRes = Template.instance().itemFullList.get();
      let res = itemRes.find(x => x.ugpCode === ugpCode);
      if (res) {
        return res.itemNam;
      }
    }
  },
  /**
  * TODO:Complete JS doc
  * 
  */
  printLoadBody: () => {
    let res = Template.instance().bodyLoaderValue.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },

});

Template.unit.events({


  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .unitFilter': (event) => {
    event.preventDefault();
    let unitCode = event.target.unitCodeSelection.value;
    let ugpCode = event.target.unitEntrySelection.value;

    if (unitCode && ugpCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          uomCode: unitCode
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (ugpCode && unitCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          ugpCode: ugpCode
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (unitCode && ugpCode) {
      Template.instance().pagination.settings.set('filters',
        {
          uomCode: unitCode,
          ugpCode: ugpCode
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
      $('.taskHeaderList').css('display', 'inline');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      disabled: { $ne: 'Y' },
    });
    $('.taskHeaderList').css('display', 'inline');
    $('form :input').val("");
    $("#unitCodeSelection").val('').trigger('change');
    $("#unitEntrySelection").val('').trigger('change');
    let element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    let elements = document.getElementById("activeFilter");
    elements.classList.add("active");
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-unit-button': () => {
    $("#ic-create-unit").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#unitHeader');
    let unitName = $('#confunitName');
    let unitNameDup = $('#unitNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#unitDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let unitname = $('#uomCode_' + _id).val();
    $(header).html('Confirm Deletion Of ' + $.trim(unitname));
    $(unitName).html(unitname);
    $(unitNameDup).html(unitname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #unitRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      $("#unitDelConfirmation").modal('hide');
      Meteor.call('unit.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#unitSuccessModal').modal();
          $('#unitSuccessModal').find('.modal-body').text('Unit inactivated successfully');
        }
        $("#unitDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#unitHeaders');
    let unitName = $('#confunitNames');
    let unitNameDup = $('#unitNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#unitActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let unitname = $('#uomCode_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(unitname));
    $(unitName).html(unitname);
    $(unitNameDup).html(unitname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #unitActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      $("#unitActiveConfirmation").modal('hide');
      Meteor.call('unit.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#unitSuccessModal').modal();
          $('#unitSuccessModal').find('.modal-body').text('Unit activated successfully');
        }
        $("#unitActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    let header = $('#categoryH');
    $('#unitEditPage').modal();
    $('div.hint').hide();
    template.unitUgpEdits.set('');
    template.modalLoader.set(true);
    $(header).html('Update Unit');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('unit.unit_id', _id, (err, res) => {
      let unitDetail = res;
      template.modalLoader.set(false);
      let unitDetailId = _id;
      let unitDetailItemUnitName = unitDetail.uomCode;
      let unitDetailItemUnitCode = unitDetail.uomEntry;
      let unitDetailItemUnitBaseQty = unitDetail.baseQty;
      template.unitUgpEdits.set(unitDetail.ugpCode);
      $(".id").val(unitDetailId);
      $("#baseQtyEdits").val(unitDetailItemUnitBaseQty);
      $("#uomCodeEdits").val(unitDetailItemUnitName);
      $("#uomEntryEdits").val(unitDetailItemUnitCode);
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updateunit': (event) => {
    event.preventDefault();
    let ugpCode = '';
    $('.itemCodeEdits').find(':selected').each(function () {
      ugpCode = $(this).val();
    });
    updateunitlist(event.target, ugpCode);
    $('#unitEditPage').modal('hide');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateunit").each(function () {
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
    let header = $('#unitH');
    let unitName = $('#detailUnitName');
    let unitCode = $('#detailUnitCode');
    let baseQty = $('#detailBaseQty');
    let ugpCode = $('#detailUgpCode');
    let status = $('#detailStatus');
    $('#unitDetailPage').modal();
    Meteor.call('unit.dataGet', id, (unitError, unitResult) => {
      if (!unitError) {
        template.modalLoader.set(false);
        let unit = unitResult.unitRes;
        $(header).html('Details of ' + $.trim(unit.uomCode));
        $(unitName).html(unit.uomCode);
        $(unitCode).html(unit.uomEntry);
        $(baseQty).html(unit.baseQty);
        $(ugpCode).html(unitResult.itemName);
        if (unit.disabled !== "Y") {
          $(status).html("Active");
        }
        else if (unit.active === "Y") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
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
         * TODO: Complete JS doc
         * @param event
         */
  'click #fileUploadunit': (event, template) => {
    event.preventDefault();
    $("#uploadunit").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#unitUploadHeader');
    $('#unitUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadunit': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadunitFile");
    let itemMaster = Template.instance().itemFullList.get();
    let myFile = $('.uploadunitFile').prop('files')[0];
    let fileType = myFile["type"];
    console.log("fileType", fileType);
    if (myFile.type === 'application/vnd.ms-excel' || myFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      if (fileUpload !== null && fileUpload !== '' && fileUpload !== undefined) {
        //Validate whether File is valid Excel file.
        // let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        // if (regex.test(fileUpload.value.toLowerCase())) {
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
        } else {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#fileArrayspan").html('<style>#fileArrayspan {color :#fc5f5f }</style><span id="fileArrayspan">This browser does not support HTML5.</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#fileArrayspan').fadeOut('slow');
          }, 3000);
        }
      } else {
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
      $('#unitErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#unitErrorModal').modal();
      $('#unitUploadConfirmation').modal('hide');
      $("#uploadunit")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let unitArray = [];
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      //Fetch the name of First Sheet.
      let firstSheet = workbook.SheetNames[0];
      //Read all rows from First Sheet into an JSON array.
      let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
      //Add the data rows from Excel file.
      for (let i = 0; i < excelRows.length; i++) {

        let ugpCode = excelRows[i].ItemName;
        let uomCode = excelRows[i].UomCode;
        let baseQty = excelRows[i].BaseQuantity;
        let uomEntry = excelRows[i].UomEntry;

        if (ugpCode !== undefined && ugpCode !== '' &&
          uomCode !== undefined && uomCode !== '' &&
          baseQty !== undefined && baseQty !== '' &&
          uomEntry !== undefined && uomEntry !== '') {
          let itemCode = '';
          let itemRes = itemMaster.find(x => x.itemNam === ugpCode);
          if (itemRes) {
            itemCode = itemRes.ugpCode;
          }
          if (itemCode !== '') {

            unitArray.push({ ugpCode: itemCode, uomCode: uomCode.toString(), baseQty: baseQty.toString(), uomEntry: uomEntry.toString() });
          }
        }
      }
      if (unitArray.length !== 0 && unitArray !== undefined) {
        return Meteor.call('unit.createUpload', unitArray, (error, result) => {
          if (error) {
            $('#unitErrorModal').find('.modal-body').text(error.reason);
            $('#unitErrorModal').modal();
            $('#unitUploadConfirmation').modal('hide');
            $("#uploadunit")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#unitUploadConfirmation').modal('hide');
            $("#uploadunit")[0].reset();
            $('#unitSuccessModal').find('.modal-body').text(`Unit has been registered successfully(${unitArray.length} Nos)`);
            $('#unitSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#unitErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#unitErrorModal').modal();
        $('#unitUploadConfirmation').modal('hide');
        $("#uploadunit")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #unitFileClose': (event, template) => {
    $("#uploadunit").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadunit': (event, template) => {
    event.preventDefault();
    let data = [{ itemName: '', uomCode: '', baseQty: '', uomEntry: '' }];
    dataCSV = data.map(element => ({
      'ItemName': '',
      'UomCode': '',
      'UomEntry': '',
      'BaseQuantity': ''

    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "UnitFormat.xls");
  },
  'change .uploadunitFile': function (event, template) {
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
      disabled: { $ne: 'Y' },
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      disabled: "Y",
    });
  },
});