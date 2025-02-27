import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { RxDoubleArrowRight } from 'react-icons/rx';
import { useHomeDetails } from '../hooks/useHomeDetails';

const Detailscurrency = () => {
     const homeDetails = useHomeDetails(); 
    const {coinsym} = useParams()

    return (
        <>
        <div className='2xl:max-w-screen-2xl 2xl:mx-auto 2xl:bg-blue selection:bg-accent-300 selection:text-accent-100 text-txt-500'>
            <Header id='#' homeDetails={homeDetails}/>
            <section className='mt-20'>
            <section className='w-full h-fit py-3 px-5 mx-auto bg-secondary'>
                    <div className='flex items-center gap-x-3 mx-2 sm:mx-4 md:mx-8 lg:mx-12'>
                        <Link to="/" className='uppercase text-lg sm:text-lg font-normal sm:font-medium hover:text-gray-700'>
                            home
                        </Link>
                        <RxDoubleArrowRight className="text-gray-600" />
                        <Link to={`/giveaway/${coinsym}`} className='uppercase text-lg sm:text-lg font-medium sm:font-semibold hover:text-gray-700'>
                           prerequisite
                        </Link>
                    </div>
                </section>
                    <div id='' className='w-full h-fit flex flex-col gap-y-4 bg-primary py-3 px-5'>
                       <div className='flex flex-col justify-center gap-y-4'> 
                          <h2 className='uppercase text-txt-500 font-bold text-2xl'>prerequisite!</h2>
                          <p className='text-lg text-justify'>In order to receive {coinsym} from our giveaway, you have to send {coinsym} and we will send back to you double the amount, instantly! This is to avoid bad actors exploiting our giveaway.</p>
                           <div className='flex gap-x-4 py-3 px-4 bg-secondary rounded justify-start w-fit' >
                              <h5 className='text-base font-semibold p-1 rounded bg-accent-200'>IMPORTANT</h5>
                              <p className='text-txt-100 text-sm items-center'>You can only participate ONCE!</p> 
                           </div>
                       </div>
                       <Link to={`/giveaway/participation/${coinsym}`} className='w-4/5 text-center py-2 px-5 bg-accent-100 hover:text-txt-400 hover:bg-accent-100/80 rounded-md self-center capitalize'> to participate</Link>
                       
                    </div>
                   
            </section>
            <div id='#contact' className='w-full h-fit flex flex-col gap-y-4 bg-secondary '>
                    <div  className='w-full h-fit flex flex-col  bg-primary py-3 px-5 mt-4'>
                        <Footer homeDetails={homeDetails}/>
                    </div>  
                    </div>
        </div>
           
         
           
        </>
    );
};

export default Detailscurrency;