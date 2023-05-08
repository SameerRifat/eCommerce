import React, { useEffect } from "react";
import styled from "styled-components";
import Loader from "../Loader";
import MetaData from "../MetaData";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clear_errors, myOrders } from "../../features/order/ordersSlice";
import LaunchIcon from "@mui/icons-material/Launch";
import { NavLink, useParams } from "react-router-dom";
import { getOrderDetails } from "../../features/order/orderDetailsSlice";
import { Box } from "@mui/material";

const MyOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  // const params = useParams()
  const { loading, orders, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "text-green" : "text-blue";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <NavLink to={`/order/${id}`} className='text-violet-500 hover:text-pink-500'>
            <LaunchIcon style={{fontSize: '20px'}} />
          </NavLink>
        );
      },
    },
  ];
  const rows = [];
  orders &&
    orders.forEach((item, index) => {
      rows.push({
        id: item._id,
        status: item.orderStatus,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clear_errors());
    }
    dispatch(myOrders());
    dispatch(getOrderDetails('64199eaa7744fcee5225de20'))
  }, [dispatch, error, alert]);
  return (
    <>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="pt-24 ">
          <Box
            width='90%'
            mx='auto'
            sx={{
              '.text-green':{
                color: 'green' 
              },
              '.text-blue':{
                color: 'blue' 
              },
              '>div':{
                fontSize: '16px' 
              },
              // '& .MuiDataGrid-root': {
              //   border: 'none'
              // },
              // '& .MuiDataGrid-cell': {
              //   borderBottom: 'none'
              // },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: 'none',
                backgroundColor: 'rgb(209 213 219)'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: '16px',
                fontWeight: '600',
                color: 'grey'
              },
              // Middle section background color
              // '& .MuiDataGrid-virtualScroller': {
              //   backgroundColor: colors.primary[400]
              // },
              // '& .MuiDataGrid-footerContainer ': {
              //   borderTop: 'none',
              //   backgroundColor: colors.blueAccent[700]
              // },
              // '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
              //   color: `${colors.grey[100]} !important`
              // },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              autoHeight
              className="text-2xl"
            />
            <div className="bg-gray-300 text-center text-base py-1.5 font-semibold">{`${user.name}'s Orders`}</div>
          </Box>
        </div>
      )}
    </>
  );
};

const Wrapper = styled.section`
  .my-orders-table {
    background-color: white;
    div {
      font-size: 16px;
    }
    a {
      color: rgba(0, 0, 0, 0.7);
      transition: all 0.3s;
      svg {
        font-size: 20px;
      }
    }
    a:hover {
      color: tomato;
    }
  }
  .MuiDataGrid-columnHeaders {
    background-color: tomato;
    color: white;
    button {
      font-size: 16px;
    }
    .MuiDataGrid-iconSeparator {
      display: none !important;
    }
  }

  .my-orders-heading {
    background-color: #131313b9;
    color: white;
    text-align: center;
    font-size: 16px;
    padding: 5px 0;
  }
`;

export default MyOrders;

