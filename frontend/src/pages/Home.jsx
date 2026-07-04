import { useState, useEffect } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FlashSaleSection from '../components/home/FlashSaleSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Section from '../components/ui/Section';
import ProductGrid from '../components/product/ProductGrid';
import { productAPI, categoryAPI } from '../services/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [f, t, fs, bs, cats] = await Promise.all([
          productAPI.featured(),
          productAPI.trending(),
          productAPI.flashSale(),
          productAPI.bestSellers(),
          categoryAPI.list(),
        ]);
        setFeatured(f.data);
        setTrending(t.data);
        setFlashSale(fs.data);
        setBestSellers(bs.data);
        setCategories(cats.data.results || cats.data);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <HeroBanner />

      <Section title="Shop by Category" subtitle="Browse our top categories" viewAllLink="/categories">
        <CategoryGrid categories={categories} loading={loading} />
      </Section>

      <Section title="Featured Products" subtitle="Hand-picked just for you" viewAllLink="/products?filter=featured">
        <ProductGrid products={featured} loading={loading} />
      </Section>

      {(loading || flashSale.length > 0) && <FlashSaleSection products={flashSale} loading={loading} />}

      <Section title="Trending Now" subtitle="What everyone's buying this week" viewAllLink="/products?filter=trending">
        <ProductGrid products={trending} loading={loading} />
      </Section>

      <Section title="Best Sellers" subtitle="Our most loved products" viewAllLink="/products?filter=best_sellers">
        <ProductGrid products={bestSellers} loading={loading} />
      </Section>

      <TestimonialsSection />
    </div>
  );
}
