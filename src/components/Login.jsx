import React, { useEffect } from 'react'
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { gapi } from 'gapi-script';
import { client } from '../sanity-client';

const Login = () => {
    const clientId = process.env.REACT_APP_GOOGLE_API_TOKEN;

    const navigate = useNavigate();

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: { clientId },
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const googleResponse = (response) => {
        localStorage.setItem('user', JSON.stringify(response.profileObj));
        const { name, googleId, imageUrl } = response.profileObj;
        // creating a doc for logged In user in the sanity backend
        const userDoc = {
            _id: googleId, // internal Id used by sanity to create and index documents
            _type: 'user', // the schema type
            userName: name,
            image: imageUrl
        };

        client.createIfNotExists(userDoc)
            .then(() => {
                navigate('/', { replace: true })
            })
    }

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative h-full w-full'>
                <video
                    src={shareVideo}
                    type='video-mp4'
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />
                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} width="130px" alt='logo' />
                    </div>
                    <div className='shadow-2xl'>
                        <GoogleLogin
                            clientId={clientId}
                            render={(renderProps) => (
                                <button type='button'
                                    className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >
                                    <FcGoogle className='mr-4' />Sign in with Google
                                </button>
                            )}
                            onSuccess={googleResponse}
                            onFailure={googleResponse}
                            cookiePolicy='single_host_origin'
                        />
                        {/* <GoogleLogin
                            className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                            onSuccess={googleResponse}
                            onFailure={googleResponse}
                            size="large"
                            logo_alignment="center"
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login