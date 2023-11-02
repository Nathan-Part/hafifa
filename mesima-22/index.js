const express = require('express');
const app = express();
app.use(express.json());
const fs = require('fs');

const config = require('./config.json');
const dataPath = 'number.json';

const port = process.env.SERVER_PORT || config.port;

app.post('/api/numbers/prime/display', (req, res) => {
    const body = req.body;
    console.log(isPrime(body)); // return true if the number is prime and false if not
    fs.readFile(dataPath, (err, data) => { if (err) throw err;
        var numbers = JSON.parse(data);
        if (Array.isArray(body)) {
            for (let i = 0; i < body.length; i++) {
              numbers.push(body[i]);
            }
        }
        else {numbers.push(body);}
        const updatedData = JSON.stringify(numbers, null, 4);
        fs.writeFile(dataPath, `${updatedData}`, (err) => {
            if (err) throw err;
            res.send(JSON.parse(updatedData));
        });
    });
});

//route avec variable
app.get('/api/numbers/prime/display/:amount', (req, res) => {
    const n = req.params.amount;
    fs.readFile(dataPath, (err, data) => { if (err) throw err;
        var numbers = JSON.parse(data);
        const newList = numbers.filter(listNumber => isPrime(listNumber.number)).slice(0, n);
        res.send(newList);
    });
});

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

app.listen(port, () => {
    console.log('the server has been started on the port : ' + port);
  });
  