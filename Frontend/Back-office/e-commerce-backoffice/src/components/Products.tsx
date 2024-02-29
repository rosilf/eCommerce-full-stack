import { Box, Button, Text, SimpleGrid, Stack } from "@chakra-ui/react";
import { Item, StoreState } from "../utils/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { gw } from "../utils/api";
import { fetchProducts } from "../redux/products/products.reducer";
import { useDispatch, useSelector } from "react-redux";
import { SetSelectedProduct } from "../redux/products/products.action";
import { useNavigate } from "react-router-dom";

const Products = () => {
  // const [items, setItems] = useState<Item[]>([]);
  // useEffect(() => {
  //   console.log(gw);
  //   axios
  //     .get(gw + "product/", { withCredentials: true })
  //     .then((response) => setItems(response.data))
  //     .catch((error) => console.log(error.response?.data.message));
  // }, []);
  const navigate = useNavigate();
  const products: Item[] = useSelector(
    (state: StoreState) => state.products.products
  );
  const dispatch = useDispatch();
  useEffect(() => {
    fetchProducts()(dispatch);
  }, [dispatch]);
  return (
    <Box>
      <Stack align={"center"}>
        <SimpleGrid spacing={2} mt={3}>
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
            onClick={() => {
              dispatch(SetSelectedProduct(null));
              navigate("/add-product");
            }}
          >
            add new producst
          </Button>
        </SimpleGrid>
      </Stack>
      <SimpleGrid spacing={10} minChildWidth="200px">
        {products.map((item: Item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Products;
