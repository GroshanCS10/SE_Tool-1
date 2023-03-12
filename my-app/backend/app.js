// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const AdmZip = require('adm-zip');
// const fs = require('fs');
// const { spawn } = require('child_process');

// const app = express();

// // Create a storage object with diskStorage
// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// app.post('/api/upload', upload.single('file'), (req, res) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).send('No file uploaded');
//   }
//   const originalName = file.originalname;
//   const fileType = file.mimetype;
//   console.log(fileType)
//   if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
//     console.log(fileType)
//     const zip = new AdmZip(file.path);
//     const zipEntries = zip.getEntries();
//     // let srcFolderPath;
//     // let cmakeFilePath;
    
//     // for (const zipEntry of zipEntries) {
//     //   const entryPath = zipEntry.entryName.split('/');
//     //   if (entryPath.includes('src')) {
//     //     srcFolderPath = zipEntry.entryName;
//     //   } else if (entryPath[entryPath.length - 1] === 'CMakeLists.txt') {
//     //     cmakeFilePath = zipEntry.entryName;
//     //   }
//     //   if (srcFolderPath && cmakeFilePath) {
//     //     break;
//     //   }
//     // }
    
//     // if (srcFolderPath && cmakeFilePath) {
//       zip.extractAllTo(path.join(__dirname, '/', 'uploads', originalName.split('.')[0]));
//       // Delete the zip file after extraction
//       fs.unlinkSync(file.path);
//       // const srcPath = path.join(__dirname, 'uploads', originalName.split('.')[0], srcFolderPath);
//       // const cmakePath = path.join(__dirname, 'uploads', originalName.split('.')[0], cmakeFilePath);
//       const projectpath = path.join(__dirname, '/', 'uploads', originalName.split('.')[0])

//       // Execute the Python code as a child process
//       //const pythonProcess = spawn('python', ['temp.py', srcPath, cmakePath]);
//       const pythonProcess = spawn('python', ['temp.py',projectpath]);
//       let output = '';

//       pythonProcess.stdout.on('data', (data) => {
//         output += data;
//       });

//       pythonProcess.stderr.on('data', (data) => {
//         console.error(`stderr: ${data}`);
//       });

//       pythonProcess.on('close', (code) => {
//         console.log(`child process exited with code ${code}`);
//         const projectPath = path.join(__dirname, 'uploads', originalName.split('.')[0]);
//         const observationsPath = path.join(__dirname, 'observations.json');
      
//         fs.readFile(observationsPath, (err, data) => {
//           if (err) {
//             console.error(`Error reading observations file: ${err}`);
//             return res.status(500).json({
//               message: 'Error reading observations file',
//             });
//           }
      
//           const observations = JSON.parse(data);
          
//           return res.status(200).json({
//             message: 'Zip file extracted successfully',
//             originalName: originalName,
//             fileType: fileType,
//             filename: file.filename,
//             projectPath: projectPath,
//             observations: observations,
//           });
//         });
//       });
      
//     // } else {
//     //   return res.status(400).json({
//     //     message: 'Zip file does not contain the required files',
//     //   });
//     // }
//   } else {
//     return res.status(200).json({
//       message: 'File uploaded successfully',
//       originalName: originalName,
//       fileType: fileType,
//       filename: file.filename,
//       path: path.join(__dirname, '..', file.path),
//     });
//   }
// });

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });




const express = require('express');
const multer = require('multer');
const path = require('path');
const AdmZip = require('adm-zip');
const fs = require('fs');
const { spawn } = require('child_process');
const app = express();

// Create a storage object with diskStorage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }
  const originalName = file.originalname;
  const fileType = file.mimetype;
  console.log(fileType)
  if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
    console.log(fileType)
    const zip = new AdmZip(file.path);
    const zipEntries = zip.getEntries();
    //let srcFolderPath;
    //let cmakeFilePath;
    //cc
    let containsCppFiles = false;
    for (let i = 0; i < zipEntries.length; i++) {
      const zipEntry = zipEntries[i];
      if (zipEntry.entryName.endsWith('.cpp')) {
        containsCppFiles = true;
        break;
      } else if (zipEntry.entryName.endsWith('.java')) {
        // Reject zip folder if it contains Java files
        //fs.unlinkSync(file.path);
        //return res.status(400).send('Zip folder contains Java files');
        containsCppFiles = false;
      }
      else if (zipEntry.entryName.endsWith('.py')){
        //fs.unlinkSync(file.path);
        //return res.status(400).send('Zip folder contains Python files');
        containsCppFiles = false;
      }
    }
      // cc
    // for (const zipEntry of zipEntries) {
    //   const entryPath = zipEntry.entryName.split('/');
    //   if (entryPath.includes('src')) {
    //     srcFolderPath = zipEntry.entryName;
    //   } else if (entryPath[entryPath.length - 1] === 'CMakeLists.txt') {
    //     cmakeFilePath = zipEntry.entryName;
    //   }
    //   if (srcFolderPath && cmakeFilePath) {
    //     break;
    //   }
    // }
    
    if (containsCppFiles) {
      zip.extractAllTo(path.join(__dirname, '/', 'uploads', originalName.split('.')[0]));
      // Delete the zip file after extraction
      fs.unlinkSync(file.path);
      //const srcPath = path.join(__dirname, 'uploads', originalName.split('.')[0], srcFolderPath);
      //const cmakePath = path.join(__dirname, 'uploads', originalName.split('.')[0], cmakeFilePath);
      const projectpath = path.join(__dirname, '/', 'uploads', originalName.split('.')[0])
      // Execute the Python code as a child process
      const pythonProcess = spawn('python', ['temp.py', projectpath]);
      let output = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data;
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        const projectPath = path.join(__dirname, 'uploads', originalName.split('.')[0]);
        const observationsPath = path.join(__dirname, 'observations.json');

        fs.readFile(observationsPath, (err, data) => {
          if (err) {
            console.error(`Error reading observations file: ${err}`);
            return res.status(500).json({
              message: 'Error reading observations file',
            });
          }
      
          const observations = JSON.parse(data);
        return res.status(200).json({
          message: 'Zip file extracted successfully',
          originalName: originalName,
          fileType: fileType,
          filename: file.filename,
          projectPath: projectpath,
          observations: observations,
          //srcPath: srcPath,
          //cmakePath: cmakePath,
          //output: output
        });
      });
    });
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        message: 'Zip file does not contain the required files',
      });
    }
  } else {
    return res.status(200).json({
      message: 'File uploaded successfully',
      originalName: originalName,
      fileType: fileType,
      filename: file.filename,
      path: path.join(__dirname, '..', file.path),
    });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});