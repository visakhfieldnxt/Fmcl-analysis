/**
 * @author Visakh
 */


//  import { CurrentLocation } from "../../../api/currentLocation/currentLocation";
import { Meteor } from "meteor/meteor";

let markers = [];
Template.sdMap.onCreated(function () {

  this.currentData = new ReactiveVar();
  this.vansaleUserFullList = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.subDArraysList = new ReactiveVar();
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function (map) { });


});

Template.sdMap.onRendered(function () {
  $('#bodySpinLoaders').css('display', 'block');
  //  GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
  //  Meteor.call('currentLocation.data', (err, res) => {
  //  if (!err) {
  //      markers = [];
  //      this.currentData.set();
  //      let sites = [];
  //      GoogleMaps.ready('exampleMap', function (map) {
  //        // for (var i = 0; i < sites.length; i++) {
  //        sites.forEach(function () {
  //         //  var site = offer;
  //          var siteLatLng = new google.maps.LatLng(9.027723, -1.541950);
  //         //  let contentString = `Employee Name : <strong> ${site.user}</strong> <br>Last Updated : <strong>${site.date}</strong>`;
  //          // Create the infowindow object
  //         //  let infowindow = new google.maps.InfoWindow({
  //         //    content: contentString
  //         //  });
  //          var marker = new google.maps.Marker
  //            ({
  //              position: siteLatLng,
  //              icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  //              map: map.instance,
  //            });
  //          markers.push(marker);
  //          // Add the infowindow for each marker
  //         //  marker.addListener('click', function () {
  //         //    infowindow.setContent(contentString);
  //         //    infowindow.open(map, marker);
  //         //  });
  //        });
  //      });
  //   //  }
  // //  });
  let subDistributorValue = Session.get("subDistributorValue");
  if (subDistributorValue === true) {
    $('.subDClass').css('display', 'block');
    Meteor.call('outlet.createdBySuD', Meteor.userId(), (err, res) => {
      if (!err && res !== undefined && res.length > 0) {
        $('#bodySpinLoaders').css('display', 'none');
        markers = [];
        GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
        this.currentData.set(res);
        let sites = res;
        GoogleMaps.ready('exampleMap', function (map) {
          sites.forEach(function (offer) {
            var site = offer;
            var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
            let contentString = `Outlet Name : <strong> ${site.name}</strong> 
        <br>Outlet Type : <strong>${site.outletType}</strong>
        <br>Outlet Class : <strong>${site.outletClass}</strong>
        <br>
          <br> <center> <a class="btn btn-info viewImages" id=${site._id} style="font-size:9px;">View Images </a> </center>`;
            //  <br>Outside Image : <img src="${site.outsideImage}" height="200px">`;
            // Create the infowindow object
            let infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            var marker = new google.maps.Marker
              ({
                position: siteLatLng,
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
      else {
        $('#bodySpinLoaders').css('display', 'none');
      }
    });
  }
  else {
    $('.businessHeadClass').css('display', 'block');
    let loginUserVerticals = Session.get("loginUserVerticals");
    Meteor.call('outlet.loginVerticalWise', loginUserVerticals, (err, res) => {
      if (!err && res !== undefined && res.length > 0) {
        $('#bodySpinLoaders').css('display', 'none');
        markers = [];
        GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
        this.currentData.set(res);
        let sites = res;
        GoogleMaps.ready('exampleMap', function (map) {
          sites.forEach(function (offer) {
            var site = offer;
            var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
            let contentString = `Outlet Name : <strong> ${site.name}</strong> 
        <br>Outlet Type : <strong>${site.outletType}</strong>
        <br>Outlet Class : <strong>${site.outletClass}</strong>
        <br>
          <br> <center> <a class="btn btn-info viewImages" id=${site._id} style="font-size:9px;">View Images </a> </center>`;
            //  <br>Outside Image : <img src="${site.outsideImage}" height="200px">`;
            // Create the infowindow object
            let infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            var marker = new google.maps.Marker
              ({
                position: siteLatLng,
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
      else {
        $('#bodySpinLoaders').css('display', 'none');
      }
    });
  }
  Meteor.call('user.userSdList', Meteor.userId(), (err, res) => {
    if (!err) {
      this.vansaleUserFullList.set(res);
    }
  });
  let loginUserVerticals = Session.get("loginUserVerticals");
  Meteor.call('user.subDList', loginUserVerticals, (err, res) => {
    if (!err) {
      this.subDArraysList.set(res);
    }
  });
  $('.selectEmpVal').select2({
    placeholder: "Select Employee Name",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectEmpVal").parent(),
  });
  $('.selectSubDVal').select2({
    placeholder: "Select Sub Distributor",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectSubDVal").parent(),
  });
});
Template.sdMap.helpers({
  // exampleMapOptions: function () {
  //   //  let dataGet = Template.instance().currentData.get();
  //   // Make sure the maps API has loaded
  //   //  console.log("dataGet", dataGet);
  //   //  if (dataGet !== undefined && dataGet.length > 0) {

  //   if (GoogleMaps.loaded()) {
  //     return {
  //       center: new google.maps.LatLng(9.027723, -1.541950),
  //       zoom: 3,
  //     };
  //   }
  //   //  }
  // },

  printLoad: () => {
    let res = Template.instance().modalLoader.get();
    if (res === true) {
      return true;
    }
    else {
      return false;
    }
  },
  exampleMapOptions: function () {
    let dataGet = Template.instance().currentData.get();
    console.log("ressssssssscccccccc")
    if (dataGet !== undefined && dataGet.length > 0) {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(dataGet[0].latitude, dataGet[0].longitude),
          zoom: 3,
        };
      }
    }

  },

  vansaleUserData: () => {
    return Template.instance().vansaleUserFullList.get();
  },

  subDUserList: () => {
    return Template.instance().subDArraysList.get();
  }

});


Template.sdMap.events({
  /**
     * TODO: Complete JS doc
     * for show filter display
     */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
   * TODO: Complete JS doc
   * to hide filter display
   */
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

  'submit .map-filter': (event, template) => {
    template.currentData.set('');
    event.preventDefault();
    let userId = event.target.selectEmpVal.value;
    let subDId = event.target.selectSubDVal.value;
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      if (userId) {
        template.currentData.set('');
        // setMapOnAll(null); 
        clearOverlays();
        Meteor.call('outlet.createdByUser', userId, (err, res) => {
          if (!err && res !== undefined && res.length > 0) {
            markers = [];
            GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
            template.currentData.set(res);
            let sites = res;
            GoogleMaps.ready('exampleMap', function (map) {
              sites.forEach(function (offer) {
                var site = offer;
                var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
                let contentString = `Outlet Name : <strong> ${site.name}</strong> 
              <br>Outlet Type : <strong>${site.outletType}</strong>
              <br>Outlet Class : <strong>${site.outletClass}</strong>
              <br>
                <br> <center> <a class="btn btn-info viewImages" id=${site._id} style="font-size:9px;">View Images </a> </center>`;
                // Create the infowindow object
                let infowindow = new google.maps.InfoWindow({
                  content: contentString
                });
                var marker = new google.maps.Marker
                  ({
                    position: siteLatLng,
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
            let myImg = document.getElementById("mapContainer");
            let currWidth = myImg.clientWidth;
            myImg.style.width = (currWidth + 400) + "px";
          }
          else {
            toastr["error"]('Location Not Found !');
          }
        });
      }
    }
    else {
      if (subDId) {
        template.currentData.set('');
        // setMapOnAll(null);
        clearOverlays();
        Meteor.call('outlet.createdBySuD', subDId, (err, res) => {
          if (!err && res !== undefined && res.length > 0) {
            // ZoomAndCenter(res); 
            markers = [];
            GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
            template.currentData.set(res);
            let sites = res;
            GoogleMaps.ready('exampleMap', function (map) {
              sites.forEach(function (offer) {
                var site = offer;
                var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
                let contentString = `Outlet Name : <strong> ${site.name}</strong> 
              <br>Outlet Type : <strong>${site.outletType}</strong>
              <br>Outlet Class : <strong>${site.outletClass}</strong>
              <br>
                <br> <center> <a class="btn btn-info viewImages" id=${site._id} style="font-size:9px;">View Images </a> </center>`;
                // Create the infowindow object
                let infowindow = new google.maps.InfoWindow({
                  content: contentString
                });
                var marker = new google.maps.Marker
                  ({
                    position: siteLatLng,
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
            let myImg = document.getElementById("mapContainer");
            let currWidth = myImg.clientWidth;
            myImg.style.width = (currWidth + 400) + "px";
          }
          else {
            toastr["error"]('Location Not Found !');
          }
        });
      }
    }

  },

  /**
   * TODO: Complete JS doc
   * for reset filter
   */
  'click .reset': (event, template) => {
    event.preventDefault();
    $('#selectEmpVal').val('').trigger('change');
    $("#fromDate").val('');
    $('form :input').val("");
    // setMapOnAll(null);
    clearOverlays();
    removePolyline();
    template.currentData.set('');
    let subDistributorValue = Session.get("subDistributorValue");
    if (subDistributorValue === true) {
      Meteor.call('outlet.createdBySuD', Meteor.userId(), (err, res) => {
        if (!err && res !== undefined && res.length > 0) {
          markers = [];
          GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
          this.currentData.set(res);
          let sites = res;
          GoogleMaps.ready('exampleMap', function (map) {
            sites.forEach(function (offer) {
              var site = offer;
              var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
              let contentString = `Outlet Name : <strong> ${site.name}</strong> 
          <br>Outlet Type : <strong>${site.outletType}</strong>
          <br>Outlet Class : <strong>${site.outletClass}</strong>
          <br>
            <br> <center> <a class="btn btn-info viewImages" id=${site.outletClass} style="font-size:9px;">View Images </a> </center>`;
              //  <br>Outside Image : <img src="${site.outsideImage}" height="200px">`;
              // Create the infowindow object
              let infowindow = new google.maps.InfoWindow({
                content: contentString
              });
              var marker = new google.maps.Marker
                ({
                  position: siteLatLng,
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
    }
    else {
      let loginUserVerticals = Session.get("loginUserVerticals");
      Meteor.call('outlet.loginVerticalWise', loginUserVerticals, (err, res) => {
        if (!err && res !== undefined && res.length > 0) {
          $('#bodySpinLoaders').css('display', 'none');
          markers = [];
          GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
          this.currentData.set(res);
          let sites = res;
          GoogleMaps.ready('exampleMap', function (map) {
            sites.forEach(function (offer) {
              var site = offer;
              var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
              let contentString = `Outlet Name : <strong> ${site.name}</strong> 
        <br>Outlet Type : <strong>${site.outletType}</strong>
        <br>Outlet Class : <strong>${site.outletClass}</strong>
        <br>
          <br> <center> <a class="btn btn-info viewImages" id=${site._id} style="font-size:9px;">View Images </a> </center>`;
              //  <br>Outside Image : <img src="${site.outsideImage}" height="200px">`;
              // Create the infowindow object
              let infowindow = new google.maps.InfoWindow({
                content: contentString
              });
              var marker = new google.maps.Marker
                ({
                  position: siteLatLng,
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
        else {
          $('#bodySpinLoaders').css('display', 'none');
        }
      });
    }
  },

  'click .viewImages': (event, template) => {
    event.preventDefault();
    let id = event.currentTarget.id;
    if (id) {
      $('#outletH').html("Outlet Images");
      template.modalLoader.set(true);
      $('#outletDetailPage').modal();
      Meteor.call('outlets.getImages', id, (err, res) => {
        if (!err && res !== undefined) {
          template.modalLoader.set(false);
          if (res.insideImage) {
            $("#attachment1").attr('style', 'display:block');
            $("#attachment1").attr('src', res.insideImage);
          }
          else {
            $("#attachment1").attr('src', '');
            $("#insideImgDiv").val('');
          }

          if (res.outsideImage) {
            $("#attachment2").attr('style', 'display:block');
            $("#attachment2").attr('src', res.outsideImage);
          }
          else {
            $("#attachment2").attr('src', '');
            $("#ousideImgDiv").val('');
          }
          $(document).ready(function () {
            $('.attachment').click(function () {
              let src = $(this).attr('src');
              $('#fullScreen').css({
                background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
                backgroundSize: 'contain',
                width: '100%', height: '100%',
                position: 'fixed',
                zIndex: '10000',
                top: '0', left: '0',
                cursor: 'zoom-out'
              });
              $('#fullScreen').fadeIn();
            });
            $('#fullScreen').click(function () {
              $(this).fadeOut();
            });
          });
        }
        else {
          template.modalLoader.set(false);
          $('#outletDetailPage').modal('hide');
          toastr["error"]('Image Not Found !');
        }
      });
    }
  },

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

  var marker = [];
  var mapOptions = {
    center: new google.maps.LatLng(siteLoc[0].lat, siteLoc[0].lng),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);

  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  var startPoint;
  var endPoint;
  var waypts = [];

  for (let i = 0; i < response.length; i++) {

    let contentString = `Employee Name : <strong> ${response[i].user}</strong> <br>Last Updated : <strong>${response[i].date}</strong>`;
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
    if (i == 0) {
      startPoint = new google.maps.LatLng(response[i].latitude, response[i].longitude)
    }

    if (i == response.length - 1) {
      endPoint = new google.maps.LatLng(response[i].latitude, response[i].longitude)
    }

    if ((i > 0) && (i < response.length - 1)) {
      waypts.push({
        location: new google.maps.LatLng(response[i].latitude, response[i].longitude),
        stopover: true
      });
    }

    // Add the infowindow for each marker
    marker.addListener('click', function () {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });
  }

  calcRoute(startPoint, endPoint, waypts);

  //add this function
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
      }
    });
  }
}


function ZoomAndCenter(dataGet) {
  // let myImg = document.getElementById("mapContainer");
  // let currWidth = myImg.clientWidth;
  // myImg.style.width = (currWidth + 400) + "px";
  var map = new google.maps.Map(document.getElementById("mapContainer"));
  map.setCenter(new google.maps.LatLng(dataGet[0].latitude, dataGet[0].longitude));
  map.setZoom(3);
}
