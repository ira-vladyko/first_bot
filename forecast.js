const axios = require('axios');
const { forecastApiKey } = require('./config')
const { dates } = require('./constants')

const getWeatherInBelgrade = async (dayCounter) => {
    try {
        const forecastApiPath = `http://api.weatherapi.com/v1/forecast.json`
        const params = `q=Belgrade&key=${forecastApiKey}&lang=ru&days=${dayCounter}`
        const currentWeatherResponse = await axios.get(`${forecastApiPath}?${params}`)
        const daysArray = currentWeatherResponse.data.forecast.forecastday;
        if (dayCounter == dates.today.days || dayCounter == dates.tomorrow.days) {
            const result = getInfoObject(daysArray[dayCounter - 1])
            return result
        }
        if (dayCounter == dates.week.days) {
            const daysInfo = [];
            daysArray.forEach((dayObject) => {
                const resultObject = getInfoObject(dayObject)
                daysInfo.push(resultObject.text)
            })
            return { text: daysInfo.join('\n') }
        }
    } catch (error) {
        if (error.message && error.response) {
            console.error(error.message, error.response)
        } else {
            console.error(error.toString())
        }
        return 'Извините, не могу получить погоду'
    }
}

function getInfoObject(dayObject) {
    const { condition, maxtemp_c, mintemp_c } = dayObject.day
    const date = dayObject.date
    const resultString = `${date}: ${condition.text} от ${mintemp_c} до ${maxtemp_c}`
    return { text: resultString, icon: `https:${condition.icon}` }
}

module.exports = {
    getWeatherInBelgrade,
}

