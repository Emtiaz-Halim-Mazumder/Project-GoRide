const Tesseract = require('tesseract.js');

async function testOCR(path) {
  const { data: { text } } = await Tesseract.recognize(path, 'eng');
  console.log("OCR Result:");
  console.log(text);
  const match2 = text.match(/\b\d{8}\b/);
  if (match2) console.log("Extracted ID (fallback):", match2[0]);
}

testOCR('back.jpg');
