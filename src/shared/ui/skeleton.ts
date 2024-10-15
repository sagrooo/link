import styled, { keyframes } from "styled-components";

const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

type Props = {
  height?: string;
  width?: string;
};

export const Skeleton = styled.div<Props>`
  display: block;
  height: ${({ height }) => height || "14px"};
  width: ${({ width }) => width || "80%"};
  animation: ${skeletonKeyframes} 1300ms ease-in-out infinite;
  background-color: #eee;
  background-image: linear-gradient(90deg, #eee, #f5f5f5, #eee);
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
`;
