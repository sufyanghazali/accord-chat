import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });

    try {
        const res = await axios.post("http://localhost:8080/login", userCredentials);

        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        return res.status;
    } catch (err) {
        // on fail
        dispatch({ type: "LOGIN_FAILED", payload: err });
    }
}