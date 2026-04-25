import type { StudentStatus } from '../types/student'

interface Props {
  status: StudentStatus
}

export default function StatusBadge({ status }: Props) {
  const classNameMap = {
    중도포기: 'status status-gray',
    수료완료: 'status status-blue',
    수료중: 'status status-orange',
  }

  return <span className={classNameMap[status]}>{status}</span>
}
