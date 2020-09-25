
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
