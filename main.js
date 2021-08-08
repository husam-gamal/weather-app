
const cityURL = 'https://api.openweathermap.org/data/2.5/weather?id=';
const geoURL = 'https://api.openweathermap.org/data/2.5/weather?lat=';
const key = '&appid=9b12beaed31eef66c9c397829633552a';
const units = ['','&units=metric','&units=imperial'];
let selctedUnit = [1, 'C'];
let geoPosition = {};
let countriesData;
let city = document.getElementById('city');
let date = document.getElementById('date');
let brief = document.getElementById('Brief');
let icon = document.getElementById('icon');
let temp = document.getElementById('temp');
let unit = document.getElementById('unit');
let tempMax = document.getElementById('temp_max');
let tempMin = document.getElementById('temp_min');
let feels = document.getElementById('feels_like');
let pressure = document.getElementById('pressure');
let humidity = document.getElementById('humidity');
let visibility = document.getElementById('visibility');
let windSpeed = document.getElementById('wind_speed');
let sunRise = document.getElementById('sun_rise');
let sunSet = document.getElementById('sun_set');
let dayLength = document.getElementById('day_len');
let nightLength = document.getElementById('night_len');
let coutryInput = document.getElementById('coutry_input');
let cityInput = document.getElementById('city_input');
let unitInput = document.getElementById('unit_input');
let coutryList = document.getElementById('coutry_list');
let cityList = document.getElementById('city_list');
let unitList = document.getElementById('unit_list');
let closeList = document.getElementById('close_list');

// create country, city lists
function createCountryList() {
    let countries = '';
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let data = JSON.parse(this.responseText)
            countriesData = data;
            Object.keys(data).forEach(key => {
                countries += `<li>${key}</li>`
            });
            coutryList.innerHTML = countries;
        }
    }
    request.open('GET','citys.json',true);
    request.send();
}
function updateCityList(country) {
    let citys = '';
    Object.keys(countriesData[country]).forEach(key  => {
        citys += `<li>${key}</li>`
    });
    cityList.innerHTML = citys;
}

async function weatherDataByLocation(lat, lon) {
    const res = await fetch(geoURL + lat + '&lon=' + lon + key + units[selctedUnit[0]]);
    const data = await res.json();
    showData(data)
}
async function weatherDataByCityId(id) {
    const res = await fetch(cityURL + id + key + units[selctedUnit[0]]);
    const data = await res.json();
    showData(data)
}

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            geoPosition.lat =  pos.coords.latitude;
            geoPosition.lon =  pos.coords.longitude;
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function showData(data) { 
    city.textContent = data.name
    date.textContent = new Date().toDateString();
    brief.textContent = data.weather[0].description;
    icon.src = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon +'@2x.png';

    temp.textContent = parseInt(data.main.temp);
    unit.textContent = selctedUnit[1];
    tempMax.textContent = parseInt(data.main.temp_max);
    tempMin.textContent = parseInt(data.main.temp_min);
    feels.textContent = parseInt(data.main.feels_like);

    pressure.textContent = data.main.pressure / 1000 + 'mBar';
    humidity.textContent = data.main.humidity + '%';
    visibility.textContent = data.visibility /1000 + 'Km';
    windSpeed.textContent = data.wind.speed + 'Km/h';

    sunRise.textContent = new Date(data.sys.sunrise * 1000)
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunSet.textContent = new Date(data.sys.sunset * 1000)
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const dayLen = new Date(new Date(data.sys.sunset * 1000) - new Date(data.sys.sunrise * 1000));
    const hours = parseInt(dayLen / (1000 * 60 * 60));
    const minutes = (parseInt(dayLen / (1000 * 60)) -  (hours * 60));
    dayLength.textContent = hours + 'h ' + minutes + 'm';
    nightLength.textContent = (23 - hours) + 'h ' + (60 - minutes) + 'm';
}

coutryInput.addEventListener('click', () => {
    coutryList.style.maxHeight = 'calc(100vh - 220px)';
    cityList.style.maxHeight = '0';
    unitList.style.maxHeight = '0';
    closeList.classList.remove('hide');
});
cityInput.addEventListener('click', () => {
    coutryList.style.maxHeight = '0';
    cityList.style.maxHeight = 'calc(100vh - 220px)';
    unitList.style.maxHeight = '0';
    closeList.classList.remove('hide');
});
unitInput.addEventListener('click', () => {
    coutryList.style.maxHeight = '0';
    cityList.style.maxHeight = '0';
    unitList.style.maxHeight = 'calc(100vh - 220px)';
    closeList.classList.remove('hide');
});
closeList.addEventListener('click', () => {
    coutryList.style.maxHeight = '0';
    cityList.style.maxHeight = '0';
    unitList.style.maxHeight = '0';
    closeList.classList.add('hide');
});
coutryList.addEventListener('click', (e)=>{
    coutryInput.value = e.target.textContent;
    updateCityList(e.target.textContent);
    coutryList.style.maxHeight = '0';
    cityList.style.maxHeight = '0';
    unitList.style.maxHeight = '0';
    closeList.classList.add('hide');
});
cityList.addEventListener('click', (e)=>{
    cityInput.value = e.target.textContent;
    coutryList.style.maxHeight = '0';
    cityList.style.maxHeight = '0';
    unitList.style.maxHeight = '0';
    closeList.classList.add('hide');
});
unitList.addEventListener('click', (e)=>{
    unitInput.value = e.target.textContent;
    if(e.target.textContent === 'Celsius') {
        selctedUnit[0] = 1;
        selctedUnit[1] = 'C';
    } else if(e.target.textContent === 'Fahrenheit') {
        selctedUnit[0] = 2;
        selctedUnit[1] = 'F';
    } else {
        selctedUnit[0] = 0;
        selctedUnit[1] = 'K';
    }
    coutryList.style.maxHeight = '0';
    cityList.style.maxHeight = '0';
    unitList.style.maxHeight = '0';
    closeList.classList.add('hide');
});

function gobtn() {
    weatherDataByCityId(countriesData[coutryInput.value][cityInput.value]);
}
function locationBtn() {
    getLocation()
    weatherDataByLocation(geoPosition.lat, geoPosition.lon)
}
getLocation()
createCountryList();
weatherDataByCityId(1006984);
