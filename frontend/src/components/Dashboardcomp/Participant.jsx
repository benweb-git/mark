import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowDown, FaEye, FaImage, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { FadeLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { FaArrowUp19,} from 'react-icons/fa6';
import { GrDocumentUpdate } from "react-icons/gr";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import moment from 'moment';
import { delete_participant, get_all_participants, messageClear, update_participant } from '../../store/reducers/participantReducer';



const Participant = () => {
     const dispatch = useDispatch()
     const [show, setShow] =  useState(false)
     const { successMessage, errorMessage, participants } = useSelector(state => state.participant);
     const [Status, setConfirmationStatus] = useState('');

     const [copied, setCopied] = useState(false)

        useEffect(() => {
            if(copied) {
                toast.success('Copied')
                setTimeout(() => {
                    setCopied(false);
                }, 2000); 
            }
        }, [copied])
     

      useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage); 
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);
     

    

    return (
        <>
         <div className='flex flex-col gap-y-7 w-full h-full'>
           <div className='w-full h-full bg-secondary py-5 px-3 rounded-md'>
            {
             <div className='flex flex-col gap-y-4  '>
                <button onClick={()=>dispatch(get_all_participants())} className='p-3 cursor-pointer hover:bg-accent-200 rounded bg-accent-100 justify-center w-full font-semibold uppercase focus:bg-accent-200'>get all participants</button>
                
                <div class="relative overflow-x-auto">


                  
                     

                      <div className=' flex justify-between items-center'>
                          <div className='py-3 w-[25%] font-bold'>date</div>
                          <div className='py-3 w-[13%] font-bold'>name</div>
                          <div className='py-3 w-[18%] font-bold'>status</div>
                          <div className='py-3 w-[13%] font-bold'>email</div>
                          <div className='py-3 w-[18%] font-bold'>status</div>
                          <div className='py-3 w-[18%] font-bold'>phone</div>
                          <div className='py-3 w-[18%] font-bold'>address</div>
                          <div className='py-3 w-[18%] font-bold'>Action </div>
                          <div onClick={()=>setShow(false)} className='py-3 w-[8%] font-bold uppercase'><FaArrowUp19/> </div> 
                      </div> 
                         

                     {
                    participants.length>0?participants?.map((n,i) =>  <div className='text-txt-500'>
                        <div className=' flex justify-between items-start border-b border-slate-700'>
                    <div className='py-3 w-[25%] font-medium whitespace-nowrap'>{moment(n?.createdAt).format('MMM DD, YYYY')}</div>
                            <div className='py-3 w-[13%] font-medium'>{n?.name}</div>
                            <div className='py-3 w-[8%] font-medium'>{n?.confirmationStatus}</div>
                            <div className='py-3 w-[20%] font-medium'>{n?.email}</div>
                            <div className='py-3 w-[18%] font-medium'>{n?.phone}</div>
                             <CopyToClipboard text={n?.wallet} onCopy={() => setCopied(true)}><div className='cursor-pointer py-3 w-[18%] font-medium'>{n?.wallet.slice(0,6)}</div></CopyToClipboard>
                            <div className='py-3 w-[18%] font-medium'>
                                <span onClick={()=>dispatch(delete_participant(n?._id))} className=' hover:text-red-500 uppercase cursor-pointer'><FaTrashAlt className='text-red-500 hover:text-red-300'/></span>
                                </div>
                            <div onClick={(e) => setShow(n._id)} className='py-3 w-[8%] font-medium'><FaArrowDown/></div> 
                        </div> 
                        
                        
                          <div className={show === n._id? 'block border-b border-slate-700 bg-[#8288ed]' : 'hidden'}>
                              
                        {
                          n?.confirmationStatus!==""&&<div className=' flex justify-start items-start border-b border-slate-700'>
                              <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                                    <label className='capitalize font-semibold'>update status:</label>
                                    <input onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                                            setConfirmationStatus(value);
                                        }
                                    }} 
                                  value={Status} name='phone' type='text' placeholder={n?.confirmationStatus} className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200'/>
                                </div>  
                              <div onClick={()=>{const id=n?._id;const confirmationStatus=parseInt(Status);dispatch(update_participant({id,confirmationStatus}));}} className='ml-2 py-3 w-[18%] font-medium'><GrDocumentUpdate className='text-green-500 hover:text-green-300 size-6'/></div> 
                              <div className='py-2 w-[18%] font-medium pl-2'>phone: {n?.phone}</div>
                              <div className='py-2 w-[20%] font-medium pl-2'>{n?.email}:{n?.password}</div>
                            </div>
                        }
                        
                                </div>  
                            </div> ):<></>
                    }
                    
                </div>    
             </div>
            }
            

           </div>
           
        </div>
        </>
       
    );
};




export default Participant;