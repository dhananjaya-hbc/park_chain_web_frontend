import React from 'react' 
import { faUsers, faStore, faDollarSign, faCalendarCheck, faCalendar, faFile, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'

const MyChart = dynamic(() => import('./MyChart'), { ssr: false })

export default function Main() {
   
    return(
        <> 
    <h2 className='font-semibold text-2xl pb-5'> Dashboard !</h2>
   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5'>
    <div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Total Users</p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 2,063</h6>
</div>

 <div className='totalusers-icon bg-[#06ca27] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
  <FontAwesomeIcon icon={faUsers} className='text-white text-xl'/>
 </div>
    </div>

  <div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Active Sellers </p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 2,500 </h6>
</div>

 <div className='totalusers-icon bg-[#06ca27] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
  <FontAwesomeIcon icon={faStore} className='text-white text-xl'/>
 </div>
</div>

  <div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Platform Revenue </p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 5,613 XRP </h6>
</div>

 <div className='totalusers-icon bg-[#06ca27] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
  <FontAwesomeIcon icon={faDollarSign} className='text-white text-xl'/>
 </div>
</div>

<div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Total Bookings </p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 9,547</h6>
</div>

 <div className='totalusers-icon bg-[#06ca27] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
  <FontAwesomeIcon icon={faCalendarCheck} className='text-white text-xl'/>
 </div>
</div>

</div>

{/* Revenue Analytics Chart */}
<div className='mb-5'>
    <MyChart />
</div>

{/* Pending Verifications and Recent Feedback Section */}
<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>
    {/* Pending Verifications */}
    <div className='p-5 rounded-xl bg-white shadow-xl'>
        <h3 className='font-semibold text-xl pb-4'>Pending Verifications</h3>
        
        {/* Verification Item 1 */}
        <div className='p-4 rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300'>
            <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3 items-start'>
                    <div className='w-12 h-12 rounded-full bg-[#93e9aa] flex items-center justify-center text-white font-bold'>
                        S3
                    </div>
                    <div>
                        <h4 className='font-medium text-[#212529]'>Seller #001</h4>
                        <p className='text-[#4f586d] text-sm'>John Michel</p>
                    </div>
                </div>
                <span className='px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600'>Pending</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
                <div className='flex gap-4 text-[#4f586d]'>
                    <span className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faCalendar} className='text-xs'/>
                        Submitted: 2024-09-20
                    </span>
                    <span className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faFile} className='text-xs'/>
                        3 Documents
                    </span>
                </div>
                <button className='px-3 py-1 border border-[#06ca27] rounded text-sm hover:bg-[#06ca27] hover:text-white transition-colors duration-300'>Review KYC</button>
            </div>
        </div>

        {/* Verification Item 2 */}
        <div className='p-4 rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300'>
            <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3 items-start'>
                    <div className='w-12 h-12 rounded-full bg-[#93e9aa] flex items-center justify-center text-white font-bold'>
                        S3
                    </div>
                    <div>
                        <h4 className='font-medium text-[#212529]'>Seller #002</h4>
                        <p className='text-[#4f586d] text-sm'>Sara Noyel</p>
                    </div>
                </div>
                <span className='px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600'>Pending</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
                <div className='flex gap-4 text-[#4f586d]'>
                    <span className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faCalendar} className='text-xs'/>
                        Submitted: 2024-09-20
                    </span>
                    <span className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faFile} className='text-xs'/>
                        4 Documents
                    </span>
                </div>
                <button className='px-3 py-1 border border-[#06ca27] rounded text-sm hover:bg-[#06ca27] hover:text-white transition-colors duration-300'>Review KYC</button>
            </div>
        </div>

        <button className='w-full py-2 border border-[#06ca27] rounded text-sm hover:bg-[#06ca27] hover:text-white transition-colors duration-300 mt-4'>View All</button>
    </div>

    {/* Recent Feedback */}
    <div className='p-5 rounded-xl bg-white shadow-xl'>
        <h3 className='font-semibold text-xl pb-4'>Recent Feedback</h3>
        
      
        <div className='p-4.75 rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300'>
            <div className='flex justify-between items-start mb-2.5'>
                <div className='flex gap-3 items-start'>
                    <div className='w-12 h-12 rounded-full bg-[#93e9aa] flex items-center justify-center text-white font-bold'>
                        U1
                    </div>
                    <div>
                        <h4 className='font-medium text-[#212529]'>User #001</h4>
                        <p className='text-[#4f586d] text-sm'>Nova Alex</p>
                    </div>
                </div>
                <div className='flex gap-1'>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                </div>
            </div>
            <div className='flex justify-between items-start'>
                <p className='text-[#4f586d] text-sm'>Great platform! Easy to use and navigate</p>
                <button className='px-3 py-1 border border-[#06ca27] rounded text-xs hover:bg-[#06ca27] hover:text-white transition-colors duration-300 ml-2'>Response</button>
            </div>
        </div>


        <div className='p-4.75 rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300'>
            <div className='flex justify-between items-start mb-2.5'>
                <div className='flex gap-3 items-start'>
                    <div className='w-12 h-12 rounded-full bg-[#93e9aa] flex items-center justify-center text-white font-bold'>
                        U1
                    </div>
                    <div>
                        <h4 className='font-medium text-[#212529]'>User #002</h4>
                        <p className='text-[#4f586d] text-sm'>Shanaya Dias</p>
                    </div>
                </div>
                <div className='flex gap-1'>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-[#06ca27] text-sm'/>
                    <FontAwesomeIcon icon={faStar} className='text-gray-300 text-sm'/>
                </div>
            </div>
            <div className='flex justify-between items-start'>
                <p className='text-[#4f586d] text-sm'>Good location but a bit crowded during peak hours.</p>
                <button className='px-3 py-1 border border-[#06ca27] rounded text-xs hover:bg-[#06ca27] hover:text-white transition-colors duration-300 ml-2'>Response</button>
            </div>
        </div>

        <button className='w-full py-2 border border-[#06ca27] rounded text-sm hover:bg-[#06ca27] hover:text-white transition-colors duration-300 mt-4'>View All</button>
    </div>
</div>

        </>
    )
}
