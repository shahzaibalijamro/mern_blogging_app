import React, { useEffect, useRef, useState } from 'react'
import Greeting from '../../components/Greeting'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';
import { addAllBlogs } from '../../config/redux/reducers/allBlogsSlice';
import './style.css'
import axios from 'axios';
import BlogCard from '../../components/BlogCard';

const Home = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [blogFound, setBlogFound] = useState(true);
  const blogSelector = useSelector(state => state.allBlogs.blogs)
  const userSelector = useSelector(state => state.user.user[0])
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputSearch = useRef();

  function formatMongoDBDate(timestamp) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date(timestamp);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
      (day % 10 === 2 && day !== 12) ? 'nd' :
        (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

    return `${day}${suffix}-${month}-${year}`;
  }


  const getAllBlogs = async () => {
    try {
      const response = await axios("http://localhost:3000/api/v1/allblogs");
      return response.data.allBlogs
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("home page useeffect");
    
    (async () => {
      try {
        if (!blogSelector.length > 0) {
          const response = await getAllBlogs()
          console.log(response);
          setAllBlogs(response)
          dispatch(addAllBlogs({
            response,
          }))
        }
      } catch (error) {
        console.log(error);
      }
    })()
    setAllBlogs(blogSelector)
    // onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     console.log(user);
    //     if (!userSelector) {
    //       await getUserData()
    //     }
    //   } else {
    //     null
    //   }
    // })
  }, [])


  async function getUserData() {
    // await getData("users", auth.currentUser.uid)
    //   .then(arr => {
    //     dispatch(addUser(
    //       {
    //         user: arr
    //       }
    //     ))
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    console.log("getUserData called");
  }


  const goToSinglePage = (index) => {
    localStorage.setItem('singleUser', JSON.stringify(allBlogs[index]));
    navigate('/singleuser')
  }


  const searchBlogs = () => {
    const searchValue = inputSearch.current.value.toLowerCase();
    if (searchValue.length < 1) return setBlogFound(true)
    const filteredArr = allBlogs.filter(item => {
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
    }} >
      <Greeting />
      <div className="my-container">
        <h1 className="text-black font-semibold my-5 text-xl">All blogs</h1>
        <div className="flex gap-x-[2rem] main-wrapper justify-between">
          <div id='left' className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col">
            <div
              id="all-blogs-wrapper"
              className="p-[1.3rem] mb-[20px] flex flex-col rounded-xl bg-white"
            >
              <div className="text-center">
                {allBlogs.length === 0 ? (<span className="loading loading-spinner loading-lg" />
                ) : searchedBlogs.length > 0 ? searchedBlogs.map((item, index) => {
                  return <BlogCard item={item} index={index} goToSinglePage={goToSinglePage} page={"home"}/>
                }) : blogFound ? allBlogs.map((item, index) => {
                  return <BlogCard item={item} index={index} goToSinglePage={goToSinglePage} page={"home"}/>
                }) : <div>
                  <h1 className='text-black font-semibold'>No blog found</h1>
                </div>}
              </div>
            </div>
          </div>
          <div id="sidebar">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
