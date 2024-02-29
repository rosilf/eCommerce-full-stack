export interface Item {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    image: string;
  }
  
  export interface Comment {
    id: number;
    name: string;
    comment: string;
    itemId: number;
  }
  
  export interface CartItem  {
    product: string;
    name: string;
    quantity: number;
    price: number;
  }

  export interface CartState {
    items: Array<CartItem>;
    selectedItem: CartItem | null;
  }