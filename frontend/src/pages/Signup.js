import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

    const [user, setUsers] = useState([])
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers =  () => {
       axios.get('http://localhost:8000/register')
       .then((res) => {
            console.log(res.data)
       })
    }

    const handleRegister = (event) => {
        event.preventDefault()
        axios.post('http://localhost:8000/register', {
            email: email,
            username: username,
            password: password
        })
        .then(() => {
            alert('User Registered')
            setEmail('')
            setUsername('')
            setPassword('')
            fetchUsers()
            navigate('/login')
        })
        .catch((error) => {
            console.log("Can't Register User")
        })
    }

    return (
        <div className='w-full h-screen flex'>
            <div className='w-[50%] h-[100%] bg-[#1a1a1a] text-white flex justify-center items-center'>
                <form className='text-center bg-teal-700 border rounded-lg w-[500px] h-[400px] p-9'
                onSubmit={handleRegister}>
                    {/* Email Input */}
                    <label>Email</label>
                    <br />
                    <input type='email' className='w-[400px] h-[40px] border rounded-xl bg-zinc-700 p-2' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <br />
                    <label>Username</label>
                    <br />
                    <input type='text' className='w-[400px] h-[40px] border rounded-xl bg-zinc-700 p-2' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <br />
                    <br />
                    <label>Password</label>
                    <br />
                    <input type='password' className='w-[400px] h-[40px] border rounded-xl bg-zinc-700 p-2' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <br />
                    <button type='submit' className='w-[200px] h-[50px] bg-[#1a1a1a] border rounded-lg hover:bg-zinc-700'>Sign Up</button>
                </form>
            </div>
            <div className='w-[50%] h-[100%] flex justify-center items-center bg-teal-700'>
                <h2 className='text-3xl text-white'>Sign Up</h2>
            </div>
        </div>
    )
}

export default Signup