import React, { useState, Fragment } from 'react'
import { Dialog, Popover, Tab, Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
    Carousel,
    initTE,
} from "tw-elements";
import { NavLink, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputAdornment, InputBase, OutlinedInput, useTheme } from '@mui/material'
import UserOptions from './UserOptions';
import { useSelector } from 'react-redux';

initTE({ Carousel });

const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'Women', href: '#' },
    { name: 'Men', href: '#' },
    // { name: 'Company', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [keyword, setKeyword] = useState('')
    const { isAuthenticated, user } = useSelector((state) => state.user)
    const handleSubmit = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products')
        }
    }
    return (
        <>
            <div className="bg-whit">
                {/* Mobile menu */}
                <Dialog as="div" className="lg:hidden" open={open} onClose={setOpen}>
                    <div className="fixed inset-0 z-50" />
                    <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <NavLink to='/' className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-8 w-auto"
                                    src="/images/logo.png"
                                    // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                    alt=""
                                />
                            </NavLink>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <NavLink
                                            to={item.href}
                                            key={item.name}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <NavLink to='/login' className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                        Log in
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>

                {/* <header className="relative bg-no-repeat bg-cover bg-[url('/images/bg-img7.svg')]"> */}
                <header className="absolute w-full z-20 bg-transparent">
                    <nav aria-label="Top" className="mx-auto w-[90%] px-2">
                        {/* border-b border-gray-200 */}
                        <div className="flex h-16 items-center ">
                            <button
                                type="button"
                                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                                onClick={() => setOpen(true)}
                            >
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Logo */}
                            <div className="ml-4 flex-none lg:ml-0">
                                <NavLink to='/'>
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        className="h-8 w-auto"
                                        src="/images/logo.png"
                                        // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt=""
                                    />
                                </NavLink>
                                {/* <a href="/">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        className="h-8 w-auto"
                                        src="/images/logo.png"
                                        alt=""
                                    />
                                </a> */}
                            </div>

                            {/* Flyout menus */}
                            <div className="hidden lg:flex lg:ml-8 lg:gap-x-12">
                                {navigation.map((item) => (
                                    <NavLink key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                                        {item.name}
                                    </NavLink>
                                    // <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                                    //     {item.name}
                                    // </a>
                                ))}
                            </div>

                            <div className="flex-1 flex items-center">
                                {/* Search */}
                                {/* shadow-[0_0px_15px_-4px_rgba(255,255,255,1)] */}
                                <form onSubmit={handleSubmit} className='flex flex-1 max-w-lg mx-2 md:mx-[60px] rounded-md h-10'>
                                    <InputBase
                                        fullWidth
                                        className='bg-white bg-opacity-70 h-10 pl-4 shadow-[0_0px_15px_-4px_rgba(0,0,0,0.3)] rounded-md'
                                        type='text'
                                        placeholder='Search...'
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <button type='submit' className='bg-gradient-to-tr from-pink-500 to-violet-500 text-white h-10 w-10 md:w-12 flex justify-center items-center rounded-r-md'>
                                                    <SearchIcon />
                                                </button>
                                            </InputAdornment>
                                        }
                                    />
                                    {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" /> */}
                                    {/* <input type="text" value={keyword} placeholder="Search..." onChange={(e) => setKeyword(e.target.value)} className='flex-1 w-20 md:w-full border-none focus:ring-0 text-gray-500 bg-slate-200 bg-opacity-25 pl-2 rounded-l-md' />
                                    <button type='submit' className='md:w-14 bg-gradient-to-tr from-pink-500 to-violet-500 p-2 md:px-4 rounded-r-md'>
                                        <MagnifyingGlassIcon className="h-5 w-5 mx-auto text-white" aria-hidden="true" />
                                    </button> */}
                                </form>

                                {!isAuthenticated &&
                                    <div className="hidden lg:flex lg:items-center lg:justify-end lg:space-x-6">
                                        <NavLink to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                            Sign in
                                        </NavLink>
                                        <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                                        <NavLink to="/register" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                            Create account
                                        </NavLink>
                                    </div>
                                }

                                {/* Cart */}
                                <div className="md:ml-4 flow-root lg:ml-auto">
                                    <NavLink to="/cart" className="group -m-2 flex items-center p-2">
                                        <ShoppingBagIcon
                                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                                        <span className="sr-only">items in cart, view bag</span>
                                    </NavLink>
                                </div>
                                {isAuthenticated &&
                                    <div>
                                        <UserOptions user={user} />
                                    </div>
                                }
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
        </>
    )
}

export default Navbar


// import React, { useState } from 'react'
// import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
// import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import {
//     Carousel,
//     initTE,
// } from "tw-elements";
// import { NavLink } from 'react-router-dom';
// import SearchIcon from '@mui/icons-material/Search';
// import { Box, IconButton, InputBase, useTheme } from '@mui/material'

// initTE({ Carousel });

// const navigation = [
//     { name: 'Products', href: '/products' },
//     { name: 'Women', href: '#' },
//     { name: 'Men', href: '#' },
//     // { name: 'Company', href: '#' },
// ]

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
// }

// const Navbar = () => {
//     const [open, setOpen] = useState(false)
//     const [keyword, setKeyword] = useState('')
//     const handleSubmit = (e) => {
//         e.preventDefault()
//         console.log(keyword)
//     }
//     return (
//         <>
//             <div className="bg-white">
//                 {/* Mobile menu */}
//                 <Dialog as="div" className="lg:hidden" open={open} onClose={setOpen}>
//                     <div className="fixed inset-0 z-50" />
//                     <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
//                         <div className="flex items-center justify-between">
//                             <a href="/" className="-m-1.5 p-1.5">
//                                 <span className="sr-only">Your Company</span>
//                                 <img
//                                     className="h-8 w-auto"
//                                     src="/images/logo.png"
//                                     // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//                                     alt=""
//                                 />
//                             </a>
//                             <button
//                                 type="button"
//                                 className="-m-2.5 rounded-md p-2.5 text-gray-700"
//                                 onClick={() => setOpen(false)}
//                             >
//                                 <span className="sr-only">Close menu</span>
//                                 <XMarkIcon className="h-6 w-6" aria-hidden="true" />
//                             </button>
//                         </div>
//                         <div className="mt-6 flow-root">
//                             <div className="-my-6 divide-y divide-gray-500/10">
//                                 <div className="space-y-2 py-6">
//                                     {navigation.map((item) => (
//                                         <a
//                                             key={item.name}
//                                             href={item.href}
//                                             className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
//                                         >
//                                             {item.name}
//                                         </a>
//                                     ))}
//                                 </div>
//                                 <div className="py-6">
//                                     <a
//                                         href="#"
//                                         className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
//                                     >
//                                         Log in
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </Dialog.Panel>
//                 </Dialog>

//                 <header className="relative bg-no-repeat bg-cover bg-[url('/images/bg-img7.svg')]">
//                     <nav aria-label="Top" className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8">
//                         {/* border-b border-gray-200 */}
//                         <div className="flex h-16 items-center ">
//                             <button
//                                 type="button"
//                                 className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
//                                 onClick={() => setOpen(true)}
//                             >
//                                 <span className="sr-only">Open menu</span>
//                                 <Bars3Icon className="h-6 w-6" aria-hidden="true" />
//                             </button>

//                             {/* Logo */}
//                             <div className="ml-4 flex lg:ml-0">
//                                 <a href="/">
//                                     <span className="sr-only">Your Company</span>
//                                     <img
//                                         className="h-8 w-auto"
//                                         src="/images/logo.png"
//                                         alt=""
//                                     />
//                                 </a>
//                             </div>

//                             {/* Flyout menus */}
//                             <div className="hidden lg:flex lg:ml-8 lg:gap-x-12">
//                                 {navigation.map((item) => (
//                                     <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
//                                         {item.name}
//                                     </a>
//                                 ))}
//                             </div>

//                             <div className="ml-auto flex-1 flex items-center">
//                                 {/* Search */}
//                                 <div className='mx-2 md:mr-6 md:w-[300px]'>
//                                     <form onSubmit={handleSubmit} className='md:w-full flex border border-gray-200 rounded-md h-10'>
//                                         {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" /> */}
//                                         <input type="text" value={keyword} placeholder="Search" onChange={(e) => setKeyword(e.target.value)} className='flex-shrink md:w-full border-none outline-none text-gray-500 bg-gray-50 pl-2 rounded-l-md' />
//                                         <button type='submit' className='bg-gradient-to-tr from-pink-500 to-violet-500 p-2 md:px-4 rounded-r-md'>
//                                             <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
//                                         </button>
//                                     </form>
//                                 </div>

//                                 <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
//                                     <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
//                                         Sign in
//                                     </a>
//                                     <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
//                                     <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
//                                         Create account
//                                     </a>
//                                 </div>

//                                 {/* Cart */}
//                                 <div className="md:ml-4 flow-root lg:ml-6">
//                                     <a href="#" className="group -m-2 flex items-center p-2">
//                                         <ShoppingBagIcon
//                                             className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
//                                             aria-hidden="true"
//                                         />
//                                         <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
//                                         <span className="sr-only">items in cart, view bag</span>
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </nav>
//                 </header>
//             </div>
//         </>
//     )
// }

// export default Navbar