import { chromium } from "playwright";
import TelegramBot from "node-telegram-bot-api";

const PRODUCT_URL =
  "https://www.headphonezone.in/products/twistura-d-minor";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const CHAT_ID = process.env.CHAT_ID!;

const bot = new TelegramBot(BOT_TOKEN);

let alreadyInStock = false;

async function checkStock() {
  console.log(
    `[${new Date().toLocaleTimeString()}] Checking stock...`
  );

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  try {
    await page.goto(PRODUCT_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForTimeout(3000);

    const soldOutButton = page.locator(
      'button.button--xl.button--subdued'
    );

    const soldOutExists =
      (await soldOutButton.count()) > 0;

    let soldOutText = "";

    if (soldOutExists) {
      soldOutText =
        ((await soldOutButton.textContent()) || "")
          .trim()
          .toLowerCase();
    }

    const notifyButton = page.locator("#SI_trigger");

    const notifyExists =
      (await notifyButton.count()) > 0;

    const addToCartExists =
      (await page
        .locator('button[type="submit"]:not(.button--subdued)')
        .count()) > 0;

    console.log({
      soldOutExists,
      soldOutText,
      notifyExists,
      addToCartExists,
    });

    const isActuallySoldOut =
      soldOutExists &&
      soldOutText.includes("sold out");

    const inStock =
      !isActuallySoldOut &&
      !notifyExists &&
      addToCartExists;

    if (inStock) {
      console.log("IN STOCK!");

      if (!alreadyInStock) {
        alreadyInStock = true;

        await bot.sendMessage(
          CHAT_ID,
          `🚨 Hurray! Twistura D-Minor is BACK IN STOCK!\n${PRODUCT_URL}`
        );

        console.log("Telegram alert sent");
      }
    } else {
      console.log("Still out of stock");

      alreadyInStock = false;
    }
  } catch (err) {
    console.error("Error:", err);
  }

  await browser.close();
}

console.log("Stock bot started...");

//deploy

await checkStock();

setInterval(checkStock, 60 * 1000);