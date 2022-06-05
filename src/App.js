import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';

function App() {
  const [restaurants, setRestaurants] = useState();

  const [loadingTable, setLoadingTable] = useState(true);

  const [showModalDistances, setShowModalDistances] = useState(false);

  const [distances, setDistances] = useState();
  const [loadingDistances, setLoadingDistances] = useState(true);

  //columns of table distances
  const columnsTDistances = [
    {
      key: 'name_res_a',
      label: 'From',
      sorter: false,
      filter: false,
    },
    {
      key: 'name_res_b',
      label: 'To',
      sorter: false,
      filter: false,
    },
    {
      key: 'distance_dis',
      label: 'Distance',
      sorter: false,
      filter: false,
    },
  ];

  //columns of table restaurants
  const columns = [
    {
      key: 'id_res',
      label: 'ID Restaurant',
      sorter: false,
      filter: false,
    },
    {
      key: 'name_res',
      label: 'Name',
      sorter: false,
      filter: false,
    },
  ];

  //API get distance to each restaurant
  const getRestaurantDistances = (id_res) => {
    const data = {
      id_res_a: id_res,
    };

    fetch(`http://localhost:5000/getRestaurantDistances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/JSON' },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.result) {
          //Save distances of DB
          setDistances(resp.distances);
        }
        setLoadingDistances(false);
      })
      .catch(console.warn);
  };

  //API for get all restaurants
  const getRestaurants = () => {
    fetch(`http://localhost:5000/`, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.result) {
          //Save restaurants of DB
          setRestaurants(resp.restaurants);
        }
        setLoadingTable(false);
      })
      .catch(console.warn);
  };

  useEffect(() => {
    getRestaurants();
  }, []);
  return (
    <CContainer>
      <CCard className='m-5'>
        <CCardHeader>Restaurants</CCardHeader>
        <CCardBody>
          <CCardText>
            Press on any restaurant to see the distance it has with others.
          </CCardText>

          {/* For show loader of table restaurants */}
          {loadingTable ? (
            <CRow className='my-3'>
              <CCol sm={12} className='d-flex justify-content-center'>
                <CSpinner color='primary' />
              </CCol>
            </CRow>
          ) : (
            <CRow className='my-3'>
              <CCol sm={12}>
                <CSmartTable
                  activePage={1}
                  clickableRows
                  onRowClick={(item) => {
                    setShowModalDistances(true);
                    getRestaurantDistances(item.id_res);
                  }}
                  columns={columns}
                  columnSorter
                  items={restaurants}
                  itemsPerPageSelect
                  itemsPerPage={5}
                  pagination
                  tableFilter={false}
                  cleaner={false}
                  tableHeadProps={{
                    color: 'primary',
                  }}
                  tableProps={{
                    striped: true,
                    hover: true,
                    responsive: true,
                    bordered: true,
                  }}
                />
              </CCol>
            </CRow>
          )}
        </CCardBody>

        {/* Modal for distances */}
        <CModal
          alignment='center'
          visible={showModalDistances}
          onClose={() => {
            setShowModalDistances(false);
          }}
        >
          <CModalHeader>
            <CModalTitle>Distance to each restaurants</CModalTitle>
          </CModalHeader>
          <CModalBody className='text-center'></CModalBody>
          <CModalFooter>
            <CButton
              color='secondary'
              className='text-white modalBtnConfirmacion'
              onClick={() => {
                setShowModalDistances(false);
              }}
            >
              Cerrar
            </CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </CContainer>
  );
}

export default App;
