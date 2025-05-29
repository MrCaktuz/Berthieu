import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Photos du mariage Berthieu."
          />
          <meta property="og:site_name" content="Berthieu" />
          <meta
            property="og:description"
            content="Photos du mariage Berthieu."
          />
          <meta property="og:title" content="Berthieu" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Berthieu" />
          <meta
            name="twitter:description"
            content="Photos du mariage Berthieu."
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
