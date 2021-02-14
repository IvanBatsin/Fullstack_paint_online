import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();
import path from 'path';
import fs from 'fs';
import { rooms } from './app';

router.get('/image', async (req: Request, res: Response) => {
  try {
    const {session} = req.query;
    fs.readFile(path.join(__dirname, './files', `${session}.jpg`), (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      const file = `data:image/png;base64,${data.toString('base64')}`;
      res.json(file);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('error');
  }
});

router.post('/image', async (req: Request, res: Response) => {
  try {
    const data: string = req.body.dataUrl.replace('data:image/png;base64', '');
    const session: string = req.body.session;
    fs.writeFile(path.join(__dirname, './files', `${session}.jpg`), data, 'base64', (err) => {
      if (err) return res.status(500).send();
    });
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).json('error');
  }
});

router.get('/clear', (req: Request, res: Response) => {
  const session = req.query.session;
  try {
    fs.unlink(path.join(__dirname, './files', `${session}.jpg`), err => {
      if (err) {
        return res.status(500).send();
      }
      res.send();
    });
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/auth', async (req: Request, res: Response) => {
  try {
    const {username, session} = req.body;
    if (!username) return res.status(500).json({message: 'Name is empty'});

    if (rooms[session]){
      const condidate = rooms[session]!.find(item => item.username === username);
      if (condidate) return res.status(403).json({message: 'Name already exist'});
    }
     
    session ? res.json({session}) : res.json({session: `f${(+new Date).toString(16)}`});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'server error'
    });
  }
});

export { router };