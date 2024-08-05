import styled from "@emotion/styled";

interface IDefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: IDefaultLayoutProps) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

export default DefaultLayout;
