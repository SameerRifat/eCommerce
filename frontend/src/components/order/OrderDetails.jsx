import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { clear_errors, getOrderDetails } from "../../features/order/orderDetailsSlice";
import Loader from "../Loader";
import MetaData from "../MetaData";

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, order } = useSelector((state) => state.orderDetails);
    // const address = `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`
    useEffect(()=>{
        dispatch(getOrderDetails(id));
    }, [id])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clear_errors());
        }
        // dispatch(getOrderDetails(id));
    }, [dispatch, error, alert]);

    return (
        <>
            <MetaData title="Order Details" />
            {loading ? (
                <Loader />
            ) : (
                <div className="pt-28">
                    <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-10 pb-12">
                        {order && Object.keys(order).length > 0 ? (
                            <>
                                <div className="col-span-full lg:col-span-1">
                                    <h2 className="text-lg font-semibold mb-2">Order #{order && order._id}</h2>
                                    <div className="">
                                        <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Shipping Info</h3>
                                        <div className='pl-3 pt-3 flex flex-col gap-1.5'>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Name:</p>
                                                <span className='text-base'>{order.user.name}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Phone:</p>
                                                <span className='text-base'>{order.shippingInfo.phoneNo}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Address:</p>
                                                <span className='text-base'>{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Payment</h3>
                                        <div className='pl-3 pt-3 flex flex-col gap-1.5'>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Payment Status:</p>
                                                <span className={`${order.paymentInfo.status === "succeeded" ? 'text-green-500' : 'text-red-500'}`}>
                                                    {order.paymentInfo.status === "succeeded"
                                                        ? "PAID"
                                                        : "NOT PAID"}
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Amount:</p>
                                                <span className='text-base'>{order.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Order Status</h3>
                                        <span className={`${order.orderStatus === "Delivered" ? 'text-green-500' : 'text-red-500'} pl-3 pt-3 block`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-full lg:col-span-1 bg-gray-50 rounded-md shadow-sm p-10 h-fit">
                                    <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Order Items</h3>
                                    <div className='mt-3 flex flex-col pt-4'>
                                        {order.orderItems.map((item) => {
                                            return <div className="flex justify-between items-center border-t border-gray-200 py-6 last:border-b  last:border-gray-200 bg-white px-4 rounded-lg" key={item.product}>
                                                <div className='flex gap-3 items-center'>
                                                    <div className="aspect-w-1 min-w-[96px] md:min-w-[112px] overflow-hidden rounded-sm h-28 md:h-32 cursor-pointer">
                                                        <img
                                                            src={item.color || item.image}
                                                            alt='product colors preview'
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div>
                                                        <NavLink to={`/product/${item.product}`} className='text-lg font-semibold'>{item.name}</NavLink>
                                                        {item.size && <p>Size: {item.size}</p>}
                                                    </div>
                                                </div>
                                                <p>
                                                    ${item.price} * {item.quantity} = ${item.price * item.quantity}
                                                </p>
                                            </div>
                                        })}
                                    </div>
                                    <div className="text-end mt-5">
                                        <h3 className='font-semibold'>Total Price: {order.totalPrice}</h3>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>No order exist with this id</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};


export default OrderDetails;
