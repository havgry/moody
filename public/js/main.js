'use strict';
(function(){

	var inputElement = document.getElementById('inputty');

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

	inputElement.onkeypress = function(event) {
	    var event = event || window.event;
	    var keyCode = event.which || event.keyCode;

	    if ( keyCode === 13 ) {
			getTones(function (response) {
				console.log(response);
			});
	    }
	};

	inputElement.focus();

}());