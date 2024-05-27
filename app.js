// app.js

// Configura AWS S3
AWS.config.update({
    accessKeyId: '', 
    secretAccessKey: '',
    sessionToken: '',
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = '';

// Función para subir archivos
document.getElementById('upload-button').addEventListener('click', () => {
    const files = document.getElementById('file-upload').files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const params = {
            Bucket: bucketName,
            Key: file.name,
            Body: file,
            ACL: 'public-read' // Para hacer las imágenes públicamente accesibles
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error subiendo el archivo:', err);
            } else {
                console.log('Archivo subido con éxito:', data.Location);
                mostrarImagenEnGaleria(data.Location);
            }
        });
    }
});

// Función para mostrar imágenes en la galería
function mostrarImagenEnGaleria(url) {
    const gallery = document.getElementById('gallery');
    const img = document.createElement('img');
    img.src = url;
    gallery.appendChild(img);
}

// Función para cargar las imágenes del bucket al iniciar la página
function cargarImagenes() {
    const params = {
        Bucket: bucketName
    };

    s3.listObjects(params, (err, data) => {
        if (err) {
            console.error('Error obteniendo objetos:', err);
        } else {
            const objects = data.Contents;
            objects.forEach(obj => {
                const url = `https://${bucketName}.s3.amazonaws.com/${obj.Key}`;
                mostrarImagenEnGaleria(url);
            });
        }
    });
}

// Cargar imágenes al cargar la página
document.addEventListener('DOMContentLoaded', cargarImagenes);
