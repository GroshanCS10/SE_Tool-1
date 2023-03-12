// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const AdmZip = require('adm-zip');
// const fs = require('fs');

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
//     zip.extractAllTo(path.join(__dirname, '/', 'uploads', originalName.split('.')[0]));
//     //zip.extractAllTo(path.join(__dirname, '..', file.path,originalName.split('.')[0]));
//     // Delete the zip file after extraction
//     fs.unlinkSync(file.path);
//     return res.status(200).json({
//       message: 'Zip file extracted successfully',
//       originalName: originalName,
//       fileType: fileType,
//       filename: file.filename,
//       path: path.join(__dirname, '..', 'uploads', originalName.split('.')[0])
//     });
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
  if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
    const zip = new AdmZip(file.path);
    const zipEntries = zip.getEntries();
    let srcFolderPath;
    let cmakeFilePath;
    
    for (const zipEntry of zipEntries) {
      const entryPath = zipEntry.entryName.split('/');
      if (entryPath.includes('src')) {
        srcFolderPath = zipEntry.entryName;
      } else if (entryPath[entryPath.length - 1] === 'CMakeLists.txt') {
        cmakeFilePath = zipEntry.entryName;
      }
      if (srcFolderPath && cmakeFilePath) {
        break;
      }
    }
    
    if (srcFolderPath && cmakeFilePath) {
      zip.extractAllTo(path.join(__dirname, '/', 'uploads', originalName.split('.')[0]));
      // Delete the zip file after extraction
      fs.unlinkSync(file.path);
      const srcPath = path.join(__dirname, 'uploads', originalName.split('.')[0], srcFolderPath);
      const cmakePath = path.join(__dirname, 'uploads', originalName.split('.')[0], cmakeFilePath);

      // Execute the Python code as a child process
      const pythonProcess = spawn('python', ['SE_Parser.py', srcPath, cmakePath]);
      let output = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data;
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        return res.status(200).json({
          message: 'Zip file extracted successfully',
          originalName: originalName,
          fileType: fileType,
          filename: file.filename,
          srcPath: srcPath,
          cmakePath: cmakePath,
          output: output
        });
      });
    } else {
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
