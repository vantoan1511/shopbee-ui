export interface ProductInCart {
    id: number
    name: string
    description?: string,
    salePrice: number
    quantity: number,
    imageUrl?: string
}

export interface Product {
    id: number
    name: string
    slug: string
    description?: string;
    basePrice: number
    salePrice: number
    stockQuantity: number
    active?: boolean
    weight?: number
    color?: string
    processor?: string
    gpu?: string
    ram?: number
    storageType?: string
    storageCapacity?: number
    os?: string
    screenSize?: number
    batteryCapacity?: number
    warranty?: number
    viewCount?: number
    userId?: number
    model: Model
    category: Category
    createdAt?: string
    modifiedAt?: string
}

export interface Model {
    id: number
    name: string
    slug: string
    brand: Brand
    description?: string
    createdAt?: string
    modifiedAt?: string
}

export interface Brand {
    id: number
    name: string
    slug: string
    description?: string
    createdAt?: string
    modifiedAt?: string
}

export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    createdAt?: string
    modifiedAt?: string
}
