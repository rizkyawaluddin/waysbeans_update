import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { UserContext } from '../context/UserContext';

import { Container, Row, Col, Button } from "react-bootstrap"
import Navbar from "../components/navbar/Navbar"
// import { useQuery } from "react-query";
import Rp from 'rupiah-format'
import { API } from "../config/api";

export default function DetailProduct(){
    const [addCart, setAddCart] = useState(null);
    console.log(addCart);
  
    const [state] = useContext(UserContext)
    let navigate = useNavigate()
    
    const UserID = state.user.id
    console.log(UserID)
    const { id } = useParams();
  
    const [dataproduct, setDataproduct] = useState([]);
  
    const [check, setCheck] = useState([])
  
    
  
    
  
    // const sum = prices.reduce((prev, next) => prev + next, 0);
    // setTotal(sum);
    // console.log(total);
  
    
  
    const response = dataproduct;
    console.log(response);
  
    useEffect(() => {
      const data = async () => {
        try {
          const response = await API.get("/carts-id");
  
          setCheck(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };
      data();
    }, [setCheck]);
    console.log(check);
  
   const idCart = new Array(check);
   console.log(idCart);
    
      useEffect(() => {
      const dataproduct = async () => {
        try {
          const response = await API.get("/product/" + id)
  
          setDataproduct(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };
      dataproduct();
    }, [setDataproduct]);
  
    
    
    
  
    // const handleOnChange = (position) => {
    //   const updatedCheckedState = checkedState.map((item, index) =>
    //     index === position ? !item : item
    //   );
  
    //  setCheckedState(updatedCheckedState);
  
    //
  
  
    const handleSubmit = useMutation(async (e) => {
      try {
        e.preventDefault();
  
        const config = {
          Headers: {
            "Content-type": "application/json"
          },
        };
        const body = JSON.stringify({
          
          Product_ID : parseInt(id),
        })
  
        const response = await API.post("/cart", body, config);
        console.log(body);
        console.log(response);
        navigate("/cart")
        
        
      } catch (error) {
        console.log(error);
      }
    })
  


    // const moving = useNavigate()
    // const moveToDetailProduct = (id) => {
    //     moving('/detail-product/' + id)
    // }

    return(
        <>
        <Navbar/>
        <Container>
            <Row className="colContainer d-flex align-items-center">
                <Col>
                    <img src={response?.image} alt="coffee" className='img-detail-product shadow-lg' />
                </Col>
                <Col>
                    <h1 className="detailProductName">{response?.name}</h1>
                    <p className="detailProductStock">Stock: {response?.stock}</p>
                    <p className="mb-4">{response?.desc}</p>
                    <h3 className="detailProductPrice">{Rp.convert(response?.price)}</h3>
                    <button  className="btnAddToCart" onClick={(e) => handleSubmit.mutate(e) }>
                    {" "}
                    Add Cart
                </button>
                </Col>
            </Row>
        </Container>
        </>
    )
}