/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Location } from "../../../api/location/location";
import XLSX from 'xlsx';

Template.location.onCreated(function () {

  const self = this;
  self.autorun(() => {
  });
  this.locationNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.branchListGet = new ReactiveVar();
  this.branchEdit = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Location, {
    filters: {
      active: "Y"
    },
    sort: { createdAt: -1 },
    fields:{locationCode:1,
      locationName:1,
      branch:1,
      active:1},
    perPage: 20
  });
});

Template.location.onRendered(function () {
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
  Meteor.call('location.locationList', (locationError, locationResult) => {
    if (!locationError) {
      this.locationNameArray.set(locationResult);
    }
  });

  // /**
  //  * get branch list for edit
  //  */
  // Meteor.call('branch.verticalList', loginUserVerticals, (branchErr, branchRes) => {
  //   if (!branchErr) {
  //     this.branchListGet.set(branchRes);
  //   }
  // });

  Meteor.call('branch.branchActiveList', (branchErr, branchRes) => {
    if (!branchErr) {
      this.branchListGet.set(branchRes);
    }
  });
  /**
   * TODO: Complete JS doc
   */
  $('.locationNameSelection').select2({
    placeholder: "Select Location Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".locationNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.locationCodeSelection').select2({
    placeholder: "Select Location Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".locationCodeSelection").parent(),
  });

  $('.selectbranchEdit').select2({
    placeholder: "Select Branch",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectbranchEdit").parent(),
  });

});

Template.location.helpers({
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
  getbranchListEdit: () => {
    let branchId = Template.instance().branchEdit.get();
    if (branchId) {
      Meteor.setTimeout(function () {
        $('#selectbranchEdit').val(branchId).trigger('change');
      }, 100);
    }
    return Template.instance().branchListGet.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('locations');
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
   * @param {} branch 
   */
  getBranchName: (branch) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("branch.idBranchName", branch, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.branchIdVal_' + branch).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.branchIdVal_' + branch).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('locations');
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
  locationList: function () {
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
  locationLists: function () {
    return Template.instance().locationNameArray.get();
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

Template.location.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .locationFilter': (event) => {
    event.preventDefault();
    let locationCode = event.target.locationCodeSelection.value;
    let locationName = event.target.locationNameSelection.value;
    if (locationCode && locationName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          locationCode: locationCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (locationName && locationCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          locationName: locationName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (locationCode && locationName) {
      Template.instance().pagination.settings.set('filters',
        {
          locationCode: locationCode,
          locationName: locationName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
    //else 
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    Template.instance().pagination.settings.set('filters', {
      active: "Y"
    });
    $('form :input').val("");
    $("#locationCodeSelection").val('').trigger('change');
    $("#locationNameSelection").val('').trigger('change');
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
  'click #ic-create-location-button': () => {
    $("#ic-create-location").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#locationHeader');
    let locationName = $('#conflocationName');
    let locationNameDup = $('#locationNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#locationDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let locationname = $('#locationName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(locationname));
    $(locationName).html(locationname);
    $(locationNameDup).html(locationname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #locationRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('location.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#locationSuccessModal').modal();
          $('#locationSuccessModal').find('.modal-body').text('Location inactivated successfully');
        }
        $("#locationDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#locationHeaders');
    let locationName = $('#conflocationNames');
    let locationNameDup = $('#locationNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#locationActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let locationname = $('#locationName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(locationname));
    $(locationName).html(locationname);
    $(locationNameDup).html(locationname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #locationActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('location.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#locationSuccessModal').modal();
          $('#locationSuccessModal').find('.modal-body').text('Location activated successfully');
        }
        $("#locationActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#locationEditPage').modal();
    template.modalLoader.set(true);
    template.branchEdit.set('');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('location.id', _id, (err, res) => {
      let locationDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let locationDetailId = _id;
      $(".id").val(locationDetailId);
      $("#locationNameEdits").val(locationDetail.locationName);
      $("#locationCodeEdits").val(locationDetail.locationCode);
      template.branchEdit.set(locationDetail.branch);
      $(header).html('Update Location');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatelocation': (event) => {
    event.preventDefault();
    let branch = '';
    $('#selectbranchEdit').find(':selected').each(function () {
      branch = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    updatelocationlist(event.target, branch, loginUserVerticals);
    $('#selectbranchEdit').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatelocation").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#selectbranchEdit').val('').trigger('change');
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#locationH');
    let locationName = $('#detaillocationName');
    let locationCode = $('#detaillocationCode');
    let branchName = $('#detailBranch');
    let status = $('#detailStatus');
    $('#locationDetailPage').modal();
    Meteor.call('location.idDataGet', id, (locationError, locationResult) => {
      if (!locationError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(locationResult.locRes.locationName));
        if (locationResult.locRes.active === "Y") {
          $(status).html("Active");
        }
        else if (locationResult.locRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(locationName).html(locationResult.locRes.locationName);
        $(locationCode).html(locationResult.locRes.locationCode);
        $(branchName).html(locationResult.branchName);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('location.locationList', (locationError, locationResult) => {
      if (!locationError) {
        template.locationNameArray.set(locationResult);
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
  'click #fileUploadlocation': (event, template) => {
    event.preventDefault();
    $("#uploadlocation").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#locationUploadHeader');
    $('#locationUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadlocation': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadlocationFile");
    let myFile = $('.uploadlocationFile').prop('files')[0];
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
      $('#locationErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#locationErrorModal').modal();
      $('#locationUploadConfirmation').modal('hide');
      $("#uploadlocation")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let locationArray = [];
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
          let locationCode = excelRows[i].locationCode;
          let locationName = excelRows[i].locationName;
          if (locationCode !== undefined && locationCode !== '' &&
            locationName !== undefined && locationName !== '') {
            locationArray.push({
              locationCode: locationCode.toString(), locationName: locationName,
            });
          }
        }
      }
      else {
        $('#locationErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#locationErrorModal').modal();
        $('#locationUploadConfirmation').modal('hide');
        $("#uploadlocation")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (locationArray.length !== 0 && locationArray !== undefined) {
        $('#locationUploadConfirmation').modal('hide');
        return Meteor.call('location.createUpload', locationArray, (error, result) => {
          if (error) {
            $('#locationErrorModal').find('.modal-body').text(error.reason);
            $('#locationErrorModal').modal();
            $('#locationUploadConfirmation').modal('hide');
            $("#uploadlocation")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#locationUploadConfirmation').modal('hide');
            $("#uploadlocation")[0].reset();
            $('#locationSuccessModal').find('.modal-body').text(` Location has been registered successfully (${locationArray.length} Nos)`);
            $('#locationSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#locationErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#locationErrorModal').modal();
        $('#locationUploadConfirmation').modal('hide');
        $("#uploadlocation")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #locationFileClose': (event, template) => {
    $("#uploadlocation").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadlocation': (event, template) => {
    event.preventDefault();
    let data = [{
      bPLId: '', bPLName: '',
    }];
    dataCSV = data.map(element => ({
      'locationCode': '',
      'locationName': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "locationFormat.xls");
  },
  'change .uploadlocationFile': function (event, template) {
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
    $('#bodySpinLoaders').css('display', 'block');
    Meteor.setTimeout(function () {
      $('#bodySpinLoaders').css('display', 'none');
    }, 3000);
    Template.instance().pagination.settings.set('filters', {
      active: "N"
    });
  },

});