import React, { useState } from 'react'
import axios from 'axios';
import { FaFileWord } from "react-icons/fa6";

function Home() {
    const [selectedfile,setselectedfile] = useState(null);
    const [convert,setconvert] = useState("");
    const [downloaderror,setdownloaderror] = useState("");
    //console.log(selectedfile);
    const handlefilechange = (e) =>{
        setselectedfile(e.target.files[0]);
    }
    const handlesubmit  = async (e) =>{
        e.preventDefault();
        if(!selectedfile){
            setconvert("Please select a file.");
            return;
        }
        const formData = new FormData();
        formData.append("file",selectedfile)
        try {
            const response =await axios.post("http://localhost:3000/convertfile",formData,{
                responseType:'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href=url;
            link.setAttribute("download",selectedfile.name.replace(/\.[^/.]+$/,"")+".pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setselectedfile(null);
            setdownloaderror("");
            setconvert("File Converted Successfully");

        } catch (error) {
            console.log(error);
            if(error.response && error.response.status===400){
                setdownloaderror("Error Occurred: ",error.response.data.message);
            }else{
                setconvert("");
            }
        }
    }

    return (
        <>
            <div className='max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 bg-slate-600' >
                <div className='flex h-screen items-center justify-center'>
                    <div className='border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg'>
                        <h1 className='text-3xl font-bold text-center mb-4'>Convert Word To PDF Online</h1>
                        <p className='text-sm text-center mb-5 text-white'>Easily convert Word documents to PDF format online,
                            without having to install any software. </p>
                        <div className='flex flex-col items-center space-y-4'>
                            <input type='file'
                                accept='.doc,.docx'
                                onChange={handlefilechange}
                                className='hidden' id='FileInput' />
                            <label htmlFor='FileInput'
                                className='w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 
                        rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white'>
                                <FaFileWord className='text-3xl mr-3' />
                                <span className='text-3xl mr-2'>{selectedfile ? selectedfile.name : 'Choose File'}</span>
                            </label>
                            <button onClick={handlesubmit}
                            disabled={!selectedfile} className='text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none duration-300 rounded-lg font-bold px-4 py-2' >Convert File</button>
                            {convert && (
                                <div className='text-green-500 text-center'>{convert}</div>
                            )}
                            {downloaderror && (
                                <div className='text-red-500 text-center'>{downloaderror}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
