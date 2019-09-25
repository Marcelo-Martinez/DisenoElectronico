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
      lati = parseFloat(data.lat) / 100000;
      long = parseFloat(data.long) / 10000;
      latLngs.push([lati, long]);
      map.setView({
        lat: lati,
        lon: long
      });
      map.setZoom(18);
      marker = L.marker([lati, long]).addTo(map);
      polyline = L.polyline(latLngs, { color: "orange" }).addTo(map);
      let p = document.getElementById("p");
      p.innerHTML =
        " Last Date: " +
        data.date +
        " " +
        " --  Latitude: " +
        data.lat / 100000 +
        "  Longitude: " +
        data.long / 10000;
    });
}
getData();
let time = window.setInterval(getData, 10000);
