import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, colors, useMediaQuery } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import React, { useEffect, useState } from 'react'
import AdminHeader from '../AdminHeader';
import MetaData from '../../MetaData'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert'
import { clearErrors, createProduct, createProductReset } from '../../../features/product/createProductSlice';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../../features/product/categoriesSlice';

// const categories = ["Laptop", "SmartPhone", "Camera", "Footwear", "Shirts", "Pants"];
const sizesArray = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const initialValues = {
    name: "",
    description: "",
    price: Number,
    // category: "",
    stock: Number,
}
const productSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
    // category: yup.string().required("required"),
    price: yup.number().positive().integer().required("required"),
    stock: yup.number().positive().integer().required("required"),
})
const filter = createFilterOptions();

const NewProduct = () => {
    const isNoneMobile = useMediaQuery("(min-width: 600px)");
    const { loading, error, success } = useSelector((state) => state.newProduct)
    const { loading: categoriesLoading, categories, error: categoreisError } = useSelector((state) => state.categories)
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const [value, setValue] = useState('')
    const [sizes, setSizes] = useState([])
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const imageChangeEvent = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        })
    }
    const [colorImages, setColorImages] = useState([]);
    const [colorImagesPreview, setColorImagesPreview] = useState([])
    const ColorImageChangeEvent = (e) => {
        const files = Array.from(e.target.files);
        setColorImages([]);
        setColorImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setColorImagesPreview((old) => [...old, reader.result]);
                    setColorImages((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        })
    }
    let categoryErrorMessage = ''
    const handleAutocompleteChange = (event, values) => {
        setSizes(values);
    };
    const handleFormSubmit = async (values, actions) => {
        const { name, description, price, category, stock } = values
        const myForm = new FormData();
        myForm.set("name", name)
        myForm.set("price", price)
        myForm.set("description", description)
        myForm.set("category", value)
        myForm.set("stock", stock)
        if (sizes.length > 0) {
            console.log(sizes)
            // myForm.set("sizes", sizes)
            const sizesObjectsArray = sizes.map(size => ({ size }));
            myForm.set("sizes", JSON.stringify(sizesObjectsArray))
        }
        images.forEach((image) => {
            myForm.append("images", image);
        })
        if (colorImages.length > 0) {
            colorImages.forEach((image) => {
                myForm.append("colors", image);
            })
        }
        if (!value) {
            categoryErrorMessage = 'required'
        } else {
            // console.log(Array.from(myForm))
            // for (let obj of myForm) {
            //     console.log(obj)
            // }
            dispatch(createProduct(myForm));
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            // actions.resetForm();
            // setValue('')
        }
    }
    useEffect(() => {
        dispatch(getAllCategories());
    }, [])
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Product Created Successfully");
            navigate('/admin')
            dispatch(createProductReset())
        }
    }, [alert, error, success, dispatch, navigate])
    const options = categories
    // const options = ["Laptop", "SmartPhone", "Camera", "Footwear", "Shirts", "Pants"]
    return (
        <>
            <MetaData title="Create Product" />
            <Box m='20px'>
                <AdminHeader title="create product" subtitle="create a new product" />
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={productSchema}
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
                            <Grid container spacing={3}>
                                <Grid item sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Product Name'
                                        autoComplete='off'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        name='name'
                                        error={!!touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                    />
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <Autocomplete
                                        value={value}
                                        fullWidth
                                        onChange={(event, newValue) => {
                                            if (typeof newValue === 'string') {
                                                setValue(newValue)
                                            } else if (newValue && newValue.inputValue) {
                                                // Create a new value from the user input
                                                setValue(newValue.inputValue)
                                            } else {
                                                setValue(newValue);
                                            }
                                        }}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);

                                            const { inputValue } = params;
                                            // Suggest the creation of a new value
                                            const isExisting = options.some((option) => inputValue === option.title);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push(
                                                    inputValue
                                                );
                                            }

                                            return filtered;
                                        }}
                                        selectOnFocus
                                        clearOnBlur
                                        handleHomeEndKeys
                                        id="category"
                                        options={options}
                                        getOptionLabel={(option) => {
                                            // Value selected with enter, right from the input
                                            if (typeof option === 'string') {
                                                return option;
                                            }
                                            // Add "xxx" option created dynamically
                                            if (option.inputValue) {
                                                return option.inputValue;
                                            }
                                            // Regular option
                                            return option;
                                        }}
                                        renderOption={(props, option) => <li {...props}>{option}</li>}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField {...params} variant='filled' label="Select or add new category" />
                                        )}
                                    />
                                    <FormHelperText sx={{ color: '#D32F2F', ml: '10px' }}>{categoryErrorMessage && categoryErrorMessage}</FormHelperText>
                                </Grid>
                                <Grid item sm={12} md={4}>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='number'
                                        label='Stock'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.stock}
                                        name='stock'
                                        error={!!touched.stock && !!errors.stock}
                                        helperText={touched.stock && errors.stock}
                                    />
                                </Grid>
                                <Grid item sm={12} md={4} >
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='number'
                                        label='Price'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.price}
                                        name='price'
                                        error={!!touched.price && !!errors.price}
                                        helperText={touched.price && errors.price}
                                    />
                                </Grid>
                                <Grid item sm={12} md={4}>
                                    <Autocomplete
                                        value={sizes}
                                        multiple
                                        id="tags-standard"
                                        options={sizesArray}
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="filled"
                                                label="Select Sizes"
                                            />
                                        )}
                                        onChange={handleAutocompleteChange}
                                    />
                                    {/* <FormHelperText sx={{ color: '#D32F2F', ml: '10px' }}>{categoryErrorMessage && categoryErrorMessage}</FormHelperText> */}
                                </Grid>

                                <Grid item sm={12}>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        multilin
                                        maxRows={3}
                                        label='Description'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.description}
                                        name='description'
                                        error={!!touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                    />
                                </Grid>
                                <Grid item sm={12} lg={9} minHeight='88px'>
                                    <div style={{ border: `1px dashed ${colors.grey[600]}`, borderRadius: '8px' }} className='flex gap-2 overflow-x-auto p-2'>
                                        {imagesPreview.length > 0 ? (
                                            imagesPreview.map((image, ind) => (
                                                <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-md h-20 cursor-pointer bg-gray-200">
                                                    <img
                                                        src={image}
                                                        alt='product colors preview'
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUc9A3lU2z__DzLc_FaJVc8AKs8SWRzF9ilE7Q-HAhowAjpNndg2uZKcseeYSWRRQowss&usqp=CAU" alt="Placeholder Image" className="h-20 w-20" />
                                        )}
                                    </div>
                                </Grid>

                                <Grid item sm={12} lg={3}>
                                    <Box id='product-images' sx={{
                                        '& input::-webkit-file-upload-button': {
                                            cursor: 'pointer',
                                            width: '100%',
                                            border: 'none',
                                            height: '33px',
                                            zIndex: 2,
                                            padding: '0 10px',
                                            backgroundColor: colors.grey[200],
                                            transition: 'all 0.4s'
                                        },
                                        '& input::-webkit-file-upload-button:hover': {
                                            backgroundColor: colors.grey[400]
                                        }
                                    }}>
                                        <label htmlFor="images">Select product images</label>
                                        <input type="file" name="images" accept='image/*' multiple onChange={imageChangeEvent} />
                                    </Box>
                                </Grid>
                                <Grid item sm={12} lg={9} minHeight='88px'>
                                    <div style={{ border: `1px dashed ${colors.grey[600]}`, borderRadius: '8px' }} className='flex gap-2 overflow-x-auto p-2'>
                                        {colorImagesPreview.length > 0 ? (
                                            colorImagesPreview.map((image, ind) => (
                                                <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-md h-20 cursor-pointer bg-gray-200">
                                                    <img
                                                        src={image}
                                                        alt='product colors preview'
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUc9A3lU2z__DzLc_FaJVc8AKs8SWRzF9ilE7Q-HAhowAjpNndg2uZKcseeYSWRRQowss&usqp=CAU" alt="Placeholder Image" className="h-20 w-20" />
                                        )}
                                    </div>
                                </Grid>
                                <Grid item sm={12} lg={3}>
                                    <Box id='product-images' sx={{
                                        '& input::-webkit-file-upload-button': {
                                            cursor: 'pointer',
                                            width: '100%',
                                            border: 'none',
                                            height: '33px',
                                            zIndex: 2,
                                            padding: '0 10px',
                                            backgroundColor: colors.grey[200],
                                            transition: 'all 0.4s'
                                        },
                                        '& input::-webkit-file-upload-button:hover': {
                                            backgroundColor: colors.grey[400]
                                        }
                                    }}>
                                        <label htmlFor="colors">Select product colors</label>
                                        <input type="file" name="colors" accept='image/*' multiple onChange={ColorImageChangeEvent} />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box display='flex' justifyContent='end' mt='20px'>
                                <button type='submit' disabled={loading}
                                    className='min-w-[200px] h-11 flex justify-center items-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500  hover:from-pink-600 hover:to-violet-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-75'
                                >
                                    {loading ? <> <div class="custom-loader"></div> Creating... </> : "Create New Product"}
                                    {/* <div class="custom-loader"></div>Processing... */}
                                </button>
                                {/* <Button disabled={loading} type='submit' color='secondary' variant='contained' style={{width: '200px', height: '50px'}}>
                                    {loading ? <div class="custom-loader"></div> : "Create New Product"}
                                    <div class="custom-loader"></div>
                                </Button> */}
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    )
}

export default NewProduct


// import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, colors, useMediaQuery } from '@mui/material'
// import { Form, Formik } from 'formik';
// import * as yup from 'yup'
// import React, { useEffect, useState } from 'react'
// import AdminHeader from '../AdminHeader';
// import MetaData from '../../MetaData'
// import { useDispatch, useSelector } from 'react-redux';
// import { useAlert } from 'react-alert'
// import { clearErrors, createProduct, createProductReset } from '../../../features/product/createProductSlice';
// import { useNavigate } from 'react-router-dom';

// const categories = ["Laptop", "SmartPhone", "Camera", "Footwear", "Shirts", "Pants"];
// const initialValues = {
//     name: "",
//     description: "",
//     price: Number,
//     category: "",
//     stock: Number,
// }
// const phoneRegExp = /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
// const productSchema = yup.object().shape({
//     name: yup.string().required("required"),
//     description: yup.string().required("required"),
//     category: yup.string().oneOf(categories, "Invalid Category").required("required"),
//     price: yup.number().positive().integer().required("required"),
//     stock: yup.number().positive().integer().required("required"),
// })

// const NewProduct = () => {
//     const isNoneMobile = useMediaQuery("(min-width: 600px)");
//     const { loading, error, success } = useSelector((state) => state.newProduct)
//     const dispatch = useDispatch()
//     const alert = useAlert()
//     const navigate = useNavigate()
//     const [images, setImages] = useState([]);
//     const [imagesPreview, setImagesPreview] = useState([])
//     const imageChangeEvent = (e) => {
//         const files = Array.from(e.target.files);
//         setImages([]);
//         setImagesPreview([]);
//         files.forEach((file) => {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 if (reader.readyState === 2) {
//                     setImagesPreview((old) => [...old, reader.result]);
//                     setImages((old) => [...old, reader.result]);
//                 }
//             }
//             reader.readAsDataURL(file);
//         })
//     }
//     const handleFormSubmit = async (values, actions) => {
//         console.log(values)
//         const { name, description, price, category, stock } = values
//         const myForm = new FormData();
//         myForm.set("name", name)
//         myForm.set("price", price)
//         myForm.set("description", description)
//         myForm.set("category", category)
//         myForm.set("stock", stock)
//         images.forEach((image) => {
//             myForm.append("images", image);
//         })
//         console.log(myForm)
//         dispatch(createProduct(myForm));
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         actions.resetForm();
//     }
//     useEffect(() => {
//         if (error) {
//             alert.error(error)
//             dispatch(clearErrors())
//         }
//         if (success) {
//             alert.success("Product Created Successfully");
//             navigate('/admin')
//             dispatch(createProductReset())
//         }
//     }, [alert, error, success, dispatch, navigate])

//     return (
//         <>
//             <MetaData title="Create Product" />
//             <Box m='20px'>
//                 <AdminHeader title="create user" subtitle="create a new user profile" />
//                 <Formik
//                     onSubmit={handleFormSubmit}
//                     initialValues={initialValues}
//                     validationSchema={productSchema}
//                 >
//                     {({
//                         values,
//                         errors,
//                         touched,
//                         handleChange,
//                         handleBlur,
//                         handleSubmit,
//                         isSubmitting,
//                         /* and other goodies */
//                     }) => (
//                         <Form onSubmit={handleSubmit} encType='multipart/form-data'>
//                             <Grid container spacing={3}>
//                                 <Grid item sm={12} md={6}>
//                                     <TextField
//                                         fullWidth
//                                         variant='filled'
//                                         type='text'
//                                         label='Product Name'
//                                         autoComplete='off'
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.name}
//                                         name='name'
//                                         error={!!touched.name && !!errors.name}
//                                         helperText={touched.name && errors.name}
//                                     />
//                                 </Grid>
//                                 <Grid item sm={12} md={6}>
//                                     <FormControl variant="filled" fullWidth={true} error={!!touched.category && !!errors.category} >
//                                         <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
//                                         <Select
//                                             labelId="demo-simple-select-standard-label"
//                                             id="demo-simple-select-standard"
//                                             name='category'
//                                             value={values.category}
//                                             onChange={handleChange}
//                                             label="Category"
//                                         >
//                                             <MenuItem value="">
//                                                 <em>Select a category</em>
//                                             </MenuItem>
//                                             {categories.map((cate, ind) => (
//                                                 <MenuItem key={ind} value={cate}>{cate}</MenuItem>
//                                             ))}
//                                         </Select>
//                                         <FormHelperText>{touched.category && errors.category}</FormHelperText>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item sm={12} md={6}>
//                                     <TextField
//                                         fullWidth
//                                         variant='filled'
//                                         type='number'
//                                         label='Stock'
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.stock}
//                                         name='stock'
//                                         error={!!touched.stock && !!errors.stock}
//                                         helperText={touched.stock && errors.stock}
//                                     />
//                                 </Grid>
//                                 <Grid item sm={12} md={6} >
//                                     <TextField
//                                         fullWidth
//                                         variant='filled'
//                                         type='number'
//                                         label='Price'
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.price}
//                                         name='price'
//                                         error={!!touched.price && !!errors.price}
//                                         helperText={touched.price && errors.price}
//                                     />
//                                 </Grid>
//                                 <Grid item sm={12}>
//                                     <TextField
//                                         fullWidth
//                                         variant='filled'
//                                         type='text'
//                                         label='Description'
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.description}
//                                         name='description'
//                                         error={!!touched.description && !!errors.description}
//                                         helperText={touched.description && errors.description}
//                                     />
//                                 </Grid>
//                                 <Grid item sm={12} lg={9}
//                                     sx={{
//                                         '& #product-images': {
//                                             width: '100%',
//                                             overflow: 'auto'
//                                         },
//                                         '& #product-images > img': {
//                                             border: `2px solid ${colors.grey[100]}`,
//                                             borderRadius: '10px',
//                                             width: '150px',
//                                             height: '150px',
//                                             objectFit: 'contain',
//                                             mr: '10px'
//                                         },
//                                     }}
//                                 >
//                                     <Box id='product-images' display='flex' padding='10px'>
//                                         {imagesPreview.map((image, ind) => (
//                                             <img key={ind} src={image} alt="Avatar Preview" />
//                                         ))}
//                                     </Box>
//                                 </Grid>
//                                 <Grid item sm={12} lg={3}>
//                                     <Box id='product-images' sx={{
//                                         '& input::-webkit-file-upload-button': {
//                                             cursor: 'pointer',
//                                             width: '100%',
//                                             border: 'none',
//                                             height: '33px',
//                                             zIndex: 2,
//                                             padding: '0 10px',
//                                             backgroundColor: colors.grey[200],
//                                             transition: 'all 0.4s'
//                                         },
//                                         '& input::-webkit-file-upload-button:hover': {
//                                             backgroundColor: colors.grey[400]
//                                         }
//                                     }}>
//                                         <input type="file" name="images" accept='image/*' multiple onChange={imageChangeEvent} />
//                                     </Box>
//                                 </Grid>
//                             </Grid>
//                             <Box display='flex' justifyContent='end' mt='20px' sx={{ '& button:disabled': { opacity: '0.4' } }}>
//                                 <Button disabled={loading} type='submit' color='secondary' variant='contained'>
//                                     Create New User
//                                 </Button>
//                             </Box>
//                         </Form>
//                     )}
//                 </Formik>
//             </Box>
//         </>
//     )
// }

// export default NewProduct