import React, { useEffect } from 'react'
import MetaData from '../../MetaData'
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { useAlert } from 'react-alert'
import AdminHeader from '../AdminHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, clear_errors } from '../../../features/order/orderDetailsSlice'
import { updateOrder, update_order_reset, clear_errors as updateOrderClearErrors } from '../../../features/order/updateOrderSlice'
import { NavLink, useParams } from 'react-router-dom';
import Loader from '../../Loader'
import { tokens } from '../../../theme';

const initialValues = {
    status: ''
}
const orderSchema = yup.object().shape({
    status: yup.string().oneOf(["Shipped", "Delivered"], "Invalid Status").required("required")
})

const ProcessOrder = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const dispatch = useDispatch()
    const alert = useAlert()
    const { id } = useParams()
    const { loading, order, error } = useSelector((state) => state.orderDetails)
    const { loading: updateOrderLoading, error: updateError, isUpdated, } = useSelector((state) => state.updateOrder);
    const handleFormSubmit = async (values, actions) => {
        const myForm = new FormData();
        myForm.set("status", values.status)
        const data = {
            id,
            myForm,
        };
        dispatch(updateOrder(data))
        await new Promise((resolve) => setTimeout(resolve, 1000));
        actions.resetForm();
    }
    // useEffect(() => {
    //     dispatch(getOrderDetails(id))
    // }, [id])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clear_errors());
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(updateOrderClearErrors());
        }
        if (isUpdated) {
            alert.success("Status updated Successfully");
            dispatch(update_order_reset());
        }
        dispatch(getOrderDetails(id))
    }, [dispatch, alert, error, updateError, isUpdated, id])
    return (
        <>
            <MetaData title="Process Order - Admin" />
            <Box m='20px'>
                <AdminHeader title="Update Order Status" subtitle="See Order Details and update status" />
                {loading ? <Loader /> :
                    order && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={8}>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='5px'>Shipping Info</Typography>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Name:</Typography>
                                        <Typography>{order.user.name}</Typography>
                                    </Box>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Phone#:</Typography>
                                        <Typography>{order.shippingInfo.phoneNo}</Typography>
                                    </Box>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Address:</Typography>
                                        <Typography>{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</Typography>
                                    </Box>
                                </Box>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='5px'>Payment</Typography>
                                    <Box display='flex' gap='5px'>
                                        <Typography fontWeight='bold'>Payment Status:</Typography>
                                        <Typography fontWeight='bold' color={order.paymentInfo.status === "succeeded" ? colors.greenAccent[500] : colors.redAccent[500]}>
                                            {order.paymentInfo.status === "succeeded"
                                                ? "PAID"
                                                : "NOT PAID"}
                                        </Typography>
                                    </Box>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Amount:</Typography>
                                        <Typography>{order.totalPrice}</Typography>
                                    </Box>
                                </Box>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='5px'>Order Status</Typography>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Payment Status:</Typography>
                                        <Typography fontWeight='bold' color={order.orderStatus === "Delivered" ? colors.greenAccent[500] : colors.redAccent[500]}>
                                            {order.orderStatus}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='10px'>Order Items</Typography>
                                    <Box display='flex' flexDirection='column' gap='15px'>
                                        {order.orderItems.map((item) => {
                                            return (
                                                <Box key={item.product} display='flex' justifyContent='space-between' padding='10px 20px 10px 10px' alignItems='center' boxShadow={`0 0 5px -1px ${colors.grey[100]}`} borderRadius='5px'>
                                                    <Box display='flex' gap='20px' alignItems='center' sx={{ '& a': { color: `${colors.grey[100]} !important` } }}>
                                                        <Box width='110px' height='110px'>
                                                            <img src={item.image} alt="image" />
                                                        </Box>
                                                        <NavLink color='white' to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </NavLink>
                                                    </Box>
                                                    <Typography>
                                                        <span>
                                                            ${item.price} * {item.quantity} ={" "}
                                                        </span>
                                                        <span>${item.price * item.quantity}</span>
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ '& button:disabled': { opacity: '0.9' } }}>
                                <Typography variant='h3' mb='20px'>Process Order</Typography>
                                <Formik
                                    onSubmit={handleFormSubmit}
                                    initialValues={initialValues}
                                    validationSchema={orderSchema}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting,
                                    }) => (
                                        <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                                            <FormControl variant="filled" disabled={order.orderStatus === 'Delivered'} fullWidth={true} error={!!touched.status && !!errors.status} >
                                                <InputLabel id="status">Status</InputLabel>
                                                <Select
                                                    labelId="status"
                                                    id="demo-simple-select-standard"
                                                    name='status'
                                                    value={values.status}
                                                    onChange={handleChange}
                                                    label="Status"
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Order Status</em>
                                                    </MenuItem>
                                                    {order.orderStatus === 'Processing' && <MenuItem value='Shipped'>Shipped</MenuItem>}
                                                    {order.orderStatus === 'Shipped' && <MenuItem value='Delivered'>Delivered</MenuItem>}
                                                </Select>
                                                <FormHelperText>{touched.status && errors.status}</FormHelperText>
                                            </FormControl>
                                            <Button type='submit' color='secondary' variant='contained' disabled={updateOrderLoading || order.orderStatus === 'Delivered'} sx={{ marginTop: '20px', width: '100%' }}>
                                                Updat Status
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Grid>
                        </Grid>
                    )
                }
            </Box>
        </>
    )
}

export default ProcessOrder

// < FormControl disabled variant = "standard" >
    //     <InputLabel htmlFor="component-disabled">Name</InputLabel>
    //     <Input id="component-disabled" defaultValue="Composed TextField" />
    // <FormHelperText>Disabled</FormHelperText>