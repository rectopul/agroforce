const newrelic = require('newrelic');

import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html, Head, Main, NextScript,
} from 'next/document';

import Script from 'next/script';


type DocumentProps = {
  browserTimingHeader: string
}

export default class MyDocument extends Document<DocumentProps> {

  /*
   * @see
   * caso tenha o erro Object literal may only specify known properties, and 'browserTimingHeader' does not exist in type 'DocumentInitialProps'.
   * voce pode resolver o erro de tipo com *TIPOS DE INTERSEÇÃO* para declarar explicitamente o tipo do valor de retorno da função.
   * TROQUE: Promise<DocumentInitialProps>
   * POR: Promise<DocumentInitialProps & { browserTimingHeader: string }>
   * https://github.com/newrelic/newrelic-node-nextjs
   * https://github.com/newrelic-experimental/newrelic-nextjs-integration
   **/
  
  // iniciando pre-renderização do newrelic
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & { browserTimingHeader: string }> {
    const initialProps = await Document.getInitialProps(ctx);

    const browserTimingHeader:any = newrelic.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
    });

    return {
      ...initialProps,
      browserTimingHeader,
    };
  }

  render() {
    const { browserTimingHeader } = this.props
    
    return (
      <Html lang="pt-BR">
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>

          <meta name="description" content="Generated by create next app"/>
          <link rel="icon" href="/images/logo.png"/>

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          
          <link rel="shortcut icon" href="/images/logo.png" type="image/png"/>

          {/*<script  type="text/javascript" dangerouslySetInnerHTML={{ __html: this.props.browserTimingHeader }} />*/}
          
        </Head>
        <body style={{maxWidth: "1366px", height: "100%"}}>
        <Main/>
        <NextScript/>
        <Script
          dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
          strategy="beforeInteractive"
        ></Script>
        </body>
      </Html>
    );
  }
}
