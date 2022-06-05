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
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';

function App() {
  //For save restaurants
  const [restaurants, setRestaurants] = useState();

  //For show loader in table restaurants
  const [loadingTable, setLoadingTable] = useState(true);

  //For show modal
  const [showModalDistances, setShowModalDistances] = useState(false);

  //Save the distances
  const [distances, setDistances] = useState();
  //For show loader in table distances
  const [loadingDistances, setLoadingDistances] = useState(true);

  //For show loader when upload the distances
  const [loadingSaveDistance, setLoadingSaveDistance] = useState(false);

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
      key: 'distances',
      label: 'Distance',
      sorter: false,
      filter: false,
      _props: { colSpan: 2 },
    },
  ];

  //columns of table restaurants
  const columnsTRestaurants = [
    {
      key: 'name_res',
      label: 'Restaurant',
      sorter: false,
      filter: false,
    },
  ];

  //API get distance to each restaurant
  const getRestaurantDistances = (id_res) => {
    setDistances();
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
    fetch(`http://localhost:5000/getRestaurants`, {
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

  //API for insert distance between restaurants
  const onChangeDistance = (id_res_a, id_res_b, e) => {
    setLoadingSaveDistance(true);
    const data = {
      id_res_a: id_res_a,
      id_res_b: id_res_b,
      distance_dis: e.target.value,
    };

    fetch(`http://localhost:5000/insertDistance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/JSON' },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setLoadingSaveDistance(false);
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
                  columns={columnsTRestaurants}
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
          <CModalBody className='text-center'>
            {/* For show loader of table distances */}
            {loadingDistances ? (
              <CRow className='my-3'>
                <CCol sm={12} className='d-flex justify-content-center'>
                  <CSpinner color='primary' />
                </CCol>
              </CRow>
            ) : (
              <CRow>
                {loadingSaveDistance && (
                  <CCol sm={12} className='d-flex justify-content-center'>
                    <CSpinner color='primary' />
                  </CCol>
                )}
                <CCol sm={12}>
                  <CSmartTable
                    activePage={1}
                    columns={columnsTDistances}
                    columnSorter
                    items={distances}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    pagination
                    tableFilter={false}
                    cleaner={false}
                    tableHeadProps={{
                      color: 'primary',
                    }}
                    scopedColumns={{
                      distances: (item) => {
                        return (
                          <td className='text-center border-0 '>
                            <CInputGroup>
                              <CFormInput
                                id={
                                  'distance_dis' + item.id_res_a + item.id_res_b
                                }
                                type='number'
                                color='secondary'
                                shape='square'
                                size='sm'
                                title='Ver foto'
                                defaultValue={item.distance_dis}
                                placeholder={
                                  item.distance_dis == 'Unknown' &&
                                  item.distance_dis
                                }
                                onChange={(e) => {
                                  onChangeDistance(
                                    item.id_res_a,
                                    item.id_res_b,
                                    e
                                  );
                                }}
                              />
                              <CInputGroupText>{item.unit_uni}</CInputGroupText>
                            </CInputGroup>
                          </td>
                        );
                      },
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
          </CModalBody>
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
