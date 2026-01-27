// app/livestockmanagement/animal/sheds/ShedsService.js
import { api, API_ENDPOINTS } from '@/utils/api';

// GET all sheds
export const getSheds = async () => {
  try {
    const data = await api.get(API_ENDPOINTS.SHEDS);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching sheds:', error.message);
    
    if (error.message.includes('Please login')) {
      return { 
        success: false, 
        error: 'Authentication required',
        message: 'Please login to access sheds data'
      };
    }
    
    return { 
      success: false, 
      error: error.message,
      message: 'Error fetching sheds data'
    };
  }
};

// Create new shed
export const createShed = async (shedData) => {
  try {
    const data = await api.post(API_ENDPOINTS.SHEDS, shedData);
    return { success: true, data };
  } catch (error) {
    console.error('Error creating shed:', error);
    return { success: false, error: error.message };
  }
};

// Update shed
export const updateShed = async (id, shedData) => {
  try {
    const data = await api.put(API_ENDPOINTS.SHED_BY_ID(id), shedData);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating shed:', error);
    return { success: false, error: error.message };
  }
};

// Delete shed
export const deleteShed = async (id) => {
  try {
    const data = await api.delete(API_ENDPOINTS.SHED_BY_ID(id));
    return { success: true, data };
  } catch (error) {
    console.error('Error deleting shed:', error);
    return { success: false, error: error.message };
  }
};