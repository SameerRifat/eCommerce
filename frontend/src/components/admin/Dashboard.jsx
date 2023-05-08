import { Box, Grid, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { tokens } from '../../theme';
import AdminHeader from './AdminHeader';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { clear_errors, getOrdersSummary } from '../../features/summary/summarySlice';
import Loader from '../Loader';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const alert = useAlert()
  const dispatch = useDispatch()
  const { loading, last24hrsOrder, allOrders, allUsers, numOfProducts, error } = useSelector((state) => state.summary)
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clear_errors());
    }
    dispatch(getOrdersSummary());
  }, [dispatch, alert, error])

  return (
    loading ? <Loader /> :
      <Box m='20px'>
        <AdminHeader title='Dashboard' subtitle='Welcome to your dashboard' />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: '120px',
            gap: '20px'
          }}
        >
          <Box
            gridColumn='span 3'
            backgroundColor={colors.primary[400]}
            padding='0 20px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Products</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>{numOfProducts}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Total Products</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor={colors.blueAccent[500]}
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <LocalMallOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </Box>
          <Box
            gridColumn='span 3'
            backgroundColor={colors.primary[400]}
            padding='0 20px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            position='relative'
          >
            <Typography position='absolute' top={7} right={25} sx={{ color: colors.greenAccent[500], fontSize: '12px' }}>
              total : {allOrders[0].numOfOrders}
            </Typography>
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Orders</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>{last24hrsOrder.length > 0 ? last24hrsOrder[0].numOfOrders : 0}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Last 24 Hours</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor={colors.greenAccent[500]}
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <ListAltOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </Box>
          <Box
            gridColumn='span 3'
            backgroundColor={colors.primary[400]}
            padding='0 20px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Users</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>{allUsers[0].numOfUsers}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Total Users</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor={colors.redAccent[500]}
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <PeopleAltOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </Box>
          <Box
            gridColumn='span 3'
            backgroundColor={colors.primary[400]}
            padding='0 20px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            position='relative'
          >
            <Typography position='absolute' top={7} right={25} sx={{ color: colors.greenAccent[500], fontSize: '12px' }}>
              total : ${allOrders[0].totalSalesAmount}
            </Typography>
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Sales</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>${last24hrsOrder.length > 0 ? last24hrsOrder[0].totalSalesAmount : 0}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Last 24 Hours</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor='orange'
                // backgroundColor={colors.blueAccent[500]}
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <LocalMallOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </Box>
          <Box
            gridColumn='span 8'
            gridRow='span 2'
            backgroundColor={colors.primary[400]}
            padding='0 20px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
          </Box>
          <Box
            gridColumn='span 4'
            gridRow='span 2'
            backgroundColor={colors.primary[400]}
            padding='0 20px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >

          </Box>
        </Box>
      </Box>
  )
}

export default Dashboard