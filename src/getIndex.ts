import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { Time } from './Times';

const htmlFilePath = path.join(__dirname, 'index.html');
const jsonFilePath = path.join(__dirname, 'data.json');

export default (req: Request, res: Response) =>
  new Promise((resolve, reject) => {
    fs.readFile(htmlFilePath, (err, html) => {
      const data: Time[] = { ...require(jsonFilePath) }.times;

      if (err) reject(err);

      const DOM = new JSDOM(html);
      const doc = DOM.window.document;

      const table = doc.querySelector('#table');

      table.innerHTML =
        `
        <thead>
          <tr>
              <th scope="col">Time Spotted</th>
              <th scope="col">Time At Desk</th>
              <th scope="col">Time Difference</th>
          </tr>
        </thead>
        <tbody>` +
        data.reduce(
          (html, time) =>
            `
            ${html}
            <tr>
              <td>${time.timeSpotted}</td>
              <td>${time.timeAtDesk}</td>                            
              <td>${(() => {
                const hours: number =
                  Number(time.timeAtDesk.slice(0, 2)) -
                  Number(time.timeSpotted.slice(0, 2));

                const minutes =
                  Number(time.timeSpotted.slice(3, 5)) -
                  Number(time.timeAtDesk.slice(3, 5));

                return hours * 60 - minutes + ' minutes';
              })()}</td>                            
            </tr>`,
          ''
        ) +
        `</tbody>`;

      resolve(DOM.window.document.documentElement.outerHTML);
    });
  }).then(html => res.send(html));
