import { Box, Heading, Text, Button } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, pink.300, pink.400)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you're looking for does not seem to exist
      </Text>

      <Button
        colorScheme="pink"
        bgGradient="linear(to-r, pink.400, pink.300, pink.400)"
        color="white"
        variant="solid"
      >
        Go to Home
      </Button>
    </Box>
  );
}
