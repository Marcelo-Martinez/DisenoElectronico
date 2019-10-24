let marker, markers, polyline, marker2, markers2, polyline2;
//let latLngs = [];
const map2 = L.map("mapid2").setView([51.505, -0.09], 13);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map2);

markers = [];
marker = L.marker([51.505, -0.09]).addTo(map2);
polyline = L.polyline([], {
  color: "#A9CCE3"
}).addTo(map2);

markers2 = [];
marker2 = L.marker([51.505, -0.09]).addTo(map2);
polyline2 = L.polyline([], {
  color: "#A9CCE3"
}).addTo(map2);

$("#Car1").click(function() {
  const timeMargin = {
    initTime: new Date($("#init-date").val()).getTime(),
    finalTime: new Date($("#final-date").val()).getTime(),
    carId: "mar_car"
  };
  $.post("/historical", timeMargin).done(function(data) {
    console.log(data);

    marker.setLatLng([51.505, -0.09]);
    map2.removeLayer(polyline);
    for (let i = markers.length - 1; i >= 0; i--) {
      map2.removeLayer(markers[i]);
      markers.pop();
    }
    if (data.length != 0) {
      let latlngs = [];
      data.forEach(function(row) {
        let lastPos = latlngs[latlngs.length - 1];
        if (
          latlngs.length === 0 ||
          (row.latitude != lastPos[0] || row.longitude != lastPos[1])
        ) {
          latlngs.push([row.latitude, row.longitude]);
          markers.push(
            L.circleMarker([row.latitude, row.longitude], 5)
              .addTo(map2)
              .setRadius(1)
          );
        }
      });
      console.log(latlngs);

      polyline = L.polyline(latlngs, {
        color: "#A9CCE3"
      }).addTo(map2);
      console.log(polyline);

      marker.setLatLng(latlngs[latlngs.length - 1]);
      map2.setView(latlngs[latlngs.length - 1]);
      map2.setZoom(18);
    } else {
      alert("No existen registros en el rango de fechas solicitado ");
    }
  });
});

$("#Car2").click(function() {
  const timeMargin = {
    initTime: new Date($("#init-date").val()).getTime(),
    finalTime: new Date($("#final-date").val()).getTime(),
    carId: "nico_car"
  };
  $.post("/historical", timeMargin).done(function(data) {
    marker2.setLatLng([51.505, -0.09]);
    map2.removeLayer(polyline2);
    for (let i = markers2.length - 1; i >= 0; i--) {
      map2.removeLayer(markers2[i]);
      markers2.pop();
    }
    if (data.length != 0) {
      let latlngs = [];
      data.forEach(function(row) {
        let lastPos = latlngs[latlngs.length - 1];
        if (
          latlngs.length === 0 ||
          (row.latitude != lastPos[0] || row.longitude != lastPos[1])
        ) {
          latlngs.push([row.latitude, row.longitude]);
          markers2.push(
            L.circleMarker([row.latitude, row.longitude], 5)
              .addTo(map2)
              .setRadius(1)
          );
        }
      });
      console.log(latlngs);

      polyline2 = L.polyline(latlngs, {
        color: "#f5f5f5"
      }).addTo(map2);
      console.log(polyline);

      marker2.setLatLng(latlngs[latlngs.length - 1]);
      map2.setView(latlngs[latlngs.length - 1]);
      map2.setZoom(18);
    } else {
      alert("No existen registros en el rango de fechas solicitado ");
    }
  });
});
