import React, { useEffect, useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as Token from "../../Functions/token"
import "../../style/admin_alluser.css"
function AdminAllUser(){
    const navigate = useNavigate()
    const [state,setState] = useState({
        id:"",
        name:""
    })
    const [data , setData ] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        if(!Token.isTokenExist()){
            navigate("/")
        }
        if(Token.isTokenExpired()){
            navigate("/")
        }
        const decode = jwtDecode(Token.getToken())
        setState({
            id:decode.id,
            name:decode.name
        })
    },[navigate])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const postData = {
                    adminId : state.id
                }
                const config = {
                    headers: Token.getAuthorizationHeader()
                }
                const res = await Axios.post("http://localhost:8080/api/admin/getAllUsers", postData , config);
                if(res.data.status){
                    setData(res.data.data)
                } else {
                   alert(res.data.error)
                }
            } catch (error) {
                console.error("Error:", error);
            } finally{
                setLoading(false)
            }
        }

        if(state.id){
            fetchData();
        }

    },[state.id,navigate])

    const renderData = () => {
        if (data.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="admin_alluser_message">No Users Available</td>
                </tr>
            );
        }
        return data.map((item, index) => (
            <React.Fragment key={index}>
                    <tr className="admin_alluser_table_body_row">
                        <td className="admin_alluser_table_body_col">{item.id}</td>
                        <td className="admin_alluser_table_body_col">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</td>
                        <td className="admin_alluser_table_body_col">{item.accountNumber}</td>
                        <td className="admin_alluser_table_body_col">{item.created_at}</td>
                        <td className="admin_alluser_table_body_col">{item.is_active ? "Active" : "Blocked"}</td>
                        <td className="admin_alluser_table_body_col">{item.is_active ? 
                        <input type="button" value="Block" onClick={()=>handleBlock(item.id)} className="admin_alluser_button_block"/>
                        : 
                        <input type="button" value="Unblock" onClick={()=>{handleUnblock(item.id)}} className="admin_alluser_button_unblock"/>
                        }</td>
                    </tr>
            </React.Fragment>
        ));
    };

    function handleBlock(id){
        const fetchData = async () => {
            try {
                const postData = {
                    adminId : state.id,
                    userId : id
                }
                const config = {
                    headers: Token.getAuthorizationHeader()
                }
                const res = await Axios.post("http://localhost:8080/api/admin/block", postData , config);
                if(res.data.status){
                    window.location.reload()
                } else {
                   alert(res.data.error)
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

         fetchData();

    }
    function handleUnblock(id){
        const fetchData = async () => {
            try {
                const postData = {
                    adminId : state.id,
                    userId : id
                }
                const config = {
                    headers: Token.getAuthorizationHeader()
                }
                const res = await Axios.post("http://localhost:8080/api/admin/unblock", postData , config);
                if(res.data.status){
                    window.location.reload()
                } else {
                   alert(res.data.error)
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

         fetchData();

    }
    return(
        <div className="admin_alluser_container">
            <h3 className="admin_alluser_heading">All Users</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="admin_alluser_table">
                    <thead>
                        <tr className="admin_alluser_table_head_row">
                            <th className="admin_alluser_table_head_col">Id</th>
                            <th className="admin_alluser_table_head_col">Name</th>
                            <th className="admin_alluser_table_head_col">Account Number</th>
                            <th className="admin_alluser_table_head_col">Created At</th>
                            <th className="admin_alluser_table_head_col">Status</th>
                            <th className="admin_alluser_table_head_col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderData()}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AdminAllUser;