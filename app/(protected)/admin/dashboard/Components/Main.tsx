import React from 'react' 
import { faUsers, faStore, faDollarSign, faCalendarCheck, faCalendar, faFile, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'

const MyChart = dynamic(() => import('./MyChart'), { ssr: false })

export default function Main() {
   
    return(
        <> 
    
   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5'>
    <div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Total Users</p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 2,063</h6>
</div>

 <div className='totalusers-icon bg-[#197729] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
  <FontAwesomeIcon icon={faUsers} className='text-white text-xl'/>
 </div>
    </div>

  <div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Active Sellers </p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 2,500 </h6>
</div>

 <div className='totalusers-icon bg-[#197729] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
  <FontAwesomeIcon icon={faStore} className='text-white text-xl'/>
 </div>
</div>

  <div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Platform Revenue </p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 5,613 XRP </h6>
</div>

 <div className='totalusers-icon bg-[#197729] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
  <FontAwesomeIcon icon={faDollarSign} className='text-white text-xl'/>
 </div>
</div>

<div className= 'p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
<div >
    <p className='text-[#4f586d] text-md font-normal'>Total Bookings </p>
    <h6 className='text-[#404a60] text-2xl font-medium pb-3'> 9,547</h6>
</div>

 <div className='totalusers-icon bg-[#197729] min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer'>
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
                    <div className='w-12 h-12 rounded-full bg-[#82c092] flex items-center justify-center text-white font-bold'>
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
                <button className='px-3 py-1 border border-[#197729] rounded text-sm hover:bg-[#197729] hover:text-white transition-colors duration-300'>Review KYC</button>
            </div>
        </div>

        {/* Verification Item 2 */}
        <div className='p-4 rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300'>
            <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3 items-start'>
                    <div className='w-12 h-12 rounded-full bg-[#71b98c] flex items-center justify-center text-white font-bold'>
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
                <button className='px-3 py-1 border border-[#197729] rounded text-sm hover:bg-[#197729] hover:text-white transition-colors duration-300'>Review KYC</button>
            </div>
        </div>


 {/* Verification Item 3 */}
        <div className='p-4 rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300'>
            <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3 items-start'>
                    <div className='w-12 h-12 rounded-full bg-[#71b98c] flex items-center justify-center text-white font-bold'>
                        S3
                    </div>
                    <div>
                        <h4 className='font-medium text-[#212529]'>Seller #003</h4>
                        <p className='text-[#4f586d] text-sm'>Nikil Malhothra </p>
                    </div>
                </div>
                <span className='px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600'>Pending</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
                <div className='flex gap-4 text-[#4f586d]'>
                    <span className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faCalendar} className='text-xs'/>
                        Submitted: 2024-09-15
                    </span>
                    <span className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faFile} className='text-xs'/>
                        3 Documents
                    </span>
                </div>
                <button className='px-3 py-1 border border-[#197729] rounded text-sm hover:bg-[#197729] hover:text-white transition-colors duration-300'>Review KYC</button>
            </div>
        </div>


        <button className='w-full py-2 border border-[#197729] rounded text-sm hover:bg-[#197729] hover:text-white transition-colors duration-300 mt-4'>View All</button>
    </div>

    {/* Recent Activity  */}
    <div className='p-5 rounded-xl bg-white shadow-xl'>
        <h3 className='font-semibold text-xl pb-4'>Recent Activity</h3>
        
        {/* Activity Item 1 - New Verification Request */}
        <div className='flex gap-3 mb-3 p-3 rounded-lg bg-gray-50'>
            <div className='w-10 h-10 rounded-full bg-[#71b98c] flex items-center justify-center text-white font-semibold flex-shrink-0'>
                <i className="ri-shield-check-line text-lg"></i>
            </div>
            <div className='flex-1'>
                <h4 className='font-medium text-[#212529]'>New Verification Request</h4>
                <p className='text-[#4f586d] text-sm mb-1'>Kawinda Prasada submitted verification</p>
                <p className='text-[#6c757d] text-xs flex items-center gap-1'>
                    <i className="ri-time-line text-xs"></i>
                    3 mins ago
                </p>
            </div>
        </div>

        {/* Activity Item 2 - Verification Completed */}
        <div className='flex gap-3 mb-3 p-3 rounded-lg bg-gray-50'>
            <div className='w-10 h-10 rounded-full bg-[#71b98c] flex items-center justify-center text-white font-semibold flex-shrink-0'>
                <i className="ri-checkbox-circle-line text-lg"></i>
            </div>
            <div className='flex-1'>
                <h4 className='font-medium text-[#212529]'>Verification Completed</h4>
                <p className='text-[#4f586d] text-sm mb-1'>Multi-Area verified successfully</p>
                <p className='text-[#6c757d] text-xs flex items-center gap-1'>
                    <i className="ri-time-line text-xs"></i>
                    15 mins ago
                </p>
            </div>
        </div>

        {/* Activity Item 3 - New User Registration */}
        <div className='flex gap-3 mb-3 p-3 rounded-lg bg-gray-50'>
            <div className='w-10 h-10 rounded-full bg-[#71b98c] flex items-center justify-center text-white font-semibold flex-shrink-0'>
                <i className="ri-user-add-line text-lg"></i>
            </div>
            <div className='flex-1'>
                <h4 className='font-medium text-[#212529]'>New User Registration</h4>
                <p className='text-[#4f586d] text-sm mb-1'>3 new users joined the platform</p>
                <p className='text-[#6c757d] text-xs flex items-center gap-1'>
                    <i className="ri-time-line text-xs"></i>
                    1 hour ago
                </p>
            </div>
        </div>

        {/* Activity Item 4 - Payment Received */}
        <div className='flex gap-3 mb-3 p-3 rounded-lg bg-gray-50'>
            <div className='w-10 h-10 rounded-full bg-[#71b98c] flex items-center justify-center text-white font-semibold flex-shrink-0'>
                <i className="ri-money-dollar-circle-line text-lg"></i>
            </div>
            <div className='flex-1'>
                <h4 className='font-medium text-[#212529]'>Payment Received</h4>
                <p className='text-[#4f586d] text-sm mb-1'>5,250 XRP received from parking fees</p>
                <p className='text-[#6c757d] text-xs flex items-center gap-1'>
                    <i className="ri-time-line text-xs"></i>
                    2 hours ago
                </p>
            </div>
        </div>

        {/* Activity Item 5 - Verification Rejected */}
        <div className='flex gap-3 p-3 rounded-lg bg-gray-50'>
            <div className='w-10 h-10 rounded-full bg-[#f12121] flex items-center justify-center text-white font-semibold flex-shrink-0'>
                <i className="ri-close-circle-line text-lg"></i>
            </div>
            <div className='flex-1'>
                <h4 className='font-medium text-[#212529]'>Verification Rejected</h4>
                <p className='text-[#4f586d] text-sm mb-1'>Multi-Area verification was rejected</p>
                <p className='text-[#6c757d] text-xs flex items-center gap-1'>
                    <i className="ri-time-line text-xs"></i>
                    3 hours ago
                </p>
            </div>
        </div>
    </div>
</div>

        </>
    )
}
