import React, { useEffect, useState } from 'react';
import { RiMenu3Line } from "react-icons/ri";
import { IoCloseCircle } from "react-icons/io5";
import { NavHashLink as Link } from 'react-router-hash-link';
import { FaWhatsapp } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { get_participant, messageClear } from '../store/reducers/participantReducer';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import toast from 'react-hot-toast';
import { PacmanLoader } from 'react-spinners';
import { LuBadgeAlert } from "react-icons/lu";


const Header = ({homeDetails}) => {

    const dispatch = useDispatch()
    const { successMessage, errorMessage,participant } = useSelector(state => state.participant);
    const [confirmationStatus, setConfirmationStatus] = useState(40);
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - confirmationStatus / 100 * circumference;
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setIsSubmited(false)
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage); 
            dispatch(messageClear());
        }
        if(participant){
            setConfirmationStatus(parseInt(participant?.confirmationStatus, 10))
            if(participant?.confirmationStatus>=100){
                setSearchResult(false)
            }  
        }

    }, [successMessage, errorMessage, dispatch,participant]);

   
    const [showNav, setShowNav] = useState(false);
    const [CheckStatus, setCheckStatus] = useState(false)
    const [isSubmited, setIsSubmited] = useState(true)
    const [isReady, setIsReady] = useState(true)
     const [partEmail, setPartEmail] = useState('')
     const [searchResult, setSearchResult] = useState(true)
     const [myloader, setMyloader] = useState(false)
     
        const handleWhatsAppClick = () => {
            window.open(homeDetails?.socialDetails?.whatsapp, "_blank"); 
        };
         const submitForm = (e) => {
                e.preventDefault()
               dispatch(get_participant(partEmail))
        
            }
      const withdrawReady = (e) => {
         e.preventDefault()
         setMyloader(true)
         setIsReady(false)
         setTimeout(() => {
            setMyloader(false)
         }, 10000);

      }

    return (
        <header id='home' className=' relative w-full bg-secondary h-fit'>
            {
                CheckStatus?  <div className='  absolute h-screen w-[200px]   md:h-[650px] md:w-[400px] top-6 right-0 bottom-0 bg-primary flex justify-center items-center z-20'>
                {
                 isSubmited? <div className='relative py-4 px-2 flex flex-col gap-3 bg-primary rounded-lg w-full h-3/4'>
                <figure  onClick={()=>{setIsReady(true);setIsSubmited(true);setCheckStatus(false);setIsSubmited(true);setMyloader(false)}} className='self-end flex items-center size-8 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                     <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                 </figure>
                  <h2 className='uppercase text-center font-bold text-xl'>we are excited that you participated</h2>
                  <p  className=' text-lg'>Kindly input your contact email address to check giveaway status</p>
                 <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                     <label className='capitalize font-semibold'>email:<span className='text-red-500'>*</span></label>
                     <input onChange={(e)=>setPartEmail(e.target.value)} value={partEmail} name='email' type='text' placeholder='ENTER YOUR EMAIL' className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200' required/>
                 </div>
                 <button 
                     onClick={submitForm} 
                     className='disabled:bg-secondary/20 disabled:hover:bg-secondary/20 disabled:hover:text-txt-500 capitalize text-txt-500 text-lg bg-accent-100 text-center py-2 px-5 hover:text-txt-400 hover:bg-accent-100/80 rounded-md self-center'
                 >
                    Check
                 </button>
 
                 <div className=' bottom-5 items-self-end justify-center mt-4'>
                     <div className='w-full h-[1px] bg-black mt-5'></div>
                     <h2 className='text-center uppercase text-lg font-semibold'>contact us</h2>
                     
                       <div className='flex gap-2 justify-evenly w-full items-center py-3'>
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
                  </div>:(
                      searchResult?<div className="relative py-4 px-2 flex flex-col gap-3 bg-primary rounded-lg w-full h-3/4">
                          <figure   onClick={()=>{setIsReady(true);setIsSubmited(true);setCheckStatus(false);setIsSubmited(true);setMyloader(false)}} className='self-end flex items-center size-10 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                             <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                         </figure>
                      {/* Wrapper for the circle */}
                      <div className="self-center w-48 h-48 relative">
                        <svg
                          className="transform -rotate-90 w-full h-full"
                          viewBox="0 0 240 240"
                          role="progressbar"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={confirmationStatus}
                        >
                          {/* Background Circle */}
                          <circle
                            cx="120"
                            cy="120"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="20"
                            fill="transparent"
                            className="text-gray-300"
                          />
                          {/* Progress Circle */}
                          <circle
                            cx="120"
                            cy="120"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="20"
                            fill="transparent"
                            className="text-blue-500"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.35s ease-out' }}
                          />
                        </svg>
                        {/* Centered Text */}
                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                          {confirmationStatus}%
                        </span>
                      </div>
                      <h2 className='font-semibold text-lg '>We are working to verify your transaction you will be notified immediately your payment is approved</h2>
                
                      {/* The rest of your content */}
                      <div className=' bottom-5 items-self-end justify-center mt-4'>
                     <div className='w-full h-[1px] bg-black mt-5'></div>
                     <h2 className='text-center uppercase text-xl font-semibold'>contact us</h2>
                     
                       <div className='flex gap-2 justify-evenly w-full items-center py-3'>
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
 
                    </div>:myloader?<PacmanLoader color="blue" loading={true} height={20} />:isReady?<div className='relative py-4 px-2 flex flex-col gap-3 bg-primary rounded-lg w-full h-3/4'>
                    <figure   onClick={()=>{setIsReady(true);setIsSubmited(true);setCheckStatus(false);setIsSubmited(true);setMyloader(false)}} className='self-end flex items-center size-10 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                             <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                         </figure>
 
                    {/* the verified will be here */}
                    <div className="p-6">
                     <figure className="mx-auto my-1 flex justify-center">
                         {/* Apply sizing and color directly to the icon */}
                         <RiVerifiedBadgeFill className="text-blue-500 size-28" />
                     </figure>
                     <div className="text-center">
                         <h3 className="md:text-2xl text-base text-gray-900 font-semibold uppercase">
                         Confirmation is complete
                         </h3>
                         <p className="text-gray-600 my-2">Your Giveaway is ready!!!</p>
                         <p className='text-black text-lg'>Withdraw your Giveaway</p>
                         <div className="py-10 text-center">
                         <button onClick={withdrawReady} className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 uppercase rounded">
                             Connect your Wallet
                         </button>
                         </div>
                     </div>
                     </div>
 
 
                      
                    <div className='flex gap-2 justify-evenly w-full items-center py-3'>
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
 
                  </div>:<div className='relative py-4 px-2 flex flex-col gap-3 bg-primary rounded-lg w-full h-3/4'>
                  <figure   onClick={()=>{setIsReady(true);setIsSubmited(true);setCheckStatus(false);setIsSubmited(true);setMyloader(false)}} className='self-end flex items-center size-10 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                             <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                         </figure>
 
                    {/* the verified will be here */}
                    <div className="p-6">
                     <figure className="mx-auto my-1 flex justify-center">
                         {/* Apply sizing and color directly to the icon */}
                         <LuBadgeAlert  className="text-red-500 size-28" />
                     </figure>
                     <div className="text-center">
                         <h3 className="md:text-2xl text-base text-gray-900 font-semibold uppercase">
                          something went wrong  
                         </h3>
                         <p className="text-gray-600 my-2">contact support for help</p>
                         <div className="py-10 text-center">
                         <button onClick={withdrawReady} className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 uppercase rounded">
                             TRY AGAIN
                         </button>
                         </div>
                     </div>
                     </div>
 
 
                      
                    <div className='flex gap-2 justify-evenly w-full items-center py-3'>
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
                  )
                 
                }
               
 
                  </div>:<></>
 
            }
            <section className=' fixed top-0 left-0 right-0 w-full bg-primary z-50'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                    <div className='flex items-center justify-between gap-x-4'>
                        {/* Logo/Brand */}
                        <Link to={'/'} className='cursor-pointer block flex-shrink-0'>
                            <h1 className='text-xl md:text-3xl text-txt-200 font-bold md:font-semibold'>
                                <span className='inline-block'>{homeDetails?.homeDetails?.celebName}</span>
                                <span className='text-accent-100 inline-block ml-2'>Giveaway</span>
                            </h1>
                        </Link>

                        {/* Navigation */}
                        <nav className={` self-center
                            ${showNav 
                                ? 'absolute top-full right-4 w-[calc(100%-2rem)] md:w-auto bg-secondary md:bg-transparent p-4 rounded-lg rounded-t-none shadow-lg md:shadow-none' 
                                : 'hidden'
                            } 
                            md:block md:static md:p-0
                        `}>
                            <div className='flex flex-col md:flex-row items-center gap-4 md:gap-6'>
                                <div className='flex flex-col md:flex-row items-center gap-2 md:gap-4'>
                                    <Link onClick={() => setShowNav(!showNav)} to={`/`} smooth className='w-full md:w-auto text-center uppercase text-base md:text-lg font-semibold px-4 py-2 hover:bg-accent-100 rounded-md transition-colors duration-200'>
                                        home
                                    </Link>
                                    <Link onClick={() => setShowNav(!showNav)}  to={`/#contact`} smooth className='w-full md:w-auto text-center uppercase text-base md:text-lg font-semibold px-4 py-2 hover:bg-accent-100 rounded-md transition-colors duration-200'>
                                        contact
                                    </Link>
                                    <Link onClick={() => setShowNav(!showNav)}  to={`/#about`} smooth  className='w-full md:w-auto text-center uppercase text-base md:text-lg font-semibold px-4 py-2 hover:bg-accent-100 rounded-md transition-colors duration-200'>
                                        about
                                    </Link>
                                </div>
                                <Link to={`#`} smooth  onClick={()=>{setShowNav(!showNav);setIsReady(true);setIsSubmited(true);setCheckStatus(!CheckStatus);setIsSubmited(true);setMyloader(false)}} className='text-center w-full md:w-auto bg-accent-100 text-lg font-semibold capitalize px-6 py-2 rounded-md hover:bg-accent-200 transition-colors duration-200'>
                                    check giveaway status
                                </Link>
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setShowNav(!showNav)}
                            className='md:hidden p-2 rounded-full hover:bg-primary/10 transition-colors duration-200'
                        >
                            {showNav 
                                ? <IoCloseCircle className='w-8 h-8 text-red-500' />
                                : <RiMenu3Line className='w-8 h-8 text-accent-300' />
                            }
                        </button>
                    </div>
                </div>
            </section>

        </header>
    );
};

export default Header;