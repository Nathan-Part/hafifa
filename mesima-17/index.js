const fs = require('fs');

function deleteFile(name)
{
    fs.unlink(name, (err) => {
        if (err) throw err;
        console.log("the file has been successfully deleted");
        console.log('(to return to menu press 0)');
     });
}

function createFile(name)
{
    fs.writeFile(name, "Writing content", (err) => {
        if (err) throw err;
        console.log("the file has been successfully created");
        console.log('(to return to menu press 0)');
     });
}

function writeOnFile(name, text)
{
    fs.writeFile(name, text, (err) => {
        if (err) throw err;
        console.log("the file has been successfully written");
        console.log('(to return to menu press 0)');
     });
}

function createFolder(name)
{
    fs.mkdir(name, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('the folder has been successfully created');
            console.log('(to return to menu press 0)');
        }
    });
}

function deleteFolder(name)
{
    fs.rm(name, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('the folder has been successfully deleted');
          console.log('(to return to menu press 0)');
        }
      });
}

function createFileOnFolder(nameOfFolder, nameOfFile)
{
    const sourcePath = 'C:/Users/natou/Desktop/hafiffa-nathan/mesima-17/';
    fs.readdir(sourcePath, (err, files) => {
        if(err){console.error(err);} 
        else if(files.includes(nameOfFolder)) 
        {
            fs.writeFile(nameOfFolder + "/" + nameOfFile, "", (err) => {
                if (err) throw err;
                console.log("the files has been successfully created on the folder : " + nameOfFolder);
                console.log('(to return to menu press 0)');
            });
        }
        else
        {
            createFolder(nameOfFolder);
            fs.writeFile(nameOfFolder + "/" + nameOfFile, "", (err) => {
                if (err) throw err;
                console.log("the files has been successfully created on the folder : " + nameOfFolder);
                console.log('(to return to menu press 0)');
             });
        }
    });
}

function deleteFileOnFolder(nameOfFolder, nameOfFile)
{
    fs.unlink(nameOfFolder + "/" + nameOfFile, (err) => {
        if (err) throw err;
        console.log("the file has been successfully deleted on the folder : " + nameOfFolder);
     });
}

function mergeFiles(file1, file2)
{  
    fs.readFile(file1, 'utf8', (err, data) => 
    {
        if (err) 
        {
            console.error(err);
        } 
        fs.readFile(file2, 'utf8', (err2, data2) => 
        {
            if (err2) 
            {
                console.error(err2);
            }
            let merge = data + " " + data2;
            fs.writeFile(file1, merge, (err3) => 
            {
                if (err3) 
                {
                    console.error(err3);
                } 
                else
                {
                    console.log('the files has been successfully merged');
                }

                fs.unlink(file2, (err4) => 
                {
                    if (err4) 
                    {
                        console.error(err4);
                    }
                });
            });
        });
    });
}

function main()
{
    console.log("*-----------------------------------------------*");
    console.log("*   Hi welcome to the main menu                 *");
    console.log("*   1. Delete a file with a given name          *");
    console.log("*   2. Create a file with a given name          *");
    console.log("*   3. Write text to a file with a given name   *");
    console.log("*   4. Create a folder with a given name        *");
    console.log("*   5. Delete a folder with a given name        *");
    console.log("*   6. Create a file in a folder                *");
    console.log("*   7. Delete a file in a folder                *");
    console.log("*   8. Merge files                              *");
    console.log("*   9. Quit                                     *");   
    console.log("*-----------------------------------------------*");
}

main();

let step2 = false;
let userInput = "";
let [arg1, arg2] = "";
process.stdin.resume();

process.stdin.on('data', (data) => {
    if(!step2)
    {
        userInput = data.toString().trim();
        const choices = {
            '1': 'Your choice: Delete a file with a given name',
            '2': 'Your choice: Create a file with a given name',
            '3': 'Your choice: Write text to a file with a given name\nsyntax: name, text',
            '4': 'Your choice: Create a folder with a given name',
            '5': 'Your choice: Delete a folder with a given name',
            '6': 'Your choice: Create a file in a folder\nsyntax: name of folder, name of file',
            '7': 'Your choice: Delete a file in a folder\nsyntax: name of folder, name of file',
            '8': 'Your choice: Merge files\nsyntax: file1, file2',
            '9': 'Bye bye!',
            'default': 'Unknown command'
        };

        console.log(choices[userInput] || choices['default']);
        if(userInput == 9) process.exit();
        if(choices[userInput] == undefined) main();
        else
        {
            console.log('(to return to menu press 0)');
            step2 = true;
        }
    }
    else
    {
        const newData = data.toString().trim();
        [arg1, arg2] = newData.split(/ (.+)/);
        if(newData == 0)
        {
            step2 = false;
            main();
        }
        else
        {
            switch (userInput) 
            {
                case '1':
                    deleteFile(arg1);
                    break;
                case '2':
                    createFile(arg1);
                    break;
                case '3':
                    writeOnFile(arg1, arg2);
                    break;
                case '4':
                    createFolder(arg1);
                    break;
                case '5':
                    deleteFolder(arg1);
                    break;
                case '6':
                    createFileOnFolder(arg1, arg2);
                    break;
                case '7':
                    deleteFileOnFolder(arg1, arg2);
                    break;
                case '8':
                    mergeFiles(arg1, arg2);
                    break;
            }
        }
    }
});
  
// faire le merge

