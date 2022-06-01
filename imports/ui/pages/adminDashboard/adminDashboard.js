/**
 * @author Visakh
 * 
 */

// import { Invoice } from '../../../api/invoice/invoice';
// import { Order } from '../../../api/order/order';

Template.admin_dashboard.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.verticalData = new ReactiveVar('');
  this.sdData = new ReactiveVar();
  this.outletData = new ReactiveVar();
  this.regionData = new ReactiveVar();

});
Template.admin_dashboard.onRendered(function () {
  let vertical = Session.get('loginUserVerticals');
  if (Meteor.userId()) {
    let fromDate = moment(new Date()).format('YYYY-MM-01 00:00:00.0');
    let toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00.0');
    Meteor.call('creditSale.subDwiseSaleDashBH', vertical, fromDate, toDate, (err, res) => {
      if (!err) {
        this.sdData.set(res);
      }
    });
    Meteor.call('outlet.totalOutletsDashBH', vertical, (err, res) => {
      if (!err) {
        this.outletData.set(res);
      }
    });
    Meteor.call('creditSale.reginWiseDashBH', vertical, fromDate, toDate, (err, res) => {
      if (!err) {
        this.regionData.set(res);
      }
    });
  }





  // new Morris.Donut({
  //   element: 'pieChart2',
  //   resize: true,
  //   colors: ['#7a5195', '#ef5675', '#003f5c'],
  //   data: [
  //     { label: 'Pending', value: 5 },
  //     { label: 'Rejected', value: 4 },
  //     { label: 'Approved', value: 15 }
  //   ],
  //   hideHover: 'auto'
  // }).on('click', function (i, row) {
  // });
  // var myCharts = document.getElementById('myCharts');
  // myCharts.innerHTML = '&nbsp;';
  // $('#myCharts').append('<canvas id="bar-chart" width="800" height="400"><canvas>');
  // new Chart(document.getElementById("bar-chart"), {
  //   type: 'bar',
  //   data: {
  //     labels: ["Arun", "Varun", "Test User", "Kiran", "Nithin"],
  //     datasets: [
  //       {
  //         label: `No Of Outlets`,
  //         backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#003f5c"],
  //         data: [15, 25, 28, 30, 15, 10],
  //       }
  //     ]
  //   },
  //   options: {
  //     legend: { display: false },
  //     title: {
  //       display: true,
  //       text: `No Of Outlets Covered By The Salesman`
  //     }
  //   }
  // });

});

Template.admin_dashboard.helpers({
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
  collectionToday: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = moment(new Date()).format('YYYY-MM-01 00:00:00.0');
    let toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00.0');
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('creditSale.currentMontOutstanding', vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('#currentOutstanding').html(result);
      $('#refreshout').css('display', 'none');
    }
    ).catch((error) => {
      $('#currentOutstanding').html('');
      $('#refreshout').css('display', 'none');
    });
  },
  outlets: () => {
    let vertical = Session.get('loginUserVerticals');
    let fromDate = moment(new Date()).format('YYYY-MM-01 00:00:00.0');
    let toDate = moment(new Date()).format('YYYY-MM-DD 00:00:00.0');
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call('outlets.currentMontOutlets', vertical, fromDate, toDate, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('#currentOutlet').html(result);
      $('#refreshoutlet').css('display', 'none');
    }
    ).catch((error) => {
      $('#currentOutlet').html('');
      $('#refreshoutlet').css('display', 'none');
    });
  }

});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.admin_dashboard.events({


});


