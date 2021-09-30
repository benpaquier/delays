import { Promise } from "bluebird"
import moment from "moment"

const { REACT_APP_EDUSIGN_TOKEN: edusignToken } = process.env

export const getCourses = async () => {
  const start = moment('2021-09-13T00:00:00.000').toISOString()
  const end = moment().add(1, "days").toISOString()

  let courses = []
  let page = 0
  let hasMorePages = true

  while (hasMorePages) {
    const request = await fetch(
      `https://ext.edusign.fr/v1/course?page=${page}&filters=locked&start=${start}&end=${end}`,
      {
        headers: {
          "Authorization": `Bearer ${edusignToken}`,
          "Content-Type": "application/json"
        }
      })
  
      const response = await request.json()
      courses = [...courses, ...response.result.filter(r => r.NAME === "DevWeb EE2")]
      page += 1
      hasMorePages = response.result.length === 40
  }

  return (
    courses.filter(course => (
      course.STUDENTS.filter(s => s.delay).length > 0
    ))
    .map(course => (
      {
        start: course.START,
        end: course.END,
        students: course.STUDENTS.filter(s => s.delay)
      }
    ))
  )
}

export const getStudents = async ids => {
  const students = []

  await Promise.mapSeries(ids, async id => {
    const request = await fetch(
      `https://ext.edusign.fr/v1/student/${id}`,
      {
        headers: {
          "Authorization": `Bearer ${edusignToken}`,
          "Content-Type": "application/json"
        }
      }
    )

    const response = await request.json()
    students.push(response)
  })

  return students.map(s => s.result)
}


