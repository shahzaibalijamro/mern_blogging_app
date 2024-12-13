import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './screens/Home/Home.jsx' 
import Layout from './Layout.jsx' 
import Login from './screens/Login/Login.jsx' 
import Register from './screens/Register/Register.jsx' 
import Dashboard from './screens/Dashboard/Dashboard.jsx' 
import SingleUser from './screens/SingleUser/SingleUser.jsx' 
import ProtectedRoute from './screens/ProtectedRoute.jsx'
import { Provider } from 'react-redux'
import { store } from './config/redux/store/store.js'
import Profile from './screens/Profile/Profile.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login/>,
      },
      {
        path: 'register',
        element: <Register/>,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute component={<Dashboard/>} />,
      },
      {
        path: 'singleuser',
        element: <SingleUser />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute component={<Profile/>} />,
      },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <RouterProvider router={router}/>
  </Provider>
)
