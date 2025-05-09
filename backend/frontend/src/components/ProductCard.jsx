import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useRef, useState } from "react";

const ProductCard = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    image: product.image,
  });

  const fileInputRef = useRef();
  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("description", updatedProduct.description);
    formData.append("price", updatedProduct.price);
    formData.append("quantity", updatedProduct.quantity);

    if (updatedProduct.image && typeof updatedProduct.image !== "string") {
      formData.append("image", updatedProduct.image);
    }

    const { success, message } = await updateProduct(product._id, formData);
    onClose();
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image
        src={typeof updatedProduct.image === "string" ? updatedProduct.image : URL.createObjectURL(updatedProduct.image)}
        alt={updatedProduct.name}
        h={48}
        w="full"
        objectFit="cover"
        fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
      />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
         Name: {product.name}
        </Heading>

        <Heading as="h3" size="md" mb={2}>
         Description: {product.description}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
         Price: ${product.price}
        </Text>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
         Quantity: ${product.quantity}
        </Text>

        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme="red"
          />
        </HStack>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bg}>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={updatedProduct.description}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, description: e.target.value })
                }
              />
              <Input
                placeholder="Price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                }
              />
              <Input
                placeholder="Quantity"
                type="number"
                value={updatedProduct.quantity}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, quantity: e.target.value })
                }
              />

              <Button onClick={() => fileInputRef.current.click()} colorScheme="blue" w="full">
                Upload New Image
              </Button>

              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                display="none"
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    image: e.target.files[0],
                  })
                }
              />

              {updatedProduct.image && typeof updatedProduct.image !== "string" && (
                <Text fontSize="sm" color="gray.500">
                  Selected: {updatedProduct.image.name}
                </Text>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
