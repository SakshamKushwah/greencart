import { createContext , useContext ,useEffect,useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import axios from 'axios';

axios.defaults.withCredentials =  true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();


export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller , setIsSeller] = useState(false);
    const [showUserLogin , setShowUserLogin] = useState(false)
    const [products , setProducts] = useState([]) 
    
    const [cartItems , setCartItems] = useState({}) 
    const [searchQuery , setSearchQuery] = useState({}) 

    //fetch seller stauts
    const fetchSeller = async ()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    //fetch user auth status , user Data and cart items
    const fetchUser = async ()=>{
        try {
            const { data } = await axios.get('api/user/is-auth')
            if (data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }

    //featch all products 
    const fetchProducts = async ()=>{
        try {
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //add product to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Add to Cart")
    }

    //update cart item quantity
    const updateCartItem = (itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("Cart Updated")
    }
    //remove item from cart
    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Remove From Cart")
        setCartItems(cartData);
    }

    // get Cart item count
    const getCartCount = ()=>{
        let totalcount = 0;
        for(const item in cartItems){
            totalcount += cartItems[item];
        }
        return totalcount;
    }

    //get cart total amount 
    const getCartAmount = () =>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;   
    }

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[]) 


//update database cart items
useEffect(() => {
            const updateCart = async () => {
                try {
                    const { data } = await axios.post(
                        '/api/cart/update',
                        { cartItems },
                        { withCredentials: true } // ✅ this is critical
                    );
            
                    if (!data.success) {
                        toast.error(data.message);
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            };

    if (user) {
        updateCart();
    }
}, [cartItems]);



    const value = { navigate , user, setUser , setIsSeller , isSeller
        , setShowUserLogin , showUserLogin , products , currency , addToCart ,
        updateCartItem, removeFromCart ,cartItems ,searchQuery , setSearchQuery ,
        getCartCount , getCartAmount , axios , fetchProducts , setCartItems
    }

    return <AppContext.Provider value={value}>
            {children}
          </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}