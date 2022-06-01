/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
import { Category } from "../../../api/category/category";
import XLSX from 'xlsx';

Template.category.onCreated(function () {

  const self = this;
  self.autorun(() => {
  });
  this.categoryNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.brandListGet = new ReactiveVar();
  this.brandEdit = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.principalListGet = new ReactiveVar();
  this.principalEdits = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Category, {
    filters: {
      active: "Y"
    },
    sort: { createdAt: -1 },
    fields:{categoryCode:1,
      categoryName:1,
      principal:1,
      brand:1,
      active:1},
    perPage: 20
  });
});

Template.category.onRendered(function () {
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
  Meteor.call('category.categoryList', (categoryError, categoryResult) => {
    if (!categoryError) {
      this.categoryNameArray.set(categoryResult);
    }
  });
  /**
  * get brand list 
  * */
  Meteor.call('principal.principalActiveList', (err, res) => {
    if (!err) {
      this.principalListGet.set(res);
    }
  });
  // /**
  //  * get brand list for edit
  //  */
  // Meteor.call('brand.verticalList', loginUserVerticals, (brandErr, brandRes) => {
  //   if (!brandErr) {
  //     this.brandListGet.set(brandRes);
  //   }
  // });


  /**
   * TODO: Complete JS doc
   */
  $('.categoryNameSelection').select2({
    placeholder: "Select Category Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryNameSelection").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.categoryCodeSelection').select2({
    placeholder: "Select Category Code",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryCodeSelection").parent(),
  });

  $('.selectPrincipalEdit').select2({
    placeholder: "Select Principal",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPrincipalEdit").parent(),
  });

  $('.selectbrandEdit').select2({
    placeholder: "Select Brand",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectbrandEdit").parent(),
  });

});

Template.category.helpers({
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
* @returns {rolelist}
*/
  getPricipalListEdit: function () {
    let principalId = Template.instance().principalEdits.get();
    if (principalId) {
      Meteor.setTimeout(function () {
        $('#selectPrincipalEdit').val(principalId).trigger('change');
      }, 100);
    }
    return Template.instance().principalListGet.get();
  },
  /**
 * get brand list
 */
  getbrandListEdit: () => {
    let brandId = Template.instance().brandEdit.get();
    if (brandId) {
      Meteor.setTimeout(function () {
        $('#selectbrandEdit').val(brandId).trigger('change');
      }, 100);
    }
    return Template.instance().brandListGet.get();
  },
  /**
* get brand name
* @param {} brand 
*/
  getPrincipalName: (principal) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("principal.idprincipalName", principal, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.principalVal_' + principal).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.principalVal_' + principal).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('categorys');
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
   * get brand name
   * @param {} brand 
   */
  getbrandName: (brand) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("brand.idbrandName", brand, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.brandIdVal_' + brand).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.brandIdVal_' + brand).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper('categorys');
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
  categoryList: function () {
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
  categoryLists: function () {
    return Template.instance().categoryNameArray.get();
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

Template.category.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .categoryFilter': (event) => {
    event.preventDefault();
    let categoryCode = event.target.categoryCodeSelection.value;
    let categoryName = event.target.categoryNameSelection.value;
    if (categoryCode && categoryName === '') {
      Template.instance().pagination.settings.set('filters',
        {
          categoryCode: categoryCode,
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (categoryName && categoryCode === '') {
      Template.instance().pagination.settings.set('filters',
        {
          categoryName: categoryName
        }
      );
      $('.taskHeaderList').css('display', 'none');
    }
    else if (categoryCode && categoryName) {
      Template.instance().pagination.settings.set('filters',
        {
          categoryCode: categoryCode,
          categoryName: categoryName
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
    $("#categoryCodeSelection").val('').trigger('change');
    $("#categoryNameSelection").val('').trigger('change');
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
  'click #ic-create-category-button': () => {
    $("#ic-create-category").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#categoryHeader');
    let categoryName = $('#confcategoryName');
    let categoryNameDup = $('#categoryNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#categoryDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let categoryname = $('#categoryName_' + _id).val();
    $(header).html('Confirm Deactivation Of ' + $.trim(categoryname));
    $(categoryName).html(categoryname);
    $(categoryNameDup).html(categoryname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #categoryRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('category.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#categorySuccessModal').modal();
          $('#categorySuccessModal').find('.modal-body').text('Category inactivated successfully');
        }
        $("#categoryDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#categoryHeaders');
    let categoryName = $('#confcategoryNames');
    let categoryNameDup = $('#categoryNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#categoryActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let categoryname = $('#categoryName_' + _id).val();
    $(header).html('Confirm Activation Of ' + $.trim(categoryname));
    $(categoryName).html(categoryname);
    $(categoryNameDup).html(categoryname);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #categoryActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('category.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#categorySuccessModal').modal();
          $('#categorySuccessModal').find('.modal-body').text('Category activated successfully');
        }
        $("#categoryActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#categoryEditPage').modal();
    template.modalLoader.set(true);
    template.brandEdit.set('');
    template.principalEdits.set('');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('category.id', _id, (err, res) => {
      let categoryDetail = res;
      let header = $('#categoryH');
      $('div.hint').hide();
      template.modalLoader.set(false);
      let categoryDetailId = _id;
      $(".id").val(categoryDetailId);
      $("#categoryNameEdits").val(categoryDetail.categoryName);
      template.principalEdits.set(categoryDetail.principal);
      $("#categoryCodeEdits").val(categoryDetail.categoryCode);
      template.brandEdit.set(categoryDetail.brand);
      $(header).html('Update Category');
    });
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .updatecategory': (event) => {
    event.preventDefault();
    let brand = '';
    $('#selectbrandEdit').find(':selected').each(function () {
      brand = $(this).val();
    });
    let principal = '';
    $('#selectPrincipalEdit').find(':selected').each(function () {
      principal = $(this).val();
    });
    let loginUserVerticals = Session.get("loginUserVerticals");
    updatecategorylist(event.target, brand, loginUserVerticals, principal);
    $('#selectbrandEdit').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updatecategory").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    $('#selectbrandEdit').val('').trigger('change');
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#categoryH');
    let categoryName = $('#detailcategoryName');
    let categoryCode = $('#detailcategoryCode');
    let brandName = $('#detailbrand');
    let status = $('#detailStatus');
    let detailPricipalName = $('#detailPricipalName');
    $('#categoryDetailPage').modal();
    Meteor.call('category.idDataGet', id, (categoryError, categoryResult) => {
      if (!categoryError) {
        template.modalLoader.set(false);
        $(header).html('Details of ' + $.trim(categoryResult.locRes.categoryName));
        if (categoryResult.locRes.active === "Y") {
          $(status).html("Active");
        }
        else if (categoryResult.locRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(categoryName).html(categoryResult.locRes.categoryName);
        $(categoryCode).html(categoryResult.locRes.categoryCode);
        $(brandName).html(categoryResult.brandName);
        $(detailPricipalName).html(categoryResult.principalName);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
    Meteor.call('category.categoryList', (categoryError, categoryResult) => {
      if (!categoryError) {
        template.categoryNameArray.set(categoryResult);
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
  'click #fileUploadcategory': (event, template) => {
    event.preventDefault();
    $("#uploadcategory").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
    let header = $('#categoryUploadHeader');
    $('#categoryUploadConfirmation').modal();
    $(header).html('Confirm Upload');
  },
  'submit #uploadcategory': (event, template) => {
    event.preventDefault();
    //Reference the FileUpload element.
    let fileUpload = document.getElementById("uploadcategoryFile");
    let myFile = $('.uploadcategoryFile').prop('files')[0];
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
      $('#categoryErrorModal').find('.modal-body').text('Invalid File Format!');
      $('#categoryErrorModal').modal();
      $('#categoryUploadConfirmation').modal('hide');
      $("#uploadcategory")[0].reset();
      template.fileName.set('');
      fileName = '';
    }
    function processExcel(data) {
      //Read the Excel File data.
      let categoryArray = [];
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
          let categoryName = excelRows[i].CategoryName;
          let brandName = excelRows[i].BrandName;
          let principal = excelRows[i].Principal;
          let randNumber = Math.floor((Math.random() * 1000) + 1);
          if (brandName !== undefined && brandName !== '' &&
            categoryName !== undefined && categoryName !== '' && principal !== '' && principal !== undefined) {
            let categoryCode = brandName + " - " + randNumber.toString();
            categoryArray.push({
              categoryCode: categoryCode.toString(), categoryName: categoryName,
              brandName: brandName,principal:principal
            });
          }
        }
      }
      else {
        $('#categoryErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#categoryErrorModal').modal();
        $('#categoryUploadConfirmation').modal('hide');
        $("#uploadcategory")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
      if (categoryArray.length !== 0 && categoryArray !== undefined) {
        $('#categoryUploadConfirmation').modal('hide');
        return Meteor.call('category.createUpload', categoryArray, (error, result) => {
          if (error) {
            $('#categoryErrorModal').find('.modal-body').text(error.reason);
            $('#categoryErrorModal').modal();
            $('#categoryUploadConfirmation').modal('hide');
            $("#uploadcategory")[0].reset();
            template.fileName.set('');
            fileName = '';
          }
          else {
            $('#categoryUploadConfirmation').modal('hide');
            $("#uploadcategory")[0].reset();
            $('#categorySuccessModal').find('.modal-body').text(` Category has been registered successfully (${categoryArray.length} Nos)`);
            $('#categorySuccessModal').modal();
            template.fileName.set('');
            fileName = '';
          }
        });
      }
      else {
        $('#categoryErrorModal').find('.modal-body').text('Invalid File Format!');
        $('#categoryErrorModal').modal();
        $('#categoryUploadConfirmation').modal('hide');
        $("#uploadcategory")[0].reset();
        template.fileName.set('');
        fileName = '';
      }
    };
  },
  /**
  * TODO: Complete JS doc
  */
  'click #categoryFileClose': (event, template) => {
    $("#uploadcategory").each(function () {
      this.reset();
    });
    template.fileName.set('');
    fileName = '';
  },

  /**
   * TODO: Complete JS doc
   */
  'click #downloadcategory': (event, template) => {
    event.preventDefault();
    let data = [{
      Principal: '', CategoryName: '', BrandName: '',
    }];
    dataCSV = data.map(element => ({
      'Principal': '',
      'CategoryName': '',
      'BrandName': '',
    }))
    let excel = Papa.unparse(dataCSV);
    let blob = new Blob([excel], { type: "text/xls;charset=utf-8" });
    saveAs(blob, "categoryFormat.xls");
  },
  'change .uploadcategoryFile': function (event, template) {
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
  /**
  * 
  * @param {*} event 
  * @param {*} template 
  */
  'change #selectPrincipalEdit': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#selectPrincipalEdit').find(':selected').each(function () {
      principal = $(this).val();
    });
    template.modalLoader.set(false);
    template.brandListGet.set('');
    if (principal !== undefined && principal !== '') {
      template.modalLoader.set(true);
      Meteor.call("brand.principalWiseList", principal, (err, res) => {
        if (!err) {
          template.brandListGet.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.brandListGet.set('');
          template.modalLoader.set(false);
        }
      });
    }
  },
});