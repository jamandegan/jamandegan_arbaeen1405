const map = L.map("map", {
    zoomControl: false
}).setView([35.52198, 51.49887], 12);

L.control.zoom({
    position: "bottomleft"
}).addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
}).addTo(map);

const start = [35.44054, 51.57129];
const destination = [35.60342, 51.42645];

const mokebs = [
{
name:"هیئت امیرالمومنین (ع)",
type:"پذیرایی",
address:"مسیر پیاده روی",
services:"ظرفیت ۲۰۰۰ نفر"
},
{
name:"گروه جهادی شهید بقرایی",
type:"پذیرایی",
address:"مسیر پیاده روی",
services:"پذیرایی"
},
{
name:"حوزه امام حسین (ع)",
type:"خدماتی",
address:"مسیر پیاده روی",
services:"خدمات"
},
{
name:"گروه جهادی شهید کیوان تاجیک",
type:"پذیرایی",
address:"مسیر پیاده روی",
services:"پذیرایی"
},
{
name:"محبین الائمه",
type:"پذیرایی",
address:"مسیر پیاده روی",
services:"۵۰۰۰ نفر"
},
{
name:"خیریه حضرت زینب (س)",
type:"پذیرایی",
address:"مسیر پیاده روی",
services:"پذیرایی"
},
{
name:"هیئت اباعبدالله الحسین",
type:"پذیرایی",
address:"نزدیک حرم",
services:"۲۰۰۰۰ نفر"
}
];

let markers=[];

function markerColor(type){

switch(type){

case "فرهنگی":
return "#2196F3";

case "پذیرایی":
return "#22C55E";

case "خدماتی":
return "#FB8C00";

default:
return "#E53935";

}

}

function createIcon(color){

return L.divIcon({

className:"",

iconSize:[30,30],

iconAnchor:[15,30],

popupAnchor:[0,-28],

html:`
<div style="
width:30px;
height:30px;
background:${color};
border-radius:50% 50% 50% 0;
transform:rotate(-45deg);
border:3px solid white;
box-shadow:0 4px 12px rgba(0,0,0,.4);
position:relative;
">
<div style="
width:11px;
height:11px;
background:white;
border-radius:50%;
position:absolute;
left:50%;
top:50%;
transform:translate(-50%,-50%) rotate(45deg);
">
</div>
</div>
`

});

}

function show(list){

markers.forEach(m=>map.removeLayer(m));

markers=[];

list.forEach(item=>{

const marker=L.marker([item.lat,item.lng],{

icon:createIcon(markerColor(item.type))

}).addTo(map);

marker.bindPopup(`

<div style="min-width:210px">

<h3>${item.name}</h3>

<hr>

<p>📍 ${item.address}</p>

<p>🏷 ${item.type}</p>

<p>🍽 ${item.services}</p>

</div>

`);

markers.push(marker);

});

document.getElementById("mokebCount").innerText=list.length;

}

function filterMokeb(type){

document.querySelectorAll(".filters button").forEach(btn=>btn.classList.remove("active"));

event.target.classList.add("active");

if(type==="all"){

show(mokebs);

return;

}

show(

mokebs.filter(x=>x.type===type)

);

}

document.getElementById("search").addEventListener("input",function(){

const text=this.value.trim();

show(

mokebs.filter(x=>

x.name.includes(text)

)

);

});

L.marker(start).addTo(map).bindPopup("📍 مبدا");

L.marker(destination).addTo(map).bindPopup("🏁 حرم");

fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`)

.then(r=>r.json())

.then(data=>{

const route=data.routes[0].geometry.coordinates.map(c=>[c[1],c[0]]);

L.polyline(route,{

color:"#1976D2",

weight:7,

opacity:.9

}).addTo(map);

const points=[0.08,0.20,0.34,0.48,0.60,0.76,0.92];

mokebs.forEach((m,i)=>{

const p=route[Math.floor(route.length*points[i])];

m.lat=p[0]+(i%2?-.0006:.0006);

m.lng=p[1]+(i%2?.0006:-.0006);

});

show(mokebs);

map.fitBounds(route,{padding:[40,40]});

});

function showMyLocation(){

if(!navigator.geolocation){

alert("مرورگر پشتیبانی نمی‌کند");

return;

}

navigator.geolocation.getCurrentPosition(pos=>{

const lat=pos.coords.latitude;

const lng=pos.coords.longitude;

L.circleMarker([lat,lng],{

radius:8,

fillColor:"#1976D2",

color:"#fff",

weight:3,

fillOpacity:1

}).addTo(map)

.bindPopup("📍 موقعیت شما")

.openPopup();

map.flyTo([lat,lng],15);

const d=(map.distance([lat,lng],destination)/1000).toFixed(1);

document.getElementById("distanceInfo").innerText=d+" KM";

let nearest=99999;

let name="-";

mokebs.forEach(m=>{

const dis=map.distance([lat,lng],[m.lat,m.lng]);

if(dis<nearest){

nearest=dis;

name=m.name;

}

});

document.getElementById("nearbyCount").innerText=name;

});

}
