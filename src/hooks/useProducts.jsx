import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewProduct, getProducts } from "../api/firebase";

export default function useProducts() {
  const queryClient = useQueryClient();

  const productQuery = useQuery(["products"], getProducts, {
    staleTime: 1000 * 60,
  });

  const addProduct = useMutation(
    ({ product, url }) => addNewProduct(product, url), // 수행할 동작
    {
      // side effect
      // 변경사항 즉시 반영
      onSuccess: () => queryClient.invalidateQueries(["product"]),
    }
  );

  return { productQuery, addProduct };
}
