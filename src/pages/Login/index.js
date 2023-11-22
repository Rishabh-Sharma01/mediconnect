import React,{useEffect} from 'react';
import { Button, Form, message } from 'antd';
import { json, Link, useNavigate } from 'react-router-dom';
import { CreateUser, LoginUser } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoader(true))
            const response = await LoginUser(values);
            dispatch(ShowLoader(false))
            if (response.success) {
                message.success(response.message);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...response.data,
                        password: "",
                    })
                );
                navigate("/");
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(ShowLoader(false))
            message.error(error.message);
        }
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) navigate("/");
    }, [])
    return (
        <div className="flex flex-column justify-center items-center h-screen">
            <Form layout="vertical" className="w-400 bg-white  p-2 " onFinish={onFinish}>

                <hr />

                <h2 className="uppercase my-2 flex justify-center ">
                    <strong>MediConnect Login</strong>
                </h2>
                <hr />
                <br></br>
                <Form.Item label="Email" name="email">
                    <input type="email" />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <input type="password" />
                </Form.Item>
                <button className="containedbtn my-1 w-full cursor-pointer" type="submit">Login</button>
                <Link className="underline" to='/register'>
                    Don't have an account? <strong>Sign up</strong>
                </Link>
            </Form>
        </div>
    );

}

export default Login;