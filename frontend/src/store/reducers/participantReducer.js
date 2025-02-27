import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 

export const get_network = createAsyncThunk(
    'participant/get_network',
    async(coinsym, { rejectWithValue,fulfillWithValue }) => {

        try {
            const {data} = await api.get(`/participant/get-client/${coinsym}`) 

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method 
export const get_participant = createAsyncThunk(
    'participant/get_participant',
    async(partEmail, { rejectWithValue,fulfillWithValue }) => {
   
        try {
            const {data} = await api.get(`/participant/get-participant/${partEmail}`) 

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method 

//get_all_participants
export const get_all_participants = createAsyncThunk(
    'participant/get_all_participants',
    async(_, { rejectWithValue,fulfillWithValue }) => {
    
        try {
            const {data} = await api.get(`/participant/get-participants`) 

            return fulfillWithValue(data)
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)

//delete_participant
export const delete_participant = createAsyncThunk(
    'participant/delete_participant',
    async(id, { rejectWithValue,fulfillWithValue }) => {
  
        try {
            const {data} = await api.delete(`/participant/delete-participant/${id}`) 

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
//update_participant
export const update_participant = createAsyncThunk(
    'participant/update_participant',
    async({id,confirmationStatus}, { rejectWithValue,fulfillWithValue }) => {

        try {
            const {data} = await api.put(`/participant/update-participant/${id}/${confirmationStatus}`,{withCredentials: true}) 

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const create_participant = createAsyncThunk(
    'participant/create_participant',
    async(stateInfo,{rejectWithValue, fulfillWithValue}) => {

        try { 
            const {data} = await api.post('/participant/create-client',stateInfo,{withCredentials: true}) 

            return fulfillWithValue(data)
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)


 


export const participantReducer = createSlice({
    name: 'participant',
    initialState:{
        errorMessage : '',
        successMessage: '', 
        coinInfo:'',
        participant:'',
        participants:''
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
 
    },
    extraReducers: (builder) => {
        builder

            .addCase(get_network.pending, (state, { payload }) => {
                            state.loader = true;
                        })
            .addCase(get_network.rejected, (state, { payload }) => {
                state.loader = false;
               // state.errorMessage = payload.error;
            })

            .addCase(get_network.fulfilled, (state, { payload }) => { 
                state.loader = false;
                //state.successMessage = payload.success
                state.coinInfo=payload.coinInfo
            })
            //
            .addCase(create_participant.pending, (state, { payload }) => {
                            state.loader = true;
                        })
            .addCase(create_participant.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            .addCase(create_participant.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.successMessage = payload.success
            })
            //
            //get_participant
            .addCase(get_participant.pending, (state, { payload }) => {
                state.loader = true;
                        })
            .addCase(get_participant.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            .addCase(get_participant.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.successMessage = payload.success
                state.participant=payload.accountExist
            })
            //end method
            .addCase(get_all_participants.pending, (state, { payload }) => {
                state.loader = true;
                        })
            .addCase(get_all_participants.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            .addCase(get_all_participants.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.successMessage = payload.success
                state.participants=payload.participants
            })
             //end method
            .addCase(delete_participant.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            .addCase(delete_participant.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.successMessage = payload.success
            })
            //update_participant
            .addCase(update_participant.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            .addCase(update_participant.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.successMessage = payload.success
            })


        
    }
})
export const {messageClear} = participantReducer.actions
export default participantReducer.reducer