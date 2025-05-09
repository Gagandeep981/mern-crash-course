//frontend
import {
	Box,
	Button,
	Container,
	Heading,
	Input,
	Text,
	useColorModeValue,
	useToast,
	VStack,
  } from "@chakra-ui/react";
  import { useRef, useState } from "react";
  import { useProductStore } from "../store/product";
  
  const CreatePage = () => {
	const [newProduct, setNewProduct] = useState({
	  name: "",
	  description: "",
	  price: "",
	  image: "",
	  quantity: "",
	});
  
	const fileInputRef = useRef();
	const toast = useToast();
	const { createProduct } = useProductStore();
  
	const handleAddProduct = async () => {
	  const { success, message } = await createProduct(newProduct);
	  toast({
		title: success ? "Success" : "Error",
		description: message,
		status: success ? "success" : "error",
		isClosable: true,
	  });
  
	  if (success) {
		setNewProduct({ name: "", description: "", price: "", quantity: "", image: "" });
		fileInputRef.current.value = null;
	  }
	};
  
	return (
	    <Container maxW="container.sm">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Create New Product
        </Heading>

        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
			<Input
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
			<Input
              placeholder="Quantity"
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />

            <Button onClick={() => fileInputRef.current.click()} colorScheme="blue" w="full">
              Upload Image
            </Button>

            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              display="none"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
            />

            {newProduct.image && typeof newProduct.image !== "string" && (
              <Text fontSize="sm" color="gray.500">
                Selected: {newProduct.image.name}
				Selected: {newProduct.image.description}
              </Text>
            )}

            <Button colorScheme="green" onClick={handleAddProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
	);
  };
  
  export default CreatePage;
  