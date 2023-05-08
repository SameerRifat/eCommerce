import React, { useEffect } from 'react'
import { tokens } from '../../../theme'
import { Box, IconButton, useTheme } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AdminHeader from '../AdminHeader'
import { NavLink } from 'react-router-dom';
import { useAlert } from 'react-alert'
import { clearErrors, getAdminProducts } from '../../../features/product/productSlice';
import { deleteProduct, clearErrors as deletePorductClearErrors, deleteProductReset } from '../../../features/product/deleteProductSlice';
import MetaData from '../../MetaData'

const ProductsList = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);
  const alert = useAlert()
  const dispatch = useDispatch()
  const { error, products } = useSelector((state) => state.product)
  const { error: deleteError, isDeleted } = useSelector((state) => state.deleteProduct)
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id))
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(error);
      dispatch(deletePorductClearErrors());
    }
    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      dispatch(deleteProductReset())
      // dispatch(getAdminProducts())
    }
    dispatch(getAdminProducts());
  }, [dispatch, alert, error, deleteError, isDeleted])

  const columns = [
    {
      field: 'id',
      headerName: 'Product ID',
      minWidth: 250,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 250,
      flex: 1
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 0.7
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 0.7
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.7,
      headerAlign: 'right',
      align: 'right',
      minWidth: 100,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <>
            <NavLink to={`/admin/product/${id}`}>
              <IconButton><EditOutlinedIcon style={{ color: colors.blueAccent[500] }} /></IconButton>
            </NavLink>
            <IconButton onClick={() => deleteProductHandler(id)}>
              <DeleteOutlineOutlinedIcon style={{ color: colors.redAccent[500] }} />
            </IconButton>
          </>
        );
      },
    },
  ]

  const rows = []
  products && products.forEach((item, index) => {
    rows.push({
      id: item._id,
      name: item.name,
      stock: item.stock,
      price: item.price,
    })
  });

  return (
    <>
      <MetaData title="All Products - Admin" />
      <Box m='20px'>
        <AdminHeader title="Products" subtitle="List of all Products" />
        <Box
          mt='10px'
          height='65vh'
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none'
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: 'none',
              backgroundColor: colors.blueAccent[700]
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '15px'
            },
            // Middle section background color
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: colors.primary[400]
            },
            '& .MuiDataGrid-footerContainer ': {
              borderTop: 'none',
              backgroundColor: colors.blueAccent[700]
            },
            '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
              color: `${colors.grey[100]} !important`
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            slots={{
              toolbar: GridToolbar
            }}
          />
        </Box>
      </Box>
    </>
  )
}

export default ProductsList