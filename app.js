$(document).ready(function () {
    // variables
    // Boston is the default location
    let location = "Boston" 
    const APIKey = "78d4820b52a05a5e039fd595437c5ac0";
    let cityCount = 0
    let citiesIncluded = []

    // takes the location requested and runs an ajax request pulling the lat and long of the city
    // the runs the weatherSearch function taking in the lat and long 
    // updates the current city ID on screen
    // checks if the city has been searched before, and if not, runs the appendSearch function
    function latLongPull(location) {
        // Here we are building the URL we need to query the database
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $('#currentCity').text(response.name)
            let lat = response.coord.lat
            let long = response.coord.lon
            weatherSearch(lat,long)  
        });
        if (citiesIncluded.includes(location.toLowerCase()) === false){
            appendSearch(location)
        }
    }

    // Takes in the lat and long and pulls most of the relavent data we need to update
    function weatherSearch(lat, long) {
        // Here we are building the URL we need to query the database
        let queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${APIKey}`
        // We then created an AJAX call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // updates current info section with relevent data
            let curTemp = tempConversion(response.current.temp)
            $('#currentTemp').text(curTemp + " F");
            // converts windspeed from m/s to mph
            let wsmph = (response.current.wind_speed * 2.237).toFixed(2);
            $('#currentWindSpeed').text(wsmph + "mph")
            $('#currentHumidity').text(response.current.humidity + " %")
            $('#currentUVIndex').text(response.current.uvi)  
            // retrieves the current and timezone offset value in Unix UTC 
            // use the Date object and toUTCString method to convert the time
            // multiply by 1000 because Date works in miliseconds.
            // remove the last three characters of the string
            linuxUTC = response.current.dt
            timeZone = response.timezone_offset
            displayTime = new Date((linuxUTC*1000)+(timeZone*1000)).toUTCString().slice(0, -3)
            $('#currentDate').text(displayTime)
            let iconVal = response.current.weather[0].icon
            $('#currentIcon').attr('src', `http://openweathermap.org/img/wn/${iconVal}.png`)
        
            // updates the forecase section with relevent data using a forloop. same logic as above
            for(let i=1; i<=5;i++){
                let forTemp = tempConversion(response.daily[i].temp.day)
                $(`#${i}-temp`).text(forTemp + " F");
                $(`#${i}-humid`).text(response.daily[i].humidity + " %")
                linuxUTC = response.daily[i].dt
                forDisplayTime = new Date((linuxUTC*1000)+(timeZone*1000)).toDateString()
                $(`#${i}-date`).text(forDisplayTime)
                forIconVal = response.daily[i].weather[0].icon
                $(`#${i}-icon`).attr('src', `http://openweathermap.org/img/wn/${forIconVal}.png`)
            }
        });
    }

     // converts the temp from kelvin to F. Takes in a kelvin value and returns the converted value 
     function tempConversion(temp){
        let convertedTemp = ((temp - 273.15) * 1.80 + 32).toFixed(2);
        return convertedTemp
    }

    // appends searched cities to the left aside. Takes in a location variable of the city searched. 
    // limits the number of cities that can be added and searched by updating and checking variable cityCount
    // pushes the location to the array citiesIncluded
    function appendSearch(location){
        if(cityCount > 7){
            alert("Can only hold 8 cities. Please refresh the paage to add new ones")
        } else {
        $city = $('<li>')
        $city.text(location).addClass('list-group-item')
        $city.attr('id',`${location}`)
        $('#savedCities').append($city)
        cityCount++
        citiesIncluded.push(location.toLowerCase())
        }
    }

    // on submitting a search, takes the input of a city and runs the latLongPull function, 
    // passing along the city or value of the input
    $(document).on("click", "#submitEl", function (event) {
        event.preventDefault();
        let loc = $('#locVal').val()
        latLongPull(loc)
        $('#locVal').text('')
    }); 

    // when clicking on a previously searched city, pulls cities weather information back up
    $(document).on('click', `.list-group-item`, function(event){
        latLongPull(event.target.id)
    })

    // function call with the default location - currently Boston
    latLongPull(location)
})