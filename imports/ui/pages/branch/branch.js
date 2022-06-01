/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Branch } from "../../../api/branch/branch";
import XLSX from 'xlsx';

Template.branch.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.branchNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Branch, {
    filters: {
      active: "Y",
    },
    sort: { createdAt: -1 },
    fields: {
      branchCode: 1,
      branchName: 1,
      active: 1
    },
    perPage: 20
  });
});

Template.branch.onRendered(function () {
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
  Meteor.call('branch.branchList', (branchError, branchResult) => {
    if (!branchError) {
      this.branchNameArray.set(branchResult);
    }
  });
  /**
   * TODO: Complete JS doc
   */
  $('.branchNameSelection').select2({
    placeholder: "Select Branch Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.branchCodeSelection').select2({
    placeholder: "Select Branch Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".branchCodeSelection").parent(),
  });

});

Template.branch.helpers({
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
    return globalOptionsHelper('branchs');
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
    let config = globalOptionsHelper('branchs');
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
  branchList: function () {
    return Template.instance().pagination.getPage();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  branchLists: function () {
    return Template.instance().branchNameArray.get();
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

Template.branch.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .branchFilter': (event) => {
    event.preventDefault();
    let branchCode = event.target.branchCodeSelection.value;
    let branchName = event.target.branchNameSelection.value;
    if (branchCode && branchName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          branchCode: branchCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (branchName && branchCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          branchName: branchName,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (branchCode && branchName) {
      Template.instance().pagination.settings.set('filters',
        {
          branchCode: branchCode,
          branchName: branchName,
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
    $("#branchCodeSelection").val('').trigger('change');
    $("#branchNameSelection").val('').trigger('change');
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
  'click #ic-create-branch-button': () => {
    $("#ic-create-branch").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#branchHeader');
    let branchName = $('#confbranchName');
    let branchNameDup = $('#branchNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#branchDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let branchname = $('#branchName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(branchname));
    $(branchName).html(branchname);
    $(branchNameDup).html(branchname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #branchRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('branch.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#branchSuccessModal').modal();
          $('#branchSuccessModal').find('.modal-body').text('Branch inactivated successfully');
        }
        $("#branchDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#branchHeaders');
    let branchName = $('#confbranchNames');
    let branchNameDup = $('#branchNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#branchActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let branchname = $('#branchName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(branchname));
    $(branchName).html(branchname);
    $(branchNameDup).html(branchname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #branchActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('branch.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#branchSuccessModal').modal();
          $('#branchSuccessModal').find('.modal-body').text('Branch activated successfully');
        }
        $("#branchActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#branchEditPage').modal();
    template.modalLoader.set(true);
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('branch.id', _id, (err, res) => {
      let branchDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let branchDetailId = _id;
      $(".id").val(branchDetailId);
      $("#branchNameEdits").val(branchDetail.branchName);
      $("#branchCodeEdits").val(branchDetail.branchCode);
      $(header).html('Update Branch');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatebranch': (event) => {
    event.preventDefault();
    let loginUserVerticals = Session.get("loginUserVerticals");
    updatebranchlist(event.target, loginUserVerticals);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatebranch").each(function () {
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
    let header = $('#branchH');
    let branchName = $('#detailBranchName');
    let branchCode = $('#detailBranchCode');
    let status = $('#detailStatus');
    $('#branchDetailPage').modal();
    Meteor.call('branch.id', id, (branchError, branchResult) => {
      if (!branchError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(branchResult.branchName));
        if (branchResult.active === "Y") {
          $(status).html("Active");
        }
        else if (branchResult.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(branchName).html(branchResult.branchName);
        $(branchCode).html(branchResult.branchCode);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('branch.branchList', (branchError, branchResult) => {
      if (!branchError) {
        template.branchNameArray.set(branchResult);
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
  'click #fileUploadbranch': (event, template) => {
    event.preventDefault();
    $("#uploadbranch").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#branchUploadHeader');
    $('#branchUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadbranch': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadbranchFile");
    let myFile = $('.uploadbranchFile').prop('files')[0];
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
      $('#branchErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#branchErrorModal').modal();
      $('#branchUploadConfirmation').modal('hide');
      $("#uploadbranch")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let branchArray = [];
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
          let branchCode = excelRows[i].BranchCode;
          let branchName = excelRows[i].BranchName;
          if (branchCode !== undefined && branchCode !== '' &&
            branchName !== undefined && branchName !== '') {
            branchArray.push({
              branchCode: branchCode.toString(), branchName: branchName,
            });
          }
        }
      }
      else {
        $('#branchErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#branchErrorModal').modal();
        $('#branchUploadConfirmation').modal('hide');
        $("#uploadbranch")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (branchArray.length !== 0 && branchArray !== undefined) {
        $('#branchUploadConfirmation').modal('hide');
        return Meteor.call('branch.createUpload', branchArray, (error, result) => {
          if (error) {
            $('#branchErrorModal').find('.modal-body').text(error.reason);
            $('#branchErrorModal').modal();
            $('#branchUploadConfirmation').modal('hide');
            $("#uploadbranch")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#branchUploadConfirmation').modal('hide');
            $("#uploadbranch")[0].reset();
            $('#branchSuccessModal').find('.modal-body').text(` Branch has been registered successfully (${branchArray.length} Nos)`);
            $('#branchSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#branchErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#branchErrorModal').modal();
        $('#branchUploadConfirmation').modal('hide');
        $("#uploadbranch")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #branchFileClose': (event, template) => {
    $("#uploadbranch").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadbranch': (event, template) => {
    event.preventDefault();
    let data = [{
      bPLId: '', bPLName: '',
    }];
    dataCSV = data.map(element => ({
      'BranchCode': '',
      'BranchName': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "BranchFormat.xls");
  },
  'change .uploadbranchFile': function (event, template) {
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