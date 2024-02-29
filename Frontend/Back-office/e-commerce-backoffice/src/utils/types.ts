export interface Item {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    image: string;
  }
  
  export interface Order {
    orderId: string;
    customerId: string;
    address: string;
    status: string;
  }

  // Reducers State
  export interface ProductsState {
    fetchedProducts: boolean;
    productsFetching: boolean;
    products: Array<Item>;
    selectedProduct: Item | null;
  }

  export interface OrdersState {
    fetchedOrders: boolean;
    ordersFetching: boolean;
    orders: Array<Order>;
  }

   // Redux Store
   export interface StoreState {
    products: ProductsState;
    orders: OrdersState
  }