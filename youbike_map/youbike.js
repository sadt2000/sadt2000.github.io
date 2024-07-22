const taipeiYoubikeData = "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";

// let map;
const map = L.map("map");
const markers = L.markerClusterGroup();
window.onload = function () {
  const center = [25.0415001, 121.5362220];
  const zoom = 13;
  initMap(center, zoom);//參數自己設計 可以傳 center zoom
  fetchYoubikeData()
    .then(data => {   
      clearMarkerGroup();
      const areagroup = groupArr(data, "sarea")   
      optionarea(areagroup);

      //fetch檔案 
      data.forEach(station => {
        renderingStationinfo(station);
        addMarker(station);

      });
      document.querySelector("#my_table").classList.remove("d-none");
      document.querySelector("#spinner").classList.add("d-none");

    })
}
//抓取點選的區域 
const areaname = document.querySelector("#area_name");
const areaddetail = document.querySelector("#aread_detail");//街道地址
areaname.addEventListener("change", () => {
  const selectedValue = areaname.options[areaname.selectedIndex].textContent; 
  if (selectedValue !== "請先選擇區域") {
    selectarea(selectedValue);
  }
})
areaddetail.addEventListener("change", () => {
  const selecteddetailValue = areaddetail.options[areaddetail.selectedIndex].textContent; 
  if (selecteddetailValue !== "請先選擇地點") {  
    selectareaddetail(selecteddetailValue);
  }
})
let selectdataTodetail;
//選擇區域
function selectarea(selectedValue) {
  fetchYoubikeData()
    .then(data => {
      selectdataTodetail = selectedValue;
      const selectdata = data.filter(item => item.sarea === selectedValue);
      const LatLong = data.find(item => item.sarea === selectedValue);
      optionareaddetail(selectdata);    
      clearMarkerGroup();
      document.querySelector("#data_rows").innerHTML = "";
      // fetch檔案 
      selectdata.forEach(station => {
        renderingStationinfo(station);
        addMarker(station);    
      });
      const selectLatLong = [LatLong.latitude, LatLong.longitude];
      const selectZoom = 12;
      initMap(selectLatLong, selectZoom);
    })
}
//選擇地點
function selectareaddetail(selecteddetailValue) {
  fetchYoubikeData()
    .then(data => { 
    //   const selectdetail = data.filter(item => item.sarea === selectdataTodetail);
      //找到站點
      const detailLatLong = data.find(item => item.sna === selecteddetailValue);   
      clearMarkerGroup();
      document.querySelector("#data_rows").innerHTML = "";
      // fetch檔案 
      renderingStationinfo(detailLatLong);
      addMarker(detailLatLong);
      const selectdetailLatLong = [detailLatLong.latitude, detailLatLong.longitude];
      const selectdetailZoom = 12;
      initMap(selectdetailLatLong, selectdetailZoom);
      map.flyTo(selectdetailLatLong, 18);
    })
}

//區域選單
function optionarea(area) {
  area.forEach(item => {
    const option = document.createElement("option");  
    option.textContent = `${item}`;
    option.value = item.value;
    areaname.append(option);
  })
}
const firstdetail = document.querySelector("#first_detail");
//街道選單
function optionareaddetail(detail) {
  areaddetail.innerHTML = "";
  areaddetail.append(firstdetail);
  detail.forEach(item => {
    const option = document.createElement("option");   
    option.textContent = `${item.sna}`;
    option.value = item.sna.value;
    areaddetail.append(option);
  })
}

//抓到的資料分區
function groupArr(sourceArr, propName) {
  return sourceArr.reduce((acc, curr) => {
    const groupingKey = curr[propName];
    if (!acc.includes(groupingKey)) {
      acc.push(groupingKey);
    }
    return acc;
  }, []);
}


function clearMarkerGroup() {
  if (markers) {
    markers.clearLayers();
  }
}
//map初始化
function initMap(LatLong, zoom) {   

  //設定圖資
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  map.setView(LatLong, zoom);
}

function addMarker(station) {
  const marker = L.marker([station.latitude, station.longitude]);

  marker.bindPopup(`<p>${station.sna}</p>剩餘/空位/總共:${station.available_rent_bikes}/${station.available_return_bikes}/${station.total}`);

  markers.addLayer(marker);
  map.addLayer(markers);
}

//撈出所有資料 Fn
function renderingStationinfo(station) {
  const tr = document.createElement("tr");
  const sareaTd = document.createElement("td");
  sareaTd.style.width = '92px';
  sareaTd.textContent = `${station.sarea}`;
  const stationNameTd = document.createElement("td");
  stationNameTd.textContent = `${station.sna}`;
  const infoTd = document.createElement("td");
  infoTd.textContent = `${station.available_rent_bikes}/${station.available_return_bikes}/${station.total}`;

  const mapTd = document.createElement("td");
  const mapicon = document.createElement("i");
  mapicon.classList.add("fa-solid", "fa-map-location-dot", "pe-pointer");
  mapTd.append(mapicon);
  const latLngTd = document.createElement("td");
  const latLngIcon = document.createElement("i");
  latLngTd.append(latLngIcon);
  latLngIcon.classList.add("fa-solid", "fa-circle-info");
  mapicon.addEventListener("click", () => {
    map.flyTo([station.latitude, station.longitude], 18);
  });
  latLngIcon.setAttribute("data-bs-toggle", "tooltip");
  latLngIcon.setAttribute("data-bs-title", `${station.latitude},${station.longitude}`);
  new bootstrap.Tooltip(latLngIcon);

  tr.append(sareaTd, stationNameTd, infoTd, mapTd, latLngTd)
  document.querySelector("#data_rows").append(tr);
}  
//fetch資料
function fetchYoubikeData() {
  return fetch(taipeiYoubikeData).then(res => res.json());
}


