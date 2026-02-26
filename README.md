# Solidity Bootcamp Pass Generator

A React-based tool designed to generate custom onboard passes for the Solidity Bootcamp. Users can upload their avatar, customize their information, and download a personalized pass image for social sharing.

## Features

- **Customizable User Info**:
  - Upload avatar and background images via drag & drop.
  - Edit user type, intro/title, nickname, and subtitle.
  - Generate a QR code linking to a specific target URL.

- **Layout Adjustment**:
  - Fine-tune the vertical and horizontal position of the pass card.
  - Adjust the scale of the card to fit different background images.

- **Multi-language Support**:
  - Toggle between **Chinese (Default)** and **English**.
  - Interface text and default sharing captions automatically adapt to the selected language.

- **Social Sharing**:
  - One-click copy for sharing captions with relevant hashtags (`#WomenlnWeb3`, `#WomenWeb3Wave`).
  - Direct links to share on **X (Twitter)**, **Instagram**, and **Xiaohongshu**.

- **High-Quality Export**:
  - Download the generated pass as a high-resolution PNG image.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Image Processing**: html-to-image
- **QR Code**: qrcode.react
- **File Upload**: react-dropzone

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

1. **Upload Background**: Drag and drop or click to upload the official Solidity Bootcamp poster as the background.
2. **Upload Avatar**: Upload your profile picture.
3. **Fill Info**: Enter your details (Name, Title, etc.).
4. **Adjust Layout**: Use the sliders to position the card perfectly over the background.
5. **Download**: Click "Download Poster" to save your pass.
6. **Share**: Use the social buttons to copy the caption and share your pass on social media.
