import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from 'next/link';
import { useRouter } from "next/router";
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

// interface IProduct {
//   id: string;
//   title: string;
// }

interface Top10Props {
  category: Document;
  products: Document[];
}

export default function Category({ category, products }) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>
  }
  return (
    <>
      <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>
      <ul>
        {products.map((product) => {
          return (
            <li key={product.id}>
                <Link href={`/catalog/products/${product.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(product.data.title)}
                  </a>
                </Link>
              </li>
          );
        })}
      </ul>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const response = await fetch(`http://localhost:3333/categories`);
  // const categories = await response.json();

  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
  ])

  const paths = categories.results.map((category) => {
    return {
      params: { slug: category.uid },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ])

  // LOCAL -------------
  // const response = await fetch(
  //   `http://localhost:3333/products?category_id=${slug}`
  // );
  // const products = await response.json();

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 10,
  };
};
