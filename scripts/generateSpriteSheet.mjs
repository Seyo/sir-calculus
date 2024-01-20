import fs from 'fs'
import Jimp from 'jimp'

const folderPath = 'scripts/input/';
const folderPathOut = 'scripts/output/';

const generateWhiteOut = (image, alpha) => {
  const mask = image.clone()
  mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, function (x, y, idx) {
    const alphaOld = this.bitmap.data[idx + 3]
    if (alphaOld !== 0) {
      this.bitmap.data[idx + 0] = 255;
      this.bitmap.data[idx + 1] = 255;
      this.bitmap.data[idx + 2] = 255;
      this.bitmap.data[idx + 3] = alpha
    }
  });
  return mask
}

const handleImage = async (imgSrc, shadowOrig, idx) => {
  let image = await new Jimp(64 * 5, 64, 'transparent', (err, image) => {
    if (err) throw err;
  });
  Jimp.read(folderPath + imgSrc)
    .then((src) => {
      const cropped = src
        .contrast(0.1)
        .autocrop({ tolerance: 0 });

      if (imgSrc.includes('flip')) {
        cropped.flip(true, false)
      }

      //Remove white background
      cropped.scan(0, 0, cropped.bitmap.width, cropped.bitmap.height, function (x, y, idx) {
        var red = this.bitmap.data[idx + 0]
        var green = this.bitmap.data[idx + 1]
        var blue = this.bitmap.data[idx + 2]
        if (red === 255 && green === 255 && blue === 255) {
          this.bitmap.data[idx + 3] = 0;
        }
      });


      const firstWhite = generateWhiteOut(cropped, 200)
      const secondWhite = generateWhiteOut(cropped, 150)
      const thirdWhite = generateWhiteOut(cropped, 100)
      const forthWhite = generateWhiteOut(cropped, 50)

      const shadow = shadowOrig.clone()
      shadow.contain(cropped.bitmap.width, 10, Jimp.VERTICAL_ALIGN_BOTTOM)
      shadow.scan(0, 0, shadow.bitmap.width, shadow.bitmap.height, function (x, y, idx) {
        const alphaOld = this.bitmap.data[idx + 3]
        if (alphaOld >= 24) {
          this.bitmap.data[idx + 0] = 0;
          this.bitmap.data[idx + 1] = 0;
          this.bitmap.data[idx + 2] = 0;
          this.bitmap.data[idx + 3] = 80
        } else {
          this.bitmap.data[idx + 3] = 0
        }
      });

      const yOffset = Math.round(cropped.bitmap.width / 64 * 10 / 2)
      const yPlacement = 64 - cropped.bitmap.height - yOffset
      const xPlacement = (64 - cropped.bitmap.width) / 2



      image.blit(shadow, xPlacement + (64 * 0), 64 - 10)
      image.blit(shadow, xPlacement + (64 * 1) + 6, 64 - 10)
      image.blit(shadow, xPlacement + (64 * 2) + 4, 64 - 10)
      image.blit(shadow, xPlacement + (64 * 3) + 3, 64 - 10)
      image.blit(shadow, xPlacement + (64 * 4) + 1, 64 - 10)

      image.blit(cropped, xPlacement + (64 * 0), yPlacement)
      image.blit(cropped, xPlacement + (64 * 1) + 6, yPlacement)
      image.blit(cropped, xPlacement + (64 * 2) + 4, yPlacement)
      image.blit(cropped, xPlacement + (64 * 3) + 3, yPlacement)
      image.blit(cropped, xPlacement + (64 * 4) + 1, yPlacement)

      image.blit(firstWhite, xPlacement + (64 * 1) + 6, yPlacement)
      image.blit(secondWhite, xPlacement + (64 * 2) + 4, yPlacement)
      image.blit(thirdWhite, xPlacement + (64 * 3) + 3, yPlacement)
      image.blit(forthWhite, xPlacement + (64 * 4) + 1, yPlacement)

      return image
        .write(folderPathOut + 'mech_' + idx+'.png'); // save
    })
    .catch((err) => {
      console.error(err);
    });
}

// Read the contents of the folder
fs.readdir(folderPath, async (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  const shadow = await Jimp.read('scripts/shadow.png')
  files.map((file, idx) => {
    handleImage(file, shadow, idx)
  })
});