
// initialize the map on the "map" div with a given center and zoom
let map = L.map('map', {
    center: [51.574349, -1.310892],
    zoom: 17.4
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// adding images of diamond onto map
let baseOver = 'img/BaseOver.png'
let baseUnder = 'img/BaseUnder.png'
let imageBounds = [[51.57168183170403, -1.3173294067382815], [51.57701619673675, -1.304454803466797]];
L.imageOverlay(baseOver, imageBounds, {opacity:1, zIndex:3}).addTo(map);
L.imageOverlay(baseUnder, imageBounds, {opacity:1, zIndex:2}).addTo(map);


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

            let markericon = new L.Icon({
                iconUrl: group["markerColour"],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                zIndex: 10
            });
            let marker = L.marker(beam["position"], {icon: markericon}).addTo(thesebeamlines);
            marker.bindPopup(`
                <div style="background-image: url(${group["icon"]}); background-size: cover; background-repeat: no-repeat; background-position: center">
                    <h1>${beam.name}</h1>
                    <p class="beam-description">${beam.description}</p>
                    <a href="${beam.url}" target="-blank">Learn more</a>
                </div>
                <style>
                    .leaflet-popup-content-wrapper {
                        background-color: #ffffb3;
                    }
                </style>
                `)//.openPopup();
            marker.openPopup();
            
            // create object for later use - to find nearest beamline
            let beamlineName = beam["name"]
            beamCoordinates[beamlineName] = marker
            
        }

        thesebeamlines.addTo(map)
        overlayMaps[group["name"]]=thesebeamlines
        map["layers"] = group
    }
    var layerControl = L.control.layers(overlayMaps).addTo(map);
    
})

// locate the user
map.locate({watch: true});

// could use map.stopLocate() later to stop locating continuously

// make user icon
let userIcon = new L.Icon({
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

let userpos = [0,0]
let radius=0

let userMarker = L.marker(userpos, {icon: userIcon}).addTo(map).setZIndexOffset(1000)
let userCircle = L.circle(userpos, radius).addTo(map);

// if location is found, show accuracy
function onLocationFound(e) {
    var radius = e.accuracy;

    userpos = e.latlng;
    userpos = [userpos.lat, userpos.lng] // for later - calculating distance

    userMarker.setLatLng(userpos);

    userMarker.bindPopup("You are within " + radius.toPrecision(2) + " meters from this point").openPopup();

    userCircle.setLatLng(userpos);
    userCircle.setRadius(radius)
}

map.on('locationfound', onLocationFound)

// if location not found, output error message
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);


function distance (co1, co2) {
    let d = Math.sqrt(((co1[0]-co2[0])**2)+((co1[1]-co2[1])**2))
    return d
}

// function distance([x1, y1], [x2, y2]) {
//     const dx = x2 - x1;
//     const dy = y2 - y1;
//     let d = Math.sqrt(dx * dx + dy * dy)
//     return d;
// }

// -- create button for finding the nearest beamline -- //

// calculating nearest beamline
function findNearestBeamline (e) {

    L.DomEvent.stopPropagation(e)
    // L.DomEvent.stop(e)
    // L.Util.stop(e)
    // L.DomEvent.preventDefault(e)

    let minDistance = Number.MAX_VALUE
    let nearestBeamline = ""
    let nearestMarker

    for ([beamlineName, marker] of Object.entries(beamCoordinates)) {
        let beampos = marker.getLatLng()
        let currentDistance = distance(userpos, [beampos.lat, beampos.lng])
        if (currentDistance <= minDistance) {
            minDistance = currentDistance
            nearestBeamline = beamlineName
            //nearestMarker = marker
        }
    }

    nearestMarker = beamCoordinates[nearestBeamline]
    
    var originalPopup = nearestMarker.getPopup().getContent()

    // overwrite the pop up of the nearest beamline using marker.setPopupContent
    nearestMarker.setPopupContent("I'm your nearest beamline!")

    nearestMarker.openPopup();
    setTimeout(() => {
        nearestMarker.closePopup();
        nearestMarker.setPopupContent(originalPopup);
    }, 5000)

    // nearestMarker.setPopupContent("I'm your nearest beamline!").addTo(map);
    // nearestMarker.setPopupContent("I'm your nearest beamline!").openOn(map);    
    
    // use setTimeout to return the content to original


}


let nearestButton = L.control({position: "bottomleft"})

nearestButton.onAdd = function () {
    let button = L.DomUtil.create("div")
    button.innerHTML = "<button>Find nearest beamline</button>"
    button.firstChild.addEventListener("click", () => findNearestBeamline(event))
    
    return button;
}

nearestButton.addTo(map)
