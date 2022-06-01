/**
 * @author Visakh
 */


//  import { CurrentLocation } from "../../../api/currentLocation/currentLocation";
 import { Meteor } from "meteor/meteor";
 
 let markers = [];
 Template.locationTracker.onCreated(function () {
 
   this.currentData = new ReactiveVar();
   this.vansaleUserFullList = new ReactiveVar();
   // We can use the `ready` callback to interact with the map API once the map is ready.
   GoogleMaps.ready('exampleMap', function (map) { });
 
 
 });
 
 Template.locationTracker.onRendered(function () {
 
   GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
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
           let contentString = `Employee Name : <strong> ${site.user}</strong> <br>Last Updated : <strong>${site.date}</strong>`;
           // Create the infowindow object
           let infowindow = new google.maps.InfoWindow({
             content: contentString
           });
           var marker = new google.maps.Marker
             ({
               position: siteLatLng,
               icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
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
   $('.selectEmpVal').select2({
     placeholder: "Select Employee Name",
     tokenSeparators: [','],
     allowClear: true,
     dropdownParent: $(".selectEmpVal").parent(),
   });
 
 });
 
 Template.locationTracker.helpers({
   exampleMapOptions: function () {
     let dataGet = Template.instance().currentData.get();
     // Make sure the maps API has loaded
     console.log("dataGet", dataGet);
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
   }
 
 });
 
 
 Template.locationTracker.events({
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
     let first = $("#fromDate").val();
     let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
     let fromDate = new Date(dateOne);
     console.log("fromDate", fromDate);
     if (userId && isNaN(fromDate)) {
       template.currentData.set('');
       console.log("User only");
       // setMapOnAll(null);
       clearOverlays();
       Meteor.call('currentLocation.userData', userId, (err, res) => {
         if (!err && res !== undefined && res.length > 0) {
           markers = [];
           GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
           template.currentData.set(res);
           let sites = res;
           GoogleMaps.ready('exampleMap', function (map) {
             sites.forEach(function (offer) {
               var site = offer;
               var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
               let contentString = `Employee Name : <strong> ${site.user}</strong> <br>Last Updated : <strong>${site.date}</strong>`;
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
               console.log("markers", markers);
               // Add the infowindow for each marker
               marker.addListener('click', function () {
                 infowindow.setContent(contentString);
                 infowindow.open(map, marker);
               });
             });
           });
         }
         else{
           toastr["error"]('Location Not Found !');
         }
       });
     }
     else if (userId === '' && fromDate) {
       template.currentData.set('');
       console.log("Date only");
       // setMapOnAll(null);
       clearOverlays();
       Meteor.call('currentLocation.dateWiseFilter', fromDate, (err, res) => {
         if (!err && res !== undefined && res.length > 0) {
           markers = [];
           GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
           template.currentData.set(res);
           let sites = res;
           GoogleMaps.ready('exampleMap', function (map) {
             sites.forEach(function (offer) {
               var site = offer;
               var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
               let contentString = `Employee Name : <strong> ${site.user}</strong> <br>Last Updated : <strong>${site.date}</strong>`;
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
         else{
           toastr["error"]('Location Not Found !');
         }
       });
     }
     else if (userId && fromDate) {
       template.currentData.set('');
       console.log("Date and user");
       // setMapOnAll(null);
       clearOverlays();
       Meteor.call('currentLocation.dateAndUserWise', userId, fromDate, (err, res) => {
         if (!err && res !== undefined && res.length > 0) {
           markers = [];
           GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
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
         else{
           removePolyline();
           toastr["error"]('Location Not Found !');
         }
       });
     }
     else {
       toastr["error"]('Location Not Found !');
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
     GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
     Meteor.call('currentLocation.data', (err, res) => {
       if (!err) {
         markers = [];
         template.currentData.set(res);
         let sites = res;
         GoogleMaps.ready('exampleMap', function (map) {
           // for (var i = 0; i < sites.length; i++) {
           sites.forEach(function (offer) {
             var site = offer;
             var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
             let contentString = `Employee Name : <strong> ${site.user}</strong> <br>Last Updated : <strong>${site.date}</strong>`;
             // Create the infowindow object
             let infowindow = new google.maps.InfoWindow({
               content: contentString
             });
             var marker = new google.maps.Marker
               ({
                 position: siteLatLng,
                 icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
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