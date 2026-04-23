const { MultiFormatReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource, BarcodeFormat, DecodeHintType } = require('@zxing/library');
const sharp = require('sharp');

async function testBarcodeCrop(path) {
  try {
    const metadata = await sharp(path).metadata();
    
    // crop bottom 25% of the image, full width
    const top = Math.floor(metadata.height * 0.75);
    const height = metadata.height - top;
    
    const { data, info } = await sharp(path)
      .extract({ left: 0, top, width: metadata.width, height })
      .grayscale() // Convert to grayscale
      .normalize() // Normalize to enhance contrast
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const arr = new Uint8ClampedArray(data.buffer);
    const luminanceSource = new RGBLuminanceSource(arr, info.width, info.height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128, BarcodeFormat.CODE_39]);

    const reader = new MultiFormatReader();
    const result = reader.decode(binaryBitmap, hints);
    console.log("Barcode Result from Cropped:", result.getText());
  } catch (error) {
    console.log("Barcode Error Cropped:", error);
  }
}

testBarcodeCrop('back.jpg');
