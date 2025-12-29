import React,{useState} from 'react'
import axios from "axios";
import {  useNavigate } from 'react-router-dom';
const LoginPage = () => {
  let navigate = useNavigate()
const [username,setUsername] = useState<string>('')
const [pwd,setPwd]= useState<string>('')
    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault()
        axios.post('http://localhost:2000/auth/login',{username:username,password:pwd}).then(
          (res)=>{if (res.data.token){
            localStorage.setItem('token',res.data.token)
            alert('Login successful')
            navigate('/diary')
          } else {
            alert('Login failed')
          }}
        ).catch((err) => {console.log(err)}
        )
    }
  return (
    <div><h1>Login Page</h1>
    <form onSubmit={handleSubmit}>
        <input type='text' placeholder='enter username' onChange={e=>setUsername(e.target.value)}></input>
        <input type='password' placeholder='enter password' onChange={e=>setPwd(e.target.value)}></input>
        <button type='submit'>Submit</button>
    </form>
    
    
    </div>
  )
}

export default LoginPage