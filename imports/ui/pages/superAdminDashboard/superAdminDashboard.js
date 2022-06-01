/**
 * @author Nithin
 * 
 */


Template.superAdminDashboard.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
});
Template.superAdminDashboard.onRendered(function () {
  let currencyValues = Session.get("currencyValues");
  $('.selectCustomerName').select2({
    placeholder: "Select Customer Name",
    tokenSeparators: [','],
    allowClear: true
  });
  /**
   * line chart
   */

  let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
  let toDay = new Date(today);
  let nextDay = new Date(toDay);

  let date1 = moment(nextDay).format('DD-MM-YYYY');
  let date2 = moment(new Date(toDay).setDate(new Date(toDay).getDate() - 1)).format('DD-MM-YYYY');
  let date3 = moment(new Date(toDay).setDate(new Date(toDay).getDate() - 2)).format('DD-MM-YYYY');
  let date4 = moment(new Date(toDay).setDate(new Date(toDay).getDate() - 3)).format('DD-MM-YYYY');
  let date5 = moment(new Date(toDay).setDate(new Date(toDay).getDate() - 4)).format('DD-MM-YYYY');


  new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: [`${date1}`, `${date2}`, `${date3}`, `${date4}`, `${date5}`],
      datasets: [{
        data: [86, 114, 106, 106, 107],
        label: "Supa Oil",
        borderColor: "#28a745",
        fill: false
      }, {
        data: [282, 350, 411, 502, 635],
        label: "North Safety",
        borderColor: "#f95d6a",
        fill: false
      },
        //  {
        //   data: [168, 170, 178, 190, 203],
        //   label: "North Safety",
        //   borderColor: "#3cba9f",
        //   fill: false
        // }, {
        //   data: [40, 20, 10, 16, 24],
        //   label: "Supa Oil",
        //   borderColor: "#e8c3b9",
        //   fill: false
        // }, {
        //   data: [6, 3, 2, 2, 7],
        //   label: "Comaco",
        //   borderColor: "#c45850",
        //   fill: false
        // }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Manufacturers Summary (Last 5 Days)'
      }
    }
  });


  /**
   * bar chart
   */


  new Chart(document.getElementById("bar-chart-grouped"), {
    type: 'bar',
    data: {
      labels: ["GM TRADING SERVICE", "REVIN ZAMBIA LIMITED", "CENTRAL BAKERY", "COASTAL IMPORT & EXPORT", "METALCAST INDUSTRIES"],
      datasets: [
        {
          label: "Opening Stock",
          backgroundColor: "#003f5c",
          data: [500, 600, 700, 800, 1000]
        },
        {
          label: "Sold Stock",
          backgroundColor: "#ffa600",
          data: [150, 200, 300, 300, 600]
        },
        {
          label: "Closing Stock",
          backgroundColor: "#ff6361",
          data: [350, 400, 400, 500, 400]
        },
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Stock Summary'
      }
    }

  });
  /**
   * doughnut chart
   */
  new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["GM TRADING SERVICE", "REVIN ZAMBIA LIMITED", "CENTRAL BAKERY", "COASTAL IMPORT & EXPORT"],
      datasets: [
        {
          label: `Customer Transactions (in ${currencyValues})`,
          backgroundColor: ["#17a2b8", "#6610f2", "#28a745", "red"],
          data: [5000.120, 1000.230, 700.420, 4000.481]
        }
      ],
    },
    options: {
      // title: {
      //   display: true,
      //   text: 'Customer Transactions (in ZMW)',
      // },
      label: {
        position: 'bottom'
      }
      // onClick: function (event, item) {
      //   console.log("event", event);
      //   console.log("item", item[0]._index);
      //   if (item[0]._index === 0) {
      //     $("#salesOrderModal").modal();
      //   } else if (item[0]._index === 1) {
      //     $("#salesQuotationModal").modal();
      //   } else if (item[0]._index === 2) {
      //     $("#arInvoiceModal").modal();
      //   } else if (item[0]._index === 3) {
      //     $("#crInvoiceModal").modal();
      //   }
      // }
    }
  });


});

Template.superAdminDashboard.helpers({

  dateVal: () => {
    return moment(new Date()).format('DD-MM-YYYY');
  },
  currencyGet: () => {
    let currencyValues = Session.get("currencyValues");
    return currencyValues;
  },
  date1Value: () => {
    return moment(new Date()).format('DD-MM-YYYY');
  },
  date2Value: () => {
    return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 1)).format('DD-MM-YYYY');
  },
  date3Value: () => {
    return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 2)).format('DD-MM-YYYY');
  },
  date4Value: () => {
    return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 3)).format('DD-MM-YYYY');
  },
  date5Value: () => {
    return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 4)).format('DD-MM-YYYY');
  },
});
Template.superAdminDashboard.events({

  'click #stockMoreButton': (event, template) => {
    event.preventDefault();
    $("#stockModalView").modal();
  },

  'click #manufacturersMoreButton': (event, template) => {
    event.preventDefault();
    $("#manufacturersDetailView").modal();
  },
  'click .filterTransaction': (event, template) => {
    event.preventDefault();
    $('#fromDate').val('');
    $("#filterTransactionModal").modal();
  },

  'click .filterProducts': (event, template) => {
    event.preventDefault();
    $('#fromDates').val('');
    $('#toDates').val('');
    $("#filterTransactionModalTwo").modal();
  }
});


