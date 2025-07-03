
// initialize the map on the "map" div with a given center and zoom
let map = L.map('map', {
    center: [51.574349, -1.310892],
    zoom: 17.4
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let baseOver = 'img/BaseOver.png'
let baseUnder = 'img/BaseUnder.png'
let imageBounds = [[51.57168183170403, -1.3173294067382815], [51.57701619673675, -1.304454803466797]];
L.imageOverlay(baseOver, imageBounds, {opacity:1, zIndex:3}).addTo(map);
L.imageOverlay(baseUnder, imageBounds, {opacity:1, zIndex:2}).addTo(map);



// // Adding marker/ circle into map

// let marker = L.marker([51.574349, -1.310892]).addTo(map);

// let circle = L.circle([51.574349, -1.310892], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 50
// }).addTo(map);


// fetching beamlines coordinates from Diamond provided json file
// then add marker for each beamline

let beamCoordinates={}

fetch('resources/beamlines_data.json')
.then((response) => response.json())
.then((bGroups) => {
    
    let overlayMaps = {}
    for (const group of bGroups) {
        let thesebeamlines = L.layerGroup()
        for (const beam of group["beamlines"]){

            // create object for later use - to find nearest beamline
            let coordinates=beam["position"]
            let beamlineName = beam["name"]
            beamCoordinates[beamlineName] = coordinates
            console.log(beamCoordinates)

            var markericon = new L.Icon({
                iconUrl: group["markerColour"],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                zIndex: 1
            });
            let marker = L.marker(coordinates, {icon: markericon}).addTo(thesebeamlines);
            marker.bindPopup(`
                <div style="background-image: url(${group["icon"]}); background-size: cover; background-repeat: no-repeat; background-position: center">
                    <h1>${beam.name}</h1>
                    <p class="beam-description">${beam.description}<p>
                    <a href="${beam.url}" target="-blank">Learn more</a>
                </div>
                <style>
                    .leaflet-popup-content-wrapper {
                        background-color:rgb(222, 222, 222)
                    }
                </style>
                `).openPopup();
            // let circle = L.circle(coordinates, {
            //     color: 'red',
            //     fillColor: '#f03',
            //     fillOpacity: 0.5,
            //     radius: 25
            // }).addTo(map);
            
        }
        thesebeamlines.addTo(map)
        overlayMaps[group["name"]]=thesebeamlines
        map["layers"] = group
        //console.log(overlayMaps)
    }
    L.control.layers(overlayMaps).addTo(map);
    
})

// locate the user
map.locate({watch: true});

// could use map.stopLocate() later to stop locating continuously

// make user icon
var userIcon = new L.Icon({
    iconUrl: 'https://static.thenounproject.com/png/611348-200.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [40, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    iconAnchor: [20, 30]
})

// let userIcon = L.layerGroup(); // this is prob where it goes wrong :3 
// let overlayIcons={};

// overlayIcons[icons]=userIcons
// L.control.layers(overlayIcons).addTo(map);


// create markers first

let lat=[0,0]
let radius=0

let userMarker = L.marker(lat, {icon: userIcon}).addTo(map).setZIndexOffset(1000)
let userCircle = L.circle(lat, radius).addTo(map);

// if location is found, show accuracy
function onLocationFound(e) {
    var radius = e.accuracy;
    radius.toPrecision(2); //round to 2sf

    let lat = e.latlng;
    userMarker.setLatLng(lat);

    userMarker.bindPopup("You are within " + radius + " meters from this point").openPopup();

    userCircle.setLatLng(lat);
    userCircle.setRadius(radius)
}

map.on('locationfound', onLocationFound)

// if location not found, output error message
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);



// -- create button for finding the nearest beamline -- //

// calculating nearest beamline
findNearestBeamline = function (lat, beamCoordinates) {
    let minDistance = Number.MAX_VALUE
    let nearestBeamline = ""
    for ([beamlineName, coordinates] in Object.entries(beamCoordinates)) {
            currentDistance = distance(lat, coordinates)
            if (currentDistance <= minDistance) {
                minDistance = currentDistance
                nearestBeamline = beamlineName
            }
    }
    return (minDistance, nearestBeamline)
}

let nearestButton = L.control({position: "bottomleft"})

nearestButton.onAdd = function () {
    let button = L.DomUtil.create("div")
    button.innerHTML = "<button>Nearest beamline to you</button>"
    button.firstChild.addEventListener("click", findNearestBeamline)
    return button;
}

nearestButton.addTo(map)


