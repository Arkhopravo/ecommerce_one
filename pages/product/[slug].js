import React,{useState, useEffect, useRef} from 'react'
import { client, urlFor } from '../../lib/client'
import {AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar, AiFillEnvironment, AiOutlineWhatsApp, AiFillFacebook, AiFillTwitterCircle, AiTwotoneMail, AiFillCopy} from 'react-icons/ai'
import { Product } from '../../components';
import {useStateContext} from '../../context/StateContext'
import Link from 'next/link'
import { BsFillShareFill } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const ProductDetails = ({products, product}) => {

    const {image, name, details, price}  = product;
    const [index, setIndex] = useState(0);
    const { decQty, incQty, qty, onAdd,setShowCart } = useStateContext();
    const [now, setNow] = useState(new Date());
      useEffect(() => {
          setNow(new Date());
      },[])
     
    console.log("product", product);
  const handleBuyNow = () => {
    onAdd(product, qty);

    setShowCart(true);
  }

  
  return (
    <div>
        <div 
           className='product-detail-container'
        >
            <div>
                <div
                   className='image-container'
                >
                    <img src={urlFor(image && image[index])} className="product-detail-image" />
                </div>
                <div className='small-images-container'>

                    {image?.map((item, i) => (
                        <img key={i}
                        src={urlFor(item)}
                        className={i === index ? 'small-image selected-image':'small-image'}
                        onMouseEnter={() => setIndex(i)}
                        />
                        ))}
                        </div>

                 </div>
                <div className='product-detail-desc'>
                    <h1>{name}</h1>
                         {/* <Link href="/"><button type='button' className='quantity-desc'> */} <div className='popup'>
                         <Popup trigger={<button type='button'  style={{border:"25px",padding:"20px", borderRadius:"40px", }}> < BsFillShareFill style={{height:"40px", width:"25px"}}/> </button>} 
                         
                                     position="right center">
                                      <div className='quantity'>
                                      <div className="share-icon">Share</div>
                                      </div>
                                      <a href="https://api.whatsapp.com/send">
                                         <button type='button' style={{borderRadius:"12px", borderStyle:"none"}}>
                                            <AiOutlineWhatsApp style={{color: 'green', fontSize: '30px'}}/>
                                        </button>
                                    </a>
                                      <a href ="https://www.facebook.com">
                                      <button type='button' style={{borderRadius:"12px", borderStyle:"none"}} >
                                        <AiFillFacebook style={{color: "#0524b1", fontSize: '30px'}}/>
                                    </button>
                                      </a>
                                      <a href ="https://twitter.com/">
                                        
                                     <button type='button' style={{borderRadius:"12px", borderStyle:"none"}} > <AiFillTwitterCircle style={{color: "#206ddf", fontSize: '30px'}}/></button>
                                      </a>
                                      <a href="https://mail.google.com">

                                     <button type='button' style={{borderRadius:"12px", borderStyle:"none"}} > <AiTwotoneMail style={{color: "rgb(221, 75, 57)", fontSize: '30px'}} /></button>
                                      </a>
                                      
                                        <input type="" placeholder="Copy the link"/>
                                        <button type="button" style={{}}><AiFillCopy /></button>


                                      
                                    </Popup> </div>
                         {/* </button></Link> */}
                    <div className='reviews'>
                        <div>
                            <AiFillStar/>
                            <AiFillStar/>                            
                            <AiFillStar/>
                            <AiFillStar/>
                            <AiOutlineStar/>
                        </div>
                        <p>(20)</p>
                    </div>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    
                    <h4 style={{color:"red", fontFamily:"console"}}>Great Indian Festival</h4>
                    <p className='price'>₹{price}</p>
                    <p>M.R.P. 
                        <h3 style={{textDecoration:"line-through"}}> ₹4999</h3>
                    </p>
                    <div>{now.getDate()}/{now.getMonth()+1}/{now.getFullYear()}</div>
                    <div>
                        <h3>Inclusive of all taxes</h3>
                        <h3> EMI starts at ₹358. No Cost EMI available EMI</h3>
                        <h2>In stock.</h2><p>
                            Sold by Appario Retail Private Ltd and Fulfilled by APS Electronics Store.</p> 
                        </div>
                        <div className='share'> <a href='https://www.google.com/maps'><AiFillEnvironment />
                           <h style={{ textDecoration: 'underline'}}>Select Delivery Location</h></a>
                        </div>
                    <div className='quantity'>
                        
                        <h3>Quantity:</h3>
                        <p className='quantity-desc'>
                            <span className='minus' onClick={decQty}  >
                               <AiOutlineMinus />
                            </span>
                            <span className='num'>{qty}</span>
                            <span className='plus' onClick= {incQty}  >
                              <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className='buttons'>
                        <button type="button"
                        className='add-to-cart' onClick={() => onAdd(product, qty)}>Add to Cart</button>
                          <button type="button"
                        className='buy-now' onClick={handleBuyNow}>Buy Now</button>
                    </div>
            </div>
        </div>
        <div
          className='maylike-products-wrapper'
        >
            <h2>You may also like</h2>
            <div className='marquee'>
                <div className='maylike-products-container track'>
                    
                    {products.map((item)=>(
                        <Product key={item._id} 
                        product={item} />
                    ))} 
                    
                   
                </div>
              </div>
        </div>
    </div>
  )
}




export const getStaticProps = async ({params:{ slug }}) => {
    
    const query = `*[_type == "product" && slug.current == '${slug}' ][0] `
    const productQuery = '*[_type == "product"]'
    const product = await client.fetch(query)
    const products = await client.fetch(productQuery);
  
    return {
      props: {
        products, product
      },
    }
  }
  
  export const getStaticPaths = async () => {
    const query = `*[_type == "product"]{
        slug {
            current
        }
    }`

    const products = await client.fetch(query);

    const paths = products.map((product)=>({

        params: {
            slug: product.slug.current
        }
    }))

    return  {
        paths,
        fallback: 'blocking'
    }
}


export default ProductDetails