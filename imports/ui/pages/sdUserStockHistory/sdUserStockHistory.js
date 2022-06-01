/**
 * @author Greeshma
 */
import { Meteor } from 'meteor/meteor';
import { WareHouseStock } from "../../../api/wareHouseStock/wareHouseStock";
Template.sdUserStockHistory.onCreated(function () {
  let self = this;
  self.autorun(() => {

  });

  this.todayExport = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.verticalArray = new ReactiveVar();
  this.productNameArray = new ReactiveVar();
  let loginUserVerticals = Session.get("loginUserVerticals");

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  toDay = new Date(today);
  nextDay = new Date(toDay);
  nextDay.setDate(nextDay.getDate() + 1);

  this.pagination = new Meteor.Pagination(WareHouseStock, {
    filters: {
      employeeId: Meteor.userId()
    },
    sort: {
      createdAt: -1
    },
    fields: {
      vertical: 1,
      dateValGet: 1,
      product: 1,
      stock: 1
    },
    perPage: 20
  });
});

Template.sdUserStockHistory.onRendered(function () {
  // Meteor.call('verticals.verticalList', (err, res) => {
  //   if (!err)
  //   this.verticalArray.set(res);
  //  });
  Meteor.call('vertical.SduserList', Meteor.userId(), (err, res) => {
    if (!err)
      this.verticalArray.set(res);
  });

  $('.selectVerticalName').select2({
    placeholder: "Select Vertical Name",
    tokenSeparators: [','],
    allowClear: true
  });

  $('.selectProductName').select2({
    placeholder: "Select Product Name",
    tokenSeparators: [','],
    allowClear: true
  });
  //  let superAdminValue = Session.get("superAdminValue");
  //  if (superAdminValue === true) {
  //    Meteor.call('product.productList', (err, res) => {
  //      if (!err) {
  //        this.productNameArray.set(res);
  //      }
  //    });
  //  }
  //  else {
  //    Meteor.call('product.sdUserList', Meteor.userId(), (err, res) => {
  //      if (!err) {
  //        this.productNameArray.set(res);
  //      }
  //    });
  //  }
});

Template.sdUserStockHistory.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  dateValGet: () => {
    return moment(new Date()).format('DD-MM-YYYY');
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
  stocklist: function () {
    // return Template.instance().pagination.getPage();
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

  /**
  * TODO:Complete JS doc
  */
  vertical1: function () {
    return Template.instance().verticalArray.get();

  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  dateFormat: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  timeSeperate: (docDate) => {
    return moment(docDate).format('hh:mm:ss A');
  },


  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dateForm: (docDueDate) => {
    return moment(docDueDate).format('DD-MM-YYYY');
  },
  statusValCheck: (status) => {
    if (status === 'Pending') {
      return true;
    }
    else {
      return false;
    }
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
  },/**
 * get vertical name
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
  getproductHelp: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('product.id', id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.productVal_' + id).html(result.productName);

    }
    ).catch((error) => {
      $('.productVal_' + id).html('');

    });
  }, vertical1: function () {
    return Template.instance().verticalArray.get();

  }, productLists: function () {
    return Template.instance().productNameArray.get();
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.sdUserStockHistory.events({
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set(true);
    let id = event.currentTarget.id;
    let header = $('#orderHs');
    let employeeId = $('#employeeId');
    let subDistributor = $('#subDistributor');
    let vertical = $('#vertical');
    let product = $('#product');
    let stock = $('#stock');
    $('#orderDetailPage').modal();
    Meteor.call('wareHouseStock.userWiseListId', id, (error, result) => {
      if (!error) {
        let prod = result.productList;
        template.modalLoader.set(false);
        $(header).html('Details of Order');
        $(employeeId).html(result.empName);
        $(subDistributor).html(result.subDistributorName);
        $(vertical).html(result.verticalName);
        $(product).html(result.productName);
        $(stock).html(prod.stock);
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
  'submit .stock-filter': (event) => {
    event.preventDefault();
    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    Meteor.call('stockTransfer.historyData', fromDate)
  },
  'click .reset': () => {
    $("#selectVerticalName").val('').trigger('change');
    $("#selectProductName").val('').trigger('change');
    Template.instance().pagination.settings.set('filters', {
      employeeId: Meteor.userId()
    });
  },
  'change #selectVerticalName': function (event, template) {
    $('#selectVerticalName').find(':selected').each(function () {
      verticalId = $(this).val();
    });
    console.log(verticalId);
    Meteor.call('product.filterList1', verticalId, (err, res) => {
      if (!err) {
        template.productNameArray.set(res);
      }
    });
  }
});
