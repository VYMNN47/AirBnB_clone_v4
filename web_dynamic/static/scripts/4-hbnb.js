$(document).ready(function() {
    const checkedAmenities = {};

    $('input[type="checkbox"]').change(function() {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            checkedAmenities[amenityId] = amenityName;
	    console.log(amenityId);
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
            data: (checkedAmenities != null ? JSON.stringify({"amenities": Object.keys(checkedAmenities)}) : JSON.stringify({})),
            success: function(response) {
		$('section.places').empty();
		for (let i = 0; i < response.length; i++) {
		    const place = response[i];
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
			.append($('<div>', {class: 'description'}).html(place.description));
		}
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    Post_places();

    $('#search').click(function() {
        Post_places();
    });
});
