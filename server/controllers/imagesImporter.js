import path from "path";

import { deleteFiles, getSortedFiles, moveFile } from "../global/Files.js";
import HttpResponseWrapper from "../global/HttpResponseWrapper.js";
import { bindImagesToMolecules } from "../global/ImageFileImporter.js";
import { analyseImageFilenames } from "../global/ImageFilesAnalyzer.js";
import Logger, { addErrorTitle } from "../global/Logger.js";
import { normalizeDCI } from "../global/molecules_analyzer/moleculesAnalyzer.js";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "svg"];
const IMAGES_DIR_PATH = path.resolve("files", "images");

function importImages(req, _res) {
  const res = new HttpResponseWrapper(_res);

  if (req.files.length === 0) {
    return res.sendUsageError(400, "Fichiers manquants");
  }
  const { confirmed } = req.body;
  const ogNames = req.files.map((f) => f.originalname);

  const deleteUploadedFiles = () =>
    deleteFiles(...req.files.map((f) => f.path)).catch(Logger.error);

  const invalidFileFormats = ogNames.filter(
    (f) => !new RegExp(`\\.${IMAGE_EXTENSIONS.join("|")}$`, "ig").test(f)
  );

  if (invalidFileFormats.length > 0) {
    res.sendUsageError(
      400,
      `Format invalide (uniquement ${IMAGE_EXTENSIONS.join(", ")}) : "${invalidFileFormats.join(
        '", "'
      )}"`
    );
    deleteUploadedFiles();
    return;
  }

  const sendServerError = (error, title) => {
    res.sendServerError(addErrorTitle(error, title));
    deleteUploadedFiles();
  };

  if (confirmed === "true") {
    bindImagesToMolecules(ogNames)
      .then((imported) => {
        getSortedFiles(IMAGES_DIR_PATH)
          .then((files) =>
            deleteFiles(...files.map((f) => path.resolve(IMAGES_DIR_PATH, f)))
              .then(() =>
                Promise.all(
                  imported.map((file) => {
                    const filepath = req.files.find((f) => f.originalname === file).path;
                    return moveFile(filepath, path.resolve(IMAGES_DIR_PATH, normalizeDCI(file)));
                  })
                )
                  .then(() => {
                    res.sendResponse(201, {
                      message: "Images imported",
                      warnings: [],
                      imported: true,
                    });
                    deleteFiles(
                      ...req.files
                        .filter((f) => !imported.includes(f.originalname))
                        .map((f) => f.path)
                    ).catch(Logger.error);
                  })
                  .catch((error) => sendServerError(error, "Can't move images"))
              )
              .catch((error) => sendServerError(error, "Can't delete old images"))
          )
          .catch((error) => sendServerError(error, "Can't get files"));
      })
      .catch((error) => sendServerError(error, "Can't update images in database"));
  } else {
    analyseImageFilenames(ogNames)
      .then((warnings) =>
        res.sendResponse(202, {
          message: "Images tested but not imported ",
          warnings,
          imported: false,
        })
      )
      .catch((error) => sendServerError(error, "Can't analyze images"));
    deleteUploadedFiles();
  }
}

function getLastImportedFile() {}

export default { importImages, getLastImportedFile };