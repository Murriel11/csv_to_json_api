const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { parseCSV, parseData } = require('./csvParser');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

client.connect();

client.connect(err => {
   if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});
    
app.use(bodyParser.json());

app.post('/upload', async (req, res) => {
    try {
        const csvFilePath = process.env.CSV_FILE_PATH;
        const csvData = await parseCSV(csvFilePath);

        const formattedData = csvData.map(user => {
            return {
               "name": {
                    "firstName": user.firstName,
                    "lastName": user.lastName
                },
                "age": user.age,
                "address": {
                    "line1": user.line1,
                    "city": user.city,
                    "state": user.state
                    },
                "gender": user.gender
                };
            });

            console.log('JSON Format: ', formattedData)
            const parsedDataFilePath = './data/parsedData.json';
            fs.writeFileSync(parsedDataFilePath, JSON.stringify(formattedData, null, 2), 'utf8');
            console.log(`Formatted data saved to ${parsedDataFilePath}`);    

            for (const user of csvData) {

                const name = user.firstName + ' ' + user.lastName;
                const age = parseInt(user?.age, 10) || 0;
                const address = user.line1 + ', ' + user.city + ', ' + user.state;
                const additionalInfoJson = user.gender;
                
                await client.query(
                    'INSERT INTO users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)',
                    [
                        JSON.stringify(name),
                        age,
                        JSON.stringify(address),
                        JSON.stringify(additionalInfoJson)
                    ]
                );
            }
            const ageDistribution = await calculateAgeDistribution();
            console.log('Age Distribution:');
            console.table(ageDistribution);
    
            res.send('CSV file processed and data uploaded successfully.');
    } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function calculateAgeDistribution() {
    const result = await client.query('SELECT age FROM users');
    const ageGroups = {
        '< 20': 0,
        '20 to 40': 0,
        '40 to 60': 0,
        '> 60': 0
    };
    
    result.rows.forEach(row => {
        const age = row.age;
        if (age < 20) {
            ageGroups['< 20']++;
        } else if (age <= 40) {
            ageGroups['20 to 40']++;
        } else if (age <= 60) {
            ageGroups['40 to 60']++;
        } else {
            ageGroups['> 60']++;
        }
    });

    const total = result.rows.length;
    const ageDistribution = [
        { 'Age-Group': '< 20', '% Distribution': (ageGroups['< 20'] / total) * 100 },
        { 'Age-Group': '20 to 40', '% Distribution': (ageGroups['20 to 40'] / total) * 100 },
        { 'Age-Group': '40 to 60', '% Distribution': (ageGroups['40 to 60'] / total) * 100 },
        { 'Age-Group': '> 60', '% Distribution': (ageGroups['> 60'] / total) * 100 }
    ];
    
    return ageDistribution;
}
    
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
    