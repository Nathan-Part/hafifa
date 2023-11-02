const http = require("http");
const fs = require('fs');

const config = require('./config.json');
const dataPath = 'number.json';

const SERVER_PORT = process.env.SERVER_PORT || config.port;
const host = 'localhost';
const port = SERVER_PORT;

const requestListener = function(req, res) 
{
  const currentUrl = new URL(req.url, `http://${req.headers.host}`);
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
      if (currentUrl.pathname === '/api/numbers/prime/validate') 
      { 
        fs.readFile(dataPath, (err, data) => { if (err) throw err;
          var numbers = JSON.parse(data);
          if(body != "")
          {
            body = JSON.parse(body);
            if (Array.isArray(body)) 
            {
              console.log(isPrime(body));
              for (let i = 0; i < body.length; i++) {
                numbers.push(body[i]);
              }
            }
            else 
            {
              console.log(isPrime(body.number));
              numbers.push(body);
            }
          }
          const updatedData = JSON.stringify(numbers, null, 4);
          fs.writeFile(dataPath, `${updatedData}`, (err) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(updatedData);
          });
        });
      }
      else if(currentUrl.search != '')
      {
        const url2 = new URL(currentUrl);
        const n = url2.searchParams.get("amount");
        if(n > 0 && n < 33)
        {
          makeRequest().then(data => {
            const newList = data.filter(listNumber => isPrime(listNumber.number)).slice(0, n);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newList, null, 4));
          });          
        }
        else
        {
          res.writeHead(404);
          res.end("Parameter amount need to be between 1 and 32");
        }
      }
      else {
        res.writeHead(404);
        res.end('no data');
      }
  });
};

  const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

async function makeRequest()
{
  const response = await fetch(`http://localhost:8000/api/numbers/prime/validate`);
  const data = await response.json();
  return data;
}

function isPrime(number) 
{  
    if(Array.isArray(number))
    {
      for (let i = 0; i < number.length; i++) 
      {
        const element = number[i].number;
        if (element <= 1) return false;
        for (let j = 2; j < element; j++) 
        {
          if (element % j === 0) 
          {
            return false; 
          }
        }
      }
      return true;
    }
    else
    {
      if (number <= 1) return false;
      for (let i = 2; i < number; i++) 
      {
        if (number % i === 0) 
        {
          return false; 
        }
      }
      return true;
    }
   
}

// makeRequest().then(console.log);