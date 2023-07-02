import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { useSelector } from 'react-redux'
import Loader from '../Loader'
import useSocket from './socket';
import { tokens } from '../../theme'
import { Box, useTheme } from '@mui/material'


let allUsers = [];
let allMessages = [];
let allSelectedUser = {}
const ENDPOINT = window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:4000'
    : window.location.host;

const SupportScreen = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    const [selectedUser, setSelectedUser] = useState({});
    const socket = useSocket();
    const uiMessageRef = useRef(null);
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const { loading, user: userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        if (uiMessageRef.current) {
            uiMessageRef.current.scrollBy({
                top: uiMessageRef.current.clientHeight,
                left: 0,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    useEffect(() => {
        if (socket) {
            if (users.length === 0) {
                socket.emit('onLogin', {
                    _id: userInfo._id,
                    name: userInfo.name,
                    isAdmin: userInfo.role === 'admin' ? true : false
                });
            }
            socket.on('message', handleReceivedMessage);
            socket.on('updatedUser', handleUpdatedUser);
            socket.on('listUsers', handleUpdatedUsers);
            socket.on('selectedUser', handleSelectedUser);
        }

        return () => {
            if (socket) {
                socket.off('message', handleReceivedMessage);
                socket.off('updatedUser', handleUpdatedUser);
                socket.off('listUsers', handleUpdatedUsers);
                socket.off('selectedUser', handleSelectedUser);
            }
        };
    }, [socket, users, userInfo]);

    const handleReceivedMessage = (data) => {
        if (
            Object.keys(selectedUser).length > 0 &&
            selectedUser._id === data._id
        ) {
            setMessages((prevMessages) => [...prevMessages, data]);
        } else {
            const existUser = users.find((user) => user._id === data._id);
            if (existUser) {
                const updatedUsers = users.map((user) =>
                    user._id === existUser._id ? { ...user, unread: true } : user
                );
                setUsers(updatedUsers);
            }
        }
    };

    const handleUpdatedUser = (updatedUser) => {
        const existUser = users.find((user) => user._id === updatedUser._id);
        if (existUser) {
            const updatedUsers = users.map((user) =>
                user._id === existUser._id ? updatedUser : user
            );
            setUsers(updatedUsers);
        } else {
            setUsers((prevUsers) => [...prevUsers, updatedUser]);
        }
    };

    const handleUpdatedUsers = (updatedUsers) => {
        setUsers(updatedUsers);
    };

    const handleSelectedUser = (user) => {
        setMessages(user.messages);
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        const existUser = users.find((x) => x._id === user._id);
        if (existUser) {
            const updatedUsers = users.map((x) =>
                x._id === existUser._id ? { ...x, unread: false } : x
            );
            setUsers(updatedUsers);
        }
        socket.emit('onUserSelected', user);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
            alert('Error, please type a message.');
        } else {
            const newMessage = {
                body: messageBody,
                name: userInfo.name,
                isAdmin: userInfo.role === 'admin' ? true : false,
                _id: selectedUser._id
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setTimeout(() => {
                socket.emit('onMessage', newMessage);
            }, 1000);
            setMessageBody('');
        }
    };

    return (
        <div className='grid grid-cols-6 h-[80vh] mt-5 p-5'>
            <div className='col-span-2 h-full p-1 border-4 rounded-l-md' style={{ background: colors.grey[100] }}>
                {users.length !== 0 && users.filter((x) => x._id !== userInfo._id).length === 0 && (
                    <p className='font-semibold p-2 rounded-md'
                        style={{
                            backgroundColor: colors.blueAccent[700]

                        }}
                    >
                        No Online User Found
                    </p>
                )}
                {/* <ul className=''> */}
                <Box
                    sx={{
                        '& .listStyle:hover': {
                            backgroundColor: `${colors.grey[300]} !important`
                        },
                    }}
                >
                    {users.length !== 0 && users.filter((x) => x._id !== userInfo._id).map((user) => {
                        return (
                            <li
                                key={user._id}
                                className='listStyle font-semibold rounded-md'
                                style={{
                                    backgroundColor: colors.grey[200],
                                    color: colors.grey[800]
                                }}
                            // onMouseOver={this.style.color = colors.redAccent[500]}
                            >
                                <button
                                    className='block w-full py-2 text-left px-2 bg-transparent'
                                    type='button'
                                    onClick={() => selectUser(user)}
                                >
                                    {user.name}
                                </button>
                                <span
                                    className={user.unread ? 'unread' : user.online ? 'online' : 'offline'}
                                >

                                </span>
                            </li>
                        )
                    })}
                    {/* </ul> */}
                </Box>
            </div>
            <div className='col-span-4 p-1 h-full rounded-r-md' style={{ backgroundColor: colors.grey[50] }}>
                {Object.keys(selectedUser).length === 0 && !selectedUser._id ? (
                    <p style={{ backgroundColor: colors.blueAccent[700] }}
                        className='h-9 flex items-center px-2 rounded-md'
                    >
                        Select a user to start chat
                    </p>
                ) : (
                    <div className='h-full relative'>
                        <div className='h-9'>
                            <strong
                                style={{ backgroundColor: colors.blueAccent[700] }}
                                className='h-9 flex items-center px-2 rounded-md'
                            >
                                Chat with {selectedUser.name}
                            </strong>
                        </div>
                        <div ref={uiMessageRef} className='overflow-y-scroll'>
                            <ul className='h-[calc(80vh-128px)] p-2'>
                                {messages.length === 0 && <li style={{ color: colors.grey[600] }}>No message</li>}
                                {messages.map((msg, ind) => {
                                    return (
                                        <li key={ind} style={{ color: colors.grey[600] }} className='mb-3' >
                                            <strong>{`${msg.name}: `}</strong>
                                            {msg.body}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <form onSubmit={submitHandler} className='flex justify-between absolute left-0 bottom-0 w-full h-10'>
                            <input
                                type="text"
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                                placeholder='type message'
                                className='w-full text-black border border-gray-300'
                            />
                            <button
                                type='submit'
                                className='w-16 bg-gray-300 text-gray-700 border-none outline-none hover:bg-slate-400'
                            >
                                Send
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SupportScreen


// import React, { useEffect, useRef, useState } from 'react'
// import io from 'socket.io-client'
// import { useSelector } from 'react-redux'
// import Loader from '../Loader'

// let allUsers = [];
// let allMessages = [];
// let allSelectedUser = {}
// const ENDPOINT = window.location.host.indexOf('localhost') >= 0
//     ? 'http://127.0.0.1:4000'
//     : window.location.host;

// const SupportScreen = () => {
//     const [selectedUser, setSelectedUser] = useState({})
//     const [socket, setSocket] = useState(null)
//     const uiMessageRef = useRef(null)
//     const [messageBody, setMessageBody] = useState('')
//     const [messages, setMessages] = useState([])
//     const [users, setUsers] = useState([])
//     const { loading, user: userInfo } = useSelector((state) => state.user)
//     useEffect(() => {
//         if (uiMessageRef.current) {
//             uiMessageRef.current.scrollBy({
//                 top: uiMessageRef.current.clientHeight,
//                 left: 0,
//                 behavior: 'smooth'
//             })
//         }
//         if (!socket) {
//             const sk = io.connect("http://localhost:4000");
//             setSocket(sk);
//         }
//         if (socket) {
//             if (users.length === 0) {
//                 socket.emit('onLogin', {
//                     _id: userInfo._id,
//                     name: userInfo.name,
//                     isAdmin: userInfo.role === 'admin' ? true : false
//                 })
//             }
//             socket.on('message', (data) => {
//                 // console.log("message event called on admin side")
//                 console.log('data: ', data)
//                 // console.log('selected user length' , Object.keys(allSelectedUser).length > 0)
//                 if (Object.keys(allSelectedUser).length > 0 && allSelectedUser._id === data._id) {
//                     // console.log('if part')
//                     allMessages = [...allMessages, data];
//                 } else {
//                     // console.log('else part')
//                     // console.log('all users: ', allUsers)
//                     const existUser = allUsers.find((user) => user._id === data._id)
//                     // console.log('exist user? ', existUser)
//                     // console.log('all messages ', allMessages)
//                     if (existUser) {
//                         allUsers = allUsers.map((user) => {
//                             return user._id === existUser._id ? { ...user, unread: true } : user
//                         })
//                         setUsers(allUsers);
//                     }
//                 }
//                 setMessages(allMessages)
//             })
//             socket.on('updatedUser', (updatedUser) => {
//                 // console.log("updated user: ", updatedUser)
//                 const existUser = allUsers.find((user) => user._id === updatedUser._id);
//                 // console.log(existUser)
//                 if (existUser) {
//                     allUsers = allUsers.map((user) => {
//                         return user._id === existUser._id ? updatedUser : user
//                     })
//                     setUsers(allUsers);
//                 } else {
//                     allUsers = [...allUsers, updatedUser];
//                     setUsers(allUsers);
//                 }
//             })
//             socket.on('listUsers', (updatedUsers) => {
//                 // console.log("list users: ", updatedUsers)
//                 allUsers = updatedUsers;
//                 setUsers(allUsers);
//             })
//             socket.on('selectedUser', (user) => {
//                 allMessages = user.messages;
//                 setMessages(allMessages)
//             })
//         }
//     }, [messages ,socket, users])

//     const selectUser = (user) => {
//         allSelectedUser = user;
//         setSelectedUser(user);
//         const existUser = allUsers.find((x) => x._id === user._id);
//         if (existUser) {
//             allUsers = allUsers.map((x) => {
//                 return x._id === existUser._id ? { ...x, unread: false } : x
//             })
//             setUsers(allUsers);
//         }
//         socket.emit('onUserSelected', user)
//     }
//     const submitHandler = (e) => {
//         e.preventDefault();
//         if (!messageBody.trim()) {
//             alert('Error, please type message');
//         } else {
//             allMessages = [
//                 ...allMessages,
//                 { body: messageBody, name: userInfo.name },
//             ];
//             setMessages(allMessages);
//             setTimeout(() => {
//                 socket.emit('onMessage', {
//                     body: messageBody,
//                     name: userInfo.name,
//                     isAdmin: userInfo.role === 'admin' ? true : false,
//                     _id: selectedUser._id
//                 })
//             }, 1000)
//             // setMessageBody('')
//         }
//     }
//     // console.log(users.length === 0)
//     return (
//         <div className='grid grid-cols-6 h-[80vh] mt-5'>
//             <div className='col-span-2 h-full bg-gray-100'>
//                 {users.length !== 0 && users.filter((x) => x._id !== userInfo._id).length === 0 && (
//                     <p className='text-gray-500'>No Online User Found</p>
//                 )}
//                 <ul className=''>
//                     {users.length !== 0 && users.filter((x) => x._id !== userInfo._id).map((user) => {
//                         return (
//                             <li
//                                 key={user._id}
//                                 className='bg-gray-300 hover:bg-gray-400 text-gray-500 hover:text-white font-semibold'
//                             >
//                                 <button
//                                     className='block w-full py-2 text-left px-1 bg-transparent'
//                                     type='button'
//                                     onClick={() => selectUser(user)}
//                                 >
//                                     {user.name}
//                                     {/* Sameer Rifat */}
//                                 </button>
//                                 <span
//                                     className={user.unread ? 'unread' : user.online ? 'online' : 'offline'}
//                                 >

//                                 </span>
//                             </li>
//                         )
//                     })}
//                 </ul>
//             </div>
//             <div className='col-span-4 p-2 pb-0 h-full'>
//                 {Object.keys(selectedUser).length !== 0 && !selectedUser._id ? (
//                     <p>Select a user to start chat</p>
//                 ) : (
//                     <div className='h-full flex flex-col justify-between'>
//                         <div className=''>
//                             <strong>Chat with {selectedUser.name}</strong>
//                         </div>
//                         <ul ref={uiMessageRef} className='border-4 border-red-500 overflow-y-scroll'>
//                             {messages.length === 0 && <li>No message</li>}
//                             {messages.map((msg, ind) => {
//                                 return (
//                                     <li key={ind}>
//                                         <strong>{`${msg.name}: `}</strong>
//                                         {msg.body}
//                                     </li>
//                                 )
//                             })}
//                         </ul>
//                         <form onSubmit={submitHandler} className='flex justify-between'>
//                             <input
//                                 type="text"
//                                 value={messageBody}
//                                 onChange={(e) => setMessageBody(e.target.value)}
//                                 placeholder='type message'
//                                 className='w-full text-black'
//                             />
//                             <button
//                                 type='submit'
//                                 className='w-16 bg-gray-200 text-gray-500 border-none outline-none hover:bg-slate-300'
//                             >
//                                 Send
//                             </button>
//                         </form>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default SupportScreen
