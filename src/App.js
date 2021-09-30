import { useEffect, useState } from "react"
import moment from "moment"
import uniq from "lodash/uniq"
import first from "lodash/first"

import { Container, ListGroup, Spinner } from "react-bootstrap"
import { getCourses, getStudents } from "./api"
import 'bootstrap/dist/css/bootstrap.min.css'


const App = () => {
  console.log(first)

  const [loading, setLoading] = useState(true)
  const [ranking, setRanking] = useState([])
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    // getStudentsNames
    if (courses.length > 0) {
      fetchStudentNames()
    }
  }, [courses])

  useEffect(() => {
    if (students.length > 0) {
      doRanking()
    }
  }, [students])
  
  const fetchCourses = async () => {
    const response = await getCourses()
    setCourses(response)
  }

  const fetchStudentNames = async () => {
    let uniqueIds = courses.map(course => (
      course.students.map(s => s.studentId)
    )) || []

    uniqueIds = uniq(uniqueIds.flat())

    const response = await getStudents(uniqueIds)
    setStudents(response)
    setLoading(false)
  }

  const doRanking = () => {
    console.log(courses)
    const ranks = []
 
    courses.forEach(course => {
      course.students.forEach(s => {
        const existingRank = ranks.find(rank => rank.id === s.studentId)

        if (existingRank) {
          const newRank = {
            ...existingRank,
            delay: existingRank.delay + s.delay
          }

          const rankIndex = ranks.findIndex(r => r.id === existingRank.id)
          ranks[rankIndex] = newRank
        } else {
          ranks.push({
            id: s.studentId,
            delay: s.delay
          })
        }
      })
    })

    setRanking(ranks)
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

  if (courses.length > 0 && students.length > 0 && ranking.length > 0) {
    return (
      <Container className="mt-5 mb-5">
        <h2>🏆 Classement retards 🏆</h2>
        <ListGroup className="mb-5">
          {ranking.sort((a, b) => b.delay - a.delay).map((rank, i) => (
            <ListGroup.Item>
              <p>
                <b>
                  {i === 0 && `🥇`}
                  {i === 1 && `🥈`}
                  {i === 2 && `🥉`}
                  {i + 1}.
                </b>
                {` `}
                {students.find(s => s.ID === rank.id).FIRSTNAME} {students.find(s => s.ID === rank.id).LASTNAME}: {rank.delay}mn
              </p>
            </ListGroup.Item>
          ))}
        </ListGroup>
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
  } else {
    return null
  }
}

export default App