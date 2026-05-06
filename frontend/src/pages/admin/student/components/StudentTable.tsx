import StatusBadge from './StatusBadge'
import type { Student } from '../types/student'

interface Props {
  students: Student[]
}

export default function StudentTable({ students }: Props) {
  return (
    <div className="table-card">
      <table className="student-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>학번</th>
            <th>강의명</th>
            <th>연락처</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.studentNo}</td>
              <td>{student.courseName}</td>
              <td>{student.phone}</td>
              <td>
                <StatusBadge status={student.status} />
              </td>
              <td>
                <button className="detail-button">상세보기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
