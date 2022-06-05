import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CButton,
} from '@coreui/react';

function App() {
  useEffect(() => {}, []);
  return (
    <CContainer>
      <CCard className='m-5'>
        <CCardHeader>Restaurants</CCardHeader>
        <CCardBody></CCardBody>
      </CCard>
    </CContainer>
  );
}

export default App;
