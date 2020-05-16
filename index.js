require('dotenv').config();
const ping = require('ping');
const puppeteer = require('puppeteer');

let skyCheckRunning = false;

const goToSkyLink = async () => {
    skyCheckRunning = true;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.SKYLINK);
    await page.waitForResponse(response => response.url() === 'https://www.sky.com/broadband/connection/reconnection/adsl' && response.status() === 200);
    return await ping.promise.probe(process.env.HOST);
}

const pingHost = async () => {
    setInterval(async () => {
        if(skyCheckRunning) {
            return;
        }

        const res = await ping.promise.probe(process.env.HOST, {timeout: 10});

        if (!res.alive) {
            await goToSkyLink().then(skyRes => {
                skyCheckRunning = false;
                if (skyRes.alive) {
                    return;
                }
            }).catch(error => console.log(error))
        } else {
            console.log(res)
        }
    }, 1000)
};

pingHost();
