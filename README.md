# Solidity Bootcamp Pass Generator

A customizable web application for generating onboard passes for Solidity Bootcamp participants. Users can personalize their pass with their photo, name, and role, and share it on social media.

## Features

### 🎨 Customization
- **User Info**: Customize avatar, name, role, intro, and subtitle.
- **Visuals**: Upload custom background images (supports drag-and-drop).
- **Layout**: Adjust the card's position (X/Y) and scale to fit perfectly on your background.
- **QR Code**: Generates a QR code for a target URL (e.g., join link) with a custom logo.

### 🌐 Multi-language Support
- **Bilingual Interface**: Switch seamlessly between Chinese (ZH) and English (EN).
- **Localized Content**: All labels, buttons, and default sharing text are localized.

### 📱 Social Sharing
- **Native System Share**: On supported mobile devices, share the generated image directly to other apps (WeChat, Twitter, Instagram, etc.).
- **Smart Copy & Redirect**:
  - **X (Twitter)**: Pre-fills a tweet with your custom text and mentions `@HerstoryWeb3`.
  - **Instagram**: Copies the caption (including `@herstory_web3`) and opens Instagram.
  - **Xiaohongshu (Little Red Book)**: Copies the caption (including `小红书号：HerstoryWeb3`) and opens Xiaohongshu.
- **Hashtags**: Automatically includes recommended hashtags: `#WomenlnWeb3` `#WomenWeb3Wave`.

### 💾 Export
- **High-Quality Download**: Export the pass as a high-resolution PNG image.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Image Generation**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **QR Code**: [qrcode.react](https://github.com/zpao/qrcode.react)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [react-dropzone](https://react-dropzone.js.org/)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Usage

1.  **Upload Background**: Drag and drop a background image or use the default one.
2.  **Enter Info**: Fill in your name, role, and other details. Upload your avatar.
3.  **Adjust Layout**: Use the sliders to position and scale the card on the background.
4.  **Share**:
    -   Click "Share to Social" buttons to copy the caption and open the app.
    -   On mobile, use the "System Share" button to send the image directly.
5.  **Download**: Click "Download Poster" to save the image to your device.

## Deployment to GitHub Pages

This project can be easily deployed to GitHub Pages.

1.  **Update `vite.config.ts`**:
    Ensure `base: './'` is set in your `vite.config.ts` file (already configured).

2.  **Build the project**:
    ```bash
    npm run build
    ```

3.  **Deploy**:
    -   Push the contents of the `dist` folder to a `gh-pages` branch.
    -   Alternatively, use a GitHub Action to build and deploy automatically.

    **Manual Deployment Example:**
    ```bash
    # Build the project
    npm run build

    # Navigate to the build output directory
    cd dist

    # Initialize a new git repository
    git init
    git checkout -b main
    git add -A
    git commit -m 'deploy'

    # Push to the gh-pages branch of your repository
    # Replace <USERNAME> and <REPO> with your details
    git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

    cd -
    ```

## License

MIT
