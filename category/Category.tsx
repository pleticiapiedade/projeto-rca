import Empty from './empty';
import * as S from './styles';
import { useParams } from 'react-router-dom';
import { CategoryProps, FilterItemProps } from '@/types';
import { useCart, useClient, useGlobals, useTables } from '@/hooks';
import { FilterBar, Product, Loading } from '@/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCalcPrice, useDbFunctions, useScrollPageEvent } from '@/talons';

const ITEMS_PER_PAGE = 4;
const TIMEOUT_LOADING = 200;

const Category = () => {
  const { id } = useParams();
  const categoryID = Number(id);

  const { tables } = useTables();
  const { getOnDB } = useDbFunctions();
  const { page, setPage } = useScrollPageEvent();
  const { campanhaProdutos, selectedClient } = useClient();
  const { setRouteTitle, cardMode: direction } = useGlobals();
  const { catalog, isLoaded, substTrib, getCatalog } = useCalcPrice();
  const { addProductToCart, updateProductAmount, removeProductFromCart } = useCart();

  const loadingIds = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productsIds, setProductsIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [selectedFilters, setFilters] = useState<FilterItemProps[]>([]);

  // USE CALLBACKS
  const handleFilters = useCallback((filters: FilterItemProps[]) => {
    setFilters(filters);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, TIMEOUT_LOADING);
  }, [setPage]);

  const handleCategories = useCallback((categories: CategoryProps[]) => {
    setCategories(categories);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setPage]);


  // USE MEMOS
  const isPageBuilder = useMemo(() => id?.includes('pagebuilder'), [id]);

  const isCampanha = useMemo(() => id?.includes('campanha-bate-forte'), [id]);

  const catalogList = useMemo(() => {
    if (!productsIds.length) return catalog;
    return catalog.filter((p) => productsIds.includes(p.COD_PRODUTO));
  }, [productsIds, catalog]);

  const allCategories = useMemo(() => {
    const findDescendants = (items: CategoryProps[], fatherID: number) => {
      const descendants = [] as CategoryProps[];

      const findChildren = (id: number) => {
        const children = items.filter((item) => item.COD_CATEGORIA_PAI === id);
        children.forEach((child) => {
          descendants.push(child);
          findChildren(child.COD_CATEGORIA);
        });
      };

      findChildren(fatherID);
      return descendants;
    };

    return [
      categoryID, ...findDescendants(tables.current.categoria, categoryID).map((i) => i.COD_CATEGORIA),
    ];
  }, [categoryID, categories]);

  const searchList = useMemo(() => {
    if (productsIds.length) return catalogList;
    return catalogList.filter((p) => allCategories.includes(p.COD_CATEGORIA));
  }, [catalogList, allCategories, productsIds]);

  console.log({categories});
  console.log({allCategories});
  
  const filteredList = useMemo(() => {
    if (!selectedFilters.length) return searchList;

    const positivacaoFilters = new Set();
    const categoriasFiltradas = new Set();
    const marcasFiltradas = new Set();
    let filtroPositivado = false;
    let filtroNaoPositivado = false;

    for (const filter of selectedFilters) {
      if (filter.type === 'positivacao') {
        positivacaoFilters.add(filter);
        if (filter.id === 'positivou') filtroPositivado = true;
        else if (filter.id === 'nao-positivou') filtroNaoPositivado = true;
      }
      else if (filter.type === 'category') categoriasFiltradas.add(filter.id);
      else if (filter.type === 'brand') marcasFiltradas.add(filter.id);
    }

    // Cria Sets para busca mais eficiente
    const produtosPositivados = new Set(campanhaProdutos?.ativo?.produto || []);
    const produtosNaoPositivados = new Set(campanhaProdutos?.inativo?.produto || []);

    return searchList.filter((produto) => {
      // Verifica positivação
      if (positivacaoFilters.size > 0) {
        const produtoPositivado = produtosPositivados.has(produto.COD_PRODUTO);
        const produtoNaoPositivado = produtosNaoPositivados.has(produto.COD_PRODUTO);

        if (filtroPositivado && !filtroNaoPositivado && !produtoPositivado) return false;
        if (!filtroPositivado && filtroNaoPositivado && !produtoNaoPositivado) return false;
        if (filtroPositivado && filtroNaoPositivado && !produtoPositivado && !produtoNaoPositivado) return false;
      }

      if (produto.COD_MARCA == 132) console.log('produto.COD_MARCA', produto.COD_MARCA);

      const hasCategory = categoriasFiltradas.has(produto.COD_CATEGORIA);
      const hasBrand = marcasFiltradas.has(produto.COD_MARCA);
      
      if (hasBrand) return true;
      if (hasCategory && !marcasFiltradas.size) return true;

      return false;
    });
  }, [selectedFilters, searchList, campanhaProdutos]);

  const titlePage = useMemo(() => {
    return tables.current.categoria.find((c) => c.COD_CATEGORIA === categoryID)?.DE_CATEGORIA;
  }, [categories, categoryID]);

  const count = useMemo(() => filteredList?.length, [filteredList]);

  const listFilterProducts = useMemo(() => {
    if (isCampanha || isPageBuilder) return catalogList;

    return searchList.length ? searchList : catalogList;
  }, [searchList, catalogList, isCampanha, isPageBuilder]);

  const paginatedProducts = useMemo(() =>
    filteredList?.slice(0, page * ITEMS_PER_PAGE),
    [filteredList, page]
  );


  // USE EFFECTS
  useEffect(() => {
    if (titlePage) setRouteTitle(titlePage);
  }, [setRouteTitle, titlePage]);

  useEffect(() => {
    if (!isPageBuilder || productsIds.length || loadingIds.current) return;
    loadingIds.current = true;

    const loadPageBuilder = async () => {
      try {
        const list = await getOnDB('pagebuilder');
        const ID = id?.split('-')[1];
        const pagebuilder = list.find((i) => `${i.ID}` === `${ID}`);
        const ids = pagebuilder?.list_sku.map((i) => Number(i)) || [];
        setProductsIds(ids);
      } catch (error) {
        console.error('Erro ao carregar pagebuilder:', error);
      } finally {
        loadingIds.current = false;
      }
    };

    loadPageBuilder();
  }, [isPageBuilder, productsIds.length, id, getOnDB]);

  useEffect(() => {
    if (!isCampanha || productsIds.length || loadingIds.current) return;
    loadingIds.current = true;

    const loadPageCampanha = async () => {
      try {
        const campanha = await getOnDB('campanha_produto');
        setProductsIds([...campanha.inativo?.produto || [], ...campanha.ativo?.produto || []]);
      } catch (error) {
        console.error('Erro ao carregar campanha:', error);
      } finally {
        loadingIds.current = false;
      }
    };

    loadPageCampanha();
  }, [isCampanha, productsIds.length, getOnDB]);

  useEffect(() => {
    if (isLoaded[selectedClient.COD_CLIENTE]) return;

    getCatalog();
  }, [getCatalog, isLoaded]);

  return (
    <S.Content id="category-page">
      <S.Container>
        <FilterBar
          top={55}
          hasRadius
          categoryId={categoryID}
          filters={selectedFilters}
          setFilters={handleFilters}
          setCategories={handleCategories}
          products={listFilterProducts}
        />

        <S.Separator />

        {isLoading ? (
          <S.Content id="category-page">
            <S.Container>
              <S.ContentLoading>
                <Loading scale={2} />
              </S.ContentLoading>
            </S.Container>
          </S.Content>
        ) : (
          <>
            {!!count && (
              <S.Counter>
                {count} {count === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </S.Counter>
            )}

            <S.ContentList $isgrid={direction === 'grid'}>
              {paginatedProducts?.map((product, ind) => (
                <Product
                  product={product}
                  substTrib={substTrib}
                  direction={direction}
                  key={`search-product-${product.COD_PRODUTO}-${ind}`}
                  addProductToCart={addProductToCart}
                  updateProductAmount={updateProductAmount}
                  removeProductFromCart={removeProductFromCart}
                />
              ))}
            </S.ContentList>

            {!filteredList.length && <Empty />}
          </>
        )}
      </S.Container>
    </S.Content>
  );
};

export default Category;
