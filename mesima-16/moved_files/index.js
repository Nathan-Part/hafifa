const fs = require('fs');
const sourcePath = 'C:/Users/natou/Desktop/hafiffa-nathan/mesima-16/files_to_move/';
const destinationPath = 'C:/Users/natou/Desktop/hafiffa-nathan/mesima-16/moved_files/';

function listFilesAndFolders() {
    fs.readdir(sourcePath, (err, files) => {
        if(err){console.error(err);} 
        else 
        {
            file_mover(files);
        }
    });
}

function logFilesMoved(content)
{
    fs.writeFile('moved_files.txt', content, function (err){if(err)console.error(err)});
}

let newFile = []; // is a list for all of files 
let listFiles = []; // is a list juste for a files after the execution of the function

fs.watch(sourcePath, (eventType, filename) => {
    if(!newFile.includes(filename) && !listFiles.includes(filename)) // we check if the file is already in the new folder or not
    {
        listFiles = [];
        listFiles.push(filename);
        let fileList = listFiles.join(', ');
        logFilesMoved(fileList);
        file_mover(listFiles);
    }
});

function file_mover(files)
{
    for (let i = 0; i < files.length; i++) 
    {           
        let sourcePathComplet = sourcePath + files[i];
        let destinationPathComplet = destinationPath + files[i];
        newFile.push(files[i]);
        fs.rename(sourcePathComplet, destinationPathComplet, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(files[i] + " has been successfully transferred to moved_files");
            }
        });

    }
}

listFilesAndFolders();

// need to make a script that does a transfer from files_to_move to moved_files all a files and folder
    // for this we need firstly to check if we have file or folder in the folder files_to_move
    //and after we can move the files
// need to write in the console the name of a file or/and folder who was transfered

// need to make also a systeme for transfer a new files created after the execution of the function
// and write a name of file transfered in a new file "moved_files.txt" (but only the new files after the execution of the function)