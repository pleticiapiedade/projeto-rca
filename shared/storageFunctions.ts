import { StockProps } from "@/hooks/StockContext";
import { CartDetailsProps, CartItems } from "@/hooks/CartContext";
import { ClientProps, CustomerDataProps, DataSetsProps, DiscountProps } from "@/types";
import { ENCRYPT } from "@/constants";

export const storageKey = "@PWA_RCA";
export const tableKeys = [
  "rca",
  "datasets",
  "new_data_sets",
  "token_aws",
  "discounts",
  "rca_usuario",
  "token_magento",
  "token_offline",
  "selected_client",
  "cart_id",
  "cart_details",
  "cod_pessoa",
  "cart",
  "client_cart",
  "is_first_load",
  "offline_orders",
  "login_date",
  "login",
  "network_status",
  "last_route",
  "stock_left",
  "synched_orders",
  "lastSync",
  "paymentCode",
  "cardMode",
  "lastCheckedVersion",
  "new_client_store_images",
  "new_client_contrato_social",
  "new_client_invoices",
  "order_numbers"
] as const;

export type Tables = (typeof tableKeys)[number];

type TableTypes = {
  rca: CustomerDataProps;
  token_aws: String;
  cardMode: 'list' | 'grid';
  rca_usuario: CustomerDataProps;
  token_magento: String;
  token_offline: String;
  discounts: DiscountProps;
  datasets: DataSetsProps[];
  new_data_sets: DataSetsProps[];
  selected_client: ClientProps;
  cart_details: Record<number, CartDetailsProps>;
  paymentCode: Record<number, number>;
  cart_id: string;
  is_first_load: string;
  cart: Array<CartItems>;
  client_cart: Array<CartItems>;
  offline_orders: any;
  login_date: Date;
  last_route: string;
  cod_pessoa: string;
  network_status: 'offline' | 'online';
  synched_orders: any;
  stock_left: Record<number, Record<number, StockProps>>;
  lastSync: string;
  lastCheckedVersion: string;
  new_client_store_images: any;
  new_client_contrato_social: any;
  new_client_invoices: any;
  login: string;
  order_numbers: any;
};

const toCoded = (str: string) => {
  if (!str || !ENCRYPT) return str

  try {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(str);
    const binaryStr = String.fromCharCode(...uint8Array);
    return window.btoa(binaryStr);
  } catch (error) {
    return str
  }
}

const fromCoded = (str: string) => {
  if (!str || !ENCRYPT) return str

  try {
    const binaryStr = window.atob(str);
    const uint8Array = new Uint8Array([...binaryStr].map(char => char.charCodeAt(0)));
    const decoder = new TextDecoder();
    return decoder.decode(uint8Array);
  } catch (e) {
    return str
  }
}

const toJSONOrString = (input: any) => {
  try {
    return toCoded(JSON.stringify(input));
  } catch (error) {
    return toCoded(input);
  }
};

const parseJSONOrString = (input: any) => {
  try {
    return JSON.parse(fromCoded(input));
  } catch (e) {
    return fromCoded(input);
  }
};

const mountKey = (name: string, id?: string) => toCoded(`${storageKey}:${name}${id ? ":" + id : ""}`);

export const getOnStorage = <T extends Tables>(
  name: T,
  id?: string
): TableTypes[T] | null => {
  const storageItem = localStorage.getItem(mountKey(name, id));
  return parseJSONOrString(storageItem) as TableTypes[T] | null;
};

export const setOnStorage = (name: Tables, data: any, id?: string) => {
  localStorage.setItem(mountKey(name, id), toJSONOrString(data));
};

export const removeFromStorage = (name: Tables, id?: string) => {
  localStorage.removeItem(mountKey(name, id));
};

export const updateOnStorage = (name: Tables, data: any, id?: string) => {
  const storageItem = getOnStorage(name, id);
  if (!storageItem) {
    console.log("Item não encontrado no storage");
    return;
  }

  const updatedItem = { ...(storageItem || {}), ...(data || {}) };
  setOnStorage(name, updatedItem, id);
};

export const updateSpecificFieldInStorage = (
  storageKey: any,
  field: string,
  newValue: string
) => {
  let currentData = getOnStorage(storageKey);

  if (currentData && currentData.hasOwnProperty(field)) {
    currentData[field] = newValue;
    updateOnStorage(storageKey, currentData);
  } else {
    console.error("Campo não encontrado no objeto");
  }
};
