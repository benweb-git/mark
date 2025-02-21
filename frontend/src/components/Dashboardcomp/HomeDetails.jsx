import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createHomeDetails, get_home_details, messageClear, updateHomeDetails } from '../../store/reducers/homeReducer';
import { FaImage } from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';

const HomeDetails = () => {
    const dispatch = useDispatch()
    const { successMessage, errorMessage, loader,homeDetails } = useSelector(state => state.home)
    const [imageShow, setImageShow] = useState('')
    const [videoShow, setVideoShow] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState(null)
    const [UpdateForm, setUpdateForm] = useState(false)


    const [state, setState] = useState({
        name: '',
        image: '',
        video: '',
        logo: ''
    })
    useEffect(() => {
       dispatch(get_home_details()) 
    }, [dispatch])

    useEffect(() => {

        if (homeDetails) {
        
        setEditId(homeDetails._id);
        
        showChange();
        
        }
        
        }, [homeDetails]);

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        
        // Append all form fields to FormData
        Object.keys(state).forEach(key => {
            if (state[key] !== '') {
                formData.append(key, state[key])
            }
        })
        if (isEdit) {
             dispatch(updateHomeDetails({ id:editId,formData }))
        } else {
             dispatch(createHomeDetails(formData))
        }
    }

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageShow(URL.createObjectURL(file))
            setState(prev => ({ ...prev, image: file }))
        }
    }

    const handleVideo = (e) => {
        const file = e.target.files[0]
        if (file) {
            setVideoShow(URL.createObjectURL(file))
            setState(prev => ({ ...prev, video: file }))
        }
    }

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            showChange()
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch])

    const showChange = () => {
        if(homeDetails){
            setState({
                    name: homeDetails.celebName,
                    image: homeDetails.celebImage,
                    video: homeDetails.celebVideo,
                    logo: homeDetails.logo
                })
            setImageShow(homeDetails.celebImage)
            setVideoShow(homeDetails.celebVideo)
            setIsEdit(true)
            setUpdateForm(true)
        }  
       
    }

    const resetForm = () => {
        setState({
            name: '',
            image: '',
            video: '',
            logo: ''
        })
        setImageShow('')
        setVideoShow('')
        setIsEdit(true)
    }

    return (
        <div className='w-full h-full bg-primary flex flex-col gap-y-4 justify-center items-center p-4'>
           
                {
                  UpdateForm?<button onClick={()=>{resetForm();setUpdateForm(!UpdateForm)}} className='w-full self-end py-2 px-4 bg-accent-100'>update details</button>:<></>
                }
                 <form onSubmit={handleSubmit} className='w-full max-w-4xl bg-white rounded-lg p-6 shadow-lg'>
                <div className='flex flex-col md:flex-row gap-4 mb-6'>
                    {/* Image Upload */}
                    <div className='flex-1'>
                        <label 
                            className='flex flex-col items-center justify-center h-64 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg'
                            htmlFor="image"
                        >
                            {imageShow ? (
                                <img 
                                    src={imageShow} 
                                    alt="Preview" 
                                    className='w-full h-full object-cover rounded-lg'
                                />
                            ) : (
                                <>
                                    <FaImage className='text-4xl text-gray-400 mb-2' />
                                    <span className='text-gray-600'>Upload Image</span>
                                </>
                            )}
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImage}
                            className='hidden'
                        />
                    </div>

                    {/* Video Upload */}
                    <div className='flex-1'>
                        <label 
                            className='flex flex-col items-center justify-center h-64 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg'
                            htmlFor="video"
                        >
                            {videoShow ? (
                                <video 
                                    src={videoShow} 
                                    controls
                                    className='w-full h-full object-cover rounded-lg'
                                />
                            ) : (
                                <>
                                    <FaImage className='text-4xl text-gray-400 mb-2' />
                                    <span className='text-gray-600'>Upload Video</span>
                                </>
                            )}
                        </label>
                        <input
                            type="file"
                            id="video"
                            accept="video/*"
                            onChange={handleVideo}
                            className='hidden'
                        />
                    </div>
                </div>

                {/* Name Input */}
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Celebrity Name</label>
                    <input
                        type="text"
                        name="name"
                        value={state.name}
                        onChange={handleChange}
                        placeholder="Enter celebrity name"
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
                    />
                </div>

                {/* Logo Input */}
                <div className='mb-6'>
                    <label className='block text-gray-700 mb-2'>platform</label>
                    <input
                        type="text"
                        name="logo"
                        value={state.logo}
                        onChange={handleChange}
                        placeholder="Enter logo URL"
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loader}
                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${
                        loader ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loader ? (
                        <FadeLoader color="#fff" loading={true} height={15} />
                    ) : isEdit ? (
                        'Update Details'
                    ) : (
                        'Create Entry'
                    )}
                </button>
                 </form>
            
           
            
        </div>
    );
};

export default HomeDetails;