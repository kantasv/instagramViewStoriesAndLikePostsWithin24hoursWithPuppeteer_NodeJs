const puppeteer = require('puppeteer');


(async () => {
    const browser = await puppeteer.launch({ headless: false });



    const page = await browser.newPage();

    // set user agent (override the default headless User Agent)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    // go to Google home page
    await page.goto('https://google.com');

    // get the User Agent on the context of Puppeteer
    const userAgent = await page.evaluate(() => navigator.userAgent);

    // If everything correct then no 'HeadlessChrome' sub string on userAgent
    await console.log(userAgent);

    await page.goto('https://www.instagram.com/');
    await page.screenshot({ path: "screenshot.png" });
    await console.log('logging in')




    //console setting
    page.on(`console`, msg => {
        for (let i = 0; i < msg._args.length; ++i) {
            console.log(`${i}: ${msg._args[i]}`);
        }
    });

    await page.waitFor('input[name=username]')
    await page.type('input[name=username]', '<your-instagram-id>')
    await page.type('input[name=password]', '<your-instagram-password>')
    await page.waitFor(2000)
    await page.keyboard.press("Enter");
    await page.waitFor(6000)
    await console.log('declining messages')

    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var declineButtons = [...document.querySelectorAll('button')].filter(elm => { return elm.innerText == '後で' })
            if (declineButtons.length) {
                declineButtons[0].click()
            }
            resolve(true)
        })

    })

    await page.waitFor(4000)

    await console.log('declining messages')
    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var declineButtons = [...document.querySelectorAll('button')].filter(elm => { return elm.innerText == '後で' })
            if (declineButtons.length) {
                declineButtons[0].click()
            }
            resolve(true)
        })

    })

    await page.waitFor('button[role=menuitem]')
    await console.log('started seeing stories')

    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            console.log('storybuttonexists:', document.querySelectorAll('button[role=menuitem]').length > 0)

            document.querySelectorAll('button[role=menuitem]')[1].click()

            var moveToNextStory = () => {
                if (document.querySelector('div[class=coreSpriteRightChevron]')) {
                    document.querySelector('div[class=coreSpriteRightChevron]').click()
                    console.log('1 story seen')
                } else {
                    console.log('all stories seen')
                    clearInterval(storyInterval)
                    resolve(true)
                }
            }
            var storyInterval = setInterval(moveToNextStory, 2000)
        });

    })
    await console.log('promise fulfilled')

    //postliker


    await page.waitFor(5000)
    await console.log('started liking posts within ** days')

    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var noLikesPreviousPage = false

            var scrollToBottom = () => {
                var element = document.documentElement;
                var bottom = element.scrollHeight - element.clientHeight;
                window.scroll(0, bottom);
            }

            var likeButtons
            likeButtons = () => {

                return [...document.querySelectorAll('svg[aria-label=いいね！]')].filter(elm => {
                    var postDescription = elm.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerText
                    var withinSec = postDescription.indexOf('秒前') != -1
                    var withinMin = postDescription.indexOf('分前') != -1
                    var withinHour = postDescription.indexOf('時間前') != -1
                    var withinDay = postDescription.indexOf('日前') != -1

                    return withinSec || withinMin || withinHour || withinDay
                }).map(elm => { return elm.parentNode })

            }

            setInterval(() => {

                if (likeButtons().length) {
                    //console.log(likeButtons().parentNode.parentNode.parentNode.innerText)
                    console.log('liked')
                    likeButtons()[0].click()
                    noLikesPreviousPage = false
                } else {
                    if (!noLikesPreviousPage) {
                        console.log('page scrolling..')
                        scrollToBottom()
                    } else if (noLikesPreviousPage) {
                        console.log('liked all recent posts')
                        resolve(true)
                    }
                    noLikesPreviousPage = true


                }
            }, 2300)

        })

    })
    await page.waitFor(3000)
    await browser.close()



})().catch(e => console.error(e));;

