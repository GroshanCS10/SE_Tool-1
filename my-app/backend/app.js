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
    let containsCppFiles = false;
    for (let i = 0; i < zipEntries.length; i++) {
      const zipEntry = zipEntries[i];
      if (zipEntry.entryName.endsWith('.cpp')) {
        containsCppFiles = true;
        break;
      } else if (zipEntry.entryName.endsWith('.java')) {
        // Reject zip folder if it contains Java files
        fs.unlinkSync(file.path);
        return res.status(400).send('Zip folder contains Java files');
      }
    }
    if (containsCppFiles) {
      zip.extractAllTo(path.join(__dirname, '/', 'uploads', originalName.split('.')[0]));
      // Delete the zip file after extraction
      fs.unlinkSync(file.path);
      return res.status(200).json({
        message: 'Zip file extracted successfully',
        originalName: originalName,
        fileType: fileType,
        filename: file.filename,
        path: path.join(__dirname, '..', 'uploads', originalName.split('.')[0])
      });
    } else {
      // Reject zip folder if it does not contain C++ files
      fs.unlinkSync(file.path);
      return res.status(400).send('Zip folder does not contain C++ files');
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
