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

		const marker = L.marker(
			[lat, lon], { icon: getIcon(type, brand) }
		).bindPopup(
			`<b>${name}</b><br>${type} (${brand})<br>${firstVisitDate}`
		).addTo(map);
	}
}

function getIcon(type, brand) {
	const typeClean = type.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");
	const brandClean = brand.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");

	console.log(typeClean, brandClean);

	return L.divIcon({
		className: `station ${typeClean} ${brandClean}`,

		html: `<span class="icon"></span>`,

		iconSize: [16, 16],
		iconAnchor: [8, 8],
		popupAnchor: [0, 8]
	});

}