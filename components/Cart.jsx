import React,{useRef, useEffect} from 'react'
import Link from 'next/link';
import {AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping} from 'react-icons/ai'
import { TiDeleteOutline} from 'react-icons/ti'
// import toast from  'react-hot-toast'

import { useStateContext } from '../context/StateContext';
import {urlFor} from '../lib/client'
// import getStripe from '../lib/getStripe';

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Cart = () => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove} = useStateContext();
  

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);
  // const handleCheckout = async () => {
  //   const stripe = await getStripe();

  //   const response = await fetch('/api/stripe', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(cartItems),
  //   });

  //   if(response.statusCode === 500) return;
    
  //   const data = await response.json();

  //   toast.loading('Redirecting...');

  //   stripe.redirectToCheckout({ sessionId: data.id });
  // }



  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
           type='button'
           className='cart-heading'
           onClick={()=> setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your Shopping bad is empty</h3>
            <Link href="/">
              <button
               type='button'
               onClick={()=> setShowCart(false)}
               className="btn"
              >
                  Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className='product-container'>
          {cartItems.length >= 1 && cartItems.map((item)=>(
            <div className='product' key={item._id}>
              <img src={urlFor(item?.image[0])} alt="" className='cart-product-image' />
              <div className='item-desc'>
                <div className='flex top'>
                    <h5>{item.name}</h5>
                    <h4>₹{item.price}</h4>

                </div>
                <div className="flex buttom">
                  <div>
                    
                     <br />
                        <p className='quantity-desc'>
                            <span className='minus' onClick={() => toggleCartItemQuantity(item._id, 'dec') }  >
                               <AiOutlineMinus />
                            </span>
                            <span className='num'>{item.quantity}</span>
                            <span className='plus' onClick={()=> {toggleCartItemQuantity(item._id, 'inc')}} >
                              <AiOutlinePlus />
                            </span>
                        </p>                 
                  </div>
                      <button
                         type='button'
                         className='remove-item'
                         onClick={()=> onRemove(item)}
                      >
                        <TiDeleteOutline />
                      </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal: </h3>
                <h3>₹{totalPrice}</h3>
            </div>
            <div className="btn-container">
             
             <form action="/api/checkout_sessions" method="POST">
                <button type='submit' className='btn' role="link">
                 Pay with Stripe
                </button>

             </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart