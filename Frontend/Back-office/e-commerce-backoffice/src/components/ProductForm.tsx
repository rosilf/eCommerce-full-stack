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
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link as ReachLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { gw } from "../utils/api";
import {
  addNewProduct,
  updateProduct,
} from "../redux/products/products.action";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../utils/types";

export default function ProductForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProduct, products } = useSelector(
    (state: StoreState) => state.products
  );
  const [product, setProduct] = useState(
    selectedProduct
      ? { ...selectedProduct }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          image: "",
          category: "",
        }
  );

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [image, setImage] = useState(product.image);
  const [category, setCategory] = useState(product.category);

  //   const handleSubmit = async (event: { preventDefault: () => void }) => {
  //     event.preventDefault(); // prevent default form submission behavior
  //     let username = (document.getElementById("username") as HTMLInputElement)
  //       .value;
  //     let password = (document.getElementById("password") as HTMLInputElement)
  //       .value;
  //     let confirmPassword = (
  //       document.getElementById("confirm-password") as HTMLInputElement
  //     ).value;
  //     if (password !== confirmPassword) {
  //       alert("Passwords do not match");
  //     } else {
  //       try {
  //         const response = await axios.post(gw + "signup", {
  //           username: username,
  //           password: password,
  //         });
  //         navigate(`/login`);
  //       } catch (error) {
  //         if (axios.isAxiosError(error)) {
  //           alert(error.response?.data.message);
  //         } else {
  //           console.log(error);
  //         }
  //       }
  //     }
  //   };
  //   const handleChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     console.log(e.target.value);
  //     const { name, value } = e.target;
  //     setProduct({ ...product, [name]: value });
  //   };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // let name = (document.getElementById("name") as HTMLInputElement).value;
    // let category = (document.getElementById("category") as HTMLInputElement)
    //   .value;
    // let description = (
    //   document.getElementById("description") as HTMLInputElement
    // ).value;
    // let price = Number(
    //   (document.getElementById("price") as HTMLInputElement).value
    // );
    // let stock = Number(
    //   (document.getElementById("stock") as HTMLInputElement).value
    // );
    // let image = (document.getElementById("image") as HTMLInputElement).value;
    if (selectedProduct) {
      //update product
      try {
        await axios.put(
          gw + "product/" + selectedProduct.id,
          {
            name: name,
            category: category,
            description: description,
            price: Number(price),
            stock: Number(stock),
            image: image,
          },
          { withCredentials: true }
        );
        dispatch(updateProduct({ id: selectedProduct.id, ...product }));
        navigate("/products/");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data.message);
        } else {
          console.log(error);
        }
      }
    } else {
      //add new product
      try {
        await axios.post(
          gw + "product",
          {
            name: name,
            category: category,
            description: description,
            price: price,
            stock: stock,
            image: image,
          },
          { withCredentials: true }
        );
        dispatch(addNewProduct({ ...product, id: products.length + 1 }));
        navigate("/products/");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data.message);
        } else {
          console.log(error);
        }
      }
    }
  };

  //   const { name, category, description, price, stock, image } = product;

  return (
    <form onSubmit={onSubmit}>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"3xl"} textAlign={"center"}>
              {selectedProduct ? "Update Product" : "Create New Product"}
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              ---------------------------------------------------------
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="name" isRequired>
                    <FormLabel>name</FormLabel>
                    <Input
                      type="text"
                      onChange={(event) => setName(event.target.value)}
                      value={name}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="category" isRequired>
                <FormLabel>category</FormLabel>
                <InputGroup>
                  <Input
                    type={"text"}
                    onChange={(event) => setCategory(event.target.value)}
                    value={category}
                  />
                  <InputRightElement h={"full"}></InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="description" isRequired>
                <FormLabel>description</FormLabel>
                <InputGroup>
                  <Input
                    type={"text"}
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                  />
                  <InputRightElement h={"full"}></InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="price" isRequired>
                <FormLabel>price</FormLabel>
                <InputGroup>
                  <Input
                    type={"number"}
                    onChange={(event) => setPrice(Number(event.target.value))}
                    value={price}
                  />
                  <InputRightElement h={"full"}></InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="stock" isRequired>
                <FormLabel>stock</FormLabel>
                <InputGroup>
                  <Input
                    type={"number"}
                    onChange={(event) => setStock(Number(event.target.value))}
                    value={stock}
                  />
                  <InputRightElement h={"full"}></InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="image" isRequired>
                <FormLabel>image</FormLabel>
                <InputGroup>
                  <Input
                    type={"test"}
                    onChange={(event) => setImage(event.target.value)}
                    value={image}
                  />
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
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
