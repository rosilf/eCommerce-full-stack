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
import { useNavigate } from "react-router-dom";
import { gw } from "../utils/api";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault(); // prevent default form submission behavior
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;
    let confirmPassword = (
      document.getElementById("confirm-password") as HTMLInputElement
    ).value;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      axios
        .post(
          gw + "signup",
          { username: username, password: password },
          { withCredentials: true }
        )
        .then(function (response) {
          console.log(response);
          console.log(username + " signed up");
          navigate(`/login`);
        })
        .catch(function (error) {
          if (axios.isAxiosError(error)) {
            alert(error.response?.data.message);
          } else {
            console.log(error);
          }
        });
    }
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
              Sign up
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
              <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input type={showCPassword ? "text" : "password"} />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowCPassword((showCPassword) => !showCPassword)
                      }
                    >
                      {showCPassword ? <ViewIcon /> : <ViewOffIcon />}
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
                  Sign up
                </Button>
              </Stack>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <ReachLink color={"blue.400"} to="/login">
                  <Link color={useColorModeValue("blue.500", "blue.200")}>
                    {" "}
                    Log in
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
