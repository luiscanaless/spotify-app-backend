const https = require('https');

// Replace the URL with the image URL you want to convert to Base64
const imageUrl = 'https://www.example.com/image.jpg';

const imageUrlToBase64 = (imageUrl) => {
    return new Promise((resolve, reject) => {
        https.get(imageUrl, (response) => {
            const chunks = [];

            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                const imageData = Buffer.concat(chunks);
                const base64Data = imageData.toString('base64');

                // Calculate the size in KB
                const sizeInKB = (Buffer.byteLength(base64Data, 'base64') / 1024).toFixed(2);

                resolve({ base64Data, sizeInKB });
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
    });
};

module.exports = imageUrlToBase64