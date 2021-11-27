import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../contexts/AuthContext";


const Login = () => {
    const { user, isFetching, error, dispatch } = useContext(AuthContext);
    const [formValues, setFormValues] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const location = useLocation();

    let from = location.state?.from?.pathname || "/";

    console.log("rendering login");
    console.log(user);


    const handleChange = e => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userCredentials = { ...formValues };
        const status = await loginCall(userCredentials, dispatch);

        // need to figure out how to reroute properly
        if (status === 200)
            navigate(from, { replace: true });

        /* EXAMPLE - https://reacttraining.com/blog/react-router-v6-pre/
        async function handleSubmit(event) {
            event.preventDefault();
            let result = await submitForm(event.target);
            if (result.error) {
                setError(result.error);
            } else {
                navigate('success');
            }
        }
        */
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required />
                <input
                    type="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    required />
                <button>
                    <div>Forgot you password?</div>
                </button>
                <button type="submit">{isFetching ? "Loading" : "Login"}</button>
                <div>
                    <span>Need an account?</span>
                    <Link to="/register">
                        <button type="button">
                            <div>Register</div>
                        </button>
                    </Link>
                </div>


            </form>
        </div>
    )
}

export default Login;