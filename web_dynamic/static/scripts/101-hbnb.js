$(document).ready(function() {
// CHECKBOX FUNCTIONALITY //
    const checkedAmenities = {};
    const checkedStates = {};
    const checkedCities = {};

    $('.amenities').on('change', 'input[type="checkbox"]', function() {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            checkedAmenities[amenityId] = amenityName;
	    console.log("Amenity ID: " + amenityId);
        } else {
            delete checkedAmenities[amenityId];
        }
        if (Object.keys(checkedAmenities).length === 0) {
            $('.amenities h4').html('&nbsp;');
        } else {
            updateAmenitiesList();
	}
    });

    function updateAmenitiesList() {
        const amenitiesList = Object.values(checkedAmenities).join(', ');
        $('.amenities h4').text(amenitiesList);
    }

    $('.locations').on('change', 'h2 input[type="checkbox"]', function() {
        const stateId = $(this).attr('data-id');
        const stateName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            checkedStates[stateId] = stateName;
            console.log("State ID: " + stateId);
        } else {
            delete checkedStates[stateId];
        }

        if ((Object.keys(checkedStates).length === 0) && (Object.keys(checkedCities).length === 0)) {
            $('.locations h4').html('&nbsp;');
        } else {
            updateLocationsList();
        }
    });

    function updateStatesList() {
        const statesList = Object.values(checkedStates).join(', ');
        $('.locations h4').text(statesList);
    }

    $('.locations').on('change', 'ul ul input[type="checkbox"]', function() {
        const cityId = $(this).attr('data-id');
        const cityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            checkedCities[cityId] = cityName;
            console.log("City ID: " + cityId);
        } else {
            delete checkedCities[cityId];
        }

        if ((Object.keys(checkedCities).length === 0) && (Object.keys(checkedStates).length === 0)){
            $('.locations h4').html('&nbsp;');
        } else {
            updateLocationsList();
        }
    });

    function updateLocationsList() {
	const citiesList = Object.values(checkedCities).join(', ');
	const statesList = Object.values(checkedStates).join(', ');
	let combinedList = '';

        if (statesList && citiesList) {
            combinedList = `${statesList}, ${citiesList}`;
        } else {
            combinedList = statesList || citiesList;
	}
        $('.locations h4').text(combinedList);
    }

// API FUNCTIONALITY //
    function updateApiStatus() {
        $.get("http://0.0.0.0:5001/api/v1/status/", function(response) {
            if (response.status === 'OK') {
                $('#api_status').addClass('available');
            } else {
                $('#api_status').removeClass('available');
            }
        }).fail(function() {
            $('#api_status').removeClass('available');
        });
    }

    updateApiStatus();


    function Post_places() {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"states": Object.keys(checkedStates), "cities": Object.keys(checkedCities), "amenities": Object.keys(checkedAmenities)}),
            success: function(response) {
		$('section.places').empty();
		for (let i = 0; i < response.length; i++) {
		    const place = response[i];
		    console.log(place.reviews);
		    $('section.places').append('<article></article>');
		    $('section.places article').last()
	                .append($('<div>', {class: 'title_box'})
                            .append($('<h2>').text(place.name))
                            .append($('<div>', {class: 'price_by_night'}).text('$' + place.price_by_night))
                        )
			.append($('<div>', {class: 'information'})
                            .append($('<div>', {class: 'max_guest'}).text(place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '')))
                            .append($('<div>', {class: 'number_rooms'}).text(place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '')))
                            .append($('<div>', {class: 'number_bathrooms'}).text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '')))
                        )
			.append($('<div>', {class: 'user'})
			)
			.append($('<div>', {class: 'description'}).html(place.description))
			.append($('<div>', {class: 'reviews', 'data-place': place.id})
			    .append($('<h3>'))
	 		    .append($('<ul>'))
			);
			get_reviews(place.id);
		}
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    Post_places();
    function get_reviews(place_id) {
        $.get(`http://0.0.0.0:5001/api/v1/places/${place_id}/reviews`, function(response) {
	    $(`.reviews[data-place="${place_id}"] h3`).text(`${response.length} Review` + (response.length !== 1 ? 's' : ''));
 	    for (let x = 0; x < response.length; x++) {
 	        review = response[x];
		$(`.reviews[data-place="${place_id}"] ul`).append($('<li>').append($('<p>').text(review.text)));
	    }
	    console.log(response);
	});
    }

    $('#search').click(function() {
        Post_places();
    });
});
