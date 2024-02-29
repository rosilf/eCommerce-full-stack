import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
} from "@chakra-ui/react";
import { Item, StoreState } from "../utils/types";
import { Link as ReachLink } from "react-router-dom";
import { selectItem } from "../redux/items/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  SetSelectedProduct,
} from "../redux/products/products.action";
import { getProductFromProducts } from "../redux/products/products.utils";
import axios from "axios";
import { gw } from "../utils/api";

export interface ProductCardProps {
  item: Item;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
}: ProductCardProps) => {
  const { id, image, name, category, price, stock } = item;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    products: { products, selectedProduct },
  } = useSelector((state: StoreState) => state);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.target as HTMLButtonElement;
    let productToBeSelected: Item | null = item;
    // If Product is not null, i.e not inital render
    if (selectedProduct) {
      productToBeSelected = getProductFromProducts(
        productToBeSelected,
        products
      )
        ? getProductFromProducts(productToBeSelected, products)
        : item;
    }
    dispatch(SetSelectedProduct(productToBeSelected));
    if (name === "remove" && productToBeSelected) {
      let curr_id = productToBeSelected.id;
      try {
        await axios.delete(gw + "product/" + curr_id, {
          withCredentials: true,
        });
        dispatch(deleteProduct(productToBeSelected));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data.message);
        } else {
          console.log(error);
        }
      }
    } else {
      navigate(`/add-product`);
    }
  };

  return (
    // <ReachLink
    //   onClick={() => dispatch(selectItem(item))}
    //   to={`/product/${item.id}`}
    // >
    //   {/* // <Button onClick={handleClick}> */}
    <Center py={12}>
      {" "}
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${image})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={image}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            {category}
          </Text>
          <Heading fontSize={"2x1"} fontFamily={"body"} fontWeight={500}>
            {name}
          </Heading>
          <Heading fontSize={"l"} fontFamily={"body"} fontWeight={300}>
            {id}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={500} fontSize={"xl"}>
              ${price}
            </Text>
          </Stack>
          <Heading fontSize={"l"} fontFamily={"body"} fontWeight={300}>
            stock - {stock}
          </Heading>
          <Stack direction={"row"} align={"center"}>
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
              name="update"
            >
              Update
            </Button>
          </Stack>
          <Stack direction={"row"} align={"center"}>
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
              name="remove"
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Center>
    // {/* // </Button> */}
    // </ReachLink>
  );
};

export default ProductCard;
