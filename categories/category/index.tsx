import * as S from "./Styled";
import { CategoryProps } from "@/types";
import { SUBCATEGORIES, CATEGORY } from "@/constants/systemRoutes";

interface Props {
  category: CategoryProps;
}

const RenderCategory = ({ category }: Props) => {
  const Label = (
    <>
      <S.Name $bold={`${category.bold || ""}`}>
        {category.DE_CATEGORIA}
        {category.isLive && <S.LiveTag>ao vivo</S.LiveTag>}
      </S.Name>
      {(category.link || category.children) && <S.Arrow size={22} />}
    </>
  );

  if (category.link) {
    return (
      <S.LinkTo
        target="_blank"
        href={category.link}
        data-test={`component-category-link-${category.COD_CATEGORIA}`}
      >
        {Label}
      </S.LinkTo>
    );
  }

  const { COD_CATEGORIA, PATH_CATEGORIA, IMAGE } = category;
  const hasChild = category.children;
  const page = hasChild ? SUBCATEGORIES : CATEGORY;
  const [path] = page.link.split(":");
  const link = `${path}${PATH_CATEGORIA || COD_CATEGORIA}`;

  return (
    <S.NavLink
      to={link}
      data-test={`component-category-link-${category.COD_CATEGORIA}`}
    >
      {Label}
      {IMAGE && <S.Image src={IMAGE} alt={category.DE_CATEGORIA} />}
    </S.NavLink>
  );
};

export default RenderCategory;
