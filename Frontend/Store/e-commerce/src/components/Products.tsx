import logo from "./logo.svg";
import { HashRouter as Router } from "react-router-dom";
import { Route, Routes, useLocation } from "react-router-dom";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { Item } from "../utils/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { gw } from "../utils/api";

const Products = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [clickedItem, setClickedItem] = useState<Item | undefined>();
  useEffect(() => {
    console.log(gw);
    axios
      .get(gw + "product/", { withCredentials: true })
      .then((response) => setItems(response.data))
      .catch((error) => console.log(error.response?.data.message));
  }, []);
  return (
    <Box>
      <SimpleGrid spacing={10} minChildWidth="200px">
        {items.map((item: Item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Products;
