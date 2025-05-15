import * as S from './styles';
import { useState, useMemo } from 'react';
import { SEARCH } from '@/constants/systemRoutes';
import ProductPrice from './product-price/ProductPrice';
import { useNavigate, useParams } from 'react-router-dom';
import AttributeTable from './attribute-table/AttributeTable';
import { useProductPage } from '@/talons/productPage/useProductPage';
import { ProductGallery, Accordion, Loading, Search, SeloCampanha } from '@/components';
import { useClient } from '@/hooks';

const ProductPage = () => {
  const [filter] = useState('');
  const [isAttributesOpen, setIsAttributesOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const navigate = useNavigate();
  const {selectedClient} = useClient();
  const { COD_PRODUTO: productId } = useParams<{ COD_PRODUTO: string }>();
  const { product, isLoaded, substTrib } = useProductPage({ productId });

  const product_ean = product?.ATRIBUTOS?.find(
    (item: any) => 'ean_grp' in item
  );

  const productDescription = useMemo(() => {
    if (!product?.ATRIBUTOS?.length) return;

    return product?.ATRIBUTOS?.find((item) => 'description' in item)
      ?.description;
  }, [product]);

  const attributes = useMemo(() => product?.ATRIBUTOS, [product]);

  const goToSearchPage = () => navigate(SEARCH.link);

  return (
    <div style={{ background: '#F5F5F5' }}>
      <Search
        showUser
        value={filter}
        showBackButton
        showPaymentMode
        id="product-page"
        setFilter={() => { }}
        onFocus={goToSearchPage}
      />

      {!product?.COD_PRODUTO && !isLoaded[selectedClient.COD_CLIENTE] ? (
        <Loading
          scale={2}
        />
      ) : (
        <S.PageView>
          <S.ProductGallery>
            <ProductGallery
              image={product?.IMAGEM}
            />
          </S.ProductGallery>

          <S.ProductInfoContainer>
            <S.ProductName> {product?.DESC_PRODUTO} </S.ProductName>

            <S.Row>
              <S.ProductCodes>
                <S.ProductCodeBox id={'product-code'}>
                  <S.Code> Código: </S.Code>
                  <S.Code> {product?.COD_PRODUTO} </S.Code>
                </S.ProductCodeBox>

                <S.ProductCodeBox id={'product-code'}>
                  <S.Code> EAN: </S.Code>
                  <S.Code> {product_ean?.ean_grp} </S.Code>
                </S.ProductCodeBox>
              </S.ProductCodes>
              
              <SeloCampanha
                codProduto={product?.COD_PRODUTO}
              />
            </S.Row>

            {!!product && (
              <ProductPrice
                substTrib={substTrib}
                product={product}
                productId={productId || ''}
              />
            )}
          </S.ProductInfoContainer>

          {productDescription && (
            <S.DescriptionWrapper>
              <Accordion
                id="descricao"
                accordionTitle="Descrição"
                accordionExpanded={isDescriptionOpen}
                setAccordionExpanded={setIsDescriptionOpen}
              >
                <S.DescriptionText>
                  {productDescription}
                </S.DescriptionText>
              </Accordion>
            </S.DescriptionWrapper>
          )}

          {attributes && (
            <S.AttributesWrapper>
              <Accordion
                id="ficha-tecnica"
                accordionTitle="Ficha técnica"
                accordionExpanded={isAttributesOpen}
                setAccordionExpanded={setIsAttributesOpen}
              >
                <AttributeTable
                  attributes={attributes}
                />
              </Accordion>
            </S.AttributesWrapper>
          )}
        </S.PageView>
      )}
    </div>
  );
};

export default ProductPage;
