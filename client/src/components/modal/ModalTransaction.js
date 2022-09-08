import {useEffect, useState} from "react";
import { useQuery } from 'react-query'
import { Modal, Col } from "react-bootstrap";
import QRCode from 'react-qr-code'
import Logo from "../../assets/img/logoNav.svg";
import CoffeeTransaction from '../../assets/img/RectangleTransaction.png'

import Rp from 'rupiah-format'
import { API } from "../../config/api";


export default function ModalTransaction({showTransaction, close, id}) {
const [transaction, serTransaction] = useState([]);

let { data: transactions } = useQuery("transCache", async () => {
    const response = await API.get("/transaction1");
    return response.data.data;
});

return (
    <Modal show={showTransaction} onHide={close}>
        <Col>
            <div>
                <div>
                <p className='fw-bold fs-2 mb-3 mt-3 ps-3' style={{color:'#613D2B'}}>My Transaction</p>
                </div>
                <div>
                {transactions?.map((items, index) => (
                        <div>
                            {items?.carts?.map((cart, idx) => (
                            <div className='p-3 between' style={{width:'100%', backgroundColor:'#F6E6DA'}}>
                                <div className='d-flex' >
                                            <img src={"http://localhost:5000/uploads/" + cart?.product?.image} alt='product' style={{width:'30%',height:'80%',borderRadius:'5px'}} />
                                            <div className='ms-3'>
                                                <h5 className='mb-0 colorPrimary fw-bold'>{cart?.product?.name}</h5>
                                                <p className='colorSecondary'><span className='colorPrimary fw-bold'>Saturday, </span> 25 agustus 2022</p>
                                                <p className='mb-0 colorSecondary'>Price : {Rp.convert(cart?.sub_amount)}</p>
                                                <p className='mb-0 colorSecondary'>Qty : 2</p>
                                                <h6 className='mb-0 colorSecondary fw-bold'>Subtotal : {Rp.convert(items?.total)}</h6>
                                            </div>
                                        </div>
                                <div className='flexcolend'>
                                    <img src={Logo} alt='product' style={{width:'50%',borderRadius:'5px'}} className='mb-2' />
                                    <img src={QRCode} alt='product' style={{width:'50%',borderRadius:'5px'}} className='mb-2' />
                                    <p className='completed px-4 py-1' style={{backgroundColor:'#613D2B', color:'white', borderRadius:'3px'}}>{items?.status}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                ))}
                </div>
            </div>
            </Col>
    </Modal>
)
}
