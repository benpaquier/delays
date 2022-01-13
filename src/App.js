import { useEffect, useState } from "react"
import moment from "moment"


import { Container, ListGroup, Spinner } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import Reveal from "./components/Reveal"


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

  const calculateDuration = minutes => {
    if (minutes < 60) {
      return `${minutes} minutes`
    } else {
      const hours = Math.floor(minutes / 60)
      const rest = minutes % 60
      return `${hours} heure${hours > 1 ? 's' : ''} et ${rest} minutes`
    }
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

  // console.log(students)

  const colors = {
    1: "#ffb100",
    2: "#8d8d8d",
    3: "#be5000"
  }

  return (
    <Container className="mt-5 mb-5">
      <h2 className="mb-5">🏆 Classement retards 🏆</h2>
      <ListGroup className="mb-5">
        {ranks.map(rank => (
          <ListGroup.Item key={rank.lastName}>
            <p className="m-2">
              <b>
                {rank.rank === 1 && `🥇`}
                {rank.rank === 2 && `🥈`}
                {rank.rank === 3 && `🥉`}
                {rank.rank}
              </b>
              {` `}
              {rank.rank === 1 || rank.rank === 2 || rank.rank === 3 ? (
                <><Reveal color={colors[rank.rank]} value={`${rank.firstName} ${rank.lastName}`} />{calculateDuration(rank.delay)}</>
              ) : (
                <>
                  {rank.firstName} {rank.lastName}: {calculateDuration(rank.delay)}
                </>
              )}
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Détails</h2>
      <ListGroup>
        {courses.map(course => (
          <ListGroup.Item key={course.start}>
            <p className="mt-2 mb-0"><b>{moment(course.start).format("dddd DD MMM YYYY hh:mm")}</b></p>
            <p className="m-0 mb-2 fw-light"><i>de {moment(course.start).format("hh:mm")} à {moment(course.end).format("hh:mm")}</i></p>
            <ul className="mb-2">
              {course.students.map(student => {
                const firstName = ranks.find(r => r.rank === 1).firstName
                const studentFirstName = students.find(s => s.ID === student.studentId).FIRSTNAME

                const secondName = ranks.find(r => r.rank === 2).firstName
                const studentSecondName = students.find(s => s.ID === student.studentId).FIRSTNAME

                const thirdName = ranks.find(r => r.rank === 3).firstName
                const studentThirdName = students.find(s => s.ID === student.studentId).FIRSTNAME

                return (
                  <li key={student.studentId}>
                    {studentFirstName === firstName && `🥇`}
                    {studentSecondName === secondName && `🥈`}
                    {studentThirdName === thirdName && `🥉`}
                    {students.find(s => s.ID === student.studentId).FIRSTNAME} {students.find(s => s.ID === student.studentId).LASTNAME}: {student.delay}mn
                  </li>
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