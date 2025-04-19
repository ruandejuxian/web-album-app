import { StoredImage } from '../../hooks/useStorage/useLocalStorage';
import { getUserProfile } from './googleAuth';

// Define the structure for Google Sheets data
export interface SheetImageData {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  date: string;
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  userName: string;
}

// Admin Sheet ID - in a real app, this would be stored securely
const ADMIN_SHEET_ID = '1Ew2Yw5JYzRnXvLjdLvXvTbTb0Tb0Tb0Tb0Tb0Tb0Tb0';

// Sheet names
const PENDING_SHEET_NAME = 'PendingImages';
const APPROVED_SHEET_NAME = 'ApprovedImages';
const REJECTED_SHEET_NAME = 'RejectedImages';

// Function to create a new sheet if it doesn't exist
export const createSheetIfNotExists = async (sheetId: string, sheetName: string): Promise<void> => {
  try {
    // Check if sheet exists
    const response = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const sheets = response.result.sheets;
    const sheetExists = sheets.some((sheet: any) => sheet.properties.title === sheetName);

    if (!sheetExists) {
      // Create new sheet
      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 10,
                  },
                },
              },
            },
          ],
        },
      });

      // Add headers
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${sheetName}!A1:J1`,
        valueInputOption: 'RAW',
        resource: {
          values: [['ID', 'URL', 'Title', 'Description', 'Tags', 'Date', 'Likes', 'Status', 'UserID', 'UserName']],
        },
      });
    }
  } catch (error) {
    console.error(`Error creating sheet ${sheetName}:`, error);
    throw error;
  }
};

// Function to initialize all required sheets
export const initializeSheets = async (): Promise<void> => {
  try {
    await createSheetIfNotExists(ADMIN_SHEET_ID, PENDING_SHEET_NAME);
    await createSheetIfNotExists(ADMIN_SHEET_ID, APPROVED_SHEET_NAME);
    await createSheetIfNotExists(ADMIN_SHEET_ID, REJECTED_SHEET_NAME);
  } catch (error) {
    console.error('Error initializing sheets:', error);
    throw error;
  }
};

// Function to convert StoredImage to sheet row format
const imageToSheetRow = (image: StoredImage, status: 'pending' | 'approved' | 'rejected'): string[] => {
  const userProfile = getUserProfile() || { id: 'anonymous', name: 'Anonymous User' };
  
  return [
    image.id,
    image.url,
    image.title,
    image.description || '',
    image.tags.join(','),
    image.date,
    image.likes.toString(),
    status,
    userProfile.id,
    userProfile.name,
  ];
};

// Function to convert sheet row to StoredImage format
const sheetRowToImage = (row: string[]): SheetImageData => {
  return {
    id: row[0],
    url: row[1],
    title: row[2],
    description: row[3],
    tags: row[4] ? row[4].split(',') : [],
    date: row[5],
    likes: parseInt(row[6], 10) || 0,
    status: row[7] as 'pending' | 'approved' | 'rejected',
    userId: row[8],
    userName: row[9],
  };
};

// Function to submit an image for approval
export const submitImageForApproval = async (image: StoredImage): Promise<void> => {
  try {
    await createSheetIfNotExists(ADMIN_SHEET_ID, PENDING_SHEET_NAME);
    
    const row = imageToSheetRow(image, 'pending');
    
    await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: ADMIN_SHEET_ID,
      range: `${PENDING_SHEET_NAME}!A:J`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [row],
      },
    });
  } catch (error) {
    console.error('Error submitting image for approval:', error);
    throw error;
  }
};

// Function to get all pending images (for admin)
export const getPendingImages = async (): Promise<SheetImageData[]> => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: ADMIN_SHEET_ID,
      range: `${PENDING_SHEET_NAME}!A2:J`,
    });
    
    const rows = response.result.values || [];
    return rows.map(sheetRowToImage);
  } catch (error) {
    console.error('Error getting pending images:', error);
    throw error;
  }
};

// Function to get all approved images (public)
export const getApprovedImages = async (): Promise<SheetImageData[]> => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: ADMIN_SHEET_ID,
      range: `${APPROVED_SHEET_NAME}!A2:J`,
    });
    
    const rows = response.result.values || [];
    return rows.map(sheetRowToImage);
  } catch (error) {
    console.error('Error getting approved images:', error);
    throw error;
  }
};

// Function to approve an image
export const approveImage = async (imageId: string): Promise<void> => {
  try {
    // Get the image from pending sheet
    const pendingImages = await getPendingImages();
    const imageToApprove = pendingImages.find(img => img.id === imageId);
    
    if (!imageToApprove) {
      throw new Error(`Image with ID ${imageId} not found in pending images`);
    }
    
    // Add to approved sheet
    await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: ADMIN_SHEET_ID,
      range: `${APPROVED_SHEET_NAME}!A:J`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[
          imageToApprove.id,
          imageToApprove.url,
          imageToApprove.title,
          imageToApprove.description || '',
          imageToApprove.tags.join(','),
          imageToApprove.date,
          imageToApprove.likes.toString(),
          'approved',
          imageToApprove.userId,
          imageToApprove.userName,
        ]],
      },
    });
    
    // Remove from pending sheet
    await removeImageFromSheet(ADMIN_SHEET_ID, PENDING_SHEET_NAME, imageId);
  } catch (error) {
    console.error('Error approving image:', error);
    throw error;
  }
};

// Function to reject an image
export const rejectImage = async (imageId: string): Promise<void> => {
  try {
    // Get the image from pending sheet
    const pendingImages = await getPendingImages();
    const imageToReject = pendingImages.find(img => img.id === imageId);
    
    if (!imageToReject) {
      throw new Error(`Image with ID ${imageId} not found in pending images`);
    }
    
    // Add to rejected sheet
    await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: ADMIN_SHEET_ID,
      range: `${REJECTED_SHEET_NAME}!A:J`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[
          imageToReject.id,
          imageToReject.url,
          imageToReject.title,
          imageToReject.description || '',
          imageToReject.tags.join(','),
          imageToReject.date,
          imageToReject.likes.toString(),
          'rejected',
          imageToReject.userId,
          imageToReject.userName,
        ]],
      },
    });
    
    // Remove from pending sheet
    await removeImageFromSheet(ADMIN_SHEET_ID, PENDING_SHEET_NAME, imageId);
  } catch (error) {
    console.error('Error rejecting image:', error);
    throw error;
  }
};

// Helper function to remove an image from a sheet
const removeImageFromSheet = async (sheetId: string, sheetName: string, imageId: string): Promise<void> => {
  try {
    // Get all rows
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:J`,
    });
    
    const rows = response.result.values || [];
    
    // Find the row index with the matching ID
    let rowIndexToDelete = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === imageId) {
        rowIndexToDelete = i;
        break;
      }
    }
    
    if (rowIndexToDelete === -1) {
      throw new Error(`Image with ID ${imageId} not found in sheet ${sheetName}`);
    }
    
    // Delete the row
    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming it's the first sheet
                dimension: 'ROWS',
                startIndex: rowIndexToDelete,
                endIndex: rowIndexToDelete + 1,
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(`Error removing image from sheet ${sheetName}:`, error);
    throw error;
  }
};

// Function to update image likes
export const updateImageLikes = async (imageId: string, likes: number): Promise<void> => {
  try {
    // Check in approved sheet first
    const approvedImages = await getApprovedImages();
    const approvedImage = approvedImages.find(img => img.id === imageId);
    
    if (approvedImage) {
      // Find the row index
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: ADMIN_SHEET_ID,
        range: `${APPROVED_SHEET_NAME}!A:A`,
      });
      
      const idColumn = response.result.values || [];
      let rowIndex = -1;
      
      for (let i = 1; i < idColumn.length; i++) {
        if (idColumn[i][0] === imageId) {
          rowIndex = i + 1; // +1 because sheets are 1-indexed
          break;
        }
      }
      
      if (rowIndex !== -1) {
        // Update the likes column (column G)
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: ADMIN_SHEET_ID,
          range: `${APPROVED_SHEET_NAME}!G${rowIndex}`,
          valueInputOption: 'RAW',
          resource: {
            values: [[likes.toString()]],
          },
        });
      }
    }
  } catch (error) {
    console.error('Error updating image likes:', error);
    throw error;
  }
};
