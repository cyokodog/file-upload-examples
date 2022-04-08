import express from 'express';
import fs from 'fs';
import qs from 'qs';

import fileUpload, { FileArray, UploadedFile } from 'express-fileupload';

const imageFilesBaseDir = '/public/images';
const port = process.env.PORT || 3000;
const app = express();
app.use(express.static(__dirname + '/public/'));

const simple_post1 = express();
simple_post1.post('/simple_post1', (req, res) => {
  console.log('req.body', req.body);
  let buffer = '';
  req.on('data', chunk => {
    buffer += chunk;
  });
  req.on('end', function () {
    console.log('buffer', buffer);
    const json = qs.parse(buffer);
    console.log(json);
    res.json(json);
  });
});
app.use(simple_post1);

const simple_post2 = express();
simple_post2.use(express.urlencoded({ extended: true }));
simple_post2.post('/simple_post2', (req, res) => {
  console.log('req.body', req.body);
  res.json(req.body);
});
app.use(simple_post2);

const multipart_post1 = express();
multipart_post1.post('/multipart_post1', (req, res) => {
  let buffer = '';
  req.on('data', chunk => {
    buffer += chunk;
  });
  req.on('end', function () {
    console.log('buffer', buffer);
    res.send(buffer);
  });
});
app.use(multipart_post1);

const saveFile = (dir: string, uploadedFile: UploadedFile): Promise<string> => {
  return new Promise(async resolve => {
    const path = dir + '/' + uploadedFile.name;
    await uploadedFile.mv(path);
    resolve(uploadedFile.name);
  });
};

const saveFiles = (dir: string, fileArray: FileArray | undefined): Promise<string[]> => {
  if (!fileArray) {
    return Promise.resolve([]);
  }
  let promises: Promise<string>[] = [];
  for (let key in fileArray) {
    const filesItem: UploadedFile | UploadedFile[] = fileArray[key];
    const newPromises =
      filesItem instanceof Array
        ? filesItem.map(uploadedFile => saveFile(dir, uploadedFile))
        : [saveFile(dir, filesItem)];
    promises = [...promises, ...newPromises];
  }
  return Promise.all(promises);
};

const multipart_post2 = express();
multipart_post2.use(fileUpload());
multipart_post2.post('/multipart_post2', async (req, res) => {
  console.log('req.body', req.body);
  console.log('req.files', req.files);
  const fileNames = await saveFiles(__dirname + imageFilesBaseDir, req.files);
  const html = fileNames
    .map(name => {
      return `<a href="images/${name}" target="_blank">${name}</a><br/>`;
    })
    .join('');
  res.send(html);
});
app.use(multipart_post2);

const octetStreamPost = express();
octetStreamPost.use(express.raw({ limit: '10mb' }));
octetStreamPost.post('/octet_stream_post', async (req, res) => {
  const uploadPath = __dirname + imageFilesBaseDir + '/' + req.query.fileName;
  console.log('req.body', req.body);

  await fs.writeFileSync(uploadPath, req.body);
  res.send(`<a href="images/${req.query.fileName}" target="_blank">${req.query.fileName}</a>`);
});

app.use(octetStreamPost);

const jsonPost = express();
jsonPost.use(express.json({ limit: '10mb' }));
jsonPost.post('/json_post', async (req, res) => {
  const match = req.body.base64.match(/data:image\/(.+);base64,(.+)/);
  const [, _extension, base64] = match;
  const buffer = Buffer.from(base64, 'base64');
  const { fileName } = req.body;
  const uploadPath = __dirname + imageFilesBaseDir + '/' + fileName;

  await fs.writeFileSync(uploadPath, buffer);
  const html = `<a href="images/${fileName}" target="_blank">${fileName}</a>`;
  res.send(html);
});
app.use(jsonPost);

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
