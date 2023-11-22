import React ,{useEffect}from 'react';
import { Button, Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { CreateUser } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish=async (values)=>{
        try{
            dispatch(ShowLoader(true))
            const response = await CreateUser({
                ...values,
                role:"user",
            });
            dispatch(ShowLoader(false))
            if(response.success){
                message.success(response.message);
                navigate("/login");
            }
            else{
                throw new Error(response.message);
            }
        }catch(error){
            dispatch(ShowLoader(false))
            message.error(error.message)
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
                    <strong>MediConnect Register</strong>
                </h2>
                <hr />
                <br></br>
                <Form.Item label="Name" name="name">
                    <input type="text" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <input type="email" />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <input type="password" />
                </Form.Item>
                <button className="containedbtn my-1 w-full cursor-pointer" type="submit">REGISTER</button>
                <Link className="underline" to='/login'>
                Already have an account? <strong>Sign in here</strong>
                </Link>
            </Form>
        </div>
    );
    
}

export default Register;