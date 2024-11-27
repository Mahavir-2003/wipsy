export async function updateAllChatImages(chatHistory, isPermanent) {
  const updatePromises = chatHistory.flatMap(chat => 
    (chat.uploads || [])
      .filter(upload => upload.uuid && upload.type === 'image')
      .map(upload => updateImageStorage(upload.uuid, isPermanent))
  );

  return Promise.all(updatePromises);
}

async function updateImageStorage(uuid, store) {
  try {
    const response = await fetch(`https://api.uploadcare.com/files/${uuid}/storage/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
      },
      body: JSON.stringify({ store })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update storage: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating image storage:', error);
    throw error;
  }
} 