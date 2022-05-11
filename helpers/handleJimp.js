const jimp = require("jimp");

async function handleJimp(imagePath) {
  const image = await jimp.read(imagePath);
  await image.resize(250, 250);
  await image.writeAsync(imagePath);
}

module.exports = handleJimp;
