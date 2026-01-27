# Video Management Guide

## Current Video Setup

The homepage banner video is configured in: **`client/components/HeroSection.tsx`**

### Current Video URL
```
https://cdn.builder.io/o/assets%2F9c433034c4a24db1918d9c9892cfb057%2F8f04ad36ec6f4fd8925222d553595a4b?alt=media&token=570abc70-b1c4-4308-a142-87f2320fe6ba&apiKey=9c433034c4a24db1918d9c9892cfb057
```

## How to Replace the Video

### Method 1: Using Cloud Storage (Recommended)

**Best for**: Faster loading, CDN delivery, easy management

1. **Upload to your preferred service**:
   - **Supabase Storage** (recommended)
   - **AWS S3**
   - **Cloudinary**
   - **Vimeo** or **YouTube** (with modifications)
   - **Builder.io Assets** (current method)

2. **Get the public URL** from your storage service

3. **Update the video URL in HeroSection.tsx**:
   ```tsx
   <source
     src="YOUR_NEW_VIDEO_URL"
     type="video/mp4"
   />
   ```

### Method 2: Local Storage

**Best for**: Small projects, development

1. **Create a videos folder**:
   ```
   public/
   ├── videos/
   │   └── hero-banner.mp4
   ```

2. **Upload your video file** to `public/videos/`

3. **Update HeroSection.tsx**:
   ```tsx
   <source
     src="/videos/hero-banner.mp4"
     type="video/mp4"
   />
   ```

## Video Specifications

For optimal performance, use these specifications:

| Property | Recommendation |
|----------|-----------------|
| Format | MP4 (H.264 codec) |
| Resolution | 1920x1080px (Full HD) |
| Frame Rate | 24-30 fps |
| Bitrate | 4-8 Mbps |
| File Size | Under 20 MB (ideally 5-10 MB) |
| Duration | 10-20 seconds (loops) |

## Video Optimization Tips

### Compress Video
```bash
# Using ffmpeg (install: https://ffmpeg.org/download.html)
ffmpeg -i input-video.mp4 -vcodec libx264 -crf 23 -preset medium output-video.mp4
```

### Alternative Tools
- **Handbrake** (GUI tool)
- **TinyMP4** (online)
- **Cloudinary** (automatic compression)

## Effects Currently Applied

1. **Subtle Zoom Animation**: The video subtly zooms in/out over 20 seconds for cinematic effect
2. **Gradient Overlay**: Blue gradient overlay ensures text readability
3. **Fade-In Animation**: Content text animates in smoothly when page loads
4. **Loop**: Video loops seamlessly

## Customizing Effects

Edit the CSS animations in `client/components/HeroSection.tsx`:

```tsx
@keyframes subtleZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);  /* Change scale value for intensity */
  }
}
```

### Modify animation duration:
```tsx
animation: subtleZoom 20s ease-in-out infinite alternate;
//                    ^^^ Change this number (in seconds)
```

### Change gradient overlay color/opacity:
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-blue-500/40 to-transparent"></div>
//                                                                ^^    ^^  ^^
//                                                    Adjust opacity (0-100)
```

## Text Overlay Customization

To modify the headline and buttons, edit the content section in `client/components/HeroSection.tsx`:

```tsx
<h1 className="...">
  <span className="font-light">Empowering </span>
  <span className="font-bold">Active Lifestyles</span>
</h1>
```

## File Locations Summary

| Item | Location |
|------|----------|
| Hero Component | `client/components/HeroSection.tsx` |
| Video URL Setting | Line ~15 in HeroSection.tsx |
| Video Storage (if local) | `public/videos/` |
| Styling/Effects | CSS animations in HeroSection.tsx |

## Troubleshooting

### Video Not Playing
- Check URL is correct and accessible
- Verify video format is MP4
- Check browser console for CORS errors
- Ensure video has proper permissions/access

### Video Not Looping
- Ensure `loop` attribute exists on `<video>` tag
- Some browsers may require `muted` attribute

### Slow Loading
- Compress video to reduce file size
- Use CDN/cloud storage instead of local files
- Check bitrate (recommended 4-8 Mbps)

### Audio/Autoplay Issues
- Video must be `muted` to autoplay in browsers
- Remove `muted` if you want sound, but autoplay may be blocked

## Browser Compatibility

Current setup works on:
- Chrome 70+
- Firefox 67+
- Safari 10.1+
- Edge 79+
- Mobile browsers (iOS 10+, Android 5+)

## Next Steps

1. Prepare your video in the recommended specifications
2. Upload to your preferred storage service
3. Copy the public URL
4. Replace the URL in HeroSection.tsx
5. Test on different devices and browsers
