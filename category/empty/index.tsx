import * as S from "./styles";

interface Props {
  text?: string;
}

const Empty = ({ text }: Props) => {
  const instructions = [
    "Verifique os termos digitados ou filtros selecionados.",
    "Utilize termos genéricos na busca.",
    "Tente outra vez com termos menos específicos.",
    "Faça buscas relacionadas",
  ];
  return (
    <S.EmptyContent>
      <S.Row>
        <S.SearchIcon size={86} />
      </S.Row>

      <S.Title>Ops!</S.Title>

      <S.Text>
        Infelizmente não encontramos nenhum resultado para
        {<S.TextSearchTerm>{text ? `‘${text}‘` : "a busca"}</S.TextSearchTerm>}
      </S.Text>

      <S.Question>O que você deve fazer?</S.Question>

      {instructions.map((i) => (
        <S.Instruction key={i}>- {i}</S.Instruction>
      ))}
    </S.EmptyContent>
  );
};

export default Empty;
