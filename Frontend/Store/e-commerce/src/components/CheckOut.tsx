import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  SimpleGrid,
  Container,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link as ReachLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CartItem } from "./CartItem";
import { useSelector } from "react-redux";
import { gw } from "../utils/api";
import { formatPrice } from "./PriceTag";

export default function CheckOut() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const username = useSelector((state: any) => state.user.username);
  const cartItems = useSelector((state: any) => state.order.items);
  const total = cartItems.reduce(
    (acc: number, item: any) => acc + item.price,
    0
  );
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    console.log("handleSubmit called");
    event.preventDefault(); // prevent default form submission behavior
    let address = (document.getElementById("address") as HTMLInputElement)
      .value;
    let cc = (document.getElementById("cc") as HTMLInputElement).value;
    let holder = (document.getElementById("holder") as HTMLInputElement).value;
    let cvv = (document.getElementById("cvv") as HTMLInputElement).value;
    let exp = (document.getElementById("exp") as HTMLInputElement).value;
    //create array of cartItem.product and send it to the backend
    let products: string[] = cartItems.map((item: any) => item.product);
    // create array of cartItem.quantity and send it to the backend
    let quantities = cartItems.map((item: any) => item.quantity);
    try {
      const response = await axios.post(
        gw + "order",
        {
          customerId: username,
          address: address,
          status: "pending",
          products: products,
          quantity: quantities,
          price: total,
          cc: cc,
          holder: holder,
          cvv: cvv,
          exp: exp,
        },
        { withCredentials: true }
      );
      navigate(`/success`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Container maxW={"7xl"} bg={mode("gray.50", "gray.800")}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <form onSubmit={handleSubmit}>
          <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={mode("gray.50", "gray.800")}
          >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
              <Stack align={"center"}>
                <Heading fontSize={"4xl"} textAlign={"center"}>
                  Check Out
                </Heading>
                <Text fontSize={"lg"} color={"gray.600"}>
                  one more minute and you're done 🔥
                </Text>
              </Stack>
              <Box
                rounded={"lg"}
                bg={mode("white", "gray.700")}
                boxShadow={"lg"}
                p={8}
              >
                <Stack spacing={4}>
                  <HStack>
                    <Box>
                      <FormControl id="address" isRequired>
                        <FormLabel>Shipping adrress</FormLabel>
                        <Input
                          type="text"
                          placeholder="132, My Street, Kingston, New York 12401"
                        />
                      </FormControl>
                    </Box>
                  </HStack>
                  <FormControl id="cc" isRequired>
                    <FormLabel>credit card</FormLabel>
                    <InputGroup>
                      <Input
                        type="text"
                        minLength={16}
                        maxLength={16}
                        pattern="\d*"
                        title="digits only"
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                      <InputRightElement h={"full"}></InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl id="holder" isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <InputGroup>
                      <Input
                        type="text"
                        pattern="[a-zA-Z ]+"
                        placeholder="as it appears on the card"
                      />
                      <InputRightElement h={"full"}></InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl id="cvv" isRequired>
                    <FormLabel>cvv</FormLabel>
                    <InputGroup>
                      <Input
                        type="text"
                        minLength={3}
                        maxLength={3}
                        pattern="\d*"
                        placeholder="3 digits on the back"
                      />
                      <InputRightElement h={"full"}></InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl id="exp" isRequired>
                    <FormLabel>expiration date</FormLabel>
                    <InputGroup>
                      <Input type="month" />
                      <InputRightElement h={"full"}></InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Stack spacing={10} pt={2}>
                    <Button
                      loadingText="Submitting"
                      size="lg"
                      bg={"pink.400"}
                      color={"white"}
                      _hover={{
                        bg: "pink.300",
                      }}
                      type="submit"
                    >
                      Pay
                    </Button>
                  </Stack>
                </Stack>
                <Stack pt={6}>
                  <Text align={"center"}>
                    forgot something?{" "}
                    <ReachLink color={"blue.400"} to="/products">
                      {" "}
                      <Link color={mode("blue.500", "blue.200")}>
                        continue shopping
                      </Link>
                    </ReachLink>
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        </form>
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={mode("gray.50", "gray.800")}
        >
          <Box
            rounded={"lg"}
            bg={mode("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing="6">
              {cartItems.map(
                (
                  item: JSX.IntrinsicAttributes & {
                    product: string;
                    name: string;
                    quantity: number;
                    price: number;
                  }
                ) => (
                  <CartItem cartPage={false} key={item.product} {...item} />
                )
              )}
            </Stack>
            <Flex justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">
                Total
              </Text>
              <Text fontSize="xl" fontWeight="extrabold">
                {formatPrice(total)}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </SimpleGrid>
    </Container>
  );
}
