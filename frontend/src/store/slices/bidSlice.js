import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/bids`;

axios.defaults.withCredentials = true;

// Submit bid
export const submitBid = createAsyncThunk('bids/submit', async (bidData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, bidData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Get bids for a gig
export const getBidsByGig = createAsyncThunk('bids/getByGig', async (gigId, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/${gigId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Get my bids
export const getMyBids = createAsyncThunk('bids/getMy', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/my-bids`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Hire bid
export const hireBid = createAsyncThunk('bids/hire', async (bidId, thunkAPI) => {
  try {
    const response = await axios.patch(`${API_URL}/${bidId}/hire`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
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
      // Submit bid
      .addCase(submitBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myBids.unshift(action.payload.bid);
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get bids by gig
      .addCase(getBidsByGig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBidsByGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bids = action.payload.bids;
      })
      .addCase(getBidsByGig.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my bids
      .addCase(getMyBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myBids = action.payload.bids;
      })
      .addCase(getMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Hire bid
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the bid in the list
        const index = state.bids.findIndex(bid => bid._id === action.payload.bid._id);
        if (index !== -1) {
          state.bids[index] = action.payload.bid;
        }
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bidSlice.actions;
export default bidSlice.reducer;
