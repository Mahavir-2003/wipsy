// create an api socket route for only uploading files and images and returning the uploaded file location and along with file upload progress
// this route is only for uploading files and images the files are gonna be uploaded on uploadcare.com
// import { uploadFile } from '@uploadcare/upload-client'

// // fileData must be Blob or File or Buffer
// const result = await uploadFile(
//   fileData,
//   {
//     publicKey: '8c1816e1b2b84ba30ae9',
//     store: 'auto',
//     metadata: {
//       subsystem: 'js-client',
//       pet: 'cat'
//     }
//   }
// )

export async function uploadFile(fileData, options) {
    const { publicKey, store, metadata } = options
    const formData = new FormData()
    formData.append('UPLOADCARE_PUB_KEY', publicKey)
    formData.append('UPLOADCARE_STORE', store)
    formData.append('file', fileData)
    if (metadata) {
        formData.append('UPLOADCARE_PUB_KEY', publicKey)
        formData.append('UPLOADCARE_STORE', store)
        formData.append('UPLOADCARE_PUB_KEY', publicKey)
        formData.append('UPLOADCARE_STORE', store)
    }
    
    const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData
    })
    
    if (!response.ok) {
        throw new Error('Failed to upload file')
    }
    
    return response.json()
    }
    