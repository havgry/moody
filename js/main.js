'use strict';
(function () {

	var Chart = require('chart.js');
	var io = require('socket.io-client');

	var socket = io.connect();
	var inputElement = document.querySelector('input');
	var inputContainerElement = document.querySelector('.input-wrapper');
	var chartElement = document.querySelector('.chart');
	var chartContainerElement = document.querySelector('.chart-wrapper');
	var loadingIndicatorElement = inputContainerElement.querySelector('.loading-wrapper');
	var chart;

	socket.on('text', function(textObject) {
		var mappedData = mapData(textObject.tones);

		if (chart) {
			updateChart(mappedData);
		} else {
			drawChart(mappedData);
		}

		loadingIndicatorElement.classList.remove('loading-active');

	});

	var getTones = function(success) {

		var inputValue = inputElement.value;

		// Make sure the input value is something slightly meaningful
		if (inputValue.length > 0 && inputValue.indexOf(' ') >= 0) {

			loadingIndicatorElement.classList.add('loading-active');

			socket.emit('text', inputValue);
		}

	};

	var mapData = function(data) {
		
		var mappedData = {
			labels: [],
			data: []
		};

		data.forEach(function(dataPoint){
			mappedData.labels.push(dataPoint.tone_name);
			mappedData.data.push(dataPoint.score);
		});

		return mappedData;
	};

	var drawChart = function(chartData) {

		Chart.defaults.global.defaultFontFamily = '"Roboto", sans-serif';
		Chart.defaults.global.maintainAspectRatio = false;

		chartContainerElement.classList.remove('hidden');

		setTimeout(function () {

			chart = new Chart(chartElement, {
			    type: 'bar',
			    data: {
			        labels: chartData.labels,
			        datasets: [{
			            label: 'Score',
			            data: chartData.data,
			            backgroundColor: ['#ed796c', '#4f9cd0', '#f2c67d', '#80ced1', '#9ba6c6']
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			            	display: false,
			                ticks: {
			                    beginAtZero: true
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
			        		chartContainerElement.classList.remove('chart-not-initialized');
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

		}, 500);
	};

	var updateChart = function(chartData) {
		chart.data.label = chartData.labels;
		chart.data.datasets[0].data = chartData.data;
		chart.update();
	};

	inputElement.onkeypress = function(event) {
	    var event = event || window.event;
	    var keyCode = event.which || event.keyCode;

	    if ( keyCode === 13 ) {
			getTones();
	    }
	};

	inputElement.focus();

}());