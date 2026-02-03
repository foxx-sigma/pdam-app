export interface User {
    id: number;
    username: string;
    password: string;
    role: string;
    owner_token: string;
    createdAt: string;
    updatedAt: string;
}

export interface Admin {
    phone: string;
    owner_token: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}

export interface Customer {
    id: number;
    user_id: number;
    customer_number: string;
    name: string;
    phone: string;
    address: string;
    service_id: number;
    owner_token: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}