import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { emptyAccessToken } from "../config/redux/reducers/accessTokenSlice"

const dispatch = useDispatch()
const navigate = useNavigate()

const removeUser = async() => {
    dispatch(emptyAccessToken());
    dispatch(emptyAccessToken())
    navigate('/login')
}

export {removeUser}