import { useEffect } from 'react';
import { CreadorBlog } from '../components/CreadorBlog';

export function BlogPage() {
  useEffect(() => {
    document.title = 'Blog - Admin | HuertoHogar';
  }, []);

  return (
    <div className="container">
      <CreadorBlog />
    </div>
  );
}
