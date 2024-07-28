import styled from "@emotion/styled";
import Room from "components/Room";

const MainPage = () => {
  return (
    <Container>
      <Room />
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export default MainPage;
