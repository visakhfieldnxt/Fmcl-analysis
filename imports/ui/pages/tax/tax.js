/**
 * @author Visakh
 */
import { Meteor } from 'meteor/meteor';
import { Tax } from "../../../api/tax/tax";
import XLSX from 'xlsx';

Template.tax.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });

  this.modalLoader = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.taxLists = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Tax, {
    filters: {
      disabled: { $ne: 'Y' },
    },
    sort: { createdAt: -1 },
    perPage: 20
  });

});

Template.tax.onRendered(function () {
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
     * Getting user branch list
     */
  Meteor.call('tax.taxList', (err, res) => {
    if (!err) {
      this.taxLists.set(res);
    }
  });

  /**
 * TODO: Complete JS doc
 */
  $('.categoryEdits').select2({
    placeholder: "Select Category",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryEdits").parent(),
  });
  /**
 * TODO: Complete JS doc
 */
  $('.taxcategoryEdits').select2({
    placeholder: "Select Category",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".taxcategoryEdits").parent(),
  });
  /**
 * TODO: Complete JS doc
 */
  $('.taxCodeSelection').select2({
    placeholder: "Select Tax Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".taxCodeSelection").parent(),
  });

  /**
   * TODO: Complete JS doc
   */
  $('.taxNameSelection').select2({
    placeholder: "Select Tax",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".taxNameSelection").parent(),
  });


});

Template.tax.helpers({
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
    return globalOptionsHelper('taxs');
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
    let config = globalOptionsHelper('taxs');
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
  taxList: function () {
    return Template.instance().pagination.getPage();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  taxsLists: function () {
    return Template.instance().taxLists.get();
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
   * TODO: Complete JS doc
   */
  date: function () {
    return new Date();
  },
/**
   * TODO: Complete JS doc
   * @returns {*}
   */
  type: function (category) {
    if (category === "I") {
      return "Inward";
    }
    else if (category === "O"){
      return "Outward";
    }
  },
});

Template.tax.events({


  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .taxFilter': (event) => {
    event.preventDefault();
    let taxCode = event.target.taxCodeSelection.value;
    let taxName = event.target.taxNameSelection.value;
    let taxCategory = event.target.taxcategoryEdits.value;

    if (taxCode && taxName === '' && taxCategory !== '') {
      Template.instance().pagination.settings.set('filters',
        {
          taxCode: taxCode
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxName && taxCode === '' && taxCategory !== '') {
      Template.instance().pagination.settings.set('filters',
        {
          name: taxName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxCategory && taxName === '' && taxCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          category: taxCategory
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxCode && taxName && taxCategory !== '') {
      Template.instance().pagination.settings.set('filters',
        {
          taxCode: taxCode,
          name: taxName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxName && taxCategory && taxCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          category: taxCategory,
          name: taxName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxCode && taxCategory && taxName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          taxCode: taxCode,
          category: taxCategory
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (taxCode && taxCategory && taxName) {
      Template.instance().pagination.settings.set('filters',
        {
          taxCode: taxCode,
          category: taxCategory,
          name: taxName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
      $('.taskHeaderList').css('display', 'none');
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
    $("#taxCodeSelection").val('').trigger('change');
    $("#taxNameSelection").val('').trigger('change');
    $("#taxcategoryEdits").val('').trigger('change');

    let element = document.getElementById("inactiveFilter");
    element.classList.remove("active");
    let elements = document.getElementById("activeFilter");
    elements.classList.add("active");
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-tax-button': () => {
    $("#ic-create-tax").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#taxHeader');
    let taxName = $('#conftaxName');
    let taxNameDup = $('#taxNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#taxDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let taxname = $('#name_' + _id).val();
    $(header).html('Confirm Deletion Of ' + $.trim(taxname));
    $(taxName).html(taxname);
    $(taxNameDup).html(taxname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #taxRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('tax.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#taxSuccessModal').modal();
          $('#taxSuccessModal').find('.modal-body').text('Tax inactivated successfully');
        }
        $("#taxDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#taxHeaders');
    let taxName = $('#conftaxNames');
    let taxNameDup = $('#taxNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#taxActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let taxname = $('#name_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(taxname));
    $(taxName).html(taxname);
    $(taxNameDup).html(taxname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #taxActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('tax.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#taxSuccessModal').modal();
          $('#taxSuccessModal').find('.modal-body').text('Tax activated successfully');
        }
        $("#taxActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event) => {
    event.preventDefault();
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('tax.tax_id', _id, (err, res) => {
      let taxDetail = res;
      let header = $('#categoryH');
      $('#taxEditPage').modal();
      $('div.hint').hide();
      let taxDetailId = _id;
      let taxDetailItemTaxName = taxDetail.name;
      let taxDetailItemTaxCode = taxDetail.taxCode;
      let taxDetailItemTaxRate = taxDetail.rate;
      $(".id").val(taxDetailId);
      Meteor.setTimeout(function () {
        let taxDetailtax = taxDetail.category;
        $('.categoryEdits').val(taxDetailtax).trigger('change');
      }, 200);

      $("#taxNameEdits").val(taxDetailItemTaxName);
      $("#taxCodeEdits").val(taxDetailItemTaxCode);
      $("#taxRateEdits").val(taxDetailItemTaxRate);
      $(header).html('Update Tax');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatetax': (event) => {
    event.preventDefault();

    let category = '';

    $('.categoryEdits').find(':selected').each(function () {
      category = $(this).val();
    });

    updatetaxlist(event.target, category);
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatetax").each(function () {
      this.reset();
    });
    $('.categoryEdits').val(null).trigger('change');
    template.modalLoader.set('');
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set('');
    let header = $('#taxH');
    let taxName = $('#detailTaxName');
    let taxCode = $('#detailTaxCode');
    let taxRate = $('#detailTaxRate');
    let category = $('#detailCategory');
    let status = $('#detailStatus');

    $('#taxDetailPage').modal();
    Meteor.call('tax.tax_id', id, (taxError, taxResult) => {
      if (!taxError) {
        template.modalLoader.set(taxResult);
        let tax = taxResult;
        $(header).html('Details of ' + $.trim(tax.name));
        $(taxName).html(tax.name);
        $(taxCode).html(tax.taxCode);
        $(taxRate).html(tax.rate);

        if (tax.category === "I") {
          $(category).html("Inward");
        }
        else if (tax.category === "O") {
          $(category).html("Outward");
        }
        else {
          $(category).html("");
        }

        if (tax.disabled === "N") {
          $(status).html("Active");
        }
        else if (tax.disabled === "Y") {
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
  'click #fileUploadtax': (event, template) => {
    event.preventDefault();
    $("#uploadtax").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#taxUploadHeader');
    $('#taxUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadtax': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadtaxFile");
    let myFile = $('.uploadtaxFile').prop('files')[0];
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
      let taxArray = [];
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      //Fetch the name of First Sheet.
      let firstSheet = workbook.SheetNames[0];
      //Read all rows from First Sheet into an JSON array.
      let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
      //Add the data rows from Excel file.
      for (let i = 0; i < excelRows.length; i++) {
        let taxName = excelRows[i].TaxName;
        let taxCode = excelRows[i].TaxCode;
        let rate = excelRows[i].Rate;
        let category = excelRows[i].Category;
        if (taxName !== undefined && taxName !== '' &&
          taxCode !== undefined && taxCode !== '' &&
          taxName !== undefined && taxName !== '' &&
          category !== undefined && category !== '') {
          taxArray.push({ taxCode: taxCode, name: taxName, rate: rate.toString(), category: category });
        }
      }
      if (taxArray.length !== 0 && taxArray !== undefined) {
        return Meteor.call('tax.createUpload', taxArray, (error, result) => {
          if (error) {
            $('#taxErrorModal').find('.modal-body').text(error.reason);
            $('#taxErrorModal').modal();
            $('#taxUploadConfirmation').modal('hide');
            $("#uploadtax")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#taxUploadConfirmation').modal('hide');
            $("#uploadtax")[0].reset();
            $('#taxSuccessModal').find('.modal-body').text('Tax has been registered successfully');
            $('#taxSuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#taxErrorModal').find('.modal-body').text('Invalid Data..!');
        $('#taxErrorModal').modal();
        $('#taxUploadConfirmation').modal('hide');
        $("#uploadtax")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #taxFileClose': (event, template) => {
    $("#uploadtax").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadtax': (event, template) => {
    event.preventDefault();
    let data = [{ itmsGrpNam: '', itmsGrpCod: '' }];
    dataCSV = data.map(element => ({
      'TaxCode': '',
      'TaxName': '',
      'Rate': '',
      'Category': ''
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "TaxFormat.xls");
  },
  'change .uploadtaxFile': function (event, template) {
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