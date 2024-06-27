import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    group: "",
    phone: "",
    favorite: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const groups = ["Male", "Female"];

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students"));
    if (storedStudents) {
      setStudents(storedStudents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEditing) {
      const updatedStudents = students.map((student) =>
        student.id === currentStudentId ? { ...formData } : student
      );
      setStudents(updatedStudents);
      toast.success("Contact successfully updated!");
    } else {
      setStudents([...students, { ...formData, id: uuidv4() }]);
      toast.success("Contact successfully added!");
    }

    setShowModal(false);
    setIsEditing(false);
    setCurrentStudentId(null);
    setIsLoading(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      group: "",
      phone: "",
      favorite: false,
    });
    setIsEditing(false);
    setCurrentStudentId(null);
  };

  const handleEdit = (student) => {
    setFormData({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      group: student.group,
      phone: student.phone,
      favorite: student.favorite,
    });
    setCurrentStudentId(student.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);

    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);

    setIsLoading(false);
    toast.error("Contact successfully deleted!");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupFilterChange = (e) => {
    setFilterGroup(e.target.value);
  };

  const toggleFavorite = (id) => {
    const updatedStudents = students.map((student) =>
      student.id === id ? { ...student, favorite: !student.favorite } : student
    );
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter((student) => {
    return (
      (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.group.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterGroup === "" || student.group === filterGroup)
    );
  });

  const filteredFavoriteStudents = students.filter(
    (student) =>
      student.favorite &&
      (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.group.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterGroup === "" || student.group === filterGroup)
  );

  return (
    <div className="container max-w-7xl mx-auto mt-4">
      <ToastContainer />
      <div className="btns-search d-flex items-center">
        <Row className="mt-3 ">
          <Col>
            <InputGroup>
              <FormControl
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-white w-75 bg-opacity-75 text-black search "
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Select
              value={filterGroup}
              onChange={handleGroupFilterChange}
              className="all-groups bg-white text-black bg-opacity-75 "
            >
              <option value="">All contacts</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <div className="mt-3">
          <Button
            variant={activeTab === "all" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("all")}
            className="mx-2"
          >
            All contacts
          </Button>
          <Button
            variant={activeTab === "favorites" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("favorites")}
            className="mx-2"
          >
            Favorite contacts ❤️
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={openModal}
          className="mt-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            "+ Add Contact"
          )}
        </Button>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr className="bg-white bg-opacity-75 text-black">
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(activeTab === "all"
            ? filteredStudents
            : filteredFavoriteStudents
          ).map((student) => (
            <tr key={student.id} className="bg-white bg-opacity-75 text-black">
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.phone}</td>
              <td>{student.group}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEdit(student)}
                  disabled={isLoading}
                  className="edit-btn mx-1 bg-yellow-500 text-white"
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    "Edit"
                  )}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(student.id)}
                  disabled={isLoading}
                  className="delete-btn mx-1 bg-red-600 text-white"
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    "Delete"
                  )}
                </Button>
                <Button
                  variant={student.favorite ? "danger" : "outline-danger"}
                  onClick={() => toggleFavorite(student.id)}
                  className="mx-1"
                >
                  {student.favorite ? "🤍" : "❤️"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Contact" : "Add Contact"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGroup">
              <Form.Label>Group</Form.Label>
              <Form.Select
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                required
                className="all-groups bg-white bg-opacity-75 text-black mb-3 w-36"
              >
                <option value="">Select group</option>
                {groups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : isEditing
                ? "Update Contact"
                : "Add Contact"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
