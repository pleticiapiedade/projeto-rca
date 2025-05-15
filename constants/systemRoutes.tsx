import { LinkProps } from '@/types';
import { TbUsers } from 'react-icons/tb';
import { LuTruck } from 'react-icons/lu';

import {
  RiUser2Line,
  RiContactsLine,
  RiFileListLine,
  RiMegaphoneLine,
  RiProgress4Line,
  RiDashboardFill,
  RiHomeSmile2Fill,
  RiHomeSmile2Line,
  RiExchangeBoxLine,
  RiShoppingCartLine,
  RiUserAddLine
} from 'react-icons/ri';

export const NO_MATCH: LinkProps = {
  link: '/*',
  id: 'NO_MATCH',
  view: 'NoMatch',
  title: 'Página não encontrada',
};

export const LOGIN: LinkProps = {
  id: 'LOGIN',
  link: '/login',
  view: 'SignIn',
  title: 'Identifique-se',
  isProtected: false,
};

export const CHECKOUT: LinkProps = {
  id: 'CHECKOUT',
  link: '/checkout',
  title: 'Pagamento',
  view: 'CheckoutPage',
  isProtected: true,
  hasCart: true,
};

export const SUCCESS: LinkProps = {
  id: 'SUCCESS',
  view: 'Success',
  link: '/sucesso',
  title: 'Pedido Confirmado',
  isProtected: true,
  hasCart: true,
};

export const MAIN: LinkProps = {
  link: '/',
  id: 'MAIN',
  view: 'MainPage',
  title: 'Bate Forte',
  isProtected: false,
  hasCart: true,
};

export const CART: LinkProps = {
  id: 'CART',
  view: 'Cart',
  link: '/carrinho',
  title: 'Carrinho',
  icon: <RiShoppingCartLine size={20} />,
  isProtected: true,
  hasCart: true,
};

export const MY_ACCOUNT: LinkProps = {
  id: 'MY_ACCOUNT',
  view: 'MyAccount',
  link: '/minha-conta',
  title: 'Minha Conta',
  icon: <RiContactsLine size={20} />,
  isProtected: true,
  hasCart: true,
};

export const COMPANY: LinkProps = {
  id: 'COMPANY',
  view: 'MyCompany',
  link: '/minha-empresa',
  title: 'Dados da Empresa',
  isProtected: true,
};

export const ECOMMERCE: LinkProps = {
  id: 'ECOMMERCE',
  view: 'Products',
  link: '/produtos',
  title: 'Vendas BF',
  icon: <RiHomeSmile2Fill size={20} />,
  isProtected: true,
  hasCart: true,
};

export const CHOICE_CLIENT: LinkProps = {
  title: 'Vendas BF',
  id: 'CHOICE_CLIENT',
  modal: 'modal-companies',
  link: '/selecionar-cliente',
  icon: <RiHomeSmile2Line size={20} />,
};

export const DASHBOARD: LinkProps = {
  id: 'DASHBOARD',
  view: 'Dashboard',
  link: '/dashboard',
  title: 'Dashboard',
  icon: <RiDashboardFill size={20} />,
  isProtected: true,
};

export const CATEGORY: LinkProps = {
  id: 'CATEGORIE',
  view: 'Categorie',
  title: 'Categoria',
  link: '/categoria/:id',
  icon: <RiFileListLine size={20} />,
  isProtected: true,
  hasCart: true,
};

export const MY_CLIENTS: LinkProps = {
  id: 'MY_CLIENTS',
  view: 'MyClients',
  link: '/meus-clientes',
  title: 'Meus clientes',
  icon: <TbUsers size={21} />,
  isProtected: true,
};

export const CAMPAIGNS: LinkProps = {
  disabled: true,
  id: 'CAMPAIGNS',
  view: 'Building',
  link: '/campanhas',
  title: 'Campanhas',
  icon: <RiMegaphoneLine size={21} />,
  isProtected: true,
  hasCart: true,
};

export const SYNCHRONIZATION: LinkProps = {
  disabled: true,
  view: 'NoMatch',
  id: 'SYNCHRONIZATION',
  link: '/sincronizacao',
  title: 'Sincronizações',
  icon: <RiExchangeBoxLine size={21} />,
  isProtected: true,
};

export const SYSTEM_MODE: LinkProps = {
  disabled: true,
  view: 'NoMatch',
  id: 'SYSTEM_MODE',
  link: '/modo-escuro',
  title: 'Modo escuro',
  icon: <RiProgress4Line size={21} />,
};

export const SEARCH: LinkProps = {
  id: 'SEARCH',
  view: 'SarchPage',
  link: '/busca-de-produtos',
  title: 'Busca de Produtos',
  icon: <RiProgress4Line size={21} />,
  isProtected: true,
  hasCart: true,
};

export const SUBCATEGORIES: LinkProps = {
  view: 'Categories',
  id: 'SUBCATEGORIES',
  link: '/categorias/:id',
  title: 'Categorias',
  icon: <RiFileListLine size={20} />,
  isProtected: true,
  hasCart: true,
};

export const CATEGORIES: LinkProps = {
  id: 'CATEGORIES',
  view: 'Categories',
  link: '/categorias',
  title: 'Categorias',
  icon: <RiFileListLine size={20} />,
  match: [SUBCATEGORIES.link, SEARCH.link, CATEGORY.link],
  isProtected: true,
  hasCart: true,
};

export const PRODUCT_PAGE: LinkProps = {
  id: 'PRODUCT_PAGE',
  view: 'ProductPage',
  link: '/:COD_PRODUTO',
  title: 'Detalhes de Produto',
  match: [ECOMMERCE.link],
  isProtected: true,
  hasCart: true,
};

export const USER_DATA: LinkProps = {
  id: 'USER_DATA',
  view: 'UserData',
  link: '/meus-dados',
  title: 'Meus Dados',
  icon: <RiUser2Line size={21} />,
  isProtected: true,
};

export const ORDER_STATUS_PAGE: LinkProps = {
  id: 'ORDER_STATUS_PAGE',
  view: 'OrderStatusPage',
  link: '/order-status',
  title: 'Acompanhamento de pedidos',
  icon: <LuTruck size={21} />,
  isProtected: true,
  hasCart: true,
};

export const PRODUCTIVITY_EXTRACT: LinkProps = {
  id: 'PRODUCTIVITY_EXTRACT',
  view: 'ProductivityExtract',
  link: '/extrato-produtividade',
  title: 'Extrato de produtividade',
  isProtected: true,
};

export const CLIENT_ORDER_PAGE: LinkProps = {
  id: "CLIENT_ORDER_PAGE",
  view: 'ClientOrderPage',
  link: '/meus-pedidos',
  title: 'Meus Pedidos',
  isProtected: true,
};

export const CLIENT_ORDER_DETAIL: LinkProps = {
  id: "CLIENT_ORDER_DETAIL",
  view: "ClientOrderDetail",
  link: "/pedido",
  title: "Pedido",
  isProtected: true,
  hasCart: true,
};

export const INDICATORS: LinkProps = {
  id: "INDICATORS",
  view: "Indicators",
  link: "/indicadores",
  title: "Indicadores",
}

export const SALES_CYCLE: LinkProps = {
  id: 'SALES_CYCLE',
  view: 'SalesCycle',
  link: '/ciclo-de-venda',
  title: 'Ciclo de vendas',
}

export const SALES_REPORT: LinkProps = {
  id: 'SALES_REPORT',
  view: 'SalesReport',
  link: '/relatorio-vendas',
  title: 'Relatório de vendas',
  isProtected: true,
};

export const PERFORMANCE_INDICATORS: LinkProps = {
  id: "PERFORMANCE_INDICATORS",
  view: "PerformanceIndicators",
  link: "/indicadores-de-performance",
  title: "Indicadores de Performance"
}

export const NEW_CLIENT: LinkProps = {
  disabled: true,
  id: 'NEW_CLIENT',
  view: 'NewClient',
  link: '/novo-cliente',
  title: 'Cadastrar cliente',
  isProtected: true,
  icon: <RiUserAddLine size={21} />
}