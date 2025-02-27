import React from 'react';
import { useHomeDetails } from '../hooks/useHomeDetails'; // Add this import
import Header from '../components/Header';
import Features from '../components/Features';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import Contentbody from '../components/Contentbody';

const Home = () => {
    const homeDetails = useHomeDetails(); 
    
    return (
        <>
        <div className='2xl:max-w-screen-2xl 2xl:mx-auto 2xl:bg-blue selection:bg-accent-300 selection:text-accent-100 text-txt-500'>
            <Header id='#' homeDetails={homeDetails}/> {/* Pass to child components if needed */}
            <section>
                <Contentbody homeDetails={homeDetails}/>
                <div id='contact' className='w-full h-fit flex flex-col gap-y-4 bg-primary py-3 px-5'>
                        <ContactForm/>
                </div> 
            </section>
            <section>
                <div id='about' className='w-full h-fit flex flex-col gap-y-4 bg-primary py-3 px-5'>
                        <h1 className="mb-4 text-xl md:text-3xl tracking-tight font-bold text-center text-txt-500">
                            {homeDetails?.about_title || 'About'} {/* Use homeDetails data */}
                        </h1>
                        <Features homeDetails={homeDetails}/>
                </div>
            </section>
            <div className='w-full h-fit flex flex-col gap-y-4 bg-secondary'>
                <div id='footer' className='w-full h-fit flex flex-col bg-primary py-3 px-5 mt-4'>
                    <Footer homeDetails={homeDetails}/>
                </div>  
            </div>
        </div>
        </>
    );
};

export default Home;