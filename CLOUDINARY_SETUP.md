# Cloudinary Image Upload Setup Guide

## ✅ What's Been Implemented

1. **Cloudinary Service** (`src/services/cloudinaryService.js`)
   - Upload images directly to Cloudinary
   - Progress tracking
   - Error handling
   - File validation (JPG, PNG, WebP, max 5MB)

2. **ImageUploader Component** (`src/components/admin/ImageUploader.jsx`)
   - Drag & drop upload
   - Click to upload
   - Image preview
   - Upload progress indicator
   - Error and success messages
   - Replace/Remove actions

3. **Updated Admin Forms**
   - ✅ **AdminCourses**: Course image upload
   - ✅ **AdminGallery**: Gallery image upload
   - ✅ **AdminServices**: Service image upload (NEW)
   - ✅ **AdminTestimonials**: Customer avatar upload

4. **Database Fields Added**
   - `imageUrl`: Cloudinary secure URL
   - `imagePublicId`: Cloudinary public ID (for future deletion)

---

## 🚀 Cloudinary Setup Steps

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up (free plan is sufficient)
3. Go to your Dashboard

### Step 2: Get Your Cloud Name
1. On Dashboard, note your **Cloud Name** (looks like: `dxxxxxxxxx`)

### Step 3: Create Upload Preset
1. Go to **Settings** → **Upload** tab
2. Scroll down to **Upload presets** section
3. Click **Add upload preset** button
4. Set:
   - **Name**: `mehak_salon_uploads` (or your choice)
   - **Unsigned**: ON (required for client-side upload)
   - **Folder**: `mehak-salon` (optional, organizes your uploads)
5. **Save** the preset

### Step 4: Update .env File
Update `d:\Mehak salon\Mehak-Beauty-Salon\.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=mehak_salon_uploads
```

**Example:**
```env
VITE_CLOUDINARY_CLOUD_NAME=dq1234567
VITE_CLOUDINARY_UPLOAD_PRESET=mehak_salon_uploads
```

### Step 5: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then start again
npm run dev
```

---

## ✨ How It Works

### Admin Upload Flow
1. **Admin opens form** (Courses, Gallery, Services, or Testimonials)
2. **Drags/clicks to upload image**
3. **ImageUploader component**:
   - Validates file (type, size)
   - Uploads to Cloudinary via XHR
   - Shows progress percentage
   - Returns `secure_url` and `public_id`
4. **Data saved to Firestore**:
   ```json
   {
     "title": "Bridal Makeup",
     "imageUrl": "https://res.cloudinary.com/...",
     "imagePublicId": "mehak-salon/bridal_makeup_xyz"
   }
   ```
5. **Website uses imageUrl** automatically

### File Support
- **Formats**: JPG, JPEG, PNG, WebP
- **Max Size**: 5MB
- **Validation**: Client-side before upload

### User Experience
- ✅ Instant preview after upload
- ✅ Progress bar during upload
- ✅ Success/error notifications
- ✅ Replace or remove image anytime
- ✅ Support for editing (existing image shown on edit)

---

## 🎯 Usage in Admin Panel

### Adding Images

**Before (Old Way):**
```
❌ Paste image URL manually
❌ Hope URL stays valid
❌ No preview
```

**After (New Way):**
```
✅ Click/drag to upload
✅ Image instantly uploaded to Cloudinary
✅ Live preview shown
✅ Auto-saves URL and public_id
```

### Editing Images
1. Open edit modal
2. Existing image preview shown
3. Click **Replace Image** to upload new one
4. Click **Remove** to delete current one

### In Each Admin Form

#### AdminCourses
```jsx
<ImageUploader
  onImageSelect={handleImageSelect}
  existingImageUrl={formData.imageUrl}
  existingPublicId={formData.imagePublicId}
  label="Course Image (Optional)"
/>
```
- Stores in `courses` collection
- Used on Courses page listing

#### AdminGallery
```jsx
<ImageUploader
  onImageSelect={handleImageSelect}
  existingImageUrl={formData.url}
  existingPublicId={formData.imagePublicId}
  label="Gallery Image"
/>
```
- Stores in `gallery` collection
- Used on Gallery page grid

#### AdminServices
```jsx
<ImageUploader
  onImageSelect={handleImageSelect}
  existingImageUrl={formData.imageUrl}
  existingPublicId={formData.imagePublicId}
  label="Service Image (Optional)"
/>
```
- Stores in `services` collection
- Can be used on Services page

#### AdminTestimonials
```jsx
<ImageUploader
  onImageSelect={handleImageSelect}
  existingImageUrl={formData.imageUrl}
  existingPublicId={formData.imagePublicId}
  label="Customer Avatar (Optional)"
/>
```
- Stores in `testimonials` collection
- Shows as customer avatar

---

## 🔧 Troubleshooting

### "Image upload failed" Error
**Solution**: Check `.env` file
- Is `VITE_CLOUDINARY_CLOUD_NAME` set?
- Is `VITE_CLOUDINARY_UPLOAD_PRESET` set?
- Did you restart dev server after changing `.env`?

### Images not showing after upload
**Solution**: 
- Check Firestore: Is `imageUrl` field populated?
- Verify Cloudinary upload succeeded in console
- Check browser DevTools → Network tab

### Upload preset not working
**Solution**: 
1. Go to Cloudinary Dashboard
2. Verify preset exists and is **Unsigned**
3. Check exact name matches `.env` file
4. Try creating new preset

### File size error
**Only files under 5MB** are supported. If user's file is larger:
- Resize image before uploading (use image editor)
- Or use Cloudinary's transform/optimize (advanced)

---

## 📊 Firestore Data Structure

### Courses Collection
```json
{
  "id": "course_1",
  "name": "Basic Bridal Makeup",
  "category": "Beauty Foundation",
  "price": 25000,
  "duration": "2 Weeks",
  "rating": "4.8",
  "enrolledCount": 15,
  "status": "Active",
  "description": "Learn professional bridal makeup techniques...",
  "imageUrl": "https://res.cloudinary.com/dq1234567/image/upload/v1234567890/mehak-salon/course_123.jpg",
  "imagePublicId": "mehak-salon/course_123"
}
```

### Gallery Collection
```json
{
  "id": "gallery_1",
  "title": "Bridal Look 2024",
  "category": "Bridal Makeup",
  "url": "https://res.cloudinary.com/dq1234567/image/upload/v1234567890/mehak-salon/gallery_456.jpg",
  "imagePublicId": "mehak-salon/gallery_456",
  "alt": "Traditional red bridal lehenga makeup",
  "status": "Active"
}
```

### Services Collection
```json
{
  "id": "service_1",
  "name": "Bridal Package",
  "category": "Bridal",
  "price": 5000,
  "status": "Active",
  "description": "Complete bridal package including...",
  "imageUrl": "https://res.cloudinary.com/dq1234567/image/upload/v1234567890/mehak-salon/service_789.jpg",
  "imagePublicId": "mehak-salon/service_789"
}
```

### Testimonials Collection
```json
{
  "id": "testimonial_1",
  "customerName": "Priya Sharma",
  "serviceUsed": "Bridal Makeup",
  "rating": 5,
  "text": "Amazing service! Highly recommended...",
  "imageUrl": "https://res.cloudinary.com/dq1234567/image/upload/v1234567890/mehak-salon/avatar_101.jpg",
  "imagePublicId": "mehak-salon/avatar_101",
  "status": "Approved",
  "featured": true
}
```

---

## 🎨 Using Images on Frontend

### Course Image
```jsx
<img src={course.imageUrl} alt={course.name} />
```

### Gallery Image
```jsx
<img src={item.url} alt={item.alt} />
```

### Service Image
```jsx
<img src={service.imageUrl} alt={service.name} />
```

### Testimonial Avatar
```jsx
{testimonial.imageUrl ? (
  <img src={testimonial.imageUrl} alt={testimonial.customerName} />
) : (
  <UserIcon />
)}
```

---

## 🚀 Next Steps

### After Setup
1. ✅ Admin opens Courses page
2. ✅ Clicks "Add New Course"
3. ✅ Uploads course image via ImageUploader
4. ✅ Image auto-saved to Cloudinary
5. ✅ URL stored in Firestore
6. ✅ Image visible on website

### Adding Real Data
Now that image upload works:
- ✅ Add all real salon courses with images
- ✅ Upload portfolio gallery
- ✅ Add service descriptions with images
- ✅ Import customer testimonials with avatars

### Optional Enhancements
- Image deletion (requires backend API)
- Image transformation/optimization
- Bulk upload
- Image cropping before upload

---

## ❓ FAQ

**Q: Is there a free tier?**
A: Yes, Cloudinary free plan includes:
- 25 GB storage
- Unlimited transformations
- 1 GB/month bandwidth
- Perfectly fine for salon website

**Q: Can I delete images?**
A: Yes, but requires backend API (currently placeholders in service file)

**Q: Are uploads secure?**
A: Yes, unsigned presets restrict uploads to your folder only

**Q: Can I change upload folder?**
A: Yes, create new preset with different folder name

---

## 📝 Files Modified/Created

- ✅ `.env` - Added Cloudinary config
- ✅ `src/services/cloudinaryService.js` - NEW upload service
- ✅ `src/components/admin/ImageUploader.jsx` - NEW component
- ✅ `src/components/admin/ImageUploader.css` - Component styles
- ✅ `src/pages/admin/AdminCourses.jsx` - Updated with ImageUploader
- ✅ `src/pages/admin/AdminGallery.jsx` - Updated with ImageUploader
- ✅ `src/pages/admin/AdminServices.jsx` - Updated with ImageUploader
- ✅ `src/pages/admin/AdminTestimonials.jsx` - Updated with ImageUploader

---

**Setup complete! Start uploading images! 🎉**
