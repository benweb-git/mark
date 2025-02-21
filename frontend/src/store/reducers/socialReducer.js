import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";


export const createSocialDetails = createAsyncThunk(
    'social/createSocialDetails',
    async(info,{rejectWithValue, fulfillWithValue}) => {
       // console.log(info)
        try { 
            const {data} = await api.post('/social/create-socials',info,{withCredentials: true}) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

// End Method 

export const update_socials = createAsyncThunk(
    'social/update_socials',
    async({id,state},{rejectWithValue, fulfillWithValue}) => {
       // console.log(id)
        try { 
            const {data} = await api.put(`/social/update-social-details/${id}`,state,{withCredentials: true}) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

// End Method 
//get_home_details

export const get_all_socials = createAsyncThunk(
    'social/get_all_socials',
    async(_,{rejectWithValue, fulfillWithValue}) => {
         //console.log(`this was called?`)
        try { 
            const {data} = await api.get(`/social/get-all-socials`) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

// End Method 





export const socialReducer = createSlice({
    name:"social",
    initialState:{
        loader:false,
        errorMessage : '',
        successMessage: '',
        socialDetails:{}

    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
       
 
    },
    extraReducers: (builder) => {
       builder
            .addCase(createSocialDetails.pending, (state, { payload }) => {
                  state.loader = true;
              })
              .addCase(createSocialDetails.rejected, (state, { payload }) => {
                  state.loader = false;
                  state.errorMessage = payload.error;
              })
              .addCase(createSocialDetails.fulfilled, (state, { payload }) => {
                  state.loader = false;
                  state.socialDetails = payload.socialDetails
                  state.successMessage = payload.message;
              })
              //get_home_details
              .addCase(get_all_socials.fulfilled, (state, { payload }) => {
                state.socialDetails = payload.socialDetails
            })
            // //update session
            .addCase(update_socials.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(update_socials.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(update_socials.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
       
     

    }
})

export const {messageClear,setCurrency} = socialReducer.actions
export default socialReducer.reducer