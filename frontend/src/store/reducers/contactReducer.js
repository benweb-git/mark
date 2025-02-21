import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 


// End Method 
//get_all_contacts
export const get_all_contacts = createAsyncThunk(
    'contact/get_all_contacts',
    async(_, { rejectWithValue,fulfillWithValue }) => {
       // console.log("get contacts")
        try {
            const {data} = await api.get(`/participant/get-contacts`) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response.data)
        }
    }
)
//delete_contact
export const delete_contact = createAsyncThunk(
    'contact/delete_contact',
    async(id, { rejectWithValue,fulfillWithValue }) => {
        //console.log(id)
        try {
            const {data} = await api.delete(`/participant/delete-contact/${id}`) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// End Method 
//create_contact
export const create_contact = createAsyncThunk(
    'contact/create_contact',
    async(stateInfo,{rejectWithValue, fulfillWithValue}) => {
        //console.log(stateInfo)
        try { 
            const {data} = await api.post('/participant/create-contact',stateInfo,{withCredentials: true}) 
           // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
           // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
 


export const contactReducer = createSlice({
    name: 'contact',
    initialState:{
        errorMessage : '',
        successMessage: '', 
        contacts:''
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
 
    },
    extraReducers: (builder) => {
        builder


            .addCase(create_contact.pending, (state, { payload }) => {
                state.loader = true;
                        })
            .addCase(create_contact.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            .addCase(create_contact.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.successMessage = payload.success
            })
            //get_all_contacts
            .addCase(get_all_contacts.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.contacts=payload.contacts
            })
            .addCase(get_all_contacts.rejected, (state, { payload }) => { 
                state.loader = false;
                state.errorMessage = payload.error;
            })
            //delete_contact
            .addCase(delete_contact.pending, (state, { payload }) => {
                state.loader = true;
            })

            .addCase(delete_contact.fulfilled, (state, { payload }) => { 
                state.loader = false;
                state.successMessage = payload.success
            })
            .addCase(delete_contact.rejected, (state, { payload }) => { 
                state.loader = false;
                state.errorMessage = payload.error
            })


        
    }
})
export const {messageClear} = contactReducer.actions
export default contactReducer.reducer