var editTimeout = 0;
var instances = {};
var instance_count = 0;
var timer_id = 0;

var Stopwatch = function(elem, options) {
	var timer = createTimer(),
		nms = createname(),
		elemChilds = createElements(),
		startButton = createButton("start", start),
		stopButton = createButton("stop", stop),
		resetButton = createButton("reset", reset),
		offset,
		clock,
		interval;
	// default options
	options = options || {};
	options.delay = options.delay || 1;
	// append elements   
	//elem.append(nms);
	elem.append(elemChilds);
	//elem.append(startButton);
	//elem.append(stopButton);
	//elem.append(resetButton);
	// initializ
	reset();
	
	// private functions
	function createElements() {
		var sp = $("<a>")
			.attr('href', "javascript:void(0)")
			.addClass('stopwatch-link');
		sp.append(nms);
		sp.append(timer);
		// sp.append(
		// 	$('<span>').addClass('move')
		// );
		return sp;
	}

	function createTimer() {
		var self = this;
		var sp = document.createElement("span");
		sp.className = "timel";
		return sp;
	}

	function createname() {
		var nm = document.createElement("span");
		nm.className = "name";
		nm.innerHTML = "Name";
		return nm;
	}
	// function sam(event) {
	//    stop();
	//    event.preventDefault();
	//  };
	function createButton(action, handler) {
		var a = document.createElement("a");
		a.href = "#" + action;
		a.innerHTML = action;
		a.addEventListener("click", function(event) {
			handler();
			event.preventDefault();
		});
		return a;
	}

	function get_clock() {
		return clock;
	}

	function start() {
		if (!interval) {
			offset = Date.now();
			interval = setInterval(update, options.delay);
		}
	}

	function stop() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		} 
		// else if (!interval) {
		// 	offset = Date.now();
		// 	interval = setInterval(update, options.delay);
		// }
	}

	function reset() {
		stop();
		clock = 0;
		render(0);
	}

	function update() {
		clock += delta();
		render();
	}

	function mili(millis) {
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);

		if(minutes.length < 2) {
			minutes = "0" + minutes; 
		}
		if(seconds.length < 2) {
			seconds = "0" + seconds; 
		}

		return minutes + ":" + seconds;
	}

	function tomiliseconds(hrs,min,sec) {
	    return((hrs*60*60+min*60+sec)*1000);
	}

	function render() {
		// SINGAL TIMER
		var timerValue = Math.floor(clock / 1000);
		var seconds = timerValue % 60;

		timerValue = Math.floor(timerValue / 60);
		var minutes = timerValue % 60;

		timerValue = Math.floor(timerValue / 60);
		var hours = timerValue % 60;

		if(minutes < 10 || minutes.length < 2) {
			minutes = "0" + minutes; 
		}
		if(seconds < 10 || seconds.length < 2) {
			seconds = "0" + seconds; 
		}
		if((hours > 0) && (hours < 10 || hours.length < 2)) {
			hours = "0" + hours; 
		}
		
		var timer_str = minutes + ":" + seconds;
		if(hours) {
			timer_str = hours + ":" + time_str;
		}

		timer.innerHTML = timer_str;

		// TOTAL TIMER
		var total_clock = 0;
		$.each(instances, function(key, instance){
			var timer_array = instance.elem.find('.timel').text().split(':');

			var i_hours = 0;
			var i_minutes = 0;
			var i_seconds = 0;
			if(timer_array.length > 2) {
				i_hours = parseInt(timer_array[0]);
				i_minutes = parseInt(timer_array[1]);
				i_seconds = parseInt(timer_array[2]);
			}
			else {
				i_minutes = parseInt(timer_array[0]);
				i_seconds = parseInt(timer_array[1]);
			}
			var miliseconds = tomiliseconds(i_hours, i_minutes, i_seconds);
			// console.log(i_minutes + ":" + i_seconds);
			// console.log("Current time clock is:" + miliseconds + ' for timer ' + i);
			total_clock += miliseconds;
		});

		var timerValue = Math.floor(total_clock / 1000);
		var seconds = timerValue % 60;

		timerValue = Math.floor(timerValue / 60);
		var minutes = timerValue % 60;

		timerValue = Math.floor(timerValue / 60);
		var hours = timerValue % 60;

		if(minutes < 10 || minutes.length < 2) {
			minutes = "0" + minutes; 
		}
		if(seconds < 10 || seconds.length < 2) {
			seconds = "0" + seconds; 
		}
		if((hours > 0) && (hours < 10 || hours.length < 2)) {
			hours = "0" + hours; 
		}
		
		var timer_str_total = minutes + ":" + seconds;
		if(hours) {
			timer_str_total = hours + ":" + time_str;
		}

		$('h1').html(timer_str_total);
	}

	function delta() {
		var now = Date.now(),
			d = now - offset;
		offset = now;
		return d;
	}
	// public API
	this.start = start;
	this.stop = stop;
	this.reset = reset;
	this.get_clock = get_clock;
	this.timer_id = timer_id;
	this.elem = elem;

	timer_id++;
};

function mapTwoDigits(number) {
	if(number < 10 || number.length < 2) {
		number = "0" + number;
	}
	return number;
}

function exportCSV(table) {
  var titles = [];
  var data = [];

  /*
   * Get the table headers, this will be CSV headers
   * The count of headers will be CSV string separator
   */
  table.find('th').each(function() {
    titles.push($(this).text());
  });

  /*
   * Get the actual data, this will contain all the data, in 1 array
   */
  table.find('td').each(function() {
    data.push($(this).text());
  });
  
  /*
   * Convert our data to CSV string
   */
  var CSVString = prepCSVRow(titles, titles.length, '');
  CSVString = prepCSVRow(data, titles.length, CSVString);

  /*
   * Make CSV downloadable
   */
	var currentdate = new Date(); 
	var fileName = currentdate.getFullYear() + ""
	+ mapTwoDigits(currentdate.getMonth()+1)  + "" 
	+ mapTwoDigits(currentdate.getDate()) + "-"  
	+ mapTwoDigits(currentdate.getHours()) + ""  
	+ mapTwoDigits(currentdate.getMinutes()) + "" 
	+ mapTwoDigits(currentdate.getSeconds());

  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", CSVString]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = fileName + ".csv";

  /*
   * Actually download CSV
   */
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
/*
* Convert data array to CSV string
* @param arr {Array} - the actual data
* @param columnCount {Number} - the amount to split the data into columns
* @param initial {String} - initial string to append to CSV string
* return {String} - ready CSV string
*/
function prepCSVRow(arr, columnCount, initial) {
  var row = ''; // this will hold data
  var delimeter = ','; // data slice separator, in excel it's `;`, in usual CSv it's `,`
  var newLine = '\r\n'; // newline separator for CSV row

  /*
   * Convert [1,2,3,4] into [[1,2], [3,4]] while count is 2
   * @param _arr {Array} - the actual array to split
   * @param _count {Number} - the amount to split
   * return {Array} - splitted array
   */
  function splitArray(_arr, _count) {
    var splitted = [];
    var result = [];
    _arr.forEach(function(item, idx) {
      if ((idx + 1) % _count === 0) {
        splitted.push(item);
        result.push(splitted);
        splitted = [];
      } else {
        splitted.push(item);
      }
    });
    return result;
  }
  var plainArr = splitArray(arr, columnCount);
  // don't know how to explain this
  // you just have to like follow the code
  // and you understand, it's pretty simple
  // it converts `['a', 'b', 'c']` to `a,b,c` string
  plainArr.forEach(function(arrItem) {
    arrItem.forEach(function(item, idx) {
      row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
    });
    row += newLine;
  });
  return initial + row;
}

function add_ins(element) {
	var instance = new Stopwatch( element );
	instances[instance_count] = instance;

	element.attr('data-instance', instance_count);
	instance_count++;

	element.find('.name').html('Timer ' + instance_count);

	$('.draggable').draggable({
		start: function(event, ui) {
			if(editTimeout) {
				clearTimeout(editTimeout);
			}
	    }
	});
}

function create_ins() {
	var $sm = $('<div>')
		.addClass('stopwatch basicx draggable')
		.insertBefore('.stopwatch-new');

	// ADD TO INSTANCES
	add_ins($sm);
	// $sm.trigger('click');

	// $('#timers').sortable('refresh')

	if(Object.keys(instances).length >= 10) {
		$('.stopwatch-new').hide();
		return;
	}
}


function showEditDialog() {
	$('#timer_name_input').val(editingElement.find('.name').text());
	$("#editNameModel").modal();
}

function updateExportTable() {
	var a = $(".name");
	var j = $(".timel");
	var b = [];
	var s;
	var ti;
	for (var i = 0; i < a.length; i++) {
		b = a[i].innerText;
		s += "<tr><td>" + a[i].innerText + "</td><td>" + j[i].innerText + "</td></tr>"
	}
	s += "<tr><td>Total</td><td>" + $('h1').text() + "</td></tr>"
	$('.sl').html("<tr><th>Name</th><th>Time</th></tr>" + s);
}

$('.basic').each(function(i, element){
	add_ins( $(this) );
});

$(function() {
	// $( "#timers" ).sortable({
	// 	items : '.stopwatch',
	// 	// handle: '.move',
	// 	start: function(event, ui) {
	// 		if(editTimeout) {
	// 			clearTimeout(editTimeout);
	// 		}
	//     }
	// });
	// $( "#timers" ).disableSelection();
	// $( ".stopwatch" ).draggable({
	// 	// handle: '.move',
	// 	start: function(event, ui) {
	// 		if(editTimeout) {
	// 			clearTimeout(editTimeout);
	// 		}
	//     }
	// });
});

$(document).on("click", ".stopwatch-link", function(e) {
	e.preventDefault();

	// stop();
	$.each(instances, function(key, instance){
		instance.stop();
	});

	var stopwatch_elem = $(this).closest('.stopwatch');
	var instance_id = stopwatch_elem.attr('data-instance');
	var instance = instances[instance_id];

	if (stopwatch_elem.hasClass('green')) {
		stopwatch_elem.removeClass("green");
		instance.stop();
	} else {
		$('.stopwatch').removeClass("green");
		stopwatch_elem.addClass("green");
		instance.start();
	}

	clearTimeout(editTimeout);
});

// $(document).on("click touchstart", ".stopwatch-new", function(e) {
// 	e.preventDefault();

// 	// stop();
// 	create_ins();
// });

var editingElement = null;
$(document).on('mousedown', '.stopwatch-link', function(e) {
	e.preventDefault();

	editTimeout = setTimeout(showEditDialog, 1000);
	editingElement = $(this).closest('.stopwatch');
	$(this).closest('.stopwatch').addClass('hover-element');
})
$(document).on('mouseup mouseleave touchend', '.stopwatch-link', function(e) {
	e.preventDefault();

	$(this).closest('.stopwatch').removeClass('hover-element');
	clearTimeout(editTimeout);
});

$(document).on("click", "#change_timer_name", function() {
	if($('#timer_name_input').val() == "") {
		$('.timer_name_input_error').show();
	}
	else {
		$('.timer_name_input_error').hide();
		editingElement.find('.name').html( $('#timer_name_input').val() );
		$('#editNameModel').modal('hide');
	}
});

$(document).on("click", "#reset_timer_btn", function() {
	var instance_id = editingElement.attr('data-instance');
	var instance = instances[instance_id];

	editingElement.removeClass("green");
	instance.reset();
	$('#editNameModel').modal('hide');
});

$(document).on('click', '#remove_timer_btn', function () {
	var instance_id = editingElement.attr('data-instance');
	delete instances[instance_id];
	
	if(Object.keys(instances).length < 10) {
		$('.stopwatch-new').show();
	}

	$(editingElement).remove();
	$('#editNameModel').modal('hide');
});

$("#doExport").click(function(e) {
	updateExportTable();
	exportCSV( $('.export table') );
	// window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('.export').html()));
	e.preventDefault();
});

$("#dorefresh").click(function(e) {
	location.reload();
});

$('#refresh').click(function() {
	$("#refreshModel").modal();
});


$('#help').click(function() {
	$("#helpModel").modal();
});