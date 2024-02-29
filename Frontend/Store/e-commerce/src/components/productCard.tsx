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
import { Item } from "../utils/types";
import { Link as ReachLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectItem } from "../redux/items/action";

export interface ProductCardProps {
  item: Item;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
}: ProductCardProps) => {
  const { image, name, category, price } = item;
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(selectItem(item));
    navigate(`/products/${item?.id}`);
  };

  return (
    // <ReachLink
    //   onClick={() => dispatch(selectItem(item))}
    //   to={`/product/${item.id}`}
    // >
    //   {/* // <Button onClick={handleClick}> */}
    <Center py={12} onClick={handleClick}>
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
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            {name}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={800} fontSize={"xl"}>
              ${price}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
    // {/* // </Button> */}
    // </ReachLink>
  );
};

export default ProductCard;
