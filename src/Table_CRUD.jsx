import React, { Fragment, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/CRUD.css';

function Table_CRUD() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isActive, setIsActive] = useState(0);

  const [editID, setEditID] = useState('');
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editIsActive, setEditIsActive] = useState(0);

  const empData = [
    {
      id: 1,
      name: 'NQN',
      age: 20,
      isActive: 1,
    },
    {
      id: 2,
      name: 'Nguyen',
      age: 18,
      isActive: 0,
    },
    {
      id: 3,
      name: 'David',
      age: 32,
      isActive: 1,
    },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    getDataAPI();
  }, []);

  const getDataAPI = () => {
    axios
      .get('http://localhost:5090/api/Employee')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSave = () => {
    const url = `http://localhost:5090/api/Employee`;
    const data = {
      name: name,
      age: age,
      isActive: isActive,
    };

    axios
      .post(url, data)
      .then((result) => {
        getDataAPI();
        clear();
        toast.success('Employee has been added');
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`http://localhost:5090/api/Employee/${id}`)
      .then((result) => {
        if (result.status === 200) {
          setEditName(result.data.name);
          setEditAge(result.data.age);
          setEditIsActive(result.data.isActive);
          setEditID(id);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleUpdate = () => {
    const url = `http://localhost:5090/api/Employee/${editID}`;
    const data = {
      id: editID,
      name: editName,
      age: editAge,
      isActive: editIsActive,
    };

    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getDataAPI();
        clear();
        toast.success('Employee has been Updated');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete this?') == true) {
      axios
        .delete(`http://localhost:5090/api/Employee/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success('Employee has been Deleted');
            getDataAPI();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };
  const clear = () => {
    setName('');
    setAge('');
    setIsActive(0);
    setEditName('');
    setEditAge('');
    setEditIsActive(0);
    setEditID('');
  };
  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setIsActive(1);
    } else {
      setIsActive(0);
    }
  };
  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditIsActive(1);
    } else {
      setEditIsActive(0);
    }
  };

  return (
    <div>
      <Fragment>
        <ToastContainer />
        <Container className='table-wrapper mb-5'>
          <Row className='align-items-center'>
            <Col>
              <input
                type='text'
                className='form-control'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type='text'
                className='form-control'
                placeholder='Enter Age'
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Col>
            <Col xs='auto' className='d-flex align-items-center'>
              <input
                type='checkbox'
                className='custom-checkbox'
                checked={isActive === 1 ? true : false}
                onChange={(e) => handleActiveChange(e)}
                value={isActive}
              />
              <label className='ms-2'>IsActive</label>
            </Col>
            <Col className='ms-5'>
              <button
                className='btn btn-primary btn-custom'
                onClick={() => handleSave()}
              >
                Submit
              </button>
            </Col>
          </Row>
        </Container>
        <Table striped bordered hover className='custom-table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>isActive</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0
              ? data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.isActive}</td>
                      <td colSpan={2}>
                        <button
                          className='btn btn-primary btn-custom'
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </button>{' '}
                        &nbsp;
                        <button
                          className='btn btn-danger btn-custom'
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : 'Loading...'}
          </tbody>
        </Table>
        <Modal
          show={show}
          onHide={handleClose}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Modify / Update Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter Name'
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </Col>
              <Col>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter Age'
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                />
              </Col>
              <Col className='d-flex align-items-center'>
                <input
                  type='checkbox'
                  className='custom-checkbox'
                  checked={editIsActive === 1 ? true : false}
                  onChange={(e) => handleEditActiveChange(e)}
                  value={editIsActive}
                />
                <label className='ms-2'>IsActive</label>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={handleClose}
              className='btn-custom'
            >
              Close
            </Button>
            <Button
              variant='success'
              onClick={handleUpdate}
              className='btn-custom'
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    </div>
  );
}

export default Table_CRUD;
