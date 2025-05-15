import * as S from "./Styled";
import Category from "./category";
import { useDbFunctions } from "@/talons";
import { useParams } from "react-router-dom";
import { useClient, useGlobals } from "@/hooks";
import { CategoryProps, ProductProps } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loading } from "@/components";

const RenderCategories = () => {
  const { id } = useParams();
  const isLoading = useRef(false);
  const { getOnDB } = useDbFunctions();
  const { selectedClient } = useClient();
  const { setRouteTitle, setFatherRouteTitle } = useGlobals();
  const [categoriesData, setCategoriesData] = useState([] as CategoryProps[]);
  const [productData, setProductData] = useState([] as ProductProps[]);

  const loadCategories = useCallback(async () => {
    if (isLoading.current) return;
    isLoading.current = true;

    const categories = await getOnDB("categoria");
    const segmentos = selectedClient?.COD_SEGMENTO?.map(c => c.cod_segmento) || []
    const products = await getOnDB("produtos", selectedClient.COD_CLIENTE).then(prod => {
      return prod.filter(p => p.EMBALAGEM.find((e) => segmentos.includes(e.COD_SEGMENTO)))
    });

    isLoading.current = false;
    setCategoriesData(categories);
    setProductData(products);
  }, [selectedClient]);

  const category = useMemo(() => {
    return categoriesData?.find((i) => `${i.COD_CATEGORIA}` === id);
  }, [id, categoriesData]);

  const subCategory = useMemo(() => {
    return id
      ? categoriesData.find(
        (i) => i.COD_CATEGORIA === category?.COD_CATEGORIA_PAI
      )
      : null;
  }, [id, category, categoriesData]);

  useEffect(() => {
    if (category?.DE_CATEGORIA) {
      setRouteTitle(category.DE_CATEGORIA);
    }
    if (subCategory?.DE_CATEGORIA) {
      setFatherRouteTitle(subCategory.DE_CATEGORIA);
    }
  }, [category?.DE_CATEGORIA, subCategory?.DE_CATEGORIA, setRouteTitle, setFatherRouteTitle]);

  const currentList = useMemo(() => {
    return id
      ? categoriesData.filter((i) => `${i.COD_CATEGORIA_PAI}` === id)
      : categoriesData.filter((i) => !i.COD_CATEGORIA_PAI); // Filtra categorias de nível superior (raiz)
  }, [id, categoriesData]);

  const categories = useMemo(() => {
    // Verificar se uma categoria tem produtos válidos
    const hasValidProducts = (cat: CategoryProps) => {
      return productData.some(
        (prod) => prod.COD_CATEGORIA === cat.COD_CATEGORIA &&
          Array.isArray(prod.EMBALAGEM) && prod.EMBALAGEM.length > 0
      );
    };

    // Função recursiva para montar a lista de categorias válidas
    const getValidCategories = (list: CategoryProps[]): CategoryProps[] => {
      return list.reduce((acc, cat) => {
        const children = cat.PATH_CATEGORIA ? [] : categoriesData.filter(c => c.COD_CATEGORIA_PAI === cat.COD_CATEGORIA);
        const validChildren = getValidCategories(children);
        const isValidCategory = cat.PATH_CATEGORIA ? true : hasValidProducts(cat) || validChildren.length > 0;

        if (isValidCategory) {
          acc.push({ ...cat, children: validChildren.length > 0 ? validChildren : undefined });
        }

        return acc;
      }, [] as CategoryProps[]);
    };
    const validCategories = getValidCategories(currentList);
    if (category) {
      validCategories.push({
        bold: true,
        ...category,
        DE_CATEGORIA: `Ver tudo em ${category.DE_CATEGORIA}`,
      });
    }
    return validCategories;
  }, [category, currentList, productData, categoriesData]);

  useEffect(() => {
    loadCategories()
  }, [selectedClient]);


  return (
    <S.Container className="categories-container">
      <S.Content>
        {isLoading.current ?
          <S.LoadContainer>
            <Loading />
          </S.LoadContainer>
          :
          categories.map((cat, ind) => <Category category={cat} key={`category-${ind}`} />)
        }
      </S.Content>
    </S.Container>
  );
};

export default RenderCategories;
