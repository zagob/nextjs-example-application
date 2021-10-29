import { GetServerSideProps } from "next";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Title } from "../styles/pages/Home";
import { client } from "@/lib/prismic";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

// interface IProduct {
//   id: string;
//   title: string;
// }

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  async function handleSum() {
    const math = (await import("../lib/math")).default;
    math.sum(3, 4);
  }
  return (
    <div>
      <SEO
        title="DevCommerce, o seu e-commerce"
        shouldExcludeTitleSuffix
        image="og.png"
      />
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map((recommendedProduct) => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* <button onClick={handleSum}>Sum!</button> */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);
  // const response = await fetch(`${process.env.API_URL}/recommended`);
  // const recommendedProducts = await response.json();
  console.log(recommendedProducts);
  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
