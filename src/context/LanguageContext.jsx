import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  pt: {
    nav_collections: 'Coleções',
    nav_mansion: 'A Mansão',
    nav_login: 'Entrar',
    nav_profile: 'Perfil',
    nav_logout: 'Sair',
    hero_title: 'O SABOR DA FESTA.',
    hero_subtitle: '0% ESTIMULANTES.',
    hero_vibe: '100% VIBE.',
    hero_desc: 'Projete seu shape sem o caos cardíaco. O Goró é o combustível inexplicável para quem busca performance e redução de danos.',
    hero_cta: 'Projetar Agora',
    cat_title: 'Catálogo Sensorial',
    cat_desc: 'Sabor Energético Original. Inexplicável. Uma curadoria de vibrações líquidas destiladas para a elite do caos.',
    add_to_cart: 'Adicionar ao Carrinho',
    checkout_title: 'Sua Seleção',
    checkout_empty: 'Seu carrinho está vazio',
    checkout_subtotal: 'Subtotal',
    checkout_shipping: 'Frete',
    checkout_shipping_free: 'Cortesia',
    checkout_total: 'Total',
    checkout_delivery: 'Entrega',
    checkout_payment: 'Pagamento',
    checkout_new_card: 'Novo Cartão',
    checkout_save_card: 'Salvar este cartão para compras futuras',
    checkout_finalize: 'Finalizar Pedido',
    checkout_processing: 'Sincronizando Alquimia...',
    profile_title: 'Membro Mansão',
    profile_tab_info: 'Perfil',
    profile_tab_orders: 'Pedidos',
    profile_tab_addr: 'Endereços',
    profile_tab_pay: 'Pagamentos',
    profile_save: 'Salvar Alterações',
    order_id: 'ID do Pedido',
    order_total: 'Total Pago',
    order_empty: 'Nenhum pedido realizado',
    addr_saved: 'Endereços Salvos',
    addr_new: 'Adicionar Novo',
    pay_methods: 'Métodos de Pagamento',
    pay_new: 'Novo Cartão',
    loading: 'CARREGANDO_SESSÃO...',
    success_title: 'Pedido Confirmado',
    success_desc: 'Sua jornada sensorial começou. Prepare-se para elevar sua experiência ao nível Mansão.',
    success_cta: 'Ver meus pedidos',
    back_to_catalog: 'Retornar ao Catálogo'
  },
  en: {
    nav_collections: 'Collections',
    nav_mansion: 'The Mansion',
    nav_login: 'Log In',
    nav_profile: 'Profile',
    nav_logout: 'Logout',
    hero_title: 'THE FLAVOR OF THE PARTY.',
    hero_subtitle: '0% STIMULANTS.',
    hero_vibe: '100% VIBE.',
    hero_desc: 'Design your shape without cardiac chaos. Goró is the inexplicable fuel for those seeking performance and harm reduction.',
    hero_cta: 'Design Now',
    cat_title: 'Sensory Catalog',
    cat_desc: 'Original Energetic Flavor. Inexplicable. A curation of liquid vibrations distilled for the elite of chaos.',
    add_to_cart: 'Add to Cart',
    checkout_title: 'Your Selection',
    checkout_empty: 'Your cart is empty',
    checkout_subtotal: 'Subtotal',
    checkout_shipping: 'Shipping',
    checkout_shipping_free: 'Complimentary',
    checkout_total: 'Total',
    checkout_delivery: 'Delivery',
    checkout_payment: 'Payment',
    checkout_new_card: 'New Card',
    checkout_save_card: 'Save this card for future purchases',
    checkout_finalize: 'Finalize Order',
    checkout_processing: 'Syncing Alchemy...',
    profile_title: 'Mansion Member',
    profile_tab_info: 'Profile',
    profile_tab_orders: 'Orders',
    profile_tab_addr: 'Addresses',
    profile_tab_pay: 'Payments',
    profile_save: 'Save Changes',
    order_id: 'Order ID',
    order_total: 'Total Paid',
    order_empty: 'No orders yet',
    addr_saved: 'Saved Locations',
    addr_new: 'Add New',
    pay_methods: 'Payment Methods',
    pay_new: 'New Card',
    loading: 'LOADING_SESSION...',
    success_title: 'Order Confirmed',
    success_desc: 'Your sensory journey has begun. Prepare to elevate your experience to the Mansion level.',
    success_cta: 'View my orders',
    back_to_catalog: 'Back to Catalog'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'pt');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
