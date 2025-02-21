import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { NavHashLink as Link } from 'react-router-hash-link';
import { RxDoubleArrowRight } from 'react-icons/rx';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_participant, messageClear } from '../store/reducers/participantReducer';
import { FaWhatsapp } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import toast from 'react-hot-toast';

const Checkgiveaway = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { successMessage, errorMessage } = useSelector(state => state.participant);


    const [fillForm, setFillForm] = useState(true)
    const [isSubmited, setIsSubmited] = useState(false)
     const [partEmail, setPartEmail] = useState('')
     useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setIsSubmited(true)
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage); 
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);
        const handleWhatsAppClick = () => {
            window.open(`https://wa.me/+2348164706710`, "_blank"); 
        };
         const submitForm = (e) => {
                e.preventDefault()
               // console.log(stateInfo)
               dispatch(get_participant(partEmail))
        
            }

    return (
       <>
          <div className='2xl:max-w-screen-2xl 2xl:mx-auto 2xl:bg-blue selection:bg-accent-300 selection:text-accent-100 text-txt-500'>
            <Header/>
            <section className='mt-20'>
            <section className='w-full h-fit py-3 px-5 mx-auto bg-secondary'>
                    <div className='flex items-center gap-x-3 mx-2 sm:mx-4 md:mx-8 lg:mx-12'>
                        <Link onClick={()=>navigate(-1)} className='uppercase text-lg sm:text-lg font-normal sm:font-medium hover:text-gray-700'>
                            home
                        </Link>
                        <RxDoubleArrowRight className="text-gray-600" />
                        <Link to={`/check-giveaway`} className='uppercase text-lg sm:text-lg font-medium sm:font-semibold hover:text-gray-700'>
                           Check giveaway
                        </Link>
                    </div>
                </section>
                     {fillForm && (
                                <div className=' w-full h-full top-0 left-0 bg-secondary/80 flex justify-center items-center z-20'>
                                    {isSubmited ? (
                                        <div className='relative py-4 px-2 flex flex-col gap-3 bg-primary rounded-lg w-3/4'>
                                            <figure  onClick={()=>navigate(-1)} className='self-end flex items-center size-8 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                                                <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                                            </figure>
                                            <div className='space-y-3'>
                                                <h2 className='text-center w-full text-xl font-bold uppercase'>excellent job</h2>
                                                <p className='text-center'>the giveaway payment allocation term will contact you via as soon as your participation transaction is approved</p>                          
                                            </div>
                                            <p className='text-center font-semibold text-lg'>for more information contact allocation term via:</p>
                                            <div className='flex gap-2 justify-evenly w-full items-center'>
                                                <Link to='/#contact' smooth className='p-2 rounded-lg bg-secondary/25 cursor-pointer hover:bg-secondary/80 size-16'>
                                                    <MdEmail className='w-full h-full text-blue-600 hover:text-blue-400'/>
                                                </Link>
                                                <div className='flex flex-col gap-y-1'>
                                                    <div className='w-[2px] h-2/4 bg-black'></div>
                                                    <p className='font-bold text-lg text-black'>OR</p>
                                                    <div className='w-[2px] h-2/4 bg-black'></div>
                                                </div>
                                                <figure onClick={handleWhatsAppClick} className='p-2 rounded-lg bg-secondary/25 cursor-pointer hover:text-green-400 hover:bg-secondary/80 size-16'>
                                                    <FaWhatsapp className='w-full h-full text-green-500'/>
                                                </figure>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='relative py-4 px-2 flex flex-col gap-3 bg-primary rounded-lg w-3/4'>
                                            <figure  onClick={()=>navigate(-1)} className='self-end flex items-center size-8 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                                                <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                                            </figure>
                                            <h3>to check giveaway status you will need to input your email</h3>
                                            <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                                                <label className='capitalize font-semibold'>email:<span className='text-red-500'>*</span></label>
                                                <input onChange={(e)=>setPartEmail(e.target.value)} value={partEmail} name='email' type='text' placeholder='ENTER YOUR EMAIL' className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200' required/>
                                            </div>
                                            <button 
                                                onClick={submitForm} 
                                                className='disabled:bg-secondary/20 disabled:hover:bg-secondary/20 disabled:hover:text-txt-500 capitalize text-txt-500 text-lg bg-accent-100 text-center py-2 px-5 hover:text-txt-400 hover:bg-accent-100/80 rounded-md self-center'
                                            >
                                                submit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                   
            </section>
            <div id='#contact' className='w-full h-fit flex flex-col gap-y-4 bg-secondary '>
                    <div  className='w-full h-fit flex flex-col  bg-primary py-3 px-5 mt-4'>
                        <Footer/>
                    </div>  
                    </div>
        </div>
       </>
    );
};

export default Checkgiveaway;