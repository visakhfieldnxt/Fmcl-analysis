/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';

Template.sdPrice.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.priceNameArray = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.productListGet = new ReactiveVar();
  this.productEdit = new ReactiveVar();
  this.unitList = new ReactiveVar();
  this.fileName = new ReactiveVar();
  this.unitEdits = new ReactiveVar();
  this.priceTypeEdits = new ReactiveVar();
  this.priceTypeList = new ReactiveVar();
  this.productFullListGet = new ReactiveVar();
  this.verticalList = new ReactiveVar();
  this.priceResultArray = new ReactiveVar();
  this.getProductVar = new ReactiveVar();
  this.getTypeVar = new ReactiveVar();
});

Template.sdPrice.onRendered(function () {
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
   * get price type list
   */
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('priceType.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.priceTypeList.set(res);
    }
  });
  /**
   * get branch list for edit
   */
  Meteor.call('product.userWiseList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.productListGet.set(res);
    }
  });

  Meteor.call('vertical.userList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.verticalList.set(res);
    }
  });
  /**
   * get branch list for edit
   */

  /**
   * TODO: Complete JS doc
   */
  $('.productSelection').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".productSelection").parent(),
  });
  $('.getProductIds').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".getProductIds").parent(),
  });
  $('.getTypeIds').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".getTypeIds").parent(),
  });

  /**
 * TODO: Complete JS doc
 */
  $('.selectProductEdit').select2({
    placeholder: "Select Product",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectProductEdit").parent(),
  });

  /**
* TODO: Complete JS doc
*/
  $('.getVerticalIds').select2({
    placeholder: "Select Vertical",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".getVerticalIds").parent(),
  });
  /**
   * TODO: Complete JS doc
   */
  $('.priceTypeSelection').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".priceTypeSelection").parent(),
  });

  $('.selectPriceTypeEdit').select2({
    placeholder: "Select Price Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectPriceTypeEdit").parent(),
  });
  /**
* TODO: Complete JS doc
*/
  $('.selectUnitEdit').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnitEdit").parent(),
  });

  Meteor.call('sdProducts.getProductVar',Meteor.userId(),(err,res)=>{
    if(!err){
      this.getProductVar.set(res);
    }
  });
  let verticals = Session.get("loginUserVerticals");
  Meteor.call('price.getTypeVar',Meteor.userId(), verticals,(err,res)=>{
    if(!err){
      this.getTypeVar.set(res);
    }
  });
});

Template.sdPrice.helpers({
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
 * get branch list
 */
  getProductListEdit: () => {
    let productId = Template.instance().productEdit.get();
    if (productId) {
      Meteor.setTimeout(function () {
        $('#selectProductEdit').val(productId).trigger('change');
      }, 100);
    }
    return Template.instance().productListGet.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper('prices');
  },
  /**
 * get vertical list */
  getVertical: () => {
    return Template.instance().verticalList.get();
  },
  /**
* get price type
*/
  getUnitListEdit: () => {
    let unitId = Template.instance().unitEdits.get();
    if (unitId) {
      Meteor.setTimeout(function () {
        $('#selectUnitEdit').val(unitId).trigger('change');
      }, 100);
    }
    return Template.instance().unitList.get();
  },
  /**
* get price type
*/
  getPriceTypeEdit: () => {
    let priceId = Template.instance().priceTypeEdits.get();
    if (priceId) {
      Meteor.setTimeout(function () {
        $('#selectPriceTypeEdit').val(priceId).trigger('change');
      }, 100);
    }
    return Template.instance().priceTypeList.get();
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
    let config = globalOptionsHelper('prices');
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
  priceList: function () {
    return Template.instance().priceResultArray.get();
  },
  /**
   * TODO: Complete JS doc
   * @returns {rolelist}
   */
  priceLists: function () {
    return Template.instance().priceNameArray.get();
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
  /**
* TODO:Complete Js doc
* Formating the price 
*/
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(2);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
   * 
   * @param {*} status 
   * @returns 
   */
  statusCheck: (status) => {
    if (status === "Y") {
      return "Active";
    }
    else {
      return "Inactive";
    }
  },
  getProduct: () => {
    return Template.instance().getProductVar.get();
  },
  getType: () => {
    return Template.instance().getTypeVar.get();
  }
});

Template.sdPrice.events({

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .priceFilter': (event, template) => {
    event.preventDefault();
    let vertical = '';
    $('#getVerticalIds').find(':selected').each(function () {
      vertical = $(this).val();
    });
    let product = '';
    $('#getProductIds').find(':selected').each(function () {
       product = $(this).val();
    });
    let type = '';
    $('#getTypeIds').find(':selected').each(function () {
       type = $(this).val();
    });
    template.modalLoader.set(false);
    if (vertical !== '') {
      template.modalLoader.set(true);
      Meteor.call('price.sdDataGet', vertical, Meteor.userId(),product,type, (err, res) => {
        if (!err) {
          template.priceResultArray.set(res);
          template.modalLoader.set(false);
        }
        else {
          template.modalLoader.set(false);
          template.priceResultArray.set('');
        }
      });
    }else{
      toastr["error"]('Please Enter Vertical');
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': (event, template) => {
    $('#getVerticalIds').val('').trigger('change');
    $('#getProductIds').val('').trigger('change');
    $('#getTypeIds').val('').trigger('change');
    template.priceResultArray.set('');
  },
  /**
   * TODO: Complete JS doc
   * 
   */
  'click #ic-create-price-button': () => {
    $("#ic-create-price").modal();
    $('div.hint').hide();
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .deactivate': (event) => {
    event.preventDefault();
    let header = $('#priceHeader');
    let priceName = $('#confpriceName');
    let priceNameDup = $('#priceNameDup');
    let confirmedUuid = $('#confirmedUuid');
    $('#priceDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let pricename = $('#priceName_' + _id).val();
    $(header).html('Confirm Deactivation');
    $(priceName).html(pricename);
    $(priceNameDup).html(pricename);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #priceRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('price.inactive', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#priceSuccessModal').modal();
          $('#priceSuccessModal').find('.modal-body').text('Price inactivated successfully');
        }
        $("#priceDelConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .activate': (event) => {
    event.preventDefault();
    let header = $('#priceHeaders');
    let priceName = $('#confpriceNames');
    let priceNameDup = $('#priceNameDups');
    let confirmedUuid = $('#confirmedUuids');
    $('#priceActiveConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    let pricename = $('#priceName_' + _id).val();
    $(header).html('Confirm Activation ');
    $(priceName).html(pricename);
    $(priceNameDup).html(pricename);
    $(confirmedUuid).val(_id);
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click #priceActivate': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuids').val();
    if (_id && $.trim(_id)) {
      Meteor.call('price.active', $.trim(_id), (error) => {
        if (error) {
          $('#message').html("Internal error - unable to remove entry. Please try again");
        } else {
          $('#priceSuccessModal').modal();
          $('#priceSuccessModal').find('.modal-body').text('Price activated successfully');
        }
        $("#priceActiveConfirmation").modal('hide');
      });
    }
  },

  /**
   * TODO: Complete JS doc
   * @param event
   */
  'click .edit': (event, template) => {
    event.preventDefault();
    $('#priceEditPage').modal();
    template.modalLoader.set(true);
    template.productEdit.set('');
    let header = $('#categoryH');
    $(header).html('Update Price');
    template.unitEdits.set('');
    template.priceTypeEdits.set('');
    let _id = event.currentTarget.attributes.id.value;
    Meteor.call('price.id', _id, (err, res) => {
      let priceDetail = res;
      $('div.hint').hide();
      template.modalLoader.set(false);
      let priceDetailId = _id;
      $(".id").val(priceDetailId);
      $("#priceGetEdit").val(priceDetail.priceVsr);
      $("#priceGetOmrEdit").val(priceDetail.priceOmr);
      $("#priceGetWSEdit").val(priceDetail.priceWs);
      template.productEdit.set(priceDetail.product);
      template.unitEdits.set(priceDetail.unit);
      template.priceTypeEdits.set(priceDetail.priceType);
    });
  },

  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $(".updateprice").each(function () {
      this.reset();
    });
    template.modalLoader.set(false);
    template.priceResultArray.set('');
    $('#selectProductEdit').val('').trigger('change');
    $('#selectUnitEdit').val('').trigger('change');
    $('#selectPriceTypeEdit').val('').trigger('change');
  },
  /**
   * TODO:Complete JS doc
   * @param event
   */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.modalLoader.set(true);
    let header = $('#priceH');
    let priceTypeName = $('#detailpriceTypeName');
    let unitName = $('#detailUnit');
    let price = $('#detailPrice');
    let priceOmr = $('#detailPriceOmr');
    let pricews = $('#detailPriceWs');
    let productName = $('#detailProduct');
    let status = $('#detailStatus');
    $('#priceDetailPage').modal();
    Meteor.call('price.idDataGet', id, (priceError, priceResult) => {
      if (!priceError) {
        template.modalLoader.set(false);
        $(header).html('Details of price');
        if (priceResult.priceRes.active === "Y") {
          $(status).html("Active");
        }
        else if (priceResult.priceRes.active === "N") {
          $(status).html("Inactive");
        }
        else {
          $(status).html("");
        }
        $(priceTypeName).html(priceResult.priceTypeName);
        $(unitName).html(priceResult.unitName);
        $(price).html(Number(priceResult.priceRes.priceVsr).toFixed(2));
        $(priceOmr).html(Number(priceResult.priceRes.priceOmr).toFixed(2));
        $(pricews).html(Number(priceResult.priceRes.priceWs).toFixed(2));
        $(productName).html(priceResult.productName);
      }
    });

  },

  /**
* TODO: Complete JS doc
*/
  'click #filterSearch': (event, template) => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

  /**
    * 
    * @param {*} event 
    * @param {*} template 
    * get unit based on product
    */
  'change #selectProductEdit': (event, template) => {
    event.preventDefault();
    let product = '';
    template.unitList.set('');
    template.modalLoader.set(false);
    $('#selectProductEdit').find(':selected').each(function () {
      product = $(this).val();
    });
    if (product !== undefined && product !== '') {
      template.modalLoader.set(true);
      Meteor.call('unit.unitCodeGet', product, (err, res) => {
        if (!err) {
          template.modalLoader.set(false);
          template.unitList.set(res);
        }
        else {
          template.modalLoader.set(false);
        }
      })
    }
  },
  // number validation
  'keypress #priceGet': (evt) => {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
      var inputValue = $("#priceGet").val()
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
    Template.instance().pagination.settings.set('filters', {
      active: "Y", vertical: { $in: loginUserVerticals },
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
    let loginUserVerticals = Session.get("loginUserVerticals");
    Template.instance().pagination.settings.set('filters', {
      active: "N", vertical: { $in: loginUserVerticals },
    });

  },

});