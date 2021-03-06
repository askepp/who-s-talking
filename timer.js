var editTimeout = 0;
var instances = {};
var instance_count = 0;
var editingElement = null;
var colorsPool = COLORS.slice(); // copy of COLORS


var Stopwatch = function(elem, name, defaultClock, options) {
	this.name = name;
	this.color = colorsPool.shift();

	var timer = createTimer(),
		nms = createname(),
		elemChilds = createElements(),
		startButton = createButton("start", start),
		stopButton = createButton("stop", stop),
		resetButton = createButton("reset", reset),
		offset,
		clock = defaultClock || 0,
		interval;
	// default options
	options = options || {};
	options.delay = options.delay || 10;
	// append elements   
	//elem.append(nms);
	elem.append(elemChilds);
	//elem.append(startButton);
	//elem.append(stopButton);
	//elem.append(resetButton);
	// initializ
	reset(defaultClock);
	
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

	function reset(value) {
		stop();
		clock = value || 0;
		render();
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
		if (hours) {
			timer_str = hours + ":" + timer_str;
		}

		timer.innerHTML = timer_str;

		// TOTAL TIMER
		var total_clock = 0;
		$.each(instances, function(key, instance) {
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
			timer_str_total = hours + ":" + timer_str_total;
		}

		var oldValue = $('h1').html();
		if (oldValue !== timer_str_total) {
			$('h1').html(timer_str_total);
			$('#share').attr('href', '?r=' + timersToURL(instances));
		}
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
	this.elem = elem;
	this.render = render;
};

function mapTwoDigits(number) {
	if(number < 10 || number.length < 2) {
		number = "0" + number;
	}
	return number;
}


function add_ins(element, name, defaultClock) {
	var name = name || ('Timer ' + (instance_count + 1));
	var instance = new Stopwatch(element, name, defaultClock);
	instances[instance_count] = instance;

	element.attr('data-instance', instance_count);
	instance_count++;

	element.find('.name').html(name);

	$(element).css('background-color', instance.color);
	$('.draggable').draggable({
		start: function(event, ui) {
			if(editTimeout) {
				clearTimeout(editTimeout);
			}
	    }
	});

	return instance;
}

function create_ins(name, defaultClock) {
	var elem = $('<div>')
		.addClass('stopwatch basicx draggable')
		.insertBefore('.stopwatch-new');

	// ADD TO INSTANCES
	var item = add_ins(elem, name, defaultClock);
	// $sm.trigger('click');

	// $('#timers').sortable('refresh')

	if(Object.keys(instances).length >= 10) {
		$('.stopwatch-new').hide();
		return;
	}

	return item;
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

$(function() {
	var url = new URL(window.location.href);
	var encodedData = url.searchParams.get("r");
	if (encodedData) {
		var data = timersFromURL(encodedData);
		data.forEach(function (item) {
			console.log('Load', item.name, 'with', item.clock);
			var item = create_ins(item.name, item.clock);
			item.render(); // force re-render so total timer is updated
		});

	} else {
		create_ins();
	}
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

	if (stopwatch_elem.hasClass('active')) {
		stopwatch_elem.removeClass("active");
		instance.stop();
	} else {
		$('.stopwatch').removeClass("active");
		stopwatch_elem.addClass("active");
		instance.start();
	}

	clearTimeout(editTimeout);
});


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


$(document).on('click', '.stopwatch-new', function (e) {
	e.preventDefault();

	create_ins();
	updateChartDataset();
});

$(document).on("click", "#change_timer_name", function() {
	var newName = $('#timer_name_input').val().trim();

	if(newName === '') {
		$('.timer_name_input_error').show();
	}
	else {
		$('.timer_name_input_error').hide();

		var instance_id = editingElement.attr('data-instance');
		var instance = instances[instance_id];

		editingElement.find('.name').html(newName);
		instance.name = newName;

		$('#editNameModel').modal('hide');

		updateChartDataset();
	}
});

$(document).on("click", "#reset_timer_btn", function() {
	var instance_id = editingElement.attr('data-instance');
	var instance = instances[instance_id];

	editingElement.removeClass("active");
	instance.reset();
	$('#editNameModel').modal('hide');

	updateChartDataset();
});

$(document).on('click', '#remove_timer_btn', function () {
	var instance_id = editingElement.attr('data-instance');
	var instance = instances[instance_id];

	// add background color back to the pool
	colorsPool.push(instance.color);

	delete instances[instance_id];
	delete instance;
	
	if(Object.keys(instances).length < 10) {
		$('.stopwatch-new').show();
	}

	$(editingElement).remove();
	$('#editNameModel').modal('hide');

	updateChartDataset();
});

$("#doExport").click(function(e) {
	e.preventDefault();
	updateExportTable();
	exportCSV( $('.export table') );
	exportChart();
	// window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('.export').html()));
});

$("#dorefresh").click(function() {
	window.location.href =  window.location.href.split('?')[0];
});


$('#refresh').click(function() {
	$("#refreshModel").modal();
});


$('#help').click(function() {
	$("#helpModel").modal();
});

