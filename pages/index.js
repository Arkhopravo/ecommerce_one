import React from 'react'
import { client } from '../lib/client'

import { Product, FooterBanner, HeroBanner} from '../components'

const Home = ({ products, bannerData}) => {
  return (
    <div>
        <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
        <div className='products-heading'>
           <h3>Best Selling Products</h3>
           <p>Speakers of many variations</p>
        </div>

        <div className='products-container'>
          {products?.map((product)=><Product key={product._id} product={product}/> )}
        </div>

        <FooterBanner footerBanner = {bannerData.length && bannerData[0] }/>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData}, // will be passed to the page component as props
  }
}
export default Home