

async function addConnectingLines() {
	document.getElementById("connecting-lines").remove();

	const stationPairs = await calcStationPairs();

	for (pair of stationPairs) {
		const origin = pair[0];
		const destination = pair[1];

		const originLatLon = await crsToLatLon(origin);
		const destinationLatLon = await crsToLatLon(destination);

		if (!originLatLon || !destinationLatLon) continue;

		const line = L.polyline([originLatLon, destinationLatLon], {
			color: "#fff",
			weight: 4,
			opacity: 0.5,
			dashArray: "5, 10"
		}).addTo(map).bindPopup(`${crsToName(origin)} to ${crsToName(destination)}`);
	}
}

async function calcStationPairs() {
	const rmCSV = await fetch("line-rendering/rm-export.csv"); // export is modified to only have origin_name and destination_name columns
	const rmText = await rmCSV.text();

	const rmLines = rmText.split("\n");

	let pairs = [];

	for (line of rmLines) {
		const cols = line.split(",");
		const origin = cols[0];
		const destination = cols[1];

		pairs.push([nameToCRS(origin), nameToCRS(destination)]);
	}


	// copilot and chatgpt wrote this nice filtering stuff :)

	// only keep one of each pair (eg, only one of [BHM, EUS] and [EUS, BHM])
	pairs = pairs.filter((pair, i) => {
		const reversedPairIndex = pairs.findIndex(
			(p, j) => j !== i && p[0] === pair[1] && p[1] === pair[0]
		);
		return reversedPairIndex === -1;
	});
	
	// remove any other duplicates
	pairs = pairs.filter((pair, i) => pairs.findIndex(p => p[0] === pair[0] && p[1] === pair[1]) === i);

	return pairs;
}

function nameToCRS(name) {
	if (!name) return false;

	name = name.toLowerCase().trim();

	// remove first and last (the quotes)
	// name = name.slice(1, -1)

	// two hardcoded special cases
	if (name == "edinburgh") name = "edinburgh waverley";
	if (name == "university") name = "university (birmingham)";
	if (name == "london waterloo east") name = "london waterloo (east)";

	const station = stations.find(s => s.stationName.toLowerCase() === name);

	if (!station) {
		console.error(`Could not find station ${name}`);
		return false;
	}

	return station.crsCode;
}

function crsToLatLon(crs) {
	if(!crs) return false;

	const station = stations.find(s => s.crsCode === crs);

	if(!station) {
		console.error(`Could not find CRS ${crs}`);
		return false;
	}

	return [station.lat, station.long];
}

function crsToName(crs) {
	if(!crs) return false;

	const station = stations.find(s => s.crsCode === crs);

	if(!station) {
		console.error(`Could not find CRS ${crs}`);
		return false;
	}

	return station.stationName;
}