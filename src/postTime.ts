import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Times } from './Times';

const jsonFilePath = path.join(__dirname, 'data.json');

export default (req: Request, res: Response, next: NextFunction) => {
  const data: Times = require(jsonFilePath);
  const { timeSpotted, timeAtDesk } = req.body;
  data.times = [...data.times, { timeSpotted, timeAtDesk }];

  fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8', () => {});
  res.redirect('/');
};
