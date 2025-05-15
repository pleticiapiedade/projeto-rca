import * as S from "./Styled";
import { CategoryProps } from "@/types";
import { CATEGORIES, CATEGORY } from "@/constants/systemRoutes";

// import Mercearia from "@/assets/images/categories/mercearia.png";
// import Bebidas from "@/assets/images/categories/bebidas.webp";
// import HigieneBeleza from "@/assets/images/categories/higiene-beleza.png";
// import Limpeza from "@/assets/images/categories/limpeza.png";
// import Bazar from "@/assets/images/categories/bazar.png";
// import PetShop from "@/assets/images/categories/pet.png";

const Mercearia = `${process.env.PUBLIC_URL}/mercearia.png`;
const Bebidas = `${process.env.PUBLIC_URL}/bebidas.webp`;
const HigieneBeleza = `${process.env.PUBLIC_URL}/higiene-beleza.png`;
const Limpeza = `${process.env.PUBLIC_URL}/limpeza.png`;
const Bazar = `${process.env.PUBLIC_URL}/bazar.png`;
const PetShop = `${process.env.PUBLIC_URL}/pet.png`;

const mountCategory = (
  DE_CATEGORIA: string,
  IMAGE: string,
  COD_CATEGORIA: number
): CategoryProps => ({
  COD_CATEGORIA,
  IMAGE,
  DE_CATEGORIA,
});

const RenderProducts = () => {
  const categories = [
    mountCategory("Mercearia", Mercearia, 1702),
    mountCategory("Bebidas", Bebidas, 1666),
    mountCategory("Higiene e Beleza", HigieneBeleza, 1816),
    mountCategory("Limpeza", Limpeza, 2186),
    mountCategory("Bazar", Bazar, 2226),
    mountCategory("Pet Shop", PetShop, 1866),
  ] as CategoryProps[];

  const mountLink = (id?: number) => CATEGORY?.link?.replace(":id", `${id}`);

  return (
    <>
      <S.SpaceBetween>
        <S.Title>Categorias</S.Title>
        <S.SeeAllButton to={CATEGORIES.link}>Ver todas</S.SeeAllButton>
      </S.SpaceBetween>

      <S.ContainerCategory>
        <S.ContentCategory>
          {categories.map((categorie: CategoryProps) => (
            <S.BoxCategoryImg
              to={mountLink(categorie.COD_CATEGORIA)}
              key={`categorie-${categorie.DE_CATEGORIA}`}
              data-test={`home-category-link-${categorie.COD_CATEGORIA}`}
            >
              <S.CategoryImg
                src={categorie.IMAGE}
                alt={categorie.DE_CATEGORIA}
              />

              <S.CategoryDescription>
                {categorie.DE_CATEGORIA}
              </S.CategoryDescription>
            </S.BoxCategoryImg>
          ))}
        </S.ContentCategory>
      </S.ContainerCategory>
    </>
  );
};

export default RenderProducts;
