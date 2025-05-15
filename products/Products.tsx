import * as S from './Styled';
import FastLinks from './fast-links';
import {useScrollPageEvent} from '@/talons';
import {useNavigate} from 'react-router-dom';
import FastCategories from './fast-categories';
import {useCalcPrice} from '@/talons';
import {BannerProps, PageBuilderProps, ProductProps} from '@/types';
import {useCart, useClient, useGlobals, useTables} from '@/hooks';
import ControlCardMode from '@/components/filter-bar/control-card-mode';
import {CATEGORY, SEARCH, PRODUCT_PAGE} from '@/constants/systemRoutes';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Slider, Search, Product, Loading, OfferDivider, ProductsSlider} from '@/components';

const mountBanner = (IMAGE: string, LINK?: string): BannerProps => ({
  IMAGE,
  LINK,
});

const qtd = 4;

const RenderProducts = () => {  
  const {tables} = useTables();
  const navigate = useNavigate();
  const {cardMode} = useGlobals();
  const {page, setPage} = useScrollPageEvent();
  const {selectedClient, campanhaProdutos} = useClient();
  const {catalog, isLoadingCatalog, substTrib, getCatalog, isLoaded} = useCalcPrice();
  const {addProductToCart, updateProductAmount, removeProductFromCart, getLimit} = useCart();

  const [pageLastPurchase, setPageLastPurchase] = useState(1);
  const [pageBuilder, setPageBuilder] = useState([] as BannerProps[]);
  const [currentClient, setCurrentClient] = useState(selectedClient.COD_CLIENTE);

  const isLoading = !catalog?.length || !isLoaded;
  const pagebuilderTable: PageBuilderProps[] = useMemo(() => tables.current.pagebuilder, [tables.current.pagebuilder]);

  const recomendacaoBigData = useMemo(() => tables.current.recomendacaoBigData, [tables.current.recomendacaoBigData]);

  useEffect(() => {
    if (catalog?.length) {
      const filtered = catalog.filter((item: any) => item.ultimaCompra?.SEQPESSOA === selectedClient.COD_CLIENTE);
      console.log('filtered', filtered);
    }
  })

  const listProducts = useMemo(() => {
    return catalog?.slice(0, page * qtd) || [];
  }, [catalog, page]);

  const productsIds = useMemo(() => {
    const ids = new Set<string>();
    for (const i of catalog) {
      ids.add(String(i.COD_PRODUTO));
    }
    return ids;
  }, [catalog]);

  const enableLoadMore = useMemo(() => {
    return listProducts.length / qtd >= page;
  }, [listProducts, page]);

  const recommendations = useMemo(() => {
    const recommendationsData = new Map<string, number>();
    
    for (const r of recomendacaoBigData) {
      if (r.COD_PESSOA === selectedClient.COD_CLIENTE) {
        recommendationsData.set(String(r.COD_PRODUTO), r.MD_RATING);
      }
    }
  
    const filteredProducts: ProductProps[] = [];
    for (const p of catalog) {
      if (!recommendationsData.has(String(p.COD_PRODUTO)) || !productsIds.has(String(p.COD_PRODUTO))) continue;

      const limit = getLimit(p.COD_PRODUTO);
      if (!limit) continue;

      let hasLimit = false;
      for (const emb of p.EMBALAGEM) {
        if (limit >= emb.QTD_EMBALAGEM) {
          hasLimit = true;
          break;
        }
      }

      if (hasLimit) {
        filteredProducts.push({
          ...p,
          MD_RATING: recommendationsData.get(String(p.COD_PRODUTO)) ?? undefined
        });
      }
    }

    return filteredProducts.sort((a, b) => (b.MD_RATING ?? 0) - (a.MD_RATING ?? 0));
  }, [catalog, recomendacaoBigData, selectedClient.COD_CLIENTE, productsIds, getLimit]);

  const productsWithLastPurchase = useMemo(() => {
    const filtered = [];
    let count = 0;
    const limit = pageLastPurchase * 3;

    for (const product of catalog) {
      if(String(product.COD_PRODUTO) === '2929546'){
        console.log('product', product);
      };
      if (product.ultimaCompra !== null && product?.ultimaCompra?.SEQPESSOA === selectedClient.COD_CLIENTE) {
        filtered.push(product);
        count++;
        if (count >= limit) break;
      }
    }
    return filtered;
  }, [catalog, pageLastPurchase, selectedClient.COD_CLIENTE]);
  
  const getPageBuilder = useCallback(async () => {
    if (pageBuilder.length) return;

    const banners = (pagebuilderTable || [])
      .filter((l) => l.type === 'banner')
      .map((b) => {
        const isProduct = b.link_type === 'product';
        const page = isProduct ? PRODUCT_PAGE : CATEGORY;
        const [path] = page.link.split(':');
        const ID = b.list_sku.join('&');

        const link = `${path}:${ID}`;

        return {...mountBanner(`data:image/jpg;base64,${b.base64Img}`, `${link}`), ID: b.ID};
      });

    setPageBuilder(banners);
  }, [pageBuilder]);

  const listBanners = useMemo(() => {
    const builder = [];
    for (const item of pageBuilder) {
      const [path] = item.LINK?.split(':') || [];
      const skus = item.LINK?.split('&').filter(i => productsIds.has(i));
      
      if (skus?.length) {
        const link = `${path}pagebuilder-${item.ID}`;
        builder.push(mountBanner(item.IMAGE, link));
      }
    }
    return builder;
  }, [pageBuilder, productsIds]);

  const loadData = useCallback(async () => {
    const hasCatalog = !!catalog?.length;

    getPageBuilder();
    if ((hasCatalog && selectedClient.COD_CLIENTE === currentClient)) return;

    await getCatalog(false, 0, true);
    setCurrentClient(selectedClient.COD_CLIENTE);
  }, [
    getCatalog,
    getPageBuilder,
    setCurrentClient,
    catalog,
    currentClient,
    selectedClient.COD_CLIENTE,
  ]);

  useEffect(() => {
    if (isLoaded[selectedClient.COD_CLIENTE]) return;

    getCatalog(false, 1000);
  }, [getCatalog, isLoaded]);
  
  useEffect(() => {
    loadData();
  }, [loadData, selectedClient.COD_CLIENTE]);

  const goToSearchPage = () => navigate(SEARCH.link);

  const handlePageLastPurchase = useCallback((index: number) => {
    if (index === productsWithLastPurchase.length - 1) setPageLastPurchase(pageLastPurchase + 1);
  }, [productsWithLastPurchase, pageLastPurchase, setPageLastPurchase]);

  return (
    <S.Container
      className="products-container"
    >
      <Search
        showUser
        value={''}
        forceReload
        showPaymentMode
        setFilter={() => { }}
        id="products-container"
        onFocus={goToSearchPage}
      />

      <S.ContainerSlider>
        <Slider
          dots
          autoplay
          isBanner
          canSwipe
          id="main-banner"
          slides={listBanners}
        />
      </S.ContainerSlider>

      <FastLinks/>

      <FastCategories/>

      <S.Row>
        <S.CardModeText>
          Visualizar em:
        </S.CardModeText>
        <ControlCardMode/>
      </S.Row>

      {!!recommendations?.length && (
        <>
          <OfferDivider
            isinvert
          >
            <S.OfferText>
              Recomendamos para o seu <S.OfferSpan>Negócio</S.OfferSpan>
            </S.OfferText>
          </OfferDivider>

          <ProductsSlider
            dots
            id="promocoes"
            cardMode={cardMode}
            products={recommendations}
            addProductToCart={addProductToCart}
            removeProductFromCart={removeProductFromCart}
            updateProductAmount={updateProductAmount}
          />
        </>
      )}

      {!!productsWithLastPurchase?.length && !isLoading && (
        <>
          <OfferDivider
            isinvert
          >
            <S.OfferText>
              Ultimas Compras
            </S.OfferText>
          </OfferDivider>

          <ProductsSlider
            dots
            id="ultimas-compras"
            cardMode={cardMode}
            products={productsWithLastPurchase}
            addProductToCart={addProductToCart}
            removeProductFromCart={removeProductFromCart}
            updateProductAmount={updateProductAmount}
            setPageLastPurchase={handlePageLastPurchase}
          />
        </>
      )}

      {/* <Slider isBanner id="banner-1" slides={[mountBanner(banner7)]} />
      <Slider isBanner id="banner-2" slides={[mountBanner(banner4)]} /> */}



      {/* <OfferDivider>
        <S.OfferText>Aproveite!!</S.OfferText>

        <S.Timer>
          <IoTimeOutline color={colors.brand.white} size={13} />
          <S.OfferText margin="0">03d | 09h | 39m | 46s</S.OfferText>
        </S.Timer>
      </OfferDivider>

      <ProductsSlider
        id="ofertas-da-semana"
        products={catalog?.slice(7, 13) || []}
        addProductToCart={addProductToCart}
        updateProductAmount={updateProductAmount}
        removeProductFromCart={removeProductFromCart}
      /> */}

      {/* <Slider isBanner id="banner-3" slides={[mountBanner(banner5)]} />
      <Slider isBanner id="banner-4" slides={[mountBanner(banner6, "/")]} /> */}


      {campanhaProdutos?.ativo?.selo && (
        <OfferDivider
          isDark
          img={campanhaProdutos.inativo.selo}
          scaleImg={1.5}
        >
          <S.SeeAll
            to={`/categoria/${campanhaProdutos.url_amigavel}`}
          >
            Ver Todos
          </S.SeeAll>
        </OfferDivider>
      )}

      <S.Div>
        <S.ProductsList>
          <S.ContentList
            $direction={cardMode}
          >
            {listProducts.map((item: any, ind: number) => (
              <Product
                key={ind}
                direction={cardMode}
                substTrib={substTrib}
                product={{...item}}
                addProductToCart={addProductToCart}
                updateProductAmount={updateProductAmount}
                removeProductFromCart={removeProductFromCart}
              />
            ))}
          </S.ContentList>
        </S.ProductsList>

        {(isLoadingCatalog.current || !catalog?.length) && (
          <S.Loading>
            <Loading
              scale={1.8}
            />
          </S.Loading>
        )}

        {enableLoadMore && (
          <S.Center>
            <S.LoadMore
              onClick={() => setPage(page + 1)}
              data-test="products-page-load-more-button"
            >
              Carregar mais
            </S.LoadMore>
          </S.Center>
        )}
      </S.Div>
    </S.Container>
  );
};

export default React.memo(RenderProducts);
