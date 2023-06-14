import React from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
    Carousel,
    initTE,
} from "tw-elements";
import { NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase, useTheme } from '@mui/material'

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

const HeroSection = () => {
    return (
        <>
            <div className="h-[50vh] md:h-[80vh] lg:h-[90vh] bg-no-repeat bg-cover bg-[url('/images/bg-img7.svg')]">
                {/* bg-[url('/images/bg-img.svg')] bg-cover bg-no-repeat */}
                <div className='h-full mx-auto w-[90%] md:grid md:grid-cols-custom flex justify-center pt-16'>
                    <div className='text-center flex flex-col justify-center px-4'>
                        {/* <p className='text-sm md:text-base font-normal md:font-semibold bg-clip-text text-transparent bg-gradient-to-tr from-pink-600 to-violet-600'>Welcome to Ecommerce</p> */}
                        <h1 className='text-2xl uppercase md:text-4xl lg:text-5xl font-extrabold flex flex-col'>
                            <span className='italic bg-clip-text text-transparent bg-gradient-to-tr from-pink-500 to-violet-500'>unlock your </span>
                            <span className='italic text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-tr from-pink-500 to-violet-500'>style</span> 
                            {/* from-[rgb(255,171,45)] to-[rgb(255,79,25)] */} 
                        </h1>
                        {/* <h1 className='text-2xl md:text-4xl lg:text-5xl font-extrabold mt-2 bg-clip-text text-transparent bg-gradient-to-tr from-pink-500 to-violet-500'><span className='italic'>Summer</span> <span className='uppercase bg-clip-text text-transparent bg-gradient-to-tr from-[rgb(255,153,0)] to-[rgb(255,79,25)]'>Fashion</span> <span>Sale</span></h1> */}
                        <NavLink to="/products"
                            className="rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 self-center px-6 py-2 md:px-7 md:py-3 mt-7 text-base md:text-xl uppercase font-medium sm:font-bold md:font-extrabold text-white shadow-sm hover:from-pink-500 hover:to-yellow-500"

                        >
                            Shop now
                        </NavLink>
                    </div>
                    <div className="hidden md:inline-block aspect-w-1 w-full overflow-hidden h-full">
                        <img className="h-full w-full object-cover object-center lg:object-contain lg:h-full lg:w-full" src="/images/banner3.png" alt="Modern building architecture" />
                    </div>
                    {/* <div className="hidden md:inline-block">
                        <img className="h-[400px] w-full object-contain lg:object-cover md:h-full above-md:h-full md:w-[300px] mx-auto" src="/images/banner3.png" alt="Modern building architecture" />
                    </div> */}
                </div>
            </div>
            {/* <div className="h-[80vh] border-4 border-red-500 bg-no-repeat bg-auto md:bg-cover bg-center bg-[url('/images/banner3.png')]"
            >

            </div> */}
        </>
    )
}

export default HeroSection






// import React from 'react'
// import { useState } from 'react'
// import { Dialog } from '@headlessui/react'
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

// const navigation = [
//     { name: 'Product', href: '#' },
//     { name: 'Features', href: '#' },
//     { name: 'Marketplace', href: '#' },
//     { name: 'Company', href: '#' },
// ]

// const HeroSection = () => {
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//     return (
//         <div className="bg-white">
//             <header className="absolute inset-x-0 top-0 z-50 bg-neutral-100">
//                 <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
//                     <div className="flex lg:flex-1">
//                         <a href="#" className="-m-1.5 p-1.5">
//                             <span className="sr-only">Your Company</span>
//                             <img
//                                 className="h-8 w-auto"
//                                 src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//                                 alt=""
//                             />
//                         </a>
//                     </div>
//                     <div className="flex lg:hidden">
//                         <button
//                             type="button"
//                             className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
//                             onClick={() => setMobileMenuOpen(true)}
//                         >
//                             <span className="sr-only">Open main menu</span>
//                             <Bars3Icon className="h-6 w-6" aria-hidden="true" />
//                         </button>
//                     </div>
//                     <div className="hidden lg:flex lg:gap-x-12">
//                         {navigation.map((item) => (
//                             <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
//                                 {item.name}
//                             </a>
//                         ))}
//                     </div>
//                     <div className="hidden lg:flex lg:flex-1 lg:justify-end">
//                         <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
//                             Log in <span aria-hidden="true">&rarr;</span>
//                         </a>
//                     </div>
//                 </nav>
//                 <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
//                     <div className="fixed inset-0 z-50" />
//                     <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
//                         <div className="flex items-center justify-between">
//                             <a href="#" className="-m-1.5 p-1.5">
//                                 <span className="sr-only">Your Company</span>
//                                 <img
//                                     className="h-8 w-auto"
//                                     src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//                                     alt=""
//                                 />
//                             </a>
//                             <button
//                                 type="button"
//                                 className="-m-2.5 rounded-md p-2.5 text-gray-700"
//                                 onClick={() => setMobileMenuOpen(false)}
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
//             </header>
//         </div>
//     )
// }

// export default HeroSection
