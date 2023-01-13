import ComponentPageError from "../pages/erro";

export default function error404() {
  // window.location.href =
  //   "/erro?msg=A página que você tentou acessar não foi encontrada!";
  return (
    <ComponentPageError msg="A página que você tentou acessar não foi encontrada!" />
  );
}
