const fs = require('fs');
const csv = require('csv-parser');

const vers = []

const writeToCSV = (vers) => {
    const filename = 'csv/versions.csv';

    fs.writeFile(filename, extractCSV(vers), err => {
        if (err) {
          console.log('Error writing to CSV', err);
        } else {
          console.log(`Saved as ${filename}`);
        }
      });
}

const extractCSV = (vers) => {
    console.log(vers);
    const headers = ['Placement ID', 'PBJS Version'];
    const rows = vers.map(item => 
        `${item.placement}, ${item.version}`
    );

    return headers.concat(rows).join('\n');
}

fs.createReadStream('csv/export.csv')
  .pipe(csv())
  .on('data', (row) => {
      try {
        let version = row.request_url.indexOf('&v=');
        let ref = row.request_url.indexOf('&r');
        let str = row.request_url.substring(version, ref).replace('&v=', '');

        if(!str.includes('%') && !str.includes('POST')) {
            const obj = {
                placement: row.placement_id,
                version: str
            }
            vers.push(obj);
        }
 
      } catch(err) {
          console.log(err);
      }

  }).on('end', () => {
      writeToCSV(vers);
      console.log('Completed CSV parse');
});