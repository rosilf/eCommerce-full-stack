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
import { Formik } from "formik";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link as ReachLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogIn } from "../redux/user/action";
import { useNavigate } from "react-router-dom";
import { gw } from "../utils/api";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault(); // prevent default form submission behavior
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;

    axios
      .post(
        gw + "login",
        { username: username, password: password },
        { withCredentials: true }
      )
      .then(function (response) {
        console.log(response);
        console.log(username + " logged in");
        dispatch(userLogIn(username));
        navigate(`/products/`);
      })
      .catch(function (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data.message);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Log in
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool features ✌️
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
                  <FormControl id="username" isRequired>
                    <FormLabel>username</FormLabel>
                    <Input type="text" />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? "text" : "password"} />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
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
                  Log in
                </Button>
              </Stack>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                new here?{" "}
                <ReachLink color={"blue.400"} to="/signup">
                  <Link color={useColorModeValue("blue.500", "blue.200")}>
                    {" "}
                    Sign Up
                  </Link>
                </ReachLink>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
