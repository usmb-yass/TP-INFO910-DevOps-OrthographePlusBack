import dotenvSafe from 'dotenv-safe';
dotenvSafe.config();

import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';

import apiRoutes from './routes';
import { helmetConfig, corsConfig } from './config/security';
import { apiLimiter } from './middlewares/rate-limiter';
import { setupLogs, logger } from './config/logger';

const app = express();
const PORT = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;

app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(apiLimiter);
app.use(express.json());

// Initialisation des logs
setupLogs(app);

// Point d'entrée de l'API
app.use('/v1', apiRoutes);

// ───────────────────────────────
// DÉVELOPPEMENT LOCAL UNIQUEMENT
// Ces routes ne sont créées et utilisées qu'en développement local pour éviter de devoir installer et configurer nginx en local

// Cette route permet de servir les fichiers audios afin de mimer le comportement du VPS
if (process.env.AUDIO_FILES_DIR) {
  app.use('/audio', express.static(process.env.AUDIO_FILES_DIR));
}
// cette route permet de servir les photos de profil afin de mimer le comportement du VPS
if (process.env.PROFILE_PICTURE_FILES_DIR) {
  app.use('/profile-picture', express.static(process.env.PROFILE_PICTURE_FILES_DIR));
}
// ───────────────────────────────

// Connexion à MongoDB
mongoose.connect(mongoUri!)
  .then(() => {
    logger.info('Connexion réussie à MongoDB');
  })
  .catch((err) => {
    // par défaut, mongoose réessaye de se connecter à la BDD pendant 30 secondes avant de renvoyer une erreur
    logger.error('Erreur de connexion à MongoDB :', err);
  });

// Événements de cycle de vie de la connexion
// Écouter l'erreur
mongoose.connection.on('error', (err) => {
  logger.error('Erreur de connexion active à MongoDB :', err);
});
// Écouter la déconnexion
mongoose.connection.on('disconnected', () => {
  logger.warn('Connexion perdue avec MongoDB');
});
// Écouter la reconnexion
mongoose.connection.on('reconnected', () => {
  logger.info('Reconnexion réussie à MongoDB');
});


app.get('/health-check', (req, res) => {
  res.status(200).send('OK');
});

// probe readiness : vérifie que la connexion MongoDB est active
app.get('/healthz', (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).send(ready ? 'OK' : 'NOT READY');
});

app.listen(PORT, () => {
  logger.info(`Serveur lancé sur le port ${PORT}`);
});
