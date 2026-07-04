import { useState, useEffect } from 'react';
import CategoryGrid from '../components/home/CategoryGrid';
import { categoryAPI } from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryAPI.list().then((res) => setCategories(res.data.results || res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="section-title">Shop by Category</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Explore our full range of product categories</p>
      </div>
      <CategoryGrid categories={categories} loading={loading} />
    </div>
  );
}
