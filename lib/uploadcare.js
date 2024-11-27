export async function updateAllChatImages(chatHistory, isPermanent) {
  console.log('Updating all chat images to isPermanent:', isPermanent);
  const updatePromises = chatHistory.flatMap(chat => 
    (chat.uploads || [])
      .filter(upload => upload.type === "image")
      .map(upload => {
        const uuid = upload.uuid || upload.url?.match(/ucarecdn\.com\/([^/]+)/)?.[1];
        if (!uuid) {
          console.warn('No UUID found for image:', upload);
          return null;
        }
        console.log('Processing image UUID:', uuid);
        return updateImageStorage(uuid, isPermanent);
      })
      .filter(Boolean)
  );

  try {
    const results = await Promise.all(updatePromises);
    console.log('Update results:', results);
    return results;
  } catch (error) {
    console.error('Error updating images:', error);
    throw error;
  }
}

async function updateImageStorage(uuid, store) {
  try {
    // Create the authorization string correctly
    const authString = Buffer.from(
      `${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`
    ).toString('base64');

    const response = await fetch(`https://api.uploadcare.com/files/${uuid}/storage/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.uploadcare-v0.7+json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify({ store })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Storage update failed for ${uuid}:`, errorText);
      throw new Error(`Failed to update storage: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`Storage updated for image ${uuid}:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating image storage for ${uuid}:`, error);
    throw error;
  }
} 