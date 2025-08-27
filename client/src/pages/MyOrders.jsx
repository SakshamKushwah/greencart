import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([])
  const { currency, axios, user } = useAppContext()

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user', {
        withCredentials: true,
      })
      if (data.success) {
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyOrders()
    }
  }, [user])

  return (
    <div className="mt-16 pb-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-semibold uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full" />
      </div>

      {myOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg mb-10 p-4 md:p-6"
          >
            <p className="flex flex-col md:flex-row justify-between text-gray-500 md:font-medium mb-4 gap-2 md:gap-0">
              <span>
                OrderId: <span className="font-semibold text-gray-700">{order._id}</span>
              </span>
              <span>
                Payment: <span className="font-semibold text-gray-700">{order.paymentType}</span>
              </span>
              <span>
                Total Amount:{" "}
                <span className="font-semibold text-gray-700">
                  {currency}{Number(order.amount ?? 0).toFixed(2)}
                </span>
              </span>
            </p>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row md:items-center justify-between py-4 ${
                  idx !== order.items.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="border border-primary/10 p-2 rounded-lg">
                    {item.product.image && item.product.image.length > 0 ? (
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded" /> // Placeholder for no image
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.product.name || "Unknown Product"}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      Category: {item.product.category || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center md:ml-6 mb-4 md:mb-0 text-sm text-gray-600 min-w-[140px]">
                  <p>
                    Quantity:{" "}
                    <span className="font-semibold">{item.quantity || 1}</span>
                  </p>
                  <p>
                    Status: <span className="font-semibold">{order.status || "Pending"}</span>
                  </p>
                  <p>
                    Date:{" "}
                    <span className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                <p className="text-primary text-lg font-semibold">
                  Amount: {currency}
                  {((item.product.offerPrice || 0) * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrders
