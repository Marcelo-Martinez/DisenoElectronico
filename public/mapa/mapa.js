let lati, lati2, long, long2, marker, marker2, polyline, polyline2;
let latLngs = [];
let latLngs2 = [];
const map = L.map("mapid").setView([51.505, -0.09], 13);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let car1 = false;
let car2 = false;

$("#button1").click(function() {
  car1 = !car1;
  getData();
});

$("#button2").click(function() {
  car2 = !car2;
  getData();
});

function getData() {
  let car = {
    carId: 1
  };
  fetch("getCarPos", {
    method: "POST",
    body: JSON.stringify(car),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);

      if (car1) {
        if (marker) {
          marker.remove();
        }
        if (polyline) {
          polyline.remove();
        }
        console.log(data);
        lati = parseFloat(data.latitude);
        long = parseFloat(data.longitude);
        let d = new Date();
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
              long.toString() +
              "<br/>" +
              "<b> Speed: </b>" +
              " " +
              data.speed.toString() +
              "<b> Date: </b>" +
              d.toDateString(data.time) +
              " " +
              d.toTimeString(data.time)
          )
          .openPopup();

        polyline = L.polyline(latLngs, { color: "#A9CCE3" }).addTo(map);
        let p = document.getElementById("p");
        // p.innerHTML = " Last Date: " + data.realdata.toString();

        console.log(data.time, data.latitude, data.longitude);
      } else {
        if (marker) {
          marker.remove();
        }
        if (polyline) {
          polyline.remove();
        }
      }
      // /////////////////////////////////
      car = {
        carId: 2
      };
      fetch("getCarPos", {
        method: "POST",
        body: JSON.stringify(car),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (car2) {
            if (marker2) {
              marker2.remove();
            }
            if (polyline2) {
              polyline2.remove();
            }
            console.log(data);
            lati2 = parseFloat(data.latitude);
            long2 = parseFloat(data.longitude);
            let da = new Date();
            latLngs2.push([lati2, long2]);
            map.setView({
              lat: lati2,
              lon: long2
            });
            map.setZoom(18);
            marker2 = L.marker([lati2, long2]).addTo(map);
            marker2
              .bindPopup(
                "<b> Longitude: </b>" +
                  lati.toString() +
                  "<b> Latitude: </b>" +
                  long.toString() +
                  "<br/>" +
                  "<b> Speed: </b>" +
                  " " +
                  data.speed.toString() +
                  "<b> Date: </b>" +
                  da.toDateString(data.time) +
                  " " +
                  da.toTimeString(data.time)
              )
              .openPopup();

            polyline2 = L.polyline(latLngs2, { color: "#A9CCE3" }).addTo(map);
            let p = document.getElementById("p");
            //p.innerHTML = " Last Date: " + data.realdata.toString();

            console.log(data.time, data.latitude, data.longitude);
          } else {
            if (marker2) {
              marker2.remove();
            }
            if (polyline2) {
              polyline2.remove();
            }
          }
        });
      // /////////////////////////////////
    });
}

getData();
let time = window.setInterval(getData, 10000);
