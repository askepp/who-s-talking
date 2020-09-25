var chart;
var chartVisible = false;
var chartElement = document.getElementById('timers-chartjs');
var chartConfig = {
  type: 'doughnut',
  options: {
  	legend: {
  		position: 'right',
		labels: {
			fontColor: 'rgb(255, 255, 255)',
		}
  	},
  	tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
		        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
		        var total = meta.total;
		        var currentLabel = data.labels[tooltipItem.index];
		        var currentValue = dataset.data[tooltipItem.index];
		        var percentage = parseFloat((currentValue / total * 100).toFixed(1));
		        return currentLabel + ' (' + percentage + '%)';
            }
        }
    }
  },
  data: {
    labels: [], // will be update
    datasets: [
      {
        label: 'Project Timers',
        data: [], // will be updated
        backgroundColor: [
        	'rgb(219, 153, 90)',
        	'rgb(101, 66, 54)',
        	'rgb(214, 212, 160)',
        	'rgb(218, 118, 53)',
        	'rgb(226, 78, 27)',
        	'rgb(31, 32, 65)',
        	'rgb(17, 157, 164)',
        	'rgb(75, 63, 114)',
        	'rgb(25, 100, 126)',
        	'rgb(144, 194, 144)',
        ],
      }],
  },
};


/**
 * Update chart dataset with current timer values.
 */
function updateChartDataset() {
	chartConfig.data.labels = Object.values(instances).map(function (t) { return t.name; });
	chartConfig.data.datasets[0].data = Object.values(instances).map(function (t) { return t.get_clock(); });
	chart && chart.update();
}


/**
 * Schedules an update for the chart on the next animation frame.
 * If chart is hidden, update stops.
 */
function startChartAutoUpdate() {
	function step(timestamp) {
	  updateChartDataset();

	  if (chartVisible) { // repeat animation if chart is still visible
	    window.requestAnimationFrame(step);
	  }
	}

	window.requestAnimationFrame(step);
}


/**
 * Downloads a png file with the chart, only if the chart is visible.
 */
function exportChart() {
	if (chartVisible) {
		var chartBase64 = chartElement.toDataURL("image/png");

		// do the download
		download(chartBase64, 'png');
	}
}


/**
 * First initialization of the chart object.
 */
function initChart() {
	updateChartDataset();
	chart = new Chart(chartElement, chartConfig);
}


// initialize chart
initChart();

// handler for toggling the chart
$('#toggleChart').click(function () {
	chartVisible = !chartVisible;

	if (chartVisible) {
		$('.timers-chartjs-wrapper').show();
		startChartAutoUpdate();
	} else {
		$('.timers-chartjs-wrapper').hide();
	}
});
