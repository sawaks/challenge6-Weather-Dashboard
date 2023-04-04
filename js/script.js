var inputCityEl = $("#input-city-el");
var searchBtn = $("#search-btn");
var cityInputContainer = $(".input-City-Container");
var dailyWeatherContainer = $(".daily-weather-container");
var wichCityDay = $("#wich-city-day");
var weatherIcon = $("#weather-icon");
var weatherList = $("#weather-list");
var tempLi = $("#temp-li");
var windLi = $("#wind-li");
var humidityLi = $("#humidity-li");
var fiveDaysWeatherContainer = $(".fiveDays-weather-container");
var fiveDaysWeather = $(".fiveDays-weather");
var titleContainer = $(".fiveDays-title-container");
var deleteBtnContainer = $(".delete-btn-container");

var apiKey = "d278b38bf00d6e6189dee0738505a23d";

var cityArr = [];
var storageKey = 'city';

var cityText = inputCityEl.val().trim();


function addCityBtn() {
    cityInputContainer.html("");
    deleteBtnContainer.html("");

    var deleteAllBtn = $("<button>");

    deleteAllBtn.addClass("btn p-1 delete-All-btn");
    deleteAllBtn.attr("type", "button");
    deleteAllBtn.text("Clear All");

    deleteBtnContainer.append(deleteAllBtn);

    for (var i = 0; i < cityArr.length; i++) {
        var nameOfCity = cityArr[i];

        var cityBtn = $("<button>");
        var deleteBtn = $("<button>");

        cityBtn.addClass("btn city-btn");
        cityBtn.attr("type", "button");
        cityBtn.text(nameOfCity);
        cityBtn.attr("data-index", i);

        deleteBtn.addClass("btn delete-btn");
        deleteBtn.attr("type", "button");
        deleteBtn.text("X");


        cityInputContainer.append(cityBtn);
        cityBtn.append(deleteBtn);

        cityBtn.on("click", function (event) {
            event.preventDefault();
            showDailyWeather(nameOfCity);
            show5daysWeater(nameOfCity);
            inputCityEl.focus();

        })

        deleteBtn.on("click", function (event) {
            console.log("delete3")
            event.preventDefault();
            event.stopPropagation();
            var element = $(event.target);
            if (element.is("button") === true) {

                var index = element.parent().attr("data-index");
                cityArr.splice(index, 1);

                storedCityName();
                addCityBtn();
            }

        })
    }


}
deleteBtnContainer.on("click", '.delete-All-btn', function (event) {
    console.log("delete")
    event.preventDefault();
    cityArr.splice(0);
    cityInputContainer.children().remove();
    storedCityName();

})


function init() {
    var storedCity = JSON.parse(localStorage.getItem(storageKey));
    if (storedCity !== null) {
        cityArr = storedCity;
    }
    addCityBtn();
    inputCityEl.focus();


}

function storedCityName() {
    localStorage.setItem(storageKey, JSON.stringify(cityArr));
}


function showDailyWeather(inputCityName) {

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + inputCityName + '&appid=' + apiKey;

    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {

                response.json().then(function (data) {
                    displayRepos(data);

                });
            } else {
                alert('Error: ' + response.statusText)


            }
        })


}


function displayRepos(repos) {
    weatherIcon.html("");

    var theDay = dayjs.unix(repos.dt).format('DD/MM/YYYY');
    var repoCityName = repos.name;
    wichCityDay.text(repoCityName + ' (' + theDay + ')');

    var iconData = $("<img>");
    iconData.attr("src", 'https://openweathermap.org/img/wn/' + repos.weather[0].icon + '@2x.png')
    iconData.attr("alt", "weather icon")

    var celsius = Math.floor(repos.main.temp - 273.15);
    var mphOrigin = repos.wind.speed * 3.6 * 0.6;
    var mph = Math.floor(mphOrigin * 10) / 10;
    var humidity = repos.main.humidity;

    dailyWeatherContainer.addClass("card");

    tempLi.text('Temp: ' + celsius + '°C');
    windLi.text('Wind: ' + mph + 'MPH');
    humidityLi.text('Humidity: ' + humidity + '%');

    weatherIcon.append(iconData);

    if (cityArr.includes(repoCityName) !== true) {
        cityArr.push(repoCityName);
    }
    storedCityName();
    addCityBtn();

}



function show5daysWeater(inputCityName) {

    var api5daysUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + inputCityName + '&appid=' + apiKey;

    fetch(api5daysUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    displayRepos5day(data);
                });
            } else {
                alert('Error: ' + response.statusText);

            }
        })

}


function displayRepos5day(repo5days) {
    fiveDaysWeather.html("");
    titleContainer.html("");
    var repo5daysTitle = $("<h3>");
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();

    repo5daysTitle.text("5-Days Forecast");
    titleContainer.append(repo5daysTitle);


    for (var i = 0; i < repo5days.list.length; i++) {
        var weatherCard = $("<div>");
        var weatherBody = $("<div>");
        var repo5daysDate = $("<h5>");
        var repo5daysImg = $("<img>");
        var weather5daysList = $("<ul>");
        var weather5daysTempLi = $("<li>");
        var weather5daysWindLi = $("<li>");
        var weather5daysHumidityLi = $("<li>");

        weatherCard.addClass('card shadow-sm bg-primary rounded weather-card');
        weatherBody.addClass("card-body");
        repo5daysDate.addClass("card-title");

        if (repo5days.list[i].dt >= startDt && repo5days.list[i].dt < endDt) {
            if (repo5days.list[i].dt_txt.slice(11, 13) == "12") {
                var weather5daysDate = repo5days.list[i].dt
                var weather5DaysImg = repo5days.list[i].weather[0].icon;
                var celsius5days = Math.floor(repo5days.list[i].main.temp - 273.15);
                var mphOrigin5days = repo5days.list[i].wind.speed * 3.6 * 0.6;
                var mph5days = Math.floor(mphOrigin5days * 10) / 10;
                var humidity5days = repo5days.list[i].main.humidity;

                repo5daysDate.text(dayjs.unix(weather5daysDate).format('DD/MM/YYYY'));
                repo5daysImg.attr("src", 'https://openweathermap.org/img/wn/' + weather5DaysImg + '@2x.png');
                repo5daysImg.attr("alt", "weather icon");
                weather5daysTempLi.text('Temp: ' + celsius5days + '°C');
                weather5daysWindLi.text('Wind: ' + mph5days + 'MPH');
                weather5daysHumidityLi.text('Humidity: ' + humidity5days + '%');


                fiveDaysWeather.append(weatherCard);
                weatherCard.append(weatherBody);
                weatherBody.append(repo5daysDate);
                weatherBody.append(repo5daysImg);
                weatherBody.append(weather5daysList);
                weather5daysList.append(weather5daysTempLi);
                weather5daysList.append(weather5daysWindLi);
                weather5daysList.append(weather5daysHumidityLi);


            }

        }

        var changeWidth = 570;
        var ADD_CLASS = "flex-column";

        $(window).on('load resize', function () {
            var i_width = $(window).outerWidth(true);
            if (i_width > changeWidth) {
                if (fiveDaysWeather.hasClass(ADD_CLASS)) {
                    fiveDaysWeather.eq(0).removeClass(ADD_CLASS);
                    weatherCard.attr("style", "width: 15rem;")

                }

            } else {
                if (!fiveDaysWeather.hasClass(ADD_CLASS)) {
                    fiveDaysWeather.eq(0).addClass(ADD_CLASS);
                    weatherCard.attr("style", "width: 10rem;")
                }
            }

        });

    }

}

searchBtn.on('click', function (event) {
    event.preventDefault();

    var cityText = inputCityEl.val().trim();
    if (cityText === "") {
        return;
    }

    inputCityEl.val("");

    showDailyWeather(cityText);
    show5daysWeater(cityText);
    inputCityEl.focus();
});
init();





