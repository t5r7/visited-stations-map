let iconSize = 18;

async function parseLines(text) {
	// hacky but we need to wait for this to finish
	await prepareSubdivisions();

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

		const sub = getSub(country);
		const countryCode = sub.country;
		const subdivision = sub.subdivision;
		const flagURL = sub.flagURL;

		if(!groups[type]) groups[type] = new L.LayerGroup().addTo(map);
		map.layers = groups;
		
		const marker = L.marker(
			[lat, lon], { icon: getIcon(type, brand, name) }
		).bindPopup(`
			<b class="popup-name">${name}<span class="popup-crs">${crs ? crs : ""}</span></b>
			
			<div class="popup-location"><span title="${countryCode}" class="popup-location-flag" style="background-image: url('${flagURL}')"></span> <span class="popup-location-name">${subdivision}</span></div>

			<div class="popup-brand"><span class="popup-brand-icon ${clean(brand)}"></span> <span class="popup-brand-name">${brand}</span></div>

			<span class="popup-type ${clean(type)}">${type}</span>
			
			<span class="popup-visited">
				first visited<br>
				${getRelativeDate(firstVisitDate) ? `${getRelativeDate(firstVisitDate)}, ${formatDate(firstVisitDate)}` : formatDate(firstVisitDate)}
			</span>
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

// copilot wrote this function!!
function getRelativeDate(date) {
	const today = new Date();
	const dateObj = new Date(date);

	if(isNaN(dateObj)) return false;
	
	const diff = today - dateObj;

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const months = Math.floor(days / 31);
	const years = Math.floor(months / 12);

	if(years > 0) {
		return `${years} year${years == 1 ? "" : "s"} ago`;
	} else if(months > 0) {
		return `${months} month${months == 1 ? "" : "s"} ago`;
	} else if(days > 0) {
		return `${days} day${days == 1 ? "" : "s"} ago`;
	} else {
		return "today";
	}
}

// chatgpt wrote this one!
function formatDate(inputDate) {
	// Create a Date object from the inputDate string
	const date = new Date(inputDate);

	// Check if the date is valid
	if (isNaN(date.getTime())) {
		return inputDate;
	}

	// Define the weekday and month names
	const weekdayNames = [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
	];
	const monthNames = [
		"Jan", "Feb", "Mar",
		"Apr", "May", "Jun",
		"Jul", "Aug", "Sep",
		"Oct", "Nov", "Dec"
	];

	// Extract the weekday, day, month, and year
	const weekday = weekdayNames[date.getDay()];
	const day = date.getDate();
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();

	// Format the date string
	const formattedDate = `${weekday}, ${day} ${month} ${year}`;

	return formattedDate;
}

// Example usage:
const inputDate = "2023-09-04"; // Replace with your input date string
const formatted = formatDate(inputDate);
console.log(formatted); // Output will be "Mon, 4 Sep 2023" for this example date



function clean(string, isTitle) {
	// isTitle will only remove spaces (and will keep dashes)
	// otherwise, swap all non-alphanumeric characters and make lowercase

	return isTitle ? string.replace(/-/g, "DASHGOESHERE").replace(/ /g, "-") : string.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");
}