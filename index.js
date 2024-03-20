const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let tempInCelsius = orgVal.main.temp - 273.15;
    let tempMinInCelsius = orgVal.main.temp_min - 273.15;
    let tempMaxInCelsius = orgVal.main.temp_max - 273.15;

    let temperature = tempVal.replace("{%tempval%}", tempInCelsius.toFixed(0));
    temperature = temperature.replace("{%tempmin%}", tempMinInCelsius.toFixed(0));
    temperature = temperature.replace("{%tempmax%}", tempMaxInCelsius.toFixed(0));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}


const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=chandigarh&appid=609f40e66cc25bd1959951ffce8b5818',  )
.on('data', (chunk) =>{
    const objdata = JSON.parse(chunk);
    const arrData = [objdata]
    // console.log(arrData[0].main.temp)
    const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join("");
    res.write(realTimeData);
    })
.on('end', (err) => {
  if (err) return console.log('connection closed due to errors', err);
  res.end()
});
    }
});
server.listen(3000, "127.0.0.1")
