import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/gigs`;

axios.defaults.withCredentials = true;

// Get all gigs
export const getGigs = createAsyncThunk('gigs/getAll', async (searchQuery = '', thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}?search=${searchQuery}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Get single gig
export const getGig = createAsyncThunk('gigs/getOne', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Create gig
export const createGig = createAsyncThunk('gigs/create', async (gigData, thunkAPI) => {
  try {
    console.log('🚀 Sending POST request to create gig:', gigData);
    const response = await axios.post(API_URL, gigData);
    console.log('✅ Gig created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating gig:', error.response?.data || error.message);
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    currentGig: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all gigs
      .addCase(getGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gigs = action.payload.gigs;
      })
      .addCase(getGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single gig
      .addCase(getGig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentGig = action.payload.gig;
      })
      .addCase(getGig.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gigs.unshift(action.payload.gig);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = gigSlice.actions;
export default gigSlice.reducer;
