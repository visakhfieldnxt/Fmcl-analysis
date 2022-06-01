/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Principal } from "../../../api/principal/principal";
import XLSX from 'xlsx';

Template.principal.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.principalNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Principal, {
    filters: {
      active: "Y",
    },
    sort: { createdAt: -1 },
    fields: {
      principalCode: 1,
      principalName: 1,
      active: 1
    },
    perPage: 20
  });
});

Template.principal.onRendered(function () {
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
  Meteor.call('principal.principalList', (principalError, principalResult) => {
    if (!principalError) {
      this.principalNameArray.set(principalResult);
    }
  });
  /**
   * TODO: Complete JS doc
   */
  $('.principalNameSelection').select2({
    placeholder: "Select Principal Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.principalCodeSelection').select2({
    placeholder: "Select Principal Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalCodeSelection").parent(),
  });

});

Template.principal.helpers({
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
    return globalOptionsHelper('principals');
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
    let config = globalOptionsHelper('principals');
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
  principalList: function () {
    return Template.instance().pagination.getPage();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  principalLists: function () {
    return Template.instance().principalNameArray.get();
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

Template.principal.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .principalFilter': (event) => {
    event.preventDefault();
    let principalCode = event.target.principalCodeSelection.value;
    let principalName = event.target.principalNameSelection.value;
    if (principalCode && principalName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          principalCode: principalCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (principalName && principalCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          principalName: principalName,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (principalCode && principalName) {
      Template.instance().pagination.settings.set('filters',
        {
          principalCode: principalCode,
          principalName: principalName,
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
      active: "Y",
    });
    $('form :input').val("");
    $("#principalCodeSelection").val('').trigger('change');
    $("#principalNameSelection").val('').trigger('change');
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
  'click #ic-create-principal-button': () => {
    $("#ic-create-principal").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#principalHeader');
    let principalName = $('#confprincipalName');
    let principalNameDup = $('#principalNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#principalDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let principalname = $('#principalName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(principalname));
    $(principalName).html(principalname);
    $(principalNameDup).html(principalname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #principalRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('principal.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#principalSuccessModal').modal();
          $('#principalSuccessModal').find('.modal-body').text('Principal inactivated successfully');
        }
        $("#principalDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#principalHeaders');
    let principalName = $('#confprincipalNames');
    let principalNameDup = $('#principalNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#principalActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let principalname = $('#principalName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(principalname));
    $(principalName).html(principalname);
    $(principalNameDup).html(principalname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #principalActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('principal.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#principalSuccessModal').modal();
          $('#principalSuccessModal').find('.modal-body').text('Principal activated successfully');
        }
        $("#principalActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#principalEditPage').modal();
    template.modalLoader.set(true);
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('principal.id', _id, (err, res) => {
      let principalDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let principalDetailId = _id;
      $(".id").val(principalDetailId);
      $("#principalNameEdits").val(principalDetail.principalName);
      $("#principalCodeEdits").val(principalDetail.principalCode);
      $(header).html('Update Principal');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updateprincipal': (event) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    updateprincipallist(event.target, loginUserVerticals);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateprincipal").each(function () {
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
    let header = $('#principalH');
    let principalName = $('#detailprincipalName');
    let principalCode = $('#detailprincipalCode');
    let status = $('#detailStatus');
    $('#principalDetailPage').modal();
    Meteor.call('principal.id', id, (principalError, principalResult) => {
      if (!principalError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(principalResult.principalName));
        if (principalResult.active === "Y") {
          $(status).html("Active");
        }
        else if (principalResult.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(principalName).html(principalResult.principalName);
        $(principalCode).html(principalResult.principalCode);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('principal.principalList', (principalError, principalResult) => {
      if (!principalError) {
        template.principalNameArray.set(principalResult);
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
  'click #fileUploadprincipal': (event, template) => {
    event.preventDefault();
    $("#uploadprincipal").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#principalUploadHeader');
    $('#principalUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadprincipal': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadprincipalFile");
    let myFile = $('.uploadprincipalFile').prop('files')[0];
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
      $('#principalErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#principalErrorModal').modal();
      $('#principalUploadConfirmation').modal('hide');
      $("#uploadprincipal")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let principalArray = [];
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
          let principalName = excelRows[i].PrincipalName;
          let randNumber = Math.floor((Math.random() * 1000) + 1);
          if (
            principalName !== undefined && principalName !== '') {
            let principalCode = principalName + " - " + randNumber.toString();
            principalArray.push({
              principalCode: principalCode.toString(), principalName: principalName,
            });
          }
        }
      }
      else {
        $('#principalErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#principalErrorModal').modal();
        $('#principalUploadConfirmation').modal('hide');
        $("#uploadprincipal")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (principalArray.length !== 0 && principalArray !== undefined) {
        $('#principalUploadConfirmation').modal('hide');
        return Meteor.call('principal.createUpload', principalArray, (error, result) => {
          if (error) {
            $('#principalErrorModal').find('.modal-body').text(error.reason);
            $('#principalErrorModal').modal();
            $('#principalUploadConfirmation').modal('hide');
            $("#uploadprincipal")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#principalUploadConfirmation').modal('hide');
            $("#uploadprincipal")[0].reset();
            $('#principalSuccessModal').find('.modal-body').text(` Principal has been registered successfully (${principalArray.length} Nos)`);
            $('#principalSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#principalErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#principalErrorModal').modal();
        $('#principalUploadConfirmation').modal('hide');
        $("#uploadprincipal")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #principalFileClose': (event, template) => {
    $("#uploadprincipal").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadprincipal': (event, template) => {
    event.preventDefault();
    let data = [{
      PrincipalName: '',
    }];
    dataCSV = data.map(element => ({
      'PrincipalName': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "principalFormat.xls");
  },
  'change .uploadprincipalFile': function (event, template) {
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
      active: "Y",
    });
  },
  /**
  * TODO: Complete JS doc
  * 
  */
  'click .inactiveFilter': (event, template) => {
    event.preventDefault();
    Template.instance().pagination.settings.set('filters', {
      active: "N",
    });
  },

});