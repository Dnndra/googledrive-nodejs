// index.js
const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = 3000;

// Obtener credenciales de OAuth 2.0 desde el archivo JSON descargado
const credentials = require('./credentials.json');
const drive = google.drive({ version: 'v3', auth: new google.auth.JWT(credentials.client_email, null, credentials.private_key, ['https://www.googleapis.com/auth/drive.file']) });

app.get('/', async (req, res) => {
  try {
    // Hacer la solicitud a la API
    const response = await axios.get('http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1');

    // Extraer los números aleatorios de la respuesta
    const randomNumbers = response.data;

    // Crear un archivo con los números aleatorios
    const content = "1139620";
    fs.writeFileSync(`${randomNumbers}.txt`, content);

    // Subir el archivo a Google Drive
    const responseDrive = await drive.files.create({
      requestBody: {
        name: `${randomNumbers}.txt`,
        mimeType: 'text/plain',
      },
      media: {
        mimeType: 'text/plain',
        body: fs.createReadStream('random_numbers.txt'),
      },
    });

    console.log('Archivo subido a Google Drive:', responseDrive.data);

    // Mostrar los números aleatorios en la respuesta de la aplicación
    res.send(`Números aleatorios: ${randomNumbers.join(', ')}`);
  } catch (error) {
    console.error('Error al obtener números aleatorios o subir archivo a Google Drive:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
