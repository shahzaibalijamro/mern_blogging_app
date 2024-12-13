import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const Greeting = () => {
    const location = useLocation();
    const currentPage = location.pathname;
    const now = new Date;
    const currentHour = now.getHours();
    const greet = currentHour >= 5 && currentHour <= 11 
                    ? 'Good Morning Readers!'
                    : currentHour >= 12 && currentHour <= 15
                    ? 'Good Afternoon Readers!' 
                    : currentHour >= 16 && currentHour <= 20
                    ? 'Good Evening Readers!' 
                    : 'Good Night Readers!'
    return (
        <div className="p-[1.5rem] greet bg-white">
            <div className="my-container">
                {currentPage === '/dashboard' 
                ?
                <h1 className="text-black greetText font-bold text-2xl">Dashboard</h1> 
                : 
                currentPage === '/singleuser' 
                ? 
                <h1 className="greetText font-bold cursor-pointer text-2xl text-[#7749f8]"><Link to={'/'}>&lt; Back to All Blogs</Link></h1> 
                : 
                currentPage === '/profile' 
                ? 
                <h1 className="text-black greetText font-bold text-2xl">My profile</h1> 
                : 
                <h1 className="text-black greetText font-bold text-2xl">{greet}</h1>}
            </div>
        </div>
    )
}

export default Greeting