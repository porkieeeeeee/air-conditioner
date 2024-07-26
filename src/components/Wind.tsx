import styled from "@emotion/styled";

const Wind = () => {
    const lines = Array.from({ length: 4 }, (_, index) => ({
        d: `M${150 + index * 50},0 
            C${100 + index * 50},100, ${200 + index * 50},100, ${150 + index * 50},200 
            C${100 + index * 50},300, ${200 + index * 50},300, ${150 + index * 50},400
            C${100 + index * 50},500, ${200 + index * 50},500, ${150 + index * 50},600`,
    }));

    return (
        <Line width='400px' height='400px' viewBox='0 0 400 400' version='1.1'>
            {lines.map((line, index) => (
                <path key={index} className='st0' d={line.d} />
            ))}
        </Line>
    );
};

const Line = styled.svg`
    position: absolute;
    width: 400px;
    height: 400px;
    fill: none;
    stroke: #74c0fc;
    stroke-width: 10px;
    stroke-linecap: round;
    filter: blur(12px);

    animation: line 2s linear infinite;

    @keyframes line {
        from {
            stroke-dasharray: 150 1200;
            stroke-dashoffset: 1300;
        }
        to {
            stroke-dasharray: 200 1200;
            stroke-dashoffset: 700;
        }
    }
`;

export default Wind;
