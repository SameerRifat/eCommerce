import React, { useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Country, State, City } from 'country-state-city'
import { save_shipping_info } from '../../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps';
import { FormControl, FormHelperText, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { Form, Formik } from "formik";
import * as yup from "yup";

// const phoneRegExp = /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
const phoneRegExp = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm;
const shippingSchema = yup.object().shape({
  address: yup.string().required("required"),
  state: yup.string().required("required"),
  // category: yup.string().oneOf(categories, "Invalid Category").required("required"),
  city: yup.string().required("required"),
  pinCode: yup.number().positive().integer().required("required"),
  phoneNo: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
  // phoneNo: yup.number().integer().test('len', 'PhoneNo. must be 11 characters long', (val) => { if (val) return val.toString().length === 11; }).required("required"),
});

const Shipping = () => {
  const dispatch = useDispatch()
  const alert = useAlert()
  const navigate = useNavigate()
  const { shippingInfo } = useSelector((state) => state.cart)
  // const [shippingData, setShippingData] = useState({
  //   address: shippingInfo.address ? shippingInfo.address : '',
  //   city: shippingInfo.city ? shippingInfo.city : '',
  //   state: shippingInfo.state ? shippingInfo.state : '',
  //   country: shippingInfo.country ? shippingInfo.country : '',
  //   pinCode: shippingInfo.pinCode ? shippingInfo.pinCode : '',
  //   phoneNo: shippingInfo.phoneNo ? shippingInfo.phoneNo : '',
  //   stateCity: ''
  // })
  // const { address, state, city, pinCode, phoneNo } = shippingData
  // const ChangeEvent = (event) => {
  //   const { name, value } = event.target;
  //   console.log(name)
  //   console.log(value)
  //   setShippingData((prevValue) => {
  //     return {
  //       ...prevValue,
  //       [name]: value
  //     }
  //   })
  // }
  // console.log(City.getCitiesOfState('PK', 'PB'))
  // console.log(stateCity)
  const handleFormSubmit = (values, actions) => {
    const { address, state, city, pinCode, phoneNo } = values;
    // const myForm = new FormData();
    // myForm.set("address", address);
    // myForm.set("state", state);
    // myForm.set("city", city);
    // myForm.set("pinCode", pinCode);
    // myForm.set("phoneNo", phoneNo);
    // console.log(Array.from(myForm))
    // for (let obj of myForm) {
    //   console.log(obj)
    // }
    values.country = "PK"
    dispatch(save_shipping_info(values))
    navigate('/order/confirm')
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   if (phoneNo.length < 11 || phoneNo.length > 11) {
  //     alert.error("phone Number Should be 11 digits Long")
  //     return
  //   }
  //   dispatch(save_shipping_info(shippingData))
  //   navigate('/order/confirm')
  // }
  return (
    <div className='pt-24 w-[90%] mx-auto'>
      <div className='md:w-[80%] mx-auto'>
        <CheckoutSteps activeStep={0} />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            address: shippingInfo ? shippingInfo.address : '',
            // state: '',
            state: shippingInfo ? shippingInfo.state : '',
            // city: '',
            city: shippingInfo ? shippingInfo.city : '',
            pinCode: shippingInfo ? shippingInfo.pinCode : '',
            phoneNo: shippingInfo ? shippingInfo.phoneNo : '',
          }}
          validationSchema={shippingSchema}
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
            <Form onSubmit={handleSubmit}>
              <div className='text-center mb-5'>
                <h2 className='p-1.5 border-b-2 border-gray-300 inline-block'>Shipping Details</h2>
              </div>
              <div className='grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6'>
                <div className="col-span-full">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Street address
                  </label>
                  <div className='mt-2 flex items-center'>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                        ),
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      name="address"
                      error={!!touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </div>
                </div>
                <div className="col-span-full md:col-span-2 md:col-start-1">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    State / Province
                  </label>
                  <div className='mt-2'>
                    <FormControl variant="outlined" fullWidth error={!!touched.state && !!errors.state} >
                      <Select
                        name='state'
                        value={values.state}
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>Select a State</em>
                        </MenuItem>
                        {State && State.getStatesOfCountry('PK').map((item) => (
                          <MenuItem key={item.isoCode} value={item.isoCode}>{item.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{touched.state && errors.state}</FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className="col-span-full md:col-span-2">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    City
                  </label>
                  <div className='mt-2'>
                    <FormControl variant="outlined" fullWidth={true} error={!!touched.city && !!errors.city} >
                      <Select
                        name='city'
                        value={values.city}
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>Select a City</em>
                        </MenuItem>
                        {City && City.getCitiesOfState('PK', values.state).map((item) => (
                          <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{touched.city && errors.city}</FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className="col-span-full md:col-span-2">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal code
                  </label>
                  <div className='mt-2 flex items-center'>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PinDropIcon />
                          </InputAdornment>
                        ),
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.pinCode}
                      name="pinCode"
                      error={!!touched.pinCode && !!errors.pinCode}
                      helperText={touched.pinCode && errors.pinCode}
                    />
                  </div>
                </div>
                <div className="col-span-full md:col-span-2">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                      // onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phoneNo}
                      name="phoneNo"
                      error={!!touched.phoneNo && !!errors.phoneNo}
                      helperText={touched.phoneNo && errors.phoneNo}
                    />
                  </div>
                </div>
                <div className="col-span-full flex items-center justify-end mb-8">
                  <input type="submit" value="Continue"
                    className='rounded-md bg-gradient-to-tr from-pink-500 to-violet-500  hover:from-pink-600 hover:to-violet-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500'
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* <form action="" className='md:w-[80%] mx-auto'>
        <CheckoutSteps activeStep={0} />
        <div className='text-center mb-5'>
          <h2 className='text-center p-1.5 border-b-2 border-gray-300 inline-block'>Shipping Details</h2>
        </div>
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <div className="col-span-full">
            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
              Street address
            </label>
            <div className='mt-2 flex items-center'>
              <TextField
                id="input-with-icon-textfield"
                // label="TextField"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
          <div className="col-span-full md:col-span-2 md:col-start-1">
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
              State / Province
            </label>
            <div className="mt-2 flex items-center">
              <TransferWithinAStationIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
              <select name="state" required value={state} onChange={ChangeEvent}
                className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
              >
                <option value="">State</option>
                {State && State.getStatesOfCountry('PK').map((item) => {
                  return <option key={item.isoCode} value={item.isoCode}> {item.name} </option>
                })}
              </select>
            </div>
          </div>
          <div className="col-span-full md:col-span-2">
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
              City
            </label>
            <div className="mt-2 flex items-center">
              <LocationCityIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
              <select name="stateCity" required value={stateCity} onChange={ChangeEvent}
                className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
              >
                <option value="">City</option>
                {City && City.getCitiesOfState('PK', state).map((item) => {
                  return <option key={item.name} value={item.name}> {item.name} </option>
                })}
              </select>
            </div>
          </div>
          <div className="col-span-full md:col-span-2">
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
              ZIP / Postal code
            </label>
            <div className="mt-2 flex items-center">
              <PinDropIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
              <input type="number" name="pinCode" placeholder='Pin Code' required value={pinCode} onChange={ChangeEvent}
                className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
              />
            </div>
          </div>
          <div className="col-span-full md:col-span-2">
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
              Phone Number
            </label>
            <div className="mt-2 flex items-center">
              <PhoneIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
              <input type="number" min='11' max='11' name="phoneNo" placeholder='Phone Number' required value={phoneNo} onChange={ChangeEvent}
                className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <input type="submit" value="Continue" disabled={state ? false : true}
            className='rounded-md bg-indigo-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500'
          />
        </div>
      </form> */}
    </div>
  )
}

export default Shipping


// import React, { useState } from 'react'
// import { useAlert } from 'react-alert'
// import { useDispatch, useSelector } from 'react-redux'
// import styled from 'styled-components'
// import HomeIcon from '@mui/icons-material/Home';
// import LocationCityIcon from '@mui/icons-material/LocationCity';
// import PinDropIcon from '@mui/icons-material/PinDrop';
// import PhoneIcon from '@mui/icons-material/Phone';
// import PublicIcon from '@mui/icons-material/Public';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
// import { Country, State, City } from 'country-state-city'
// import { save_shipping_info } from '../../features/cart/cartSlice';
// import { useNavigate } from 'react-router-dom';
// import CheckoutSteps from './CheckoutSteps';

// const Shipping = () => {
//   const dispatch = useDispatch()
//   const alert = useAlert()
//   const navigate = useNavigate()
//   const { shippingInfo } = useSelector((state) => state.cart)
//   const [shippingData, setShippingData] = useState({
//     address: shippingInfo.address ? shippingInfo.address : '',
//     city: shippingInfo.city ? shippingInfo.city : '',
//     state: shippingInfo.state ? shippingInfo.state : '',
//     country: shippingInfo.country ? shippingInfo.country : '',
//     pinCode: shippingInfo.pinCode ? shippingInfo.pinCode : '',
//     phoneNo: shippingInfo.phoneNo ? shippingInfo.phoneNo : '',
//     stateCity: ''
//   })
//   const { address, city, state, country, pinCode, phoneNo, stateCity } = shippingData
//   const ChangeEvent = (event) => {
//     const { name, value } = event.target;
//     console.log(name)
//     console.log(value)
//     setShippingData((prevValue) => {
//       return {
//         ...prevValue,
//         [name]: value
//       }
//     })
//   }
//   // console.log(City.getCitiesOfState('PK', 'PB'))
//   // console.log(stateCity)
//   const shippingSubmit = (e) => {
//     e.preventDefault()
//     if (phoneNo.length < 11 || phoneNo.length > 11) {
//       alert.error("phone Number Should be 11 digits Long")
//       return
//     }
//     dispatch(save_shipping_info(shippingData))
//     navigate('/order/confirm')
//   }
//   return (
//     <div className='pt-24 w-[90%] mx-auto'>
//       <form action="" className='md:w-[80%] mx-auto'>
//         <CheckoutSteps activeStep={0} />
//         <div className='text-center mb-5'>
//           <h2 className='text-center p-1.5 border-b-2 border-gray-300 inline-block'>Shipping Details</h2>
//         </div>
//         <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
//           <div className="col-span-full">
//             <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
//               Street address
//             </label>
//             <div className='mt-2 flex items-center'>
//               <HomeIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
//               <input type="text" name="address" placeholder='Address' required value={address} onChange={ChangeEvent}
//                 className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
//               />
//             </div>
//           </div>
//           <div className="col-span-full md:col-span-2 md:col-start-1">
//             <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
//               State / Province
//             </label>
//             <div className="mt-2 flex items-center">
//               <TransferWithinAStationIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
//               <select name="state" required value={state} onChange={ChangeEvent}
//                 className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
//               >
//                 <option value="">State</option>
//                 {State && State.getStatesOfCountry('PK').map((item) => {
//                   return <option key={item.isoCode} value={item.isoCode}> {item.name} </option>
//                 })}
//               </select>
//             </div>
//           </div>
//           <div className="col-span-full md:col-span-2">
//             <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
//               City
//             </label>
//             <div className="mt-2 flex items-center">
//               <LocationCityIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
//               <select name="stateCity" required value={stateCity} onChange={ChangeEvent}
//                 className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
//               >
//                 <option value="">City</option>
//                 {City && City.getCitiesOfState('PK', state).map((item) => {
//                   return <option key={item.name} value={item.name}> {item.name} </option>
//                 })}
//               </select>
//             </div>
//           </div>
//           <div className="col-span-full md:col-span-2">
//             <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
//               ZIP / Postal code
//             </label>
//             <div className="mt-2 flex items-center">
//               <PinDropIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
//               <input type="number" name="pinCode" placeholder='Pin Code' required value={pinCode} onChange={ChangeEvent}
//                 className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
//               />
//             </div>
//           </div>
//           <div className="col-span-full md:col-span-2">
//             <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
//               Phone Number
//             </label>
//             <div className="mt-2 flex items-center">
//               <PhoneIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
//               <input type="number" min='11' max='11' name="phoneNo" placeholder='Phone Number' required value={phoneNo} onChange={ChangeEvent}
//                 className='block w-full rounded-md text-gray-900 shadow-sm py-2.5 px-10 border border-gray-400'
//               />
//             </div>
//           </div>
//         </div>
//         <div className="mt-6 flex items-center justify-end gap-x-6">
//           <input type="submit" value="Continue" disabled={state ? false : true}
//             className='rounded-md bg-indigo-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500'
//           />
//         </div>
//       </form>
//     </div>
//   )
// }

// export default Shipping













// import React, { useState } from 'react'
// import { useAlert } from 'react-alert'
// import { useDispatch, useSelector } from 'react-redux'
// import styled from 'styled-components'
// import HomeIcon from '@mui/icons-material/Home';
// import LocationCityIcon from '@mui/icons-material/LocationCity';
// import PinDropIcon from '@mui/icons-material/PinDrop';
// import PhoneIcon from '@mui/icons-material/Phone';
// import PublicIcon from '@mui/icons-material/Public';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
// import { Country, State, City } from 'country-state-city'
// import { save_shipping_info } from '../../features/cart/cartSlice';
// import { useNavigate } from 'react-router-dom';
// import CheckoutSteps from './CheckoutSteps';

// const Shipping = () => {
//   // const steps = [
//   //   {
//   //     label: <p>Shipping Details</p>,
//   //     icon: <LocalShippingIcon />
//   //   },
//   //   {
//   //     label: <p>Confirm Order</p>,
//   //     icon: <LibraryAddCheckIcon />
//   //   },
//   //   {
//   //     label: <p>Payment</p>,
//   //     icon: <AccountBalanceIcon />
//   //   },
//   // ]
//   const dispatch = useDispatch()
//   const alert = useAlert()
//   const navigate = useNavigate()
//   const { shippingInfo } = useSelector((state) => state.cart)
//   const [shippingData, setShippingData] = useState({
//     address: shippingInfo.address ? shippingInfo.address : '',
//     city: shippingInfo.city ? shippingInfo.city : '',
//     state: shippingInfo.state ? shippingInfo.state : '',
//     country: shippingInfo.country ? shippingInfo.country : '',
//     pinCode: shippingInfo.pinCode ? shippingInfo.pinCode : '',
//     phoneNo: shippingInfo.phoneNo ? shippingInfo.phoneNo : '',
//     stateCity: ''
//   })
//   const { address, city, state, country, pinCode, phoneNo, stateCity } = shippingData
//   const ChangeEvent = (event) => {
//     const { name, value } = event.target;
//     console.log(name)
//     console.log(value)
//     setShippingData((prevValue) => {
//       return {
//         ...prevValue,
//         [name]: value
//       }
//     })
//   }
//   // console.log(City.getCitiesOfState('PK', 'PB'))
//   // console.log(stateCity)
//   const shippingSubmit = (e) => {
//     e.preventDefault()
//     if (phoneNo.length < 11 || phoneNo.length > 11) {
//       alert.error("phone Number Should be 11 digits Long")
//       return
//     }
//     dispatch(save_shipping_info(shippingData))
//     navigate('/order/confirm')
//   }

//   return (
//     <Wrapper className='bg-color'>
//       <CheckoutSteps activeStep={0} />
//       <div className="container">
//         {/* <div className="checkout-steps">
//           <Stepper activeStep={activeStep} alternativeLabel>
//             {steps.map((item, index) => (
//               <Step key={index} active={activeStep === index ? true: false} completed={activeStep > index ? true: false}>
//                 <StepLabel icon={item.icon}>{item.label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </div> */}
//         <div className="box">
//           <h2 className='form-heading'>Shipping Details</h2>
//           <form className='form' encType='multipart/form-data' onSubmit={shippingSubmit}>
//             <div>
//               <HomeIcon />
//               <input type="text" name="address" placeholder='Address' required value={address} onChange={ChangeEvent} />
//             </div>
//             <div>
//               <LocationCityIcon />
//               <input type="text" name="city" placeholder='City' required value={city} onChange={ChangeEvent} />
//             </div>
//             <div>
//               <PinDropIcon />
//               <input type="number" name="pinCode" placeholder='Pin Code' required value={pinCode} onChange={ChangeEvent} />
//             </div>
//             <div>
//               <PhoneIcon />
//               <input type="number" name="phoneNo" placeholder='Phone Number' required value={phoneNo} onChange={ChangeEvent} />
//             </div>
//             {/* <div>
//               <PublicIcon />
//               <select name="country" required value={country} onChange={ChangeEvent}>
//                 <option value="">Country</option>
//                 {Country && Country.getAllCountries().map((item) => {
//                   return <option key={item.isoCode} value={item.isoCode}> {item.name} </option>
//                 })}
//               </select>
//             </div> */}
//             <div>
//               <TransferWithinAStationIcon />
//               <select name="state" required value={state} onChange={ChangeEvent}>
//                 <option value="">State</option>
//                 {State && State.getStatesOfCountry('PK').map((item) => {
//                   return <option key={item.isoCode} value={item.isoCode}> {item.name} </option>
//                 })}
//               </select>
//             </div>
//             {state && (
//               <div>
//                 <TransferWithinAStationIcon />
//                 <select name="stateCity" required value={stateCity} onChange={ChangeEvent}>
//                   <option value="">State</option>
//                   {City && City.getCitiesOfState('PK', state).map((item) => {
//                     return <option key={item.name} value={item.name}> {item.name} </option>
//                   })}
//                 </select>
//               </div>
//             )}
//             <input type="submit" value="Continue" className='form-btn' disabled={state ? false : true} />
//           </form>
//         </div>
//       </div>
//     </Wrapper>
//   )
// }

// export default Shipping

// const Wrapper = styled.section`
//   } */
//   .box{
//     width: 500px;
//   }
//   @media screen and (max-width: ${({ theme }) => theme.media.mobile}) {
//     .box{
//           width: 100%;
//     }
//   }
//   @media screen and (max-width: ${({ theme }) => theme.media.sm_mobile}) {
//     .box{
//         width: 100%;
//     }
//   }
// `