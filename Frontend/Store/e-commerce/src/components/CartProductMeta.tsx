import {
  Box,
  HStack,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { FiGift } from "react-icons/fi";

export type CartProductMetaProps = {
  isGiftWrapping?: boolean;
  name: string;
};

export const CartProductMeta = (props: CartProductMetaProps) => {
  const { name } = props;
  return (
    <Stack direction="row" spacing="5" width="full">
      <Box pt="4">
        <Stack spacing="0.5">
          <Text fontWeight="medium">{name}</Text>
        </Stack>
      </Box>
    </Stack>
  );
};
