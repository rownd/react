import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './src/index.ts',

  // Output configuration
  output: {
    path: path.resolve(__dirname, '../../dist-next/next/src'),
    filename: 'index.js',
    library: 'NextJSRowndProvider',
    libraryTarget: 'umd',
  },

  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    next: 'Next',
  },
};

export default config;
