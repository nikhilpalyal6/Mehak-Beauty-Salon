/**
 * Cloudinary Image Upload Service
 * Handles image uploads to Cloudinary and returns secure URLs
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Validate Cloudinary configuration
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn(
    'Cloudinary configuration missing. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env'
  )
}

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

/**
 * Upload image file to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<{secure_url, public_id}>}
 */
export const uploadImage = async (file, onProgress = null) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    // Check file size (5MB max)
    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      throw new Error('File size exceeds 5MB limit')
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, and WebP files are supported')
    }

    // Prepare form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)

    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            onProgress(Math.round(percentComplete))
          }
        })
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        try {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            resolve({
              secure_url: response.secure_url,
              public_id: response.public_id,
              url: response.url
            })
          } else {
            const errorResponse = JSON.parse(xhr.responseText)
            reject(
              new Error(
                errorResponse.error?.message || `Upload failed with status ${xhr.status}`
              )
            )
          }
        } catch (err) {
          reject(new Error('Failed to parse upload response'))
        }
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was cancelled'))
      })

      // Send request
      xhr.open('POST', CLOUDINARY_API_URL)
      xhr.send(formData)
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

/**
 * Delete image from Cloudinary using public_id
 * Note: This requires a server-side implementation for security
 * For now, we'll provide a placeholder that logs the public_id
 * @param {string} public_id - Cloudinary public ID of the image
 */
export const deleteImage = async (public_id) => {
  try {
    if (!public_id) {
      throw new Error('No public_id provided')
    }
    // In production, you'd call your backend API to delete the image
    // This prevents exposing your Cloudinary API key on the client
    console.log(`Image deletion requested for public_id: ${public_id}`)
    // For now, just resolve successfully
    // TODO: Implement backend endpoint for secure deletion
    return Promise.resolve()
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw error
  }
}

/**
 * Get Cloudinary upload configuration
 */
export const getCloudinaryConfig = () => {
  return {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    configured: Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)
  }
}

export default {
  uploadImage,
  deleteImage,
  getCloudinaryConfig
}
