import React, { useEffect, useRef, useState } from 'react'
import './singleUser.css'
import Greeting from '../../components/Greeting'
import axios from 'axios';
import BlogCard from '../../components/BlogCard';
const SingleUser = () => {
  const inputSearch = useRef();
  const singleUser = JSON.parse(localStorage.getItem('singleUser'));
  const [singleUserBlogs, setSingleUserBlogs] = useState([]);
  const [blogFound, setBlogFound] = useState(true);
  const [searchedBlogs, setSearchedBlogs] = useState([]);

  const getAllBlogs = async () => {
    try {
      const response = await axios(`http://localhost:3000/api/v1/singleuserblogs/${singleUser.author._id}`);
      return response.data.blogs
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllBlogs()
        setSingleUserBlogs(response)
      } catch (error) {
        console.log(error);
      }
    })()
  }, [])
  const searchBlogs = () => {
    const searchValue = inputSearch.current.value.toLowerCase();
    if (searchValue.length < 1) return setBlogFound(true)
    const filteredArr = singleUserBlogs.filter(item => {
      return item.title.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue);
    });
    if (filteredArr.length > 0) {
      setSearchedBlogs(filteredArr)
      setBlogFound(false)
      return
    };
    setSearchedBlogs([])
    setBlogFound(false)
  }
  return (
    <div style={{
      minHeight: '100vh'
    }}>
      <Greeting />
      <div className="my-container">
        <h1 className="text-black font-semibold my-5 text-xl">All blogs</h1>
        <div className="flex main-wrapperSingle gap-x-[2rem] justify-between">
          <div className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col">
            <div
              id="my-blog-wrapper"
              className="p-[1.3rem] mb-[20px] flex flex-col rounded-xl bg-white"
            >
              <div className="text-center">
                {singleUserBlogs.length === 0 ? (<span className="loading loading-spinner loading-lg" />
                ) : searchedBlogs.length > 0 ? searchedBlogs.map((item, index) => {
                  return <BlogCard item={item} index={index} />
                }) : blogFound ? singleUserBlogs.map((item, index) => {
                  return <BlogCard item={item} index={index} />
                }) : <div>
                  <h1 className='text-black font-semibold'>No blog found</h1>
                </div>}
              </div>
            </div>
          </div>
          <div id="sidebarSingle">
            <div className="flex mb-5 justify-center">
              <div className="group">
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input onInput={searchBlogs} placeholder="Search" type="search" className="input-search" ref={inputSearch} />
              </div>
            </div>
            {singleUser ? <div className='sidebarIn'>
              <h1 className="font-semibold text-end order1 text-black text-xl">
                {singleUser.author.email}
              </h1>
              <h1 className="font-bold text-3xl order0 text-end text-[#7749f8]">
                {singleUser.author.fullName}
              </h1>
              <div className="flex mt-4 order-1 justify-end">
                <img className="rounded-xl" width="200px" src={singleUser.author.profilePicture} alt="" />
              </div>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleUser