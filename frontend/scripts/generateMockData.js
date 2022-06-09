const fs = require('fs');

function generateData() {
  let data = [];
  for (let x = 0; x < 2000; x++) {

    for (let y = 0; y < 2000; y++) {
      data.push({
        user_id: '1234',
        pixel_color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        x,
        y: y
      });
    }
  }
  return data;
}

const data = generateData();

try {
  const dataString = 'export const mockData: PixelData[] = ' + JSON.stringify(data);
  fs.writeFileSync('data.ts', dataString);
} catch (err) {
  console.error(err);
}
