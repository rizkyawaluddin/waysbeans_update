import { useEffect, useContext, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

import { UserContext } from "../context/UserContext";
import Navbar from "../components/navbar/Navbar";
import Bin from '../assets/img/bin.svg'
import Plus from '../assets/img/plus.svg'
import Minus from '../assets/img/minus.svg'
// import RectangleCart from "../assets/img/RectangleTransaction.png"
import Rp from 'rupiah-format'

import { API } from "../config/api";

export default function Cart() {
    const [state, dispatch] = useContext(UserContext);
    const [carts, setCarts] = useState([])
    const [transaction, setTransaction] = useState([])
     console.log(transaction);
    
    const [showTrans, setShowTrans] = useState(false);

    const handleClose = () => setShowTrans(false);
    let navigate = useNavigate();

    const handleClickplus = async (qty, id, price) => {
        // Counter state is incremented
        const config = {
            headers: {
                "Content-type": "application/json",
            },
            };
            const newQty = qty + 1;
            const newTotal = price * newQty;
            const req = JSON.stringify({
            qty: newQty,
            sub_amount: newTotal,
            });
            await API.patch(`/cart/${id}`, req, config)
            const response = await API.get("/carts-id");
            setCarts(response.data.data)
        };

        const handleClickmin = async (id, qty, price, sub_amount) => {
            const config = {
            headers: {
                "Content-type": "application/json",
            },
            };
            console.log(sub_amount);
            console.log(price);
            // Counter state is decremented
            if (qty === 1) {
            return;
            }
            const newQty = qty - 1;
            const newTotal = sub_amount - price * newQty;
            console.log(newTotal);
            const req = JSON.stringify({
            qty: newQty,
            sub_amount: newTotal * newQty,
            });
            await API.patch(`/cart/${id}`, req, config)
            const response = await API.get("/carts-id");
            setCarts(response.data.data)

        };
      
    let resultTotal = carts?.reduce((a, b) => {
        return a + b.product.price * b.qty
      }, 0);
      console.log(resultTotal)
    
      let qtyTotal = carts?.reduce((a, b) => {
        return a + b.qty;
      }, 0);
      console.log(resultTotal)

      const handleSubmit = useMutation(async (e) => {
        try {
           const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        // Insert transaction data
        const body = JSON.stringify({
            Total : resultTotal
          })
          const respons = await API.post("/transaction", body, config);
        const idTrans = respons.data.data.id
        console.log(idTrans);
    
        
    
          const snap = await API.get(`/snap/${idTrans}`)
          const token = snap.data.data.token;
    
          window.snap.pay(token, {
          onSuccess: function (result) {
            /* You may add your own implementation here */
            for (let i = 0; i < carts.length; i++) {
            API.patch(`/carttrans/${carts[i].id}`, { "transaction_id": idTrans }, config)
          }
    
          for (let a = 0; a < carts.length; a++) {
            API.patch(`/stock/${carts[a].product_id}`, { "stock": carts[a].stockproduct }, config)
          }
            console.log(result);
            navigate("/profile");
          },
          onPending: function (result) {
            /* You may add your own implementation here */
            console.log(result);
            navigate("/profile");
          },
          onError: function (result) {
            /* You may add your own implementation here */
            console.log(result);
          },
          onClose: function () {
            /* You may add your own implementation here */
            alert("you closed the popup without finishing the payment");
          },
        });
          
        } catch (error) {
          console.log(error);
        }
      });
      
    
      useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "SB-Mid-client-E5TTsPupSznAjEa7";
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        };
      }, []);
    

    return (
        <div>
            <Navbar/>
            <Container className='pt-5 mt-5'>
                <div className='mb-0'>
                <h2 className="colorPrimary fw-bold mb-3">MY CART</h2>
                <h5 className="colorPrimary mb-0">Review Your Order</h5>
                </div>
                <Row className='mt-5'>
                <Col xs={12} md={7}>
                    <div>
                    <div className='cartlist py-4'>
                        <Row>
                        <div>
                        {transaction?.carts.map((item, index) => (
                            <div className='d-flex mb-2' style={{width:'100%'}}>
                                <img src={"http://localhost:5000/uploads/" + item.product?.image} alt='productimage' style={{width:'20%'}} />
                                <div className="d-flex justify-content-between" style={{width:'100%'}}>
                                        <div className='detailcartlist ps-3'>
                                            <p className='fw-semibold mb-3 colorPrimary' style={{fontSize:'22px'}}>{item.product.name}</p>
                                        <div className='counter'>
                                            <img src={Minus} alt="minus" onClick={() =>
                                                handleClickplus(
                                                    item.id,
                                                    item.qty,
                                                    item.product.price,
                                                    item.sub_amount
                                                ) }/>
                                        <p className='mb-0 px-2 py-1 ms-2 fs-5 fw-bold' style={{backgroundColor:'#F6E6DA', width:'fit-content', borderRadius:'5px' }}>{item?.qty}</p>
                                            <img src={Plus} alt="plus" className='ms-2' onClick={() => handleClickmin(item.qty, item.id, item.product.price)} />
                                        </div>
                                        </div>
                                    <div className='flexcolend'>
                                        <p className='fs-5 mb-4 text-end colorSecondary'>{Rp.convert(item.product.price)}</p>
                                        <img src={Bin} alt='trash' />
                                    </div>
                                </div>
                            </div>
                            ))}
                            
                        </div>
                        </Row>
                    </div>
                    </div>
                </Col>
                
                <Col xs={12} md={5}>
                    <div className='cartlist py-4 between'>
                    <div>
                        <p className="colorSecondary">Subtotal</p>
                        <p className="colorSecondary">Qty</p>
                    </div>
                    <div className='flexcolend'>
                    <p className="colorSecondary">{Rp.convert(resultTotal)}</p>
                    <p className="colorSecondary">{qtyTotal}</p>
                    </div>
                    </div>
                    <div className='pt-4 between fw-bold mb-3'>
                    <p className="colorSecondary fw-semibold">Total:</p>
                    <p className="colorSecondary fw-semibold">{Rp.convert(resultTotal)}</p>
                    </div>
                    <button className='btnAddToCart' style={{width:'100%'}} onClick={(e) => handleSubmit.mutate(e)}>Pay</button>
                </Col>
                </Row>
            </Container>
            </div>
        );
}