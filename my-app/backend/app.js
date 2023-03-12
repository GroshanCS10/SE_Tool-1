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
// changed now
// const antlr4 = require('antlr4');
// const CPP14Lexer = require('./CPP14Lexer');
// const CPP14Parser = require('./CPP14Parser');
// const CPP14Listener = require('./CPP14Listener').CPP14Listener;

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




// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const AdmZip = require('adm-zip');
// const fs = require('fs');
// const antlr4 = require('antlr4');
// const CPP14Lexer = require('./CPP14Lexer');
// const CPP14Parser = require('./CPP14Parser');
// const CPP14Listener = require('./CPP14Listener').CPP14Listener;

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
//     zip.extractAllTo(path.join(__dirname, 'uploads', originalName.split('.')[0]));
//     // Delete the zip file after extraction
//     fs.unlinkSync(file.path);
//     const filesPath = path.join(__dirname, 'uploads', originalName.split('.')[0]);
//     const files = fs.readdirSync(filesPath);
//     const cppFiles = files.filter((filename) => path.extname(filename) === '.cpp');
//     const dependencies = {};

//     cppFiles.forEach((filename) => {
//       const input = fs.readFileSync(path.join(filesPath, filename)).toString();
//       const chars = new antlr4.InputStream(input);
//       const lexer = new CPP14Lexer.CPP14Lexer(chars);
//       const tokens = new antlr4.CommonTokenStream(lexer);
//       const parser = new CPP14Parser.CPP14Parser(tokens);
//       parser.buildParseTrees = true;
//       const tree = parser.translationunit();
//       const listener = new CPP14Listener();
//       antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
//       const includes = listener.includes;
//       dependencies[filename] = includes;
//     });

//     return res.status(200).json({
//       message: 'Zip file extracted successfully',
//       originalName: originalName,
//       fileType: fileType,
//       filename: file.filename,
//       path: filesPath,
//       dependencies: dependencies,
//     });
//   } else {
//     return res.status(200).json({
//       message: 'File uploaded successfully',
//       originalName: originalName,
//       fileType: fileType,
//       filename: file.filename,
//       path: path.join(__dirname, 'uploads', file.filename),
//     });
//   }
// });

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
