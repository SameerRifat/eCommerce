import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import React, { useEffect } from 'react'
import { ColorModeContext, tokens, useMode } from '../../theme'
import Sidebar from './global/Sidebar'
import Topbar from './global/Topbar'
import { ProSidebarProvider } from 'react-pro-sidebar'
import './adminStyles.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import ProtectedRoute from '../../route/ProtectedRoute'
import ProductsList from './product/ProductsList'
import { useDispatch } from 'react-redux'
import { getOrdersSummary } from '../../features/summary/summarySlice'

const DashboardApp = () => {
    const [theme, colorMode] = useMode()
    const colors = tokens(theme.palette.mode)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getOrdersSummary())
    }, [dispatch])
    return (
        <ProSidebarProvider>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box
                        display='flex'
                        fontFamily='Source Sans Pro, sans-serif'
                        sx={{
                            '& .ps-menu-button': {
                                color: `${colors.grey[100]} !important`
                            },
                            '& .ps-menu-button:hover': {
                                backgroundColor: `${colors.primary[600]} !important`
                            },
                            '& .ps-menu-button:hover span': {
                                color: '#868dfb !important'
                            },
                            '& .ps-menu-button.ps-active': {
                                color: '#8670fa !important'
                            },
                            '& .css-z5rm24': {
                                backgroundColor: `${colors.primary[400]} !important`
                            },
                            // '& .ps-submenu-content .ps-menu-button': {
                            //     color: `black !important`
                            // },
                        }}
                    >
                        <Sidebar />
                        <main className='content'>
                            <Topbar />
                            <Outlet />
                        </main>
                    </Box>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </ProSidebarProvider>
    )
}

export default DashboardApp

// import { CssBaseline, ThemeProvider } from '@mui/material'
// import React from 'react'
// import { ColorModeContext, useMode } from '../../theme'
// import Sidebar from './global/Sidebar'
// import Topbar from './global/Topbar'
// import { ProSidebarProvider } from 'react-pro-sidebar'
// import './adminStyles.css'
// import { Route, Routes } from 'react-router-dom'
// import Dashboard from './Dashboard'
// import ProtectedRoute from '../../route/ProtectedRoute'
// import ProductsList from './product/ProductsList'

// const DashboardApp = ({ childRoutes }) => {
//     const [theme, colorMode] = useMode()
//     return (
//         <ProSidebarProvider>
//             <ColorModeContext.Provider value={colorMode}>
//                 <ThemeProvider theme={theme}>
//                     <CssBaseline />
//                     <div className='app'>
//                         <Sidebar />
//                         <main className='content'>
//                             <Topbar />
//                             {childRoutes}
//                         </main>
//                     </div>
//                 </ThemeProvider>
//             </ColorModeContext.Provider>
//         </ProSidebarProvider>
//     )
// }

// export default DashboardApp