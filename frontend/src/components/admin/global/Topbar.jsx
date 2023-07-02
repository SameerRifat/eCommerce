import { Box, IconButton, InputBase, useTheme } from '@mui/material'
import React from 'react'
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../../../theme'
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user)
  return (
    <Box display='flex' justifyContent='space-between' p={2}>
      {/* <Box display='flex' backgroundColor={colors.primary[400]} borderRadius='3px'>
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type='button' sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}
      {/* Icons */}
      <NavLink to='/' className='flex items-center gap-1'>
        <span className="sr-only">Your Company</span>
        <img
          className="h-8 w-auto"
          src="/images/logo.png"
          // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt=""
        />
        <h2
          className='hidden md:inline-block font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 uppercase'
        // className='uppercase text-lg font-bold text-gray-500 bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500'
        >
          Ecommerece
        </h2>
      </NavLink>
      <Box display='flex' gap='20px'>
        <IconButton onClick={colorMode.toggleColorMode}>
          {
            theme.palette.mode === 'dark' ? (<DarkModeOutlinedIcon />) : <LightModeOutlinedIcon />
          }
        </IconButton>
        <div className='flex items-center gap-1'>
          <div className='flex justify-center items-center rounded-full'>
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user.avatar.url ? user.avatar.url : "./images/profile.png"}
              alt="avatar Preview"
            />
          </div>
          <span>{user.name}</span>
        </div>
        {/* <IconButton>
          <NotificationsOutlinedIcon/>
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon/>
        </IconButton>
        <IconButton>
          <PersonOutlineOutlinedIcon/>
        </IconButton> */}
      </Box>
    </Box>
  )
}

export default Topbar