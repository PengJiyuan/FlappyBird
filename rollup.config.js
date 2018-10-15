import buble from 'rollup-plugin-buble';
import butternut from 'rollup-plugin-butternut';

const dev = process.env.dev;

const config = {
  input: './src/index.js',
  output: {
    file: 'dist/flappybird.js',
    format: 'umd',
    name: 'FlappyBird'
  },
  plugins: [
    buble(),
    butternut()
  ]
};

if(dev) {
  config.plugins.pop();
}

export default config;
