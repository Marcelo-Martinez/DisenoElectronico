let marker, markers, polyline;
//let latLngs = [];
const map2 = L.map("mapid2").setView([51.505, -0.09], 13);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

markers = [];
marker = L.marker([51.505, -0.09]).addTo(map2);
polyline = L.polyline([], {
  color: "#A9CCE3"
}).addTo(map2);

$(".btn btn-info").click(function() {
  $(".info").text("");
  const timeMargin = {
    initTime: new Date($("#init-date").val()).getTime(),
    finalTime: new Date($("#final-date").val()).getTime()
  };

  $.get("/historical", timeMargin).done(function(data) {
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
          (row.lat != lastPos[0] || row.lon != lastPos[1])
        ) {
          latlngs.push([row.lat, row.lon]);
          markers.push(
            L.circleMarker([row.lat, row.lon], 5)
              .addTo(map2)
              .setRadius(1)
          );
        }
      });
      polyline = L.polyline(latlngs, {
        color: "#A9CCE3"
      }).addTo(map2);
      marker.setLatLng(latlngs[latlngs.length - 1]);
    } else {
      alert("No existen registros en el rango de fechas solicitado");
    }
  });
});
