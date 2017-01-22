'use strict';
(function(){

	var inputElement = document.getElementById('inputty');
	var chartElement = document.getElementById('chart');
	var chart;

	var getTones = function(success) {

		var inputValue = inputElement.value;
		var encodedValue = encodeURI(inputValue);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/tones?text=' + encodedValue);
		xhr.onload = function () {
			if (xhr.status === 200) {
		    	success(JSON.parse(xhr.responseText));
			}
		};
		xhr.send();
	};

	var drawChart = function(data) {

		Chart.defaults.global.defaultFontFamily = '"Roboto", sans-serif';

		chart = new Chart(chartElement, {
		    type: 'bar',
		    data: {
		        labels: ['Anger', 'Disgust', 'Fear', 'Joy', 'Sadness'],
		        datasets: [{
		            label: 'Score',
		            data: [0.25482, 0.345816, 0.121116, 0.078903, 0.199345],
		            backgroundColor: ['#ed796c', '#4f9cd0', '#f2c67d', '#80ced1', '#9ba6c6']
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		            	display: false,
		                ticks: {
		                    beginAtZero: true
		                },
		                gridLines: {
		                	display: false
		                }
		            }],
		            xAxes: [{
		                gridLines: {
		                	display: false
		                }
		            }]
		        },
		        legend: {
		        	display: false
		        },
		        animation: {
			        onComplete: function () {
		        		this.chart.canvas.classList.remove('animate-height');
				    }
		    	},
		    	tooltips: {
		    		cornerRadius: 0,
	                callbacks: {
	                    label: function(tooltipItems) { 
	                        return Math.round(tooltipItems.yLabel * 100) + '%';
	                    }
	                }
		    	}
		    }
		});
	};

	inputElement.onkeypress = function(event) {
	    var event = event || window.event;
	    var keyCode = event.which || event.keyCode;

	    if ( keyCode === 13 ) {
			getTones(function (response) {
				console.log(response);
				drawChart();
			});
	    }
	};

	inputElement.focus();

}());