const fs = require('fs');
function randomWord() 
{
    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var word = '';
    for (var i = 0; i < 5; i++) {
      word += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return word;
  }

  function file_generator(numberFile, numberWords)
{
    for (let i = 0; i < numberFile; i++) 
    {
        let fileName = "fileNumber" + (i + 1) + ".txt";
        let content = "";
        for (let j = 0; j < numberWords; j++) {
            content += randomWord() + " ";
        }
        fs.writeFile(
        'created_files/'+fileName, 
        content, 
        function (err)
        {
            if (err){
                console.error(err);
            } 
            console.log('File created !');
        });

        console.log("file : " + fileName + " number of the words : " + numberWords);

        numberWords = numberWords * 2;
    }
}

file_generator(process.argv[2], process.argv[3]);