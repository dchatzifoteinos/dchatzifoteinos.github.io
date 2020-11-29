window.onload = function ()
{
    const dateTag = document.getElementById("date");
    const locationTag = document.getElementById("location");
    const cloudsTag = document.getElementById("clouds");
    const weatherButton = document.getElementById("fetchWeather");

    //setView PARAMETERS ARE [LAT, LON] AND ZOOM LEVEL
    let userMap = L.map('userMap').setView([0, 0], 6);


    // INSTEAD OF USING MAPBOX WE CAN USE OPENSTREETMAP WITH ATTRIBUTION `&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors` AND TILE_URL `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
    // IN THAT WAY OBJECT ELEMTNS MAXZOOM...ACCESSTOKEN WOULDN'T BE REQUIRED.
    // CODE WOULD BE:     
    // const attribution = `&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors`;
    // const tileUrl = `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;
    // const tiles = L.tileLayer(tileUrl, { attribution });
    // tiles.addTo(userMap);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZGNoYXR6aWZvdGVpbm9zIiwiYSI6ImNraTJhZnF4ZTAzYmgyc3FzODlxNG1mcmkifQ.hFGlh-5QFjexocsWsRiwTA'
        }).addTo(userMap);
    let userMarker = L.marker([0, 0]).addTo(userMap);
    //  WE CAN ALSO SET A CUSTOM ICON FOR MARKER HERE: https://leafletjs.com/reference-1.7.1.html#icon


    let userLon;
    let userLat;
    let apiWeatherURL;
    const apiWeatherKey = 'c5f48afb1d941fe4c5e752d72f854e13';
    let apiISSURL;

    //SHOW DATE
    let date = new Date;
    const dateOptions =
    {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    dateTag.innerHTML = date.toLocaleDateString("el-GR", dateOptions);

    //GET LON-LAT COORDINATES
    if (!navigator.geolocation)
    {
        locationTag.innerHTML = ("N/A");
    }
    else
    {
        navigator.geolocation.getCurrentPosition(getCoords);
    }
    function getCoords(position)
    {
        userLon = position.coords.longitude;
        userLat = position.coords.latitude;

        apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=${apiWeatherKey}`;
        console.log(apiWeatherURL);

        //getWeather function needs to be called from here (after getting lon-lat), because otherwise it won't have gotten lon-lat (it does take a bit of time) and it will call it with lon-lat undefined.

        userMap.setView([userLat, userLon]);
        userMarker.setLatLng([userLat, userLon]);

        getWeather();
    }


    async function getWeather()
    {
        let weatherResponse = await fetch(apiWeatherURL);
        let weatherData = await weatherResponse.json();

        locationTag.innerHTML = weatherData.name;
        cloudsTag.innerHTML = `${weatherData.clouds.all}%`;
    }
}