import {
  CloseButton,
  Flex,
  Link,
  Select,
  SelectProps,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { PriceTag } from "./PriceTag";
import { CartProductMeta } from "./CartProductMeta";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { gw } from "../utils/api";
// import { RemoveItemFromCart } from "../redux/cart/cart.actions";

type CartItemProps = {
  product: string;
  name: string;
  quantity: number;
  price: number;
  cartPage: boolean;
  // onChangeQuantity?: (quantity: number) => void;
};

// const QuantitySelect = (props: SelectProps, stock: number) => {
//   const options = [];
//   for (let i = 1; i <= stock; i++) {
//     options.push(
//       <option key={i} value={i}>
//         {i}
//       </option>
//     );
//   }
//   return (
//     <Select
//       maxW="64px"
//       aria-label="Select quantity"
//       focusBorderColor={useColorModeValue("blue.500", "blue.200")}
//       {...props}
//     >
//       {options}
//     </Select>
//   );
// };

export const CartItem = (props: CartItemProps) => {
  const { product, name, quantity, price, cartPage } = props;
  const username = useSelector((state: any) => state.user.username);
  const navigate = useNavigate();

  const onClickDelete = async () => {
    try {
      await axios.delete(gw + "cart/" + username, {
        data: {
          id: product,
        },
        withCredentials: true,
      });
      console.log("delete from cart");
      alert("item deleted from cart, please refesh the page");
      // RemoveItemFromCart(product);
      navigate("/cart");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message);
      } else {
        console.log(error);
      }
    }
  };
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
    >
      <CartProductMeta name={name} />

      {/* Desktop */}
      <Flex
        width="full"
        justify="space-between"
        display={{ base: "none", md: "flex" }}
      >
        {/* <QuantitySelect
          value={quantity}
          stock={stock}
          onChange={(e) => {
            onChangeQuantity?.(+e.currentTarget.value);
          }}
        /> */}
        <Text>quantitiy: {quantity}</Text>
        <PriceTag price={price} currency="USD" />
        {cartPage && (
          <CloseButton
            aria-label={`Delete ${name} from cart`}
            onClick={onClickDelete}
          />
        )}
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{ base: "flex", md: "none" }}
      >
        <Link fontSize="sm" textDecor="underline">
          Delete
        </Link>
        {/* <QuantitySelect
          quantity={stock}
          value={quantity}
          onChange={(e) => {
            onChangeQuantity?.(+e.currentTarget.value);
          }}
        /> */}
        <PriceTag price={price} currency="USD" />
      </Flex>
    </Flex>
  );
};
