let lati, long, marker, polyline;
let latLngs = [];
const map = L.map("mapid").setView([51.505, -0.09], 13);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function getData() {
  fetch("sendR")
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (marker) {
        marker.remove();
      }
      if (polyline) {
        polyline.remove();
      }
      console.log(data);
      lati = parseFloat(data.latitude);
      long = parseFloat(data.longitude);
      latLngs.push([lati, long]);
      map.setView({
        lat: lati,
        lon: long
      });
      map.setZoom(18);
      marker = L.marker([lati, long]).addTo(map);
      marker
        .bindPopup(
          "<b> Longitude: </b>" +
            lati.toString() +
            "<b> Latitude: </b>" +
            long.toString()
        )
        .openPopup();

      polyline = L.polyline(latLngs, { color: "blue" }).addTo(map);
      let p = document.getElementById("p");
      p.innerHTML =
        " Last Date: " +
        data.time +
        " " +
        " --  Latitude: " +
        data.latitude +
        "  Longitude: " +
        data.longitude;

      console.log(data.time, data.latitude, data.longitude);
    });
}
getData();
let time = window.setInterval(getData, 10000);
//var cosa = new Date($('.class_name').val()).getTime();
