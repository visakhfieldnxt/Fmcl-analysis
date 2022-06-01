/**
 * @author Greeshma
 */
 import { Delivery } from "../../../api/delivery/delivery";
 import { Outlets } from "../../../api/outlets/outlets";
 import { Meteor } from 'meteor/meteor';

 Template.delivery.onCreated(function () {
    Blaze._allowJavascriptUrls();
    let self = this;
    self.autorun(() => {
    });
    this.deliveryArray = new ReactiveVar();
    this.modalLoader = new ReactiveVar();
    this.deliveryId = new ReactiveVar();
    this.outletLists = new ReactiveVar();
    this.pagination = new Meteor.Pagination(Delivery, {
      filters: {
        active: "Y",
        assigned_to: Meteor.userId()
      },
      perPage: 20
    });
  });
  
 Template.delivery.onRendered(function () {
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
  if (Meteor.user()) {
    Meteor.call('outlet.outletFullList', Meteor.userId(), (err, res) => {
      if (!err) {
        this.outletLists.set(res);
      };
    });
  }
  Meteor.call('delivery.deliveryList', (deliveryError, deliveryResult) => {
      if (!deliveryError) {
        this.deliveryArray.set(deliveryResult);
      }
    });
     $('.deliveryOutletselection').select2({
     placeholder: "Select Outlet",
     tokenSeparators: [','],
     allowClear: true,
     dropdownParent: $(".deliveryOutletselection").parent(),
   });
  });


  Template.delivery.helpers({
      /* list all orders */
      isReady: function () {
        return Template.instance().pagination.ready();
      }, /**
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
      printLoad: () => {
        let res = Template.instance().modalLoader.get();
        if (res === true) {
          return true;
        }
        else {
          return false;
        }
      },
      deliverylist: function () { 
        return Template.instance().pagination.getPage();
      },
       deliveryLists: function () {
        return Template.instance().deliveryArray.get();
      },
      outletHelp: (id) => {
          let promiseVal = new Promise((resolve, reject) => {
            Meteor.call("outlet.idName", id, (error, result) => {
              if (!error) {
                resolve(result);
              } else {
                reject(error);
              }
            });
        });
        promiseVal.then((result) => {
          $('.outletVal_' + id).html(result);
          $('#bodySpinLoaders').css('display', 'none');
        }
        ).catch((error) => {
          $('.outletVal_' + id).html('');
          $('#bodySpinLoaders').css('display', 'none');
        });
      },
      assignedHelp: (id) => {
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
          $('.AssignedVal_' + id).html(result);
          $('#bodySpinLoaders').css('display', 'none');
        }
        ).catch((error) => {
          $('.AssignedVal_' + id).html('');
          $('#bodySpinLoaders').css('display', 'none');
        });
      },
      dateFunction: (date1) => {
        return moment(date1).format('DD-MM-YYYY');
       },
       outletLis: function () {
        return Template.instance().outletLists.get();
    
      }
  });
  Template.delivery.events({
    'click #delivery-create-button': () => {
      $("#delivery-create").modal();
    },
    'click #filterSearch': (event, template) => {
      document.getElementById('filterDisplay').style.display = "block";
      /*Meteor.call('tax.List', (err, res) => {
        if (!err) {
          template.taxLists.set(res);
        }
      });*/
    },/**
    * TODO: Complete JS doc
    * for hide filter display
    */
   'click #removeSearch': () => {
     document.getElementById('filterDisplay').style.display = "none";
   },
/** 
 * TODO:Complete JS doc
 * @param event
 */
  'click .view': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    template.deliveryId.set(id);
    let header = $('#deliveryH');
    let outlet = $('#deliveryoutlet');
    let assigned_to = $('#deliveryassigned_to');
    let date = $('#deliverydate');
    let location = $('#deliveryLocation');
    $('#deliveryDetailPage').modal();
    template.modalLoader.set(true);
    Meteor.call('delivery.deliveryData', id, (error, res) => {
      if (!error) {
        template.modalLoader.set(false);
        let delivery = res;
        template.deliveryId.set(id);
        $(header).html('Details of Delivery');
        $(outlet).html(res.nameOutlet);
        $(assigned_to).html(res.nameassigned_to);
        docDate = delivery.data.date;
        $(date).html(moment(docDate).format('DD-MM-YYYY'));
        $(location).html(delivery.data.location);
        $('#statusdelivery').html(delivery.data.status);
      }
    });

  },
  'submit .deliveryFilter': (event) => {
    console.log(Meteor.userId());
    event.preventDefault();
    let outlet = event.target.deliveryOutletselection.value;

    if (outlet) {
      Template.instance().pagination.settings.set('filters',
        {
          outlet: outlet,
          assigned_to: Meteor.userId()
        }
      );
      $('.taskHeaderList').css('display', 'none');
    } else {
      Template.instance().pagination.settings.set('filters', {
      });
      $('.taskHeaderList').css('display', 'none');
    }
  }
  
  });