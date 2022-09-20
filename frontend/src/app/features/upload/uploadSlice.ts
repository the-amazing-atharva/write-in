import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { NotificationsType } from "../../../types/authTypes"
import { upload } from "./uploadService";

interface UploadState {
    notifications: NotificationsType;
    uploadStatus: 'idle' | 'running' | 'success' | 'error';
    file: File | null;
    imageUrl: string;
}

const initialState: UploadState = {
    file: null,
    uploadStatus: 'idle',
    imageUrl: '',
    notifications: {
        type: 'idle',
        message: ''
    }
}

export const uploadFile = createAsyncThunk(
    'upload/file',
   async ({file,token}:{file:File,token:string},thunkAPI) => {
    try {
        return (await upload(file,token));
    } catch (error:any) {
        return thunkAPI.rejectWithValue('');
    }
   }
)

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(uploadFile.pending, (state) => {
            state.uploadStatus = 'running';
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.uploadStatus = 'success';
            if(action.payload.result === 'object') {
                state.imageUrl = action.payload.result.secure_url;
            }
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.uploadStatus = 'error';
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
    }
})

export default uploadSlice.reducer