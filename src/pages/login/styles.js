export const Container = {
  display: 'flex',
  width: '100vw',
  height: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
};

export const Video = {
  top: -50,
  right: 0,
  bottom: 0,
  left: 0,
  position: 'fixed',
  width: '100%',
  objectFit: 'cover',
  zIndex: 0,
};

export const Content = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(150, 150, 150, 0.5)',
  marginTop: 20,
  paddingTop: 10,
  paddingBottom: 20,
  paddingLeft: 25,
  paddingRight: 25,
  width: '35%',
  height: 380,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
};

export const ContainerButton = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export const Button = {
  width: 100,
  height: 33,
  borderRadius: 20,
  marginTop: 10,
  backgroundColor: '#609f51',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#d3d3d3',
};

export const TextButton = {
  color: '#fff',
  fontWeight: '500',
  fontSize: 15,
};

export const ContainerSocial = {
  display: 'flex',
  width: 120,
  justifyContent: 'space-around',
  marginTop: 10,
};

export const ContainerError = {
  display: 'flex',
  backgroundColor: '#F66E84',
  width: '100%',
  justifyContent: 'center',
  borderRadius: 2,
};

export const ImgQrCode = {
  width: 100,
  height: 100,
  position: 'fixed',
  zIndex: 3,
  bottom: 30,
  left: 30,
};
