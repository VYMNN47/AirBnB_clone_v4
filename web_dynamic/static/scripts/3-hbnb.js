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
	    console.log(response.status)
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
});
