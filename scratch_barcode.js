const { MultiFormatReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource } = require('@zxing/library');
const sharp = require('sharp');

async function testBarcode(path) {
  try {
    const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    // create Uint8ClampedArray
    const arr = new Uint8ClampedArray(data.buffer);
    const luminanceSource = new RGBLuminanceSource(arr, info.width, info.height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    const reader = new MultiFormatReader();
    const result = reader.decode(binaryBitmap);
    console.log("Barcode Result:", result.getText());
  } catch (error) {
    console.log("Barcode Error:", error);
  }
}

testBarcode('back.jpg');
