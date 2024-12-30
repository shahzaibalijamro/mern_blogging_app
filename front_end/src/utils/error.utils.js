const handleMiddlewareErrors = (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    let errorMsg = "";

    if (status === 400) {
        if (message === "No access token recieved!") {
            errorMsg = "Authentication failed: No access token received.";
        } else if (message === "The provided token is malformed!") {
            errorMsg = "Authentication failed: Invalid token format.";
        } else {
            errorMsg = "Bad Request: " + message;
        }
    } else if (status === 401) {
        if (message === "Refresh token not found, Please login again!") {
            errorMsg = "Session expired: Please log in again.";
        } else {
            errorMsg = "Unauthorized: " + message;
        }
    } else if (status === 404) {
        if (message === "User not found!") {
            errorMsg = "User not found in the system.";
        } else {
            errorMsg = "Resource not found: " + message;
        }
    } else if (status === 500) {
        errorMsg = "Server Error: Something went wrong during authentication. Please try again later.";
    } else {
        errorMsg = "An unexpected error occurred during authentication. Please try again later.";
    }
    return errorMsg;
}

export { handleMiddlewareErrors };