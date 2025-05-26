import multer from "multer";
import path from "path";

//configuracion  del almacenamiento

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/`); //carpeta donde se guarda los archivos
  },
  filename: (req, file, cb) => {
    const uniqyeSuffix = Date.now() + `-` + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.filename}- ${uniqyeSuffix}${ext}`);
  },
});

// Filtro para permitir solo ciertos tipos de archivo (opcional)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        `LIMIT_UNEXPECTED_FILE`,
        "Tipo de archivo no permitido"
      )
    );
  }
};

// Instancia de middelware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
