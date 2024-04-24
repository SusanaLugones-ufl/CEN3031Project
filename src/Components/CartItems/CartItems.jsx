import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

export const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const handlePromoSubmit = () => {
        if (promoCode === 'SAVE10') {
            setDiscount(0.10); 
        } else {
            setDiscount(0); 
            alert("Invalid promo code"); 
        }
        setPromoCode('');
    };

    const calculateTotal = () => {
        const totalAmount = getTotalCartAmount();
        return totalAmount * (1 - discount);
    };

    const totalAmount = getTotalCartAmount();
    const discountedTotal = calculateTotal();

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className='carticon-product-icon'/>
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>${e.new_price * cartItems[e.id]}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => removeFromCart(e.id)} alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${totalAmount.toFixed(2)}</p>
                        </div>
                        <hr />
                        {discount > 0 && (
                            <div className="cartitems-total-item">
                                <p>Discounted Subtotal</p>
                                <p>${discountedTotal.toFixed(2)}</p>
                            </div>
                        )}
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${discountedTotal.toFixed(2)}</h3>
                        </div>
                    </div>
                    <button>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='promo code' value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                        <button onClick={handlePromoSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
