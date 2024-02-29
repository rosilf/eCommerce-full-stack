import { Box, Flex, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import sucsess2 from "../images/success2.jpg";
export default function Success() {
  return (
    // <SimpleGrid spacing={10} minChildWidth="200px">
    //   <Image
    //     rounded={"md"}
    //     alt={"product image"}
    //     src={sucsess2}
    //     fit={"cover"}
    //     align={"center"}
    //     w={{ base: "100%", sm: "400px", lg: "500px" }}
    //     h={"100%"}
    //   />
    <Box
      textAlign="center"
      bgImage={sucsess2}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      w="100%"
      h="100vh"
      margin={0}
    >
      <Flex
        direction="column"
        justify="flex-start"
        alignItems="center"
        h="100%"
        px={4}
        mb={2}
      >
        <CheckCircleIcon boxSize={"50px"} color={"pink.400"} mt={16} />
        <Heading as="h2" size="xl" mt={1} mb={1}>
          Thank you for your purchase!
        </Heading>
      </Flex>
    </Box>

    // </SimpleGrid>
  );
}
