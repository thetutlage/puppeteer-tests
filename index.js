const puppeteer = require('puppeteer')
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/form')) {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('Reached')
  } else {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(`
      <form action="/form">
        <input type="text" name="username" />
        <button type="submit"> Submit </button>
      </form>
    `)
  }
}).listen(4000)

async function makeRequest () {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('http://localhost:4000')
  await page.$eval('form', (e) => e.submit())
  await page.waitForNavigation()
  const newContent = await page.content()
  console.log(newContent)
  await browser.close()
}

makeRequest()
.then(() => {
  server.close()
})
.catch((error) => {
  server.close()
  console.error(error)
})

