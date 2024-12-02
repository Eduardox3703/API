import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/get-tiktok-profile', async (req, res) => {
    const { profileUrl } = req.body;

    if (!profileUrl || !profileUrl.includes('@')) {
        return res.status(400).send({ error: 'URL de perfil inválida' });
    }

    const USER_ID = profileUrl.split('@')[1].split('?')[0];

    try {
        const TIKTOK_API_URL = `https://api.tiktok.com/v1/user/profile`;

        const response = await fetch(`${TIKTOK_API_URL}?user_id=${USER_ID}`);
        if (!response.ok) {
            throw new Error(`Error en la API de TikTok: ${response.statusText}`);
        }

        const data = await response.json();

        const formattedData = {
            username: data.username || 'Desconocido',
            followers: data.followers || 0,
            bio: data.bio || 'Sin biografía',
        };

        res.send(formattedData);
    } catch (error) {
        res.status(500).send({
            error: 'Error al obtener el perfil de TikTok',
            details: error.message,
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
