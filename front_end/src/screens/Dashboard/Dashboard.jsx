import React, { useEffect, useRef, useState } from 'react'
import axios from "../../config/api.config.js"
import './dashboard.css'
import Greeting from '../../components/Greeting'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';
import BlogCard from '../../components/BlogCard.tsx';
import useRemoveUser from '../../utils/app.utils.js';
import { handleMiddlewareErrors } from '../../utils/error.utils.js';
const Dashboard = () => {
  const userSelector = useSelector(state => state.user.user.currentUser);
  const tokenSelector = useSelector(state => state.token.accessToken?.token);
  const [loading, setLoading] = useState(true);
  const [myIndex, setMyIndex] = useState(0);
  const [blogFound, setBlogFound] = useState(true);
  const removeUser = useRemoveUser()
  const [blogTitleToEdit, setBlogTitleToEdit] = useState('')
  const [sortByLatest, setSortByLatest] = useState(true);
  const [blogDescriptionToEdit, setBlogDescriptionToEdit] = useState('')
  const [gotData, setGotData] = useState(false);
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const inputSearch = useRef();
  const blogTitle = useRef();
  const blogDescription = useRef();
  const dispatch = useDispatch();

  const renderBlogs = () => {
    if (loading) {
      return <span className="loading loading-spinner loading-lg" />;
    }
    if (myBlogs.length === 0) {
      return <h1 className="text-black font-semibold">No blog found</h1>;
    }
    const blogsToRender = searchedBlogs.length > 0 ? searchedBlogs : myBlogs;
    return blogsToRender.map((item, index) => (
      <BlogCard
        key={index}
        item={item}
        index={index}
        pfp={userSelector.profilePicture}
        deleteBlog={deleteBlog}
        showModal={showModal}
        page="dashboard"
      />
    ));
  };


  const showSnackbar = (innerHTML, duration = 3000) => {
    var snackbar = document.getElementById("snackbar");
    snackbar.className = "show";
    snackbar.innerHTML = innerHTML;
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, duration);
  }

  const getMyBlogs = async (sort = true) => {
    setLoading(true)
    try {
      const { data } = await axios(`/api/v1/myblogs/${sort}`, {
        headers: {
          'authorization': `Bearer ${tokenSelector}`
        }
      });
      const { blogs } = data;
      setLoading(false)
      setMyBlogs(blogs)
    } catch (error) {
      setGotData(true);
      setLoading(false)
      console.log(error);
      const errorMessage = handleMiddlewareErrors(error);
      showSnackbar(errorMessage, 3000);
      if (errorMessage === "Session expired: Please log in again.") {
        setTimeout(() => {
          removeUser()
        }, 2000);
      }
      if (errorMessage === "User not found in the system.") {
        setTimeout(() => {
          removeUser()
        }, 2000);
      }
    }
  }

  useEffect(() => {
    if (tokenSelector) {
      getMyBlogs();
    }
  }, [tokenSelector])

  const addBlog = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      const { data } = await axios.post("/api/v1/addblog", { title: blogTitle.current.value, description: blogDescription.current.value }, {
        headers: {
          'authorization': `Bearer ${tokenSelector}`
        }
      })
      const { publishedBlogs } = data;
      setMyBlogs(publishedBlogs);
      setSortByLatest(true)
      setLoading(false)

      showSnackbar("Blog posted!", 3000)
      if (data.accessToken) {
        const token = data.accessToken;
        dispatch(setAccessToken({ token, }));
        localStorage.setItem('accessToken', token);
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
      const errorMessage = handleMiddlewareErrors(error);
      showSnackbar(errorMessage, 3000);
      if (errorMessage === "Session expired: Please log in again.") {
        setTimeout(() => {
          removeUser()
        }, 2000);
      }
      if (errorMessage === "User not found in the system.") {
        setTimeout(() => {
          removeUser()
        }, 2000);
      }
    }
    blogTitle.current.value = '';
    blogDescription.current.value = '';
  }


  const searchBlogs = () => {
    const searchValue = inputSearch.current.value.toLowerCase();
    if (searchValue.length < 1) return setBlogFound(true)
    const filteredArr = myBlogs.filter(item => {
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


  const deleteBlog = async (i, id) => {
    try {
      const { data } = await axios.delete(`/api/v1/deleteblog/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenSelector}`
        }
      })
      showSnackbar("Blog deleted!", 3000)
      myBlogs.splice(i, 1)
      setMyBlogs([...myBlogs]);
    } catch (error) {
      console.log(error);
      const errorMessage = handleMiddlewareErrors(error);
      showSnackbar(errorMessage, 3000);
      if (errorMessage === "Session expired: Please log in again.") {
        setTimeout(() => {
          removeUser()
        }, 2000);
      }
      if (errorMessage === "User not found in the system.") {
        setTimeout(() => {
          removeUser()
        }, 2000);
      }
    }
  };


  const editBlog = async (event) => {
    event.preventDefault();
    const updatedBlogs = [...myBlogs];
    updatedBlogs[myIndex].title = blogTitleToEdit;
    updatedBlogs[myIndex].description = blogDescriptionToEdit;
    try {
      const { data } = await axios.put(`/api/v1/editblog/${myBlogs[myIndex]._id}`, {
        title: blogTitleToEdit,
        description: blogDescriptionToEdit,
      }, {
        headers: {
          'Authorization': `Bearer ${tokenSelector}`
        }
      })
      setMyBlogs(updatedBlogs);
      console.log("Document successfully updated!");
    } catch (error) {
      console.log(error);
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 400) {
        if (message === "No access token recieved!") {
          showSnackbar("Authentication failed: No access token received.");
        } else if (message === "The provided token is malformed!") {
          showSnackbar("Authentication failed: Invalid token format.");
        } else if (message === "Invalid ID!") {
          showSnackbar("Error: The blog ID is invalid.");
        } else if (message === "Title and description not provided!") {
          showSnackbar("Error: Both title and description must be provided.");
        } else {
          showSnackbar("Bad Request: " + message);
        }
      } else if (status === 401) {
        if (message === "Refresh token not found, Please login again!") {
          showSnackbar("Session expired: Please log in again.");
          setTimeout(() => {
            removeUser()
          }, 1000)
        } else {
          showSnackbar("Unauthorized: " + message);
        }
      } else if (status === 404) {
        if (message === "User not found!") {
          showSnackbar("Error: User not found in the system.");
          setTimeout(() => {
            removeUser()
          }, 1000)
        } else if (message === "blog not found") {
          showSnackbar("Error: The blog you are trying to update does not exist.");
        } else {
          showSnackbar("Resource not found: " + message);
        }
      } else if (status === 500) {
        showSnackbar(
          "Server Error: Something went wrong while updating the blog. Please try again later."
        );
      } else {
        showSnackbar("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setBlogTitleToEdit('');
      setBlogDescriptionToEdit('');
      document.getElementById("my_modal_2").close();
    }
  };


  const showModal = (index) => {
    setBlogTitleToEdit(myBlogs[index].title);
    setBlogDescriptionToEdit(myBlogs[index].description);
    console.log(myBlogs[index].title);
    setMyIndex(index);
    document.getElementById('my_modal_2').showModal();
  };

  const handleSorting = () => {
    getMyBlogs(!sortByLatest)
    setSortByLatest(!sortByLatest)
  }

  return (
    <div style={{
      minHeight: '100vh'
    }} className='bg-[#f8f9fa]'>
      <div id="snackbar">Blog posted!</div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box bg-white relative">
          <h1
            onClick={() => document.getElementById("my_modal_2").close()}
            className="absolute cursor-pointer top-0 right-3 text-black font-bold text-[1.5rem]"
          >
            ×
          </h1>
          <div className="gap-4 rounded-xl bg-white">
            <form method="dialog" className="modal-backdrop" onSubmit={editBlog}>
              <input
                type="text"
                placeholder="Edit Blog Title"
                value={blogTitleToEdit}
                onChange={(e) => setBlogTitleToEdit(e.target.value)}
                className="input text-[#6c757d] input-bordered w-full"
                required
              />
              <textarea
                value={blogDescriptionToEdit}
                onChange={(e) => setBlogDescriptionToEdit(e.target.value)}
                placeholder="Edit Blog Description"
                className="textarea mt-3 ps-[1rem] text-[#6c757d] pt-[0.5rem] input-bordered text-[1rem] textarea-lg w-full"
                required
              />
              <div className="mt-3">
                <button
                  type="submit"
                  className="btn text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                >
                  Edit Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <Greeting />
      <div className="my-container">
        <div className="flex mt-5 gap-[1.25rem] flex-col">
          <div className="p-[2rem] blogPostWrapper gap-4 rounded-xl bg-white">
            <form onSubmit={addBlog}>
              <input
                type="text"
                placeholder="Blog title goes here!"
                className="input blog-title input-bordered text-[#4f4f4f] w-full"
                required
                ref={blogTitle}
              />
              <textarea
                placeholder="What is in your mind?"
                className="textarea mt-3 ps-[1rem] pt-[0.5rem] input-bordered blog-description text-[#4f4f4f] text-[1rem] textarea-lg w-full"
                required
                ref={blogDescription}
              />
              <div className="mt-3">
                <button
                  type="submit"
                  className="btn text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                >
                  Publish Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="my-container">
        <h1 className="text-black font-semibold my-5 text-xl">My blogs</h1>
        <div className="flex gap-x-[2rem] main-wrapperDash justify-between">
          <div
            id="leftDash"
            className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col"
          >
            <div
              id="my-blog-wrapper"
              className="p-[1rem] mb-[20px] flex flex-col rounded-xl bg-white"
            >
              <div className='flex justify-end items-center'>
                <h1 onClick={handleSorting} className='text-end font-medium border-b border-black text-black cursor-pointer'>{sortByLatest ? "Sort by earliest" : "Sort by latest"}</h1>
              </div>
              <div className="text-center">
                {renderBlogs()}
              </div>
            </div>
          </div>
          <div id="sidebarDash">
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
export default Dashboard
