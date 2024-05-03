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
});
