// get the map going
let map = L.map("map", {
	center: [52.437, -1.649],
	zoom: 6
});

let bounds = L.latLngBounds();
let groups = [];
let markers = [];

const extraAtts = ` |
made by <a href="https://tomr.me">tom</a> &bull;
<a href="https://github.com/itsmeimtom/station-mapper">about &amp; source</a>
`;

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: '© OpenStreetMap'
// }).addTo(map);

L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', { attribution: `tiles by <a href="https://carto.com/">Carto</a>${extraAtts}` }).addTo(map);;