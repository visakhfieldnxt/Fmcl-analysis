/**
 * @author Visakh
 */
// import { Customer } from '../../../api/customer/customer'; 
// import { Order } from '../../../api/order/order';
// import { Item } from '../../../api/item/item';



Template.sales_dashboard.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.todaysOrder = new ReactiveVar();
  this.todayQuotation = new ReactiveVar();
  this.approvedOrders = new ReactiveVar();
  this.approvedQuotations = new ReactiveVar();
  this.onHoldOrder = new ReactiveVar();
  this.rejectedOrder = new ReactiveVar();
  this.onHoldQuotation = new ReactiveVar();
  this.rejectedQuotation = new ReactiveVar();
  this.dueToday = new ReactiveVar();
  this.verticalData = new ReactiveVar();

});
Template.sales_dashboard.onRendered(function () {
  // Meteor.setTimeout(function(){
  //    new Morris.Area({
  //     element   : 'revenue-chart',
  //     resize    : true,
  //     data      : [
  //       { y: '2017 Q1', item1: 2666, item2: 2666 },
  //       { y: '2017 Q2', item1: 2778, item2: 2294 },
  //       { y: '2017 Q3', item1: 4912, item2: 1969 },
  //       { y: '2017 Q4', item1: 3767, item2: 3597 },
  //       { y: '2018 Q1', item1: 6810, item2: 1914 },
  //       { y: '2018 Q2', item1: 5670, item2: 4293 },
  //       { y: '2018 Q3', item1: 4820, item2: 3795 },
  //       { y: '2018 Q4', item1: 15073, item2: 5967 },
  //       { y: '2019 Q1', item1: 10687, item2: 4460 },
  //       { y: '2019 Q2', item1: 8432, item2: 5713 }
  //     ],
  //     xkey      : 'y',
  //     ykeys     : ['item1', 'item2'],
  //     labels    : ['Item 1', 'Item 2'],
  //     lineColors: ['#a0d0e0', '#3c8dbc'],
  //     hideHover : 'auto'
  //   });
  // },500);

  let fromDate = moment(new Date()).format('YYYY-MM-01 00:00:00.0');
  let toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00.0');
  Meteor.call('order.orderCount', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.todaysOrder.set(res);
    }
  });
  Meteor.call('creditSales.cashCount', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.todayQuotation.set(res);
    }
  });
  Meteor.call('creditSales.creditCount', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.approvedOrders.set(res);
    }
  });

  Meteor.call('creditSales.currentOutstanding', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.approvedQuotations.set(res);
    }
  });

  Meteor.call('order.orderApproved', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.onHoldOrder.set(res);
    }
  });

  Meteor.call('order.orderRejected', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.rejectedOrder.set(res);
    }
  });
  Meteor.call('order.orderOnHold', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.onHoldQuotation.set(res);
    }
  });
  Meteor.call('creditSale.approvedCurrent', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.rejectedQuotation.set(res);
    }
  });
  Meteor.call('outlet.outletDataByMonth', Meteor.userId(), fromDate, toDate, (err, res) => {
    if (!err) {
      this.verticalData.set(res);

    }
  });

});
Template.sales_dashboard.helpers({
  /**
   * For total outstanding getting 
   */
  'totalOutstanding': () => {
    // let total =0;
    // let empSales= Meteor.user().u_Sales_Employee_Code;
    // let cust = Customer.find({$or:[{u_BM_Code:{$eq:empSales}},{u_CO_TL_Code:{$eq:empSales}},
    //   ,{u_Co_ASM_Code:{$eq:empSales}},{u_FOS_Code:{$eq:empSales}},{u_SSK_Sales_Emp_Names:{$eq:empSales}},
    //   {u_SYSKA_ASM_CODE:{$eq:empSales}},{u_SYSKA_FOS_CODE:{$eq:empSales}},{u_SYSKA_TL_CODE:{$eq:empSales}},
    //   ,{u_SYSKA_ZSM_CODE:{$eq:empSales}} ]}).fetch();
    // for (let i = 0; i < cust.length; i++) {
    //   if(Number(cust[i].balance) > 0){
    //     total += Number(cust[i].balance);
    //   }
    // }
    let numb = 12000;
    return numb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  'collectionTodays': () => {
    let amount = 0;
    let dueToday = Template.instance().dueToday.get();
    if (dueToday) {
      for (let i = 0; i < dueToday.length; i++) {
        if (dueToday[i].cashSum !== null) {
          amount += Number(dueToday[i].cashSum);
        }
      }
      for (let i = 0; i < dueToday.length; i++) {
        if (dueToday[i].chequeSum !== null) {
          amount += Number(dueToday[i].chequeSum);
        }
      }
    }
    return Number(amount).toFixed(6).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  /**
  * for getting count of todays order
  */

  'todaysOrder': () => {
    let result = 0;
    let res = Template.instance().todaysOrder.get();
    if (res !== undefined) {
      result = res.toString();
    }
    return result;
  },
  /**
* for getting count of todays quotations
*/

  'todaysQuotations': () => {
    let result = 0;
    let res = Template.instance().todayQuotation.get();
    if (res !== undefined) {
      result = res.toString();
    }
    return result;
  },
  /**
  * for getting approved orders
  */

  'creditSales': () => {
    let result = 0;
    let res = Template.instance().approvedOrders.get();
    if (res !== undefined) {
      result = res.toString();
    }
    return result;
  },
  /**
* for getting approved quotation
*/

  'martketOutstanding': () => {
    let result = 0;
    let res = Template.instance().approvedQuotations.get();
    if (res !== undefined) {
      result = Number(res).toFixed(2);
    }
    return result;
  },
  /**
* for getting onhold orders
*/

  'orderApproved': () => {
    let result = 0;
    let res = Template.instance().onHoldOrder.get();
    if (res !== undefined) {
      result = res.toString();
    }
    return result;
  },
  /**
* for getting rejected orders
*/

  'rejectedOrder': () => {
    let result = 0;
    let res = Template.instance().rejectedOrder.get();
    if (res !== undefined) {
      result = res.toString();
    }
    return result;
  },
  /**
 * for getting onhold orders
 */

  'onHoldQuotation': () => {
    let result = 0;
    let res = Template.instance().onHoldQuotation.get();
    if (res !== undefined) {
      result = res.toString();
    }
    return result;
  },
  /**
 * for getting rejected orders
 */

  'rejectedQuotation': () => {
    let result = 0;
    let res = Template.instance().rejectedQuotation.get();
    if (res !== undefined) {
      result = res.toString();
    }
    return result;
  },
  verticalData: () => {
    let verticalData = Template.instance().verticalData.get();
    if (verticalData) {
      let approvedData = verticalData.filter(x => x.approvalStatus == 'Approved');
      let pendingData = verticalData.filter(x => x.approvalStatus == 'Pending');
      let onHoldData = verticalData.filter(x => x.approvalStatus == 'On Hold');
      let rejectData = verticalData.filter(x => x.approvalStatus == 'Rejected');
      new Morris.Donut({
        element: 'doughnut-chart',
        resize: true,
        colors: ['#007bff', '#ffc107', '#ff4040', '#16ca00'],
        data: [
          { label: 'Pending', value: pendingData.length },
          { label: 'Rejected', value: rejectData.length },
          { label: 'On Hold', value: onHoldData.length },
          { label: 'Approved', value: approvedData.length }
        ],
        hideHover: 'auto'
      }).on('click', function (i, row) {
      });


      $('#outletDataDisplay').css('display', 'block');
      // $('#doughnut-chart').css('height', '250px');
      $('#refreshvert').css('display', 'none');
    }
  },


  /**
   * for collection getting
   */
  'collection': () => {
    let collect = 30450;
    //     const today = moment(new Date()).format("YYYY-MM-DD");
    //     const toDate = new Date(today);
    //     const nextDay = new Date(toDate);
    //     nextDay.setDate(nextDay.getDate() + 1);
    //     const user = Meteor.users.findOne({
    //      _id: Meteor.userId()
    //    });
    //    let inv = Invoice.find({docStatus:"O",
    //    docDueDate:{ 
    //      $gte : moment(toDate).format("YYYY-MM-DD 00:00:00.0"),
    //       $lte:  moment(nextDay).format("YYYY-MM-DD 00:00:00.0")
    //    },
    //  slpCode:user.slpCode}).fetch();
    //  for (let i = 0; i < inv.length; i++) {
    //    collect += Number(inv[i].docTotal-inv[i].paidToDate);

    //  }
    return collect.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  /**
   * for rejected orders getting
   */
  'orderReject': () => {
    // let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    //   toDay = new Date(today);
    //   yesterDay = new Date(toDay);
    //  yesterDay.setDate(yesterDay.getDate() - 1);
    // const user = Meteor.users.findOne({
    //   _id: Meteor.userId()
    // });
    let r = 0;
    return r.toString();
  },
  /**
     * for not delivered order getting
     */
  'notDelivered': () => {
    // const today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    // const toDay = new Date(today);
    //  const nextDay = new Date(toDay);
    //  nextDay.setDate(nextDay.getDate() + 1);
    // let r= Invoice.find({deliveredDate: { 
    //   $gte : toDay, $lt:  nextDay
    // },
    // $or:[{deliveryStatus:{$eq: 'Pending'}},
    // {deliveryStatus:{$eq: ''}}] }).count();
    let r = 0;
    return r.toString();
  },
  /**
     * for getting the order count, which have stock unavailability 
     */
  'stockUnavilability': () => {

    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    let items = [];
    items = Item.find({ onHand: "0.000000" }).fetch();
    let orderArray = [];
    let filterArray = [];

    // for (let k = 0; k < items.length; k++) {
    //   let orderCol = Order.find({ docDate: { $gte: toDay, $lt: nextDay } }).fetch();
    //   for (let i = 0; i < orderCol.length; i++) {
    //     for (let j = 0; j < orderCol[i].itemLines.length; j++) {
    //       if (items[k].itemCode == orderCol[i].itemLines[j].itemCode) {
    //         orderArray.push(orderCol[i].orderId);
    //         $.each(orderArray, function (x, el) {
    //           if ($.inArray(el, filterArray) === -1) filterArray.push(el);
    //         });
    //       }
    //     }
    //   }
    // }
    return (filterArray.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
});
Template.sales_dashboard.events({
  // 'click .outstanding': function (event, template) {
  //   FlowRouter.redirect("/outstanding/list");
  // },
  // 'click .dueOutstanding': () => {
  //   FlowRouter.redirect("/collectionDueDashboard/list");

  // },
  // 'click .stockUnavailability': () => {
  //   FlowRouter.redirect("/stockUnavailability/list");

  // },
  // 'click .orderRejectC': () => {
  //   FlowRouter.redirect("/rejectedOrder/list");

  // },
  // 'click .orderNotDelivered': () => {
  //   FlowRouter.redirect("/billDispatchedNotDelivered/list");

  // },
});