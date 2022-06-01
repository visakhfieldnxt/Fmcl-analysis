/**
 * @author Visakh
 * 
 */

import { Order } from "../../../api/order/order";
import { Meteor } from 'meteor/meteor';
import { Config } from "../../../api/config/config";

let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);


Template.orderHistory.onCreated(function () {
  const self = this;
  self.autorun(() => {
    // self.subscribe('config.list');
  });

  this.userNameArray = new ReactiveVar();


  this.itemsDetailsList = new ReactiveVar();
  this.totalItem = new ReactiveVar();
  this.orderData = new ReactiveVar();
  this.ordId = new ReactiveVar();
  this.itemArray = new ReactiveVar();
  this.customerDetail = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Order, {

    filters: {
      userId: Meteor.userId(),
      docDate: {
        $gte: toDay,
        $lt: nextDay
      },
      docStatus: 'C',
      orderId: { $ne: '' }
    },
    sort: {
      createdAt: -1
    },
    perPage: 20
  });
});
Template.orderHistory.onRendered(function () {
 
  Meteor.call('user.userNameGet', (userError, userResult) => {
    if (!userError) {

      this.userNameArray.set(userResult);
    }
  });

  // $("#select2-batch").val('').trigger('change');

  // /**
  //  * TODO: Complete JS doc
  //  */
  // $('#select2-batch').select2({
  //   placeholder: "Select Batch",
  //   tokenSeparators: [',', ' '],
  //   allowClear: true
  // });
});

Template.orderHistory.helpers({

  /**
   * TODO: Complete JS doc
   * @returns {{collection, acceptEmpty, substitute, eventType}}
   */
  optionsHelper: () => {
    return globalOptionsHelper(orderCollectionName);
  },

  /**
   * TODO: Complete JS doc
   * @returns {{collection: *, acceptEmpty: boolean, substitute: string, eventType: string}}
   */
  optionsHelperWithTextArea: () => {
    let config = globalOptionsHelper(orderCollectionName);
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
      * TODO:Complete Js doc
      * @param assignedTo
      */
  // branchName: (id) => {

  //   let branchAr = Template.instance().branchNameArray.get();
  //   if (branchAr) {
  //     return branchAr.find(x => x.bPLId === id).bPLName;
  //   }
  // },
  // /**
  //  * TODO:Complete Js doc
  //  * @param assignedTo
  //  */
  // branchAddress: (id) => {

  //   let branchAdAr = Template.instance().branchNameArray.get();

  //   if (branchAdAr) {
  //     return branchAdAr.find(x => x.bPLId === id).address;
  //   }
  // },
  /**
  * TODO:Complete Js doc
  * @param assignedTo
  */
  printedBy: () => {

    let printedByAr = Template.instance().userNameArray.get();
    if (printedByAr) {
      return printedByAr.find(x => x._id === Meteor.userId()).profile.firstName;
    }
  },
  /**
  * TODO:Complete Js doc
  * @param assignedTo
  */
  // salesPerson: (userId) => {

  //   let salesPersonAr = Template.instance().userNameArray.get();
  //   if (salesPersonAr) {
  //     return salesPersonAr.find(x => x._id === userId).profile.firstName;
  //   }
  // },
  /**
   * TODO:Complete Js doc
   * @param userId
   */
  // salesPersonEmail: (userId) => {

  //   let salesPersonEm = Template.instance().userNameArray.get();
  //   if (salesPersonEm) {
  //     return salesPersonEm.find(x => x._id === userId).emails[0].address;
  //   }
  // },
  // /**
  //  * TODO:Complete Js doc
  //  * @param userId
  //  */
  // salesPersonMobile: (userId) => {

  //   let salesPersonPhn = Template.instance().userNameArray.get();
  //   if (salesPersonPhn) {
  //     return salesPersonPhn.find(x => x._id === userId).contactNo;
  //   }
  // },
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
  orders: function () {
    return Template.instance().pagination.getPage();
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
  items: () => {
    return Template.instance().itemsDetailsList.get();
  },
  /**
   * TODO:Complete JS doc
   */
  // itemss: (itemCode) => {
  //   let itemArrays = Template.instance().itemNameArray.get();
  //   if (itemArrays) {
  //     return itemArrays.find(x => x.itemCode === itemCode).itemNam;
  //   }
  // },
  /**
   * TODO Complete Js doc
   * for getting specific customer details from the db
   */

  /**
   * TODO Complete Js doc
   * for getting specific customer details from the db
  //  */

  /**
   * TODO:Complete Js doc
   */
  delivery: () => {

    let deliveryList = Template.instance().itemsDetailsList.get();
    if (deliveryList.lineStatus === 'O') {
      return deliveryList;
    } else {
      return;
    }
  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  date: (docDate) => {
    return moment(docDate).format('DD-MM-YY');

  },
  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  printTime: () => {
    return moment(new Date).format('ddd DD MMM YYYY hh.mm.ss a'); //monday 10 jun 2019 11.46.46 a.m
  },
  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dates: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YY');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },

  /**
   * TODO:Complete JS doc
   * @param docStatus
   */
  status: (docStatus) => {
    if (docStatus === 'C') {
      return 'Closed';
    } else if (docStatus === 'O') {
      return 'Open';
    } else if (docStatus === 'R') {
      return 'Rejected';
    } else {
      return '';
    }
  },
  /**
   * TODO:Complete Js doc
   */
  disc: (afterDiscount, beforeDiscount) => {
    return Number(beforeDiscount).toFixed(2) - Number(afterDiscount).toFixed(2);
  },
  /**
   * TODO:Complete JS doc
   * @param price 
   */
  priceFormat: (salesPrice) => {
    return Number(salesPrice).toFixed(2);
  },
  /**
   * TODO:Complete JS doc
   * @param quantity 
   */
  quantityFormat: (quantity) => {
    return Number(quantity).toFixed(2);
  },
  /**
   * TODO:Complete Js doc
   */
  total: (quantity, salesPrice) => {
    return Number(quantity).toFixed(2) * Number(salesPrice).toFixed(2);
  },
  /**
   * TODO:Complete Js doc
   */
  totalIn: (price, quantity) => {
    return Number(price).toFixed(2) * Number(quantity).toFixed(2);
  },
  /**
   * TODO:Complete Js doc
   */
  ordDetail: () => {
    return Template.instance().orderData.get();
  },
  /**
   * TODO:Complete Js doc
   */
  cstmrDetail: () => {

    return Template.instance().customerDetail.get();
  },
  /**
   * TODO:Complete Js doc
   */
  orderr: () => {

    return Template.instance().orderData.get();
  },
  /**
   * TODO:Complete Js doc
   */
  logo: () => {
    return Config.findOne({
      name: "logo"
    }).value;
  },
});


Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.orderHistory.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .orderFilter': (event) => {
    event.preventDefault();

    let cardCode = event.target.cardCode.value;
    let orderId = parseFloat(event.target.orderId.value);


    let toDate = new Date(event.target.toDate.value);
    let fromDate = new Date(event.target.fromDate.value);

    if (toDate && fromDate && cardCode && $.trim(cardCode) && orderId && $.trim(orderId)) {
      Template.instance().pagination.settings.set('filters',

        {
          userId: Meteor.userId(),
          docStatus: 'C',
          orderId: { $ne: '' },
          cardCode: {
            $regex: new RegExp($.trim(cardCode), "i")
          },
          orderId: {
            $regex: new RegExp($.trim(orderId), "i")
          },
          docDate: {
            $gte: fromDate,
            $lt: toDate
          },
        }
      );
    } else if (cardCode && $.trim(cardCode)) {
      Template.instance().pagination.settings.set('filters', {
        userId: Meteor.userId(),
        docStatus: 'C',
        orderId: { $ne: '' },
        cardCode: {
          $regex: new RegExp($.trim(cardCode), "i")
        }
      });
    } else if (orderId && $.trim(orderId)) {
      Template.instance().pagination.settings.set('filters', {
        userId: Meteor.userId(),
        docStatus: 'C',
        orderId: { $ne: '' },
        orderId: {
          $regex: new RegExp($.trim(orderId), "i")
        }
      });
    } else if (fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docStatus: 'C',
          orderId: { $ne: '' },
          userId: Meteor.userId(),
          docDate: {
            $gte: fromDate,
            $lt: toDate
          }
        });
      } else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docStatus: 'C',
          orderId: { $ne: '' },
          userId: Meteor.userId(),
          docDate: {
            $gte: fromDate,
            $lte: toDate
          },
        });
      }
    } else {
      Template.instance().pagination.settings.set('filters', {

      });
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    Template.instance().pagination.settings.set('filters', {
      userId: Meteor.userId(),
      docStatus: 'C',
      orderId: { $ne: '' },
      docDate: {
        $gte: toDay,
        $lt: nextDay
      }
    });
    $('form :input').val("");
  },
  /**
   * TODO: Compelete JS doc
   */
  // 'click #order-create-button': () => {

  //  Template.instance().itemArray.set('');
  //   $("#orderCreate").modal();
  // },
  // /**
  // * TODO:Complete JS doc
  // * @param event
  // */
  'click .view': (event, template) => {
    event.preventDefault();


    Template.instance().itemsDetailsList.set('');
    let id = event.currentTarget.id;

    template.ordId.set(id);
    let header = $('#orderHs');
    let cardName = $('#detailCardNames');
    let cardCode = $('#detailCardCodes');
    let branchs = $('#detailBranchs');
    let docTotal = $('#detailDocTotals');
    let beforeDiscount = $('#detailBeforeDiscounts');
    let afterDiscount = $('#detailAfterDiscounts');
    let gst = $('#detailGSTs');
    let docEntry = $('#detailDocEntrys');

    let docDeliver = $('#detailDocDelivers');
    let docDate = $('#detailDocDates');
    let custRefers = $('#detailcustRefer');
    let custRefDate = $('#detailCustRefDate');
    let orderId = $('#detailOrderIds');
    let detailApprovedBy = $('#detailApprovedBy');
    let detailRemark = $('#detailRemark');

    $('#orderDetailPage').modal();

    Meteor.call('order.id', id, (orderError, orderResult) => {
      if (!orderError) {
        let order = orderResult;
        $(header).html('Details of Order');
        $(docTotal).html(Number(order.docTotal).toFixed(2));
        $(beforeDiscount).html(Number(order.beforeDiscount).toFixed(2));
        $(afterDiscount).html(Number(order.afterDiscount).toFixed(2));
        $(gst).html(Number(order.GST).toFixed(2));
        $(cardCode).html(order.cardCode);
        $(custRefers).html(order.custRefNo);
        $(custRefDate).html(order.custRefDate);
        $(detailRemark).html(order.remark_order);
        $(docDeliver).html(moment(order.docDueDate).format("DD-MM-YY"));
        $(docDate).html(moment(order.createdAt).format('DD-MM-YY'));
        if (order.orderId === '' || order.orderId === undefined) {
          $(orderId).html('');
        } else {
          $(orderId).html(order.orderId);
        }
        if (order.docEntry === '' || order.docEntry === undefined) {
          $(docEntry).html('');
        } else {
          $(docEntry).html(order.docEntry);
        }
        template.itemsDetailsList.set(order.itemLines);
        customerDetailsView(order.cardCode);
        branchDetailsView(order.branch);
        userDetailsView(order.approvedBy);
 
      }
    });
    function customerDetailsView(cardCode) {

      Meteor.call('customer.cardCode', cardCode, (customerError, customerResult) => {
        if (!customerError) {

          $(cardName).html(customerResult);

        }
      });
    }
    function branchDetailsView(branch) {

      Meteor.call('branch.branchBPLId', branch, (branchError, branchResult) => {
        if (!branchError) {
          let branchName = branchResult;
          $(branchs).html(branchName);
        }
      });
    }
    function userDetailsView(approvedBy) {


      Meteor.call('user.id', approvedBy, (userError, userResult) => {
        if (!userError) {
          let approvedBy = userResult;
          if (approvedBy === undefined) {
            $(detailApprovedBy).html('');
          }
          else {
            $(detailApprovedBy).html(approvedBy);

          }

        }
      });
    }
  },

  /**
   * TODO:Complete Js doc
   */
  'click .print': (event, template) => {
    event.preventDefault();
    $('#printDetailPage').modal();
    let id = event.currentTarget.id;
    let emailForSalesperson = ('#emailForSalesperson');
    let contactNoForSalesperson = ('#contactNoForSalesperson');
    let branchNamePrint = ('#branchNamePrint');
    let branchAddressPrint = ('#branchAddressPrint');
    let preparedBy = ('#preparedByPrint');
    let authorizedBy = ('#authorizedBy');
    let approvedByEmails = ('#approvedByEmailss');
    let approvedByphone = ('#approvedByphone');
    let salesExce = ('#salesExce');
    let paymentDays = ('#paymentDays');
    let printCardName = ('#printCardName');
    let printAddress = ('#printAddresss');
    let printLocation = ('#printLocation');
    let printPhone = ('#printPhone');
    let printmail = ('#printmail');
    let printOderId = ('#printOrdId');
    let printOrderAddress = ('#printOrderAddress')
    let custRefs = ('#custRefs');

    orderDetail(id);
    function orderDetail(id) {

      Meteor.call('order.id', id, (orderError, orderResult) => {
        if (!orderError) {

          $(printOderId).html(orderResult.orderId);

          template.orderData.set(orderResult);
          template.totalItem.set(orderResult.itemLines);
          customerForPrint(orderResult.cardCode);
          branchForPrint(orderResult.branch);
          emailForSalespersonPrint(orderResult.employeeId);
          authorizedSalesperson(orderResult.approvedBy);
          $(printAddress).html(orderResult.address);
          $(printLocation).html(orderResult.address);
          $(printOrderAddress).html(orderResult.address);
          $(custRefs).html(orderResult.custRefNo);

        }
      });
    }
    function customerForPrint(cardCode) {


      Meteor.call('customer.customerFindOne', cardCode, (customerError, customerResult) => {
        if (!customerError) {
          template.customerDetail.set(customerResult);
          $(paymentDays).html(customerResult.pymntGroup);
          $(printCardName).html(customerResult.cardName);
          $(printPhone).html(customerResult.phone1);
          $(printmail).html(customerResult.mailAddres);
        }
      });
    }

    function authorizedSalesperson(id) {
      Meteor.call('user.idAuthorizedBy', id, (userError, userResult) => {
        if (!userError) {
          $(authorizedBy).html(userResult.profile.firstName);
          $(approvedByEmails).html(userResult.emails[0].address);
          $(approvedByphone).html(userResult.contactNo);
 
        }

      });
    }
    function emailForSalespersonPrint(id) {
      Meteor.call('user.userDetailss', id, (userError, userResults) => {
        if (!userError) {
          $(emailForSalesperson).html(userResults.emails[0].address);
          $(contactNoForSalesperson).html(userResults.contactNo);
          $(preparedBy).html(userResults.profile.firstName);
          $(salesExce).html(userResults.profile.firstName);

        }

      });
    }

    function branchForPrint(branch) {
      Meteor.call('branch.branchDetail', branch, (branchError, branchResult) => {
        if (!branchError) {
          $(branchNamePrint).html(branchResult.bPLName);
          $(branchAddressPrint).html(branchResult.address);
        }

      });
    }

    Template.order.__helpers.get('cstmrDetail').call();
    Template.order.__helpers.get('ordDetail').call();
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
   */
  'click .close': () => {
    $('form :input').val("");
   
    Template.instance().itemsDetailsList.set('');
    Template.instance().itemArray.set('');
    $("#submit").attr("disabled", false);
  },
  'click.closed':()=>
  {
$('#authorizedBy').html('');
$('#paymentDays').html('');
$('#approvedByEmailss').html('');
$('#approvedByphone').html('');
  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': () => {
    $('form :input').val("");
    $('#detailApprovedBy').html('');

    Template.instance().itemsDetailsList.set('');
    Template.instance().itemArray.set('');
    $("#submit").attr("disabled", false);
  },
  'click .printThis': () => {
    // window.print();

    $("#printSection").printThis({
      // header: $("#divHeader").html(),
      // footer: $("#divFooter").html()
    });
  },

});
