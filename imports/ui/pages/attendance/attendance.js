/**
 * @author Nithin
 */

import { Attendance } from "../../../api/attendance/attendance";
import { Meteor } from 'meteor/meteor';

let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);
Template.attendance.onCreated(function () {
  const self = this;
  self.autorun(() => {
  });
  this.modalLoader = new ReactiveVar();
  this.userNameArray = new ReactiveVar();
  this.userNameOrder = new ReactiveVar();
  this.pagination = new Meteor.Pagination(Attendance, {
    filters: {
      attendenceDateIso: {
        $gte: toDay,
        $lt: nextDay
      },
      subDistributor: Meteor.userId(),
    }, sort: { createdAt: -1 },
    fields:{employeeId:1,
      subDistributor:1,
      attendenceDate:1,
      loginDate:1,
      logoutDate:1},
    perPage: 20
  });
});
Template.attendance.onRendered(function () {
  
  $('#bodySpinVal').css('display', 'block');
  /**
  * TODO: Complete JS doc
  * for getting user name
  * 
  */
 if(Meteor.user())
 {
  Meteor.call('user.vansaleGetAttendance',Meteor.userId(), (userError, userResult) => {
    if (!userError) {
      this.userNameArray.set(userResult);
    }
  });
}

  /**
   * TODO:Complete Js doc
   * Getting customerPriceList List
   * 
   */

  Meteor.call('user.userList', (err, res) => {
    if (!err) {
      this.userNameOrder.set(res);
    }
  });

  $('.selectEmpData').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectEmpData").parent(),
  });

});
Template.attendance.helpers({
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
  taxFormats: (quantity, taxRate) => {
    let res = (parseInt(quantity) * Number(taxRate)).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  /**
 * get vansale user name
 */

  vanUserName: (id) => {
    let promiseVal = new Promise((resolve, reject) => {
      Meteor.call("user.idName", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    promiseVal.then((result) => {
      $('.vanUserName_' + id).html(result);
      $('#bodySpinVal').css('display', 'none');
    }
    ).catch((error) => {
      $('.vanUserName_' + id).html('');
      $('#bodySpinVal').css('display', 'none');
    }
    );
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   */
  attendances: function () {
    let result = Template.instance().pagination.getPage();
    if (result.length === 0) {
      $('#bodySpinVal').css('display', 'none');
    }
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


  vansaleuserList: () => {
    return Template.instance().userNameArray.get();
  },

  /**
    * TODO:Complete JS doc
    * @param docDate
    */
  date: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
     * TODO:Complete JS doc
     * @param docDueDate
     */
  dates: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YYYY');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },
  datesVal: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YYYY hh:mm:ss A');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },

  /**
* TODO:Complete JS doc
* @param price 
*/
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
  * TODO:Complete JS doc
  * @param docDate
  */
  dateHelp: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },


  /**
   * TODO:Complete Js doc
   * Showing todays date
   */
  date: function () {
    return new Date();
  },

  /**
   * TODO:Complete Js doc
   * Formating the price 
   */
  priceFormat: (salesPrice) => {
    let res = Number(salesPrice).toFixed(6);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },


  /**
   * TODO:Complete JS doc
   * 
   */
  printLoad: () => {
    return Template.instance().modalLoader.get();
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
Template.attendance.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event) => {
    event.preventDefault();

    let first = $("#fromDate").val();
    let second = $("#toDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    let employeeId = event.target.selectEmpData.value;

    if (employeeId && isNaN(fromDate) && isNaN(toDate)) {
      Template.instance().pagination.settings.set('filters', {
        employeeId: employeeId,  subDistributor: Meteor.userId(),
      });
    }
    else if (fromDate && isNaN(toDate) && employeeId === '') {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        attendenceDateIso: {
          $lte: fromDate
        },  subDistributor: Meteor.userId(),

      });
    }
    else if (toDate && isNaN(fromDate) && employeeId === '') {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        attendenceDateIso: {
          $lte: toDate
        },  subDistributor: Meteor.userId(),

      });
    }

    else if (fromDate && toDate && employeeId === '') {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lt: toDate
          },
          subDistributor: Meteor.userId(),
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lte: toDate
          },  subDistributor: Meteor.userId(),

        });
      }
    }
    else if (employeeId && toDate && fromDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          attendenceDateIso: {
            $gte: fromDate, $lt: toDate
          },
          employeeId: employeeId,
          subDistributor: Meteor.userId(),
        });
      }
      else {
        toDate.setDate(toDate.getDate() + 1);
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          },
          employeeId: employeeId,
          subDistributor: Meteor.userId(),
        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
    }
  },
  /**
   * TODO: Complete JS doc
   */
  'click .reset': () => {
    $("#selectEmpData").val('').trigger('change');
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    let toDay = new Date(today);
    let nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    Template.instance().pagination.settings.set('filters', {
      attendenceDateIso: {
        $gte: toDay,
        $lt: nextDay
      }
    });
    $('form :input').val("");
  },


  /**
     * TODO:Complete JS doc
     * @param event
     */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set('');
    let id = event.currentTarget.id;
    let header = $('#orderH');
    let detailEmpName = $('#detailEmpName');
    let detailSubD = $('#detailSubD');
    let detailLoginDate = $('#detailLoginDate');
    let detailLogoutDate = $('#detailLogoutDate');
    let detailloginLocation = $('#detailloginLocation');
    let detaillogoutLocation = $('#detaillogoutLocation');
    $('#orderDetailPage').modal();
    Meteor.call('attendance.id', id, (err, res) => {
      if (!err) {
        template.modalLoader.set(res);
        let attendance = res.attendanceRes;
        $(header).html('Details of Attendance');
        $(detailEmpName).html(res.empName);
        $(detailSubD).html(res.subDistributorName);
        $(detailLoginDate).html(`${attendance.attendenceDate} ${attendance.loginDate} `);
        if (attendance.logoutDateCheck !== undefined && attendance.logoutDateCheck !== '') {
          $(detailLogoutDate).html(`${attendance.attendenceDate} ${attendance.logoutDate} `);
        }
        else {
          $(detailLogoutDate).html('');
        }
        $(detailloginLocation).html(attendance.loginLocation);
        if (attendance.logoutLocation !== undefined && attendance.logoutLocation !== '') {
          $(detaillogoutLocation).html(attendance.logoutLocation);
        }
        else {
          $(detaillogoutLocation).html('');
        }
      }
    });
  },
  /**
* TODO: Complete JS doc
* for show filter display
*/
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
* TODO: Complete JS doc
* for hide filter display
*/
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

  /**
     * TODO: Complete JS doc
     * clear data when click close button
     */
  'click .close': (event, template) => {
    $('form :input').val("");
    $('#oRStatus').val('').trigger('change');
    $("#submit").attr("disabled", false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');

  },
  /**
   * TODO: Complete JS doc
   */
  'click .closen': (event, template) => {
    $('form :input').val("");
    $("#submit").attr("disabled", false);
    template.modalLoader.set('');
    $('.loadersSpin').css('display', 'none');
  },

});


