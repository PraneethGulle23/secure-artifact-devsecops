const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-256-cbc";
const masterKey = process.env.MASTER_ENCRYPTION_KEY;
const key = Buffer.from(process.env.FILE_ENCRYPTION_KEY, "utf-8");
// Encrypt File
exports.encryptFile = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    output.write(iv); // prepend IV to file

    input.pipe(cipher).pipe(output);

    output.on("finish", () => {
      fs.unlinkSync(inputPath); // delete original file
      resolve();
    });

    output.on("error", reject);
  });
};
// exports.encryptFile = (inputPath, outputPath) => {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(
//     algorithm,
//     Buffer.from(masterKey),
//     iv
//   );

//   const input = fs.createReadStream(inputPath);
//   const output = fs.createWriteStream(outputPath);

//   output.write(iv); // Save IV at start of file
//   input.pipe(cipher).pipe(output);
// };

// Decrypt File
exports.decryptFile = (inputPath, res, originalName) => {
  const fs = require("fs");

  const input = fs.createReadStream(inputPath);

  let iv;

  input.once("readable", () => {
    iv = input.read(16);

    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      iv
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${originalName}"`
    );

    input.pipe(decipher).pipe(res);
  });
};
// exports.decryptFile = (inputPath, outputPath) => {
//   const input = fs.readFileSync(inputPath);
//   const iv = input.slice(0, 16);
//   const encryptedData = input.slice(16);

//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     Buffer.from(masterKey),
//     iv
//   );

//   const decrypted = Buffer.concat([
//     decipher.update(encryptedData),
//     decipher.final(),
//   ]);

//   fs.writeFileSync(outputPath, decrypted);
// };