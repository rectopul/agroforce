import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 999;
  background-color: '#fff';
  padding: 10px 15px;
  height: 100%;
  width: 100%;
  opacity: 0.8;

  @supports (backdrop-filter: blur(10px)) or (--webkit-backdrop-filter: blur(10px)) {
    & {
      background-color: rgba(255, 255, 255, 1);
      backdrop-filter: blur(10px);
    }
  }

  /* backdrop-filter: drop-shadow(4px 4px 10px blue) brightness(60%) saturate(1%) blur(30px);
  -webkit-backdrop-filter: drop-shadow(4px 4px 10px blue) brightness(60%) saturate(1%) blur(30px); */
`;

export const Spinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${(props) => (props.color ? props.color : '#00567B')};
  border-radius: 50%;
  width: ${(props) => (props.size ? props.size : 30)}px;
  height: ${(props) => (props.size ? props.size : 30)}px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Text = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #000;
  margin-top: 20px;
`;