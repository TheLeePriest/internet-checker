require('dotenv').config();
const ping = require('ping');
const puppeteer = require('puppeteer');

let checkRunning = false;

const goToLink = async () => {
    checkRunning = true;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.LINK);
    await page.waitForResponse(response => response.url() === process.env.RESPONSELINK && response.status() === 200);
    await browser.close();
    return await ping.promise.probe(process.env.HOST);
}

const pingHost = async () => {
    setInterval(async () => {
        if(checkRunning) {
            console.log('Check is running...')
            return;
        }

        const res = await ping.promise.probe(process.env.HOST, {timeout: 10});

        if (!res.alive) {
            console.log('Connection is down, running the fix...')
            await goToLink().then(linkRes => {
                checkRunning = false;
                if (linkRes.alive) {
                    return;
                }
            }).catch(error => console.log(error))
        } else {
            console.log('Connection is active')
        }
    }, 1000)
};

pingHost();
