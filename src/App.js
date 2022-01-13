import { useEffect, useState } from "react"
import moment from "moment"


import { Container, ListGroup, Spinner } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'


const App = () => {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [ranks, setRanks] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (ranks.length) {
      setLoading(false)
    }
  }, [ranks])

  const fetchData = async () => {
    const request = await fetch(`https://edusign-backend.herokuapp.com/`)
    const response = await request.json()
    
    setCourses(response.courses)
    setStudents(response.students)
    setRanks(response.ranks) 
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center pt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <Container className="mt-5 mb-5">
      <h2>🏆 Classement retards 🏆</h2>
      <ListGroup className="mb-5">
        {ranks.map(rank => (
          <ListGroup.Item key={rank.lastName}>
            <p>
              <b>
                {rank.rank === 1 && `🥇`}
                {rank.rank === 2 && `🥈`}
                {rank.rank === 3 && `🥉`}
                {rank.rank}
              </b>
              {` `}
              {rank.firstName} {rank.lastName}: {rank.delay}mn
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Détails</h2>
      <ListGroup>
        {courses.map(course => (
          <ListGroup.Item>
            <p><b>{moment(course.start).format("D-MM-YY hh:mm")} à {moment(course.end).format("hh:mm")}</b></p>
            <ul>
              {course.students.map(student => {
                return (
                  <li>{students.find(s => s.ID === student.studentId).FIRSTNAME} {students.find(s => s.ID === student.studentId).LASTNAME}: {student.delay}mn</li>
                )
              })}
            </ul>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  )
}

export default App