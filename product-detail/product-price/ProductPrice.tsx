import * as S from './styles';
import * as B from '@/components/product/styles';
import { PackagesTypesProps, PackagingProductProps, PriceProductProps, ProductProps, TaxSubstitutionProps } from '@/types';
import { useMemo, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Price, AddToCart, Packaging, StPrice, Stock, ModalFlexDiscount } from '@/components';
import { useGlobals, useDiscountFlex, useCart, useClient, useStock } from '@/hooks';
import { useCalcPrice } from '@/talons';
import { formatCurrency } from '@/shared';

interface PriceProps {
  productId?: string;
  product: ProductProps;
  substTrib: TaxSubstitutionProps[];
}

const ProductPrice = ({ product, productId, substTrib }: PriceProps) => {
  const { paymentCode } = useGlobals();
  const { getPrices } = useCalcPrice();
  const { selectedClient } = useClient();
  const { stockLeft: stock } = useStock();
  const { getLimit, cartDetails } = useCart();
  const { getDiscountProduct, discounts } = useDiscountFlex();
  
  product.PRECO = getPrices(product);

  const [pack, setPackage] = useState(product.EMBALAGEM?.[0]?.SG_EMBALAGEM || 'UN');
  const [packQty, setPackQuantity] = useState(() => {
    const multiple = product?.EMBALAGEM?.[0]?.QTD_MULTIPLO_VENDA;
    return multiple > 1 ? multiple : product?.EMBALAGEM?.[0]?.QTD_EMBALAGEM;
  });

  const packing = useMemo(() => {
    return product.EMBALAGEM.find((p) => {
      if (pack === 'PK') {
        return p.SG_EMBALAGEM === pack &&
          p.QTD_MULTIPLO_VENDA === packQty;
      }
      return p.SG_EMBALAGEM === pack &&
        packQty === p.QTD_EMBALAGEM;
    });
  }, [product, pack, packQty]) as PackagingProductProps;

  const [isOpenedModal, openModal] = useState(false);

  const discountPrice = useMemo(() => {
    const emb = product.EMBALAGEM.find((i) => {
      if (i.QTD_MULTIPLO_VENDA > 1 && pack === 'PK') {
        return i.SG_EMBALAGEM === pack && i.QTD_MULTIPLO_VENDA === packQty;
      }
      return i.SG_EMBALAGEM === pack && packQty === i.QTD_EMBALAGEM;
    });

    return getDiscountProduct({
      package: pack,
      productId: product.COD_PRODUTO,
      quantity: emb?.QTD_MULTIPLO_VENDA && emb?.QTD_MULTIPLO_VENDA > 1 ? emb?.QTD_MULTIPLO_VENDA : emb?.QTD_EMBALAGEM || 0,
    })?.discountPrice?.[paymentCode];
  }, [pack,
    paymentCode,
    product.EMBALAGEM,
    product.COD_PRODUTO,
    getDiscountProduct,
    packQty]);

  const price = useMemo(() => {
    return (
      product.PRECO.find((p) => {
        if (pack === 'PK') {
          return p.SG_EMBALAGEM === pack && p.NROCONDICAOPAGTO === Number(paymentCode) && p.QTD_MULTIPLO_VENDA === packQty;
        }
        return p.SG_EMBALAGEM === pack && p.NROCONDICAOPAGTO === Number(paymentCode) && p.QTD_EMBALAGEM === packQty;
      }) || ({} as PriceProductProps)
    );
  }, [paymentCode, product, pack, packQty]);

  const quantity = useMemo(
    () => {
      if (cartDetails?.[selectedClient?.COD_CLIENTE]?.items?.length > 0) {

        return cartDetails?.[selectedClient?.COD_CLIENTE]?.items?.find((i) => {

          const [emb, qtd] = i?.option_uid?.split('_') as [PackagesTypesProps, string];

          if (packing?.QTD_MULTIPLO_VENDA > 1 && emb === 'PK') {

            return (i?.sku === product?.COD_PRODUTO &&
              packing?.SG_EMBALAGEM === emb &&
              qtd === packing?.QTD_MULTIPLO_VENDA?.toString());
          }

          return i?.sku === product?.COD_PRODUTO && packing?.SG_EMBALAGEM === emb && qtd === packing?.QTD_EMBALAGEM?.toString();
        })?.quantity || 0;
      } else {
        return 0;
      }
    },
    [cartDetails,
      selectedClient?.COD_CLIENTE,
      packing?.QTD_MULTIPLO_VENDA,
      packing?.SG_EMBALAGEM,
      packing?.QTD_EMBALAGEM,
      product?.COD_PRODUTO]
  );

  const rawQuantity = useMemo(() => {
    const limit = getLimit(product?.COD_PRODUTO);
    const qtyInStock = stock?.[product?.COD_PRODUTO]?.stock_left;
    const isMultiple = packing?.QTD_MULTIPLO_VENDA > 1 && pack === 'PK';

    if (stock?.[product?.COD_PRODUTO]) {
      if (qtyInStock && qtyInStock > 0) {
        if (quantity) {
          const maximum = isMultiple ? qtyInStock === (packing?.QTD_MULTIPLO_VENDA * quantity) : qtyInStock === (packing?.QTD_EMBALAGEM * quantity);

          if (isMultiple) return maximum ? 0 : qtyInStock - (packing?.QTD_MULTIPLO_VENDA * quantity);
          return maximum ? 0 : qtyInStock - (packing?.QTD_EMBALAGEM * quantity);
        }
        return qtyInStock;
      }
      return 0;
    }

    if (quantity) {
      const maximum = isMultiple ? limit === (packing?.QTD_MULTIPLO_VENDA * quantity) : limit === (packing?.QTD_EMBALAGEM * quantity);

      if (isMultiple) return maximum ? 0 : limit - (packing?.QTD_MULTIPLO_VENDA * quantity);
      return maximum ? 0 : limit - (packing?.QTD_EMBALAGEM * quantity);
    }
    return limit;
  }, [getLimit,
    product?.COD_PRODUTO,
    packing?.QTD_MULTIPLO_VENDA,
    packing?.QTD_EMBALAGEM,
    pack,
    quantity,
    stock]);

  const hasStock = useMemo(() => {
    const limit = getLimit(product?.COD_PRODUTO);
    const multiple = packing?.QTD_MULTIPLO_VENDA > 1;
    const qtyInStock = stock?.[product?.COD_PRODUTO]?.stock_left || null;

    if (stock?.[product?.COD_PRODUTO]) {
      if (qtyInStock && qtyInStock > 0) {
        if (!quantity) {
          if (multiple) return qtyInStock > 0 && (qtyInStock >= packing?.QTD_MULTIPLO_VENDA);
          return qtyInStock > 0 && (qtyInStock >= packing?.QTD_EMBALAGEM);
        }
        if (multiple) return qtyInStock > 0 && (qtyInStock >= packing?.QTD_MULTIPLO_VENDA * quantity);
        return qtyInStock > 0 && (qtyInStock >= packing?.QTD_EMBALAGEM * quantity);
      }
      return false;
    }

    if (!quantity) {
      if (multiple) return limit > 0 && (limit >= packing?.QTD_MULTIPLO_VENDA);
      return limit > 0 && (limit >= packing?.QTD_EMBALAGEM);
    }
    if (multiple) {
      return limit > 0 && (limit >= packing?.QTD_MULTIPLO_VENDA * quantity);
    }
    return limit > 0 && (limit >= packing?.QTD_EMBALAGEM * quantity);

  }, [getLimit,
    packing?.QTD_EMBALAGEM,
    packing?.QTD_MULTIPLO_VENDA,
    product?.COD_PRODUTO,
    quantity,
    stock]);

  const unityPrice = useMemo(() => {
    if (price?.QTD_MULTIPLO_VENDA > 1) {
      return (discountPrice || price.VLR_FINAL) / price?.QTD_MULTIPLO_VENDA;
    } else {
      return (discountPrice || price.VLR_FINAL) / price?.QTD_EMBALAGEM;
    }
  }, [discountPrice, price?.QTD_EMBALAGEM, price?.QTD_MULTIPLO_VENDA, price?.VLR_FINAL]);

  const showOldPrice = useMemo(() => {
    if (price?.VLR_PRECO && price?.VLR_FINAL && price?.VLR_PRECO > price?.VLR_FINAL) {
      return true;
    }
    return false;
  }, [price]);

  const qtdPerPack = useMemo(() => {
    if (pack === 'PK' && price?.QTD_MULTIPLO_VENDA > 1) {
      return price?.QTD_MULTIPLO_VENDA;
    } else {
      return price?.QTD_EMBALAGEM;
    }
  }, [pack, price]);

  const uid = useMemo(() => {
    return `${product?.COD_PRODUTO}-${pack}-${qtdPerPack}`;
  }, [product?.COD_PRODUTO, pack, qtdPerPack]);

  const showInfosFlex = useMemo(() => {
    if (product.EMBALAGEM) {
      const embalagem = product.EMBALAGEM.find((p) => {
        if (pack === 'PK') {
          return p.SG_EMBALAGEM === pack && p.QTD_MULTIPLO_VENDA === packQty;
        }
        return p.SG_EMBALAGEM === pack && p.QTD_EMBALAGEM === packQty;
      });
      if (embalagem) {
        return embalagem.PERC_MAX_FLEX !== 0 && embalagem.PERC_MIN_FLEX !== 0;
      }
    }
    return false;
  }, [pack, product.EMBALAGEM, packQty]);

  const lastPurchase = useMemo(() => {
    if (product?.ultimaCompra?.SEQPESSOA === selectedClient.COD_CLIENTE) {
      return {
        date: new Date(product?.ultimaCompra?.DT_COMPRA).toLocaleDateString('pt-BR'),
        quantity: product?.ultimaCompra?.QTDATENDIDA,
        value: product?.ultimaCompra?.VALOR,
      };
    }
    return null;
  }, [product, selectedClient]);

  if (!price?.VLR_FINAL && !price?.VLR_PRECO) return;

  return (
    <S.PriceBox>
      <S.LabelPackage>
        <S.Line/>
        <S.Label>Selecione a embalagem</S.Label>
        <S.Line/>
      </S.LabelPackage>
      <S.Label>
        <FaChevronDown/>
      </S.Label>

      <S.PackageWrapper>
        <Packaging
          packQty={packQty}
          setPackQuantity={setPackQuantity}
          size={60}
          pack={pack}
          product={product}
          setPackage={setPackage}
        />

        <S.PackageInfo>
          <S.InfoDetail>
            Com {qtdPerPack} {qtdPerPack > 1 ? 'unidades' : 'unidade'}
          </S.InfoDetail>
        </S.PackageInfo>

        {price && price != null && (
          <S.PriceWrapper>
            {hasStock && <Stock stockLeft={Math.floor(rawQuantity / qtdPerPack)}/>}
            {/* <S.FullLine /> */}
            <B.Row>
              {hasStock && <S.PriceContainer>
                {!!showOldPrice && (
                  <S.OldPrice>
                    <Price value={discountPrice || price.VLR_PRECO}/>
                  </S.OldPrice>
                )}
                <S.UnityPrice $extraPadding={!showOldPrice}>
                  <Price value={unityPrice}/> /un
                </S.UnityPrice>
                <S.Price>
                  <Price
                    value={discountPrice || price.VLR_FINAL || price.VLR_PRECO}
                  />
                  <StPrice
                    color={'#666'}
                    precoSt={price?.ST_VLR_FINAL}
                    extraPadding={true}
                    weight={800}
                    precoPauta={price?.VLR_PAUTA}
                    codTributacaoProduto={price?.COD_TRIBUTACAO_PRODUTO}
                    precoCalculado={price?.VLR_PRECO_CALCULADO}
                    cliente={selectedClient}
                    descontoFlex={discounts?.[selectedClient?.COD_CLIENTE]?.[uid]?.percentual ? discounts?.[selectedClient?.COD_CLIENTE]?.[uid]?.percentual : 0}
                  />
                </S.Price>

              </S.PriceContainer>}
              {showInfosFlex && hasStock && (
                // <ToolTip
                //   direction="top"
                //   displayMode="click"
                //   text='Serviço em manutenção'
                // >
                <B.ButtonFlex
                  $isdisabled={!(discountPrice || price?.VLR_FINAL)}
                  disabled={!(discountPrice || price?.VLR_FINAL)}
                  data-test={`button-flex-${product.COD_PRODUTO}`}
                  onClick={() => openModal(true)}
                >
                  <B.EditIcon size={20}/>
                  Flex
                </B.ButtonFlex>
                // </ToolTip>
              )}
            </B.Row>
            <AddToCart
              packQty={packQty}
              pack={pack}
              product={product}
              id={`${productId}`}
              hasDiscount={!!discountPrice}
              unavailabel={(!discountPrice && !price?.VLR_FINAL) || !hasStock}
            />
            {lastPurchase &&  (
              <S.LastPurchase>
                <S.LastPurchaseRow>
                  <S.LastPurchaseLabel>Ultima venda:</S.LastPurchaseLabel>
                  <S.Space />
                  <S.LastPurchaseLabel>
                    {lastPurchase?.date}
                  </S.LastPurchaseLabel>
                </S.LastPurchaseRow>
                 <S.LastPurchaseRow>
                    <S.LastPurchaseBold>
                      {lastPurchase?.quantity} {lastPurchase?.quantity > 1 ? `unidades` : `unidade`}
                    </S.LastPurchaseBold>
                    <S.LastPurchaseBold>{formatCurrency({ value: lastPurchase?.value })}</S.LastPurchaseBold>
                </S.LastPurchaseRow>
              </S.LastPurchase>
            )}
          </S.PriceWrapper>
        )}

        {showInfosFlex && !!substTrib.length && hasStock && (
          <ModalFlexDiscount
            pack={pack}
            packQty={packQty}
            setPackQuantity={setPackQuantity}
            product={product}
            openModal={openModal}
            substTrib={substTrib}
            setPackage={setPackage}
            isOpenedModal={isOpenedModal}
          />
        )}
      </S.PackageWrapper>
    </S.PriceBox>
  );
};

export default ProductPrice;
