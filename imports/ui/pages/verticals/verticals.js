/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Verticals } from "../../../api/verticals/verticals";
import XLSX from 'xlsx';

Template.verticals.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.verticalNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Verticals, {
    filters: {
      active: "Y"
    },
    sort: { createdAt: -1 },
    fields:{verticalCode:1,verticalName:1,active:1},
    perPage: 20
  });
});

Template.verticals.onRendered(function () {
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
  Meteor.call('verticals.verticalList', (verticalError, verticalResult) => {
    if (!verticalError) {
      this.verticalNameArray.set(verticalResult);
    }
  });

  /**
   * TODO: Complete JS doc
   */
  $('.verticalNameSelection').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.verticalCodeSelection').select2({
    placeholder: "Select Vertical Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalCodeSelection").parent(),
  });

});

Template.verticals.helpers({
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
    return globalOptionsHelper('verticals');
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
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('verticals');
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
  verticalList: function () {
    return Template.instance().pagination.getPage();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  verticalLists: function () {
    return Template.instance().verticalNameArray.get();
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

Template.verticals.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .verticalFilter': (event) => {
    event.preventDefault();
    let verticalCode = event.target.verticalCodeSelection.value;
    let verticalName = event.target.verticalNameSelection.value;

    if (verticalCode && verticalName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          verticalCode: verticalCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (verticalName && verticalCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          verticalName: verticalName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (verticalCode && verticalName) {
      Template.instance().pagination.settings.set('filters',
        {
          verticalCode: verticalCode,
          verticalName: verticalName
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
      active: "Y"
    });
    $('form :input').val("");
    $("#verticalCodeSelection").val('').trigger('change');
    $("#verticalNameSelection").val('').trigger('change');
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
  'click #ic-create-vertical-button': () => {
    $("#ic-create-vertical").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#verticalHeader');
    let verticalName = $('#confverticalName');
    let verticalNameDup = $('#verticalNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#verticalDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let verticalname = $('#verticalName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(verticalname));
    $(verticalName).html(verticalname);
    $(verticalNameDup).html(verticalname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #verticalRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('verticals.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#verticalSuccessModal').modal();
          $('#verticalSuccessModal').find('.modal-body').text('Vertical inactivated successfully');
        }
        $("#verticalDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#verticalHeaders');
    let verticalName = $('#confverticalNames');
    let verticalNameDup = $('#verticalNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#verticalActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let verticalname = $('#verticalName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(verticalname));
    $(verticalName).html(verticalname);
    $(verticalNameDup).html(verticalname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #verticalActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('verticals.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#verticalSuccessModal').modal();
          $('#verticalSuccessModal').find('.modal-body').text('Vertical activated successfully');
        }
        $("#verticalActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#verticalEditPage').modal();
    template.modalLoader.set(true);
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('verticals.id', _id, (err, res) => {
      let verticalDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let verticalDetailId = _id;
      $(".id").val(verticalDetailId);
      $("#verticalNameEdits").val(verticalDetail.verticalName);
      $("#verticalCodeEdits").val(verticalDetail.verticalCode);
      $(header).html('Update Vertical');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatevertical': (event) => {
    event.preventDefault();
    updateverticallist(event.target);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatevertical").each(function () {
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
    let header = $('#verticalH');
    let verticalName = $('#detailVerticalName');
    let verticalCode = $('#detailVerticalCode');
    let status = $('#detailStatus');
    $('#verticalDetailPage').modal();
    Meteor.call('verticals.id', id, (verticalError, verticalResult) => {
      if (!verticalError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(verticalResult.verticalName));
        if (verticalResult.active === "Y") {
          $(status).html("Active");
        }
        else if (verticalResult.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(verticalName).html(verticalResult.verticalName);
        $(verticalCode).html(verticalResult.verticalCode);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('verticals.verticalList', (verticalError, verticalResult) => {
      if (!verticalError) {
        template.verticalNameArray.set(verticalResult);
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
  'click #fileUploadvertical': (event, template) => {
    event.preventDefault();
    $("#uploadvertical").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#verticalUploadHeader');
    $('#verticalUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadvertical': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadverticalFile");
    let myFile = $('.uploadverticalFile').prop('files')[0];
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
      $('#verticalErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#verticalErrorModal').modal();
      $('#verticalUploadConfirmation').modal('hide');
      $("#uploadvertical")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let verticalArray = [];
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
          let verticalCode = excelRows[i].VerticalCode;
          let verticalName = excelRows[i].VerticalName;
          if (verticalCode !== undefined && verticalCode !== '' &&
            verticalName !== undefined && verticalName !== '') {
            verticalArray.push({
              verticalCode: verticalCode.toString(), verticalName: verticalName,
            });
          }
        }
      }
      else {
        $('#verticalErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#verticalErrorModal').modal();
        $('#verticalUploadConfirmation').modal('hide');
        $("#uploadvertical")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (verticalArray.length !== 0 && verticalArray !== undefined) {
        $('#verticalUploadConfirmation').modal('hide');
        return Meteor.call('verticals.createUpload', verticalArray, (error, result) => {
          if (error) {
            $('#verticalErrorModal').find('.modal-body').text(error.reason);
            $('#verticalErrorModal').modal();
            $('#verticalUploadConfirmation').modal('hide');
            $("#uploadvertical")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#verticalUploadConfirmation').modal('hide');
            $("#uploadvertical")[0].reset();
            $('#verticalSuccessModal').find('.modal-body').text(` Vertical has been registered successfully (${verticalArray.length} Nos)`);
            $('#verticalSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#verticalErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#verticalErrorModal').modal();
        $('#verticalUploadConfirmation').modal('hide');
        $("#uploadvertical")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #verticalFileClose': (event, template) => {
    $("#uploadvertical").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadvertical': (event, template) => {
    event.preventDefault();
    let data = [{
      bPLId: '', bPLName: '',
    }];
    dataCSV = data.map(element => ({
      'VerticalCode': '',
      'VerticalName': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "VerticalFormat.xls");
  },
  'change .uploadverticalFile': function (event, template) {
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

});