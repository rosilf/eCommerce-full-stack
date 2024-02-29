import {
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { formatPrice } from "./PriceTag";
import { useNavigate } from "react-router-dom";
import { CartItem as Item } from "../utils/types";
import { useDispatch } from "react-redux";
import { gotoCheckout } from "../redux/order/action";


type CartOrderSummaryProps = {
  total: number;
  cartItems: Item[];
};

export const CartOrderSummary = ({
  total,
  cartItems,
}: CartOrderSummaryProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkout = () => {
    dispatch(gotoCheckout(cartItems));
    navigate("/checkout");
  };

  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Heading size="md">Order Summary</Heading>

      <Stack spacing="6">
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Total
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {formatPrice(total)}
          </Text>
        </Flex>
      </Stack>
      <Button
        colorScheme="pink"
        size="lg"
        fontSize="md"
        rightIcon={<FaArrowRight />}
        bg={"pink.400"}
        color={"white"}
        _hover={{
          bg: "pink.300",
        }}
        onClick={checkout}
      >
        Checkout
      </Button>
    </Stack>
  );
};
