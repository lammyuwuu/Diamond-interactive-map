// let let1 = "hello"
// const let2 = "bye"
// let name = "Jason"
// let list=[1,2,3]

// function helloWorld(name) {
    
//     {let word = "diamond"}
//     alert(word)
// }

// function test() {
//     for(let val in list) {
//         console.log(i)
//     }
//     console.log(i)
// }

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

fetch('resources/beamlines_data.json')
.then((response) => response.json())
.then((bGroups) => {
    console.log(bGroups)
    
    let beamlines=[]
    let overlayMaps = {}
    for (const group of bGroups) {
        //let thisgroup = []
        let thesebeamlines = L.layerGroup()
        for (const beam of group["beamlines"]){
            coordinates=beam["position"]
            //beamlines.push(coordinates)
            let marker = L.marker(coordinates).addTo(thesebeamlines);
            marker.bindPopup(`
                <h1>${beam.name}</h1>
                <p class="beam-description">${beam.description}<p>
                <a href="${beam.url}" target="-blank">Learn more</a>
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
        console.log(overlayMaps)
    }
    L.control.layers(overlayMaps).addTo(map);
    // layerControl.addOverlay(overlayMaps[group["name"]], group["name"]);

    
})


