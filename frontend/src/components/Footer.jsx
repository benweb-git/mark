import React from 'react';
import { IoLogoWhatsapp } from "react-icons/io";
import { NavHashLink as Link } from 'react-router-hash-link';
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaRedditAlien } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const Footer = ({homeDetails}) => {
    const currentyear= new Date().getFullYear();

    return (
       

<footer className="bg-primary/95 py-3 px-2 rounded-md">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-y-3">
        <div className='flex-shrink-0'>
                            <Link to={'/'} className='text-xl md:text-3xl text-txt-200 font-bold md:font-semibold'>
                                <span className='inline-block'>{homeDetails?.homeDetails?.celebName}</span>
                                <span className='text-accent-100 inline-block ml-2'>Giveaway</span>
                            </Link>
         </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 mt-5 md:mt-0">
              <div>
                  <h2 className="mb-6 text-xl font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                      <li className="mb-4">
                          <Link to={`/#`} smooth className="hover:font-bold text-txt-500 uppercase hover:underline">Home</Link>
                      </li>
                      <li className="mb-4">
                          <Link to={`/#about`} smooth className="hover:font-bold text-txt-500 uppercase hover:underline">about</Link>
                      </li>
                      <li>
                          <Link to={`/#contact`} smooth className="hover:font-bold text-txt-500 uppercase hover:underline">contact</Link>
                      </li>
                  </ul>
              </div>
             
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {currentyear} <Link  className="hover:underline">{homeDetails?.homeDetails?.celebName}™</Link>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
               {
                homeDetails?.socialDetails?.whatsapp!==''&&homeDetails?.socialDetails?.whatsapp.length>2?<Link to={homeDetails?.socialDetails?.whatsapp} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <IoLogoWhatsapp className='hover:text-green-600'/>
                  <span className="sr-only">Whatsapp</span>
                 </Link>:<></>
               }
              
              
              {
                homeDetails?.socialDetails?.discord!==''&&homeDetails?.socialDetails?.discord.length > 2?<Link to={homeDetails?.socialDetails?.discord} className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                    </svg>
                  <span className="sr-only">Discord community</span>
              </Link>:<></>
              }

              {
                homeDetails?.socialDetails?.twitter!==''&&homeDetails?.socialDetails?.twitter.length > 2? <Link to={homeDetails?.socialDetails?.twitter} className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <FaXTwitter className='hover:text-black'/>
                 <span className="sr-only">X page</span>
             </Link>:<></>
              }
              {
                 homeDetails?.socialDetails?.instagram!==''&&homeDetails?.socialDetails?.instagram.length > 2? <Link to={homeDetails?.socialDetails?.instagram} className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                 <FaInstagram className='hover:text-red-400'/>
                  <span className="sr-only">instagram page</span>
              </Link>:<></>
              }
              {
                 homeDetails?.socialDetails?.facebook!==''&&homeDetails?.socialDetails?.facebook.length > 2? <Link to={homeDetails?.socialDetails?.facebook} className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                 <FaFacebook className='hover:text-blue-500'/>
                  <span className="sr-only">facebook page</span>
              </Link>:<></>
              }
               {
                 homeDetails?.socialDetails?.reddit!==''&&homeDetails?.socialDetails?.reddit.length > 2? <Link to={homeDetails?.socialDetails?.reddit} className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                 <FaRedditAlien className='hover:text-orange-500'/>
                  <span className="sr-only">reddit page</span>
              </Link>:<></>
              }
          </div>
      </div>
    </div>
</footer>

    );
};

export default Footer;