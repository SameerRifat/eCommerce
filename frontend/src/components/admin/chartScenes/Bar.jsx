import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import AdminHeader from '../AdminHeader'
import BarChart from '../charts/BarChart'

const Bar = () => {
    // const data = []
    // salesLast7Days && salesLast7Days.forEach((item, index) => {
    //     data.push({
    //         day: item._id,
    //         sales: item.totalSalesAmount,
    //         // orders: item.numOfOrders,
    //         // value: item.numOfProducts,
    //     })
    // });
    // console.log(data)
    return (
        <Box m='20px'>
            <AdminHeader title='Bar chart' subtitle='Sales of Last 15 days' />
            <div className='overflow-x-auto'>
                <div className='h-[65vh] min-w-[800px]'>
                <BarChart />
            </div>
            </div>
        </Box>
    )
}

export default Bar