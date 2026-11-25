import React, { useState, useRef } from 'react'
import { Upload, X, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { uploadImage } from '../../services/cloudinaryService'
import './ImageUploader.css'

const ImageUploader = ({
  onImageSelect,
  existingImageUrl = null,
  existingPublicId = null,
  label = 'Upload Image',
  disabled = false
}) => {
  const [preview, setPreview] = useState(existingImageUrl || null)
  const [publicId, setPublicId] = useState(existingPublicId || null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp']
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file) => {
    if (!file) {
      setError('No file selected')
      return false
    }

    const fileExtension = file.name.split('.').pop().toLowerCase()
    if (!SUPPORTED_FORMATS.includes(fileExtension)) {
      setError('Only JPG, PNG, and WebP files are supported')
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB')
      return false
    }

    return true
  }

  const handleFileUpload = async (file) => {
    if (!validateFile(file)) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)
    setProgress(0)

    try {
      // Create preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      const result = await uploadImage(file, (progressPercent) => {
        setProgress(progressPercent)
      })

      setPublicId(result.public_id)

      // Callback to parent component
      onImageSelect({
        imageUrl: result.secure_url,
        publicId: result.public_id,
        url: result.secure_url
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to upload image')
      setPreview(null)
      setPublicId(null)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const handleClick = () => {
    if (!disabled && !loading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !loading) {
      setIsDragActive(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled || loading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setPublicId(null)
    setError('')
    setSuccess(false)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageSelect({
      imageUrl: null,
      publicId: null
    })
  }

  return (
    <div className="image-uploader-container">
      <label className="image-uploader-label">{label}</label>

      {/* Upload Area */}
      {!preview ? (
        <div
          className={`image-uploader-dropzone ${isDragActive ? 'active' : ''} ${
            disabled ? 'disabled' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={disabled || loading}
          />

          {loading ? (
            <div className="upload-loading-state">
              <Loader size={32} className="spinner" />
              <p className="upload-progress-text">Uploading...</p>
              <div className="upload-progress-bar">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="upload-progress-percent">{progress}%</p>
            </div>
          ) : (
            <div className="upload-icon-container">
              <Upload size={32} className="upload-icon" />
              <p className="upload-title">
                {isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="upload-subtitle">JPG, PNG, or WebP • Max 5MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="image-preview-container">
          <div className="image-preview-wrapper">
            <img src={preview} alt="Upload preview" className="image-preview" />
            {loading && (
              <div className="preview-loading-overlay">
                <Loader size={24} className="spinner" />
              </div>
            )}
          </div>

          <div className="image-preview-actions">
            <button
              type="button"
              className="btn-replace"
              onClick={handleClick}
              disabled={loading}
            >
              Replace Image
            </button>
            <button
              type="button"
              className="btn-remove"
              onClick={handleRemove}
              disabled={loading}
            >
              <X size={16} />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="image-uploader-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="image-uploader-success">
          <CheckCircle size={18} />
          <span>Image uploaded successfully!</span>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
