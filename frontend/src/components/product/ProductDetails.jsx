import React, { useEffect, useState } from 'react'
// import { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Rating from '@mui/material/Rating';
import { IconButton } from '@mui/material';
import { clearErrors, fetchProductDetails } from '../../features/product/productDetailsSlice'
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import { addItemsToCart } from '../../features/cart/cartSlice';

// const product = {
//     name: 'Basic Tee 6-Pack ',
//     price: '$192',
//     rating: 3.9,
//     reviewCount: 117,
//     href: '#',
//     stock: 5,
//     descrption: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque non modi odio minima commodi porro ipsum illum pariatur ullam repudiandae!',
//     images: [
//         {
//             id: 1,
//             url: 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg'
//         },
//         {
//             id: 2,
//             url: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg'
//         },
//         {
//             id: 3,
//             url: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg'
//         },
//         {
//             id: 4,
//             url: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg'
//         },
//         {
//             id: 5,
//             url: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg'
//         }
//     ],
//     colors: [
//         { name: 'White', class: 'bg-white', hex: '#fff', selectedClass: 'ring-gray-400' },
//         { name: 'Gray', class: 'bg-gray-200', hex: '#E5E7EB', selectedClass: 'ring-gray-400' },
//         { name: 'Black', class: 'bg-gray-900', hex: '#111827', selectedClass: 'ring-gray-900' },
//     ],
//     sizes: [
//         { name: 'XXS', inStock: true },
//         { name: 'XS', inStock: true },
//         { name: 'S', inStock: true },
//         { name: 'M', inStock: true },
//         { name: 'L', inStock: true },
//         { name: 'XL', inStock: true },
//         { name: 'XXL', inStock: true },
//         { name: 'XXXL', inStock: false },
//     ],
// }

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const imageUrl = 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'

const reviews = [
    {
        id: 1,
        name: 'Hacton Gribbon',
        reviewedAt: 'july 2, 2021',
        rating: 3,
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique necessitatibus omnis, ducimus, expedita ab commodi fugit nisi consequatur perspiciatis modi eum molestiae reiciendis, laboriosam laudantium magni eos quia ipsa earum.'
    },
    {
        id: 2,
        name: 'Hacton Gribbon',
        reviewedAt: 'july 2, 2021',
        rating: 4,
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ducimus, expedita ab commodi fugit nisi consequatur perspiciatis modi eum molestiae reiciendis, laboriosam laudantium magni eos quia ipsa earum.'
    },
    {
        id: 3,
        name: 'Gorgia',
        reviewedAt: 'july 2, 2021',
        rating: 2,
        comment: 'Similique necessitatibus omnis, ducimus, expedita ab commodi fugit nisi consequatur perspiciatis modi eum molestiae reiciendis, laboriosam laudantium magni eos quia ipsa earum.'
    },
    {
        id: 4,
        name: 'Hacton Gribbon',
        reviewedAt: 'july 2, 2021',
        rating: 5,
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique necessitatibus omnis, ducimus, expedita ab commodi fugit nisi consequatur perspiciatis modi eum molestiae reiciendis, laboriosam laudantium magni eos quia ipsa earum.'
    }
]

const options = {
    size: 'medium',
    value: 4,
    readOnly: true,
    precision: 0.5
}

const ProductDetails = () => {
    const alert = useAlert();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, product, error } = useSelector(state => state.productDetails)
    const [quantity, setQuantity] = useState(1)
    const [mainImage, setMainImage] = useState({})
    const [selectedColor, setSelectedColor] = useState({})
    const [selectedSize, setSelectedSize] = useState({})
    const increaseQuantity = (e) => {
        e.preventDefault()
        if (product.stock <= quantity) return
        const qty = quantity + 1
        setQuantity(qty)
    }
    const decreaseQuantity = (e) => {
        e.preventDefault()
        if (quantity <= 1) return
        const qty = quantity - 1
        setQuantity(qty)
    }
    const handleSubmit = (e) => {
        const cartData = {
            id,
            quantity,
            color: selectedColor && selectedColor.url,
            size: selectedColor && selectedSize.size
        }
        e.preventDefault()
        console.log('Selcted color:', selectedColor)
        console.log('Selcted size:', selectedSize)
        console.log(quantity)
        console.log(cartData)
        dispatch(addItemsToCart(cartData))
        alert.success("Item Added To Cart")
    }
    // console.log(id)
    useEffect(() => {
        if (product) {
            setMainImage(product.images ? product.images[0] : {})
            setSelectedColor(product.colors ? product.colors[0] : {})
            setSelectedSize(product.sizes ? product.sizes[0] : {})
        }
    }, [product])

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(fetchProductDetails(id))
    }, [dispatch, id, alert, error])

    return (
        <>
            {loading ? <Loader /> :
                <>
                    <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 sm:px-6 lg:px-28 pt-28">
                        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 sm:gap-x-8 md:gap-x-14 lg:gap-x-20">
                            <div className='sm:col-span-4 lg:col-span-5'>
                                <div className="aspect-h-2 aspect-w-2 overflow-hidden rounded-lg bg-gray-100">
                                <img src={mainImage.url} alt='product image' className="object-cover object-center" />
                                </div>
                                <div className='mt-2 grid grid-cols-3 lg:grid-cols-4 gap-2'>
                                    {product.images && product.images.map((img) => {
                                        return (
                                            <div key={img.id} onClick={() => setMainImage(img)} className="aspect-w-1 w-full overflow-hidden rounded-md h-24 cursor-pointer">
                                                <img
                                                    src={img.url}
                                                    alt='product image'
                                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="sm:col-span-8 lg:col-span-7">
                                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

                                <section aria-labelledby="information-heading" className="mt-2">
                                    <h3 id="information-heading" className="sr-only">
                                        Product information
                                    </h3>

                                    <p className="text-2xl text-gray-900">{product.price}</p>

                                    {/* Reviews */}
                                    <div className="mt-6">
                                        <h4 className="sr-only">Reviews</h4>
                                        <div className="flex items-center">
                                            <Rating {...options} />
                                            {/* <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                className={classNames(
                                                    product.rating > rating ? 'text-gray-900' : 'text-gray-200',
                                                    'h-5 w-5 flex-shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div> */}
                                            <p className="sr-only">{product.ratings} out of 5 stars</p>
                                            <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                {product.numOfReviews} reviews
                                            </a>
                                        </div>
                                    </div>
                                </section>

                                <section aria-labelledby="options-heading" className="mt-10">
                                    <h3 id="options-heading" className="sr-only">
                                        Product options
                                    </h3>

                                    <form onSubmit={handleSubmit} encType='multipart/form-data'>
                                        {/* Colors */}
                                        {product && product.colors.length > 0 &&
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">Color</h4>

                                                <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                                                    <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                                                    <span className="flex items-center space-x-3">
                                                        {product.colors.map((color) => (
                                                            <RadioGroup.Option
                                                                key={color._id}
                                                                value={color}
                                                                className={({ active, checked }) =>
                                                                    classNames(
                                                                        active && checked ? 'ring ring-offset-1' : '',
                                                                        !active && checked ? 'ring-2' : '',
                                                                        'focus:outline-none rounded-sm'
                                                                    )
                                                                }
                                                            >
                                                                <RadioGroup.Label as="div" className="sr-only">
                                                                    <img src={color.url} alt='color images' />
                                                                </RadioGroup.Label>
                                                                <div className="aspect-w-1 min-w-[64px] overflow-hidden rounded-sm h-16 cursor-pointer">
                                                                    <img
                                                                        src={color.url}
                                                                        alt='product colors preview'
                                                                        className="h-full w-full object-cover object-center"
                                                                    />
                                                                </div>
                                                            </RadioGroup.Option>
                                                        ))}
                                                    </span>
                                                </RadioGroup>
                                            </div>
                                        }

                                        {/* Sizes */}
                                        {product && product.sizes.length > 0 &&
                                            <div className="mt-10">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">Size</h4>
                                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                        Size guide
                                                    </a>
                                                </div>

                                                <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                                                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                    <div className="grid grid-cols-4 gap-4 md:gap-6">
                                                        {product.sizes.map((size) => (
                                                            <RadioGroup.Option
                                                                key={size.size}
                                                                value={size}
                                                                // disabled={!size.inStock}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        // size.inStock
                                                                        //     ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                                        //     : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                                        active ? 'ring-2 ring-indigo-500' : '',
                                                                        'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                                                    )
                                                                }
                                                            >
                                                                {({ active, checked }) => (
                                                                    <>
                                                                        <RadioGroup.Label as="span">{size.size}</RadioGroup.Label>
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'border' : 'border-2',
                                                                                checked ? 'border-indigo-500' : 'border-transparent',
                                                                                ' absolute -inset-px rounded-md cursor-pointer'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                        {/* {size.inStock ? (
                                                                <span
                                                                    className={classNames(
                                                                        active ? 'border' : 'border-2',
                                                                        checked ? 'border-indigo-500' : 'border-transparent',
                                                                        'pointer-events-none absolute -inset-px rounded-md'
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                                >
                                                                    <svg
                                                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                                        viewBox="0 0 100 100"
                                                                        preserveAspectRatio="none"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                    </svg>
                                                                </span>
                                                            )} */}
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                                {/* <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                                                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                    <div className="grid grid-cols-4 gap-4 md:gap-6">
                                                        {product.sizes.map((size) => (
                                                            <RadioGroup.Option
                                                                key={size.name}
                                                                value={size}
                                                                disabled={!size.inStock}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        size.inStock
                                                                            ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                                            : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                                        active ? 'ring-2 ring-indigo-500' : '',
                                                                        'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                                                    )
                                                                }
                                                            >
                                                                {({ active, checked }) => (
                                                                    <>
                                                                        <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                                                                        {size.inStock ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active ? 'border' : 'border-2',
                                                                                    checked ? 'border-indigo-500' : 'border-transparent',
                                                                                    'pointer-events-none absolute -inset-px rounded-md'
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                        ) : (
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                                            >
                                                                                <svg
                                                                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                                                    viewBox="0 0 100 100"
                                                                                    preserveAspectRatio="none"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                                </svg>
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        ))}
                                                    </div>
                                                </RadioGroup> */}
                                            </div>
                                        }
                                        <div className='my-5 flex items-center gap-7'>
                                            <div className='border border-gray-200 rounded-sm'>
                                                <button onClick={decreaseQuantity} className='bg-gray-100 p-2 hover:bg-gray-200 transition-all'>
                                                    <RemoveIcon />
                                                </button>
                                                <input type="number" readOnly value={quantity} className='border-none w-14 text-center p-1' />
                                                <button onClick={increaseQuantity} className='bg-gray-100 p-2 hover:bg-gray-200 transition-all'>
                                                    <AddIcon />
                                                </button>
                                                {/* <button onClick={increaseQuantity} className='border-none bg-gray-100 font-semibold text-lg px-3 py-1'>+</button> */}
                                            </div>
                                            <button type='submit' disabled={product.stock < 1 ? true : false} className='font-medium rounded-full bg-violet-500 py-3 px-7 text-white hover:bg-violet-600 shadow-sm'>Add to Cart</button>
                                            {/* <button disabled={stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button> */}
                                        </div>
                                        <p>
                                            Status:
                                            <span className={product.stock < 1 ? "text-red-500" : "text-green-500"}>
                                                {product.stock < 1 ? " Out of Stock" : " In Stock"}
                                            </span>
                                        </p>
                                        <p className='my-4'> <span className='font-bold'>Description: </span> {product.description} </p>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </div>
                    <section className='py-6 px-4 sm:px-6 lg:px-28'>
                        <div className='w-full md:w-[80%] lg:w-[60%]'>
                            <h1 className='text-lg font-bold text-gray-600 px-1 border-b-2 border-gray-300 w-fit'>Reviews</h1>
                            {reviews.map((review, ind) => {
                                const { id, name, rating, comment, reviewedAt } = review
                                const options = {
                                    value: rating,
                                    readOnly: true,
                                    precision: 0.5
                                }
                                return (
                                    <div key={id} className="relative mt-9 flex items-center gap-x-4 border-b last:border-b-0 border-gray-200 pb-4">
                                        <img src={imageUrl} alt="avatar" className="h-10 w-10 rounded-full bg-gray-50 self-start" />
                                        <div className="text-sm leading-6">
                                            <p className="font-semibold text-gray-900">
                                                {name}
                                            </p>
                                            <p>{reviewedAt}</p>
                                            <Rating {...options} size='small' className='my-3' />
                                            <p>{comment}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </>
            }
        </>
    )
}

export default ProductDetails