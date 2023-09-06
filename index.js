import puppeteer from "puppeteer";
import * as fs from 'fs'


//const url = 'https://elbadrgroupeg.store/cpu'
//const url = 'https://elbadrgroupeg.store/index.php?route=product/category&path=107_20&page='
const url = 'https://elbadrgroupeg.store/cpu'
const urlPages = 'https://elbadrgroupeg.store/index.php?route=product/category&path=107_20&page='


const resources = ['cpu', 'bundles', 'motherboard', 'cases', 'cooling', 'power-supply', 'ram', 'hdd', 'vga', 'laptop', 'accessories', 'monitors']


const products = []

const main = async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        ignoreDefaultArgs: ['--disable-extensions'],
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    //go to page 
    let pageNum = 1
    // await page.screenshot({ path: 'screenshot.png' })

    console.log('start scraping...')
    await page.goto(url);


    while (await page.$('.main-products') != null) {
        // while (pageNum == 1) {
        await console.log('scraping page ' + pageNum + '...')

        // Wait until the element with the ID `my-element` is visible.
        await page.waitForSelector('.stats  ', { visible: true });


        const pageProducts = await page.evaluate(() => {
            //check if there are products on the page
            const products = document.querySelectorAll('.product-layout')

            return Array.from(products).slice(0, 12).map((product) => {
                const stock = product.classList.contains('out-of-stock') ? 'out-of-stock' : 'in-stock'
                const url = product.querySelector('.product-img').getAttribute('href');

                const title = product.querySelector('.name').querySelector
                    ('a').innerText;



                const price = product.querySelector('.price-normal') != null ? product.querySelector('.price-normal').innerText : ''



                const image = product.querySelector('img').getAttribute
                    ('src')
                const manufacturar = product.querySelector('.stat-1') != null ? product.querySelector('.stat-1 > :nth-child(2)').querySelector('a').innerText : ''

                return { stock, url, title, price, image, manufacturar }
            })
        })


        await console.log('page ' + pageNum + ' products: ', pageProducts.length, ' product')
        await products.push(...pageProducts)
        await pageNum++
        await page.goto(urlPages + pageNum)

    }



    //close browser
    await browser.close()

    await console.log('Here is All products: ')
    await console.log(products)
    await console.log('Number of products been scraped: ', products.length)

    //add products to json file
    const jsonProducts = await JSON.stringify(products)
    await fs.writeFile('./cpus.json', jsonProducts, err => {
        if (err) {
            console.log(err)
        } else {
            console.log('File saved successfully')
        }
    })
}

main();


