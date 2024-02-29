import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  HStack,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  Input,
  VisuallyHidden,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { Item } from "../utils/types";
import { useSelector } from "react-redux";
import { useNumberInput, NumberInput } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { gw } from "../utils/api";

export default function ProductInfo() {
  const username = useSelector((state: any) => state.user.username);
  const item = useSelector((state: any) => state.items.selectedItem);
  const { image, name, price, category, description, stock } = item;
  const navigate = useNavigate();

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value,
  } = useNumberInput({
    defaultValue: 1,
    min: 1,
    max: stock,
    precision: 0,
  });
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const addToCart = async () => {
    if (!username) {
      navigate("/login");
    } else {
      try {
        await axios.put(
          gw + "cart/" + username,
          {
            id: item.id,
            quantity: value,
          },
          { withCredentials: true }
        );
        console.log("add to cart");
        navigate("/cart");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data.message);
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={image}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {name}
            </Heading>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={300}
              fontSize={"2xl"}
            >
              ${price}
            </Text>
            <Text
              color={useColorModeValue("gray.900", "gray.400")}
              fontWeight={100}
              fontSize={"2xl"}
            >
              {category}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.200", "gray.600")}
              />
            }
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text
                color={useColorModeValue("gray.500", "gray.400")}
                fontSize={"2xl"}
                fontWeight={"300"}
              >
                product description
              </Text>
              <Text fontSize={"lg"}>{description}</Text>
            </VStack>
          </Stack>

          <HStack maxW="320px">
            <Button {...inc}>+</Button>
            <Input {...input} />
            <Button {...dec}>-</Button>
          </HStack>

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
            onClick={addToCart}
          >
            Add to cart
          </Button>

          <Stack direction="row" alignItems="center" justifyContent={"center"}>
            <MdLocalShipping />
            <Text>2-3 business days delivery</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
