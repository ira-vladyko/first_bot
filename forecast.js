const axios = require('axios');
const { forecastApiKey } = require('./config')
const { dates } = require('./constants')


const getWeatherInBelgrade = async (dayCounter) => {
    try {
        const currentWeatherResponse = await axios.get(`http://api.weatherapi.com/v1/forecast.json?q=Belgrade&key=${forecastApiKey}&lang=ru&days=${dayCounter}`)
        //console.log(JSON.stringify(currentWeatherResponse.data.forecast))
        if (dayCounter == 1) {
            const { condition, maxtemp_c, mintemp_c } = currentWeatherResponse.data.forecast.forecastday[0].day
            console.log(condition, maxtemp_c, mintemp_c)
            return `${condition.text} от ${mintemp_c} до ${maxtemp_c}`
        }
        if (dayCounter == 2) {
            const { condition, maxtemp_c, mintemp_c } = currentWeatherResponse.data.forecast.forecastday[1].day
            console.log(condition)
            return `${condition.text} от ${mintemp_c} до ${maxtemp_c}`
        }

    } catch (error) {
        //console.log(error.message, error.response)
    }





}



module.exports = {
    getWeatherInBelgrade,

}