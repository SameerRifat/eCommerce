import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  colors,
  useMediaQuery,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import AdminHeader from "../AdminHeader";
import MetaData from "../../MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  fetchProductDetails,
} from "../../../features/product/productDetailsSlice";
import {
  clear_errors,
  updateProduct,
  update_product_reset,
} from "../../../features/product/updateProductSlice";
import Loader from "../../Loader";
import { getAllCategories, clearErrors as categoriesClearErrors } from '../../../features/product/categoriesSlice'

// const categories = [
//   "Laptop",
//   "SmartPhone",
//   "Camera",
//   "Footwear",
//   "Shirts",
//   "Pants",
// ];
const productSchema = yup.object().shape({
  name: yup.string().required("required"),
  description: yup.string().required("required"),
  // category: yup.string().oneOf(categories, "Invalid Category").required("required"),
  category: yup.string().required("required"),
  price: yup.number().positive().integer().required("required"),
  stock: yup.number().positive().integer().required("required"),
});

const UpdateProduct = () => {
  const { id } = useParams();
  const {
    loading: productDetailsLoading,
    error,
    product,
  } = useSelector((state) => state.productDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.updateProduct);
  const { loading: categoriesLoading, categories, error: categoreisError } = useSelector((state) => state.categories)
  const isNoneMobile = useMediaQuery("(min-width: 600px)");
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const imageChangeEvent = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handleFormSubmit = async (values, actions) => {
    const { name, description, price, category, stock } = values;
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    images.forEach((image) => {
      myForm.append("images", image);
    });
    const data = {
      id,
      myForm,
    };
    dispatch(updateProduct(data));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };
  useEffect(() => {
    dispatch(getAllCategories());
  }, [])
  console.log(categories)
  useEffect(() => {
    if (product._id !== id) {
      dispatch(fetchProductDetails(id));
    } else {
      setOldImages(product.images);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clear_errors());
    }
    if (isUpdated) {
      alert.success("Product updated Successfully");
      navigate("/admin/products");
      dispatch(update_product_reset());
    }
  }, [alert, error, updateError, isUpdated, dispatch, navigate, product, id]);

  return (
    <>
      {productDetailsLoading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Update Product - Admin" />
          <Box m="20px">
            <AdminHeader
              title="Update Product"
              subtitle=""
            />
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={{
                name: product ? product.name : "",
                description: product ? product.description : "",
                price: product ? product.price : 0,
                category: product ? product.category : "",
                stock: product ? product.stock : 0,
              }}
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
                /* and other goodies */
              }) => (
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Grid container spacing={3}>
                    <Grid item sm={12} md={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Product Name"
                        autoComplete="off"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        name="name"
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item sm={12} md={6}>
                      <FormControl
                        variant="filled"
                        fullWidth={true}
                        error={!!touched.category && !!errors.category}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          label="Category"
                        >
                          <MenuItem value="">
                            <em>Select a category</em>
                          </MenuItem>
                          {categories.map((cate, ind) => (
                            <MenuItem key={ind} value={cate}>
                              {cate}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {touched.category && errors.category}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} md={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label="Stock"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.stock}
                        name="stock"
                        error={!!touched.stock && !!errors.stock}
                        helperText={touched.stock && errors.stock}
                      />
                    </Grid>
                    <Grid item sm={12} md={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label="Price"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.price}
                        name="price"
                        error={!!touched.price && !!errors.price}
                        helperText={touched.price && errors.price}
                      />
                    </Grid>
                    <Grid item sm={12}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.description}
                        name="description"
                        error={!!touched.description && !!errors.description}
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      sx={{
                        "& #product-images": {
                          width: "100%",
                          overflow: "auto",
                        },
                        "& #product-images > img": {
                          border: `2px solid ${colors.grey[100]}`,
                          borderRadius: "10px",
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          mr: "10px",
                        },
                      }}
                    >
                      <Box
                        id="product-images"
                        display="flex"
                        padding="10px 10px 10px 0"
                      >
                        {oldImages &&
                          oldImages.map((image, ind) => (
                            <img
                              key={ind}
                              src={image.url}
                              alt="Avatar Preview"
                            />
                          ))}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      lg={9}
                      sx={{
                        "& #product-images": {
                          width: "100%",
                          overflow: "auto",
                        },
                        "& #product-images > img": {
                          border: `2px solid ${colors.grey[100]}`,
                          borderRadius: "10px",
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          mr: "10px",
                        },
                      }}
                    >
                      <Box id="product-images" display="flex" padding="10px">
                        {imagesPreview.map((image, ind) => (
                          <img key={ind} src={image} alt="Avatar Preview" />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item sm={12} lg={3}>
                      <Box
                        id="product-images"
                        sx={{
                          "& input::-webkit-file-upload-button": {
                            cursor: "pointer",
                            width: "100%",
                            border: "none",
                            height: "33px",
                            zIndex: 2,
                            padding: "0 10px",
                            backgroundColor: colors.grey[200],
                            transition: "all 0.4s",
                          },
                          "& input::-webkit-file-upload-button:hover": {
                            backgroundColor: colors.grey[400],
                          },
                        }}
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          multiple
                          onChange={imageChangeEvent}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Box
                    display="flex"
                    justifyContent="end"
                    mt="20px"
                    sx={{ "& button:disabled": { opacity: "0.6" } }}
                  >
                    <Button
                      disabled={loading}
                      type="submit"
                      color="secondary"
                      variant="contained"
                    >
                      Update
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </>
      )}
    </>
  );
};

export default UpdateProduct;
