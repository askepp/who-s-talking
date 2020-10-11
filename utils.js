
/**
 * Hnadles download of chart png and CSV
 */
function download(url, ext) {
	var currentdate = new Date(); 
	var fileName = currentdate.getFullYear() + ""
		+ mapTwoDigits(currentdate.getMonth()+1)  + "" 
		+ mapTwoDigits(currentdate.getDate()) + "-"  
		+ mapTwoDigits(currentdate.getHours()) + ""  
		+ mapTwoDigits(currentdate.getMinutes()) + "" 
		+ mapTwoDigits(currentdate.getSeconds());

	var downloadLink = document.createElement("a");
	downloadLink.href = url;
	downloadLink.download = fileName + "." + ext;

	// Actually download
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}


/**
 * Encodes to base64 a list of timers.
 */
function timersToURL(timers) {
	var data = Object.values(timers).map(function (item) {
		return {
			name: item.name,
			clock: item.get_clock(),
		}
	});

	return encodeURIComponent(btoa(JSON.stringify(data)));
}


/**
 * Decodes a base64 string representation of timers.
 */
function timersFromURL(encodedString) {
	var data = atob(decodeURIComponent(encodedString));
	return JSON.parse(data);
}