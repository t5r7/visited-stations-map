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
			[lat, lon], { icon: getIcon(type, brand, name) }
		).bindPopup(`
			<b class="popup-name">${name}</b>
			<div class="popup-brand"><span class="popup-brand-icon ${clean(brand)}"></span> <span class="popup-brand-name">${brand}</span></div>
			<span class="popup-type ${clean(type)}">${type}</span>
			<span class="popup-visited">first visited<br>${firstVisitDate}</span>
		`);

		// add the marker to the layer
		groups[type].addLayer(marker);

		// add the marker to the bounds
		bounds.extend([lat, lon]);
	}

	document.querySelectorAll(".station").forEach((e) => {
		// resize icons to size set in JS
		e.style.setProperty("--icon-size", iconSize + "px");
		e.style.setProperty("--border-size", iconSize / 8 + "px");
		
		// this is a hacky way of passing a title through
		// we cannot use .element() because we haven't added the marker to the map yet
		const titleClass = Array.from(e.classList).find(c => c.startsWith("title-"));
		if(titleClass) e.title = titleClass.replace("title-", "").replace(/-/g, " ").replace(/(DASHGOESHERE)/g, "-");
	});

	// add layer control
	L.control.layers(null, groups).addTo(map);

	// fit map to bounds, with animation and padding
	map.fitBounds(bounds, { animate: true, duration: 5, easeLinearity: 0.5, padding: [50, 50] });
}


function getIcon(type, brand, title) {
	let titleClass = title ? `title-${clean(title, true)}` : "";

	return L.divIcon({
		className: `station ${clean(type)} ${clean(brand)} ${titleClass}`,

		iconSize: [iconSize, iconSize],
		iconAnchor: [iconSize / 2, iconSize / 2],
		popupAnchor: [0, 0],
	});

}

function clean(string, isTitle) {
	// isTitle will only remove spaces (and will keep dashes)
	// otherwise, swap all non-alphanumeric characters and make lowercase

	return isTitle ? string.replace(/-/g, "DASHGOESHERE").replace(/ /g, "-") : string.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");
}