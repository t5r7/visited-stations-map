let iconSize = 18;

function parseLines(text) {
	const lines = text.split("\n");
	
	for(const l in lines) {
		if(l == 0) continue; // skip header
		const line = lines[l];

		const cols = line.split(",");

		const lat = cols[0];
		const lon = cols[1];
		const country = cols[2];
		const name = cols[3];
		const crs = cols[4];
		const type = cols[5];
		const brand = cols[6];
		const firstVisitDate = cols[7];

		if(!groups[type]) groups[type] = new L.LayerGroup().addTo(map);
		map.layers = groups;
		
		const marker = L.marker(
			[lat, lon], { icon: getIcon(type, brand) }
		).bindPopup(`
			<b class="popup-name">${name}</b>
			<div class="popup-brand"><span class="popup-brand-icon ${clean(brand)}"></span> <span class="popup-brand-name">${brand}</span></div>
			<span class="popup-type ${clean(type)}">${type}</span>
			<span class="popup-visited">first visited<br>${firstVisitDate}</span>
		`);

		groups[type].addLayer(marker);
	}

	// resize icons to size set in JS
	document.querySelectorAll(".station").forEach((e) => {
		e.style.setProperty("--icon-size", iconSize + "px");
		e.style.setProperty("--border-size", iconSize / 8 + "px");
	});

	// add layer control
	L.control.layers(null, groups).addTo(map);
}


function getIcon(type, brand) {
	return L.divIcon({
		className: `station ${clean(type)} ${clean(brand)}`,

		html: ``,

		iconSize: [iconSize, iconSize],
		iconAnchor: [iconSize / 2, iconSize / 2],
		popupAnchor: [0, 0],
	});

}

function clean(string) {
	return string.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");
}