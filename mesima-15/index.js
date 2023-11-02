// console.log(process.env.JOKE_AMOUNT);
// console.log(process.env.JOKE_SUBJECT);

const fs = require('fs');
const env = require("env-var")
const oneLinerJoke = require('one-liner-joke');

const JOKE_AMOUNT = env.get("JOKE_AMOUNT").default(50).asInt()
const JOKE_SUBJECT = env.get("JOKE_SUBJECT").required().asString()

const allOfJokes = [];
if(JOKE_AMOUNT < 50)
{
    console.error('The amount of the joke is insufficient');
}
else
{
    var verifSubject = oneLinerJoke.getRandomJokeWithTag(JOKE_SUBJECT);
    if(verifSubject.tags.length === 0)
    {
        console.error('The subject seleted is not correct');
    }
    else
    {
        for (let i = 0; i < JOKE_AMOUNT; i++) {
            var getRandomJoke = oneLinerJoke.getRandomJokeWithTag(JOKE_SUBJECT);
            if(!allOfJokes.includes(getRandomJoke)) {
                allOfJokes.push(getRandomJoke.body);
            }
            else
            {
                console.log(i);
                i--;
            }
        }
    
        fs.writeFile(
        'aFunnyFiles.txt', 
        allOfJokes.join('\n\n'), 
        function (err)
        {
            if (err){ console.error(err); } 
            console.log('File created !');
        });
    }
}