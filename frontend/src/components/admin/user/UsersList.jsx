import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme'
import { Box, IconButton, useTheme, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AdminHeader from '../AdminHeader'
import { NavLink } from 'react-router-dom';
import { useAlert } from 'react-alert'
import { clear_errors, getAllUsers } from '../../../features/user/usersSlice';
import { deleteUser, clearErrors, deleteUserReset } from '../../../features/user/deleteUserSlice';
import MetaData from '../../MetaData'

const UsersList = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading, error, users } = useSelector((state) => state.users)
    const { error: deleteError, isDeleted } = useSelector((state) => state.deleteUser)

    const [open, setOpen] = useState(false);
    const [UserIdToDelete, setUserIdToDelete] = useState('');
    const handleClickOpen = (id) => {
        setUserIdToDelete(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id))
    }

    useEffect(() => {
        dispatch(getAllUsers())
    }, [])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clear_errors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            setUserIdToDelete('')
            setOpen(false)
            alert.success("User Deleted Successfully");
            dispatch(deleteUserReset());
        }
        if (isDeleted || users.length === 0) {
            dispatch(getAllUsers());
        }
    }, [dispatch, alert, error, deleteError, isDeleted, users.length]);

    const columns = [
        {
            field: 'id',
            headerName: 'User ID',
            minWidth: 250,
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            flex: 0.8
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 250,
            flex: 0.8
        },
        {
            field: 'role',
            headerName: 'Role',
            minWidth: 100,
            flex: 0.5,
            cellClassName: (params) => {
                return params.row.role === "admin" ? "text-green" : "text-red";
            },
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
                        <NavLink to={`/admin/user/${id}`}>
                            <IconButton><EditOutlinedIcon style={{ color: colors.blueAccent[500] }} /></IconButton>
                        </NavLink>
                        <IconButton onClick={() => handleClickOpen(id)}>
                            <DeleteOutlineOutlinedIcon style={{ color: colors.redAccent[500] }} />
                        </IconButton>
                    </>
                );
            },
        },
    ]

    const rows = []
    users && users.forEach((item, index) => {
        if(item.email !== "sameer123@gmail.com"){
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
            })
        }
    });

    return (
        <>
            <MetaData title="All Users - Admin" />
            <Box m='20px'>
                <AdminHeader title="Users" subtitle="List of all users" />
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
                    <Dialog open={open} onClose={handleClose}
                        sx={{
                            '& .MuiPaper-root': {
                                width: '450px'
                            },
                            '& .MuiDialogTitle-root': {
                                padding: '15px 10px',
                                background: '#F8F9FA',
                                color: 'black'
                            },
                            '& .MuiDialogContent-root': {
                                padding: '25px 10px',
                                background: 'white',
                                color: 'black',
                                borderBottom: '1px solid lightGray'
                            },
                            '& .MuiDialogActions-root': {
                                padding: '12px 10px',
                                background: 'white',
                            }
                        }}
                    >
                        <DialogTitle className='flex justify-between'>
                            <p className='font-semibold text-base text-gray-500'>Delete Assets</p>
                            <button onClick={handleClose}>
                                <CloseIcon />
                            </button>
                        </DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete the seleted asset?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <button onClick={handleClose} className='font-semibold w-20 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-sm flex justify-center items-center shadow-sm'>Cancel</button>
                            <button onClick={() => deleteUserHandler(UserIdToDelete)} className='font-semibold w-20 h-10 bg-red-600 hover:bg-red-700 text-white rounded-sm flex justify-center items-center shadow-sm'>
                                {loading ? <> <div class="custom-loader-small"></div> </> : "Delete"}
                            </button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </>
    )
}

export default UsersList