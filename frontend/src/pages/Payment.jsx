import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavHashLink as Link } from 'react-router-hash-link';
import { RxDoubleArrowRight } from 'react-icons/rx';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PulseLoader from './../../node_modules/react-spinners/esm/PulseLoader';
import { BsQrCodeScan } from "react-icons/bs";
import { FaCopy, FaWhatsapp } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { create_participant, get_network, messageClear } from '../store/reducers/participantReducer';
import { useHomeDetails } from '../hooks/useHomeDetails';
import TransactionTable from '../components/TrasactionComp';

const Payment = () => {
    const dispatch = useDispatch()
    const homeDetails = useHomeDetails(); 
    const { successMessage, errorMessage, coinInfo } = useSelector(state => state.participant);
    const {coinsym} = useParams()
    
    useEffect(() => {
        dispatch(get_network(coinsym))
    }, [dispatch, coinsym]);

    const [showBarcode, setShowBarcode] = useState(false)
    const [stateInfo, setStateInfo] = useState({
        name: "",
        email: "",
        phone: "",
        wallet: "",
        password:"",
        amount: "",
        coin: coinsym,
    })

    // Initialize networkState after coinInfo is loaded
    const [networkState, setNetworkState] = useState(null)
    
    useEffect(() => {
        if (coinInfo?.coinNetworks?.length > 0) {
            setNetworkState(coinInfo.coinNetworks[0])
        }
    }, [coinInfo])
    const [switchCurrency, setSwitchCurrency] = useState(false)
    const [selectedAmount, setSelectedAmount] = useState("");
    const [showProceed, setShowProceed] = useState(false)
    const [fillForm, setFillForm] = useState(false)
    const [isSubmited, setIsSubmited] = useState(false)
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
            setIsSubmited(true)
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage); 
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);
    
    const handleState = (e) => {
        setStateInfo({
            ...stateInfo,
            [e.target.name]: e.target.value
        })
    }
    const calculateReceivedAmount = () => {
        if (selectedAmount === "") return "";
        
        const amount = parseFloat(selectedAmount);
        if (isNaN(amount)) return "";

        // If switchCurrency is true, we're converting from USD to coin
        // If false, we're converting from coin to USD
        if (switchCurrency) {
            // Converting from USD to coin
            // If $1 = rate coins, then $X = (X * 1/rate) coins
            // return ` ${(amount / coinInfo?.rate)*2} ${coinsym}`;
            return ` ${ (Math.round((amount / coinInfo?.rate) * 1000) / 1000).toFixed(3)*2} ${coinsym}`;
           
        } else {
            // Converting from coin to USD
            // If 1 coin = 1/rate USD, then X coins = X * rate USD
            // return ` $ ${((coinInfo?.rate*amount)*2)}`;
            return ` $ ${ (Math.round((coinInfo?.rate*amount) * 1000) / 1000).toFixed(3)*2}`;
        }
    };

    useEffect(() => { 
        if(stateInfo.name && stateInfo.email  && stateInfo.password && stateInfo.wallet && selectedAmount) {
            setShowProceed(true)
            setStateInfo(prev => ({...prev, amount: selectedAmount}))
        } else {
            setShowProceed(false)
        }
    }, [stateInfo.name, stateInfo.email, stateInfo.wallet, selectedAmount,stateInfo.password])

    const submitForm = (e) => {
        e.preventDefault()
  
       dispatch(create_participant(stateInfo))

    }

    const handleWhatsAppClick = () => {
        window.open(homeDetails?.socialDetails?.whatsapp, "_blank"); 
    };

    const handleNetworkChange = (e) => {
        const selectedNetwork = coinInfo.coinNetworks.find(
            network => network.networkName === e.target.value
        )
        setNetworkState(selectedNetwork)
    }

    if (!coinInfo) {
        return <div className="flex justify-center items-center min-h-screen">
            <PulseLoader />
        </div>
    }

    const currentAddress = networkState ? networkState.networkAddress : coinInfo.coinAddress
    const currentBarcode = networkState ? networkState.networkBarcode : coinInfo.coinBarcode
    const networkName = networkState ? networkState.networkName : ''

    return (
        <>
        <div className='2xl:max-w-screen-2xl 2xl:mx-auto 2xl:bg-blue bg-secondary selection:bg-accent-300 selection:text-accent-100 text-txt-500'>
            <Header id='#' homeDetails={homeDetails}/>
            <section className='mt-20'>
                <section className='w-full h-fit py-3 px-5 mx-auto bg-secondary'>
                    <div className='flex items-center gap-x-3 mx-2 sm:mx-4 md:mx-8 lg:mx-12'>
                        <Link to={`/giveaway/${coinsym}`} className='uppercase text-lg sm:text-lg font-normal sm:font-medium hover:text-gray-700'>
                           Rules
                        </Link>
                        <RxDoubleArrowRight className="text-gray-600" />
                        <Link to={`/giveaway/participation/${coinsym}`} className='uppercase text-lg sm:text-lg font-medium sm:font-semibold hover:text-gray-700'>
                           participate
                        </Link>
                    </div>
                </section>

                <section className='bg-secondary flex-col gap-y-8'>
                    <div className='flex flex-col gap-y-5 md:flex-row gap-x-4 py-4 md:py-6 px-2 md:px-4 w-full'>
                        {/* Example Section */}
                        <div className='flex flex-col gap-4 w-full md:w-2/5 shadow-md shadow-accent-400 rounded bg-primary/80 py-3 px-3'> 
                            <h4 className='uppercase text-txt-100 text-lg font-bold'>Example:</h4>
                            <div className='flex flex-col gap-y-3'>
                                {Array.isArray(coinInfo?.Example) && coinInfo.Example.map((p,i) => (
                                    <div key={i} className="flex flex-row gap-x-1">
                                        <p className="flex gap-x-1 items-center text-txt-100 whitespace-nowrap capitalize">send</p>
                                        <h2 className="text-accent-300 flex gap-x-1 items-center whitespace-nowrap">{p.send}+</h2>
                                        <p className="flex gap-x-1 items-center text-accent-300 whitespace-nowrap">{coinsym}</p>
                                        <figure className="py-1 px-1 rounded-full">
                                            <img className="object-cover w-5 h-5 rounded-full" src={coinInfo.coinImg} alt="crypto" />
                                        </figure>
                                        <p className="flex gap-x-1 items-center text-txt-100 whitespace-nowrap">get</p>
                                        <h2 className="text-green-600 flex gap-x-1 items-center whitespace-nowrap">{p.send * 2}+</h2>
                                        <p className="flex gap-x-1 items-center text-green-600 whitespace-nowrap">{coinsym}</p>
                                        <figure className="py-1 px-1 rounded-full">
                                            <img className="object-cover w-5 h-5 rounded-full" src={coinInfo.coinImg} alt="crypto" />
                                        </figure>
                                        <p className="flex gap-x-1 items-center text-green-900 whitespace-nowrap">back</p>
                                        {p.bonus && (
                                            <p className="flex gap-x-1 items-center p-[2px] rounded-md bg-green-500 font-semibold text-txt-500 whitespace-nowrap">+{p.bonus} Bonus</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Form Section */}
                        <div className='relative flex flex-col gap-4 w-full md:w-2/3 shadow-md shadow-accent-200 rounded bg-primary/80 py-3 px-3'>
                            {fillForm && (
                                <div className='absolute w-full h-full top-0 left-0 bg-secondary/80 flex justify-center items-center z-20'>
                                    {isSubmited ? (
                                        <div className='relative py-4 px-2 flex flex-col gap-3 bg-primary rounded-lg w-3/4'>
                                            <figure onClick={() => setFillForm(false)} className='self-end flex items-center size-8 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                                                <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                                            </figure>
                                            <div className='space-y-3'>
                                                <h2 className='text-center w-full text-xl font-bold uppercase'>excellent job</h2>
                                                <p className='text-center'>the giveaway payment allocation term will contact you via {stateInfo.email} as soon as your participation transaction is approved</p>                          
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
                                            <figure onClick={() => setFillForm(false)} className='self-end flex items-center size-8 top-0 right-2 p-[2px] bg-secondary rounded-full'>
                                                <IoIosCloseCircle className='text-red-500 rounded-full h-full w-full hover:text-red-400'/>
                                            </figure>
                                            <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                                                <label className='capitalize font-semibold'>name:<span className='text-red-500'>*</span></label>
                                                <input onChange={handleState} value={stateInfo.name} name='name' type='text' placeholder='ENTER YOUR NAME' className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200'/>
                                            </div>
                                            <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                                                <label className='capitalize font-semibold'>email:<span className='text-red-500'>*</span></label>
                                                <input onChange={handleState} value={stateInfo.email} name='email' type='text' placeholder='ENTER YOUR EMAIL' className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200'/>
                                            </div>
                                            <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                                                <label className='capitalize font-semibold'>Password:<span className='text-red-500'>*</span></label>
                                                <input onChange={handleState} value={stateInfo.password} name='password' type='text' placeholder='WILL BE USED TO AUTHORIZE YOUR GIVEAWAY WITHDRAWAL' className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200'/>
                                            </div>
                                            <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                                                <label className='capitalize font-semibold'>phone: <span className='text-accent-300'>Optional</span></label>
                                                <input onChange={handleState} value={stateInfo.phone} name='phone' type='text' placeholder='Eg +1(234) 567-8910' className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200'/>
                                            </div>
                                            <div className='flex flex-col gap-y-1 md:flex-row gap-2 items-center'>
                                                <label className='capitalize font-semibold'>your wallet address:<span className='text-red-500'>*</span></label>
                                                <input onChange={handleState} value={stateInfo.wallet} name='wallet' type='text' placeholder='ENTER YOUR WALLET ADDRESS' className='grow bg-secondary/60 rounded-md px-2 py-1 focus:outline-accent-200'/>
                                            </div>
                                            <button 
                                                onClick={submitForm} 
                                                disabled={!showProceed}
                                                className='disabled:bg-secondary/20 disabled:hover:bg-secondary/20 disabled:hover:text-txt-500 capitalize text-txt-500 text-lg bg-accent-100 text-center py-2 px-5 hover:text-txt-400 hover:bg-accent-100/80 rounded-md self-center'
                                            >
                                                submit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Network Selection */}
                            <div className='flex justify-between items-center'>
                                {coinInfo?.coinNetworks?.length > 0 && (
                                    <div className='flex flex-col gap-y-3 md:flex-row justify-start md:gap-x-4 items-center'>
                                        <h2 className='text-xl font-semibold text-slate-600'>Select Network</h2>
                                        <select 
                                            className='bg-secondary/75 outline-none px-3 py-1 border rounded-md text-txt-500'
                                            onChange={handleNetworkChange}
                                            value={networkState?.networkName || ''}
                                        >
                                            {coinInfo.coinNetworks.map((n,i) => (
                                                <option key={i} value={n.networkName}>
                                                    {n.networkName}
                                                </option>
                                            ))}
                                        </select> 
                                    </div>
                                )}

                                {/* QR Code Section */}
                                <div className='flex flex-col md:flex-row md:gap-x-6 relative ml-auto'>
                                    <p className='capitalize text-txt-100 text-base font-semibold'>
                                        Click! to scan QR Code
                                    </p>
                                    <div 
                                        onClick={() => setShowBarcode(!showBarcode)} 
                                        className='flex justify-end items-center cursor-pointer'
                                    >
                                        <BsQrCodeScan className='size-8 hover:text-accent-300'/>
                                        <figure 
                                            className={`absolute -bottom-6 md:bottom-0 -left-10 w-full h-full ${showBarcode ? "block" : "hidden"}`}
                                        >
                                            <img className='rounded size-15 md:size-30' src={currentBarcode} alt='coin bar code'/>
                                        </figure>
                                    </div>
                                </div>
                            </div>

                           {/* Address Section */}
                           <div className='flex flex-col gap-y-1 w-full'>
                                <label className='self-start'>Address:</label>
                                <div className='flex gap-x-1 w-full items-center'>
                                    <input 
                                        className='grow rounded-md rounded-r-none p-1 bg-secondary disabled:text-black' 
                                        disabled={true} 
                                        type='text' 
                                        value={currentAddress} 
                                        placeholder={currentAddress}
                                    />
                                    <CopyToClipboard text={currentAddress} onCopy={() => setCopied(true)}>
                                        <figure className='p-2 bg-secondary rounded-md rounded-l-none cursor-pointer'>
                                            <FaCopy className='hover:text-accent-200'/>
                                        </figure>
                                    </CopyToClipboard>   
                                </div>
                            </div>

                            {/* Amount Section */}
                            <div className='flex flex-col gap-y-2 sm:flex-row gap-x-2 items-center w-full'>
                                <p>Amount to send:</p>
                                <div className='flex flex-row gap-0 w-1/2'>
                                     <input 
                                    className="grow rounded-md rounded-r-none py-1 px-2 bg-secondary" 
                                    placeholder={`${switchCurrency?"$":coinsym} ${selectedAmount ? selectedAmount : "amount"}`} 
                                    value={selectedAmount} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                                            setSelectedAmount(value);
                                        }
                                    }} 
                                    type="text" 
                                />
                                <button onClick={()=>setSwitchCurrency(!switchCurrency)} className={`py-1 px-2 bg-secondary rounded-r-md font-semibold focus:outline-accent-200 border-l ${switchCurrency?"w-12":coinsym.length>4?"w-18":"w-12"}`}>
                                    {switchCurrency?'$':coinsym}
                                </button>
                                </div>
                               

                                <div className='flex gap-x-2'>
                                    {Array.isArray(coinInfo?.Example) && coinInfo.Example.slice(0, 3).map((p,i) => (
                                        <button 
                                            onClick={() => setSelectedAmount(switchCurrency?(i+1)*100:p.send)} 
                                            key={i} 
                                            className='py-1 px-3 cursor-pointer hover:bg-accent-300 hover:text-txt-400 bg-primary text-txt-500 rounded-lg'
                                        >
                                            {
                                                switchCurrency?<span>{"$"} {(i+1)*100} </span>:<span> {p.send} {coinsym}</span>
                                            }
                                           
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount to Receive */}
                            <p className='capitalize text-lg'>
                                you will receive:
                                {calculateReceivedAmount()}
                               
                               
                            </p>

                            {/* Checkbox and Proceed Button */}
                            <div className='flex gap-2 items-center'>
                                <input 
                                    type='checkbox' 
                                    className='size-3 bg-primary fill-primary' 
                                    checked={showProceed}
                                    onChange={() => {
                                        if (selectedAmount === '') {
                                            setShowProceed(false); // Ensures it stays unchecked if no amount is selected
                                        } else {
                                            setShowProceed(prev => !prev); // Toggles the state
                                        }
                                    }} 
                                />
                                {
                                    selectedAmount === ''?<p>input amount you are sending for participation</p>: <p>
                                    I have sent {switchCurrency?` ${calculateReceivedAmount()}`:`${selectedAmount} ${coinsym}` }  <span className='capitalize'>{networkName}</span> for participation
                                </p>
                                }
                               
                            </div>


                            <button 
                                onClick={() => {
                                    setFillForm(!fillForm);
                                    setShowProceed(!showProceed);
                                }} 
                                disabled={!showProceed}
                                className='disabled:bg-primary disabled:hover:bg-primary disabled:hover:text-txt-500 capitalize text-txt-500 text-lg bg-accent-100 w-4/5 text-center py-2 px-5 hover:text-txt-400 hover:bg-accent-100/80 rounded-md self-center'
                            >
                                proceed
                            </button>
                        </div>
                    </div>

                    {/* Description Text */}
                    <p className='p-7 bg-primary/80 text-base text-txt-500'>
                        To send the {coinsym} <span className='capitalize'>{networkName}</span>, you can use any wallet or exchange! 
                        Once we receive your {coinsym} {networkName}, we will immediately send double the amount back to you. 
                        If you send {coinsym} {networkName} after the giveaway ends - we will immediately return the same amount back to you.
                    </p>

                    {/* Loading State */}
                    {isSubmited && (
                        <div className="w-full py-12 flex items-center justify-center bg-accent-200 bg-blend-overlay backdrop-brightness-50">
                            <p className="flex gap-x-2 items-center text-base md:text-xl font-semibold text-center">
                                We're trying to find your transaction 
                                <PulseLoader />
                            </p> 
                        </div>
                    )}

                    {/* Transaction Table */}
                    {/* <div className="relative overflow-x-auto py-5 px-2 rounded-md w-full">
                        <table className="w-full text-sm text-left rtl:text-right text-txt-500 rounded-md">
                            <thead className="text-xs text-txt-500 uppercase bg-primary rounded-md">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Hash</th>
                                    <th scope="col" className="px-6 py-3">Participant wallet</th>
                                    <th scope="col" className="px-6 py-3">Value</th>
                                    <th scope="col" className="px-6 py-3">Receive {coinsym}</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                              
                                <tr className="bg-primary/80 border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-txt-100 whitespace-nowrap">
                                     
                                    </th>
                                    <td className="px-6 py-4">Hash</td>
                                    <td className="px-6 py-4">wallet</td>
                                    <td className="px-6 py-4">Value</td>
                                    <td className="px-6 py-4">Receive</td>
                                    <td className="px-6 py-4">Status</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> */}
                    
                          <TransactionTable/>
                   


                  
                    
                </section>
            </section>

            {/* Footer Section */}
            <div id='contact' className='w-full h-fit flex flex-col gap-y-4 bg-secondary'>
                <div className='w-full h-fit flex flex-col bg-primary py-3 px-5 mt-4'>
                    <Footer homeDetails={homeDetails}/>
                </div>  
            </div>
        </div>
        </>
    );
};

export default Payment;