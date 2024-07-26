import styled from "@emotion/styled";
import AirConditioner from "components/AirConditioner";

const MainPage = () => {
    return (
        <Container>
            <AirConditioner />
        </Container>
    );
};
const Container = styled.div`
    width: 100%;
    height: 100%;
`;

export default MainPage;
