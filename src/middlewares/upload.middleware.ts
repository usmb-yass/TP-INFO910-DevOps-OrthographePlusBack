import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv-safe';

dotenv.config();

// ───────────────────────────────
// UPLOAD AUDIO MIDDLEWARE
// ───────────────────────────────

export const audioDir = process.env.AUDIO_FILES_DIR || path.join(__dirname, '../../public/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, audioDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `question_audio_${crypto.randomUUID()}${ext}`;
        cb(null, filename);
    }
});

const audioFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers audios sont autorisés'));
    }
};

export const uploadAudioMiddleware = multer({
    storage: audioStorage,
    fileFilter: audioFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limite à 10 Mo
});

// ───────────────────────────────
// UPLOAD PROFILE PICTURE MIDDLEWARE
// ───────────────────────────────

export const profilePictureDir = process.env.PROFILE_PICTURE_FILES_DIR || path.join(__dirname, '../../public/profile-picture');

if (!fs.existsSync(profilePictureDir)) {
    fs.mkdirSync(profilePictureDir, { recursive: true });
}

const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilePictureDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `profile_picture_${crypto.randomUUID()}${ext}`;
        cb(null, filename);
    }
});

const profilePictureFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers images sont autorisés'));
    }
};

export const uploadProfilePictureMiddleware = multer({ 
    storage: profilePictureStorage,
    fileFilter: profilePictureFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5 Mo
});
