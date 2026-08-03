const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// file-type is ESM-only from v17 onward (this backend is plain
// CommonJS throughout) - load it via dynamic import, which Node
// supports from a CJS module. Cached after the first call.
let fileTypeFromFilePromise;
function getFileTypeFromFile() {
    if (!fileTypeFromFilePromise) {
        fileTypeFromFilePromise = import('file-type').then((mod) => mod.fileTypeFromFile);
    }
    return fileTypeFromFilePromise;
}

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const EXTENSION_BY_MIME = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

// Cheap first-pass filter on the client-reported Content-Type. This is
// NOT the security boundary - a renamed .exe can claim to be
// image/jpeg and this check alone won't catch it. It just avoids
// writing an obviously-wrong file to disk at all. validateUploadedImages
// below is the authoritative check, reading the file's actual magic
// bytes after multer has saved it.
const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Never trust the client's original filename - it can contain
        // path separators (e.g. "../../etc/passwd.jpg") or collide
        // with an existing file. Generate a fresh name; the real
        // extension gets assigned once validateUploadedImages below
        // has confirmed what the file actually is.
        cb(null, `${crypto.randomUUID()}.upload`);
    },
});

const upload = multer({ storage, fileFilter });

// Authoritative image-type check: reads each uploaded file's magic
// bytes (not the filename extension, not the client-supplied
// Content-Type) and rejects the whole request if any file isn't
// actually a jpeg/png/webp. Renames surviving files to reflect their
// real detected type.
async function validateUploadedImages(req, res, next) {
    const files = req.files || [];
    if (files.length === 0) {
        return next();
    }

    try {
        const fileTypeFromFile = await getFileTypeFromFile();

        for (const file of files) {
            const detected = await fileTypeFromFile(file.path);

            if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
                await Promise.all(files.map((f) => fs.promises.unlink(f.path).catch((err) => {
                    console.error(`Failed to remove rejected upload ${f.path}:`, err.message);
                })));
                return res.status(400).send({
                    message: 'One or more uploaded files is not a valid image (jpeg, png, or webp).',
                });
            }

            const finalPath = file.path.replace(/\.upload$/, EXTENSION_BY_MIME[detected.mime]);
            await fs.promises.rename(file.path, finalPath);
            file.path = finalPath;
            file.filename = path.basename(finalPath);
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { upload, validateUploadedImages };
