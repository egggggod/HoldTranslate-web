import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  return (
    <Html lang="en" className="dark">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#060913" />
        <link rel="icon" type="image/png" href={`${basePath}/icons/icon48.png`} />
        <link rel="apple-touch-icon" href={`${basePath}/icons/icon128.png`} />
        <meta
          name="description"
          content="HoldTranslate — Immersive long-press instant web translation & smooth restoration for Google Chrome."
        />
      </Head>
      <body className="bg-[#060913] text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
