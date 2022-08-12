import React, { useState, useRef,useEffect, useContext} from 'react';
import AuthContext from "../Context/AuthProvider"
import axios from '../API/axios';

const LOGIN_URL = '/auth'

const Login = ()=>{
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [enteredEmail,setEmail]=useState("");
    const [enteredPassword,setPassword]=useState("");
    const [errorMsg,setErrorMsg]=useState("");
    const [success,setSuccess]=useState("false");

    
    // useEffect(()=>{
    //   userRef.current.focus();
    // })

    useEffect(()=>{
     setErrorMsg('');  
    },[enteredEmail,enteredPassword])

   

    const handleSubmit = async(e)=>{
      e.preventDefault();
      // console.log(enteredEmail, enteredPassword);


      try{
         const response = await axios.post(LOGIN_URL,
          JSON.stringify({ enteredEmail, enteredPassword}),
          {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
          }
          );
          console.log(JSON.stringify(response?.data));
          //console.log(JSON.stringify(response));
          const accessToken = response?.data?.accessToken;
          const roles = response?.data?.roles;
          setAuth({enteredEmail,enteredPassword, roles, accessToken})
        setEmail('');
        setPassword('');
        setSuccess(true);
      }catch(err){
          if(!err?.response){
            setErrorMsg("No server Response");
          } else if(err.response?.status === 400){
            setErrorMsg('Missing Username or Password');
          }else if(err.response?.status === 401){
            setErrorMsg('Unauthorized');
          }else{
            setErrorMsg('Login Failed');
          }
          errRef.current.focus();
      }
      
    }

    
    
    
    return(
      <>
        {success ? (
          <section>
            <h1>Login Successful</h1>
            <br></br>
            <p>
              <a href='#'>Go to Home</a>
            </p>
          </section>
        ) : (
        <section>
            <p ref={errRef} className={errorMsg ? "errmsg" :
            "offscreen"} aria-live="assertive">{errorMsg}</p>
            {/* <h1>Sign In</h1> */}
            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>
                    Username:
                </label>
                <input
                     type="text"
                     id="username"
                     ref={userRef}
                     autoComplete="off"
                     onChange={(e)=> setEmail(e.target.value)}
                     value={enteredEmail}
                     required
                     
                     />

                    <label htmlFor='password'>
                      Password:
                    </label>
                    <input
                     type="password"
                     id="password"
                     onChange={(e)=> setPassword(e.target.value)}
                     value={enteredPassword}
                     required
                     
                     />

                     <button>Sign In</button>

                    
            </form>
            <p>
              Need an Account?<br></br>
              <span className='line'>
              
                <a href='https://reqres.in/api/users?page=2'>Sign Up</a>
              </span>
            </p>
        </section>
        )}
        </>
    );
};

export default Login;