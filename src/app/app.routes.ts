import {Routes} from '@angular/router';
import {AdminComponent} from './features/admin/admin.component';
import {DashboardComponent} from './features/admin/dashboard/dashboard.component';
import {OrdersComponent} from './features/admin/orders/orders.component';
import {AdminProductsComponent} from './features/admin/products/admin-products.component';
import {ProfileAdminComponent} from './features/admin/profile/profile.component';
import {DetailsComponent} from './features/admin/users/userdetails/userdetails.component';
import {UsersComponent} from './features/admin/users/users.component';
import {LandingComponent} from './features/landing/landing.component';
import {ProductDetailsComponent} from './features/product-details/product-details.component';
import {UserComponent} from './features/user/user.component';
import {authGuard} from './guard/auth.guard';
import {Role} from './types/role.type';
import {AdminProductDetailsComponent} from "./features/admin/products/productdetails/admin-product-details.component";
import {BrandsComponent} from "./features/admin/brands/brands.component";
import {ModelsComponent} from "./features/admin/models/models.component";
import {CategoriesComponent} from "./features/admin/categories/categories.component";
import {BrandDetailsComponent} from "./features/admin/brands/brand-details/brand-details.component";
import {CategoryDetailsComponent} from "./features/admin/categories/category-details/category-details.component";
import {ModelDetailsComponent} from "./features/admin/models/model-details/model-details.component";
import {HomeComponent} from "./features/home/home.component";
import {CartComponent} from "./features/cart/cart.component";
import {NotfoundComponent} from "./components/notfound/notfound.component";
import {ForbiddenComponent} from "./components/forbidden/forbidden.component";
import {PaymentComponent} from "./features/payment/payment.component";
import {LoginComponent} from "./features/login/login.component";
import {RegisterComponent} from "./features/register/register.component";
import {ForgotComponent} from "./features/forgot/forgot.component";
import {TransactionsComponent} from "./features/admin/transactions/transactions.component";
import {SearchComponent} from "./features/search/search.component";

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'may-tinh-xach-tay/:slug',
        component: ProductDetailsComponent,
      },
      {
        path: 'may-tinh-xach-tay',
        component: SearchComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'users',
        component: UserComponent,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            component: UserComponent,
          },
        ],
      },
      {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    data: {
      expectedRoles: [Role.ADMIN, Role.STAFF],
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          expectedRoles: [Role.ADMIN],
        }
      },
      {
        path: 'brands',
        component: BrandsComponent,
      },
      {
        path: 'brands/:slug',
        component: BrandDetailsComponent,
      },
      {
        path: 'models',
        component: ModelsComponent,
      },
      {
        path: 'models/:slug',
        component: ModelDetailsComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'categories/:slug',
        component: CategoryDetailsComponent,
      },
      {
        path: 'products',
        component: AdminProductsComponent,
      },
      {
        path: 'products/:slug',
        component: AdminProductDetailsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          expectedRoles: [Role.ADMIN],
        }
      },
      {
        path: 'users/:id',
        component: DetailsComponent,
      },
      {
        path: 'profile',
        component: ProfileAdminComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        data: {
          expectedRoles: [Role.ADMIN],
        }
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotComponent,
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];
