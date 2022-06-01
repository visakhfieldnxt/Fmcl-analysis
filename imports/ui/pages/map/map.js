/**
 * @author Visakh
 */


import { CurrentLocation } from "../../../api/currentLocation/currentLocation";
import { Meteor } from "meteor/meteor";
// OLD API - AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8
let markers = [];
let directionsService;
let directionsDisplay;
let disableLines = false;
Template.locationTracker.onCreated(function () {
  disableLines = false;
  this.currentData = new ReactiveVar();
  this.routeArrayList = new ReactiveVar();
  this.vansaleUserFullList = new ReactiveVar();
  this.routeDetailsGet = new ReactiveVar();
  this.routeIdList = new ReactiveVar();
  this.mapFilterDate = new ReactiveVar();
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function (map) { });


});

Template.locationTracker.onRendered(function () {
  let dateVal = moment(new Date()).format("YYYY-MM-DD");
  let todayDate = new Date(dateVal);
  this.mapFilterDate.set(todayDate);
  $('#bodySpinVal').css('display', 'block');
  $('#userDetailsModal').css('display', 'block');
  $('#routeDetailsModal').css('display', 'block');
  // $('#routeDetailModal').modal();
  let vansaleRoles = Session.get("vansaleRoles");
  let managerBranch = Session.get("managerBranch");
  Meteor.call("routeGroup.routeListData", managerBranch, (err, res) => {
    if (!err) {
      this.routeIdList.set(res);
    }
  })
  Meteor.call('routeGroup.getUserDetails', vansaleRoles, (err, res) => {
    if (!err) {
      this.routeDetailsGet.set(res);
      $('#bodySpinVal').css('display', 'none');
    }
    else {
      $('#bodySpinVal').css('display', 'none');
    }
  });

  disableLines = false;
  GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places' });
  Meteor.call('currentLocation.data', (err, res) => {
    if (!err) {
      markers = [];
      this.currentData.set(res);
      let sites = res;
      GoogleMaps.ready('exampleMap', function (map) {
        // for (var i = 0; i < sites.length; i++) {
        sites.forEach(function (offer) {
          var site = offer;
          var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
          // let contentString = `Employee Name : <strong> ${site.user}</strong> <br>Last Updated : <strong>${site.date}</strong>`;
          // Create the infowindow object 
          let urlIcon = '/img/login.png';
          let contentString = `<div class="userDiv" id=${site.userIds}> Employee Name : <strong> ${site.user}</strong> <br>Last Updated On : <strong>${site.date} </div>`;

          let infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          var marker = new google.maps.Marker
            ({
              position: siteLatLng,
              icon: urlIcon,
              map: map.instance,
            });
          markers.push(marker);
          // Add the infowindow for each marker
          marker.addListener('click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          });
        });
      });
    }
  });
  Meteor.call('user.vansaleList', (err, res) => {
    if (!err) {
      this.vansaleUserFullList.set(res);
    }
  });
  Meteor.call('routeGroup.listActives', (err, res) => {
    if (!err) {
      this.routeArrayList.set(res);
    }
  });
  $('.selectEmpVal').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectEmpVal").parent(),
  });
  $('.selectRouteId').select2({
    placeholder: "Select Route",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectRouteId").parent(),
  });

  $('.userActivities').select2({
    placeholder: "Select Activity",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".userActivities").parent(),
  });

});

Template.locationTracker.helpers({
  currencyGet: () => {
    let currencyValues = Session.get("currencyValues");
    return currencyValues;
  },
  exampleMapOptions: function () {
    let dataGet = Template.instance().currentData.get();
    // Make sure the maps API has loaded
    console.log("dataGet", dataGet);
    if (dataGet !== undefined && dataGet.length > 0) {

      if (GoogleMaps.loaded()) {
        // let map;
        // var mapOptions = {
        //   center: new google.maps.LatLng(dataGet[0].latitude, dataGet[0].longitude),
        //   zoom: 3,
        // };
        // var map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
        // const centerControlDiv = document.createElement("div"); 
        // CenterControl(centerControlDiv, map);
        // map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
        return {
          center: new google.maps.LatLng(dataGet[0].latitude, dataGet[0].longitude),
          zoom: 7,
        };
      }
    }
    else {
      let latitudeVal = Session.get('locationLat');
      let longitudeVal = Session.get('locationLng');
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(latitudeVal, longitudeVal),
          zoom: 7,
        };
      }
    }
  },

  displayDate: () => {
    return moment(new Date()).format("DD-MM-YYYY");
  },
  routeDataList: () => {
    return Template.instance().routeDetailsGet.get()
  },
  vansaleUserData: () => {
    return Template.instance().vansaleUserFullList.get();
  }
  ,
  routeNameArray: () => {
    return Template.instance().routeIdList.get()
  },
  routeArrayGet: () => {
    return Template.instance().routeArrayList.get();
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});

Template.locationTracker.events({
  /**
     * TODO: Complete JS doc
     * for show filter display
     */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
    $('#userDetailsModal').css('display', 'none');
    $('#routeDetailsModal').css('display', 'none');
    $('#filterSearch').css('display', 'none');
  },
  /**
   * TODO: Complete JS doc
   * to hide filter display
   */
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
    $('#userDetailsModal').css('display', 'block');
    $('#routeDetailsModal').css('display', 'block');
    $('#filterSearch').css('display', 'block');
  },

  'submit .map-filter': (event, template) => {
    event.preventDefault();
    let userId = event.target.selectEmpVal.value;
    let routeId = event.target.selectRouteId.value;
    let userActivityId = event.target.userActivities.value;
    let first = $("#fromDate").val();
    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fromDate = new Date(dateOne);
    template.mapFilterDate.set(fromDate);
    if (first !== '' && first !== undefined) {
      if ((routeId !== '' || userId !== '') && first !== '' && userActivityId === '') {
        disableLines = false;
        template.currentData.set('');
        console.log("Date and user");
        // setMapOnAll(null); 
        $('#bodySpinVal').css('display', 'block');
        Meteor.call('currentLocation.dateAndUserWise', userId, fromDate, routeId, (err, res) => {
          if (!err && res !== undefined && res.length > 0) {
            $('#bodySpinVal').css('display', 'none');
            clearOverlays();
            markers = [];
            GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
            template.currentData.set(res);
            let sites = res;

            let loc = [];
            for (let k = 0; k < sites.length; k++) {
              let obj = {
                "title": "title" + '' + k + 1,
                "lat": sites[k].latitude,
                "lng": sites[k].longitude,
                "user": sites[k].user,
                "date": sites[k].date,
                "description": "description" + '' + k + 1
              }
              loc.push(obj);
            }
            if (loc !== undefined && loc.length !== 0) {
              console.log("loc", loc);
              drawRoute(loc, sites);
            }
          }
          else {
            // removePolyline();
            $('#bodySpinVal').css('display', 'none');
            toastr["error"]('Location Not Found !');
          }
        });
      }
      else if ((routeId !== '' || userId !== '') && first !== '' && userActivityId !== '') {
        disableLines = true;
        clearOverlays();
        removeRouteLines();
        template.currentData.set('');
        $('#bodySpinVal').css('display', 'block');
        GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
        Meteor.call('currentLocation.dataActivity', userId, fromDate, routeId, userActivityId, (err, res) => {
          if (!err && res !== undefined && res.length > 0) {
            $('#bodySpinVal').css('display', 'none');
            markers = [];
            GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
            template.currentData.set(res);
            let sites = res;

            let loc = [];
            for (let k = 0; k < sites.length; k++) {
              let obj = {
                "title": "title" + '' + k + 1,
                "lat": sites[k].latitude,
                "lng": sites[k].longitude,
                "user": sites[k].user,
                "date": sites[k].date,
                "description": "description" + '' + k + 1
              }
              loc.push(obj);
            }
            if (loc !== undefined && loc.length !== 0) {
              console.log("loc", loc);
              drawRoute(loc, sites);
            }

          }
          else {
            toastr["error"]('Location Not Found !');
            $('#bodySpinVal').css('display', 'none');
          }
        });
      }
      else if (routeId === '' && userId === '' && first !== '' && userActivityId === '') {
        disableLines = true;
        clearOverlays();
        removeRouteLines();
        template.currentData.set('');
        $('#bodySpinVal').css('display', 'block');
        GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
        Meteor.call('currentLocation.dataDateList', fromDate, (err, res) => {
          if (!err && res !== undefined && res.length > 0) {
            $('#bodySpinVal').css('display', 'none');
            markers = [];
            GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
            template.currentData.set(res);
            let sites = res;

            let loc = [];
            for (let k = 0; k < sites.length; k++) {
              let obj = {
                "title": "title" + '' + k + 1,
                "lat": sites[k].latitude,
                "lng": sites[k].longitude,
                "user": sites[k].user,
                "date": sites[k].date,
                "description": "description" + '' + k + 1
              }
              loc.push(obj);
            }
            if (loc !== undefined && loc.length !== 0) {
              console.log("loc", loc);
              drawRoute(loc, sites);
            }

          }
          else {
            toastr["error"]('Location Not Found !');
            $('#bodySpinVal').css('display', 'none');
          }
        });
      }
      else {
        toastr["error"]('Location Not Found !');
        $('#bodySpinVal').css('display', 'none');
      }
    }
    else {
      toastr["error"]('Select Date !');
      $('#bodySpinVal').css('display', 'none');
    }
  },

  /**
   * TODO: Complete JS doc
   * for reset filter
   */
  'click .reset': (event, template) => {
    event.preventDefault();
    $('#selectEmpVal').val('').trigger('change');
    $('#selectRouteId').val('').trigger('change');
    $('#userActivities').val('').trigger('change');
    $("#fromDate").val('');
    $('form :input').val("");
    // setMapOnAll(null);
    clearOverlays();
    removePolyline();
    disableLines = false;
    template.currentData.set('');
    let dateVal = moment(new Date()).format("YYYY-MM-DD");
    let todayDate = new Date(dateVal);
    template.mapFilterDate.set(todayDate);
    $('#bodySpinVal').css('display', 'block');
    GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
    Meteor.call('currentLocation.data', (err, res) => {

      if (!err) {
        $('#bodySpinVal').css('display', 'none');
        markers = [];
        template.currentData.set(res);
        let sites = res;
        GoogleMaps.ready('exampleMap', function (map) {
          // for (var i = 0; i < sites.length; i++) {
          sites.forEach(function (offer) {
            var site = offer;
            var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
            let urlIcon = '/img/login.png';
            let contentString = `<div class="userDiv" id=${site.userIds}> Employee Name : <strong> ${site.user}</strong> <br>Last Updated On : <strong>${site.date} </div>`;
            // let contentString = `Employee Name : <strong> ${site.user}</strong> <br>Last Updated : <strong>${site.date}</strong>`;
            // Create the infowindow object
            let infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            var marker = new google.maps.Marker
              ({
                position: siteLatLng,
                icon: urlIcon,
                map: map.instance,
              });
            markers.push(marker);
            // Add the infowindow for each marker
            marker.addListener('click', function () {
              infowindow.setContent(contentString);
              infowindow.open(map, marker);
            });
          });
        });
      }
    });
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * open emp detail modal
   */
  'click #userDetailsModal': (event, template) => {
    $('#routeDetailModal').modal();
    $('#userDetailsModal').css('display', 'none');
    $('#routeDetailsModal').css('display', 'none');
    $('#filterSearch').css('display', 'none');
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 * open emp detail modal
 */
  'click #routeDetailsModal': (event, template) => {
    $('#routeNameModal').modal();
    $('#userDetailsModal').css('display', 'none');
    $('#routeDetailsModal').css('display', 'none');
    $('#filterSearch').css('display', 'none');
  },
  /**
 * 
 * @param {*} event 
 * @param {*} template 
 * close emp detail modal
 */
  'click .closeModalVal': () => {
    $('#userDetailsModal').css('display', 'block');
    $('#routeDetailsModal').css('display', 'block');
    $('#filterSearch').css('display', 'block');
  },
  /**
   * 
   * @param {*} event 
   * @param {*} template 
   * draw lines based on user
   */
  'click .userDiv': (event, template) => {
    template.currentData.set('');
    $('#routeDetailModal').modal('hide');
    $('#userDetailsModal').css('display', 'block');
    $('#routeDetailsModal').css('display', 'block');
    $('#filterSearch').css('display', 'block');
    document.getElementById('filterDisplay').style.display = "none";
    let toDate = Template.instance().mapFilterDate.get();
    let userId = event.currentTarget.id;
    console.log("toDate", toDate);
    // setMapOnAll(null); 
    disableLines = false;
    $('#bodySpinVal').css('display', 'block');
    Meteor.call('currentLocation.dateAndUserWise', userId, toDate, '', (err, res) => {
      if (!err && res !== undefined && res.length > 0) {
        $('#bodySpinVal').css('display', 'none');
        clearOverlays();
        markers = [];
        GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
        template.currentData.set(res);
        let sites = res;

        let loc = [];
        for (let k = 0; k < sites.length; k++) {
          let obj = {
            "title": "title" + '' + k + 1,
            "lat": sites[k].latitude,
            "lng": sites[k].longitude,
            "user": sites[k].user,
            "date": sites[k].date,
            "description": "description" + '' + k + 1
          }
          loc.push(obj);
        }
        if (loc !== undefined && loc.length !== 0) {
          console.log("loc", loc);
          drawRoute(loc, sites);
        }
      }
      else {
        // removePolyline();\
        $('#bodySpinVal').css('display', 'none');
        toastr["error"]('Route Details Not Found !');
      }
    });
  },

  /**
 * 
 * @param {*} event 
 * @param {*} template 
 * draw lines based on user
 */
  'click .routeIdDiv': (event, template) => {
    template.currentData.set('');
    $('#routeNameModal').modal('hide');
    $('#userDetailsModal').css('display', 'block');
    $('#routeDetailsModal').css('display', 'block');
    $('#filterSearch').css('display', 'block');
    let routeId = event.currentTarget.id;
    // setMapOnAll(null); 
    disableLines = true;
    $('#bodySpinVal').css('display', 'block');
    Meteor.call('routeCustomer.routeLatLong', routeId, (err, res) => {
      if (!err && res !== undefined && res.length > 0) {
        $('#bodySpinVal').css('display', 'none');
        clearOverlays();
        markers = [];
        GoogleMaps.load({ v: '3', key: 'AIzaSyDVSVA1cOda2JCE4gzsgzpx8lPA311T2nU', libraries: 'geometry,places,drawing' });
        template.currentData.set(res);
        let sites = res;

        let loc = [];
        for (let k = 0; k < sites.length; k++) {
          let obj = {
            "title": "title" + '' + k + 1,
            "lat": sites[k].latitude,
            "lng": sites[k].longitude,
            "user": sites[k].user,
            "date": sites[k].date,
            "description": "description" + '' + k + 1
          }
          loc.push(obj);
        }
        if (loc !== undefined && loc.length !== 0) {
          console.log("loc", loc);
          drawRoute(loc, sites);
        }
      }
      else {
        // removePolyline();
        $('#bodySpinVal').css('display', 'none');
        toastr["error"]('Route Details Not Found !');
      }
    });
  }
});

function clearOverlays() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}


function removePolyline() {
  Meteor._reload.reload();
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function drawRoute(siteLoc, response) {
  let currencyValues = Session.get("currencyValues");
  var marker = [];
  var mapOptions = {
    center: new google.maps.LatLng(siteLoc[0].lat, siteLoc[0].lng),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
  directionsService = new google.maps.DirectionsService();

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  var startPoint;
  var endPoint;
  var waypts = [];

  for (let i = 0; i < response.length; i++) {

    let contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>`;
    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    var siteLatLng = new google.maps.LatLng(response[i].latitude, response[i].longitude);
    marker = new google.maps.Marker
      ({
        position: siteLatLng,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        map: map.instance,
      });
    markers.push(marker);

    let urlIcon = '';
    if (response[i].activity === 'Login') {
      urlIcon = '/img/login.png';
    }
    else if (response[i].activity === 'User Route') {
      urlIcon = '/img/vansale.png';
    }
    else if (response[i].activity === 'Customer With No Transactions') {
      urlIcon = '/img/nosale.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>`;
    }
    else if (response[i].activity === 'Shop Skipped') {
      urlIcon = '/img/skipped.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>`;
    }
    else if (response[i].activity === 'Check In Details') {
      urlIcon = '/img/checkin.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>
      </strong><br>CheckIn Date : <strong>${response[i].routeDate} ${response[i].checkIn}</strong>
      </strong><br>CheckOut Date : <strong>${response[i].routeDate} ${response[i].checkOut}</strong>`;
    }
    else if (response[i].activity === 'Sales Order') {
      urlIcon = '/img/order.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>
      </strong><br>Amount : <strong> ${response[i].amount} (${currencyValues})</strong>`;
    }
    else if (response[i].activity === 'Sales Quotation') {
      urlIcon = '/img/quotation.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>
      </strong><br>Amount : <strong> ${response[i].amount} (${currencyValues})</strong>`;
    }
    else if (response[i].activity === 'Credit Invoice') {
      urlIcon = '/img/credit-invoice.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>
      </strong><br>Amount : <strong> ${response[i].amount} (${currencyValues})</strong>`;
    }
    else if (response[i].activity === 'Ar Invoice + Payment') {
      urlIcon = '/img/vansale.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>
      </strong><br>Amount : <strong> ${response[i].amount} (${currencyValues})</strong>`;
    }
    else if (response[i].activity === 'POS Sales') {
      urlIcon = '/img/vansale.png';
      contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Date And Time : <strong>${response[i].date} </strong><br>Activity : <strong>${response[i].activity}</strong>  </strong><br>Customer : <strong>${response[i].customer}</strong>
      </strong><br>Amount : <strong> ${response[i].amount} (${currencyValues})</strong>`;
    }
    else if (response[i].activity === 'Attendance Punch Out' ||
      response[i].activity === 'Attendance Punch In') {
      urlIcon = '/img/attendance.png';

    }
    else if (response[i].activity === 'Customer Location') {
      urlIcon = '/img/vansale.png';
      contentString = `Customer Name : <strong> ${response[i].user}</strong> <br>Address : <strong>${response[i].addressName} </strong><br>`
    }

    else if (response[i].activity === 'Filter Location') {
      urlIcon = '/img/login.png';
      contentString = `<div class="userDiv" id=${response[i].userIds}> Employee Name : <strong> ${response[i].user}</strong> <br>Last Updated On : <strong>${response[i].date} </div>`
    }


    createMarker(siteLatLng, "A", contentString, map, infowindow, urlIcon);
    if (i == 0) {
      startPoint = new google.maps.LatLng(response[i].latitude, response[i].longitude)
    }

    if (i == response.length - 1) {
      endPoint = new google.maps.LatLng(response[i].latitude, response[i].longitude)
    }

    if ((i > 0) && (i < response.length - 1)) {
      waypts.push({
        location: new google.maps.LatLng(response[i].latitude, response[i].longitude),
        stopover: true,
      });
    }

    // Add the infowindow for each marker
    marker.addListener('click', function () {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });
  }
  if (disableLines === false) {
    calcRoute(startPoint, endPoint, waypts, map, infowindow);
  }
  //add this function s
  function calcRoute(start, end, waypts) {
    var request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setOptions({
          draggable: false,
          suppressInfoWindows: true,
          suppressMarkers: true
        });
      }
    });
  }


}

function removeRouteLines() {
  if (directionsDisplay) {
    directionsDisplay.setMap(null);
  }
}

function createMarker(location, label, content, map, id, urlIcon) {
  //console.log(location.lat);
  var marker = new google.maps.Marker({
    position: location,
    // label: label,
    title: label,
    id: id,
    icon: {
      url: urlIcon,
      // This marker is 20 pixels wide by 32 pixels high.
      // The anchor for this image is the base of the flagpole at (0, 32).
      // anchor: new google.maps.Point(0, 0)
    },
    map: map
  });
  infowindow = new google.maps.InfoWindow({
    content: content,
    maxWidth: 350
  });
  // infowindow.setContent(content);
  // infowindow.open(map, marker);

  marker.addListener('click', function () {
    infowindow.setContent(content);
    infowindow.open(map, marker);
  });
  //console.log(marker);
  markers.push(marker);

}

function CenterControl(controlDiv, map) {
  // Set CSS for the control border.
  const controlUI = document.createElement("div");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginTop = "8px";
  controlUI.style.marginBottom = "22px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to recenter the map";
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  const controlText = document.createElement("div");

  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "Employee Details";
  controlUI.appendChild(controlText);
  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener("click", () => {
    // map.setCenter(chicago);
    $('#routeDetailModal').modal();
  });
}