import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.length === 0 && (
          <p className="text-gray-500">No recent orders found.</p>
        )}

        {orders.map((order, index) => (
          <div
            key={order._id || index}
            className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 max-w-4xl rounded-md border border-gray-300"
          >
            {/* Order Items */}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order?.items?.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <p className="font-medium">
                        {item?.product?.name || "Unknown Product"}{" "}
                        <span className="text-primary">
                          x {item?.quantity || 0}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="text-sm md:text-base text-black/60">
              <p className="font-medium/80">
                {order?.address?.firstName || "N/A"}{" "}
                {order?.address?.lastName || ""}
              </p>
              <p>
                {order?.address?.street || ""} {order?.address?.city || ""}
              </p>
              <p>
                {order?.address?.state || ""} {order?.address?.zipcode || ""}{" "}
                {order?.address?.country || ""}
              </p>
              <p>{order?.address?.phone || ""}</p>
            </div>

            {/* Amount */}
            <p className="font-medium text-lg my-auto md:text-base text-black/60">
              {currency} {order?.amount || 0}
            </p>

            {/* Order Details */}
            <div className="flex flex-col text-sm">
              <p>Method: {order?.paymentType || "N/A"}</p>
              <p>
                Date:{" "}
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>Payment: {order?.isPaid ? "Paid" : "Pending"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
