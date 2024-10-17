/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const { resolve } = require('path');

const root = resolve(__dirname, '../');

fs.copySync(
  resolve(root, 'src/generated'),
  resolve(root, 'dist/src/generated'),
);

// 拷贝env文件
fs.copySync(
  resolve(root, 'src/.env.production'),
  resolve(root, 'dist/src/.env'),
);
