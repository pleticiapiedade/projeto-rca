enum ORIGENS {
  LOGIN = 'Login',
  DOWNLOAD_DATASET = 'Download_Dataset',
  INITIAL_SCREEN = 'Inicial_Screen',
  SELECT_CLIENT = 'Selecionar_Cliente',
  SEARCH_PRODUCT = 'Buscar_Produto',
  PRODUCT_DETAIL = 'Detalhe_Produto',
  ADD_FLEX = 'Adicionar_Flex',
  REMOVE_FLEX = 'Remover_Flex',
  CLEAR_CART = 'Limpar_Carrinho',
  CHANGE_PAYMENT_CONDITION = 'Trocar_Condicao_Pagamento',
  CHECKOUT = 'Checkout',
  CHANGE_CLIENT = 'Trocar_Cliente',
}
// enum ORIGENS {
//   LOGIN = 'Login',
//   DOWNLOAD_DATASET = 'Download_Dataset',
//   INITIAL_SCREEN = 'Inicial_Screen',
//   SELECT_CLIENT = 'Selecionar_Cliente',
//   SEARCH_PRODUCT = 'Buscar_Produto',
//   PRODUCT_DETAIL = 'Detalhe_Produto',
//   ADD_FLEX = 'Adicionar_Flex',
//   REMOVE_FLEX = 'Remover_Flex',
//   CLEAR_CART = 'Limpar_Carrinho',
//   CHANGE_PAYMENT_CONDITION = 'Trocar_Condicao_Pagamento',
//   CHECKOUT = 'Checkout',
//   CHANGE_CLIENT = 'Trocar_Cliente',
// }

const events = {
  COD_RCA: 'Cod_RCA',
  LOGIN: 'Login',
  DATAHORA: 'Datahora',
  DATAHORA_INICIO: 'Datahora_Inicio',
  DATAHORA_FIM: 'Datahora_Fim',
  COD_CLIENTE: 'Cod_Cliente',
  CONDIACAO_PAGAMENTO: 'Condiaoo_Pagamento',
  PRODUTO_PROCURADO: 'Produto_Procurado',
  CODIGO_PRODUTO: 'Codigo_Produto',
  FLEX_PERCENTUAL: 'Flex_Percentual',
  NROPEDIDO: 'Nro_Pedido',
}

const mountEvents = (event: string, origin: ORIGENS) => ({ event, origin })

export default {
  // loginEvents
  LOGIN: mountEvents(events.LOGIN, ORIGENS.LOGIN),
  LOGIN_DATAHORA: mountEvents(events.DATAHORA, ORIGENS.LOGIN),

  // downloadDatasetEvents
  DOWNLOAD_INICIO: mountEvents(events.DATAHORA_INICIO, ORIGENS.DOWNLOAD_DATASET),
  DOWNLOAD_FIM: mountEvents(events.DATAHORA_FIM, ORIGENS.DOWNLOAD_DATASET),

  // initialScreenEvents
  INITIAL_SCREEN: mountEvents(events.DATAHORA, ORIGENS.INITIAL_SCREEN),

  // selectClientEvents
  SELECT_CLIENT_COD_CLIENTE: mountEvents(events.COD_CLIENTE, ORIGENS.SELECT_CLIENT),
  SELECT_CLIENT_CONDIÇÃO_PAGAMENTO: mountEvents(events.CONDIACAO_PAGAMENTO, ORIGENS.SELECT_CLIENT),

  // searchProductEvents
  SEARCH_PRODUCT_PRODUTO_PROCURADO: mountEvents(events.PRODUTO_PROCURADO, ORIGENS.SEARCH_PRODUCT),

  // productDetailEvents
  PRODUCT_DETAIL_CODIGO_PRODUTO: mountEvents(events.CODIGO_PRODUTO, ORIGENS.PRODUCT_DETAIL),

  // addFlexEvents
  ADD_FLEX_CODIGO_PRODUTO: mountEvents(events.CODIGO_PRODUTO, ORIGENS.ADD_FLEX),
  ADD_FLEX_FLEX_PERCENTUAL: mountEvents(events.FLEX_PERCENTUAL, ORIGENS.ADD_FLEX),

  // removeFlexEvents
  REMOVE_FLEX_CODIGO_PRODUTO: mountEvents(events.CODIGO_PRODUTO, ORIGENS.REMOVE_FLEX),

  // clearCartEvents
  CLEAR_CART_DATAHORA: mountEvents(events.DATAHORA, ORIGENS.CLEAR_CART),

  // changePaymentConditionEvents
  CHANGE_PAYMENT_CONDITION_CONDIÇÃO: mountEvents(events.CONDIACAO_PAGAMENTO, ORIGENS.CHANGE_PAYMENT_CONDITION),

  // checkoutEvents
  CHECKOUT_NROPEDIDO: mountEvents(events.NROPEDIDO, ORIGENS.CHECKOUT),

  // changeClientEvents
  CHANGE_CLIENT_COD_CLIENTE: mountEvents(events.COD_CLIENTE, ORIGENS.CHANGE_CLIENT),
};
