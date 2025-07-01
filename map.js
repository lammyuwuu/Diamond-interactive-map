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