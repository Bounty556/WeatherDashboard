var apiKey = 'dcbf84d1f01ba47709c6cfcfcb884b84';
var searchHistory;

$(document).ready(function() {
    $('#search-btn').on('click', search);

    // Make an empty array if searchHistory doesn't exist
    searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    populateSearchHistory();
});

function search() {
    let cityName = $('#search-input').val().trim();

    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=' + apiKey,
        method: 'GET'
    }).then(function(response) {
        console.log(response);

        addSearchHistoryItem(response.name, response.id, response.coord.lat, response.coord.lon);

        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lon=' + response.coord.lon + '&lat=' + response.coord.lat + '&units=imperial&appid=' + apiKey,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
        });
    });
}

function addSearchHistoryItem(name, id, lat, lon) {
    let historyItem = {
        name: name,
        id: id,
        lat: lat,
        lon: lon
    };
    searchHistory.unshift(historyItem);

    if (searchHistory.length > 10) {
        searchHistory.pop();
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    populateSearchHistory();
}

function populateSearchHistory() {
    $('#search-history').empty();

    searchHistory.forEach(element => {
        let p = $('<p>').attr('class', 'search-history-item');
        p.attr('data-id', element.id.toString());
        p.attr('data-lat', element.lat.toString());
        p.attr('data-lon', element.lon.toString());

        p.text(element.name);

        $('#search-history').append(p);
    });
}