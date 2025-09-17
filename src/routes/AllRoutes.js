import { Route, Routes } from "react-router-dom";
import { HomePage,ProductsPage,LoginPage,SignupPage,CartPage,CheckoutPage,OrderSuccessPage,OrdersPage,OrderDetailsPage,SingleProductPage,WishlistPage,AccountPage,SearchPage,LoginSecurityPage,AddressesPage,CustomerServicePage } from "../pages";


export const AllRoutes = () => {
  return (
    <main>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/products" element={<ProductsPage/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/checkout" element={<CheckoutPage/>} />
      <Route path="/success" element={<OrderSuccessPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailsPage />} />
      <Route path="/products/:id" element={<SingleProductPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/account/addresses" element={<AddressesPage />} />
      <Route path="/account/security" element={<LoginSecurityPage />} />
      <Route path="/help" element={<CustomerServicePage />} />
    </Routes>
    </main>
  );
}
 