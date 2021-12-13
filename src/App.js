import {useState ,useEffect} from "react";
import {Link, useHistory} from "react-router-dom" ;
import './App.css';
const axios = require ('axios') ;
axios.defaults.baseURL = 'http://localhost:5000';


function App() {
  const getTokenFromLocalStorage = ()=> {
    let token = localStorage.getItem("jwtAuthToken");
    if(token) {
      return JSON.parse(token) ;
    }
    return "" ;
  }
  const getEmailFromLocalStorage = ()=> {
    let token = localStorage.getItem("jwtAuthEmail");
    if(token) {
      return JSON.parse(token) ;
    }
    return "" ;
  }
  const [email,setEmail] = useState("") ;
  const [password,setPassword] = useState("") ;
  const [message , setMessage] = useState("Log in  to show more details") ;
  const [token ,setToken] = useState(()=>getTokenFromLocalStorage()) ;
  const [infos , setInfos] = useState({});

  console.log(token)
  const handleSubmit = async (e)=> {
    e.preventDefault();
    try{
      const response =  await axios.post("/api/auth/login" , {
        email:email,
        password:password,

      }) ;
      localStorage.setItem("jwtAuthEmail" , JSON.stringify(email));

      setMessage("logged In successfully")
      setToken(response.data)
      localStorage.setItem("jwtAuthToken" , JSON.stringify(response.data));
    }catch (e) {
      setMessage("error while logging in")
    }
  }
  const handleLogout =()=> {
    localStorage.setItem("jwtAuthToken" , JSON.stringify(""));
    localStorage.setItem("jwtAuthEmail" , JSON.stringify(""));
    setInfos({})
    setEmail("")
    setPassword("")
    setMessage("Log in  to show more details")
    setToken(()=>getTokenFromLocalStorage())
  }
 const getUserDetails =async ()=> {
    if(token) {
      const mail = email || getEmailFromLocalStorage();
      try{
        const response =  await axios({
          method : "get" ,
            url:`/api/user/details/${mail}` ,
          headers : {"token" :token}
        })
        setInfos(response.data)
        setMessage("you are already logged In")
      }catch (e) {
        console.log(e)
      }
    }
  }
  useEffect(async()=>{
   await getUserDetails()
  } , [token])

  console.log(infos)
  if(infos===undefined || Object.keys(infos).length==0 && infos.constructor===Object) {
    return (
        <>
          <h1> {message}</h1>
          <form  onSubmit={handleSubmit}>

            <div>
              <label> Email Address</label>
              <input required
                     type="email"
                     onChange={(e)=>setEmail(e.target.value)}
                     value={email}
              />
            </div>

            <div>
              <label> password</label>
              <input required
                     type="password"
                     onChange={(e)=>setPassword(e.target.value)}
                     value={password}
              />
            </div>
            <button >Submit</button>
          </form>
        </>
    )
  }
  return (
    <>
    <h1> {message}</h1>





          <div>
            <h4>
             email :  {infos.email}
            </h4>
            <h4>
             name:  {infos.username}
            </h4>
            <h4>
             password :  {infos.password}
            </h4>
            <h4>
              your jwt:  {infos.jwt}
            </h4>
            <h4>
              are you an admin?  {infos.isAdmin.toString()}
            </h4>
          </div>

      <button onClick={handleLogout}>logout </button>



    </>
  );
}

export default App;
