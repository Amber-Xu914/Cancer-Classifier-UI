import { renderToStaticMarkup } from 'react-dom/server';

const convertSVGToDataURI = (svg: React.ReactElement): string => {
  const markup = renderToStaticMarkup(svg);
  const encoded = encodeURIComponent(markup);
  const dataUri = `url('data:image/svg+xml;utf8,${encoded}')`;
  return dataUri;
};

export default convertSVGToDataURI;
