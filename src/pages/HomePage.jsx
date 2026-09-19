import { useEffect, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Story from '../components/Story'
import Highlights from '../components/Highlights'
import Gallery from '../components/Gallery'
import MenuSection from '../components/MenuSection'
import ProductModal from '../components/ProductModal'
import Calculator from '../components/Calculator'
import ComboSection from '../components/ComboSection'
import PromoBanner from '../components/PromoBanner'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import ScrollToTop from '../components/ScrollToTop'
import FloatingCallButton from '../components/FloatingCallButton'
import { getSiteContent, loadSyncedMenu } from '../utils/storage'

export default function HomePage(){
 const [products,setProducts]=useState({}),[searchQuery,setSearchQuery]=useState(''),[activeProductId,setActiveProductId]=useState(null),[content,setContent]=useState(getSiteContent)
 useEffect(()=>{const refresh=()=>{setProducts(loadSyncedMenu());setContent(getSiteContent())};refresh();window.addEventListener('lymap-products',refresh);window.addEventListener('lymap-content',refresh);return()=>{window.removeEventListener('lymap-products',refresh);window.removeEventListener('lymap-content',refresh)}},[])
 useEffect(()=>{document.title=content.seo?.title||content.brandName||'Lý Mập Food';let meta=document.querySelector('meta[name="description"]');if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}meta.content=content.seo?.description||''},[content])
 const s=content.sections||{}, activeItem=activeProductId?products[activeProductId]:null
 return <><AnnouncementBar/><Header onSearch={setSearchQuery}/><main className="pt-[100px]">{s.hero!==false&&<Hero/>}{content.promo?.enabled!==false&&<PromoBanner/>}{s.story!==false&&<Story/>}{s.highlights!==false&&<Highlights/>}{s.gallery!==false&&<Gallery/>}{s.menu!==false&&<MenuSection products={products} searchQuery={searchQuery} onOpenDetail={setActiveProductId}/>} {s.calculator!==false&&<Calculator/>}{s.combos!==false&&<ComboSection/>}{s.faq!==false&&<FAQ/>}{s.contact!==false&&<Contact/>}</main><Footer/>{activeItem&&<ProductModal item={activeItem} products={products} onClose={()=>setActiveProductId(null)} onOpenDetail={setActiveProductId}/>}<CartDrawer/><ScrollToTop/><FloatingCallButton/></>
}
