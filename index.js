const axios = require('axios');
const inquirer = require('inquirer');
const API_URL = 'https://micro-weather.vercel.app';
require('clear')();
const celciusToFahrenheit = (celcius) => Math.round((9 / 5) * celcius + 32);

function getWeather() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'city',
            message: '   City:',
        },
        {
            type: 'input',
            name: 'country',
            message: 'Country:',
        },
        {
            type: 'input',
            name: 'scale',
            message: '  Scale:',
        }
    ]).then(
        (answers) => {
            axios.get(`${API_URL}?city=${answers.city}&country=${answers.country}`)
                .then(res => {
                    let result = Object.assign(res.data, { city: answers.city, country: answers.city, scale: answers.scale });

                    if (answers.scale.toLocaleLowerCase() === 'f' || answers.scale.toLocaleLowerCase() === 'fahrenheit') {
                        result.temp = celciusToFahrenheit(res.data.temp);
                        result.scale = 'F';
                    }

                    //TODO: COLOUR ACCORDINGLY
                    console.log(`Weather of ${answers.city}, ${answers.country}`);
                    console.log('============================================')
                    console.log(`Temperature: ${result.temp} ${result.scale}`);
                    console.log(` Feels Like: ${result.feels_like} MPH`);
                    console.log(`   Humidity: ${result.humidity}%`);
                    console.log(`   Max Temp: ${result.temp_max} ${result.scale}`);
                    console.log(`   Min Temp: ${result.temp_min} ${result.scale}`);
                    console.log(`  Condition: ${result.condition} MPH`);
                })
                .catch(err => {
                    if(err.response.status === 404 || err.response.status === 400) {
                        console.log('City not found');
                    } else {
                        console.log(err.message);
                        console.log(err.response.data);
                        console.log(err.response.status);
                    }
                });
        }
    )
}

getWeather()