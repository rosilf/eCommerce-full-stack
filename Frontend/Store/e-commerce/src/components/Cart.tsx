import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { CartItem } from "./CartItem";
import { CartOrderSummary } from "./CartOrderSummary";
import { useEffect, useState } from "react";
import axios from "axios";
import { CartItem as Item } from "../utils/types";
import { gw } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { Link as ReachLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { fetchCart } from "../redux/cart/cart.actions";

export function formatPrice(
  value: number,
  opts: { locale?: string; currency?: string } = {}
) {
  const { locale = "en-US", currency = "USD" } = opts;
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

export const Cart = () => {
  const username = useSelector((state: any) => state.user.username);
  //   const items: Item[] = useSelector((state: any) => state.items.items);
  const [cartItems, setcartItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  //   const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!username) navigate("/login");
    axios
      .get(gw + "cart/" + username, {
        withCredentials: true,
      })
      .then((response) => setcartItems(response.data))
      .catch((error) => console.log(error.response?.data.message));
  }, []);
  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price;
    });
    setTotal(total);
  }, [cartItems]);
  //   useEffect(() => {
  //     fetchCart()(dispatch);
  //   }, [dispatch]);

  return (
    <Box
      maxW={{ base: "3xl", lg: "7xl" }}
      mx="auto"
      px={{ base: "4", md: "8", lg: "12" }}
      py={{ base: "6", md: "8", lg: "12" }}
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        align={{ lg: "flex-start" }}
        spacing={{ base: "8", md: "16" }}
      >
        <Stack spacing={{ base: "8", md: "10" }} flex="2">
          <Heading fontSize="2xl" fontWeight="extrabold">
            Shopping Cart ({cartItems.length} items)
          </Heading>

          <Stack spacing="6">
            {cartItems.map((item) => (
              <CartItem cartPage={true} key={item.product} {...item} />
            ))}
          </Stack>
        </Stack>

        <Flex direction="column" align="center" flex="1">
          <CartOrderSummary total={total} cartItems={cartItems} />
          <HStack mt="6" fontWeight="semibold">
            <p>or</p>
            <ReachLink to="/products/">
              <Link color={mode("blue.500", "blue.200")}>
                Continue shopping
              </Link>
            </ReachLink>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
};
