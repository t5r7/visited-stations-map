// taken from https://github.com/itsmeimtom/speedtestdotnetcsvmap
function loadFile(e) {
	// https://usefulangle.com/post/193/javascript-read-local-file
	let file = e.files[0];

	let r = new FileReader();

	// file reading started
	r.addEventListener('loadstart', function () {
		console.info('reading file');
	});

	// file reading finished successfully
	r.addEventListener('load', function (read) {
		console.info('read file, processing');

		// contents of file in variable
		parseLines(read.target.result);
	});

	// file reading failed
	r.addEventListener('error', function () {
		return alert('error reading file, refresh and try again');
	});

	// file read progress 
	r.addEventListener('progress', function (e) {
		if (e.lengthComputable == true) {
			let pcRead = Math.floor((e.loaded / e.total) * 100);
			console.info(`reading file: ${pcRead}%`);
		}
	});

	r.readAsText(file);
}

async function loadGSheet() {
	document.getElementById("cover").style.pointerEvents = "none";
	document.getElementById("gsheet-load-link").innerText = "loading...";
	document.getElementById("gsheet-load-link").removeAttribute("href");

	const gSheetID = "1RD-5-8crKwORuKXBFUmFvfsBLY_4UsE08_duTvG-218";
	const gSheetUrl = `https://docs.google.com/spreadsheets/d/${gSheetID}/export?format=csv`;
	
	const response = await fetch(gSheetUrl);
	const text = await response.text();

	if(text) {
		parseLines(text);
		hideCover();
	} else {
		alert("error loading file, refresh and try again");
	}
}

if(window.location.hash == "#gsheet") {
	document.getElementById("usual-splash").style.display = "none";
	document.getElementById("gsheet-splash").style.display = "block";
	loadGSheet();
}

// nowhere else to put this
function hideCover() {
	const coverE = document.getElementById("cover");
	const mapE = document.getElementById("map");

	coverE.style.pointerEvents = "none";
	coverE.style.opacity = 0;
	mapE.classList.remove("blur");

	setTimeout(() => {
		coverE.remove();
	}, 1500);
}