var apiKey = 'dcbf84d1f01ba47709c6cfcfcb884b84';

$(document).ready(function() {
    $('#search-btn').on('click', search);
});

function search() {
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?q=Salt+Lake+City&units=imperial&appid=' + apiKey,
        method: 'GET'
    }).then(function(response) {
        console.log(response);

        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lon=' + response.coord.lon + '&lat=' + response.coord.lat + '&units=imperial&appid=' + apiKey,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
        });
    });
}