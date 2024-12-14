import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { emptyAccessToken } from "../config/redux/reducers/accessTokenSlice"
import { emptyUser } from "../config/redux/reducers/userSlice"

const useRemoveUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return () => {
        dispatch(emptyAccessToken());
        dispatch(emptyUser())
        navigate('/login')
    };
};

export default useRemoveUser;