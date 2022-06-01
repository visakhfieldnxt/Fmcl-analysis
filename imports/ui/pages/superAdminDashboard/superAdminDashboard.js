/**
 * @author Nithin
 * 
 */


Template.superAdminDashboard.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.verticalData = new ReactiveVar();
  this.sdData = new ReactiveVar();
  this.regionData = new ReactiveVar();
  this.outletData = new ReactiveVar();
  this.pricipalData = new ReactiveVar();
  
});
let verticalRes = [];
let verticalTotalRes = [];
Template.superAdminDashboard.onRendered(function () {
  if (Meteor.userId()) {
    let fromDate = moment(new Date()).format('YYYY-MM-01 00:00:00.0');
    let toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00.0');
    Meteor.call('creditSale.verticalwiseSaleDashboardMD', fromDate, toDate, (err, res) => {
      if (!err) {
        console.log("res", res);
        verticalRes = res.label;
        verticalTotalRes = res.value;
        this.verticalData.set(res);

      }
    });
    Meteor.call('creditSale.subDwiseSaleDashMD', fromDate, toDate, (err, res) => {
      if (!err) {
        this.sdData.set(res);
      }
    });
    Meteor.call('creditSale.reginWiseDashMD', fromDate, toDate, (err, res) => {
      if (!err) {
        this.regionData.set(res);
      }
    });
    Meteor.call('outlet.totalOutletsDashMD',  (err, res) => {
      if (!err) {
        this.outletData.set(res);
      }
    });
    Meteor.call('principal.wisesalesMD',fromDate, toDate,  (err, res) => {
      if (!err) {
        this.pricipalData.set(res);
      }
    });
  }

});

Template.superAdminDashboard.helpers({
  verticalData: () => {
    let verticalData = Template.instance().verticalData.get();
    if (verticalData) {
      new Morris.Donut({
        element: 'doughnut-chart',
        resize: true,
        colors: ['#007bff', '#ffc107', '#ff4040', '#16ca00'],
        data: verticalData,
        hideHover: 'auto'
      }).on('click', function (i, row) {
      });


      $('#outletDataDisplay').css('display', 'block');
      // $('#doughnut-chart').css('height', '250px');
      $('#refreshvert').css('display', 'none');
    }
  },
  sdWiseSales: () => {
    let sdData = Template.instance().sdData.get();
    if (sdData) {
      new Chart(document.getElementById("bar-chart-grouped"), {
        type: 'bar',
        data: {
          labels: sdData.label,
          datasets: [
            {
              label: "Current Monthly Sales",
              data: sdData.value,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1
            },

          ]
        },
        // options: {
        //   title: {
        //     display: true,
        //     text: 'Stock Summary'
        //   }
        // }

      });
      $('#refreshvsd').css('display', 'none');
    }

  },
  regionSales: () => {
    let regionData = Template.instance().regionData.get();
    if (regionData) {
      new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: regionData.label,
          datasets: [{
            data: regionData.value,
            label: "Current Month Sales",
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: regionData.color,
            fill: true
          },

          ]
        },
        // options: {
        //   title: {
        //     display: true,
        //     text: 'Manufacturers Summary (Last 5 Days)'
        //   }
        // }
      });
      $('#refreshvregion').css('display', 'none');
    }

  },
  outletWise: () => {
    let outletData = Template.instance().outletData.get();
    if (outletData) {
      new Chart(document.getElementById("polarAreaChart"), {
        type: 'polarArea',
        data: {
          labels: outletData.label,
          datasets: [{
            label: 'Total Outlets',
            data: outletData.value,
            backgroundColor: 
            [
              '#EA7369',
              '#1CD4D4',
              '#7D3AC0',
              '#C02323',
              '#1AC9E7'
            ]
          }]        
        
        },

        // options: {
        //   title: {
        //     display: true,
        //     text: 'Stock Summary'
        //   }
        // }

      });
      $('#refreshvoutlet').css('display', 'none');

    }
  },
  principalWiseSales: () => {
    let sdData = Template.instance().sdData.get();
    if (sdData) {
      new Chart(document.getElementById("principal-grouped"), {
        type: 'bar',
        data: {
          labels: sdData.label,
          datasets: [
            {
              label: "Current Monthly Sales",
              data: sdData.value,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1
            },

          ]
        },
        // options: {
        //   title: {
        //     display: true,
        //     text: 'Stock Summary'
        //   }
        // }

      });
      $('#refreshvsd').css('display', 'none');
    }

  },
  dateVal: () => {
    return moment(new Date()).format('DD-MM-YYYY');
  },

  // date1Value: () => {
  //   return moment(new Date()).format('DD-MM-YYYY');
  // },
  // date2Value: () => {
  //   return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 1)).format('DD-MM-YYYY');
  // },
  // date3Value: () => {
  //   return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 2)).format('DD-MM-YYYY');
  // },
  // date4Value: () => {
  //   return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 3)).format('DD-MM-YYYY');
  // },
  // date5Value: () => {
  //   return moment(new Date(toDay).setDate(new Date(toDay).getDate() - 4)).format('DD-MM-YYYY');
  // },
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
  },'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  }

});


