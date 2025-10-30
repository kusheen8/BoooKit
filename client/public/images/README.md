# Images Folder

This folder is ready for you to add your royalty-free travel experience images.

## Recommended Structure

```
images/
└── experiences/
    ├── kayaking.jpg
    ├── nandi-hills.jpg
    ├── coffee-trail.jpg
    ├── boat-cruise.jpg
    ├── bungee-jumping.jpg
    └── ... (add more as needed)
```

## Image Specifications

- **Format**: JPG or PNG
- **Recommended Size**: 1920x1080px or higher for hero images
- **Aspect Ratio**: 4:3 for experience cards
- **File Size**: Optimize for web (aim for < 500KB per image)

## Where to Find Free Images

You can download high-quality, royalty-free images from:

- **Unsplash** (https://unsplash.com) - Search for "kayaking", "hiking", "adventure", etc.
- **Pexels** (https://pexels.com) - Great travel and outdoor photography
- **Pixabay** (https://pixabay.com) - Free stock photos

## Current Implementation

The application currently uses placeholder images from Unsplash API. Replace these with your own downloaded images by:

1. Adding images to this folder
2. Updating the `imageUrl` field in the backend seed data (see `server/routes.ts`)

Example:
```javascript
imageUrl: "/images/experiences/kayaking.jpg"
```
