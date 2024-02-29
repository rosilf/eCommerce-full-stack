import { Box, Button, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { changeOrderStatus } from "../redux/orders/order.action";
import { Order } from "../utils/types";
import axios from "axios";
import { gw } from "../utils/api";

type OrderItemProps = {
  order: Order;
};
const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    try {
      axios.put(
        gw + "order/" + order.orderId,
        {
          status: "delivered",
        },
        {
          withCredentials: true,
        }
      );
      dispatch(changeOrderStatus(order.orderId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message);
      } else {
        console.log(error);
      }
    }
  };
  return (
    <Box
      rounded={"lg"}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"lg"}
      p={8}
    >
      <div className="order-infocontainer">
        <div className="order-id"> order ID - {order.orderId}</div>
        <div className="customer-id"> customer - {order.customerId}</div>
        <div className="order-address"> address - {order.address}</div>
      </div>
      <div className="order-status">
        <div>
          <div className="order-status-title">
            status - <span>{order.status.toUpperCase()}</span>
          </div>
        </div>
        {order.status.toLowerCase() !== "delivered" && (
          <div className="button-container">
            <Button
              as={"a"}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              _hover={{
                bg: "pink.300",
              }}
              onClick={handleClick}
            >
              Mark as Delivered
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
};

export default OrderItem;
