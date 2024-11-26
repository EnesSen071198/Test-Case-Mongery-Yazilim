import { useState } from "react";
import "./App.css";
import Data from "./data/orders.json";

const App = () => {
  // Filtreleme için başlangıç değerleri
  const [selectedOrder, setSelectedOrder] = useState("Tüm Siparişler");
  const [selectedProduct, setSelectedProduct] = useState("Tüm Ürünler");

  // JSON içindeki 'customer' alanını parse ediyoruz ve yeni hesaplamaları ekliyoruz
  const parsedOrders = Data.orders.map((order) => {
    const customer = JSON.parse(order.customer); // 'customer' stringini JSON nesnesine çevir
    return {
      ...order,
      customer: customer.companyname, // 'companyname' değerini al
      cost: order.cost || 0 // Maliyet verisi ekliyoruz (varsayılan 0)
    };
  });

  // Sipariş numarasına göre filtreleme
  const filteredOrders = parsedOrders.filter((order) => {
    const matchesOrder =
      selectedOrder === "Tüm Siparişler" ||
      order.order_number === selectedOrder;

    const matchesProduct =
      selectedProduct === "Tüm Ürünler" ||
      order.products.some((product) =>
        product.toLowerCase().includes(selectedProduct.toLowerCase())
      );

    return matchesOrder && matchesProduct;
  });

  // Sipariş numaralarını seçmek için liste oluşturuyoruz
  const orderNumbers = [
    ...new Set(parsedOrders.map((order) => order.order_number))
  ];
  orderNumbers.unshift("Tüm Siparişler"); // "Tüm Siparişler" seçeneğini başa ekliyoruz

  // Ürünleri seçmek için liste oluşturuyoruz
  const allProducts = [
    ...new Set(parsedOrders.flatMap((order) => order.products))
  ];
  allProducts.unshift("Tüm Ürünler"); // "Tüm Ürünler" seçeneğini başa ekliyoruz

  return (
    <>
      <div className='filters'>
        <div>
          <label>Fatura Numarası: </label>
          <select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}>
            {orderNumbers.map((order, index) => (
              <option key={index} value={order}>
                {order}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Ürün: </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}>
            {allProducts.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='grid-container'>
        {/* Filtreleme UI */}

        {/* Tablo Başlıkları */}
        <div className='grid-header'>
          <div>Müşteri</div>
          <div>Fatura Numarası</div>
          <div>Toplam Miktar</div>
          <div>Toplam Tutar</div>
          <div>Toplam Maliyet</div>
          <div>Toplam Karlılık</div>
          <div>Net Kar</div> {/* Net Kar'ı Toplam Karlılık'ın yanına taşıdık */}
        </div>

        {/* Filtrelenmiş Veriler */}
        {filteredOrders.map((order, index) => {
          const totalProfit = order.total_with_tax - order.cost; // Toplam karlılık hesaplama
          const netProfit = order.total_with_tax - order.subtotal; // Net kar hesaplama

          return (
            <div className='grid-row' key={index}>
              <div>{order.customer}</div>
              <div>{order.order_number}</div>
              <div>{order.subtotal.toFixed(2)} TL</div>
              <div>{order.total_with_tax.toFixed(2)} TL</div>
              <div>{order.cost.toFixed(2)} TL</div>
              <div>{totalProfit.toFixed(2)} TL</div> {/* Toplam karlılık */}
              <div>{netProfit.toFixed(2)} TL</div> {/* Net kar */}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
