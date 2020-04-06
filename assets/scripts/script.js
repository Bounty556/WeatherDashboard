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
        let name = response.name;

        addSearchHistoryItem(name, response.id);

        // Need second call for 5-day forecast. We can't do everything with the "one call" endpoint because it doesn't take in a city name.
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lon=' + response.coord.lon + '&lat=' + response.coord.lat + '&units=imperial&appid=' + apiKey,
            method: 'GET'
        }).then(function(response) {
            displayWeather(response, name);
            displayForecast(response);
        });
    }).catch(function() {
        console.log('Not a valid city name or id');
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

function displayWeather(weatherData, name) {
    let todaysWeather = weatherData.current;

    $('#weather-summary-title').text(name + ' ' + moment().format('M/D/YYYY'));
    $('#weather-summary-icon').attr('src', 'http://openweathermap.org/img/wn/' + todaysWeather.weather[0].icon + '@2x.png');
    $('#temperature').text(todaysWeather.temp);
    $('#humidity').text(todaysWeather.humidity);
    $('#wind-speed').text(todaysWeather.wind_speed);
    $('#uv-index').text(todaysWeather.uvi)
}

function displayForecast(forecastData) {
    let forecastDiv = $('#weather-forecast');
    let day = moment();

    forecastDiv.empty();

    for (let i = 0; i < 5; i++) {
        day.add(1, 'days');

        let daysWeather = forecastData.daily[i];

        let dayDiv = $('<div>').attr('class', 'weather-forecast-day');
        let date = $('<h5>').text(day.format('M/D/YYYY'));
        let weatherIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + daysWeather.weather[0].icon + '.png');
        let temp = $('<p>').html('Temp: ' + daysWeather.temp.day + ' &#8457;');
        let humidity = $('<p>').text('Humidity: ' + daysWeather.humidity + '%');

        dayDiv.append(date);
        dayDiv.append(weatherIcon);
        dayDiv.append(temp);
        dayDiv.append(humidity);

        forecastDiv.append(dayDiv);
    }
}