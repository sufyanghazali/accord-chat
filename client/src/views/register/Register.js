import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [formValues, setFormValues] = useState({
        email: "",
        username: "",
        password: ""
    });

    const handleChange = e => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const data = { ...formValues };
        const user = await axios.post("http://localhost:8080/register", data);
        console.log(user);
    }

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <h3>Create an account</h3>
                <div>
                    <div>
                        <h5>Email</h5>
                        <div>
                            <input
                                name="email"
                                type="email"
                                onChange={handleChange}
                                aria-label="Email"
                                value={formValues.email} />
                        </div>
                    </div>
                    <div>
                        <h5>Username</h5>
                        <div>
                            <input
                                name="username"
                                type="text"
                                onChange={handleChange}
                                aria-label="Username"
                                value={formValues.username} />
                        </div>
                    </div>
                    <div>
                        <h5>Password</h5>
                        <div>
                            <input
                                name="password"
                                type="password"
                                onChange={handleChange}
                                aria-label="Password"
                                value={formValues.password} />
                        </div>
                    </div>
                    <div>
                        <button type="submit"><div>Continue</div></button>
                    </div>
                    <Link to="/login">
                        <button type="button"><div>Already have an account</div></button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Register;