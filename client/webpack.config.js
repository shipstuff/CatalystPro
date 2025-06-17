const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point - where Webpack starts building the dependency graph
  entry: './src/index.tsx',
  
  // Output configuration - where bundled files go
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true, // Clean the output directory before each build
    publicPath: '/', // Base path for all assets
  },
  
  // How to resolve file extensions and module paths
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // File extensions to resolve
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  
  // Module rules - how to process different file types
  module: {
    rules: [
      {
        // Process TypeScript and JavaScript files
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', // Modern JavaScript features
              '@babel/preset-react', // JSX transformation
              '@babel/preset-typescript', // TypeScript compilation
            ],
          },
        },
      },
      {
        // Process CSS files
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Process image files
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  
  // Plugins extend Webpack's functionality
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML template
      favicon: './public/favicon.ico', // Favicon
    }),
  ],
  
  // Development server configuration
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000, // React app runs on port 3000
    hot: true, // Hot module replacement for faster development
    historyApiFallback: true, // Handle client-side routing
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    ],
  },
  
  // Source maps for debugging
  devtool: 'source-map',
}; 