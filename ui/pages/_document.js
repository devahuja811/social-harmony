import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    
    render() {
        console.log("Rendering document");
        return (
            <Html>
                <Head>
                    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument