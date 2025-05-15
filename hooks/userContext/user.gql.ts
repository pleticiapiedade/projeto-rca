import { gql } from "@apollo/client";

export const GET_CUSTOMER_DATA = gql`
    query getCustomer{
        customer{
            email
            firstname
            lastname
            personal_phone
            taxvat
            taxvat
            addresses{
                id
            }
        }
    }
`;
const query = {
    getCustomerQuery: GET_CUSTOMER_DATA
};
export default query;