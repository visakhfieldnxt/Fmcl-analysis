/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { CreditSale } from "../../../api/creditSale/creditSale";
import { Principal } from "../../../api/principal/principal";

Template.principalWiseSalesReport.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });
  this.modalLoader = new ReactiveVar();
  this.todayExport = new ReactiveVar();
  this.verticalArray1 = new ReactiveVar();
  this.listArray1 = new ReactiveVar();
  this.regionArray = new ReactiveVar();
  this.principalArray = new ReactiveVar();
  this.brandArray = new ReactiveVar();
  this.brandArrays = new ReactiveVar();
  this.categoryArray = new ReactiveVar();
  this.categoryArrays = new ReactiveVar();
  this.principalNameArray = new ReactiveVar();
  this.toDate = new ReactiveVar();
  this.fromDate = new ReactiveVar();
  this.brandfilter = new ReactiveVar();
  this.categoryfilter = new ReactiveVar();
  this.plistArray = new ReactiveVar();
  this.fromDateExport = new ReactiveVar();
  this.toDateExport = new ReactiveVar();
  this.brandfilterExport = new ReactiveVar();
  this.categoryfilterExport = new ReactiveVar();
  this.principal = new ReactiveVar();
  this.principalExport = new ReactiveVar();

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);

  this.pagination = new Meteor.Pagination(Principal, {
    fields: { principalName: 1 },
    perPage: 20
  });
});

Template.principalWiseSalesReport.onRendered(function () {
  this.brandfilter.set(null);
  this.categoryfilter.set(null);

  $('#bodySpinLoaders').css('display', 'block');
  Meteor.call('branch.branchList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.regionArray.set(res);
    }
  });
  Meteor.call('principal.principalList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.principalArray.set(res);
    }
  });
  Meteor.call('verticals.verticalList', (err, res) => {
    if (!err) {
      this.verticalArray1.set(res);
    }
  });

  $('.verticalfilter').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".verticalfilter").parent(),
  });
  $('.regionfilter').select2({
    placeholder: "Select Region Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".regionfilter").parent(),
  });
  $('.principalfilter').select2({
    placeholder: "Select Principal Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalfilter").parent(),
  }); $('.brandfilter').select2({
    placeholder: "Select Brand Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".brandfilter").parent(),
  }); $('.categoryfilter').select2({
    placeholder: "Select Category Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryfilter").parent(),
  });

  $('.principalNameSelection').select2({
    placeholder: "Select Principal Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalNameSelection").parent(),
  });

  $('.principalNameSelections').select2({
    placeholder: "Select Principal Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".principalNameSelections").parent(),
  });
  $('.brandfilters').select2({
    placeholder: "Select Brand Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".brandfilters").parent(),
  });
  $('.categoryfilters').select2({
    placeholder: "Select Category Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".categoryfilters").parent(),
  });

  Meteor.call('principal.principalList', (principalError, principalResult) => {
    if (!principalError) {
      this.principalNameArray.set(principalResult);
    }
  });
  let date = new Date();
  Template.instance().toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
  Template.instance().fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));

});

Template.principalWiseSalesReport.helpers({
  isReady: function () {
    return Template.instance().pagination.ready();
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
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
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
   */
  sortIcon: () => {
    genericSortIcons();
  },
  vertical1: function () {
    return Template.instance().verticalArray1.get();

  }, listOfData: function () {
    return Template.instance().listArray1.get();

  }, dataList: function () {

    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinLoaders').css('display', 'none');
    }
    return result;

  }, listofRegion: function () {
    return Template.instance().regionArray.get();

  }, listofPrincipal: function () {
    return Template.instance().principalArray.get();

  }, brandList: function () {
    return Template.instance().brandArray.get();

  }, brandLists: function () {
    return Template.instance().brandArrays.get();

  }, categoryList: function () {
    return Template.instance().categoryArray.get();

  }, categoryLists: function () {
    return Template.instance().categoryArrays.get();

  }, listData: function () {
    return Template.instance().plistArray.get();

  },
  formateAmountFix: (docTotal) => {
    if (docTotal == '') {
      return '0.00';
    } else
      return Number(docTotal).toFixed(2);
  },
  getProductName: (product) => {
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
      $('.productIdVal_' + product).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.productIdVal_' + product).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  }, datesfrom: (id) => {
    return moment(Template.instance().fromDate.get()).format('DD-MM-YYYY');

  }, datesto: (id) => {
    return moment(Template.instance().toDate.get()).format('DD-MM-YYYY');
  }, datesfromExport: (id) => {
    return moment(Template.instance().fromDateExport.get()).format('DD-MM-YYYY');

  }, datestoExport: (id) => {
    return moment(Template.instance().toDateExport.get()).format('DD-MM-YYYY');
  },
  roundIt: (value) => {
    return value.toFixed(2);
  }, principalLists: function () {
    return Template.instance().principalNameArray.get();
  }, getPrincipalName: (principal) => {
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
      $('.principalIdVal_' + principal).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }
    ).catch((error) => {
      $('.principalIdVal_' + principal).html('');
      $('#bodySpinLoaders').css('display', 'none');
    }
    );
  },
  salesByVolume: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();
    let principal = Template.instance().principal.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesVolume', id, fromDate, toDate, brandfilter, categoryfilter, (error, result) => {

        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVol_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVol_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByValue: (id) => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();
    let principal = Template.instance().principal.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesValue', id, fromDate, toDate, brandfilter, categoryfilter, (error, result) => {
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVal_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVal_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByVolumeExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();
    let principal = Template.instance().principalExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesVolume', id, fromDate, toDate, principal, brandfilter, categoryfilter, (error, result) => {
        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolExport_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVolExport_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  salesByValueExport: (id) => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();
    let principal = Template.instance().principalExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.totalSalesValue', id, fromDate, toDate, principal, brandfilter, categoryfilter, (error, result) => {
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValExport_' + id).html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleValExport_' + id).html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleVolumeTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();
    let principal = Template.instance().principal.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleVolumeTotal', fromDate, toDate, principal, brandfilter, categoryfilter, (error, result) => {
        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolumeTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVolumeTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleValueTotal: () => {
    let fromDate = Template.instance().fromDate.get();
    let toDate = Template.instance().toDate.get();
    let brandfilter = Template.instance().brandfilter.get();
    let categoryfilter = Template.instance().categoryfilter.get();
    let principal = Template.instance().principal.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleValueTotal', fromDate, toDate, principal, brandfilter, categoryfilter, (error, result) => {
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValueTotal').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleValueTotal').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleVolumeTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();
    let principal = Template.instance().principalExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleVolumeTotal', fromDate, toDate, principal, brandfilter, categoryfilter, (error, result) => {
        if (!error) {
          resolve(result.roundCtn + " CTN & " + result.findPcs + " PCS");
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleVolumeTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleVolumeTotalExport').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  },
  saleValueTotalExport: () => {
    let fromDate = Template.instance().fromDateExport.get();
    let toDate = Template.instance().toDateExport.get();
    let brandfilter = Template.instance().brandfilterExport.get();
    let categoryfilter = Template.instance().categoryfilterExport.get();
    let principal = Template.instance().principalExport.get();
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.saleValueTotal', fromDate, toDate, principal, brandfilter, categoryfilter, (error, result) => {
        if (!error) {
          resolve(result.toFixed(2));
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.saleValueTotalExport').html(result);
      $('#bodySpinLoaders').css('display', 'none');
    }).catch((error) => {
      $('.saleValueTotalExport').html('');
      $('#bodySpinLoaders').css('display', 'none');
    });
  }
});

Template.principalWiseSalesReport.events({
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  'submit .principal-filter': (event, template) => {
    event.preventDefault();
    let principalName = event.target.principalNameSelection.value;
    let brandfilter = event.target.brandfilter.value;
    let categoryfilter = event.target.categoryfilter.value;
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    template.toDate.set(toDate);
    template.fromDate.set(fromDate);
    template.principal.set(null);
    template.brandfilter.set(null);
    template.categoryfilter.set(null);
    if (first == '') {
      setTimeout(function () {
        $("#itemArrayspan").html('<style> #itemArrayspan { color:#fc5f5f }</style><span id ="itemArrayspan">Please Select From date</span>').fadeIn('fast');
      }, 0);
      return;
    } else {
      $("#itemArrayspan").html('');
    }
    if (second == '') {
      setTimeout(function () {
        $("#itemArrayspan_1").html('<style> #itemArrayspan_1 { color:#fc5f5f }</style><span id ="itemArrayspan_1">Please Select To date</span>').fadeIn('fast');
      }, 0);
      return;
    } else {
      $("#itemArrayspan_1").html('');
    }

    if (principalName && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && isNaN(toDate)) {
      template.principal.set(principalName); template.principalExport.set(principalName);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && isNaN(fromDate) && isNaN(toDate)) {
      template.brandfilter.set(brandfilter);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter === '' && fromDate && isNaN(toDate)) {
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.toDate.set(toDate);
    }
    else if (principalName && brandfilter && categoryfilter === '' && isNaN(fromDate) && isNaN(toDate)) {
      template.principal.set(principalName); template.principalExport.set(principalName);
      template.brandfilter.set(brandfilter);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter === '' && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.principal.set(principalName); template.principalExport.set(principalName);
      template.categoryfilter.set(categoryfilter);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && fromDate && isNaN(toDate)) {
      template.principal.set(principalName); template.principalExport.set(principalName);
      template.fromDate.set(fromDate);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.principal.set(principalName); template.principalExport.set(principalName);
      template.toDate.set(toDate);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && fromDate && isNaN(toDate)) {
      template.brandfilter.set(brandfilter);
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
    }
    else if (principalName === '' && brandfilter && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && fromDate && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && isNaN(fromDate) && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.toDate.set(toDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter === '' && fromDate && toDate) {
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && isNaN(fromDate) && toDate) {
      template.principal.set(principalName); template.principalExport.set(principalName);
      template.toDate.set(toDate);
    }
    else if (principalName && brandfilter && categoryfilter && isNaN(fromDate) && isNaN(toDate)) {
      template.principal.set(principalName); template.principalExport.set(principalName);
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter && fromDate && isNaN(toDate)) {
      template.categoryfilter.set(categoryfilter);
      template.fromDate.set(fromDate);
    }
    else if (principalName === '' && brandfilter === '' && categoryfilter && fromDate && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate)
    }
    else if (principalName && brandfilter === '' && categoryfilter === '' && fromDate && toDate) {
      template.principal.set(principalName);
      template.principalExport.set(principalName);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter && fromDate && isNaN(toDate)) {
      template.principal.set(principalName);
      template.principalExport.set(principalName);
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.fromDate.set(fromDate);

      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName === '' && brandfilter && categoryfilter && fromDate && toDate) {
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);

    }
    else if (principalName && brandfilter === '' && categoryfilter && fromDate && toDate) {
      template.principal.set(principalName);
      template.principalExport.set(principalName);
      template.categoryfilter.set(categoryfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter === '' && fromDate && toDate) {
      console.log();
      template.principal.set(principalName);
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter && isNaN(fromDate) && toDate) {
      template.principal.set(principalName);
      template.principalExport.set(principalName);
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else if (principalName && brandfilter && categoryfilter && fromDate && toDate) {
      template.principal.set(principalName);
      template.principalExport.set(principalName);
      template.categoryfilter.set(categoryfilter);
      template.brandfilter.set(brandfilter);
      template.toDate.set(toDate);
      template.fromDate.set(fromDate);
      Template.instance().pagination.settings.set('filters', {
        _id: principalName,
      });
    }
    else {
      Template.instance().pagination.settings.set('filters', {
      });
    }

  },
  'click .reset': (event, template) => {
    template.brandfilter.set(null);
    template.categoryfilter.set(null);
    template.principal.set(null);
    event.preventDefault();
    $('#principalNameSelection').val('').trigger('change');
    $('#brandfilter').val('').trigger('change');
    $('#categoryfilter').val('').trigger('change');
    $('#fromDate').val('');
    $('#toDate').val('');
    let date = new Date();
    Template.instance().toDate.set(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00.0')));
    Template.instance().fromDate.set(new Date(moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00:00.0')));
    Template.instance().pagination.settings.set('filters', {
    });
  },
  // 'change #verticalfilter': (event, template) => {
  //   event.preventDefault();
  //   let vertical = '';
  //   $('#verticalfilter').find(':selected').each(function () {
  //     vertical = $(this).val();
  //   });
  //   let array =[];
  //   array.push(vertical);
  //    Meteor.call('brand.verticalFullList',array, (err, res) => {
  //     if (!err)
  //       template.brandArray.set(res)
  //   });

  // },
  'change #brandfilter': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#brandfilter').find(':selected').each(function () {
      brand = $(this).val();
    });
    Meteor.call('category.brandWiseList', brand, (err, res) => {
      if (!err)
        template.categoryArray.set(res)
    });

  }, 'change #brandfilters': (event, template) => {
    event.preventDefault();
    let brand = '';
    $('#brandfilters').find(':selected').each(function () {
      brand = $(this).val();
    });
    Meteor.call('category.brandWiseList', brand, (err, res) => {
      if (!err)
        template.categoryArrays.set(res)
    });

  },
  'change #principalNameSelection': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#principalNameSelection').find(':selected').each(function () {
      principal = $(this).val();
    });
    Meteor.call('brand.prinFullList', principal, (err, res) => {
      if (!err)
        template.brandArray.set(res)
    });
  },
  'change #principalNameSelections': (event, template) => {
    event.preventDefault();
    let principal = '';
    $('#principalNameSelections').find(':selected').each(function () {
      principal = $(this).val();
    });
    Meteor.call('brand.prinFullList', principal, (err, res) => {
      if (!err)
        template.brandArrays.set(res)
    });
  },
  'click .export': (event, template) => {
    let header = $('#deliveryExportH');
    $('#routeReportExportPage').modal();
    $(header).html('Export Details');
    $('.mainLoader').css('display', 'none');
    $('#principalNameSelections').val('').trigger('change');
    $('#brandfilters').val('').trigger('change');
    $('#categoryfilters').val('').trigger('change');
    $('.startDate1').val('');
    $('.endDate1').val('');
  },
  'change #principalNameSelections,.brandfilters,.categoryfilters,.startDate1,.endDate1': (event, template) => {
    let sdate = $(".startDate1").val();
    let edate = $(".endDate1").val();
    let principalNameSelections = $("#principalNameSelections").val();
    let brandfilters = $("#brandfilters").val();
    let categoryfilters = $("#categoryfilters").val();
    let fromDate = new Date(moment(sdate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    let toDates = new Date(moment(edate, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.0"));
    template.fromDateExport.set(fromDate);
    template.toDateExport.set(toDates);
    template.principalExport.set(principalNameSelections);
    template.brandfilterExport.set(brandfilters);
    template.categoryfilterExport.set(categoryfilters);
    if (brandfilters == '')
      template.brandfilterExport.set(null);
    if (categoryfilters == '')
      template.categoryfilterExport.set(null);

    if (principalNameSelections != '') {
      Meteor.call('principal.principalList', principalNameSelections, (err, res) => {
        if (!err) {
          if (res.length === 0) {
            setTimeout(function () {
              $("#emptyDataSpan").html('<style>#emptyDataSpans {color :#fc5f5f }</style><span id="emptyDataSpans">No Records Found !</span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#emptyDataSpan').fadeOut('slow');
            }, 3000);
          }
          else {
            template.plistArray.set(res);
          }
        }

      });
    }
  },
  'click .exportToday': (event, template) => {
    event.preventDefault();
    $('#routeReportExportPage').modal('hide');
    let exportValue = template.plistArray.get();
    if (exportValue.length == 0) {
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

        function urltoFile(url, filename, mimeType) {
          return (fetch(url)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
          );
        };

        //Usage example:
        urltoFile(uri + base64(format(template, ctx)), 'hello.xls', 'text/csv')
          .then(function (file) {

            saveAs(file, "Principal wise Sale Report (" + moment(new Date()).format("DD-MM-YYYY") + ").xls");
          });
        $("#exportButtons").prop('disabled', false);
      }, 5000);
    }
  }, 'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }
});

Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});