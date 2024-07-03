const fs = require('fs');
const readline = require('readline');
const csv = require('csv-parser');

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const parsedData = parseData(data);
                // console.log('Raw CSV Data:', data); // Debugging line to check raw CSV data
                // console.log('Parsed Data:', parsedData); // Debugging line to check parsed data structure
                results.push(parsedData);
            })
            .on('end', () => {
                console.log('CSV parsed successfully');
                resolve(results);
            })
            .on('error', (error) => {
                console.error('Error parsing CSV file:', error);
                reject(error);
            });
    });
}


function parseData(data) {
    const parsedData = {};
    for (const key in data) {
        const keys = key.split('.');
        let current = parsedData;
        while (keys.length > 1) {
            const subKey = keys.shift();
            if (!current[subKey]) current[subKey] = {};
            current = current[subKey];
        }
        current[keys[0]] = data[key];
    }
    return parsedData;
}


module.exports = { parseCSV, parseData };


