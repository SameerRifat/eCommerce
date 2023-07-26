import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { clearErrors, fetchProducts } from '../../features/product/productSlice'
import Loader from '../Loader'
import { useAlert } from 'react-alert'
import ProductCard from './ProductCard'
import { NavLink } from 'react-router-dom'

// const productsArray = [
//   {
//     id: 1,
//     name: 'Earthen Bottle',
//     href: '#',
//     price: '$48',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
//     imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
//     color: 'Black'
//   },
//   {
//     id: 2,
//     name: 'Nomad Tumbler',
//     href: '#',
//     price: '$35',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
//     imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
//     color: 'Black'
//   },
//   {
//     id: 3,
//     name: 'Focus Paper Refill',
//     href: '#',
//     price: '$89',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
//     imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
//     color: 'Black'
//   },
//   {
//     id: 4,
//     name: 'Machined Mechanical Pencil',
//     href: '#',
//     price: '$35',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
//     imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
//     color: 'Black'
//   },
//   {
//     id: 5,
//     name: 'Earthen Bottle',
//     href: '#',
//     price: '$48',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
//     imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
//     color: 'Black'
//   },
//   {
//     id: 6,
//     name: 'Nomad Tumbler',
//     href: '#',
//     price: '$35',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
//     imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
//     color: 'Black'
//   },
//   {
//     id: 7,
//     name: 'Focus Paper Refill',
//     href: '#',
//     price: '$89',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
//     imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
//     color: 'Black'
//   },
//   {
//     id: 8,
//     name: 'Machined Mechanical Pencil',
//     href: '#',
//     price: '$35',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
//     imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
//     color: 'Black'
//   },
//   // More products...
// ]

const ProductsList = () => {
  const alert = useAlert()
  const { loading, products, error, productCount } = useSelector(state => state.product)
  const dispatch = useDispatch()
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(fetchProducts({ keyword: '' }))
    // console.log(products.length)
  }, [dispatch, error, productCount])
  return (
    <>
      {loading ?
        <Loader />
        :
        <div className="bg-gray-50 py-6">
          <div className="w-[96%] md:w-[94%] lg:w-[90%] mx-auto">
            <h2 className="text-lg font-semibold sm:text-xl md:text-2xl sm:font-bold tracking-tight text-gray-600">New Arrivals</h2>

            <div className="mt-6 grid gap-4 sm:gap-x-6 gap-y-6 sm:gap-y-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
              {products.length > 0 ? (
                products.map((product) => {
                  return <ProductCard key={product._id} product={product} />
                })
              ) :
                <p className='text-center'>No Product Found</p>
              }
            </div>
            <NavLink to='/products'
              className='block text-right text-orange-500 text-sm font-semibold mt-10 hover:underline cursor-pointer'
            >
              See all products
            </NavLink>
          </div>
        </div>
      }
    </>
  )
}

export default ProductsList