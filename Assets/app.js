$(document).ready(function () {

    let location = "Boston"
    const APIKey = "78d4820b52a05a5e039fd595437c5ac0";
    let cityCount = 0

    // updates current time locally
    // $('#currentDate').text(moment().format('LLL'))
    // let Date = moment().format('LLL')

    $(document).on("click", "#submitEl", function (event) {
        event.preventDefault();
        console.log('run')
        let loc = $('#locVal').val()
        console.log()
        console.log(loc)
        latLongPull(loc)
    });

    // $('#submitEl').on('click', function(event){
    //     event.preventDefault();
    //     console.log('clicked')
    // })

    function latLongPull(location) {
        // Here we are building the URL we need to query the database
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
        // We then created an AJAX call
        console.log(queryURL)
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $('#currentCity').text(response.name)
            let lat = response.coord.lat
            let long = response.coord.lon
            weatherSearch(lat,long)  
        });
        appendSearch(location)
    }

    function weatherSearch(lat, long) {
        // Here we are building the URL we need to query the database
        let queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${APIKey}`
        // We then created an AJAX call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let fa = ((response.current.temp - 273.15) * 1.80 + 32).toFixed(2);
            console.log(fa);
            $('#currentTemp').text(fa + " F");
            let wsmph = (response.current.wind_speed * 2.237).toFixed(2);
            $('#currentWindSpeed').text(wsmph + "mph")
            $('#currentHumidity').text(response.current.humidity + " %")
            $('#currentUVIndex').text(response.current.uvi)  
            linuxUTC = response.current.dt
            timeZone = response.timezone_offset
            console.log(new Date(linuxUTC*1000))
            console.log(new Date((linuxUTC*1000)+(timeZone*1000)))
            $('#currentDate').text(response.current.dt)
        });
    }

    latLongPull(location)

    function appendSearch(location){
        if(cityCount > 7){
            alert("Can only hold 8 cities. Please refresh the paage to add new ones")
        } else {
        $city = $('<li>')
        $city.text(location).addClass('list-group-item')
        $city.attr('id',`${location}`)
        $('#savedCities').append($city)
        cityCount++
        }
    }

    $(`.list-group-item`).on('click', function(event){
        console.log(event)
        latLongPull()
    })






})