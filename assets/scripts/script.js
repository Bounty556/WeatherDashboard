var apiKey = 'dcbf84d1f01ba47709c6cfcfcb884b84';
var searchHistory;

$(document).ready(function() {
    // Make an empty array if searchHistory doesn't exist
    searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    populateSearchHistory();

    $('#search-btn').on('click', function() {
        search($('#search-input').val().trim());
    });

    $('#search-history').on('click', '.search-history-item', function() {
        search($(this).attr('data-id'));
    });
});

function search(query) {
    let queryURL;

    if (isNaN(parseInt(query))) { // Must be city name
        queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + query;
    } else { // Must be city ID
        queryURL = 'https://api.openweathermap.org/data/2.5/weather?id=' + query;
    }

    $.ajax({
        url: queryURL + '&units=imperial&appid=' + apiKey,
        method: 'GET'
    }).then(function(response) {
        console.log(response);

        addSearchHistoryItem(response.name, response.id);

        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lon=' + response.coord.lon + '&lat=' + response.coord.lat + '&units=imperial&appid=' + apiKey,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
        });
    });
}

function addSearchHistoryItem(name, id) {
    let historyItem = {
        name: name,
        id: id
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

        p.text(element.name);

        $('#search-history').append(p);
    });
}