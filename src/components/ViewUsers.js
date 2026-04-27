import { useEffect,useState } from "react";
import API from "../services/api";

export default function ViewUsers(){

  const [u,setU]=useState([]);

  useEffect(()=>{
    API.get("/users").then(r=>setU(r.data));
  },[]);

  return (
    <div>
      {u.map(x=>(
        <p key={x.id}>{x.name} - {x.email}</p>
      ))}
    </div>
  );
}