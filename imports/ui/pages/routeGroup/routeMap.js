/**
* @author Visakh
*/


// import { CurrentLocation } from "../../../api/currentLocation/currentLocation";
import { Meteor } from "meteor/meteor";

let markers = [];
Template.routeWiseMap.onCreated(function () {

  this.currentData = new ReactiveVar();
  this.vansaleUserFullList = new ReactiveVar();
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function (map) { });


});

Template.routeWiseMap.onRendered(function () {
  let id = FlowRouter.getParam('_id');
  GoogleMaps.load({ v: '3', key: 'AIzaSyCmlZ28aHJHq7St9Ti-ZT41cFxAp9EcfM8', libraries: 'geometry,places' });
  Meteor.call('routeGroup.outletData', id, (err, res) => {
    if (!err) {
      // console.log("res",res);
      if (res.length==0) {
      toastr['error'](`No Outlets Found in this Route`);
        
      }
      
      markers = [];
      this.currentData.set(res);
      let sites = res;
      GoogleMaps.ready('exampleMap', function (map) {
        // for (var i = 0; i < sites.length; i++) {
        sites.forEach(function (offer) {
          var site = offer;
          // console.log("site",site);
          var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
          let contentString = ` Name : <strong> ${site.name}</strong> 
            <br>Priority : <strong>${site.priority} </strong>
            <br>Inside Image : <img src="${site.insideImage}" height="100px">
            <br>Outside Image : <img src="${site.outsideImage}" height="100px">`;
          // Create the infowindow object
          let infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          var marker = new google.maps.Marker
            ({
              position: siteLatLng,
              // label: site[0],
              // title: 'Employee : ' + site.user + ', Date : ' + site.date,
              //zIndex: site[3],
              // html: 'Employee : ' + site.user + ', Date : ' + site.date,
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

Template.routeWiseMap.helpers({
  exampleMapOptions: function () {
    let dataGet = Template.instance().currentData.get();
    // Make sure the maps API has loaded
    console.log("dataGet", dataGet);
    if (dataGet !== undefined && dataGet.length > 0) {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(dataGet[0].latitude, dataGet[0].longitude),
          zoom: 3
        };
      }
    }
  },



});


Template.routeWiseMap.events({

  'click .closeMap': (event, template) => {
    event.preventDefault();
    FlowRouter.go('routeGroup');
  }
});



function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}