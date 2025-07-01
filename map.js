// let var1 = "hello"
// const var2 = "bye"
// let name = "Jason"
// let list=[1,2,3]

// function helloWorld(name) {
    
//     {var word = "diamond"}
//     alert(word)
// }

// function test() {
//     for(let val in list) {
//         console.log(i)
//     }
//     console.log(i)
// }

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [51.574349, -1.310892],
    zoom: 17.4
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var baseOver = 'img/BaseOver.png'
var baseUnder = 'img/BaseUnder.png'
var imageBounds = [[51.57168183170403, -1.3173294067382815], [51.57701619673675, -1.304454803466797]];
L.imageOverlay(baseOver, imageBounds, {opacity:1, zIndex:3}).addTo(map);
L.imageOverlay(baseUnder, imageBounds, {opacity:1, zIndex:2}).addTo(map);



// // Adding marker/ circle into map

// var marker = L.marker([51.574349, -1.310892]).addTo(map);

// var circle = L.circle([51.574349, -1.310892], {
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
    beamlines=[]
    for (const group of bGroups) {
        for (const beam of group["beamlines"]){
            coordinates=beam["position"]
            //beamlines.push(coordinates)
            var marker = L.marker(coordinates).addTo(map);
            // var circle = L.circle(coordinates, {
            //     color: 'red',
            //     fillColor: '#f03',
            //     fillOpacity: 0.5,
            //     radius: 25
            // }).addTo(map);
        }
    }
    console.log(beamlines)
})


