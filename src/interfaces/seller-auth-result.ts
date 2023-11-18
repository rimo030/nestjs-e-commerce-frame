import { ProductBundleEntity } from 'src/entities/product-bundle.entity';

export interface SellerAuthResult {
  email: string;
  name: string;
  phone: string;
  businessNumber: string;
  productBundles: ProductBundleEntity[];
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
