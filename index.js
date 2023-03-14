import puppeteer from 'puppeteer'
import axios from 'axios'
import qrcode from 'qrcode-terminal'
import * as dotenv from 'dotenv'

dotenv.config()
// require('dotenv').config()

const isEmpty = (something) => something === "" || something === null || something === undefined;
const getText = async () => {
  let text, value;
  if (isEmpty(process.env.RANDOM_SENTENCES)) {
    try {
      await axios.get('https://quotable.io/random')
        .then(function (response) {
          const data = response.data;
          value = `"*${data.content}*" - ***${data.author}***`
          text = `"${data.content}" - ${data.author}`
        })
        .catch((err) => {
          const errorMsg = "Error Status: " + err?.response?.status + ", " + err?.response?.statusText;
          console.log(errorMsg);
          console.log("-------------------------------");
          text = errorMsg
          value = errorMsg
        });
    } catch (error) {
      const msg = "Something wrong!";
      console.log(error.message);
      text = msg;
      value = msg;
    }
  } else {
    const randomSentences = process.env.RANDOM_SENTENCES.split('|');
    text = randomSentences[Math.floor(Math.random() * randomSentences.length)];
    value = text;
  }

  return {
    text: text,
    value: value
  };
}


console.log("Starting...");
(async () => {
  console.log('Initial browser 🌐');
  const browser = await puppeteer.launch({
    // headless: false,
    args: ['--no-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36')
    page.setDefaultNavigationTimeout(60 * 1000);
    let pages = await browser.pages();
    await pages[0].close();
    console.log("🚀 Opening Login page Discord");
    await page.goto(`https://discord.com/login`, { waitUntil: ['load', 'networkidle0'] });

    await page.waitForSelector('div[class^=qrCode-]');
    await page.waitForTimeout(5000);
    const qrBase64 = await page.evaluate(() => {
      const base64 = btoa(unescape(encodeURIComponent(document.querySelector("div[class^=qrCode-]").getInnerHTML())));
      const qrcode = 'data:image/svg+xml;base64,' + base64;
      return qrcode;
    });

    const pageQRParser = await browser.newPage()
    await pageQRParser.goto('https://qrcode-parser.netlify.app/', { waitUntil: ['load', 'networkidle0'] })
    await pageQRParser.evaluate((externalVar) => {
      document.querySelector('#image-base64').value = externalVar;
      return null;
    }, qrBase64);

    await pageQRParser.click('#parse-image-base64');
    await page.waitForTimeout(2000);
    const qrValue = await pageQRParser.evaluate(async () => {
      return await new Promise(resolve => { // <-- return the data to node.js from browser
        resolve(document.querySelector("#content2").getInnerHTML())
      })
    })
    await pageQRParser.close();

    if (qrValue === null) {
      console.log("Something wrong while parsing QrCode 😕");
      console.log("Convert Base64 this to image and scan manually: ")
      console.log(qrBase64)
      await page.waitForTimeout(15000);
    } else {
      console.log("Scan this barcode:");
      qrcode.generate(qrValue);
      console.log("You have 10 seconds to scan barcode 🙂");
      await page.waitForTimeout(10000);
    }

    console.log("🚀 Go to channel: " + process.env.CHANNEL_URL);
    await page.goto(process.env.CHANNEL_URL)
    await page.waitForSelector('div[role=textbox]');
    await page.waitForTimeout(4000);

    let count = 0;
    while (true) {
      count++;
      const data = await getText();
      await page.type('div[role=textbox]', data.value);
      await page.keyboard.press('Enter');
      console.log("Count: " + count);
      if (isEmpty(process.env.RANDOM_SENTENCES)) {
        console.log("✉️ Sending Quote:");
        console.log(data.text);
      } else {
        console.log("✉️ Sending Text: " + data.value);
      }
      console.log("-------------------------------");
      await page.waitForTimeout(process.env.INTERVAL * 1000);
    }

  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.log(e);
  process.exitCode = 1;
});