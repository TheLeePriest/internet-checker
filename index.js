require('dotenv').config();
const ping = require('ping');
const puppeteer = require('puppeteer');
const wait = require('waait');

let checkRunning = false;
let connectionActive = true;

const goToLink = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.LINK);
    const finalResponse = await page.waitForResponse(response => response.url() === process.env.RESPONSELINK && response.status() === 200, {timeout: 120000});
    await browser.close();
    return finalResponse.ok();
}

const pingHost = async () => {
    while(!checkRunning) {
        const res = await ping.promise.probe(process.env.HOST, {timeout: 10});
        connectionActive = res.alive;

        if (!checkRunning && !connectionActive) {
            console.log('Connection is down, running the fix...');
            checkRunning = true;

            await goToLink().then(() => {
                checkRunning = false;
            }).catch(error => {
                console.log(error)
                checkRunning = false;
                connectionActive = false;
            })
        }

        await wait(1000);
        console.log('Connection is active, running the ping again...')
    }
};

pingHost();
