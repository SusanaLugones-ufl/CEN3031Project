import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

// Item component to display a single product, only image, name and price
export const Item = (props) => {
  return (
    <div className='item'>
        <Link to={`/producttest/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.image} alt=""/>
        <p>{props.name}</p>
        <div className="item-prices">
            <div className="item-price-new">
                ${props.new_price}
            </div>
        </div>
        </Link>
    </div>
  )
}

export default Item